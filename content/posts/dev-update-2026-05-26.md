+++
date = "2026-05-26"
tags = ["Development", "Skywire"]
title = "Development Update — May 26"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A refactoring-heavy day with one clear goal: make the visor config generator **compile to WASM under TinyGo**, so the install-command generator page can build a real config in the browser from the live flag set. That meant surgically removing `net/http` and `encoding/json` from the config-gen build graph and hand-rolling a streaming JSON serializer. Alongside, the skypty-over-skynet listener gets the fixes that make it actually start and accept connections.

### Skywire: A WASM-Clean Config Generator

The install-command generator lifts skywire's own `autoconfig` flag set into a browser form via a TinyGo-compiled WASM blob — so the flags shown always match the binary. To generate a *config* in the browser (not just assemble a command line), the config generator itself has to compile under TinyGo, which is strict about what packages it accepts. Today does that surgery.

**`2829` feat(visorconfig): extract schema leaf packages — V1 now WASM-clean** + **`2830` feat(skywireconfig): genvisor — WASM-clean visor config generator** — the config schema's leaf types are extracted into packages that don't drag heavy dependencies, and a `genvisor` generator is built that compiles cleanly to WASM.

**`2834` refactor(visorconfig,dmsg/disc): drop net/http from WASM build graph** + **`2835` refactor: split json paths for WASM** + **`2836` refactor: purge encoding/json from WASM build graph — TinyGo unlocked** + **`2837` feat(genvisor): hand-rolled streaming JSON serializer for TinyGo** — the two big blockers were `net/http` and `encoding/json`, both of which TinyGo struggles with. `net/http` is dropped from the config-gen graph entirely; `encoding/json` is purged and replaced with a hand-rolled streaming JSON serializer. With both gone, TinyGo is unlocked and the generator compiles. **`2828`** adds `js/wasm` build-tag stubs for `netutil`/`skyenv`, and **`2826`** makes the `autoconfigcmd` factory + keypair generation WASM-clean.

**`2832` feat(autoconfig): config-gen parity — every SKYENV variable now exposed** + **`2838` feat(autoconfigcmd): expose config-gen defaults via EnvMapping** — config-gen parity: every `SKYENV` variable is now exposed through the generator, with defaults surfaced via an `EnvMapping`, and **`2827`** gives the flags operator-helpful descriptions. The browser form can now drive the full config surface.

### Skywire: skypty Over Skynet — Make the Listener Work

Yesterday's management-over-skynet work needed the pty's skynet listener to actually function.

**`2846` fix(visor): dmsgpty skynet listener never started due to init ordering** + **`2847` fix(visor): dmsgpty skynet listener silently rejects route-group conns** — two bugs that made the skynet pty path a no-op: the listener was never started because of initialization ordering, and even when reached it silently rejected route-group connections. Both fixed — pty over the routed overlay now actually accepts.

**`2841` feat(dmsgpty): add --scheme flag to bypass MultiDialer chain** — a `--scheme` flag lets the operator pin the transport (e.g. force skynet, or force dmsg) instead of letting the `MultiDialer` chain choose — useful when one path is flaky and you want to exercise the other deliberately.

### Skywire: dmsg-Discovery Self-Publish (and a Revert)

A short back-and-forth on how services register themselves: **`2843` fix(dmsgdisc): self-publish own entry so DMSG-first actually works** was merged, then **`2844`** reverted it, and **`2845` fix(dmsgclient): stop services self-publishing via fallback wrapper** settled the question — services shouldn't self-publish through the fallback wrapper. The honest record of working out the right registration path.

### Skywire: Misc

- **`2839` ci: enable Windows arm64 MSI build** — the Windows MSI matrix gains arm64.
- **`2842` fix(hypervisor): refresh summary cache from RPC goroutine, not select arm** — the summary cache refresh moves off the actor's select arm into its own goroutine, so a slow refresh doesn't stall the hypervisor's event loop.
- **`2840` fix(visor): quiet rpc_bridge accept-loop log spam during shutdown** + **`2823` fix(cmdutil): BootstrapDmsg uses HTTP discovery for client entry lookups** — log-spam cleanup on shutdown, and a bootstrap fix for client-entry lookups.
