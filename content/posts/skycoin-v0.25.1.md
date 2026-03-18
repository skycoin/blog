+++
date = "2019-02-09"
tags = ["Announcements", "Skycoin"]
title = "Skycoin v0.25.1 Released"
+++

### Skycoin v0.25.1

Skycoin v0.25.1 has been released and is available from [GitHub](https://github.com/skycoin/skycoin/releases/tag/v0.25.1).

- **Address transactions CLI** — new `addressTransactions` command to view transaction history for an address
- **Seed verification API** — new `/api/v2/wallet/seed/verify` endpoint to validate BIP39 mnemonic seeds
- **Transaction history filtering** — filter transactions in the History view in the wallet UI
- **CLI migrated to Cobra** — switched from `urfave/cli` to `spf13/cobra` for improved command structure; all options now use `--` prefix
- **Optimized base58** — faster address encoding/decoding
- **Windows fix** — resolved "Error#1" on desktop wallet startup

### Install

Downloads are available on the [GitHub release page](https://github.com/skycoin/skycoin/releases/tag/v0.25.1) for Linux, Windows, and macOS.
