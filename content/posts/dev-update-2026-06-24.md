+++
date = "2026-06-24"
tags = ["Development", "Skywire"]
title = "Development Update — June 24"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A day spent turning the browser tab into a full participant in the network. The wasm-visor gained a standard-Go `js/wasm` build that unlocks the real `crypto/tls` and `net/http` stacks inside the tab, a yamux RPC bridge so `skywire cli` can drive that tab exactly as it drives a native visor, the route-origination machinery a visor needs to actually reach the mesh, and a shared browse/host engine for loading dmsg-hosted sites in-page. The blob that carries all of this now ships embedded in the binary by default. This post follows the arc from build toolchain, to control plane, to browsing, to distribution.

### Skywire: A Real Runtime in the Tab

**`3258`** feat(wasm-visor): standard-Go js/wasm build (unlocks crypto/tls + net/http in the tab) is the foundation for everything else. Building the wasm-visor with the standard Go toolchain rather than the TinyGo path brings the full standard library into the browser — most importantly `crypto/tls` and `net/http`, which the visor's discovery clients, HTTP-over-dmsg, and TLS handshakes all depend on. With the real runtime in place the tab stops being a stripped-down approximation and becomes a genuine visor.

### Skywire: An RPC Bridge to Drive the Tab

With a real runtime in the tab, the next problem is control: how do you point the existing `skywire cli` at a visor that lives inside a browser? The answer is a bridge that carries the visor's RPC over the same channels the tab already speaks.

**`3260`** feat(wasmrpc): yamux RPC bridge core — drive a browser wasm-visor with skywire cli builds the transport: a yamux-multiplexed RPC channel that lets an external `skywire cli` process open streams to a wasm-visor running in a tab. **`3261`** feat(wasm-visor): RPC gateway + bridge wiring — `skywire cli` drives a tab wires that core into the wasm-visor, standing up the gateway end so the tab answers RPC calls, and the CLI on the other side treats it like any other visor endpoint.

From there the individual commands come online. **`3262`** fix(wasm-visor): populate Summary.DmsgStats so `skywire cli visor info` works fills in the dmsg statistics the summary RPC returns, so `visor info` reports real connection state rather than an empty struct. **`3263`** feat(wasm-visor): transport-control RPC — `skywire cli tp ls/add/rm` drive a tab exposes the transport-management surface, letting an operator list, add, and remove transports on the in-tab visor from the command line.

**`3264`** refactor(cli): validate transport types against types.Known(), not a hardcoded list is a supporting cleanup surfaced by the transport-control work: the CLI validated transport-type arguments against a hardcoded list that drifted out of sync with the actual registered types, so it now checks against `types.Known()` — the single authoritative source — and stops rejecting valid types.

### Skywire: Routing and Browsing Over dmsg

An RPC-controllable tab still can't reach the mesh until it can originate routes. These changes give the wasm-visor the route-setup path a native visor has, then build the browse/host experience on top of it.

**`3268`** feat(wasm-visor): wire route origination (RouteFinder + setup-node dialer) installs the two pieces a visor needs to start a route from scratch: the route-finder client that discovers a path, and the setup-node dialer that reserves the route with each hop along it. **`3269`** feat(wasm-visor): enable routing (MinHops=1) + dialRoute probe hook turns routing on with a minimum of one hop and adds a `dialRoute` probe so the setup path can be exercised and observed directly. **`3270`** docs+feat(wasm-visor): diagnose route-setup blocker — tab not in dmsg discovery captures why the first attempts failed: the tab had not yet registered itself in dmsg discovery, so no peer could dial back to complete the route — the same "advertised-or-not" class of failure that dogs route setup elsewhere — and documents the diagnosis alongside the fix.

On top of routing, the browsing surface takes shape. **`3253`** feat(wasm-visor): real browse/host UI + in-page links navigate over dmsg replaces the placeholder with a working browse-and-host UI in which clicking an in-page link navigates to the next dmsg-hosted page rather than the clearnet. **`3254`** feat(wasm-visor): route a browsed page's subresources + fetch over dmsg extends that to a page's subresources and its `fetch` calls, so images, scripts, and XHR requests all travel over dmsg instead of leaking to the clearnet. **`3255`** feat(wasm-visor): rewrite CSS url() assets over dmsg so styled sites fully render handles the last common asset class — `url()` references inside stylesheets — rewriting them to load over dmsg so a styled site renders completely. **`3256`** feat(wasm-visor): shared browse engine + browse/host overlay in the standalone HV factors the browse/host logic into a shared engine and surfaces it as an overlay in the standalone hypervisor, so the same code powers browsing in both contexts.

**`3257`** feat(visor): clearnet HTTP forward-proxy over dmsg (opt-in, whitelist-gated) complements the in-tab browsing with a server-side counterpart: a visor can act as a forward proxy that fetches clearnet HTTP on behalf of a dmsg peer, opt-in and gated by a whitelist so it is never an open relay.

### Skywire: Shipping the Blob

With the wasm-visor functional, the remaining question is distribution. **`3265`** docs: policy — never commit the wasm-visor binary; ship it as a release artifact records the starting policy: the compiled wasm blob should be a release artifact, not a committed file bloating git history. **`3266`** feat(wasm-visor): embed the wasm-visor in the binary (build-tagged, no git history) implements the embed behind a build tag so the binary can carry the blob without the checked-in file. **`3267`** feat(wasm-visor): embed the wasm-visor by default (committed blob, manual updates) then reverses course pragmatically — embedding by default from a committed blob that is refreshed by hand — trading the no-history ideal for a build that just works out of the box, with manual regeneration as the maintenance cost.
