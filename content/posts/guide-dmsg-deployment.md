+++
date = "2026-03-18"
tags = ["Guides", "Skywire"]
title = "Guide: DMSG — The Encrypted Overlay Network"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### DMSG: Distributed Messaging System

DMSG is the encrypted overlay network that underpins all of Skywire. Every visor-to-visor connection, every service lookup, every route setup message flows through DMSG. It provides end-to-end encrypted communication between nodes identified by secp256k1 public keys — not IP addresses.

DMSG is also usable on its own, independent of Skywire. You can host websites, forward ports, run SSH sessions, and proxy traffic — all over an encrypted overlay that never exposes your IP.

---

### Architecture

DMSG has three entity types:

| Entity | Role |
|--------|------|
| **Discovery** | Key-value store where clients and servers register by public key. Like DNS, but for public keys |
| **Server** | Relay node that forwards encrypted streams between clients |
| **Client** | End-user node that establishes sessions (to servers) and streams (to other clients through servers) |

**Key concepts:**

- **Session** — a connection between a Client and a Server. Multiplexed, so one session carries many streams
- **Stream** — a connection between two Clients, relayed through a Server. This is the actual data channel
- **Address** — `{public_key}:{port}`, e.g. `02a49bc0...c0:80`. No IP addresses involved
- **Identity** — secp256k1 keypair. All entities are identified by their public key

**How a connection works:**

1. Client A connects to a DMSG Server, establishing a **session**
2. Client B also has a session to the same (or any) DMSG Server
3. Client A looks up Client B in DMSG Discovery to find which servers B is connected to
4. Client A opens a **stream** to Client B through the server, specifying B's public key and port
5. The server relays encrypted frames between A and B

All traffic is encrypted using the **Noise protocol** with secp256k1 keys and ChaCha20-Poly1305. The DMSG Server relays ciphertext — it cannot read the contents.

---

### DMSG Commands

All DMSG tools are included in the [unified Skywire binary](/posts/skywire-unified-binary/):

```
$ go run github.com/skycoin/skywire@develop dmsg

Available Commands:
  server      DMSG Server
  disc        DMSG Discovery
  web         DmsgWeb
  curl        dmsgcurl
  http        dmsghttp
  pty         dmsgpty
  socks       DMSG socks5 proxy
  ip          dmsgip
  conf        deployment server config
```

---

### Deploying DMSG Discovery

DMSG Discovery is the registry. Clients and servers register here so they can find each other.

**Requirements:** Redis

```
$ skywire cli config gen-keys > dmsgd-keys.json
$ skywire dmsg disc \
    --addr ":9090" \
    --redis "redis://localhost:6379" \
    --sk $(tail -n1 dmsgd-keys.json)
```

**Flags:**

| Flag | Description | Default |
|------|-------------|---------|
| `-p, --port` | HTTP listen address | — |
| `-u, --redisurl` | Redis URL | `redis://localhost:6379` |
| `-w, --whitelist` | Comma-separated whitelist of public keys | — |
| `-t, --testmode` | Enable test mode | `false` |
| `--auth` | Auth passphrase for official server registration | — |

**API Endpoints:**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/dmsg-discovery/entry/{pk}` | GET | Look up a single entry by public key |
| `/dmsg-discovery/entries` | POST | Register or update an entry (requires signature) |
| `/dmsg-discovery/available_servers` | GET | List available DMSG servers (up to 512) |
| `/dmsg-discovery/all_servers` | GET | List all registered servers |
| `/health` | GET | Health check |

**Entry Structure:**

Each registered entity has a signed entry:

```json
{
  "version": "0.0.1",
  "sequence": 1,
  "timestamp": 1711987200,
  "static": "<public_key>",
  "client": {
    "delegated_servers": ["<server_pk_1>", "<server_pk_2>"]
  },
  "server": {
    "address": "203.0.113.50:8081",
    "available_connections": 1024
  },
  "signature": "<secp256k1_signature>"
}
```

Client entries list their delegated servers (the DMSG servers they're connected to). Server entries include their public address and available connection slots. Every entry is signed with the entity's secret key — entries cannot be forged.

---

### Deploying DMSG Servers

DMSG Servers relay streams between clients. You need at least one for a functional deployment.

#### Generate Config

```
$ skywire dmsg server config gen -o dmsg-server.json
```

This produces:

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

**Important:** Edit the config before starting:
- `discovery` — point to your DMSG Discovery instance (e.g., `http://127.0.0.1:9090`)
- `public_address` — your server's public IP and port (must be reachable from the internet)
- `max_sessions` — maximum concurrent client sessions

#### Start Server

```
$ skywire dmsg server start dmsg-server.json
```

The server will:
1. Register itself with DMSG Discovery
2. Listen for incoming client connections on `local_address`
3. Multiplex streams over each session using yamux/smux
4. Update Discovery when session count changes
5. Serve health checks on `health_endpoint_address`

```
$ curl http://127.0.0.1:8082/health
```

```json
{
  "build_info": {
    "version": "v1.3.34",
    "date": "2026-03-18T00:00:00Z"
  },
  "started_at": "2026-03-18T12:00:00Z"
}
```

---

### Encryption: The Noise Protocol

All DMSG communication is encrypted using the [Noise Protocol Framework](http://noiseprotocol.org/):

- **Curve:** secp256k1 (same as Bitcoin/Skycoin)
- **Cipher:** ChaCha20-Poly1305 (AEAD)
- **Hash:** SHA-256
- **Pattern:** KK (both sides know each other's static public key)

The handshake is embedded in the stream request/response. After handshake, each direction has its own cipher state with incrementing nonces. The DMSG Server sees only ciphertext — it relays frames without being able to decrypt them.

---

### DMSG Utilities

#### dmsgcurl — Fetch URLs Over DMSG

Like `curl`, but addresses are DMSG public keys instead of hostnames:

```
$ skywire dmsg curl dmsg://<pk>:80/index.html
```

```
$ go run github.com/skycoin/skywire@develop dmsg curl --help

Flags:
  -s, --sk cipher.SecKey   a]  Secret key
  -l, --loglvl string      Log level (debug|warn|error|fatal|panic|trace|info)
  -d, --data string        POST data
  -o, --out string         Output file
  -a, --agent string       User agent string
  -t, --try int            Download attempts (0=unlimited, default 1)
  -w, --wait int           Seconds between attempts
  -r, --replace            Replace existing output file
```

#### dmsgpty — Remote Shell Over DMSG

SSH-like access to remote machines, encrypted over DMSG:

**Host** (the machine you want to access):

```
$ skywire dmsg pty host --dmsgdisc http://127.0.0.1:9090 --sk <secret_key>
```

**Client** (connect to the host):

```
$ skywire dmsg pty cli --addr <host_pk>:22
```

Host configuration:

| Flag | Description | Default |
|------|-------------|---------|
| `--dmsgdisc` | DMSG Discovery URL | production URL |
| `--dmsgport` | DMSG listen port | `22` |
| `--dmsgsessions` | Minimum DMSG sessions | `1` |
| `--sk` | Secret key | — |
| `--wl` | Whitelist of allowed public keys | — (all allowed) |
| `--cliaddr` | Local socket address | `/tmp/dmsgpty.sock` |

The whitelist (`--wl`) restricts which public keys can open a shell. Without it, anyone who knows your public key can connect.

#### dmsghttp — Serve HTTP Over DMSG

Host a web server accessible only via DMSG:

```
$ skywire dmsg http
```

Your site is reachable at `dmsg://<your_pk>:80/` — no IP address, no DNS, no port forwarding needed.

#### DmsgWeb — Browse DMSG Sites Locally

[DmsgWeb](/posts/dmsgweb-anonymous-port-forwarding/) acts as a local proxy that resolves `.dmsg` domains to DMSG addresses:

```
$ skywire dmsg web -p 8080
```

Then browse to `http://<pk>.dmsg:8080/` in your browser. DmsgWeb:
- Runs a local SOCKS5 proxy (default port 4445)
- Intercepts DNS for `.dmsg` suffix domains
- Routes requests through the DMSG network to the target public key
- Supports raw TCP mode for non-HTTP protocols

**Direct resolve mode** — map a specific DMSG address to a local port:

```
$ skywire dmsg web -p 8080 -t dmsg://<pk>:80
```

```
$ go run github.com/skycoin/skywire@develop dmsg web --help

Flags:
  -p, --port uints          Local HTTP port(s) (default [8080])
  -D, --dmsg-disc string    DMSG discovery URL
  -s, --sk cipher.SecKey    Secret key
  -e, --sess int            Min DMSG sessions (default 1)
  -q, --socks uint          SOCKS5 proxy port (default 4445)
  -f, --filter string       Domain suffix filter (default ".dmsg")
  -t, --resolve strings     Direct resolve: dmsg://{pk}:{port}
  -c, --rt bools            Raw TCP mode (default [false])
  -r, --addproxy string     Additional SOCKS5 proxy
```

**DmsgWeb server mode** — expose a local app over DMSG:

```
$ skywire dmsg web srv -p 8086 -d 80
```

This makes your local port 8086 available at `dmsg://<your_pk>:80/`.

#### DMSG SOCKS5 Proxy

Run a SOCKS5 proxy that tunnels all traffic over DMSG:

**Server:**

```
$ skywire dmsg socks server -D http://127.0.0.1:9090 -q 1080
```

**Client:**

```
$ skywire dmsg socks client -D http://127.0.0.1:9090 -k <server_pk> -q 1080 -p 1081
```

Point your browser's SOCKS5 settings to `localhost:1081` and all traffic routes through the DMSG server.

---

### DMSG in the Skywire Stack

DMSG is not just a standalone tool — it's the foundation of Skywire's transport layer.

**Transport types that use DMSG:**
- `dmsg` transport type — visor-to-visor connections relayed through DMSG servers
- All Skywire services can be reached over DMSG (not just HTTP)
- Route Setup Nodes communicate entirely over DMSG RPC

**dmsghttp-config.json:**

Services can be reached over DMSG addresses instead of HTTP URLs. This is configured in the deployment's `dmsghttp-config.json`:

```json
{
  "dmsg_discovery": "dmsg://022e607e0914d6e7ccda7587f95790c09e126bbd506cc476a1eda852325aadd1aa:80",
  "transport_discovery": "dmsg://02b307aee5c8ce1666c63891f8af25ad2f0a47a243914c963942b3ba35b9d095ae:80",
  "address_resolver": "dmsg://03234b2ee4128d1f78c180d06911102906c80795dfe41bd6253f2619c8b6252a02:80",
  "route_finder": "dmsg://039d89c5eedfda4a28b0c58b0b643eff949f08e4f68c8357278081d26f5a592d74:80",
  "service_discovery": "dmsg://0204890f9def4f9a5448c2e824c6a4afc85fd1f877322320898fafdf407cc6fef7:80"
}
```

This allows visors to connect to the entire Skywire infrastructure over the DMSG overlay — useful in regions where HTTP access to Skywire services is restricted.

Configure a visor to prefer DMSG:

```
$ skywire cli config gen -d    # DMSG-first for all services
$ skywire cli config gen -a    # Best protocol based on location
```

---

### Deploying a Complete DMSG Network

For a private DMSG deployment (or to understand the production network):

#### 1. Start Redis

```
$ redis-server
```

#### 2. Start DMSG Discovery

```
$ skywire cli config gen-keys > dmsgd-keys.json
$ skywire dmsg disc --addr ":9090" --redis "redis://localhost:6379" --sk $(tail -n1 dmsgd-keys.json)
```

#### 3. Generate and Start DMSG Server

```
$ skywire dmsg server config gen -o dmsg-server.json
```

Edit `dmsg-server.json`:
- Set `discovery` to `http://127.0.0.1:9090`
- Set `public_address` to your server's public IP and port

```
$ skywire dmsg server start dmsg-server.json
```

#### 4. Verify

```
$ curl http://127.0.0.1:9090/dmsg-discovery/available_servers
```

Should return your server's entry.

#### 5. Connect Clients

Any DMSG utility can now connect using your discovery:

```
$ skywire dmsg pty host --dmsgdisc http://127.0.0.1:9090
$ skywire dmsg curl -D http://127.0.0.1:9090 dmsg://<pk>:80/
$ skywire dmsg web -D http://127.0.0.1:9090
```

For a full Skywire deployment on top of DMSG, see the [Skywire deployment guide](/posts/guide-deploying-skywire-network/).

---

### Production Deployment

For a production DMSG network:

**Multiple DMSG Servers** — deploy several for redundancy and geographic distribution. Each server registers independently with Discovery. Clients automatically select servers based on availability.

**Reverse proxy** (Caddy):

```
dmsgd.yourdomain.com {
    reverse_proxy http://127.0.0.1:9090
}
```

The DMSG server port (default 8081) must be directly accessible — it uses raw TCP, not HTTP, so it cannot be behind a reverse proxy. Only the Discovery and health endpoints are HTTP.

**Monitoring:**

```
$ curl http://127.0.0.1:9090/health              # Discovery health
$ curl http://127.0.0.1:8082/health              # Server health
$ curl http://127.0.0.1:9090/dmsg-discovery/all_servers  # All registered servers
```

---

### Key Differences from Traditional Networking

| Traditional | DMSG |
|-------------|------|
| IP addresses | secp256k1 public keys |
| DNS hostnames | Public key lookup in Discovery |
| TLS certificates | Noise protocol with static keys |
| Port forwarding | Not needed — servers relay traffic |
| ISP visibility | Encrypted overlay, ISP sees only relay connections |

DMSG doesn't replace the internet — it runs on top of it. But it replaces IP-based addressing with cryptographic identity, and wraps all traffic in end-to-end encryption that even relay servers can't decrypt.

---

See also: [DmsgWeb: Anonymous Websites Over DMSG](/posts/dmsgweb-anonymous-port-forwarding/) | [Deploying Your Own Skywire Network](/posts/guide-deploying-skywire-network/) | [Skywire: One Binary, Everything You Need](/posts/skywire-unified-binary/) | [Skynet: TCP Port Forwarding](/posts/skynet-port-forwarding/)
