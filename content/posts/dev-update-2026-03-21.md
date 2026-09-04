+++
date = "2026-03-21"
tags = ["Development", "Skycoin", "Skywire"]
title = "Skywire Development Update — March 21, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skycoin: Dynamic Fibercoin Branding and v0.28.4

The final push for Skycoin v0.28.4:

**Dynamic ASCII art for all help menus** — setting `FIBER_TOML` now makes every help menu (`skycoin`, `skycoin daemon`, `skycoin cli`, `skycoin web`, `skycoin explorer`) display the configured coin's name in ASCII art. The daemon description, CLI defaults (`RPC_ADDR`, `COIN`, `DATA_DIR`), and web wallet branding all adapt automatically. A `cli halt` command was added for graceful daemon shutdown (#2825).

**fiber.toml empty string overrides** — setting `peer_list_url = ""` or `explorer_url = ""` in a fiber.toml now correctly disables those features instead of falling through to Skycoin's defaults. The CLI's `RPC_ADDR` default also adapts to the configured coin's `web_interface_port` when `FIBER_TOML` is set (#2827).

**Security and dependency updates** — `flatted` was bumped to 3.4.2, `npm audit fix` was run across all npm directories, deprecated `protractor` was removed from the explorer (eliminating 10 vulnerabilities), and a `--gui-dir` flag was added to `skycoin web` for custom frontend overrides (#2826).

**Build system modernization** — goreleaser was replaced with `go install` in the release workflow, Go was updated to 1.26, golangci-lint was updated to v2.11.3, and the release verification step now prints the full help menu to confirm branding works (#2825).

**Documentation** — updated docs for all new features and commands.

### Skywire: Release Preparation for v1.3.37

**Skycoin vendor update** — the embedded Skycoin was updated to v0.28.4 (tagged release) with all the Fibercoin branding and compatibility improvements (#2236).

**Windows build fixes** — `pkg-config`, libusb include paths, and MSYS2 PATH were added to the Windows release workflow. CGO_ENABLED matrix was aligned with the Skycoin build, and arm64 was added as a Windows target (#2237, #2238).

**MSI installer images** — the Windows release workflow now fetches the MSI installer header images correctly (#2240).

**Ping timeout** — the 10-second timeout for ping route handshakes was finalized and merged (#2234), completing the route multiplexing stability work from yesterday.

### The Week in Summary

Looking back at the week as a whole:

- **Bitcoin support** went from zero to full (Electrum + Bitcoin Core, segwit, BIP44 accounts, UTXO management) in the Skycoin web wallet
- **32 bugs were fixed** in the DMSG library in a single day, with server fallback and comprehensive tests
- **Route multiplexing** was implemented and stabilized in Skywire
- **Bandwidth-based rewards** were added to Skywire with a two-pool model
- **Dynamic Fibercoin branding** was completed across all Skycoin help menus
- **Accept loop crashes** were found and fixed across DMSG, Skywire transport, VPN, proxy, and routing components — a systemic reliability improvement
- **Skycoin v0.28.4** and **Skywire v1.3.37** are ready for release

The thread connecting most of this work: making the software production-ready. The DMSG bug fixes, accept loop hardening, transport registration improvements, and route multiplexing all address failure modes that only appear under real network load. The Fibercoin branding and Bitcoin support extend what the same binary can do without adding deployment complexity. One binary, more capabilities, fewer ways to break.
