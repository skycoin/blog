+++
date = "2026-05-18"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — May 18, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Two foundational threads today. The big one is **IPv6 dual-stack** — issue #1525 lands across the schema, the address resolver, the dmsg-server advertisement, and a Happy-Eyeballs dialer, in a tidy phased rollout. The other is the **standalone skychat** path: a noise-TCP direct connection (encrypted, public-key-addressed) plus a `--standalone` mode that runs the chat app with no visor process behind it — just the encrypted connection and a pubkey identity. Plus the usual CXO/pairing reconnect hardening and the start of a CI mux-route probe.

### Skywire: IPv6 Dual-Stack (#1525)

Skywire's addressing has been IPv4-shaped end to end. Issue #1525 brings IPv6 through the whole path in phases, so a visor can advertise, register, and dial over both families.

**Phase 1 — schema** — `RemoteAddrV6` + `AddressV6` fields and a per-family bind merge, so the data model can hold both families at once rather than overwriting one with the other.

**Phase 2 — advertise + register** — the dmsg-server advertises its v6 address in its discovery entry (2a); the visor binds the address resolver over v6 HTTP to register `RemoteAddrV6` (2b); and the visor declares its `PublicIPv6` in the bind payload over the dmsg-routed AR path (2c). The result: a visor's v6 endpoint is discoverable and resolvable the same way its v4 endpoint is.

**Phase 3 — Happy Eyeballs dialer** — the transport/network dialer adopts the Happy-Eyeballs pattern: race v4 and v6 connection attempts and take whichever completes first, rather than serially trying one family and timing out before the other. Unit tests pin the dialer branches (#2717).

**Phase 4a — surface it** — `ARSelfEntry` exposes `RemoteAddrV6`, and the CLI renders the dual-stack view, so an operator can see both families an entry carries.

**Phase 5 — CI** — a dual-stack dmsg e2e lane exercises the path end to end, scoped down to compose-config validation where appropriate.

### Skywire: Standalone Skychat — Encrypted TCP, Public-Key Identity

A quietly important primitive lands: the chat app can run *standalone* — without a visor or router behind it — over a direct, encrypted, public-key-addressed TCP connection. (A note on vocabulary: in skywire a *transport* is a connection a visor creates and the router can route over; this standalone link is a bare *connection*, below that line.)

**`2707` feat(skychat): noise-TCP direct transport — listener, peer dialer, CLI --via** — a noise-encrypted TCP connection with a listener and a peer dialer, addressed by public key. `--via tcp://<pk>@host:port` dials a peer directly with the noise handshake providing the encryption and the pubkey providing the identity. No discovery, no router — just the encrypted connection between two keys.

**`2708` feat(skychat): --standalone mode (skip PROC_CONFIG, keep TCP-direct + HTTP control)** — runs the chat app on its own: it skips the visor `PROC_CONFIG` handshake (which normally binds an app to a parent visor) but keeps the TCP-direct connection and the HTTP control surface. The chat app becomes a self-contained binary that two peers can run and talk through, each identified by its key.

Followed immediately by the inevitable hardening: nil-deref guards in the standalone HTTP handlers (#2709) and a `/message` guard plus a CLI `--via` implicit-recipient convenience (#2710).

This is more foundational than a chat feature. It isolates the layer the whole system is built on — an encrypted connection with the public key as identity — into something you can run by itself. Everything else (the router, transports, the overlay, the apps) is what you build *on top* of that primitive.

### Skywire: CXO / Pairing — Reconnect Hardening

**`2713` fix(cxo/treestore): subscriber reconnect watchdog** — a watchdog that detects a subscriber that has fallen off and drives a reconnect, rather than waiting for the next external trigger.

**`fix(skychat/pairing): Manager.Resume reconnects subscribers** — root-caused a 3-agent pair-receive bug: `Manager.Resume` (the post-pause/restart path) wasn't reconnecting subscribers, so a resumed manager had live-looking sessions with dead subscriptions underneath. Now Resume drives the reconnects.

**`fix(cxo/skyobject): DelRoot walk best-effort on ErrNotFound** — root cause of #2678: the `DelRoot` tree walk now treats a missing node as best-effort rather than aborting, so a partially-present tree can still be cleaned up.

Plus two dmsg-discovery CXO-publisher fixes: drop tombstone writes from the clients-by-server publisher, and skip the CXO republish on heartbeat-only entry updates (don't churn the feed when nothing material changed).

### Skywire: CI — Multiplexed-Route Probe

**`feat(ci): mux-route-probe.sh — 3-visor multiplexed-route test runner** — a test runner that stands up a 3-visor topology and exercises multiplexed routing (multiple parallel routes between two endpoints). The beginning of a measurement harness for the multihop/multiplexed routing that is the system's core capability — the kind of thing that turns "it should route over N disjoint paths" into a number you can assert on.
