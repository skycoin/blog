+++
date = "2026-06-01"
tags = ["Development", "Skywire"]
title = "Development Update — June 1"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The standalone chat path reaches its purest form: CXO-backed group messaging over **native TCP, peer-to-peer, with no dmsg involved at all** — just two public keys and an encrypted transport between them. Plus transitive hypervisor trust, a per-server service health check, and a cluster of router and CXO fixes (one of which we'll revisit later in the month).

### Skywire: Standalone Skychat — CXO Over Native TCP, No DMSG

**`2950` feat(skychat): CXO-backed messaging over native TCP in standalone (P2P, no dmsg)** — the standalone chat app can now run its CXO-backed group messaging directly over a noise-encrypted native-TCP transport between peers, with **no dmsg layer at all**. Each instance is identified by its public key; the noise handshake encrypts the link; CXO feeds carry the messages. Two (or more) peers point at each other's `pk@host:port` and have a working, encrypted, public-key-authenticated group — no visor, no router, no dmsg server, no discovery service.

This is the foundation laid bare. Strip away the router, the overlay, and the discovery infrastructure, and what's left is the primitive everything else is built on: an encrypted transport addressed by public key, carrying data between two keys that have authenticated each other. The standalone skychat is that primitive made runnable — and it has been genuinely useful as a resilient side-channel that survives visor and dmsg outages.

### Skywire: Hypervisor — Transitive Trust

**`2940` feat(visor): transitive hypervisor whitelist — trust flows up the hypervisor chain** — in a nested-hypervisor topology, trust now flows transitively up the chain: a visor managed by a sub-hypervisor that is itself managed by a top hypervisor extends trust upward, so the top hypervisor can manage the deeply-nested visor without each link being whitelisted by hand. The management tree becomes coherent.

### Skywire: Services + CLI

**`2944` feat(cli/svc): svc health --service <pk> --dmsg-server <pk> — per-server service /health** — a `svc health` command that checks a service's `/health` reached through a specific dmsg server, so an operator can ask "is this service healthy *via this server*" rather than only "is it healthy somewhere."

**`2948` fix(skywire-cli): isUnderBase boundary match — stop /all-transports/per-key-stats aliasing onto the CXO feed** — a prefix-matching bug: `/all-transports/per-key-stats` was matching the `/all-transports` prefix and getting routed to that endpoint's CXO feed, returning the wrong payload. The boundary match is tightened so a sub-path no longer aliases onto its parent's feed. (The CLI's CXO-vs-network endpoint routing — read from the gossiped feed when there's a feed, fall back to the network otherwise.)

### Skywire: Router + CXO

**`2955` fix(router): bulk-snapshot TPD for hop lookups + honor mux degree in route count** — hop lookups take a bulk snapshot of the transport-discovery data rather than querying per-hop, and the route count honors the requested mux degree. Faster, and the count matches what was asked for.

**`2945` fix(cxo/node): buffer delcq so connection cleanup doesn't block the actor** — the CXO node's connection-cleanup channel (`delcq`) is buffered so a closing connection doesn't block the node's actor loop on the cleanup send. (A reasonable decoupling — though a bounded buffer has its own failure mode under sustained churn, which is a story for later in the month.)

### Skywire: Misc

- **`2953` log(dmsg/dmsgfirst): surface DMSG-discovery HTTP fallback at Warn (was Debug)** — when the dmsg-first client falls back to HTTP for discovery, it now says so at `Warn`, so an operator can see when the fallback path is being exercised.
- Reward-page UI work (`2946`, `2947`, `2949`, `2951`, `2952`) — per-pool detail CSVs, SEO enrichment, and navigation polish on the rewards site.
