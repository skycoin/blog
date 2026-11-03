+++
date = "2026-10-26"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — October 26, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The twenty-sixth of October started from a Raspberry Pi Zero W with 448 MB of memory that could not keep up with the transports other visors dialed in to it. A visor now watches its own memory and garbage collection, and stops taking new automatic transports while it is short. Its bbolt stores stopped writing their whole freelist on every commit, kcp-go sessions stopped holding a 64 KB queue they rarely use, and two more CXO changes cut idle goroutines and fixed connections that never closed. The hypervisor UI now listens on localhost by default, the Android app got a user guide, a hardware survey and the web wallet's features, and Skycoin merged post-quantum block signatures, addresses and wallets, all off by default.

### Skywire: Small Boards Under Pressure

Nothing bounded the transports other visors dial in to a small board. **`5825`** makes the visor react to its own pressure instead of a configured number. Every 15 seconds it reads the memory still available, for the machine or its cgroup, and the share of its CPU spent in garbage collection over the last minute. Pressure starts under 10 percent of RAM or 256 MiB available, or above 25 percent GC, and ends with room to spare. While under pressure the visor refuses new inbound automatic transports, publishes that it accepts none so autoconnect elsewhere sees it as unreachable, and stops its own autoconnect once it has two transports. Its hypervisors, its managed visors, user transports and reconnects are unaffected, and the state shows in `visor state`.

The same board allocated about 870 MB in its first 25 minutes, 70 percent of it inside bbolt. With the default array freelist every commit writes the whole freelist and merges it into a new slice, so on a fragmented file each small commit makes garbage in proportion to its free pages. **`5826`** opens the CXO, stats and service uptime stores with the freelist left out of commits and kept in a hashmap. On a 40,000 object store with 90 percent deleted, allocation per put and delete went from 1.36 MB to 41 KB and commits ran seven times faster, at the cost of an 11 ms scan when the file opens.

**`5827`** brings in a kcp-go release whose sudph sessions grow their send queue only while packets wait, instead of holding 64 KB each for their whole life, about 17 MB on a visor with 270 sudph sessions. **`5824`** lets `skywire.conf` set the memory limit and the autoconnect caps from two days earlier, since a fresh install could only set them live, and the board needs both.

The CXO work from the day before continued. **`5817`** stops idle feed heads from holding a goroutine each, 2,939 of them on a deployment server, and starts a head's loop only while it fills a root. **`5816`** fixed a regression from that work: a closing connection now woke its reader only through a read deadline, which dmsg over skywire transports ignores, so reaped connections stayed parked forever and two service publishers grew from about 20 connections to 2,790 each. An interrupted connection now closes once its writes drain, bounded at 10 seconds.

### Skywire: Safer Defaults

The hypervisor UI and the desk listened on every interface, and a new install has no admin account until someone creates one from the UI. On a VPS or a board with a public address, whoever reached it first could create the account and take over the UI, visor shells included. **`5828`** serves both on `127.0.0.1` by default. `HVHTTPADDR` and `HVDESKADDR` in `skywire.conf`, or their flags, still serve them on the LAN, existing installs move to localhost on their next autoconfig, and autoconfig says how to get LAN access back.

**`5830`** makes a new reward address an account xpub everywhere one can be set, while an address already set is still read, and **`5820`** points the help at the wallet GUIs' own Account xPub field. **`5819`** stopped the stcpr accept loop from retrying about 10,000 times a second when its listener closed during shutdown, which under TinyGo kept the visor from ever finishing its halt. **`5818`** lets a vpn-server on a machine with two default routes, such as a laptop on WiFi and Ethernet, masquerade through the one the kernel uses instead of refusing to start.

### Skywire: Android

**`5832`** added a user guide for the Android app, walking through connecting, the Apps hub, SkyVPN, SkyDNS with and without SkyVPN, SkyChat, the wallet and settings, with 14 screenshots from a fresh install, seven of which also go into the store listings. **`5829`** gave the app a usable hardware survey. Android hides DMI, the machine ID and real MAC addresses from apps, and the survey library aborted, so the app now passes its own device fields to the core, which fills the survey from them and marks emulators.

**`5772`** brought the skycoin web wallet's features to the app's native wallet, one commit per feature: 24-word phrases, BIP 44 Skycoin and fiber coin wallets with xpubs, a seed passphrase, payment request QR codes, sends to several addresses, custom change, offline signing, Ethereum fee levels, node checks and a node details screen, and reaching a node by its `.dmsg` name through the visor's own resolver. USD prices stay off until turned on, because fetching them tells a price service the phone's address and its coins. The hardware wallet is left out, since it needs the device's USB protocol and there was no device to test with.

### Skycoin: Post-Quantum, Off by Default

**`skycoin#3164`** brought the post-quantum branches into develop. Each part is switched on per coin in `fiber.toml` and stays off when its key or height is unset, so Skycoin's own chain and every existing fiber coin behave as before. From a configured height blocks carry an ML-DSA-44 signature beside the secp256k1 one, which older nodes keep following. From another height version 1 post-quantum addresses can be spent by transactions with a witness, which is the hard fork. A `pq` wallet type and CLI commands go with them, and `docs/guides/pq-hard-fork.md` describes upgrading a running coin. A build with nothing set synced all 195,727 mainnet blocks from older peers with no errors.

**`skycoin#3171`** put the post-quantum wallet back into the browser wallet after a restructuring had dropped it, and fixed a bug it found along the way: a wallet saved without a password kept its seed but not its keys, so after a reload it signed with empty secrets. **`skycoin#3170`** lets a node read blocks from a database that predates the signature bucket when it opens it read-only, which had broken the explorer's end-to-end test, and **`skycoin#3169`** removed a stale bundle chunk the merge left behind.
