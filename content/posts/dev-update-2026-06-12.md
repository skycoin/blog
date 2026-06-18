+++
date = "2026-06-12"
tags = ["Development", "Skywire"]
title = "Development Update — June 12"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The headline is persistent pty sessions: the hypervisor web terminal can now drop, reconnect, and rebind to the *same* shell with its missed output replayed — built up across four self-contained phases so the concurrency-critical core was validated before anything touched the host's hot path. Around it, a receive-side route-setup race gets fixed by parking frames instead of dropping them; the CLI stops silently serving stale cache data when you asked for fresh; minimal visor configs finally seed the direct-service entries they need to reach TPD over dmsg; the web terminal works for sub-hypervisor visors; and `reward lookup` and `hv ls --load` give operators two new windows over dmsg.

### Skywire: Persistent Pty Sessions and Web-Terminal Auto-Reconnect

**`3093`** persistent shell sessions + web-terminal auto-reconnect. The remote shell used to die the instant its stream dropped, so a client-side reconnect could only ever get a *fresh* shell. This lands detach-and-reattach in four phases. The core (P1a) is a single pump goroutine — the only reader of the pty — that copies output into a bounded ring buffer and signals followers, who read by following a monotonic logical offset; because there is no reader handoff, a detached shell keeps running (the pump keeps draining it, since a kernel pty buffer is tiny and a shell blocks on write without a constant reader). P1b adds the host-side registry, a GC sweeper that reaps exited or idle sessions so an abandoned shell can't leak, and a gateway that on stream teardown *detaches* rather than kills — all behind an opt-in flag, default off. P2 adds reattach-by-id with an owner guard (one peer can't hijack another's shell). P3 wires it into the hypervisor web terminal and the visor config: a reconnecting browser passes back its session id, the server reattaches and replays the ring (skipping the banner and startup commands so they don't double-run), and against an older host without persistence it falls back to a fresh shell with no regression. The always-on pump also surfaced and fixed two latent pty bugs — a lock held across blocking IO that deadlocked Stop, and a Stop that couldn't kill a foreground program like `top` — both critical for the GC to reap such a session.

### Skywire: Park Setup Frames Instead of Dropping Them

**`3085`** park frames during the route-group registration window instead of dropping them. A receive-side setup race: on the responder side, the routing rules are saved *before* the route group is registered, so a handshake or ping frame for the freshly installed route could arrive in that window — its rule resolves, but no route group exists yet, so the dispatcher returned "route descriptor does not exist" and *dropped* it. Dropping the noise handshake's first frame stalls the handshake: the initiator times out at the handshake-await deadline and futilely retries through a different intermediate, which on a loaded node turns a sub-second multihop setup into a multi-second-or-timed-out one — exactly the rare, busy-node-concentrated failures seen in route-setup sweeps, confirmed by remote log capture. The fix parks such frames (keyed by descriptor, bounded and TTL'd) and re-dispatches them the moment the route group registers, with a background sweep reclaiming any whose group never appears.

### Skywire: Stop Serving Stale Data Silently

Two CLI fetch-path fixes so a caller who wants fresh data gets it — or a loud error — instead of yesterday's response.

**`3087`** don't silently serve stale data when `--cache-age 0`. The cached-fetch fallback returns a stale cache entry when the fresh RPC → DMSG → HTTP chain fails — reasonable as a last resort with caching on, but it ignored the `--cache-age 0` "fresh data, no fallback" signal, so a caller running with caching off silently received yesterday's data with no error and no log line. On a dmsg-mapped service like TPD two failures stack to produce exactly this. The fix honors a zero cache age in the last-ditch path with a loud "all fetch paths failed" error, and logs a warning when the fallback does run with caching on.

**`3088`** seed direct-service entries on minimal configs. The routine that seeds the direct-client service entries only worked when a config explicitly populated every dmsg / transport / routing field — but on a minimal config (the common case, since most of those fields are optional) they are empty and the embedded deployment defaults never get used, leaving TPD and every other direct-client service unreachable via direct dial. The visible symptom was any proxied `cli ut tpd` / `rewards bw-collect` call failing with "dmsg error 100 — entry not found in discovery," then silently falling back to a *stale* cache entry — so the bug hid behind plausible-looking old data. The fix picks the embedded `deployment.Prod` value for every empty service URL and falls back to the embedded server list when the config has none; both degrade gracefully to a no-op when nothing is available.

### Skywire: The Web Terminal for Sub-Hypervisor Visors and a Scheme Override

**`3090`** enable the web pty terminal for sub-hypervisor visors. The web terminal returned 503 for any visor reached through a connected sub-hypervisor (nested A→B→C): the proxied connection wired the operator RPC API but left the pty UI nil. The pty stream doesn't actually need to proxy through the sub-hypervisor — only the RPC actions do — so the same direct dial used for directly-connected visors works here too (the visor's dmsgpty whitelist admits the parent hypervisor). Giving the proxied connection a pty UI built the same way restores the terminal, and the scheme override below comes along for free.

**`3089`** UI terminal — scheme override, visible disconnect, surface async write errors. Three reliability fixes for the web terminal. An optional `?scheme=` override lets an operator force dmsg or skynet when a stale skynet route to a peer wedges that path — previously they had to drop to the CLI or restart the hypervisor. A session that ends now writes a clear "session closed — reload to reconnect" line instead of going blank, so a dead session is distinguishable from a hung one. And async keystroke writes now land their results on a buffered channel that each write reaps, so a broken connection is reported within a keystroke or two rather than only later on the read path.

### Skywire: Two New Operator Windows over dmsg

**`3094`** `reward lookup` — per-PK reward history over dmsg. A new `skywire cli reward lookup [pk...]` queries the reward system for one or more keys' per-day history: which days each key was rewarded, the SKY amount, the shares, whether the payout was sent, and the txid. The request rides dmsg to the reward system's dmsg address — no plain HTTP — so it works from any visor without exposing the request to clearnet, and unlike the admin `rewards -k` (which recomputes from local data) it reads the server's already-published results, so any operator can run it with no local data. Keys come from arguments or a file; it is placed under the user-facing singular `reward` command, distinct from the admin `rewards` calc.

**`3092`** add `--load` columns to `hv ls`. `skywire cli visor hv ls --load` adds LOAD, MEM%, and DISK% columns so an operator can spot an overloaded or disk-full connected visor from the CLI without gotop. The visor self-reports its own numbers from data already collected via gopsutil; LOAD renders as the 1-minute load average over the core count ("9.43/4") so saturation is obvious at a glance, and the whole field is omitempty and nil-guarded so it renders as "-" against an older hypervisor or visor instead of breaking.

### Skywire: Docs and Dependencies

**`3091`** add SkyNet, SOCKS5 proxy, and VPN apps to the published docs site, mirroring the curated pty/skychat pattern, plus an Apps overview page with a "which app do I want?" decision table and an at-a-glance reference of each app's role, CLI namespace, and default routing port.

**`3095`** dependency and docs maintenance — bump skycoin and the dependency tree, regenerate the goda graph and the command reference, document the new pty `persistent_sessions` flag, correct the SkyNet forwarding port (it moved from 47 to 57 to avoid the dmsg transport-setup port conflict), and fix a batch of stale CLI-command examples across the guides surfaced by an accuracy audit against the regenerated reference.
