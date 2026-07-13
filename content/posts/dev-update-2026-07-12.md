+++
date = "2026-07-12"
tags = ["Development", "Skywire"]
title = "Development Update — July 12"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The browser and the native visor kept converging on the hypervisor UI today. The skycoin wallet — which had been a browser-tab feature — became something the native visor serves too, at the same same-origin `/wallet/` path, proxying the node API over dmsg on the server side exactly as the browser proxies it in-tab; so the wallet is now a hypervisor *feature*, available with no separate process and no port, on either kind of visor. The browser tab, in turn, gained the apps-management surface and an "about" entry it had been missing, and the whole wallet configuration story got a proper panel. Underneath the features, a real node-list hang got fixed, and two reference documents landed.

### Skywire: The Wallet on the Native Visor

**`3453`** feat(hv-ui): HV-served skycoin wallet on the native visor (/wallet/ over dmsg) makes the native hypervisor serve the embedded skycoin-web bundle at `/wallet/` and proxy its node API to the configured coin node over the visor's own dmsg client — no skycoin-web process, no listening port, the server-side twin of the browser tab's in-page fetch shim. The wallet's crypto stays client-side and its wallets stay in browser storage; only the node connection crosses the mesh. It ships with a full backend-configuration panel: a browser-versus-remote wallet-storage toggle, a multi-coin node list that drives the coin node the wallet queries over dmsg, and an optional Bitcoin backend — with the coin node stored under a single localStorage key the native and wasm shims and the config panel all share, so configuration is unified across both visors and the ☰-launched window. The same work made the wallet a first-class feature rather than an app: the misleading skycoin-web server status was demoted out of the header into an optional "run one locally" control, the wallet tab now appears on the browser visor too (its node API works over dmsg there, with the native-only daemon controls hidden), and the taskbar wallet window gained an inline coin-node config strip. Assorted UI polish rode along — a settings button that had been rendering `[object Object]` from a duplicated translation key, and a low-contrast configuration panel brought up to a legible, measured contrast ratio.

### Skywire: Browser–Native Parity

**`3449`** feat(wasm-visor): apps management for the browser tab (parity with native) ports the apps-management surface to the wasm visor, so the shared Angular Apps tab lists and controls the browser tab's internal apps the same way it does on a native visor — the browser tab was previously missing the self-app and controller cases that back that tab. **`3451`** feat(hv-ui): "about" entry in the ☰ menu adds an about dialog to the taskbar menu on both UIs, reading the visor's build information so the native and wasm menus stay equivalent. **`3450`** feat(skycoin-web): add `skywire app skycoin web` command finishes the internal-app convergence from yesterday by giving skycoin-web its own CLI verb and documenting that the internal-app privilege-drop is a no-op when run in-process.

### Skywire: A Hang, and Two Reference Docs

**`3448`** fix(hv-ui): node-list hang, empty tree-summary, and /api/log SSE errors fixes a hypervisor UI that hung on the loading spinner. A tree-summary with an error section emitted a nil Go slice as JSON `null`, which the Angular switcher tried to `.map` over and threw; and separately, the server's ten-second write timeout was tearing down long and streaming responses — the log SSE stream and the slow tree-summary walk — mid-flight. The fix coerces the empty slice to `[]` with a client-side array guard, and overrides the write deadline per response so a streaming or slow endpoint isn't killed at ten seconds. Any new SSE or slow endpoint now has to do the same.

**`3452`** docs(design): GUI visor-app serving modes writes down the axis these last two weeks kept circling — how an app's UI is reached, whether through the visor's control surface or its own port, and what "serverless" and "HV-served" actually mean — and records that the wallet is a feature, not an app. **`3454`** docs: glossary of Skywire terms adds a glossary of the vocabulary the codebase has grown, from dmsg and visorcore to the ☰ menu and the coin backend, wired into the documentation site's navigation.
