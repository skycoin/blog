+++
date = "2026-05-11"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — May 11, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: v1.3.52 — Network-State + Observability Release

PR #80c2fd2c1 cuts release v1.3.52, capping the network-state arc that ran from late April through last week. Headline items in the release:

- DHT removal in favor of CXO + HTTP discovery (#2459)
- `pkg/services` framework with single-process multi-service supervisor (#2464–#2472)
- Single-container CI e2e (#2471)
- CXO publishers on every authoritative source; CXO subscribers replacing HTTP polls across the visor and tpviz (#2456–#2463)
- dmsgfirst APIClient with HTTP fallback (#2433, #2441)
- Per-transport latency end-to-end (#2401)
- Transport uptime via CXO-driven heartbeats with minute granularity (#2426)
- Stats / serviceuptime / version provenance in local bbolt (#2428)
- WAN-reachable hypervisor-embedded dmsg + discovery proxy + terminal persistence (#2450)

The release lines up the network for the round of resilience and observability work landing this week.

### Skywire: SD + DMSGD — Decouple HTTP Register from CXO Publisher Mutex

PR #2495 catches a contention bug introduced by the always-on CXO publishers. The SD and dmsg-discovery's HTTP register paths (the hot path for every visor's bootstrap + every dmsg-server's client churn) were grabbing the CXO publisher mutex to push the published-feed update inline with the HTTP response.

Under load, the publisher mutex saw contention from the CXO tree-walk path (writers writing changes into bbolt) holding it for ~100ms at a time. HTTP register calls queued behind those writes, surfacing as register-latency spikes correlated with feed-publish events.

The fix: HTTP register completes and returns to the caller immediately; the CXO publish is enqueued onto a buffered channel and applied by a separate publisher goroutine. Order is preserved per-PK by keying the queue on the entry's PK; cross-PK concurrency is allowed.

Visible effect: SD register latency p99 dropped from ~300ms to ~15ms on a busy network, with no observable change in feed freshness (the publisher goroutine catches up within milliseconds in steady state).

### Skywire: Always-On CXO Publishers

**`2494` feat(sd, tpd, dmsgd): make CXO publishers always-on instead of flag-gated** — the publishers shipped behind a `--cxo-publish` flag for the rollout. Two weeks of running with the flag enabled across the deployment have proved out the model; the flag is removed and the publishers are unconditional. One fewer knob to remember; the operator surface is smaller.

### Skywire: CLI + Visor + TPD — Close CXO Subscriber Gap

**`2491` feat(cli, visor, tpd): close CXO subscriber gap (SD services, TPD all-transports) + bbolt cache fallback** — the visor was subscribing to SD's services feed and dmsg-discovery's clients feed but not to TPD's all-transports feed. The gap meant `cli tp ls` and the hypervisor transports tab still hit HTTP TPD for the full list.

The PR adds the TPD all-transports CXO publisher, the visor subscriber, and a local bbolt cache so a visor that boots offline can still display its last-known transport list. CLI + hypervisor pull from the local cache; the cache refreshes from the CXO subscriber whenever it's connected.

### Skywire: route-calc — Latency Sort

**`2492` feat(stats, route-calc): panic-recover sampler + route calc --by-latency** — `cli route calc` defaulted to sorting by hop count, with latency as a tiebreaker. With per-transport latency now reliable, latency is the more useful primary sort.

`--by-latency` (new flag) sorts by sum-of-RTT across the route's transports, with hop count as the tiebreaker. The existing default (hops first, latency tiebreak) is preserved without the flag for backward compatibility.

Bundled fix: the stats sampler ran in a goroutine without a recover wrapper. A panic in the per-sample serialization (rare but reproducible under specific corrupted-input shapes) was bringing down the visor. The recover wrapper logs and restarts the sampler.

### Skywire: Skychat CLI — Auto-Reconnect Listen on SSE Drop

**`2498` fix(cli/skychat): auto-reconnect listen on SSE drop instead of exiting** — the `skywire cli skychat listen` command exited on its first SSE stream drop. Visor restarts left operators staring at a dead shell prompt.

Now the command treats stream drops as transient: exponential backoff (1s → 30s capped), reconnect, resume listening. The earlier explicit-Ctrl+C path is preserved as the cancellation mechanism. Operators can leave the listener running across visor restarts and not lose their tail.

### Skywire: Misc

- **`2493` refactor(ping)**: consolidate the ping commands (visor ping, network ping, latency probe) into a single tree command with bug fixes and a per-iteration spinner.
- **`2496` fix**: drop redundant `\n` in skychat-listen's banner Println.
- **`2490` fix(autoconfig)**: propagate the resolved PKGENV/USRENV mode to the gen subprocess (a passed-mode wasn't reaching the spawned config-gen).
- **`2499` fix(cxo/data/idxdb)**: implement a real in-memory IdxDB (the placeholder was a no-op stub that lost writes on close — irrelevant for normal use but a problem for tests).
- **`2497` fix(cxo/node): plug Connection read/write-loop goroutine leak** — `DMSG.closeConn` was missing the explicit `Connection.Close()` call that tears down both the read and write loop goroutines. Each closed connection leaked two goroutines for the rest of the process lifetime. Defensive `defer c.Close()` added at the top of both loops as a backstop.
