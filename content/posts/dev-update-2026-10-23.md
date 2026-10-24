+++
date = "2026-10-23"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 23, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The twenty-third of October cut the deployment's outbound traffic and ended in the v1.3.102 release. An audit found that most of the deployment host's egress was two CXO feeds that every visor held whole and that changed almost entirely on each publish. Visors now read the dmsg server list over HTTP, the dmsg clients feed carries only presence, visors route without transport discovery's graph by default, and the routing feed is published less often, with steadier latencies, as a snapshot plus small deltas. Together those took the host's egress from about 35 MB/s to 6 MB/s. Every visor also got a private status page with charts, WebRTC stopped binding a socket on every local address, and the Go and TinyGo builds now share one RPC and JSON implementation.

### Skywire: The Two Heavy Feeds

Every visor held dmsg discovery's clients-by-server feed only to read the list of dmsg servers in it. CXO sends a feed whole, each server's leaf carried all of its clients' entries, and those lists change constantly, so each visor received about the full 1.2 MB every minute, roughly 1.4 TB a day out of the deployment host. **`5781`** has visors refresh their server list over dmsg HTTP every 30 minutes instead, since the list only seeds the next start. **`5783`** then made dmsg discovery publish a small presence leaf per server, written when it gains its first client and deleted when it loses its last, which is all transport discovery needed from the feed. **`5789`** removed `dmsg.lookup_cxo`, an off-by-default resolver that served peer entries from that feed and could now only miss. A config that still sets it parses as before.

The routing feed was the other one. A native visor held transport discovery's whole graph from its first route calculation, and with it a 3.4 MB feed sent to about 500 visors on every publish, 523 GB a day. **`5784`** set `dial.local_graph` off on every build, as the browser visor already ran. The dial already tries the route setup oracle's 2-hop routes and 3-hop routes from neighbors' own transport lists before the route finder, so local calculation now answers only with a direct transport. **`5777`** publishes the feed every ten minutes instead of every minute, since telemetry is applied only every fifteen, and makes the interval configurable.

**`5792`** steadied the latencies the feed publishes. It had carried the last latency each visor reported, so 64 percent of transports changed latency on every publish and the best route between random pairs of visors changed for 61 percent of pairs, usually for little or no gain. The feed now publishes the minimum latency over the last six publishes, and only when it moves by more than 25 percent, which cut the records changed per publish from 65 to 16 percent. Bytes barely moved, because each shard packs a visor's roughly 90 transports into one leaf and almost always holds one change. **`5793`** fixed that by publishing the shards as a snapshot rewritten every six publishes, with one small delta leaf in between listing the transports added, changed or removed. Replaying eleven recorded publishes, subscribers would fetch 9.4 MB instead of 42.7 MB, and older visors skip the deltas and route on a snapshot at most an hour old.

### Skywire: Status Pages with Charts

**`5782`** gave every visor a private status page. It samples its CPU and memory, dmsg port traffic, transport bytes and counts by type, routing rules, dmsg sessions and running apps every five minutes, keeps the history in its stats database, and serves the charts at `/status/visor` over dmsg only to itself and its survey whitelist. The hypervisor serves `/status` behind its login with a section per connected visor, and on a hypervisor with 17 visors the page rendered in 0.65 seconds. **`5788`** lets a visor's hypervisors read its page too, and **`5785`** documented both.

**`5791`** added charts that say where traffic comes from: the eight busiest transports by type and remote key, bytes per app counted on each app's own route groups, route group and leg counts including standby tunnels, the change in the router's mux counters, and leg traffic split into direct and multihop. **`5779`** made the combined deployment status board serve each service's extra pages, which restored the link to the network graph, and **`5780`** groups visors behind one public IP in that graph, circling each group without ever sending an address to the page.

### Skywire: WebRTC and Relays

A WebRTC transport reported "webrtc-datachannel" as its remote address, so a WebRTC transport between two visors on the same LAN was never recognized as one. **`5778`** reports the selected ICE candidate pair instead. Each WebRTC peer connection had also bound a UDP socket and reader on every local address, including docker, veth and tunnel interfaces. ICE now skips those, and connections share one UDP socket, which in a test of eight dial and accept pairs took the process from 127 UDP sockets to 2.

Since relayed skynet streams became end-to-end encrypted, older destinations do not answer the handshake, so relays could not reach visors still on v1.3.101. **`5786`** made `visor state` keep the last 16 failed dmsg over skynet dials with each relay's stage and error, which showed exactly that, and **`5790`** skips the relay tier for a peer for ten minutes once every relay to it fails in that handshake, still trying a direct transport first. **`5787`** fixed `skywire cli log level` returning 401 for the visor's own host, by sending the request through the visor's RPC so it arrives from the visor's own key.

### Skywire: One Implementation for Go and TinyGo

The Go and TinyGo builds ran different code for RPC dispatch and JSON. **`5776`** made Go use what TinyGo already uses: every RPC receiver is served through generated handler tables, with a check that Go and TinyGo builds for Linux, js, macOS and Windows agree on the method set, and JSON is plain `encoding/json` everywhere. dmsg discovery entries are signed with HTML escaping off, which gives the same bytes as before, so old signatures still verify. The binary no longer links net/rpc, jsoniter or reflect2. **`5775`** followed upstream Gio's new foreground service API in the Android shell app.

### Skywire: v1.3.102

**`5795`** released v1.3.102, covering everything since v1.3.101 on October 13. **`5794`** updated every dependency ahead of it, which broke the release builds: go-fuse v2.12 does not compile on 32-bit ARM and the go directive moved past the toolchain in the build image. **`5798`** pinned go-fuse back and restored the directive, and **`5799`** added that to the changelog. The Windows release job then failed because MSYS2 no longer ships libusb or hidapi for mingw64, which **`5800`** and **`5801`** fixed by syncing the package database and building the hardware wallet support against ucrt64.
