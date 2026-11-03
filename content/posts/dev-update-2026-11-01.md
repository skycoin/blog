+++
date = "2026-11-01"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — November 1, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The first of November started dmsg-async, store and forward for keys that are offline. Messages for an offline visor wait on inbox hosts the recipient chooses, usually its own always-on visor or its hypervisor, and dmsg servers only relay. The design, the library, the discovery endpoint and the visor side all landed by the end of the day. Skymail became a regular app with its own specification, the dashboard's Wallet page can now make BIP44 wallets, Decrypt Wallet stopped dropping a seed without asking for the password, and a browser visor now keeps its group memberships across a reload.

### Skywire: dmsg-async

A message to a visor that was offline had nowhere to wait. An earlier design that held every message on the shared dmsg servers and accepted deposits for any key was closed. **`5965`** is the design note that replaced it: messages wait on inbox hosts the recipient picks, the host applies the recipient's own sender policy, and it runs on a new dmsg port with no change to sessions or discovery entries.

**`5966`** is the library. An inbox host takes a registration only for a key it accepts and whose signed record names it, and applies the recipient's sender policy to the key the dmsg stream authenticated, so a key the recipient refuses cannot deposit. The disk store keeps only headers in memory, with a memory store as the other option, and a deposit reference makes retries store a message once. The host serves dmsg port 85. **`5967`** lets dmsg discovery keep inbox records on their own endpoint until they expire, since a sender needs the record while the recipient is offline and a client entry leaves discovery an hour after its last registration. The record's own signature authorizes the post, and an older sequence number is refused.

**`5971`** runs it on the visor. As a host, a visor holds for its own key, the visors it manages as a hypervisor and any configured extras, and hosting is on by default for a hypervisor. As a recipient it registers with its inbox hosts, its hypervisors unless configured otherwise, names in its record only the hosts that took the registration, publishes the record and fetches for the ports it has handlers for. `skywire cli async` shows and drives all of it. In a live test a TinyGo browser visor hosted for a native visor, which was halted while the tab left a message for it, and fetched the message over dmsg once it was back. The test also found a host bug, which stopped holding for a managed visor once that visor went offline, and acceptance is now checked at registration only.

### Skywire: Skymail as an App

The mailbox was registered with the launcher from inside the visor and used the visor's own dmsg client and skynet listeners, so it was the one app that could not run as a separate process. **`5959`** makes it an app like skychat. It listens and dials through the app client and serves a control surface the visor's mail API calls, in process or over TCP with a token. The visor keeps its secret key, and the app asks it to seal and open envelopes over three new app calls the visor answers only for skymail. **`5960`** adds a specification for skymail covering addressing, the SMTP profile, the sealed envelope format, the app calls, helpers and carrying, and the limits, and **`5961`** fixed a data race it exposed in reading the hypervisor list.

### Skycoin: BIP44 Wallets in the Browser

The dashboard's Wallet page keeps its wallets in the browser, and there it always made a deterministic wallet even with BIP44 selected. **`skycoin#3187`** adds BIP44 account derivation to the browser cipher, using the same code as the node's BIP44 wallets, and **`skycoin#3188`** makes, scans and spends from BIP44 wallets in the browser wallet, adding used addresses on both chains with a gap limit of 20. **`skycoin#3189`** kept a new test within a 32-bit integer for 386, and **`5968`** brings it to the dashboard. For the standard test mnemonic, with and without a passphrase, the Wallet page gives the same account xpub and first addresses as the node does. **`5964`** clarified in the reward guide where the wallet page lives.

Decrypt Wallet on a wallet kept in the browser dropped its encrypted seed without asking for the password, so when the seed was not in memory, as after a reload, it was lost. **`skycoin#3190`** asks for the password, decrypts the seed, next seed and passphrase, and checks them against the stored xpub or addresses before storing them unencrypted, and a wrong password changes nothing. The backup page now shows the seed passphrase and says both are needed to recover the wallet. **`5970`** brings it to the dashboard.

### Skywire: Groups in the Browser and Cleanup

A browser visor that was a group member lost every group on a reload and needed a fresh invite to get back in, because its group store kept records only in memory. **`5963`** saves them to a JSON file after each change, with the keys still sealed, and also marks a group active again once its subscribers are fresh, where only the manager's own reconnect had done that. **`5954`** drops a cached publisher connection after repeated fill breaks, since a member in a six hour soak stopped receiving for 15 to 20 minutes about once an hour while reusing a connection that never answered. **`5962`** fixed a CXO test that checked the closing node before it finished cleaning up.

**`5969`** replaced deprecated standard library calls across the tree. The accept loops stopped using `net.Error.Temporary` and now back off like `net/http`'s server, from 5 ms doubling to one second, and the function style atomics in 60 files became atomic types, which are always 64-bit aligned on the 32-bit release targets.
