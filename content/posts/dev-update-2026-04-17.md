+++
date = "2026-04-17"
tags = ["Development", "Skywire"]
title = "Development Update — April 17"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Network Stability — Skynet, Transport-Level Ping, Website Hosting

PR #2317 is another massive change touching nearly every subsystem. The theme: making Skywire a practical platform for hosting and accessing services.

#### Skynet Port Forwarding

The forwarded port system was built from the ground up:

**Rich metadata model** — `ForwardedPort` replaces the simple `map[int]bool` with per-port metadata: label, description, show-on-landing toggle, skynet/DMSG forwarding toggles, PK whitelist, and proxy address. Data persists to `local/forwarded_ports.json` across restarts.

**Landing page** — DMSG/skynet port 80 now shows a landing page with links to forwarded ports that have `show_on_landing` enabled, displaying their labels and descriptions. This turns every visor into a miniature service catalog.

**CLI management** — `skywire cli skynet port add/rm/ls` with `--label`, `--desc`, `--skynet`, `--dmsg`, `--landing`, `--whitelist` flags. Full control over which ports are exposed over which transport and to whom.

**Three-tier access control on port 80:**
- `/health`, `/ping`, `/services` — open to everyone
- `/node-info`, `/visor.log`, `/debug/pprof` — survey whitelist only
- Website catch-all — forwarded port PK whitelist

#### Skynet HTTP Bridge and Connection Pooling

The skynet HTTP bridge went through several iterations:

1. **Initial**: per-request `DialSkynet` + manual HTTP piping — failed with "noise route group already being initialized" on concurrent requests
2. **`httputil.ReverseProxy`**: proper HTTP keep-alive connection pooling — multiple concurrent requests reuse a single skynet route
3. **Route lifetime tuning**: `DefaultRouteKeepAlive` went from 2 minutes -> 30 minutes -> 0 (infinite) -> 24 hours. Routes now persist until explicitly closed or 24 hours of total inactivity.

**Self-dial shortcut** — when skynet resolves a request to the local visor's own PK, it connects directly to localhost instead of going through the routing mesh. This prevents route descriptor conflicts when accessing multiple ports on the same visor.

#### Resolving Proxies

**`skywire cli visor proxies upstream <dmsg|skynet> <addr>`** — set the upstream SOCKS5 proxy at runtime. This enables the browser proxy chain: browser -> dmsgweb (.dmsg) -> skynetweb (.skynet) -> skysocks (all traffic).

**Hypervisor UI proxy controls** — proxy settings dialog with enable/disable toggle and upstream SOCKS5 configuration. Accessible from the visor actions menu.

**Auto-chain** — `proxies set dmsg on` also starts skynetweb and sets dmsgweb's upstream to skynetweb's SOCKS5 port. A single browser entry (localhost:4445) covers both .dmsg and .skynet domains.

#### Transport-Level Ping

**Eliminates RSN from latency measurement entirely.** New `TransportPingPacket`/`TransportPongPacket` (types 8/9) as transport-level frames on route ID 0. `ManagedTransport.pingLoop` sends pings every 30 seconds, `readLoop` intercepts pongs and computes RTT without involving the router or route setup node.

**Before** — every autoconnect transport creation triggered a full RSN route setup just to measure latency. This was approximately 90% of RSN load.

**After** — latency is measured at the transport layer, freeing the RSN to handle actual route setup requests. A 90-second grace period falls back to RSN-based measurement for backward compatibility with old visors.

Also fixes: porter ephemeral port leak (unconditional delete), RSN connection pool deadlines (per-RPC instead of absolute).

#### Website Hosting on Visor

**Reward system integration** — `RewardsConfig` in visor config enables hosting the reward system UI on port 80 with shared PK identity. `ConfigureAndBuild()` returns the reward system as an `http.Handler` that the visor mounts. The reward system's `/health` is accessible at both `/health` and `/health/health` (visor's `/health` takes priority).

**`skywire cli util serve`** — simple HTTP file server for use with port forwarding. Serves a directory on localhost. Point `--proxy-addr` at it to host over skynet/DMSG.

**`skywire cli skynet curl`** — HTTP requests over skynet routes. URL format: `skynet://<pk>:<port>/path`. Supports GET and POST (`-d` flag), output to file (`-o`).

#### Route Setup Node Improvements

**RSN connection pool** — keeps open RPC connections to remote visors between route setup requests. Previously, every route setup dialed fresh DMSG connections (full noise handshake per stream). The top 3 destinations had 100K+ redundant handshakes. Pooled connections evict after 5 minutes idle.

**Setup concurrency bounded** — 512-slot semaphore for standalone RSN, 128-slot for embedded. Prevents ephemeral port exhaustion.

**DMSG session health** — `pingSessionsLoop` now runs every 60s (was 1h). Sessions closed after 2 consecutive ping failures. Discovery entry update debounce reduced from 5s to 1s.

#### Stale Entry Cleanup

**DMSG discovery: `RemoveStaleClientEntries`** — scans the Redis "clients" set every 10 seconds, removes members whose keys expired. This fixed approximately 5,000 stale DMSG client entries persisting from over a year ago.

#### CI Improvements

**Container startup staging** — on dual-core GitHub Actions runners, starting all containers simultaneously caused Go services to compete for CPU during initialization. Services now start in dependency-ordered stages.

**Flaky test fixes** — replaced hardcoded `time.Sleep` with `require.Eventually` polling on readiness conditions. `TestSessionReconnect`, `TestLookupIP`, `TestDownload` all stabilized.
