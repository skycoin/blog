+++
date = "2026-06-23"
tags = ["Development", "Skywire"]
title = "Development Update — June 23"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Yesterday the visor learned to run in a browser tab; today it learned to talk to peers the way a browser can and to serve the dmsg web from inside the tab. Three threads ran in parallel. The first is WebRTC as a genuine Skywire transport — added natively with pion, given a browser carrier that can both dial and accept, and turned on by default so any visor accepts every transport type it's capable of. The second is the unified transport port: a reworking of how a visor binds its listeners so that multiple transport types can share a single TCP or UDP socket, shrinking the visor's port footprint. The third closes the wasm-visor story from the day before — a browser tab can now fetch content over dmsg, render a dmsg site in a sandboxed iframe, and even self-host content that other nodes fetch back.

### Skywire: WebRTC as a First-Class Transport

WebRTC is the transport that matters most for browser reach, because it is a true any-to-any peer-to-peer channel — two browser tabs can connect directly to each other, which WebSocket and WebTransport (both client-dials-server) cannot do.

**`3229`** feat(transport): WebRTC DataChannel as a first-class network.Type (native pion) adds WebRTC as a real `network.Type` on native visors using the pion Go implementation, so a native node can be one end of a DataChannel transport. **`3232`** feat(transport): browser WebRTC carrier — a tab can dial AND accept WebRTC and **`3233`** feat(wasm-visor): create + accept WebRTC DataChannel transports give the browser side the symmetric capability: a tab can both initiate and accept WebRTC DataChannel transports, making browser-to-browser links possible.

The rollout was made deliberate. **`3237`** feat(visor): opt-in WebRTC transport for non-wasm visors first lets native visors turn WebRTC on explicitly, and then **`3240`** feat(visor): enable WebRTC by default (a visor accepts every type it can) flips the general policy: rather than requiring operators to opt in, a visor now advertises and accepts every transport type it is capable of running, WebRTC included. The default posture becomes "accept everything you can," which maximizes the chance any two nodes — native or browser — can find a mutually workable transport.

### Skywire: The Unified Transport Port

A visor historically opened a separate listening socket per transport type. The unified-transport-port work lets several types multiplex over one socket, so a visor can expose far fewer ports while still speaking every protocol.

**`3241`** feat(visor): QUIC default-on + transport-port-unification design note turns QUIC on by default and lays out the design for the unification. The mechanism is a pair of demultiplexers that peek at the first bytes of an incoming connection and route it to the right transport listener. **`3242`** feat(transport): UDP demux component for the unified transport port and **`3246`** feat(transport): TCP demux component for the unified transport port add those demuxers for the UDP and TCP sides respectively.

On the UDP side, **`3243`** feat(transport): QUIC can listen over the shared UDP demux conn (+ real-traffic test) and **`3244`** feat(transport): sudph listens over the shared UDP demux conn (+ real-traffic test) teach QUIC and sudph to accept connections through the shared demux rather than owning their own socket, each landing with a real-traffic test. **`3245`** feat(transport): unified transport port — QUIC + sudph share one UDP socket (opt-in) then combines them: opt in, and QUIC and sudph ride a single UDP port. The TCP side mirrors this in **`3247`** feat(transport): unified transport port — stcpr + WS share one TCP socket (opt-in), letting stcpr and the WebSocket transport share one TCP port. **`3248`** feat(transport): per-type-port override for the unified transport port keeps the door open for the cases where an operator still wants a given type on its own dedicated port.

### Skywire: Transport Preference and Cleanup

With the transport roster growing, the machinery that chooses among types needed tidying. **`3235`** fix(transport): include QUIC (+ ws/wt/webrtc) in the transport preference order fixes an omission — the newer transport types weren't present in the preference ordering, so they'd never be selected even when available. **`3236`** refactor(transport): rename the QUIC transport type to "squic" (skywire-quic) renames the type to `squic` to mark it as Skywire's QUIC rather than a bare QUIC socket, disambiguating it from the WebTransport-over-QUIC and unified-port work.

**`3238`** refactor(dmsg): fold PreferWS/PreferWT into an ordered Carriers list replaces the ad-hoc `PreferWS`/`PreferWT` boolean flags in dmsg with a single ordered list of carriers, which scales cleanly as more browser carriers appear rather than accreting one boolean per option. **`3239`** fix(dmsg): stop the session accept loop on ANY error (kill the WARN spam) tightens a dmsg session's accept loop so it exits on any error instead of spinning and flooding the logs with warnings.

### Skywire: The Browser Visor Serves and Browses the dmsg Web

The final thread turns the wasm-visor from a routable endpoint into a full participant in the dmsg web — both consuming and serving content — and gives it a UI to prove it.

**`3234`** feat(wasmhv): serve the Angular hypervisor UI from a wasm-visor lets a wasm-visor itself serve the Angular hypervisor front-end, so the tab hosting the visor also delivers the management UI. **`3250`** feat(wasm-visor): fetchDmsg hook — fetch arbitrary content over dmsg exposes a `fetchDmsg` primitive: JavaScript in the tab can fetch arbitrary content over dmsg, using the visor as its transport. **`3251`** feat(wasm-visor): browse-dmsg demo — render a dmsg site in a sandboxed iframe builds on that to render a fetched dmsg site inside a sandboxed iframe — a browser rendering the dmsg web with no clearnet in the path. **`3252`** feat(wasm-visor): in-browser self-hosting — serve content over dmsg from a tab completes the symmetry: a tab can serve its own content out over dmsg, so a browser node is both client and server on the network.

**`3249`** feat(harness): one-curl mesh test between two wasm-visor instances ties it together with a test harness that stands up two wasm-visor instances and validates a mesh connection between them with a single curl — an end-to-end check that two browser visors can find each other and pass traffic.
