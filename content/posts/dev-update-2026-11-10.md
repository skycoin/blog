+++
date = "2026-11-10"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — November 10, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The tenth of November went into the router's multipath route groups, where a run of bookkeeping bugs could act on the wrong leg, and a stall that could keep a visor from accepting inbound route groups for as long as its peers kept dialing. Offline alerts gained web push, since mail from a home connection rarely gets through, and the network visualizer's app endpoints stopped taking requests from other sites. The work on the testers' reports for Skywire Mobile 0.0.9 was merged, about thirty fixes and requests across the Android app and skychat, and the Skycoin wallet took another set of fixes for wallets kept on the node.

### Skywire: Mux Legs Kept Straight

A multipath route group kept each leg as three parallel lists, its transports, forward rules and reverse rules, and nothing held the three together. **`6101`** fixed three bugs that came from that. Legs added from parallel goroutines could pair one leg's reverse rule with another's transport, so receive accounting, readiness and pruning acted on the wrong leg. A routing policy that dropped a leg closed its transport, which other route groups shared, and it now removes the leg from its own group and tells the peer, with older peers handled as before. The record of legs the peer had parked was kept by index and went stale when legs moved. Each fix has a test that fails without it.

**`6105`** then holds each leg as one value, with a design note describing the model, as a refactor with the wire format, leg order and logs unchanged. It was checked under the race detector, on a running visor against a live exit, and in the emulated scenarios, run twice on each side, where every result was within run to run noise. **`6107`** closed the last window. Several control paths picked a leg by index, released the lock for a network write and then acted on that index, so a leg removed in between moved the action onto another, and a healthy leg could be parked while the one judged stayed active. A decision is now recorded by the leg's transport ID and resolved again under the lock, and several more bugs in retiring legs were fixed with it.

### Skywire: Accepting Route Groups

After a restart, every proxy dial to one exit failed for over forty minutes with no handshake received on either end, while its routes to other ports still worked. The visor took one queued route setup at a time and waited up to ten seconds for its handshake, the same time the initiator waits before giving up. Once a few setups were queued, every one the visor reached had already been abandoned, and the exit was answering dials made ten to sixteen minutes earlier. **`6104`** drops a queued setup older than the handshake timeout and waits for the rest off the accept loop, up to 64 at once, and the visor state reports the drops and the queue. **`6106`** fixed a flaky dmsg test that the change exposed on Windows.

### Skywire: Push Alerts and Cross-Site Requests

Mail alerts fail for most home operators, whose residential addresses are blocked and who will not set up a relay. **`6093`** adds standard Web Push as a third channel, written on the standard library alone. The watching visor keeps its own push key, sends each alert to every subscribed device, urgent for outages, and drops subscriptions the push service no longer knows. **`6094`** adds a Notify this device button to the Offline alerts section, with a service worker that shows the alerts and a manifest so iOS can add the page to the home screen. **`6096`** documents it and **`6095`** fixed a capacity CodeQL flagged. A real subscription in Brave received and decrypted a test alert, but Apple's push service and iOS were not tested.

A page on any site could start or stop a visor's apps, or point its VPN or proxy client at another server, by posting a plain form to the network visualizer's app endpoints, and could open the local visor stream. **`6098`** gives the app endpoints the same-origin check the transport endpoints beside them already had, checks the origin of the stream socket, and makes the hypervisor's session cookie `SameSite=Lax`. On a running visor, the cross-site post that reached the app launcher before is now refused.

### Skywire Mobile

**`5958`** works through the bugs and requests from testers of Skywire Mobile 0.0.9, one commit each, with fixes in skychat or the visor where the report came from there, so desktop and web skychat get them too. Group members, roles and rules refresh when they change, a member who leaves or is removed drops off the roster on both sides, a new joiner gets earlier messages as soon as its visor has them, a delete for everyone is resent until the peer has it, and a first contact's voice note or image is held for the receiver instead of dropped. The Go core can now resolve host names on Android, where every lookup had failed. On the request side, a blocked caller hears a short ring and a decline, several messages can be selected at once, SkyChat and SkyMail share one contact book, and the identity can be backed up with its channels and groups. **`6090`** adds the 0.0.10 changelog for F-Droid.

### Skycoin and Rewards

A BIP44 wallet kept by the node showed its total but zero on each address after a scan, and **`skycoin#3240`** keeps the balances. **`skycoin#3241`** and **`skycoin#3242`** add the change address to a wallet when the transaction is made, in the web wallet and the CLI, **`skycoin#3243`** saves a node wallet's new name on the node, **`skycoin#3244`** adds `walletRename` to the CLI, and **`skycoin#3239`** shows the CSRF warning only on a node with the wallet API. **`6091`**, **`6092`**, **`6100`**, **`6102`** and **`6103`** brought them to Skywire.

The reward calculation now applies the 75% daily uptime minimum itself, listing visors below it as ineligible, and gained worked value tests for its other rules in **`6097`**. **`6099`** cleans stray spaces and control characters from survey fields and reserves a day's payout marker before the transaction is broadcast.
