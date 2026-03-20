+++
date = "2024-02-09"
tags = ["Announcements", "Skywire", "Privacy"]
title = "DmsgWeb: Anonymous Websites Over DMSG"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### DmsgWeb — Anonymous Port Forwarding Over DMSG

Skywire v1.3.17 introduces **DmsgWeb**, a new utility for hosting and accessing websites over the DMSG overlay network. DmsgWeb provides a resolving SOCKS5 proxy — similar to and inspired by I2P — that lets a web browser access sites hosted entirely within the DMSG network.

### How It Works

DmsgWeb operates in two modes:

**Client** (`skywire dmsg web`) — Runs a local SOCKS5 proxy that resolves `.dmsg` domains to DMSG public keys and routes traffic over the encrypted DMSG overlay. Configure your browser to use the proxy, and DMSG-hosted sites become accessible just like any other website. Non-DMSG traffic can optionally be routed through a Skywire SOCKS5 proxy for additional privacy.

**Server** (`skywire dmsg web srv`) — Exposes local TCP ports (such as a web server on `localhost:8086`) over DMSG. Supports public-key-based whitelisting for access control, raw TCP proxying, and multiple simultaneous port mappings.

### Privacy by Design

Because traffic travels through the DMSG overlay network rather than the public internet, both the server's and client's IP addresses remain hidden from each other. With Skywire's advanced routing, the already anonymous DMSG utilities can be made even more private by routing them through a Skywire SOCKS5 proxy connection.

### Getting Started

To host a site over DMSG:
```bash
skywire dmsg web srv -p 8086
```

To browse DMSG sites:
```bash
skywire dmsg web
```

Then configure your browser's SOCKS5 proxy settings to point at the local proxy address.

DmsgWeb is available starting with [Skywire v1.3.17](https://github.com/skycoin/skywire/releases/tag/v1.3.17).
