+++
date = "2026-01-02"
image = "img/skywire-the-next-internet.png"
tags = ["Announcements", "Skywire"]
title = "Skywire v1.3.32 Released"
+++

### Skywire v1.3.32

Skywire v1.3.32 has been released and is available from [GitHub](https://github.com/skycoin/skywire/releases/tag/v1.3.32).

This is a large release with extensive infrastructure improvements, new services, and better testing coverage:

- **GeoIP service** — new embedded GeoIP database for visor location data
- **Transport Discovery in-memory cache** — significant performance improvement for TPD queries with signature verification caching
- **Service Discovery in-memory store** — faster service lookups
- **E2E test improvements** — extensive end-to-end testing additions including internal/external app launcher tests and multi-instance visor load testing
- **Apps launcher revisions** — fixes for app launching and hardcoded configuration issues
- **Improved retry logic** — better retry handling for TPD queries and STCPR binding
- **DMSG invalid pubkey panic fix** — resolved crash on malformed public keys
- **Autoconnect unknown network type fix** — graceful handling of unrecognized network types
- **Windows improvements** — improved batch file code and Winget package manager integration
- **Profiling support** — added pprof endpoints to all services for diagnostics
- **Reward system accessibility** — fixed reward system access over DMSG

### Install

Linux users can install Skywire from the [APT repository](https://deb.skywire.skycoin.com/) or the [AUR](https://aur.archlinux.org/packages/skywire-bin). Windows and macOS installers are available on the [GitHub release page](https://github.com/skycoin/skywire/releases/tag/v1.3.32).

For questions or technical assistance: [t.me/skywire](https://t.me/skywire)
