+++
date = "2026-06-27"
tags = ["Development", "Skywire"]
title = "Development Update — June 27"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Yesterday gave the browser visor plain-WebSocket reachability; today's problem is that a browser visor served over HTTPS *can't* open a `ws://` connection — the browser blocks the mixed-content downgrade, and public dmsg servers only speak plain WebSocket. The fix is a two-stage bootstrap: connect over `wss://` just long enough to get onto the network, then hand off to WebTransport for the real session. That handoff drove a cleanup of the whole transport-type taxonomy, and around it the wasm visor kept filling in native parity — an in-process skychat, served peer interfaces, its own routing tab — while the hypervisor UI learned to tell a browser visor apart from a native one at a glance.

### Skywire: HTTPS-Aware Bootstrap and the wss→WebTransport Handoff

A page loaded over HTTPS may only open secure sub-connections, so the browser client needs a `wss://` (TLS) path to a dmsg server to get started, and then wants off it as fast as possible.

**`3315`** feat(wasm-visor): HTTPS-aware dmsg bootstrap over wss AddressWS teaches the wasm visor to detect it's on an HTTPS origin and dial dmsg servers over their `wss` address rather than plain `ws`. **`3320`** fix(wasm-visor): skip ws:// transport autoconnect on an HTTPS page is the guard that makes yesterday's autoconnect safe here — an HTTPS page silently fails every `ws://` dial, so those are skipped entirely instead of piling up as dead attempts.

For servers to *have* a `wss` address, the deployment side had to grow one. **`3317`** feat(dmsg-server): self-derive wss WS URL from PK via wss_domain_suffix lets a dmsg server compute its own `wss://` URL by combining its public key with a configured domain suffix — no per-server TLS config, the URL falls out of the key. **`3318`** feat(deployment): wss AddressWS for the TLS-fronted dmsg servers advertises that derived `wss` endpoint in discovery for the servers sitting behind TLS termination, so browser clients can find a secure bootstrap path.

**`3316`** feat(dmsg): browser client prefers WebTransport, wss only to bootstrap sets the policy: `wss` is a bootstrap-only carrier, and once the client is on the network it prefers WebTransport for its sessions. **`3319`** feat(dmsg): active wss→WebTransport handoff for the browser client makes that active — after bootstrapping over `wss`, the client establishes the WebTransport session and migrates onto it, leaving `wss` for the next cold start rather than carrying the whole session over a TLS-fronted WebSocket.

### Skywire: Finishing the Transport-Type Taxonomy

The handoff work exposed that the transport-type names had accreted inconsistently, and several resolve failures traced straight back to it.

**`3326`** refactor(transport): rename QUIC type wire name squic → squicr regularizes the QUIC type's wire name, and **`3327`** feat(transport): static config tables (ws/wt/quic) + finish ws/wt→swsr/swtr taxonomy completes the rename across the board — WebSocket and WebTransport become `swsr` and `swtr` — and gives each type a static config table so the transport factories are declared in one consistent place. **`3332`** fix(address-resolver): normalize transport type so wt/quic resolve (not 500) is the bug this prevents in the future: an unnormalized type string reaching the resolver fell through its switch and returned a 500 instead of resolving, killing WT and QUIC lookups; normalizing at the store boundary makes the resolve succeed.

Two more transport fixes landed alongside. **`3325`** fix(transport): WT bound the STCP port (:7777), not its own UDP port had the WebTransport listener binding the STCP TCP port instead of its own UDP port, so WT never actually came up where dialers expected it. **`3312`** fix(transport): WebRTC signaling port (47) collided with DmsgTransportSetupPort — webrtc dead fleet-wide is a sharp collision: WebRTC signaling had been assigned dmsg port 47, the same port transport-setup already used, so the two fought over the same listener and WebRTC was dead across the fleet until signaling was moved.

### Skywire: The wasm Visor Grows Native Parity

The browser visor kept closing the gap with a native one. **`3331`** feat(wasm-visor): in-process skychat (+ WT-autoconnect resolve diagnostics) runs skychat directly inside the browser tab as an in-process app over dmsg, so a wasm visor can send and receive chat without a separate native process — and adds diagnostics for the WT-autoconnect resolve step that this exercised. **`3328`** feat(wasm-visor): serve dmsg peer interfaces (health/ctrl/ping/transport-setup) has the browser visor answer the same dmsg peer interfaces a native visor serves — health, control, ping, transport-setup — so from the other end a wasm visor is indistinguishable at the protocol level. **`3309`** feat(wasm-visor): serve the Routing tab — own routing rules + graceful route-groups gives the tab its own Routing tab, exposing its routing rules and letting it tear down route-groups gracefully.

### Skywire: Real HTTPS Origins for Local Testing

Testing all of the above needs a genuine `https://` origin, not localhost. **`3324`** feat(hv): cli hv serve --tls — real https origin for local testing lets `hv serve` terminate TLS itself so an operator can reproduce the mixed-content and `wss` bootstrap behavior locally against a real HTTPS origin. **`3313`** feat(hv): cli hv serve --harness — opt-in operator control bridge adds an opt-in control bridge to the served visor for test harnesses — off by default, since a served visor whose operator can drive it is a very different trust posture from a private one.

### Skywire: Telling a Browser Visor Apart in the UI

A browser visor and a native visor look identical in the hypervisor UI, but they aren't — one runs on hardware the operator controls, the other in a tab that may be served by anyone. **`3308`** feat(ui): violet hue to flag a browser/wasm visor gives browser visors a violet hue in the UI so they're recognizable at a glance. **`3310`** feat(ui): hide N/A tabs for a browser/wasm visor (bandwidth/uptime/rewards/web-proxy) removes the tabs that don't apply to a browser visor — it earns no bandwidth rewards, tracks no uptime, runs no web proxy — so the UI stops offering controls that can't do anything.

Several fixes hardened that UI. **`3322`** fix(ui): guard transport.log on the node-info page (wasm-visor crash) stops the node-info page from crashing a wasm visor when a transport has no log, **`3330`** fix(wasm-visor): config_version display + svc health clarity corrects the config-version readout and makes service-health states legible, and **`3321`** feat(ui): settings toggle for wasm-visor auto-update exposes yesterday's self-update behind an explicit settings toggle so operators opt into reloads.

Two more rounded out the day. **`3329`** feat(wasmhv): single-instance guard — one wasm-visor tab per origin prevents a second tab on the same origin from spawning a competing visor with the same key. **`3314`** feat(wasmhv): multi-window skynet browser + visor identity export/import lets the browser hypervisor open multiple skynet browser windows and export or import its visor identity, so a browser visor's key is portable rather than trapped in one tab's storage. **`3311`** feat(visor): persist runtime hypervisor add/remove + make config-loaded hvs removable makes runtime hypervisor changes stick across restarts and lets even config-loaded hypervisors be removed, so the hypervisor set is fully editable at runtime rather than partly frozen by the config file.
