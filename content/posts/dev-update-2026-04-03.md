+++
date = "2026-04-03"
tags = ["Development", "Skywire", "DMSG"]
title = "Development Update — April 3"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: SKYDEPLOY Override

**New environment variable** (#2276) — `SKYDEPLOY=/path/to/config.json` overrides the embedded `services-config.json` deployment configuration. This supports:

- **Private networks** — point Skywire at a custom deployment without rebuilding
- **Corporate deployments** — run a private Skywire network with your own TPD, DMSG, Address Resolver, etc.
- **Testing** — quickly switch between test and production deployments

The embedded config is still used as the default, so nothing changes for users on the public network. But operators running private deployments no longer need to patch and rebuild Skywire to change the discovery URLs.

### Skywire: CI Workflow Restructure

**Separate `update-commit` workflow** (#2275) — the commit-update automation was moved to its own workflow triggered by `workflow_run` (fires when the Test workflow succeeds), rather than running on push to `develop`. The push-to-develop trigger was removed from `test.yml` so there are no duplicate test runs. `update-commit` fetches the latest develop SHA only after PR tests pass.

**DMSG retry improvements** — transport retries increased from 3 to 5 with a 5-second base delay. DMSG self-transport warmup retries also increased to 5. These tune the retry logic for the flaky cases that the more aggressive CI had been exposing.

**DMSG transport tests** — fixed to check the visor's DMSG state directly rather than relying on discovery lookups, which were race-prone in the test environment.

**Dependency bumps** — `lodash` from 4.17.23 to 4.18.1.

### DMSG: Deployment Config and pprof Over DMSG

**Unified deployment config** (#365) — dmsg now reads its endpoints from `ServicesJSON` (the shared `services-config.json`) using `_dmsg` suffixed field names, instead of a separate `dmsghttp-config.json`. This eliminates the ping-pong between two config files and lets both HTTP and DMSG deployments use the same source of truth.

**pprof over DMSG** (#366) — `ServeDebug()`, `DebugMux()`, and `WhitelistMiddleware()` were added to `pkg/dmsghttp/debug.go` as reusable helpers. Access is controlled by `survey_whitelist` PKs. Wired into dmsg-discovery and dmsg-server on port 81.

This is a significant operational capability: you can now profile a DMSG server remotely over DMSG itself, without needing SSH access or exposing pprof on a public HTTP port. The whitelist ensures only authorized operators can access profiling data.

**Direct client retry fix** (#368) — when the direct client (used by DMSG services without discovery) failed to connect to a server, it backed off and then retried the same list from the start, potentially re-picking the same failing server immediately. Fixed:

- `InitConfig` now skips `Prod`/`Test` unmarshal when nil (supports single-deployment `SKYDEPLOY` configs)
- `DialTimeout` (10s) added to prevent blocking on unresponsive servers
- `net.DialTimeout` used instead of `net.Dial` in client session establishment
- `serveWait` backoff moved to after **all** servers have been tried, not after each individual failure

### DMSG: smux Ping Timeout Fix and Config Tuning

**smux ping timeout fix** (#369) — the server-side ping echo wrote the 2-byte response but never closed the smux stream. Without an explicit close, smux buffered the response and the client's read timed out waiting for data that never arrived. Fixed by closing the stream after the echo to flush the write buffer.

**Defensive nil check** in `Stream.Close()`.

**Yamux and smux config tuning** — yamux: `AcceptBacklog` increased to 512, `StreamOpenTimeout` reduced to 20s, `StreamCloseTimeout` reduced to 30s, stderr logging suppressed via `io.Discard`. Smux: upgraded to protocol v2 (adds flow control), `MaxReceiveBuffer` reduced to 1MB per session (from 4MB).

The smux v2 upgrade is significant — flow control means senders can't overwhelm slow receivers, which was an observed problem in production where a slow client could cause backpressure all the way through the DMSG server.
