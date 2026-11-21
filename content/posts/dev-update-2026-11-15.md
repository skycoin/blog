+++
date = "2026-11-15"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — November 15, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The fifteenth of November belonged to the Skycoin wallet. An address whose public key is on chain, because it has sent coins or because its account's extended public key was shared, is more exposed than one that has only received, and the node can now move the coins off such addresses by itself on every block. The same work reached wallets kept in the browser, which the node never sees. Split sends from the day before reached both wallet interfaces, and on the Skywire side a dial that asked for two or more hops stopped settling for a direct transport.

### Skycoin: Auto-Sweep of Exposed Addresses

**`skycoin#3311`** adds a sweep rule for each wallet, off by default and kept beside the wallet files. On each new block the node moves the confirmed coins of exposed addresses to the next unused address of a later account, to another wallet or to a fixed address. It refuses a destination that is itself exposed. Each sweep burns all the coin hours of the coins it moves, and turning a rule on asks to confirm that. **`skycoin#3312`** adds the API to read and set a rule and to unlock an encrypted wallet for sweeping, which holds the password in memory only, and fixes a rule loaded at start that waited a block before its first sweep.

**`skycoin#3315`** gives the rule two levels. The first sends every exposed address to one destination, and mappings send one address, or one account's exposed addresses, to a destination of their own. Including addresses that have sent is now optional. **`skycoin#3316`** names the CLI commands `sweepRule`, `sweepUnlock` and `sweepLock`, flat like the other commands, and **`skycoin#3319`** moves the mapping parser where the web panels can read and write the same syntax.

The panels came next. **`skycoin#3313`** and **`skycoin#3314`** add the sweep panel to node wallets in the new interface and the Angular one, and **`skycoin#3320`** splits it into a simple view and an advanced section. **`skycoin#3317`** formatted a regenerated template.

A wallet kept in the browser never reaches the node, so the page has to sweep it. **`skycoin#3318`** adds sweep planning to the browser cipher, using the same exposure, routing and fee code as the node. **`skycoin#3321`** and **`skycoin#3323`** run it in the page in both interfaces, unlocking an encrypted wallet for a chosen time with the password in page memory only. **`skycoin#3322`** fixed the web server's cache of transaction queries, which keyed only on the addresses, so a verbose query could get a plain one's cached answer. **`6247`** brought auto-sweep into Skywire. The node runs the sweep service only when its wallet API is enabled, which `skywire skycoin daemon` leaves off by default.

### Skycoin: Split Sends in the Wallets

A split send of a wallet's whole balance failed as insufficient, because each part kept change that a later part could not spend, and **`skycoin#3306`** keeps change only when the outputs left can still pay the rest. **`skycoin#3307`** lets the endpoint the web wallet uses split a send too. **`skycoin#3309`** and **`skycoin#3310`** split sends in the new and the Angular wallet, showing every part's totals and ID and listing the parts already sent if one is refused. **`skycoin#3308`** stops a web wallet send from spinning for an hour with no message while the node could not be reached, since no request to the node had a time limit. **`6243`** took all of this into Skywire.

### Skywire: Min-Hops Dials

A dial that asked for two or more hops came up as one direct leg whenever a direct transport to the destination existed, and a skynet forward with two routes and a minimum of two hops showed it. The group then stayed at one leg, because every two hop leg the mux planned was refused for not matching the first leg's length. **`6251`** keeps such a dial off the direct transport. **`6246`** fixed a flaky QUIC listener test from the day before by counting the connections the listener accepts.

### Skywire: Memory, Updates and Mobile

A process that keeps a large CXO feed subscribed held it three times over, in the store, the subscriber's cache and the manager's snapshot, and **`6244`** keeps one copy. **`6245`** streams a 228 MB bandwidth page of the reward server instead of building it in memory several times over, and **`6250`** adds a guide with screenshots for setting a wallet's extended public key as the reward address.

The Skywire update service now defaults to the binary channel on amd64, arm64 and arm, so updates download the develop build instead of compiling from source, and **`6248`** documents it. Skywire Mobile 0.0.12 was released, with mobile data control, direct LAN mail and reward address discovery. **`6241`** adds its screenshots and changelog, and **`6242`** raised the release APK size budget after the build came out just over 30 MB.
