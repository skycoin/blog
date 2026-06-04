+++
date = "2026-05-30"
tags = ["Development", "Skywire"]
title = "Development Update — May 30"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A light day. The node survey learns to report CPU details on the hardware skywire actually runs on — ARM single-board computers and Windows — and the `hv ls` listing gains multi-section output with aligned columns.

### Skywire: Survey — CPU Info on the Real Hardware

**`2934` feat(survey): internalize zcalusic/sysinfo + populate CPU on ARM SBCs and Windows** — the node survey (the hardware/OS inventory a visor reports) internalizes the `zcalusic/sysinfo` library and fills in CPU details on the platforms where it was previously blank: ARM single-board computers (the Raspberry-Pi-class hardware much of the network runs on) and Windows. Internalizing the dependency also means the survey isn't at the mercy of an external library's platform gaps — the code that needs fixing is in-tree.

### Skywire: CLI — hv ls Multi-Section

**`2933` feat(cli,hvui): hv ls multi-section + cross-section column alignment** — `hv ls` renders multiple sections (mirroring the nested-hypervisor tree the UI shows) with columns aligned *across* sections, so a visor in one sub-hypervisor's section lines up with one in another. A readable flat-text view of the same nested structure the dashboard renders.

### Skywire: Misc

- Reward-calculation refinements (`2929`, `2923`) and a lint-debt sweep across the WASM-policy and CXO-connmap tests (`2936`).
