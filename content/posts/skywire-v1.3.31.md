+++
date = "2025-10-03"
image = "img/skywire-the-next-internet.png"
tags = ["Announcements", "Skywire"]
title = "Skywire v1.3.31 Released"
+++

### Skywire v1.3.31

Skywire v1.3.31 has been released and is available from [GitHub](https://github.com/skycoin/skywire/releases/tag/v1.3.31).

This release focuses on public visor connectivity and autoconnect reliability:

- **Public visor connectivity fix** — public visors now detect their status by checking the address resolver's STCPR keys rather than relying on config and network conditions that may not be ready at startup
- **Autoconnect improvements** — public-to-public connections properly bypass transport limit checks once the visor is registered
- **STCPR heartbeat removed** — eliminated unnecessary heartbeat traffic
- **Updated hardcoded DMSG server IPs**

The minimum version requirement for Skywire mainnet rewards has been updated to v1.3.31.

### Install

Linux users can install Skywire from the [APT repository](https://deb.skywire.skycoin.com/) or the [AUR](https://aur.archlinux.org/packages/skywire-bin). Windows and macOS installers are available on the [GitHub release page](https://github.com/skycoin/skywire/releases/tag/v1.3.31).

For questions or technical assistance: [t.me/skywire](https://t.me/skywire)
