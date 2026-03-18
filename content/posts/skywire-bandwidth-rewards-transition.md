+++
date = "2026-03-18"
tags = ["Announcements", "Skywire"]
title = "Skywire Rewards: Transitioning to Bandwidth-Based Rewards"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Transitioning to Bandwidth-Based Rewards

The Skywire reward system is being updated to incentivize actual network usage. Here's what's changing.

### Current System

Today there are two reward pools split by visor architecture. Both use the same eligibility requirements based on uptime and transport count.

### New System

The two architecture-based pools are being replaced with two purpose-based pools:

**Pool 1 — Uptime (same as current)**
- The two current architecture pools merge into a single pool
- Same total rewards as one of the current pools
- Same eligibility requirements as today (uptime, minimum transports, etc.)

**Pool 2 — Bandwidth (new)**
- Replaces the current second architecture pool
- Rewards based on your visor's **relative share of total network bandwidth**
- **Requires that your visor qualified for Pool 1** — bandwidth rewards are only for visors that are already meeting the uptime requirements

### How Bandwidth Rewards Work

Bandwidth rewards are not paid directly or proportionately to the amount of bandwidth your visor uses. Instead, your reward is based on your visor's share of the total qualifying network bandwidth.

For example: if the network moves 100 GB in a day and your visor contributed 10 GB, your share of the bandwidth pool is 10%. You can increase your share by actually consuming bandwidth over Skywire — using the VPN, SOCKS5 proxy, Skynet port forwarding, DmsgWeb, or any other traffic that flows through your visor's transports.

### Same-LAN Exception

Bandwidth between visors on the same LAN — or visors that share the same public IP address — is **not counted** for bandwidth-based rewards. This prevents gaming the system by routing traffic between your own local machines.

### Summary

| | Pool 1 (Uptime) | Pool 2 (Bandwidth) |
|---|---|---|
| **Basis** | Uptime + transports | Relative bandwidth share |
| **Eligibility** | Same as current | Must qualify for Pool 1 |
| **Replaces** | Both current architecture pools (merged) | Current second architecture pool |
| **How to earn more** | Keep your visor online | Use bandwidth over Skywire |
