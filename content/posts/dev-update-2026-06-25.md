+++
date = "2026-06-25"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — June 25, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Where the previous day proved a browser tab could act as a visor, this one made the native and in-tab visors share the code that makes them work — so they stop drifting apart. The centerpiece is *visorcore*: a set of refactors that pull service resolution, the register-before-serve dmsg invariant, and router construction into one shared assembly used by both backends. Around it, the dmsg client learned to register seeded edge clients correctly so a browser visor actually appears in discovery, a WebSocket transport was unified onto the dmsg-server's main port, and `hv serve` grew the ability to serve the wasm-visor with the browse/host overlay. This post traces the convergence, the discovery fixes it depended on, the WebSocket unification, and the serving path.

### Skywire: Converging the Two Visors on visorcore

The native visor and the in-tab wasm-visor had grown parallel copies of the same startup logic, and every divergence was a latent bug. These refactors give them one shared core.

**`3278`** refactor(visor): shared visorcore.ResolveServices; wasm-visor adopts it establishes the pattern: a single `ResolveServices` that merges configured service URLs and public keys in one place, adopted first by the wasm-visor so both backends resolve services identically. **`3280`** refactor(visor): native dmsgServicePKs uses visorcore.ResolveServices and **`3281`** refactor(visor): route remaining service-URL reads through visorcore.ResolveServices then route the native side's own service-URL and service-PK reads through the same function, retiring the duplicate paths.

**`3279`** refactor(dmsg): share the register-before-serve invariant (direct.StartDmsgWithSetup) captures a subtler shared rule as code: a dmsg client must register before it serves, and `direct.StartDmsgWithSetup` makes that ordering a single reusable primitive rather than something each call site has to remember. **`3282`** refactor(visor): shared visorcore.BuildRouter — converge router construction finishes the set by pulling router configuration, construction, and serving into `visorcore.BuildRouter`, so both visors build their router from the same code.

**`3283`** docs(visorcore): record convergence status (#3278-#3282) + remaining-divergence assessment documents where the convergence stands and — just as important — where it deliberately stops: the parts that are genuinely platform-specific (dmsg serve/ready sequencing, the transport DAG, process management) are left divergent rather than force-fit into shared code.

### Skywire: Making the Browser Visor Discoverable

The convergence work exposed a chain of discovery bugs that kept a browser wasm-visor from ever appearing in dmsg discovery — the same root cause diagnosed the day before.

**`3277`** fix(dmsg): seeded edge clients must register before serving (browser wasm-visor) is the core fix: the wasm-visor served with a bare direct client and only upgraded to the registering fallback *after* serving, so its first Serve pass registered nothing and reset the registration timer — leaving the tab absent from discovery and unreachable. Registering before serving, per the invariant now shared in #3279, makes the tab self-register. **`3276`** fix(dmsg): registering fallback must publish a FRESH client entry corrects a related error where the fallback republished a stale entry rather than a freshly-signed one, and **`3275`** feat(dmsg): preload non-registering service entries in StartDmsgSeeded seeds the entries for services that don't register themselves so the route-finder and other clients can dial them from a cold start.

**`3274`** feat(wasm-visor): in-tab skysocks-client — browse the clearnet IP-anonymously is the payoff these fixes unlock: with the tab discoverable and able to originate routes, it can run a skysocks-client in-tab and browse the clearnet through a remote exit, IP-anonymous, entirely from the browser.

### Skywire: One WebSocket Port for dmsg

Browsers can't open raw sockets, so a browser visor reaches dmsg over WebSocket — but running WebSocket on a separate port complicated deployment. These changes fold it onto the main port.

**`3271`** feat(dmsg): ServeWithWS — raw-dmsg + WebSocket on ONE listener/port lets a dmsg-server accept both raw-dmsg and WebSocket connections on a single listener, detecting the protocol per-connection rather than dedicating a second port. **`3272`** feat(dmsg-server): serve WebSocket on the main port by default (unified) makes that the default so every server offers a WebSocket entry point without operator configuration, and **`3273`** feat(wasm-visor): seed dmsg from ALL embedded servers via main-port WS updates the wasm-visor to seed its dmsg client from every embedded server over that unified main-port WebSocket, widening the set of servers a browser tab can bootstrap through.

### Skywire: One UI, Two Backends, Served

With the wasm-visor converged onto shared core and reachable over dmsg, the last piece is serving its UI. **`3284`** docs: design for one Angular HV UI over two backends (SkywireHttpBackend) lays out the plan: a single Angular hypervisor UI build that runs against either a native REST backend or an in-tab wasm backend, chosen at runtime. **`3285`** feat(hv-ui): SkywireHttpBackend — one UI build for native REST or in-tab wasm takes the first implementation step, introducing the `SkywireHttpBackend` abstraction so one UI build no longer forks per backend.

**`3287`** feat(wasm-visor): hv serve + autoconnect foundation + standalone serve docs adds the serving path and the beginnings of autoconnect, letting `hv serve` host the wasm-visor as a standalone page, with documentation for that deployment. **`3288`** fix(cli): hv serve renders the wasm-visor correctly (boot + lazy chunks) fixes the serving so the tab boots and its lazy-loaded chunks resolve rather than 404, and **`3290`** feat(cli): hv serve mounts the dmsg/skynet browse + host overlay completes the day by mounting the browse-and-host overlay onto the served page, so a visitor to an `hv serve` endpoint gets the full in-tab browsing experience built up over the prior day.
