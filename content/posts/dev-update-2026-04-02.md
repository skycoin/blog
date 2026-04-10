+++
date = "2026-04-02"
tags = ["Development", "Skywire", "DMSG"]
title = "Development Update — April 2"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: DMSG gRPC Listener

A new remote-management capability: **DMSG gRPC listener for remote gotop and stats** (#2271).

**Design** — a new `DmsgGRPCPort` (49) serves gRPC over DMSG alongside the existing local CLI gRPC. The `DialDmsgRPC` function was updated to dial the new port instead of `DmsgHypervisorPort`. This enables:

- Remote `gotop` (system activity monitor) over DMSG
- Stats streaming from any visor to any other visor
- Ping and latency measurements between visors

Both visors need the update — the local visor dials the new port and the remote visor listens on it. Once deployed, operators can run `skywire cli visor ping` or stream system activity from any visor they have authorized access to, all over the encrypted DMSG overlay.

**Iterative DFS vertex aliasing fix** — the route calculator's iterative DFS (from yesterday's OOM fix) had a subtle bug where the same vertex could appear multiple times in the pending set with different keys, causing the DFS to process it more than once. Fixed by using a pending map for canonical vertices.

**VPN E2E test reliability** — DMSG retry and traceroute fixes for flaky VPN end-to-end tests.

### Skywire: UPDATE_CHANNEL Config

**New config variable** (#2273, #2274) — `UPDATE_CHANNEL` can now be set to `stable`, `develop`, `latest`, or a specific commit hash. This controls which build the Skywire updater pulls, enabling per-visor channel selection without rebuilding.

**Restart test timing fixes** — the routing rule expiry wait was increased from 10s to 15s, and `SendSkyMessage`'s HTTP timeout was reduced from 30s to 15s with 6 retries and exponential backoff (3s, 6s, 9s, ...) for faster failure cycling.

### Skywire: Dmsghttp Log Server Enhancements

The dmsghttp log server (used by the reward system to pull visor surveys and logs) gained:

- `/debug/pprof/*` endpoints behind whitelist auth (combining `survey_whitelist` + hypervisors + `dmsgpty_whitelist`)
- `/visor.log` behind whitelist auth (requires `-s` flag on the visor to enable log saving)
- A landing page at `/` with links to all available endpoints

The systemd service template was updated to use `-ps` flags (pprof + save-log) by default. Operators running visors as systemd services will automatically get these features on their next update.

### DMSG: Keyfile and scriptExec Consolidation

**`--keyfile` flag for dmsg-discovery** (#364) — systemd-friendly key management. Instead of embedding the secret key in the config file or as a command-line argument, it can now be read from a dedicated key file with proper permissions.

**scriptExec shared library** — `scriptExec*` helpers were duplicated between dmsgweb and dmsgwebsrv (~220 lines). These were moved to a shared `cmdutil.Skyenv*` library in the vendored skywire-utilities package. Fixes the Windows array bug (inverted `len` check) and PowerShell quoting issues that were previously fixed only in skywire.

**dmsghttp test hang fix** — timeouts added to result reads and client-ready waits in the dmsghttp tests.

**Conf file integration tests** — added for both `dmsgweb` and `dmsgweb srv` commands.
