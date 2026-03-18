+++
aliases = ["/development-updates/development-update-56/"]
date = "2015-02-02"
draft = true
tags = ["Development"]
title = "Development Update #56: Loading Wallet From Seed Enabled"

+++
The button for loading deterministic wallets from seed is now in interface.

![](/img/dev-update-56-1.png)

The wallet backend needs to be refactored, but can happen later.

Wallets have an id field, a name field, filename and a seed. This should probably been "filename" as id. The name field should be renamed "notes" or removed. The json storage format needs to be improved later. Just general cleanup in future.

When the wallet format changes, you need to go into ".skycoin/wallet" and move the folder. Then open the wallets with a text editor and extract the seed. Then run client and reimport it.