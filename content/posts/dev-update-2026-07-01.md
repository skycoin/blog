+++
date = "2026-07-01"
tags = ["Development", "Skywire"]
title = "Development Update — July 1"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Today pushed the WASM visor toward being a full-fledged hypervisor in its own right. It gained the network-visualizer, skysocks-lite controls, and skychat that the native UI has, and — underneath — CXO was made to build and run inside a browser tab so a WASM visor can report its own transport telemetry to the TPD. Getting CXO to compile under `js/wasm` meant splitting its on-disk storage behind a build tag.

### Skywire: The WASM Visor as a Flagship Hypervisor

**`3359`** feat(hv-ui): wasm-visor flagship — network-visualizer edges, skysocks-lite control, skychat, usability audit closes much of the remaining gap between the browser visor and the native one. The network-visualizer now draws transport edges for the WASM visor, skysocks-lite gains its control surface, skychat is present, and a usability pass cleaned up the rough spots — making the browser tab a first-class hypervisor rather than a stripped-down preview.

### Skywire: CXO Telemetry From the Browser

**`feat(wasm-hv)`**: in-memory CXO telemetry — report transport bandwidth+latency to TPD lets a WASM visor participate in the transport-quality reporting that native visors do. It runs CXO entirely in memory and publishes its transports' bandwidth and latency to the TPD, so a browser visor's links show up in the network's quality picture instead of being invisible.

**`refactor(cxo)`**: build-tag-split the bbolt on-disk CXDS/IdxDB so CXO builds under js/wasm is what makes that possible. CXO's storage layer used bbolt, which memory-maps a file and cannot compile for `js/wasm` — a browser tab has no filesystem to mmap. This splits the on-disk CXDS and index-DB implementations behind a build tag, so native builds keep the bbolt-backed on-disk store while the `js/wasm` build gets the in-memory variant, letting the same CXO code compile for both targets.

**`3360`** fix(visor): CXO telemetry announce reads discovery when discovery_dmsg is empty fixes where the telemetry announce looks up its target: when the `discovery_dmsg` field is empty it now falls back to the general discovery configuration rather than failing to announce, so the reporting path works whether or not the dmsg-specific discovery override is set.
