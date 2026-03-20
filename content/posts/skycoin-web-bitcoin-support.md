+++
date = "2026-03-16"
tags = ["Announcements", "Skycoin"]
title = "Bitcoin Support Added to the Skycoin Web Wallet"
+++

### Bitcoin Support in the Skycoin Web Wallet

The `skycoin web` wallet now supports Bitcoin, allowing you to send and receive BTC from the same interface used for Skycoin and Fibercoin wallets.

### What It Does

Full Bitcoin wallet functionality has been added to the Skycoin web thin client:

- **Send and receive BTC** — create, sign, and broadcast Bitcoin transactions directly from the wallet UI
- **Native segwit support** — wallets default to bech32 (`bc1q`) addresses via BIP84 derivation, with legacy P2PKH also supported
- **BIP44 account structure** — hierarchical deterministic wallets with account-based organization and xpub display
- **Two backend options** — connect to an Electrum server (TCP/TLS) or a Bitcoin Core node (HTTP RPC)
- **UTXO management** — automatic UTXO selection with largest-first algorithm and fee estimation

### Usage

Connect to an Electrum server:
```bash
skycoin web \
  --btc-electrum-url ssl://electrum.blockstream.info:50002 \
  --wallet-dir ~/.skycoin/wallets
```

Or connect to a Bitcoin Core node:
```bash
skycoin web \
  --btc-node-url http://user:pass@127.0.0.1:8332 \
  --wallet-dir ~/.skycoin/wallets
```

Bitcoin wallets appear alongside Skycoin and Fibercoin wallets in the UI. The interface adapts for Bitcoin — coin hours are hidden (Bitcoin has no equivalent), and decimal precision is set to 8 places.

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

### How It Works

Bitcoin support is built using Skycoin's existing secp256k1 cryptographic library for transaction signing, with raw transaction construction for both P2PKH and P2WPKH outputs. No external Bitcoin libraries are required. The backend handles UTXO fetching, balance queries, transaction history, fee estimation, and broadcast through the configured Electrum or Bitcoin Core endpoint.

### Security

As with Skycoin wallets, private keys are managed locally via `--wallet-dir`. Bitcoin and Skycoin wallets share the same wallet directory. Keys never leave your machine — transactions are signed locally and only the signed transaction is broadcast.
