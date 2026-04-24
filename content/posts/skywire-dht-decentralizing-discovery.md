+++
date = "2026-04-24"
tags = ["Development", "Skywire", "DHT"]
title = "Skywire DHT: Decentralizing the Discovery Layer"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Skywire has always depended on centralized HTTP discovery services. When a visor wants to find another visor's DMSG servers, it queries `dmsg-discovery`. When it wants to know what transports are available, it queries `transport-discovery`. When it wants to find a VPN or proxy, `service-discovery`. These services are reliable and fast, but they're single points of failure and they concentrate load on the deployment operator.

Over the past week, we've been building and deploying a Kademlia DHT that will gradually replace these centralized services with peer-to-peer discovery. The production deployment is transitioning from the source of truth to a bootstrapping point and network observer.

### Why DHT, Why Now

Three pressures converged:

**Load.** The transport discovery processes over 50,000 re-registration requests per 90-second cycle from the active visor fleet. Each request requires Redis reads, writes, and signature verification. The service discovery and DMSG discovery face similar load. As the network grows, this scales linearly with visor count — and all of it hits a handful of servers.

**Resilience.** If the transport discovery goes down, visors can still communicate over existing transports, but new transports can't be established and old ones can't be refreshed. A 5-minute outage means transport entries start expiring. This is an operational reality that can be managed with redundancy, but it's architecturally unnecessary — the data is public and immutable once signed.

**Decentralization.** Skywire's value proposition is a decentralized network. Having centralized discovery services is a pragmatic compromise that made sense during development, but the network is mature enough now to distribute this responsibility.

### The Architecture

The DHT implementation lives in `pkg/dht` and uses the Kademlia protocol with BEP44-style mutable data:

**Node identity** is derived from the existing secp256k1 public keys: `NodeID = SHA256(pubkey)`. This means every Skywire entity (visor, DMSG server, service) has a DHT identity for free — no new key generation needed.

**Data is organized by salt-based namespaces.** A visor's DMSG entry is stored at `SHA256(pubkey || "dmsg")`, its transport entries at `SHA256(pubkey || "tp")`, its service entries at `SHA256(pubkey || "svc")`. The salt system maps cleanly onto the existing discovery service separation.

**Mutable items** use secp256k1 signatures (via Skywire's existing `cipher.SignPayload`) with monotonic sequence numbers to prevent replay. When a visor updates its entry, it increments the sequence number. DHT nodes reject updates with lower or equal sequence numbers.

**Transport layer** runs over DMSG streams on port 100. This is the key architectural decision: DHT traffic reuses existing DMSG sessions, so enabling DHT adds zero new network connections. A visor that's connected to 3 DMSG servers can do DHT lookups and puts through those same sessions.

### Three Node Types

**DMSG servers (full nodes)** store the complete DHT dataset regardless of XOR distance. Every visor already has DMSG sessions with these servers, making them natural bootstrap and authority nodes. They persist to Redis (shared between servers on the same host) so multiple DMSG servers present one unified dataset.

**Visors (regular nodes)** store items near their own NodeID per standard Kademlia rules. They participate in routing and lookups but don't carry the full dataset. This is the normal mode for the thousands of visors in the network.

**Deployment services (mirror nodes)** don't run Kademlia at all. They write directly to Redis using `RedisMirror`, and the DMSG servers (which share that Redis) serve the data through Kademlia. This avoids redundant Kademlia nodes on the deployment servers.

### The Transition Strategy

The transition is designed so old and new visors coexist seamlessly:

**Phase 1 (current): Mirror HTTP to DHT.** All three discovery services mirror their writes to the DHT via Redis. When a visor registers a transport via HTTP, the TPD writes it to Redis, and the DMSG servers' Kademlia nodes serve it to DHT clients. The HTTP APIs remain the source of truth.

**Phase 2 (in progress): DHT-first reads.** Visors check their local DHT store before making HTTP requests. If the DHT has the data, the HTTP round-trip is skipped entirely. Lookup counters track cache hits, DHT hits, HTTP hits, and HTTP misses so we can monitor the transition.

**Phase 3 (next): DHT-first writes.** Visors publish to the DHT instead of HTTP. DMSG servers push DHT writes back to the HTTP discoveries via the `DiscoveryPusher` callback. The HTTP APIs become read caches populated from the DHT.

**Phase 4 (future): HTTP optional.** Once DHT population is high enough and old visors have updated, the HTTP discovery services can be scaled down to read-only observers. They'll still exist for monitoring and as a fallback, but they won't be on the critical path.

### Production Results

The initial deployment revealed several issues that were fixed in rapid succession:

**84% CPU on dmsg-discovery** — the initial mirroring approach used full Kademlia `Put` operations (iterative lookups + network round-trips) for every entry update. Replaced with `RedisMirror` that writes directly to the shared Redis. CPU normalized immediately.

**DHT mirror overwrites** — a visor with 552 transports had only 1 visible in DHT. The mirror was writing per-transport items under the same key (`SHA256(edgePK || "tp")`), with each write overwriting the previous. Fixed by mirroring the full transport list per edge, matching the HTTP API response format.

**Signing overhead** — TPD DHT mirror was signing each item per edge PK. For 2-edge transports this doubled the secp256k1 operations. `MirrorMany` now signs once and saves under multiple targets, halving the DHT mirror CPU cost.

**Bootstrap failures** — deployment service PKs were included in the bootstrap list, but they don't run DHT nodes. Only DMSG server PKs with `enable_dht=true` are now used for bootstrap.

**Sequence number resets** — the seq counter reset to 1 on every restart, but DHT peers kept old entries with higher seq numbers, rejecting all new puts. Now queries the local store for the existing seq before publishing.

### What This Means

The practical impact today: visors with DHT enabled skip 80% of HTTP discovery traffic. Transport re-registration over HTTP is disabled once a DHT peer is found. DMSG client lookups resolve from the local store in microseconds instead of milliseconds over HTTP.

The strategic impact: Skywire's production deployment is becoming what it should be — a bootstrapping point and network observer. The DHT distributes the discovery function across every participating node. A visor that connects to a DMSG server, bootstraps its DHT routing table, and syncs the full dataset can operate indefinitely without any centralized service. The network becomes self-sustaining.

This is what decentralization actually looks like in practice: not removing the infrastructure, but making it optional.
