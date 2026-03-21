+++
date = "2026-03-18"
tags = ["Announcements", "Skywire"]
title = "Skywire Rewards: Transitioning to Bandwidth-Based Rewards"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Transitioning to Bandwidth-Based Rewards

The Skywire reward system is being updated to incentivize actual network usage. Alongside this change, the Transport Discovery (TPD) now aggregates per-transport and per-visor bandwidth and latency metrics — the data infrastructure that makes bandwidth-based rewards possible.

---

### Reward Pool Changes

#### Current System

Today there are two reward pools split by visor architecture. Both use the same eligibility requirements based on uptime and transport count.

#### New System

The two architecture-based pools are being replaced with two purpose-based pools:

**Pool 1 — Uptime (same as current)**
- The two current architecture pools merge into a single pool
- Same total rewards as one of the current pools
- Same eligibility requirements as today (uptime, minimum transports, etc.)

**Pool 2 — Bandwidth (new)**
- Replaces the current second architecture pool
- Rewards based on your visor's **relative share of total network bandwidth**
- **Requires that your visor qualified for Pool 1** — bandwidth rewards are only for visors that are already meeting the uptime requirements

#### How Bandwidth Rewards Work

We are not rewarding bandwidth directly or proportionately. We are rewarding based on your visor's relative share of the total network bandwidth — which you can increase by actually consuming bandwidth over Skywire.

For example: if the network moves 100 GB in a day and your visor contributed 10 GB, your share of the bandwidth pool is 10%. Traffic over STCPR and SUDPH transports counts — VPN, SOCKS5 proxy, [Skynet port forwarding](/posts/skynet-port-forwarding/), or any other Skywire application using direct transports. DMSG transport bandwidth is not counted.

#### Same-LAN Exception

Bandwidth between visors on the same LAN — or visors that share the same public IP address — is **not counted** for bandwidth-based rewards. This prevents gaming the system by routing traffic between your own local machines.

| | Pool 1 (Uptime) | Pool 2 (Bandwidth) |
|---|---|---|
| **Basis** | Uptime + transports | Relative bandwidth share |
| **Eligibility** | Same as current | Must qualify for Pool 1 |
| **Replaces** | Both current architecture pools (merged) | Current second architecture pool |
| **How to earn more** | Keep your visor online | Use bandwidth over Skywire |

---

### Bandwidth and Latency Metrics in the Transport Discovery

The Transport Discovery (TPD) now collects, aggregates, and serves per-transport and per-visor bandwidth and latency data. This is the infrastructure that enables bandwidth-based rewards and provides network-wide visibility into transport quality.

#### How Data Is Collected

**Bandwidth** is measured at the transport level. Every packet read or written through a managed transport increments atomic byte counters on the visor. Each transport tracks cumulative `sent_bytes` and `recv_bytes` independently.

**Latency** is measured when a transport is first created. The visor sends a ping/pong over the new transport and records the round-trip time. Latency stats (min, max, average in microseconds) are stored per transport.

#### How Visors Report to TPD

Every **90 seconds**, each visor re-registers all of its active transports with the TPD. Each registration includes:

- The transport entry (edges, type, transport ID)
- **Bandwidth data** — cumulative sent and received bytes
- **Latency data** — min, max, and average RTT in microseconds
- **Version** — the visor's software version

The TPD computes deltas from the previous report to derive per-interval bandwidth. If counters reset (e.g., visor restart), the full current value is used.

#### How TPD Aggregates Data

On each transport registration, the TPD:

1. **Calculates bandwidth deltas** — compares current cumulative bytes against the previous snapshot (stored in Redis with a 10-minute TTL)
2. **Aggregates per-transport daily** — increments the daily bandwidth total for that transport ID, keyed by date (retained for 35 days)
3. **Aggregates per-visor daily** — increments the daily bandwidth total for each visor public key involved in the transport (retained for 35 days)
4. **Stores latency** — min/max/avg in microseconds, recorded directly in the transport record

An hourly background task backs up bandwidth data older than 8 days to per-visor text files and cleans the Redis keys.

#### TPD Metrics API

The TPD exposes several endpoints for querying bandwidth and latency data:

**Per-transport metrics:**

```text
GET /metrics                          All transports
GET /metrics/{ids}                    Specific transports (comma-separated UUIDs)
GET /metrics/visor/{pks}              Transports for specific visors (comma-separated PKs)
```

**Per-visor aggregate metrics:**

```text
GET /metric/visor/{pks}               Aggregated metrics for specific visors
```

**Network-wide aggregate:**

```text
GET /metric                           Network-wide daily + cumulative totals by transport type
```

**Legacy bandwidth endpoints:**

```text
GET /bandwidth/transport/{id}         Daily bandwidth history for a transport
GET /bandwidth/visor/{pk}             Aggregated bandwidth for all of a visor's transports
```

**Common query parameters:**

| Parameter | Description | Default |
|-----------|-------------|---------|
| `days` | Number of days of history (0 = all, max 35) | — |
| `type` | Filter by transport type: `stcpr`, `sudph`, `dmsg`, `stcp` | all |
| `live` | Filter by liveness: `true`, `false`, `all` | — |
| `bandwidth` | Include bandwidth data | `true` |
| `latency` | Include latency data | `true` |
| `edges` | Include visor public keys | `false` |

#### Data Model

Each transport record carries:

```json
{
  "entry": {
    "edges": ["<visor_pk_a>", "<visor_pk_b>"],
    "t_id": "<transport_uuid>",
    "type": "stcpr"
  },
  "bandwidth": {
    "sent_bytes": 1073741824,
    "recv_bytes": 2147483648
  },
  "latency": {
    "min": 12000,
    "max": 45000,
    "avg": 28500
  }
}
```

Latency values are in **microseconds**. Bandwidth values are **cumulative bytes** from the visor's perspective; the TPD computes daily deltas internally.

The per-visor daily aggregate (`/metric/visor/{pk}`) returns daily and cumulative totals:

```json
{
  "sent_bytes": 5368709120,
  "recv_bytes": 10737418240
}
```

#### How This Feeds Into Rewards

The reward system's bandwidth collection process:

1. Fetches `GET /metrics?days=1&bandwidth=true&latency=false&edges=true` from the TPD
2. Builds a public-key-to-IP map from hardware surveys to detect same-LAN visors
3. **Excludes** transports where both edges share the same external IP
4. Aggregates daily bandwidth per visor (both edges of a transport get credited)
5. Filters by a minimum bandwidth threshold
6. Writes daily results to `hist/YYYY-MM-DD_bandwidth.json`

The reward calculation then computes each visor's share: `visor_bandwidth / total_qualifying_bandwidth` for that day.

---

### Querying Metrics from the CLI

You don't need to call the TPD API directly — the Skywire CLI provides commands to query bandwidth metrics, check your transports, and inspect reward eligibility.

#### View Your Transport Bandwidth

The `tp` command shows your local transports, with optional bandwidth data:

```bash
skywire cli tp -b 7
```

The `-b 7` flag shows bandwidth usage for the last 7 days. Add `--stats` for a summary of transport counts by type:

```bash
skywire cli tp --stats
```

#### Query Network-Wide Bandwidth Metrics

The `tp metrics` subcommand queries the Transport Discovery for verified bandwidth — the amount both transport edges agree on:

```bash
skywire cli tp metrics
```

```text
$ skywire cli tp metrics --help
Query transport discovery for bandwidth metrics.

Shows verified bandwidth — the amount both transport edges agree on.
Default: aggregate bandwidth per visor (public key).
With --by-transport: show bandwidth per transport ID.
With --tree: tree view with visors and their transports.

Flags:
  -d, --days int        number of days of metrics (0 = all, max 35) (default 1)
  -p, --pk string       filter by public key
  -n, --top int         show only top N results by bandwidth (0 = all)
  -t, --by-transport    show bandwidth per transport ID instead of per visor
      --tree            tree view: visors with their transports as children
```

Show the top 10 visors by bandwidth over the last 7 days:

```bash
skywire cli tp metrics -d 7 -n 10
```

Check your own visor's bandwidth:

```bash
skywire cli tp metrics -p <your-public-key>
```

View bandwidth broken down by individual transport:

```bash
skywire cli tp metrics --by-transport -p <your-public-key>
```

#### Bandwidth Collection for Rewards

The reward system uses `bw-collect` to fetch and process bandwidth data:

```bash
skywire cli rewards bw-collect
```

This fetches all transport metrics from the TPD, excludes same-LAN traffic using hardware survey data, aggregates per-visor bandwidth, and writes daily results to `hist/YYYY-MM-DD_bandwidth.json`. It's designed to run hourly as part of the reward service.

#### Check Reward Eligibility

Check if a specific public key qualifies for rewards:

```bash
skywire cli rewards -k <public-key>
```

View the current mainnet reward rules:

```bash
skywire cli reward rules
```

---

### What This Means for Node Operators

- **Keep doing what you're doing** — Pool 1 (uptime) works exactly like current rewards
- **To earn from Pool 2** — generate real traffic through your visor's transports. The most effective ways to increase your bandwidth share:
  - **Use a VPN client** or **SOCKS5 proxy client** connected to another visor — client-side usage drives the most bandwidth since you're routing your actual internet traffic over Skywire
  - **Forward ports with [Skynet](/posts/skynet-port-forwarding/)** — any TCP service forwarded over Skywire generates bandwidth on both ends
  - **Run a [public visor](/posts/running-a-public-visor/)** — making your visor available as a VPN server or proxy server means other users' traffic flows through your transports
- **DMSG bandwidth is not counted** — only STCPR and SUDPH transport bandwidth qualifies for rewards. Traffic over DMSG transports (including [DmsgWeb](/posts/dmsgweb-anonymous-port-forwarding/)) does not count toward your bandwidth share
- **Both sides of a transport get credited** — when traffic flows through a transport, both the sending and receiving visor accumulate bandwidth
- **Same-LAN traffic doesn't count** — bandwidth must be between visors on different public IPs
- **Your share grows with usage** — the more real bandwidth your visor contributes to the network, the larger your share of Pool 2
