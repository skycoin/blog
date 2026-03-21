+++
date = "2026-03-21"
tags = ["Skycoin"]
title = "The Evolution of the Skycoin Codebase"
+++

### Twelve Years, 10,000 Commits, 101 Contributors, 169 Repositories

The Skycoin codebase dates back to December 2013. From the first `init` commit to today's unified multi-coin binary, it has been through multiple complete rewrites of the wallet, CLI, web frontend, and build system. This article traces that evolution through the code and the people who wrote it.

---

### 2013–2014: Genesis

**December 24, 2013** — AKS pushed the first commit. Two weeks later, TNN renamed `coind` to `daemon` and checked in the initial code structure. By mid-January 2014, the foundational pieces were in place: the cipher package (secp256k1 cryptography), the visor (blockchain state management), the daemon (peer-to-peer networking), and the first wallet implementation.

**January 14, 2014** — AKS committed "first transaction executed." The blockchain worked.

The web interface appeared immediately — TNN added GUI static file loading on January 8, and asmercrof built the first Angular controller by January 27. From the very beginning, Skycoin had a web-based wallet, not just a CLI.

**Contributors:** AKS (project founder), TNN (daemon architecture, GUI framework), asmercrof (wallet UI)

**2013–2014 by the numbers:** 790 commits.

---

### 2015–2016: Cryptographic Foundations

The cipher package matured. Bitcoin address format support was added (February 2015), allowing Skycoin's secp256k1 implementation to generate both Skycoin and Bitcoin addresses from the same keys.

**2016** saw iketheadore's first commits — thread-safe entropy pools and hash reuse optimization. He would go on to become the project's most prolific contributor with 2,429 commits over the next five years, touching nearly every part of the codebase: the daemon, CLI, API, wallet, explorer, and testing infrastructure.

The CLI began its migration from `urfave/cli` to a more structured command system. Sean Purser-Haskell implemented `ForkExec` in the node to support a single binary architecture — an early hint of the unified binary that would come years later.

**2015–2016 by the numbers:** 1,311 commits.

---

### 2017: The Explorer and gz-c

**June 2017** — gz-c joined and immediately began reshaping the codebase. His first commits restructured the explorer, moving `skycoin-web` to `cmd/explorer` and adding configurable host/port settings. Over the next two years, gz-c would contribute 2,332 commits — the second highest in the project's history — focusing on API design, wallet architecture, and the cryptographic primitives that would enable HD wallets and Fibercoin support.

The explorer APIs were overhauled by iketheadore: address transactions, coin supply endpoints, and the UTXO model that remains today. The web wallet frontend went through multiple iterations.

**2017 by the numbers:** 1,437 commits.

---

### 2018: Peak Development

2018 was the most active year in Skycoin's history — **4,011 commits**, accounting for 40% of all commits ever.

**May 2018** — therealssj added the first `fiber.toml` configuration file and the `newcoin` creator tool. This was the birth of the Fibercoin framework — the ability to create new blockchains from Skycoin's codebase with a configuration file instead of a code fork.

**October 2018** — therealssj also led the migration from `urfave/cli` to `spf13/cobra` for the CLI framework, a transition that would take years to fully complete.

**October–November 2018** — Senyoret1 integrated hardware wallet support. Over six weeks of focused development, he added device communication, transaction signing, address scanning, and wallet list integration for what would become the Skywallet.

**The testing infrastructure** expanded dramatically. Olemis Lang contributed 561 commits focused on CI, release validation, test coverage, and the C library (`libc`) bindings that enabled Skycoin's cryptographic functions to be called from other languages.

**Contributors joining in 2018:** therealssj (fiber.toml, cobra migration), Senyoret1 (hardware wallet, web wallet), Olemis Lang (CI, testing, C bindings), Maykel Arias Torres (testing)

**2018 by the numbers:** 4,011 commits — the peak year.

---

### 2019: HD Wallets, BIP44, and the Organization Split

gz-c's most architecturally significant contributions came in 2019: the **BIP32 and BIP44** implementations. Starting in March with the initial BIP32 implementation, he built out hierarchical deterministic wallet support over several months — BIP32 key derivation paths, the BIP44 package, and wallet creation with BIP44 account structure. This gave Skycoin wallets the same HD capabilities as Bitcoin wallets: multiple accounts, deterministic address generation from a single seed, and xpub key export.

**July 2019** — gz-c added the `distributeGenesis` CLI command, completing the Fibercoin initialization workflow. Combined with `addressGen` and `fiberAddressGen`, this meant a new blockchain could be created and initialized entirely from the CLI.

**September 2019** — A dispute outside the codebase disrupted the project. Individuals who had gained control of the `skycoin.net` domain and the `github.com/skycoin` GitHub organization effectively held the project's infrastructure hostage. The development team responded by migrating to a new organization: **`github.com/SkycoinProject`**. Repos were forked, import paths were rewritten, and development continued.

The split created ongoing maintenance burden — import paths referencing `SkycoinProject` would persist in codebases across the ecosystem for years. Eventually, control of the original `github.com/skycoin` organization was recovered and repos migrated back, but the episode was a stark reminder that control of infrastructure matters as much as control of code.

The Skycoin project spans three GitHub organizations: `github.com/skycoin` (106 public repos), `github.com/SkycoinProject` (22 repos from the 2019 migration), and `github.com/skycoinpro` (41 private repos including the website, mobile wallets for Android and iOS, deployment infrastructure, whitelisting services, reward system tooling, and monitoring bots). At peak, the ecosystem had over 169 repositories across these organizations — a sprawl that the 2025 consolidation effort would work to resolve.

**Also in 2019:** Moses Narrow's first contribution — updating the Arch Linux installation documentation. This would be the beginning of a long focus on packaging, deployment, and making Skycoin accessible to end users.

**2019 by the numbers:** 1,147 commits.

---

### 2020–2021: Stabilization and the Ecosystem Sprawl

Development velocity slowed as the codebase entered a maintenance phase. The API surface was stable, the wallet worked, the explorer worked, and Fibercoins could be created. The focus shifted to bug fixes, dependency updates, and incremental improvements.

iketheadore continued contributing through August 2021, with his final commits refining the infrastructure he had built over five years.

Meanwhile, the broader Skycoin ecosystem had fragmented across many repositories. The blockchain explorer was in `skycoin-explorer` (created July 2017). The web wallet was in `skycoin-web` (created November 2017). The hardware wallet library was in `hardware-wallet-go`, the hardware wallet daemon in `hardware-wallet-daemon`. The C bindings were in `libskycoin`. The mobile wallet was in `skycoin-mobilewallet`. Each had its own CI, its own dependencies, and its own release cycle.

**2020–2021 by the numbers:** 738 commits.

---

### 2022–2024: The Quiet Years and the Cobra Rewrite

Commit activity dropped to near zero in 2022–2023, with only 4 commits in those two years combined. The project appeared dormant.

**August 2023** — Moses Narrow returned with Fibercoin documentation updates, the first commits in over a year.

**October 2024** — A major effort began: reimplementing all Skycoin commands with Cobra, making each command importable as a Go package. This was the prerequisite for embedding Skycoin into the Skywire binary. Moses Narrow re-implemented the daemon flags, CLI commands, and help menus with Cobra, a project that continued through late 2025.

**2022–2024 by the numbers:** 18 commits — but the Cobra rewrite laid critical groundwork.

---

### 2025: The Unified Binary and the Great Consolidation

The Cobra rewrite merged in August–September 2025, and the results were transformative. Every Skycoin tool — daemon, CLI, web wallet, explorer, newcoin, and hardware wallet utilities — became a subcommand of a single `skycoin` binary.

The years of repository fragmentation ended as separate projects were absorbed into the main Skycoin repo:

- **`skycoin-explorer`** (created July 2017, 7 years as a separate project) — merged into `src/explorer/`, Angular frontend embedded via `go:embed`
- **`skycoin-web`** (created November 2017, 8 years separate) — merged into `src/skycoin-web/`, served from memory
- **`hardware-wallet-go`** and **`hardware-wallet-daemon`** — merged into `src/hardware-wallet/` and `src/hardware-wallet-daemon/`, compiled into the release binary from `cmd/release`
- **Newcoin templates** — code generation templates embedded via `go:embed`, no external files needed

What had been half a dozen separate repositories with their own CI pipelines, dependency management, and release schedules became a single codebase with a single version number.

**Static cross-compilation** with musl toolchains enabled builds for Linux (amd64, arm64, armhf, arm, 386, riscv64), macOS (amd64, arm64 with .pkg installer), and Windows (amd64 with .msi installer) — all from a single CI pipeline.

**2025 by the numbers:** 241 commits — the revival.

---

### 2026: Fibercoins, Bitcoin, and Dynamic Branding

**Fibercoin runtime configuration** — the `FIBER_TOML` environment variable was finalized and hardened. Empty string overrides now work correctly (a coin can disable the default peer list or explorer URL), the `--legacy-peer-compat` flag enables connecting to older Fibercoin nodes, and the CLI automatically adapts its defaults (`RPC_ADDR`, `COIN`, `DATA_DIR`) to the configured coin.

**Dynamic ASCII art branding** — all help menus display the configured coin's name in ASCII art. `FIBER_TOML=aix.toml skycoin` shows the AIX banner; `FIBER_TOML=ness.toml skycoin` shows the Privateness banner.

**Bitcoin support** — the web wallet gained full Bitcoin wallet functionality: send, receive, native segwit (BIP84/bech32), BIP44 account structure, and UTXO management. Two backend options: Electrum server (TCP/TLS) or Bitcoin Core (HTTP RPC). All using Skycoin's existing secp256k1 library for transaction signing.

**`newcoin templates`** — print the embedded code generation templates to stdout so users can customize them without cloning the repo.

**`cli halt`** — gracefully shut down a running daemon via the CLI.

The Fibercoin ecosystem was verified with real third-party coins: [AIX](/posts/guide-multicoin-wallet/) and [Privateness (NESS)](/posts/guide-multicoin-wallet-2/).

**2026 by the numbers:** 145 commits and counting.

---

### The Architecture Today

```text
skycoin
├── daemon    — full node (adapts to any Fibercoin via FIBER_TOML)
├── cli       — 40+ subcommands for wallets, transactions, blockchain queries
├── web       — multi-coin thin client wallet (Skycoin, Fibercoins, Bitcoin)
├── explorer  — blockchain explorer with embedded Angular UI
└── newcoin   — Fibercoin creation with embedded templates

skyhw (in release binary)
├── daemon    — hardware wallet HTTP API server
└── cli       — device management, signing, firmware updates
```

One binary. Runs Skycoin, runs any Fibercoin, supports Bitcoin. Static compilation, no runtime dependencies, embedded frontends. The result of twelve years of iteration.

---

### Contributors

~80 unique contributors have worked on the Skycoin codebase (101 git author names, consolidated by identity):

| Contributor | Commits | Period | Focus |
|-------------|---------|--------|-------|
| iketheadore | 2,429 | 2016–2021 | Daemon, CLI, API, explorer, testing — touched everything |
| gz-c | 2,332 | 2017–2019 | API design, BIP32/BIP44, wallet architecture, explorer |
| aks (AKS) | 623 | 2013–2015 | Project founder, cipher, visor, first transaction |
| Olemis Lang | 561 | 2018–2019 | CI, testing, C library bindings, release validation |
| Senyoret1 | 460 | 2018–2021 | Hardware wallet, web wallet frontend |
| Moses Narrow (0pcom) | 401 | 2019–present | Cobra rewrite, Fibercoin support, unified binary, packaging |
| skycoin (bot/org) | 392 | 2014–2019 | Merge commits, CI |
| mahansky (Marek Mahansky) | 281 | 2017–2018 | Testing, wallet |
| TNN | 255 | 2014 | Daemon architecture, GUI framework, early infrastructure |
| Maykel Arias Torres | 254 | 2018–2019 | Testing |
| stdevEclipse | 210 | 2018 | C library bindings, testing |
| therealssj | 185 | 2018–2019 | fiber.toml, newcoin tool, Cobra migration |
| VavilenTatarskiy | 181 | 2017–2018 | Testing |
| Carlos Gutierrez Ramirez | 106 | 2018 | Testing |
| Sean Purser-Haskell (spurserh) | 101 | 2016 | Network proxy, single binary architecture |
| Mauricio López-Quintana Conesa | 93 | 2018–2019 | Testing |
| Samuel Visscher (visscherio) | 86 | 2017–2018 | Wallet, API |
| Eduardo Sánchez | 64 | 2018 | Testing |
| nakulpandey (Nakul Pandey) | 58 | 2017 | Explorer API |
| Norge Fajardo Vega (stdevNorge) | 56 | 2018 | Testing |
| Chen Houwu | 52 | 2017 | Networking |
| Nikita Kryuchkov (nkryuchkov) | 50 | 2019 | Networking |
| asmercrof | 42 | 2014 | Original wallet UI, Angular frontend |
| Vyacheslav Zgordan | 41 | 2017 | Networking |
| montycrypto | 35 | 2017 | Documentation |
| bztk | 32 | 2018 | Testing |
| stdevYuniers (Yunier J. Sosa Vázquez) | 34 | 2018 | C library bindings |
| Li Xing | 28 | 2018 | Networking |
| BigOokie | 27 | 2017–2019 | Documentation, newcoin docs |
| zhiyuan2007 | 23 | 2017 | Networking |
| Jose Luis Sanchez | 23 | 2018 | Testing |
| stgleb | 21 | 2017 | Networking |
| Pavel Milanes (CO7WT) | 19 | 2018 | Builds |
| Dmitry Kiselev (dmitrybugrov) | 23 | 2017 | Networking |
| mihis | 17 | 2018 | Testing |
| Leonardo Javier Esparis Meza | 11 | 2018 | Testing |
| Nyah Check | 11 | 2018 | Wallet |
| pravin | 10 | 2017 | Fixes |
| polarislee1984 | 10 | 2017 | Fixes |
| skycoin-main | 9 | 2016–2017 | Merge commits |
| Karlo Batrla (KarloB) | 6 | 2018 | Fixes |
| ZSM5J | 6 | 2018 | Fixes |
| samos | 5 | 2016 | Fixes |
| Nitin Surani | 5 | 2018 | Fixes |
| Morphium Hidrochloricum | 5 | 2018 | Fixes |
| johnstuartmill | 5 | 2014 | Fixes |
| ben | 5 | 2017 | Fixes |
| ratmil | 4 | 2018 | Testing |
| Michael (Zhiyi Weng) | 4 | 2017 | Fixes |
| Konstantin Ivanov | 4 | 2018 | Testing |
| Florian Zysset | 4 | 2017 | Fixes |
| edoardocoen | 4 | 2018 | Fixes |
| Carlos Ramos (Carlos R. Dev) | 6 | 2018 | Testing |
| Roman Tronenko | 3 | 2018 | Fixes |
| Masthead | 3 | 2014 | Fixes |
| Xa No | 2 | 2018 | Fixes |
| kaztriumph | 2 | 2017 | Fixes |
| Erich Kästner | 2 | 2019–present | Integration |
| cryptrol | 2 | 2017 | Fixes |
| cmdallas | 2 | 2017 | Fixes |
| Christian Kakesa | 2 | 2019 | fiber.toml fixes |
| asxtree | 2 | 2017 | Fixes |
| Xavier Ruiz | 1 | 2018 | Fixes |
| Waziri | 1 | 2018 | Fixes |
| up4k | 1 | 2018 | Fixes |
| threecs | 1 | 2017 | Fixes |
| skytofuture | 1 | 2017 | Fixes |
| SkycoinSynth | 1 | 2014 | Fixes |
| parkour86 | 1 | 2018 | Fixes |
| Oleg Mikhalev | 1 | 2018 | Fixes |
| nova | 1 | 2017 | Fixes |
| nnao45 | 1 | 2017 | Fixes |
| Mehul | 1 | 2018 | Fixes |
| Mauricio Perdomo | 1 | 2018 | Fixes |
| liuguirong | 1 | 2018 | Fixes |
| jimhsu | 1 | 2014 | Fixes |
| Etienne Tremel | 1 | 2017 | Fixes |
| Dawa Lama | 1 | 2018 | Fixes |
| Davor Kapsa | 1 | 2018 | Fixes |
| cell4711 | 1 | 2017 | Fixes |
| Aylin | 1 | 2018 | Fixes |
| Alex Sugak | 1 | 2018 | Fixes |

---

### What's Next

Active development continues on Fibercoin tooling, the multi-coin web wallet, and cross-platform packaging. The codebase is also embedded in [Skywire](/posts/skywire-codebase-evolution/), where it serves as the blockchain layer for the mesh network's coin economy.

See also: [The Evolution of the Skywire Codebase](/posts/skywire-codebase-evolution/) | [Skycoin: One Binary, Every Tool](/posts/skycoin-unified-binary/) | [Creating Your Own Fibercoin](/posts/guide-creating-a-fibercoin/)
