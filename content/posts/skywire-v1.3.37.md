+++
date = "2026-03-21"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
tags = ["Announcements", "Skywire"]
title = "Skywire v1.3.37 Released"
+++

### Skywire v1.3.37

Skywire v1.3.37 has been released and is available from [GitHub](https://github.com/skycoin/skywire/releases/tag/v1.3.37).

This release includes significant transport layer stability improvements, CXO integration, and updates the embedded Skycoin to v0.28.4:

- **[Route multiplexing](/posts/skywire-route-multiplexing/)** — connections can now spread traffic across multiple transports simultaneously, with latency-weighted transport selection, packet reordering, and SACK-based retransmission. This is the first phase of multi-transport routing in Skywire.
- **Transport layer stability** — fixed accept loop crash on stale routes with missing transports, added 10-second timeout for ping route handshakes to limit goroutine lifetime, and handle ping/latency routes directly in IntroduceRules to bypass the accept queue.
- **SUDPH improvements** — fixed SUDPH in end-to-end tests by adding `--udp-addr` to Address Resolver so UDP and HTTP share the same port, added STUN servers to visor configs for proper SUDPH detection, added diagnostics for SUDPH transport failures.
- **Transport Discovery** — batch TPD deletions, STCP transport support, transport statistics, STCPR retry improvements, deferred transport registration to batch re-registration loop, fixed AR bind retry and TPD rate limiting.
- **CXO integration** — the Content-Addressable Object System (CXO) has been integrated into the Skywire binary, providing a distributed, content-addressable data storage layer over the Skywire network.
- **Accept loop fix** — fixed connection accept loop spin on shutdown by treating closed connections as shutdown signals.
- **RPC timeout** — fixed hung RPC connections with proper timeout handling.
- **Embedded Skycoin v0.28.4** — includes all [Skycoin v0.28.4](/posts/skycoin-v0.28.4/) improvements: dynamic Fibercoin branding, `newcoin templates` subcommand, `cli halt`, and Fibercoin compatibility fixes.
- **Reward system UI** — updated reward system interface.

The full changelog is available on [GitHub](https://github.com/skycoin/skywire/compare/v1.3.36...v1.3.37).

### Install

Linux users can install Skywire from the [APT repository](https://deb.skywire.skycoin.com/) or the [AUR](https://aur.archlinux.org/packages/skywire-bin). Windows and macOS installers are available on the [GitHub release page](https://github.com/skycoin/skywire/releases/tag/v1.3.37).

For questions or technical assistance: [t.me/skywire](https://t.me/skywire)
