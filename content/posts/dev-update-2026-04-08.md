+++
date = "2026-04-08"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — April 8, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Merge DMSG Into Skywire

A structural change that had been brewing for weeks: **the DMSG library was merged directly into the Skywire repository** (#2289).

**The problem** — DMSG and Skywire were separate repositories, and Skywire vendored DMSG as a dependency. Every DMSG fix required:

1. Commit the fix to the DMSG repo
2. Tag a new DMSG version
3. Update the vendor directory in Skywire
4. Wait for the Skywire CI to pass
5. Merge the vendor update

This "vendor ping-pong" was consuming significant development time and causing CI reliability issues — tests would fail on one side or the other due to timing mismatches between repos.

**The merge**:
- `pkg/dmsg/` contains all 14 DMSG library sub-packages and their tests
- `cmd/dmsg-commands/` contains all DMSG command binaries
- `internal/dmsg-e2e/` contains DMSG end-to-end tests
- `docker/dmsg/` contains DMSG Docker compose and images
- **76 existing Skywire files** were updated with new import paths
- `go.mod` no longer depends on `github.com/skycoin/dmsg`

All imports of `github.com/skycoin/dmsg/` were rewritten to `github.com/skycoin/skywire/pkg/dmsg/` (or the equivalent new location). The DMSG repo will continue to exist as a historical reference and for users who want to use DMSG standalone — the [guide-dmsg-deployment article](/posts/guide-dmsg-deployment/) notes that DMSG tools can still be run via `go run github.com/skycoin/dmsg@develop`.

**Import cycle fix** — the merge exposed an import cycle in dmsghttp tests: `dmsghttp test → skywire-utilities/cmdutil → dmsghttp`. Fixed by replacing `cmdutil.SignalContext` with `context.WithCancel` in the tests.

### Skywire: DMSG Goroutine Leak Fix Continued

**`idleTimeoutConn` Read override fix** (#2293) — the idle timeout fix from April 7 had a subtle bug: if `Read` saw an existing deadline set by a previous call, it would override the forced deadline set by the new timeout. Fixed to prevent `Read` from overriding forced deadlines.

**Force-close in `ForceReadDeadline`** (#2294) — the deadline-based cleanup wasn't aggressive enough in one edge case. Added a force-close path that actually closes the underlying connection when the deadline fires, ensuring the goroutine actually exits.

### Skywire: DialStream Fallback Race Fixes

**Fallback race** (#e07cb83a, #450f6697) — when a DialStream attempt failed and the fallback path was triggered, the fallback was using the same context as the original attempt. If the original context had been canceled, the fallback would immediately return with `context.Canceled` instead of trying the next server.

Two fixes:
1. Check the context before fallback — if it's already canceled, don't even try the fallback
2. Use an independent context with a per-attempt timeout for the fallback dials, so a canceled original context doesn't prevent the fallback from succeeding

**`CopyReadWriteCloser` simplification** (#993a4c01) — no longer waits for the second goroutine to finish before returning. The second goroutine is spawned, the first one runs inline, and when the first returns, both streams are closed (which interrupts the second goroutine). This halves the wait time on stream close and eliminates a subtle hang in `waitForCloseRouteGroup`.

**Per-PK reward endpoint fix** (#e5b3abba) — the per-PK reward endpoint was parsing CSV PK lists with a trailing comma, which created an empty-string PK at the end. Fixed by trimming the trailing comma before splitting.

### Skywire: CI E2E Test Reliability

Four rounds of CI E2E test reliability fixes (#2290, #2291, #2292, #2295, #2296). The DMSG merge had exposed a lot of tests that were passing by luck — fixed timing, reduced flakiness, and added retry logic where tests were intermittently failing due to peer stabilization timing.

**TestServerMesh_CrossServerDial flaky fix** (#61b262b8) — increased peer stabilization wait and added retry logic. This test exercises the server-to-server mesh added on March 30, and was failing intermittently because cross-server peer sessions hadn't stabilized by the time the test started dialing.
