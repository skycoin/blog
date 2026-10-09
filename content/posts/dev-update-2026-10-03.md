+++
date = "2026-10-03"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 3, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

October third brought a run of fixes to the parts of the visor that serve browser tabs and mobile desks. The mailbox became an app that can be started and stopped like the rest, PTY over skynet replaced PTY over dmsg as the first choice for every connection, the desk's boot reporter caught its own failures and retried failed module downloads, and the service worker in the wasm desk stopped answering API calls with the shell's cached HTML. The visor's autoconnect learned to use WebSocket transports to public peers it has already reached, and started dialing visors on the same private network directly instead of trying and timing out. A suite of transport and dmsg fixes made each destination reachable over skynet where such a transport exists, which a relayed dmsg path would never accomplish. Finally, the original 0magnet modules were tagged and their forks merged with upstream, the docker builds now use Go 1.26.8 to match the module requirements, and the dependency tree moved every package forward except gvisor, which was pinned again after its new version carried a template the Go assembler cannot parse.

### Skywire: The Mailbox Becomes the Skymail App

**`5368`** converted the mailbox from a fixed part of the visor into a launcher app named `skymail`, the same as the pty and proxy services run — listed and controlled through `cli visor app` just like the rest, with autostart controlled by the `enable` setting in the mailbox config. It shows in the dashboard's apps list, starts and stops with `cli visor app start|stop skymail`, and continues to work in a browser tab.

### Skywire: PTY Over Skynet, Service Worker Fixes, and a Desk That Reports Its Failures

**`5354`** made every PTY dial try a skynet transport first before falling back to dmsg, the same pattern `DmsgHTTP` follows. A browser visor now runs `pty exec` against another browser or a native visor on the same machine, getting speeds better by a factor of many compared to a relayed dmsg path. **`5359`** then brought that PTY capability into the browser itself: a `pty fs mount` on a peer's filesystem now works in a browser visor, served from the peer's sftp subsystem through a jsfs provider on the page. **`5363`** placed the pty host itself on the skynet forwarding server, so mounting a browser visor from a native one over a direct skynet transport measures `ls` at 0.19 seconds instead of 14.4 seconds, and a 512 kilobyte copy at 1.2 seconds instead of 29.5 seconds.

**`5367`** made a PTY mount reconnect when its session drops, retrying the dial and reopening files on the new session rather than failing forever with an I/O error.

**`5366`** found the wasm hypervisor's service worker answering API calls with a cached `index.html` when the fetch failed, so the dashboard showed "Unexpected token '<'" errors. API calls now bypass the worker entirely, falling back to the shell only for page loads.

**`5362`** bridges the gap between the desktop shell's view of the filesystem and the worker's: when the worker mounts a peer's files over sftp, the page now mounts those same directories from `/mnt` and `/opt/skywire` so desk shell commands see them.

**`5347`** gave the desk a way to report its own boot failures to the server that served it — script errors, failed resource loads, and a boot that either rejected or never finished within two minutes. Each report carries the boot status, recent console output, the served version, and what the browser supports. **`5349`** then refined those reports to skip elements with no `src` or `href` (which resolve to the page itself and fail for unrelated reasons) and to name the tag of any element that fails to load. **`5350`** used that reporting to find and fix an actual stuck boot: when the server restarted mid-download, the boot never retried; it now retries with an exponential backoff, up to 30 seconds. **`5351`** extended the boot reporter to write each report to a file, since the journal on a production host keeps only about an hour, and mobile phones cannot be debugged directly.

**`5348`** re-embedded the command module from a clean tree so all of these desk changes reach the served desk at once rather than waiting for the next release rebuild.

### Skywire: Autoconnect and NAT Discovery

**`5353`** removed autoconnect's blanket skip of every visor sharing this visor's public IP — the dialers already try LAN addresses first, so the skip only cost direct links — and reordered the swtr pass so peers already reached over webrtc or dmsg move to the front of the candidate list, making them much more likely to be chosen. **`5355`** then gave peers reached over webrtc or dmsg their own dedicated swtr pass before the rest of the public list, making a browser visor on the same machine as a public visor much more likely to find and choose it.

**`5352`** made two improvements to the visor's runtime configuration: `config set pty.whitelist=[...]` now applies on the running visor, and autoconfig-controlled fields now survive an autoconfig rebuild rather than being reverted on every update.

**`5365`** fixed the pairing scan that rejects a pending hypervisor status for connections that should never count: a public visor logging "Pending hypervisor" for every browser visor dialing into it from the network, when no desk was actually attached to it. A connection upgraded through the hypervisor's `/tp/ws` is now marked, and only those transports are noted as pending.

### Skywire: Dmsg and Transport Routing

**`5356`** found browser WebTransport writes waiting for the peer to drain with no timeout at all — a peer that stopped draining would park a goroutine forever, and the dmsg Noise handshake depends on such a bound. The write now honours `SetWriteDeadline`, aborting if the peer does not drain by the deadline. **`5345`** added the reward system to the list of deployment services the visor reaches directly rather than through a relay, cutting the time to answer from 9–15 seconds to about 1.4 seconds. **`5346`** extended the resolving proxy's reach to try the visor's skynet transports before dmsg, exactly as `DmsgHTTP` does, so reaching any `.dmsg` peer now tries a direct or relayed skynet path first.

### Skywire: WebRTC and Transport Ordering

**`5358`** bounded the queues on WebRTC data channels so they no longer grow to seconds of latency under load. The browser side waits for the queue to drain when buffered data exceeds 1 megabyte, and native pion now uses `EnableDataChannelBlockWrite(true)` to honour write deadlines. Tests added alongside it cover both report paths and run under Node. **`5324`** reordered the router's first-hop preference so WebSocket and WebTransport carriers rank alongside the genuinely direct TCP and QUIC ones, rather than behind webrtc.

### Skywire: Builds, Tests, and Dependencies

**`5369`** tagged the original 0magnet modules (v0.0.0, realorigin v0.2.3, wfdrive v0.3.2) and pinned them by tag, merged the forks with their upstreams, and tested across linux, js/wasm and windows. **`5370`** updated the docker builds to use Go 1.26.8, the latest 1.26 release, to match the module requirement. **`5364`** moved every dependency forward to its latest version, except gvisor, which was pinned again after a newer version introduced a template that the Go assembler cannot parse.

**`5361`** fixed the multihop integration test, which went red after previous merges; it now removes every non-STCPR transport on both legs since autoconnect can leave others that route setup might pick. **`5357`** tagged more transport tests so they skip on the js/wasm build, preventing compilation and runtime failures when testing under `GOOS=js`.

**`5360`** dropped obsolete bottle hashes from `go.sum` that a previous update had left behind, resolving a Module Integrity check failure.
