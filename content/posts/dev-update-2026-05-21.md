+++
date = "2026-05-21"
tags = ["Development", "Skywire"]
title = "Development Update — May 21"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A routing-correctness day. The local-route calculator gets a proper N-hop BFS so multi-hop local routes are found deterministically and honor a minimum hop count, and the mux-bandwidth and ping paths get a round of race fixes and failure-surfacing so the measurements are trustworthy.

### Skywire: Local Routing — Deterministic N-Hop BFS

When a route can be assembled from transports the visor already knows about (without consulting the route-finder service), it does so locally. That local calculation needed to be both correct and deterministic.

**`2755` feat(router): N-hop BFS in calculateLocalRoutes — deterministic local routing** — `calculateLocalRoutes` walks the local transport graph with a breadth-first search out to N hops, producing routes deterministically rather than depending on map iteration order.

**`2753` fix(router): calculateLocalRoutes must honor MinHops > 2** + **`2758` fix(router): local-route BFS visited-set was shadowing longer paths** — two correctness fixes on that BFS: it now honors a `MinHops` greater than 2 (so a caller asking for a longer overlay path isn't handed a short one), and the visited-set no longer marks a node so early that it shadows valid longer paths through it. Together they make the local calculator return the routes a multiplexed/min-hops dial actually asked for.

### Skywire: Mux-Bandwidth + Ping — Trustworthy Measurement

Yesterday's measurement surface gets the fixes that make its numbers reliable.

**`2754` fix(rpcgrpc): mux-bw probe-after-pump race + per-level LevelDone counters** + **`2756` feat(rpcgrpc/mux-bw): surface pump-phase route failures as MuxRouteFailure events** — a race between the bandwidth pump and the follow-up probe is closed, per-level `LevelDone` counters are added, and a route that fails *during the pump phase* now surfaces as an explicit `MuxRouteFailure` event instead of silently dropping out of the average. A multiplexed measurement that quietly loses a path overstates per-path health; making the failure visible keeps the number honest.

**`2757` / `2761` / `2762` — ping plumbing** — `PingOnceWithEcho` forwards `RouteIndex` + `MinHops` (so a ping measures the route the caller meant), the `ping.mu` critical section is narrowed to just the map lookup (less contention on a hot path), and write deadlines are added to `PingOnceWithEcho` plus a `RouteIndex` passthrough on the probe.

### Skywire: Skynet Client / CLI

- **`2759` fix(skynet/client): accept loop with per-conn remote dial + half-close drain** — the client accept loop dials the remote per-connection and half-closes to drain buffered bytes on teardown (the same drain-don't-truncate pattern applied on the server side).
- **`2760` fix(cli/skynet,visor): list custom-named skynet apps + render AppStatusStarting** — custom-named skynet apps show up in the listing, and the transient `AppStatusStarting` state renders instead of looking like nothing is happening.
