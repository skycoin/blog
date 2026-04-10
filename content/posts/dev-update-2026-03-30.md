+++
date = "2026-03-30"
tags = ["Development", "Skywire"]
title = "Development Update — March 30"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: LAN DMSG Auto-Discovery

Major improvements to the LAN DMSG server feature from earlier in the week:

**Port 0 support** — the OS now auto-selects an available port for the LAN DMSG server. The LAN IP is detected automatically from private network interfaces. No manual port configuration needed.

**Keypair stored in visor config** — instead of requiring a separate key file, the PK/SK fields are now in `LANDmsgServerConf` directly. Auto-generated on first use and persisted via the existing config flush mechanism.

**Auto-discovery via RPC push** — when a visor connects to the hypervisor, the hypervisor pushes the LAN server info via a new `SetLANDmsgServer` RPC method. The visor then connects to the LAN server and saves it to its config for future startups. No manual configuration on either side.

**Saved servers tried on startup** — if the visor config has `lan_servers` from a previous discovery, they're tried before falling back to public DMSG servers. This means a visor can reconnect to its LAN after a restart without needing to re-discover the hypervisor first.

Together, these changes make LAN DMSG genuinely zero-config. Enable it on the hypervisor, and every visor that connects will automatically learn about and prefer the LAN server for local communication.

### DMSG: Server-to-Server Mesh

A fundamental scaling improvement: **DMSG servers can now peer with each other** (#356). Previously, clients connected to different DMSG servers couldn't reach each other — they had to be on the same server. This imposed a hard scaling limit.

**Design** — servers peer as clients to each other using the existing session mechanism (TCP + noise XK handshake + yamux). No new transport code needed. Peers are configured via static config. When a server can't find a destination client locally, it forwards through a peer server session. Maximum 1 hop to prevent loops without needing TTL. The original `SignedObject` is forwarded as-is, preserving the client signature.

**Backward compatible** — no wire protocol changes, existing clients work unchanged.

This removes the server-stickiness that had limited DMSG deployment options. You can now run multiple DMSG servers in different regions and have clients pick whichever one gives them the lowest latency, while still being able to reach clients on any other server.

### DMSG: Bounded NonceWindow Replaces Unbounded NonceMap

**Memory leak fix in long-lived sessions** — the `NonceMap` (used for replay protection in the noise protocol) was growing forever, accumulating one entry per decrypted message. For the setup-node handling thousands of streams, this leaked megabytes of memory over time.

Replaced with `NonceWindow`: a sliding window using a 1024-bit bitmap (128 bytes) that tracks the highest nonce seen and the last 1024 nonces for out-of-order replay detection. **Memory usage is now constant regardless of session lifetime.**

Since the transport is reliable (TCP via yamux/smux), nonces arrive mostly in order, so a 1024-entry window is more than sufficient. Nonces older than the window are rejected as replays. The old `NonceMap` is kept as deprecated for backward compatibility.

### DMSG: Ping for smux Sessions

**Ping protocol for smux** — smux (unlike yamux) had no built-in ping. A lightweight stream-level ping was implemented:

- **Client** opens a temporary smux stream, writes a 2-byte zero marker `[0x00, 0x00]` (ping), reads the 2-byte echo, measures RTT, and closes the stream (5s deadline)
- **Server** reads the first 2 bytes of each new stream. If `[0x00, 0x00]`: echoes the marker back and closes (ping response). Otherwise: passes the bytes through to `readRequest` via `MultiReader`

The `[0x00, 0x00]` marker is safe because it represents a zero-length object, which cannot occur in normal session traffic (valid `SignedObject`s always have length > 0).

This enables RTT measurement for smux sessions, which is needed for latency-based server selection.

### DMSG: Server Shutdown Race Fix

A classic shutdown race: if `Close()` ran before `Serve()` called `wg.Add(1)`, the WaitGroup counter was 0, `Wait()` returned immediately, and then `Serve()` called `Add(1)` on a completed WaitGroup — a data race. Fixed by checking the `done` channel before `wg.Add(1)` so `Serve()` returns `ErrClosed` if the server is already shut down (#360).
