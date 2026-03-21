+++
date = "2026-03-13"
tags = ["Guides", "Skycoin"]
title = "Guide: Using the Skycoin Web Wallet as a Multi-Coin Wallet"
+++

### Managing Multiple Coins from One Wallet

The `skycoin web` thin client can connect to multiple blockchain nodes at once, letting you manage Skycoin, AIX, and any other Fibercoin from a single browser interface. This guide walks through setting it up — first with local full nodes, then with remote public nodes.

---

## Method 1: Running Local Full Nodes (Recommended)

Running your own nodes gives you full control and privacy. You run a daemon for each coin, then point the web wallet at all of them.

### Step 1: Start a Skycoin Node

```bash
skycoin daemon
```

This starts the Skycoin daemon on its default ports — peer connections on `6000`, API on `6420`.

### Step 2: Start an AIX Node

Create an AIX configuration file `aix.toml`:

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
version_url = ""
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

Start the AIX daemon:

```bash
FIBER_TOML=aix.toml skycoin daemon
```

AIX runs on port `8220` for peer connections and `8320` for the API — different from Skycoin's ports, so both can run simultaneously.

### Step 3: Start the Multi-Coin Web Wallet

Once both daemons are running and synced, start the web wallet pointing at both:

```bash
skycoin web \
  --node-url http://127.0.0.1:6420 \
  --wallet-dir ~/.skycoin/wallets \
  --node-url http://127.0.0.1:8320 \
  --wallet-dir ~/.aix/wallets
```

Open `http://127.0.0.1:8001` in your browser. The wallet auto-discovers each coin's name, ticker, and coin hours denomination from the node's health endpoint. You'll see both Skycoin and AIX available, with separate wallet lists for each.

### Adding More Coins

Add any Fibercoin the same way — create a `fiber.toml` for it, start a daemon, and add another pair of `--node-url` and `--wallet-dir` flags to the `skycoin web` command. See the [Fibercoin creation guide](/posts/guide-creating-a-fibercoin/) for how to create your own.

---

## Method 2: Connecting to Remote Public Nodes

If you don't want to run full nodes locally, you can connect to public API nodes operated by the coin's team. This is how the mobile wallets work — they're thin clients that connect to hosted nodes.

### Skycoin Public Node

Skycoin provides a public node at `https://node.skycoin.com`:

```bash
skycoin web \
  --node-url https://node.skycoin.com \
  --wallet-dir ~/.skycoin/wallets
```

### Multi-Coin with Public Nodes

If a Fibercoin operates a public API node, you can add it alongside Skycoin:

```bash
skycoin web \
  --node-url https://node.skycoin.com \
  --wallet-dir ~/.skycoin/wallets \
  --node-url https://node.somecoin.com \
  --wallet-dir ~/.somecoin/wallets
```

**Note:** AIX does not currently have a public API node for thin client access. To use AIX with the web wallet, run a local AIX node as described in Method 1.

### Security Considerations

With remote public nodes, your **private keys still stay local** — the web wallet manages keys in `--wallet-dir` on your machine and signs transactions locally. Only signed transactions are broadcast to the remote node. However, the remote node can see your addresses and transaction history, so running your own node is recommended for maximum privacy.

---

## Mixing Local and Remote Nodes

You can mix both methods — run a local node for one coin and use a remote node for another:

```bash
skycoin web \
  --node-url http://127.0.0.1:8320 \
  --wallet-dir ~/.aix/wallets \
  --node-url https://node.skycoin.com \
  --wallet-dir ~/.skycoin/wallets
```

---

```text
$ skycoin web --help
┌─┐┬┌─┬ ┬┌─┐┌─┐┬┌┐┌   ┬ ┬┌─┐┌┐
└─┐├┴┐└┬┘│  │ │││││───│││├┤ ├┴┐
└─┘┴ ┴ ┴ └─┘└─┘┴┘└┘   └┴┘└─┘└─┘
Thin client web wallet for Skycoin and fibercoins.

Usage:
  skywire skycoin web [flags]

Flags:
      --btc-electrum-url string   Electrum server URL (e.g. ssl://electrum.blockstream.info:50002)
      --btc-node-url string       Bitcoin Core RPC URL (e.g. http://user:pass@127.0.0.1:8332)
      --enable-seed-api           Enable the wallet seed API (requires --wallet-dir)
  -H, --host string               Host to bind to (default "127.0.0.1")
  -n, --node-url stringArray      Node URL (can be specified multiple times) (default [https://node.skycoin.com])
  -p, --port int                  Port to serve on (default 8001)
  -w, --wallet-dir stringArray    Local wallet directory (e.g. ~/.skycoin/wallets)
```

See also: [Multi-Fibercoin Support](/posts/skycoin-web-multi-fibercoin/) | [Bitcoin Support](/posts/skycoin-web-bitcoin-support/) | [Creating Your Own Fibercoin](/posts/guide-creating-a-fibercoin/)
