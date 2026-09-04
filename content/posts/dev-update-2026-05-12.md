+++
date = "2026-05-12"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — May 12, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A massive day for skychat. The chat-app gets group chat, encrypted DM, per-PK aliases, history replay, peer-receipt acks, a unified CLI TUI, and the dmsgscp utility — all merged today. v1.3.53 ships at the end.

### Skywire: Skychat D1 — Group Chat over CXO

PR #2505 introduces D1 group chat. The model: one member owns the group's CXO feed and publishes messages; other members subscribe (read-only in v1; PR #2506 adds member-side relay).

Group records live in a per-visor bbolt store with the schema:

```
{
  id        UUID
  name      string
  owner_pk  cipher.PubKey
  port      uint16          // DMSG port for the owner's publisher
  mode      "public" | "private"
  aes_key   []byte          // ModePrivate only
  members   []cipher.PubKey
  role      "owner" | "member"
  status    "active" | "pending" | "left" | "revoked"
  ...
}
```

Owner-side: a `Publisher` writes message leaves under `msgs/<senderHex>/<ts-nano>/<seq>` in a CXO feed. Member-side: a `Subscriber` follows the feed, deduplicates by `(sender, ts, seq)`, and surfaces leaves via the existing chat-app HTTP `/messages` stream with a `group_id` field set.

Bundled with this is the standalone `skywire dmsg chat` command — a TUI client that doesn't require the chat-app process. Useful for low-resource visors.

### Skywire: Skychat Member-Side Send via DMSG Relay

**`2506` feat(skychat/group): member-side send via dmsg relay** — members in v1 can publish via the owner's relay listener. Each owner-side group session opens a parallel dmsg listener on `Record.Port+1`. Members frame a `RelayMessage` envelope and send it through that listener; the owner re-publishes into the CXO feed with the original sender's PK attributed.

The relay is the bridge before federated send (each member publishing to their own feed) lands later in the week. Importantly: the relay path lets members participate in groups even on pre-federated binaries.

### Skywire: Skychat Send `--wait` Peer-Receipt Acks

**`2511` feat(skychat): send `--wait` peer-receipt ack via chat-msg/chat-ack envelopes** — sending a 1:1 message used to be fire-and-forget at the API level. The chat-app would return success when the message hit the wire, but the operator had no signal that the peer's chat-app had actually received and processed it.

The new envelope shape:

- `chat-msg` envelope: `{type, id, body, ack}` — when `ack=true`, the sending visor registers a waiter on the message id.
- `chat-ack` envelope: `{type, id}` — sent by the receiver's chat-app on successful frame processing.

The `--wait` flag on `cli skychat send` blocks up to the specified duration waiting for the ack. Acked successfully: "Acked by `<pk>` in `<N>`ms". Timeout: explicit failure with reason. `--wait=0` preserves the fire-and-forget behavior for automation that doesn't care.

### Skywire: Skychat-CLI — Unified TUI

**`2518` feat(skychat-cli): unified TUI — picker + DM + group chat** — `cli skychat chat` (with no recipient) launches a bubbletea TUI that combines:

- A peer picker (recent + paired + group)
- A 1:1 DM view per peer
- A group chat view per joined group
- Inline switching between conversations
- Compose box with Ctrl+Enter to send, Esc to switch back to picker

Same shape as common terminal chat clients. Replaces the per-mode subcommand split.

### Skywire: Skychat — Persistent Group History Replay

**`2520` feat(skychat/group): replay last 100 messages on visor restart** — the chat-app persists the last 100 messages per group to bbolt and replays them on visor restart. Members joining a group don't get the historical messages from before they joined (the publisher's CXO feed predates their subscription); they do get the last 100 messages they personally observed, persisted locally.

### Skywire: Skychat-CLI — PK Alias / Addressbook

**`2512` feat(skychat-cli): PK alias / addressbook** — local alias file at `~/.skywire/skychat-aliases.json`. `cli skychat alias add <pk> <name>` and `... rm <pk>`. The TUI and listener output substitute aliases for PKs in the display. Operator quality-of-life win — 66-character hex PKs are unreadable in a chat backlog.

### Skywire: dmsgscp — SCP-over-DMSG

**`2524` feat(dmsgscp): scp-over-dmsg utility** — a new top-level tool: `dmsgscp <local-path> <peer-pk>:<remote-path>` (and the reverse). Wraps a length-prefixed file-transfer protocol over a dmsg stream, with the existing `dmsgpty_whitelist` controlling who can receive.

`dmsgscp` shares the dmsgpty authentication surface; operators who've already whitelisted a peer for ptys don't need separate setup for file transfer.

**`2527` fix(dmsgscp): default-on, listen on dmsg + skynet** — first-day follow-up. The receive side listens on both dmsg and skynet now, matching the dmsg/skynet symmetry of every other peer-facing port.

### Skywire: Skychat /status + Stale-Conn Retry

**`2523` fix+resilience(skychat): MarkMessage + TUI/GUI polish + cli single-line listen + stale-conn retry + group auto-reconnect + /status health** — a grab-bag of resilience improvements:

- Read-acks via `MarkMessage` so the TUI can show "seen" state per peer.
- Single-line `cli skychat listen` output for log aggregator compatibility (multi-line message bodies escape newlines).
- Stale-conn retry on the chat-app's outbound send path: a cached conn whose underlying transport died between sends now redials + retries once before surfacing failure.
- Group auto-reconnect on subscriber stream drop.
- `/status health` endpoint with structured liveness fields.

### Skywire: Skychat /status Send-Failure + SSE-Drop Counters

**`2526` feat(skychat): /status send-failure + sse-drop counters; cached-only retry guard; CLI --retries** — every visible failure now has a counter on `/status`. The CLI's `--retries` flag (default 1) controls HTTP-layer retry for transient transport failures. The retry guard ensures only cached-conn failures retry (a fresh-dial failure won't help by retrying).

### Skywire: v1.3.53 Release + Misc

**`0111c8565` release(v1.3.53): changelog for skychat-resilience + dmsg-utility release**

Other items:

- **`2515` fix**: owner sees own group sends in local inbox (was previously dropped because owner=publisher and the local subscriber filtered self-PK).
- **`2514` fix**: group listen auto-reconnect on visor restart.
- **`2516` fix**: suppress reconnect-spam on group listen retries.
- **`2510` schema v1**: id/to/len on msg, schema/version on banner, /status counters.
- **`2509` history + status subcommands** on `cli skychat`.
- **`2508` fix**: listen --json + --from + outgoing-mirror + network on inbound.
- **`2507` perf(dmsg/noise)**: cache static-static DH results for repeat peers — measurable improvement on the chatty group-chat flows.
- **`2521` fix(gotop)**: capture stray log output instead of letting it corrupt the TUI.
- **`2513` fix**: member CXO node dial-port off-by-one breaks join.
- **`2522` fix**: isMember reads live allowlist, not snapshot.
- **`2519` feat(dmsgpty)**: non-interactive Exec — run one command, return stdout/stderr/exit. Pairs with `cli dmsg pty exec` for scriptable cross-visor RPC.
- **`2503` feat(autoconfig, skyenv)**: native-Go env-file parser; Windows-aware autoconfig phase 1.
- **`2504` fix(apps/skychat)**: length-prefixed frames on the peer-to-peer wire.
- **`2502` ci(deploy)**: serialize Deploy runs per-branch via concurrency group — fixes the racing-build noise.
- **`2500` perf(cipher, dmsgd)**: halve hex-encode allocs on `MarshalText` + dedupe in a hot map.
- **`2501` fix(cli)**: operator-UX bundle — config template + WARN, router/proxy clarity.
