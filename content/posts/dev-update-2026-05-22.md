+++
date = "2026-05-22"
tags = ["Development", "Skywire"]
title = "Development Update — May 22"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A small, consolidating day. The `--min-hops` constraint finishes its journey through the app dial chain, ping gets a hard timeout, and a subtle CXO prefix-matching bug gets fixed.

### Skywire: Min-Hops Through the App Dial Chain

The minimum-hop-count constraint — force a dial onto the overlay rather than letting it take a direct shortcut — needs to be honored all the way from the app down to the router. Today closes the last gaps.

**`feat(skynet-client): plumb --min-hops flag through app dial chain** — the `--min-hops` flag is threaded through the skynet client's dial chain, so an app can request an N-hop path and have that request survive to the router.

**`fix(appnet): gate direct-dial shortcut on MinHops/MuxRoutes opts** — the direct-dial fast path is now gated on the `MinHops`/`MuxRoutes` options: if the caller asked for a minimum hop count or multiplexed routes, the shortcut is skipped. This is the appnet-layer counterpart to the router-side fixes — the optimization that bypassed the constraint is now constraint-aware everywhere it lives.

### Skywire: Ping

**`fix(visor/ping): cap PingOnceWithEcho at 10s + emit failure on bytes=0 exit** — `PingOnceWithEcho` gets a hard 10-second cap (no unbounded wait on an unreachable peer) and emits an explicit failure when it exits having transferred zero bytes, so a dead path reads as a failure rather than an empty success.

### Skywire: CXO

**`fix(cxo): HasPrefix dropped every match for trailing-slash prefixes** — a prefix match against a key with a trailing slash was dropping *every* match — a quietly serious bug in prefix-scoped lookups, now fixed.

### Skywire: Misc

- **`fix(visor): remove duplicate standalone CXO subscribers for tpd-metrics/uptime** — a standalone instance was registering duplicate CXO subscribers for the tpd-metrics and uptime feeds; the duplicates are removed.
- **`chore(deps): bump vis-data + vis-network in /pkg/tpviz/ui** — the transport-visualizer UI's graph libraries (`vis-data`, `vis-network`) are bumped to current majors.
