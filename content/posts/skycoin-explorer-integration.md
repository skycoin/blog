+++
date = "2025-09-14"
tags = ["Announcements", "Skycoin"]
title = "Skycoin Blockchain Explorer Now Integrated into Skycoin"
+++

### Blockchain Explorer Integrated into the Skycoin Binary

The Skycoin blockchain explorer has been integrated directly into the Skycoin repository and can now be run as a subcommand of the unified Skycoin binary:

```
skycoin explorer
```

Previously, the explorer was maintained as a separate project and required its own deployment. Now it ships as part of every Skycoin release.

### What It Does

The explorer provides a web-based interface for browsing the Skycoin blockchain — blocks, transactions, addresses, and network statistics. It runs a local HTTP server (default `127.0.0.1:8001`) that serves a compiled Angular frontend and proxies API requests to a running Skycoin node.

### Usage

Start the explorer alongside a running Skycoin daemon:
```
skycoin explorer --node-addr http://127.0.0.1:6420
```

Then open `http://127.0.0.1:8001` in a browser to explore the blockchain.

Key flags:
- `--server-host` — bind address for the explorer web server (default `127.0.0.1:8001`)
- `--node-addr` — Skycoin node address to query (default `http://127.0.0.1:6420`)
- `--files-folder` — override the embedded UI with a custom frontend
- `--api-only` — run only the API proxy without serving the frontend

The frontend assets are embedded in the binary using Go's `embed` package, so no external files are needed.

The integrated explorer is included starting with [Skycoin v0.28.2](https://github.com/skycoin/skycoin/releases/tag/v0.28.2).
