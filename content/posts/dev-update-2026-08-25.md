+++
date = "2026-08-25"
tags = ["Development", "Skywire"]
title = "Development Update — August 25"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The throughput day. A single-line change — raising the yamux stream window from 256 KB to 16 MB for the mesh's bandwidth-delay product — turns out to be the throughput fix the mux work had been circling: the mesh was window-starved, not CPU- or mux-bound. It lands next to a multi-tunnel aggregation foundation, an adaptive mux that finally converges to the fastest legs in one tick, sharded CXO feeds that let a busy hub's Root fill, and a large package reorganization grouping the deployment services under `pkg/deployment`.

### Skywire: The Window Was the Bottleneck

**`4211`** raises the yamux stream window from 256 KB to 16 MB to match the mesh's bandwidth-delay product. A mesh route has a far larger BDP than a LAN, so a 256 KB window let only a fraction of the pipe fill before the sender stalled waiting for ACKs — the link was window-starved, and no amount of mux width could recover throughput a single window cap was throttling. **`4210`** fixes the companion bug: a yamux stream now returns an error instead of spinning when its session is shut down mid-read. **`4212`** is the RFC framing the next step — mesh bandwidth aggregation via connection-striped independent flows.

### Skywire: Multi-Tunnel Aggregation

**`4213`** lays the foundation: a multi-session skysocks client that stripes across the least-loaded connection. **`4214`** auto-diversifies the multi-tunnel dials over disjoint first-hop transports so the tunnels take genuinely independent paths, **`4215`** exposes `--tunnels` on `proxy start` to drive the aggregation, and **`4216`** re-dials dead multi-tunnels and diversifies sequentially and reliably.

### Skywire: Adaptive Mux That Converges

A run of router fixes makes the adaptive mux both fast to serve and quick to settle. **`4209`** establishes mux legs asynchronously so a dial serves on its primary immediately instead of waiting for the whole group, **`4207`** adds instant warm-standby failover so a leg's death never dead-ends a connection, and **`4208`** swaps out a sustained-bad *primary* leg instead of riding it forever. **`4200`** converges the mux to the fastest N legs in a single tick, **`4201`** has the adaptive tick evict low-throughput legs rather than only dead ones, and **`4206`** caps the adaptive active mux at `adaptCap` even under load. The warm-standby pool is uncapped in stages — **`4193`** raises `adaptStandbyMax` from 2 to 60, **`4202`** truly uncaps it and fills it in the background, and **`4187`** makes the adaptive mux symmetric and bidirectional so the pool actually fills — and **`4177`** exempts control-plane ports from the routing policy by default.

### Skywire: Sharded CXO Feeds

To let a busy hub's Root fill at all, the large CXO feeds are sharded to one leaf per unit. **`4190`** shards the telemetry feed into compact-binary leaves, **`4195`** shards the services feed to one leaf per type, **`4191`** batches the dmsgd clients-by-server feed to one leaf per server, and **`4170`** caches the expired-transport SCAN so the TPD metrics publisher stops re-SCANning redis every tick. **`4179`** resets the fill stall timer on progress and adds a hard total ceiling. The attempt to consolidate the tp-list onto the telemetry feed (#4171, #4184) is reverted twice (**`4174`**, **`4189`**) after it regressed the fill — the dedicated feed from the day before stays.

### Skywire: Deployment Services Over CXO

**`4186`** resolves dmsg entries over CXO through the clients-by-server feed with an HTTP fallback, and **`4175`** binds address-resolver registration over CXO as an additive dual-write. **`4172`** allocates the CXO ports for the AR-bind and SD-registration feeds, and **`4173`** moves them off a collision (68→71, 70→72). **`4182`** removes a pre-transport dmsg reachability probe from autoconnect.

### Skywire: Package Reorg, the Route Tree, and the CLI

A three-batch reorganization groups related packages: **`4180`** gathers stray packages under their parents, **`4181`** groups the deployment-service servers under `pkg/deployment`, and **`4185`** moves transport-discovery under `pkg/deployment/tpd`. The proxy status route tree gets a visual pass — **`4205`** colors the exit red and each hop level distinctly, **`4203`** fixes leg-metric widths so the tree doesn't shift on update, **`4197`** and **`4199`** full-bleed and center it, **`4192`** is a layout pass with header bandwidth meters and a resizable log pane, and **`4188`** restores the bilateral tree — and **`4204`** and **`4198`** always serve `status.skysocks` in-process, even when disconnected from the exit, never the interstitial. On the CLI, **`4194`** adds a server-side transport-summary endpoint so `tp -s` need not fetch every transport, **`4196`** moves the network transport summary onto `tp disc -s`, and **`4176`** honors `--json`/`--jq`/`--shape` on `rg`, `skychat` alias/pair list and `visor reward`. **`4178`** rebuilds the committed wasmgo blob from a clean tree.
