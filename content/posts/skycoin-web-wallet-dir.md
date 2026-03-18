+++
date = "2026-02-04"
tags = ["Announcements", "Skycoin"]
title = "Skycoin Web Thin Client: Local Wallet Directory Support"
+++

### Local Wallet Management in the Skycoin Web Thin Client

The `skycoin web` thin client wallet now supports managing wallets in a local directory, without requiring the remote node to have its wallet API enabled.

### Background

The Skycoin web wallet (`skycoin web`) is a thin client — a lightweight frontend that connects to a remote Skycoin node for blockchain data. Previously, wallet operations (creating wallets, signing transactions) were handled entirely by the remote node's API. This required trusting the remote node with wallet access, which is not ideal for security.

### What Changed

The new `--wallet-dir` flag tells the thin client to manage wallets locally on the machine running `skycoin web`. The thin client still queries the remote node for blockchain data (balances, unspent outputs, transaction broadcast), but all wallet operations — key generation, seed storage, transaction signing — happen locally.

### Usage

```
skycoin web --node-url http://your-node:6420 --wallet-dir ~/.skycoin/wallets
```

This starts the web wallet UI, connected to the remote node for blockchain data, but using the local `~/.skycoin/wallets` directory for wallet files. The `--enable-seed-api` flag can be added to allow seed retrieval through the UI.

### Security Benefit

With local wallet directory support, you can run a Skycoin node with the wallet API disabled (the default secure configuration) and still use the web wallet for transactions. Your private keys never leave your local machine.

This feature is included in [Skycoin v0.28.3](https://github.com/skycoin/skycoin/releases/tag/v0.28.3).
