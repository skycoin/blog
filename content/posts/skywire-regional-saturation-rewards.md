+++
date = "2026-04-09"
tags = ["Skywire"]
title = "Regional Saturation Scaling: Fighting Reward Farming with Square Roots"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### The Problem with Equal Reward Distribution

Skywire's reward system pays operators for running visors on the network. The system has two pools — a **presence pool** (fixed share per eligible visor, rewarding uptime and minimum transport counts) and a **bandwidth pool** (proportional share based on measured bandwidth). Both have been discussed at length in the [bandwidth rewards transition article](/posts/skywire-bandwidth-rewards-transition/).

Here's the presence pool problem in its simplest form:

> **If the presence pool gives 1 share per eligible visor, and the cheapest way to operate an eligible visor is $3/month on a cloud VPS, then any time the pool share exceeds $3/month, it's profitable to spin up more VPS visors.**

The market equilibrium is "keep adding VPS visors until the per-visor share equals the operating cost." This is textbook economics — inefficient rent gets arbitraged away by new entrants. The problem is that for Skywire, this equilibrium is the wrong outcome. The reward system was designed to compensate operators for providing **distributed, geographically-diverse network infrastructure**, not to subsidize data-center colocations.

If the economic gradient points toward "a single operator runs 10,000 VPS visors in the same cloud region," the reward system has failed to create the network it wanted. The network becomes centralized in a handful of cloud providers, concentrated in a handful of geographic regions, and vulnerable to the same failure modes the peer-to-peer overlay was supposed to avoid.

### Why "Just Pay Less Per Visor" Doesn't Work

The obvious response is: lower the per-visor reward. If the pool pays $1/visor/month and VPS costs $3/month, there's no profit in running more VPS visors.

But this breaks the incentive for legitimate operators. If you're running a Raspberry Pi at home, or a visor on hardware you already own, the marginal cost to you is near zero (maybe a few cents of electricity). Lowering the per-visor reward pushes the break-even point higher for home operators too. At some point, only the industrial operators remain — the thing you were trying to prevent.

Similarly, raising the eligibility bar doesn't work. Higher minimum uptime, more required transports, longer required history — none of these distinguish a home operator from a cloud operator. The cloud operator can easily meet any uptime requirement (cloud SLAs are excellent) and easily configure many transports. Each additional barrier has the same cost for both.

The fundamental issue is that **a pay-per-visor system treats every visor identically, regardless of what that visor is actually contributing to the distributed nature of the network**. A thousand visors in a single Hetzner data center contribute no distribution benefit over one visor there. The reward function needs to account for this.

### The Regional Saturation Idea

The fix landed on April 4 (#2278): **apply diminishing returns to the presence pool based on unique IP addresses per country**.

The basic shape:

- Group eligible visors by country, using the GeoIP database to resolve IPs
- Count unique IP addresses per country (not visor count — multiple visors on the same IP count as one)
- Apply a concave function to the IP count, then multiply by the country's share of the pool
- Each visor in the country gets `country_share / visor_count` of the country's allocation

The concave function is what does the work. The default is **square root scaling**, configurable via a `--sat-exp` flag that lets operators tune the exponent. Here's what square root does in practice:

| Unique IPs in country | Weight per IP | Total country weight |
|----------------------|---------------|----------------------|
| 1 | 1.00 | 1.0 |
| 4 | 0.50 | 2.0 |
| 16 | 0.25 | 4.0 |
| 100 | 0.10 | 10.0 |
| 10,000 | 0.01 | 100.0 |

A country with 100 unique IPs gets 10× the total weight of a country with 1 IP, not 100×. Each additional IP contributes less weight than the previous one. At 10,000 IPs, the 10,001st IP adds essentially nothing — the marginal incentive to add another visor in that country is near zero.

The economic implications:

1. **Geographic diversity is rewarded**. Operators looking for the highest return per visor are incentivized to deploy in countries with few existing Skywire visors, because their visor there earns `1 / sqrt(few)` weight instead of `1 / sqrt(many)`.

2. **The industrial cloud strategy breaks down**. Spinning up 1,000 visors in AWS us-east-1 doesn't produce 1,000 shares. It produces `sqrt(1,000) ≈ 31.6` effective shares, divided among the 1,000 visors, for an average of `0.032` per visor — roughly 3% of what a single visor in a country with 4 IPs would earn. The arbitrage opportunity disappears.

3. **Home operators benefit from their inherent diversity**. A home visor in Belarus, Bolivia, or Bangladesh earns substantially more than a home visor in a country already saturated with Skywire nodes. This makes it economically viable for operators in underrepresented regions to participate even if their electricity or bandwidth costs are higher.

4. **There's still a benefit to running more visors, just not linearly**. If you already have 1 visor in a country with 4 IPs total, adding a second visor there increases your share (you now control 2 of 4 IPs, taking 2/4 of the country's 2.0 total weight = 1.0, up from 0.5 before). But adding a 5th, 6th, 7th visor in the same country produces ever-diminishing returns.

### Why Square Root Specifically

The choice of square root isn't arbitrary. It's the simplest concave function with the right shape: monotonically increasing (more is still more), continuously differentiable, and with a marginal value that decreases as the input grows.

Other options would work similarly:

- **Logarithm** — more aggressive diminishing returns. A country with 1,000 IPs gets only `log(1000) ≈ 6.9` weight instead of `sqrt(1000) ≈ 31.6`. This is too aggressive for Skywire's current scale — it effectively caps the benefit of any individual country regardless of how many visors are there.

- **Cube root or fourth root** — less aggressive. A country with 1,000 IPs gets `cbrt(1000) = 10` weight. This might be appropriate at a larger network scale where "100 visors in a country" isn't unusual. Currently it's too lenient.

- **Sqrt with a cap** — square root up to some maximum, then flat. Prevents the edge case where a single country with enormous visor count dominates the network, but adds a discontinuity that creates weird incentives near the cap threshold.

Square root strikes a balance: aggressive enough to matter (a 10,000-visor country gets 100× the weight of a 1-visor country, not 10,000×), but not so aggressive that it caps the legitimate contribution of popular regions. And it's parameterized — the `--sat-exp` flag lets operators adjust the exponent (`0.5` is square root, `0.33` is cube root, `0.25` is fourth root) as the network grows.

### The Implementation

The refactor was more than just adding a scaling function. The reward calculation was previously written as a shell pipeline that invoked `jq` multiple times per survey to extract IP addresses and country codes. With thousands of surveys, this was slow — a full reward run took minutes, dominated by `jq` startup overhead.

The rewrite:

1. **Native Go JSON parsing** — survey files are parsed once in Go instead of being repeatedly piped through `jq`. Each survey's IP and country fields are extracted into a single pass.

2. **Map-based frequency counting** — unique IPs per country are counted with a `map[country]map[ip]bool` structure. Total unique IPs are just `len(map[ip])` per country.

3. **Shared pool calculation logic** — extracted into reusable functions so the same code path handles presence pool, bandwidth pool, and any future pool types.

4. **The saturation scaling is a single function call**:

```go
func saturationWeight(uniqueIPs int, exp float64) float64 {
    return math.Pow(float64(uniqueIPs), exp)
}
```

The total pool allocation is `sum(weight(country_i))`, each country's share is `weight(country_i) / total`, and each visor's share is `country_share / visor_count_in_country`.

A full reward calculation run that previously took minutes now completes in seconds.

### Edge Cases and Gotchas

**Visors behind NAT share an IP**. Multiple Skywire visors on the same home network, sharing a single public IP, count as 1 unique IP. This is correct behavior — they provide the same network-edge diversity, not multiple independent edges. An operator running 5 visors at home gets 1 IP's share of the pool, divided among the 5 visors.

**IPv6 and IPv4 are both counted**. If a visor has both an IPv4 and IPv6 address and the survey captures both, they count as one IP (the survey captures the primary public IP). This prevents double-counting for dual-stack operators.

**GeoIP accuracy matters**. The GeoIP database maps IPs to countries. If the database is wrong about an IP (rare but possible), visors get attributed to the wrong country. This produces minor distortion but isn't catastrophic — the wrong-country mapping is stable across reward periods, so operators aren't repeatedly re-classified.

**The `--sat-exp` flag is a governance parameter**. Changing it shifts the economic incentives of the whole network. Any change should be announced in advance and applied consistently — otherwise operators in different regions would be confused about why their rewards suddenly changed. The flag exists for future tuning, not for per-period adjustments.

**Regional cap is implicit, not explicit**. There's no maximum share any single country can earn. A country with 100% of the visors would get 100% of the pool. But because of the concave weighting, the effective maximum is much lower than the pool size — a country with 10,000 times more visors than the smallest represented country gets only 100× the weight, not 10,000×. In practice, this means the largest country gets a substantially smaller share than proportional visor count would suggest.

### What This Doesn't Fix

Regional saturation scaling is one piece of the reward system's anti-gaming defenses, not all of it. It addresses geographic concentration but not:

- **Sybil attacks at the visor level** — running many visors on the same IP is already handled (they count as one IP), but running many visors on many cheap IPs within the same data center is only partially addressed by the country-level aggregation.
- **Bandwidth gaming** — the bandwidth pool is a separate mechanism with its own anti-gaming rules (same-LAN traffic excluded, both edges must agree on the count).
- **Uptime gaming** — eligibility is gated on minimum uptime, but a cloud operator can easily meet any uptime requirement. The presence pool still depends on visor count within a country's weight share.

The presence pool's role in the system is to create a floor — a minimum reward for any operator meeting the basic eligibility criteria — while the bandwidth pool drives the bulk of the incentive toward actually-useful visors. Regional saturation scaling prevents the presence pool from being exploited while preserving the floor for legitimate operators in underrepresented regions.

The broader goal — a Skywire network that's geographically diverse, globally distributed, and economically viable for operators outside the major cloud regions — is served by the sum of these mechanisms, not any single one. Regional saturation is the piece that makes the presence pool incentive-compatible with that goal.

### Where Things Stand

Regional saturation scaling is active in the reward calculator. The default exponent is 0.5 (square root). The flag `--sat-exp` allows operators to tune the value if needed. The computational speedup from replacing `jq` with native Go parsing is a side benefit — the full reward run now completes in seconds instead of minutes, which matters when the reward server runs this calculation hourly.

In terms of outcomes, it's too early to say definitively how this affects the network. The transition to bandwidth-based rewards is happening in parallel, and it'll take several weeks to see how the combined presence + bandwidth rewards shift operator behavior. The expectation is that operators in underrepresented regions will see their rewards increase substantially, while operators with many visors in already-saturated regions will see their rewards decrease — which is the point.

See also: [Transitioning to Bandwidth-Based Rewards](/posts/skywire-bandwidth-rewards-transition/) | [Running a Public Visor](/posts/running-a-public-visor/) | [Blockchain Wallet Authentication: The Skywire Reward Login System](/posts/skywire-reward-login-blockchain-auth/)
