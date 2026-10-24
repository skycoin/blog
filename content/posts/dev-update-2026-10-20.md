+++
date = "2026-10-20"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 20, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The twentieth of October finished the move to one Skycoin wallet GUI. The old node GUI's remaining features, including masked password dialogs, bulk send, offline transactions and Skywallet management, were brought into skycoin-web, which then became the node's wallet GUI while the old one was removed. Ethereum support also began moving out of the Android app and into skycoin itself, from keys and signing up to sending Ether and ERC-20 tokens in the wallet. On the Skywire side the web terminal at /pty was replaced with websh and stopped dropping sessions, SkyDNS stopped asking for five passwords on every restart, and the address resolver now rides out a store restart.

### Skycoin: skycoin-web Becomes the Wallet

**`skycoin#3130`** fixed sends from an encrypted server wallet, which always failed because the sign request carried no password, and replaced `window.prompt`, which shows a password as it is typed, with a masked dialog. **`skycoin#3131`** added the node GUI's bulk send, one `address,coins` or `address,coins,hours` per line. **`skycoin#3132`** added offline transactions: an Unsigned button builds a transaction without signing it, which suits a watch-only wallet, and dialogs sign a pasted unsigned transaction or broadcast a pasted signed one. An unsigned transaction built in the UI was identical to the one the node's API returns for the same address.

**`skycoin#3133`** added a Hardware Wallet settings page that shows a Skywallet's label, firmware and PIN state, sets up or restores a seed, backs up or checks it, manages the PIN and label, and wipes the device after confirmation. Firmware updates stay with the Skywallet tools, because the download servers send no CORS headers, and the page was tested against a fake device service since no device was on hand. **`skycoin#3135`** made skycoin-web use the node's own wallets and its CSRF token when a node serves it, since every send had failed against the node's default CSRF check.

**`skycoin#3136`** then made `-enable-gui` serve skycoin-web, keeping the wallets in the node, and removed the old GUI and the code that served it. The wallet now gets a content security policy by default, and the node gained the new-account endpoint both GUIs had called but only the standalone wallet server answered. **`skycoin#3139`** fixed nine callbacks the OnPush check flagged in the new dialogs, and **`skycoin#3150`** zeroed a build timestamp that broke the UI check. **`skycoin#3140`** fit the wallet to a phone, where every page had scrolled sideways, and gave it the old mobile wallet's city header art on small screens. **`skycoin#3134`** removed two 18 MB node binaries a merge had committed.

### Skycoin: Ethereum Moves In

Skywire's Android app carried its own Kotlin Ethereum wallet, and that support now moves into skycoin so Skywire can take it from there. **`skycoin#3141`** added the base package: bip44 keys on coin type 60, EIP-55 addresses, RLP, signed EIP-1559 transactions and ERC-20 call data, using skycoin's own secp256k1. Its expected values come from ethers v6, and ethers parsed six transactions signed here and recovered the sender. **`skycoin#3142`** let the wallet service hold Ethereum wallets, checking the first addresses and key from the Hardhat development mnemonic against ethers.

**`skycoin#3143`** added an RPC client that fails over through a list of keyless public endpoints, a history reader for Blockscout, and payment building with fee suggestions, tested by sending Ether and a token on a local Hardhat chain. **`skycoin#3144`** made skycoin-web's server offer Ether and ERC-20 tokens, USDT by default, beside Skycoin and Bitcoin, and **`skycoin#3145`** wired the UI to show and send them. Sending a gateway coin had never actually been wired, since the send form always built a Skycoin transaction, so encrypted Bitcoin wallets can now send too. On a local chain an encrypted wallet sent 0.25 ETH and a token amount through the UI, and the recipient's balance moved by exactly that.

The rest of the day filled in around that. **`skycoin#3147`** added slow, normal and fast fee presets for Bitcoin and Ethereum, and **`skycoin#3151`** shows the last good balance and history, with their age, when a refresh fails. **`skycoin#3153`** made the Ethereum RPC servers and indexer editable in the wallet, **`skycoin#3154`** lets a user add a fiber coin by node URL or an ERC-20 token by contract, and **`skycoin#3155`** added QR scanning in the send form, using the phone's scanner where the Android app provides one.

**`skycoin#3152`** closed a hole in skycoin-web's server, which answered every origin and allowed writes, so any page open in the same browser could read wallets and send from an unencrypted server wallet. It now refuses state-changing requests from another origin, following the cross-origin protection in Go's net/http, which TinyGo's lacks. **`skycoin#3146`** and **`skycoin#3148`** fixed the Windows CI lane after MSYS2 dropped libusb and hidapi from mingw64. Skywire picked all of this up in **`5738`**, **`5740`**, **`5743`** and **`5745`**, rebuilding the hypervisor UI that compiles the wallet.

### Skywire: The Web Terminal

**`5748`** fixed a visor's own web terminal over dmsg closing every session right after the banner. net/http times out a read on purpose when it takes over a connection for a websocket and then clears the deadline, but the noise reader kept that timeout error, so every later read on the stream failed. It no longer keeps timeouts, and a new test that serves the terminal on a dmsg listener reproduced the close before the change.

**`5749`** replaced xterm.js at /pty with websh's terminal page, a 2.2 MB TinyGo module that speaks the same websocket protocol. It also fixed two older bugs. Reattaching after a drop never worked, because the page stopped its pty client and killed the persistent shell the session was meant to keep, and keys could reach the shell out of order, because each keystroke was its own concurrent write. The page now detaches, and one writer sends keys in order. The mobile build leaves the page out, since F-Droid does not accept compiled wasm.

### Skywire: Fewer Prompts, Steadier Lookups

**`5750`** fixed every visor restart showing five password prompts. SkyDNS made a new tun interface on each start and configured it through five resolvectl calls, each of which systemd-resolved checks with polkit. Where resolved runs, SkyDNS now always uses its persistent interface, which takes one prompt to set up and none afterwards. **`5752`** made the address resolver answer a store outage with a 503 and a retry hint instead of a bare 500 with an empty body, and the client retries those, so a redis restart costs a few seconds rather than a five-minute autoconnect backoff.

**`5744`** made failed transport dials visible. A failed dial left only a debug log line, which hid a TinyGo build making 8 sudph dials in three minutes against 360 for the Go build. `visor state` now reports attempts, successes, failures and the last error per transport type, plus the last 512 failed dials, and that is how the resolver's 500s in a visor's first minute turned up.

### Skywire: Android and the Desk

**`5751`** put skycoin-web in the Android app's wallet tab, served by the phone's own visor core, keeping wallets from the old wallet reachable under a Previous wallet action. **`5747`** builds an x86_64 core for debug APKs so the app runs on an emulator, while release APKs stay arm64 only, and **`5746`** fixed the mobile build after the previous day's reward address check used functions only the desktop build has. **`5741`** moved the browser desk's window resize handles fully outside the window, where the right one had covered half of the terminal's scrollbar.
