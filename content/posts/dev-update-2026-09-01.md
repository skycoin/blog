+++
date = "2026-09-01"
tags = ["Development", "Skywire"]
title = "Development Update — September 1"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Four merges, each substantial: the retransmit storm that could eat a loaded mux stream is root-caused and fixed, dmsg servers become probeable per carrier — uncovering and fixing a silent QUIC downgrade along the way — five operations guides land in the docs, and the last modified in-tree dependency copies become proper forks.

### Skywire: The Retransmit Storm, Root-Caused

Under sustained load, bufferbloat inflates the in-band RTT far past the loss-detection ceiling, so the 1.5s clamp declared every in-flight packet permanently lost — and because retransmitted entries were never re-stamped, every ~25ms SACK re-selected the same holes. Measured live: 93% of sent packets were retransmits, 50MB on the wire for 8.6MB of goodput, until liveness gave out. **`4399`** fixes both halves: retransmit entries carry their last send time and back off exponentially, and the RACK ceiling is floored at one measured RTT so the adaptive reorder window is never overridden by an absolute clamp.

### Skywire: Probing Every Carrier of Every Server

**`4400`** adds `dmsg conf probe`: real dmsg sessions — Noise handshake included — to every server over every advertised carrier (tcp, quic, ws/wss, wt), as a fleet matrix or filtered, with JSON output. This validates exactly what a browser visor dials for wss, not just a TCP connect. Building it exposed real bugs: session setup was overwriting a server entry's advertised protocol with the client's usually-empty one, silently downgrading every dial to TCP, and `dmsg conf pull` was stripping the websocket and UDP addresses from the services snapshot — the reason the embedded config advertised wss for only two of nine servers. All fixed, the snapshot refreshed with all nine servers carrying wss and quic endpoints, and visor configs gain `dmsg.carriers`, an ordered carrier preference.

### Skywire: Five Operations Guides

**`4401`** fills the docs gap between the generated command reference and the app guides: cross-cutting CLI conventions, the three sources of transport truth and how to query the network graph, mux route groups and per-leg telemetry, dmsg carriers and server reachability, and deployment health over dmsg — plus a front-page help screenshot and a looping demo of the interactive command browser.

### Skywire: Forks, Not Copies

**`4402`** promotes the four remaining modified in-tree dependency copies — yamux, sysinfo, metrics, gotop — to proper fork repositories with the same changes applied over their upstream bases, imported by their own module paths with no replace directives. The in-tree copies are deleted; each fork carries its upstream test suite.
