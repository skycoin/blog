+++
date = "2026-03-21"
tags = ["Guides", "Skywire"]
title = "Guide: Skywire VPN — Encrypted Tunneling Over the Skywire Network"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire VPN

Skywire includes a full VPN that tunnels all of your internet traffic over the Skywire network. Unlike traditional VPNs that rely on centralized servers, Skywire VPN routes traffic through Skywire's peer-to-peer transport layer — encrypted end-to-end, with no central authority controlling the infrastructure.

Any Skywire visor can act as a VPN server, and any visor can connect as a client. Traffic is routed over STCPR or SUDPH transports (direct peer-to-peer connections), not through DMSG relays.

---

### Prerequisites

Both the VPN server and client require a running Skywire visor.

---

### Running a VPN Server

The VPN server is **Linux only** — it creates a TUN interface to route client traffic. It starts automatically by default when running a visor.

#### Start/Stop at Runtime

You can start, stop, and check the VPN server while the visor is running:

```bash
skywire cli vpn server start
```

```bash
skywire cli vpn server stop
```

```bash
skywire cli vpn server status
```

To restrict access to specific public keys:

```bash
skywire cli vpn server start \
  --whitelist <allowed-pk-1>,<allowed-pk-2>
```

#### Server Flags

```text
$ skywire cli vpn server start --help
Start the VPN server

Flags:
  -i, --netifc string      network interface for VPN traffic
      --secure             forbid connections from clients to server local network (default true)
  -w, --whitelist string   comma-separated list of public keys allowed to connect (empty = allow all)
```

The `--secure` flag (on by default) prevents VPN clients from accessing the server's local network — they can only route through it to the internet.

---

### Connecting as a VPN Client

#### Find Available VPN Servers

List VPN servers registered in the service discovery:

```bash
skywire cli vpn list
```

Filter by country:

```bash
skywire cli vpn list -c US
```

Show only the count of available servers:

```bash
skywire cli vpn list --stats
```

#### Connect to a VPN Server

```bash
skywire cli vpn start -k <server-public-key>
```

Once connected, all of your internet traffic is routed through the remote visor. Your public IP will be the server's IP.

#### Check Status

```bash
skywire cli vpn status
```

#### Disconnect

```bash
skywire cli vpn stop
```

#### VPN Client Flags

```text
$ skywire cli vpn start --help
start the vpn for <public-key>

Flags:
      --existing-tp    only use existing transports, don't create new ones
  -k, --pk string      server public key
  -t, --timeout int    starting timeout value in second
```

#### VPN UI

The VPN client also has a web UI:

```bash
skywire cli vpn ui
```

This opens the VPN interface in your default browser, where you can browse servers, connect, and monitor status visually.

---

### How It Works

1. The **client** establishes a Skywire route to the **server** visor using STCPR or SUDPH transports
2. The client creates a local TUN interface and routes all traffic through it
3. Traffic is encrypted and forwarded over the Skywire route to the server
4. The **server** creates a TUN interface, receives the traffic, and forwards it to the internet
5. Responses travel back through the same encrypted route

All traffic between client and server is encrypted by the Skywire transport layer. The VPN server sees your traffic (it exits to the internet from the server's IP), but unlike traditional VPNs, there is no central VPN company — any visor operator can be a VPN server.

---

### Security Considerations

- **The VPN server operator can see your traffic** (same as any VPN exit node). Use HTTPS for sensitive sites.
- **Your IP is hidden from destination servers** — they see the VPN server's IP instead.
- **The `--secure` flag** (on by default) prevents clients from accessing the server's LAN. Don't disable this unless you know what you're doing.
- **Whitelist support** — restrict which public keys can connect to your VPN server with `--whitelist`.

---

```text
$ skywire cli vpn --help
VPN client

Available Commands:
  server    VPN server control
  start     start the vpn for <public-key>
  stop      stop the vpnclient
  status    vpn client status
  list      List servers
  ui        Open VPN UI in default browser
  url       Show VPN UI URL
```

See also: [Skywire SOCKS5 Proxy](/posts/guide-skywire-proxy/) | [Skynet Port Forwarding](/posts/skynet-port-forwarding/) | [Running a Public Visor](/posts/running-a-public-visor/) | [Skywire: One Binary, Everything You Need](/posts/skywire-unified-binary/)
