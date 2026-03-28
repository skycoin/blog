+++
date = "2026-03-20"
tags = ["Development", "Skycoin", "Skywire"]
title = "Development Update — March 20"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skycoin: Newcoin Templates and Fibercoin Tooling

**`newcoin templates` subcommand** — the embedded code generation templates can now be printed to stdout with `skycoin newcoin templates`, so users can inspect, customize, and feed them back with `--template-dir`. The `--template-dir` flag, which was previously dead code, now actually works to override the embedded templates (#2821).

**fiber.toml defaults** — noisy peer connection log messages were suppressed, and `fiber.toml` default values were updated to be more useful out of the box.

**CI tests** — integration tests were added for the newcoin workflow to catch regressions in template generation.

**Windows release fix** — the Windows installer was expecting a separate `skyhw.exe` binary that no longer exists (hardware wallet tools are now part of the unified binary). Fixed to match the new binary layout (#2822).

**Node.js 24** — GitHub Actions were updated to force Node.js 24 execution, and action versions were bumped to Node.js 24-compatible releases (#2824).

### Skywire: Route Multiplexing

The route multiplexing work landed today — one of the most significant architectural changes to Skywire's transport layer.

**Accept loop crash fix** — the accept loop in `serveRouteGroup` would permanently die when encountering a stale route with a missing transport, preventing all new connections. Fixed to distinguish fatal errors from per-route errors (#2230).

**Mux layer extraction** — all multiplexing state (sequencing, reordering, SACK, transport selection) was extracted from `RouteGroup` into a new `routeMux` type. The mux is lazy-initialized only when mux capability is negotiated — zero overhead for non-mux connections (#2231).

**RouteGroup RPC fixes** — `routing.Rule` (raw `[]byte`) was causing gob serialization failures over RPC. Replaced with structured fields. Added panic recovery and length guards to prevent crashes from concurrent GC corruption (#2232).

**Ping route bypass** — latency probe routes were flooding the accept queue, blocking application routes for up to 30 seconds. They now bypass the accept queue entirely and are handled in dedicated goroutines with a 10-second timeout (#2233, #2234).

**Embedded route setup timeout** — `CreateRouteGroup` in the embedded transport setup had no context timeout, causing proxy connections to hang indefinitely when the remote visor was unreachable. A 30-second timeout was added. Route keepalive and setup timeouts were also increased for high-load visors: keepalive to 2 minutes, GC interval to 10 seconds, handshake timeout to 30 seconds (#2227).

**TPD bandwidth storage fix** — the Transport Discovery was storing bandwidth as a single total instead of tracking sent/recv separately per edge. Fixed to track both directions independently, which is needed for accurate bandwidth-based reward calculations (#2227).

**Reward system UI** — the reward system interface was updated with new navigation and layout (#2227).

### DMSG: Server Fallback and 32 Bug Fixes

A landmark day for DMSG reliability:

**Server fallback** — `DialStream` was returning on the first server failure without trying alternatives. Now both existing-session and new-session phases fall through to the next server. Additionally, `FallbackRoundTripper` was consuming the request body on the first attempt, causing subsequent retries to send empty bodies — fixed by buffering the body upfront (#347).

**32 bug fixes in one PR** — a comprehensive audit found and fixed 32 bugs across the DMSG codebase:
- **Noise protocol**: replay attack vulnerability (nonces never recorded), TCP connection leaks, listener connection leaks, handshake goroutine leaks
- **Discovery client**: entry copy corruption, error variable shadowing, HTTP connection leak
- **dmsgcurl**: response body leak, division by zero, retry logic bug
- **dmsgpty**: data races on global state, zombie processes (Unix), ConPty handle leak (Windows), WebSocket data discard
- **dmsgctrl**: concurrent write corruption, data race in Close/Err
- **DMSG Discovery server**: inverted nil check, response body leak, nil dereference on hostname input
- **DMSG Server**: deadlock from unbuffered error channel, listener close race, data race in metrics

**Comprehensive tests** — test coverage was added across the DMSG packages (#348).

This was the single biggest reliability improvement to the DMSG library in its history. Many of these bugs were latent — they'd only trigger under specific timing conditions or error paths — but collectively they made the network fragile under load. Fixing them makes DMSG substantially more reliable for production use.
