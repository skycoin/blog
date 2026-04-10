+++
date = "2026-04-06"
tags = ["Development", "Skywire", "DMSG"]
title = "Development Update — April 6"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Setup-Node Goroutine Leak Fix

**Route setup-node goroutine leak** (#2280) — a serious production issue: the setup-node was accumulating 500+ leaked goroutines within minutes of restart.

**Root cause** — `MakeMap` used an **unbuffered** results channel, causing goroutines to block forever on send when the reader stopped after the first error. Combined with no dial timeout, unreachable visors caused indefinite blocking in `DialStream.readResponse`.

**The fix** — added buffered channels and explicit dial/handler timeouts so stuck dials can't accumulate. The setup-node now cleanly errors out and cleans up goroutines when it can't reach a visor.

**Config bootstrapper fallback** — `readConfig` now returns an empty Config (using all embedded defaults) when the config file doesn't exist, instead of fatally exiting. This means a fresh install without a config file just works with the embedded defaults, which is the common case for new users.

**Hypervisor UI improvements** — continued polish on the hypervisor interface, bundled into the same PR.

**Setup-node pprof flags** — replaced `--pprof` with `--pprofmode/-q` and `--pprofaddr/-r` to match visor flag conventions. Pprof is enabled with `-q http`. This unifies the pprof UX across all Skywire components.

### DMSG: Session Ping Frequency Reduction

**Session ping frequency reduced from 30s to 5m** (#371), log level lowered from Debug to Trace.

**The problem** — the ping loop measures latency to DMSG servers for server selection. It is **not** a keepalive (yamux handles that). At 30-second intervals with many clients and many servers, this was generating `N_clients × N_servers` debug log lines every 30 seconds — potentially hundreds of lines per second on busy servers, flooding log files and wasting CPU on log formatting.

**The fix** — 5-minute intervals are more than sufficient for latency estimation (latencies don't change that fast), and Trace-level logging means the messages are suppressed by default. Operators who need the detail can enable Trace logging explicitly.

Then the change was vendored into Skywire as commit `28ba3f1a` (#2281), so production visors immediately benefit from the reduced log spam.

A quiet day focused on operational hygiene — reducing log noise, fixing goroutine leaks, and making the default install path smoother. Nothing flashy, but these kinds of fixes are what separate a prototype from a production system.
