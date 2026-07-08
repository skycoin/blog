+++
date = "2026-07-03"
tags = ["Development", "Skywire"]
title = "Development Update — July 3"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The browser wasm-visor had a structural flaw that no amount of UI polish could fix: it ran on the page's main thread, so the moment it did anything slow — setting up a skysocks route, say — the whole tab froze. Event loop stalled, buttons dead, nothing repaints. Today moves the visor off the main thread entirely and into a dedicated Web Worker, which is the right fix but a disruptive one: WebRTC and IP self-reporting both break in a worker context and have to be re-plumbed. The other half of the day is a route-lifetime fix on the native side that keeps multihop routes from dying under a browser, and the v1.3.79 release.

### Skywire: Off the Main Thread

**`3366`** feat(wasm-hv): run the wasm-visor in a dedicated Web Worker (unfreeze the UI) is the centerpiece. Running the visor in a Web Worker gives it its own thread, so a slow route setup or a burst of dmsg work no longer blocks the page's event loop — the UI stays responsive while the visor grinds. **`3369`** fix(wasm-hv): serve node-page self subroutes follows up so the moved visor still answers the node page's own requests — dmsg sessions, router and runtime config, logs — from inside the worker, keeping those tabs populated after the relocation.

**`3370`** fix(wasm-hv): worker-mode WebRTC/IP regressions cleans up what the move broke: WebRTC and the visor's IP self-report both misbehaved once the visor was inside the worker — a spam of `RTCPeerConnection` errors, a missing IP, and a dirty build — because a worker has no direct access to the APIs the main thread does. **`3362`** fix(wasm-hv): window z-order + de-serialize skysocks route setup rounds out the desktop feel: a newly opened window now comes to the front instead of appearing behind the focused one, and skysocks route setup is de-serialized so it stops blocking on itself.

### Skywire: WebRTC From a Worker

**`3371`** feat(wasm-hv): WebRTC transport via a main-thread RTCPeerConnection proxy solves the deeper half of the worker move. `RTCPeerConnection` simply isn't available inside a Web Worker, so the WebRTC transport can't run where the visor now lives. The fix keeps the peer connection on the main thread and proxies it to the worker over messages — the visor drives WebRTC through a thin main-thread shim, preserving browser-to-browser P2P transport after the relocation instead of losing it.

### Skywire: Keeping Multihop Routes Alive

**`3368`** feat(skynet): hold+reuse multihop routes via a yamux skyfwd mux (fix route-death) is a native-side fix with a browser-visible payoff. A resolving-proxy multihop route kept dying because the forwarding server is 1:1 — once the single stream closed, the route was gone, and every fetch had to rebuild it. The fix holds the forwarding connection in a yamux mux with an idle TTL and reuses it, so many logical streams ride one held route instead of tearing it down and re-establishing it. It is one fix for both the external-browser and iframe paths, neither of which emits a clean page-open signal to trigger a rebuild.

### Skywire: UI Fixes, Docs, and v1.3.79

**`3372`** fix(hv-ui): wasm-visor tab row 13→6 flip corrects a count that showed the wrong number of tabs until the filter was applied after the node finished loading; the filter now runs at the right moment. **`3373`** fix(wasm-hv): reserve the taskbar strip so it doesn't cover page content reserves vertical space for the taskbar so it stops overlapping the page — notably the public-key line — instead of floating over it. **`3367`** docs(router): correct stale DatagramRouteGroup header fixes a documentation comment that still described the datagram route group as unwired long after the faithful-UDP feature was fully in place.

These landed in the **v1.3.79** release, whose changelog notes bandwidth-reward telemetry restored and the wasm-visor as the release's flagship.
