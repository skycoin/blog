+++
date = "2026-08-04"
tags = ["Development", "Skywire", "Security"]
title = "The Header That Lied: Closing a Visor-Impersonation Hole"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Every Skywire visor authenticates itself to the network's core services — the address resolver, the transport discovery, the service discovery, the uptime tracker — with a small HTTP handshake carried by a shared `httpauth` middleware. Over the public internet that handshake does real cryptographic work: the caller sends its public key in a `SW-Public` header, a one-time `SW-Nonce`, and a secp256k1 **signature** proving it holds the private key for that public key. Forge the header and you fail the signature check. That is the whole point.

Over **dmsg**, one link in that chain had quietly come undone — and for a while, it meant any peer on the network could speak to those services *as any other visor*.

### Where the proof went missing

dmsg connections are already authenticated. Two visors establish a dmsg stream through a noise-KK handshake, which cryptographically proves each side's public key before a single byte of application data flows. The verified peer key is right there in the connection's `RemoteAddr`, as `<pk>:<port>`. Given that, re-running an expensive secp256k1 signature check on every request over that stream is redundant work, so an optimization had been added to skip the signature for dmsg callers.

The optimization skipped the signature. It did **not** stop trusting the header. The middleware still read the caller's identity from the unverified `SW-Public` header and acted on it — and nothing bound that header to the key the noise handshake had actually proven. The nonce didn't save it either: nonces are handed out from an *unauthenticated* endpoint (`/security/nonces/<pk>`), so the nonce is public knowledge. The signature had been the only real proof of identity on the dmsg path, and it was exactly the thing being skipped.

The consequence: over dmsg, a visor's identity was whatever it *claimed* in a header. A peer could `POST /bind/wt` to the address resolver under someone else's public key and plant a transport record for a visor it doesn't control — redirecting that visor's traffic, opening the door to interception. The same shape defeated the equivalent guards in transport discovery (registering and reporting transports as another node), in service discovery (the "you may only edit your own entry" check compares against the spoofable identity), and in the uptime tracker.

### The fix is also the cheaper one

The tempting fix — "just re-verify the signature over dmsg too" — would have worked, but it would have added back the exact secp256k1 cost the earlier optimization removed, on every request, fleet-wide.

The right fix goes the other way. Over dmsg, the authenticated identity is taken from the **noise-verified `RemoteAddr` public key** — the one the handshake already proved — and *both* the signature and the nonce are skipped, because both are redundant over an ordered, replay-proof, mutually-authenticated stream. The header is no longer trusted; it's cross-checked. Plain-HTTP requests are completely unchanged: full nonce and signature, exactly as before. One change in the shared `httpauth` layer closes the hole in all four services at once, and honest clients need no change — a well-behaved visor already sets `SW-Public` to its own key, which is precisely its `RemoteAddr`.

And because the fix *removes* work rather than adding it, it also kills a load problem that had been hiding in the same code. Concurrent clients — especially the browser-based wasm visor, racing the monotonic per-key nonce counter — would desync their nonce, take a `401`, refetch from `/security/nonces`, and retry. That churn scaled with concurrency and fell on the busiest core services. Dropping the nonce dance on the dmsg path removes it entirely. The secure path turned out to be the lighter one.

### Verified, and bounded

The hole was confirmed against the live production address resolver before the fix, and the change ships with tests that pin the new contract: a forged `SW-Public` over dmsg now resolves to the *session* key, not the header; a dmsg request with no `SW-*` headers at all still authenticates from the connection; and a plain-HTTP request with a bad signature still gets its `401`. The blast radius was always confined to the dmsg path — plain HTTP was never affected — and it's now confined to nothing.

It's a small diff with a tidy moral: an authenticated channel is only an advantage if you take the identity *from the channel*. The moment you read it back out of a header the caller filled in, you've handed the proof back to the attacker.
