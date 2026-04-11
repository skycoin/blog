+++
date = "2026-04-10"
tags = ["Skywire", "DMSG"]
title = "DMSG-First, HTTP Fallback: The Default Is Now the Encrypted Overlay"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### The Default Changed, Quietly

For most of Skywire's history, the visor talked to the network's infrastructure services — Transport Discovery, Service Discovery, Address Resolver, Route Finder, Uptime Tracker, and the config bootstrapper — over plain HTTP. You could configure DMSG-HTTP transport instead, but it was opt-in, and relatively few visors used it. The majority of traffic between visors and services flowed over HTTPS on the public internet.

With the dual-endpoint `services-config.json` that landed over the past two weeks, **that default has flipped**. Every visor is now configured with both DMSG and HTTP endpoints for every service, and the visor tries DMSG first. HTTP requests happen only when DMSG is unavailable — as a fallback, not as the primary path. For operators who don't change anything, the practical effect is that service requests stop leaving the encrypted overlay entirely.

This article describes what changed, why it matters, and why it took as much engineering work as it did.

---

### The Old Architecture

The Skywire visor needs to talk to seven infrastructure services on startup and periodically afterward:

| Service | Purpose |
|---------|---------|
| **DMSG Discovery (DMSGD)** | Looks up DMSG clients by public key to find their delegated servers |
| **Transport Discovery (TPD)** | Registers visor transports, serves transport metrics |
| **Service Discovery (SD)** | Lists available VPN servers, SOCKS5 proxies, public visors |
| **Address Resolver (AR)** | Resolves STCPR/SUDPH peer addresses for hole-punching |
| **Route Finder (RF)** | Computes multi-hop routes through the network |
| **Uptime Tracker (UT)** | Records visor uptime for reward eligibility |
| **Config Bootstrapper** | Serves the deployment's `services-config.json` |

In the old design, each of these had a single HTTP URL in the visor's config file. The visor was happy to use DMSG transports for peer-to-peer visor communication (VPN tunnels, proxy connections, Skynet port forwarding), but for the infrastructure services themselves, it dialed HTTPS endpoints like `https://tpd.skywire.skycoin.com` directly.

This had a few problems:

- **ISP visibility.** Your ISP could see that you were talking to `tpd.skywire.skycoin.com` even if it couldn't read the TLS-encrypted contents. Pattern analysis of Skywire-related hostnames was trivial.
- **Geographic censorship.** Any country wanting to block Skywire could block the infrastructure service hostnames. Without those services, visors couldn't register transports, find peers, or compute routes.
- **Single-protocol failure modes.** If an HTTP service was down, the visor had no fallback. The services were reachable only one way.
- **Inconsistency with Skywire's own design.** Skywire sells itself as an overlay network that wraps all communication in encrypted peer-to-peer routing. But the visor itself was relying on the public HTTP internet to do basic startup tasks.

A DMSG-HTTP transport existed — it lets HTTP requests travel over DMSG streams instead of TCP — and the `dmsghttp-config.json` file mapped service URLs to DMSG public keys for visors that wanted to use it. But this was a separate, opt-in configuration. Most visors didn't use it.

---

### Unified Deployment Config

The first step was merging `dmsghttp-config.json` into `services-config.json` (PR #2277 on April 4). Instead of two separate configs — one for HTTP service URLs, one for the DMSG key mapping — there's now a single config with both HTTP and DMSG addresses for each service, using `_dmsg` suffixed field names:

```json
{
  "prod": {
    "transport_discovery": "https://tpd.skywire.skycoin.com",
    "transport_discovery_dmsg": "dmsg://02b307aee5c8ce1666c63891f8af25ad2f0a47a243914c963942b3ba35b9d095ae:80",
    "address_resolver": "https://ar.skywire.skycoin.com",
    "address_resolver_dmsg": "dmsg://03234b2ee4128d1f78c180d06911102906c80795dfe41bd6253f2619c8b6252a02:80",
    "route_finder": "https://rf.skywire.skycoin.com",
    "route_finder_dmsg": "dmsg://039d89c5eedfda4a28b0c58b0b643eff949f08e4f68c8357278081d26f5a592d74:80",
    "service_discovery": "https://sd.skywire.skycoin.com",
    "service_discovery_dmsg": "dmsg://0204890f9def4f9a5448c2e824c6a4afc85fd1f877322320898fafdf407cc6fef7:80",
    "uptime_tracker": "https://ut.skywire.skycoin.com",
    "uptime_tracker_dmsg": "dmsg://0238c0f0e55f1de6f85b0d4c6fc24a5fe9ed3b8f86e0a5f4bc1e7b7a5f4d97e0a5:80",
    "dmsg_discovery": "http://dmsgd.skywire.skycoin.com",
    "dmsg_discovery_dmsg": "dmsg://022e607e0914d6e7ccda7587f95790c09e126bbd506cc476a1eda852325aadd1aa:80",
    "conf": "https://conf.skywire.skycoin.com",
    "conf_dmsg": "dmsg://<config-bootstrapper-pk>:80",
    "dmsg_servers": [...]
  }
}
```

Both HTTP and DMSG addresses ship in the same config file, embedded in the Skywire binary. The visor now has a complete picture of how to reach every service over either transport at startup.

The `conf_dmsg` field is particularly important: it means the config bootstrapper itself can be reached over DMSG, so a visor can refresh its deployment config without making any HTTP request at all.

---

### The Visor Init Flow

With dual endpoints available, the visor's service initialization changed. On startup:

1. **Load embedded deployment config.** The visor starts with the full HTTP+DMSG service addresses from its embedded `services-config.json` or from `SKYDEPLOY` (for custom deployments). No network needed for this step — the embedded config includes the `dmsg_servers` list with public keys and TCP addresses.

2. **Start a DMSG direct client.** Using the embedded `dmsg_servers` list, the visor establishes DMSG sessions with production DMSG servers. No DMSG Discovery lookup is needed because the direct client knows exactly which servers to connect to from the static config.

3. **`initDmsgHTTP`** — wraps the direct client in an HTTP transport to produce a DMSG-HTTP client. Once this completes, any HTTP-semantics request (discovery lookup, service API call, config fetch) can be routed over DMSG sessions instead of plain TCP+TLS. The standard dmsg.Client used for peer-to-peer communication is also instantiated with this DMSG-HTTP client for its Discovery interactions — so even DMSG Discovery lookups go over DMSG.

4. **Initialize services.** For each of the infrastructure services, the visor resolves the URL via `getHTTPClient`. If the URL is a `dmsg://` address (which it is by default for every service), the request goes through the DMSG-HTTP client over DMSG sessions. If the URL is HTTPS or the DMSG-HTTP client isn't ready yet, the request goes over plain HTTP as a fallback.

The key piece is step 4 — the visor prefers the DMSG URL, and only falls back to HTTP if the DMSG-HTTP client isn't available. For a visor with a working DMSG connection (which is every visor on a properly-configured network), this means **every infrastructure request goes over DMSG**, including the DMSG Discovery queries that are needed to find other visors for peer-to-peer communication.

### Config Bootstrapper: DMSG First

Config gen — the process of generating a `skywire-config.json` for a new visor — also uses the DMSG-first approach. When you run `skywire cli config gen`, the new flow is:

1. **Try DMSG.** Bootstrap an ephemeral DMSG client from the embedded server list. Connect to the config bootstrapper at its `dmsg://` address. Fetch the latest config.
2. **Fall back to HTTP.** If DMSG fails (no network, no DMSG servers reachable, etc.), use the HTTPS URL instead.
3. **Fall back to embedded.** If neither DMSG nor HTTP works, use the embedded `services-config.json` that shipped with the binary.

A fresh install on a machine that has never run Skywire before can now get its configuration entirely over the encrypted overlay. The HTTPS endpoint is there as a safety net, not as the expected path.

The **supplement missing DMSG fields** fix is important here: if a visor fetches its config from a bootstrapper that hasn't been updated to serve `_dmsg` fields, the visor fills in the missing DMSG URLs from its embedded config. This ensures forward compatibility — new visors work correctly even when talking to older bootstrappers.

---

### Why It Took a Month

The core idea — add DMSG URLs as an alternative, prefer them — is conceptually simple. The implementation took most of a month because the dual-endpoint mode exposed a bunch of issues that only mattered when both transports were active simultaneously.

**initDmsgHTTP blocking the visor startup.** The first attempt made DMSG-HTTP initialization synchronous during visor startup. If DMSG servers were slow to respond, the visor's launcher and transport modules waited for DMSG to come up before initializing. On slow networks this pushed startup time from 10 seconds to 60+ seconds.

The fix attempt: make `initDmsgHTTP` non-blocking. Start the DMSG connection in a goroutine, let downstream modules fall back to HTTP if DMSG isn't ready yet. This worked for startup time but introduced a new problem: the Address Resolver would hammer DMSG connection attempts before the DMSG sessions were fully ready, **exhausting ephemeral ports** on the visor host. Revert.

Second attempt: make `initDmsgHTTP` fail non-fatally. If DMSG HTTP can't connect (e.g., DMSG server not ready), the visor continues with HTTP-only mode instead of crashing. Added a 30-second timeout so if `direct.StartDmsg` blocks indefinitely, the visor doesn't hang.

Third attempt: `initDmsgHTTP` is non-blocking again, but `getHTTPClient` is nil-safe. For `dmsg://` URLs when `v.dmsgHTTP` is still initializing, `getHTTPClient` returns an error that causes callers to fall back to the HTTP URL gracefully. Once DMSG connects, subsequent requests use DMSG transport.

This final shape is what's running now: visor startup isn't blocked by DMSG connection establishment, services fall back to HTTP during the startup window when DMSG isn't ready yet, and once DMSG is ready, every service request goes over the overlay.

**HTTP response body leaks.** The dual-endpoint work exposed three HTTP response body leaks that had been latent in the codebase:

- `ip.go:getStunServers` never closed `resp.Body`
- `log.go:downloadDmsg` leaked the body on non-200 status and size errors
- `init_services.go` HTTP proxy handler never closed `resp.Body` after writing

These didn't matter much in the HTTP-only world because the Go garbage collector would eventually reclaim the bodies. They mattered a lot in the DMSG-HTTP world because leaked bodies held DMSG streams open, which held ephemeral ports, which exhausted the port range. Fixed all three.

**DMSG-only deployment support.** With dual endpoints, a natural extension is "deployments that only have DMSG URLs." The config gen validation, visor initialization (initDmsg, initAddressResolver, initTransportDiscovery), and service clients were all updated to accept empty HTTP URLs when DMSG URLs are present. This enables fully HTTP-less deployments for environments that don't want to expose any HTTP endpoints at all.

**Address Resolver URL resolution fix.** When DMSG-HTTP was selected for the address resolver, the AR client was still using the HTTP URL from config (`conf.AddressResolver`) instead of the resolved `arURL` (which may be a `dmsg://` URL). This caused the DMSG transport to reject the hostname as an invalid public key. Fixed to pass the resolved URL through to the client.

**Silencing DMSG client logs in stdout mode.** When the visor CLI is used in stdout mode (e.g., scripting `skywire cli config gen` into a shell pipeline), DMSG client debug logs were polluting the JSON output. Fixed to route DMSG client logs to stderr or suppress them entirely in stdout mode.

---

### What You Get

For an operator running a visor on the public Skywire network, the change is transparent. You didn't have to do anything. Your visor automatically uses the new dual-endpoint config, prefers DMSG for service requests, and only falls back to HTTP in edge cases.

What you get in exchange:

- **No HTTP requests on the wire by default.** Your visor's traffic to the Skywire infrastructure services is indistinguishable from any other DMSG traffic. Your ISP sees encrypted DMSG traffic, not `tpd.skywire.skycoin.com` or `ar.skywire.skycoin.com`.
- **Resilience to hostname blocking.** If a country blocks `*.skywire.skycoin.com`, your visor continues working over DMSG because the DMSG endpoint isn't a hostname at all — it's a public key that's reached through whatever DMSG server you're connected to.
- **Metadata privacy.** The public keys of the services are known (they're in everyone's embedded config), but the pattern of which visor talks to which service at which time is no longer visible to network observers. All that's visible is that a visor is exchanging DMSG traffic with a DMSG server.
- **Consistency with Skywire's own design.** The visor now practices what it preaches: the infrastructure services that the visor needs are reached through the same encrypted overlay that the visor provides for applications.

For operators running private Skywire deployments, the benefit is more concrete: you can now run a deployment with **no HTTP endpoints at all** if you want to. Set DMSG URLs and leave the HTTP URLs empty, configure your visors with `SKYDEPLOY`, and the entire deployment runs over DMSG from end to end. No HTTPS certificates to manage, no public HTTP endpoints to expose, no DNS to configure. Just a DMSG server, the services running their DMSG listeners, and visors that talk to them over DMSG.

---

### Three Kinds of DMSG Client

To understand how the visor can talk to every service — including the DMSG discovery itself — without making plain HTTP requests, it helps to distinguish between three different DMSG client types that appear in the codebase. They sound similar but play different roles.

**1. DMSG direct client** (`direct.NewClient`) — does not use the DMSG Discovery at all. It's configured with a static list of DMSG server entries (public key + TCP address) and establishes sessions directly with those servers. Because there's no discovery lookup, a direct client can only reach other clients that it already knows about — either passed in at construction time or added via a local API. Skywire **services** use direct clients exclusively: they know each other's public keys from the deployment config, so they don't need a discovery service to find each other. Services never make discovery requests.

**2. DMSG client** (`dmsg.NewClient`) — the standard peer-to-peer DMSG client. It uses the DMSG Discovery to look up other clients by public key. By default, the HTTP client it uses for Discovery lookups is a plain `http.Client`, so **discovery requests go over plain HTTP**. In a traditional Skywire deployment, this is where HTTP traffic to `dmsgd.skywire.skycoin.com` came from — every time a visor needed to find another visor's delegated server list, it made an HTTPS request to the Discovery.

**3. DMSG-HTTP client** — a standard DMSG client configured with a custom `http.Client` whose transport is backed by a **DMSG direct client**. The chain is: visor → dmsg.Client → (http.Client → dmsgHTTPTransport → direct.Client) → DMSG Discovery's DMSG address. Discovery lookups from a DMSG-HTTP client travel over DMSG sessions to the DMSG Discovery server's DMSG endpoint (the discovery server listens on DMSG as well as HTTP). There are **zero plain HTTP requests** in this path — the "HTTP" in DMSG-HTTP refers to the HTTP semantics of the discovery API, not the transport layer.

The direct client needs a static DMSG server list to bootstrap. The dmsg_servers list in the embedded `services-config.json` provides exactly this: every Skywire binary ships with the addresses and public keys of several production DMSG servers, so a fresh install can establish DMSG sessions immediately without asking any discovery service where the servers are. From those sessions, the direct client can reach the DMSG Discovery's DMSG endpoint and look up other clients. From there, the regular DMSG client takes over.

The visor now uses a DMSG-HTTP client by default for its DMSG Discovery interactions. **Discovery requests are DMSG traffic, not HTTPS traffic.** Your ISP doesn't see `dmsgd.skywire.skycoin.com` in your traffic — it sees encrypted DMSG traffic to one of the DMSG servers, and that traffic happens to be carrying HTTP-semantics discovery queries to the Discovery server's DMSG listener.

Fetching fresh deployment configs from `conf.skywire.skycoin.com` follows the same pattern. The config bootstrapper has a DMSG address listed as `conf_dmsg` in the embedded config. A visor running `skywire cli config gen` uses a DMSG-HTTP client (bootstrapped from the embedded direct client's DMSG server list) to reach the config bootstrapper over DMSG, fetches a fresh deployment config, and never issues an HTTPS request to `conf.skywire.skycoin.com` unless DMSG fails entirely.

### What's Still HTTP

Given that DMSG-HTTP clients eliminate HTTP requests to DMSG Discovery and every infrastructure service, what's left that actually uses plain HTTP?

- **External data sources** — GeoIP lookups, public STUN servers, hardware survey IP detection, version checks. These go to third-party services (not Skywire infrastructure) that don't have DMSG endpoints, so they necessarily use HTTP. This is a small amount of traffic at startup and periodically afterward.
- **The hypervisor UI** — your browser talks to the local hypervisor over HTTP (or HTTPS). That's a local connection, not a request to a public service, so it doesn't have the same exposure concerns.
- **Fallback paths** — when DMSG isn't available (e.g., every DMSG server in the bootstrap list is unreachable due to a network partition), services fall back to HTTP. This is genuinely rare in practice, but the fallback keeps the visor functional when DMSG has problems.

The goal isn't zero HTTP — it's "HTTP only for third-party services or when DMSG is completely unavailable."

---

### Where Things Stand

The dual-endpoint `services-config.json` is embedded in the latest Skywire builds. The DMSG-first service initialization is active. Visors on the public network that update to a recent build automatically get the new behavior with no configuration changes.

Monitoring shows the expected shift: inbound HTTP request rates on `tpd.skywire.skycoin.com` and the other service endpoints have dropped noticeably as visors migrate to the DMSG-first path. The services are seeing more DMSG connections and fewer HTTP connections. The overall request volume is similar — it's just traveling over a different protocol.

For private deployments, the `SKYDEPLOY` override (added April 3) combined with the dual-endpoint config gives operators the flexibility to run deployments with whatever mix of HTTP and DMSG endpoints they prefer. The reference deployment now has full DMSG coverage for every service, and that's the pattern operators should copy for their own deployments.

The broader implication: Skywire is now more honestly an "encrypted overlay network." The visor's own operational traffic runs on the same overlay it provides to applications. The public HTTP endpoints continue to exist as a fallback, but they're not where the traffic goes anymore. Everyone is on the same playing field — DMSG-first, HTTP only when nothing else works.

See also: [Guide: DMSG — The Encrypted Overlay Network](/posts/guide-dmsg-deployment/) | [DMSG Server Mesh and DMSG Server-Hosted Route Setup](/posts/dmsg-server-mesh-and-route-setup/) | [The Great DMSG Bug Hunt](/posts/the-great-dmsg-bug-hunt/) | [Dev Update — April 3](/posts/dev-update-2026-04-03/)
