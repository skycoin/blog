+++
date = "2026-06-04"
tags = ["Development", "Skywire"]
title = "Development Update — June 4"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

v1.3.64 ships, and the day's fixes are the kind you find right after a release goes out. A production goroutine leak in the transport-discovery — traced to the bounded cleanup channel introduced earlier in the month — is fixed at the root. The hypervisor password gets a CLI reset/first-set path. And a front-end sort crash, caught precisely because the UI now forwards its errors to the visor log, is guarded.

### Skywire: The delcq Leak, Fixed at the Root

On June 1 the CXO node's connection-cleanup channel (`delcq`) was given a bounded buffer so a closing connection wouldn't block the node's actor loop. Under sustained connection churn on the production transport-discovery, that bounded buffer filled — and every subsequent cleanup blocked *on the send* instead, stranding tens of thousands of goroutines (and gigabytes of stacks) until a restart.

**`2992` fix(cxo/node): non-blocking delConn cleanup — drain feed removal off a queue, not a bounded blocking channel** — the fix replaces the bounded blocking channel with an unbounded queue plus a wake signal. A connection's cleanup is appended to the queue and the actor is nudged — the enqueue never blocks, so a closing connection can never strand its goroutine again. The actor drains the queue in bounded batches, so cleanup still happens for every connection (nothing dropped) without monopolizing the loop. The node's feed map stays owned by the single actor goroutine, so there are no new races. The right shape for "a dead connection's cleanup must never block the thing that's tearing it down."

### Skywire: Hypervisor Password — Reset / First-Set From the CLI

**`2994` feat(cli/hv): hv passwd --force — set/reset the hypervisor UI password without the old one** — `hv passwd` could previously only *change* the password (it verified the old one), so a forgotten password could only be cleared by deleting the user-store database, and the first password could only be set through the UI's create-account page. `--force` sets a new password without the old one, creating the `admin` account if none exists — a forgotten-password reset and a first-time set, both from the CLI. The same privileged-local rationale as the existing command (the RPC is local-only); the password-format rules still apply.

### Skywire: A Sort Crash, Caught by the New Error Forwarding

**`2995` fix(hvui): guard node-list sort against undefined values (localeCompare crash)** — the hypervisor UI's node-list sort called `.localeCompare` on an `undefined` value when a row was missing the sort-key property, crashing the sort. It surfaced in the *visor* log — because of yesterday's change that forwards the UI's browser-side errors to the visor — rather than being invisible in a browser console no operator was watching. The fix guards the property walk and coerces missing text values to empty so a row lacking the key sorts as empty instead of throwing. A small bug, but a clean demonstration of the diagnostics loop working: the front end reports its own failures to where they can be seen and fixed.

### Skywire: Misc

- **`2993` chore(lint): explicit return in skyobject.NewConfig** — a `nakedret` follow-up to the CXO `Filler`-bound fix.
