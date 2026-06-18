+++
date = "2026-06-11"
tags = ["Development", "Skywire"]
title = "Development Update — June 11"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A day spent making things recover from failure instead of silently wedging on it. skysocks-client's reconnect loop finally fires on the failure that matters most — a route group torn down router-side without an EOF — and interactive pty terminals stop dying every two minutes of idle. Underneath, a sustained adversarial audit during a live deploy-churn window turned up a string of churn-exposed leaks, races, a crash, and a transport-eviction bug that was breaking routes for minutes at a time. Plus a `--cascade` config flag so operators can opt into the source-driven route setup, and a documented hook for restarting out-of-tree services after an auto-update.

### Skywire: skysocks Reconnects on a Silent Route-Group Collapse

**`3074`** make `--reconnect` fire on a silent route-group collapse + default it on. The skysocks-client reconnect loop was a no-op for the failure it most needs to handle: when the route group is torn down router-side — a remote visor restart, all legs dropped — *without* the connection delivering EOF, yamux's `IsClosed()` never flips, the keep-alive loop never closes the listener, and `ListenAndServe` blocks forever in `Accept()`, so the reconnect loop never regains control. The yamux keepalive that would otherwise probe-detect this is deliberately disabled to avoid false-closing slow multihop routes. The fix adds a definitive liveness probe — a timed yamux ping every 15 s, with two consecutive failures (10 s timeout) closing the client so the existing reconnect loop re-dials — plus capped exponential backoff and a full session teardown on close. `--reconnect` now defaults *on* for `proxy start`, since a silently-dead SOCKS listener is never what you want, and a fresh dial re-applies the sticky mux degree and min-hops so reconnect inherits the mux config automatically.

### Skywire: Interactive Pty Terminals Survive the Idle Deadline

**`3075`** keep interactive dmsgpty terminals alive past the 2-minute idle deadline. The hypervisor UI web terminal (and the CLI interactive pty) to a remote visor disconnected after every ~2 minutes of inactivity. The cause was the dmsg stream's idle read-deadline, which is refreshed only on a *successful read* — and an idle terminal produces no reads. None of the existing keepalives covered it: the websocket Ping warms only the browser↔hypervisor socket, the dmsg session ping rides a different control stream, and the exec-pool TTL is the one-shot path. SSH solves exactly this with `ServerAliveInterval`; the pty had no equivalent. The fix adds a no-op Ping RPC to the pty gateway and a 30 s keepalive goroutine on the interactive path — each round-trip's response read refreshes the stream's idle deadline, well within the window — without bumping the idle timeout itself (which is load-bearing for releasing ephemeral ports on stuck streams). Old remotes without the method degrade gracefully: the ping fails as "method not found," the keepalive stops, and the terminal behaves exactly as before.

### Skywire: Route-Group and Session Map Leaks Under Churn

**`3076`** sweep self-closed route groups from the route-group maps. A route group that closes *itself* — the keep-alive write-failure path, a self-heal or rotation-induced close — deletes its own rules from the routing table, so the garbage collector never sees them and never removes the group from the maps; and its broadcast close packets go down the dead transport and never elicit a return ack, so the other reclaim path never fires either. The map entry orphans forever. Under sustained setup/teardown/failure churn — a fleet-wide deploy where every visor's routes keep dying on restarting intermediates — every keep-alive-killed group leaks one entry, unbounded, and each orphan is re-walked by several status scans that then degrade over time. An additive sweep at the end of the rules-GC cycle drops only already-closed groups, leaving live ones untouched.

**`3077`** identity-check the peer-session cleanup delete (peer-session map corruption). The reverse-path enabler for non-public servers (#3071) introduced the one non-identity-checked delete left in the dmsg session layer: when a PK is *both* an outbound-maintained peer and an inbound `PeerAnnounce` announcer, the inbound session replaces the map slot — and the outbound goroutine unwinding later would delete that live inbound successor, breaking forwarding for that peer. The delete is now identity-checked (only if the slot still holds *this* session), matching the rest of the layer.

### Skywire: appserver Crashes and Goroutine Leaks

Two adversarial audits of the proc manager during deploy churn found a visor-crashing nil panic and three goroutine leaks.

**`3079`** prevent a visor-crash nil panic on a stale Deregister + plug a conns-map leak. `Deregister` dereferenced a proc's name with no nil check, so a duplicate or stale Deregister during deploy churn yielded a nil proc and nil-panicked, taking down the *whole visor*; it now returns a not-found error. Separately, the accept loop inserted every app conn into a map and never deleted it, leaking one dead connection reference per app restart for the visor's lifetime; the per-conn handler now deletes its entry on return, under a dedicated lock to avoid coupling with the proc lock.

**`3082`** wake readyCh waiters on teardown + unblock an orphaned AwaitConn. After a proc connects, a goroutine waits on a ready channel to start discovery — but that channel is closed only when the app reports Running, so an app that dies before reporting Running blocked the goroutine forever; the waiter now also selects on the app context's cancellation and exits cleanly (without registering a dead app in discovery). A second leak: the dead-proc cleanup deleted the proc but never closed its connection channel, leaking the await goroutine spawned at register time.

### Skywire: The Transport Glare-Collision Eviction

**`3083`** don't let a dial/accept glare collision evict a live transport. Managed-transport IDs are a deterministic hash of the two PKs and the net type, so a simultaneous mutual dial and accept to the same peer resolve to the *same* id — a glare collision — and two bugs turned that into a ~3-minute route break. The dial install checked the map before dialing, released the lock for the up-to-20 s dial, then installed with no re-check, silently overwriting a live transport an inbound accept had installed during the window; and the accept-side Serve goroutine unconditionally deleted the shared id on exit, so when the orphaned twin later died it evicted *whoever* held the deterministic id — including the live dial-side transport whose connection was fine. The fix re-checks under the final lock and discards the freshly-dialed transport if a live one is already there, and makes the accept-side delete identity-checked — the same newest-wins idiom as the dmsg session fix (#3035).

### Skywire: Two More Hangs and Races

**`3081`** don't block SetRewardAddress on survey generation. Setting the reward address persisted it and then called survey generation *synchronously* — whose inner public-IP lookup loop retries indefinitely with no exit but success, so if dmsg couldn't return the visor's IP the RPC hung forever. Survey-gen depends on the address, not the reverse, and the address is persisted before the call, so survey generation now runs in the background and its one-shot IP lookup is bounded to three attempts; the periodic survey still retries indefinitely and backstops it once dmsg recovers.

**`3078`** guard the sudph AR connection with a mutex (data race) — the address-resolver connection field was written on every AR reconnect and by the bind path, and read on shutdown, with no synchronization. Low severity — a single long-lived AR client per visor, the window an AR-conn flap near shutdown — but a real race, closed with a small mutex.

### Skywire: Opting Into Cascade Route Setup, and Restarting Out-of-Tree Services

**`3084`** add a `--cascade` flag to opt into source-driven cascade route setup. The cascade path (the route-setup node signs, the source injects the cascade down its own transports) is gated off by default — the legacy path remains the default until the cascade multihop data-plane bug is fixed and enough of the network has updated. Until now the field could only be flipped by hand-editing JSON; `config gen --cascade` makes the opt-in explicit, and regen preserves it. When cascade later becomes the default, this flag flips to the opt-out side.

**`3080`** document `RESTART_SERVICES` in the auto-update env template — a commented setting in the generated `/etc/skywire.conf` that lists systemd units the updater restarts at the *end* of an update, and only when a new binary was actually installed. It is for standalone out-of-tree units that depend on the skywire binary (e.g. a separate dmsgweb SOCKS5 proxy), which otherwise keep running a stale in-memory binary after an auto-update; the acting half lives in the auto-update package, and this makes the setting discoverable.
