+++
date = "2026-06-16"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — June 16, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The headline is post-quantum cryptography landing in the Noise handshake. Over three pull requests — a design sketch, a self-contained crypto layer, and the live wiring — skywire's encrypted transports gained a hybrid X25519 + ML-KEM-768 key agreement, with no new round trips, no flag to flip, and full backward compatibility with peers that haven't updated. Around it: an end-of-month docs refresh of the reward rules to match the current dmsg-only deployment, two transport-reliability changes aimed at dead-edge detection (OS-level keepalive and a local-route-calc preference for disjoint mux legs), and the migration off the frozen noise fork that made the PQ work possible in the first place.

### Skywire: Post-Quantum Hybrid Handshake

The motivation is *harvest-now-decrypt-later* — an adversary recording transport ciphertext today to decrypt once quantum hardware exists. The defense is a hybrid key exchange: mix the existing classical Diffie-Hellman secret with an ML-KEM-768 secret so a session stays secure unless **both** are broken.

**`3119`** docs(design): post-quantum hybrid noise handshake sketch is the design that frames the whole effort. The key insight is that the KEM material can piggyback in the existing `Noise_KK` handshake *payloads* — no new round trips — and because KK authenticates those payloads, a man-in-the-middle can't strip the PQ offer without breaking the handshake. The shared secret is mixed into the transport keys via HKDF *after* Split, so the noise DH slot is never substituted and the ancient fork internals are never touched.

**`3121`** feat(noise): post-quantum hybrid key-agreement layer — phase 1 lands the pure-crypto piece in isolation: ephemeral ML-KEM-768 keygen/encapsulate/decapsulate (stdlib `crypto/mlkem`) plus the HKDF combiner that binds the classical session key, the ML-KEM secret, and the handshake transcript together. It deliberately does *not* touch the live handshake yet, so the crypto can be reviewed and tested against the FIPS-203 known-answer vectors on its own. No new dependency.

**`3125`** feat(noise): wire the post-quantum hybrid into the handshake — phase 2 composes that layer into the live `Noise_KK`/`XK` handshake — and the elegant part is that it's *not* flag-gated and is reverse-compatible by construction. The initiator offers its ML-KEM public key in msg-1's payload; a PQ-aware responder encapsulates and returns the ciphertext in msg-2; both mix the result into their transport keys. An older peer simply ignores the payload (as it always has) and replies empty, so the new side sees no ciphertext and falls back to a classical handshake *in the same round trip* — no flag, no failed attempt, no retry. The PQ messages stay within the existing 4096-byte frame size, so interop holds both directions.

### Skywire: Off the Frozen Noise Fork

The PQ work needed a maintained framework underneath it. **`3120`** chore(noise): migrate from the unmaintained skycoin/noise fork to upstream flynn/noise v1.1.0 drops the 2018 snapshot of flynn/noise that skywire had been carrying. It turned out to be a vanilla fork with no skycoin-specific changes — the secp256k1 DH is entirely skywire's own, plugged in through the standard `DHFunc` interface — and skywire was the sole consumer in the module graph, so there was no reason to keep a dead fork alive. The one interface drift (flynn's `DH` returns an error the 2018 fork didn't) became a small improvement: a malformed peer key now fails the handshake gracefully instead of panicking the visor.

### Skywire: Dead-Edge Detection

Two changes in the ongoing campaign to stop routes being built through transports that are silently dead.

**`3116`** feat(transport): OS-level TCP keepalive + TCP_USER_TIMEOUT for fast silent-death detection turns on the kernel mechanisms that surface a silently-dead peer — a crash, a power loss, a hole-punch that decayed with no RST or FIN. Until now the only detection was the app-level transport ping, up to ~3 minutes out, and *never* for an intermittently-flaky link because a stray pong reset the miss counter. Kernel keepalive (idle 15s, interval 5s, four probes) errors a dead socket in ~35s regardless of stray pongs, and `TCP_USER_TIMEOUT` makes a write to a dead peer fail in ~30s instead of minutes of retransmit. Zero added goroutines — the kernel does the probing — so a dead transport actually closes, fast, and stops being selected for routes.

**`3115`** feat(router): prefer local route calc for mux aux legs (disjoint + live first-hop) addresses why mux bandwidth plateaus. Throughput scales linearly only when the parallel legs are *disjoint*, but the stateless, latency-weighted route-finder returns lowest-latency routes that cluster on the same few low-latency intermediates — so added legs pile onto a shared bottleneck and contribute nothing. Local route calc has what the route-finder lacks: the visor's own live first-hop transports, hundreds of candidates instead of a clustered top-N. The fix tries local calc *first* for the disjointness-seeking aux legs (and skips closed first-hops, which doubles as a dead-edge filter), while the primary route still uses the latency-optimized finder.

### Skywire: Reward Rules Refresh

**`3117`** docs(rewards): refresh mainnet_rules — drop stale framing, fix regional-saturation math brings the reward documentation in line with how the network actually runs now. The dmsghttp-config is no longer a region-specific *exception* — it's the default and only supported config — so the China-specific framing is rewritten as a general consequence of deployment dmsg-server changes. The regional-saturation math is updated to the post-#3112 per-visor scaling (a country's total reward now grows linearly with visor count rather than being frozen at the single-visor amount), and the uptime section is rewritten to point at the three integrated trackers and the `skywire cli ut` subcommands instead of the soon-to-be-deprecated plain-HTTP endpoints.

### Skywire: Tests

- **`3118`** test(router): adopt testing/synctest for datagram route-group timing tests swaps racy `time.Sleep`-and-hope patterns for Go 1.25's `testing/synctest` bubble — a fake clock and deterministic goroutine scheduling. Two flaky timing tests now run in 0.00s with exact (not fuzzy) deadline assertions, establishing the pattern for incrementally converting the rest of the time-based timing tests.
