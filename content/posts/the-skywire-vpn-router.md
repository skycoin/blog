+++
date = "2026-07-22"
tags = ["Development", "Skywire"]
title = "The Skywire VPN Router"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Running a VPN has always been a per-device chore. You install a client on the laptop, another on the phone, a third on the tablet, and you hope the smart TV and the game console — which won't run a client at all — simply do without. Skywire's `vpn-client` was no different: it protects the one machine it runs on, and nothing else on the network.

Today's release, **v1.3.88**, changes the unit of protection from a device to a *network*. The new **`vpn-router`** app turns a spare Linux board — a skyminer, a Raspberry Pi, any SBC with two network interfaces — into a plug-in privacy router. Everything behind it, wired or wireless, gets an address by DHCP and has its traffic NAT'd into the Skywire mesh VPN, with **no per-device configuration**. The phone that joins its WiFi doesn't know Skywire exists; it just has a different public IP.

```
 client devices ──(WiFi or ethernet)──▶  vpn-router  ──▶  tun0 (vpn-client) ──mesh──▶  vpn-server ──▶ internet
                     downstream                             uplink
```

### A companion, not a replacement

The design decision that keeps the whole thing simple is that `vpn-router` doesn't own a tunnel. The existing `vpn-client` already knows how to bring up a `tun` interface to a chosen exit server over the mesh; the router just NATs a downstream LAN into whatever tunnel the client maintains. You enable both apps on the gateway visor, and the router waits (up to 90 seconds) for the tunnel interface to appear, so start order doesn't matter. The NAT itself is nothing exotic — it's exactly the `vpn-server` primitives (`EnableIPv4Forwarding`, `EnableIPMasquerading`, targeted `FORWARD` rules) applied to the tunnel, and every rule is reversed on shutdown.

That leaves the router responsible for just the downstream half: bring up the LAN interface, hand out leases, resolve names, optionally beacon a WiFi AP, and route client traffic into the tun. Because it's manipulating interfaces and `iptables`, it's Linux-only and needs root (`CAP_NET_ADMIN`).

### Two interfaces, three modes

A router needs two network paths on two different interfaces, and the distinction between them is the thing to internalize:

- The **uplink** is how the board itself reaches the internet and the mesh — the carrier that the tunnel to the vpn-server actually rides on. Crucially, *the uplink is not a vpn-router setting*. You configure it the ordinary way (DHCP on ethernet, or `nmcli`/`wpa_supplicant` to join a WiFi network), and the router leaves the host default route on it untouched.
- The **downstream** (`--lan-ifc`) is the interface clients connect to — a wired NIC, or the WiFi radio running as an access point. This is the one you point the router at.

Which interface plays which role gives the three standard deployment modes. **Mode 1** — ethernet uplink, WiFi downstream — is the classic single-box "plug it into your router, connect to its WiFi, you're on the VPN." **Mode 2** flips it: the board joins an existing WiFi network for internet and serves wired clients out its ethernet port. **Mode 3** is all-wired — two ethernet interfaces, no WiFi at all — the most robust option, and the one that makes an ethernet-only router a candidate for a pure-Go appliance image. (A fourth combination, WiFi on both sides, needs two radios and isn't a standard single-box mode.)

Every variant is settable three equivalent ways: the `VPNROUTER*` variables in `/etc/skywire.conf`, `skywire autoconfig` flags, or `skywire cli config gen` flags directly — the same config-gen ⇄ autoconfig ⇄ `.conf` parity the rest of Skywire follows.

### The embedded DHCP + DNS engine

The first cut shelled out to `dnsmasq` for DHCP and DNS. That's a fine daemon, but it's an external dependency the visor otherwise doesn't carry, and it stands between an ethernet-only router and being a self-contained Go appliance. So it's gone: v1.3.88 serves DHCPv4 (`:67`) and DNS (`:53`) on the downstream subnet from an **embedded pure-Go engine**, vendored from the LAN-serving slice of [router7](https://github.com/rtr7/router7). Leases persist, LAN hostnames resolve from them, and there's one fewer binary to install. The trim was aggressive — copying the DHCP handler naively dragged in router7's `netconfig`, which pulls nftables, netlink, and WireGuard; the one thing it actually needed (the interface's link address) is now read from the live interface via stdlib, so all of that got dropped from the dependency graph. The WiFi-AP path still uses `hostapd`, because no pure-Go 802.11 access point exists.

### Routing only the clients, not the router

The subtle part of a VPN *router* — as opposed to a VPN *client* — is that you must not send the board's own traffic through the tunnel. The mesh transport carrying the tunnel to the vpn-server rides on the uplink; if you redirected the host default route through the tun, you'd cut the tunnel's own carrier out from under it. A circular dependency that takes the whole thing down.

The fix is policy routing. The router installs a dedicated routing table (142) whose default route is the tun, and an `ip rule` that steers *only forwarded client traffic* into it — while everything the board itself originates (dmsg, skywire, its own uplink) stays on the main table. Getting that rule right took a hardware bug to surface: the first version matched by source subnet (`from <lan-subnet>`), but the gateway's own address lives inside that subnet, so the router's replies to clients — its DNS answers, its ICMP echo replies — *also* matched and were routed out the tun and black-holed. Clients could associate, get a lease, and ARP the gateway, yet every packet to a router-local service timed out. It looked exactly like a flaky radio data-path. The real fix was to match by **input interface** (`iif <lan-ifc>`) instead: forwarded client packets have an input interface; locally-generated router traffic doesn't, so it stays on the main table. Gateway ping went to 0% loss and DNS resolved immediately. The radio was fine; the policy rule was the bug.

One more forwarding subtlety earned its own fix. Validated end-to-end, ICMP sailed through at 0% loss but full-size TCP downloads stalled — the mesh tunnel's usable MTU is below the LAN's 1500, and PMTU discovery is unreliable across the NAT. Lowering a client's MTU by hand made HTTPS work, which confirmed the cause. Rather than ask every client to tweak its MTU, the router installs a `TCPMSS --clamp-mss-to-pmtu` rule on the forwarded path, so downstream clients auto-negotiate a fitting segment size with no per-client configuration.

### The mesh gateway: reaching `.dmsg` and `.skynet` by name

The headline capability of this release is the **mesh gateway**. Enable it (`VPNROUTERMESHGW=true`) and any device on the LAN can reach Skywire's own services and peers *by name* — `curl http://<pk>.dmsg`, or open `http://<pk>.skynet` in a browser — with no per-device setup and no SOCKS proxy.

This can't work by NAT, because a `.dmsg`/`.skynet` name isn't an ordinary hostname. It encodes a **public key**, and the destination is a **routing port reachable only over the mesh** — frequently there is no externally-listening TCP port and no IP to route to at all. So the gateway does it in two halves:

1. **DNS.** The embedded resolver answers `*.dmsg` / `*.skynet` queries by parsing the name to a public key (raw hex, DNS-label form, or a friendly alias), leasing a **synthetic IP** from a private pool (`100.64.0.0/16` by default), recording the `synthetic-IP → (scheme, pk)` mapping, and returning that IP.
2. **Transparent proxy.** An `iptables` `REDIRECT` in `PREROUTING` catches TCP aimed at that synthetic pool and hands it to a local proxy. The proxy reads `SO_ORIGINAL_DST` to recover what the client was actually trying to reach: the synthetic IP maps back to the PK, and — the neat part — *the original destination port is the mesh routing port*. It dials `<pk>:<port>` over the mesh and splices the two streams together.

Because the `REDIRECT` fires in `PREROUTING`, before any routing decision, mesh-bound traffic never touches the LAN→tun policy route, and the proxy's own dials originate locally on the main table. So the mesh path **deliberately bypasses the VPN tunnel** — `.dmsg`/`.skynet` services are reached over the visor's own transports directly, not hauled out to the exit server and back. Your ordinary web traffic exits through the VPN; your mesh traffic goes straight over the mesh.

Names default to the raw key label, but aliases are configurable (`--mesh-alias name=<pk>`, repeatable) so `http://alice.dmsg` resolves to a chosen key. And for HTTPS, setting `VPNROUTERMESHTLS=true` lets the gateway terminate TLS with a leaf certificate it mints **on the fly** from a self-generated CA, persisted under `mesh-gateway-ca/` and logged with its fingerprint on first start. Trust that CA on the LAN clients that need it and `https://<name>.skynet` works transparently; skip it and browsers will (correctly) warn.

The mesh gateway isn't really a router feature — it's a visor-level capability with two exposure points. The same component (`pkg/vpnrouter/meshgw`, decoupled behind an injected `MeshDial`) also ships in the `vpn-client` for a single machine with no downstream LAN: there it runs a loopback resolver and intercepts the host's own traffic via the `OUTPUT` chain instead of serving a subnet. It's opt-in and off by default, because hijacking a personal machine's DNS is more intrusive than doing so on a box whose whole job is to be a router.

### Real-world hardware notes

Most of the fixes above came out of validating on real boards — Orange Pi Prime skyminers with the onboard `rtl8723bs` radio — and the guide is honest about what that radio demands. Its AP mode is firmware-fragile: it flaps (`AP-ENABLED`→`AP-DISABLED`, stations deauth'd) unless power-save is off, so the router disables interface power-save before starting hostapd — the single most effective stability fix — and the persistent modprobe pin (`options rtl8723bs rtw_power_mgnt=0 rtw_ips_mode=0`) is documented for boards that reset it on link-up. The WiFi radio also has to be released from NetworkManager (`nmcli device set wlan0 managed no`) or the two daemons fight over it. A stuck Realtek staging driver that scans zero networks is cured by a `modprobe -r`/`modprobe` cycle. And if a given board still won't behave as an AP, a cheap **MT7612U USB dongle** turns any board into a stable dual-band access point — or you sidestep the whole AP path with Mode 2 or Mode 3.

### Why this matters

A mesh VPN whose unit of protection is a single host is a personal tool. A mesh VPN you can drop in front of an entire home or office LAN — no client on any device, mesh services reachable by name, the router's own uplink left untouched — is infrastructure. v1.3.88 ships that: a spare board, a config knob, and a network's worth of traffic on Skywire.
