+++
date = "2026-03-25"
tags = ["Development", "Skywire"]
title = "Development Update — March 25"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: CXO Transport Adapter and Login Chain

**CXO-based transport discovery over DMSG** — a CXO DMSG transport adapter was added, allowing CXO nodes to communicate over DMSG instead of raw TCP. This is the foundation for distributing transport discovery data through CXO's content-addressable object system over the encrypted DMSG overlay — a step toward decentralizing the TPD (#2249).

**Login chain genesis** — the first steps of a Fibercoin-based login chain for the reward system were implemented. The login chain is a dedicated Fibercoin blockchain used to authenticate reward claims. Genesis block signing was implemented (#2250).

### DMSG: Ephemeral Keypair Pool and Performance

**Keypair pre-generation pool** — secp256k1 keypair generation is expensive, and under load each noise handshake was blocking on EC key generation. A background goroutine now pre-generates keypairs and serves them from a buffered channel pool, eliminating per-handshake crypto blocking and enabling burst handling of concurrent connections (#351).

**Encrypt/decrypt hot path optimization** — per-encrypt nonce buffer allocation was eliminated by using a reusable `[8]byte` field. Output buffers are pre-allocated to avoid `append` growth. A `sync.Pool` was added for write frame buffers. Redundant public/secret key validation was removed from the DH and RemoteStatic paths since keys are already validated by the noise state machine.

These DMSG performance improvements are directly motivated by the server CPU exhaustion issue being investigated this week. The keypair pool and hot path optimizations reduce the per-connection cost of DMSG, allowing servers to handle more concurrent handshakes without starving the CPU.

**DMSG vendor update** — Skywire vendored the latest DMSG changes (#2247).
