+++
date = "2026-04-05"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — April 5, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: CI E2E Fixes and Runtime Hypervisor Toggle

A consolidation day focused on test reliability and configuration ergonomics (#2279).

**`-Q` flag: write conf template to file** — a new `-Q` flag writes the conf template to a specified file path. Both `-q` (print) and `-Q` (write) now reflect flags passed to them: `skywire cli config gen -iq` uncomments `ISHYPERVISOR` in the printed output. The new `applyFlagsToConf` helper maps CLI flags to SKYENV variables so they take effect in the generated config.

This is the foundation for **runtime hypervisor toggle**: instead of requiring a rebuild or a manual config edit to enable or disable hypervisor mode, operators can generate the correct config with a single command.

**Autoconfig improvements** — `-p` (package mode) was added back to autoconfig after being accidentally removed, and the test config SKYENV was fixed. `stderr` is now suppressed from config gen in the autoconfig path so users don't see internal messages during installation.

**Reward survey validation for dual HTTP+DMSG config** — with dmsg now reading endpoints from `ServicesJSON` using `_dmsg` suffixed fields, the visor survey needs to include both HTTP and DMSG URLs for each service. Added:

- `DmsgDiscoveryDmsg`, `TransportDiscoveryDmsg`, `AddressResolverDmsg`, etc. fields to the visor survey
- `checkServiceConfig` now strips non-comparable fields (`dmsg_servers`, `conf_dmsg`) from both sides before comparison, so surveys that don't include those fields still pass validation

Previously a visor could be silently marked as having an invalid service config just because its survey format hadn't been updated — this fix accommodates both old and new survey formats during the migration.

A relatively quiet day after the large dmsg vendor merge from April 4. Much of the day was spent chasing down CI test flakiness that the vendor update had exposed.
