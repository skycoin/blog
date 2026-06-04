+++
date = "2026-05-31"
tags = ["Development", "Skywire", "Routing"]
title = "Development Update — May 31"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A short day, mostly routing-policy ergonomics: the policy's rotation callbacks get richer inputs, and the proxy and VPN clients learn to take a `--routing-policy` directly on the command line.

### Skywire: Routing Policy — Richer Rotation, CLI Wiring

**`2938` feat(router/policy): expose leg byte counters and hop chain to rotation callbacks** — a policy's rotation callback now receives the per-leg byte counters and the hop chain. A rotation policy can make decisions on real data — "this leg has moved very little traffic" or "this path runs through an intermediate I want to avoid" — rather than rotating blindly on a timer.

**`2937` feat(cli): --reconnect + --routing-policy on proxy start; --routing-policy on vpn start** — `skysocks-client` (proxy) and the VPN client take a `--routing-policy` flag directly, so an operator can launch an app under a specific policy without pre-registering it, plus `--reconnect` on proxy start. The policy system meets the app launcher.

### Skywire: Hypervisor

**`2939` fix(hypervisor): guard getPty against nil PtyUI instead of crashing the visor** — `getPty` guards against a nil `PtyUI` rather than dereferencing it and taking the whole visor down. A defensive fix in the management plane.

### Skywire: Misc

- The embedded reward script's default mode was adjusted (`2943`).
