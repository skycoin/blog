+++
date = "2026-03-07"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
tags = ["Announcements", "Skywire"]
title = "Skywire v1.3.36 Released"
+++

### Skywire v1.3.36

Skywire v1.3.36 has been released and is available from [GitHub](https://github.com/skycoin/skywire/releases/tag/v1.3.36).

This is a major release with significant improvements to the Transport Discovery, network visualization, and overall infrastructure:

- **Transport Discovery overhaul** — migrated from PostgreSQL to Redis for faster transport metrics storage and retrieval, consolidated metrics endpoints, and added Redis pipelining for the /metrics endpoint
- **Network globe visualization** — new interactive globe view for visualizing the Skywire network topology
- **Network control panel** — improved WASM-based network visualizer matching the TypeScript UI
- **Latency measurement** — added latency probe listener for transport latency measurement
- **DMSG tracker fix** — resolved connection failures in the DMSG tracker
- **Rewards UI improvements** — fixed bundle.js 404 on transport graph, added missing DMSG API routes and caching, fixed unwanted stdout logging
- **CLI improvements** — improved help menus with color support, added `--testenv` flag and `SKYWIRE_TEST` environment variable, added `SKYWIRE_RPC` environment variable for CLI RPC address
- **Ping improvements** — more reliable `skywire cli visor ping` with better autoconnect logic
- **Docker build improvements** — proper version stamping using `go install` with .git context
- **macOS .pkg and Windows .msi installers** — native platform installers added to the release pipeline

The full changelog is available on [GitHub](https://github.com/skycoin/skywire/compare/v1.3.34...v1.3.36).

### Install

Linux users can install Skywire from the [APT repository](https://deb.skywire.skycoin.com/) or the [AUR](https://aur.archlinux.org/packages/skywire-bin). Windows and macOS installers are available on the [GitHub release page](https://github.com/skycoin/skywire/releases/tag/v1.3.36).

For questions or technical assistance: [t.me/skywire](https://t.me/skywire)
