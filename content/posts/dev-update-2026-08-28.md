+++
date = "2026-08-28"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — August 28, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Forward error correction lands in the packet mux. Of the three named escapes from the in-order-stream wall, FEC is the first to ship: repair packets ride alongside data so a lost packet on one leg is reconstructed at the far end instead of stalling the reorder frontier until retransmit. Alongside it, retransmit timing itself gets modern — a RACK-derived threshold replaces the fixed timer — and the two ends of a route group start telling each other which legs are active.

### Skywire: Forward Error Correction

**`4278`** contributes the coding core — a systematic Cauchy-Reed-Solomon erasure code — and **`4282`** wires it into the packet mux as negotiated, per-group FEC. **`4284`** passes the symbol length through the repair-packet send/receive path, and **`4297`** fixes routing so RepairPacket is actually forwarded at every hop rather than dropped at the first intermediary. **`4292`** adds the telemetry — repair bytes and reconstruct counts in `visor state` — to see it earn its overhead. **`4285`** and **`4286`** write the design down: the reorder buffer never releases or skips a gap, and the three escapes from the in-order-stream wall are FEC, scheduling, and range-splitting.

### Skywire: Retransmit on Evidence, Not a Timer

**`4295`** replaces the fixed 750ms retransmit threshold with a RACK-derived one — a packet is declared lost relative to the most recently acknowledged send, scaled by measured RTT. **`4299`** adds the tail-loss probe for losses no later packet can expose, and DSACK-driven adaptation of the reorder window so spurious retransmits teach the sender patience.

### Skywire: Leg Guards, Both Directions

The leg-lifecycle work continues: **`4262`** sheds a goodput-black-hole leg even when the frontier looks healthy, **`4280`** reaps and replaces a black-holing *sole* leg, **`4264`** dynamically re-elects the primary when it falls out of band, **`4265`** parks rather than removes stalled legs in manual mode, and **`4263`** tightens the active-latency band in capacity mode. **`4272`** and **`4273`** make the band read a fast-clustered, transport-RTT-backed latency rather than raw EWMA, and **`4275`** goodput-gates the band demotion so a carrying leg is not demoted on latency alone. **`4300`** and **`4302`** introduce CapLegState — each side signals a leg's standby/active transitions, and its born-standby state, to the peer — and **`4303`** adds a per-leg unique-payload counter for confound-free per-direction telemetry. **`4261`** gates `proxy switch` on leg-alive rather than non-standby.

### Skywire: In the Browser

**`4279`** adds an optional Go/wasm transport worker for browse origins — off by default, deliberately: the JavaScript worker's security property is that a hundred auditable lines on the untrusted origin name no transport, and the wasm variant exists to test that implementation, failing closed where the role is absent. **`4293`** raises the nested-browser window when its content is clicked, and **`4296`** fast-rewarms the in-tab proxy when a suspended tab wakes.

### Skywire: CLI, Pty and the Rest

**`4266`** streams pty exec output over HTTP instead of buffering it against a 16MiB cap. **`4267`** stops truncating public keys in logs and CLI output. **`4281`** adds `--direct` to `proxy start`, **`4283`** reports `/health` transport stats for all transport types rather than a hardcoded few, and **`4294`** draws the mux route tree on the manager UI's node Routing tab. **`4268`**, **`4274`** and **`4276`** cover dependency, lint and log-tag housekeeping.
