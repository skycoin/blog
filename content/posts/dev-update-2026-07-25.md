+++
date = "2026-07-25"
tags = ["Development", "Skywire"]
title = "Development Update — July 25"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A short day, spent making the browser hypervisor tell the truth. The AU miner owner reported that the wasm hypervisor's node list looked broken next to the native one — managed visors showing `Total: 0` transports, a single flat list where the native HV renders per-hypervisor clusters, and the whole thing flickering as visors blinked offline and back. All three are the same underlying gap: the wasm HV was rendering from partial mirror data over a marginal dmsg link. Today's work closes those, then rebuilds the served blob so the fixes actually reach the PWA, and the network visualizer gets a small cosmetic win.

### Skywire: The wasm Hypervisor, Matching the Native HV

**`3589`** feat(wasmhv): real transport counts + per-hypervisor node sections + flap resistance runs down all three node-list defects. The `Total: 0` transports came from remote mirrored `Overview`s arriving with **nil** transports — `Overview.transports` is unexported and gob-skipped, and `SetSelfTransports` was only ever called for the self visor — so `overviewOf`/`summaryOf` now fetch each remote visor's transports via the Transports RPC and attach them, giving the node table the real count the way the native HV builds it locally. The missing per-hypervisor clusters came from `/visors-tree-summary` hardcoding a single section keyed by this HV's PK; `treeSections()` now emits section 0 plus one section per connected visor that is itself a hypervisor, its members being the visors that report it in `connected_hypervisor`, so the UI renders separate clusters with no Angular change. The flicker is the wasm visor's marginal dmsg link: a transient RPC timeout blinked a visor to offline or its count to zero, and the newly-added transport RPCs would have made it worse — so short per-visor caches (transports reused for 20s, a failed `Summary` falling back to last-known within a 45s grace) both cut RPC load and stop the blinking. **`3590`** chore(wasmhv): rebuild embedded Go wasm-visor blob (geo + node-list fixes) regenerates the committed std-Go wasm-visor blob so the served PWA actually carries #3589 plus the earlier country-geo work (#3588); deterministic gzip, only `wasm-visor.wasm.gz` changes. Go remains the default served variant — the TinyGo blob needs the fork build and refreshes at release time.

### Skywire: Network Visualizer

**`3591`** feat(tpviz): render country-less satellites as 🛰️ on the overlay draws country-less visors — "satellites" — as 🛰️ glyphs on the boundary-overlay canvas at their fixed positions, instead of dim dots. They stay static so the WebGL edge layer (points-only in the cosmos view) keeps its connections intact, and the result reads closer to the classic Flat view.
