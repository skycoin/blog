+++
date = "2026-03-29"
tags = ["Development", "Skywire"]
title = "Development Update — March 29"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: LAN DMSG Server Polish and Hypervisor UI Fix

A consolidation day following the LAN DMSG server work from March 28. PR #2264 ("Fix/next") bundled the LAN DMSG server implementation together with the hypervisor UI CPU spike fix into a single merge.

**Recap of the LAN DMSG server** — the hypervisor can now run a private DMSG server on the LAN. Visors connect to it preferentially for local communication, avoiding round-trips through public relay servers. Zero configuration for the hypervisor (`enable: true`), and the server uses `direct.NewClient` for in-memory discovery so it's never registered publicly.

**Hypervisor UI performance** — the transport-list and route-list components in the hypervisor UI were reprocessing all data (label lookups, filtering, sorting) on every 10-second poll even when nothing had changed. `ChangeDetectionStrategy.OnPush` was added to both components, and full reprocessing is now skipped when transport/route IDs haven't changed. For transports, only the sent/recv counters update on unchanged lists. This makes the UI usable on deployments with many transports, where it had been quietly degrading the experience for operators running large public visors.

A quiet day overall, with the focus on stabilizing yesterday's work rather than introducing new features.
