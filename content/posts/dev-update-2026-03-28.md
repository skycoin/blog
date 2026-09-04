+++
date = "2026-03-28"
tags = ["Development", "Skycoin", "Skywire"]
title = "Skywire Development Update — March 28, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: LAN DMSG Server in the Hypervisor

A clever optimization for LAN-based Skywire deployments: the hypervisor can now run an **embedded DMSG server** on the local network. LAN visors connect to it preferentially instead of routing all their DMSG traffic through public relay servers on the internet.

**How it works** — the hypervisor starts a private DMSG server on the LAN with a persisted keypair. It uses `direct.NewClient` for in-memory discovery (no public registration with the DMSG Discovery). A `GET /api/lan-dmsg-server` endpoint exposes the server's public key and address for auto-discovery by LAN visors. A `lanPriorityDisc` wrapper prepends the LAN server entries to discovery results, so visors connect to it before trying public servers.

**Zero configuration** — for the hypervisor, just set `enable: true` in the new `LANDmsgServerConf` section of the hypervisor config. LAN visors can be configured manually or auto-discover via the hypervisor API.

The practical implication: on a LAN deployment (e.g., a home with multiple Skywire visors, or a small office), visor-to-visor communication no longer has to traverse the public internet twice. Traffic stays local, latency drops significantly, and the public DMSG servers are freed from carrying LAN traffic.

**Comprehensive tests** were added for the LAN DMSG server, keypair persistence and corruption recovery, and the `lanPriorityDisc` wrapper.

### Skywire: Hypervisor UI CPU Spike Fix

**OnPush change detection** — the transport-list and route-list components in the hypervisor UI were reprocessing all data (label lookups, filtering, sorting) on every 10-second poll, even when nothing had changed. With many transports, this caused browser CPU spikes that made the UI unresponsive.

Three fixes: Angular's `ChangeDetectionStrategy.OnPush` was added to both components, full reprocessing is now skipped when transport/route IDs haven't changed, and for transports, only the sent/recv counters are updated on unchanged lists. Explicit change detection is triggered only when data actually changes.

This makes the hypervisor UI usable on deployments with many transports — a problem that had been quietly degrading the experience for operators running public visors with large peer counts.

### Skywire: Login Chain Funding Fixes

Continued work on the Fibercoin-based login chain for the reward system:

**Debug logging for createRawTransaction** — the command was failing silently during login chain funding. Now it logs the full command being run, captures stderr for diagnostics, and includes output in error messages (#2262).

**BIP44 xpub depth validation** — a subtle bug in the reward system's xpub handling. The Skycoin web wallet displays the **external chain** xpub (depth 4, path `m/44'/coin'/0'/0`), but the login system needs the **account-level** xpub (depth 3, path `m/44'/coin'/0'`). Users were setting the wrong xpub and getting cryptic failures. Added:

- `CheckXpubDepth` to reject chain-level xpubs with a clear error message
- A depth check and error page in the login UI explaining the BIP44 hierarchy
- A warning in `skywire cli reward` when setting a depth-4 xpub
- Documentation in the reward command help with a BIP44 path diagram pointing users to `walletKeyExport --path=0` for the correct account-level xpub
- `-W` flag to `skywire cli rewards loginchain` for specifying the working directory

### Skycoin: Server-Managed Wallet Signing

A correctness fix that completes the server-managed wallet support in `skycoin-web`:

**The right signing flow** — server-managed wallets (those created with `--wallet-dir`) store private keys locally in the `skycoin-web` process, not on the remote node. The previous code was either trying client-side WASM signing (requiring the user to enter their seed in the browser) or sending keys to the remote node. Neither was correct.

The proper flow for server-managed wallets:
1. Create an unsigned transaction on the remote node (`POST /transaction`)
2. Sign it locally using `skycoin-web`'s wallet service (`POST /wallet/transaction/sign`)
3. Inject the signed transaction back to the remote node

A new `handleSignTransaction` handler was added to deserialize the unsigned transaction, look up secret keys from the local wallet by input address, sign the transaction, and return the signed encoded bytes.

**Security documentation** — the `skycoin-web` README now has a proper Security Considerations section describing the trust implications of both web-only and server-managed modes. In server-managed mode, keys are managed locally by `skycoin-web` — the remote node only sees unsigned transactions and the final signed result.

**Wallet response deduplication** — `NewWalletResponse` and `entriesToReadable` were duplicated between `src/api/wallet.go` and `cmd/skycoin-web/commands/wallet_handlers.go`. The shared logic was moved to `src/readable/wallet.go`, which both packages can import without pulling in heavy node dependencies. `api.WalletResponse` is now a type alias for `readable.WalletResponse`.

### The Week's Thread

This week continued the themes from last week — resource exhaustion fixes, correctness improvements, and feature completion — but added a new emphasis on **local-first optimization**. The LAN DMSG server is the clearest example: instead of sending LAN traffic through public relay servers, keep it on the LAN. The hypervisor UI CPU fix is another: instead of reprocessing all data on every poll, only reprocess what changed. The server-managed wallet signing fix: instead of round-tripping to remote nodes or requiring seed entry, sign locally where the keys already are.

The pattern: do the work where the data is, don't move it unnecessarily.
