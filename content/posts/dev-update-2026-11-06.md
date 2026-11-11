+++
date = "2026-11-06"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — November 6, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The sixth of November was another light day on the main branch, while work on the Android app went on in its own branch and landed later. Two Skycoin wallet fixes changed which addresses a wallet uses, one for the change of a browser wallet's transaction and one for wallets built from an account xpub, and both reached the dashboard. The hypervisor UI took two fixes reported by users, and a developer tool built again.

### Skycoin: Change Addresses and Account Keys

A deterministic wallet kept in the browser asked the node for no change address, so the node sent the change back to the first address the transaction spent from, an address whose public key was already known. **`skycoin#3205`** sends the change to the wallet's next address and adds that address to the wallet once the node takes the transaction, and the advanced send form fills it in where the user can change it. A BIP44 wallet's next change address is likewise added only once the transaction is taken, not when it is built.

`cli nextAddress` and the xpub wallet type derived the direct children of the key they were given. The xpub that Skycoin wallets export, which Skywire uses as the reward address, is a BIP44 account key, so both returned addresses that no wallet scans. **`skycoin#3204`** derives the external chain first for an account key. A wallet saved before keeps deriving as it did, so its stored addresses stay valid, and it logs a warning. **`skycoin#3206`** updated a test's expected address to match, and **`6046`** brought both changes to the dashboard's wallet.

### Skywire: Hypervisor UI Fixes

The reward history on the rewards page had its title, labels, table headers and messages hard coded in English, so a Chinese UI still showed them in English, and its dates were always in the US format. **`6049`** moves them into the translation files with Chinese versions and formats dates in the UI's language. The login page logo is white artwork, which nearly disappeared on the light theme, as a user noticed on a fresh install, and **`6047`** darkens it there as the top bar already did.

**`6048`** made `hvinspect`, the tool that drives a browser to inspect the hypervisor UI, build again as its own module, and lets it find Brave or Chromium on the path instead of one fixed location. **`6045`** fixed a test in which the visor's inbox loop could take a parked group message before the test looked for it.
