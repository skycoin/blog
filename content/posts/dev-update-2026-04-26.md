+++
date = "2026-04-26"
tags = ["Development", "Skywire"]
title = "Development Update — April 26"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: DHT Sequence Monotonicity Fix

**`d6732e3ea` Fix DHT seq + self-probe endpoint** — two unrelated bugs surfacing in the same PR.

The visor's `dhtPublishLoop` seeded `seq` from the local in-memory store (which starts at 1 after restart), and the `tpd_adapter` computed `seq` from entry count + cumulative transport bandwidth (which resets on restart and drops on transport churn). Both produced non-monotonic seq values across visor restarts. DHT peers correctly rejected those `Put` operations with `ErrSeqNotMonotonic`, manifesting as repeated `'PutValue failed: dht: remote rejected put: dht: sequence number must increase'` debug logs after every visor restart.

Fix: replace both with `time.Now().UnixNano()` — survives restarts and aligns with the convention TPD `mirrorEdges`, SD mirror, and `BackfillDHTMirror` already use. On startup, `dhtPublishLoop` queries the network for any higher seq under the local PK and climbs above it, handling backwards clock skew + stale peer cache.

The self-probe was hitting the `/ping` endpoint on the dmsghttp log server, which had been removed in PR #2317 (it was unused). The probe got 404s and reported persistent `'dmsg listener unreachable'` false-positives. Switched to `/health`.

### Skywire: Embedded GeoIP Database

**`18808538a` Visor uses embedded MMDB instead of querying ip.skycoin.com** — the MaxMind GeoLite2-City database has been embedded in the skywire binary since the geoip subcommand was introduced in PR #2313. Visors were still making HTTP round-trips to the configured `ip.skycoin.com` endpoint on startup to populate their service-discovery geolocation tags — unnecessary now that the data is local.

- Moves the database from `cmd/svc/geoip/commands/` to a new `pkg/geoip/` package shared by both the standalone geoip service and the visor.
- Replaces `GetIP` / `GetIPWithGeo` HTTP fetchers with `LookupGeo(ip)` against the embedded DB.
- Public IP comes from dmsg `LookupIP` first, STUN as fallback.
- Backwards-compat shims (`EmbeddedGeoIP`, `LookupIP`) stay in `cmd/svc/geoip/commands/` for the existing `cli rewards` consumers.

The visor config keeps the `GeoIP` field for config refresh, proxy-test defaults, and the `cli vpn start --geoip` flag.

### Skywire: Codebase Refactors

A batch of mechanical refactors that don't change behavior but make the import graph cleaner.

**`84434cee9` Flatten `pkg/skywire-utilities/pkg/*` into `pkg/*`** — the doubled directory level added 23 chars to every import path with no value. cipher alone has 114 importers; logging 97; buildinfo 61. Drops the doubled level so paths become `github.com/skycoin/skywire/pkg/cipher` instead of `github.com/skycoin/skywire/pkg/skywire-utilities/pkg/cipher`. Moves 15 sub-packages and rewrites 545 importing files. Compat shims kept at the old paths for three packages still imported by the vendored skycoin source (`buildinfo`, `calvin`, `flags`); a matching skycoin PR inlines those into skycoin's own `src/util/` so the shims can be deleted in a follow-up once the vendored copy is refreshed.

**`262fe0af9` Split `hypervisor.go` HTTP handlers by topic** — `pkg/visor/hypervisor.go` had grown to 1700+ lines with every HTTP handler in one file. Split by topic into `api_visor.go`, `api_apps.go`, `api_routing.go`, etc., mirroring the existing `pkg/visor/api_*.go` layout for the RPC side. Pure file split, no logic changes.

**`dcc7fe34e` Split `rpc.go` by topic** — same pattern applied to the visor's RPC server. `rpc.go` had collected RPC methods for a dozen unrelated subsystems; now split into `rpc_routing.go`, `rpc_dmsg.go`, `rpc_apps.go`, etc.

**`b91223dcc` Split `redis_store.go` by topic** — TPD's redis store had grown to ~1500 lines covering transport CRUD, latency, bandwidth, uptime, mirror, and cache. Split into `redis_store.go` (CRUD), `redis_metrics.go`, `redis_mirror.go`, etc. Helps reviewers reason about which methods touch which keyspaces.

**`79b1f5a1a` Flatten `pkg/routefinder/rfclient` to `pkg/rfclient`** — same kind of double-layer cleanup as the skywire-utilities flatten. `rfclient` is a leaf package; the `routefinder/` parent had no other contents.

No behavior change in any of the refactor PRs — pure rename + import rewrite. The reviews focused on confirming nothing slipped past the mechanical rewrite (compat shims, generated code, vendored copies).
