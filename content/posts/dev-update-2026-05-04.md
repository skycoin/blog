+++
date = "2026-05-04"
tags = ["Development", "Skywire"]
title = "Development Update — May 4"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Transport Uptime — CXO-Driven Heartbeats

PR #2426 rewrites the transport uptime model from polled re-registration to event-driven heartbeats with slot-accurate timelines.

**Pre-fix:** TPD inferred uptime from the timing of register/deregister and the 90-second TTL refresh. A transport that was up but lost its refresh window (slow network, brief TPD outage) showed up as "down" until the next refresh succeeded. The bitmap timeline had 90-second resolution and lots of false negatives.

**Post-fix:** every visor publishes per-transport heartbeats into a CXO feed on a fixed slot cadence (1-minute slots, 1440 per day). The aggregator merges the published bitmaps from both edges of each transport — a transport counts as "up" in a slot iff both edges' bitmaps mark it up. Self-edge heartbeats can't lie alone; the merge requires agreement.

The visible artifact is `cli rewards uptime` and the hypervisor's uptime tab now show minute-granularity timelines with the same accuracy as the underlying heartbeat record, instead of a 90s-quantized approximation.

### Skywire: Retire On-Disk CSV Transport Log

**`2427` transport+visor: retire on-disk CSV transport-log store; serve history from stats bbolt** — the legacy `~/.skywire/local/transport_log/<date>.csv` files were never read by anything that wasn't a debugging script. They piled up at ~50KB/day per visor and only operators with shell access could grep them.

The bbolt-backed stats store (added with the latency PR earlier) is the new home: same content, structured access, served via the visor's RPC API to the hypervisor and CLI. The CSV writer is removed; the directory and existing files are left in place for any operator with a pipeline already reading them.

### Skywire: Per-Service Self-Uptime + Version Provenance

**`2428` serviceuptime: per-service self-uptime + version provenance via local bbolt** — every long-running service (visor, dmsg-server, dmsg-discovery, ar, rf, sd, tpd, ut) now writes its own start/stop transitions into a tiny per-service bbolt at the service's data dir. The schema captures:

- Start timestamp + version string at start
- Clean shutdown timestamps (SIGTERM path)
- Crash detection (no clean-shutdown record between starts)

The hypervisor reads each service's local store via the existing RPC channel and displays it on the fleet-resources tab. Operators get a per-service uptime + version history without scraping logs.

### Skywire: TPD Perf

Two perf PRs hit TPD's hot paths:

**`2429` perf(tpd): bulk-read uptime timeline bitmaps with one GET per day** — the per-PK timeline query was issuing ~30 Redis GETs (one per day for a 30-day window). The replacement issues one GET per day across all PKs in the query (an MGET batched by day), cutting Redis round-trips by the number of PKs queried.

**`2430` perf(tpd): no-latency variant for mirrorEdges + concat redis-key builders** — `MirrorEdges` had a single code path that always touched the latency field; mirror calls from the cache-invalidation hot path don't need it. The split saves a Redis HGET per call. Also concatenates Redis-key strings with `strings.Builder` instead of `fmt.Sprintf` — a small win that adds up at the call rate.

### Skywire: TPD Latency Cap

**`2425` transport-discovery: cap UpdateLatency at MaxReasonableRTTMs** — RTT measurements over 30 seconds are almost certainly a stuck measurement loop (peer asleep, transport down between handshakes). Latency > 30s now caps at 30s rather than poisoning the rolling average. The 30s threshold is the same one the transport-level ping uses to declare a transport unreachable, so the two thresholds align.

### Skywire: Misc

- **`2431` visor: wire `--pprofmode` through dmsg cmdutil** so non-http pprof modes work end-to-end (the flag was being silently dropped when the visor's pprof was reachable via dmsg only).
- **`2432` nix: derive source-build version from flake git metadata** + fix the readme flake input. Nix builds from a checkout get the right version string in `--version` output.
- **`2424` hvui/cxo metrics + fleet resources** — hypervisor UI surfaces the new CXO publisher/subscriber counters alongside fleet-wide resource graphs.
