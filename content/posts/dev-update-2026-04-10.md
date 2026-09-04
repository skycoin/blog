+++
date = "2026-04-10"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — April 10, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Services Health Dashboard

**`be6e5ce05` Services health UI dashboard** — the hypervisor now has a dedicated services health page that probes every deployment service (DMSG discovery, transport discovery, service discovery, route finder, uptime tracker, address resolver, DMSG servers) and displays their status, version, public key, transport type, and latency in a table view. Services are probed over DMSG where possible, with HTTP fallback.

**`1145197ba` Fix hypervisor UI feedback items** — split the health flags into separate indicators for HTTP and DMSG reachability, so operators can see which transport layer is working when debugging connectivity issues. Also fixed several UI regressions.

**`96fb152b1` / `db2f7775a` Extend services-health and add public visor status** — the node list now shows a public visor status indicator. The CLI's service health command now routes fetches through the visor RPC first, then DMSG, then HTTP — matching the visor's own preference chain.

### Skywire: Skychat Persistence

**`5d72c17ea` Skychat: add opt-in persistence with BoltDB + strict limits (phase 1)** — skychat messages can now be persisted to disk via BoltDB. Strict limits prevent abuse: 1000 messages per conversation, 100KB max per message, 10MB total DB size. Persistence is opt-in via `--persist` flag. Old messages are pruned on startup.

**`582e78261` Route setup node stats + skychat DMSG self-send** — skychat can now send messages to itself via DMSG (a useful diagnostic). Route setup node stats endpoint added.

**`c35adee20` Revert skychat DMSG self-send short-circuit** — the initial implementation bypassed DMSG for self-sends. Reverted to verify that DMSG self-dial actually works end-to-end, which it does.

### Skywire: Porter and Resource Fixes

**`326477886` Add periodic porter reap loop to dmsg Client** — ephemeral DMSG ports that were reserved but never used (e.g., from failed dials) accumulated over time. A reap loop now runs every 60 seconds and releases ports that have been idle for more than 5 minutes. This prevents the gradual port exhaustion seen on long-running visors.

**`7b047ad3b` Auto-release porter reservation on terminal Read/Write errors** — when a DMSG stream hits a terminal error (broken pipe, connection reset), its ephemeral port is now released immediately instead of waiting for the reap loop.

**`9a4dfef49` Bound CopyReadWriteCloser second-goroutine wait with timeout** — the bridge copier's cleanup goroutine could block indefinitely if the remote side stopped responding. Now times out after 5 seconds, preventing goroutine accumulation on servers with many half-dead connections.

### Skywire: E2E Testing Improvements

**`fffb47a2f` Replace blind retries with diagnostic-driven retries in E2E tests** — instead of retrying transport creation blindly on failure, the E2E framework now runs diagnostics first (check DMSG session, probe destination, verify service health) and only retries if the diagnostics indicate a transient issue. Permanent failures surface immediately with actionable error messages.

**`53b38dc10` Speed up E2E diagnostics** — diagnostic probes now run in parallel instead of sequentially. Transport add errors are reported in JSON format for structured analysis.

**`23ef172d0` Add transport setup-node to E2E diagnostics** — the E2E framework now checks RSN availability as part of its diagnostic suite, catching the common case where transports establish but latency measurement fails because the RSN is unreachable.

### Skywire: New CLI Commands

**`d387d8c38` / `e7744d0a6` Add `skywire cli tp id`** — computes the deterministic transport ID for a given pair of public keys and transport type. Useful for debugging transport conflicts and verifying that two visors agree on the expected transport ID. Transport type moved from positional arg to `-t/--type` flag for clarity.
