+++
date = "2026-05-07"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — May 7, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: DMSG Self-Deadlock Fixes Under dmsgfirst Path

The dmsgfirst client introduced yesterday (PR #2433) surfaced a class of self-deadlocks in dmsg-discovery code paths. When a visor's dmsg disc client runs over dmsg (instead of HTTP), and that client tries to fetch its own entry — or fetch an entry it needs to complete its own connect — the recursive call pattern can deadlock on the dmsg session lock.

Four PRs land on the same day to plug them all:

**`2443` fix(dmsg): self-deadlock in `updateClientEntry` under dmsgfirst path** — `updateClientEntry` was being called from within the dmsg client's reconnect loop, which holds the session lock. When that update fetched the existing entry through dmsgfirst, the fetch's own connect attempt waited on the same lock. Now `updateClientEntry` releases the lock for the duration of the discovery call.

**`2448` fix(dmsg): self-deadlock in `updateServerEntry` under dmsgfirst path** — server-side mirror of the same bug. Same fix shape.

**`2449` fix(dmsg): self-deadlock in `EnsureAndObtainSession` across dmsgfirst path** — `EnsureAndObtainSession` could re-enter itself when the obtainSession path triggered a discovery lookup that re-entered the session manager. Broken with an explicit "already obtaining" guard.

**`2451` fix(dmsg): break `getServerEntry` recursion under dmsgfirst path** — the deepest one. `getServerEntry` was the actual recursive path: server entry fetch → dmsgfirst client → dmsg connect → needs server entry. Broken by short-circuiting to the HTTP fallback when we detect we're inside an obtain-session call frame.

The combined effect is that dmsgfirst is now safe to use as the default discovery shape. The earlier PR #2441 (upgrade to dmsgfirst after dmsgC ready) becomes the steady-state.

### Skywire: WAN-Reachable Embedded Dmsg + Discovery Proxy + Terminal Persistence

**`2450` feat(visor/hypervisor+hvui): WAN-reachable embedded dmsg, discovery proxy, terminal persistence** — three threads, all operator-facing:

**WAN-reachable embedded dmsg** — the hypervisor-embedded dmsg client (which lets a visor act as its own dmsg server peer for hypervisor-to-visor traffic) is now bindable to a WAN address. Operators running a hypervisor on a public host can let other peers reach it directly without going through a third-party dmsg server.

**Discovery proxy** — the hypervisor proxies discovery queries on behalf of the visors it manages. A visor behind a firewall that can reach the hypervisor (via dmsg, typically) can look up other visors through the hypervisor's discovery view. Closes a corner case where a visor with a healthy dmsg session but a broken HTTP discovery path was effectively blind to the rest of the network.

**Terminal persistence** — the hypervisor's embedded terminal (the `dmsgpty` web tab) now persists its scrollback and command history across page reloads. The PTY session is kept alive server-side; the browser reattaches on reload. Matches the OS terminal-emulator behavior operators expect.

### Skywire: Visor — Re-Register When Transport Count Drains

**`2453` fix(visor/public): re-register in service discovery once transport count drains below max** — a public visor (one in the SD's `public_visors` set) gets unregistered when its transport count hits the configured max — to throttle connection load. Pre-fix, the visor never re-registered when transports drained back below the threshold, so a brief saturation knocked it out of public visibility for the rest of its lifetime.

Now the registration loop re-asserts presence whenever the count drops back under the threshold. Symmetric with the unregister path.

### Skywire: TPD — Mirror Register/Deregister via CXO Publisher

**`2452` feat(tpd): mirror transport register/deregister via CXO publisher** — TPD has been a CXO subscriber for transport heartbeats since the uptime refactor. This PR adds a publisher: every register/deregister event TPD processes is mirrored into a CXO feed. Subscribers (the new visor self-subscribers in tomorrow's PR #2462) get live updates without polling HTTP `/transports`.

### Skywire: dmsg — Reject Cached Server Entries in getClientEntryCached

**`2454` fix(dmsg): reject cached server entries in `getClientEntryCached`** — the cache was keyed only by PK, so a server-entry lookup that happened to have the same PK as a previously-cached client entry would return the wrong type. Reproducible whenever a dmsg-server's PK was queried as both server and client (the survey path queries both forms).

The fix tags the cache value with the entry type and returns a miss on type mismatch.

### Skywire: CLI/Verbose + HVUI Parity

**`2447` fix(cli/verbose) + feat(hvui): log format parity, render cached fields on offline visors** — `cli visor info --verbose` emitted a richer log shape than the hypervisor's per-visor inspector. The mismatch made it hard for operators to copy-paste between the two views. Both are now the same shape, including the cached-field rendering for offline visors (so an offline visor still shows its last-known transports, IP, version, etc., grayed in the UI and marked stale in the CLI).

### Skywire: Misc

- **`2446` fix(cxo): skip blank refs in `DelRoot` walk so cleanup actually decrements shared subtrees** — a blank reference (zero hash) in a feed's tree was aborting the cleanup walk. Subtrees shared with the deleted root were leaking refcount. Walk now skips blank refs and continues.
- **`2445` fix(visor/stats): nest daily transport rollup under `<date>/rollup`** — the daily rollup was being written to `<date>` directly, colliding with per-minute samples on the same key. Now `<date>/samples/...` and `<date>/rollup` cohabit cleanly.
