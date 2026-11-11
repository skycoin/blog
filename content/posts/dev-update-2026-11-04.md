+++
date = "2026-11-04"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — November 4, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The fourth of November gave the visor a sense of whether it is on the network at all, and a visor that opens no transports of its own now keeps one to each dmsg server it uses. Skywire's logging moved off logrus to its own types on top of `log/slog` in seven steps, a new benchmark script set Go and TinyGo side by side on the hot paths and the first allocations came out of them, and v1.3.105 and v1.3.106 were released. The reward rules gained a date and an opt-in, and the Skycoin wallet started its own server rendered GUI at `/ui2/`, built the same way as the hypervisor's from the day before.

### Skywire: Knowing When the Visor Is Online

An Android user who started the app without internet saw it spin while it claimed to be connected. **`6020`** has the visor track whether it can reach the network, and **`6021`** settled what that means: online with at least one live transport, dmsg-only with a dmsg session but no transport, and offline with neither for 30 seconds or as soon as an app or the browser reports no network. The state is `connectivity` in the summary and in `visor state`, with counts of transports and dmsg sessions, the browser visor follows the browser's own online and offline events, and both UIs say when the visor is waiting for the network. Coming back from offline refreshes the network once.

A visor with public autoconnect off, the Android app's default, opened no skynet transports and reached the network only over its dmsg sessions. Every production dmsg server is also a visor, so **`6022`** dials one automatic transport to each dmsg server the visor holds a session with, preferring stcpr, then squicr, then sudph, in the order the reach feed ranks them. A second visor on a fresh config with autoconnect off had transports to both its dmsg servers about 20 seconds after starting. A config key and a `config gen` flag turn it off.

### Skywire: Logging Without Logrus

**`6029`** began the move by giving `pkg/logging` its own names for the logrus types and levels. **`6030`**, **`6031`**, **`6032`**, **`6033`** and **`6034`** moved the call sites in the commands, dmsg, the deployment services, the router, transports and apps, and the visor and VPN to those names, which also stopped the dmsg server and two services pulling in Skycoin's logger. One small fix came along: the stun service had built a logger from its configured level and then passed a different one that ignored it.

**`6036`** replaced the backend. `pkg/logging` now defines its own levels, fields, entries, hooks and loggers, writes through one emitter with the same text format, so the log files and the hypervisor's log view are unchanged, and offers `*slog.Logger` values that write the same lines. The JSON format was rewritten and checked byte for byte against what logrus wrote, and the log files rotate through a hook of its own. The only logrus import left is a bridge for the skydex engines in Skycoin, which still take a logrus logger.

### Skywire: Go and TinyGo on the Hot Paths

**`6027`** adds a script that runs eight hot path benchmarks under Go and under TinyGo with the release build's flags and prints them side by side, from transport IDs and noise frames to yamux streams and signature checks, and **`6041`** adds bytes per operation beside the allocation counts. The allocation columns are what it is for. **`6037`** takes the ChaCha20-Poly1305 nonce from a pool instead of building it on the heap for each frame, with the handshake and wire format unchanged, which brings noise frames from two allocations to none under Go and from ten to eight under TinyGo. **`6040`** updates the yamux fork to skip its flag handling for frames that carry none, two fewer allocations per frame under TinyGo, and **`6042`** pools the hash state for transport IDs, from four allocations to one under TinyGo with the IDs checked to be the same.

**`6043`** moved the metrics fork to upstream v1.45.0, which no longer needs one of the fork's patches. **`6018`** fixed a skymail test that left delivery attempts writing after the outbox stopped, and **`6019`** stopped the dashboard tour from starting inside the new UI's framed Chat tab. **`6023`** and **`6028`** are the v1.3.105 and v1.3.106 releases.

### Skywire: Reward Rules

**`6024`** brought the mainnet rules up to date with the current version rule, where each release becomes the minimum two weeks after it is published, and **`6025`** and **`6026`** set November 15 as the day from which a reward address must be an xpub. Hardware wallets cannot export an account xpub yet, so **`6035`** keeps a single address possible with an explicit opt-in, which the visor accepts only for an address that has never sent coins. **`6038`** adds the opt-in to both UIs and **`6039`** to the docs.

### Skycoin: A Server Rendered Wallet

**`skycoin#3197`** adds a wallet GUI at `/ui2/` beside the Angular wallet, with templ and htmx as in Skywire's. It started read only, listing the node's wallets, their addresses and history, and the node and chain status, behind the same authentication, CSRF and content security checks as the wallet API. **`skycoin#3199`** adds making and loading wallets, with BIP44 the default and a new seed typed back before the wallet is made, and shows each account's xpub for the reward system. **`skycoin#3200`** adds sending with a review step that warns about reused or exposed addresses and offers to move coins off addresses that have spent, and **`skycoin#3198`** made the generated code pass the format check.
