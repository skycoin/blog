+++
date = "2018-07-26"
tags = ["Announcements", "Skycoin"]
title = "Skycoin v0.24.0 Released"
+++

### Skycoin v0.24.0

Skycoin v0.24.0 has been released and is available from [GitHub](https://github.com/skycoin/skycoin/releases/tag/v0.24.0).

This release brings wallet encryption, API versioning, and the Fiber coin creator tool:

- **Wallet encryption/decryption** — new CLI commands `encryptWallet`, `decryptWallet`, and `showSeed` for securing wallets with passwords
- **12/24 word seed support** — option to generate 12 or 24 word mnemonic seeds when creating new wallets
- **API versioning** — all endpoints now prefixed with `/api/v1/`, beginning the `/api/v2` beta endpoints
- **Transaction verification** — added "Send" page verification step and new `POST /api/v2/transaction/verify` endpoint
- **Advanced spend UI** — new advanced spending interface in the wallet
- **Coin creator tool** — `cmd/newcoin` for quickly bootstrapping new Fiber coins
- **libskycoin 0.0.1** — initial release of C bindings for cipher operations
- **Improved syncing** — reduced connection disconnects for more reliable blockchain synchronization
- **Unified RPC/REST interface** — JSON 2.0 RPC now served on the same port (6420) as the REST API

### Install

Downloads are available on the [GitHub release page](https://github.com/skycoin/skycoin/releases/tag/v0.24.0) for Linux, Windows, and macOS.
