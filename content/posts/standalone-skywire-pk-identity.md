+++
date = "2026-06-04"
tags = ["Skywire", "Architecture"]
title = "Standalone Skywire: Encrypted Transport, Public Keys as Identity"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

If you keep peeling back skywire's layers — the apps, the multihop router, the multiplexed routes, the discovery services, the dmsg relay — what's at the very bottom? One primitive: an **encrypted transport between two public keys**. The noise handshake provides the encryption; the public key *is* the identity. No certificate authority vouches for it, no DNS name resolves to it, no allocated IP belongs to it. A party is its key, and two keys that have completed a handshake have, by construction, authenticated each other and established a confidential channel.

Everything else skywire does is built on that. And recently, that primitive got made *runnable by itself* — in the standalone versions of skychat and the pty. They were factored into standalone utilities only recently, but the thing they expose has been the bedrock all along. It's worth looking at it directly.

### The primitive

Take two machines, each with a skywire key pair. One listens; the other dials `pk@host:port`. The transport between them is a TCP connection wrapped in a noise handshake keyed to those two public keys. When the handshake completes:

- **The channel is confidential and authenticated.** Noise gives you forward secrecy and mutual authentication as a property of the handshake, not as a bolted-on TLS session you have to configure.
- **Identity is the key, end to end.** The listener knows exactly which key dialed it — not a hostname, not an IP that can be spoofed or NATed into ambiguity, but the cryptographic identity of the peer. The dialer knows exactly which key answered.
- **There is no third party.** No CA in the trust path, no DNS resolver, no address-allocation authority. Two keys that know each other's value need nothing else to establish a private channel.

That last point is the radical one. The conventional internet stack interposes a stack of naming and trust authorities between "I want to talk to that machine" and an actual encrypted byte stream. Skywire's base layer removes them: the name and the identity and the cryptographic credential are the same 32-byte value.

### dmsg and skynet are this primitive, plus a layer

It's clarifying to see the rest of skywire as additions *on top* of this base:

- **dmsg** is the primitive plus a discovery service and relay servers — so two keys that *don't* have a direct line of sight can still find and reach each other, by meeting at a relay. It trades the directness for reachability through NATs and across the open internet.
- **The skynet transport mesh** is the primitive plus routing — so a connection can traverse multiple intermediate hops, be multiplexed across disjoint paths, and be steered by policy. It trades directness for the multihop, multiplexed, route-able overlay that the rest of these posts have been about.

Both are the same encrypted-transport-between-keys at heart. The standalone primitive is what you get when you keep the base and drop the additions: just the two keys and the encrypted link.

### Standalone skychat

The chat application can run with no visor and no router behind it. A `--standalone` instance skips the handshake that binds an app to a parent visor and keeps two things: a noise-encrypted, public-key-addressed TCP transport, and a small HTTP control surface. You point it at a peer with `--via tcp://<pk>@host:port`, and you have an encrypted, mutually-authenticated channel between two keys — chat over the bare primitive.

The most recent step took it further: CXO-backed *group* messaging carried over native TCP, peer-to-peer, with no dmsg layer at all. Several standalone instances point at each other's `pk@host:port`, each identified by its key, and synchronize a shared conversation over directly-dialed encrypted links. The full CXO data layer — replicated, content-addressed shared state — running on nothing but the base transport.

In practice this has been unexpectedly useful. A standalone chat instance is a side-channel that doesn't depend on the infrastructure it's often used to coordinate: it survives visor restarts and dmsg outages because it isn't built on them. When the thing you're trying to fix is the visor, a communication channel that doesn't need the visor is exactly what you want — and it has been a reliable backbone for coordination between machines, and between automated agents, precisely because it sits below everything that tends to break.

### Standalone pty

The same idea, applied to a remote shell. The pty subsystem — a terminal into a remote machine — was historically named for dmsg (`dmsgpty`), but it was never really dmsg-specific: it can run over dmsg, over the routed skynet transports, over plain http, or over a direct TCP connection. This month it was renamed to match that reality (`pkg/dmsg/dmsgpty` became `pkg/pty`), and it can run as a standalone, sshd-like service over the direct noise-TCP transport: a shell you reach by the host's *key*, with the encryption and authentication falling out of the handshake rather than out of a separately-managed key file and certificate.

A remote shell where identity is a public key and the channel is encrypted by construction is, structurally, what SSH spent decades assembling out of keys, known-hosts files, and negotiated ciphers — except here it's the base property of the transport, not a protocol built on top of an unauthenticated socket.

### Why building it standalone matters

Factoring these into standalone utilities didn't *create* the primitive — the encrypted-transport-between-keys was always there, underneath dmsg and the router. What standalone did was make it *visible and runnable on its own*, which matters for two reasons.

First, it's the honest unit of composition. When you can run the base layer by itself, you can see clearly what is fundamental (the encrypted channel and the key identity) and what is an added service (discovery, relay, routing, policy). The system stops being a monolith you take or leave and becomes a stack you can enter at the layer you need.

Second, it's robust for exactly the reason it's minimal. A tool that depends only on the base transport keeps working when the layers above it are down. That makes the standalone utilities the natural choice for bootstrapping, for recovery, and for coordination that has to survive the very outages it's being used to diagnose.

The apps, the overlay, the programmable routing — those are the reasons to use skywire. The encrypted transport addressed by public key is the reason any of them work. The standalone tools are that reason, made into something you can run.
