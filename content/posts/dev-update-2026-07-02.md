+++
date = "2026-07-02"
tags = ["Development", "Skywire"]
title = "Development Update — July 2"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Skychat is the oldest app in the tree, and it shows: it grew ad-hoc over the years into several parallel implementations, more than one message model, two generations of group chat, and a handful of transports — each added when it was needed, none ever unified. Today opens the refactor that fixes that. It starts where a refactor should: a written RFC that names the problem, a first shared primitive extracted out of the duplication, and a concrete payoff — federated group chat running inside the browser wasm-visor, in a desktop-style chat window. This whole batch shipped together as **`3362`**.

### Skywire: A Refactor RFC, and the First Shared Piece

**`feat(wasm-hv): skychat desktop window + skychat refactor RFC`** lays down the plan. The RFC catalogs how skychat fragmented — three parallel implementations, three message models, two group generations, five transports — and proposes a single shared `pkg/skychat` core (the same "visorcore" convergence pattern used to stop the native and wasm visors from diverging), federated-only groups, and public group discovery over the service-discovery `?type=` mechanism already used for proxies. The same change brings up a real skychat window in the wasm-visor desktop, so the refactor has a live consumer to validate against rather than a paper design.

**`refactor(skychat): extract pkg/skychat/message shared wire codec`** is RFC step two and the first concrete extraction: one message wire codec, shared across the implementations, instead of each transport re-encoding messages its own way. Getting a single serialization boundary in place is the precondition for collapsing the three message models down to one — nothing else in the refactor is safe until the bytes on the wire mean the same thing everywhere.

### Skywire: Group Chat That Builds Under wasm

Federated groups assume a persistent record store, which is fine on a native visor with a filesystem but a non-starter in a browser tab. Two changes make the group layer portable. **`feat(skychat/group): build-tag-split the group record store for js/wasm`** splits the store behind build tags so the `js/wasm` target compiles without the filesystem-backed database, and **`feat(skychat/group): InMemoryDB option on group.Config (dmsg path) for wasm`** gives that target an in-memory database it can select through `group.Config`, so a browser visor keeps its group state in memory over the dmsg path with no disk dependency.

**`fix(skychat/group): fast federated-group convergence for late joiners`** — RFC step four — fixes the experience of joining an existing group: a late joiner now converges on the group's current record set quickly instead of waiting to slowly accrete it message by message.

### Skywire: The Browser Chat Window

**`feat(wasm-hv): wire federated group chat into the wasm visor`** ties the portable group layer into the browser visor, so federated group chat actually runs in a tab. **`feat(wasm-hv): skychat window — dmsg/skynet transport selector + activity log pane`** builds it out into a usable window: a selector to choose whether messages ride dmsg or the skynet route, plus an activity-log pane so you can watch what the transport is doing rather than guessing when a message stalls.

### Skywire: Documentation

**`docs: visual tour of the wasm-visor UI`** adds a screenshot-driven walkthrough of the browser visor's interface, and **`docs(readme): regenerate goda dependency graph + add gocloc lines-of-code table`** refreshes the README's dependency graph and adds a lines-of-code breakdown so the repository's shape stays legible as the skychat refactor moves code between packages.
