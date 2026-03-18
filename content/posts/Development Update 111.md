+++
aliases = ["/development-updates/development-update-111/"]
date = "2016-10-31"
draft = true
tags = ["Development"]
title = "Concerns Over Inevitable Price Volatility"

+++
## Summary:
The Skycoin CLI is done. We can do exchange listing now.
The v2.0 of the Skycoin.com website is done (but needs dozens of changes)

![](/img/dev-update-111-1.png)

![](/img/dev-update-111-2.png)

- The CLI tool is in `skycoin/cmd/cli`.
- We will have documentation for usage and exchange integration
- Right now, there are help commands

## Zcash:

Zcash just hit $5000 USD per coin. Then went to $10,000 USD per coin.

The total market cap is starting at 3 billion dollars (half of Bitcoin).

This is what I mean by "inelastic capital inflows". People buy a fixed amount of each coin, regardless of current price. They will continue to add a fixed amount per month, into a basket of coins regardless of the current price of each coin (inelastic capital inflows).

I have been trying to figure out how to stop this for Skycoin, because it can result in massive bubbles and then it pops and people who bought at top lose money. However its easily possible for prices to increase to absurd levels, because people are only buying and no one is selling (market with only capital inflows and not capital outflows).

After two years of thinking about this, I do not believe there is a solution and will just have to accept whatever the market does in terms of capital inflows and outflows.

Equilibrium pricing exists, where the capital inflows match the capital outflows and where the capital in/out flows are stable. Or when the capital inflows/outflows are periodic and predictable and can be buffered by market markers. Absent those conditions, there is no stable or fair price and nothing we can do about it.

I am excited to see what will happen.
