+++
date = "2026-03-24"
tags = ["Development", "Skycoin", "Skywire"]
title = "Skywire Development Update — March 24, 2026"
+++

### Skycoin: pprof for Explorer and Web Wallet

**Profiling support** — `--pprofmode` and `--pprofaddr` flags were added to both the blockchain explorer and `skycoin web`. Combined with the DMSG pprof flags added yesterday, every long-running Skycoin and DMSG service can now be profiled at runtime. This reflects an ongoing effort to diagnose and eliminate performance bottlenecks across the stack.

### Skywire: Dependency Updates and gotop Fix

**Dependency updates** — Go module dependencies were updated across the board.

**gotop compatibility** — the `distatus/battery` library was pinned to v0.10.0 to maintain compatibility with the embedded `gotop` system monitor. Newer versions of the battery library broke the gotop build.

**GitHub Actions** — updated to Node.js 24-compatible action versions.
