+++
date = "2026-03-26"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — March 26, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### DMSG: Server CPU Exhaustion Fix

The root cause of DMSG server performance issues was found and fixed:

**Stream concurrency limit** — a single DMSG session (e.g., from a setup node) could spawn unbounded goroutines via stream creation, starving the server's CPU. A per-session concurrency semaphore (2048 streams) now provides backpressure — streams exceeding the limit are immediately closed rather than queued (#353).

**Accept loop backoff** — non-fatal stream accept errors were causing tight CPU spin loops. A 50ms backoff delay was added on persistent errors.

**Stream read deadline** — initial stream request reads now have a deadline (HandshakeTimeout), preventing slow or malicious clients from holding goroutines and semaphore slots indefinitely. The deadline is cleared before the long-lived bidirectional copy loop.

**pprof responsiveness** — the pprof HTTP server is kept responsive even under high load so operators can diagnose issues on live servers.

This was the culmination of a week-long investigation into DMSG server performance: pprof support was added on March 23, the keypair pool and hot path optimizations landed on March 25, and today's concurrency limits and backoff address the fundamental resource exhaustion pattern.

### Skywire: Login Chain Development

Active development on the Fibercoin-based login chain for the reward system continued with rapid iteration:

**Separate subcommand** — the login chain was moved from an embedded subprocess to a standalone `skywire cli rewards loginchain` command, making it independently manageable (#2256).

**Two-node architecture** — the login chain runs two Skycoin nodes: a block publisher on ports 6001/6421 and a peer node on 6002/6422 that serves the wallet API. This follows the standard Fibercoin deployment model.

**Genesis bootstrap** — block #1 is created via `createRawTransaction` + `injectTransaction` after node startup, distributing genesis coins to enable the reward authentication workflow (#2253, #2254).

**Configuration fixes** — the chain needed `--host-whitelist` and `--disable-csrf` flags for proper API access, the reward CLI was updated to use RPC for reads and sync local files on set, and the genesis address is now correctly specified in the distribution transaction (#2251, #2252).

**DMSG vendor update** — the latest DMSG fixes (including the CPU exhaustion fix) were vendored into Skywire (#2259).
