+++
date = "2026-10-25"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — October 25, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The twenty-fifth of October was a Sunday with a short list. Every transport now reports what its carrier knows about the link underneath it, its own round trip time, congestion window and, where the stack counts them, lost packets, and the CLI can print those next to skywire's own ping. CXO connections dropped from four goroutines each to one while idle, a design note proposes sharing one CXO connection per visor across co-hosted services, and Skycoin stopped sending change back to an address whose public key a spend has already revealed.

### Skywire: What the Carrier Sees

Skywire pings each transport and reports that latency, but a slow transport could be slow because of the link or because of everything queued above it, and the table could not tell the two apart. **`5812`** adds an `endpoint.link` block per transport to `visor state` and `cli tp --json`, filled from the carrier itself. stcpr and stcp read `TCP_INFO` on Linux, including unsent bytes and retransmits. squicr reads quic-go's connection statistics, including packets lost. sudph reports KCP's round trip and retransmission timeout, and webrtc its SCTP round trip and congestion window. Loss is counted by the sender, so a download is best judged from the remote's side with `--via`. On the local visor nearly every transport of each type reported its link.

**`5813`** shows the numbers in the table: `skywire cli tp --link` adds `srtt`, `loss`, `lost/sent` and `cwnd` columns, and combines with the existing flags. With `-m` the skywire latency sits beside the carrier's own. On the local visor one stcpr transport showed 3,817 ms of skywire latency against 236 ms of carrier round trip with 5.93 percent loss, the kind of gap the old table could only hint at.

### Skywire: Fewer Goroutines per CXO Connection

Each CXO connection held four goroutines: the transport read loop, a receive loop draining its channel, the run loop waiting on both, and a write loop parked on an empty queue. A deployment server holds about 4,750 connections, so that was about 19,000 of its 39,000 goroutines. **`5814`** has the run loop read frames from the transport directly, runs the connect callback in a short goroutine beside it, and starts the writer only while frames are queued. The wire format is unchanged. A new test counts 80 connection goroutines for 20 idle connection ends before the change and 20 after, and a local visor ran it for six minutes against the deployment's CXO nodes with publishes, transport discovery announces and route calculation all working.

That same server held 3,086 CXO connections on the day, one per visor per service feed. **`5815`** is a design note, building on the system feed link label from earlier in the month, that proposes one host node serving the feeds of every co-hosted service over a single connection per visor, found through a `cxohost` label. Service keys stay as they are, so separate deployments keep working. There is no code in it yet.

### Skycoin: Change That Stays Private

A spend reveals the public key of every address it spends from, because the key is recovered from the signature. Deterministic wallets then sent the change back to one of those addresses, so the change sat behind a key that was now public. **`skycoin#3098`** is the part of the post-quantum work that needs no fork. Change now goes to a new address by default in both the node and the CLI, as bip44 wallets already did on their change chain. An unsigned request from an encrypted deterministic wallet has no password to derive one, so it must name a change address, and collection wallets, which cannot generate addresses, keep the old default.

The same change makes `send`, `createRawTransaction` and `createRawTransactionV2` warn when a destination address has already spent, without stopping the send, and adds `skycoin-cli sweep`, which moves every spendable coin in a wallet to one new address or to `--to`. Unit tests cover each wallet type, encrypted and not, on both paths, and the warning was checked against a live node.
