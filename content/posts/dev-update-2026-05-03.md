+++
date = "2026-05-03"
tags = ["Development", "Skywire"]
title = "Development Update — May 3"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: TPD Panic Loop — Two Sources

Production TPD was restarting every 30-40s (RestartCount 556 over 6h on the prod host) because two distinct panics tear down the process. Today's PRs catch both, plus the residual nil-deref races they exposed.

**`80fef7159` Fix tpd panic loop: cxo Finc-to-negative + httputil short-write discriminator**

1. `pkg/cxo/skyobject/cache.go (*Cache).Finc:1189,1216` — panic: `"Finc to negative for: <hash>"`. The filling-refcount went below zero, likely a duplicate `Finc` on a `Filler.incs` map or an `Inc`/`Finc` mismatch across overlapping fillers. Hard process kill via panic. `Filler.apply` / `Filler.reject` already consume Finc's error return and just log; surface the inconsistency through that path instead. Clamp `fc` to 0, log the condition with key and the offending inc, and continue. Worst case is a leaked filling-item slot — orders of magnitude better than killing the service.

2. `pkg/httputil/httputil.go WriteJSON:50` — panic: `"short write: i/o deadline reached"`. `isIOError` checks `errors.Is(err, io.ErrShortWrite)`, but `net/http`'s `timeoutWriter` returns its own error value with the same message string when a write deadline expires mid-response. The earlier sweep (PR #2402) caught the explicit timeout-writer wrapping, but `WriteJSON` was building its own short-write path on `Encode` failure that bypassed the helper. Routes the path through `isIOError` consistently so the shape is logged and discarded, not panicked.

**`36cf86077` cxo/node: guard fillHead nil-deref races (closeFiller + handleDelConn)** — PR #2422 silenced the two dominant TPD panics. RestartCount went from ~556/6h to 2/10min. The remaining two panics are nil-derefs in `pkg/cxo/node/head.go` from torn-down fillHead state:

1. `createFiller` line 338: `cr.c.String()` panics when `cr.c` is nil. `handleDelConn` (line 517) sets `f.p.c = nil` when the source connection is removed. `f.p.r` remains non-zero, so the `f.p == (connRoot{})` gate at `handleFillingResult` does NOT catch the nil-c case, and `createFiller(f.p)` runs with a nil source. Fix: nil-c short-circuit at the top of `createFiller`. The fill can't proceed without a source connection — log and return.

2. `handleSuccess` line 228 (and the parallel sites in `handleRequest`, `handleRequestFailure`, `handleReceivedRoot`): `f.fc.PushBack` on a nil `*list.List`. `closeFiller` (line 384) sets `f.rqo, f.fc, f.rq = nil, nil, nil`, so any in-flight Filler goroutine messages that drain after close land on a nil list. Fix: nil-guard each `PushBack`/`PushFront` site (4 sites total).

### Skywire: CXO Cache Eviction Bug

**`f0a45db52` cxo: fix Cache.cleanDown eviction bug and skip re-encoding unchanged sub-trees`

`pkg/cxo/skyobject/cache.go` — the filter loop's "skip wanted" / "skip filling" comments said skip, but the code returned, aborting the entire ranking on the first non-evictable entry encountered during map iteration. On a busy visor there is virtually always something filling or being awaited, so the cache never evicted anything: `putItem` invoked `cleanDown` once the budget was exceeded, `cleanDown` built a `len(c.is)`-sized rank slice and immediately discarded it, and `putItem` then inserted the new item on top of an already-over-budget cache. The discarded slice is what the alloc profile pinned at 95% of total bytes allocated under `cleanDown`, and the un-evicted backlog is what pinned the live heap under `putItem`.

`continue`, not `return`. While here, switches the rank slice from `[]*rankItem` to `[]rankItem` so we don't allocate a tiny heap object per cache entry.

`pkg/cxo/treestore/publisher.go` — caches encoded sub-node hashes across publishes. The previous publish flow re-encoded every sub-tree on every cycle, even when the underlying nodes hadn't changed. CXO's hash is content-addressed — equal content always produces equal hash — so caching the previous-cycle hash and skipping the encode when the in-memory tree is unchanged is safe. Production effect on the TPD aggregator: encode cost on the per-visor publish loop dropped from O(tree size) to O(changed nodes).

### Skywire: Outlier RTT Samples

**`0a7e12b2d` transport: drop outlier RTT samples above MaxReasonableRTTMs (30s)` — production observation: three sudph transports persisted with `min/avg ~190ms` and `max ~33-35 SECONDS` in `/metrics`. The min/avg are correct; the max is a single straggler pong arriving long after its ping (delayed packet, host suspended, NIC queue stall). Once it lands, `Max` only ever grows, so a single bad sample pins the transport's Max for the life of the `lat:<id>` key (35 days).

`handleTransportPong` correlates pongs to pings only by timestamp — there's no in-flight tracking that would discard a pong arriving N seconds after timeout. Real intercontinental RTT plus heavy queueing is comfortably under 5s, so 30s is a generous upper bound for "obviously bogus."

Mirrors the existing zero-clobber lower-bound guard with an upper-bound at every layer:
- `transport.MaxReasonableRTTMs` (exported, 30,000.0).
- `SetLatency` drops `latencyMs > MaxReasonableRTTMs` (alongside `<=0`).
- `SetLatencyStats` rejects the whole snapshot if any of min/max/avg exceeds the cap.
- The TPD-side latency-aware mirror gets the same upper-bound check, so a visor on an old build that still ships the bad snapshot can't poison the discovery either. PR #2425 (May 4) extends the same cap to TPD's `UpdateLatency` write path.

### Skywire: UI Latency Display

**`96ee3806c` UI/transport latency display** (PR #2419) — the visor's `TransportSummary` carries a smoothed RTT (`LatencyMS`, populated by the transport-level ping/pong landed in PR #2401); the UI just wasn't reading it.

- `app.datatypes` `Transport` gains an optional `latencyMs` field.
- `node.service` maps `transport.latency_ms` (snake_case from the REST API) into the typed model. Both fetch sites in the service get the wire-up.
- `transport-list` adds a "Latency" column on the desktop table and a row on the small-screen card view; sortable like the other columns. Visible on `/nodes/<pk>/routing` (short list) and `/nodes/<pk>/transports/<page>` (full list).
