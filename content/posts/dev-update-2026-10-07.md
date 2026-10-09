+++
date = "2026-10-07"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 7, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

October seventh targeted memory leaks and performance across every transport, with CPU usage and heap growth the focus. A race in the dmsg stream census was fixed, the browser visor's WebRTC memory leak from unreleased signaling streams was patched, and a failed dmsg dial that left its stream open was fixed. Noise frame encryption now happens in-place without copies, and every packet read was optimized to drop allocations by half. Transport discovery stopped sending the 1.3 gigabyte all-transports feed that was consuming 88 percent of its outbound bandwidth. KCP was updated four times to batch scheduler updates within five milliseconds and eliminate per-packet allocations and timer resets, cutting CPU on a probe of 344 sessions from 9.5 percent down to 1.9 percent on TinyGo. Packet buffers now use a channel free list instead of sync.Pool boxing. DMsg servers now report their load and relay statistics, charted per server on the discovery status page. Every transport type but dmsg now records uptime history. The address resolver looks sudph peers up over the UDP control connection, and route finder queries now show median and p95 latencies. The visor no longer repeats address resolver calls on route setup, and two visors can now set up a one-hop route without a route setup node. Transport discovery's per-visor transport list moved to the status page itself, and an online verdict now requires only two transports of any type but dmsg instead of specifically stcpr or sudph. The flight recorder is now off by default unless explicitly configured, and status pages show process memory and traffic for every service.

### Skywire: Memory Leaks and Stream Management

**`5483`** added a weak-pointer census that tracks every dmsg stream still in memory by port and state, visible through `cli dmsg diag porter`. **`5482`** fixed a failed dmsg dial that left its stream open because the defer closed a nil named return instead of the actual stream, keeping the ephemeral port reserved. **`5484`** released WebRTC signaling stream handlers that were never freed in the browser visor; after 41 hours the :8443 tab was holding 10,000 such streams, around 100 megabytes. **`5486`** made the stream census pointer atomic to fix a race detected by CI's race detector.

### Skywire: Noise and Packet Performance

**`5487`** eliminated per-packet allocations in Noise frame encryption by decrypting straight from the read buffer and encrypting into a reused frame. Benchmark throughput on a loopback went from 17.6 microseconds, 4576 bytes and 8 allocations per frame to 9.6 microseconds, 81 bytes and 4 allocations.

**`5475`**, **`5474`**, **`5473`**, **`5471`** and **`5467`** updated kcp-go and pfilter to eliminate per-packet allocations and timer resets. kcp-go v5.6.78 batches scheduler updates within a millisecond, cutting TinyGo CPU on a probe of 344 sessions from 9.5 percent to 1.9 percent of a core. pfilter v0.0.14 uses a channel free list instead of sync.Pool boxing, dropping receiving one packet from 29 allocations to 13.

**`5477`** and **`5460`** continued the KCP optimization chain through v5.6.79 (batching updates within 5ms) and v5.6.74 (sizing each session's transmit queue to its batch). **`5459`** switched to the 0magnet fork of kcp-go, which drops per-tick allocations.

**`5453`** dropped the largest avoidable allocations in the visor and transport packages.

### Skywire: Transport Discovery Bandwidth

**`5485`** stopped sending the all-transports CXO feed and HTTP endpoint, which consumed 1.3 gigabytes per 5 minutes (88 percent of TPD's outbound bandwidth). Visors since v1.3.98 route on the routing feed, which ships only changed shards, and older visors are already rare enough that the bandwidth savings outweigh the fallback. TPD now answers `GET /all-transports` with 410 Gone.

**`5481`** added uptime history for every transport type but dmsg, fixing a gap where squicr, swtr, swsr and webrtc transports had no uptime data. **`5480`** moved the visor transport list from its own page to a scrolling table on the status page, shortening the site by one page. **`5479`** lists every visor with transports and every online visor without, grouped by transport type and marked with the dmsg server role.

**`5468`** changed the online verdict to require only two transports of any type but dmsg instead of specifically stcpr or sudph.

**`5466`** batched transport discovery's metrics reads and treats a failed read as an error rather than keeping a stale value.

**`5462`** ensured that a settled bandwidth day is never kept empty, fixing a case where a day with missing data could pay rewards incorrectly.

### Skywire: DMsg Load Reporting

**`5478`** made dmsg servers report their load: the streams they relay, both active and in total, bytes carried each way, client sessions and peer links. The dmsg-discovery status page reads every registered server's `/health` and charts bytes relayed, streams relayed and sessions per server.

**`5450`** served every dmsg session as yamux without a discovery lookup, simplifying session setup.

**`5451`** made every dmsg server read from dmsg-discovery's feed instead of fetching over HTTP.

### Skywire: Address Resolver and Route Finding

**`5457`** made the address resolver look sudph peers up over the UDP control connection instead of making separate dialed calls. **`5456`** charted lookups by source and lookups that found nothing. **`5454`** stopped repeating address resolver calls during route setup.

**`5449`** made the visor resolve peers from the address resolver's bindings feed instead of calling the service.

**`5452`** charted how many routes each query returns and every route's length. **`5470`** shows route search time with its median and p95 latencies on the route finder's status page.

**`5465`** and **`5464`** made two visors set up a one-hop route without a route setup node, and eliminated goroutines and timers per packet.

**`5455`** made transport discovery publish a per-key CXO feed so the network view can read from it.

**`5448`** recorded visor uptime from the transport-list feed.

### Skywire: Status Pages and Observability

**`5469`** added process memory and traffic stats to every service's status page. **`5472`** fixed a service stats test by leaving time between its two samples. **`5461`** fixed a chart rendering where the pie changed height as data updated, making the adjacent plot shift; it now keeps one height.

**`5458`** made the flight recorder off by default unless `flight_recorder` is explicitly configured in the visor.

**`5463`** kept a folded dmsg server's client session and peer link apart so they do not interfere with each other's accounting.
