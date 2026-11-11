+++
date = "2026-11-09"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — November 9, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The ninth of November gave the hypervisor offline alerts. It now remembers the visors it has managed across a restart, mails or posts a webhook when a watched visor has been down for a while, tells a whole site going dark from one board failing, and no longer raises an alarm for a visor that said it was restarting or leaving. dmsg servers stopped checking signatures the session already proves, the Skycoin wallet got back the features it lost when the old desktop GUI was replaced, and v1.3.108 and v1.3.109 were released, the second to restore the TinyGo builds.

### Skywire: Offline Alerts

A visor that was down when its hypervisor restarted simply vanished from the list. **`6069`** keeps the managed visors in a file beside the user database, so after a restart they show as offline with their last seen time, `hv ls` lists them, and `skywire cli visor hv forget` drops one. **`6070`** builds the alerts on that. A visor sends one mail or webhook when a visor it watches has been offline for a set delay, five minutes by default, and one more when it is back, and nothing for a visor that returns within the delay. Mail goes straight to the recipient's mail server or through an SMTP relay, and the settings change at runtime with `skywire cli visor alerts set` or the API. **`6072`** adds an Offline alerts section to the Settings tab with a button to send a test.

An operator with several skyminer sites asked whether an alert can tell a power outage, an internet outage and a faulty board apart. **`6074`** sends one site alert for visors behind one public IP that go down together. For a single board, it asks an online visor on the same LAN whether the board still answers. On recovery, it compares the host's uptime with the outage to say whether the board rebooted. Boards also report a read-only root, storage errors and disk use while they are still online, and two visors sharing a LAN address raise a conflict. This was tested with unit and in-process tests and not yet on real boards.

The first alerts fired for a visor that had been removed from its hypervisor on purpose, and for one whose only problem was a dropped hypervisor link. **`6075`** has a visor say goodbye before it leaves, as detached or restarting, and when a link drops without that, the hypervisor calls the visor back over skynet and then dmsg before calling it offline. One state now feeds `hv ls`, both node lists and the alerts, a restarting visor gets one delay of grace, and a visor stuck reconnecting gets its own link lost alert. **`6073`** fixed a race in a watcher test.

### Skywire: dmsg and Releases

A dmsg server checked two signatures for every stream it bridged, the initiator's on the request and the destination's on the response, which both ends check again, and on a busy server this was about an eighth of its CPU. **`6068`** skips them when the session already proves the signer, since noise or a verified certificate authenticates every session, while relayed requests keep the full check. Ten streams through a test server took 40 checks before and 20 after.

**`6082`** and **`6086`** are the v1.3.108 changelog, and **`6081`** adds guides for offline alerts and for running a Skycoin node and wallet, and a macOS install section not yet tried on a Mac. The TinyGo release builds of v1.3.108 failed, because TinyGo's `net/http` lacks the cross-origin protection the CSRF guard from the day before used. **`6087`** runs the same check itself, and **`6088`** is v1.3.109 with that fix. The install command generator for the apt repository then failed under TinyGo's browser build, which has no MX lookup, and **`6089`** gives the alerts package its own type for it.

### Skycoin: The Wallet Gets Its Features Back

When skycoin-web replaced the old desktop GUI, some features did not come along. **`skycoin#3234`** restores the "send all available coins" link, and **`skycoin#3236`** password reset by seed and the update and CSRF banners. **`skycoin#3237`** brings back personal notes on transactions, kept in the browser, unsigned transactions from typed addresses for watch-only and cold storage use, and payment links that fill the send form. **`skycoin#3238`** restores confirming a hardware wallet address on the device, tested only against a mocked device, Scan Addresses at desktop width, adding several addresses at once and temporary wallets. **`6083`**, **`6084`** and **`6085`** brought them to the dashboard.

**`skycoin#3221`** stops checking a derived public key up to five times, which takes deriving one from a secret key from 141 to 81 µs with identical output, and **`6071`** brings it in. **`skycoin#3232`** adds `addressSpent` to the CLI, **`skycoin#3233`** lets a fiber chain's config set its coin name, so a chain like NESS stops reporting itself as skycoin, and **`6079`** and **`6080`** bring both to `skywire skycoin`. The other Skycoin changes repeated Dependabot's npm updates for the explorer, the web wallet and the skydex client.

On the reward side, **`6076`**, **`6077`** and **`6078`** settled on the rule for single reward addresses: one is paid as before until November 15, and from that day a visor whose single address has sent coins is no longer eligible, with its share going to the other eligible visors.

### TinyGo

**`tinygo#6091`** implements `os.Hostname` on Linux, which had returned not implemented on every target. It uses uname and falls back to the kernel's hostname file, as Go does.
