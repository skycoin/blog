+++
date = "2026-05-14"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — May 14, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Largest day on develop in recent memory. Three big arcs land: **federated send for group chat** (members publish to their own feeds instead of relaying through the owner), the **admin-role + admin-mirror cascade**, and the **skymail-bridge** for email-over-skywire. Plus a sweep of fixes to the per-peerSub liveness model from yesterday, the dmsgpty-via-visor-RPC routing, and specs cleanup.

### Skywire: Skychat/Group — Federated Send

PR #2580 inverts the v1 model. Pre-fix: only the owner published; members had to route through the owner's relay listener (PR #2506). Post-fix: every member publishes to their own per-PK feed; other members subscribe to every other member's feed.

```
Pre:
  member1 ──relay──> owner ──publish──> CXO feed ──> member2

Post:
  member1 ──publish──> member1's feed ──> member2
  member2 ──publish──> member2's feed ──> member1
  owner   ──publish──> owner's feed   ──> all
```

The relay listener stays for backward compatibility with pre-federated members. Owners on the new binary publish to their own feed AND continue to accept relay submissions, so a mixed-binary group keeps working.

The new shape is more resilient: a wedged owner publisher used to silently drop every member's send. Now members send through their own publishers and reach every other member directly. The owner becomes one peer among many.

### Skywire: Skychat/Group — Admin Role + Admin-Set Management

A three-PR stack rebuilds the roster-authority model:

**`2583` feat(skychat): admin role + admin-set management (1/3)** — separates "who can edit the roster" from "who owns the publisher". The Record gains an `Admins []cipher.PubKey` field. The founder (`OwnerPK`) is always in the admin set; additional admins are added via promote/demote operations.

Visors with admin role can: add members, issue invites, delete the group, promote/demote other admins (founder excluded — the founder cannot be demoted).

**`2584` feat(skychat): admin mirror feed wiring (2/3)** — admins-set + members-set propagation. Admins publish a `mirror` CXO feed alongside their `messages` feed; the mirror carries roster changes (member added, admin promoted, etc.) as ordered events. Subscribers replay the events to keep their local roster in sync with the admin's view.

**`2585` feat(skychat): member subscribe to admin mirrors + dedup (3/3)** — members subscribe to every admin's mirror feed and apply roster changes locally, with dedup across the mirrors (a change can be observed via multiple admins' mirrors; only one applies). Closes the "roster gossip" gap that's been outstanding since the group-chat work began.

### Skywire: Skychat/Group — Per-PeerSub Liveness Signal

PR #2606 (with the same-day fixups #2595, #2600, #2601) introduces per-peerSub liveness. The earlier work (PR #2537) collapsed four liveness flags into one session-wide `lastInboundNs`. But the session-wide signal aggregates across all peerSubs in the group — one chatty peer keeps the session "fresh" even when another peer's peerSub is silently wedged.

The fix: each peerSub gets its own `lastInboundNs` (per-peer atomic int64 keyed by PK). `detectStaleAndReconnect` iterates each peer's signal independently; a silent peer triggers a per-peer reconnect even when other peers are chatty.

Companion fixes:

- **`2595` fix(skychat/group): owner-role peerSubs also need reconnect coverage** — owner-role sessions also have peerSubs (every member's feed). Pre-fix, only member-role sessions got reconnect coverage. Owners with stale peerSubs were silently missing other members' sends.
- **`2600` fix(skychat/group): Session.Connect only declares fresh on actual success** — partial Connect failures (legacy s.sub succeeds, peerSubs fail) were declaring the session fresh, masking the failure. Now any peerSub failure surfaces it.
- **`2601` fix(skychat/group): owner's own heartbeat must not bump lastInboundNs** — the owner emits heartbeats; observing your own heartbeat shouldn't count as "I'm receiving from a peer". Filtered out.
- **`2608` fix(skychat/group): thread context.Context through Connect / ReconnectPeer** — the reconnect attempt-timeout was implemented via a goroutine + `time.After`. The goroutine leaked when the timeout fired. Threading a context through the call chain lets the underlying dial honor the deadline and exit cleanly.

### Skywire: Skymail-Bridge — SMTP Over Skywire

**`2598` feat(skymail-bridge): SMTP-aware sender-side bridge for skywire email** — a new top-level binary, `cmd/skymail-bridge`, that bridges SMTP to skywire. The model:

- Receiver-side: run skymail-bridge as a virtual postfix-transport target. Postfix delivers mail to it for `*.<base32-pk>.skynet` domains; skymail-bridge strips the `<pk>.skynet` portion and hands the bare-PK envelope to the local postfix's virtual-alias chain for delivery.
- Sender-side: skymail-bridge listens on a local SMTP port; sending to `user@<base32-pk>.skynet` opens a skywire route to the destination PK and delivers the envelope.

The address shape (`user@<base32-pk>.skynet`) survives RFC 1035's 63-octet DNS label limit because base32 of a 33-byte PK is 52 chars. Hex would be 66 chars and break.

Companion PR **`2605` feat(skymail-bridge): mode b accepts both host-prefixed and bare-PK shapes** — the receive side accepts envelopes with or without the `.<pk>.skynet` suffix, so the existing virtual_alias chain can route either way.

Operator recipe: **`2604` docs(guides): skymail-bridge operator recipe + Postfix overrides** — step-by-step guide for the postfix-side configuration.

### Skywire: DmsgPty CLI — Route Through Visor RPC

**`a67033110` feat(cli/dmsg): route `skywire cli dmsg pty exec` through visor RPC** — `cli dmsg pty exec` used to bypass the visor and open a fresh dmsg client from the CLI process. That meant another full noise handshake per call, and operators with a paused visor (suspended via `cli halt`) couldn't run pty commands until they restarted.

Now the CLI sends a `DmsgPtyExec` RPC request to the running visor; the visor's dmsg client handles the actual transport. Subsequent calls reuse the visor's open dmsg sessions. The `--via tcp://<pk>@<host:port>` direct-TCP path (from yesterday's PRs #2559–#2561) remains the bypass for cases where the visor is unreachable.

### Skywire: Specs Cleanup

A coordinated audit of the specifications/ tree:

- **`29d95e14f` docs(specs): strip non-normative content from specifications** — discussion, rationale, and implementation notes move out of the normative spec docs.
- **`6c6311f79` docs(specs): TPD reg via CXO subscription + HTTP dual-write; drop DHT mentions** — TPD spec brought in line with the post-DHT-removal reality.
- **`c18ba1855` docs(specs): purge Kademlia DHT references — DHT is no longer wired** — the global purge pass.
- **`64459173a` docs(specs): trim implementation detail from TPD + Transport Management** — TPD spec sheds the Redis-flavored schema in favor of a backing-store-agnostic data model table.

### Skywire: Skychat — Network Fallback + Relay-Ack + Group gRPC Streaming

Three skychat polish PRs:

- **`2571` feat(skychat/group): server-streaming gRPC for group listen** — replaces the long-poll loop. `cli skychat group listen` opens a server-streaming gRPC stream; messages arrive push-style with much lower latency.
- **`2574` feat(skychat): network fallback — try alternate transport on send failure** — a 1:1 send that fails on skynet (e.g. no route available) now retries on dmsg before surfacing failure to the caller. Same alternation in reverse for dmsg-first sends.
- **`2575` feat(skychat/group): relay-ack for member→owner sends** — when a member sends via the owner's relay (the backward-compat path), the relay listener now sends a frame-level ack so the member knows the relay actually processed the message.

### Skywire: Other

- **`2572` feat(cli): ssh + sshd commands — OpenSSH-equivalent surface over skywire identity** — `cli ssh <pk>` opens an interactive shell on the peer (built on dmsgpty); `cli sshd` runs the daemon side. Same authentication surface (dmsgpty_whitelist), just an ergonomic OpenSSH-shaped wrapper.
- **`2573` feat(cli/skychat): default --wait=5s for delivery-confirmed send** — the `--wait` flag from PR #2511 was off by default. Now defaults to 5s; fire-and-forget is `--wait=0`.
- **`2578` feat(skychat/group): persistent group history at the visor layer** — group history is no longer a chat-app-only concern; the visor persists it in the same store as 1:1 history, so a chat-app restart preserves the backlog without depending on chat-app-side bbolt.
- **`2582` docs**: cobra-driven docs/skywire/ tree + hidden `skywire doc` generator. Each command renders its `--help` into a markdown page; the doc site rebuilds from one source.
- **`2590` feat(docs)**: MkDocs Material site at `skycoin.github.io/skywire`.
- **`2599` fix(cxo/treestore): release publisher mutex around encode + bbolt write** — the CXO publisher mutex was held during the entire encode + bbolt write. Decouples encode + write from the mutex so concurrent reads aren't blocked by serialization.
- **`2594`/`2596` cli/config/gen**: default `--pair-enable` on skychat for groups to work; SKYCHATPAIR knob for `--pair-enable`.
- **`2602`/`2603` fix**: kebab-case `--dmsg-port`, fix garbled `--config`; skychat uses local ServeMux so RunSkychat is re-entrant.
