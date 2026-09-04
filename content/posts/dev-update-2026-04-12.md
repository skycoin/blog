+++
date = "2026-04-12"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — April 12, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Uptime Tracking Overhaul

The uptime system was completely reworked to produce higher-fidelity data and reduce load on the standalone uptime tracker:

**`0c18f00a9` TPD: record heartbeat on transport registration** — every time a visor re-registers its transports (every 90 seconds), the TPD now records a heartbeat for uptime tracking. This piggybacks uptime data collection onto an operation that's already happening, rather than requiring a separate HTTP call.

**`0c955313f` Visor: send heartbeat to TPD alongside uptime tracker** — the visor now sends heartbeats to both the standalone uptime tracker and the TPD, ensuring continuity during the migration.

**`f13248aa6` TPD: online status based on 2+ p2p transports** — a visor is considered "online" in the TPD if it has at least 2 peer-to-peer transports (STCPR or SUDPH). This is a stronger signal than a simple heartbeat — it means the visor is actually participating in the network, not just registering empty entries.

**`75136e547` TPD: add v3 uptime endpoint with per-day timeline bitmaps** — the new `/v3/uptimes` endpoint returns per-day bitmaps where each bit represents one hour. This enables the CLI to render visual uptime timelines:

```
2026-04-10: ████████████████████████  24/24h
2026-04-11: ████████████████░░██████  22/24h
2026-04-12: ████████████████████████  24/24h
```

**`0f87b4cca` dmsg-discovery: add integrated uptime tracking with /uptimes endpoint** — DMSG discovery now also tracks uptime from session events (connect/disconnect). The `/uptimes` endpoint mirrors the TPD format, giving operators a DMSG-layer view of visor availability.

**`93ff62f60` Add integrated uptime tracking to service-discovery** — service discovery joins the uptime tracking pool, recording heartbeats from service registration events.

### Skywire: DMSG Reachability Probes

A new subsystem that verifies visors are actually reachable before accepting their registrations:

**`55b31ce44` SD: probe visor dmsg reachability before accepting registration** — when a visor registers a service (VPN, proxy, public visor), the service discovery now probes the visor over DMSG to verify it's actually reachable. Unreachable visors are rejected, preventing the listing of phantom services.

**`c5ee6efac` SD: cache dmsg probe results for 5 minutes** — probing every registration is expensive. Results are cached per-PK with a 5-minute TTL.

**`261b35ea8` Autoconnect: probe dmsg reachability before transport establishment** — before the visor's autoconnect logic tries to establish a transport to a remote visor, it first probes DMSG reachability. This catches dead entries in the transport discovery and avoids wasting time on doomed dial attempts.

### Skywire: Visor Self-Probes

**`6b03d41e3` Visor: add periodic self-probe for dmsg listener health** — the visor now probes its own DMSG listener every 60 seconds by dialing itself on port 136 (route setup port). If the probe fails twice consecutively, `ForceReconnect` is called to re-establish DMSG sessions. This catches the case where the visor's DMSG listener becomes unreachable without the visor knowing (e.g., server-side session drop).

**`bfb0038e9` dmsg: remove negative route cache, add reachability probe** — the negative route cache (introduced earlier to skip known-bad routes) was causing false negatives when network conditions changed. Replaced with explicit reachability probes that provide definitive yes/no answers.

**`ffa4221ad` Visor: wait for DMSG HTTP transport instead of fataling** — previously, if the DMSG HTTP transport wasn't ready at visor startup, the visor would fatal. Now waits with a timeout, allowing the DMSG client to finish connecting.

### Skywire: RSN Tuning

**`880354bbf` RSN: increase maxConcurrent from 20 to 128** — the embedded route setup node's concurrency was too low, causing queuing under moderate load.

**`b494c1a64` RSN: remove probe from CreateRouteGroup** — route setup was probing the destination before creating the route group, but the probe itself consumed a route setup slot. Removing it frees capacity for actual route setups.

**`dc9870b55` RSN: reduce maxConcurrent from 128 to 32** — 128 was too high, causing ephemeral port exhaustion on the DMSG server. 32 is the sweet spot: enough concurrency for throughput, low enough to stay within port budgets.

**`31661571f` RSN: reduce connection deadline to 30s, add inbound conn deadline** — route setup connections that take more than 30 seconds are killed. Inbound connections from visors now also have a deadline, preventing slow clients from holding slots indefinitely.

### Skywire: Build and CI

**`3c1273ed7` Remove goreleaser configs** — all the old `.goreleaser-*.yml` files (darwin-amd64, darwin-arm64, linux, windows) were removed. The release workflow was already migrated to a simpler approach.

**`0082cf45f` Visor: add dmsghttp support for route finder and uptime tracker** — these two services can now be reached over DMSG HTTP, completing the DMSG-first service access pattern.

**`958b3e6f3` Visor: fix embedded RSN/TPS with dmsghttp-only config** — when the visor was configured for DMSG-only mode (no HTTP), the embedded route setup and transport setup nodes weren't initializing their DMSG clients correctly.

**`318a78d3d` dmsg: debounce discovery entry updates on session changes** — DMSG entry updates now have a 1-second debounce window. Multiple rapid session changes (common during reconnection storms) coalesce into a single discovery update.
