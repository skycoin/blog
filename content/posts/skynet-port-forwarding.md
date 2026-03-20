+++
date = "2026-02-06"
tags = ["Announcements", "Skywire"]
title = "Skynet: TCP Port Forwarding Over Skywire"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skynet — Port Forwarding Over Skywire

Skywire now includes **Skynet**, a TCP port forwarding utility that lets any visor expose local services to the Skywire network. Unlike DmsgWeb which routes through DMSG relay servers, Skynet forwards traffic over Skywire's direct transport layer (STCPR, SUDPH, or DMSG transports), providing lower latency and higher throughput for peer-to-peer connections.

### How It Works

**Server side** — expose local ports to the Skywire network:
```bash
skywire cli skynet srv start --ports 8080,3000
```

**Client side** — connect to a remote visor's exposed port and map it locally:
```bash
skywire cli skynet start \
  --pk <remote-pubkey> \
  --remote 8080 \
  --local 9000
```

After connecting, `localhost:9000` reaches the remote visor's port 8080 through an encrypted Skywire route.

### Features

- **HTTP and raw TCP modes** — HTTP mode proxies web traffic with full request handling. Raw TCP mode (`--raw-tcp`) supports arbitrary protocols: SSH, databases, streaming, or any TCP service.
- **Dual network support** — connections can be routed over skynet (direct transports) or DMSG (relay-based), selectable with `--skynet` and `--dmsg` flags.
- **Multiple simultaneous instances** — run several forwarding sessions at once, each with a unique name based on port number.
- **Connection management** — use `skynet status` and `skynet stop` to monitor and control active sessions.
- **Public key whitelisting** — restrict which visors can connect to your exposed ports.

### Background

Port forwarding has been part of Skywire since early 2023 via the `fwd` and `rev` CLI commands. With this release, those commands have been consolidated under the `skynet` subcommand with a cleaner interface, dual-network support, and the ability to forward raw TCP traffic in addition to HTTP.

```text
$ skywire cli skynet --help
Skynet provides port forwarding over the Skywire network.

Client commands connect to remote skynet servers and forward traffic to localhost.
Multiple client instances can run simultaneously with different configurations.
Each instance gets a unique name (e.g., skynet-client-8080, skynet-client-3435).

Server commands (srv) expose local ports over the network.

Usage:
  skywire cli skynet

Available Commands:
  start     Start skynet client to connect to a remote server
  stop      Stop a skynet client instance
  status    Show skynet client status
  srv       Skynet port forwarding server
```

Skynet port forwarding is available starting with [Skywire v1.3.34](https://github.com/skycoin/skywire/releases/tag/v1.3.34).
