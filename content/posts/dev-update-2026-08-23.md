+++
date = "2026-08-23"
tags = ["Development", "Skywire"]
title = "Development Update — August 23"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The proxy status page becomes a live instrument today: it pushes updates over a WebSocket control channel and SSE instead of a full-page refresh, folds the per-leg mux table and full routes into one route tree, and stays reachable even when the exit is down. Underneath it a mux aux-leg race (issue #80) is buffered, another CXO publisher freeze — this one from a batch-rollback cache desync — is cured, and an optional in-process dmsg server that shares the visor key lands, default off.

### Skywire: status.skysocks Goes Live

**`4133`** makes `status.skysocks` live-update over a WebSocket control channel, **`4126`** live-pushes it via SSE and drops the full-page meta refresh, and **`4125`** restores the rich per-leg mux telemetry on the page. **`4137`** folds the per-leg mux table and the full routes into a single route tree, **`4139`** makes that a page-level tree with scroll-preserving live-swap and a mononoki font, **`4143`** adds a tp-tree-style header and legend with active/standby colors (its `tp tree` fetching `days=1`), and **`4136`** is a UX pass over the whole live-update flow. **`4129`** labels a one-hop leg "direct" regardless of route-group orientation, and **`4128`** and **`9b363afce`** keep the status page reachable when the exit itself is down.

### Skywire: The Mux Aux-Leg Race and Route-ID Retries

**`4131`** buffers aux mux legs that race the responder's route-group init — the responder side of issue #80 — so a frame arriving before the aux leg's rules are saved is parked and redelivered rather than dropped. **`4140`** records the full forward hops for every mux leg's telemetry, **`4116`** retries a route-ID reservation on a mid-call stream reset, and **`4138`** sizes the adaptive forward mux on upload (bidirectional sizing) so the forward direction scales with real send demand.

### Skywire: Another Publisher Freeze, Cured

**`4149`** cures a CXO publisher missing-object freeze caused by a batch-rollback cache desync — a rolled-back batch left the cache believing it held an object it had discarded. **`4141`** narrows the TPD feed to sync only live transports' current leaf, keeping dead edges out of the published Root.

### Skywire: An Optional In-Process dmsg Server

**`4147`** adds an optional in-process dmsg server that shares the visor's key (`dmsg.server`, default off), so a visor can also serve dmsg sessions without a separate process. **`4146`** gates hypervisor-transport autoconnect behind `transport.hypervisor_autoconnect` (default on), and **`4132`** permits `.skysocks` in the resolver CA name constraints.

### Skywire: Tests, Refactors and Housekeeping

Transport coverage grows: **`4122`** nudges a re-register on an outbound dial and expands the wasm visor-state introspection, **`4127`** adds a regression guard for that nudge, and **`4121`**, **`4120`** and **`4119`** raise router, transport-manager and skysocks/skyroute coverage. **`4123`** dedups `Execute`/`exampleJSON`/`commaSplit` into `pkg/cmdutil`. The interactive CLI help gains a few cosmetic passes — **`4144`** puts the code-rain behind every command's help, **`4142`** stops dimming a rectangle around the text, and **`4134`** prints the help over a still frame of the rain. On CI, **`4117`** sets `GOPROXY=proxy.golang.org,direct` for dead-repo dependency resilience, **`4115`** sets `fail-fast: false` on the Linux arch matrix, **`4148`** anchors the `dist/` gitignore so develop-latest arm builds aren't stamped `+dirty`, and **`4135`**, **`4124`** and **`4130`** clear lint and fix the dmsgweb/skynetweb test callers for the new status-override argument.
