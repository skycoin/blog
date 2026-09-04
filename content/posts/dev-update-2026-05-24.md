+++
date = "2026-05-24"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — May 24, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The management plane starts moving onto the overlay. Visor↔hypervisor RPC and the pty session can now **auto-upgrade to skynet** — carrying control traffic over skywire's own routed transports rather than only over dmsg. The pty UI gets a `skypty-ui` rebrand, the installers get a round of fixes (and the groundwork for generating the config at install time), and two patch releases go out.

### Skywire: Management Over Skynet

Control traffic — the RPC a hypervisor uses to drive a visor, and the pty session an operator opens into it — has historically ridden dmsg. Today it learns to ride the routed overlay too.

**`feat(visor): auto-upgrade visor↔hypervisor to skynet for RPC + skypty** — once a skynet path between a visor and its hypervisor is available, the RPC and pty (`skypty`) connections auto-upgrade onto it. The management plane stops being dmsg-bound; it uses whichever transport is best, which for two visors with a direct or short overlay path is the routed transport.

**`fix(visor): skypty + RPC dialer hard-timeout the skynet attempt** — the skynet dial attempt is hard-bounded, so a slow or failing overlay path falls back rather than hanging the management connection. Upgrade-when-available, never block-on-upgrade.

### Skywire: skypty-ui

**`feat(dmsgpty/ui): skypty-ui rebrand + drop box overflow + drop DMSGPTYTERM** — the pty web UI is rebranded `skypty-ui`, drops the `DMSGPTYTERM` naming, and fixes a box-overflow rendering issue. The rename tracks reality: the pty isn't dmsg-specific anymore (it runs over dmsg, skynet, tcp, or http), so the UI shouldn't carry the dmsg-only name. A small follow-up drops an empty trailing newline from `urlCommands`.

### Skywire: Installers

**`fix(win_installer): generate-if-missing skywire.conf at %ProgramData% on MSI** — the Windows MSI generates `skywire.conf` at `%ProgramData%` if it's missing, so a fresh install comes up configured. **`fix(win_installer): drop removed -b flag; preserve SK across MSI upgrades** — the installer drops a removed flag and, importantly, preserves the visor's secret key across an MSI upgrade (an upgrade shouldn't rotate your identity). The mac installer gets the parallel treatment: drop the `-b` flag, add the `skywire.conf` env file.

### Skywire: Releases

Two patch releases ship: **v1.3.55** and **v1.3.56**, on top of v1.3.54 — rolling up the routing, management-over-skynet, and installer fixes. Plus an autoconfig/`config gen` cleanup that quiets the gen subprocess and tidies flag descriptions.
