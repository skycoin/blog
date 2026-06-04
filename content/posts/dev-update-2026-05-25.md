+++
date = "2026-05-25"
tags = ["Development", "Skywire"]
title = "Development Update — May 25"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The CLI's connection to a visor gets unified around one idea: address a visor by its **public key** and reach it over whichever transport works. `--rpc` and `--via` now accept both `dmsg://<pk>` and `skynet://<pk>`, the dmsg and skynet bridges fold into a single RPC surface, and `--via skynet://` works end to end. The control plane gets the same both-transports-are-first-class treatment the data plane already had — plus self-healing for degraded dmsg.

### Skywire: Unified Visor-RPC — Address by Key, Reach by Any Transport

Until now, reaching a visor's RPC over the network meant a patchwork: a dmsg path here, a transport-RPC subcommand there, a separate CLI keypair in some cases. Today consolidates all of it.

**`2811` feat(cli): unify --rpc with skynet://<pk> + delete tp-rpc subcommand** — `--rpc skynet://<pk>` reaches a visor's RPC over the routed overlay, and the special-case `tp-rpc` subcommand is deleted — it's just `--rpc` now.

**`2812` / `2813` feat: dmsg-direct visor-RPC listener + --rpc dmsg://<pk>, with a dmsg-bridge TCP listener** — `--rpc dmsg://<pk>` reaches the visor over dmsg, and a dmsg-bridge TCP listener means it works *without* the CLI needing its own dmsg keypair — the bridge handles the dmsg side.

**`2814` / `2815` feat: fold the dmsg bridge into the existing RPC port + --via; unify dmsg + skynet bridges so --via skynet:// works end-to-end** — the dmsg and skynet bridges collapse into one surface on the existing RPC port. The upshot: `--via skynet://<pk>` works end to end, the same way `--via dmsg://<pk>` does. One address scheme per transport, one flag, one mental model — *which key, over which transport.*

**`2810` fix(visor): transport-RPC actually works — shared mux + init order + auto-create transport** — the foundation that makes the above real: a shared mux, the right initialization order, and auto-creation of the transport when one isn't already up. **`2816`** fixes the CLI parsing the `:port` out of a `--via` URL (it was hardcoded to the dmsg visor-RPC port).

This is the management-plane expression of the system's core property: a visor *is* its public key, and you reach it over dmsg or over the routed transport mesh, interchangeably.

### Skywire: Self-Healing Control Connections

**`2806` fix(visor+hypervisor): self-heal orphan RPC conns on degraded dmsg** — when dmsg degrades, RPC connections that were orphaned by it are detected and re-established rather than left dangling. **`2807` fix(visor): skynet-preferred (not skynet-first) for hypervisor RPC** — a subtle but important distinction: the hypervisor RPC *prefers* skynet when it's healthy but doesn't rigidly demand it first, so a visor without a ready overlay path still connects over dmsg instead of stalling.

### Skywire: Transport + Interactivity

**`2818` fix(transport,dmsg): TCP_NODELAY on all interactive paths** — `TCP_NODELAY` is set on the interactive paths, so a keystroke in a pty session (or any small interactive write) isn't held by Nagle's algorithm waiting for more bytes. The difference between a snappy and a laggy remote shell.

**`2821` fix(transport): remove recursive RLock in Manager.GetTransport** — a recursive read-lock in `Manager.GetTransport` (a latent deadlock/footgun under the right contention) is removed.

### Skywire: Metrics + Hypervisor + Release

- **`2822` / `2825` fix(metrics): internalize VictoriaMetrics/metrics + gotop** — the metrics and gotop dependencies are internalized, silencing a PSI (pressure-stall-information) log line and lint-cleaning the vendored trees.
- **`2817` fix(hypervisor): no ghost rows on failed Summary + remove data race** — a failed summary no longer leaves a ghost row in the dashboard, and a data race is removed.
- **`2819` chore(release): auto-publish the draft after all artifacts are uploaded** + **`2820` v1.3.57** — the release flow auto-publishes the draft once every artifact is up (the first move toward the no-stuck-drafts release behavior), and v1.3.57 ships.
