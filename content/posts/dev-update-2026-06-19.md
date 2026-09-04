+++
date = "2026-06-19"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — June 19, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The day the transport layer grew two new legs and finished a long-running one. Two efforts landed side by side: a fresh push to give dmsg more ways onto the wire — carrying dmsg sessions over both WebSocket and QUIC — and the final assembly of the multi-year "faithful UDP" work (issue #2607), where UDP semantics are preserved end to end instead of being papered over by a reliable stream. QUIC ties the two together: it brings native datagrams that faithful UDP can ride on directly, and it becomes a first-class skynet transport in its own right. A slimmer end-to-end test harness and a cleaner split between the hypervisor's web UI and its RPC round out the day.

### Skywire: New Carriers for dmsg

dmsg has historically ridden on a small set of transports; two PRs widen that set to reach environments the old carriers couldn't.

**`3189`** feat(dmsg): dmsg-over-WebSocket transport + drop clearnet-http service URLs adds WebSocket as a dmsg carrier, reusing the existing Noise-plus-yamux stack over a `NetConn`-style WebSocket connection. The payoff is browser reach: a browser tab can't open a raw socket, but it can open a WebSocket, so this is the transport that makes an in-browser dmsg client possible. The same PR centralizes service configuration — the deployment's service URLs become a single source of truth rather than being duplicated across the tree — and drops the clearnet-HTTP service URLs in favor of the dmsg-native path.

**`3188`** feat(dmsg): dmsg-over-QUIC — native QUIC sessions + a datagram channel (#2607) (#3188) gives dmsg native QUIC sessions. Beyond being another carrier, QUIC exposes a datagram channel alongside its reliable streams, and that datagram channel is exactly what the faithful-UDP work needs to carry unreliable UDP without wrapping it in a reliable stream. This PR is the prerequisite that makes UDP-over-dmsg possible.

### Skywire: Faithful UDP, End to End (#2607)

A staged sequence of PRs closes out issue #2607 — carrying UDP with its real semantics preserved, from the router core all the way up to an operator-facing CLI. Each stage builds on the one below it.

**`3183`** feat(router): dispatch + forward DatagramPacket — wire faithful UDP into the router (#2607 stage-4a) is the foundation: the router learns to recognize and forward a new `DatagramPacket` type, dispatching unreliable datagrams distinctly from the reliable stream path. **`3184`** feat(router): build the faithful-UDP datagram sibling during route setup (#2607 stage-4b) extends route setup so that alongside the usual reliable route group, a datagram sibling is constructed — the unreliable channel a UDP forwarding path actually rides on. **`3185`** feat(visor): wire faithful-UDP app + forwarded-ports paths end to end (#2607 stage-4c) connects the app and forwarded-ports plumbing so that a UDP forwarding request threads all the way through the visor. **`3186`** feat(cli): operator-facing faithful-UDP port forwarding (#2607 stage-4d) puts a handle on all of it, giving operators a command to set up UDP port forwarding over the network.

**`3187`** feat(transport): QUIC skynet transport + faithful UDP over QUIC datagrams (#2607) is where the two threads meet: QUIC becomes a full skynet transport, and faithful UDP rides QUIC's native datagrams directly. Where QUIC's RFC-9221 datagrams are available they carry the UDP payload unreliably as intended; otherwise the path falls back gracefully. This is the capstone that lets UDP traffic traverse the mesh without the latency and head-of-line-blocking cost of tunneling it through a reliable stream.

### Skywire: A Leaner Test Harness and a Cleaner Hypervisor

**`3176`** fix(e2e): dmsg-only configs + slim to 1 redis / 1 deployment-services / N visors trims the end-to-end test topology to match how the network now actually bootstraps: dmsg-only configs, a single redis, a single deployment-services instance, and a scalable set of visors. A smaller, more representative harness makes the e2e suite both faster and a truer test of the real bootstrap path.

**`3182`** feat(hypervisor): hv ui enable/disable — separate web UI from RPC + hv ls (also fixes tpviz restart panic) decouples the hypervisor's web UI from its RPC surface, so the two can be enabled independently, and adds an `hv ls` listing. It also fixes a panic on tpviz restart — the transport-visualizer path could crash when brought back up — closing a rough edge in the hypervisor's lifecycle.
