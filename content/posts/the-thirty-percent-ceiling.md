+++
date = "2026-08-02"
tags = ["Development", "Skywire"]
title = "The Thirty-Percent Ceiling: A Reward-Uptime Divisor Bug"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

For several weeks, a strange thing was true of the Skywire network: a visor could be online continuously — process up, dmsg connected, reachable, everything green in its own logs — and the reward system would record its daily uptime at almost exactly **30%**. Rewards require **75%**. So a node that never went down earned nothing, and its owner had no way to see why. Roughly half the fleet was in this state.

This is the story of that bug, because the shape of it is instructive: the wrong number was stable, precise, and fleet-wide, which is exactly what makes a measurement bug look like a real outage.

### The symptom

Daily uptime in the reward system is a percentage: the network samples each visor's presence and the day's score is *how many of the expected check-ins actually arrived*. Below 75% for the day and the visor is ineligible for that day's rewards.

Operators started reporting visors that showed 100% uptime locally but near-zero rewards and a red "inactive" dot in the hypervisor's visor list. Pulling the reward server's uptime data showed it wasn't a handful of misconfigured nodes — **439 of 783 reporting visors were clustered between 25% and 35%**, and the cluster was *version-correlated*: the low group was overwhelmingly the newest release, while visors still on older versions sat happily at 100%.

That correlation sent the investigation down a rabbit hole. A version-correlated uptime collapse looks like a regression in how the newer visors *deliver* their heartbeats — a client bug, a contended lock, dropped timer ticks under load. A lot of careful work went into that theory. It was wrong.

### The tell: 30.00%, exactly

The number that cracked it was the precision. A continuously-online, non-hub visor didn't score "about 30%." It scored **30.00%**, day after day, across the whole cluster. Real downtime is noisy; it scatters. A stable, identical fraction across hundreds of independent machines is not downtime — it is arithmetic.

Here is the arithmetic. The daily percentage is computed as:

```
daily_uptime = heartbeat_count / expected_heartbeats_per_day
```

The divisor, `expected_heartbeats_per_day`, was **960** — that is `86400 / 90`, one expected check-in every **90 seconds**. Ninety seconds is the cadence of *transport re-registration*: how often a visor re-announces its transports to the discovery service.

But a visor's dedicated presence heartbeat — the signal actually meant to prove "I am up" — fires every **5 minutes**. Five minutes into a day is `86400 / 300 = 288` heartbeats. So a perfectly healthy non-hub visor delivers 288 of them, and the server divides by 960:

```
288 / 960 = 0.3000  →  30.00%
```

There it is. Not a lost heartbeat in sight — every single one arrived and was recorded. The *counter* was correct; the *divisor* was measuring against the wrong clock.

And the version correlation? A red herring with a real mechanism behind it. Transport **hubs** — high-connectivity visors that re-register transports constantly — score 100% because each of those ~90-second re-registrations *also* records a heartbeat, so their count climbs to ~960 legitimately. The visors reading 100% weren't on a "good" version; they were simply busy enough with transport churn to hit the inflated divisor. Everyone else — the ordinary, well-behaved node whose only signal was the 5-minute presence beat — was mathematically capped at 30%, forever, no matter how perfect its uptime.

### The fix, and why it heals the past

The correction (**PR #3667**) is one divisor. Visor uptime is now scored against `expected_visor_heartbeats_per_day = 86400 / 300 = 288`, the real 5-minute cadence. (Transport uptime, a genuinely different signal, keeps the 90-second figure.) A continuously-up visor now delivers 288 and is divided by 288: **100%**.

The quietly elegant part is *where* the percentage is computed. The server stores the raw heartbeat **count** and derives the percentage **at read time** — every time the reward data is queried. Nothing about the stored history had to change. The moment the corrected server re-read its existing counts, every day still inside the retention window was re-scored correctly, all at once. No fleet update. No backfill job. No manual recalculation. The ~30% cluster snapped to ~100% retroactively, and the reward eligibility it had been wrongly denied came back with it.

A live pull of the reward data after the fix deployed tells the whole story in one line: on a recent settled day, of ~990 reporting visors the **median uptime is 100%**, **96% clear the 75% bar**, and just **two** visors remain anywhere near the old 30% band — down from more than four hundred.

### The lesson

The bug that cost the most time here wasn't in the code that broke; it was in the *plausibility* of the first explanation. "Newer visors deliver fewer heartbeats" is a perfectly reasonable hypothesis, it fit the version correlation, and it was completely wrong. What finally pointed at the truth was refusing to round: **30%** invites a search for a leak, but **exactly 30.00%, everywhere** is a number telling you it came out of a division, not a network. When a measurement is too clean to be real, suspect the ruler before the thing being measured.
