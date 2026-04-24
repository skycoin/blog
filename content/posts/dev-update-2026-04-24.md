+++
date = "2026-04-24"
tags = ["Development", "Skywire"]
title = "Development Update — April 24"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: DHT Mirror — Full Transport Lists Per Edge

PR #2334 fixes a fundamental flaw in how the transport discovery mirrored data to the DHT:

**The problem:** TPD's DHT mirror wrote one `MutableItem` per transport per edge, keyed by SHA256(edgePK || "tp"). Because multiple transports sharing the same edge resolved to the same target, each Mirror call overwrote the previous one. A visor that was an edge of 552 transports ended up with exactly 1 transport visible under its DHT target. Verified against production: 4,615 transports in HTTP discovery produced only 1,370 DHT items.

**The fix:** The DHT target value is now the FULL transport list for that edge — identical to the HTTP discovery `GET /transports/edge:{pk}` response. On register/deregister, the TPD collects distinct touched edges, re-reads each edge's list from the store, and mirrors once per edge. Edges that drop to zero transports get their DHT target deleted.

**The extra per-edge `SMEMBERS+MGET` during register is proportional to touched edges, not entries** — a batch of N transports from one visor costs ~N+1 reads (self + peers). In exchange, the DHT is now consistent with HTTP discovery for all consumers.

The same fix was applied to **service discovery**: a visor registering both VPN and skysocks used to overwrite one with the other under the same DHT target. Now mirrors the full per-visor service list. New `Store.ServicesByPK` method backed by a `sd:visor-svc:<pkHex>` Redis index set.

**DMSG discovery**: `DelEntry` now also deletes the DHT mirror twin, fixing 96 stale DHT items in production that outlived their source entries.

**DiscoveryPusher update**: DHT-to-HTTP push disabled for "tp" and "svc" salts because the DHT value is no longer round-trippable through the HTTP APIs (the list format doesn't match the single-entry POST endpoints). The deployment services are the source of truth; the pusher was only useful when visors wrote DHT items directly.

### Skywire: TPD v3 Wire Format

New v3 endpoints that unify the HTTP registration shape with the DHT value shape:

**`POST /v3/transports/`** — accepts bare `[]*transport.Entry` instead of `[]*transport.SignedEntry`. The per-entry secp256k1 signatures were never persisted (only ID/edges/type/label/timing hit Redis) and the outer request is already authenticated via `SW-Sig`. Removing the per-entry sigs drops roughly 128*N wire bytes (two 64-byte sigs) per 90-second re-register cycle across the entire network.

**`GET /v3/transports/edge:{edge}`** — returns `[]*transport.Entry`, identical to the DHT value. Visors can now read from either source interchangeably.

**Rollout compatibility:**
- New visor + old TPD: client retries via v2 on 404
- Old visor + new TPD: v2 path unchanged
- New visor + new TPD: v3 path, reduced bytes and CPU

### Skywire: TPD Edge Pubkey Caching

**`0198468ce` Cache parsed edge pubkeys in redisStore** — every transport operation was parsing the hex-encoded edge public keys from Redis on every read. Since public keys are immutable once stored, they're now cached in-process after first parse. This eliminates redundant hex decoding on the hot path (transport registration, edge queries, uptime tracking).

### Skywire: Transport Setup — User-Labeled Transports

**`GetTransports` filter expanded** — transport setup previously filtered to `LabelSkycoin` + `LabelAutomatic`, hiding user-created transports. Now includes `LabelUser` so the setup node sees the same set of transports as any other consumer. `RemoveTransport` is unchanged — it still rejects manual transport deletion, so a compromised TPS cannot delete user-created entries.

### The Two-Week Arc: April 10-24

Looking back at the last two weeks, three major themes emerge:

**1. DHT: Decentralizing the Discovery Layer** (April 20-24)

The most architecturally significant change since the DMSG merge. A full Kademlia DHT implementation, integrated into DMSG servers as full nodes, with all three discovery services mirroring their data into the DHT. The transition path is clear: production services become bootstrapping points and network observers while the DHT handles peer-to-peer discovery. Today, the DHT serves reads with HTTP fallback. Tomorrow, it will handle writes with HTTP discoveries becoming optional caches.

**2. Skynet: From Concept to Working System** (April 10-23)

Skynet went from a name to a functional system: port forwarding with rich metadata, website hosting, direct transport bypass (no route setup needed), resolving proxies, access control tiers, skynet curl, and the HTTP bridge for persistent connections. A visor can now host a website accessible over both DMSG and skynet with a single CLI command.

**3. Reliability at Scale** (April 10-17)

The unglamorous but critical work: yamux stream leaks, porter reap loops, circuit breaker fixes, DMSG resilience (parallel phase racing, negative caches, session health pings), service entry TTLs, transport-level ping (eliminating 90% of RSN load), unified service mode, and dozens of E2E test improvements. Skywire can now survive real-world conditions: server restarts, slow connections, partial failures, and load spikes.

Six releases shipped (v1.3.41 through v1.3.46) across 141 commits. The project is transitioning from a centralized deployment model to one where the production infrastructure becomes a bootstrapping point, and the network runs itself.
