+++
date = "2026-05-27"
tags = ["Development", "Skywire"]
title = "Development Update — May 27"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A big structural day. Two long-running refactors converge: the **unified app framework** (#2775) names the implicit contract every skywire app has been following and starts folding the built-in services into it, and the **pty rename** finishes de-coupling the pty subsystem from dmsg — `pkg/dmsg/dmsgpty` becomes `pkg/pty`, because the pty runs over dmsg, skynet, tcp, *or* http, and the name should say so. Plus the pair-binary collapse and a round of hypervisor-cache tuning that produces two patch releases.

### Skywire: The Unified App Framework (#2775)

Every skywire app — skysocks, vpn, skychat, the pty, the web servers — has been following the same implicit contract (a run function, a status/error surface, a port). #2775 names that contract and makes it explicit, so apps stop being near-duplicates of each other.

**`2860` refactor(app): name the implicit app contract (phase 1)** + **`2861` / `2862` extract status/error/port helpers + type RunFunc as AppFunc (phase 2)** — the contract is given a name and a type (`AppFunc`), and the boilerplate every app reimplemented (status, error, port) is extracted onto `*app.Client`.

**`2867` refactor(visor): pty as Internal app (phase 3.3)** + **`2871` / `2872` dmsgweb + skynetweb as Internal apps (phase 3.2 / 4)** — the pty and the two web servers become *Internal apps* — running inside the visor under the same app contract as the external apps, with proper restart policies, instead of bespoke subsystems. **`2869`** makes the pty's `AppFunc` complete the in-process IPC handshake, and **`2870`** fixes `RestartPolicy=Always` to re-start on an operator stop.

The RFC for the unified service contract (#2863) captures where this is going: one app shape, declared run-modes, the built-in services as apps.

### Skywire: The Final Pty Rename

**`2876` refactor: rename pkg/dmsg/dmsgpty → pkg/pty** + **`2877` refactor(visorconfig): rename Dmsgpty → Pty w/ JSON backward-compat** + **`2879` refactor(cmd): rename cmd/dmsg/dmsgpty-{host,ui,cli} → pty-*** — the pty subsystem sheds its dmsg-specific name. It was never really dmsg-only — it runs over dmsg, skynet, tcp, or http — so `pkg/dmsg/dmsgpty` becomes `pkg/pty`, the config `Dmsgpty` becomes `Pty` (with JSON backward-compat so existing configs still parse), and the commands become `pty-*`. **`2866`** keeps the `dmsg pty *` CLI subtree intact (hidden, not removed) so existing muscle memory and scripts don't break, and **`2864`** consolidates the cli/host/ui under `skywire app pty`.

**`2878` fix(visorconfig): V1.UnmarshalJSON must not wipe preset *Common** — a config-unmarshal fix surfaced by the rename: unmarshaling must not wipe a preset `*Common` block.

### Skywire: Pair-Binary Collapse

**`2873` / `2874` / `2875` refactor(apps): skysocks / vpn / skynet pair collapse** — the paired client/server binaries collapse into single binaries with a shared delegating-wrapper helper (and a fix for the wrapper's recursion). Fewer binaries, one wrapper pattern.

### Skywire: Hypervisor Cache Tuning + Releases

v1.3.57's hypervisor-UI changes introduced a stale-row regression; today walks it back carefully.

**`2852` widen cache-fresh window 30s → 3min** + **`2853` apply cache-fresh window to the sweep branch** + **`2855` walk back the aggressive-eviction half of #2842** + **`2856` shorten hypervisor RPC idle-timeout 10min → 90s** + **`2858` background summaryCache poll independent of UI activity** — the summary cache is widened to absorb the stream-idle cycle, the over-aggressive eviction is reverted, the RPC idle-timeout is tightened, and the cache poll moves to a background loop so the dashboard stays fresh whether or not someone is looking at it. This ships as **v1.3.58** (the walk-back) and **v1.3.59** (the background poll), after **v1.3.57** (47 PRs).

Also today: **`2850`** gives the hypervisor UI sortable columns, drag-drop reorder, a version-history chart, and standalone-mode docs; **`2848`** has dmsgfirst use a direct-client-backed `dmsg.Client` for its primary path; and **`2849`** corrects an embedded keyring port for a community dmsg server.
