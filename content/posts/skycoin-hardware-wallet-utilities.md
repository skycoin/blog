+++
date = "2026-01-12"
tags = ["Announcements", "Skycoin"]
title = "Skywallet Hardware Wallet Utilities Updated and Integrated"
+++

### Skywallet Utilities — Fully Integrated into Skycoin

The Skywallet hardware wallet utilities have been fully integrated into the Skycoin repository. Previously maintained as separate external projects (`hardware-wallet-go` and `hardware-wallet-daemon`), all source code now lives within the Skycoin monorepo and ships as part of the unified binary.

### What Changed

- **Source integration** — The `hardware-wallet-go` library and `hardware-wallet-daemon` HTTP server have been moved into `src/hardware-wallet/` and `src/hardware-wallet-daemon/` respectively, eliminating external dependency management.
- **Unified binary** — The release binary now includes `skyhw` as a subcommand alongside `daemon`, `cli`, `web`, `explorer`, and `newcoin`.
- **Static compilation** — Release builds use static musl compilation with bundled libusb, so there are no runtime library dependencies.
- **Cross-platform support** — Builds for Linux (amd64, arm64, riscv64), macOS (amd64, arm64), and Windows (amd64).

### Usage

Run the hardware wallet daemon:
```bash
skyhw daemon
```

Use the CLI to interact with a connected Skywallet device:
```bash
skyhw cli generateAddresses -n 5
skyhw cli transactionSign --inputHash <hash>
skyhw cli ping
```

### Available CLI Commands

The `skyhw cli` provides commands for address generation, device configuration, firmware updates, mnemonic generation and recovery, message signing, transaction signing, PIN management, entropy retrieval, backup, and device wipe.

### Release History

- [Skycoin v0.28.2](https://github.com/skycoin/skycoin/releases/tag/v0.28.2) — first release with `skyhw` as a standalone binary in release archives
- [Skycoin v0.28.3](https://github.com/skycoin/skycoin/releases/tag/v0.28.3) — includes the fully integrated source code and unified release binary with `skyhw` as a subcommand
