+++
date = "2026-03-18"
tags = ["Announcements", "Skycoin"]
title = "Skycoin: One Binary, Every Tool"
+++

### The Unified Skycoin Binary

All Skycoin tools are now compiled into a single binary. What used to be a collection of separate programs — wallet daemon, CLI, web wallet, blockchain explorer, Fibercoin generator, and hardware wallet utilities — is now one command with subcommands.

### Available Subcommands

| Command | Description |
|---------|-------------|
| `skycoin daemon` | Full node and wallet daemon |
| `skycoin cli` | Command line interface for wallets, transactions, and blockchain queries |
| `skycoin web` | Thin client web wallet with multi-Fibercoin and Bitcoin support |
| `skycoin explorer` | Blockchain explorer with embedded Angular frontend |
| `skycoin newcoin` | Fibercoin creation tool with embedded templates |

The release binary (compiled from `cmd/release`) also includes the Skywallet hardware wallet utilities, accessible as `skyhw`:

| Command | Description |
|---------|-------------|
| `skyhw daemon` | Hardware wallet daemon (HTTP API for Skywallet devices) |
| `skyhw cli` | Hardware wallet CLI (address generation, transaction signing, device management) |

Note: `skyhw` is included in the release binary but is not shown in `skycoin --help` — it's invoked as `skyhw` rather than `skycoin skyhw`. Building from the repository root (`go build .`) compiles only the core `skycoin` subcommands; the release binary with `skyhw` is built from `cmd/release`.

### One Binary, Any Coin

The same binary runs any Fibercoin blockchain. Set the `FIBER_TOML` environment variable to a custom configuration file and the daemon, CLI, and web wallet all adapt automatically — including help menus, default directories, and network parameters.

```bash
FIBER_TOML=mycoin.toml skycoin daemon
```

### Architecture

Each tool is maintained as a standalone Cobra command in its own package, then registered as a subcommand of the root command. The individual command packages can still be compiled independently for testing, but the release binary bundles everything together.

The web wallet frontend, explorer frontend, and newcoin templates are all embedded in the binary using Go's `embed` package — no external files needed at runtime.

### Platform Support

Release builds are statically compiled with musl, so there are no runtime library dependencies. Builds are available for:

- **Linux** — amd64, arm64, armhf, arm, 386, riscv64
- **macOS** — amd64, arm64 (with native .pkg installer)
- **Windows** — amd64, arm64 (with .msi installer)

The hardware wallet utilities require libusb (bundled statically in release builds). On platforms where gousb is not supported (32-bit, Windows ARM64), a stub is provided so the rest of the binary works normally.

### What This Means

- **One download** — everything you need to run a node, manage wallets, explore the blockchain, create Fibercoins, and use hardware wallets
- **No dependency management** — static binaries with embedded frontends, no external files
- **Consistent versioning** — all tools share the same version and are tested together
- **Fibercoin ready** — the same binary serves as the wallet and toolchain for any Fiber blockchain

The full Skycoin toolchain is also embedded in the [unified Skywire binary](/posts/skywire-unified-binary/), accessible as `skywire skycoin`.

Downloads are available on the [GitHub release page](https://github.com/skycoin/skycoin/releases).
