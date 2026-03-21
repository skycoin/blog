+++
date = "2026-03-21"
tags = ["Guides", "Skycoin"]
title = "Skycoin v0.28.4 Supports Privateness"
+++

### Every Skycoin Tool Works with Privateness

Starting with [Skycoin v0.28.4](https://github.com/skycoin/skycoin/releases), Privateness (NESS) is fully supported. Privateness is a Fibercoin — a coin and blockchain built on the Skycoin platform. That means every tool in the Skycoin ecosystem works with Privateness out of the box: the full node daemon, the web wallet, the blockchain explorer, and the command line interface. All you need is Privateness's `fiber.toml` configuration file and the Skycoin v0.28.4 binary.

This guide walks through running a Privateness node, managing NESS wallets, exploring the Privateness blockchain, and querying it from the command line — all using the same Skycoin binary you'd use for Skycoin itself.

### How are you running Skycoin?

All commands in this guide use `skycoin` as the command. Choose how you're running it and the guide will update automatically:

<div class="cmd-tabs" id="cmd-tabs">
  <button class="cmd-tab active" data-cmd="skycoin">skycoin</button>
  <button class="cmd-tab" data-cmd="skywire skycoin">skywire skycoin</button>
  <button class="cmd-tab" data-cmd="go run .">go run .</button>
  <button class="cmd-tab" data-cmd="go run github.com/skycoin/skycoin@develop">go run ...skycoin@develop</button>
  <button class="cmd-tab" data-cmd="go run github.com/skycoin/skywire@develop skycoin">go run ...skywire@develop skycoin</button>
</div>

<p class="cmd-tab-note" id="cmd-tab-note-source" style="display:none;"><strong>Note:</strong> <code>go run .</code> must be run from within a cloned <code>skycoin</code> source directory. Requires Git and Go 1.23+.</p>
<p class="cmd-tab-note" id="cmd-tab-note-gorun" style="display:none;"><strong>Note:</strong> Requires Go 1.23+. No need to clone the repository.</p>

---

## Privateness Configuration

Every Skycoin tool reads a `fiber.toml` to know which coin it's operating on. Save the following as `ness.toml`:

```toml
[node]
genesis_signature_str = "80c03cf8f9ee3ad70c4169c29a5afdf2ebc705e96463ae6442a0674deacbbb7d1c49030982b07baa27d338583265719386765d06a1dd2ca5bef4806459b9442800"
genesis_address_str = "24GJTLPMoz61sV4J4qg1n14x5qqDwXqyJJy"
blockchain_pubkey_str = "02933015bd2fa1e0a885c05fb08eb7c647bf8c3188ed5120b51d0d09ccaf525036"
blockchain_seckey_str = ""
genesis_timestamp = 1650046010
genesis_coin_volume = 165e12
default_connections = [
    "154.16.118.97:6006",
    "192.243.100.192:6006",
    "179.61.232.155:6006",
    "167.114.97.165:6006",
]
peer_list_url = "http://nodes.privateness.network/blockchain/peers2.txt"
port = 6006
web_interface_port = 6660
unconfirmed_burn_factor = 20
unconfirmed_max_decimals = 6
create_block_burn_factor = 20
create_block_max_decimals = 6
display_name = "Privateness"
ticker = "NESS"
coin_hours_display_name = "Coin Hours"
coin_hours_display_name_singular = "Coin Hour"
coin_hours_ticker = "NCH"
qr_uri_prefix = "privateness"
explorer_url = "https://explorer.privateness.network"
version_url = "https://privateness.network/blockchain/version.txt"

[params]
max_coin_supply = 330e6
initial_unlocked_count = 100
unlock_address_rate = 100
user_max_decimals = 6
user_burn_factor = 20
distribution_addresses = [
    "2BmHcwsZGfsBujFMzu56dU7gX6PGeZcLY33",
    "CCBkWFPekxmxUGLy81UMkNWBKam2kD2rra",
    ...
]
```

The full `fiber.toml` with all 200 distribution addresses is available in the [Privateness repository](https://github.com/NESS-Network/ness/blob/master/fiber.toml).

Privateness uses port `6006` for peer connections and `6660` for the API — different from Skycoin's defaults (`6000`/`6420`), so both can run on the same machine simultaneously.

---

## Running a Privateness Node

If you selected **go run .** above, you'll need to clone the Skycoin repository first:

```bash
git clone https://github.com/skycoin/skycoin.git
cd skycoin
```

Then run from within the cloned directory. The other methods (release binary, `skywire skycoin`, or the remote `go run` variants) work from anywhere.

```bash
FIBER_TOML=ness.toml skycoin daemon
```

The daemon connects to the Privateness peer network, syncs the blockchain, and serves the API on port `6660`. The data directory automatically adapts — Privateness data is stored in `~/.privateness/` by default.

**Troubleshooting:** If the node fails to connect to peers, check `~/.privateness/peers.json`. If it contains stale or incorrect peers (e.g., Skycoin peers from a previous misconfigured run), delete it and restart the daemon — it will repopulate from the `default_connections` and `peer_list_url` in the fiber.toml.

All help menus reflect the configured coin:

```text
$ FIBER_TOML=ness.toml skycoin
┌─┐┬─┐┬┬  ┬┌─┐┌┬┐┌─┐┌┐┌┌─┐┌─┐┌─┐
├─┘├┬┘│└┐┌┘├─┤ │ ├┤ │││├┤ └─┐└─┐
┴  ┴└─┴ └┘ ┴ ┴ ┴ └─┘┘└┘└─┘└─┘└─┘
v0.28.4

 Available Commands:
  cli                     privateness command line interface
  daemon                  privateness wallet
  explorer                blockchain explorer
  newcoin                 create a new fibercoin
  web                     privateness thin client web wallet
```

The CLI also adapts — note the default `RPC_ADDR` and `COIN` are set to Privateness values:

```text
$ FIBER_TOML=ness.toml skycoin cli --help
┌─┐┬─┐┬┬  ┬┌─┐┌┬┐┌─┐┌┐┌┌─┐┌─┐┌─┐   ┌─┐┬  ┬
├─┘├┬┘│└┐┌┘├─┤ │ ├┤ │││├┤ └─┐└─┐───│  │  │
┴  ┴└─┴ └┘ ┴ ┴ ┴ └─┘┘└┘└─┘└─┘└─┘   └─┘┴─┘┴
privateness command line interface

ENVIRONMENT VARIABLES:
  RPC_ADDR: Address of RPC node. Must be in scheme://host format. Default "http://127.0.0.1:6660"
  COIN: Name of the coin. Default "privateness"
  DATA_DIR: Directory where everything is stored. Default "$HOME/.$COIN/"
```

---

## Privateness Web Wallet

Once the node is synced, start the web wallet pointed at it:

```bash
skycoin web \
  --node-url http://127.0.0.1:6660 \
  --wallet-dir ~/.privateness/wallets
```

Open `http://127.0.0.1:8001` in your browser. The wallet auto-discovers the coin name, ticker, and coin hours denomination from the node's health endpoint — it will show "Privateness" and "NESS" throughout the interface.

### Multi-Coin Wallet: Privateness + Skycoin

Run both a Skycoin and Privateness daemon, then point the web wallet at both:

```bash
skycoin web \
  --node-url http://127.0.0.1:6420 \
  --wallet-dir ~/.skycoin/wallets \
  --node-url http://127.0.0.1:6660 \
  --wallet-dir ~/.privateness/wallets
```

Both coins appear in the same wallet interface with independent wallet lists, balances, and transaction history. You can add any number of Fibercoins this way — see the [AIX guide](/posts/guide-multicoin-wallet/) for adding AIX as well.

### Using a Remote Skycoin Node

If you don't want to run a local Skycoin node, you can use the public node alongside your local Privateness node:

```bash
skycoin web \
  --node-url https://node.skycoin.com \
  --wallet-dir ~/.skycoin/wallets \
  --node-url http://127.0.0.1:6660 \
  --wallet-dir ~/.privateness/wallets
```

Private keys stay local regardless of whether the node is local or remote — the web wallet signs transactions locally and only broadcasts the signed result.

---

## Privateness Blockchain Explorer

Privateness has a public explorer at [explorer.privateness.network](https://explorer.privateness.network). You can also run your own against your local node:

```bash
skycoin explorer --node-addr http://127.0.0.1:6660
```

Open `http://127.0.0.1:8001` to browse Privateness blocks, transactions, and addresses. To run the explorer on a different port (e.g., if the web wallet is already on `8001`):

```bash
skycoin explorer \
  --node-addr http://127.0.0.1:6660 \
  --server-host 127.0.0.1:8002
```

---

## Privateness Command Line Interface

With `FIBER_TOML` set, the CLI automatically defaults to Privateness's RPC port and coin name:

```bash
export FIBER_TOML=ness.toml
```

Or set them explicitly per-command:

```bash
RPC_ADDR="http://127.0.0.1:6660" COIN="privateness" skycoin cli <command>
```

### Check Node Status

```bash
skycoin cli status
```

```text
"fiber": {
    "display_name": "Privateness",
    "ticker": "NESS",
    "coin_hours_display_name": "Coin Hours",
    "coin_hours_ticker": "NCH",
    "qr_uri_prefix": "privateness",
    "explorer_url": "https://explorer.privateness.network",
    "bip44_coin": 8000
}
```

### View the Privateness Rich List

```bash
skycoin cli richlist
```

Distribution addresses are excluded by default:

```text
{
    "richlist": [
        {
            "address": "2ZqT7BemNU4oVrhgzwSpwHG1PE9uxsov1w9",
            "coins": "11680891.800000",
            "locked": false
        },
        {
            "address": "24GJTLPMoz61sV4J4qg1n14x5qqDwXqyJJy",
            "coins": "8357470.476168",
            "locked": false
        },
        {
            "address": "uc6sEXKsrb7LPzeRqdP98YezxwEZ2pV2CU",
            "coins": "8106992.996998",
            "locked": false
        },
        ...
    ]
}
```

### Check an Address Balance

```bash
skycoin cli addressBalance <address>
```

### Create a Wallet

```bash
skycoin cli walletCreate -l "My NESS Wallet"
```

### Send NESS

```bash
skycoin cli send -a <recipient-address> -c <amount> -f ~/.privateness/wallets/<wallet-file>
```

### View Transaction History

```bash
skycoin cli walletHistory -f ~/.privateness/wallets/<wallet-file>
```

Every `skycoin cli` subcommand works with Privateness — wallet creation, address generation, transaction signing, blockchain queries, and more. Run `skycoin cli --help` for the full list.

---

## Summary

| Tool | Privateness Command |
|------|-------------|
| Full node | `FIBER_TOML=ness.toml skycoin daemon` |
| Web wallet | `skycoin web --node-url http://127.0.0.1:6660 --wallet-dir ~/.privateness/wallets` |
| Explorer | `skycoin explorer --node-addr http://127.0.0.1:6660` |
| CLI | `FIBER_TOML=ness.toml skycoin cli <command>` |

One binary. One config file. The full Skycoin toolchain, running Privateness.

See also: [Skycoin v0.28.4 Supports AIX](/posts/guide-multicoin-wallet/) | [Multi-Fibercoin Wallet Support](/posts/skycoin-web-multi-fibercoin/) | [Creating Your Own Fibercoin](/posts/guide-creating-a-fibercoin/) | [Skycoin: One Binary, Every Tool](/posts/skycoin-unified-binary/)
