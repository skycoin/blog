+++
date = "2026-05-19"
tags = ["Development", "Skywire"]
title = "Development Update — May 19"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A shorter day, with three through-lines: the `ping tree` diagnostic moves to a server-side gRPC stream, parallel multiplexed-route dialing gets a `--routes` knob (and a CI harness to assert on it), and the storage layer learns to **auto-recover from bbolt corruption** instead of crash-looping on it.

### Skywire: Ping-Tree — Server-Side Streaming

The `ping tree` view — which walks the route tree to a destination and times each hop — moves its heavy lifting server-side.

**`2732` feat(visor): server-side gRPC streaming ping-tree RPC** — the visor streams ping-tree results over gRPC as they arrive, rather than computing the whole tree and returning it in one blob. The client renders incrementally, which matters when a tree has slow or unreachable branches.

**`2733` feat(visor/ping-tree): use_transport_latency fast path at level-1** — at the first level, the already-measured transport latency can be used directly instead of issuing a fresh ping, shaving work off the common case.

### Skywire: Multiplexed Routing — Parallel Routes

Building on the mux-route probe from yesterday, the dialer gains an explicit knob for fanning a flow across multiple routes.

**`2727` feat(skynet): --routes flag for parallel mux-route dialing** — `--routes N` dials N parallel routes between the endpoints and multiplexes the flow across them. This is the operator-facing surface of the multiplexed routing that distinguishes skywire from a single-path overlay: a flow can ride several disjoint paths at once.

**`2725` feat(ci/mux-runner): endpoint-a/-b, intermediate-pool, avoid-direct flags** + **`2726` feat(ci): mux-probe-assert — Go harness for mux-route-probe.sh tally** — the CI side: the mux-runner takes explicit endpoints, an intermediate-pool, and an avoid-direct flag (force the overlay path rather than a direct hop), and a Go harness tallies the probe results so the multiplexed-route behavior can be asserted in CI rather than eyeballed.

### Skywire: Storage — Auto-Recover From bbolt Corruption

A visor that won't start is worse than one that starts degraded. Two fixes make the bbolt-backed stores self-heal.

**`2728` fix(stats): auto-recover from bbolt corruption at startup** + **`2729` fix(cxo): auto-recover from bbolt corruption in idxdb + cxds opens** — a corrupt bbolt page used to panic from inside bbolt's machinery and crash-loop the visor during init. The stats store, the CXO index db, and the CXDS open paths now detect a corrupt database and recover (recreate from scratch) rather than crash-looping. The data in a corrupt store is already lost; the right behavior is to come back up, not to wedge.

### Skywire: Router

**`2730` fix(router): handleDataPacket panic on send-to-closed-readCh during remote close** — a data packet arriving in the window where the remote end is closing could be sent to an already-closed read channel, panicking the router. Guarded.

Plus a dmsg-discovery fix: skip the CXO republish on heartbeat-only entry updates (no material change, no feed churn).
