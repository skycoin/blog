+++
date = "2026-07-05"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — July 5, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A day about spreading load fairly and seeing the network you actually have. The headline fix ends a load imbalance across the dmsg fleet that had been quietly making delegated services — including the reward system — intermittently unreachable, by matching each client to what a server can actually take. Alongside it, the transport-graph tooling caught up to the fleet's newer transport types and gained a GPU-backed view that can finally draw the whole topology without freezing, and the in-tab browser learned to wait out a transient connection window instead of showing an error.

### Skywire: Ending dmsg Load Imbalance

**`3394`** fix(dmsg): capacity-weighted server selection to end load imbalance is the fix for a failure mode that looked like random unreachability. A dmsg client establishing its sessions shuffled the discovered server list *uniformly* at random and connected to the first `MinSessions` — so every server received an equal share of clients regardless of its capacity. With ~1100 clients and per-server capacities ranging from ~30 to ~2000 advertised sessions, the small fd-limited VPSes were handed far more clients than they could accept and rejected the overflow with `EOF`, while the high-capacity servers sat underused. Any service delegated only to the saturated servers became intermittently unreachable — observed live as the reward system, delegated to two ~30–60-capacity servers, EOF'ing browser dials. The fix replaces the uniform shuffle with capacity-weighted random ordering (Efraimidis–Spirakis A-Res, weighting each server by its advertised `AvailableSessions`), so clients spread across servers in proportion to what each can take. The per-item random key preserves the anti-thundering-herd randomness the shuffle was there for, and a missing capacity falls back to uniform, identical to the old behavior.

The same PR also fixes the `MinSessions==0` ("connect to all servers") path, which discovered its targets via `AvailableServers` — a list that *omits* servers that have stopped advertising availability because they are at or near capacity. But a saturated server still accepts sessions rather than hard-refusing, and a connect-all client must hold a session to *every* server so it can rendezvous with a peer delegated to a currently-non-advertising one. It now discovers via `AllServers`, so a service whose delegated servers are all near capacity stays reachable to connect-all clients.

### Skywire: Seeing the Whole Topology

**`3395`** feat(tpviz): new transport-type colors + WebGL graph view (default) for full all-transports brings the transport-graph tooling up to date with the network it draws. The graph only knew `stcpr`/`sudph`/`dmsg`; the fleet now also runs `squicr` (QUIC), `swtr` (WebTransport), `swsr` (WebSocket) and `webrtc` transports, all of which fell through to a single gray fallback with no legend entry and no filter toggle — so the graph read as near-monochrome and the new types were invisible and unfilterable, even though live data is now ~14% WebRTC plus a growing QUIC/WebTransport share. The PR adds colors, legend swatches and per-type filter toggles across the flat and globe views, and mirrors the same palette into the Angular network-visualizer so the two graphs read consistently. It also switches the flat graph to straight edges: at ~20k transports the smooth-curve edges were re-tessellated every redraw and were a major main-thread cost.

The larger change in the same PR is a third, default view — **WebGL**, backed by `@cosmograph/cosmos` — that runs both the force simulation and the rendering on the GPU. The existing Canvas2D flat view stabilized its layout on the main thread and froze the UI for seconds at the full all-transports scale; the WebGL view draws the entire routable topology (all-transports, the set the route finder actually builds routes from, not just the QoS-reporting `/metrics` subset) without blocking the main thread.

### Skywire: A Patient Deep-Link

**`3396`** fix(wasm-hv): retry the deep-link auto-open on transient dmsg EOF closes a gap in the in-tab browser's `?skynet=<target>&kiosk=1` deep-link. The link opens to its target as soon as *any* dmsg session is live — but the target's own dmsg server may not be reachable yet, so the first fetch can transiently `EOF` and leave the pane empty until the user reloads. An interactive navigation surfaces that error for the user to retry by hand; the automatic deep-link had nothing to retry it. It now retries on *transient* failure only — distinguished from a deliberate block or a real HTTP response — with linear backoff up to ~15s, scoped to the deep-link path so interactive navigations are unchanged.
