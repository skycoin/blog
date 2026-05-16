+++
date = "2026-04-30"
tags = ["Development", "Skywire"]
title = "Development Update — April 30"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: DHT Address Mirror + Self-Publish

PR #2399 adds two pieces that close the loop on what visors can do over the DHT directly, without dmsg-discovery as a write path.

**Self-publish** — every visor now mirrors its own DMSG entry into the DHT on the same cadence the dmsg-discovery sees in HTTP. The DHT target is SHA256(visorPK || "client"), the value is the full signed dmsg entry. A peer that wants to dial a visor can look up the entry from the DHT just like it would from dmsg-discovery — same shape, same signature verification.

**Address mirror** — the resolver layer (`.dmsg`/`.skynet` hostname resolution) now consults the DHT in addition to dmsg-discovery. If the DHT has a fresher entry — which it often does, since the visor self-publishes on every transport change rather than waiting for the dmsg-discovery TTL refresh — the resolver uses the DHT value.

The combined effect: a visor's discovery surface is reachable through three independent paths now (HTTP dmsg-discovery, DHT via dmsg-discovery's mirror, DHT via the visor's self-publish). Production services remain the source of truth, but a partitioned visor that can't reach dmsg-discovery can still answer dial attempts from the DHT.

### Skywire: DHT Spec + CLI

**`2398` dht: spec audit, comparison doc, peers/reconcile/source CLI** — three deliverables in one PR:

- **Spec audit** — `docs/dht.md` reconciles what the implementation does against the Kademlia paper, calls out the deviations (recursive vs iterative lookup, our value-size cap, the salt convention), and flags TODO items for the next pass.
- **Comparison doc** — `docs/discovery-comparison.md` lays out HTTP-discovery, DHT-mirror, and CXO-feed side by side, with a "which read path wins for what query" table. Useful for new contributors trying to understand why we have three discovery layers.
- **CLI** — `skywire cli dht peers` lists known DHT peers with distance metric, `dht reconcile` triggers a manual re-mirror pass (the operator escape hatch when DHT and HTTP diverge), `dht source <key>` reports which writer last published a given target (debugging signature collisions).

### Skywire: SUDPH Nil-Guard

**`2400` fix(sudph): nil-guard Dial when listen() failed** — if the SUDPH listener failed to bind at startup (port already in use, permission denied), subsequent `Dial` calls would nil-deref on the listener reference. The fix returns a typed error instead, and the autoconnect manager skips SUDPH for the remainder of the process lifetime once the listener is known-dead. The visor still serves stcpr/dmsg in that state.

Also bundled: a lint sweep that had been accumulating on develop. The `--strict` go vet check is back to clean.

### Skywire: Misc

- The lint sweep clears about a dozen newly-flagged staticcheck items that had built up alongside the DHT and skychat-pairing PRs over the last two weeks.
- Routine doc touch-ups on the resolver auto-chain example to use the new `serve` command instead of the retired `skynet port`.
