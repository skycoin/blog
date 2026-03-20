+++
date = "2026-03-18"
tags = ["Guides", "Skywire"]
title = "Guide: Deploying Your Own Skywire Network"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Deploying Your Own Skywire Network

All Skywire deployment services are included in the [unified Skywire binary](/posts/skywire-unified-binary/). You can deploy a complete private Skywire network — or just use the same tools to understand how the production network works.

This guide follows the [systemd deployment documentation](https://github.com/skycoin/skywire/blob/develop/docs/deployment/DEPLOYMENT_SYSTEMD.md). A [Docker Compose deployment](https://github.com/skycoin/skywire/blob/develop/docs/deployment/DOCKER_DEPLOYMENT.md) is also available.

### Architecture Overview

```text
$ go run github.com/skycoin/skywire@develop svc
┌─┐┬┌─┬ ┬┬ ┬┬┬─┐┌─┐   ┌─┐┌─┐┬─┐┬  ┬┬┌─┐┌─┐┌─┐
└─┐├┴┐└┬┘││││├┬┘├┤ ───└─┐├┤ ├┬┘└┐┌┘││  ├┤ └─┐
└─┘┴ ┴ ┴ └┴┘┴┴└─└─┘   └─┘└─┘┴└─ └┘ ┴└─┘└─┘└─┘
	Skywire services

Available Commands:
  tpd       Transport Discovery Server for skywire
  tps       Transport setup server for skywire
  ar        Address Resolver Server for skywire
  rf        Route Finder Server for skywire
  confbs    Config Bootstrap Server for skywire
  conf      print services-config.json file
  se        skywire environment generator
  ut        Uptime Tracker Server for skywire
  sd        Service discovery server
  sn        Route Setup Node for skywire
  nm        Network monitor for skywire VPN and Visor.
  ip        GeoIP service for skywire
  stun      STUN server for skywire
```

A Skywire deployment consists of these services:

| Service | Command | Default Port | Depends | Purpose |
|---------|---------|-------------|---------|---------|
| DMSG Discovery | `skywire dmsg disc` | 9090 | Redis | Registers DMSG clients and servers |
| DMSG Server | `skywire dmsg server start` | 8081 | — | Relays encrypted DMSG traffic |
| Transport Discovery | `skywire svc tpd` | 9091 | Redis | Tracks transports between visors |
| Address Resolver | `skywire svc ar` | 9093 (TCP), 30178 (UDP) | Redis | Resolves visor addresses for STCPR/SUDPH |
| Route Finder | `skywire svc rf` | 9092 | Redis | Finds routes between visors |
| Service Discovery | `skywire svc sd` | 9098 | Redis | Registers VPN, proxy, and visor services |
| Route Setup Node | `skywire svc sn` | dmsg port 36 | — | Establishes routes via DMSG RPC |
| Config Bootstrap | `skywire svc confbs` | 9082 | — | Provides initial config to new visors |
| Uptime Tracker | `skywire svc ut` | 9096 | Redis, Postgres | Tracks visor online status |
| Network Monitor | `skywire svc nm` | 9080 | — | Monitors health, cleans stale entries |
| GeoIP | `skywire svc ip` | — | — | GeoIP lookups for visor locations |
| STUN | `skywire svc stun` | 3478 | — | NAT traversal for UDP hole punching |
| Transport Setup | `skywire svc tps` | — | — | Sets up transports between visors |

**Required services** for a functional deployment: DMSG Discovery, DMSG Server, Transport Discovery, Address Resolver, Route Finder, Service Discovery, and Route Setup Node. The remaining services add functionality but are not required for basic visor-to-visor communication.

---

## Prerequisites

- **Redis** — required by DMSG Discovery, Transport Discovery, Address Resolver, Service Discovery, and Route Finder
- **PostgreSQL** — required by Uptime Tracker only
- A server with a public IP address

Redis setup is simply installing redis and starting the service (which may now be called `valkey.service`).

---

## Key Generation

All services use the same keypair format. Generate a keypair for each service:

```bash
skywire cli config gen-keys
```

This prints a public key on line 1 and a secret key on line 2. Write to a file for use:

```bash
skywire cli config gen-keys | tee dmsgd-config.json
skywire dmsg disc --sk $(tail -n1 dmsgd-config.json)
```

---

## Step 1: DMSG Layer

The DMSG layer provides the encrypted messaging foundation for all Skywire components.

### DMSG Discovery

The registry where DMSG clients and servers find each other.

```bash
skywire cli config gen-keys > dmsgd-config.json
skywire dmsg disc \
  --addr ":9090" \
  --redis "redis://localhost:6379" \
  --sk $(tail -n1 dmsgd-config.json)
```

### DMSG Server

Relays traffic between DMSG clients. Generate a config first:

```bash
skywire dmsg server config gen -o dmsg-config.json
```

This produces a config like:

```json
{
  "public_key": "02a4072022716ee7fb8205edd4286dc73abe514ff8a7a74c6a27131c6efbe71876",
  "secret_key": "62bcd18c5693ad1d2a24239f7303a84d6afb6966340fc70afe93579987cceb90",
  "discovery": "http://dmsgd.skywire.skycoin.com",
  "public_address": "127.0.0.1:8081",
  "local_address": ":8081",
  "health_endpoint_address": ":8082",
  "log_level": "info",
  "update_interval": 0,
  "max_sessions": 2048
}
```

**Important:** Change `discovery` to your DMSG Discovery URL (e.g., `http://127.0.0.1:9090`). Change `public_address` to your server's public IP. The DMSG server port must be accessible from the internet.

```bash
skywire dmsg server start dmsg-config.json
```

---

## Step 2: Core Services

All services should point their `--dmsg-disc` flag at your DMSG Discovery instance.

### Service Discovery

Where VPN servers, proxies, and public visors register themselves.

```bash
skywire cli config gen-keys > sd-config.json
skywire svc sd \
  --addr ":9098" \
  --redis "redis://localhost:6379" \
  --dmsg-disc "http://127.0.0.1:9090" \
  --sk $(tail -n1 sd-config.json)
```

### Address Resolver

Resolves visor IP addresses for direct connections (STCPR and SUDPH transports). The UDP port must be on a public IP or port-forwarded.

```bash
skywire cli config gen-keys > ar-config.json
skywire svc ar \
  --addr ":9093" \
  --redis "redis://localhost:6379" \
  --dmsg-disc "http://127.0.0.1:9090" \
  --sk $(tail -n1 ar-config.json)
```

### Route Finder

Finds multi-hop routes through the transport graph.

```bash
skywire cli config gen-keys > rf-config.json
skywire svc rf \
  --addr ":9092" \
  --dmsg-disc "http://127.0.0.1:9090" \
  --sk $(tail -n1 rf-config.json)
```

### Transport Discovery

Registers and tracks transports between visors.

```bash
skywire cli config gen-keys | tee tpd-config.json
skywire svc tpd \
  --addr ":9091" \
  --redis "redis://localhost:6379" \
  --dmsg-disc "http://127.0.0.1:9090" \
  --sk $(tail -n1 tpd-config.json)
```

---

## Step 3: Route Setup Node

Establishes routes between visors via DMSG RPC. Requires a JSON config file:

```bash
skywire cli config gen --sn -o sn-config.json
```

Edit `sn-config.json` to point at your deployment's DMSG Discovery and Transport Discovery URLs, then run:

```bash
skywire svc sn sn-config.json
```

Or pipe directly:

```bash
skywire cli config gen --sn | skywire svc sn -i
```

---

## Step 4: Config Bootstrap (Optional but Recommended)

The config bootstrapper serves a JSON file that tells visors where to find all your services. When setting up a custom deployment, create a `config.json` like:

```json
{
  "dmsg_discovery": "http://dmsgd.yourdomain.com",
  "transport_discovery": "http://tpd.yourdomain.com",
  "address_resolver": "http://ar.yourdomain.com",
  "route_finder": "http://rf.yourdomain.com",
  "route_setup_nodes": ["<setup-node-public-key>"],
  "transport_setup": ["<transport-setup-public-key>"],
  "uptime_tracker": "http://ut.yourdomain.com",
  "service_discovery": "http://sd.yourdomain.com",
  "stun_servers": ["your-server:3478"],
  "dns_server": "1.1.1.1"
}
```

Serve it with the config bootstrapper:

```bash
skywire svc confbs \
  --addr ":9082" \
  --domain yourdomain.com \
  --dmsg-disc "http://127.0.0.1:9090"
```

Or simply serve the JSON file with a web server or Caddy's `respond` directive:

```text
conf.yourdomain.com {
    header Content-Type application/json
    respond `{"dmsg_discovery":"http://dmsgd.yourdomain.com","transport_discovery":"http://tpd.yourdomain.com",...}`
}
```

---

## Step 5: Configuring Visors

Generate a visor config pointed at your deployment. The `-xa` flag specifies the config bootstrap endpoint:

```bash
skywire cli config gen -xa conf.yourdomain.com -o skywire-config.json
```

This queries your config bootstrap endpoint and populates the visor config with your deployment's service URLs.

Example output (abbreviated):

```json
{
  "dmsg": {
    "discovery": "http://dmsgd.yourdomain.com",
    "sessions_count": 2
  },
  "transport": {
    "discovery": "http://tpd.yourdomain.com",
    "address_resolver": "http://ar.yourdomain.com"
  },
  "routing": {
    "route_setup_nodes": ["<your-setup-node-pk>"],
    "route_finder": "http://rf.yourdomain.com"
  },
  "launcher": {
    "service_discovery": "http://sd.yourdomain.com"
  }
}
```

Start the visor:

```bash
skywire visor -c skywire-config.json
```

```text
$ go run github.com/skycoin/skywire@develop visor --help
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

---

## Environment Generator

The `skywire svc se` command can generate configs for different deployment scenarios:

```text
$ go run github.com/skycoin/skywire@develop svc se --help
┌─┐┬ ┬   ┌─┐┌┐┌┬  ┬
└─┐│││───├┤ │││└┐┌┘
└─┘└┴┘   └─┘┘└┘ └┘

Available Commands:
  visor       Generate config for skywire-visor
  dmsg        Generate config for dmsg-server
  setup       Generate config for setup node

Flags:
  -d, --docker           Environment with dockerized skywire-services
  -l, --local            Environment with skywire-services on localhost
  -n, --network string   Docker network to use (default "SKYNET")
  -p, --public           Environment with public skywire-services
```

For a local test deployment:

```bash
skywire svc se --local visor -o visor-config.json
```

For Docker:

```bash
skywire svc se --docker visor -o visor-config.json
```

---

## DMSG Connectivity

Services can also be reached over DMSG itself, not just HTTP. A `dmsghttp-config.json` file maps service public keys to their DMSG addresses, allowing visors to connect to the deployment entirely over the DMSG overlay network — useful in regions where HTTP access is restricted.

This is configured automatically with `skywire cli config gen -b` (best protocol based on location) or `skywire cli config gen -d` (DMSG-first).

---

## HTTP Reverse Proxy

For production deployments, put a reverse proxy in front of the services. Example Caddy configuration:

```text
dmsgd.yourdomain.com {
    reverse_proxy http://127.0.0.1:9090
}
ar.yourdomain.com {
    reverse_proxy http://127.0.0.1:9093
}
rf.yourdomain.com {
    reverse_proxy http://127.0.0.1:9092
}
tpd.yourdomain.com {
    reverse_proxy http://127.0.0.1:9091
}
sd.yourdomain.com {
    reverse_proxy http://127.0.0.1:9098
}
```

---

## Verifying Your Deployment

Check service health endpoints:

```bash
curl http://127.0.0.1:9090/health   # DMSG Discovery
curl http://127.0.0.1:9091/health   # Transport Discovery
curl http://127.0.0.1:9093/health   # Address Resolver
curl http://127.0.0.1:9092/health   # Route Finder
curl http://127.0.0.1:9098/health   # Service Discovery
```

Once two visors are connected with a transport, you can use all Skywire applications between them: [VPN](/posts/skywire-v1.3.3/), [SOCKS5 proxy](/posts/skywire-v1.3.3/), Skychat, [Skynet port forwarding](/posts/skynet-port-forwarding/), and [DmsgWeb](/posts/dmsgweb-anonymous-port-forwarding/).

---

## Docker Compose

For a containerized deployment, see the [Docker Compose guide](https://github.com/skycoin/skywire/blob/develop/docs/deployment/DOCKER_DEPLOYMENT.md) and the production [compose.yaml](https://github.com/skycoin/skywire/blob/develop/docs/deployment/compose.yaml). All services use the `skycoin/skywire:test` Docker image containing the unified binary.

Minimum server specs for Docker deployment: 2+ CPU cores, 4 GB RAM (8 GB recommended), 40 GB SSD, public IPv4 with unrestricted UDP.

---

See also: [Skywire: One Binary, Everything You Need](/posts/skywire-unified-binary/) | [DmsgWeb: Anonymous Websites Over DMSG](/posts/dmsgweb-anonymous-port-forwarding/) | [Skynet: TCP Port Forwarding](/posts/skynet-port-forwarding/)
