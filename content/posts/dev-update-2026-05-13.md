+++
date = "2026-05-13"
tags = ["Development", "Skywire"]
title = "Development Update — May 13"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The day after the v1.3.53 ship: most of the work is on the chat-app's subscriber-liveness model. Four flags collapse into one, and a watchdog plus a fan-out fix shake out the remaining false negatives on `subscriber_alive`.

### Skywire: Skychat/Group — Unified Liveness Signal

PR #2537 is the cleanup: four separate liveness fields collapse into a single `lastInboundNs` (atomic int64, set on every observable inbound event). The old fields were:

- `Session.subAlive bool` — toggled on Connect / Close
- `Session.lastHeartbeatNs` — heartbeat-only signal
- `Record.LastMessageAt` — chat-only, persisted
- `Record.Status` — configuration state pulling double duty as health

They kept disagreeing. Each pair-wise disagreement got its own fix (PRs #2530–#2534 in this same arc) and the holistic answer was a single timestamp that's _computed_ from events instead of stored in multiple places.

Post-refactor:

- `IsSubscriberAlive()` is a pure function of `lastInboundNs` and a closed flag.
- `detectStaleAndReconnect` is the recovery driver — kicks reconnect on stale sessions.
- Persisted `LastMessageAt` survives only as a crash-recovery seed.

### Skywire: Skychat/Group — Owner Heartbeat Watchdog

**`2531` feat(skychat/group): owner heartbeat watchdog for fast stale-sub detection** — without a heartbeat, a member's subscriber would stay "fresh" indefinitely between chat messages on a quiet group. The owner emits a `__skychat_group_heartbeat__` marker on a 30-second cadence; subscribers observe it as a normal inbound (bumping `lastInboundNs`) but filter it out before fan-out to the user-visible inbox.

Result: a quiet group's `subscriber_alive` stays accurate (~3× heartbeat interval staleness window), without polluting the chat history with heartbeat noise.

### Skywire: Skychat/Group — Heartbeat / Delivery / Stale-Active Followups

Four small but load-bearing fixes:

- **`2530` fix(skychat): /status groups visibility + stale-active demotion + inbox MarkMessage** — `/status` was hiding groups with status=stale, and `Status=Active` survived even when liveness was clearly dead. Demote to stale on the next tick when `IsSubscriberAlive` returns false.
- **`2532` fix(skychat/group): re-assert subAlive on every delivered message** — required because the unified signal collapse was still in flight and the old subAlive flag could drift.
- **`2534` fix(skychat/group): flip subAlive on heartbeat observation too** — the heartbeat path was bypassing the alive-flip because it routed through a different fan-out branch.
- **`2538` fix(cxo/node): bounded sendMsg + fan-out broadcastRoot — closes F11b** — a CXO-layer fix that fed into this work. The publisher's broadcast path was unbounded; a slow consumer could backpressure the publisher's send loop and stall heartbeat publishing. Bounded send queues + drop-on-full semantics prevent the cascade.

### Skywire: Skywire-Autoconfig — Persistent skywire.conf Edits

**`2536` feat(skywire-autoconfig): persistent skywire.conf edits + cleanup vestigial knobs** — autoconfig used to regenerate `/etc/skywire.conf` on every run, blowing away operator-edited knobs. Now autoconfig parses the existing file, applies its computed updates, and writes back without touching unrelated fields. Also drops a handful of long-dead knobs (`USE_KADEMLIA`, `DHT_PORT`, etc.) that nothing reads anymore.

### Skywire: CLI/Config — LANDMSG Defaults

**`2535` feat(cli/config): LANDMSG defaults to ISHYPERVISOR + add LANDMSGPORT** — `LANDMSG` (the local-address DMSG port for the visor's own dmsg-server-side accept) had no default; visors that needed it had to set it explicitly. Now it defaults on when the visor is a hypervisor (the only common case where the local-address dmsg matters). The new `LANDMSGPORT` knob lets operators choose a port; defaults to a derived value.

### Skywire: Misc

- **`2562` fix(visor/cat)**: release dialCtx synchronously after dial, not via defer — the deferred release was holding the context past the function return, leaking until GC.
- **`2563` fix(cli/config)**: seed conf-service PK in dmsg entry cache before fetch — a chicken-and-egg where the dmsg cache fetch required the entry it was trying to seed.
- **`2564` perf(stats/cxo)**: batch sample writes into a single Publisher mutex acquire — same mutex contention pattern as PR #2495, applied to the stats sampler.
- **`2565` fix(cli/proxy)**: honor ctrl+c during `--verbose` startup; accept positional `<pk>`.
- **`2566` perf(cxo)**: coalesce publisher tree-walk writes into one bbolt tx. The tree-walk used to issue one bbolt transaction per leaf; coalescing into a single tx per walk drops fsync overhead substantially on busy publishers.
- **`2567` perf(transport)**: centralize per-transport tickers in Manager — instead of every transport spinning its own ticker goroutines, the manager runs one ticker for the whole set.
- **`2568`/`6e256fd4e` fix(skychat/sse)**: replay buffer + 0-subscriber drop visibility — the SSE hub was dropping messages when no subscribers were connected, with no counter visibility. Now the drops feed `/status.sse_drop_count`.
- **`2569` feat(dmsgpty-host)**: TCP-only / shared-SK / socket-activation for sshd-style daemon — standalone dmsgpty-host gains the ergonomics of a real sshd: socket-activated under systemd, can use shared identity keys, and can serve a TCP listener directly (no dmsg needed) for trusted local-network use cases.
