+++
date = "2026-05-08"
tags = ["Development", "Skywire", "Discovery"]
title = "Skywire Discovery: From DHT to CXO + HTTP"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Two weeks ago we shipped a Kademlia DHT as the decentralized discovery layer for Skywire — TPD, SD, and dmsg-discovery mirrored their authoritative data into it, visors could read from it as an alternative to HTTP, and the dmsg-servers ran full DHT nodes. The vision was that production services would gradually transition to bootstrapping points while the DHT carried the real load.

Today we're removing the DHT.

The replacement isn't a step back to centralized HTTP. It's a different decentralization model — **CXO publishers and subscribers** — that turns out to fit Skywire's actual needs much better than a Kademlia DHT.

### What didn't work about the DHT

The Kademlia model is solid for the problem it was originally designed for: a flat, contentless namespace where any peer can announce any key, and lookups proceed by distance metric. Skywire's discovery problem is different:

- Every key is **owned by a specific identity**. A visor's DMSG entry can only legitimately be published by that visor. A transport entry's edges are the two PKs in the transport itself.
- Values have **rich structure** — signed entries, multi-edge transports, per-port metadata.
- Consumers want **freshness ordering**, not just "any value at this key". A six-month-old transport entry from an offline visor is worse than no entry.

The Kademlia layer ignored all of this. We bolted on signatures to keep peers from forging entries, salt conventions to deduplicate the multi-edge case, and freshness heuristics to evict stale items. Each addition was a leak of identity-semantics into a layer that wanted to be content-agnostic.

The operational side was just as awkward. The DHT's 16K (later 64K) value-size cap meant a visor with hundreds of transports couldn't fit its full edge list in one mirror item; the per-edge sharding fix from PR #2334 worked, but at the cost of N+1 reads to assemble the same view HTTP gave in one query. Signature-collision deduplication meant we needed a "which writer wins this key" rule; whichever rule we picked had failure modes the other didn't.

### What CXO does instead

CXO is Skywire's content-addressed, signed, replicated tree-store. It already powers user-publishable feeds, the chat-app's group-chat layer, and the per-pair encrypted message system that landed last week. The discovery refactor leverages the same machinery:

- **Every authoritative source publishes its own data into a CXO feed it owns.** A visor publishes its self-tracking telemetry. TPD publishes the live transport-discovery aggregate. SD publishes the services-by-PK view. dmsg-discovery publishes clients-by-server.
- **Consumers subscribe to the feeds they need.** The visor's `cli tp ls` reads from a local subscriber on TPD's feed. The hypervisor's fleet view subscribes to multiple feeds at once.
- **HTTP discovery services remain as bootstrapping points and aggregators.** The first cold connect from a fresh visor still hits HTTP; once the visor has dmsg up, it subscribes to the feeds and most reads happen there.

The identity model is the right shape this time: only the visor can publish to its own feed (CXO enforces the publisher-PK match on every write). The freshness model is the right shape: subscribers see ordered events, not best-effort key-value samples. The size model is the right shape: feeds are unbounded streams of tree nodes, no 16K cap, no per-edge sharding workaround.

### What changes for operators

A few concrete things:

**The `cli dht ...` command tree is gone.** `dht peers`, `dht reconcile`, `dht source` — all removed. The equivalent for the new model is `cli visor feeds list` (lists feeds the local visor publishes) and the existing `cli tp ls` / `cli pv` reads that now transparently use the CXO subscriber view.

**The `--dht-*` flags across the binaries are removed.** Visor, dmsg-server, TPD, SD, dmsg-discovery — none of them take DHT config any more. Operator config files lose ~5 lines on average.

**dmsg-server no longer requires Redis.** The DHT mirror needed a Redis-backed node store. Without the DHT, dmsg-server is back to its pre-DHT shape: a stateless message-passing daemon with an in-memory client table. The Redis dependency in the deployment config is now scoped to the services that always needed it (SD, dmsg-discovery, AR).

**dmsgfirst is now the default discovery transport.** The dmsgfirst APIClient (PR #2433) that lets visors talk to discovery over dmsg with HTTP fallback is the steady-state shape. The visor upgrades its HTTP clients to dmsgfirst once its dmsg session is up (PR #2441), so the only operator-visible artifact of HTTP-vs-dmsg is which path appears in `pprof` traces.

### What stays the same

Discovery still bootstraps via HTTP. Production services still serve as the authoritative aggregation point. The visor's view of "who is the network" is still seeded from the conf service's bootstrap data. None of the operator's existing config or deployment topology has to change — the DHT-removal PRs touch internal machinery, not the external API.

The net effect is about 4,000 lines of code removed, a clearer mental model for new contributors, and one fewer subsystem to debug when something goes wrong in production. The decentralization story didn't go away — it changed shape into something better aligned with what Skywire's discovery layer actually needs.

### Where we go next

With CXO as the canonical discovery transport, the next steps are about widening the set of things published over feeds. Several have already landed this week:

- Per-transport latency (PR #2401) is in the entry, exposed through the CXO subscriber
- Transport uptime via CXO-driven heartbeats (PR #2426) is in the per-visor self-published bitmap
- Geo records on SD entries (PR #2439) replace the HTTP geoip dependency
- Per-service uptime + version provenance (PR #2428) is in the local bbolt, exposed to the hypervisor through RPC

The pattern is becoming familiar: any piece of network state that used to require an HTTP poll has a CXO-shaped equivalent now, and the operator surface is converging on "subscribe to what you need, the HTTP fallback is always there if you need it."
