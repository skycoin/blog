+++
date = "2026-04-20"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — April 20, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: DHT Arrives — Kademlia Implementation

The biggest architectural change in Skywire since the DMSG merge: a full Kademlia DHT implementation that will replace the centralized HTTP discovery services. PR #2318 introduces the DHT in three phases.

#### Phase 1: Core DHT Implementation (`pkg/dht`)

A complete Kademlia DHT with BEP44 mutable data support, built from scratch:

- **`id.go`** — 256-bit NodeID derived from SHA256 of the secp256k1 public key. XOR distance metric for routing decisions.
- **`bucket.go`** — k-buckets (k=20) with a 256-bucket routing table. Standard Kademlia eviction: least-recently-seen evicted on full bucket, ping-first for live nodes.
- **`item.go`** — MutableItem with secp256k1 sign/verify (using Skywire's existing `cipher.SignPayload`/`VerifyPubKeySignedPayload`). Monotonic sequence numbers prevent replay.
- **`store.go`** — thread-safe item store with TTL expiry and capacity eviction. Items are keyed by SHA256(pubkey || salt), allowing multiple namespaces per identity.
- **`rpc.go`** — length-prefixed JSON wire protocol: Ping, FindNode, GetValue, PutValue.
- **`lookup.go`** — iterative Kademlia lookup with alpha=3 concurrency. Standard approach: query closest-known nodes, refine until convergence.
- **`dht.go`** — Node type with Put/Get, bootstrap, maintenance loop.
- **`mock_transport.go`** — in-process `net.Pipe` network for unit testing.

#### Phase 2: DMSG Transport and Visor Integration

- **`dmsg_transport.go`** — DHT transport over DMSG streams on port 100. Reuses existing DMSG sessions, so DHT adds zero new connections.
- **`init_dht.go`** — visor init module: starts DHT after DMSG is ready.
- **`api_dht.go`** — DHTStatus/DHTPut/DHTGet visor API methods.
- **`DHTConfig`** in visor config: enable, bootstrap_pks, full_node flag.

#### Phase 3: Discovery Adapter and Hybrid Client

- **`disc_adapter.go`** — implements the existing `disc.APIClient` interface backed by DHT. `Entry`/`PostEntry`/`PutEntry`/`DelEntry` map to DHT Get/Put with salt="dmsg". Server entries are auto-cached on fetch. `StartReannounce` keeps entries alive beyond TTL.
- **`disc_hybrid.go`** — DHT-first with HTTP fallback. Reads try DHT first, fall back to HTTP on miss. Writes dual-write to both DHT and HTTP. Bulk queries delegate to HTTP (until DHT population is sufficient).

### Skywire: DHT Full Node on DMSG Servers

PR #2319 takes the DHT from "implemented" to "deployed":

**DMSG servers are the natural DHT bootstrap nodes** — every visor already has DMSG sessions with them, so adding DHT on port 100 makes the DHT network functional with zero additional connections. The DMSG server's existing direct client is reused (same pattern as health/debug/route-setup).

**Redis persistence** — DMSG servers can persist DHT data to Redis (shared between servers on the same host) or BoltDB (per-process). In production, Redis is used so multiple DMSG servers share one dataset.

**Full node mode** — DMSG servers store all DHT items regardless of XOR distance. Regular visors only store items near their own ID. This ensures the deployment's DMSG servers have the complete dataset.

### Skywire: Discovery Mirroring to DHT

All three discovery services now mirror their data into the DHT:

- **Transport Discovery** — each `RegisterTransport` publishes under both edge PKs with salt "tp"
- **Service Discovery** — each `PostEntry` publishes under the visor's PK with salt "svc"
- **DMSG Discovery** — already had DHT mirroring with salt "dmsg"

Combined with DMSG servers running DHT full nodes, the DHT network has complete coverage of all network data — even from visors running old code that only publish via HTTP. The HTTP discoveries become the source, the DHT becomes the mirror, and eventually the roles will reverse.

### Skywire: Flaky Test Fixes

**`fix flaky TestConcurrentStreams`** — retry dials under concurrent load instead of expecting immediate success.

**Kademlia handles full node discovery** — removed DHT full node registration from service discovery. The Kademlia protocol discovers peers organically through iterative FindNode lookups; no separate registry needed.
