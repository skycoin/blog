+++
date = "2026-04-09"
tags = ["Development", "Skywire"]
title = "Development Update — April 9"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Route Setup Integrated Into DMSG Server

One of the most significant architectural changes this week: **route setup-node is now integrated directly into the DMSG server** (#6698ccf4).

**Before** — route setup was a standalone service (`skywire svc sn`) that visors connected to via DMSG to request route setup. Every setup operation required the visor's DMSG client to establish a separate stream to the setup node, which in turn might have needed its own stream to reach the destination visor. This created ephemeral port exhaustion issues under load.

**After** — the DMSG server's existing direct client now serves three endpoints:
- `/health` on port 80 (DMSG HTTP) — service health + build info
- `/debug/pprof` on port 81 (DMSG debug) — profiling (unchanged)
- **Route setup-node on port 36 (DMSG RPC) — route setup for visors**

The setup-node uses the server's own DMSG client, which connects through itself. For visors on the same server, route setup is **local** (no forwarding at all). For visors on different servers, the server-to-server mesh (added March 30) handles forwarding transparently.

**Why this matters** — it eliminates the need for standalone route setup-nodes entirely, and removes the ephemeral port exhaustion issue since the server's own sessions are used instead of separate DMSG client connections. One less service to deploy, one less source of port leaks.

`enable_route_setup` config flag was added, along with `/health` tests and E2E integration (#788415546).

### Skywire: Port Leak Fixes

**`dde9b113d` Fix `CopyReadWriteCloser` residual leak on dmsg servers** — the last remaining goroutine leak in the DMSG server bridging logic. When both sides of a bridge closed simultaneously, one of the goroutines could miss the close signal and leak. Fixed.

**`2da0405cf` Fix ephemeral port leak on session death** — when a DMSG session died unexpectedly, the ephemeral TCP port could remain reserved until the kernel's TIME_WAIT expired (typically 60 seconds). Fixed by explicitly closing the underlying connection on session cleanup.

**`b25c29207` Fix embedded route setup goroutine leak: acquire semaphore before spawn** — the embedded route setup logic was spawning goroutines before acquiring the concurrency semaphore, so in the common case the semaphore acquisition would succeed quickly, but in the slow case (semaphore contended) the goroutine was already running and holding resources while waiting. Fixed by acquiring the semaphore first, then spawning.

**`4ee0a1efd` Reduce embedded route setup concurrency from 50 to 20** — the previous concurrency limit was too high for the available ephemeral port range, causing port exhaustion under load.

**`12d63d4ba` Reduce route setup dial timeout from 30s to 10s** — faster failure cycling means ports are freed faster.

**`977cd14a4` Limit DialStream to 2 servers per phase** — instead of trying all N configured servers in sequence (holding ports for each), try only the 2 most likely servers per phase. This caps the worst-case port usage per dial attempt.

**`c3ae63eef` Reduce HandshakeTimeout from 20s to 5s** — frees resources 4× faster. Most legitimate handshakes complete in under 1 second, so a 5-second timeout is more than sufficient.

### Skywire: New Reward CLI Commands

**`skywire cli visor reward`** (#6d9f86afe) — a new command that shows reward history for a visor:

```
skywire cli visor reward              # local visor, 7 days
skywire cli visor reward -d 30        # 30 day history
skywire cli visor reward -k <pk>      # specific visor
skywire cli visor reward -j           # JSON output
```

**`--all` flag for reward CLI** (#6431ad6e) — shows rewards for all connected visors at once. Combined with `skywire cli dmsg pty list` to see which visors are connected, operators can now inspect the reward status of an entire deployment from a single command.

**Reward CLI no-args fix** (#d0cf66b4) — running `skywire cli reward` with no arguments now shows the current address instead of attempting to set the genesis address. The previous behavior was a footgun where operators would run the command to check their setting and accidentally overwrite it.

**Rewards tab in node detail page** (#cd55f21d) — the hypervisor UI now has a "Rewards" tab on `/nodes/:pk` showing reward history for that visor.

**Reward detail page** (#246eb3e8) — new page at `/nodes/:pk/rewards` with full reward history, daily breakdown, and payment status.

### Skywire: Config Refinements

**Periodic config refresh for dynamic key sets** (#1bb9c020) — the reward system can now refresh the whitelisted key set periodically without restart. This enables adding/removing reward-eligible visors from a central list without cycling the reward server.

**`ef2e61db0` Separate `user_*` fields for route_setup/transport_setup/survey_whitelist** — previously these three whitelists shared the same user field. Separated so each can have independent user lists.

**`e6b2aa61d` Unhardcode GeoIP URL** — added to `services-config.json` so it can be overridden per-deployment like the other service URLs.

**`19a4e9baa` Standardize reward server `/health`** — matches the format used by other services for consistency.

**`977cd14a4` Integrate route setup-node and /health into DMSG server** (already covered above).

### Skywire: UI Polish and Docker Push

**`af067398f` Clean rebuild UI to remove stale build artifacts** — a periodic maintenance step.

**`38fef7e2b` Fix TypeError: initialize `dataSource` to empty array** — a frontend crash on the reward detail page when the response was empty.

**`172d175c3` Add Docker image push to release workflow** — Skywire Docker images are now published automatically on each release.

### The Week's Narrative Arc

Looking back at March 29 through April 9:

- **LAN DMSG server** (March 28–30) — zero-config local optimization
- **DMSG server-to-server mesh** (March 30) — scaling beyond single-server limits
- **Bounded NonceWindow** (March 30) — constant-memory replay protection
- **DialStream optimizations** (March 31) — route caching, latency sorting, entry caching
- **Route calc OOM fix** (April 1) — iterative DFS with depth limit
- **SKYDEPLOY override** (April 3) — private network support
- **pprof over DMSG** (April 3) — remote profiling through the encrypted overlay
- **Regional saturation scaling** (April 4) — economic incentive fix for geographic distribution
- **DMSG merge into Skywire** (April 8) — structural cleanup eliminating the vendor ping-pong
- **Route setup in DMSG server** (April 9) — collapsing an entire service category into the server
- **Port leak hunt** (April 7–9) — three separate goroutine/port leaks eliminated, thousands of leaked goroutines per day reclaimed

The thread connecting all of this: **resource discipline**. Memory bounds, port budgets, goroutine lifetimes, network fan-out, geographic concentration. Skywire is moving from "works under ideal conditions" to "works under real-world load," and that transition is happening one leak at a time.
