+++
date = "2026-06-17"
tags = ["Development", "Skywire"]
title = "Development Update — June 17"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The big structural change of the day was collapsing the visor's two same-key dmsg clients into one — and the bumpy path it took to land. The visor had been running a discovery client and a direct client under the same public key, and because dmsg servers evict by newest-session-wins, the two were quietly evicting each other on every shared server: a continuous self-eviction storm measured at tens of session-deaths per minute per server. The fix went in, got reverted when it surfaced a fatal re-entrant deadlock, and was re-applied with the deadlock fixed. Around that headline: a clutch of resolving-proxy alias features (including a clickable `home.dmsg` directory page), a redis-starvation fix in service discovery, a dmsg-server config simplification, and the noise-fork PQ design doc catching up to the code.

### Skywire: One dmsg Client per Visor

The visor ran **two** dmsg clients under one public key — `dmsgC` for discovery and `dmsgDC` for direct/dmsg-HTTP. Since dmsg servers key sessions by client-PK and evict the older session when a newer one appears, those two clients evicted each other on every server they shared — a self-eviction storm (server-confirmed ~56 session-deaths/min/server, all from visors), worst during redeploys.

**`3136`** fix(dmsg): converge the visor to a single dmsg client collapses them into one. The viable path turned out to be a client whose *reads* resolve direct-first (seeded service and dmsg-disc keys short-circuit, so they never take the HTTP-over-dmsg round-trip to the entry-less dmsg-disc that otherwise hot-loops) but whose *writes* still publish to HTTP discovery so the visor keeps registering. A subtle wrinkle had to be solved along the way: the serve loop posts an entry *before* any session exists, so that initial post is now always a no-op and durable registration is deferred to the post-session loop.

That first landing didn't survive validation. **`3138`** reverted it after it exposed a fatal re-entrant `sesMx` deadlock — the single-client convergence dialed inside the session mutex it already held. **`3139`** fix(dmsg): re-entrant sesMx deadlock in single-client convergence re-applies the convergence with the dial moved *outside* `sesMx`, breaking the re-entrancy. This is the foundation the next day's cold-start recovery work would build on, and the kind of change that's only safe to make because the local visor is rolled onto it and watched boot clean before merge.

### Skywire: Resolving-Proxy Aliases

A run of changes made the dmsg resolving proxy reachable by friendly name instead of raw 66-character public keys.

**`3127`** feat(resolver): canonical service aliases for the dmsg resolving proxy derives short, well-known names — `dmsgd`, `tpd`, `ar`, `rf`, `sd`, `ut` — by pulling each service's PK out of its `dmsg://` URL, so a service's HTTP API is reachable as e.g. `http://tpd.dmsg/health`. The aliases mirror the existing CLI service namespace, are auto-derived with no new config surface, and extend to the route/transport setup nodes (`rsn`/`tsn`) and — via the direct client, since they register no discovery entry — the dmsg servers themselves (`dmsg0`, `dmsg1`, ...). Crucially the server aliases are sourced from the *live* discovery cache, not the bootstrap-only config list, so they track exactly what discovery currently advertises rather than naming decommissioned servers.

**`3132`** and **`3133`** add and then rename the reward-system alias: the reward system's HTTP API becomes reachable as `rewards.dmsg`, matching the user-facing `skywire cli rewards` namespace and the dominant `/rewards` HTTP path. The whole alias feature is documented in `docs/guides/resolving-proxy.md`.

**`3134`** feat(resolver): home.dmsg directory page of all resolver aliases adds a reserved `home` label that the proxy serves in-process: a self-contained HTML page listing every alias the resolver knows — this visor, the deployment services, setup nodes, dmsg servers — each linked so a browser can click through over the mesh. The page is synthetic and proxy-only, generated in the Dial path and written straight back over the SOCKS5 connection; the visor never serves it on a real port and full keys are shown, never truncated.

### Skywire: dmsg-server Config + Discovery

**`3128`** feat(dmsg-server): borrow embedded servers when `servers` is empty lets a dmsg-server with an explicit discovery but no hand-maintained `servers` list fill its transit-server set from the binary's embedded deployment data, matched by `discovery_dmsg` public key. The `servers: [...]` block has been a recurring source of stale-address wedges on cold restart, and operators can now drop it while keeping their discovery and per-deployment knobs. Servers stay coupled to their discovery — an unrecognized discovery PK is left empty rather than grafted with a mismatched deployment's servers.

**`3129`** feat(dmsg-disc): log dmsg-server entry registrations with PK + sequence + source adds a structured log line for server registrations only (a handful of servers, not the ~160/sec client heartbeats), capturing the registering key, sequence, advertised address, and source. It makes a duplicate-key collision obvious from the logs alone — two different sources for one server key, or a sequence climbing far faster than the ~1/min heartbeat, points straight at the offending host.

### Skywire: Redis Starvation in Service Discovery

**`3135`** fix(service-discovery): chunk the by-type MGET to stop starving redis splits a single huge `MGET` over a service type's members — hundreds of `service:skysocks:<pk>` keys in production — into bounded 256-key batches. Redis is single-threaded, so the one giant command blocked the server for the whole batch (~40ms observed), starving every other client's command, including dmsg-discovery's tiny `GET` on the same redis. Chunking lets redis interleave other clients between batches, with no key dropped, duplicated, or reordered.

### Skywire: PQ Design Doc + Cleanups

- **`3119`** docs(design): post-quantum hybrid noise handshake sketch lands the design that the previous day's phase-1/phase-2 implementation realizes — hybrid X25519 + ML-KEM-768, payloads piggybacked in the KK handshake, mixed via HKDF after Split.
- **`3131`** fix(lint): clear golangci-lint failures on develop unblocks a release by fixing nine reported issues across the web subcommand, the noise DH test call sites left over from the flynn/noise migration, and the PQ hybrid combiner.
- **`3137`** fix(web): platform-split process-group helpers so Windows builds extracts the Unix-only `Setpgid`/`syscall.Kill` calls behind build-tagged helpers so the Windows release build (and its `.msi`) stops failing.
- **`3130`** chore(deps): bump UI dependencies rolls up a batch of replicated dependabot updates across the manager UI and tpviz.
