+++
date = "2026-11-03"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — November 3, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The third of November carried dmsg-async further. Group join requests and their decisions, missed calls and file offers now wait on the recipient's inbox hosts, and a settings change made in the hypervisor for a managed visor that is offline is held for it and applied when it returns. A second hypervisor UI, rendered on the server with templ and htmx, went up at `/ui2/` beside the Angular one and gained most of the visor tabs in a day. Calls now say when a visor has no microphone or speaker, Skycoin 0.28.7 reports its own version, and two TinyGo compiler and runtime changes were merged upstream.

### Skywire: More Things Wait for an Offline Peer

A join to a group whose admins were all offline failed, and an approval reached the requester only if it polled while the admin was online. **`6008`** leaves a join request that reaches no admin on each admin's inbox, and the requester keeps the group as awaiting approval. The admin handles it like a live request and checks its proof of work at the time the inbox host took it. Decisions travel back the same way, with the group key sealed to the requester, who applies one only from an admin its invite names. In a live test a join made while the owner was down was queued when it came back, and approvals made while the requester was down took effect on its return.

A call to an offline peer left a record only on the caller's side. **`6009`** parks a missed call message on the peer's inbox when the dial ends offline, so the peer's Calls tab shows the call at the time it was placed. A call that rang out is not parked, since the peer logged it already. **`6010`** does the same for files. When a transfer cannot dial the peer, the sender parks an offer and keeps serving its copy, and the peer files a file message without bytes that it can request later, which turns into the received file when the bytes arrive.

### Skywire: Settings Changes for an Offline Visor

A change made in the hypervisor UI to a managed visor that was disconnected failed, and the operator had to try again once the visor was back. **`6011`** runs such a request against a recording RPC client and, when it succeeds, leaves the recorded calls on the visor's inbox and answers 202. Only settings calls are recorded, among them app settings, minimum hops, the skyenv file, the reward address and the public flags, and anything else still fails as before. The visor applies the calls once it has finished starting, only when one of its configured hypervisors signed them, and each one only once. The first live test showed an autostart change arriving before the app launcher was up, which is why the visor now waits for startup. **`6014`** shows a notice in the UI that the change will apply when the visor is back, and **`6017`** gave the test visors a logger after a panic on macOS.

### Skywire: A Server Rendered Hypervisor UI

**`5999`** adds a second hypervisor UI at `/ui2/`, rendered on the server with templ and htmx and served beside the Angular UI so the two can be compared before anything is replaced. It reuses the JSON routes' API, session and CSRF checks, takes its strings from the Angular translation files, and uses only relative URLs so the visor in a browser tab can serve it too. The first change brought the shell and the contacts tab. **`6002`** added the apps, transports and routing tabs, **`6003`** logs, mail, chat, terminal and wallet, and **`6004`** info, uptime, rewards, dmsg and settings, moving the settings form logic into a package both UIs share. **`6006`** puts a "Try new UI" link in the Angular top bar and keeps the strings for both in the same files.

The rest made it usable. The transports tab sent about 2.5 MB of HTML on every poll for a visor with 1500 transports, and **`6012`** shows 100 rows at a time with a filter and sortable columns, as does the routing rules view. **`6013`** folds the top bar into a menu on narrow screens and lets the tab bar wrap or scroll, **`6015`** adds search and online filters to the visor list and nests the visors of a hypervisor under it, and **`6016`** went through every tab at phone widths in both themes, sizing controls for touch and replacing icons the bundled font lacked.

### Skywire: Calls and Chat

A visor with no reachable audio server, typically one running as a root service, connected calls that sent silence and played nothing while its log said audio was enabled. **`6000`** records whether each call's microphone and speaker opened and why not, shows a warning in the call panel and the CLI, logs the real result at startup, and has a root visor try the active seat user's audio socket. **`5998`** stopped a remote visor's Chat tab from showing the local visor's skychat, since no path yet carries skychat's stream to a remote visor, and the tab is now hidden there.

### Skycoin and TinyGo

Every Skycoin build since 0.27.1 still reported 0.27.1. **`skycoin#3195`** sets the version to 0.28.7 and has the release workflow stamp the tag into each build, **`skycoin#3196`** restored imports that a regenerated file had dropped, and **`6001`** moved Skywire to the v0.28.7 release. **`6005`** draws the Skycoin cloud on the help screen in the logo's own proportions.

**`6007`** builds the TinyGo release assets with a toolchain from the fork, now merged with upstream's 0.45.0 development branch. Two changes landed in TinyGo itself. **`tinygo#6035`** keeps the runtime's timers in a binary min-heap instead of a sorted list, so adding or removing one no longer costs time proportional to the number of timers, and **`tinygo#5901`** gives a promoted unexported method its package in its symbol name, which fixed a type with two such methods of one name running the wrong one.
