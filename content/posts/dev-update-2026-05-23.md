+++
date = "2026-05-23"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — May 23, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A heavy day, and a release. The routing layer learns **asymmetric, latency-ranked** path selection — forward and reverse legs can carry different route counts and minimum hops, and candidates are ranked by measured per-hop latency rather than picked arbitrarily. Transport discovery becomes **CXO-aware**: local route calculation reads the transport graph from the CXO feed before reaching for HTTP. The hypervisor gains real **drill-down** — proxying RPC through a sub-hypervisor to manage visors nested behind it — plus runtime management commands. And it all ships as **v1.3.54**.

### Skywire: Routing — Asymmetric, Latency-Ranked Paths

Real network paths aren't symmetric. The route that's best from A to B isn't necessarily the best from B to A, and a flow may want more parallel routes in one direction than the other. Today's work makes the router treat the two directions independently and choose paths by measurement.

**`feat(router): per-direction MuxRoutes for asymmetric route counts** + **`feat(router): per-direction MinHops for asymmetric routing** — the forward and reverse legs can now carry different `MuxRoutes` counts and different `MinHops`. A download-heavy flow can fan out more routes inbound than outbound; a path with an asymmetric overlay requirement can express it.

**`feat(router): rank route candidates by measured per-hop latency** — candidate routes are ranked by their measured per-hop latency, so the router prefers the genuinely faster path rather than the first one it assembles. This is what turns the latency measurement work of the previous days into an actual routing decision.

**`feat(router): unpair forward/reverse candidate selection** — forward and reverse candidates are selected independently (un-paired), a prerequisite for the asymmetric counts above.

**`fix(router): retry with different intermediate on id_reservation dial failure** — when reserving a route id fails at an intermediate, the router retries with a *different* intermediate rather than giving up on the whole route. Combined with the earlier "blame the intermediate, not the destination" fix, a single bad middle hop no longer dooms a dial. (The aux mux dials skip retry-with-exclude by design — documented so the asymmetry is intentional, not a bug.)

Plus the plumbing to make it coherent: `opts.MinHops` + `AppName` thread into `establishMuxRoutes`' aux mux options, and a `pickDisjointPath` bounded-index gosec note.

### Skywire: Transport Discovery — CXO-Aware, Before HTTP

A quiet but architecturally significant change: transport discovery can now read from the CXO feed first.

**`feat(visor): CXO-aware transport.DiscoveryClient — local route calc reads CXO before HTTP** — local route calculation consults the CXO-published transport graph before falling back to an HTTP request to the discovery service. Transports are gossiped over the p2p substrate as CXO feed content, so a visor can learn the graph from the overlay itself rather than depending on an HTTP round-trip. The HTTP path remains as a fallback; the point is that it no longer has to be the primary.

**`fix(sd,dmsgd): pre-warm CXO publisher tree from redis at startup** — the service-discovery and dmsg-discovery CXO publishers hydrate their tree from redis at startup, so a freshly restarted service publishes a complete feed immediately instead of rebuilding it from live traffic. (And the now-unused `tpdCache` field + its accessors are removed — the CXO-aware path supersedes it.)

### Skywire: Hypervisor — Drill-Down Through Sub-Hypervisors

The nested-visor tree gets teeth: an operator can now manage a visor that's only reachable *through* another hypervisor.

**`feat(hv): proxy visor RPC through a sub-hypervisor for drill-down access** — the top hypervisor proxies a visor's RPC through the sub-hypervisor that can reach it, so the operator drives a deeply-nested visor as if it were local.

**`feat(hvui/node-list): render per-sub-hypervisor sections below the main table** — the node list renders a section per sub-hypervisor under the main table, each with the full-fat main-table styling. A cluster of fixes makes those sections behave: parse transports in the sub-section tree response, surface the transports column, default Online visors to healthy when `ServicesHealth` is empty, star only the row matching that section's hypervisor PK, dedup hypervisor rows, and propagate `ServicesHealth` through `HVVisorEntry` into the status dots.

**`feat(hvui): default node label to hostname; surface hostname on node info tab** — a visor's hostname becomes its default label (more legible than a bare PK), surfaced on the info tab and in the tree summary.

### Skywire: Runtime Hypervisor Management

**`feat(visor/hv): runtime management — rm/--all/passwd CLI, hypervisor section on visor info** — runtime management lands: `cli` commands to remove a hypervisor (`rm` / `--all`), change the hypervisor password (`passwd`), and a hypervisor section on `visor info`. Managing the hypervisor relationship no longer requires editing config and restarting.

**`fix(cli/config): applyFlagsToConf handles bash-array flags (HYPERVISORPKS et al)** — config flags that arrive as bash arrays (like `HYPERVISORPKS`) are parsed correctly instead of mangled.

### Skywire: Release v1.3.54

**`release(v1.3.54): changelog for multihop-routing + CXO-reliability release** — v1.3.54 ships, headlining the multihop-routing work (asymmetric/latency-ranked paths, mux measurement) and the CXO-reliability campaign of the preceding weeks.
