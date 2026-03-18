+++
date = "2026-01-06"
image = "img/skywire-the-next-internet.png"
tags = ["Announcements", "Skywire"]
title = "Skywire v1.3.33 Released"
+++

### Skywire v1.3.33

Skywire v1.3.33 has been released and is available from [GitHub](https://github.com/skycoin/skywire/releases/tag/v1.3.33).

This release fixes internal app stability issues:

- **VPN client crash fix** — resolved a panic caused by a nil client pointer when `vpn.NewClient` fails
- **Internal app launcher safety** — replaced `os.Exit()` calls with error returns in all apps (vpn-client, skysocks-client, skychat) so that failures no longer terminate the entire visor process
- **Log file permissions fix** — log files created by root-owned visors are now readable (0644 instead of 0600)
- **VPN client closed channel fix** — prevented panic on send to closed channel
- **Updated dependencies**

### Install

Linux users can install Skywire from the [APT repository](https://deb.skywire.skycoin.com/) or the [AUR](https://aur.archlinux.org/packages/skywire-bin). Windows and macOS installers are available on the [GitHub release page](https://github.com/skycoin/skywire/releases/tag/v1.3.33).

For questions or technical assistance: [t.me/skywire](https://t.me/skywire)
