+++
date = "2026-03-18"
tags = ["Guides", "Skywire"]
title = "Guide: Running a Public Visor on Skywire"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Running a Public Visor

A public visor is a Skywire node that registers itself on the Service Discovery, making it available for other visors to connect to automatically. Public visors form the backbone of the Skywire network — they're the nodes that other visors auto-connect to for routing traffic.

Running a public visor is also one of the most effective ways to earn [bandwidth-based rewards](/posts/skywire-bandwidth-rewards-transition/), since other users' traffic flows through your transports.

---

### What Makes a Visor "Public"

A visor becomes public when `is_public` is set to `true` in its config. This triggers:

1. **Registration with Service Discovery** — the visor registers itself as a `visor` service type so other visors can find it
2. **STCPR validation** — the visor waits for an external STCPR (TCP relay) connection to confirm it's reachable from the internet
3. **Auto-connect target** — other visors with `public_autoconnect` enabled will automatically create transports to your visor

If your visor can't receive an external STCPR connection within the registration timeout (default: 10 minutes), it deregisters from Service Discovery. This prevents unreachable visors from appearing in the public list.

---

### Prerequisites

- A machine with a **public IP address** (or port forwarding configured)
- The Skywire binary — either from [releases](https://github.com/skycoin/skywire/releases) or `go run github.com/skycoin/skywire@develop`

---

### Step 1: Generate Config

```bash
skywire cli config gen -o skywire-config.json --all
```

The `--all` flag shows all available configuration flags:

```bash
go run github.com/skycoin/skywire@develop cli config gen --help
```

```text
┌─┐┌─┐┌┐┌┌─┐┬┌─┐   ┌─┐┌─┐┌┐┌
│  │ ││││├┤ ││ ┬───│ ┬├┤ │││
└─┘└─┘┘└┘└  ┴└─┘   └─┘└─┘┘└┘

Usage:
  skywire cli config gen [flags]

Flags:
  -a, --bestproto            best protocol (dmsg | direct) based on location
  -b, --noauth               disable authentication for hypervisor UI
  -c, --disableapps          open config with all apps disabled
  -d, --dmsghttp             connect to Skywire services via dmsg
  -e, --auth                 enable auth for hypervisor UI
  -f, --force                remove pre-existing config
  -g, --disableautoconnect   disable autoconnect
  -i, --hvui                 enable hypervisor UI
  -j, --hv strings           add remote hypervisor PKs
  -k, --xhv                  disable remote hypervisors
  -l, --loglvl string        set log level
  -m, --dmsgpty              set dmsg pty whitelist to public key
  -n, --hide                 hide the visor from service discovery
  -o, --output string        config output path
  -p, --pkg                  use default paths of package config
  -q, --publicip             allow display node IP in service discovery
  -r, --norst                remove routing rules
  -s, --sk cipher.SecKey     persistent secret key
  -t, --testenv              use test deployment
  -u, --user                 disable hypervisor
  -v, --servevpn             enable vpn server
  -w, --vpnsc string         vpn server country (ISO 3166-1 alpha-2)
  -x, --newiface             use new default network iface
  -xa, --svcconf string      override services-config.json url
  -y, --autoconn             enable autoconnect
  -z, --nofetch              disable fetching visor services
      --all                  show all flags
      --public               set visor as public
      --stcpr int            stcpr port
```

### Step 2: Enable Public Mode

Edit `skywire-config.json` and set:

```json
{
  "is_public": true,
  "public_visor": {
    "registration_timeout": "10m0s",
    "max_transports": 1000
  }
}
```

Or generate the config with the `--public` flag directly:

```bash
skywire cli config gen \
  -o skywire-config.json \
  --public --stcpr 7177
```

**Configuration fields:**

| Field | Description | Default |
|-------|-------------|---------|
| `is_public` | Register as a public visor on Service Discovery | `false` |
| `public_visor.registration_timeout` | How long to wait for an external STCPR connection before deregistering. Set to `0` to skip validation | `10m` |
| `public_visor.max_transports` | Deregister when this many transports are established. Set to `0` to never deregister | `1000` |

### Step 3: Network Configuration

Your visor needs to be reachable from the internet. The key transport types:

**STCPR (TCP Relay)** — requires a port accessible from the public internet. Either:
- Your machine has a public IP and the STCPR port is open
- You've configured port forwarding on your router

**SUDPH (UDP Hole Punch)** — works through most NATs automatically via the STUN server and Address Resolver.

**DMSG** — always works regardless of NAT, since connections are relayed through DMSG servers. This is the fallback transport.

For maximum connectivity, ensure at least your STCPR port is accessible. The default is determined at config generation time, or you can set it with `--stcpr`.

### Step 4: Start the Visor

```bash
skywire visor -c skywire-config.json
```

On startup, the visor will:
1. Connect to the DMSG network
2. Register with Service Discovery as a public visor
3. Wait for external STCPR validation
4. Begin accepting transports from other visors

You can verify registration by checking the logs for:
```text
Public visor registered on service discovery
```

---

### Enabling Services

A public visor can also run services that other users connect to. These register separately on Service Discovery.

#### VPN Server

Enable in config or generate with `--servevpn`:

```bash
skywire cli config gen \
  -o skywire-config.json \
  --public --servevpn
```

Or edit the launcher apps section in `skywire-config.json` and set `auto_start: true` for `vpn-server`:

```json
{
  "name": "vpn-server",
  "binary": "skywire",
  "auto_start": true,
  "port": 44,
  "args": ["app", "vpn-server"]
}
```

#### SOCKS5 Proxy Server

The skysocks proxy server is enabled by default in most configs:

```json
{
  "name": "skysocks",
  "binary": "skywire",
  "auto_start": true,
  "port": 3,
  "args": ["app", "skysocks"]
}
```

#### Skynet Port Forwarding

Run the [Skynet server](/posts/skynet-port-forwarding/) to forward TCP ports over Skywire:

```json
{
  "name": "skynet-srv",
  "binary": "skywire",
  "auto_start": true,
  "port": 9,
  "args": ["app", "skynet-srv"]
}
```

---

### Remote Management with Hypervisor

The hypervisor UI lets you manage your visor through a web interface — locally or remotely over DMSG.

Enable the hypervisor UI:

```bash
skywire cli config gen \
  -o skywire-config.json \
  --public -i
```

Or start the visor with the flag:

```bash
skywire visor -c skywire-config.json -i
```

```bash
go run github.com/skycoin/skywire@develop visor --help
```

```text
┌─┐┬┌─┬ ┬┬ ┬┬┬─┐┌─┐   ┬  ┬┬┌─┐┌─┐┬─┐
└─┐├┴┐└┬┘││││├┬┘├┤ ───└┐┌┘│└─┐│ │├┬┘
└─┘┴ ┴ ┴ └┴┘┴┴└─└─┘    └┘ ┴└─┘└─┘┴└─

Usage:
  skywire visor

Flags:
  -c, --config string   config file to use (default): skywire-config.json
      --systray         run as systray
  -i, --hvui            run as hypervisor
      --all             show all flags
```

The hypervisor serves a web UI on the configured HTTP address and is also accessible over DMSG for remote management.

To manage your public visor from another visor, add its public key as a remote hypervisor:

```bash
skywire cli config gen \
  -o skywire-config.json \
  -j <public-visor-pk>
```

---

### Monitoring Your Public Visor

#### Check Registration Status

List all public visors and filter for yours:

```bash
skywire cli pv
```

```bash
go run github.com/skycoin/skywire@develop cli pv --help
```

```text
Usage:
  skywire cli pv [flags]

Flags:
  -a, --sdurl string    service discovery url
  -w, --uturl string    uptime tracker url
  -d, --tpdurl string   transport discovery url
  -c, --country string  filter by country code
  -v, --version string  filter by version
  -o, --noton           do not filter by online status
  -s, --stats           return only count of results
  -t, --transports      show transport count per visor
  -n, --min int         minimum transport count
  -r, --raw             print raw JSON
```

#### Check Service Discovery

The `sd` command shows a combined view of all services, transports, and uptime status:

```bash
skywire cli sd
```

This displays a table with:
- Public key
- Country
- Version
- Registered services (proxy, vpn, visor)
- Transport counts by type (stcpr, sudph, dmsg, stcp)
- Uptime tracker status

#### Add Transports to Public Visors

Other visors (or you manually) can add transports to public visors:

```bash
skywire cli tp pv -n 5
```

This connects to up to 5 public visors, trying STCPR first, then SUDPH, then DMSG.

---

### Auto-Connect Behavior

When `public_autoconnect` is enabled (the default), non-public visors automatically:

1. Connect to public visors via SUDPH (up to 5)
2. Add STCPR transports to the same public visors
3. Add SUDPH transports to other connected visors (up to 30 total)

This means running a public visor puts you at the center of the network — other visors will find and connect to you automatically.

---

### Public Visor Lifecycle

1. **Registration** — visor registers on Service Discovery with its public key and STCPR port
2. **Validation** — waits for external STCPR connection (configurable timeout)
3. **Active** — accepts incoming transports, routes traffic, runs services
4. **Deregistration** — occurs if:
   - No external STCPR connection within timeout
   - Transport count reaches `max_transports`
   - Visor shuts down (clean deregistration)

---

### Earning Bandwidth Rewards

Running a public visor is one of the best ways to earn from the [bandwidth reward pool](/posts/skywire-bandwidth-rewards-transition/). When other users connect to your visor and route traffic through your transports:

- **Both sides of a transport get credited** — you earn bandwidth for traffic flowing through your transports
- **More connections = more bandwidth** — as a public visor, other nodes auto-connect to you
- **Services amplify bandwidth** — running a VPN server or proxy server means users route their internet traffic through your visor

To maximize bandwidth rewards:
- Keep your visor online and reachable (qualifies you for Pool 1 uptime rewards)
- Ensure STCPR connectivity for the best transport quality
- Enable VPN server and/or SOCKS5 proxy server
- Set `max_transports` high enough to accept many connections

---

See also: [Skywire: One Binary, Everything You Need](/posts/skywire-unified-binary/) | [Bandwidth-Based Rewards](/posts/skywire-bandwidth-rewards-transition/) | [Deploying Your Own Skywire Network](/posts/guide-deploying-skywire-network/) | [DmsgWeb: Anonymous Websites Over DMSG](/posts/dmsgweb-anonymous-port-forwarding/)
