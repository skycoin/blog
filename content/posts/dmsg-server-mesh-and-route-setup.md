+++
date = "2026-04-09"
tags = ["Skywire", "DMSG"]
title = "DMSG Server Mesh and the End of the Standalone Setup-Node"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Two Architectural Changes That Belong Together

Over the past two weeks, two changes landed in the DMSG layer that together represent the most significant topological simplification of Skywire in its history: **DMSG servers can now peer with each other** to form a mesh, and **route setup can run directly inside a DMSG server** instead of as a standalone service.

The first change is deployed and in active use. The second is deployed in the DMSG server binary but visors are not currently configured to use DMSG servers as their route setup nodes — the standalone setup-node continues to serve production traffic. The capability exists and works; the rollout is just a matter of updating visor deployment configs.

This article walks through both changes and why they matter.

---

### The Old Design: Server Stickiness

DMSG's original design had a hard constraint: **clients must be connected to the same server to communicate**. A DMSG client establishes a session with one or more DMSG servers, and to reach another client, it opens a stream through a server that both parties share.

If Alice is connected to Server A and Bob is connected to Server B, they can only communicate if:

1. Alice also connects to Server B, or
2. Bob also connects to Server A, or
3. They both happen to already share some third server

In practice, DMSG clients connected to multiple servers by default (typically 2–3) to maximize the chance of overlap. But this was a brittle solution — it hid the scaling problem rather than solving it. Three servers means each client holds three long-lived TCP connections. Ten servers means ten TCP connections per client. Adding more servers improves reach but linearly increases resource usage on every client.

And the fundamental ceiling remained: if the network grew past the point where every client could be reached via a small fixed number of servers, new clients would start being unreachable to existing clients.

---

### The Server-to-Server Mesh (#356)

The fix was elegant: **let servers peer with each other as clients**.

A DMSG server runs a client inside itself. When configured with peer addresses, it establishes sessions to those peer servers using the existing session mechanism — TCP with the noise XK handshake over yamux, the same protocol clients use. No new transport code was needed.

When a client's request arrives at Server A destined for a client that isn't connected to Server A, the server:

1. Checks its local session map for the destination — if present, forward directly
2. If not present, checks its peer server sessions — for each peer, try to forward the request through
3. If still not found, return "not found" to the original client

**One-hop maximum.** Peer servers only check their local sessions — they don't try to forward to further peers. This prevents infinite loops without needing TTL fields in the wire protocol. A two-hop path is possible but requires the destination server to be a direct peer of the server the client is connected to.

**The original `SignedObject` is forwarded as-is.** The client signature on the frame is preserved end-to-end. The peer server simply writes the frame to its local session with the destination client. The destination client validates the signature and the sender public key exactly as it would for a direct client-to-server communication — it can't tell (and doesn't need to know) that the frame was relayed through a peer.

**Static peer configuration.** Peer servers are configured in static config files, not via discovery. This is deliberate: the operator controls which servers peer with which, and there's no mechanism for a malicious server to inject itself into the mesh and intercept traffic.

**Backward compatible.** No wire protocol changes. Existing clients work unchanged. A client connected to a mesh-peered server can reach clients on other peered servers without knowing the mesh exists, and a client connected to a non-peered server sees the old behavior.

### Why This Matters for Scaling

Before the mesh: if you run 4 DMSG servers and want to ensure all clients can reach all other clients with high probability, each client must connect to 3–4 servers. Running one more server means every client opens one more session.

After the mesh: clients can connect to a single server (or a small fixed number for redundancy) and still reach any client in the entire mesh. Adding more servers scales reach horizontally without touching client connection counts. The mesh can grow arbitrarily while individual clients stay lightweight.

This also opens up deployment patterns that were previously impractical:

- **Regional DMSG servers** — deploy servers in different geographic regions, peer them together, and clients automatically get low-latency connections to their closest regional server while retaining reachability to the whole network
- **Private subnets** — a company can run its own DMSG server that peers with the public mesh, giving employees DMSG access from internal networks without opening every client to the public internet
- **LAN DMSG servers** — [the hypervisor's embedded LAN DMSG server](/posts/dev-update-2026-03-30/) benefits directly. A visor connected to the LAN server can reach clients on public servers through the peering relationship, so operators get low-latency local communication plus full network reach

---

### The Old Setup-Node Architecture

Parallel to DMSG, Skywire has the **route setup-node**, a service that handles route creation between visors. When a visor wants to establish a route to another visor (for a VPN connection, a proxy session, Skynet port forwarding, or any other Skywire application), it sends a route request to a setup-node.

The setup-node:

1. Looks up the destination visor in the service discovery
2. Opens a DMSG stream to the destination
3. Exchanges route setup messages with the destination
4. Returns a route handle to the requesting visor

Historically, the setup-node was a standalone binary (`skywire-setup-node`) that operators had to deploy and maintain separately. It needed its own DMSG client to reach visors, which meant it held its own ephemeral ports, its own sessions, and its own goroutines.

This setup had friction:

- **Another service to deploy.** Anyone running a Skywire deployment needed to stand up at least one setup-node in addition to the TPD, Address Resolver, Route Finder, Service Discovery, Uptime Tracker, and all the other infrastructure services.
- **Separate DMSG client.** The setup-node's DMSG client competed with visor DMSG clients for ephemeral ports on the same hosts, leading to [port exhaustion issues](/posts/dev-update-2026-04-07/) that the recent fixes had to work around.
- **Forwarding overhead.** A visor on Server A wanting to set up a route to a visor on Server B had to go through a setup-node that might itself be on Server C. The setup messages went Visor(A) → Setup-Node(C) → Visor(B), with all three parties needing DMSG sessions to each other. If A and C didn't share a server, setup failed.

---

### Route Setup Inside the DMSG Server

The change: **the DMSG server now serves three endpoints on its own direct client**:

- `/health` on DMSG port 80 (HTTP) — service health + build info
- `/debug/pprof` on DMSG port 81 (debug) — profiling, unchanged from before
- **Route setup-node on DMSG port 36 (RPC) — route setup for visors**

The setup-node runs inside the DMSG server process, using the server's own DMSG client which connects through the server itself. The architectural implications are significant.

**For visors on the same DMSG server:** route setup is local. The visor's request for route setup arrives at the server as a stream to DMSG port 36. The server's internal setup-node handles the request using its own DMSG client, which finds the destination visor in the server's local session map (because it's on the same server). The entire exchange happens without any forwarding — just local frame copies between streams.

**For visors on different DMSG servers:** the server-to-server mesh handles forwarding transparently. The setup-node's DMSG client on Server A opens a stream to the destination visor on Server B. The mesh relays the stream through the peering relationship. As far as the setup-node code is concerned, it's just dialing a stream — the mesh is invisible to it.

This means:

- **No standalone setup-node needed.** Operators running a DMSG server get route setup for free.
- **No separate DMSG client.** The server's existing client serves all three endpoints (health, pprof, setup), sharing ports and sessions efficiently.
- **Ephemeral port exhaustion goes away** for the setup path. The setup-node was previously one of the worst offenders for port leaks during dial failures; integrating it into the DMSG server means it shares the server's own session pool.
- **Route setup becomes trivially distributed.** Every DMSG server in the mesh can handle route setup for its local clients. There's no longer a single point of failure (the standalone setup-node) or a bottleneck (the visor's one configured setup-node).

### Current Deployment Status

The capability is in the DMSG server binary. An `enable_route_setup` config flag controls whether a given server advertises its route setup service. `/health` tests and E2E integration were added in PR #788415546.

**However, production visors are not currently configured to use DMSG servers as their route setup nodes.** The existing standalone setup-node continues to handle route setup for the public Skywire deployment. The visor configs still point to the traditional setup-node addresses.

This is a deliberate rollout strategy. The new architecture works in E2E tests, but the switch from "route setup via standalone service" to "route setup via DMSG server port 36" is a change that touches every visor in the network, and the operational characteristics under real production load haven't been fully characterized yet. A gradual rollout — test deployment first, then a subset of production visors, then the full network — is the safer path.

What you can do today: if you're running a private Skywire deployment, you can enable `enable_route_setup` on your DMSG server and configure your visors to point at that server for route setup. The public deployment will migrate when the operators are ready.

---

### The Bigger Picture: Collapsing Service Categories

These two changes together represent something Skywire has been working toward for a long time: **collapsing service categories into the services you already have**.

Skywire's original architecture had many separate services: DMSG servers, DMSG discovery, transport discovery, service discovery, route finder, address resolver, setup-node, uptime tracker, and more. Each service ran as its own binary, with its own config, its own deployment, and its own failure modes.

Over the past year, this has been gradually consolidating:

- **Skywire unified binary** (March 2024) — all services compile into a single `skywire` binary invoked via subcommands
- **DMSG merged into Skywire** (April 2026) — DMSG is no longer a separate Go module
- **Route setup integrated into DMSG server** (April 2026) — the setup-node becomes a feature of an existing service rather than a standalone service
- **Server-to-server mesh** (March 2026) — DMSG servers peer with each other, reducing the need for every client to connect to every server

The direction of travel: fewer independent services, more features composed together inside a smaller number of processes. The more that can be collapsed into the DMSG server (which every deployment needs anyway), the less operational overhead there is to running Skywire infrastructure.

The route setup-node integration is a proof of concept for this pattern. If it works in production, there's no reason the address resolver couldn't be similarly integrated, or the transport discovery, or several other infrastructure components. The DMSG server becomes the nucleus of a regional Skywire deployment, with everything else either running inside it or running as a thin wrapper around its DMSG client.

See also: [Guide: DMSG — The Encrypted Overlay Network](/posts/guide-dmsg-deployment/) | [The Evolution of the Skywire Codebase](/posts/skywire-codebase-evolution/) | [Skywire v1.3.37 Released](/posts/skywire-v1.3.37/)
