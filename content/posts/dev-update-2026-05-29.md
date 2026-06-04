+++
date = "2026-05-29"
tags = ["Development", "Skywire", "Routing"]
title = "Development Update — May 29"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The routing-policy work keeps building. Yesterday's Starlark policies gain a **WASM backend** (a compiled, language-agnostic alternative to the Starlark interpreter), the operator-facing name **"skylark"**, periodic route **rotation**, a hypervisor-UI panel to manage it, and runtime per-app hot-swap. Underneath, the router's mux loop gets a best-effort + local-fallback path, and the CXO node sheds a long-standing accept-path serialization bottleneck. Two releases, v1.3.60 and v1.3.61, go out.

### Skywire: Routing Policy — WASM Backend, Rotation, and "Skylark"

**`2913` feat(router/policy): WASM backend for routing policies** — alongside the Starlark interpreter, policies can be compiled to **WASM** and run through a WASM backend. Starlark is the readable, write-it-inline option; WASM is the compile-it-from-any-language, run-it-fast option. The router can evaluate either.

**`2912` docs(routing-policy): introduce "skylark" operator-facing name** — the operator-facing name for the policy system: *skylark* (skywire + Starlark). A name an operator can search for and reason about.

**`2916` feat: periodic rotation hook + WASM ABI extension** + **`2921` fix: start rotation loop from SetRotation, not init** — a policy can rotate routes periodically (e.g. shift a flow onto a fresh set of disjoint paths every N seconds), driven by a rotation hook, with a matching WASM ABI extension so WASM policies can do it too. The rotation loop starts when rotation is actually set, not unconditionally at init.

**`2919` feat: re-land extension dispatch + runtime per-app swap** — extension dispatch returns, and a policy can be **hot-swapped per app at runtime** — change the policy governing your proxy's routing without restarting anything.

**`2922` feat: avoid_direct knob to force overlay path** → **`2924` refactor: drop avoid_direct, rely on min_hops** — a brief design iteration: an `avoid_direct` knob to force the overlay was added, then dropped in favor of expressing the same intent through `min_hops` (a minimum hop count > 1 already forces the overlay), keeping the vocabulary minimal. `AppName` threading is re-applied in the same pass.

**`2911` feat: hook into sky_forward_conn direct dials** + **`2908` feat(router): wire DialHook into PingRoute** — the policy hook reaches more of the dial surface: forwarded-connection direct dials and the ping path both consult it, so policy governs measurement and forwarding too, not just app dials.

**`2918` feat(hypervisor-ui): routing-policy panel in the routing tab** — the hypervisor UI gains a routing-policy panel in the routing tab, so the policy can be viewed and managed from the dashboard, not only the CLI.

### Skywire: Router — Mux Resilience

**`2909` feat(router): mux loop best-effort + local-calc fallback** + **`2910` feat(router): parallel mux aux dials** — the multiplexed-route construction becomes best-effort with a local-calculation fallback (assemble what you can from known transports if the route-finder is slow), and the auxiliary mux dials run in parallel rather than serially — faster to bring up N routes.

### Skywire: CXO — Shard the Connection Maps

**`2907` fix(cxo/node): shard connection maps to remove Node.mx accept-path serialization** — the CXO node kept its connection maps under a single `Node.mx` mutex, which serialized the accept path: every incoming connection contended on one lock. Sharding the maps removes that bottleneck, so accepts scale instead of queuing behind each other. A foundational throughput fix for a node handling many peers.

### Skywire: Storage + Transport

- **`2926` fix(bbolthealth): cover all visor bbolt opens + recover from probe panic** — the bbolt corruption-recovery now covers *every* bbolt open in the visor (not just the ones fixed earlier) and recovers from a panic in the health probe itself.
- **`2927` fix(transport): count VStream + ping bytes in sent counter** — the sent-bytes counter now includes VStream and ping bytes, so the accounting matches reality.
- **`2928` fix(router): tune circuit breaker for dmsg-session refresh cadence** — the circuit breaker is tuned to the dmsg-session refresh cadence so a normal refresh doesn't trip it.

### Skywire: Apps + Releases

- **`2914` feat(apps): --reconnect for skysocks-client and skynet-client** — both clients gain a `--reconnect` flag to re-establish on drop.
- **v1.3.60** (65 PRs on top of v1.3.59) and **v1.3.61** (autoconfig writes to the resolved config path, via `2931`/`2932`) ship.
