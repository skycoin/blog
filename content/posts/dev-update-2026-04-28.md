+++
date = "2026-04-28"
tags = ["Development", "Skywire"]
title = "Development Update — April 28"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Skychat Pairing — End-to-End Encryption + Consent

The biggest day for skychat: a five-PR stack that turns the chat app from "anyone with my PK can DM me" into a consent-based, end-to-end encrypted system.

**`2379` per-pair feed primitives + bolt store** — each accepted pairing gets its own CXO feed, indexed in a local bbolt store. The pair record carries the peer PK, the negotiated symmetric key, and an `Accepted | Declined | Pending` state.

**`2380` visor: wire chat-pair feed manager + RPC surface** — `Visor` now hosts a `chatpair.Manager` initialized at boot. RPC verbs: `ChatPairList`, `ChatPairAccept`, `ChatPairDecline`, `ChatPairSend`, `ChatPairListen`. The skychat app dials these for the pair-flow operations.

**`2381` skychat: CLI `visor pair` tree + end-to-end pair integration test** — `skywire cli visor pair list/accept/decline/send` plus a full E2E test that boots two visors, sends a pair-invite, accepts on the peer side, exchanges encrypted messages, and asserts decryption integrity.

**`2383` skychat: HTTP /pair endpoints + pair-invite/ack handshake** — the in-process side of the flow. POST `/pair/invite` initiates; POST `/pair/accept`/`/pair/decline` from the receiving side. The handshake travels in the existing chat-app stream alongside regular messages, distinguished by an envelope type.

**`2385` skychat/pairing: ECDH + ChaCha20-Poly1305 body encryption** — the wire format. ECDH on the static identity keys derives a shared secret; per-message ChaCha20-Poly1305 with a fresh nonce encrypts the body. Pair-invite carries the initiator's ephemeral half; pair-accept binds it to a static-static derivation so future messages can be decrypted without per-session state.

**`2386` skychat: consent-based pair-invite flow with accept/decline UI** — the UI side. The hypervisor's chat tab shows pending invites with `Accept` / `Decline` buttons; declined invites are persisted so the same PK can't re-spam (subject to a future TTL).

**`2384` skychat UI: pair toggle, CXO send, paired-contact sync** — the toggle that switches the per-thread send between "plain chat-app stream" and "encrypted per-pair CXO feed". Paired contacts are synced into the contact list with a lock icon.

### Skywire: Skychat — Server Allowlist on CXO Publisher

**`2378` cxo/treestore: add subscriber allowlist on Publisher** — the underlying primitive the pairing system rides on. A `Publisher` now carries an optional allowlist; subscribers not in the list have their connect handshake rejected at the CXO layer. Each pair feed sets its allowlist to `[me, peer]`, so a third party who somehow learns the feed ID still can't subscribe.

### Skywire: CLI Surface Cleanup

A few cuts and shortcuts:

**`2375` cli: drop `{"output": ...}` envelope; route JSON errors to stderr** — every command used to wrap its JSON in `{"output": ..., "error": ...}`. Pipelines that wanted the actual payload had to `jq .output` first. Now `--json` emits the bare value; errors go to stderr as a single `{"error": "..."}` line.

**`2376` cli: migrate remaining commands to PrintOutput** — uniformity follow-up; integration tests stop scraping the wrapped envelope.

**`2374` cli: top-level shortcuts for the high-traffic visor verbs** — `skywire cli halt`, `skywire cli status`, `skywire cli pk` (aliases for `cli visor halt` etc.). The shortcuts shave six keystrokes off the most-typed operator paths.

**`2373` cli: rename `visor proxies` → `resolver`; split `skynet port` → `serve`** — `visor proxies` was misleading (it manages SOCKS5 resolvers, not generic proxies). `serve` is the new top-level home for forwarded-port management — independent of skynet vs DMSG since both can host the same port now.

### Skywire: User-Publishable CXO Feeds

**`2369` feat(visor): user-publishable CXO feeds with /feeds discovery** — the visor now exposes a `Visor.PublishCXOFeed(name, allowlist)` API and a `/feeds` HTTP endpoint that lists every feed this visor publishes (filtered by the caller's PK against allowlists). This is the building block that pairing and group-chat both ride on; making it a first-class public surface lets future apps (eventbus, presence, etc.) publish into the same framework without re-implementing the publisher plumbing.

### Skywire: Misc

- **`2371` fix(visor)** — port-80 reverse proxy honors `--local-port` when `--proxy-addr` is empty.
- **`2372` fix(sudph)** — reconnect on AR conn drop, retry STUN on transient fail, relax handshake to 5s. SUDPH sessions were dying for the day when AR briefly hiccupped; now they recover.
- **`2382` perf(dmsgd)** — keep entry cache populated on `SetEntry` instead of invalidating. Roughly halves dmsg-discovery's read load on hot-rotating entries.
- **`2370` rewards** — `cli rewards run` orchestrator. The reward cycle used to be a bash script; now it's a single Go command, easier to embed in CI.
- **`2367` fix** — move `DefaultCXOPort` off 46 to stop colliding with `DmsgHypervisorPort`.
- **`2366` config** — `--dmsgweb` / `--skynetweb` gen flags so config-gen lays down proxy auto-start without operator hand-editing.
- **`2365` fix(dht)** — publish a real signed DMSG entry; one writer for the tp salt (the SHA256-collision dedup logic was always picking the same writer, which then occasionally lost its slot).
- **`2368` log** — include PK on untrusted-setup-node reject; quiet expected dmsg-tracker miss.
