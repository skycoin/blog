+++
date = "2023-05-26"
image = "img/skywire-the-next-internet.png"
tags = ["Announcements", "Skywire"]
title = "Skywire v1.3.8 Released"
+++

### Skywire v1.3.8

Skywire v1.3.8 has been released and is available from [GitHub](https://github.com/skycoin/skywire/releases/tag/v1.3.8).

This release introduces combined binary compilation and significant config generation improvements:

- **Combined binary** — optional compilation of `skywire-cli`, `skywire-visor`, and `setup-node` into a single binary
- **Config generation overhaul** — new flags for survey whitelist, transport and route setup public keys; revised config gen logic
- **Survey collection whitelist** — control which keys can collect surveys
- **Dmsgpty whitelist** — restrict dmsgpty access
- **Log collection by secret key** — authenticated log collection
- **Health check prerequisites** — log collection API health check before survey and transport log collection
- **Logs UI** — added log viewer to the hypervisor UI
- **VPN fixes** — fixed `skywire-cli vpn list` and VPN start command
- **Multiple panic fixes** — resolved crashes on ARM log store, setup-node RPC, and other edge cases
- **Removed PGP encryption** — surveys no longer PGP-encrypted

### Install

Linux users can install Skywire from the [APT repository](https://deb.skywire.skycoin.com/) or the [AUR](https://aur.archlinux.org/packages/skywire-bin). Windows and macOS installers are available on the [Downloads](https://skycoin.com/downloads) page.

For questions or technical assistance: [t.me/skywire](https://t.me/skywire)
