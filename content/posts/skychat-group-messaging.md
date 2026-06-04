+++
date = "2026-06-04"
tags = ["Development", "Skywire", "Skychat"]
title = "Skychat: Group Messaging on a Peer-to-Peer Mesh"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Skychat is the chat application that ships with skywire — direct messages and group conversations between visors. It is also, quietly, one of the best stress tests the project has. A group chat exercises almost everything underneath it at once: the encrypted transport mesh, the CXO data layer that synchronizes shared state, presence and reconnection, and the unforgiving question every messaging system eventually faces — when you send a message, does it actually *arrive*?

Much of the last month's skychat work has been a sustained, honest campaign against that question. This is the story of it.

### What skychat is

A skychat conversation is shared, replicated state. Messages aren't sent over a socket and forgotten — they're published into a **CXO feed** (skywire's content-addressed object layer), and every participant subscribes to the feeds that make up the conversation. CXO handles synchronizing the tree of objects across peers; skychat is the application of messaging on top of it.

Two shapes:

- **Pairing** — a direct, one-to-one conversation between two public keys.
- **Group** — a multi-party conversation with a roster and an admin.

Every participant is a public key. The conversation rides the same peer-to-peer transport mesh as everything else in skywire — over dmsg, over skywire's routed transports, or (in standalone mode) over a direct noise-encrypted TCP link between peers. The identity is the key; the transport is whatever's available.

### The model: feeds, publishers, subscribers

In a group, members publish into feeds and subscribe to each other's. The roster (who is in the group) and admin state are not ambient trust — they are **signed mutations** gossiped between members. When the roster changes, a signed mutation is published; every member can verify it. Leaf-level messages are signed too, so a member can't forge another's message, and the topology converged over the month onto a **full mesh** with an admin-aggregator role, dropping an earlier scheme of dedicated admin-mirror feeds in favor of one propagation path everyone can reason about.

That's the design. The engineering was the hard part.

### The campaign: make "sent" mean "delivered"

The recurring enemy of a messaging system is the *silent drop*: a message that vanishes with no error, no counter, no log line — impossible to chase because there's nothing to chase. A large share of the skychat work was about making the receive path **observable** and then **self-healing**.

**Make every drop visible.** Each stage a message passes through — subscriber, stream, deliver — got a counter, surfaced through the group's info endpoint and rendered in the CLI (`sub_drop_count`, `deliver_count`, `stream_send_count`). "It didn't arrive" became "it was dropped at the stream layer, three times." Each peer's most recent inbound timestamp is tracked and shown as a table, so a wedged peer is a stale row instead of an invisible gap. A `--verbose` send prints the per-layer counter delta for that one message, so a single send can be watched move from publisher intent to per-peer delivery.

**Detect the dead and reconnect.** Presence is liveness, and liveness has to be per-peer. A per-peer-subscription liveness signal lets the group tell, for each member, whether its subscription is actually attached or silently dead. Reconnect backoff is keyed per-group *and* per-peer, so a flapping member in one group doesn't starve reconnects in another. A subscriber-reconnect watchdog drives a reconnect when a subscription falls off, rather than waiting for the next external trigger. The pair manager's resume path was fixed to actually reconnect subscribers (a resumed manager had looked alive while its subscriptions were dead underneath). Cold-start dials, which need more than a warmed-up session has time for, got a longer first-attempt budget.

**Don't lose history across a gap.** When a streaming subscriber reconnects, the backlog accumulated during the disconnect is replayed rather than skipped — a brief drop no longer punches a hole in the conversation. History replay was extended *beyond* the in-memory inbox ring, so a member joining or reconnecting can pull messages that have already aged out of the ring.

**Make subscribe atomic.** Subscribing and then separately waiting for the first Root left a window where a subscriber was attached but had no state yet. `ConnectAndWaitForRoot` collapses the two into one atomic operation, adopted at every call site.

None of these was the single fix. Reliability at this layer is a sequence of necessary-but-not-sufficient improvements: the per-peer liveness needed the reconnect watchdog, which needed the resume-path fix, which needed the atomic subscribe, which needed the drop counters to even *see* whether any of it was working. The honest version of the story is that it took all of them.

### The CXO underneath

Skychat's reliability is inseparable from the CXO layer it rides. The same month hardened that layer in lockstep: an idle watchdog that closes half-dead connections within a couple of minutes, eviction of a stale connection when a peer rejoins (instead of rejecting the rejoin), connection-map sharding that removed a single-mutex bottleneck on the accept path, and auto-recovery from a corrupt local database instead of a crash loop. Group chat surfaced the bugs; fixing them made CXO better for every feed consumer, not just chat.

### Standalone, and why it's been useful

Skychat can run **standalone** — without a visor or router behind it — over a direct noise-TCP transport, and as of the most recent work, with its CXO-backed group messaging carried over native TCP peer-to-peer with no dmsg at all. That turned out to be more than a convenience. A standalone chat instance, identified by its key and reachable directly, makes a resilient side-channel that survives visor restarts and dmsg outages — genuinely useful for coordinating between machines (and, in practice, between automated agents) even while the thing being coordinated is itself being restarted. (More on that primitive in a companion piece on standalone skywire.)

### Why it matters

A group chat is a small application with an unreasonable number of ways to lose a message. Building one that *doesn't* — on a peer-to-peer mesh, with replicated state, across restarts and reconnections and roster churn — is exactly the kind of demand that hardens the layers beneath it. Skychat is a useful app on its own. It has been at least as valuable as the proving ground that forced CXO and the transport mesh to be reliable under real, messy, multi-party use.
