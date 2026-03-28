+++
date = "2026-03-17"
tags = ["Development", "Skycoin", "Skywire"]
title = "Development Update — March 17"
+++

### Happy Birthday, Skycoin Blockchain

Eleven years ago today — March 17, 2015 — the Skycoin genesis block was created. The chain has been running continuously ever since, through organizational splits, team changes, and complete codebase rewrites. Block 194,634 and counting.

### Skycoin: Web Wallet Hardening

A dense day of web wallet improvements:

**BIP44 account support** — the desktop wallet (skycoin-web) now properly supports BIP44 multi-account structure with encrypted seed storage. The `beforeunload` handler was fixed to prevent accidental data loss.

**Hardware wallet support** — Skywallet integration was added to skycoin-web, enabling transaction signing with hardware wallet devices directly from the thin client interface.

**Request chunking** — GET requests for balance and outputs are now chunked to avoid URI length limits when querying many addresses. Read-only POST requests are forwarded as POST instead of being converted to GET, which was causing failures with large address sets.

**Wallet encryption UI** — server-managed wallets can now be encrypted and decrypted from the UI.

**Lint and test fixes** — golangci-lint v2.6.1 errcheck and gosec errors were fixed across the codebase. WASM binaries were rebuilt. BIP44 integration test golden files were updated with the new `accounts` field.

### Skywire: Bandwidth-Based Rewards

The transition to bandwidth-based rewards landed in PR #2221 — one of the largest PRs in Skywire's recent history at nearly 10,000 lines changed across 80 files.

**Two-pool reward model** — Pool 1 distributes equally to all uptime-eligible visors. Pool 2 distributes proportionally based on bandwidth. Both are additive per visor.

**`bw-collect` subcommand** — fetches per-transport bandwidth from the TPD, filters out same-LAN transports using survey IP data, and writes daily bandwidth stats. Designed to run hourly via systemd.

**Accept loop fixes** — the same accept-loop-dying-on-transient-error pattern found in DMSG yesterday was found and fixed across seven more Skywire components: STCPR transport, VPN server, sky ping, sky forwarding, latency probe, raw TCP forwarding, and the app process manager.

**Panic fixes** — bounds checks added for VPN/proxy client address parsing, nil dereference guards for DMSG client summary, off-by-one fix in public visor slice bounds, and a logic error fix in bandwidth stats (`||` should have been `&&`).

### DMSG: Shutdown Logging Fix

The `dmsgctrl` shutdown was producing noisy log spam on clean exits (#346). Fixed by checking for context cancellation before logging errors.
