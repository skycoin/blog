+++
date = "2026-05-01"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — May 1, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Per-Transport Latency End-to-End

PR #2401 plumbs measured latency through every layer that touches a transport:

**Visor → TPD** — the visor's transport-level ping result (the new mechanism from PR #2317 that replaced RSN-based latency) is included in the transport register call. TPD persists the latency on the entry alongside type, label, and timing.

**TPD storage** — latency lives in the transport entry, queryable via the `GET /transports/edge:{pk}` endpoint and surfaced through the DHT mirror.

**Discovery API** — `cli tp ls`, the hypervisor's transport table, and `route calc` all read latency from the entry directly.

**`--mux 0 = unlimited`** — the multiplex pool flag was previously a positive integer; `0` is now an explicit "no cap" mode for benchmarks and for visors that genuinely want to keep every available route alive.

Net effect: an operator looking at `cli tp ls` sees real RTT per transport without the visor having to re-measure on demand. Route calculation can finally sort by latency, not just by hop count.

### Skywire: DMSG Servers — Live Confbs + Disk Cache

**`2403` dmsg_servers: refresh embedded list, live confbs response, visor-side disk cache** — three changes to the dmsg-servers bootstrap path:

- **Refreshed embedded list** — the baked-in dmsg-servers list (used when the visor can't reach the config service yet) is updated to the current production keyring. Pre-fix visors carrying the older embedded list would fail their first dmsg connect for ~30s while they waited for confbs.
- **Live confbs response** — config service now serves the dmsg-servers field from a live snapshot of the dmsg-discovery's `servers` set instead of from a static config field. New servers added to the deployment are reachable by fresh visors immediately, without redeploying conf-service.
- **Visor-side disk cache** — the visor persists the last-good dmsg-servers list to `~/.skywire/dmsg-servers.json` and reads it on next boot before reaching out to confbs. A visor that booted offline (laptop on a plane) now still has a usable dmsg-servers set from its last online run.

### Skywire: httputil WriteJSON Panic Fix + errors.Is Sweep

**`2402` httputil: fix WriteJSON panic on slow clients; sweep err.Error() string matches → errors.Is** — two unrelated cleanups in one PR:

**WriteJSON panic** — the helper would panic when the HTTP response writer's `Write` returned an error (slow or disconnected client) because the panic message used a format verb without checking the err type. Race-clean E2E test had been intermittently failing on this for two weeks.

**`err.Error()` string matches** — twelve sites across the codebase were comparing error messages by string equality. Standard Go idiom is `errors.Is`/`errors.As`. The sweep converts them all: `transport.ErrNotFound`, `routing.ErrRuleNotFound`, dmsg's various NotFound errors. Errors stay comparable across version boundaries even when their formatted text changes.

### Skywire: Misc

- The `--mux 0 = unlimited` knob is documented in the transport CLI help.
- TPD's `/uptimes` response now includes the latency field on each entry; the existing TPD-aggregator clients pick it up automatically.
