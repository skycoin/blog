+++
date = "2026-08-26"
tags = ["Development", "Skywire"]
title = "Development Update — August 26"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A day built around one idea, taken from RFC to on-by-default before it is out: per-frame noise for mux aggregation. Rather than striping a route group's single noise-encrypted byte stream across legs and reordering it back together on the far side, noise is applied per frame, so each frame decrypts on its own and legs aggregate a single stream with no cross-leg reordering at all — the root of the reorder-buffer hazards the data-plane fixes have been chasing. Around it: a routing lock fix, the visor-state fields to actually watch the new path work, and a cluster of CI and skysocks housekeeping.

### Skywire: Per-Frame Noise Inverse-Mux

**`4218`** is the RFC for single-stream mux aggregation via per-frame noise, and **`4219`** implements it, environment-gated. The existing mux splits a route group's noise-encrypted byte stream across legs, which forces the receiver to reorder across legs before it can decrypt. The inverse approach applies noise per frame, so each frame is independently decryptable and legs aggregate a single stream without cross-leg reordering. Once measured, **`4220`** drops the environment gate and turns it on by default, and **`4225`** fixes the handshake so each side only writes its KK message on its own turn rather than both sides writing at once.

### Skywire: A Routing Lock Fix

**`4217`** stops holding the router's `r.mx` mutex during the accept send in `IntroduceRules`, so a slow accept can no longer block the rest of the routing table behind the lock.

### Skywire: Watching the New Path — Wider Visor State

To make the per-frame path observable in state rather than only in logs, **`4226`** exposes `per_frame_noise` on route groups in `visor state` and mux info, and **`4227`** widens visor state further with mux distribution, reorder and aggregate-byte counters plus per-transport byte totals.

### Skywire: Skysocks and CI Housekeeping

**`4222`** breaks the skysocks IPC read loop on error instead of spinning on it. On CI, **`4221`** moves to the latest Go (1.27.0) and golangci-lint (v2.13.1), while **`4223`** keeps `go.mod` pinned to the minimal required Go (1.26.4) rather than the CI toolchain version, and **`4224`** has the publish-binary step upsert the rolling release instead of delete-before-create.
