+++
aliases = ["/development-updates/development-update-77/"]
date = "2015-08-11"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #77: Skywire Topology Route Research"

+++
## Research Update:

Six months ago I began research into economic systems for the meshnet.
- routing (how to choose routes over the topology)
- payment (how much payment for transit should each node reach, how should price be set)

##### The naive system is to:
- choose the shortest route
- choose the lowest cost route

If there are two paths, that transit from point A to point B and the lowest cost route is always chosen, then one node ends up with all the traffic. The paths auction their cost to zero and no profit or incentive exists for expansion. This deters adaption on the provider/hardware side. Similarly, when there is a single path between the two hosts, the path can charge any fee and price gouge, which deters meshnet adaption on the user side.

##### So:
- one path between two points with no competition ends up with monopoly pricing (same as Comcast)
- two or more paths competing in auction model, bids price down to zero (zero marginal cost)

This is a contradiction in the economic model that leads to pathological behavior.

##### Another possible model is
- the price per bandwidth is fixed allow all links in the network
- the lowest cost path should be taken (in this case, the shortest path)

##### The optimal arrangement should
- minimize latency between any two points
- maximize throughput between two points
- guarantee profitability to the node operators, to incentive expansion

There are other contradictions, such as the coin being finite in quantity (a stock) and the bandwidth being infinite (a flow). If there is a 1 Gb/s link between two points and it is not used at full capacity, then the unused bandwidth is wasted. If you do not send 1 Gb this second, it is lost and the capacity cannot be stored. The mismatch between the units of stocks and flows means that the network will be under utilized.

If a mesh node costs $60 and the operator can make $60 in the first month, then the size and coverage of the network can double every month, profitably. So if the capacity requirement is 100 Mb/s for an area, then the network expansion will be slower if there are six nodes competing to fulfill that capacity, than if there are only two nodes.

There is Darwinian natural selection between competing economic models for funding and expanding a mesh topology. All of the current models are non-viable. The TOR "do it for free" model, only works because the NSA is paying for most of the nodes and its still slow.

This is a multi-agent coordination and control problem, optimization problem and cybernetics problem.  I found the optimal solution under a toy model and I am satisfied with it.

While researching the effect of different money systems on behavior of the network, I went through several scenarios
- fixed number of coins and no inflation
- fixed number of coins and constant inflation
- nodes create/loan coins into existence as credit (tit-for tat) with periodic settlement

In the third model, if user A uses a path, they give user B coin credit and and then if user B uses a path controlled by A, then it decreases the credit. After a while, the credit balances would be settled as Skycoin on the blockchain or the credit balances sold or traded. Or else the user gets throttled to a lower level or put behind traffic with a better balance of payment. This ends up being identical to Ripple Pay (the original, not to be confused with Ripple) but backed by a finite resource.

Under different currency systems, you get different network behavior. The profitability for the node operator varies, the bandwidth utilization heavily depends on it. The price and appreciation of the coin also ends up depending heavily on the economic model.

There is darwinian selection on economic forms and types of meshnets and incentives. To achieve dominance, a meshnet or decentralized model has to provide higher bandwidth at lower cost than the alternative monolithic ISP model. A meshnet or community controlled network may become the dominant form in Afghanistan or rural areas where monolithic ISPs have no incentive to provide service, while in an urban area or a different situation, the dominant economic form may different.

There are trade offs. The economic form that out competes the other forms may be better or worse for the node operators or may be better or worse than alternatives for the users or may be better or worse than other forms for the coin price and asset holders.