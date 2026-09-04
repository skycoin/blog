+++
date = "2026-04-01"
tags = ["Development", "Skycoin", "Skywire"]
title = "Skywire Development Update — April 1, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skycoin: Explorer Fixes for Fibercoin Support

**Explorer blocks page fix** — the explorer's blocks page was showing "Error loading data" silently. The root cause was that `getBlocks` was being called without the `verbose=1` parameter, so transaction inputs were returned as bare UXID strings instead of objects with `owner`/`coins`/`hours` fields. The frontend's `parseGenericTransaction` would fail silently on the bare strings. Fixed by adding `verbose=1` to the API call.

**Content-Type header ordering** — a subtle bug in the explorer proxy: `Content-Type` was being set *after* `WriteHeader`, so the header was never actually sent to clients. Fixed to set `Content-Type` before `WriteHeader`.

**Security update** — `serialize-javascript` bumped from 7.0.4 to 7.0.5 (security fix).

**Fibercoin-aware default node address** — when `FIBER_TOML` is set and `SKYCOIN_ADDR` is not, the explorer now reads the fiber config's `web_interface_port` to construct the default node URL. This means running the explorer against AIX (port 8320) or any other Fibercoin just works without needing to manually specify `--node-addr`. Before this fix, the explorer always defaulted to Skycoin's port 6420.

### Skywire: Route Calculation OOM Fix

A serious scaling bug: **the recursive `DeepFirstSearch` used by the route calculator was exploring the entire reachable network graph** (11,000+ transports), causing OOM errors and near-lockup on the setup node (#2270).

**The fix** — converted the recursive DFS to iterative with an explicit stack, added a `MaxGraphDepth` limit (default 10, configurable via `--max` flag), and reduced the default `--max` hops from 1,000 to 5.

The old code was essentially trying to find every possible route through the network before picking one, which is exponential in graph size. The new code bounds the search depth and returns much faster with equally usable routes — most real-world routes are only a few hops anyway.

### Skywire: Whitelisted Key File Access in Rewards UI

**File access via whitelisted keys** (#2268) — the rewards UI now exposes clickable file links when accessed via a whitelisted public key:

- `/log-collection/tree`: file links for each visor
- `/log-collection/tree/:pk`: file listing with download links
- `/log-collection/file/:pk/:filename`: new auth-protected endpoint serving individual log/survey files
- `/skycoin-rewards/hist/:date`: raw file links

An `isWhitelisted()` helper provides non-blocking whitelist checks in public routes. This gives reward system operators direct access to per-visor logs and surveys without requiring SSH access to the reward server.

**Flaky CXO tests** — the CXO subscribe tests were flaky because they used fixed sleeps to wait for event propagation. Replaced with event-driven subscribe with retry.

### Skywire: Config Gen Flags and SKYENV Refactor

**Missing config gen flags added** (#2267) — `PROXYSERVERWL` and `VPNSERVERWL` are now wired as array-style config variables instead of hidden env var strings. Dead password config entries (`PROXYSERVERPASS`, `VPNCLIENTPASS`, etc.) were removed. `NOPROXYSERVER` was renamed to `PROXYSERVER` with correct default-true semantics, matching the `VPNSERVER` pattern.

**Skychat flags** — `SKYCHAT` and `SKYCHATADDR` config variables with `--servechat` and `--chataddr` flags.

**Advanced tuning flags** — visible with `--all`: `--hvaddr`, `--stun`, `--timeout`, `--regtimeout`, `--maxtransports`, `--muxroutes`.

**scriptExec refactor** — extracted common `scriptExecValue` and `scriptExecSlice` core functions. Fixed a Windows array bug (inverted `len` check), fixed PowerShell quoting, and made default parsing consistent via `parseDefault`. Unit tests and integration tests for config gen covering defaults, flag overrides, and SKYENV file sourcing were added.
