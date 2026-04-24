+++
date = "2026-04-09"
tags = ["Skywire"]
title = "Regional Saturation Scaling: Incentivizing Geographic Diversity with Square Roots"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### The Goal: A Globally Distributed Network

Skywire's reward system pays operators for running visors on the network. The system has two pools — a **presence pool** (fixed share per eligible visor, rewarding uptime and minimum transport counts) and a **bandwidth pool** (proportional share based on measured bandwidth). Both have been discussed at length in the [bandwidth rewards transition article](/posts/skywire-bandwidth-rewards-transition/).

The Skywire network becomes more valuable as it becomes more geographically diverse. A mesh network with nodes on every continent, in every country, reaching into underserved regions — that's the network worth building. The reward system should reflect this: **operators who bring Skywire to places it doesn't yet exist should earn more than operators adding capacity where the network is already dense.**

With a flat pay-per-visor model, the economic incentive is neutral about geography. A visor in a country with 10,000 existing nodes earns the same as a visor in a country with none. There's no reason for an operator to seek out underserved regions. The network grows wherever it's cheapest to operate, which tends to be the same handful of cloud regions.

The question is: how do you make the reward function care about where nodes are, so the economics naturally pull the network toward global coverage?

### Why Flat Rewards Don't Incentivize Expansion

With equal per-visor rewards, operators have no economic reason to deploy in new regions. Running a visor in a well-connected data center in Frankfurt earns the same as running one on a home connection in Bolivia. The path of least resistance is to add nodes where infrastructure is cheapest and most reliable — which concentrates the network rather than expanding it.

Raising the per-visor reward helps all operators equally. Lowering it hurts all operators equally. Neither creates a geographic gradient. What's needed is a reward function where **the first node in an underserved region earns substantially more than the thousandth node in an already-covered region.**

### The Regional Saturation Idea

The solution landed on April 4 (#2278): **apply diminishing returns to the presence pool based on unique IP addresses per country**, so that operators in underserved regions earn proportionally more.

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

1. **Expanding to new regions is rewarded**. Operators looking for the highest return per visor are incentivized to deploy in countries with few existing Skywire visors, because their visor there earns `1 / sqrt(few)` weight instead of `1 / sqrt(many)`. The first visor in a new country earns the maximum possible weight.

2. **The incentive gradient points toward underserved regions**. A single visor in a country with 4 total IPs earns roughly 30x more than a visor in a country with 1,000 IPs. This creates a strong economic pull toward places where the network doesn't yet exist — exactly the behavior that builds a globally distributed mesh.

3. **Operators in underrepresented regions benefit most**. A home visor in Belarus, Bolivia, or Bangladesh earns substantially more than a home visor in a country already well-served by Skywire nodes. This makes it economically viable for operators in these regions to participate even if their electricity or bandwidth costs are higher. The network pays a premium for geographic reach.

4. **There's still a benefit to running more visors, just not linearly**. If you already have 1 visor in a country with 4 IPs total, adding a second visor there increases your share (you now control 2 of 4 IPs, taking 2/4 of the country's 2.0 total weight = 1.0, up from 0.5 before). But adding a 5th, 6th, 7th visor in the same country produces ever-diminishing returns — the economics encourage looking for new territory instead.

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

### The Bigger Picture

Regional saturation scaling is one piece of the reward system's incentive structure. The presence pool creates a floor — a minimum reward for any operator meeting the basic eligibility criteria — while the bandwidth pool drives the bulk of the incentive toward actively-used visors. Regional saturation makes the presence pool reward expansion into new territory rather than concentration in existing territory.

The broader goal — a Skywire network that's geographically diverse, globally distributed, and economically viable for operators in every region — is served by the sum of these mechanisms, not any single one. Regional saturation is the piece that makes the economic gradient point outward: toward the edges of the map, toward the countries and regions where Skywire doesn't yet have a presence, toward the kind of global coverage that makes a mesh network genuinely useful.

### Where Things Stand

Regional saturation scaling is active in the reward calculator. The default exponent is 0.5 (square root). The flag `--sat-exp` allows operators to tune the value if needed. The computational speedup from replacing `jq` with native Go parsing is a side benefit — the full reward run now completes in seconds instead of minutes, which matters when the reward server runs this calculation hourly.

In terms of outcomes, it's too early to say definitively how this affects the network. The transition to bandwidth-based rewards is happening in parallel, and it'll take several weeks to see how the combined presence + bandwidth rewards shift operator behavior. The expectation is that operators in underrepresented regions will see their rewards increase substantially, creating a real economic incentive to bring Skywire to places it hasn't reached yet.

See also: [Transitioning to Bandwidth-Based Rewards](/posts/skywire-bandwidth-rewards-transition/) | [Running a Public Visor](/posts/running-a-public-visor/) | [Blockchain Wallet Authentication: The Skywire Reward Login System](/posts/skywire-reward-login-blockchain-auth/)
