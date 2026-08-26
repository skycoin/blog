+++
date = "2026-08-26"
tags = ["Development", "Skywire"]
title = "Development Update — August 26"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A short, pointed day that opens a new direction for mux aggregation: rather than striping a stream across several route groups and reassembling it, aggregate at the frame level under a single noise stream, so the receiver never has to reorder across legs at all. It lands behind an environment gate alongside a small routing lock fix.

### Skywire: Per-Frame Noise Inverse-Mux

**`4218`** is the RFC for single-stream mux aggregation via per-frame noise, and **`4219`** implements it, environment-gated. The existing mux splits a route group's noise-encrypted byte stream across legs, which forces the receiver to reorder across legs before it can decrypt — the source of the reorder-buffer hazards the data-plane fixes have been chasing. The inverse approach applies noise per frame, so each frame is independently decryptable and legs aggregate a single stream without cross-leg reordering. It is off by default while it is measured against the existing mux.

### Skywire: A Routing Lock Fix

**`4217`** stops holding the router's `r.mx` mutex during the accept send in `IntroduceRules`, so a slow accept can no longer block the rest of the routing table behind the lock.
