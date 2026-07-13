+++
date = "2026-04-25"
tags = ["Development", "Skywire"]
title = "Development Update — April 25"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Production Performance Push

A run of profile-driven optimizations targeting the deployment services. Every change came from a specific pprof or production-redis observation.

**`5e9044141` Setup-node porter watchdog** — standalone `Node.Serve` was missing the `SweepStalePorterEntries` loop the embedded RSN already runs. Production saw ~13 ports/min leaking, full ephemeral exhaustion (16,387 ports reserved) after ~20h of uptime, and ~1 GB of stranded `yamux.Stream` objects parented by the porter map. Adds the same 60s sweep that drops entries older than 5 minutes.

**`e3074d7f3` SD: replace SCAN-for-existence with index lookup** — `isServiceOnline` was using `SCAN cursor=0 pattern="service:*:<pk>" COUNT=10` to test whether any service entry existed for a visor. That's O(N) over the whole 150K-key keyspace when the entry is absent (offline visor). `refreshUptimesCache` runs every 5 minutes and called this once per visor seen today, twice (v1+v2 cache) — production redis spent ~33% of CPU on SCAN, ~3,316 calls/sec sustained. Switches to the per-visor service-type index set already maintained by `UpdateService` / `DeleteService`: one `SMEMBERS` plus a multi-key `EXISTS`. Constant Redis round-trips regardless of keyspace size.

**`2baa4da8a` TPD: per-edge entry cache** — `mirrorEdges` fires `GetTransportsByEdge` once per touched edge after every register/deregister. Hub edges (those that participate in many transports) were re-fetched on every mutation even when the list hadn't changed. pprof showed `mirrorEdges → GetTransportsByEdge` dominating TPD CPU at ~35% cumulative even after the recent DHT mirror PRs. Adds a 4096-slot, 5-second-TTL cache keyed by edge pubkey, with explicit invalidation on register/deregister/batch.

**`3a433560d` TPD: replace `tp:*` SCAN with SMEMBERS** — `getAllTransports` used `SCAN MATCH tp:*` to list registered transports. Now maintains a `tp:ids` set updated transactionally on every `RegisterTransport` / `DeregisterTransport`, and uses `SMEMBERS tp:ids` + pipelined `MGET`. Constant-time membership operations replace cursor iteration over a growing keyspace.

**`99f8c377d` AR: replace GetAll SCAN with SMEMBERS on per-netType index** — same shape, applied to address-resolver. Bind/del-bind paths maintain `addr-ids:stcpr` / `addr-ids:sudph` index sets; `GetAll` reads them directly.

**`6b8a3cb8a` / `de8116036` / `f29473ca4` Short-TTL caches for hot list endpoints** — `GetAllTransports` (TPD), `GetAllTransportsWithQoS` (TPD), and `GetAll` (AR) each gain a small in-process TTL cache keyed by query shape. Soaks up the synchronized bursts that visor `sync=true` re-registration cycles produce on the `/transports` endpoints.

**`0a2a592f5` Cipher: disable `DebugLevel1`** — `secp256k1.SignDeterministic` runs an internal verify-after-sign pass when `DebugLevel1` is set. The flag was on by default, doubling the CPU cost of every signature on TPD/SD/AR, the visor's DHT publisher, and the dmsg client's entry update path. Off in release builds; tests still set it explicitly.

**`49b211304` dmsghttp: per-destination stream pool** — every HTTP request through dmsg opened a brand-new stream and paid a full noise handshake. With ~50 visor heartbeats/sec network-wide this drove dmsg-server CPU into the ground (production pprof: `handshakeResponder` + secp256k1 sign/verify at ~50% cumulative wall). `HTTPTransport` now keeps a small per-destination pool of `dmsg.Stream` objects keyed by `dmsg.Addr`. RoundTrip tries one pooled stream, falls through to a fresh dial on I/O error, and returns the stream to the pool after body close (or discards on error). One retry only — pooled streams might already be torn down by the remote.

### Skywire: DHT Value Size Bug

**`79c398daa` Raise MaxValueSize 16K → 64K, log size-induced publish drops** — production observation 2026-04-25: hub edges with hundreds of transports silently failed to publish to the DHT because the marshalled list of compact entries (~80 bytes each) crossed the 16 KB ceiling at ~200 entries. The DHT state for those subjects froze at whatever fit on the last successful publish. Concrete examples (cli dht get vs TPD `GetTransportsByEdge`): edge `027087fe40…` had 883 transports in TPD vs 107 in DHT (12%); `03d1d78e7323…` 916 vs 149 (16%); `02859d5aacdf…` 149 vs 16 (11%). Two changes: raise the per-MutableItem ceiling to 64K, and surface size-induced drops as a `WARN` instead of swallowing them.

### Skywire: Visor Survey IP Requirement

**`81c8d6a14` Require IP in survey, retry dmsg LookupIP indefinitely** — survey was written even when `dmsgC.LookupIP()` failed all 8 retries (no delay between attempts), producing surveys with an empty `ip_address` field. The reward calc drops them but reports the empty IP as the reason, so operators saw blank rejection reasons in production logs. Now retries indefinitely with a 30s per-attempt timeout and 15s spacing between attempts; the survey is never generated without a public IP.

### Skywire: Hypervisor TUI + Hypervisor-of-Hypervisors (PR #2337)

The big rollup PR that lands in v1.3.47:

- **Hypervisor terminal UI** (`cli visor hv tui`) — interactive tview-based table listing all visors connected to this hypervisor, with detail view per visor. Pulls data via the new `HVListVisors` / `HVVisorSummary` RPCs that proxy through the hypervisor's existing DMSG connections.
- **Transitive HV management** — `cli visor hv ls` lists remote visors connected to this hypervisor; `--detail` queries each via transport RPC for version, uptime, and transports.
- **`tp-rpc` accepts arguments** — third positional arg is JSON args, enabling calling any RPC method with parameters.
- **Top-level CLI shortcuts in feat/next** — preview of the verb shortcuts that land on April 28 (`cli pk`, `cli status`, etc).
- **Route-finder LabelSetup filter** — setup-node transports (`LabelSetup`) excluded from regular route discovery so user routes don't accidentally traverse them.
- **DMSG-only-as-last-hop** — DMSG hops are now permitted only as the terminal hop in a route, not as intermediate hops (DMSG over DMSG was a routing dead end).
- **No-mux on DMSG routes** — mux is a transport-level multiplexing for direct legs; DMSG sessions are already multiplexed at the protocol layer.
- **Configurable transport-type preference** — visors can declare ordering for STCPR/SUDPH/DMSG when calculating routes.
- **`RouteGroupInfo` hop list** — reports the ordered hop sequence so `route groups` output shows the actual path each group took, not just endpoints.

### Skywire: v1.3.47 Released

**`1f927d5db` release(v1.3.47)** — bundles PRs #2322–#2349 (the DHT consistency work, perf optimizations, transport-RPC, hypervisor TUI, and the feat/next rollup). Mainnet cutoff bumped from v1.3.43 (was 2026-04-23) to v1.3.47 effective 2026-05-09 — the standard 14-day announcement window.
