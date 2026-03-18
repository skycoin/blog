+++
date = "2024-07-02"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
tags = ["Announcements", "Skywire"]
title = "Skywire v1.3.23 Released"
+++

### Skywire v1.3.23

Skywire v1.3.23 has been released and is available from [GitHub](https://github.com/skycoin/skywire/releases/tag/v1.3.23).

- **DMSG address prefix fix** — added missing `dmsg://` prefix to DMSG service addresses
- **Data race fix** — resolved race condition in hypervisor's `getAllVisorSummary` method
- **macOS installer fix** — fixed missing `skywire` command in the postinstall script
- **Rate limiter fix** — fixed bearer token rate limits handler
- **Windows ARM64** — added Windows arm64 archive to the release
- **Log command fix** — fixed `skywire-cli log`
- **Updated DMSG dependency and services config**

### Install

Linux users can install Skywire from the [APT repository](https://deb.skywire.skycoin.com/) or the [AUR](https://aur.archlinux.org/packages/skywire-bin). Windows and macOS installers are available on the [Downloads](https://skycoin.com/downloads) page.

For questions or technical assistance: [t.me/skywire](https://t.me/skywire)
