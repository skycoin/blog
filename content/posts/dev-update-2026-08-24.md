+++
date = "2026-08-24"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — August 24, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Today's thread is the transport-discovery feed getting its own dedicated CXO channel so TPD can fill it completely, with a subscriber allowlist gating the service-consumed feeds and the aggregator's node identity bound to TPD's key so gated visors accept it. A survey-key mismatch that had been costing operators their rewards is fixed, the proxy status page gains a bilateral route-group tree with a matching `proxy tree` CLI, and an interactive console over the command tree lands.

### Skywire: A Dedicated Feed for the Transport List

**`4152`** publishes the transport list on its own dedicated CXO feed so TPD fills it completely, rather than competing with per-transport telemetry inside one Root, and **`4155`** surfaces that dedicated tp-list feed in `visor state`. **`4156`** fixes the tp-list CXO aggregator never accepting inbound feeds — a node-listener bind collision — and **`4168`** binds the aggregator's node identity to TPD's key so gated visors accept it. **`4161`** gates the service-consumed CXO feeds with a subscriber allowlist, and **`4164`** makes the TPD uptime feed fillable with one gzipped leaf per window.

### Skywire: Quieter Stats, Fewer Root Churns

**`4159`** change-gates the per-transport current-leaf mirror so an idle transport stops churning the Root, and **`4157`** prunes persisted dead-transport current leaves and lets the feed introspect its own live/dead state.

### Skywire: The Reward Survey Key Fix

**`4169`** reads the survey's public key from the `public_key` field rather than `pk`. The reward server had been reading `pk` while the survey emits `public_key`, so a submitted survey was rejected as "survey pk does not match sender" — a mismatch that silently cost operators their reward credit until now.

### Skywire: The Bilateral Route Tree and an Interactive Console

**`4165`** draws a bilateral route-group tree on the proxy status page and adds a matching `proxy tree` CLI, and **`4158`** adds a per-app event/log ring, populating the status page's Events and Logs and adding a `proxy log` command. **`4150`** adds `--source tps` to `route calc`, computing over the authoritative source and destination transports fetched via the setup node rather than the discovery service. **`4145`** adds an interactive console over the command tree — a TUI that drives the whole CLI surface.

### Skywire: Dependencies, Release and Housekeeping

**`4167`** and **`4160`** vendor the latest skycoin develop and update the Go dependencies, **`4163`** bumps `0magnet/xterm-go` (mirror-glyph option, GPU-context survival), and **`4162`** compresses the Linux and Darwin release archives with `xz -9e` (was gzip) and zips Windows at Optimal. **`4154`** has the dev-visor loop use `go install` and run from `GOBIN`, and **`4166`**, **`4153`** and **`4151`** clear the accumulated lint on develop.
