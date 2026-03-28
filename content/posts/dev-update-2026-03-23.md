+++
date = "2026-03-23"
tags = ["Development", "Skycoin", "Skywire"]
title = "Development Update — March 23"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skycoin: Release Documentation and Windows MSI

**RELEASE.md** — a new document was added describing all release binaries, their contents, and the build process. This makes the release pipeline auditable and helps new contributors understand what gets shipped.

**Windows MSI installer** — `skyhw.exe` and its required DLLs are now correctly included in the Windows amd64 MSI installer.

### Skywire: RWMutex Deadlock and KCP Leak

Two stability-critical bugs were found and fixed:

**RWMutex deadlock in ActiveRoutes** — the `ActiveRoutes` RPC call was taking an `RLock` on a mutex, then calling a function that attempted a full `Lock` on the same mutex. This caused the visor's RPC interface to hang permanently, making it unresponsive to all CLI commands. Discovered because `skywire cli tp` would freeze (#2243).

**KCP session goroutine leak in Address Resolver** — the SUDPH handler was creating KCP sessions for hole-punching but not cleaning them up when the transport negotiation failed or timed out. Each leaked session held a goroutine and a UDP port. Over time this exhausted resources on busy Address Resolvers (#2242).

**Route group close deadlock and goroutine leak** — a critical bug was found where the `rulesGC` goroutine would deadlock permanently, preventing all route cleanup. The `broadcastClosePackets` function called `context.Background()` while holding the route group mutex, creating a deadlock when the context was canceled. The same pattern was found in `sendHandshake`. Without this fix, a public visor was accumulating **~7,000 leaked goroutines per day** in `waitForCloseRouteGroup`, and the GC goroutine would deadlock within minutes of the first stale route (#2241).

**Windows release** — the Skywire Windows build was updated to compile from the repo root to avoid pulling in libhidapi/libusb DLL dependencies that aren't needed for Skywire (#2245).

### DMSG: Refactoring and pprof

**Code cleanup** — general refactoring across the DMSG codebase following the 32-bug fix from March 20 (#349).

**pprof flags** — `--pprofmode` and `--pprofaddr` flags were added to all long-running DMSG services (server, discovery, dmsgweb, dmsghttp, dmsgpty host). This enables runtime CPU and memory profiling on production services without rebuilding — critical for diagnosing the performance issues that were being investigated this week (#350).
