+++
date = "2026-04-23"
tags = ["Development", "Skywire", "Skynet"]
title = "Skynet: Port Forwarding, Website Hosting, and Direct Transport"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Over the past two weeks, Skynet went from a name and a concept to a working system. Every visor in the Skywire network can now host services — websites, APIs, custom applications — accessible to any other visor over the encrypted mesh, with no port forwarding on the router, no public IP address, and no DNS configuration.

### What Skynet Is

Skynet is Skywire's application-layer port forwarding system. It lets a visor expose local TCP ports to the network, accessible via `.skynet` domains through a resolving proxy. Think of it as a decentralized reverse proxy where the "internet" is the Skywire mesh.

A visor operator runs:
```
skywire cli skynet port add 8080 --label "My App" --landing
```

And any other visor can access it at `http://<pk>.skynet:8080/` through the skynetweb resolving proxy. The traffic flows over Skywire transports — encrypted, authenticated, and routed through the mesh.

### The Port Forwarding Model

Each forwarded port has rich metadata:

- **Label and description** — human-readable names shown on the landing page
- **Skynet and/or DMSG toggles** — choose which transport layers to expose on
- **PK whitelist** — restrict access to specific public keys (empty = open)
- **Landing page visibility** — whether the port appears on the visor's landing page at port 80
- **Proxy address** — forward to a local HTTP server

Data persists to `local/forwarded_ports.json` across visor restarts. DMSG listeners are created automatically for ports with `dmsg=true`.

### Three-Tier Access Control

Port 80 on every visor now serves a structured set of endpoints with tiered access:

1. `/health`, `/services` — open to everyone
2. `/node-info`, `/visor.log`, `/debug/pprof` — survey whitelist only
3. Website and forwarded ports — per-port PK whitelist

Each tier has independent access control. An operator can expose a public landing page while keeping debug endpoints restricted to their hypervisor PK.

### The Landing Page

Port 80 serves a landing page listing all forwarded ports with `show_on_landing` enabled. Each entry shows the label, description, and a link. This turns every visor into a service directory — visitors can see what's available without knowing port numbers in advance.

### Website Hosting

Two approaches for hosting a website on a visor:

**Reverse proxy** — run any HTTP server locally and point the forwarded port at it:
```
skywire cli skynet port add 80 --proxy-addr 127.0.0.1:3000 --label "My Site"
```

**Static file server** — use the built-in utility:
```
skywire cli util serve /path/to/site &
skywire cli skynet port add 80 --proxy-addr 127.0.0.1:<port> --label "My Site"
```

The reward system UI can be integrated the same way — run it on a localhost port and set `proxy_addr`. The visor's `/health` takes priority over the proxied application's `/health`, which is the correct behavior (visor health is the primary identity on port 80).

### Resolving Proxies: .dmsg and .skynet in the Browser

The resolving proxy chain gives browsers native access to `.dmsg` and `.skynet` domains:

```
Browser -> dmsgweb (.dmsg) -> skynetweb (.skynet) -> skysocks (clearnet)
```

A single command enables the full chain:
```
skywire cli visor proxies set dmsg on
```

This starts the dmsgweb proxy, auto-starts skynetweb, chains them together, and binds to `localhost:4445`. Point the browser's SOCKS5 proxy at it and both `.dmsg` and `.skynet` URLs resolve through the Skywire mesh.

The proxies are embedded in the visor process, sharing the existing DMSG client and router — no separate daemons, no extra connections.

### Skynet Curl

For scripts and automation:
```
skywire cli skynet curl skynet://02abc.../health
skywire cli skynet curl skynet://02abc...:8080/api/data -o output.json
skywire cli skynet curl skynet://02abc.../submit -d '{"key":"value"}'
```

Supports GET and POST, output to file, and arbitrary ports. The visor dials the route, performs the skynet handshake, sends the HTTP request, and returns the response.

### Direct Transport: Bypassing Route Setup

The biggest performance improvement: **for visors that share a direct transport (STCPR or SUDPH), skynet forwarding now uses `VStreamMux` on route ID 0 — no route setup node involved.**

Previously, every skynet connection went through the full routing stack: the visor contacted the route setup node, which dialed both endpoints, negotiated a route descriptor, and established a bidirectional forwarding path. This consumed RSN capacity, created ephemeral port pressure, and introduced latency.

Now, the skynetweb dialer checks for a direct transport first. If one exists, it opens a VStream directly — same encryption, same port dispatch, same handler, but zero route setup overhead. Multi-hop connections (no direct transport) still go through the routing mesh.

This was blocked by a subtle bug: `saveTransportInternal` was copying all route ID 0 handlers to new transports except `skynetFwdHandler`. New transports created via CLI or autoconnect silently dropped skynet packets. One missing field propagation.

### The Connection Journey

When a browser requests `http://02abc....skynet:8080/api/data`:

1. **DNS resolution**: the SOCKS5 resolver intercepts `.skynet`, returns `127.0.0.1` (preventing real DNS lookup on a fantasy TLD)
2. **SOCKS5 CONNECT**: the proxy opens a tunnel to the destination
3. **Transport check**: looks for a direct STCPR/SUDPH transport to the destination PK
4. **Direct path** (if transport exists): opens VStream on route ID 0 with `SkynetForwardPacket` type
5. **Routed path** (if no transport): `DialRoutes` through the DMSG mesh via route setup
6. **Port dispatch**: the destination visor's forwarding server reads the port number and connects to the local application
7. **Bidirectional proxy**: bytes flow between the browser and the local application over the encrypted tunnel

The entire path is encrypted (noise protocol on DMSG, or STCPR's TLS), authenticated (public key verification), and works through NATs (SUDPH hole-punching or STCPR relay).

### What's Next

Skynet is functional today but there are known areas for improvement:

- **WebSocket support** through the SOCKS5 tunnel needs more testing with long-lived connections
- **Per-port connection isolation** in the reverse proxy for multiple simultaneous port accesses
- **Service catalog aggregation** — collecting `/services` endpoints from multiple visors to build a network-wide directory

The foundations are in place. Every visor is now a potential web host, accessible from any other visor in the network, with no centralized infrastructure in the path.
