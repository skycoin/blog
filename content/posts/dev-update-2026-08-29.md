+++
date = "2026-08-29"
tags = ["Development", "Skywire"]
title = "Development Update — August 29"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The mux goes unidirectional: uploads and downloads no longer have to take the same paths. A dense day around that — the two ends of a route group learn to mirror each other's leg state, two more schedulers and shared-bottleneck detection arrive, the proxy status page grows a two-level route tree and a GPU route graph, and the browser visor's RPC becomes reachable over dmsg. A one-line hash fix at the end of the day unblocked the published development binary for 32-bit ARM.

### Skywire: Unidirectional Mux

**`4304`** introduces per-leg send selection by direction (CapUniDir): by default a direct leg carries the upload while the mux carries the download, since the two directions have different needs and different best paths. **`4305`** adds a load-driven flip for upload-heavy traffic, **`4311`** makes direction — not the standby flag — govern send selection, **`4310`** stops the lightly-used direction's leg being reaped as a black hole, and **`4319`**, **`4337`**, **`4339`** and **`4348`** confine the download to the active reverse legs and keep a floor of them alive so it never sprays across standby. **`4329`** surfaces the direction and flip state in `visor state`.

### Skywire: Mirrored Leg State

CapLegState from yesterday becomes a discipline: **`4349`** mirrors the native controller's leg parks to the peer, **`4351`** has the acceptor honor the initiator's mirrored active set instead of re-admitting parked legs, **`4353`** defaults the acceptor's set to all-standby until promoted by the mirror, and **`4350`** adds a periodic resync so a lost park signal self-corrects.

### Skywire: Schedulers, Bottlenecks and Route Plumbing

**`4321`** adds the OTIAS and STMS packet schedulers alongside ECF, and **`4322`** brings shared-bottleneck detection (RFC 8382) so legs that merely look disjoint but share a queue can be recognized. **`4320`** teaches the SOCKS5 proxy transparent HTTP GET range-splitting — one download striped as ranges across tunnels. **`4333`** makes runtime standby/width retunes re-cap a *running* route group, **`4335`** honors excluded transport IDs so extra tunnels leave over disjoint first hops, **`4336`** lays out a shared route-plan cache for multiplexed aux legs, and **`4346`** stops a reorder wedge being read as tunnel death — the false-liveness teardown that could collapse a loaded session. **`4347`** forwards self-heal targets through the policy hook so routing-policy presets re-cap the running pool.

### Skywire: Seeing the Routes

**`4313`** and **`4323`** give the proxy status page a two-level route tree — streams over the packet legs that carry them — with **`4334`** adding per-stream up/down bytes, rates and route-group rtt, and **`4338`** and **`4345`** a GPU-rendered route graph. **`4340`** adds a latency-space view to the transport visualizer: visors positioned by measured RTT on a sphere with a spherical Voronoi, so network distance and physical distance can disagree visibly. **`4306`** replaces the vendored WinBox.js window manager with its Go port.

### Skywire: The Browser Visor Answers Over dmsg

**`4328`** answers `cli visor state` from the wasm-visor's RPC gateway, and **`4330`** serves that gateway over dmsg — `cli --rpc dmsg://<pk>` drives a visor running in a browser tab from any terminal on the mesh. **`4331`** rebuilds the routing-policy preset bundle and wires the adaptive mux tunables into the wasm guest, and **`4332`** fixes the generated config dropping `hypervisor_autoconnect`.

### Skywire: Performance and the Pipeline

**`4307`** coalesces a discovery-server leaf re-encode that was burning ~1.6 cores in gzip. **`4308`** makes `--direct` actually bypass the routing policy. **`4342`** adds server-side projection and a `--watch` NDJSON stream to `visor state`. **`4352`** switches a route-graph hash to uint32 so the tree builds on 32-bit platforms — restoring the published development binary for ARM. **`4327`** splits lint from tests in CI so a lint finding can't blank the suite, **`4344`** repairs the test lane (two real races plus deflakes), and **`4309`**, **`4312`**, **`4341`** and **`4343`** cover toolchain resolution, lint and an RFC on bottleneck-relative disjointness.
