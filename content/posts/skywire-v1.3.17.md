+++
date = "2024-02-09"
image = "img/skywire-the-next-internet.png"
tags = ["Announcements", "Skywire"]
title = "Skywire v1.3.17 Released"
+++

### Skywire v1.3.17

Skywire v1.3.17 has been released and is available from [GitHub](https://github.com/skycoin/skywire/releases/tag/v1.3.17).

- **Deployment binaries merged** — deployment services are now compiled together with Skywire, resolving dependency issues
- **dmsgweb included** — dmsgweb subcommands moved into the main binary
- **Timeout flag** — added `--timeout` (`-t`) flag to proxy and VPN start commands
- **Proxy list caching** — re-implemented proxy list with caching of uptime and service discovery files for faster server list loading
- **Reward calculation fix** — redundantly parse MAC address from surveys for more reliable reward computation
- **Windows installer fix** — removed dummy character from installer script

### Install

Linux users can install Skywire from the [APT repository](https://deb.skywire.skycoin.com/) or the [AUR](https://aur.archlinux.org/packages/skywire-bin). Windows and macOS installers are available on the [Downloads](https://skycoin.com/downloads) page.

For questions or technical assistance: [t.me/skywire](https://t.me/skywire)
