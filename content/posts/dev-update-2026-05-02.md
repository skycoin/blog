+++
date = "2026-05-02"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — May 2, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Forwarded Ports — Arbitrary Targets

**`546730da6` Forwarded ports/arbitrary target** (PR #2405) — raw-TCP forwarding for non-port-80 entries was hardcoded to `localhost:<localPort>`. Now honors `fp.ProxyAddr` at both the DMSG forwarder (`api_network.go`) and the skynet sky-forwarding side (`init_services.go`) so users can forward an arbitrary `host:port` (e.g. a LAN service at `192.168.1.20:5432`) over `.skynet` / `.dmsg` without running it on the visor.

CLI:
- `skywire cli serve add <p> --to host:port` now accepts non-localhost hosts on every port (was rejected outside port 80).
- `skywire cli skynet port add --proxy-addr` help text updated to reflect the broader meaning.

UI:
- New "Target Address" input on the skynet page's add-port form.
- Effective target shown in the table (`proxy_addr` when set, else `localhost:<local_port>`).
- Bundled UI rebuilt — also picks up the WHITELIST column from PR #2394.

### Skywire: skysocks/vpn-server Whitelist Setting

**`636174a16` visor+ui: skysocks/vpn-server whitelist setting + dmsg reverse proxy** — the hypervisor UI's app-settings dialog was still asking for a password to set on skysocks / vpn-server, but those servers no longer accept `--passcode` — auth is now whitelist-based (a comma-separated list of PKs). Updating the password arg silently set a flag the binary doesn't read.

Replaces the password fields with a whitelist textarea (66-char hex PKs, comma- or whitespace-separated; empty = open to all peers). Validation matches the existing forwarded-port whitelist editor.

Backend cleanup:
- `SetAppPassword` → `SetAppWhitelist`
- `SetAppPasswordIn` → `SetAppWhitelistIn`
- hypervisor put-app body: `"passcode"` → `"whitelist"`
- cli `visor app arg passcode` → `visor app arg whitelist`
- seed config drops the random `-passcode` arg from skysocks.

### Skywire: Latency Decoupled From Registration TTL

**`a619f20a0` transport-discovery: persist latency in a dedicated key, decoupled from registration TTL** — latency lived inside the `tp:<id>` registration blob and inherited its 5-minute entry-timeout. Bandwidth has always been stored separately at `bw:daily:<id>:<date>` with a 35-day TTL, so any visor that paused re-registering (TPD restart, network blip, normal churn) silently lost its latency from `/metrics` until the next CXO push, while bandwidth-today survived intact.

Move latency to a peer of bandwidth:
- New key: `transport-discovery:lat:<id>`, JSON `{min, max, avg, updated_at}` in microseconds, 35-day TTL.
- `UpdateLatency` writes only to that key. The "must be registered" coupling and the TTL-inheriting `Set` on `tp:<id>` are gone — those were exactly the reasons latency disappeared with registration churn. `avg<=0` still drops the update.
- `GetTransportMetrics` reads the new key in its existing pipeline.
- `getAllTransportsWithQoS`, `GetTransportsByEdge`, `GetTransportByID` join in latency from the new key alongside bandwidth.

### Skywire: Transient Failure Tolerance

**`8d41971e5` sd+visor: stop disabling registrations on transient failures` — the SD client had a `disableRegister` flag set on any non-2xx response from the discovery. That meant a single 502 from a load-balancer hiccup permanently disabled registration for the rest of the visor's lifetime. Now reserves the disable for actual `400`/`401`/`403` responses (semantic rejection by the discovery) and treats 5xx as transient — keep retrying.

**`fa5f7d023` transport: don't zero-clobber latency on partial measurements** — when one of the three latency fields (min / max / avg) was zero in the snapshot, `SetLatencyStats` was overwriting all three with zeros instead of preserving the non-zero values. Now treats `0` as "no measurement this cycle" and keeps the previous values.

**`a62b0da9c` Fix/tp metrics verified bandwidth zero edge** — verified-bandwidth display was clamping at 0 when one direction had no traffic but the other did, hiding the per-direction split.

### Skywire: AR Trust Visor-Declared PublicIP

**`3e1290109` ar: trust visor-declared PublicIP when AR's observed source is non-public** — when AR sees a connection from a private/loopback source (visor behind reverse proxy, or behind a private LB), it can't determine the visor's actual public IP from the connection itself. Previously AR fell back to the configured `--public-ip` of the AR host, which was meaningless. Now: if AR's observed source is non-public, AR trusts the `PublicIP` field the visor self-declares in its bind request. Public observed sources still win — visors can't lie their way to a different IP when the connection itself reveals the truth.

**`24b9f7e8f` cli/visor info: render AR registration without duplicate port for SUDPH` — `visor info` was rendering the SUDPH registration as `1.2.3.4:6789:6789` because the registration includes both the IP+port and a separate port field, and the formatter joined them with `:`. Now renders as `1.2.3.4:6789` for SUDPH while preserving the format for STCPR (which has only one port).

### Skywire: cxo/node Conn Cleanup

**`2529d51e1` cxo/node: evict dead DMSG conns from cache on Conn cleanup` — the CXO node maintains a per-PK cache of DMSG conns to avoid redialing for every Put/Get. When a conn died (peer drop, dmsg-server restart), the cache entry stayed in place pointing at a dead `*dmsg.Stream`. Next caller hit the dead conn, got an I/O error, and bypassed the cache for a fresh dial — but the dead entry stayed cached, so every caller in turn took the same penalty. Now the conn-close hook evicts the cached entry so the next caller starts fresh.

**`9fd6d7f8d` cxoaggregator: log OnRootReceived + OnFillingBreaks` — the TPD aggregator's two most operationally important events (a new root received from a visor; a fill broken mid-traversal) were silent in production. Adds DEBUG logs at both sites with PK + root hash, plus a summary metric counter.

### Skywire: Misc

- **`28fd80c0f` release(v1.3.50): changelog + goda graph + deps + mainnet_rules** — staging commit toward what will eventually become v1.3.50. Bundles a draft changelog for PRs #2351–#2405 since the v1.3.47 cut, regenerates the goda graph, refreshes vendored deps via `make update-dep`, and writes a 2026-05-16 cutoff into `rewards/mainnet_rules.md`. No tag is created today — the actual v1.3.50 tag is cut on May 8 once another week of work lands, with the cutoff revised to 2026-05-22. Between v1.3.47 (April 25) and v1.3.50 (May 8), the only published tags are v1.3.48 and v1.3.49 from April 29.
- **`d20f8a2db` docker: propagate build failures from deploy scripts; use proxy.golang.org** — deploy scripts were swallowing `go build` failures, producing images with stale binaries. Now `set -e` plus explicit error checks on each step. Also switches the module proxy to `proxy.golang.org` for resilience against direct-source flakiness.
- **`4c7983be0` Nix/packaging** — refresh of the nix flake to track current go-deps and ldflags.
- **`f3ec895a1` visor: register RuntimeLogs on the RPC server** — `RuntimeLogs` RPC was implemented but not wired into the RPC server registration. Made unreachable from clients until now.
