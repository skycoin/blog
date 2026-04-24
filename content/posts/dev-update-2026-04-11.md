+++
date = "2026-04-11"
tags = ["Development", "Skywire"]
title = "Development Update — April 11"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Unified Service Mode (pkg/svcmode)

Every deployment service (transport discovery, service discovery, route finder, address resolver, config bootstrapper, uptime tracker) previously had its own copy of HTTP + DMSG listener setup code — a pattern that had diverged across services over months of independent fixes. Today that was replaced with `pkg/svcmode`: a single shared helper that handles both HTTP and DMSG HTTP listening, health endpoints, and graceful shutdown for all services.

**`7d05ecc74` Add pkg/svcmode** — the core helper: takes a config struct (listen address, DMSG keys, mode flag) and returns ready-to-use HTTP and DMSG HTTP servers. Handles the DMSG client lifecycle, discovery registration, and the common `/health` endpoint pattern.

**`09ad5d418` through `5a90e51ab`** — all six deployment services migrated: route-finder, service-discovery, config-bootstrapper, transport-discovery, address-resolver, uptime-tracker. Each service's `main()` shrunk by 50-100 lines.

**`d7aa8a99c` dmsg-discovery: add `--mode` flag** — dmsg-discovery gets the same mode control (`http`, `dual`) but rejects `dmsg-only` mode because DMSG discovery is a bootstrap dependency — it must be reachable via HTTP for initial DMSG client setup.

### Skywire: Service Entry TTL Fixes

A cluster of related fixes ensuring that stale entries are cleaned up consistently across all discovery services:

**`97a571462` TPD: widen default entry TTL from 2m to 5m** — transport entries were expiring between heartbeats. 5 minutes gives comfortable headroom over the 90-second re-registration interval.

**`6e35d1f00` AR: apply TTL to bindings unconditionally (default 5m)** — address resolver bindings (STCPR/SUDPH address mappings) now have TTL enforcement. Previously, bindings could persist indefinitely after a visor went offline.

**`aeff34ba2` SD: apply TTL to client entries unconditionally (default 5m)** — service discovery entries (VPN, proxy, public visor) now TTL like transport entries.

**`534dad74a` Restore client entry TTL at dmsg-discovery (default 60m)** — DMSG client entries get a longer TTL because DMSG sessions persist for hours and the re-announce interval is 30 minutes.

### Skywire: DMSG Resilience Overhaul

A major push to make DMSG connections survive real-world conditions:

**`9cf4a93ff` DialStream: race phase 1 and phase 2 sessions in parallel** — previously, DialStream tried existing sessions (phase 1) sequentially, then new sessions (phase 2) sequentially. Now both phases race in parallel, with phase 1 getting a 2-second head start. This cuts worst-case dial latency dramatically when the first server in the list is slow or dead.

**`9aabe9dc1` DialStream: per-(dst, server) negative cache with 30s TTL** — when a dial attempt to a specific (destination, server) pair fails, that pair is cached as "known bad" for 30 seconds. Subsequent dials skip it immediately instead of waiting for another timeout.

**`b8fca433c` RSN: per-destination circuit breaker** — route setup failures to a specific destination now trip a circuit breaker that prevents repeated attempts for 60 seconds. This stops the cascade where one unreachable visor causes timeout storms across the entire route setup node.

**`ab3ba6bf2` Fix DialStream post-return ctx-cancel watcher race** — a subtle bug where the context-cancel goroutine could fire after DialStream had already returned, closing the stream that the caller was about to use.

**`92ed58a84` dmsg: ClientSession.serve must not kill sessions on stream-handshake errors** — a single failed stream handshake (e.g., port not listening) was tearing down the entire yamux session, killing all other streams on that session. Now only the individual stream is closed.

**`01dd443c5` dmsg: replace parallel phase-dial with sequential + fix session race** — parallel phase-dial was causing duplicate sessions to the same server, with one being immediately discarded. Sequential dial with early-exit on first success.

**`48052ea10` AR: bound SUDPH handshake queue + tighten timeout + fix Accept Fatal** — the address resolver's SUDPH handshake goroutine pool was unbounded, allowing a flood of handshake requests to exhaust memory. Bounded to 64 concurrent handshakes with a 10-second timeout. Also fixed a `log.Fatal` in `Accept` that would crash the entire AR on a single bad connection.

### Skywire: Yamux Stream Leak Fix

**`711d0bc18` Fix dmsg-server yamux stream leak in forwardRequest / bridgeStream** — the DMSG server's stream forwarding logic had a leak where the second stream in a bridge pair wasn't being closed when the first stream errored. Over days of operation, this accumulated thousands of leaked yamux streams, eventually exhausting the server's file descriptor limit. This was one of the most impactful production bugs fixed this cycle.

**`5f53672b0` Fix dmsg-discovery overload: short-circuit redundant entry updates** — visors were re-posting their DMSG discovery entry on every session change (connect, disconnect, reconnect), even when the entry hadn't actually changed. A single server restart could trigger thousands of redundant updates. Now compares the entry before posting and skips if unchanged.

### Skywire: New DMSG CLI Commands

**`333e6a784` Add `dmsg sessions` CLI** — shows all active DMSG sessions for a visor with per-session details (server PK, remote PK, stream count, uptime, bytes transferred). Essential for debugging connectivity.

**`3c629c534` Add `dmsg connect-all`** — forces the visor to establish sessions with all configured DMSG servers immediately, rather than waiting for on-demand connection. Useful for ensuring full mesh connectivity before running diagnostics.

**`6c1770d6b` Relax DialStream per-phase cap** — previously limited to 2 servers per phase (from the port leak fixes on April 9). Now tries all existing sessions in phase 1, since the port leak root cause was fixed.

**`3f23a746d` CLI fetch chain: rewrite http->dmsg for RPC step** — the CLI's service health and config fetch now automatically tries DMSG transport first, falling back to HTTP. Ephemeral DMSG clients are created quietly without log spam.
