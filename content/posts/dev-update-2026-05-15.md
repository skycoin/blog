+++
date = "2026-05-15"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — May 15, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The faithful-UDP arc lands. Five stacked PRs add UDP-over-skynet end to end: wire type, route group, per-datagram AEAD, the visor-side bridge for forwarded ports, and the app-API surface for `DialPacket`. Plus a standalone `skyudp-bridge` (sibling to skymail-bridge) and the next round of skychat-group reliability fixes — the cascade that produces the `subscriber_alive` auto-recovery story.

### Skywire: Faithful UDP-Over-Skynet (Stages 1–5)

The architectural problem: skywire's route groups have always been TCP-shaped — ordered, reliable, head-of-line-blocked on packet loss. Most real-world UDP traffic (DNS, NTP, VoIP, gaming, QUIC) treats late packets as worse than lost packets. Tunneling UDP through a TCP-shaped stream defeats the point.

Five PRs introduce a UDP-shaped path through skywire that preserves the loss/reorder semantics applications expect:

**`2609` feat(routing): add DatagramPacket wire type (stage 1)** — a new `routing.PacketType` value (`DatagramPacket` = 0x11) sits alongside the existing `DataPacket`. Same header layout (route-id-prefixed), but no sequence number — datagrams are independent leaves on the wire, with no ordering guarantee enforced by the router.

**`2610` feat(router): DatagramRouteGroup + Group interface (stage 2)** — `DatagramRouteGroup` implements `net.PacketConn` over a route. The `Group` interface (Close / LocalAddr / RemoteAddr / IsAlive) is the common shape shared with the existing stream route groups, so the router can dispatch packets to either kind without case-splitting.

**`2612` feat(router): per-datagram AEAD for DatagramRouteGroup (stage 3)** — each datagram is independently encrypted + authenticated. ChaCha20-Poly1305-IETF with a 64-bit counter (zero-padded to the 96-bit nonce space) per direction; RFC 6479 sliding-window anti-replay with a 2048-bit window. Stream noise can't apply here — a single dropped datagram would desync the cipher state for every subsequent packet. Per-datagram AEAD is the right shape for the UDP use case, and the WireGuard-style counter construction is the canonical pattern.

Max plaintext per datagram: 65511 bytes (65535 wire cap − 24 bytes AEAD overhead).

**`2613` feat(visor): UDP-over-skynet via forwarded_ports.udp (stage 4)** — the operator-facing knob. `ForwardedPort.UDP: true` enables UDP semantics for a forwarded port. The visor binds a local UDP socket on `EffectiveLocalPort()`, opens a peer-side `DatagramRouteGroup`, and runs a bidirectional pump (`UDPBridge` type) that relays datagrams in both directions. Local app's UDP traffic flows through the bridge, over the route group, to the peer's UDP socket on the corresponding port.

The bridge is shape-agnostic — it accepts any `net.PacketConn` for either side — so the same type covers both the production case (DatagramRouteGroup as the skynet side) and the test case (in-memory mock pair).

**`2614` feat(appnet): DialPacket / DatagramPacketConn API (stage 5)** — the app-side surface. `DialPacket(addr)` and `DialPacketContext(ctx, addr)` return a `DatagramPacketConn` (extends `net.PacketConn` with `MaxPayload()`, `InboundDropped()`, `AEADAuthFailures()`). Apps consult `MaxPayload()` to avoid the opaque EMSGSIZE footgun that `net.UDPConn` presents; the counters surface health for operators.

Networkers opt into datagram support by implementing the narrow `PacketNetworker` interface (separate from the base `Networker` contract). Implementations that don't yet support datagrams stay valid; callers see `ErrPacketNetworkerNotSupported`.

The full stack ships behind a route-setup integration follow-up — the route-group construction itself (handshake, cipher key derivation, dispatch wiring) is a separate PR that touches significant `DialRoutes` machinery. Stages 1–5 land the API + scaffolding so the follow-up is a contained surgery.

### Skywire: Skyudp-Bridge — Standalone UDP→DMSG

**`2611` feat(skyudp-bridge): standalone UDP→dmsg bridge ("sub")** — a new top-level binary, sibling to `skymail-bridge`. Length-prefixed UDP-datagram framing over a regular dmsg stream — dmsg-only by design, with its own `dmsg.Client`, no visor or router involved. The two modes:

- `sub client` — listens on a local UDP socket, frames datagrams onto a dmsg stream, sends to `<peer-pk>:<port>`.
- `sub server` — accepts a dmsg stream, deframes datagrams, forwards to a local UDP socket.

Useful on hosts that don't otherwise run a skywire visor. A visor-embedded sibling that uses the full transport set (stcpr/sudph/dmsg via the router) is tracked in a follow-up issue.

**`5b6595b39` chore(skyudp-bridge): fix misspell-lint hits from #2611** — the inevitable misspell-lint follow-up.

### Skywire: Skychat/Group — The Receive-Side Cascade

A series of fixes complete the auto-recover loop for skychat group subscribers post-restart. The earlier per-peerSub liveness from #2606 was necessary but not sufficient; today's PRs close the remaining gaps.

**`2617` fix(skychat): auto-reconnect pairRPC client on shutdown error** — pairRPC's client retried on net errors but not on shutdown errors. A clean visor shutdown (not a crash) left the chat-app's pairRPC client in a permanent error state. Now treats shutdown errors as reconnectable.

**`2620` fix(skychat/group): legacy s.sub liveness coverage in detectStaleAndReconnect** — the D1 group-chat code carries a legacy `s.sub` field (the single subscriber to the owner's feed, predates the per-PK peerSubs map). The per-peerSub liveness machinery from #2606 only covers entries in `s.peerSubs`. A wedged `s.sub` had no staleness signal of its own and stayed dead until session close.

Fix: add `subLastInboundNs` parallel to `peerLastInboundNs`, with a wrapper around the legacy subscriber's onUpdate that bumps the new signal. `detectStaleAndReconnect` gets a new branch for the legacy sub.

**`2622` fix(skychat/group): bump session lastInboundNs on ReconnectLegacySub success** — follow-up to #2620. `Session.Connect`'s success path bumps the session-wide `lastInboundNs` (positive evidence the subscriber is attached). `ReconnectLegacySub` was only bumping the per-sub timestamp, so the operator-visible `subscriber_alive` flag didn't flip true until the next heartbeat arrived (~30s window). Both bumps now.

**`2623` fix(skychat/group): bump reconnectAttemptTimeout 5s → 15s for cold-start dials** — first-attempt dmsg dials on a cold visor (no warmed-up dmsg session) need more than 5s. The 5s budget covered the steady-state but bit on cold start. Bumped to 15s.

**`2625` fix(cxo/node): evict stale Conn on peer rejoin instead of rejecting** — the highest-impact fix today. The CXO node kept a `pkToConn` map mapping peer PK to active `Conn`. When a peer that had previously connected (and was tracked in `pkToConn`) tried to rejoin, the new handshake was rejected with `factory.Connection closed` — the existing entry in `pkToConn` blocked the new connection.

The fix: on rejoin, evict the stale entry from `pkToConn` and accept the new connection. The previous Conn is left to drain its existing route groups on close.

Visible effect: a member that left a group and tried to rejoin no longer hits a permanent handshake-reject from the owner's side. The bug was symmetric — both sides' CXO nodes had the same pattern, so the same fix lets both ends accept the rejoin.

### Skywire: Docs

- **`2624` docs(readme): lead with "Skywire is encrypted UDP & TCP"** + the merge commit. The README opener gets a rewrite that leads with the value prop (encrypted UDP + TCP) rather than the historical "decentralized internet" framing.
- **`d280f6a92` docs(readme)** — same.

### Skywire: Misc

- **`2618` chore: cleanup lint issues from UDP-stack admin-merge** — the inevitable post-merge sweep across the five-PR UDP stack.
- **`2621` chore: fix behaviour→behavior misspell from #2620** — one-line follow-up; the repo's misspell-lint rejects British spellings.
