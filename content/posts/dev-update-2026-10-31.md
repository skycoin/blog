+++
date = "2026-10-31"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — October 31, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The thirty-first of October gave skymail delivery to visors that are offline. Mail that cannot be delivered now waits in an outbox and is retried, envelopes are sealed by the sender so another visor can carry them without becoming the apparent sender, and helper visors carry a sender's queued mail while the sender is away. The visor list in the hypervisor UI now nests each sub-hypervisor's visors under its own row, skychat keeps group history by default and gained its moderation commands in the CLI, and a fix in the web wallet makes a wallet created with a password actually encrypted on disk.

### Skywire: Mail That Waits

Mail to a visor that was offline failed at once, so the sender had to try again by hand while both visors happened to be online. **`5945`** adds offline delivery in three steps. First an outbox: a temporary failure, an unreachable peer or a 4xx reply, files the message there and the send succeeds with the recipient marked as queued, while a refusal such as a whitelist that leaves the sender out still fails at once. The visor retries after one, five and fifteen minutes, then hourly, at once on start, and at once when the recipient delivers mail to it, until the mailbox's maximum age.

Second, sealed envelopes. A mailbox trusted only the key on the other end of the connection, so mail another visor carried would have shown that visor as the sender. An envelope is now signed by the sender and encrypted to the recipient with an ephemeral key exchange and ChaCha20-Poly1305, and the signature covers the recipient's key so it cannot be resealed to someone else. Third, helper visors: a sender that will be away, such as a closed browser tab or a laptop asleep, hands sealed copies of its queued mail to visors that carry them, by default the visors it manages as a hypervisor. It is for the desktop and browser visors.

### Skywire: Hypervisor UI Nesting

The visor list showed each sub-hypervisor's visors in a separate panel in the old row layout, ignoring compact mode and repeating the sub-hypervisor as its first row, with its dmsg server and services columns always empty. **`5955`** shows those visors as indented rows under the sub-hypervisor's own row, behind a collapse toggle, with the same cells as the main table and the columns kept aligned. The entries a sub-hypervisor reports now carry dmsg servers, running apps and the public and autoconnect flags, so those columns fill in once sub-hypervisors run this version. **`5956`** keeps the gold star for the hypervisor serving the UI and gives every attached hypervisor a silver one, since labels repeat and it was hard to tell them apart. **`5957`** shows only values in the small-screen list, with the status dot beside the full public key and the transport count, so visors with the same label can be told apart on a phone.

### Skywire: Skychat Groups

The skychat UI loads group threads from the visor's group history, which was off unless a path was configured, and config generation never set one. On a default visor group threads opened empty after a reload. **`5952`** keeps the history in the visor's local directory by default, with `"off"` to turn it off, and backfills earlier messages from the group feed on start. **`5953`** gives `skywire cli skychat group` the moderation commands the visor already had RPCs for: join requests, approve and deny, remove, ban and unban, mute and unmute, read-only, rename, the group picture and the join proof of work.

### Skycoin: Web Wallet Fixes

The web wallet's first run form ignored its password, so a BIP44 wallet created there was written with its seed in plain text, and the add wallet dialog's later encryption failed for wallets kept by the wallet service. **`skycoin#3183`** passes the password to wallet creation, which encrypts before the file is first written. It also shows a new wallet's xpub and encrypt options without a reload and lists the first addresses each xpub derives. **`skycoin#3184`** makes New Address on a wallet's change chain add a change address instead of an external one, and **`5950`** brings both fixes into `skywire skycoin web`.

On the reward side, **`5948`** now refuses chain xpubs, which pay addresses their wallet never lists, and shows the first addresses an account xpub pays so they can be checked against the wallet. **`5949`** and **`5951`** fixed the lint and change detection it left in the UI.
