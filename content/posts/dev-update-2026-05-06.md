+++
date = "2026-05-06"
tags = ["Development", "Skywire"]
title = "Development Update — May 6"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: dmsg-discovery — dmsgfirst APIClient

PR #2433 introduces a new shape for the discovery client: try dmsg first, fall back to HTTP. Pre-fix, every discovery client opened an HTTP connection over the clearnet TCP transport; visors behind aggressive firewalls but reachable over dmsg had to manually configure HTTP through a SOCKS5 proxy.

`dmsgfirst.NewAPIClient` wraps any of the discovery client interfaces. The first request tries the dmsg-http path (using the existing dmsghttp transport); if dmsg isn't ready or the request fails with a transport-layer error, it falls back to plain HTTP. The fallback is sticky for the duration of the process — once HTTP wins, subsequent requests go straight to HTTP — so we don't pay the dmsg-handshake cost on every call when dmsg is known-unreachable.

### Skywire: dmsg-disc — Polymorphic Config + Per-Deployment Servers

A two-PR cleanup of the dmsg-discovery operator surface:

**`2437` refactor(dmsg-disc): drop `--dmsg-servers` flag; rely on embedded keyring** — the flag was a holdover from when the discovery couldn't be expected to know which servers it was authoritative for. With the embedded keyring (introduced earlier) the discovery has the authoritative list at compile time; the flag was almost always wrong when overridden.

**`2438` feat(dmsg-disc): polymorphic dmsg config; per-deployment servers** — the discovery now accepts a deployment-name knob (`prod`, `test`, etc.) and pulls the matching dmsg-servers + dmsg-config block from the conf service. One discovery binary, multiple deployment topologies on the same network.

### Skywire: Decouple Discovery from HTTP-Bootstrap

**`2436` feat(dmsg-disc): decouple discovery from HTTP-bootstrap loop** — the discovery service used to depend on the conf service being up at startup (to fetch its bootstrap config). A cold start with conf-service unreachable was a hard fail.

Now the discovery boots with embedded defaults, starts serving, and asynchronously upgrades to the live conf-service config when it becomes reachable. The cycle of dmsg-discovery depending on conf-service depending on dmsg-discovery (for its own dmsg entry) is broken.

### Skywire: GeoIP Without HTTP

**`2439` feat(visor): geoip without HTTP — dmsg-server LookupIPGeo + Geo on SD entries** — the visor's geoip lookup used to hit `ip.skycoin.com`'s HTTP API. Replaced with two mechanisms:

- **`LookupIPGeo` on dmsg-server** — the dmsg-server (which sees client IPs at the TCP layer) exposes an RPC that returns the geo-record for a given PK. The visor's `cli visor info` and the hypervisor's fleet view use this.
- **Geo on SD entries** — service-discovery already had visor IPs in entries; it now embeds the geo record alongside the IP at register time. The visor reads its own geo from there, no extra round-trip.

The clearnet HTTP geoip dependency is gone. (The embedded MMDB from PR #2352 still handles the offline case.)

### Skywire: pkg/services — JSON Configs

**`2440` feat(svc): JSON config files for the 5 deployment services** — predecessor to the larger framework refactor coming May 8. Each deployment service (dmsgd, sd, tpd, ar, rf) gets a `service-config.json` schema that the `svc` command can load. The flag-based CLI surfaces remain, but the JSON config is now the canonical configuration mode.

### Skywire: Hypervisor + Visor — VPN Tab, Skysocks Tab, Multi-Instance Apps

**`2435` hvui+visor: VPN tab, Skysocks tab, multi-instance app surface, autoconfig-userspace** — three threads in one PR:

- **VPN tab** — first-class hypervisor UI for the VPN client. Connect, disconnect, choose server from the SD-backed list, view current session stats.
- **Skysocks tab** — same shape for skysocks. Includes the per-client whitelist editor.
- **Multi-instance app surface** — apps that previously assumed singleton instances (`vpn-client`, `skysocks-client`) can now run multiple instances per visor, each with its own config and reachable on its own port. Reflected in the UI.
- **Autoconfig-userspace** — config generation now runs entirely in the calling user's home dir without touching `/etc`. Operators on shared machines can run their own visor without sudo.

### Skywire: CXO Cleanups

**`2434` fix(cxo): drop superseded roots + sticky `Unpack.created` for dedup safety** — when a feed's root reference advances, the previous root and everything reachable only from it should be eligible for cleanup. Pre-fix, the cleanup pass missed superseded roots that had been Unpacked recently because `Unpack.created` was being reset on each Unpack call. The `created` timestamp is now sticky from first Unpack, so the cleanup pass correctly identifies "no fresh interest" roots.

**`2441` fix(visor): upgrade dmsg disc clients to dmsgfirst after dmsgC ready** — once the visor's dmsg client finishes its handshake with the network, upgrade any existing HTTP-only discovery clients to the dmsgfirst variant retroactively. New dial attempts use dmsg; the HTTP fallback stays available.
