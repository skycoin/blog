+++
date = "2023-01-23"
image = "img/skywire-the-next-internet.png"
tags = ["Announcements", "Skywire"]
title = "Skywire v1.3.0 Released"
+++

### Skywire v1.3.0

Skywire v1.3.0 has been released and is available from [GitHub](https://github.com/skycoin/skywire/releases/tag/v1.3.0).

This is a major release introducing a new reward system, system tray support, and extensive CLI improvements:

- **New reward system** — tiered reward structure with hypervisor UI integration for managing reward addresses; deprecated the old whitelist system and removed miner type distinctions
- **System tray support** — run Skywire as a system tray application via the `--systray` flag
- **Visor ping and test** — new `skywire-cli visor ping` and `skywire-cli visor test` subcommands for network diagnostics
- **Port visibility** — `skywire-cli visor ports` shows app and service ports
- **VPN improvements** — added DNS to TUN in VPN client, print new IP after connecting, fixed VPN client start logic
- **Log collection** — new `skywire-cli log` command for collecting visor logs
- **CLI documentation** — `skywire-cli doc` command for generating CLI docs
- **Autoconfig** — integrated automatic visor configuration
- **DMSG server selection** — support for choosing specific DMSG servers
- **UI overhaul** — rebuilt Angular UI upgraded to v15, multiple bug fixes
- **Stability fixes** — resolved panics, data races, and negative waitgroup issues

The minimum version requirement for mainnet rewards has been updated to v1.3.0.

### Install

Linux users can install Skywire from the [APT repository](https://deb.skywire.skycoin.com/) or the [AUR](https://aur.archlinux.org/packages/skywire-bin). Windows and macOS installers are available on the [Downloads](https://skycoin.com/downloads) page.

For questions or technical assistance: [t.me/skywire](https://t.me/skywire)
