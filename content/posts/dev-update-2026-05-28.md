+++
date = "2026-05-28"
tags = ["Development", "Skywire", "Routing"]
title = "Skywire Development Update — May 28, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The headline feature of the week lands: **operator-programmable routing policy**. Skywire's router already does multihop, multiplexed, latency-ranked, asymmetric path selection — but *which* path a given flow takes was hardwired in Go. Today that decision becomes a program the operator writes, in **Starlark** (a small, sandboxed, Python-like language), evaluated per dial. A flow can be steered onto disjoint paths, pinned by 5-tuple, made latency-adaptive, prioritized by DSCP, or forced onto the overlay — by policy, not by patch.

### Skywire: Operator-Programmable Routing Policy (Starlark)

**`2882` docs: add operator-programmable routing policy RFC** — the design: a per-dial policy program, written in Starlark with a routing-flavored standard library, that the router consults when it constructs a route. The operator describes intent ("prefer low latency, force at least 3 hops for this app, fan across 4 disjoint paths") and the router obeys it.

**`2883` feat(router): Phase 1+2 routing-policy scaffold (Starlark)** + **`2884` feat: Phase 3 stdlib + Phase 4 loader + CLI tooling** — the scaffold: a Starlark interpreter embedded in the router, a routing-flavored stdlib the policy calls into, a loader that reads policy programs, and CLI tooling to work with them.

**`2885` feat(router): integrate routing policy into the dial path** + **`2890` feat: visor-backed Provider + per-app routing policy** + **`2891` feat: RouteSelectingHook + Starlark route selection** — the policy is wired into the actual dial path through a `RouteSelectingHook`: when the router is choosing among candidate routes, it calls the policy. A visor-backed `Provider` supplies policies, and crucially they can be **per-app** — a different policy for your proxy than for your VPN than for a latency-sensitive app.

**`2897` feat: finish Layer 2 packet distribution (RFC phase 5)** + **`2902` fix: SelectRoute distribution + leg-count truth** — beyond choosing routes, the policy can shape how packets are *distributed* across the chosen multiplexed routes (Layer 2), with the leg counts reported truthfully back to it.

The policy vocabulary that lands today:

**`2903` feat: directional asymmetry (forward/reverse routing)** — a policy can route the forward and reverse legs differently, exposing the asymmetric routing the router gained earlier.

**`2904` feat: on_leg_change callback (RFC phase 6)** — the policy gets a callback when a leg changes, so it can react to a path going away.

**`2905` feat: fallback="direct" + CLI overrides exposed** — a policy can declare its fallback behavior (e.g. fall back to a direct dial), with CLI overrides exposed.

**`2906` feat: sticky:5tuple + latency-adaptive + dscp-priority** — three concrete policy primitives: pin a flow to a path by its 5-tuple (so a connection doesn't migrate mid-stream), adapt the path choice to measured latency, and prioritize by DSCP marking.

**`2892` feat: SD-CXO geo for multihop intermediates** — the policy can consult geographic data (sourced from the service-discovery CXO feed) about candidate intermediates, so a policy can express geographic intent for the middle hops.

**`2887` fix: drop goroutine-based cancellation (race with starlark.Call)** — an early implementation detail: goroutine-based cancellation raced with `starlark.Call`, so cancellation is handled differently. Runnable example policies and distribution observability land alongside (#2898, #2900), and the empty-candidates drop bug is fixed across the examples.

This is a genuinely significant capability: the routing *mechanism* (multihop, mux, disjoint, asymmetric) is now driven by a routing *policy* the operator controls, evaluated safely in a sandbox, per dial, per app.

### Skywire: Routing — DMSG Hops in Multihop Routes

**`2899` fix(router): strip DMSG hops from multihop routes everywhere** — dmsg transports are stripped from multihop routes. A dmsg link is itself an overlay hop to a server and back; threading it through a multiplexed multihop route is the wrong shape (it defeats the disjoint-path intent). Multihop routes are built from skywire's own point-to-point transports.

### Skywire: Hypervisor — PK Endpoint Opt-In

**`2895` feat(hypervisor): GET /api/pk + DisablePKEndpoint + SW-Public gate** + **`2896` fix: flip pk-endpoint to opt-in + add config-gen flag** + **`2901` feat(autoconfig): --pk-endpoint / --no-pk-endpoint flag** — the unauthenticated `/api/pk` discovery endpoint (used by first-boot autoconfig) is gated behind `SW-Public` and flipped to **opt-in**: off by default, enabled with `--pk-endpoint`. A small surface, closed by default.

### Skywire: Misc

- **`2886` fix(rewards): pin UT cache to hist/ + eligible-pair filter** — reward-calculation housekeeping (UT cache location, eligible-pair filtering).
- **`2863` docs: RFC — unified service contract (#2775)** — the design doc for the app-framework refactor.
