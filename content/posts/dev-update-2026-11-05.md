+++
date = "2026-11-05"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — November 5, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The fifth of November was a quiet day with one thread. The server rendered Skycoin wallet that started the day before learned to work with wallets kept in the browser, the way the web wallet keeps them, and Skywire now serves it under the dashboard's `/wallet/` path beside the Angular wallet.

### Skycoin: Browser Wallets in the New GUI

A node run as a web wallet keeps no wallets of its own, so its `/ui2/` pages only pointed to the classic wallet. **`skycoin#3201`** serves the wallets kept in the browser, in the classic wallet's storage format, so a wallet made in either UI opens in the other. The page sends the server only the public part of each wallet, its addresses, account xpub and label, and the server renders balances, addresses, history and the account xpub from that. Making and loading wallets run in the page with the same wasm cipher the classic wallet loads, a new wallet always has a password, and the forms have no named fields, so a seed or password cannot be submitted by accident, which a test checks.

**`skycoin#3202`** adds sending from those wallets, and moving coins off their exposed addresses, with keys and the seed staying in the page. The page decrypts the seed, checks it against the wallet's xpub or first address and derives the next unused change and receive addresses. The node builds the unsigned transaction and the review shows the same warnings as for node wallets. Before signing with the wasm cipher, the page checks that the outputs pay exactly the reviewed amount to the reviewed address and that everything else returns to the wallet.

### Skywire: The New Wallet in the Dashboard

skycoin-web served only the Angular wallet, so the new pages were out of reach from it and from programs that embed it. **`skycoin#3203`** mounts `/ui2/` on the same handler, reaching the node through the same proxy and dialer as the Angular wallet. **`6044`** takes that into Skywire, so `skywire skycoin web` serves it on its port, and when skycoin-web runs inside the visor the hypervisor hands it `/wallet/ui2` and the paths those pages load, behind the same session as the rest of `/wallet/`. A test seed loaded through both paths sent a transaction that confirmed on a peer on a private chain, though the hypervisor path ran in a test harness rather than a full visor.
