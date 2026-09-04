+++
date = "2026-08-17"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — August 17, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A large day on the multiplexed data plane. A multi-leg mux route group had been establishing cleanly but carrying no aggregated data — mux=1 was fine, adding a healthy second leg black-holed the transfer to zero bytes — and today three localized bugs behind that are found and fixed, so a mux>1 group finally aggregates. In parallel the routing-policy engine gets its compiled WASM presets embedded and dispatched from one bundle with several new dynamic presets, the native mesh proxies gain a branded route-building interstitial, and the code graph is published as a page on the site.

### Skywire: Making mux>1 Aggregate

**`3954`** is the first partial fix: the asymmetric aux-leg append paths omitted the `drainPendingToGroup` call that `saveRouteGroupRules` makes, so a handshake or data frame that raced the aux leg's rule-save was parked and never redelivered; it now drains the parked frames and surfaces, at WARN, the descriptor a dropped frame resolved to versus the descriptors the router actually holds. **`3955`** fixes stream corruption under load: the receiver's reorder buffer force-flushed past a missing sequence once 64 packets piled up behind it, delivering an out-of-order hole that corrupts the noise/TLS byte stream riding the mux — but the leg transports are reliable and ordered, so a cross-leg gap is latency *skew*, not loss, and the buffer must hold it, never skip; compounding it, an out-of-order packet fired an immediate SACK that retransmitted the whole 64-window with no age check, a self-amplifying ~7x storm that never converged. **`3958`** closes it out: self-heal appended the replacement leg forward-only, deleting the initiator's consume rule so the aggregated download landed on a leg it could not receive on (and because the reorder buffer is now lossless, the missing sequences head-of-line-stalled the primary leg too); the replacement is now appended full-duplex, with GROW planning locally first.

### Skywire: mux-bw and the Route Candidates

**`3961`** fixes the mux-bandwidth measurement itself: it had dialed N copies of *one* route rather than N disjoint routes, so it was never measuring an aggregated path. It now dials N disjoint routes via explicit hops. **`3964`** has the mux emit per-leg bandwidth and identity samples for the policy engine to measure against.

### Skywire: WASM Routing Presets, Embedded and Dispatched

**`3962`** adds a per-file embed registry of precompiled TinyGo routing-policy modules, resolving `preset:<name>` to the WASM backend when the name matches a wasm preset and otherwise falling through to Starlark, and **`3963`** combines them into one dispatched `bundle.wasm`. On top of that base come the dynamic presets: **`3967`** adds `latency-adaptive` (evict-slowest, hysteresis-damped), **`3968`** makes it symmetric so its `on_tick` can act, **`3969`** gives it a stable per-leg transport ID and EWMA-smoothed eviction, and **`3971`** adds `elastic-mux` and `probe-and-prune`. **`3966`** closes a live-swap gap: `app start --routing-policy` only installs before start, and the `SetAppRoutingPolicy` RPC had no CLI verb, so `visor app arg routing-policy <name> <policy>` now installs a preset, `.star` or `.wasm` policy on a *running* app with the route-selection hook swapped live — verified live installing `preset:rotating-bw` on a running skysocks-client without restarting it.

### Skywire: A Branded Interstitial for the Native Proxies

**`3952`** serves a self-contained branded "building a route over skywire" page while a mesh route is still being established, instead of a raw connection error or a mute hang — the native counterpart of the wasm-visor's in-tab interstitial. The new `pkg/proxyinterstitial` provides a transient variant (spinner plus meta auto-refresh) and a hard-error variant (no refresh, Retry), a synthetic `net.Conn` that serves the page as a one-shot HTTP response, and a minimal deadline-bounded SOCKS5 responder for the transparent-tunnel case. **`3956`** serves it from the mesh reverse-proxy and **`3960`** serves it fast while a cold route warms. **`3957`** sources the browse-origin domain from `services-config.json` rather than a hard-coded value.

### Skywire: The Code Graph, Published

**`3959`** publishes the codebase-memory code graph as a static page on the docs site. Two properties make its three.js viewer publishable as static files: the layout is computed server-side, so the browser is only a renderer with no simulation to run, and a static host ignores the query string, so one `api/layout` JSON file answers every request the viewer makes whatever parameters it appends. `docs/graph/` is therefore the upstream viewer bundle plus one JSON file. Alongside it, **`3953`** updates the Go dependencies to latest and regenerates the wasm blobs, and **`3970`** ages the retx entries past `retxMinAge` in a router test so it exercises the real retransmit path.
