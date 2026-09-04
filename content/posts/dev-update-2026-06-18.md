+++
date = "2026-06-18"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — June 18, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The most important day in a while, and it started with the network down. The dmsg-only convergence work of the prior days, combined with a fleet-wide redeploy, walked straight into a **cold-start bootstrap trap**: every dmsg-server was waiting on a registration that could only succeed once *another* server was already accepting — a circular dependency where nobody could be first, so the whole fleet stayed down even though every binary was healthy. Untangling it took a chain of fixes that each peeled back one layer of the trap, and once the network was back up, a multi-agent code audit of the v1.3.72–76 dmsg changes turned up a long tail of leaks, races, and "looks-healthy-but-can't-relay" failure modes — all fixed the same day, culminating in the v1.3.76 release. This post traces the arc: the outage, the root cause, the audit, and a hard-fail defense against silent post-quantum downgrades.

### Skywire: Breaking the Cold-Start Trap

The outage had several nested causes, each of which had to be removed in turn before the fleet could lift itself back up.

**`3140`** fix(dmsg-server): bind inbound listener without waiting on transit client Ready is the first layer. A dmsg-server gated its inbound accept loop behind its *own* outbound transit client reaching `Ready()` — but in a fleet-wide cold-start every server's transit client is dialing every other server, all down, so `Ready()` never fires and the listener never binds. No server can be the first to listen. The fix serves the transit client in the background so the accept loop comes up immediately: a server's inbound reachability must not depend on its outbound client being connected.

**`3142`** fix(dmsg-disc): cold-start bootstrap — dial configured servers immediately makes dmsg-discovery the thing that breaks the circle. disc is the registrar, and it can dial servers directly from config with no discovery lookup and no circular dependency — so once disc is connected to even *one* server, every server can reach disc and self-register with its own key. Two bugs had prevented this: disc resolved its dial set from the redis store (empty at cold-start, so it dialed nothing) and ran on a 10-minute ticker with no immediate first pass. It now dials the preloaded server set immediately with tight exponential retry.

**`3143`** fix(dmsg-server): run Accept loop immediately — don't gate it on entry registration is the final layer of the trap, and explains why the network *still* failed after #3142. disc did dial out to every server, but the servers' accept loops were parked *behind* a blocking registration call — which itself needs an upstream session, which needs a server that's accepting. Nobody is first; the listener binds, 4097 SYNs queue in the kernel, but userspace `Accept` never runs and no session completes. Backgrounding the registration so `Accept` runs immediately closes the circle: `Ready()` now means "accepting," not "registered."

**`3141`** fix(dmsg): relax session-liveness ping deadline 5s->18s stops a false-positive reconnect storm that fed the fire. The liveness ping's 5s deadline is too low under load or Docker's bridged-network latency — a *live* session's echo exceeds 5s, the client declares it dead, kills and re-dials, and manufactures more reconnects that flood the server accept queues. 18s sits above worst-case loaded round-trips while still catching genuinely dead sessions within ~2 cycles.

A re-entrant `sesMx` deadlock fixed the day before (v1.3.72) was what finally let the servers run at all; these fixes are what let them run *together* from cold.

### Skywire: A Direct Route Around the Hysteresis

**`3144`** feat(skysocks-client): --direct flag — direct-transport-only route to the server mirrors skynet-client's `--direct`: the client dials its server via an on-demand direct transport, one hop, bypassing the route-finder, the setup node, and therefore the destination circuit breaker. For a server you have (or can make) a direct transport to, that whole path adds nothing and only exposes you to stale-state failures — exactly the post-outage breaker hysteresis where setup is rejected as "destination circuit breaker open" even though the server is provably reachable over a direct dmsg bridge. It self-heals when the server restarts and works at autostart via the app's args.

### Skywire: The Post-Incident Audit

With the network recovered, a multi-agent audit went over the v1.3.72–76 dmsg changes looking for the failure class behind the outage — things that look healthy but can't relay, and resources that leak under churn.

**`3145`** fix(dmsg-server): wg-track the backgrounded entry-publish goroutines closes a race the cold-start fix introduced: moving the entry-publish loops into background goroutines meant `Close()`'s `wg.Wait()` no longer joined them, so a still-draining `PutEntry` could land *after* `delEntry` — leaving a zombie discovery entry advertising a now-dead server, exactly the "advertised but unreachable" shape that starves route setup. **`3150`** fix(dmsg): re-check shutdown before client entry publish narrows the same zombie-entry race on the client side.

**`3154`** fix(dmsgserver): surface dmsg data-plane death is the clearest example of the outage's failure class. The HTTP health server ran in the *foreground* while the dmsg data-plane ran in a goroutine — so if the data plane died first, its error sat unread while `/health` kept reporting healthy: a dead dmsg server that looks alive. Both serves now run as goroutines and the first death is returned so the supervisor can restart.

**`3147`** fix(dmsghttp): raise ReadTimeout 3s->30s — stop dropping registration POST bodies under load fixes a registration EOF observed live during the recovery herd. A prior fix had raised the *write* timeout but left the read timeout at 3s, and since that bounds the entire request read, a small signed-entry POST delayed over a congested dmsg stream during the mass-reconnect exceeded it — the server cut the conn, the client read EOF, and the visor never registered and fell out of discovery.

A cluster of leak and crash fixes followed: **`3148`** wraps the SOCKS5 skynet Dial callback in a `recover()` so a panic in the dial path fails the request instead of taking the whole visor down; **`3149`** closes the dialed skynet route group on every `connectRawTCPSkynet` error path (UI/CLI retries against a misconfigured remote were leaking one open route group per attempt); **`3151`** ensures `v.dClient` is never left nil on a minimal dmsg-only first boot — which had been either nil-dereferencing or recursing into a goroutine-stack overflow — by seeding the embedded deployment servers; **`3152`** releases the session mutex before the up-to-18s ping round-trip so `Close`/`ForceReconnect` writers no longer stall behind a single in-flight ping; **`3156`** fixes three independent low-severity leaks/races (an `EnsureSession` shared-entry mutation, a never-stopping `evictLoop`, and a skysocks Accept-error session leak); **`3155`** records a skynet request's outcome at the *real* result rather than prematurely after the dial; and **`3158`** fixes a circuit-breaker thundering-herd (half-open now admits one probe, not every caller) plus a confirmed visor crash where skynet `DialRoutes` dereferenced nil options.

### Skywire: Hard-Failing PQ Downgrades

Two findings completed the post-quantum downgrade story opened the day before. **`3153`** fix(noise): make silent PQ downgrades observable is the audit's HIGH finding: the hybrid negotiation is unauthenticated, so an active man-in-the-middle can strip the ML-KEM material and force both ends down to classical *undetectably* — defeating harvest-now-decrypt-later protection. The minimum mitigation wires up the previously-unused logger so an unexpected downgrade now emits a warning instead of passing silently. **`3159`** feat(noise): SKYWIRE_REQUIRE_PQ — hard-fail classical-only handshakes adds the prevention: with the env var set, a handshake that completes classical-only returns an error instead of downgrading. It defaults off — turning it on before every peer is updated would break handshakes to classical-only visors — so the rollout is ship observability, confirm via the downgrade warning that the fleet is fully PQ-capable, then flip it on.

### Skywire: dmsg-only Bootstrap, Closing the Loop

**`3146`** fix(dmsg): fall back to seeded servers when discovery yields no entries lets a dmsg-only service bootstrap through its configured servers without any HTTP discovery URL: when `discoverServers` comes back empty, the Serve loop consults the seeded permanent entries already in the cache rather than spinning forever on "No entries found." **`3157`** fix(transport-setup): seed dmsg-Client entry cache from config servers makes that fallback actually fire for the deployment services that construct their dmsg client directly (bypassing the visor's seeding path), so transport-setup can drop its HTTP discovery URL and bootstrap purely through its configured upstreams.

**`3160`** fix(visor): dmsg uptime probe must be live, not a one-shot Ready() latch fixes a measurement bug an operator spotted: the local-uptime dmsg probe selected on `Ready()`, a one-shot latch that never reopens, so it reported "dmsg has been ready at some point" rather than "dmsg is connected now" — which is why the 24h panel could nonsensically show skynet uptime *higher* than dmsg. It now checks the live connected-server set, making the dmsg tier directly comparable to the live skynet tier.

These fixes shipped as **v1.3.76**.
