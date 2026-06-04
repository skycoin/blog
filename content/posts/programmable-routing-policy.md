+++
date = "2026-06-04"
tags = ["Development", "Skywire", "Routing"]
title = "Programmable Routing Policy: Skylark and WASM"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Skywire's router has, over the last month, become genuinely capable. It builds **multihop** routes through chosen intermediates, fans a flow across **multiplexed** parallel routes, keeps those routes **disjoint** (no shared middle hop), routes the forward and reverse legs **asymmetrically**, and **ranks candidates by measured per-hop latency**. That's a rich mechanism.

But a mechanism needs a policy. *Which* of those capabilities applies to a given flow — how many routes, how many hops, through which countries, rotated how often — was, until recently, a decision hardwired in Go. If you wanted your VPN traffic to take a different path than your chat traffic, or to avoid transiting a particular jurisdiction, or to fan across four disjoint paths during the workday and collapse to one at night, you patched the router.

Now you write a program. Skywire evaluates a **routing policy** — a small, sandboxed script you control — every time an app dials, and obeys what it returns.

### The decision, as a function

A per-dial policy is a function. The router calls it when an app opens a connection, hands it the dial context and the candidate routes it has found, and uses the `RouteSpec` it returns:

```python
def decide_route(ctx, candidates):
    # ctx.app, ctx.dst, ctx.now, ... ; candidates is the list of
    # routes the router assembled. Return how to use them.
    return RouteSpec(mux=4, min_hops=3, distribution="auto")
```

`RouteSpec` is the vocabulary of intent: how many parallel routes (`mux`), the minimum hop count (`min_hops` — anything above 1 forces the overlay rather than a direct shortcut), an explicit `chosen` route from the candidates, and a `distribution` descriptor for how packets spread across the parallel routes.

This is deliberately a *function*, not a config table. Real operator intent grows past one line. The canonical example — "only transit Indonesia on Friday evening" — already wants an intermediate variable and a conditional. So the policy layer is a real (if small) language.

### Why Starlark — and the operator name, "skylark"

The language is [Starlark](https://github.com/google/starlark-go): a Python dialect designed for configuration, sandboxed by construction (no file system, no network, no clock unless you hand it one), deterministic, and embeddable in Go. It was chosen over a field of alternatives — CEL, Expr, Lua, JS engines, Rego, raw WASM — because the others either cap out at single-expression evaluation (too small for policies that will grow) or bring a mental model too alien for an operator to pick up in an afternoon. Starlark reads like Python, runs in a sandbox, and can't wander off the reservation.

The operator-facing name for the system is **skylark** — skywire plus Starlark.

A policy gets a routing-flavored standard library to make decisions with — the inputs an operator actually reasons about:

- `datetime` — `weekday`, `now`, so a policy can be time-of-day or day-of-week aware.
- `geo` — `geo.country(pk)` for a peer or intermediate, sourced from the embedded GeoIP database and the service-discovery feed (no extra infrastructure).
- `transports` — measured latency and history for candidate links.
- `peers` — what's known about the parties.

Expensive lookups (GeoIP, transport history) are cached visor-side so an evaluation stays inside its budget — the per-dial policy runs tens to hundreds of times a second and is held to a single-digit-millisecond cost. A geographic policy reads naturally:

```python
def decide_route(ctx, candidates):
    # Drop any candidate whose intermediates transit the US.
    ok = [c for c in candidates
          if all([geo.country(h) != "US" for h in c.hops])]
    if not ok:
        return RouteSpec()          # no acceptable path → fall back
    return RouteSpec(chosen=ok[0], mux=2)
```

### Two layers: a fast path the policy configures

There's a tension: a per-dial decision can afford a millisecond of Starlark, but a *per-packet* decision (which of the four parallel routes does *this* datagram take?) has a budget measured in microseconds — far too tight for an interpreter.

Skywire resolves it by splitting the work. **Layer 1** is the per-dial Starlark above. **Layer 2** — the per-packet distribution across the multiplexed routes — stays compiled Go on the hot path. The policy doesn't *run* per packet; it *configures* the per-packet behavior, by returning a distribution descriptor:

- `"auto"` / round-robin (the default),
- `"weighted: 0.5, 0.3, 0.2"` — split by weight,
- size-threshold splits, and similar.

You get to shape the fast path without slowing it down.

### Reacting to a changing mesh

Routes are not static — mux legs come and go as transports open and close after the initial dial. A policy can react. The `on_leg_change` callback fires whenever a leg is added or dropped, and returns a fresh distribution sized to the live leg count. From a real example policy that keeps an even split across however many legs survive:

```python
def on_leg_change(ctx, legs, change):
    n = 0
    for l in legs:
        if l.alive:
            n += 1
    if n == 0:
        return RouteSpec()                      # no override
    return RouteSpec(distribution = "weighted: " + ", ".join(["1"] * n))
```

Policies can also rotate routes periodically — shift a flow onto a fresh set of disjoint paths every N seconds — driven by a rotation hook that receives the per-leg byte counters and the hop chain, so the rotation decision is made on real traffic data rather than a blind timer.

### Per-app, hot-swappable

A visor carries a global default policy (`conf.Routing.PolicyPerDial`, an inline string or an `@/path/to/policy.star` reference). Any app can override it with its own `routing_policy` — so your proxy, your VPN, and a latency-sensitive app can each route differently, and the policy can branch internally on `ctx.app` if you'd rather keep one script. Policies hot-swap per app at runtime: change the policy governing a flow without restarting the app, the visor, or anything else. A file-watcher reloads a changed policy on the fly; in-flight evaluations finish on the version they started with.

### A WASM backend, too

Starlark is the readable, write-it-inline option. For policies that want to be authored in another language, or run as fast compiled code, there is a parallel **WASM backend**: compile a policy to WebAssembly against the same ABI (the same `decide_route` / `on_leg_change` contract, the same stdlib surface) and the router evaluates it through a WASM host instead of the Starlark interpreter. `cli route policy test` and `bench` dispatch `.wasm` scripts to that backend automatically. Same contract, two engines — pick by taste and performance.

### Safety, and never blocking a dial

A routing policy sits on the hot path of every connection, so it cannot be allowed to break connectivity. The contract is defensive by design:

- A policy that panics, times out, or returns garbage is logged and the router **falls back to its built-in default route selection**. A dial is never blocked waiting on policy resolution.
- A configurable `policy_failure_mode` chooses between fall-back-to-default and drop, for operators who would rather fail closed.
- `cli route policy test --script foo.star` previews a decision without dialing, and `cli route policy bench` runs a policy a million times and reports p50/p99 — with a hard error at load time if it blows its budget. You find out a policy is too slow before it ships, not in production.

### Why this matters

A peer-to-peer transport mesh with multihop, multiplexed, disjoint, latency-ranked routing is a powerful substrate — but a substrate is only as useful as the control you have over it. Hardwiring path selection in Go meant every operator got the same routing, and changing it meant changing the program everyone runs.

Skylark makes the routing *mechanism* programmable by the *operator*, safely, per dial, per app, evaluated in a sandbox, with a compiled fast path underneath and a guaranteed fall-back if anything goes wrong. "Prefer low latency, but force at least three hops for this app, fanned across four disjoint paths that avoid a particular country, rotated every thirty seconds, collapsing to one path off-hours" stops being a feature request and becomes a few lines of Python-shaped policy you drop in a file.
