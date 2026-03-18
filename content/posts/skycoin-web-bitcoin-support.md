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
```
skycoin web --btc-electrum-url tcp://your-electrum-server:50001 --btc-wallet-dir ~/.skycoin/btc-wallets
```

Or connect to a Bitcoin Core node:
```
skycoin web --btc-node-url http://localhost:8332 --btc-wallet-dir ~/.skycoin/btc-wallets
```

Bitcoin wallets appear alongside Skycoin and Fibercoin wallets in the UI. The interface adapts for Bitcoin — coin hours are hidden (Bitcoin has no equivalent), and decimal precision is set to 8 places.

### How It Works

Bitcoin support is built using Skycoin's existing secp256k1 cryptographic library for transaction signing, with raw transaction construction for both P2PKH and P2WPKH outputs. No external Bitcoin libraries are required. The backend handles UTXO fetching, balance queries, transaction history, fee estimation, and broadcast through the configured Electrum or Bitcoin Core endpoint.

### Security

As with Skycoin wallets, private keys are managed locally via the `--btc-wallet-dir` flag. Keys never leave your machine — transactions are signed locally and only the signed transaction is broadcast.
