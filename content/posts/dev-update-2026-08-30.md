+++
date = "2026-08-30"
tags = ["Development", "Skywire"]
title = "Development Update — August 30"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A performance campaign against the route finder, end to end: from per-request graph builds and path-copy storms down to landmark routing that composes far routes through the mesh's natural hubs. Around it, range-splitting extends to HTTPS, routes gain a transport-type exclusion knob, and `route calc` learns to report how much disjoint capacity actually exists between two visors.

### Skywire: The Route Finder Gets Fast

The route finder answered every source/destination pair with an exhaustive search over the dense transport graph, rebuilt per request. **`4378`** replaces path-copying with parent-pointer BFS, **`4380`** shares one background-refreshed route graph across requests, **`4385`** memoizes weighted route results per graph, and **`4386`** byte-sorts the search keys to kill string-conversion churn. **`4390`** caps the campaign with landmark routing: routes between every node and the highest-degree hubs are precomputed once per graph, and a far pair is answered by composing source-to-hub and hub-to-destination — with a shallow direct search keeping the optimal answer for near pairs and a full search as fallback, so nothing regresses. Composing via different hubs yields disjoint mux legs for free. On the visor side, **`4382`** builds local-route lookups once per discovery snapshot rather than per dial, and **`4383`** pins the transport feed so route calculation stops re-handshaking.

### Skywire: Range-Splitting Reaches HTTPS

**`4359`** adds TLS-terminating HTTPS range-splitting to the SOCKS5 proxy — strictly opt-in, behind a locally generated root the operator must install — extending yesterday's plain-HTTP GET striping to the traffic that actually dominates. **`4360`** creates that root at startup rather than first dial, and **`4375`** keeps a split chunk retrying through a tunnel rotation instead of failing the download.

### Skywire: Choosing Transports for Routes

**`4368`** adds `route_exclude_transport_types` — hard-exclude a transport type from route building — and **`4373`** applies it to the mux candidate path too. **`4361`** and **`4362`** add `route calc --capacity`, reporting the disjoint, multiplexable route ceiling from the two visors' actual transport intersection. **`4370`** raises the WebRTC transport's SCTP receive window off its 1 MiB default and surfaces dead channels.

### Skywire: Mux Polish

**`4372`** caps per-leg FEC-block striping so a stalled leg stays FEC-recoverable, **`4376`** holds at least two active download legs and applies the floor to a live group, **`4377`** parks rather than removes data-stalled legs under a stuck frontier, **`4354`** confines the upload to the primary leg when there is no direct leg, and **`4374`** returns route groups in a stable order. **`4388`** resets the default routing policy to none — the adaptive engine remains a choice, not a surprise.

### Skywire: Status, CLI and CI

On the proxy status page, **`4363`** makes the route graph opt-in and pauses it when hidden, **`4366`** renders the standby route fan with real endpoints, and **`4367`** stabilizes leg order so the tree stops reshuffling. **`4364`** reads CXO-backed discovery URLs straight through instead of via a stale disk cache, **`4365`** makes a bare `ut` online query fetch one day rather than thirty, and **`4371`** surfaces direct/payload/directional counters in the mux-info JSON. **`4379`** backs off a spinning accept loop, **`4358`** auto-reloads the browser interstitial once the route is up, and **`4356`** and **`4357`** make CI fail when the committed wasm-visor blob is stale against its source — with the routine blob refreshes landing alongside.
