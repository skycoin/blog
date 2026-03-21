+++
date = "2026-03-21"
tags = ["Guides", "Skywire"]
title = "Guide: Skywire SOCKS5 Proxy — Route Traffic Over the Skywire Network"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire SOCKS5 Proxy

Skywire includes a SOCKS5 proxy (Skysocks) that routes application traffic over the Skywire network. Unlike the [Skywire VPN](/posts/guide-skywire-vpn/) which tunnels all system traffic, the SOCKS5 proxy is per-application — you configure individual applications (browser, curl, etc.) to use the proxy, and only their traffic is routed through Skywire.

This makes it lighter than a full VPN and useful when you want to route specific applications through Skywire while leaving the rest of your traffic on your normal connection.

---

### Prerequisites

Both the proxy server and client require a running Skywire visor.

---

### Running a SOCKS5 Proxy Server

The proxy server (Skysocks) starts automatically by default when running a visor. No additional configuration is needed.

#### Start/Stop at Runtime

You can start, stop, and check the proxy server while the visor is running:

```bash
skywire cli proxy server start
```

```bash
skywire cli proxy server stop
```

```bash
skywire cli proxy server status
```

To restrict access to specific public keys:

```bash
skywire cli proxy server start \
  --whitelist <allowed-pk-1>,<allowed-pk-2>
```

---

### Connecting as a Proxy Client

#### Find Available Proxy Servers

List proxy servers registered in the service discovery:

```bash
skywire cli proxy list
```

Filter by country:

```bash
skywire cli proxy list -c US
```

Show only the count:

```bash
skywire cli proxy list --stats
```

Test proxy servers for connectivity:

```bash
skywire cli proxy test
```

#### Connect to a Proxy Server

```bash
skywire cli proxy start -k <server-public-key>
```

This starts a local SOCKS5 proxy on `127.0.0.1:1080` (default). All traffic sent through this proxy is routed over Skywire to the remote visor, which forwards it to the internet.

To use a different local port:

```bash
skywire cli proxy start -k <server-public-key> -a :9050
```

#### Configure Your Applications

Once the proxy client is running, configure applications to use it:

**Browser (Firefox):** Settings > Network Settings > Manual proxy configuration > SOCKS Host: `127.0.0.1`, Port: `1080`, SOCKS v5. Check **"Proxy DNS when using SOCKS v5"** to route DNS queries through the proxy as well.

**curl:**

```bash
curl --socks5-hostname 127.0.0.1:1080 http://ip.skycoin.com
```

This should return the remote visor's IP address, not yours. The `--socks5-hostname` flag (instead of `--socks5`) sends DNS resolution through the proxy too, preventing DNS leaks. With plain `--socks5`, DNS queries go through your normal resolver and reveal which sites you're visiting.

**Environment variable (for CLI tools):**

```bash
export ALL_PROXY=socks5h://127.0.0.1:1080
```

The `socks5h://` scheme (note the `h`) tells applications to resolve DNS through the proxy. Plain `socks5://` only proxies the connection, not DNS.

#### HTTP Proxy Mode

The proxy client can also run in HTTP proxy mode alongside SOCKS5:

```bash
skywire cli proxy start -k <server-public-key> --http :8080
```

This starts both a SOCKS5 proxy on `:1080` and an HTTP proxy on `:8080`.

#### Check Status

```bash
skywire cli proxy status
```

#### Disconnect

```bash
skywire cli proxy stop
```

#### Client Flags

```text
$ skywire cli proxy start --help
start the proxy client

Flags:
  -a, --addr string   address of proxy for use (default ":1080")
      --http string   address for http proxy
  -k, --pk string     server public key
  -t, --timeout int   timeout for starting proxy
```

---

### VPN vs. SOCKS5 Proxy

| | VPN | SOCKS5 Proxy |
|---|---|---|
| **Scope** | All system traffic | Per-application |
| **Setup** | Creates TUN interface (requires root) | Userspace, no special permissions |
| **Server platform** | Linux only | Any platform |
| **Use case** | Full anonymity for all traffic | Route specific apps through Skywire |
| **Local port** | N/A (system-wide) | `127.0.0.1:1080` (configurable) |
| **CLI** | `skywire cli vpn` | `skywire cli proxy` |

Use the VPN when you want all traffic to go through Skywire. Use the SOCKS5 proxy when you want selective routing or when running on a platform where the VPN server isn't supported.

---

### How It Works

1. The **client** establishes a Skywire route to the **server** visor
2. The client starts a local SOCKS5 server on `127.0.0.1:1080`
3. Applications connect to the local SOCKS5 proxy
4. The client forwards SOCKS5 requests over the encrypted Skywire route to the server
5. The **server** performs the actual network request and returns the response through the same route

All traffic between client and server is encrypted by the Skywire transport layer.

---

```text
$ skywire cli proxy --help
Skysocks client

Available Commands:
  start     start the proxy client
  stop      stop the proxy client
  status    proxy client status
  list      List servers
  test      Test proxy servers from service discovery
  server    Skysocks server (SOCKS5 proxy server)
```

See also: [Skywire VPN](/posts/guide-skywire-vpn/) | [DmsgWeb: Anonymous Websites Over DMSG](/posts/dmsgweb-anonymous-port-forwarding/) | [Skynet Port Forwarding](/posts/skynet-port-forwarding/) | [Skywire: One Binary, Everything You Need](/posts/skywire-unified-binary/)
