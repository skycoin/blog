+++
date = "2026-03-12"
tags = ["Announcements", "Skycoin"]
title = "Skycoin Web Wallet: Multi-Fibercoin Support"
+++

### Multi-Fibercoin Support in the Skycoin Web Wallet

The `skycoin web` thin client wallet now supports connecting to multiple Fiber blockchain nodes simultaneously, allowing you to manage wallets for Skycoin and any number of Fiber coins from a single interface.

### What Are Fibercoins?

A Fibercoin is any blockchain forked from Skycoin using the `skycoin newcoin` tool. Each Fibercoin has its own genesis block, peer list, coin name, ticker symbol, and coin hours denomination, defined in a `fiber.toml` configuration file. The Fiber architecture allows anyone to launch a new blockchain with Skycoin's consensus mechanism.

### How It Works

The `skycoin web` command now accepts multiple `--node-url` and `--wallet-dir` flags. On startup, it auto-discovers each coin's configuration (name, ticker, coin hours name, price ticker) by querying each node's health endpoint. The frontend dynamically loads the available coins and lets you switch between them.

### Usage

Connect to a Skycoin node and a Fibercoin node simultaneously:
```
skycoin web \
  --node-url http://localhost:6420 --wallet-dir ~/.skycoin/wallets \
  --node-url http://localhost:7420 --wallet-dir ~/.mycoin/wallets
```

The web wallet UI will show both coins, with wallet filtering and coin switching built in. Each coin's balances, transaction history, and wallet operations are handled independently.

### Technical Details

- **Auto-discovery** — coin name, ticker, and coin hours denomination are read from each node's `/api/v1/health` endpoint
- **Per-coin routing** — API requests are proxied to the correct node based on the selected coin
- **Independent wallet directories** — each coin's wallets are stored in their own directory
- **Fibercoin transaction support** — transactions use each node's own verification parameters rather than hardcoded Skycoin mainnet defaults, fixing broadcast issues for Fibercoins
