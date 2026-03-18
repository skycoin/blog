+++
aliases = ["/development-updates/development-update-74/"]
date = "2015-06-07"
draft = true
tags = ["Development", "Consensus"]
title = "Development Update #74: Skycoin Consensus Convergence"

+++
Here is benchmark of the Skycoin consensus algorithm and rounds to convergence vs other voter based algorithms.

![](/img/dev-update-74-1.png)

I think there is an improvement, but current method out performs all methods in literature that we have found so far. The important part is that it converges rapidly in a small number of rounds (less than 10 or 20) and that it does not get stuck in a non-convergent state.

Sznadjd and naive voting sometimes do not converge in 40 rounds. This means network gets stuck in particular state and does not converge. The Skycoin consensus algorithm avoids getting stuck, which is good.

5 rounds convergence, means that if round trip time between California and Japan is 200 millisecond, 5 rounds is about 1 second. So average block times can be as low as 1 to 2 seconds, for this network topology (the wikipedia voter data set).