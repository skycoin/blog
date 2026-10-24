+++
date = "2026-10-21"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 21, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The twenty-first of October brought `skywire sh` to a window and to Android, and made the status pages show how each request actually traveled. The shell now opens as a tabbed window on the desktop and, built for Android, as an app that starts a visor when it is opened, published with every release. The status pages list every request with the path its dial took, and SkyDNS now answers them in the browser. Two CXO feeds that had stopped syncing were fixed, the browser visor can now route without holding transport discovery's whole graph, and the web terminal was hardened against pages that try to run commands through it.

### Skywire: skywire sh in a Window and on Android

**`5761`** made `skywire sh --window` open websh in a window of tabs, a pure-Go X11 window by default or Gio when built with it. The same command built with gogio is an Android app in which Skywire runs as it does on the desktop, and with tabs that run autoconfig and start a visor, the app brings up a visor when it opens and a foreground service keeps it running in the background. Getting there needed general fixes: help colors and wrapping follow the terminal a command writes to, a command run in the shell works in the shell's directory, autoconfig runs config generation in process on Android, and the default route is read from `/proc` instead of by running `ip`. On an Android 16 emulator the visor started on launch, answered dmsg from another machine, and kept running two minutes after leaving the app.

**`5762`** publishes that app with each release as `skywire-<tag>-android.apk`, built from the vendored sources and signed with its own release key so an installed copy updates across releases. **`5764`** fixed its first CI run, where the `yes` piped in to accept the SDK licences died when the install finished and was counted as a failure. **`5767`** fixed a race the shell work exposed in the test for running commands in process.

### Skywire: Seeing the Path

The status pages counted requests but did not show them, so there was no way to tell from a browser whether a .dmsg fetch went through a dmsg server, over a skynet transport, through a relay or along a route. **`5763`** gave the resolving proxies a shared log of host, layer, dial path, result and dial time. The skynet dialer reports whether it used a direct transport, a relay, a held route or a new one, and a dmsg stream reports its server and how its session reaches it. `status.skywire` lists every layer's requests together with the dmsg sessions, and `status.dmsg` and `status.skynet` list their own. **`5759`** fixed `status.dmsg` showing zero requests on a visor that had served many, since nothing on the dmsg dial path recorded one.

A browser that reaches mesh names through SkyDNS could not open those pages at all, because they exist only in the resolving proxies and SkyDNS parsed every name as a public key. **`5760`** has the mesh gateway lease an address for a status name and carry its connections to the visor's own proxy, with SkyDNS answering the new `skywire` zone. **`5765`** fixed the pages vanishing after a visor restart, when SkyDNS had asked for the resolvers before the visor published them and stopped answering. It now looks them up on each page fetch.

### Skywire: Feeds and Memory

Visors had stopped syncing the routing feed and the dmsg clients feed. Every root failed with "no connections to fill from", leaving routing data an hour or more stale on native and browser visors alike. The publisher kept only its newest root, so objects of a root a subscriber was still filling were swept away, and the request for them waited out a 59 second timeout. On transport discovery, 1,424 object requests were parked waiting for objects it no longer held. **`5755`** lets a publisher keep several recent roots, ten or about five minutes on those two feeds, with a test that publishes faster than a slowed subscriber can fill.

The browser visor kept about ten copies of transport discovery's whole graph alive, around 94,000 entries each, and grew to 700 MB in a few hours. **`5766`** added the router setting `dial.local_graph`. With it off, as it now is in the browser visor, the visor never fetches the graph, answers local route calculation only with a direct transport, takes routes from the route setup oracle and the route finder, and ranks bare hops with its own transports. **`5753`** went after another leak in the tab, where a heap census found 2 MB JSON encode buffers kept alive by stale words on goroutine stacks under TinyGo. The hypervisor's node lists are over 1 MB, so they are now written one visor at a time, byte for byte the same as before.

### Skywire: The Web Terminal

**`5758`** closed a way for any web page to run commands on a managed visor. Opening `/pty?commands=<cmd>` ran the command at once, and since the browser's resolving proxy dials as the visor's key, which its managed visors whitelist, a link or a hidden frame on any page the operator visited could do it. A free-form command is now typed without pressing Enter, so a person decides to run it, while the visor's own named commands such as `update` still run by themselves. The terminal page also refuses to be framed by another site.

**`5756`** fixed the terminal over a direct skynet transport refusing even the visor's own hypervisor, because the stream reported a fixed loopback address instead of the caller's key, so the whitelist check had nothing to match. **`5757`** made the page keep reconnecting across a visor restart, which outlasted its old five attempts.

### Skywire: Android, VPN and Housekeeping

**`5754`** fixed the first batch of reports on Skywire Mobile 0.0.8. Call records in a translated chat show in the reader's language, page zoom is off in SkyChat, the wallet's create and restore screens need a phone screen lock, sent files and videos can be deleted for everyone, and a swipe moves between the bottom tabs. **`5768`** reverted the skycoin-web wallet tab added the day before, because it needs a wasm module the F-Droid build removes, so the tab returns to the app's own wallet. **`5770`** tests the app's Kotlin port of Skycoin transaction creation against golden vectors read from skycoin itself, which **`skycoin#3156`** now keeps, instead of copies that never saw a change.

**`5769`** lets a browser visor put its VPN tunnel on its host through the host bridge, with `cli vpn start --host`. The bridge opens a TUN and sets routes the way a native client does, routing the visor's own WebRTC and WebTransport peers around the tunnel so they do not loop through it. It was tested in an unprivileged namespace but not yet end to end on a real host. **`5771`** lets the development visor loop run a prebuilt binary, such as a TinyGo build, instead of building from source. Dependabot updates to the manager UI's follow-redirects and hono and to the Scorecard action landed in **`5742`**, **`5739`** and **`5695`**.
