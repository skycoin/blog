+++
date = "2026-06-28"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — June 28, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A quieter day spent turning the hypervisor UI into an actual browser. The native and WASM hypervisors both grew a virtual browser for reaching skynet and clearnet sites through the visor, and the two front-ends were brought onto the same shared code so they stop diverging. Alongside that, a rewards accounting fix closed a bonus-splitting loophole, and a couple of small transport and skychat fixes landed.

### Skywire: A Browser Inside the Hypervisor

**`3340`** feat(visor): skynet/clearnet virtual browser in the native HV UI (shared browse.js) brings the browsing surface that already existed in the WASM hypervisor into the native hypervisor UI, and — importantly — does it by sharing a single `browse.js` between the two front-ends. Both hypervisors now drive the same fetch-and-render logic, so a fix or feature in one lands in the other for free instead of being re-implemented and drifting apart.

**`3337`** feat(wasmhv): iframe browser back/forward/reload/cancel gives that iframe browser the navigation controls a user expects — a history stack with back and forward, plus reload and cancel — rather than a one-shot address bar. **`3338`** feat(wasmhv): gate iframe clearnet behind an upstream proxy + CSP catch-all + browser-style errors hardens it: clearnet requests are routed through an upstream proxy rather than dialed directly from the page, a Content-Security-Policy catch-all constrains what an embedded site can do, and failures render as recognizable browser-style error pages instead of a blank or broken frame.

**`3342`** fix(visor): home.dmsg serves the resolver alias directory, not a dmsg fetch corrects what the browser's home page actually shows: `home.dmsg` was attempting a dmsg fetch when it should serve the local resolver alias directory — the list of name→PK mappings the visor already knows — giving the browser a useful landing page of reachable destinations.

### Skywire: Rewards, Per-IP

**`3339`** fix(rewards): pool 2 weight is per-IP, not per-visor — closes the splitting bonus fixes an accounting flaw that rewarded gaming the system. Pool 2 weight was computed per-visor, so an operator could split one machine's stake across many visor identities on the same IP and multiply their share. Weighting per-IP instead collapses that: running more visors behind one address no longer inflates the bonus, which is what the pool was meant to measure in the first place.

### Skywire: Transport and Skychat

**`3335`** fix(transport): retry WebRTC signaling dial on transient dmsg-202 handles the first-dial hiccup seen when a WebRTC transport bootstraps its signaling over dmsg: a transient dmsg-202 on the initial signaling dial is retried rather than surfaced as a hard failure, so the transport comes up on the second attempt instead of aborting.

**`3334`** feat(wasm-visor): skychat reachable over a skynet route (listen on skynet too) lets the WASM visor's skychat accept connections over a skynet route in addition to its existing paths, so a peer can reach it through the routed network rather than only over dmsg. **`3333`** docs(wasm-visor): correct stale header — TPD registration + skychat are done trims documentation that still described those features as pending.
