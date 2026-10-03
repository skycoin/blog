+++
date = "2026-09-25"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — September 25, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The twenty-fifth introduced email as a standalone skywire capability — a mailbox built into every visor, reachable over either dmsg or a skywire route with no mail server, domain or certificate required — and shipped it on by default the same day with real limits and attachment support. The Wisp server picked up a compatibility fallback for older clients and a race that could drop its own refusal message off the wire. The VPN client learned to route around every transport type the visor itself dials rather than just two of them, and the mux campaign's spread planner got the measurement fix its own regression test had been waiting on. Three of the router's largest files were split along their natural seams with no behavior change, and the mobile app's F-Droid submission took the step that lets F-Droid ship the exact APK Skycoin already signs rather than resigning its own build.

### Skywire: A Mailbox in Every Visor

**`5184`** gave every visor a working mailbox: mail addressed to anything at a visor's own base32 public key, suffixed `.dmsg` or `.skynet`, arrives as plain SMTP over whichever network the suffix names and is kept verbatim in a Maildir, with no MTA, domain or certificate needed anywhere in the path — the transport itself authenticates the sender's key, which the mailbox stamps into a header and uses to mark a message whose claimed From address matches as verified. Sending dials the recipient's visor directly with no queue in between, and it runs by default on the wasm visor specifically because the browser's own filesystem snapshot already persists it through a tab reload.

**`5187`** turned the feature on by default everywhere else too, with limits sized for exactly the browser-tab case that worries most: a message over one megabyte is refused outright, a mailbox already holding sixteen megabytes refuses new mail rather than growing further, and anything older than a week expires automatically, with every limit and the feature's own on/off switch changeable live from either the CLI or the desk's settings view. Attachments now work in both directions, and the desk's mail app talks to the visor over RPC directly rather than shelling out to the CLI, since the in-tab command line had a size cap that ruled out attachments entirely.

**`5189`** tightened what each address suffix actually promises: `.dmsg` now strictly means dmsg and `.skynet` strictly means a skywire route, with a `.skynet` delivery that has no route available failing outright instead of quietly falling back to dmsg and hiding the fact that routing hadn't actually worked. The same fix reached the standalone SMTP bridge, which had documented the same two-suffix split but actually dialed everything over dmsg regardless of which one a message claimed; it now holds one dialer per suffix and refuses an envelope that tries to mix the two networks in one session.

### Skywire: Two Wisp Compatibility Fixes

**`5170`** found that a framed Wisp transport, lacking any handshake negotiation at all, always assumed the newer protocol version and refused an older client outright the moment it tried to open a stream without an INFO packet first — found specifically because the LinuxOnTab browser kernel project speaks only the older dialect and couldn't use the in-tab Wisp server at all as a result. A connect request arriving in the handshake slot is now recognized as exactly the older client's own opening move rather than an invalid one, so older and newer clients are both served on the same listener. **`5192`** fixed a race in how a refusal reaches the wire in the first place: queuing a refusal message and then canceling the session raced the writer goroutine's own shutdown against its last flush, so roughly half the time a refused client got a bare connection drop instead of the one message explaining why it was refused — the fix flushes whatever is still queued before the connection is actually torn down.

### Skywire: The VPN Client Learns About Every Transport It Dials

**`5191`** found the VPN client's own exclusion list — the direct routes that keep the visor's own mesh traffic out of the tunnel it just built — only ever updated by two of the several transport types a visor can dial, so a connection opened later over sudph, QUIC, a plain WebSocket or WebRTC had no exception and looped straight into the tunnel it should have bypassed. Every carrier now announces its own address before sending its first packet through one shared, nil-safe helper.

The same fix corrected how those exceptions were being removed: a route was deleted the moment any one connection using it closed, even while another connection — including the client's own startup discovery and route-finder dials — still needed it, so routes are now reference-counted and the addresses pinned at startup stay excluded for the client's entire lifetime.

### Skywire: A Measurement Fix for the Spread Planner

**`5193`** closed out a regression test that had been failing since the spread policy's own mid-object cap landed, tracing it to the capacity planner never actually sampling a tunnel's meter unless a stream happened to be open at the exact instant it looked — a genuinely fast tunnel finishes its work between samples far more often than a slow one, so it kept reading as unmeasured and lost its share to a one-megabyte-per-second standby that was actually just the one standing still long enough to be seen. The planner now samples the same way the tunnel picker already does, counting a window as busy if the tunnel held any work during it rather than only at its exact boundary, which brought an eighteen-to-twenty-four-second object down to eighteen seconds flat with the load split close to evenly across the routes that should have carried it.

**`5182`** fixed an over-strict assertion in the concurrency test this same area had added two days earlier, which had been asserting that a wedged connection guarantees zero stream opens complete in the meantime — not actually true, since the underlying session can carry one through before a blocking write bites, and the assertion was only failing on the Windows CI lane because the race it depended on resolves differently there.

### Skywire: Breaking Up the Router's Largest Files

**`5185`** replaced four separate mutex-guarded scalar fields on the router with atomics, dropping four locks and thirty-two lines with no behavior change. **`5186`** and **`5188`** split the two largest files in the router package, one at over six thousand lines and the other at over three thousand, into focused files by concern — close handling, service loops, leg health and SACK accounting each moved to their own file out of the route group implementation, and transport selection, framing, delivery and the windowing logic did the same out of the mux file — with every declaration moved verbatim and no logic touched, purely so the next change in either area has less to scroll past to find its place.

### Skywire: A Reproducible, Self-Signed F-Droid Build

**`5183`** answered F-Droid's request for a reproducible build, which lets F-Droid verify that building Skywire's own source produces a byte-identical match to an APK Skycoin already publishes and then ship that signed APK directly rather than resigning its own copy. Comparing two independent F-Droid builds found exactly one source of divergence, a build timestamp pulled from the wall clock rather than the commit being built; pinning that to the commit's own date made the two builds byte-identical. The signing step itself now runs in its own isolated container so the signing key never shares an environment with the step that actually compiled anything, and the release workflow attaches the freshly signed APK to the GitHub release before the corresponding F-Droid tag is ever pushed, so F-Droid can never see a tag with no reference build to check itself against.
