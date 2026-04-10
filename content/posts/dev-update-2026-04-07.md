+++
date = "2026-04-07"
tags = ["Development", "Skywire", "DMSG"]
title = "Development Update — April 7"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### DMSG: Two More Server Goroutine Leaks

The DMSG server goroutine hunt continued — **two more leaks found and fixed**, both involving the server's forwarding logic.

**Bridged streams idle timeout** (#372) — bridged streams (bidirectional copy between two clients through the server) were blocking forever on `io.Copy Read` when one side disconnected without cleanly closing the connection. This caused goroutines to accumulate — **observed as 55,000+ stuck goroutines in production**.

The fix added an `idleTimeoutConn` wrapper that resets a per-operation deadline on each Read/Write. If no data flows for 5 minutes, the deadline fires, `io.Copy` returns an error, `CopyReadWriteCloser` closes both streams, and the goroutine exits. The timeout resets on each successful read/write, so active streams are unaffected — only truly idle/dead streams are cleaned up.

**forwardRequest handshake timeout** (#26d1d6e) — the previous fix only covered the bridge phase. This fix covers the handshake phase: `forwardRequest` opens a stream to the destination and reads the response. If the destination accepts but never responds, `readObject` blocks forever — **observed as 2,400+ stuck goroutines per server, growing rapidly after restart**.

Added `HandshakeTimeout` to the `forwardRequest` handshake read, matching the client-side behavior.

**Ephemeral port leak: context-aware DialStream** (#373) — `ClientSession.DialStream` didn't accept a context, so when the caller's deadline expired, the blocked `readResponse` kept the ephemeral port reserved until `HandshakeTimeout` fired (20-30 seconds per server). With 6 servers tried sequentially, a single failed dial could hold ports for minutes.

Fixed by having `DialStream` accept a context and spawn a goroutine that closes the stream when the context is cancelled, immediately interrupting any blocked read/write and freeing the ephemeral port. `Client.DialStream` now passes the context to all `ClientSession.DialStream` calls.

The cumulative picture: DMSG had three separate goroutine/port leaks in the server, all triggered by dead or unresponsive clients. All three are now fixed, and each fix independently reduces goroutine count on production servers by thousands.

### Skywire: DMSG Vendor and Access Control

**Vendor dmsg `e26b2982`** (#2284) — pulls in the ephemeral port fix, plus a `picomatch` security bump.

**Access control for DMSG gRPC listener** (#2285) — the DMSG gRPC listener added on April 2 needed access control. PKs in `survey_whitelist`, hypervisors, and `dmsgpty_whitelist` can now access the gRPC endpoints; all other PKs are rejected at the handshake stage.

**E2E DMSG tests** — fixed to use the deployment config discovery URL instead of hardcoded localhost.

**Dependency bumps** — `@hono/node-server` in the manager UI.
