+++
date = "2026-06-06"
tags = ["Development", "Skywire"]
title = "Development Update — June 6"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A day spent unsticking the things that quietly leak, wedge, or fall back to plain HTTP. The headline is a dmsg-only fix for the blank hypervisor network tab — a casualty of the new default config — alongside a setup-node connection pool that stopped handing out dead connections and a CXO goroutine leak that was dragging whole hosts down. Around them: the rewards calc sourcing uptime from the transport-gated tracker, and the `got` CLI learning to actually use its SOCKS5 proxy.

### Skywire: Fix the Blank Hypervisor Network Tab on dmsg-Only Visors

**`3034` fix(visor): fetch service data over dmsg-http first (fixes blank hypervisor network tab)** repairs a casualty of the new dmsg-only default config. The hypervisor network view aggregates service-discovery and uptime-tracker data via `FetchServiceData`, which was HTTP-only — it read the plain-HTTP service URL and did an `http.Client.Get`. On a dmsg-only visor those HTTP fields are empty, so the fetch returned "service sd not configured" and the network tab rendered blank. Service data is now fetched dmsg-HTTP first whenever a `*_dmsg` URL is configured, with plain HTTP used only as the dual-config fallback or the sole http-only path; the fetch order is encoded and unit-tested, covering SD, UT, TPD, AR and RF.

### Skywire: Stop the Setup-Node Pool From Handing Out Dead Connections

**`3032` fix(router): stop the setup-node pool from handing out dead connections** chases down circuit breakers that were wedging *open* against perfectly reachable visors, blocking all multihop setup to them — the skysocks proxy server among them. Live RSN `/stats` showed thousands of id-reservation failures with "connection is shut down" against demonstrably reachable keys, and a pprof dump showed dozens of RPC client goroutines parked on dead dmsg streams.

The root cause was a timeout mismatch in the connection pool. After each call the stream read deadline is armed at 2 minutes so the RPC input goroutine eventually unblocks and frees its ephemeral port — but the pool's TTL was 5 minutes, so between the 2-minute and 5-minute marks a pooled connection was already shut down yet still poolable. `Get` returned it unprobed, the next reservation failed with `ErrShutdown`, and three such failures tripped the destination breaker for 5–30 minutes. `Get` now reuses a pooled connection only while it has idled below the read-deadline horizon and dials fresh past it, with the pool TTL pinned to that horizon so eviction can never outlive liveness.

### Skywire: Unblock a Stuck Transport Read on Close

**`3033` fix(cxo/node): unblock stuck transport read on Close to stop goroutine leak** addresses a transport-discovery CXO node that leaked goroutines without bound — observed live at ~3000 stable, spiking to 37k under reconnection load, driving the process to ~2 GB RSS and ~300% CPU and starving its co-located route-finder and address-resolver. The read loop parks in `io.ReadFull` on the dmsg stream; when a remote peer vanishes without a FIN/RST, that read never errors, and `Close()` alone does not reliably interrupt an in-flight read — only a read deadline does. So the idle watchdog's `Close()` never reached the stuck reader, and the whole connection leaked. `Close` now arms a past read deadline before closing, forcing any parked read to return so the loop exits and the connection tears down cleanly. A regression test drives `Close()` against a conn whose read blocks and whose `Close()` does not interrupt it — the production failure mode.

### Skywire: Rewards Source Uptime From the Transport-Gated Tracker

**`3031` feat(rewards): source uptime from TPD-integrated tracker; drop manual tp gate** removes a redundant, race-prone bookkeeping file from the reward calc. "Eligible visor" used to be the conjunction of two snapshots: heartbeats from the standalone uptime tracker, and a separate hourly `tp-collect` job recording which keys held ≥2 transports. The TPD-integrated uptime endpoint already publishes exactly that conjunction — it only credits heartbeats while a visor holds ≥2 transports — so the second file was duplicate work vulnerable to races between the two snapshots. The calc now hits the transport-discovery's `/uptimes?v=v2`, drops the transports file, and flips `--require-tp` to default false; `tp-collect` survives as a diagnostic but is no longer load-bearing.

### Skywire: The `got` CLI Actually Uses Its Proxy

Two fixes so `skywire-cli got` can talk through the resolving SOCKS5 proxy. **`3029` feat(cli/got): accept socks5:// and socks5h:// proxy URL schemes** makes the `-x` flag take curl-style scheme prefixes: `socks5h://` resolves the destination at the proxy (required for `dmsg web`'s synthetic `<pk>.dmsg` hostnames, which a local resolver can't look up), `socks5://` resolves locally then sends the IP, and a bare `host:port` is treated as `socks5h://` for backward compatibility. **`3030` fix(got): propagate Got.Client and Got.ctx into hand-built Download** then closes the gap that left the proxy silently bypassed anyway: a hand-built `*Download` with a nil client fell through to the default client, discarding the SOCKS5 dialer that `NewWithProxy` had configured. The receiver's client and context are now injected before init.

And a CLI cache fix: **`3028` fix(cli/ut): write JSON cache file when --cdu/--cdt is set** restores the documented `<dir>/uptimes.json` file that the bbolt cache refactor stopped writing — the embedded `reward.sh` jq-slices that file, and with it missing the per-day uptime data came out empty and the version-history chart froze on the last good day.
