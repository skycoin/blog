+++
date = "2026-04-13"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — April 13, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: DMSG Self-Ping Command

**`ff684f796` Add `skywire dmsg self-ping`** — a new diagnostic command that verifies end-to-end DMSG connectivity by having the visor dial itself through the DMSG network. The visor dials its own public key on a test port, measures the round-trip time, and reports success or failure. This is the definitive test for "is my visor reachable over DMSG?" — it exercises the full path: discovery lookup, server session, noise handshake, stream establishment.

### Skywire: Service Discovery Probe Tuning

The DMSG reachability probes introduced yesterday needed tuning based on production behavior:

**`efc13db53` SD: make dmsg probe best-effort, don't reject registrations** — the initial implementation rejected visor registrations when the DMSG probe failed. This was too aggressive — transient DMSG issues would prevent visors from advertising their services. Changed to best-effort: the probe result is logged and recorded for metrics, but registrations always succeed.

**`c7b22dd15` SD: restore hard probe gate with 15s timeout** — after monitoring the best-effort approach, determined that the false-positive rate was acceptable with a longer timeout. Restored the probe gate but with a 15-second timeout (up from 5s) to accommodate slow DMSG paths.

**`4a75be323` Visor: check dmsg discovery before dialing TPS/RSN health checks** — the visor now verifies that the DMSG discovery is reachable before trying to probe the transport setup and route setup nodes over DMSG. This prevents cascading timeouts when the discovery is down.

### Skywire: Transport Uptime Tracking

**`0c24fcf11` TPD: add transport uptime tracking (stcpr/sudph only)** — the transport discovery now tracks per-transport uptime, not just per-visor uptime. Each STCPR and SUDPH transport gets its own uptime bitmap. This enables answering "how long has this specific transport been up?" rather than just "how long has this visor been online?". DMSG transports are excluded since they're session-based, not persistent.

### Skywire: DMSG Server Health Enrichment

**`c5a397080` dmsg-server: add discovery URL and peer servers to /health response** — DMSG server health endpoints now include the discovery URL they're configured with and the list of peer DMSG server PKs they know about. This helps operators verify mesh configuration without SSH-ing into the server.

**`4ad49b64f` Visor: prefer dmsg URLs in services health endpoint display** — when a service has both HTTP and DMSG URLs, the health endpoint now shows the DMSG URL. This makes it obvious which transport the visor is actually using.

**`fad0c80f9` dmsg: fix dialViaConnectedServers for server direct clients** — server direct clients (used by deployment services) were incorrectly trying to dial through their own server, which doesn't work. Now correctly routes through the target's delegated servers.

### Skywire: E2E Testing Hardening

**`d2b7b353c` Improve E2E Docker health checks** — replaced polling-based health checks with Docker's native health check mechanism. `WaitForContainerHealthy` blocks until Docker reports the container as healthy, removing the fragile sleep-based waiting.

**`2fbfd50ed` E2E: wait for dmsg session before declaring visor ready** — the E2E framework now waits for at least one DMSG session to be established before considering a visor "ready". Previously, visors were marked ready as soon as the RPC port responded, but DMSG-dependent operations would fail until sessions were up.

**`f9c6d4938` E2E: retry VisorTpAddDefault with short backoff** — transport addition in E2E tests now retries with exponential backoff (100ms, 200ms, 400ms...) instead of fixed 5-second waits, making tests both faster and more reliable.

### Skywire: Lint and Code Quality

**`8143c9f8d` make format: apply goimports + gofmt across codebase** — a codebase-wide formatting pass, cleaning up import ordering and formatting inconsistencies accumulated across recent rapid development.

**`09ef0c3ad` fix errcheck: use nolint directive instead of blank assignment** — the `check-blank=true` errcheck setting was catching `_ = f.Close()` patterns. Replaced with explicit `//nolint:errcheck` directives where the error is intentionally ignored.
