+++
date = "2026-04-23"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — April 23, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Skynet Direct Transport

PR #2331 introduces the most significant optimization for skynet: **direct transport forwarding bypasses route setup entirely.**

For visors that share a direct transport (STCPR or SUDPH), skynet port forwarding now uses `VStreamMux` on route ID 0 with `SkynetForwardPacket` type. No route setup node involved. No route descriptor conflicts. No ephemeral port exhaustion.

**How it works:**

1. The skynetweb dialer checks if a direct transport exists to the destination PK
2. If yes: opens a VStream directly over the transport (route ID 0)
3. If no: falls back to `DialRoutes` for multi-hop connections through the DMSG mesh

The forwarding server accepts connections from both paths — route groups (existing) and VStream mux (new) — using the same `handleServerConn` handler. The ready byte, ClientMsg handshake, and port dispatch are identical.

**The fix that unblocked this:** `saveTransportInternal` was copying all route ID 0 handlers (cascade, DHT, setupRPC, visorRPC) to new transports, but was missing `skynetFwdHandler`. New transports created via CLI or autoconnect couldn't dispatch `SkynetForwardPacket` packets, causing VStream dials to silently fail. One missing field propagation was the final blocker.

### Skywire: Skynet Debug Logging

**`1d576f739` Add debug logging to forwardRawTCP** — logs the full data flow for skynet forwarding: connection acceptance, port dispatch, bytes transferred, and connection lifecycle. Essential for diagnosing the VStream integration issues that led to the direct transport fix.

### Skywire: Skynet Port Forwarding Fix

**`296a6ca54` Fix skynet port forwarding: extract port from SOCKS5 addr, not hostname** — the SOCKS5 proxy was extracting the target port from the hostname (e.g., parsing `<pk>.skynet:8080` and trying to use "8080" from the hostname field) instead of from the SOCKS5 address field where it actually belongs. This caused all non-port-80 skynet requests to fail silently.

### Skywire: DHT Performance — Sign Once

PR #2333 addresses the biggest CPU bottleneck in the transport discovery:

**Problem:** `RedisMirror.Mirror` was signing the DHT `MutableItem` once per edge PK. For a 2-edge transport, the same bytes were signed twice per POST and per entry in backfill. secp256k1 `SignPayload` + downstream `RecoverPubkey` accounted for **55% of TPD CPU** (10.82s/19.48s in a 30-second production CPU profile).

**Fix:** `MirrorMany(subjectPKs, entry, seq)` marshals + signs once and saves the same item under each edge's target. The signed payload depends only on seq, value, and salt — the target key is SHA256(edgePK || salt), computed outside the signature.

**Expected impact:** roughly halves the DHT-mirror CPU cost on TPD, freeing 25-30% of total service CPU.

### Skywire: DMSG Discovery Positive Cache

**`d55c8f69b` (also in PR #2333)** — `GET /dmsg-discovery/entry/{pk}` did a Redis round-trip for every request. A 2048-entry, 5-second-TTL in-process cache now handles hot reads. `SetEntry`/`DelEntry` invalidate proactively so updates are immediately visible. The cache does not store misses — the 404 root cause was already fixed on the visor side.

### Skywire: DHT Skip P2P for Bootstrap Peers

**`7ecb99414`** — DHT dial attempts for bootstrap peers (DMSG servers) were trying STCPR/SUDPH first, which always fails because DMSG servers don't have direct transports. Now skips the p2p dial attempt entirely for bootstrap peers, eliminating log noise and wasted dial cycles.

Also includes:
- **Dependency bump**: `pgx/v5` from 5.9.1 to 5.9.2, fixing SQL injection via placeholder confusion (GHSA-j88v-2chj-qfwx)
- **CLI fixes**: `svc health --json` suppresses table output, `mdisc entry` requires exactly 1 arg, typo fix in survey help
