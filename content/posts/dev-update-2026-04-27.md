+++
date = "2026-04-27"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — April 27, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: Visor Self-Tracking Telemetry on CXO TreeStore

PR #2359 moves per-visor telemetry off HTTP entirely and onto the CXO TreeStore. Every visor publishes its own self-tracking record — uptime, version, transport count, last seen — into a CXO feed it owns. The transport discovery becomes a CXO subscriber that aggregates the published feeds into the same shape the HTTP `/uptimes` API used to serve directly.

The payoff is twofold. First, telemetry no longer rides the HTTP TPD register path, so a slow or partitioned TPD doesn't lose telemetry — visors keep publishing into their local CXO node and the aggregator catches up when reachable. Second, the aggregation is now pull-based instead of push-based: TPD reads from the canonical source (each visor's own feed) rather than trusting whatever the HTTP register endpoint last accepted.

This is the same architectural pattern emerging across Skywire's discovery layer — make the visors the source of truth, and let the deployment services aggregate.

### Skywire: HTTP Bridges Retired — TCP Only on Both Sides

Two PRs in lockstep retire the HTTP bridge code from both sides of the resolving-proxy split:

**`2358` refactor(dmsgweb)** — the dmsgweb resolver's HTTP bridge had been deprecated in favor of TCP-direct connections through the SOCKS5 proxy chain. The bridge code, including the chunked-transfer fallback and the per-request connection pool, comes out wholesale. Resolver now opens a TCP connection through skynet's route group and pipes bytes — no HTTP framing in the middle.

**`2360` refactor(skynet-fwd)** — same surgery on the skynet forwarding side. The HTTP bridge was the early prototype that proved skynet could carry web traffic; now that direct TCP works (PR #2331 on the 23rd), the bridge is dead weight.

Net code reduction: ~600 lines across both packages, and one fewer protocol-translation step in the request path. The browser proxy chain (browser → dmsgweb → skynetweb → skysocks) is now pure SOCKS5 + raw TCP end-to-end.

### Skywire: Misc

- **`2363` fix(dmsgweb)** — resolver no longer reads `WebPorts[0]` since the bridge that used it is gone.
- **`2361` fix(cli)** — `skywire cli visor config path` asks the running visor for its config path via RPC instead of reading from disk. Fixes the case where a visor was started with `--config /elsewhere` and the CLI was looking at the autoconfig default.
- **`2364` fix(socks5)** — switch from `confiant-inc/go-socks5` to `armon/go-socks5`. The previous fork had a hardcoded 5s deadline on tunneled connections; the new dependency lets the tunnel stay open as long as the underlying transport is alive.
- **`2362` setup-node** — outbound TPD/AR clients now go through dmsg-http instead of plain HTTP. The setup node lives on dmsg already; routing its discovery queries through dmsg removes the last clearnet dependency from RSN operation.
