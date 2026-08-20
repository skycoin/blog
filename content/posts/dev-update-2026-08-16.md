+++
date = "2026-08-16"
tags = ["Development", "Skywire"]
title = "Development Update — August 16"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A focused day on the browser visor and the vendored forks behind it. The wasm-visor tour gains a real file browser and a set of hardening fixes, its HV-UI caches are pre-warmed at boot so the first visit is instant, the bundled wallet surface is corrected on two fronts, and the hand-copied `0magnet` module sources are dropped in favor of importing the forks by their own paths.

### Skywire: The 0magnet Forks, Imported Not Copied

**`3951`** removes the hand-vendored copies under `third_party/0magnet` and requires the modules by their own paths. The copies were staging — sources vendored by hand so the browser-terminal work could move without a round trip through another repository — and that trade had stopped paying: they had already fallen behind, `xterm-go` and `websh` having gained a `ResizeObserver` that re-fits the terminal to its container rather than the window, which is exactly what the hypervisor UI needs, since its terminal lives inside a WinBox window. No replace directives are needed — each fork is a module in its own right and resolves normally — and only four files outside the copied trees imported them, none reaching into an `internal/` package, so the rewrite is a straight path substitution that also picks up an afero fix narrowing the TinyGo shims to `js/wasm` where they belong.

### Skywire: The wasm-visor Tour, Hardened

**`3950`** adds a GUI file browser and a set of tour fixes. The file browser is a WinBox app over the websh filesystem — breadcrumb path, dir/file listing, `mkdir`/new-file/delete, and a text viewer/editor with save — sharing one afero `MemMapFs` with the websh terminal (the per-shell VFS is hoisted to a package-level `sharedShellFS`), so a file created in the terminal is visible in the browser and the reverse. Services-Health lists the dmsg servers this visor holds a session with, seeded OK because holding the session means they are reachable by definition; it deliberately does not probe their `/health` over dmsg, since a server serves that on its transit client entry reachable only via a different relay, so dialing it through the very session held with it would block past the deadline. The same PR carries the tp-viz crash and clearnet-legibility fixes.

### Skywire: The Wallet Surface, Corrected

The bundled skycoin-web wallet is an iframe target for the HV UI, its node API routed through `window.parent.skywireVisor` over the mesh, so it only makes sense framed by the booted hypervisor. **`3949`** gates on `Sec-Fetch-Dest`: a top-level navigation to a wallet page (out of context — no parent visor, degraded "node unreachable" state) is `303`-redirected into the HV UI, while framed loads and asset/API requests fall through and serve as before. **`3948`** fixes a `/wallet` "Go is not defined" error: the wallet keeps key material in `window.SkycoinCipher` globals published by the visor blob's joint-compiled cipher, but the `:8443` `/wallet/` iframe is a window separate from the SharedWorker running the visor, so the wallet fell back to loading `skycoin-lite.wasm` and `wasm_exec.js` — which the serve did not provide, giving a 404 — now served as the joint-compiled visor blob with its matching runtime.

### Skywire: Instant First Paint

**`3946`** pre-warms the HV-UI caches at boot: about 20 seconds after dmsg is up, the service-health, network-view and network-transports caches are populated so those tabs render immediately on first visit instead of triggering a cold multi-second aggregation the tab's poll would cancel. Once populated, the cache serves the snapshot instantly forever under stale-while-revalidate, so the ~28s aggregation never blocks a response again. It also lengthens the TTLs (network-view 5 min, transports 2 min) to cut background refresh churn on the single-threaded runtime, and mounts `/api/client-log` so the Angular error reporter's `sendBeacon` POST is accepted and discarded rather than 404'ing.
