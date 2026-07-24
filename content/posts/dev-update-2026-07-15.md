+++
date = "2026-07-15"
tags = ["Development", "Skywire"]
title = "Development Update — July 15"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A quiet, sharp-edged day: a pair of concurrency races that had been hiding inside the skynet server and the cxo Filler got pulled out of a larger exchange-engine branch and fixed on their own, so the reliability work wouldn't have to wait on the bigger review. Both bugs were the same shape — a goroutine registering work on a `WaitGroup` at the exact moment another goroutine was tearing the whole thing down — and both are the kind of race that stays invisible until a CI runner or a production visor happens to interleave the two just so.

### Skywire: Add-after-Wait Races and CI Hardening

**`3494`** fix(concurrency): Add-after-Wait races in skynet.Server + cxo Filler (+ CI test hardening) extracts the general reliability fixes from the exchange PR (#3434) so they can land and be reviewed independently of that larger design discussion. Two races, one shape. In `pkg/skynet/server.go`, `Serve()` calls `activeConn.Add(1)` for each freshly `Accept`ed connection — but that Add could run concurrently with `Close()`'s `close(closeCh)` and `activeConn.Wait()`, which is an Add-after-Wait on the `WaitGroup`: a data race, a potential panic, and a connection that escapes graceful shutdown entirely. The fix registers each connection under `mu`, gated on a `closed` flag that `Close` sets together with `close(closeCh)` and `listener.Close()` under that same lock — so `Serve` provably stops registering before `Wait` runs, while `Wait` itself moves outside the lock so handlers can `RLock` as they serve. The cxo Filler had the identical bug: `Filler.Go()`'s `await.Add(1)` could escape `Close()`'s `close(closeq)` and `await.Wait()`, letting a `Split` goroutine touch the filler after `Close` had already returned — a use-after-teardown. That Add is now serialized under `f.mx` against the `closeq` close, releasing the acquired limit slot and bailing if the filler is already closing. Both packages pass `go test -race`, and a new `server_overlap_test.go` deliberately exercises the Serve/Close overlap. Riding along is a bit of CI hygiene: `pkg/skyudpbridge` and the `ws_native` transport had 2–3 second read/shutdown deadlines that were too tight for slow CI runners and flaked intermittently; those are bumped to 10 seconds, with no production change.
