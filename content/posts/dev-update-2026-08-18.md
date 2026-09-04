+++
date = "2026-08-18"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — August 18, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Two campaigns reach their point today. Route ranking stops guessing at transport quality by type and starts using *measured* throughput and end-to-end latency, in a three-phase build that goes from free passive observation to an active packet-pair probe to ranking that treats the type cost as a mere prior. And the warm-standby mux primitive — a leg that stays alive but parked — lands and is wired through the policy ABI, so `rotating-bw` rotates by promoting a warm standby instead of tearing a live leg down mid-stream. Alongside them, an app can finally override the visor-global mux defaults, and the deployment HTTP and CXO surfaces are gzipped.

### Skywire: Measured Route Ranking

Ranking judged transports by RTT, which is throughput-blind — a WebRTC SCTP datachannel has low RTT but poor goodput, so it ranked well and sneaked onto mux legs. Rather than hardcode a per-type penalty (a guess), each transport gets a measured throughput estimate. **`3987`** is phase 1, the free half: passive observation on the existing transport-maintenance loop folds each interval's observed goodput into a per-transport high-watermark, reading cumulative counters only, so it can never disrupt a live route or cost bandwidth. **`3988`** is phase 2, for idle transports a passive read never exercises: a non-obtrusive packet-pair probe sends a short back-to-back train (~11 KB) and computes the bottleneck bandwidth from the inter-arrival dispersion on a single receiver clock — no clock sync, no saturating burst. **`3989`** closes the loop: when a transport has a measured estimate, ranking uses it directly — a link measured fast scores zero regardless of type, a slow one is penalized regardless of type — and the per-type cost (**`3983`**, deprioritizing slow types) degrades to a prior used only until a real measurement exists.

### Skywire: End-to-End Leg Latency

**`3985`** fixes a mis-attribution: the leg-liveness pong already measured each leg's full round-trip time, then threw it into an aggregate and credited it to the first hop, so the policy's "evict the slowest leg" and the `LatencyMs` telemetry were judging the *first-hop* transport RTT, not the leg's whole-route latency — very different on a multi-hop leg with a fast first hop and a slow second. A per-leg end-to-end EWMA keyed by transport ID (surviving leg re-indexing) is now folded from the pong and reported as the leg latency, so the adaptive presets decide on the real route latency. **`3984`** retransmits SACK gaps on the fastest leg rather than the mode-driven pick. **`3990`** ranks disjoint route candidates by transport cost so a mux stops taking WebRTC legs, and **`3986`** plans the aux legs over the global TPD graph (route-finder first) instead of local-only transports.

### Skywire: Warm-Standby Legs and No-Dip Rotation

**`3973`** is the RFC and **`3974`** the dormant primitive: a per-leg `standby[]` flag parallel to `ready[]`, folded into `legReadyAt` so a standby leg is uniformly skipped by every send path while its rules stay installed and its keepalive/liveness loops keep it alive — `setLegStandby` demotes or promotes instantly with no route setup, and nothing calls it in a live path yet. **`3977`** wires demote/promote through the `on_tick` ABI and **`3979`** has the router observe and emit the gate state so the adaptive preset can hot-swap on it. **`3995`** puts it to work: `rotating-bw` had dropped the oldest *live* leg every interval, tearing down its transport mid-stream (a dip at mux=2, a fatal stream EOF at mux=4, measured live), and now provisions one warm standby beyond the target width and rotates by promoting the standby and demoting the oldest active leg — both pure flag-flips, no teardown, so the demoted leg's in-flight bytes still drain and the active set rotates with no dip. **`3996`** takes it further: the mux is managed by standby and transport type, anchoring the active set on reliable types (stcpr/sudph/squicr/stcp) and parking fragile ones (webrtc/ws/wt/dmsg) on warm standby, since an all-webrtc group collapses under load (measured: EOF at ~14s) while a reliable-anchored group runs stable for minutes.

### Skywire: The Adaptive Default and Its Harness

**`3978`** adds a composite `adaptive` default preset (size + membership + explore) and **`3981`** makes it a fast default with a lean start that inherits the operator's `min-hops`. **`3980`** is the per-leg mux telemetry harness — NDJSON with lifecycle events and a chart — and **`3982`** documents a reproducible measurement rig script and controlled far-end guide, the instrumentation the rotation work is measured against.

### Skywire: Per-App Overrides, Interstitial Copy, gzip

**`3994`** lets an app override the visor-global `min_hops`/`mux_routes`: a visor configured with aggressive defaults forced *every* skynet dial into multi-hop mux with no opt-out, which breaks a 1:1 forward to a single-route port, and now an explicit `--routes 1` reaches the networker instead of being silently dropped. **`3993`** adds a `--routing-policy` flag to `skynet start` for parity with `proxy start`. **`3991`** gives the proxy interstitial mechanism-specific copy and Skywire cloud branding, and **`3992`** adds a proxy loadtest rig — a steady controlled sink with an exact goodput/gap recorder — the far end the mux fixes are measured against. On the deployment side, **`3975`** gzips the uptime-tracker, service-discovery and route-finder HTTP responses and **`3976`** gzips the all-transports CXO feed for bandwidth parity with the HTTP path.
