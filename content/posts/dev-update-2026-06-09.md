+++
date = "2026-06-09"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — June 9, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A day of sharpening the tools you measure and operate the network with. The route-finder learns to hand back per-hop latency so a client can rank routes without re-probing them; the `proxy mux-info` view gains a live throughput-and-share readout so you can see what a multiplexed session is actually delivering right now; and the CLI takes another step off the plain-HTTP edge of the deployment services. Underneath that, two leaks and a race get root-caused — a CXO publisher heap leak that was OOM-looping the transport-discovery in hours, and a router data race that turned out to be the real cause of the linux CI failures.

### Skywire: The Route-Finder Returns Per-Hop Latency

**`3046`** expose per-hop measured latency in route responses — the finder had been computing per-edge latency since it started sorting routes by it (#3041), but it discarded the numbers before returning, so a client got bare hops and had to re-probe every candidate to rank them. The fix surfaces the measurement: an `omitempty` Latency field on `routing.Hop`, populated at the single construction point so every finder path — `GetRoute`, the weighted variant, the `/routes` API, the CLI `calc` — gets it for free, plus a `Route.TotalLatency()` helper. This is the cheap seed-ranking foundation: a client can now rank candidate servers by predicted route latency from one `FindRoutes` call, reserving the expensive measurement (`mux-bw`) for the top few. It is backward-compatible both ways — old clients ignore the extra field, and an old finder simply omits it.

### Skywire: A Live Throughput View for Multiplexed Proxies

**`3049`** live throughput + share + health + aggregate in `proxy mux-info` — `mux-info` already drew a live per-leg tree, but its byte counters were cumulative, which doesn't answer "what am I getting right now." The view is finished out with the numbers that do: per-leg recv/s and sent/s derived from the byte delta between `--watch` polls, each leg's share of the route group's total receive rate (so one leg sitting at ~100% surfaces the self-healing story — the others have degraded or dropped), per-leg active/idle health, and a per-group aggregate line that is the one number for "how much am I actually getting." A counter-reset guard clamps negative deltas to zero when a route group is recreated, and the `--json` contract is unchanged — only the human-readable view gains the live columns.

### Skywire: Two More Transport Columns in the CLI

**`3044`** show transport latency in `tp` bandwidth mode (`-b`) — `PrintTransports` had a latency column, but the bandwidth path taken whenever `-b`/`--bandwidth` is set never did, so `cli tp -b` silently dropped latency even though the data was already in hand. The column is mirrored into the bandwidth path — headers, struct, active rows, and a "-" placeholder for inactive ones — so `cli tp -b` now shows latency alongside the byte counters.

### Skywire: Off the Plain-HTTP Edge

**`3048`** CXO/DMSG-first fetch — drop the HTTP fallback for dmsg-covered services. Three related changes continue moving the CLI off the (being-deprecated) plain-HTTP edge of the deployment services. The `sd-services` CXO case now lazily acquires its tab like the metrics/uptime/transports cases already did, so commands like `cli tp -m` and `proxy list` trigger the on-demand sync instead of silently falling back to HTTP forever on a visor with no other warm consumer. `cli visor ip` drops its two HTTP fetches entirely — it already runs a STUN NAT check, and STUN's mapped address *is* the public IP, so one STUN round yields both IP and NAT type. And the HTTP fallback is now gated to services with no dmsg equivalent: the dmsg-mapped services (sd/tpd/ar/rf/ut/dmsgd) ride CXO and dmsg, and a dmsg-mapped service that fails both now errors rather than silently dropping to clearnet.

### Skywire: The CXO Publisher Heap Leak

**`3047`** publisher heap leak — phantom cache entries serving objects larger than a megabyte to subscribers. The transport-discovery's CXO publishers were leaking ~80 MB/min whenever a subscriber was attached, OOM-crash-looping the container in hours; a single connected subscriber reproduced it. The root cause was a cache-insertion ordering bug: serving a subscriber an object whose root had been superseded loaded the value and tried to cache it, but `Cache.Want` inserted the item into the cache map *before* calling the routine that declines to cache anything larger than the 1 MiB item limit — and the snapshot leaves are larger than that. The declined call left a phantom, value-empty "filling" entry behind, which `CachedKeys()` reported forever (so the reclaim path, which skips every cached key to avoid a deadlock, never freed the underlying object) yet which could never be filled or evicted. The fix only publishes the item into the cache when it was actually cached, so the GC reclaims the object normally — verified by a new test taking the leak from 84 MB down to 2.1 MB.

### Skywire: The Router Data Race Behind the CI Failures

**`3045`** data race on `idReserver.rcM` between the `ReserveIDs` read and the redial write — #3042's redial path wrote the per-PK client map under a lock, but the per-hop goroutine in `ReserveIDs` read from the same map without it, and concurrent access to a shared map races even on different keys. This was the real cause of the linux CI failures on branches off develop — not the branch changes themselves. Taking the lock around the read synchronizes it with the redial write; verified with `go test -race -count=5` and the full router suite under `-race`.

### Skywire: Pty Interactive Feel and Pooled Exec Sessions

**`3050`** web-terminal flush-on-write + pooled Exec sessions. A cluster of pty performance fixes. The hypervisor UI terminal flushed PTY output on a fixed 16 ms ticker, so every keystroke's echo waited out up to a full tick before reaching the browser; it now wakes the flusher on the first write after idle so interactive echo flushes immediately, while still coalescing bulk output. Establishing a dmsgpty Exec session cost ~10–15 s of dial-plus-handshake and was paid fresh on every `cli pty exec` — but the remote Exec gateway is stateless, so one session can serve unlimited sequential execs; `Host.ExecRemoteVia` now pools a session per peer, and a *failed* Exec (distinct from a non-zero command exit) retires the session so a dead pooled conn is never silently reused — the trap that previously bit the RSN pool. Two further UI-terminal fixes round it out: a real websocket PING every 10 s so a half-open connection is detected rather than surfacing later as an unexplained error, and input pipelining so fast typing and paste no longer queue behind a per-keystroke round-trip.

### Skywire: Misc

- **`3051`** skip a CXO treestore test that began hanging CI — the test added to reproduce the TPD subscriber leak (#3047) now wedges the whole suite to the CI timeout after an upstream CXO change; the cache-leak fix it validated is merged and intact, so it is skipped to unblock CI until the sync/close hang is root-caused.
