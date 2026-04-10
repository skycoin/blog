+++
date = "2026-04-04"
tags = ["Development", "Skywire", "DMSG"]
title = "Development Update — April 4"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Regional Saturation Scaling for Rewards

A significant economic change to the reward system: **regional saturation scaling** (#2278).

**The problem** — the presence pool distributes rewards equally across all uptime-eligible visors. If a single country has 1,000 visors, it receives 1,000 shares. This creates an incentive to flood a single region with cheap VPS instances to maximize reward extraction, which distorts the geographic distribution of the network.

**The fix** — apply diminishing returns to the presence pool based on unique IP addresses per country. Countries with more unique IPs still receive a larger total allocation, but each additional IP contributes less. Default is square-root scaling (configurable via `--sat-exp` flag). A country with 100 IPs gets `sqrt(100) = 10` units of weight per IP instead of 1 per IP; a country with 4 IPs gets `sqrt(4) = 2` units per IP — so the 100-IP country gets 5× the weight of the 4-IP country, not 25×.

**Performance refactor** — reward calculation now uses native Go JSON parsing instead of shelling out to `jq` for each survey, map-based frequency counting, and shared pool calculation logic extracted into reusable functions. The reward calc script used to take minutes for a full run; now it completes in seconds.

### Skywire: DMSG Vendor Update

**Unified services config** (#2277) — dmsg is now vendored at commit `63477a8`, which reads DMSG endpoints from `ServicesJSON` (the unified `services-config.json`) using `_dmsg` suffixed fields. As a result:

- `deployment/dmsghttp-config.json` was removed along with its embed directive
- The `conf dmsgconf` command now prints `ServicesJSON`
- The rewards calc uses `ServicesJSON`
- Config gen fallback uses `ServicesJSON`

**Redesigned service DMSG bootstrap** — the new bootstrap flow is: embedded config first → DMSG refresh → HTTP fallback. This gives fast startup (no HTTP calls on common path) while still allowing fresh configs to propagate.

### Skywire: Autoconfig Fixes

A cluster of related fixes for the autoconfig script used by the Arch/Debian packages:

- **Use SKYENV for all config defaults** — don't hardcode `-p -b` flags that override the user's config file
- **Set `SKYENV=/etc/skywire.conf`** for config gen if the file exists, so package-managed deployments use the right config path
- **Add `-r` to test config** — needed for deterministic test output
- **Suppress debug output** in the autoconfig path so users don't see internal log noise
- **Seed test config from prod config** instead of passing the SK manually, then simplified further to let `SKYENV` handle the SK
- **Remove prod seed** from test config gen (#fa7f66)

**Release workflow fix** — the release workflow was still trying to build `cmd/release`, which was removed earlier this week when hardware wallet handling was moved to the root module. Fixed to build the root module instead.

### DMSG: More CI Tests

**Ctrl+C handling fix** (#370) — Ctrl+C wasn't working on long-running dmsg commands. Root causes:

- `--with-kill` (force-exit after 3 interrupts) was hidden and off by default
- `isFatalHTTPErr` only checked `context.DeadlineExceeded`, so `context.Canceled` from Ctrl+C was ignored and retry loops continued
- Retry sleeps didn't respect context cancellation
- Outer retry loop didn't check context at the top

Fixed: `--with-kill` defaults to true and is unhidden. `context.Canceled` is now treated as fatal. Retry sleeps use `select` on the context. Outer loop checks context at the top.

**E2E test expansion** — new test coverage for:
- `dmsg curl -B` (direct client, no discovery)
- `dmsg curl -S` (specific server)
- HTTP discovery vs. dmsg discovery
- HTTP served over DMSG
