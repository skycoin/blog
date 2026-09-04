+++
date = "2026-06-20"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — June 20, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

With WebSocket and QUIC carriers landed the day before, today the browser finally becomes a first-class citizen of the mesh. A WASM dmsg client compiles and runs in a browser tab, and a serverless hypervisor UI runs entirely over dmsg — no clearnet, no hosting a control surface on a domain. A fourth dmsg carrier, WebTransport, lands alongside it for CA-free browser reach. Underneath, the discovery layer sheds the last of its plain-HTTP fallbacks so that discovery is now strictly dmsg, and the TinyGo logging groundwork is generalized in preparation for an embedded dmsg port.

### Skywire: The Browser Joins the Mesh

**`3190`** feat(dmsg): browser WASM dmsg client + hypervisor UI over dmsg is the headline: a dmsg client compiled to WASM that runs in a browser tab, with a hypervisor UI driven entirely over dmsg. This is what the WebSocket carrier from #3189 was built to enable — a browser can't open raw sockets, but it can ride dmsg over WebSocket, and now it does. The result is a serverless hypervisor: visors dial *into* the browser tab over dmsg, and the tab controls apps and transports without any clearnet component and without hosting a key-entry page on a domain (which would be a spoofing risk).

**`3194`** feat(wasmhv): apps + transports control endpoints for the standalone hypervisor fills in the control surface for that browser-hosted hypervisor, wiring up the endpoints it needs to manage apps and transports — the operational parity that turns a proof-of-concept tab into something you can actually run a visor from.

**`3193`** feat(dmsg): dmsg-over-WebTransport server listener + native client adds a fourth dmsg carrier. WebTransport gives browsers CA-free reach via a certificate-hash pin rather than a full CA-issued certificate, which suits the serverless, domain-less model the WASM hypervisor is built around. This PR ships both sides — a server-side listener and a native client — so WebTransport joins TCP, WebSocket, and QUIC as a way onto the dmsg wire.

**`3196`** docs+feat(wasmhv): unified-UI design + context-detection gate in override.js sketches the design for a single UI that adapts to its runtime and adds a context-detection gate in `override.js` so the same frontend can tell whether it's running as a native hypervisor or as an in-browser WASM visor and behave accordingly — the first step toward one UI codebase serving both worlds instead of two diverging ones.

### Skywire: Discovery Goes Strictly dmsg

**`3195`** refactor(disc): drop the dmsgfirst plain-HTTP fallback — discovery is dmsg-only removes the `dmsgfirst` plain-HTTP fallback path, making service discovery (dmsgd, TPD, SD, AR) strictly dmsg. The fallback was a liability more than a safety net: a transient dmsg error would trigger a doomed HTTP round-trip instead of simply self-healing on the next dmsg refresh. Dropping it makes the discovery path both simpler and more honest about what the network actually depends on.

**`3191`** fix(visor): dmsg-only deployment services — rip out plain-HTTP fallback + autoconnect wedge does the same surgery on the visor side, removing the plain-HTTP fallback for deployment services and clearing an autoconnect wedge in the process. Together the two PRs finish converging the network onto a dmsg-only control plane, with no clearnet-HTTP escape hatches left to mask failures or fragment behavior.

### Skywire: Groundwork for Embedded

**`3197`** feat(logging)+docs: generalize TinyGo logging stub to all targets; TinyGo dmsg port plan generalizes the TinyGo logging stub so it applies across all build targets rather than being a one-off, and lays out the plan for porting the dmsg client to TinyGo. This is the setup work for running dmsg on constrained, embedded, and IoT targets — the logging shim has to exist and behave uniformly before the client itself can be brought up under TinyGo.
