+++
date = "2026-06-02"
tags = ["Development", "Skywire", "Routing"]
title = "Skywire Development Update — June 2, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A routing-reliability day, and two releases. The router gets a run of hardening — one hop's failure no longer tears down the whole route, a cluster of panics and races are guarded, and a multiplexed-route stall is fixed. The dmsg-first client stops a bad HTTP fallback, the hypervisor starts forwarding browser-side UI errors into the visor log (where they're actually visible), and v1.3.62 / v1.3.63 ship.

### Skywire: Router — Don't Let One Hop Sink the Route

**`2976` fix(router): stop one hop's failure from RST-ing the whole route (setup cascade)** — during route setup, a single hop failing could cascade into a reset of the entire route. Now a hop failure is contained, so the rest of the route survives and can be repaired rather than torn down wholesale. This is the kind of fix that turns "the route flaps when any intermediate hiccups" into "the route tolerates a hiccup."

**`2977` fix(router): guard ClosePacket panic, double-close, reverse-rule leak, MinHops race** — four bugs in one sweep: a panic on `ClosePacket`, a double-close, a leaked reverse rule, and a `MinHops` race. The unglamorous lifecycle-correctness work that keeps the router from crashing or leaking under churn.

**`2970` fix(router): don't downgrade MinHops to 1 over a closed direct transport** — the router was downgrading a dial's `MinHops` to 1 when it saw a (now-closed) direct transport, which made the route-finder return dead 1-hop routes and made `route trace` disagree with the live path. Fixed — a closed transport doesn't get to shortcut the hop count.

**`2962` fix(router): gate aux mux legs on readiness — fixes mux>=2 stall (0 bytes / close code 0)** — multiplexed dials with two or more routes could stall (zero bytes transferred, close code 0) because the auxiliary legs weren't gated on readiness. Gating them fixes the stall, so `mux>=2` actually carries traffic.

### Skywire: dmsg-First — Don't Fall Back on a 202

**`2974` fix(dmsg/disc): don't HTTP-fallback on dmsg "cannot connect to delegated server" (202)** — a transient dmsg error 202 ("cannot connect to delegated server") was triggering a fallback to plain HTTP for discovery. But a 202 self-heals over dmsg on the next refresh — it isn't a reason to abandon the overlay path for HTTP. The fallback is suppressed for that error, keeping discovery on the overlay where it belongs.

### Skywire: CXO + TPD — Attribution Integrity

**`2972` fix(cxo): bind a received Root's Pub to its authenticated feed** — a received Root's publisher key is bound to the cryptographically-authenticated feed it arrived on, so a mis-attributed or zero publisher key can't be credited to the wrong feed. **`2971` fix(tpd): never attribute bandwidth to the zero PubKey** — the transport-discovery stops attributing transport records to the all-zero public key, the source of thousands of null-PK "orphan" records. Together: data that's attributed is attributed correctly.

### Skywire: Hypervisor — Surface the UI's Errors

**`2961` feat(hypervisor): forward hvui browser errors to the visor log** — the hypervisor UI's global error handler POSTs client-side (browser) errors back to the visor, which logs them. A front-end exception is no longer invisible to the operator running the visor — it shows up in the log where the rest of the diagnostics live. (This is exactly the kind of plumbing that makes otherwise-silent UI bugs findable.)

**`2959` fix(hypervisor): scope dmsg round-trip tracker to currently-connected visors** + **`2958` fix(dmsg): raise entry-cache TTL above the tracker interval to stop disc-dial thrash** — the round-trip tracker is scoped to visors actually connected (don't probe the disconnected), and the dmsg entry-cache TTL is raised above the tracker interval so the two don't fight and thrash the discovery dials.

### Skywire: Config + Installer

**`2957` feat(autoconfig): add --maxtransports (public-visor limit); drop deprecated --dmsghttp/--dmsgconf** — autoconfig gains `--maxtransports` (a public-visor transport limit) and drops two deprecated flags. Config-surface cleanup as the default config converges.

**`2965` fix(win_installer): run config setup at MSI install (postinstall parity with Linux)** — the Windows MSI runs config setup at install time, matching what the Linux package's postinstall already does, so a Windows install comes up configured whether or not the user clicks the Start-menu shortcut.

### Skywire: Releases + Misc

- **v1.3.62** and **v1.3.63** ship (the changelogs land via `2964`/`2967`/`2975`), with routing port 46 freed for hv-RPC-over-skynet parity.
- **`2968` feat(cli/gotop): multiload-ng-style display behind --multiload** — `cli gotop --multiload` gets a multiload-ng-style per-state CPU + RAM breakdown.
- **`2963` fix(vpn-ui,dmsg)** — VPN UI fixes: dead-servers tab, select/connect decoupling, route options, and a dmsg-tracker 202 backoff.
- **`2960` fix(cli/route): dispatch route policy test/bench to the WASM backend for .wasm scripts** — the policy `test`/`bench` tooling routes `.wasm` scripts to the WASM backend.
- A `/metrics` accounting fix for transports with bandwidth history (`2966`) and reward-page UI polish (`2969`, `2973`).
