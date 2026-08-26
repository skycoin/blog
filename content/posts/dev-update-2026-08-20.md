+++
date = "2026-08-20"
tags = ["Development", "Skywire"]
title = "Development Update — August 20"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The routing-policy work crosses a threshold today: `adaptive` becomes the default preset, and a family of conditional presets and a native-Go engine let it run on the TinyGo wasm-visor without a WASM interpreter aboard. Alongside it the CXO treestore gains real self-heal so a publisher can no longer freeze on an evicted object, the mux data plane gets a no-dip hot-swap and a full-window SACK, and the CLI gains a live per-leg mux chart and a one-call `visor state` snapshot. The packaging side moves to a rolling per-merge binary and drops the retired `stable` channel.

### Skywire: Adaptive Becomes the Default

**`4045`** makes `adaptive` the default routing policy and folds transport diversity directly into its forward-leg pick, so the composite preset — size, membership and explore in one — is what a stock visor runs. **`4028`** adds four conditional presets it can dispatch on: `geo-avoid`, `transport-diverse`, `trust-tiered` and `time-of-day`. **`4043`** gives the geo layer an address-resolver lookup for off-path intermediary hops, so a hop that never appears on the direct path can still be placed geographically. **`4044`** threads a `--override key=value` flag on `proxy mux plot --pk` down to the policy's `CLIOverrides`, so a preset's knobs can be tuned live from the command line.

### Skywire: A Preset Engine the wasm-visor Can Run

**`4040`** adds a native-Go preset engine so the TinyGo wasm-visor executes the routing presets directly, with no wazero interpreter embedded — the browser visor could not carry a WASM runtime inside its own WASM binary, so the compiled presets get a pure-Go execution path that runs everywhere the visor does.

### Skywire: CXO Self-Heal, No More Publisher Freeze

A publisher had been freezing when a cached object it needed to serve was evicted. **`4036`** and **`4041`** repair the filling-item path so the treestore's self-heal can restore an evicted object rather than wedging on it, curing a real TPD/`[stats]` freeze observed live. **`4034`** stops the visor from calling `Fatal` — crashing outright — on a recoverable database miss while serving or storing objects, and **`4046`** lands a busy visor's *full* transport list through a targeted, bounded discovery-leaf fetch rather than depending on a whole-Root fill that a short-lived connection breaks.

### Skywire: Mux No-Dip Hot-Swap and Full-Window SACK

**`4042`** flushes the in-flight retransmit window when a mux leg is demoted, so the no-dip hot-swap — promote a warm standby, demote the active leg — hands off cleanly without stranding the retx state on the parked leg. **`4024`** closes issue #86: a persistent gap on one leg could wedge the whole stream, so a full-window SACK now covers it rather than leaving the receiver stuck behind a hole it never re-requests in full.

### Skywire: The Live Mux Chart and `visor state`

A new `proxy mux plot` command draws the controlled measured mux as a live terminal chart. **`4020`** is the first cut — live per-leg bandwidth and RTT — **`4023`** adds `--pk` for a live per-route chart of a controlled measured mux, **`4027`** moves it onto the `0magnet/plot-go` pipeline with a `--tui` alt-screen mode, and **`4035`** streams the default `-n` mode over gRPC so the chart updates smoothly instead of polling once a second over unary calls (**`4026`** allowlists it in the JSON-contract test). Separately, **`4025`** adds `visor state`: one call returns a curated, secrets-free snapshot of a visor's live runtime — the read counterpart to `config show`.

### Skywire: Packaging and CI

**`4038`** and **`4039`** drop the `web` browser-UI command from the default binary, and **`4037`** fixes CI to build the repo-root `skywire` (the default compilation) rather than `./cmd/skywire`. **`4030`** publishes a rolling compressed Linux binary on every merge as the binary auto-update artifact, and **`4031`** removes the retired `stable` auto-update channel machinery, with **`4033`** refreshing the `/etc/skywire.conf` template to drop the dead channel and document the binary channels and `GOPROXY_MODE`. **`4029`** adds a module-mode integrity check to catch `go.sum`/module breaks the vendored CI misses, **`4032`** adds a `--bind` listen-address flag to `rewards ui` (deprecating `--port`), and **`4019`** clears the lint from the discovery/routing series.
