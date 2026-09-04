+++
date = "2026-05-16"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — May 16, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A heavy reliability day. The skychat-group work keeps closing the gap between "a message was sent" and "a message was delivered" — a fresh wave of per-layer drop counters and per-peer last-inbound surfaces make the receive path observable, while signed roster/admin gossip and history-replay-beyond-the-ring harden it. Underneath, the CXO node and treestore get a cluster of restart- and rejoin-robustness fixes, the hypervisor gains a nested-visor *tree* view (backend + UI), and dmsgpty starts a two-phase dialer refactor.

### Skywire: Skychat/Group — Make the Receive Path Observable

The recurring lesson of the group-chat work is that silent drops are the enemy: a message that vanishes with no counter, no log, and no diagnostic is impossible to chase. Today's PRs instrument every layer a message passes through and surface per-peer liveness so an operator can see exactly where a message died.

**`2664` feat(skychat/group): per-layer drop counters in GroupInfo** — every stage that can drop a message (subscriber, stream, deliver) now keeps a counter exposed through `GroupInfo`. The previous "it didn't arrive" became "it was dropped at the stream layer, 3 times."

**`2663` / `2665` / `2666` / `2669` — render the counters** — the CLI side of the same surface: `sub_drop_count`, `deliver_count` + per-peer UPDATES, and `stream_send_count` all render on `cli skychat group info`. `2665` closes the diagnostic surface so a send can be traced end-to-end from publisher intent to per-peer delivery.

**`2628` / `2629` feat: per-peer last-inbound in GroupInfo + table** — each peer's most recent inbound timestamp is tracked and rendered as a `peer_last_inbound` table, so a wedged peer shows up as a stale row rather than an invisible gap.

**`2662` feat: surface gRPC subscriber drop count in /status** — the standalone-instance `/status` endpoint exposes the gRPC subscriber drop count, so the HTTP-facing health view matches the CLI's.

On the correctness side:

**`2630` fix: replay backlog on streaming reconnect** — when a streaming subscriber reconnects, the backlog accumulated during the gap is replayed instead of silently skipped, so a brief disconnect no longer punches a hole in the message history.

**`2627` fix: per-(group, peer) reconnect backoff** + **`2632` fix: clear per-peer reconnect state on roster eviction** — reconnect backoff is now keyed per group *and* per peer (a flapping peer in one group no longer starves reconnects in another), and evicting a peer from the roster clears its reconnect state so a later rejoin starts clean.

**`2658` feat: mutation types + signing for roster/admin gossip** + **`2636` docs: RFC for cross-visor admin/roster gossip** — roster and admin changes become explicit, signed mutation types gossiped between visors, with the design captured in an RFC. Signing closes the door on a peer forging roster/admin state.

**`2659` feat: history-replay beyond the inbox ring (Path A)** — history replay is no longer bounded by the in-memory inbox ring; a joining/reconnecting member can pull history that has already aged out of the ring.

Plus the supporting cast: `2670` (tests for the new `stream_send_count`), `2631` (pin the strict→snapshot contract + replay debug log), and `2655` (document the persistent-wrapper requirement for `cli skychat group listen`).

### Skywire: CXO Node + Treestore — Restart and Rejoin Robustness

A cluster of fixes harden the CXO layer that group chat (and every other feed consumer) rides on.

**`2657` fix(cxo/node): Conn idle watchdog — close half-dead conns within ~2min** — a connection whose peer has silently gone away (no FIN, no RST) used to linger until something else tripped. An idle watchdog now closes a half-dead `Conn` within ~2 minutes, freeing its route groups and letting a rejoin proceed.

**`2643` fix(cxo/dmsg): ConnectPK evicts dead cached Conn before re-dial** + **`2652` fix(cxo): thread context.Context through Subscriber.Connect → dmsg ConnectPK** — `ConnectPK` no longer hands back a dead cached `Conn`; it evicts and re-dials. Threading a real `context.Context` all the way to the dmsg dial means the connect attempt is cancellable and bounded instead of hanging on a wedged peer.

**`2651` fix(cxo/treestore): hydrate Publisher in-memory tree from container on restart** — on restart a publisher rebuilds its in-memory tree from the persisted container instead of starting empty, so a restarted owner doesn't lose its view of what it has already published.

**`2647` fix: handleSub always pushes current Root on duplicate Subscribe** + **`2648` fix: handleRootFilled filters by feedPK** + **`2649` feat: subscriber consumes OnFillingBreaks** — a duplicate `Subscribe` now re-pushes the current Root (so a re-subscribe isn't a no-op that strands the subscriber), root-filled handling is scoped to the correct feed, and the subscriber consumes fill-break signals for visibility into stalled fills.

### Skywire: Hypervisor — Nested-Visor Tree

The hypervisor's flat node list grows a *tree*: visors reachable only through another visor (nested behind a hypervisor-of-hypervisors) render as child rows under their parent.

**`2633` feat(hv): nested-visor tree API + cli hv tree command (backend half)** — the backend that assembles the nested structure plus a `cli hv tree` command to render it.

**`2641` feat(hvui): node service getNodesTree() + NodeSection type** + **`2642` feat(hvui): node-list consumes tree sections + header shows local hypervisor PK** — the Angular side: a `getNodesTree()` service call and a `NodeSection` model, the node-list page consuming tree sections, and the header showing the local hypervisor's own PK so an operator always knows which hypervisor they're looking at.

**`2635` chore(hv-tree): filter "method not found" the same as not-a-hypervisor** — an older visor that doesn't implement the tree RPC returns "method not found"; treat it the same as a plain (non-hypervisor) node rather than surfacing an error.

### Skywire: dmsgpty — Dialer Refactor (Phases 1–2)

**`2671` refactor(dmsgpty): introduce StreamDialer for outbound proxy dial (phase 1)** + **`2672` refactor(dmsgpty): MultiDialer + visor init via NewHostWithDialer (phase 2)** — dmsgpty's outbound dialing is factored behind a `StreamDialer` interface, then a `MultiDialer` lets the visor initialize a pty host that can reach a peer over more than one path. Scaffolding for pty-over-multiple-transports.

### Skywire: Misc

- **`2634` fix(visor): bound --dmsg-server startup + support pk@host:port form** — the embedded `--dmsg-server` startup is bounded (no indefinite hang) and accepts the `pk@host:port` address form.
- **`2650` fix(help): strip orphan ANSI escapes from --help output** — stray color escapes that leaked into `--help` text are stripped.
- **`2644` / `2645` / `2653` docs(readme)** — README tightening: split the DMSG/Skynet bullets, drop the stale "planned" mux note, dedupe sections, and sharpen the Skynet bullet to its routing properties.
