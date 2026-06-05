+++
date = "2026-06-04"
tags = ["Development", "Skywire"]
title = "Development Update — June 4"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A big day, the day after a release. v1.3.64 shipped, and then the work turned to the thing that had been making multihop routes unreliable for months: **route setup**. The headline is a redesign of how routing rules get installed — the route-setup node stops dialing every hop over dmsg and becomes a pure signing oracle, with the source injecting the signed rules down the route's own transports. That gets [its own article](/posts/source-driven-cascade-route-setup/); it took five pull requests and a lot of live debugging to land working end-to-end. Around it: a sudph reliability fix so visors recover after an address-resolver restart, a route-finding correctness fix, two new standalone diagnostic tools (a dmsg probe and a skywire-native sshfs), the `cli version` command, and a handful of post-release cleanups.

### Skywire: Source-Driven Cascade Route Setup

The marquee change. Installing a route's forwarding rules used to require the route-setup node to **dial every hop over dmsg** — which failed whenever a hop was alive on its transports but not reachable over dmsg, taking down the whole setup for a reason that had nothing to do with whether the route would carry traffic. The fix moves rule installation onto the route's own transports: the route-setup node only **signs** the rules (over a single cheap dmsg round-trip), and the source injects the signed, nested cascade down the links the route is actually made of.

It landed across **`3006`** (the protocol — RSN as signing oracle), **`3008`** (sign out-of-the-box, no per-node config), **`3009`** (the source consumes its own cascade layer), **`3010`** (reverse-direction orientation + route-ID reservation), and **`3012`** (the destination builds a route group, not just a forwarding rule). On the live network it now comes up across intermediates the route-setup node never dials, with no fallback to the old dmsg path. The full story — including the chain of latent bugs that only surfaced once the path actually ran — is **[here](/posts/source-driven-cascade-route-setup/)**.

### Skywire: sudph Recovers After an Address-Resolver Restart

sudph (UDP hole-punched transports) quietly broke for a couple dozen visors after a routine address-resolver redeploy, and the reason was a missing liveness check. A visor keeps a connection to the address-resolver to register its public UDP address; when the resolver process restarts, that connection goes silently dead — but the visor never noticed, because its heartbeat *writes* kept succeeding (UDP has no peer to refuse them) and its *read* side had no deadline. So it kept firing heartbeats into a dead conversation forever, never re-registering its (often freshly-rotated) port, and every peer that tried to reach it over sudph timed out.

**`3003` fix(sudph): detect a dead AR connection so visors re-register after an AR restart** makes the heartbeat a round-trip: the address-resolver echoes each heartbeat back, and the visor bounds its read with a deadline reset on each inbound echo. A resolver that stops echoing now trips the deadline, the connection is torn down and re-handshaked, and the live port is re-registered — self-healing in seconds instead of never.

**`3004` fix(ar/sudph): apply hairpin-SNAT address override on re-registration too** is the companion fix for visors co-located with the address-resolver behind the same NAT: the resolver already had a hairpin override to record the visor's declared public address rather than the docker-bridge source it observed, but the override ran only on the *initial* registration — the 90-second re-registration re-recorded the wrong address every cycle. The override now applies on re-registration too.

### Skywire: Route-Finding Correctness

**`3001` fix(tpd): refresh both per-edge indexes (restore bidirectional routing)** reverts a too-clever optimization. A transport is bidirectional, but a change earlier in the month had the transport-discovery refresh only the *reporting* edge's index when a transport checked in. The route-finder explores via those per-edge indexes, so a live transport silently dropped out as a route *source* from its non-reporting end — the route-finder could find `X → B` but not `B → X` over the same live link. Refreshing both edges again restores symmetric route-finding; the ghost-transport problem the optimization was chasing is handled at the source by the half-open detection shipped earlier.

**`2997` fix(tpd): stagger MetricsCXOPublisher per-window cadence to bound GC** smooths a self-inflicted load spike: the transport-discovery's metrics publisher was rebuilding several time-window aggregates on the same tick, causing a periodic allocation-and-GC bulge. Staggering the windows' cadences spreads the work out.

### Skywire: Two New Standalone Diagnostic Tools

**`2998` feat(cli/dmsg/probe): probe over dmsg-via-server, skynet, and direct TCP; standalone --sk** and **`2999` feat(dmsg/probe): standalone `dmsg probe` command (no visor)** add a connectivity probe that reaches a peer three ways — over a dmsg server, over a skynet transport, and over a direct TCP dial — and reports what worked. It runs standalone with its own `--sk` identity (no visor required), and is hidden when bundled into the full binary. A focused tool for answering "can I even reach this key, and how" without standing up a visor.

**`3002` feat(pty/sshfs): sftp subsystem + cli sshfs mount (skywire-native sshfs)** adds an SFTP subsystem to the skywire pty and a `cli sshfs mount` that mounts a remote visor's filesystem over skywire — sshfs without ssh, keyed by public key over the encrypted overlay.

### Skywire: `cli version`

**`3011` feat(cli): `skywire cli version` — report build + resolve latest release/commit** prints the local build and resolves the latest available version the same way the Go toolchain does for `go install …@latest` — via the Go module proxy. It reports both the latest release tag and the rolling develop-branch tip with its commit, and compares them against the running build, so an operator can answer "am I on the latest commit?" without cloning the repo. It mirrors the mechanism the visors auto-update through.

### Skywire: Hypervisor & UI

**`3000` fix(hvui): always show the local visor in the hypervisor list** — a filtering path could drop the local visor from the hypervisor's own node list under certain conditions, leaving an operator staring at an empty list on the very machine they were logged into. The local visor is now always re-inserted.

**`2994` feat(cli/hv): hv passwd --force — set/reset the hypervisor UI password without the old one** — `hv passwd` could previously only *change* the password (it verified the old one), so a forgotten password could only be cleared by deleting the user-store database, and the first password could only be set through the UI's create-account page. `--force` sets a new password without the old one, creating the `admin` account if none exists — a forgotten-password reset and a first-time set, both from the CLI. The same privileged-local rationale as the existing command (the RPC is local-only); the password-format rules still apply.

**`2995` fix(hvui): guard node-list sort against undefined values (localeCompare crash)** — the hypervisor UI's node-list sort called `.localeCompare` on an `undefined` value when a row was missing the sort-key property, crashing the sort. It surfaced in the *visor* log — because of the recent change that forwards the UI's browser-side errors to the visor — rather than being invisible in a browser console no operator was watching. The fix guards the property walk and coerces missing text values to empty. A small bug, but a clean demonstration of the diagnostics loop working: the front end reports its own failures to where they can be seen and fixed.

**`2996` feat(rewards/ui): currently-enforced minimum-version banner + restore detail tree view** — the rewards UI now shows the minimum version currently enforced for rewards eligibility (so an operator can see at a glance whether their build qualifies) and restores the per-node detail tree view.

### Skywire: The delcq Leak, Fixed at the Root

On June 1 the CXO node's connection-cleanup channel (`delcq`) was given a bounded buffer so a closing connection wouldn't block the node's actor loop. Under sustained connection churn on the production transport-discovery, that bounded buffer filled — and every subsequent cleanup blocked *on the send* instead, stranding tens of thousands of goroutines (and gigabytes of stacks) until a restart.

**`2992` fix(cxo/node): non-blocking delConn cleanup — drain feed removal off a queue, not a bounded blocking channel** replaces the bounded blocking channel with an unbounded queue plus a wake signal. A connection's cleanup is appended to the queue and the actor is nudged — the enqueue never blocks, so a closing connection can never strand its goroutine again. The actor drains the queue in bounded batches, so cleanup still happens for every connection without monopolizing the loop. The node's feed map stays owned by the single actor goroutine, so there are no new races. The right shape for "a dead connection's cleanup must never block the thing that's tearing it down."

### Skywire: Misc

- **`2993` chore(lint): explicit return in skyobject.NewConfig** — a `nakedret` follow-up to the CXO `Filler`-bound fix.
