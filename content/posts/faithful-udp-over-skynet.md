+++
date = "2026-05-15"
tags = ["Development", "Skywire", "UDP"]
title = "Faithful UDP-Over-Skynet"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Skywire has always carried TCP traffic well. Route groups are reliable, ordered, head-of-line-blocked on packet loss — exactly the contract `net.Conn` callers expect. That's the right shape for HTTP, SSH, raw TCP forwarding, and almost everything else apps reach for by default.

But real-world UDP applications — DNS, NTP, VoIP, gaming, QUIC, anything that has its own loss-tolerance built in — treat **late packets as worse than lost packets**. A DNS resolver that retries after 100ms doesn't want the original response to arrive 5 seconds later through a TCP-shaped tunnel. A VoIP codec that masks 20ms of lost audio doesn't want all subsequent audio to wait while the lost packet retransmits. A gaming engine doesn't want the world-state update from a frame ago — it wants the current update or nothing.

Tunneling UDP through Skywire's existing route groups, which is what `serve --tcp` does today, defeats the point. Today's PR stack ships a different shape: **faithful UDP** — a UDP-semantics path through Skywire that preserves loss and reorder all the way through.

### Five stages

The work lands as five stacked PRs, each ~200-600 lines:

**`#2609` Stage 1 — `DatagramPacket` wire type**: A new `routing.PacketType` value (`DatagramPacket` = 0x11) sits alongside the existing `DataPacket`. Same header shape (route-id-prefixed), but no sequence number. Datagrams are independent on the wire; the router doesn't try to order or retransmit them.

**`#2610` Stage 2 — `DatagramRouteGroup`**: Implements `net.PacketConn` over a route. Where the existing `RouteGroup` (stream-shaped) handles in-order delivery and retransmit, `DatagramRouteGroup` just dispatches to a fixed-size inbound queue. A `Group` interface (`Close / LocalAddr / RemoteAddr / IsAlive`) is the common shape shared with the stream variant, so the router can dispatch packets to either kind without case-splitting.

**`#2612` Stage 3 — Per-datagram AEAD**: This is the trickiest piece. Stream Noise (which the existing route groups use for confidentiality) maintains cipher state across the stream — a single dropped packet desyncs every subsequent packet. That's unacceptable for UDP, where packet loss is normal. The fix is per-datagram AEAD: each datagram is independently encrypted + authenticated, with no cross-packet state.

The construction is standard:

- **Cipher**: ChaCha20-Poly1305-IETF (RFC 7539). Same primitive used elsewhere in Skywire.
- **Nonce**: 96 bits = 32 bits of zero padding + a 64-bit per-direction counter. WireGuard-style.
- **Key derivation**: HKDF-SHA256 over the Noise-derived shared secret, with info string `skywire-datagram-v1-init` (initiator-to-responder) or `-resp` (responder-to-initiator). Separate keys per direction.
- **Anti-replay**: RFC 6479 sliding-window with a 2048-bit window. A datagram with a counter outside the window is dropped; inside, the window tracks acked-or-not bits and rejects duplicates.
- **Rekey**: triggered by either time (default 2 minutes) or packet count (default 2^32 datagrams), whichever fires first.

Max plaintext per datagram: **65511 bytes** (65535-byte wire cap minus 24 bytes for the 8-byte counter and 16-byte tag). That's the largest practical UDP payload an app can hand to `WriteTo`, and the new `DatagramPacketConn.MaxPayload()` accessor surfaces it so apps can size their buffers correctly without hitting the opaque-EMSGSIZE footgun `net.UDPConn` presents.

**`#2613` Stage 4 — `forwarded_ports.udp`**: The operator-facing knob. `ForwardedPort` gains a `UDP bool` field. When true, the visor's forwarded-port listener loop binds a local UDP socket on `EffectiveLocalPort()`, opens a peer-side `DatagramRouteGroup`, and runs a bidirectional pump (`UDPBridge` type) between them. Local app's UDP traffic flows: app → local UDP socket → bridge → DatagramRouteGroup → peer's DatagramRouteGroup → peer's bridge → peer's UDP socket → peer's app.

The bridge is shape-agnostic — it accepts any `net.PacketConn` for either side. That gives the same code path the production case (DatagramRouteGroup as the skynet side) and the test case (in-memory mock pair). It also paves the way for the standalone `skyudp-bridge` utility that ships the same day for hosts that don't run a full visor.

**`#2614` Stage 5 — `DialPacket` app API**: The interface apps actually consume. `appnet.DialPacket(addr)` and `DialPacketContext(ctx, addr)` return a `DatagramPacketConn` — extends `net.PacketConn` with three accessors:

- `MaxPayload() int` — the largest plaintext datagram `WriteTo` will accept.
- `InboundDropped() uint64` — count of inbound datagrams dropped because the receive queue was full.
- `AEADAuthFailures() uint64` — count of inbound datagrams dropped because AEAD verification failed (forgery, replay, or corruption).

The two counters are diagnostic. A rising `InboundDropped` is a slow-consumer signal; a rising `AEADAuthFailures` is an attack or transport-corruption signal. Both surface through the chat-app's existing `/status` endpoint and the hypervisor UI.

Networker implementations opt into datagram support by implementing the narrow `PacketNetworker` interface (separate from the base `Networker`). Implementations that don't yet support datagrams stay valid; callers see `ErrPacketNetworkerNotSupported` when they hit one.

### Why this matters

The five-stage stack lands the protocol-level shape and the API. The follow-up — wiring `SkywireNetworker.DialPacketContext` into the route-setup machinery — is a separate PR because it touches significant `DialRoutes` code. Once that's in, every visor can dial UDP-shaped routes the same way it dials TCP-shaped routes today.

Concrete use cases the path unlocks:

- **DNS over Skywire** — a forwarded `--udp 53` port lets a visor host its own DNS for `.skynet` (and arbitrary other zones) without tunneling through a TCP shim.
- **WireGuard over Skywire** — WireGuard is UDP-only and doesn't tolerate the TCP-shaped tunnel. With faithful UDP, a Skywire route can carry WireGuard traffic with the loss/reorder semantics the protocol expects.
- **QUIC over Skywire** — QUIC's transport correctness depends on the underlying datagram delivery shape. Same story.
- **Gaming, VoIP, media streaming** — any app where late packets are useless.

The faithful-UDP path doesn't replace the existing stream-shaped routes. They're complementary: TCP-shaped traffic keeps using `RouteGroup`, UDP-shaped traffic uses `DatagramRouteGroup`, and the router knows which to dispatch by the packet type in the header. Apps that don't care (most of them) keep using `DialContext` and `net.Conn` and get the existing behavior.

For apps that do care, the API surface is what you'd expect:

```go
conn, err := appnet.DialPacket(appnet.Addr{Net: appnet.TypeSkynet, PubKey: peer, Port: 53})
defer conn.Close()
buf := make([]byte, conn.MaxPayload())
conn.WriteTo([]byte("query"), nil)
n, _, _ := conn.ReadFrom(buf)
```

Same shape as `net.PacketConn`, with one extra accessor for the max payload size.

### The companion: `skyudp-bridge`

Sibling utility shipping the same day: **`skyudp-bridge`** (binary name `sub`). Standalone UDP→DMSG bridge — length-prefixed UDP-datagram framing over a regular dmsg stream. Dmsg-only by design (uses its own `dmsg.Client`, no visor, no router, no appnet).

The two modes:

- `sub client` — listens on a local UDP socket, frames datagrams onto a dmsg stream, sends to `<peer-pk>:<port>`.
- `sub server` — accepts a dmsg stream, deframes datagrams, forwards to a local UDP socket.

Useful on hosts that don't otherwise run a Skywire visor — a single-host UDP-over-dmsg tunnel without the visor overhead. The faithful-UDP-over-skynet path described above is the visor-embedded sibling; the standalone `sub` covers the "I just want UDP-over-mesh on this one box" case.

### What's next

The remaining piece is the route-setup integration that constructs a `DatagramRouteGroup` from a real Noise handshake, installs the AEAD ciphers via `SetCiphers`, and registers `Handle` dispatch with the router. That's a focused follow-up PR; it doesn't change the wire shape or the API, just wires them together inside `DialRoutes`.

Once that lands, the operator UX is `serve add --udp <port>`, and every forwarded port can host UDP-shaped traffic with the same access-control surface (per-port whitelist, landing-page metadata, skynet/DMSG toggles) as TCP forwards.

The architectural shift is small but consequential: Skywire is no longer a TCP-only network. The full transport contract that real-world applications need is back on the table.
