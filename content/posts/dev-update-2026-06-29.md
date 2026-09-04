+++
date = "2026-06-29"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — June 29, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Packaging and configuration cleanup day. The Windows and Debian installers were fixed to run the right first-boot configuration step, the deployment config moved toward a single dmsg-only source of truth with the clearnet URLs stripped out, and the CLI stopped hardcoding clearnet help URLs in favor of ones sourced from the deployment. A raw-byte splice fix for the skynet web proxy and more mini-desktop UI work rounded it out.

### Skywire: Installers Run the Right Autoconfig

**`3351`** feat(win+autoconfig): Windows postinstall runs skywire autoconfig; autoconfig is PATH-independent fixes what a fresh Windows install does on first boot. The postinstall step now runs `skywire autoconfig` — the correct, complete configuration entry point — and `autoconfig` itself was made PATH-independent so it works regardless of where the installer placed the binary or whether the shell environment has been set up yet. **`3349`** fix(deb): postinstall runs skywire autoconfig, not skywire-cli visor gen-config applies the same correction to the Debian package, which had been calling the lower-level `gen-config` directly and missing the surrounding setup that `autoconfig` performs.

### Skywire: One dmsg-Only Source of Truth

**`3348`** feat(config): dmsg-only deployment services — strip clearnet URLs, single source of truth continues the push to make dmsg the only transport for the deployment's own service discovery. The clearnet URLs are removed from the services config so there is one canonical dmsg-only description of the deployment, rather than a clearnet set and a dmsg set that can disagree.

**`3352`** fix(cli): source the ut + conf URLs in help from deployment (no hardcoded clearnet) removes the last hardcoded clearnet endpoints from the CLI's own help text: the uptime-tracker and config service URLs shown in help are now read from the deployment config instead of baked into the binary, so the help matches whatever deployment the visor is actually pointed at. **`3347`** feat(visor): log config version + warn when it trails the binary makes config drift visible — the visor logs its config version on startup and warns when that version lags the binary, flagging a config that predates the running code before it causes a subtle mismatch.

### Skywire: Proxy and UI

**`3350`** fix(skynetweb): splice raw bytes after HTTP protocol upgrade fixes the skynet web proxy for connections that upgrade off HTTP — WebSockets and the like. After the upgrade handshake the proxy must stop parsing HTTP and splice raw bytes in both directions; it had been mishandling the post-upgrade stream, breaking any protocol that switches away from request/response framing.

**`3344`** feat(hv-ui): mini-desktop tool windows (log/CLI/terminal) + hvinspect + native↔wasm parity fixes adds movable log, CLI, and terminal tool windows to the hypervisor mini-desktop, an `hvinspect` view, and a batch of fixes closing behavior gaps between the native and WASM front-ends. **`3343`** fix(transport): reap unarmed half-open transports (hub-visor load) addresses load on well-connected hub visors: half-open transports that were never armed are now reaped instead of accumulating, freeing the resources they held.
