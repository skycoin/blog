+++
date = "2026-08-22"
tags = ["Development", "Skywire"]
title = "Development Update — August 22"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The busiest day of the run, on two fronts. A CXO publisher-freeze is diagnosed and closed from several angles — the publisher stops publishing stale history, hydrates best-effort around dangling references, and surfaces its own feed health in `visor state`. And the adaptive router gets a composite destination-transport oracle, capacity-weighted distribution, and a set of guardrails that keep it from reusing a transport already in the group or fighting an explicit `--direct` flag. The proxy status page grows a full per-leg route with every hop and PK.

### Skywire: Cornering the Publisher Freeze

The treestore publisher had been freezing terminally on a missing object. **`4089`** and **`4102`** capture and name the object behind the freeze — the `publishRoot` terminal path, with an `isMissingObject` verdict — and **`4092`** makes the publisher hydrate best-effort, skipping dangling sub-references and naming the culprit rather than wedging on it. **`4104`** cuts the root cause of the churn: publish only *current* data to TPD and keep history bbolt-only, so the published Root stops carrying dead history. **`4103`** surfaces per-feed CXO publish health in `visor state` (`.cxo`), **`4105`** has the TPD aggregator gunzip CXO leaf bodies reader-first, **`4101`** stops treating a reporter with no prior transports as an error in `ReconcileTransportsFromCXO`, and **`4097`** adds a test that measures publisher→subscriber convergence lag under churn.

### Skywire: The Adaptive Oracle and Its Guardrails

**`4091`** gives adaptive routing a composite destination-transport oracle and a large warm-standby pool, and **`4083`** distributes across the mux by capacity weight with a responder bulk-spread default. A run of fixes keeps the mux honest: **`4111`** guarantees the legs are fully disjoint and loop-free, **`4095`** and **`4096`** drop grow-leg and rotation add-leg plans that would reuse a transport already in the group *before* the setup-node dial, **`4108`** keeps control-plane ports single-route (no warm-standby mux), and **`4052`** honors `mux_routes=1` as a genuine single-route-group dial. **`4100`** has a direct dial (`--direct`/`UseExistingTpOnly`) bypass the RSN-oracle 2-hop path, and **`4099`** keeps control forwards and same-LAN destinations direct so the policy stops fighting the flags. **`4109`** corrects the adaptive reverse pool from a drifted 32 back to the intended 3 and rebuilds `bundle.wasm`. Two experimental presets join the family: **`4113`** adds a `coupled` MPTCP-style coupled-congestion-control preset and **`4112`** a `ledbat` delay-based scavenger.

### Skywire: The Full Per-Leg Route on the Status Page

**`4107`** renders the full per-leg route on the proxy status page — every hop, full public keys, per-hop type and latency — and **`4106`** surfaces per-leg *route* latency with a direct/multihop marker and a receive bar. **`4094`** moves status ownership per layer, relocating `status.skysocks` to the skysocks-client, and **`4093`** enables native browse-origin by default for the HTTPS status pages.

### Skywire: Transport State and the CLI

**`4098`** makes address-resolver registration config-only, dropping the runtime transport-count deregister that had been churning, and **`4080`** adds per-type connection metadata to `visor state` and `tp`. On the CLI, **`4077`** gives `svc` a `--testenv`, per-service URL overrides and fetch-chain flags with structured-output parity, **`4075`** defaults uptime queries to v3 to match the CXO mirror, **`4073`** renders ungrouped subcommands in an "Additional Commands" help block, **`4074`** errors on an unknown subcommand under the combined `skywire cli`, **`4076`** fixes apps-cli output bugs, and **`4069`** fixes config-cli flag bugs and exposes `policy_per_dial` in `config gen`.

### Skywire: CI and Packaging

**`4087`** builds all six Linux architectures the tagged releases produce, **`4110`** fixes the publish-binary job's literal env prefixes (`CGO_ENABLED=0: command not found`), **`4084`** bumps `brace-expansion` in the manager-src tree, and **`4114`** and **`4085`** clear the golangci-lint debt blocking develop CI.
