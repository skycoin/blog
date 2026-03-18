+++
date = "2024-09-24"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
tags = ["Announcements", "Skywire"]
title = "Skywire v1.3.26 Released"
+++

### Skywire v1.3.26

Skywire v1.3.26 has been released and is available from [GitHub](https://github.com/skycoin/skywire/releases/tag/v1.3.26).

- **Embedded service configs** — services-config.json and dmsghttp-config.json are now embedded in the binary, eliminating external config file dependencies
- **Removed hardcoded services** — restructured `cmd/skywire` to load service addresses from embedded configs instead of hardcoded values
- **Updated DMSG server addresses**
- **Minimum version requirement** incremented

### Install

Linux users can install Skywire from the [APT repository](https://deb.skywire.skycoin.com/) or the [AUR](https://aur.archlinux.org/packages/skywire-bin). Windows and macOS installers are available on the [Downloads](https://skycoin.com/downloads) page.

For questions or technical assistance: [t.me/skywire](https://t.me/skywire)
