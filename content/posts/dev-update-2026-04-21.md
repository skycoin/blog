+++
date = "2026-04-21"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — April 21, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: DHT Full Node Discovery and Bulk Sync

PR #2321 adds the infrastructure for DHT nodes to find each other and synchronize their data stores:

**GetItems RPC (method 5)** — new DHT RPC for bulk data sync. Supports salt filtering (dmsg, tp, svc) and sequence threshold for incremental sync. Paginated with limit + hasMore indicator. 30-second timeout for bulk transfers.

**Full node advertisement** — full nodes publish their PK under salt "fullnode" every 5 minutes. `FindFullNodes()` returns bootstrap peers as known full nodes. This lets any visor discover which peers have the complete dataset.

**`skywire cli visor dht sync`** — sync from the default bootstrap peer or a specific full node. `--salt` flag filters by namespace. This is the manual trigger for bulk sync; automated sync happens periodically.

**`skywire cli tp all`** — list all transports from transport discovery, or from the local DHT store if available. Auto-detects whether the visor has DHT data and serves locally when possible, falling back to HTTP.

**DMSG server self-publication** — servers publish their entry (PK, address, max_sessions, dht_bootstrap) under salt "dmsg-server" every 5 minutes. Visors can discover DMSG servers from DHT without DMSG discovery HTTP. This is the key enabler for bootstrapping without centralized discovery.

**Skip TPD HTTP re-registration when DHT is active** — once a visor has at least 1 DHT peer, `SetDHTHandlesRegistration(true)` disables the 90-second HTTP re-registration loop with the transport discovery. Transport data is still published to DHT every 60 seconds. This reduces TPD HTTP load by approximately 80%.

**DHT status in visor info** — `skywire cli visor info` now shows DHT mode (full node / regular), peer count, and stored items.

### Skywire: Visor RPC Over Transports

PR #2320 adds a completely new way to manage visors: RPC over Skywire transports.

**VisorRPCPacket (type 14) on route ID 0** — a new transport-level frame type that carries RPC traffic directly over STCPR/SUDPH transports. No DMSG required. No routes required. Just the raw transport.

**Whitelist-gated access** — the remote PK is checked against the hypervisor PKs and dmsgpty whitelist. Only authorized operators can RPC into a visor over transports.

**`skywire cli visor tp-rpc <remote-pk> <method>`** — call a remote visor's RPC method over the transport layer:

```
skywire cli visor tp-rpc <pk> Overview
skywire cli visor tp-rpc <pk> Health
skywire cli visor tp-rpc <pk> Summary
```

The local visor acts as proxy: opens a VStream to the remote visor, forwards the RPC call, returns the result. This gives operators an alternative management path when DMSG is unavailable.

### Skywire: DHT Bootstrap Improvements

**Periodic bootstrap with retry** — bootstrap now retries every 30 seconds until at least one peer is found, then every 5 minutes for maintenance. Previously it ran once at startup and gave up permanently on failure.

**Fix DHT transport for DMSG servers** — DMSG servers have server-type discovery entries, not client entries, so DialStream rejected them. Now falls back to the existing yamux session (which the visor already has) when DialStream fails.

**DHT bootstrap indicator** — DMSG server entries in the discovery now include a `DHTBootstrap` field indicating whether they run DHT. Visors use this to select bootstrap peers.

**Disable DHT in deployment services** — all 6 deployment services now set `DisableDHT: true`. DMSG servers are the DHT nodes; services don't need their own Kademlia instances. Reduces redundant nodes on the same machine.

### Skywire: DHT Mirroring Architecture

**RedisMirror** (`pkg/dht/mirror_redis.go`) — writes DHT entries directly to Redis without a local DHT node. Used by deployment services with `DisableDHT=true`. DMSG servers read the same Redis and serve via Kademlia.

**MutableItemTarget helper** — extracted for standalone use: computes SHA256(pk || salt) for DHT key derivation without needing a full MutableItem.

**Documentation** — `docs/DHT_ARCHITECTURE.md` added covering node types (DMSG servers as full nodes, visors as regular, services as mirrors), persistence backends, deployment topologies, and data flow.

### Skywire: Performance Optimizations

**`3709c1148` Fix dmsg-discovery 84% CPU** — the DHT EntryMirror was doing a full Kademlia Put for every entry update, which involves iterative lookups and multiple network round-trips. Replaced with RedisMirror that writes directly to Redis. CPU dropped from 84% to normal.

**`ba6b9b7af` Optimize noise keypair pool: 8x burst, skip debug validation** — the noise handshake pre-generates keypairs in a pool. Pool refill burst increased from 1 to 8. Debug-mode signature validation on pool fetch removed (it was verifying the keypair was valid every time it was used, which is redundant since it was valid when generated).

**`903b9798e` Optimize TPD: batch Redis pipeline for transport registration** — transport registrations now use Redis pipelines instead of individual commands. A single registration with 2 edges went from 6 sequential Redis round-trips to 1 pipelined batch.

**`502255b28` Optimize SD: combine UpdateService + RecordHeartbeat** — two separate Redis pipelines merged into one, halving the per-registration Redis round-trips.
