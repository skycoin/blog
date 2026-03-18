+++
aliases = ["/development-updates/development-update-6/"]
date = "2014-03-05"
draft = true
tags = ["Development"]
title = "Development Update #6: Coin Hour Calculation"

+++
## Summary:

- Fixed coin hour calculation bug. Each coin is 1 million "droplets". Due to integer rounding error, user would not receive coinhours from output s with a balance less than one million droplets. Bug is fixed.
- Coinhour calculation is now based upon the block time of the previous block, not the block the transaction executed in.
- Unit tests in /src/coin are fixed
- RFC for wallet is being redone to support multiple coin wallets
- Design for emergency messaging system is done
- More developers have joined the darknet/meshnet project

## Launch Checklist:
- A new wire protocol is being developed for transaction propagation and block replication.
- Refactoring of /src/blockchain and /src/visor