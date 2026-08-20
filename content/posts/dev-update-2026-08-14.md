+++
date = "2026-08-14"
tags = ["Development", "Skywire"]
title = "Development Update — August 14"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A broad day of hardening under two headings: the network visualizer moves onto a WebGL renderer that is a role of the single wasm-visor blob rather than a second binary, and a run of correctness fixes — a runtime CPU peg in the browser visor, the browse-origin routing finally under test, and a lint-and-format sweep that unblocks every open PR. Alongside them the routing-policy library rounds out with three new presets and the vendored forks are synced back to their upstreams.

### Skywire: The Network Visualizer, on One Blob

**`3907`** makes the cosmos-go WebGL2 view the network visualizer's default, and **`3902`** is the structural change behind it: the cosmos-go graph no longer needs to be a second wasm the browser fetches. Following the websh "shell" role precedent — one binary, several DOM-side roles picked by `globalThis.__SKYWIRE_WASM_ROLE__` — the WebGL view becomes a `netview` role of the same wasm-visor blob, loaded a second time in the main thread where the canvas lives (so no OffscreenCanvas), reaching the worker-side visor for its data over the existing `skywireVisor` proxy. `pkg/tpviz/wasmgl` drops its blocking `main` for an exported `Register()`, with a thin standalone entrypoint kept for the native tpviz server. **`3908`** resolves the cosmos-go wasm assets against the bundle URL rather than the document, and **`3912`** removes the now-dead `tpvizwasm` view along with its 11 MB stale committed blob.

### Skywire: The Browser Visor Stops Pegging a Core

**`3924`** fixes a 100% CPU peg in the in-tab wasm-visor: `hashicorp/yamux` v0.1.2's `Stream.Read`/`write` spin a single goroutine forever when the session is torn down mid-read — the `WAIT` select's `shutdownCh` case has no body, so it falls through to a `goto START` that only inspects per-stream state, and a stream left `streamEstablished` when its session closes underneath an in-flight read loops back to `WAIT`, allocating a fresh timer every pass (~370k/s). On single-threaded js/wasm that one goroutine starves the whole runtime, common when a dmsg WS/WebRTC carrier drops during a dial. The fix returns `ErrSessionShutdown` from the `shutdownCh` case — a shut-down session can neither deliver data nor drain the send window, so returning is strictly correct — shipped through the in-module `third_party/hashicorp/yamux` copy with the same fix filed upstream. **`3910`** makes the in-tab mesh browser work when the visor page is loaded via `127.0.0.1` or `[::1]` rather than `localhost`.

### Skywire: Browse-Origin Routing, Under Test

**`3925`** puts the browse-origin path — 1275 lines across `meshproxy.go` and `wasmserve.go`, live on the hosted deployment and previously untested — under assertions. The host-suffix and routing decisions are pure functions: `normalizeMeshSuffix`, `hostWithoutPort`, `peelNetLabel`, `rewriteMeshLocation` (asserted both directions, since getting it wrong either strands the user on clearnet or rewrites a genuinely external redirect into a bogus same-origin path), `isMeshBrowseHost`, and `wasmPasswordGate` — the only thing between a non-loopback listener and an unauthenticated hypervisor, now pinned to prove the unauthenticated body never leaks protected content, a wrong password mints no cookie, and the cookie is `HttpOnly`/`SameSite=Strict`. The same PR fixes three CLI flag hazards found while auditing the surface. **`3926`** gives `hv probe` an exit-code contract so it can gate CI.

### Skywire: Build Hygiene, Forks Synced, Housekeeping

**`3929`** gofmts every remaining file so the lint step stops failing on all open PRs, and **`3930`** makes the build refuse to produce a committed wasm blob without provenance. The vendored forks are synced back to their upstreams: **`3906`** for the `xterm-go` and `cosmos-go` ports and **`3904`** for `0magnet/sh/v3`. **`3905`** has websh handle the errors the shell was discarding, **`3903`** mirrors panic/fatal tracebacks to `skywire-crash.log` and adds a `dev-visor-loop.sh`, **`3911`** bumps the CI actions (setup-java v5, gradle v6, setup-tinygo v3) and `go mod x/mod`, **`3913`** rewrites a VPN killswitch integration test to assert the outcome rather than one brittle error string, and **`3909`** restores a blank line before the mode badge's return in the UI.

### Skywire: Routing-Policy Presets

**`3901`** rounds out the built-in routing-policy library and closes its CLI discoverability gap. A new DSL primitive `peers.has_transport(pk)` reports whether the visor already holds a live transport to a peer, wired through the `Provider` interface and the Starlark `peers` module. Three presets land — `prefer-connected` (reuse existing transports: direct when connected, else multihop through peers we are already wired to), `balanced` (a two-leg `min_hops=1` middle ground), and `hypervisor-priority` (fast, resilient paths for low-bandwidth control dials, explicitly not a data-plane policy) — all of which shape skynet routes over real transports and never the dmsg relay, which stays the signalling substrate. `skywire cli route policy list` enumerates the presets with one-line summaries and `show <name>` prints a preset's Starlark source.
