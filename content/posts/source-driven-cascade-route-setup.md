+++
date = "2026-06-04"
tags = ["Development", "Skywire", "Routing"]
title = "Route Setup Over Transports: The Source-Driven Cascade"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

To carry traffic across the skywire overlay, a multihop route has to be *built*: each visor along the path needs a routing rule telling it which transport to forward a packet onto next. Installing those rules has, until now, been the job of a **route-setup node** (RSN) — a dedicated service that, given a route, reaches out to every hop and writes the rule.

The way it reached each hop was the problem. The RSN dialed each visor **over dmsg**. And dmsg reachability is not the same thing as *route* reachability. A visor can be perfectly alive on its transports — its stcpr and sudph links up, forwarding packets fine — while its dmsg session has quietly gone half-dead (an older build with an undetected zombie session, a relay that dropped it). The RSN would try to dial that hop over dmsg, time out, and the whole route setup would fail — even though every transport the route actually needs is working.

The result was multihop route setup that worked when it felt like it. The data plane was fine; the *control* plane — the one-time act of installing the rules — was the flaky part, and it was flaky for a reason that had nothing to do with whether the route would carry traffic.

This is the story of taking that failure class off the table.

### The idea: don't dial the hops at all

The fix is a change of who does the work and over what. Instead of the RSN dialing each hop over dmsg, the **source** of the route installs the rules itself — by sending them **down the very transports the route is made of**. Those transports are, by definition, the ones the route needs to work. If they can carry the route's traffic, they can carry the rule that sets it up.

The mechanism is a **cascade**: a nested, russian-doll message. The source builds a packet whose outermost layer is addressed to the first hop and whose payload is a packet addressed to the second hop, whose payload is addressed to the third, and so on. Each hop peels its own layer, installs its rule, and forwards the inner payload to the next hop over the route's own transport (on the reserved route ID 0). No hop ever learns more than its predecessor and successor — the nesting is a privacy property, not just an envelope.

But there's a trust question. If the source is injecting routing rules into other people's visors, what stops it from injecting *malicious* ones? The answer is that the source doesn't get to author the rules. Each cascade layer is **signed by the route-setup node**, and each hop verifies that signature against the RSN public keys it already trusts (the same `route_setup_nodes` it was configured with) before honoring anything. So the RSN's authority is preserved exactly — it still vouches for every rule — but it has been reduced to its essential function: **signing**.

The RSN becomes a pure, dmsg-reachable **signing oracle**. The source asks it — over a single dmsg round-trip, to a service whose dmsg reachability we *do* control — to sign the cascade. The RSN signs and hands the bytes back. The source injects them down its own transports. The RSN never dials a hop. The hops are reached only over links already proven to work.

**`3006` feat(router): source-driven cascade route setup (RSN as dmsg signing oracle)** lays the protocol down: a two-phase exchange (reserve route IDs, then install rules), the source orchestrating both, the RSN signing each and — crucially — **recomputing the rules deterministically from the route** rather than trusting whatever the source sends it. The cascade rides the route's transports; dmsg is used only for the cheap sign request.

### Turning it on exposed everything that was wrong with it

Here is the honest part. The protocol had existed, in a dormant form, behind a configuration gate — and being gated, it had never actually run end-to-end on the live network. The moment we made it run, it broke, repeatedly, and each break taught us something.

**`3008` fix(router/cascade): sign out-of-the-box — no per-RSN config needed** removed the gate. Signing needs only the RSN's own key; it was being withheld behind a config block that no deployed RSN had set, so every source silently fell back to the old dmsg-dialing path. Dropping the gate meant any route-setup node would sign on request — and that, for the first time, made the new path actually execute in production.

It immediately failed, and the failure was legible in the source's logs:

```
Source-driven cascade failed, falling back to DMSG DialRouteGroup
  error="cascade: fwd reserve rejected: RSN signature verification failed"
```

The first hop was rejecting a perfectly valid signature. The reason was a subtle one: the RSN builds the nested cascade with the *source itself* as the outermost layer (the source is a hop on its own route too), signed for the source's key. The source was shipping that layer — its own — straight to the first hop, which dutifully checked the signature against *its* key and refused it. The source has to **consume its own layer**: reserve its own route ID, then forward the inner payload onward. **`3009` fix(router/cascade): source must consume its own outermost cascade layer** taught it to.

That fixed the forward direction and revealed the same bug's mirror image in the reverse direction — plus a second, quieter one. The reverse cascade was being built destination-first (signed for the *far* end), so the source couldn't consume *its* outermost reverse layer either; and the route-ID reservation counts were being summed across both directions, which threw off how reserved IDs were matched back to the hops that reserved them. **`3010` fix(router/cascade): re-orient reverse cascade source-first + per-path reserve counts** straightened both: the reverse cascade is re-oriented to start at the source over the same bidirectional transports, and each direction reserves its own count.

With that, the control plane finally completed — the logs now read `Source-driven cascade route setup succeeded`, four times for four routes, with **no fallback to dmsg**. And yet the route still didn't carry traffic. The setup *succeeded* and the connection *timed out*.

The last gap was a layering distinction. Installing a forwarding rule on the destination makes it *forward* packets — but the endpoint of a route isn't a forwarder, it's a **route group**: the object the destination's app actually reads from, and the thing that answers the source's encrypted handshake to confirm the route is live. The cascade was installing rules on the destination the way it installs them on an intermediary, so the destination had the rule but no route group, and the source's handshake reached a visor with nothing listening. **`3012` fix(router/cascade): destination creates a route group (IntroduceRules), not just rules** marks the destination's layer specially so it builds the route group — exactly what the old dmsg path's `AddEdgeRules` did, now carried in the cascade, and in a backward-compatible way so that intermediaries running older code relay it untouched.

### What it looks like working

On the live network, source to destination across two hops, four parallel routes:

```
reserved route IDs ... fwd_ids=3 rev_ids=3
Source-driven cascade route setup succeeded   (×4)
```

No `falling back to DMSG`. The routes came up and carried megabytes of traffic across intermediates that the RSN never once dialed. The dmsg-reach-every-hop dependency — the thing that made multihop setup a coin flip — is gone. Route setup now succeeds whenever the route's own transports are good, which is the only condition that should ever have mattered.

There's a methodological note worth keeping. Three of those five fixes were bugs that *only* appeared once the path ran for real, and chasing them one redeploy at a time — each cycle a ten-minute wait for the network to converge — was punishing. The turning point was building a small deterministic test that drove the whole sign-build-reserve-install path in-process, with no network at all. The reserve-orientation and route-ID-matching bugs were then caught and fixed in milliseconds, with regression tests pinning them shut. A flaky distributed protocol is most cheaply debugged by making the part you can isolate, isolated.
