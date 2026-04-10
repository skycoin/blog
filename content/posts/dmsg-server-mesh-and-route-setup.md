+++
date = "2026-04-09"
tags = ["Skywire", "DMSG"]
title = "DMSG Server Mesh and DMSG Server-Hosted Route Setup"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Two Architectural Changes That Belong Together

Over the past two weeks, two changes landed in the DMSG layer that together offer significant flexibility in how Skywire deployments can be structured: **DMSG servers can now peer with each other** to form a mesh, and **a DMSG server can optionally run a route setup-node as an integrated service** on one of its DMSG ports.

The first change is deployed and in active use. The second is deployed in the DMSG server binary behind an `enable_route_setup` config flag, but visors on the public Skywire network are not currently configured to use DMSG servers as their route setup nodes. The existing standalone setup-node continues to serve public network traffic, and it has been doing so reliably — at the time of writing, the production setup-node has been online for 53,080 seconds (about 14.7 hours) without restarts or ephemeral port exhaustion, following the cumulative effect of the port leak fixes from [the great DMSG bug hunt](/posts/the-great-dmsg-bug-hunt/).

In other words, the integrated route setup-node is not a mandatory replacement for anything. It's an optional configuration available for custom deployments — private Skywire networks, test environments, single-server setups, or deployments that want to reduce their operational footprint by one service. The public Skywire deployment may adopt it in the future, or may not; the standalone setup-node works, and "works" is a strong argument against changing things.

This article walks through both changes, what they enable, and why the server-to-server mesh is the more consequential of the two.

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

The setup-node is a standalone binary (`skywire-setup-node`) that operators deploy and maintain separately. It needs its own DMSG client to reach visors, which means it holds its own ephemeral ports, its own sessions, and its own goroutines. The public Skywire deployment has always run a standalone setup-node and continues to do so today — after the port leak fixes from the recent [DMSG bug hunt](/posts/the-great-dmsg-bug-hunt/), the production setup-node has been running stably without ephemeral port exhaustion issues.

That said, the standalone architecture does have some theoretical inefficiencies for certain deployment patterns:

- **Another service to deploy.** Anyone running a Skywire deployment needs to stand up at least one setup-node in addition to the TPD, Address Resolver, Route Finder, Service Discovery, Uptime Tracker, and all the other infrastructure services. For small private deployments this is operational overhead that may not be worth it.
- **Separate DMSG client.** The setup-node's DMSG client is a distinct process from the DMSG server's internal client, holding its own sessions and ports. This is fine on hosts with plenty of resources but adds up for minimal deployments.
- **Extra indirection.** A visor on Server A wanting to set up a route to a visor on Server B goes through a setup-node that might itself be connected via Server C. This extra hop is usually invisible to users but represents unnecessary work if the setup-node could have been co-located with one of the endpoints.

None of these are blockers for the public deployment. They're the kind of friction you'd want to avoid if you were designing a small custom Skywire network from scratch.

---

### Optional: Route Setup Inside the DMSG Server

The new capability: **a DMSG server can optionally serve three endpoints on its own direct client**:

- `/health` on DMSG port 80 (HTTP) — service health + build info
- `/debug/pprof` on DMSG port 81 (debug) — profiling, unchanged from before
- **Route setup-node on DMSG port 36 (RPC) — route setup for visors**

When the `enable_route_setup` config flag is set, the setup-node runs inside the DMSG server process, using the server's own DMSG client which connects through the server itself. Visors that are configured to use this DMSG server as their route setup node can then request route setup on port 36, and the server handles the request internally.

**For visors on the same DMSG server:** route setup is local. The visor's request arrives as a stream to DMSG port 36. The server's internal setup-node handles the request using its own DMSG client, which finds the destination visor in the server's local session map. The entire exchange happens without any forwarding — just local frame copies between streams.

**For visors on different DMSG servers:** the server-to-server mesh handles forwarding transparently. The setup-node's DMSG client on Server A opens a stream to the destination visor on Server B. The mesh relays the stream through the peering relationship. As far as the setup-node code is concerned, it's just dialing a stream — the mesh is invisible to it.

The potential upsides of enabling this:

- **Fewer services to deploy.** A private Skywire deployment can run a single DMSG server that provides DMSG relay, health checks, pprof, and route setup all from one binary.
- **No separate DMSG client.** The server's existing client serves all three endpoints, sharing ports and sessions efficiently.
- **Simpler topology.** Every DMSG server in a mesh can handle route setup for its local clients, so there's no single-service dependency for route establishment.

### Current Deployment Status

The capability is present in the DMSG server binary. An `enable_route_setup` config flag controls whether a given server advertises its route setup service. `/health` tests and E2E integration were added in PR #788415546.

**The public Skywire deployment does not currently use this.** The standalone setup-node continues to handle route setup for public network traffic, and as of today is running stably without the resource exhaustion issues that had previously made DMSG-integrated route setup look urgent. The cumulative effect of the recent port leak fixes has addressed the concerns that motivated the integration work in the first place.

So the integrated route setup-node should be thought of as an **optional deployment mode** rather than a replacement for the standalone setup-node. It's available for:

- **Private Skywire deployments** that want to minimize the number of services to deploy
- **Test environments** where running a separate setup-node is operational overhead
- **Single-server setups** where having the setup-node co-located with the DMSG server is simpler
- **Experimental rollouts** where operators want to validate the new architecture before considering wider adoption

If you're running a private deployment, you can enable `enable_route_setup` on your DMSG server and point your visors at that server for route setup. If you're on the public Skywire network, nothing changes — the existing setup-node continues to serve you.

---

### The Bigger Picture: The Mesh Is the Real Story

Of the two changes, **the server-to-server mesh is the significantly more consequential one**. It addresses a fundamental scaling limitation that had been present in DMSG since the beginning, and it's in active use on the public network right now. Every client that connects to a mesh-peered server benefits, whether they know the mesh exists or not.

The integrated route setup-node is a more modest addition. It enables a deployment pattern — "run fewer services" — that's useful for certain scenarios but isn't a replacement for the existing production architecture. The standalone setup-node works, is well-understood, and after the recent reliability fixes is running without the port exhaustion issues that had previously made integration look urgent.

That said, the integrated route setup-node does hint at a broader pattern that Skywire has been working toward: **services composed together inside the processes you already have**, rather than proliferating as standalone binaries.

Over the past year, this has been gradually taking shape:

- **Skywire unified binary** (March 2024) — all services compile into a single `skywire` binary invoked via subcommands
- **DMSG merged into Skywire** (April 2026) — DMSG is no longer a separate Go module
- **Server-to-server mesh** (March 2026) — DMSG servers peer with each other, so clients don't need to connect to every server to maintain full reach
- **Route setup optionally integrated into DMSG server** (April 2026) — the setup-node becomes an optional feature of an existing service, available for deployments that want it

The direction of travel is toward fewer independent services and more features composable together, but this is a gradual and optional evolution, not a forced migration. The public deployment continues to use the services that work, while the new capabilities exist for operators who want to experiment with different architectures.

If the integrated setup-node proves useful in custom deployments over time, it may eventually be adopted more broadly. Until then, it's a nice option to have — one more way to configure Skywire for your specific needs.

See also: [Guide: DMSG — The Encrypted Overlay Network](/posts/guide-dmsg-deployment/) | [The Evolution of the Skywire Codebase](/posts/skywire-codebase-evolution/) | [Skywire v1.3.37 Released](/posts/skywire-v1.3.37/)
