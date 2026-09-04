+++
date = "2026-07-11"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — July 11, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Yesterday's coin-node discovery had a destination in mind, and today it arrived: a skycoin wallet that runs inside a browser tab, with its keys and wallets held entirely client-side and its only network traffic — the node API — routed over the encrypted mesh. It's a direct substitute for the discontinued skycoin mobile wallets, needing no local full node and no clearnet. The same day, skycoin-web was folded into the visor's internal-app model so it launches the same way everywhere, setting up the convergence between the host-native and browser paths.

### Skywire: A Skycoin Wallet in a Browser Tab

**`3443`** feat(wasm-visor): bundle skycoin-web wallet into the PWA, route node API over dmsg bundles the skycoin-web thin-client wallet into the browser hypervisor PWA, served same-origin at `/wallet/`. The wallet itself never loads over dmsg — only its node API does — so the crypto is the vendored `skycoin-lite.wasm` running client-side, wallets live in the browser's localStorage, and there is no backend to trust. It leans on a single vendored upstream change (skycoin's own PR, frozen in as a transport-agnostic asset to avoid a dmsg import cycle): a `make embed-wallet` target syncs the vendored dist into the embedded static tree, `hv serve` serves it and rewrites the base href, `browse.js` opens it from the ☰ menu, and a fetch shim intercepts the wallet's same-origin `/api/v1|v2` calls and bridges them over dmsg to the configured coin node — the very `type=coin` forward that landed yesterday.

**`3444`** feat(wasm-visor): skycoin-web wallet over dmsg — iframe fetch shim + default deployment node makes it work out of the box. The node API is routed over dmsg by a `window.fetch` override injected straight into the wallet's index page rather than by a Service Worker, so it works under the test harness and from `file://` too. Just as importantly, it now reads the chain with zero configuration: the wasm wallet defaults its coin-node setting to the production node over the mesh instead of returning "no coin node configured," the host-native config generator defaults the same node URL and injects proxy environment when a resolving proxy is enabled, and the services config gains `dmsg://…` addresses for the node, explorer, and blog on both the production and test deployments — one dmsg address that all three consumers resolve. The node was verified reachable over dmsg live on both the node.skycoin.com and theskywirenetwork.net hosts.

### Skywire: skycoin-web as an Internal App

**`3447`** feat(skycoin-web): run as an internal launcher app (default) makes skycoin-web *just another internal app*, so the launch path is identical on the host-native visor and — in the next step — the browser wasm visor. skycoin-web had been the odd one out, a raw external subprocess, which is exactly why it never dropped onto the wasm visor, where a tab can't spawn child processes. Registered as an internal app it goes through the same in-process run path the wasm visor already uses for skychat, with the per-platform serving body as the only remaining seam; the external form — `skywire skycoin web` with its own `--wallet-dir` and privilege drop — stays available as the opt-in. It rides a vendored skycoin bump to a context-cancellable graceful serve, the prerequisite for an internal app to stop it cleanly without calling `os.Exit`. The skycoin *daemon* stays external and remote by nature — a full node is too heavy for a tab, which instead connects to a remote node over dmsg.
