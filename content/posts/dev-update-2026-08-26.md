+++
date = "2026-08-26"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — August 26, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A day built around one idea, taken from RFC to on-by-default before it is out: per-frame noise for mux aggregation. Rather than striping a route group's single noise-encrypted byte stream across legs and reordering it back together on the far side, noise is applied per frame, so each frame decrypts on its own and legs aggregate a single stream with no cross-leg reordering at all — the root of the reorder-buffer hazards the data-plane fixes have been chasing. Around it: a routing lock fix, the visor-state fields to actually watch the new path work, and a cluster of CI and skysocks housekeeping. The afternoon kept building on the new path: warm-standby aux legs, live mux control, the no-skip reorder rule that ends a stream-corruption class, and a predictive scheduler.

### Skywire: Per-Frame Noise Inverse-Mux

**`4218`** is the RFC for single-stream mux aggregation via per-frame noise, and **`4219`** implements it, environment-gated. The existing mux splits a route group's noise-encrypted byte stream across legs, which forces the receiver to reorder across legs before it can decrypt. The inverse approach applies noise per frame, so each frame is independently decryptable and legs aggregate a single stream without cross-leg reordering. Once measured, **`4220`** drops the environment gate and turns it on by default, and **`4225`** fixes the handshake so each side only writes its KK message on its own turn rather than both sides writing at once.

### Skywire: A Routing Lock Fix

**`4217`** stops holding the router's `r.mx` mutex during the accept send in `IntroduceRules`, so a slow accept can no longer block the rest of the routing table behind the lock.

### Skywire: Watching the New Path — Wider Visor State

To make the per-frame path observable in state rather than only in logs, **`4226`** exposes `per_frame_noise` on route groups in `visor state` and mux info, and **`4227`** widens visor state further with mux distribution, reorder and aggregate-byte counters plus per-transport byte totals.

### Skywire: Skysocks and CI Housekeeping

**`4222`** breaks the skysocks IPC read loop on error instead of spinning on it. On CI, **`4221`** moves to the latest Go (1.27.0) and golangci-lint (v2.13.1), while **`4223`** keeps `go.mod` pinned to the minimal required Go (1.26.4) rather than the CI toolchain version, and **`4224`** has the publish-binary step upsert the rolling release instead of delete-before-create.

### Skywire: The Reorder Buffer Never Skips a Gap

**`4228`** has the initiator offer per-frame noise on its very first handshake, not only on re-handshakes. **`4238`** changes the reorder buffer's contract: it never skips a gap — a missing packet is retransmitted in order rather than flushed past, which fixes a stream-corruption class — and **`4239`** sizes the buffer to the path's bandwidth-delay product and drops rather than skips at the memory cap. **`4233`** adds a timer-driven flush so a stalled leg degrades gracefully instead of freezing the stream.

### Skywire: Warm Standby, Live Control and a Predictive Scheduler

**`4230`** puts newly added aux legs into warm standby, promoted at the engine's pace instead of dumped straight into the active set, and **`4234`** adds live mux control — mode, cap and width adjustable on a running route group — plus a goodput-weighted ramp. **`4240`** introduces the ECF predictive scheduler (`proxy mux mode ecf`), **`4244`** allows removing the primary mux leg (the group re-homes onto a survivor) for exact route control, and **`4243`** adds `proxy start --route` to pin explicit routes at session start.

### Skywire: Watching It Work

**`4229`** puts per-leg goodput on the proxy status page, the `proxy tree` view and the mux JSON, and **`4232`** splits it into up/down with per-direction share bars and fixes the direct leg's rtt. **`4231`** adds per-visor transport-discovery stats to the CLI, **`4241`** bounds the service-health probes so one dead endpoint can no longer stall `visor state`, **`4236`** fixes the mux cap/width confirmations, and **`4235`** and **`4237`** clear lint.
