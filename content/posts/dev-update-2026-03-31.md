+++
date = "2026-03-31"
tags = ["Development", "Skywire"]
title = "Development Update — March 31"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Xpub Address Reuse Fix

**Subtle bug in the reward system's BIP44 address handling** (#2266): `resolveRewardAddress` was deriving addresses from the visor's xpub key by day count, but on days where reward distribution was delayed (no `{date}.txt` transaction marker), the next successful distribution would reuse the same derived address from the previous period.

**The fix** — `resolveRewardAddress` now offsets the BIP44 derivation index by the number of consecutive undistributed days. If rewards are delayed by 3 days, the address for the next distribution is derived 3 indices ahead of where it would have been, preventing reuse.

**Shares CSV changes** — a new `XPub` column (last column) stores the original xpub key for internal reference. The derived address replaces the xpub in the Skycoin Address column. The hist page UI never displays the XPub column, so this is purely internal bookkeeping. No extra files are created — the xpub data lives alongside existing per-visor data.

This matters for privacy: address reuse breaks the fungibility assumption of HD wallets. Each reward should go to a fresh address derived from the recipient's xpub, regardless of when the distribution actually happens.

### DMSG: DialStream Optimizations

A major performance pass on `DialStream` (#361):

**Route cache** — remember which server successfully reached a destination, try it first on subsequent dials, evict on failure. This turns a previously O(N) server iteration (for N configured servers) into an O(1) cache hit in the common case.

**Latency-sorted sessions** — sessions are now sorted by measured ping latency, so the lowest-latency server is tried first instead of random map iteration order. A background ping loop measures all session RTTs every 30 seconds to keep the sort current.

**Entry caching** — discovery entry lookups are cached with a 30-second TTL to avoid re-querying HTTP discovery on every request. Combined with the route cache, this dramatically reduces the per-dial overhead.

**dmsgweb proxy context propagation** — `http.NewRequestWithContext` now propagates the browser's request context to the dmsg dial, so cancellations stop the stream dial immediately instead of waiting for the full 20-second `HandshakeTimeout`. Also removed an impossible `c.String(500)` after `c.Status()` was already written, which was causing "Headers were already written" warnings in gin.

### DMSG: Shutdown Hang Fix

**Client.Close() was hanging forever** (#362). It called `delEntry(context.Background())` which made HTTP requests to the discovery server with no timeout. When discovery was accessed over dmsg (the transport being closed), the `Entry()` lookup fell back to HTTP-over-dmsg which hung forever since the dmsg client was already shut down.

**The fix** — a 5-second timeout context so `Close()` always completes. Also added a hidden `--with-kill` flag as a force-exit safety net for commands that refuse to shut down cleanly.

This was a meaningful user-facing bug — Ctrl+C would appear to do nothing when the underlying transport was unreachable, leaving users to wonder if the process was hung or just slow.
