+++
date = "2026-04-09"
tags = ["Skywire", "DMSG"]
title = "The Great DMSG Bug Hunt"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### How We Discovered and Fixed Thousands of Leaked Goroutines Per Day

For most of its existence, DMSG "worked." Clients connected, streams opened, frames flowed, servers relayed traffic. But under real production load over long periods, something was quietly going wrong — goroutines accumulated, ephemeral ports stayed reserved past their natural lifetime, memory grew, and servers eventually needed to be restarted to clear the cruft.

Over the past three weeks, a systematic audit found and fixed **thirty-two distinct bugs** in the DMSG codebase, ranging from tiny off-by-one errors to fundamental resource management failures that were leaking tens of thousands of goroutines per day on production servers. This is a narrative account of that hunt: what was broken, how it was found, and what the pattern of the bugs reveals about the codebase.

---

### Day One: 32 Bugs in One PR

On March 20, a PR landed in the DMSG repo with a simple title — "Fix multiple bugs in core dmsg server/client and CI lint error." The commit message was less simple. Thirty-two bugs, organized by subsystem, each one a few lines to a few dozen lines of fix but with implications that ranged from "minor log spam" to "security vulnerability."

The most serious findings from that first pass:

**Replay attack vulnerability in noise protocol** — `DecryptWithNonceMap` was never actually recording used nonces in the map. The function was supposed to track received nonces and reject duplicates (replay protection), but a bug meant the map was always empty after the function returned. An attacker replaying captured ciphertexts would have them accepted as fresh messages. In a protocol where frame ordering matters for session state, this could have been used to confuse the state machine or re-execute privileged operations.

**TCP connection leaks in noise establishment** — if a noise handshake failed after the TCP connection was established but before the handshake completed, the TCP connection was abandoned without being closed. On a busy listener, failed handshakes from port scanners or probing clients would accumulate file descriptors indefinitely.

**Listener.Accept leaking connections on handshake failure** — same pattern, different location. A failed handshake in the accept path left the underlying connection open.

**Goroutine leaks in handshake timeout** — handshake timeout goroutines weren't setting read deadlines, so they couldn't unblock a stuck read. The goroutines would wait forever for the read to return an error.

**Panic on DH crypto errors** — the DH function in the noise layer silently returned a zero key on error instead of propagating the failure. A zero key would then be used for encryption, producing decryptable ciphertext. This was worse than a crash because it corrupted state silently.

And many more in the DMSG Discovery client (entry corruption on failure, wrong error variable in `PutEntry`, response body leak), dmsgcurl (response body leak on max size error, division by zero in the progress writer when `Content-Length` was unknown, retry logic that did zero iterations for `-t 0`), dmsgpty (data races on global whitelist state, zombie processes on Unix, ConPty handle leaks on Windows, WebSocket data discard, infinite keep-alive loops), dmsgctrl (concurrent write corruption, data race in Close/Err), and the DMSG Discovery server (inverted nil check, body leak, nil dereference on hostname input, wrong error wrapping).

Most of these were **latent bugs** — they only triggered under specific timing conditions or error paths that weren't exercised during normal testing. Each individual bug was small. The cumulative effect was a codebase that worked fine in development and on small test networks but became increasingly unstable as production load and uptime increased.

### The Accept Loop Pattern

Before day one, a related fix had already landed: **accept loops were dying permanently on transient errors**. This was found in the `dmsgctrl` `ServeListener` and in both smux and yamux stream accept loops in the DMSG server. The pattern was:

```go
for {
    stream, err := accept()
    if err != nil {
        log.Error("accept failed: %v", err)
        return // ← this kills the accept loop forever
    }
    go handle(stream)
}
```

A single non-fatal error — a malformed handshake, a client that disconnected mid-stream, anything transient — would return from the accept loop, and the goroutine would exit. The listener remained open at the kernel level but never called `accept()` again. From the outside, the server appeared to be running; from the inside, it had stopped accepting new connections entirely.

The fix is straightforward once you see the pattern: distinguish fatal errors (context canceled, listener closed) from per-stream errors, and on per-stream errors log a warning and continue the loop:

```go
for {
    stream, err := accept()
    if err != nil {
        if ctx.Err() != nil {
            return // actually shutting down
        }
        log.Warn("accept failed: %v", err)
        continue // try again
    }
    go handle(stream)
}
```

The same pattern was found and fixed in seven more places across Skywire: STCPR transport accept, VPN server, sky ping, sky forwarding, latency probe, raw TCP forwarding, and the app proc manager. Each one was a single-goroutine listener that could be killed by one bad connection.

### Finding Bugs by Process of Elimination

After the first pass of fixes on March 20, production servers still showed steady goroutine growth. The monitoring on one production DMSG server showed goroutine count climbing to over **55,000** during a long-running deployment. `pprof` was added to DMSG services on March 23 specifically to characterize where the leaked goroutines lived.

The pprof output was revealing. Stack traces for the vast majority of stuck goroutines all pointed to two places:

1. `CopyReadWriteCloser.Copy` → `io.Copy` → `Read` (blocked)
2. `forwardRequest` → `readObject` (blocked)

### The 55K Bridged Streams Leak

The first signature — `io.Copy` blocked in `CopyReadWriteCloser` — came from **bridged streams**. When a client opens a stream to another client through a DMSG server, the server creates a bridge: two half-duplex copies, one in each direction, running as goroutines.

```go
go io.Copy(streamA, streamB) // A → B
go io.Copy(streamB, streamA) // B → A
```

If either side of the bridge cleanly closes its end, the `Read` on that side returns `io.EOF`, `io.Copy` returns, and the goroutine exits. But if a side disconnects abruptly without a clean close — a network partition, a `SIGKILL`ed process, a power loss — the `Read` blocks forever. TCP's half-closed state keeps the connection open from the server's perspective until the OS eventually times out, which on Linux is typically 2 hours by default for `tcp_keepalive_time`.

Over the course of a day on a busy server, dead peers accumulated. Each dead peer left two stuck goroutines, one on each side of the bridge. 55,000 stuck goroutines means ~27,500 dead bridges, which is entirely plausible for a server handling thousands of streams per hour over a 24-hour period.

**The fix** (#372) — add an idle timeout wrapper:

```go
type idleTimeoutConn struct {
    net.Conn
    timeout time.Duration
}

func (c *idleTimeoutConn) Read(p []byte) (int, error) {
    c.SetReadDeadline(time.Now().Add(c.timeout))
    return c.Conn.Read(p)
}

func (c *idleTimeoutConn) Write(p []byte) (int, error) {
    c.SetWriteDeadline(time.Now().Add(c.timeout))
    return c.Conn.Write(p)
}
```

Each read and write resets the deadline. Active streams are unaffected because they keep resetting the clock. Dead streams time out after 5 minutes of inactivity, the blocked `Read` returns with a timeout error, `io.Copy` unblocks, the bridge closes, and the goroutines exit.

The 5-minute timeout was chosen carefully. Too short and legitimate idle connections (think of an SSH session with no typing) get killed. Too long and dead connections accumulate faster than they're cleaned up. Five minutes is longer than typical TCP keepalive, shorter than the OS-level half-closed cleanup, and outlives all but the most pathologically slow human interactions.

### The 2.4K forwardRequest Leak

The second signature — `forwardRequest` blocked in `readObject` — was subtler. The bridge idle timeout fix (#372) only covered the bidirectional copy phase. But before the bridge exists, there's a handshake phase: the server's `forwardRequest` opens a stream to the destination and reads the response.

```go
// Open stream to destination
destStream, err := destClient.DialStream(ctx, remoteAddr)
if err != nil {
    return err
}

// Read the response — can block forever
resp, err := readObject(destStream)
if err != nil {
    return err
}
```

If the destination accepted the stream but never sent a response, `readObject` blocked forever. No timeout. The server was observing **2,400+ stuck goroutines per server, growing rapidly after restart**. The rapid post-restart growth was the giveaway — whatever was causing this was happening on essentially every connection attempt.

**The fix** (#26d1d6e) — add `HandshakeTimeout` to the `forwardRequest` handshake read:

```go
destStream.SetReadDeadline(time.Now().Add(HandshakeTimeout))
defer destStream.SetReadDeadline(time.Time{}) // clear deadline before bridge phase
resp, err := readObject(destStream)
```

The deadline is set before the read and cleared after — the long-lived bridge phase that follows handshake is still subject to the idle timeout from the previous fix, not the handshake timeout, so legitimate long-running streams work correctly.

### The Ephemeral Port Leak

The third resource leak wasn't goroutines but **ephemeral ports**. Linux reserves ports in the range 49152–65535 for outgoing connections (~16K total). When a DMSG client attempts to dial a server, it consumes an ephemeral port for the outgoing TCP connection.

`ClientSession.DialStream` didn't accept a context. When the caller's deadline expired, the blocked `readResponse` kept the ephemeral port reserved until `HandshakeTimeout` fired (20–30 seconds per server). With 6 servers tried sequentially during fallback, a single failed dial could hold up to 6 ports for minutes.

The Porter (a specific production DMSG server) was hitting "ephemeral port space exhausted" errors. Any new stream attempting to dial would fail to even get a local port because all 16,000+ ports were reserved by stuck handshakes.

**The fix** (#373) — make `DialStream` context-aware:

```go
func (cs *ClientSession) DialStream(ctx context.Context, addr Addr) (*Stream, error) {
    stream, err := cs.dial()
    if err != nil {
        return nil, err
    }

    // Spawn a watcher goroutine that closes the stream when context is cancelled
    done := make(chan struct{})
    go func() {
        select {
        case <-ctx.Done():
            stream.Close() // interrupts any blocked read/write
        case <-done:
        }
    }()
    defer close(done)

    resp, err := stream.readResponse()
    ...
}
```

When the caller's context is cancelled (e.g., by the 10-second timeout in the dialing code), the watcher goroutine closes the stream, which interrupts the blocked `readResponse` and returns the ephemeral port immediately.

### The Unbounded NonceMap

Separate from the goroutine and port leaks was a memory leak in the noise layer. `NonceMap` (`map[uint64]struct{}`) stored one entry per decrypted message for replay protection. It grew forever on long-lived sessions, accumulating MB of memory per session.

The setup-node was the worst case — it handled thousands of streams and maintained sessions for days or weeks. Its NonceMap would grow to hundreds of MB of nothing but used-nonce records.

**The fix** (#357) — replace with `NonceWindow`, a sliding window using a 1024-bit bitmap (128 bytes). The window tracks the highest nonce seen and the last 1024 nonces for out-of-order replay detection. Memory usage is constant regardless of session lifetime.

The trick is that nonces on reliable transports arrive mostly in order. You don't need to remember every nonce ever used — you need to remember the last few so you can catch out-of-order duplicates within the reordering window, and reject anything older than that as a replay. A 1024-entry window is more than sufficient for the reordering that yamux/smux can produce.

### The Session Ping Log Spam

Not a bug exactly, but a performance issue found during the pprof hunt: **the session ping loop was generating excessive debug logs**. The loop measured latency to DMSG servers for server selection (not for keepalive — yamux handles that). At 30-second intervals with many clients and many servers, this produced hundreds of debug log lines per second on busy servers.

**The fix** (#371) — reduce the ping interval from 30 seconds to 5 minutes, and lower the log level from Debug to Trace. Latencies don't change that fast. 5 minutes is still responsive enough for routing decisions, and Trace-level logging is suppressed by default.

### The Cumulative Picture

Over about three weeks of work:

- **Day 1 audit** (March 20): 32 latent bugs across the DMSG codebase
- **Accept loop pattern** (March 16, March 17): fixed in DMSG and in seven Skywire components
- **Server CPU exhaustion** (March 26): per-session stream concurrency limit (2048), accept loop backoff, handshake read deadline
- **Idle stream timeout** (March 27): 2-minute idle timeout on completed-but-unread streams to prevent ephemeral port exhaustion
- **Ephemeral keypair pool** (March 25): pre-generate secp256k1 keypairs so noise handshakes don't block on EC key generation
- **Bridged streams leak** (April 7): 55K+ stuck goroutines, fixed with idle timeout wrapper on bridge reads
- **forwardRequest leak** (April 7): 2.4K+ stuck goroutines, fixed with handshake timeout
- **Ephemeral port leak** (April 7): context-aware `DialStream` closes streams when context cancels
- **Idle timeout Read override fix** (April 8): the idle timeout was being overridden by subsequent reads
- **Force-close in `ForceReadDeadline`** (April 8): deadline-based cleanup wasn't aggressive enough in edge cases
- **DialStream fallback race** (April 8): fallback was using canceled context

### What the Pattern Reveals

Looking at the full list, a few themes emerge:

**Most of the bugs were in error paths and cleanup.** The happy path worked fine. The bugs only manifested when something went wrong — a peer disconnected abruptly, a handshake failed, a timeout fired, a context was cancelled. Production stress exposed the error paths; unit tests rarely did, because writing tests that deliberately break things at specific moments is hard and nobody had written them.

**Many bugs were about lifetime ownership.** Who owns the goroutine? Who closes the stream? Who frees the port? When no single component has clear responsibility for cleanup, the cleanup either doesn't happen at all or happens multiple times. The fixes frequently added explicit ownership — a watcher goroutine that closes a stream, a wrapper connection that enforces its own deadlines, a concurrency semaphore that bounds spawned goroutines.

**Go's lack of structured concurrency cost us.** Modern concurrency frameworks (Trio in Python, Kotlin coroutines, the proposed Go `nursery` pattern) make it very difficult to spawn a goroutine without an owner, because the spawn happens inside a scope that's responsible for awaiting the spawned work. Go's bare `go` keyword has no such discipline — you can spawn a goroutine and then forget about it, and if nobody else remembers it either, it lives forever. Every goroutine leak in the DMSG codebase is an instance of "someone spawned a goroutine and then code changes over the years broke the invariant that kept it alive." Structured concurrency would have caught most of these at compile time.

**Timeouts are load-bearing.** Every fix had a timeout in it somewhere. The idle timeout on bridges. The handshake timeout on forwardRequest. The context timeout on DialStream. The 5-second shutdown timeout on discovery deletion. The 10-second ping timeout. The 5-minute session ping interval. A distributed system without carefully-chosen timeouts is a distributed system that eventually deadlocks or leaks resources. DMSG had timeouts in some places but not others; the fixes were largely about adding them in the missing places.

**pprof is essential for production debugging.** Without `/debug/pprof` available on running services, these leaks would have been much harder to characterize. The pprof goroutine dump with full stack traces pointed directly at the leaking functions. Before pprof was added to DMSG services on March 23, the leaks were visible in aggregate metrics (goroutine count, memory growth) but not attributable to specific code paths. After pprof, the fix path for each leak was clear within minutes of capturing a profile.

---

### Where Things Stand

Production DMSG servers now run for much longer without goroutine accumulation. Goroutine count on a steady-state production server is typically in the low thousands and fluctuates around a mean instead of growing monotonically. Memory usage is stable. Ephemeral port consumption is bounded by real connection count, not by leaked half-open streams.

The DMSG codebase is meaningfully more reliable than it was a month ago. Not perfect — there are probably still latent bugs waiting for the right combination of conditions — but the major categories of resource leaks have been characterized, fixed, and covered by tests. The accept loop crash pattern is eliminated. The goroutine lifetime patterns have explicit ownership. The timeouts cover every blocking operation on external state.

Three weeks ago, operators restarted DMSG servers weekly to keep things responsive. Today, they run until a release update forces a restart. That's the measure of the work: not a feature, not a benchmark improvement, just a codebase that doesn't quietly accumulate garbage while you're not looking.

See also: [Guide: DMSG — The Encrypted Overlay Network](/posts/guide-dmsg-deployment/) | [DMSG Server Mesh and the End of the Standalone Setup-Node](/posts/dmsg-server-mesh-and-route-setup/) | [The Evolution of the Skywire Codebase](/posts/skywire-codebase-evolution/)
