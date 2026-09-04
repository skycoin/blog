+++
date = "2026-06-10"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — June 10, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A heavy day on two fronts. The first is the dmsg server: it stops booting on plain HTTP entirely — building its transit client before the server, registering and resolving strictly over dmsg, falling back to the embedded deployment config when no block is set, and self-updating its embedded server list over dmsg — and it gains a way for a *non-public* server to be reachable inbound via signed peer announcements. The second is the adaptive routing arc for multiplexed proxies, which lands its full observable → manual → adaptive control loop: `mux-set` to reconcile a leg-set, `mux-auto` to prune toward a latency preset, and the GROW direction so a session re-grows lost redundancy. Around those, a long run of lifecycle-audit fixes hardened the router, transport, dmsg session, and CXO layers against leaks and races found during live deploy-churn.

### Skywire: The dmsg Server Goes dmsg-Only

A cluster of changes takes the dmsg server fully onto its own overlay, so it no longer depends on plain HTTP for discovery and tracks deployment changes from the binary alone.

**`3070`** register + resolve strictly over dmsg, never plain HTTP — the server used to boot on a plain-HTTP discovery client and only later upgrade to a dmsg-primary-with-HTTP-fallback leg. It now builds the transit dmsg client *before* the server, seeding it with the embedded servers plus synthetic client entries for each discovery PK so it connects to the seed servers directly and dials each discovery over a peer relay — no discovery lookup, no HTTP. A no-fallback dmsg-only disc client is passed in so even the first (seq-0) registration goes over dmsg, and `discovery_dmsg` is now required on every deployment. The discovery side needs nothing new: it already serves its full router — including the registration endpoint — over dmsg, and a PUT over dmsg passes the same signature check as over HTTP.

**`3069`** fall back to the embedded deployment config when no block is set — a dmsg server config that omits the dmsg / discovery / servers block now falls back to the embedded `deployment.Prod`, so a server needs no `config gen` step to track deployment changes; the binary carries the current config, and an explicit block stays authoritative.

**`3068`** add `dmsg conf pull` to update the embedded servers over dmsg — `skywire dmsg conf pull` fetches the discovery's authoritative server list *over dmsg* (bootstrapping a direct client from the servers already embedded in the binary) and rewrites only the `dmsg_servers` arrays in the services config, byte-preserving the rest. This keeps the embedded config self-updating and works once the plain-HTTP deployment endpoints are retired.

### Skywire: Non-Public dmsg Servers, Reachable Inbound

**`3071`** non-public server reachability via signed peer announcements. A dmsg server run privately — not registered in the discovery — could dial out to public servers but its clients were unreachable inbound, because mesh forwarding was directional: a server only forwards over links it *dialed out*, and an inbound session is a forward target only if the remote PK is in the static peers config or the discovery. The result was "dmsg error 202" for anyone trying to reach those clients. The fix adds a signed `PeerAnnounce`: on each outbound peer link, a server with `announce_as_peer` sends a signed announcement (whose verification binds the source PK to the noise-authenticated session), and a server with `accept_peer_announcements` — opt-in, off by default, with an optional PK allowlist — promotes that inbound session into its forwarding set so client streams route back down it. The announcing server now also *serves* its outbound peer session, so it can receive the reverse-forwarded streams and bridge them to its local clients. The one-hop-max rule still bounds chaining, and promoted sessions are removed on close with an identity check.

### Skywire: Adaptive Multiplexed-Route Control

The observable → manual → adaptive arc for multiplexed proxy sessions lands end to end.

**`3053`** `proxy mux-set` — reconcile a session's mux legs to a target set. Where `mux-add`/`mux-rm` hand-drive one leg at a time, `mux-set` takes a whole target leg-set (the `route calc --json` shape) and reconciles a running proxy to it: add the missing legs, and with `--prune` remove the extras, diffing by each leg's first-hop transport id. This is the "make the legs be exactly these" primitive that the adaptive presets actuate.

**`3055`** `proxy mux-auto` — the adaptive control loop. `mux-auto` reads the live per-leg latency and steers a running proxy's legs toward a preset's intent (`fastest` = primary + 1, `balanced` = primary + 3, `resilient` = up to 8), pruning toward the K lowest-latency legs while always keeping the primary; `--watch` loops, `--dry-run` shows the decision without acting, and unprobed legs are left alone.

**`3073`** mux-auto GROW — adaptive multiplexed-route failover. The prune-only loop above only ever *shrank* a leg-set; this adds the GROW direction, so when live legs drop below the preset's target a session adds fresh *disjoint* legs and self-heals its lost redundancy. The new `GrowMuxRoute` computes the live legs' exclude-set and plans the additional disjoint legs visor-side (mux-info only exposes each leg's first hop, not the full chains needed for a correct exclude-set), with a `--min-hops` floor so a multihop mux grows with multihop legs. A companion fix bumps the control client's timeout to 120 s, since a fresh disjoint dial can exceed the 30 s default — a live 6→8 grow took 39.5 s and reported "grew 2" correctly.

### Skywire: Router and Transport Lifecycle Hardening

A run of adversarial audits during live deploy-churn turned up several leaks, races, and a deadlock in the routing and transport layers.

**`3057`** protect the primary leg + compact mux leg arrays on removal — the runtime mux-leg removal path could remove the *privileged* primary leg (index 0), which ping/pong/SACK and the mux selector all hardcode, and it never compacted the `legs`/`ready` arrays on removal, so after a middle leg was pruned readiness and per-leg accounting attached to the wrong leg (the documented mux-≥2 zero-bytes/hang failure). A leg-0 guard and a `removeLegs` counterpart to `growLegs` fix both.

**`3060`** write deadline + lock/race fixes in managed-transport — four defects, two sharing one root cause: there was no write deadline anywhere in the write paths, so a half-open conn could block `Write` forever, in one case while holding the transport mutex (freezing the whole transport, including its own close). The fix captures the transport, releases the lock before the write, and sets a 1 m write deadline; two further fixes close a check-then-deref race against `close()` and stop returning a closed-but-not-yet-reaped transport as if live.

**`3065`** tear down remote rules on partial route-setup failure — installing a route's rules across intermediary and destination hops had no rule-*delete* RPC, so when setup failed partway the succeeded hops' forward rules orphaned (self-healing only after ~10 min of keepalive GC), and the exclude-and-retry loop plus mux fan-out multiplied them. A `DelRules` RPC plus per-hop RouteID tracking now best-effort tears down every confirmed hop on any later error, while the per-PK clients are still live.

**`3045` companion** **`3056`** never hold `execMu` across a pooled-session Close — the pooled-exec pool from #3050 closed sessions inline under the host-global exec lock, so one dead peer's slow synchronous Close stalled every pooled-exec op to every *other* peer behind the global lock. Retiring a session now returns it to be closed *after* the lock is released.

### Skywire: dmsg and CXO Session-Lifecycle Fixes

**`3059`** hold the session mutex across the done-check to avoid a send on a closed channel — the dialed-session serve goroutine checked the closed flag unlocked, then sent on the error channel under the lock, so an interleaving with `Client.Close()` could send on a closed channel; the panic was recovered but it logged a misleading message and skipped the identity-checked session deletion and the disconnect callback. Moving the done-check inside the critical section makes it atomic with the close.

**`3058`** wait for dmsg-ready before the DMSG-HTTP TPD connect (boot wedge) — at boot, transport init could run before dmsg had established its sessions, so the DMSG-HTTP transport-discovery client failed and fell through to a plain-HTTP retrier configured for *infinite* retries; on a dmsg-only deployment that retrier has no working egress and spins forever, wedging the whole visor init (the process stays up with pprof listening but never binds its RPC). A bounded 60 s wait on dmsg-ready — the pattern already used elsewhere — lets the DMSG-HTTP path succeed instead.

**`3061`** / **`3062`** / **`3063`** the rc-side and shutdown completion of the CXO leak work. #3061 undoes a speculative CXDS refcount increment left in place by the #3047 fix — with no cache entry, the filler had nothing to decrement through, so each declined large leaf pinned one DB object at rc≥1 forever; undoing the speculative ref on the decline path lets the reclaim path free it. #3062 fixes two resolver bugs found by audit — host-rewrite was corrupting a raw-TLS byte stream when a vhost pointed at an HTTPS backend with MITM off, and a skynet direct-transport handshake failure silently fell through to a multihop route instead of returning the error. #3063 closes a goroutine leak (Container.Close shadowed the embedded Index.Close, so the index-stat loop never stopped) and a Node.Close deadlock, which together let the #3047 regression test be re-enabled.

### Skywire: Faster Route Setup and a Reward-Source Switch

**`3072`** tighten the multihop handshake-await from 12 s to 6 s — after the v1.3.67 fleet convergence, 2/3-hop routes reliably establish in ~3–5 s when the finder's first pick is live; the slow tail came from the finder ranking by latency, not liveness, so a low-latency-but-dead intermediate burned the full handshake-await timeout before the retry loop could move on. A route-group handshake is a single small packet each way, so 12 s was ~10× the worst realistic RTT; halving it makes each bad-first attempt cheaper so more retries fit under the setup budget — faster successes and fewer outright timeouts.

**`3052`** switch the script reward template to the TPD-integrated uptime source — the reward script emitted a call against the standalone uptime service, which records plain visor→UT heartbeats, so visors that pinged but never registered a transport were still credited despite contributing no usable capacity. The template now uses the transport-discovery's registration records — a stronger reachability signal — reshaped into the long form the reward calc reads, with the daily JSON kept in the same schema so existing consumers keep working. The eligible-PK pool typically shifts ~10–15% per day versus the old source.

### Skywire: Misc

- **`3067`** deployment: re-key a relay that was sharing one identity across two boxes (their discovery entries had been clobbering each other), resync the embedded dmsg-server list to the live all-servers list, and fix a gen path-resolution bug.
- **`3066`** docs: add measured per-unit resource-usage figures (~90 KB live heap per visor transport, ~0.5 MB RSS per dmsg-server client) with sizing guidance.
- **`3054`** docs: bring the PTY and Skychat user guides into the published mkdocs site under a new "Apps" nav section.
