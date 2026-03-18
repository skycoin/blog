+++
date = "2019-06-01"
tags = ["Announcements", "Skycoin"]
title = "Skycoin v0.26.0 Released"
+++

### Skycoin v0.26.0

Skycoin v0.26.0 has been released and is available from [GitHub](https://github.com/skycoin/skycoin/releases/tag/v0.26.0).

This is a major release with multi-language support, unsigned transactions, and several breaking API changes:

- **Multi-language wallet UI** — added Spanish and Simplified Chinese language options with a language selector
- **USD conversion** — send coins by entering the equivalent amount in USD
- **Unsigned transactions** — create and sign transactions in separate steps via the API
- **Transaction notes** — new `/api/v2/data` APIs for transaction notes and generic key-value storage
- **BIP32 support** — preliminary HD wallet support via new `bip32` package
- **Address count command** — `addresscount` CLI command returns the count of addresses with unspent outputs
- **Coinhour burn rate change** — burn rate changed to 10%
- **Performance** — `skyencoder`-generated binary encoders replace reflection-based ones for faster serialization
- **Stricter security** — tightened Content-Security-Policy header, genesis block hash verification in peer connections

**Breaking changes:** Removed unversioned REST API, JSON-RPC 2.0 interface, `/api/v1/wallet/spend` and `/api/v1/explorer/address` endpoints. See the [migration guide](https://github.com/skycoin/skycoin/blob/develop/src/api/README.md) for details.

### Install

Downloads are available on the [GitHub release page](https://github.com/skycoin/skycoin/releases/tag/v0.26.0) for Linux, Windows, and macOS.
