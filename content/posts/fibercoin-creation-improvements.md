+++
date = "2025-12-05"
tags = ["Announcements", "Skycoin"]
title = "Simplified Fibercoin Creation and Chain Initialization"
+++

### Fibercoin Creation — From Minutes to Seconds

Creating and launching a new Fibercoin blockchain has been dramatically simplified. A single compiled Skycoin binary can now run any Fibercoin — no recompilation needed. Just set the `FIBER_TOML` environment variable to point at your coin's configuration file.

### FIBER_TOML Environment Variable

Previously, launching a Fibercoin node required either recompiling the binary with a custom config baked in, or passing multiple CLI flags. Now, the daemon reads a `FIBER_TOML` environment variable at startup:

```bash
FIBER_TOML=/path/to/mycoin.toml skycoin daemon
```

The fiber.toml defines everything about the coin: name, ticker symbol, coin hours denomination, genesis block, peer list, distribution addresses, BIP44 coin type, and network parameters. The binary dynamically adapts — even the help menu and ASCII art banner reflect the configured coin's name.

Configuration precedence: CLI flags > FIBER_TOML > hardcoded defaults.

### Automated Chain Initialization

Initializing a new blockchain has been reduced from 8+ manual steps to 4 commands:

```bash
# 1. Generate genesis wallet
skycoin cli addressGen > genesis.json

# 2. Generate distribution addresses (auto-updates fiber.toml)
FIBER_TOML=coin.toml skycoin cli fiberAddressGen -n 10

# 3. Start the daemon (auto-creates genesis block & signature)
GENESIS=genesis.json FIBER_TOML=coin.toml skycoin daemon --block-publisher

# 4. Distribute genesis coins
skycoin cli distributeGenesis $SECRET_KEY
```

Key improvements:
- **`fiberAddressGen`** generates distribution addresses and writes them directly back into the fiber.toml file
- **`distributeGenesis`** queries the running daemon's coin supply API rather than relying on hardcoded distribution tables
- Distribution addresses are loaded from fiber.toml at runtime — no recompilation needed when changing them
- Secret keys are never persisted to the config file

### Embedded Templates

The `skycoin newcoin` command now embeds all template files in the binary using Go's `embed` package. No external template directory is needed at runtime — just run `skycoin newcoin` to scaffold a new Fibercoin project.

### Dynamic Branding

The help menus and ASCII art banner are generated dynamically from the coin name in fiber.toml, so each Fibercoin feels like its own product out of the box.

These improvements are included in [Skycoin v0.28.2](https://github.com/skycoin/skycoin/releases/tag/v0.28.2).
