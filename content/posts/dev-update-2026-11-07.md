+++
date = "2026-11-07"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — November 7, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The seventh of November was release day for v1.3.107, and most of it went into getting there cleanly. A dependency update across Go and npm took two follow ups to build on every target, the release moved to Go 1.27.3, and the TinyGo builds moved to a toolchain on a patched LLVM after a compiler bug was found corrupting logger fields. Several reports from the community chat were fixed, among them a network visualizer that answered 503 on a fresh visor and a wallet that could not be created on a page opened over plain http. The browser desk can now load a TinyGo build of the visor on request.

### Skywire: Toolchains and Dependencies

**`6053`** updated the Go modules for Linux, browsers, Windows and macOS, took the latest Skycoin, and cleared the open Dependabot alerts in the dashboard and the transport visualizer, with two dependencies held back where the newest version would not build. Two things broke. go-fuse's new release did not compile on 32-bit Linux, and **`6056`** takes its master branch, where the fix already is, so the armv7 build works again. The audio codec's new release required Go 1.27.3, which the end to end docker build did not have, so **`6057`** held both back for a moment, and **`6058`** then moved the whole tree, the docker images and the F-Droid recipe to Go 1.27.3 and took the codec release, which stops its decoder reading past the end of a buffer in skychat voice.

The TinyGo builds had a worse problem. The toolchain from four days earlier was built on LLVM 23.1.3, whose function attributes pass can wrongly mark an escaping argument as not captured, and TinyGo then places it on the stack. Since the logging change of November 4 that corrupted logger fields and crashed the TinyGo builds. **`6059`** builds the release assets with a toolchain on LLVM 23.1.5 with the upstream fix, **`llvm-project#231536`**, applied. A native Skywire build on the same patched LLVM ran on two visors for close to an hour each without a crash.

**`6054`** is the v1.3.107 changelog, and it also has the reward xpub guide say the Wallet page must be opened at localhost or over https, with how to reach a remote hypervisor through an SSH tunnel. **`6055`** lets `hv serve` serve a TinyGo build of the visor module beside the Go one, which the desk loads when opened with `?wasm=tinygo`, so theskywirenetwork.net can offer the TinyGo visor without making it the default.

### Skywire: Fixes from the Community

The network visualizer returned 503 on any visor that had not routed yet, because each request subscribed to the routing feed and dropped it before its first fill of about two minutes could finish. **`6050`** keeps the feed once it is first read, as route calculation already did, and waits briefly while it is cold. On a dev visor the visualizer answered 503 for about two minutes after start, then the full list from cache in under a second.

Creating a wallet from the dashboard opened at a LAN address over http failed with an unexplained error, because browsers only offer Web Crypto on secure pages. **`skycoin#3207`** explains this on the wallets page and lists the ways to open it securely, **`skycoin#3208`** fixed the wallet type select drawing white text on white in the dashboard, and **`6052`** brought both to Skywire.

A desktop wallet holding hundreds of small outputs, as a reward address does, could build and preview a transaction spending them all, which the node refused only after signing. **`skycoin#3214`** checks the size when the transaction is made and says how many outputs it spends and that fewer must be sent at a time. About 336 outputs fit in the 32768 bytes allowed. **`skycoin#3209`** updated Skycoin's own dependencies and **`skycoin#3210`** fixed the two CI checks that followed.

### Skywire: Reward Addresses

BIP32 allows an index at which no key can be derived, and says to move on to the next one, which the Skycoin wallets do. **`6051`** makes the reward system skip such an index too, where it had returned an error, and refuses a reward xpub whose account step is not hardened or from which no address can be derived. Such an index turns up about once in 2^127, so the test replaces the derivation to reach it.
