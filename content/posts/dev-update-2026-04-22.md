+++
date = "2026-04-22"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — April 22, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: DHT-to-Discovery Pusher

PR #2327/2328 closes the loop on DHT architecture: DMSG servers now push DHT writes back to the HTTP discovery services, enabling a smooth transition where visors can publish to the DHT only while the HTTP APIs stay in sync.

**`Store.SetOnPut` callback** — fires after every successful DHT store operation (outside the lock). The DMSG server registers a callback that inspects the salt and forwards the entry to the appropriate HTTP discovery.

**`DiscoveryPusher`** — maps salt to discovery endpoint:
- `dmsg` -> DMSG discovery
- `tp` -> Transport discovery
- `svc` -> Service discovery

**The transition path is now clear:**
1. Today: visors write to HTTP discoveries, services mirror to DHT
2. Next: visors write to DHT, DMSG servers push to HTTP discoveries
3. Eventually: HTTP discoveries become optional read caches

### Skywire: DHT-First Lookups

**All discovery queries now check DHT first:**

- **Service discovery (VPN, proxy, public visors)** — check local DHT store for "svc" entries before falling back to HTTP. Autoconnect also uses DHT-first for public visor listing.
- **DMSG discovery** — `HybridDiscClient` reads from DHT, falls back to HTTP on miss.
- **Transport discovery** — `tp all` serves from local DHT store when available.

**Lookup counters** — `dmsg.Client` now tracks: cache hits, DHT hits, HTTP hits, HTTP misses. Exposed via `dht status` CLI command. This lets operators see how much traffic is being served from DHT vs HTTP.

**Populate DMSG server cache from DHT** — `AvailableServers()` now reads from the local DHT store, eliminating HTTP round-trips for server discovery.

### Skywire: DHT Entry Lookup on DMSG Server

**`GET /dht/entry/<pk>?salt=dmsg`** — resolves a PK from the DMSG server's local DHT store. Any connected DMSG client (including ephemeral ones like dmsgcurl) can query it without needing a DHT node. This eliminates the HTTP discovery round-trip for the most common operation: looking up a DMSG client entry.

**`GET /dht/entries?salt=dmsg`** — returns count of entries by salt for monitoring.

### Skywire: DHT Backfill on Startup

**`ed197b47b` Add DHT backfill to TPD and SD on startup** — when the transport discovery or service discovery starts, it iterates all existing entries and mirrors them to the DHT. This ensures the DHT has the complete dataset immediately after a service restart, not just entries updated since the last restart.

**`4333c354a` Fix TPD DHT Redis mirror: read REDIS_PASSWORD from env** — Redis password was hardcoded to empty string, breaking authentication on production Redis instances.

**`940abc681` Fix Redis DHT Load: pipeline batches + 5min timeout** — bulk loading from Redis was sending individual GET commands. Switched to pipeline batches of 100 with a 5-minute overall timeout for large datasets.

**`2c8004b1c` Increase DHT RPC max message size to 4MB** — the default 1MB was too small for full sync operations on production-scale data.

**`fda9f4df8` Fix DHT sync: include storage targets in GetItems response** — GetItems was returning items but not their storage targets, making it impossible for the caller to re-store them correctly.

### Skywire: DMSG Forward Startup Fix

**`c841c1b67` Fix/dmsg fwd startup** — persisted forwarded ports (from `local/forwarded_ports.json`) weren't being restored on visor startup. DMSG listeners for ports with `dmsg=true` are now created during init. Also fixes:

- Skynetweb: replaced the in-process HTTP reverse proxy (which couldn't handle WebSocket upgrades) with direct SOCKS5 dial using a per-destination mutex to serialize concurrent DialRoutes to the same PK.
- `--whitelist` flag added to `skynet port add` for PK access control.
- Use skynet port as `lPort` to avoid route descriptor conflicts.
- Fix DHT bootstrap spam: only DMSG servers (which have `enable_dht=true`) are used as bootstrap peers, not all deployment services.

### Skywire: Hardcoded Service URLs Removed

**`163196280` Remove hardcoded service URLs, use deployment.Prod constants** — three files had hardcoded fallback URLs (`conf.skywire.skycoin.com`, `tpd.skywire.skycoin.com`). These are now pulled from `deployment.Prod` constants, making it possible to run against alternative deployments by changing a single config.

Also: DMSG listeners are now created for forwarded ports with `dmsg=true`, enabling `.dmsg:<port>` access.

### Skywire: Skynetweb Fixes

PR #2323 addresses several issues with the skynet web proxy:

**Connection pooling** — each SOCKS5 CONNECT was creating a new skynet tunnel, but the routing layer can only maintain one route per (PK, port). Switched to `httputil.ReverseProxy` backed by an `http.Transport` that pools connections per destination.

**Autoconfig reward display** — always show the reward address in output (was hidden behind `--verbose`, unlike the old autoconfig script).

**Hypervisor UI xpub fix** — increase maxlength from 40 to 112 for reward address input fields so xpub keys (111 chars) can be entered.

### Skywire: CLI Validation and Bug Fixes

PR #2322:

**RouteGroup close panic fix** — replaced `sync.WaitGroup` with atomic counter + channel for `closeDone`. The WaitGroup panicked with "reused before previous Wait returned" when `forceCompleteCloseDone` returned before the Wait goroutine exited.

**ServiceHealth: use direct DMSG client** — deployment services run as direct DMSG clients and don't register in discovery. Now seeds synthetic entries into the DMSG client's entry cache so health probes can reach them.

**DHT full-node status fix** — `DHTStatus` was reading from static config instead of runtime state. `SetFullNode` changes the store but status was reporting the config value.

**FindFullNodes ordering** — prioritize peers from the Kademlia routing table (confirmed reachable) over raw bootstrap PKs (which include non-DHT services that fail on dial).

**Skynet resolving proxy fixes** — removed localhost bypass for self-dial (was causing route descriptor conflicts), fixed HTTP bridge port collision, then replaced the HTTP bridge entirely with direct SOCKS5 skynet dial.
