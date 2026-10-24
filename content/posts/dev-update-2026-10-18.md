+++
date = "2026-10-18"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 18, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The eighteenth of October was a quieter day split between the Skycoin wallet and the test lanes. Hierarchical (bip44) wallets now get a fresh change address from the command line, show their account xpub while encrypted, and the desktop wallet reports a wrong password instead of spinning. On the Skywire side the CI lanes that had been failing on develop were fixed, which turned up two real bugs in how CXO fills a tree, and Skywire Mobile 0.0.8 was prepared with a long list of SkyMail, wallet and SkyChat improvements.

### Skycoin: Bip44 Wallet Fixes

**`skycoin#3119`** fixed `createRawTransaction` sending change back to the sending address, or to the wallet's first entry, on bip44 wallets when no change address was given. The help text promised a new change address, but only the node side did that. The CLI now asks the node which change addresses are unused, takes the next one, and saves the wallet when it generates a new entry. Deterministic wallets and an explicit change address are unchanged, and a check against a local node sent the change output to the change chain.

**`skycoin#3120`** fixed the xpub endpoint panicking for the account path of an encrypted bip44 wallet, since deriving the account public key needs the private key, and the GUI then hid all three xpubs. The account public key is now stored in the wallet file and served while encrypted, older files have it filled in on their next unlock, and an older encrypted file gets a clear error instead of a panic. The wallet page shows each xpub on its own. **`skycoin#3122`** fixed the decrypt dialog spinning forever after a wrong password. Since the switch to OnPush change detection, the button, the message bar and the dialog changed state without marking themselves for a check, so an error that arrived after the request never reached the screen. It now shows "Incorrect password" and frees the dialog. **`skycoin#3121`** updated every dependency.

Skywire picked these up in **`5724`** and **`5726`**, and its reward distribution example now builds transactions so change goes to an unused address. **`5725`** updated every module for the host, js/wasm, Windows and macOS builds, keeping go-fuse at v2.11.0 because the next release does not build for 32-bit Linux.

### Skywire: Green Lanes and Two CXO Bugs

**`5722`** fixed the test lanes that had been failing on develop. The committed transport graph viewer module no longer matched a fresh build, the newest linter flagged twenty deliberately ignored goroutine errors, and two end-to-end tests broke after the day before moved the skysocks client to loopback, since those tests reach it from another container. The tests now pass the old address explicitly, and the loopback default stays for users.

The fourth failing lane was a real bug. After a CXO root filled, the code that tracks known roots deleted the newer root that had arrived during the fill instead of the older ones, so the next fill had no connection to fetch from and failed with "no connections to fill from". It now keeps every root from the next sequence number on. **`5723`** found the second bug when the same tests kept timing out. Closing a filler reset its count of requests in flight, but a late reply to the previous filler's request still decremented it, so the next fill started at minus one and gave up as soon as its single connection was busy. Each request now carries the id of the filler that made it, and replies for another filler are ignored. Both have unit tests that fail on the old code.

### Skywire Mobile 0.0.8

**`5721`** prepared the next Skywire Mobile release. SkyMail no longer reports a large send as failed while it is still being delivered, or delivers it twice, because the mail send's write deadline is now five minutes and a second tap is blocked. It also counts attachment size as the mail travels, has its own contact list, batch selection, distinct read and unread mail, and a switch that moves every address between dmsg and skynet.

The wallet shows each address's balance, can send from one chosen address with change returned there, gives control over coins and coin hours on Skycoin sends, and fails over between an ordered list of nodes per coin. Older 24-word Skycoin seeds without a checksum can be restored after a warning. SkyChat ends message approval when a chat or contact is deleted, puts an accepted pairing in Contacts on both sides, and is now fully translated into Chinese, Spanish and French, following the system language. The release also carries its F-Droid changelog.
