+++
date = "2026-03-16"
tags = ["Development", "Skycoin"]
title = "Skywire Development Update — March 16, 2026"
+++

### Skycoin: Bitcoin Wallet Support Lands

The biggest feature addition to Skycoin in years landed today: **full Bitcoin wallet support** in the `skycoin web` thin client.

**Bitcoin via Electrum and Bitcoin Core** — two new backend types were added to the web wallet: an Electrum client (TCP/TLS) and a Bitcoin Core RPC client. Both support UTXO fetching, balance queries, transaction history, fee estimation, and broadcast (#2815 baseline, with Bitcoin-specific code in this commit).

**Native segwit (bech32)** — Bitcoin wallets default to BIP84 derivation with `bc1q` bech32 addresses. Legacy P2PKH addresses are also supported. The entire segwit/bech32 implementation was built from scratch using Skycoin's existing secp256k1 library — no external Bitcoin libraries were added.

**BIP44 GUI improvements** — the web wallet frontend gained account-level navigation, proper segwit address display, and coin-type filtering in the address generation UI.

The significance: one binary now manages Skycoin wallets, any Fibercoin wallet, and Bitcoin wallets from a single interface. Private keys for all three stay local.

### DMSG: Accept Loop Crash Fix

A critical bug was fixed in the DMSG library: non-fatal errors in accept loops were causing the goroutine to exit permanently, leaving the listener open at the kernel level but never accepting new connections (#345). This affected `dmsgctrl` ServeListener and both smux and yamux stream accept loops in the DMSG server. The fix distinguishes fatal errors from transient ones and continues accepting on non-fatal failures.

This same pattern — accept loops dying on transient errors — would be found and fixed across many more components in the coming days.
