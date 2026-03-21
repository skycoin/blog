+++
date = "2026-03-21"
tags = ["Guides", "Skycoin"]
title = "Skycoin Supports AIX"
+++

### Every Skycoin Tool Works with AIX

AIX is a Fibercoin — a coin and blockchain built on the Skycoin platform. That means every tool in the Skycoin ecosystem works with AIX out of the box: the full node daemon, the web wallet, the blockchain explorer, and the command line interface. All you need is AIX's `fiber.toml` configuration file and the `skycoin` binary.

This guide walks through running an AIX node, managing AIX wallets, exploring the AIX blockchain, and querying it from the command line — all using the same Skycoin binary you'd use for Skycoin itself.

---

## AIX Configuration

Every Skycoin tool reads a `fiber.toml` to know which coin it's operating on. Save the following as `aix.toml`:

```toml
[node]
genesis_signature_str = "69f9de394a2dd336d522d5558b4032c0c20dd1de33566cfe157399dfc7fc2c3b4ebb1b70399fdd71733c9a4564b4f0c0535c16bf737339e1d4737aa4a650560e00"
genesis_address_str = "2eoXhtqtafcZaLCbXiL6ACJ1kRhrHWxquST"
blockchain_pubkey_str = "030a3dc28614128bc3abe364901784fd9e92c627dee0041d9518bafd651c6978bf"
blockchain_seckey_str = ""
genesis_timestamp = 1619411071
genesis_coin_volume = 100e15
default_connections = [
    "104.129.181.176:8220",
    "104.129.183.104:8220",
    "104.129.183.125:8220",
]
port = 8220
web_interface_port = 8320
display_name = "AIX"
ticker = "AIX"
coin_hours_display_name = "Coin Hours"
coin_hours_display_name_singular = "Coin Hour"
coin_hours_ticker = "ACH"
qr_uri_prefix = "aix"
explorer_url = ""
version_url = ""
peer_list_url = ""
price_ticker_id = "aixexchange"
price_ticker_source = "coingecko"

[params]
max_coin_supply = 100e9
initial_unlocked_count = 1
unlock_address_rate = 0
unlock_time_interval = 31536000
user_burn_factor = 2
distribution_addresses = [
    "2eoXhtqtafcZaLCbXiL6ACJ1kRhrHWxquST",
]
```

AIX uses port `8220` for peer connections and `8320` for the API — different from Skycoin's defaults (`6000`/`6420`), so both can run on the same machine simultaneously.

---

## Running an AIX Node

```bash
FIBER_TOML=aix.toml skycoin daemon --legacy-peer-compat
```

The `--legacy-peer-compat` flag is needed because AIX's deployed nodes run an older version that doesn't send a blockchain public key during the peer handshake. Without this flag, connections to AIX peers will be rejected.

The daemon connects to the AIX peer network, syncs the blockchain, and serves the API on port `8320`. The data directory automatically adapts — AIX data is stored in `~/.aix/` by default. All help menus reflect the configured coin:

```text
$ FIBER_TOML=aix.toml skycoin
┌─┐┬─┐ ┬
├─┤│┌┴┬┘
┴ ┴┴┴ └─
v0.28.4

 Available Commands:
  cli                     aix command line interface
  daemon                  aix wallet
  explorer                blockchain explorer
  newcoin                 create a new fibercoin
  web                     aix thin client web wallet
```

The CLI also adapts — note the default `RPC_ADDR` and `COIN` are set to AIX values:

```text
$ FIBER_TOML=aix.toml skycoin cli --help
┌─┐┬─┐ ┬   ┌─┐┬  ┬
├─┤│┌┴┬┘───│  │  │
┴ ┴┴┴ └─   └─┘┴─┘┴
aix command line interface

ENVIRONMENT VARIABLES:
  RPC_ADDR: Address of RPC node. Must be in scheme://host format. Default "http://127.0.0.1:8320"
  COIN: Name of the coin. Default "aix"
  DATA_DIR: Directory where everything is stored. Default "$HOME/.$COIN/"
```

---

## AIX Web Wallet

Once the node is synced, start the web wallet pointed at it:

```bash
skycoin web \
  --node-url http://127.0.0.1:8320 \
  --wallet-dir ~/.aix/wallets
```

Open `http://127.0.0.1:8001` in your browser. The wallet auto-discovers the coin name, ticker, and coin hours denomination from the node's health endpoint — it will show "AIX" throughout the interface.

### Multi-Coin Wallet: AIX + Skycoin

Run both a Skycoin and AIX daemon, then point the web wallet at both:

```bash
skycoin web \
  --node-url http://127.0.0.1:6420 \
  --wallet-dir ~/.skycoin/wallets \
  --node-url http://127.0.0.1:8320 \
  --wallet-dir ~/.aix/wallets
```

Both coins appear in the same wallet interface with independent wallet lists, balances, and transaction history. You can add any number of Fibercoins this way.

### Using a Remote Skycoin Node

If you don't want to run a local Skycoin node, you can use the public node alongside your local AIX node:

```bash
skycoin web \
  --node-url https://node.skycoin.com \
  --wallet-dir ~/.skycoin/wallets \
  --node-url http://127.0.0.1:8320 \
  --wallet-dir ~/.aix/wallets
```

Private keys stay local regardless of whether the node is local or remote — the web wallet signs transactions locally and only broadcasts the signed result.

**Note:** AIX does not currently have a public API node for thin client access. To use AIX with the web wallet, run a local AIX node.

---

## AIX Blockchain Explorer

Run the blockchain explorer against your AIX node:

```bash
skycoin explorer --node-addr http://127.0.0.1:8320
```

Open `http://127.0.0.1:8001` to browse AIX blocks, transactions, and addresses. To run the explorer on a different port (e.g., if the web wallet is already on `8001`):

```bash
skycoin explorer \
  --node-addr http://127.0.0.1:8320 \
  --server-host 127.0.0.1:8002
```

---

## AIX Command Line Interface

With `FIBER_TOML` set, the CLI automatically defaults to AIX's RPC port and coin name:

```bash
export FIBER_TOML=aix.toml
```

Or set them explicitly per-command:

```bash
RPC_ADDR="http://127.0.0.1:8320" COIN="aix" skycoin cli <command>
```

### Check Node Status

```bash
skycoin cli status
```

```text
"fiber": {
    "display_name": "AIX",
    "ticker": "AIX",
    "coin_hours_display_name": "Coin Hours",
    "coin_hours_ticker": "ACH",
    "qr_uri_prefix": "aix",
    "bip44_coin": 8000,
    "price_ticker_id": "aixexchange",
    "price_ticker_source": "coingecko"
}
```

### View the AIX Rich List

```bash
skycoin cli richlist
```

```text
{
    "richlist": [
        {
            "address": "dcAsh3qce8BL7VuaMN2t4z3jtcs96RKxhR",
            "coins": "98497380000.000000",
            "locked": false
        },
        {
            "address": "2fhK5GkWTwwM8kQoV2zMkbuBaAYnPszjygi",
            "coins": "1080872926.996000",
            "locked": false
        },
        {
            "address": "2JycUseKtW31jKfuHuXm16uRbfGhRuNtTz7",
            "coins": "149990000.000000",
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
skycoin cli walletCreate -l "My AIX Wallet"
```

### Send AIX

```bash
skycoin cli send -a <recipient-address> -c <amount> -f ~/.aix/wallets/<wallet-file>
```

### View Transaction History

```bash
skycoin cli walletHistory -f ~/.aix/wallets/<wallet-file>
```

Every `skycoin cli` subcommand works with AIX — wallet creation, address generation, transaction signing, blockchain queries, and more. Run `skycoin cli --help` for the full list.

---

## Summary

| Tool | AIX Command |
|------|-------------|
| Full node | `FIBER_TOML=aix.toml skycoin daemon --legacy-peer-compat` |
| Web wallet | `skycoin web --node-url http://127.0.0.1:8320 --wallet-dir ~/.aix/wallets` |
| Explorer | `skycoin explorer --node-addr http://127.0.0.1:8320` |
| CLI | `RPC_ADDR=http://127.0.0.1:8320 COIN=aix skycoin cli <command>` |

One binary. One config file. The full Skycoin toolchain, running AIX.

See also: [Multi-Fibercoin Wallet Support](/posts/skycoin-web-multi-fibercoin/) | [Creating Your Own Fibercoin](/posts/guide-creating-a-fibercoin/) | [Skycoin: One Binary, Every Tool](/posts/skycoin-unified-binary/)
