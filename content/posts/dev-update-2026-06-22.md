+++
date = "2026-06-22"
tags = ["Development", "Skywire"]
title = "Development Update — June 22"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Today the visor learned to compile under TinyGo, and then to assemble itself inside a browser tab. This is the build-out of the wasm-visor: a real Skywire visor — router, transport manager, app server, and a hypervisor UI — running entirely in-browser as WebAssembly, reachable and routable over the same network as a native node. Getting there meant porting one subsystem at a time to a toolchain that has no `net/http`, no `net/rpc`, and no TCP ingress, then bolting the ported pieces together into a working "edge" visor and giving it browser-native ways to dial its peers. The day's PRs read like a checklist of that ascent: package-by-package TinyGo compilation, a reflection-free gob RPC shim to replace `net/rpc`, the edge assembly itself, and the first two visor-to-visor transports a browser can actually open — direct WebSocket and direct WebTransport.

### Skywire: Compiling the Visor Under TinyGo

The wasm-visor targets the TinyGo compiler, which produces far smaller WebAssembly than the standard Go toolchain but rejects large swaths of the standard library — reflection-heavy `net/rpc`, `net/http` server internals, and anything that assumes a real socket. Each core subsystem had to be made to compile cleanly under that constraint without forking the native code path.

**`3207`** refactor(transport/network): compile under TinyGo (decouple addrresolver + appevent) and **`3208`** feat(transport): compile the transport Manager under TinyGo bring the transport layer over first, decoupling the address-resolver and app-event dependencies that dragged in incompatible packages so the Manager itself builds for `js/wasm`. **`3210`** refactor(rfclient): split net/http impl from the interface (TinyGo prep) separates the route-finder client's interface from its `net/http`-backed implementation, so wasm can satisfy the interface a different way while native keeps its HTTP client. **`3211`** refactor(routing): un-exclude core routing types from the js/wasm build reverses an earlier blanket exclusion — the core routing rule and route types are pure data and belong in the browser build.

The RPC plumbing was the hardest single dependency. **`3209`** feat(gobrpc): net/rpc-compatible gob shim; migrate router off net/rpc introduces `gobrpc`, a drop-in gob-encoded RPC layer that mirrors the `net/rpc` API but without the reflection machinery TinyGo can't handle, and moves the router onto it. **`3213`** feat(router): compile pkg/router under TinyGo (edge-only browser visor) then brings the router itself over as an edge-only build — a browser visor originates and terminates routes but is not a transit relay.

With transport and routing compiling, the app framework followed package by package: **`3214`** feat(app): compile pkg/app/appcommon + appnet under TinyGo, **`3215`** feat(app): compile pkg/app/appevent under TinyGo (+gobrpc Dial/Accept) wiring the event channel over the new gob shim, **`3216`** feat(app): compile pkg/app/appdisc under TinyGo (empty-updater on wasm) stubbing out the service-discovery updater that has nothing to advertise in-browser, and **`3217`** feat(app): compile pkg/app/appserver under TinyGo (in-process apps) so apps run in-process rather than as separate binaries. **`3212`** fix(tpviz): restore shortPK helper — unbreak the install-page wasm build repairs a helper that a refactor had removed out from under the existing tpviz wasm build.

### Skywire: Assembling the Browser Visor Edge

With the subsystems compiling individually, they had to be composed into a single running visor and adapted to the browser's execution model.

**`3206`** feat(wasmhv)+dmsg: TinyGo wasm hypervisor (net/http-free) + browser p2p transports + dmsg registration fix lands the foundational piece — a net/http-free wasm hypervisor core, the first browser peer-to-peer transports, and a dmsg registration fix so the tab actually appears in discovery. **`3218`** feat(wasm-visor): assemble the browser visor EDGE from ported subsystems is the keystone: it wires the TinyGo-compiled router, transport manager, and app server together into a coherent edge visor that boots in the tab.

Two adaptations made that boot possible. **`3220`** fix(gobrpc): reflection-free server so the wasm-visor edge boots in-browser removes the last reflection dependency from the gob RPC server side, which had been the thing preventing the assembled edge from starting. **`3221`** feat(appserver): browser-adapt the ProcManager — no TCP ingress under TinyGo reworks the process manager for an environment with no listening sockets: apps can't be reached by inbound TCP in a browser, so the ProcManager runs them in-process instead.

The remaining pieces gave the tab an identity and a face. **`3223`** feat(tpdclient): dmsg transport-discovery client — routable browser visor gives the browser visor a transport-discovery client that speaks over dmsg, so it can register its transports and become routable like any other node. **`3222`** feat(wasm-visor): wire in the wasmhv hypervisor core (HV-UI path) connects the hypervisor UI code path, and **`3219`** feat(wasm-visor): browser runtime-test harness + step instrumentation adds an in-browser test harness with step-by-step instrumentation so the boot sequence can be validated inside the tab. **`3228`** feat(wasm-visor): surface the tab's own visor in its hypervisor UI closes the loop: the hypervisor UI running in the tab now shows the very visor hosting it, so a browser node manages itself the way a native hypervisor manages a local visor.

### Skywire: Browser-Native Transports

A browser can't open a raw TCP or UDP socket, so the wasm-visor needs transport types that map onto what the browser platform actually exposes. Two arrived today, each added as a first-class `network.Type` on the native side first so both ends of a connection agree on the protocol.

**`3224`** feat(transport): WS-direct as a first-class network.Type (visor↔visor WebSocket) defines a direct visor-to-visor WebSocket transport, and **`3225`** feat(transport): browser WebSocket dial for the WS transport (wasm visor) gives the browser tab the code to actually dial it using the platform WebSocket API. **`3226`** feat(transport): WT-direct as a first-class network.Type (visor↔visor WebTransport) does the same for WebTransport — a QUIC-based browser transport that needs no CA-signed certificate — and **`3227`** feat(wasm-visor): dial direct WS/WT transports from the browser tab wires both dial paths into the wasm-visor so a tab can establish real transports to native peers.

### Skywire: Discovery Load

One fleet-side fix rode along. **`3205`** fix(dmsg-disc): coarsen clients-by-server CXO publish window (1s→30s) — was GC-bound at ~2.8 cores widens the publish window on dmsg-discovery's clients-by-server CXO feed from one second to thirty. The tight one-second cadence was republishing far more often than any consumer needed, pinning discovery at roughly 2.8 cores of garbage-collection pressure; coarsening it to thirty seconds cuts that cost with no loss of freshness that matters to consumers.
