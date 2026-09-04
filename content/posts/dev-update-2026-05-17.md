+++
date = "2026-05-17"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — May 17, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Two threads dominate today. First, skychat's **pairing** path — direct, one-to-one CXO-backed messaging — gets its own baseline tests and CLI surface, sitting alongside the group path. Second, the skychat-group gossip model shifts to an **admin-aggregator, full-mesh** topology with signed mutations and signed leaf messages, dropping the older admin-mirror feed scheme. Underneath, a cluster of CXO node/skyobject/cxds fixes, and dmsgpty's MultiDialer grows a **skynet** listener and dialer — pty reaching a peer over skywire's own p2p transports, not only dmsg.

### Skywire: Skychat — Pairing (CXO-Backed Direct Messages)

The group work has a sibling: a *pair* path for direct, one-to-one messaging over the same CXO substrate. Today lands its baseline and CLI.

**`2699` feat(cli/skychat): pair subcommands for CXO p2p baseline (1c)** — a `cli skychat pair` command family for the direct-message baseline, the p2p counterpart to the group subcommands.

**`2693` feat(cli/skychat): --verbose flag on send (per-layer counter delta)** — `send --verbose` prints the per-layer counter delta for that send, so a single message can be watched move through each stage. The same observability philosophy the group counters established, applied to the send path.

**Pairing robustness** — a set of fixes harden the pair session lifecycle: an `ErrPairClosed` sentinel plus nil-guards on `Send`/`Connect` after `Close` (no use-after-close panics), a `/pair/inbox` HTTP handler that closes a CLI gap (#2699), and a per-call deadline bounding the inner `/message` Write (**`2687`**) so a stalled peer can't wedge a send.

A run of baseline tests pins the behavior: a CXO-backed DM comparison suite (#2694, #2697), a pair-level replay-on-reconnect baseline (operator-reset, phase A), and an in-process 3-visor federated receive cascade (#2673). These establish a known-good reference the reliability fixes are measured against.

### Skywire: Skychat/Group — Admin-Aggregator, Full Mesh, Signed

The group topology takes a meaningful turn: away from dedicated admin-mirror feeds, toward a full-mesh model where roster and admin state are signed mutations every member can verify.

**`2682` refactor(skychat/group): drop admin-mirror feeds — full mesh only** — removes the admin-mirror feed scheme in favor of a single full-mesh model. Fewer moving parts, one propagation path to reason about.

**`2685` feat: sign + verify leaf-level Messages (alpha slice)** + **`2688` feat: admin-side verbatim republish on onUpdate (beta slice)** + **`2689` feat: non-admin sub topology (admin-aggregator slice)** — the admin-aggregator design in three slices: leaf-level messages are signed and verified (a member can't forge another's message), the admin republishes verbatim on update (so non-admins receive a consistent, admin-anchored view), and the non-admin subscription topology is wired to that aggregator.

**`2674` feat: publish signed roster/admin mutations on roster change** — every roster change emits a signed mutation, building on the mutation-types + signing groundwork. Roster and admin membership become verifiable rather than trusted-by-position.

**`2690` feat(cxo/treestore): ConnectAndWaitForRoot — atomic-subscribe semantics** + **the #2690 follow-up switching all 6 Connect call sites to `ConnectAndWaitForRoot`** — subscribe-then-wait-for-the-first-Root becomes a single atomic operation. The previous two-step (connect, then separately wait) had a window where a subscriber was attached but had no Root yet; the atomic form closes it, and every call site adopts it.

### Skywire: CXO — Node / Skyobject / CXDS Robustness

The CXO layer keeps getting hardened against partial state and lifecycle races.

**`2677` fix(cxo): recover from missing seqs in RemoveRootObjects + periodic forced sweep** — `RemoveRootObjects` tolerates gaps in the sequence range instead of erroring, and a periodic forced sweep cleans up what incremental removal misses.

**`2681` fix(cxo/node): guard Conn init signaling against double-close panic** — the connection-init signal is guarded against a double-close (the same class of "close of closed channel" crash the idempotent init guards elsewhere address).

**`2683` fix(cxo/skyobject): LastRoot + rootByHash nil-deref on missing CXDS bytes** + **`2684` fix: replace naked returns in LastRoot** — `LastRoot`/`rootByHash` no longer nil-deref when the backing CXDS bytes are absent, and the naked returns that made the control flow hard to follow are made explicit.

**`2676` fix(cxo/cxds): memoryCXDS.Del actually removes the map entry** — the in-memory CXDS `Del` was not actually deleting the map entry. A latent correctness bug in the memory store, now fixed.

Plus `OnRootFilled`/`OnFillingBreaks` callback access is synchronized, and treestore gains repro/baseline test scaffolding (peerSub-reattach, full-mesh 4-visor baseline).

### Skywire: dmsgpty — Skynet in the MultiDialer (Phase 3)

**`2675` refactor(dmsgpty): skynet listener + dialer in MultiDialer chain (phase 3)** — continuing the dialer refactor, the `MultiDialer` chain gains a **skynet** listener and dialer. pty sessions can be carried over skywire's own p2p transports (the routed overlay), not only over dmsg — exactly the both-transports-are-first-class property the rest of the system is built around. The MultiDialer abstraction means a caller asks for a peer and the chain picks an available path.

### Skywire: Misc

- **`2680` feat(cli/log): subcommands for survey-whitelist endpoints** — CLI coverage for the survey-whitelist endpoints.
- **`2701` docs(readme): counter-points + restructure Major features** — README restructures the "Major features" section and adds counter-points.
- Lint/format housekeeping: `2700`, `2686`, and a `make format` pass for godoc list indentation.
