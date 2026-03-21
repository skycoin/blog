+++
date = "2026-03-21"
tags = ["Announcements", "Skycoin"]
title = "Skycoin v0.28.4 Released"
+++

### Skycoin v0.28.4

Skycoin v0.28.4 has been released and is available from [GitHub](https://github.com/skycoin/skycoin/releases/tag/v0.28.4).

This release focuses on Fibercoin support, dynamic branding, and toolchain improvements:

- **Dynamic ASCII art branding** — all help menus (`skycoin`, `skycoin daemon`, `skycoin cli`, `skycoin web`, `skycoin explorer`) now display the configured coin's name in ASCII art when `FIBER_TOML` is set. CLI defaults (`RPC_ADDR`, `COIN`, `DATA_DIR`) also adapt automatically.
- **Fibercoin compatibility** — empty string overrides in `fiber.toml` now work correctly (e.g., `peer_list_url = ""` disables peer list download instead of falling through to Skycoin defaults). Added `--legacy-peer-compat` flag for connecting to older Fibercoin nodes that don't send blockchain pubkey during handshake.
- **`newcoin templates` subcommand** — print the embedded code generation templates to stdout, so users can customize them without cloning the source. The `--template-dir` flag now works to override embedded templates.
- **`cli halt` command** — gracefully shut down a running daemon via the CLI.
- **`--gui-dir` flag for `skycoin web`** — override the embedded web wallet frontend with a custom GUI directory.
- **Fibercoin support verified** — tested and documented with [AIX](/posts/guide-multicoin-wallet/) and [Privateness (NESS)](/posts/guide-multicoin-wallet-2/).
- **Security fixes** — npm audit fixes across all frontend directories, bumped flatted to 3.4.2, removed deprecated protractor from explorer (eliminating 10 vulnerabilities).
- **Build improvements** — updated to Go 1.26, golangci-lint v2.11.3, replaced goreleaser with `go install` in release workflow, updated GitHub Actions to Node.js 24.

Builds are available for Linux (amd64, arm64, armhf, arm, 386, riscv64), macOS (amd64, arm64), and Windows.

### Install

Downloads are available on the [GitHub release page](https://github.com/skycoin/skycoin/releases/tag/v0.28.4).

See also: [Skycoin: One Binary, Every Tool](/posts/skycoin-unified-binary/) | [Creating Your Own Fibercoin](/posts/guide-creating-a-fibercoin/)
