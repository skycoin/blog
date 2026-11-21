+++
date = "2026-11-13"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — November 13, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The thirteenth of November was a quieter day of cleanup that will matter later. Skycoin stopped panicking on bad input across its node, wallet and cipher code and returns errors instead. Both projects finished renaming their exported booleans, and the reward cycle now runs the same calculation as the service it is meant to replace. A few small fixes came straight from users in the Telegram group.

### Skycoin: Errors Instead of Panics

A great deal of Skycoin code panicked on states that were meant to be impossible, and some of them could be reached with bad input. **`skycoin#3289`** covers startup, config and commands, so a bad environment override now prints a plain error where it printed a panic. **`skycoin#3290`** covers wallets, transaction building and the visor, such as a fingerprint that cannot be derived, a duplicate unspent output or a malformed genesis block. **`skycoin#3293`** covers the daemon and its networking layer, and **`skycoin#3294`** covers signing, key derivation, BIP32 and BIP39, decoding and block headers. Each lists the exported signatures that changed, so other modules know what to update. **`skycoin#3292`** fixed the new coin template, which had not followed one of those changes.

### Plain Names for Exported Booleans

The renames from the day before reached exported names. **`6206`**, **`6208`** and **`6212`** rename them across the visor, the routing, transport and app layers, and skychat, CXO, mail and the proxy, so `IsAlive` becomes `Alive` and `HasAvatar` becomes `AvatarSet`. JSON tags are unchanged, and structs that cross RPC between visors keep their old names so visors of mixed versions still talk. **`skycoin#3295`** does the same in Skycoin, with tags that keep the old JSON keys, so peer files, the API, the web wallet and the explorer read the same fields.

### Skywire: Rewards, VPN Logging and User Reports

The reward cycle command had its own calculation that only counted presence, so its files never matched what the reward service wrote through its shell pipeline and it could not take that pipeline's place. **`6207`** puts the calculation in one function used by both, with the pipeline's flags as defaults, and **`6209`** updated the skill text that still named the removed flag.

**`6205`** sends the VPN client and server diagnostics through the app logger, where before they printed straight to the terminal. Linux was built and tested, and the macOS and Windows files were only compile checked.

Three fixes came from reports in the Telegram group. The browser filled the saved hypervisor login into skychat's current password field, so removing the skychat password failed, and **`6204`** marks those fields so the browser leaves them alone. The pty page's Paste did nothing on plain HTTP at a LAN address, where the browser offers no clipboard access, and **`6210`** opens a small paste box there instead. A short window could not scroll the Load Wallet dialog to its button, and the error for a seed that already has a wallet showed behind the dialog, which **`skycoin#3296`** fixed and **`6214`** brought to the hypervisor. **`6213`** updated a tracing dependency.

### skycoin.com

**`skycoin.com#93`** updated the site generator's dependencies, including Skycoin v0.28.7, and **`skycoin.com#94`** taught the site's address checker to accept the post-quantum version 1 addresses that release introduced.
