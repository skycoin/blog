+++
date = "2026-03-18"
tags = ["Announcements", "Skywire"]
title = "Skywire: One Binary, Everything You Need"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### The Unified Skywire Binary

The entire Skywire stack — visor, CLI, network services, DMSG utilities, native applications, bundled tools, and even the Skycoin blockchain — is compiled into a single binary. Install one program, get everything.

```
go run github.com/skycoin/skywire@develop
```

```
┌─┐┬┌─┬ ┬┬ ┬┬┬─┐┌─┐
└─┐├┴┐└┬┘││││├┬┘├┤
└─┘┴ ┴ ┴ └┴┘┴┴└─└─┘

Available Commands:
  visor     Skywire Visor
  cli       Command Line Interface for skywire
  svc       Skywire services
  dmsg      DMSG services & utilities
  app       Skywire native applications
  util      Bundled utility commands
  skycoin   Skycoin daemon & cli
```

### What's Included

#### `skywire visor` — The Skywire Node

Run a Skywire visor with transport management, routing, and the hypervisor UI for remote management.

#### `skywire cli` — Full Command Line Interface

21 subcommands for managing every aspect of a Skywire deployment:

- **config** — generate or update visor config
- **visor** — query the running visor
- **tp** / **tps** — view and manage transports
- **route** — view and set routing rules
- **vpn** — VPN client management
- **skynet** — [TCP port forwarding](/posts/skynet-port-forwarding/) over Skywire
- **dmsg** — DMSG utilities
- **reward** / **rewards** — Skycoin reward address and reward calculation
- **proxy** — SOCKS5 proxy client
- **survey** — system survey collection
- **ut** / **sd** / **mdisc** — uptime tracker, service discovery, and DMSG discovery queries
- **skychat** — messaging
- **log** — survey and transport log collection
- **pv** — public visor listing
- **gotop** — terminal-based system activity monitor

#### `skywire svc` — Network Services

All 13 Skywire infrastructure services, deployable from the same binary:

- **tpd** — Transport Discovery server
- **tps** — Transport Setup server
- **ar** — Address Resolver server
- **rf** — Route Finder server
- **ut** — Uptime Tracker server
- **sd** — Service Discovery server
- **sn** — Route Setup Node
- **nm** — Network Monitor (VPN and visor)
- **confbs** / **conf** — Config Bootstrap server and config printer
- **se** — Skywire environment generator
- **ip** — GeoIP service
- **stun** — STUN server

#### `skywire dmsg` — DMSG Services & Utilities

The full DMSG overlay network stack:

- **server** — DMSG relay server
- **disc** — DMSG Discovery server
- **web** — [DmsgWeb](/posts/dmsgweb-anonymous-port-forwarding/) resolving proxy for anonymous websites
- **curl** — fetch URLs over DMSG
- **http** — serve files over DMSG
- **pty** — pseudoterminal over DMSG
- **socks** — SOCKS5 proxy over DMSG
- **ip** — DMSG IP utility
- **conf** — deployment server config

#### `skywire app` — Native Applications

All Skywire applications, runnable standalone or managed by the visor:

- **vpn-server** / **vpn-client** — Skywire VPN
- **skysocks** / **skysocks-client** — SOCKS5 proxy server and client
- **skychat** — peer-to-peer messaging
- **skynet-srv** / **skynet-client** — port forwarding server and client

#### `skywire util` — Bundled Utilities

Handy tools included in the binary:

- **jq** — JSON processor (gojq)
- **edit** — terminal text editor (femto)
- **got** — HTTP client with concurrent downloads

#### `skywire skycoin` — Skycoin Blockchain

The [full Skycoin toolchain](/posts/skycoin-unified-binary/) is embedded:

- **daemon** — Skycoin full node
- **web** — thin client web wallet (multi-Fibercoin and Bitcoin support)
- **cli** — Skycoin command line interface
- **newcoin** — Fibercoin creation tool
- **explorer** — blockchain explorer with embedded UI

### Why One Binary?

- **Simple deployment** — one download, one install, everything works
- **No dependency management** — static binaries with embedded frontends and templates
- **Consistent versioning** — every component shares the same version and is tested together
- **Flexible** — run just a visor, just the CLI, deploy a service, or use the Skycoin wallet — all from the same binary
- **Fibercoin ready** — set `FIBER_TOML` and the embedded Skycoin tools adapt to any Fiber blockchain

Platform builds are available for Linux (amd64, arm64, armhf, arm, 386, riscv64), macOS, and Windows from the [GitHub releases](https://github.com/skycoin/skywire/releases).
