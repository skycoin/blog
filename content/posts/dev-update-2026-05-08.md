+++
date = "2026-05-08"
tags = ["Development", "Skywire"]
title = "Development Update — May 8"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Today is a turning point. Two large arcs land on the same day: **Kademlia DHT is removed from the codebase**, and the **deployment services migrate onto a shared `pkg/services` framework** that collapses nine deployment containers into one for CI e2e.

### Skywire: DHT Removed — CXO + HTTP Discovery Wins

**`2459` chore: remove the Kademlia DHT subsystem in favor of CXO + HTTP discovery** — the DHT shipped in late April was a sincere attempt at decentralized discovery. Two weeks of running it in production surfaced enough operational sharp edges (value-size limits, signature collision dedup, the difference between DHT and HTTP being a constant source of "which one is right" questions) that the project chose the simpler CXO-publisher / CXO-subscriber model instead.

The mental model is cleaner: every authoritative source (visor, dmsg-server, deployment service) publishes its own data into a CXO feed. Consumers subscribe to the feeds they care about. The HTTP discovery services remain as bootstrapping points and aggregators. No DHT salts, no signature dedup heuristics, no Kademlia routing-table churn.

What stays:

- HTTP discovery services as the source of truth and aggregation point
- CXO publishers on every visor + service
- CXO subscribers on consumers
- The dmsgfirst client pattern from this week

What goes:

- `pkg/dht/` entirely
- DHT mirror code from TPD, SD, dmsg-discovery
- DHT bootstrap code from dmsg-server
- The `cli dht` command tree
- `--dht-*` flags across the binaries

This is a meaningful simplification — about 4,000 lines net deletion across the codebase, and a clearer story for new contributors trying to understand how discovery works in Skywire.

### Skywire: pkg/services Framework

The other arc: a shared framework for running deployment services in a single process.

**`2464` feat(svc): pkg/services framework + `skywire svc run` multi-service supervisor** — the framework itself. A `Service` interface (Start, Stop, Health), a `Supervisor` that owns the lifecycle of N services in one process, structured logging, shared HTTP mux for `/health`, `/metrics`, `/pprof`, and graceful shutdown that respects the dependency order.

The follow-on migrations land each existing service onto the framework:

- **`2465` migrate dmsg-discovery**
- **`2466` migrate dmsg-server**
- **`2468` migrate transport-discovery**
- **`2469` migrate service-discovery, address-resolver, route-finder** (three services share a PR because they share a redis dependency)
- **`2470` migrate setup-node, transport-setup, stun-server**
- **`2472` migrate skywire-visor onto pkg/services framework**

Each migration is roughly: extract the existing main into a `Service` impl, wire it into the framework, remove the per-service main package's bespoke shutdown handling. The PRs are small and mostly mechanical, but the cumulative effect is large — the deployment can now run on one binary with one config file, and CI doesn't have to start nine containers to test cross-service interactions.

### Skywire: Nine Containers → One

**`2471` feat(svc): collapse nine deployment containers into one for CI e2e** — the existing CI e2e ran the full deployment as nine docker containers (one per service) wired through docker-compose. Cold-starting them on a dual-core GitHub Actions runner took ~90 seconds and racing for CPU during init caused flaky tests in the early test-run window.

The collapsed configuration runs the full deployment in one container using `skywire svc run --config deployment.json`. Startup is sequential, cleanly logged, and ~20 seconds wall time. The same docker-compose with nine containers still works for production deployments; CI just uses the one-container form for speed.

**`2473` fix(e2e): update Makefile e2e-run for collapsed services container** — Makefile target updates to drive the new single-container form.

### Skywire: CXO Publishers — Always-On

**`2456` feat(sd, dmsgd): add CXO publishers for services + clients-by-server** — SD publishes its services-by-PK feed; dmsg-discovery publishes its clients-by-server feed. Consumers subscribe to these feeds to get the same data they'd previously fetched via HTTP, with live updates instead of polling.

**`2462` feat(visor): cut VPNServers / ProxyServers / PublicVisors over to CXO snapshot** — the visor's `cli visor vpn-servers`, `proxy-servers`, and `pv` commands now read from a CXO subscriber on the SD's published feed. HTTP fallback remains for visors that haven't completed their subscriber handshake yet.

**`2461` feat(visor/autoconnect): pull public visors from CXO snapshot when available** — autoconnect's "pick a public visor to dial" path reads the CXO snapshot first. Fresher data than the HTTP poll cycle could produce, and one less HTTP round-trip per autoconnect cycle.

**`2458` feat(tpviz): cut /api/services over to CXO subscriber with HTTP fallback** — tpviz's services endpoint reads from the subscriber.

**`2457` feat(visor): add on-demand CXO subscription manager** — the visor maintains its CXO subscriptions through a manager that opens subscribers lazily when first queried and closes them when idle. Avoids carrying every possible subscription open all the time on a memory-constrained visor.

**`2460` refactor(visor): cycle-based CXO sync — subscribe → snapshot → unsubscribe** — the canonical pattern for one-off reads: subscribe, wait for the first snapshot, unsubscribe. Avoids the long-lived-subscription overhead for queries that only need a point-in-time read.

**`2463` feat(tpviz): add /api/dmsg/servers/clients backed by DMSG-D clients-by-server CXO snapshot** — tpviz's per-server client view is now backed by the CXO feed from dmsg-discovery, replacing an HTTP poll that was previously a hot endpoint.

### Skywire: Misc

- **`2474` chore(deps)**: fast-uri 3.1.0→3.1.2 + go deps update; always-on tpviz tab.
- **`2455` fix(dmsg)**: break dmsgfirst recursion via context guard in HTTPTransport — the day-after follow-up to yesterday's deadlock-fix series, plugging one last recursion path that lived in the HTTP transport's retry handler.
