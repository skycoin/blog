+++
date = "2026-04-29"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — April 29, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Per-Port PK Whitelist on Raw-TCP Skynet and DMSG

PR #2395 closes a gap in the forwarded-port access-control model. The `ForwardedPort.Whitelist` field already gated the port-80 HTTP reverse-proxy path (added with the landing page in PR #2317), but raw-TCP forwards on every other port bypassed the check entirely — any peer who knew the port could connect.

The fix:

- `serve` command's TCP forwarder (skynet path) consults the per-port whitelist before accepting an incoming connection. Source PK comes from the route group's remote address.
- DMSG-side raw-TCP forwarder does the same lookup on its incoming dmsg streams.
- Reject path closes the conn immediately; no error frame, no acknowledgment that a port-with-this-number exists. From the rejected peer's perspective, the port behaves identically to one that isn't forwarded.

The CLI gains `serve whitelist` to manage the per-port set:

**`2394` cli** — `skywire cli serve whitelist add/rm/ls <port> <pk>...` for the per-port set, plus a `WHITELIST` column in `serve ls` showing the count and a marker for empty (= open to all authenticated peers).

### Skywire: DHT + RSN Listeners Initialized Early

**`2396` visor: register DHT + RSN await-setup listeners early in init** — a startup-ordering fix that bit during E2E tests. The DHT subsystem and the await-setup-node listener registered themselves on the router AFTER the visor's transport manager had already started accepting connections. A peer that dialed in during the gap window saw the router accept the conn but reject the packets, leading to a confusing handshake-fail loop until the listeners came up.

Both listeners now register synchronously before the transport manager goes live. The visible symptom — about three seconds of intermittent rejects on cold start — is gone.

### Skywire: Multi-Route Calc + Min-Hops Respect

**`2397` cli: route calc returns multiple routes; respects visor min_hops** — `cli route calc` was returning a single best path. With min_hops>1 configured on the destination, the single result sometimes had fewer hops than the policy allowed, and the operator would have to manually re-run to get a valid path.

The change returns every candidate route up to a configurable max (default 3), and applies the destination's `min_hops` filter server-side. Operators looking at the output now see the actual choice set the router has.

### Skywire: Log Truncation — Stop It (Round 2)

Two PRs on the same day for the same theme:

**`2391` log/cli: stop truncating public keys** — first round; spotted instances where logrus's text formatter was eliding the trailing portion of long fields.

**`2393` log/cli: stop truncating public keys (round 2)** — second round caught the remaining sites: `cli visor info`'s pretty-print, `route group` listing, and the `skywire cli mdisc` output.

The pattern is now uniform: PKs print full hex (66 chars). For operators correlating logs across visors, partial PKs are unusable — even a 12-char prefix collides regularly in a large network. Better to wrap the line.

### Skywire: DMSG Server — Preload Direct Client Cache

**`2390` fix(dmsg-server): preload direct client with peer dmsg-server entries** — a dmsg-server that needs to reach another dmsg-server (for the DHT mirror, for example) used to hit dmsg-discovery on every first connect. Now the server preloads the peer-server set into its direct-client cache at startup, so the first cross-server connect skips the discovery lookup.

### Skywire: Skychat SSE Fan-Out

**`2389` skychat: fan SSE messages out to all clients (fix self-send drop)** — when the operator had two browser tabs open on the same chat app and sent a message from tab A, tab B never saw the self-send mirror. The SSE hub was routing per-stream rather than fanning out. Self-sends now hit every connected SSE client like every other event.

### Skywire: Docs

**`2392` docs(deployment): document dmsg-server DHT/Redis configuration** — the DHT-mirroring dmsg-server gained Redis dependencies for its node store. The deployment doc now spells out the Redis URL knob, the index-set key conventions, and the migration path from a pre-DHT dmsg-server (it just runs without the DHT, no Redis required).
