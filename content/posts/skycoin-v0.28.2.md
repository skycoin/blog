+++
date = "2025-12-23"
tags = ["Announcements", "Skycoin"]
title = "Skycoin v0.28.2 Released"
+++

### Skycoin v0.28.2

Skycoin v0.28.2 has been released and is available from [GitHub](https://github.com/skycoin/skycoin/releases/tag/v0.28.2).

This is a major release that consolidates all Skycoin tools into a unified binary architecture:

- **Unified `skycoin` binary** — all tools compiled into a single command:
  - `skycoin daemon` — wallet node
  - `skycoin cli` — command line interface
  - `skycoin newcoin` — Fiber coin creator
  - `skycoin explorer` — blockchain explorer
  - `skycoin web` — thin client web wallet
- **Skywallet utilities (`skyhw`)** — integrated hardware wallet support:
  - `skyhw daemon` — Skywallet daemon
  - `skyhw cli` — Skywallet command line interface
- **Embedded GUI sources** — all frontend sources are embedded in the binary with support for custom frontends via flag
- **CLI migrated to Cobra** — improved command structure using spf13/cobra
- **Native installers** — .pkg for macOS and .msi for Windows
- **Updated dependencies**

Builds are available for Linux (amd64, arm64, armhf, arm, 386), macOS (amd64, arm64), and Windows (amd64, arm64, 386).

### Install

Downloads are available on the [GitHub release page](https://github.com/skycoin/skycoin/releases/tag/v0.28.2).
