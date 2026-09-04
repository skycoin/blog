+++
date = "2026-05-20"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — May 20, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The multiplexed-routing work gets serious about *measurement*. A new `StreamMuxBandwidth` RPC and a `cli mux-bw` command — with a live TUI dashboard — turn "route a flow over N disjoint paths" into measured throughput, queueing delay, and an idle baseline. The `DialOptions` grow disjoint-mux and intermediate-exclusion controls so the paths can be forced apart. Alongside, a round of hypervisor-UI fixes and a couple of router correctness fixes.

### Skywire: Multiplexed Bandwidth — Measure the Disjoint Paths

If multiplexed routing is the headline capability, it needs to be measurable. Today builds the instrument.

**`2737` feat(visor): StreamMuxBandwidth gRPC RPC + cli mux-bw** — a streaming RPC (and `cli mux-bw` command) that measures bandwidth across a multiplexed route set as it runs, streaming the numbers back live.

**`2746` feat(router): DisjointMux + ExcludeIntermediatePKs in DialOptions** — `DialOptions` gain a `DisjointMux` mode and an `ExcludeIntermediatePKs` list, so the parallel routes can be constructed to *avoid sharing intermediates* — genuinely disjoint paths, not N routes that all funnel through the same middle hop. This is what makes multiplexing buy you redundancy and aggregate bandwidth rather than just N copies of the same bottleneck.

**`2748` feat(visor/cli): mux-bw idle-baseline phase + built-in queueing-delay output** — `mux-bw` runs an idle-baseline phase first (what's the latency with no load?) then reports queueing delay under load, so you can separate path latency from congestion. **`2749`** plumbs `mux-bw --min-hops` through `DialPing` into the router so the measurement honors a minimum hop count (force the overlay, don't measure a direct shortcut).

**`2739` feat(cli/ping-mux-bw): bubbletea TUI dashboard for StreamMuxBandwidth** — a live terminal dashboard renders the streamed bandwidth/delay numbers as they arrive. **`2747`** gives the ping commands human-readable defaults and built-in aggregation for both the tree-stream and mux-bw outputs.

**`2745` feat(visor): per-route teardown — decouple StopPing from PK-only** + **`2752` feat(visor): honor caller SetupTimeout in DialPing** — teardown becomes per-route rather than all-routes-to-a-PK, and `DialPing` honors the caller's setup timeout instead of a fixed budget. Both are the kind of plumbing the measurement surface needs to be precise.

### Skywire: Ping-Tree — TUI on the gRPC Stream

**`2736` feat(cli/ping-tree): rewire TUI onto server-side gRPC streaming** — the ping-tree TUI is rewired onto yesterday's server-side streaming RPC, so the tree fills in live. **`2738`** restores the tree shape, full PKs, and the `tpID` column in the rendered view (and prints the final state after quit), and **`2734`** adds an NDJSON harness for `cli visor ping tree-stream` so the stream can be consumed by tooling, not just the TUI.

### Skywire: Hypervisor UI

A cluster of UI fixes sharpen the hypervisor dashboard.

**`2744` feat(hv-ui): hypervisor list under PK, live online-time, ping/NAT tooltips** — visors group under their hypervisor's PK, online-time ticks live, and ping/NAT details surface as tooltips. **`2742`** restores the local-hypervisor ★ marker and keeps transient-offline visors visible (rather than vanishing on a blip), and **`2743`** drops the stale DMSG + Reachability tabs and fixes the terminal tab. **`2740`** fixes tab highlighting, the terminal iframe, and the hypervisor list on the Info view.

**`2741` chore(ui): npmrc + refreshed lockfile so make build-ui works on npm 11** — housekeeping so the UI builds cleanly under npm 11.

### Skywire: Router / Skynet

- **`2750` fix(router): blame intermediate not dst when id_reservation fails on a hop** — when route-id reservation fails at an intermediate hop, the failure is now attributed to that intermediate, not to the destination — so route-finder and diagnostics point at the actual problem hop.
- **`2751` fix(appnet): tryDirectPingDial shortcut bypassed MinHops constraint** — a direct-dial fast path was skipping the `MinHops` constraint; now it respects it (no accidental 1-hop when the caller asked for an overlay path).
- **`2735` fix(skynet-srv): half-close forwardRawTCP before close — drains buffered bytes** — the raw-TCP forwarder half-closes before fully closing so buffered bytes drain instead of being truncated on teardown.
