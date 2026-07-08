+++
date = "2026-06-26"
tags = ["Development", "Skywire"]
title = "Development Update — June 26"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A dense day of transport-layer work, all pointed at one goal: letting a visor that runs entirely inside a browser tab reach the rest of the network — and letting the rest of the network reach it back. Browsers can't open raw sockets, so a wasm visor is confined to the transports the browser exposes: WebSocket and WebTransport. Today's changes teach the address-resolver to advertise those endpoints, teach native visors to dial them, fold a WebSocket listener onto the existing stcpr port so *every* visor is reachable by a browser without opening a new port, and then wire the wasm visor to autoconnect over both. The result is a browser tab that discovers public visors and dials them the same way a native visor does.

### Skywire: WebTransport Discovery via the Address Resolver

WebTransport is the browser's HTTP/3 stream API, and it is the piece that lets a browser visor accept inbound connections at all — but it depends on a self-signed certificate whose hash the dialer must pin in advance, so discovery has to carry that hash end to end.

**`3302`** feat(address-resolver): WebTransport bind/resolve with cert-hash (WT discovery foundation) lays the groundwork. The address-resolver already maps a public key to a reachable endpoint for stcpr and sudph; this adds a WebTransport record type that stores not just the `ip:port` but the certificate hash the peer generated, so a dialer can resolve both in a single lookup and pin the cert before the handshake.

**`3303`** feat(transport): visor accepts WebTransport + registers its cert hash with the AR wires the accept side. A visor that binds a WebTransport listener generates its self-signed cert, computes the hash, and registers the pair with the resolver — publishing "you can reach me over WT at this endpoint, and here is the hash to trust." **`3304`** feat(transport): native WT dial resolves the peer endpoint + cert hash via the AR closes the loop on the dial side: a native visor asked to dial a peer over WebTransport resolves the endpoint *and* the cert hash from the resolver, pins the hash, and completes the browser-compatible handshake without any CA in the path.

**`3305`** feat(transport,dmsg): browser-native WT dial for the std-Go wasm visor (build-tag fix) makes the same dial path compile and run inside the browser. The wasm build can't use the quic-go WebTransport stack — it has to call the browser's own `WebTransport` API through syscall/js — so the dial path is split behind build tags: native visors use the Go implementation, the wasm visor uses the browser's, and both resolve through the same AR records.

### Skywire: Native WS Dial Resolution and Its Sharp Edges

WebSocket is the other browser-reachable transport, and the same discovery pattern applies. **`3301`** feat(transport): native WS dial resolves the peer endpoint via the address resolver lets a native visor dial a peer over WebSocket by resolving its endpoint from the AR, so `tp add -t ws pk` works against a discovered address rather than a hand-typed one — the symmetric counterpart to the WT resolve path.

Building out the WS dial path surfaced two crashes. **`3299`** fix(transport): WS Dial panics the visor on a nil WSTable is a hard one: `tp add -t ws` on a visor whose WS transport factory was never initialized dereferenced a nil table and took the whole visor down instead of returning an error. **`3297`** fix(transport): accept cross-origin WS dials fixes a subtler rejection — a visor running in a browser tab sends an `Origin` header on every WebSocket upgrade (the browser forces it), and the server's default same-origin check refused those dials outright, so browser visors could never complete a WS handshake against a native one until the check was relaxed for the transport listener.

**`3300`** fix(address-resolver): handle the QUIC type in the redis store (quic dead fleet-wide) is an adjacent resolver bug caught the same day: the redis-backed store's type switch didn't recognize the QUIC transport type, so every QUIC resolve returned an error and QUIC transports were effectively dead across the fleet. Adding the missing case restores QUIC resolution alongside the new WS and WT records.

### Skywire: The stcpr+WS cmux — WS Reachable Everywhere

For a browser visor to reach *any* visor, every visor has to expose a WebSocket endpoint — but demanding operators open a new port fleet-wide is a non-starter. The answer is a connection multiplexer that serves both stcpr and WebSocket on the port stcpr already uses.

**`3292`** feat(transport): default-on stcpr+WS cmux (phase 2 — WS reachable everywhere) turns this on by default: the stcpr listener is fronted by a cmux that sniffs each new connection and routes raw stcpr handshakes to the stcpr handler and HTTP upgrade requests to a WebSocket handler, so a browser visor can reach any public visor over WS with no new port and no config change. **`3296`** feat(transport): start the WS server on the stcpr+WS cmux is the wiring that actually mounts the WebSocket server onto that muxed listener.

Folding two protocols onto one socket broke the stcpr handshake in a way that only shows up under a cmux. **`3295`** fix(transport): stcpr handshake breaks under the stcpr+WS cmux (readFrame0 single-Read) is the fix: cmux has to peek at the first bytes to classify a connection, and the stcpr handshake's `readFrame0` assumed a single `Read` returned the whole first frame — but once cmux has consumed and replayed the prefix, that frame can arrive split across reads, so the handshake has to loop until the full frame is in hand.

### Skywire: Public Autoconnect from the Browser

With discovery and reachability in place, the wasm visor can start connecting on its own. **`3294`** feat(wasm-visor): public autoconnect over WS (phase 4) has a browser visor enumerate public visors and dial them over WebSocket automatically at startup, so a freshly loaded tab bootstraps into the network without any manual transport setup. **`3306`** feat(wasm-visor): multi-type autoconnect — dial WS AND WT to each public visor extends that to both browser transports: rather than picking one, the visor dials each public visor over both WS and WT, taking whichever completes — WT gives it inbound reachability, WS gives it a fast, widely-available outbound path.

### Skywire: The wasm-visor Console

The browser visor also grew a usable operator surface. **`3298`** feat(wasm-visor): show transports + dmsg-observed public IP in the overview surfaces the tab's live transport list and the public IP the visor learned about itself over dmsg — the browser can't read its own address, so it reports what a dmsg peer observed. **`3291`** feat(wasmhv): host panel — file upload, port picker, shareable address and **`3293`** feat(wasmhv): browse panel — resizable/larger window + home.dmsg + resolver aliases build out the host and browse panels: hosting a file or port from the tab and producing a shareable skynet address, and browsing dmsg sites by resolver alias (including `home.dmsg`) in a larger, resizable window.

**`3307`** feat(hv serve): wasm-visor self-update — reload to a newer served build closes the day: a served wasm visor can detect that the origin is now serving a newer build and reload into it, so operators pushing a new hypervisor blob don't have to ask every open tab to hard-refresh.
