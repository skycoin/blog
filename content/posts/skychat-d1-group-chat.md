+++
date = "2026-05-12"
tags = ["Development", "Skywire", "Skychat"]
title = "Skychat D1: Group Chat Over CXO"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Skychat got DM-shaped messaging years ago. Group chat is a different shape — multi-party, lossy-tolerant, with members joining and leaving — and it's been an open feature gap. Today's PR stack ships **D1 group chat**: the first design iteration, owner-centric, riding on CXO feeds, with end-to-end encryption optional via per-group AES keys.

### The D1 model

D1 picks the smallest viable shape that lets a group of people exchange messages reliably:

- **One member owns the group's CXO feed.** The owner runs a CXO Publisher; other members run Subscribers that follow it.
- **Messages are leaves in the publisher's tree** at the path `msgs/<senderHex>/<ts-nano>/<seq>`. The sender PK in the path means subscribers can attribute every leaf even though they all live in the owner's feed.
- **Member sends go through the owner's relay listener** (a parallel dmsg listener on `Record.Port+1`). The member frames a `RelayMessage`, sends it through the relay, and the owner re-publishes the body into the CXO feed with the original sender's PK attributed. Members on the new binary can also publish directly to their own feeds (federated send, PR #2580 two days from now), but D1's compatibility path is the relay.
- **Group records persist locally** in a per-visor bbolt store with name, owner_pk, port, mode (`public` | `private`), AES key (private mode only), members, role, status, and timing fields.

The model is intentionally simple. There's exactly one feed per group, exactly one publisher, exactly one ordering. Replay is straightforward: a member that just joined subscribes to the feed and reads the most recent N messages. A member that drops off and reconnects sees what they missed (up to the feed's retention window).

### Public vs private

A group is either `public` or `private`:

- **Public** — the feed is reachable to any peer who has the group ID + port + owner PK. The invite link encodes those three things in base64. Anyone with the link can join. Message bodies are plaintext in the CXO leaf.
- **Private** — the same invite link additionally carries an AES-256-GCM key. Every message body is sealed under the key before being written as the leaf value. The path (`msgs/<sender>/<ts>/<seq>`) stays plaintext for ordering. A subscriber without the key sees the messages exist (and the senders, by the path) but can't read the content.

The private-mode key is symmetric, owned by every member. That's a deliberate trade-off: anyone with the invite link can read every past and future message in the group, but the operator's mental model is simple — "share this link with the people I want in the group." For more granular control (per-member visibility, retroactive revocation), the pair-derived keys from last week's pairing work (PR #2385) are the foundation for D2.

### The invite link

```
skychat:invite:<base64-encoded JSON blob>
```

The blob carries `{id, name, owner_pk, port, mode, [aes_key]}`. To join, an operator runs:

```
skywire cli skychat group join 'skychat:invite:...'
```

The CLI decodes the blob, persists a group record with `role=member, status=pending`, opens a subscriber to the owner's feed, and runs the initial Connect. On success, status flips to `active`.

### Standalone `skywire dmsg chat`

Bundled with the group-chat work is a standalone `skywire dmsg chat` TUI — a chat client that doesn't require the chat-app process to be running. It opens a dmsg client of its own, dials the peer's chat-app (or runs as a server side), and provides a bubbletea TUI for compose + history. Useful on low-resource visors where the chat-app's HTTP surface is too much overhead.

### Send `--wait` peer-receipt acks

The other big change today is on the DM side: `cli skychat send --wait=5s` now blocks waiting for a peer-receipt ack from the destination's chat-app, surfacing whether the message actually landed.

The wire envelope:

```
chat-msg: {type: "chat-msg", id: "<uuid>", body: "...", ack: true}
chat-ack: {type: "chat-ack", id: "<uuid>"}
```

The sender registers a waiter on `id` before writing the frame. The receiver's chat-app sees `ack: true`, processes the message, and sends back a `chat-ack` envelope. The sender's HTTP request blocks until either the ack arrives (success: "Acked by `<pk>` in `<N>ms`") or the wait deadline elapses (failure: "Send to `<pk>` via `<net>` not acked: timeout").

`--wait=0` preserves the historical fire-and-forget behavior for automation that doesn't care.

### Unified TUI

`cli skychat chat` (no args) now launches a unified bubbletea TUI:

- **Picker pane** — recent peers + paired contacts + joined groups
- **Conversation pane** — message history for the selected thread
- **Compose box** — Enter sends, Esc switches back to the picker

The split-pane shape matches what every terminal chat client converges on. Replaces the per-mode subcommand split (`chat`, `group chat`, etc.) with one entry point that handles both.

### PK aliases

```
skywire cli skychat alias add <pk> alice
skywire cli skychat alias add <pk> bob
```

Stored locally at `~/.skywire/skychat-aliases.json`. The TUI and the `cli skychat listen` text output substitute the alias for the hex PK in the display. Operator quality-of-life — a 66-character PK is unreadable in chat backlog.

### Persistent history

`feat(skychat/group): replay last 100 messages on visor restart` (PR #2520) — the chat-app persists the last 100 messages per group to bbolt and replays them on visor restart. A member joining a group fresh doesn't get the historical messages from before they joined (the publisher's feed predates their subscription), but they do get the last 100 messages they personally observed across restarts.

### dmsgscp

Sibling utility shipping the same day: `dmsgscp` — scp-over-dmsg file transfer. Same auth surface as dmsgpty (the existing `dmsgpty_whitelist`), no separate config. `dmsgscp <local-path> <peer-pk>:<remote-path>` and the reverse work the same as ordinary scp. Useful for moving config bundles or log slices between visors without a clearnet hop.

### What's next

D1 is the foundation. The follow-ups already in flight:

- **Federated send** (PR #2580, May 14) — every member publishes to their own per-PK feed instead of relaying through the owner. Reduces the owner to one peer among many; a wedged owner publisher stops being a single point of failure for member sends.
- **Admin roles + roster gossip** (PR stack #2583–#2585, May 14) — multiple admins per group, with promote/demote, and roster changes propagated via admin-mirror CXO feeds.
- **D2** — per-member visibility control, retroactive revocation, group keys derived from per-pair shared secrets. Open RFC; lands once the federation + roster gossip have a couple weeks of production data.

For today, every Skywire visor on v1.3.53 has working group chat with persistent history, replay on restart, and optional end-to-end encryption via the private-mode AES key. The invite-link share flow is a single command on each side. The CLI's unified TUI is one keystroke away from any visor's terminal.
