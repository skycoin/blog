+++
date = "2026-03-21"
tags = ["Skywire"]
title = "The Evolution of the Skywire Codebase"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Seven Years, 12,000+ Commits, 45 Contributors

The Skywire codebase has been through multiple complete architectural redesigns since its first commit in March 2019. What started as a mainnet implementation for a mesh networking protocol has evolved into a unified platform encompassing an encrypted overlay network, a VPN, a port forwarding system, a reward economy, and — most recently — a multi-coin blockchain toolchain. This article traces that evolution.

---

### 2019: The Foundation

**March 2019** — 志宇 (Evan Lin) pushed the first commit: "first implementation of skywire mainnet." The initial codebase established the core abstractions that still exist today: transports (bidirectional communication channels between visors), routing tables, and the visor as the fundamental network node.

The early architecture was designed around a clean separation between transport types. A transport could be anything — TCP, UDP, or something more exotic — as long as it implemented the transport interface. This flexibility would prove critical later.

**Contributors in this era:** 志宇 (Evan Lin), ivcosla, BigOokie, Sir Darkrengarius, Nikita Kryuchkov

**May 2019** — Sir Darkrengarius and Nikita Kryuchkov joined the project, beginning what would become two of the most prolific contribution periods in the codebase's history. Darkrengarius would go on to contribute over 1,000 commits focused on core architecture.

**June 2019** — DMS was renamed to DMSG ("as per Brandon's request"). The Distributed Messaging System became the encrypted overlay network that would underpin all of Skywire's communication. DMSG introduced secp256k1 public key identity, the Noise protocol for end-to-end encryption, and relay servers that forward ciphertext without being able to decrypt it.

**October 2019** — Skynet appeared in the codebase for the first time, with Sir Darkrengarius implementing the initial port forwarding structs and wiring them into the visor startup sequence.

**2019 by the numbers:** 2,762 commits. The foundation year.

---

### 2020: VPN, Apps, and the Process Model

**March–April 2020** — The VPN implementation landed. First the client (creating TUN interfaces and routing tables), then the server. This was the first "killer app" for Skywire — a full VPN that routes traffic through the peer-to-peer network instead of centralized servers.

The VPN, along with the SOCKS5 proxy (Skysocks) and Skychat messaging, established the **application model** that would go through several major redesigns. In this era, Skywire apps were **external processes**. The visor would spawn each app as a separate OS process, communicating over Unix sockets or named pipes. A process manager tracked PIDs, handled restarts, and collected logs.

This model was conceptually clean — apps were isolated, could crash without taking down the visor, and could be developed independently. But it had operational costs: process spawning was slow, managing multiple binaries was complex, and the IPC overhead added latency.

**May 2020** — Moses Narrow's first commit: adding Makefile package directives and systemd services. This marked the beginning of a long focus on deployment, packaging, and making Skywire installable as a system service — work that would continue for years.

**2020 by the numbers:** 3,298 commits — the peak development year.

---

### 2021: Infrastructure at Scale

Development shifted toward the infrastructure needed to run Skywire as a production network. The Transport Discovery, Service Discovery, Uptime Tracker, Route Finder, and Address Resolver were all refined and hardened.

**April 2021** — Erson Pereira (ersonp) joined the project, contributing 640 commits over the following years focused on the CLI, service infrastructure, and deployment tooling.

The reward system's mainnet rules were established and iterated, with Asgaror maintaining the rules documentation. The economics of running Skywire nodes — how operators get compensated for providing network infrastructure — became a first-class concern.

**2021 by the numbers:** 2,951 commits.

---

### 2022–2023: Stabilization and Transport Improvements

Development velocity slowed as the focus shifted from new features to stability, with the transport layer receiving particular attention. STCPR (TCP with port reuse) and SUDPH (UDP hole punching) matured as direct peer-to-peer transport types, complementing the relay-based DMSG transport.

The visor ping mechanism was refined, autoconnect logic improved, and the Address Resolver handling became more robust. These were the years of making the network reliable enough for daily use.

**DmsgWeb** emerged during this period — a resolving SOCKS5 proxy that lets web browsers access sites hosted entirely within the DMSG overlay network. Inspired by I2P, DmsgWeb maps `.dmsg` domains to public keys and routes traffic through the encrypted overlay.

**2022–2023 by the numbers:** 2,797 commits combined.

---

### 2024: The Unified Binary

A pivotal architectural decision: **merge everything into one binary**.

**February 2024** — PR #1704 implemented Cobra CLI integration for all apps and merged them into a single compilation unit. The individual app binaries (`vpn-server`, `vpn-client`, `skysocks`, `skysocks-client`, `skychat`) became subcommands of the main `skywire` binary.

**March 2024** — PR #1776 ("Move to merged binary") completed the transition. One `skywire` binary now contained the visor, all CLI commands, all network services, all DMSG utilities, all native applications, and bundled tools like `jq` (gojq) and a text editor (femto).

But the apps were still **launched as external processes** internally. The unified binary used `os.Args[0]` detection and symlinks to determine which "app" was being invoked, then ran the appropriate code path. The process manager still spawned child processes — they just happened to be the same binary with different arguments.

---

### 2025: From Processes to Function Calls

**October 2025** — The final piece of the app architecture puzzle: PR #2079 refactored the app launcher to **launch apps via direct function calls** instead of spawning OS processes. The VPN server, VPN client, SOCKS5 proxy, and other apps now run as goroutines within the visor process, with reverse compatibility for managing external apps when needed.

This eliminated process spawning overhead, simplified deployment (no more PID tracking, no zombie processes), and made the visor a single-process system. Log management became simpler — no more collecting stdout/stderr from child processes. And startup was near-instantaneous since there's no exec involved.

The transition was careful: the internal launcher and external launcher coexist, with the internal path used by default and the external path available as a fallback. Comprehensive E2E tests were added to verify both modes.

**Also in 2025:** The Skycoin blockchain toolchain was embedded into the Skywire binary. `skywire skycoin daemon`, `skywire skycoin cli`, `skywire skycoin web`, `skywire skycoin explorer`, and `skywire skycoin newcoin` — the full Skycoin stack became accessible from the same binary that runs the mesh network. One download, one install, everything.

---

### 2026: Fibercoins, Route Multiplexing, and CXO

**Dynamic Fibercoin branding** — the `FIBER_TOML` environment variable now makes the entire toolchain adapt to any Fibercoin. Help menus, ASCII art banners, CLI defaults, data directories — everything reflects the configured coin. [AIX](/posts/guide-multicoin-wallet/) and [Privateness](/posts/guide-multicoin-wallet-2/) were the first third-party Fibercoins verified with this system.

**[Route multiplexing](/posts/skywire-route-multiplexing/)** — connections can now spread traffic across multiple transports simultaneously, with latency-weighted transport selection, packet reordering, and SACK-based retransmission. This is the first phase of multi-path routing.

**CXO integration** — the Content-Addressable Object System, a distributed data storage layer, was integrated into the Skywire binary.

**Transport Discovery overhaul** — the TPD migrated from PostgreSQL to Redis, added per-transport and per-visor bandwidth metrics, and enabled the transition to [bandwidth-based rewards](/posts/skywire-bandwidth-rewards-transition/).

---

### The Architecture Today

What started as separate binaries for each component is now a single process:

```text
skywire
├── visor        — the Skywire node
├── cli          — 20+ subcommands for managing everything
├── svc          — all 13 network services
├── dmsg         — DMSG overlay (server, discovery, web, curl, pty, socks)
├── app          — VPN, proxy, chat, skynet (launched as goroutines)
├── util         — jq, text editor, HTTP client
└── skycoin      — full Skycoin blockchain toolchain
    ├── daemon   — full node
    ├── cli      — wallet, transaction, blockchain queries
    ├── web      — multi-coin thin client wallet
    ├── explorer — blockchain explorer
    └── newcoin  — Fibercoin creation
```

The evolution from "collection of separate programs communicating over IPC" to "single binary, single process, function-call app launching" took six years and thousands of commits. Each stage — external processes, unified binary with process spawning, and finally direct function calls — solved the problems of the previous stage while introducing new capabilities.

---

### Contributors

45 people have contributed to the Skywire codebase. The top contributors by commit count:

| Contributor | Commits | Period | Focus |
|-------------|---------|--------|-------|
| Sir Darkrengarius | 1,067 | 2019–2021 | Core architecture, routing, transports |
| Nikita Kryuchkov | 667 | 2019–2020 | Networking, DMSG, protocol |
| Moses Narrow | 645 | 2020–present | Deployment, packaging, CLI, reward system, Fibercoin support |
| ersonp | 640 | 2021–present | CLI, service infrastructure, testing |
| Erich Kästner | 603 | 2019–present | Integration, merges, project management |
| 志宇 (Evan Lin) | ~500 | 2019–2020 | Original implementation, DMSG, noise protocol |
| ivcosla | ~200 | 2019 | Early CLI, manager UI |

And many more who contributed features, fixes, documentation, and testing.

---

### What's Next

The codebase continues to evolve. Active areas of development include route multiplexing refinement, CXO integration, bandwidth-based reward economics, and Fibercoin ecosystem tooling. The architecture is now stable enough that new features layer on top rather than requiring rewrites — a sign of maturity after seven years of iteration.

See also: [Skywire: One Binary, Everything You Need](/posts/skywire-unified-binary/) | [Route Multiplexing](/posts/skywire-route-multiplexing/) | [Bandwidth-Based Rewards](/posts/skywire-bandwidth-rewards-transition/)
