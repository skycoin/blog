+++
aliases = ["/development-updates/development-update-112/"]
date = "2016-11-01"
draft = true
tags = ["Development"]
title = "Skycoin Developer Test (might be tossed)"

+++
##### Someone try
- run a skycoin node with go run ./cmd/skycoin/skycoin.go
- go run ./cmd/cli/skycoin.go

##### This is the command line interface.
- do `go run ./cmd/cli/skycoin.go help GenerateWallet`
- etc

##### You should be able to
- generate wallets
- generate addresses
- check balances
- create transactions
- inject transactions into the network
- track transaction status

This is new code and still being heavily tested/modified. I would not use the 12 word wallet phrase feature yet.

We wrote too much code and added too many features at the same time. I was not watching them and they went wild, without polishing enough and we need to polish the existing things first.

We will expose the same functions over WebRPC and we are 100% done for exchange listing.
- Then we need to find a small exchange who wants to do QA and testing. Then will list and test there.

##### The marketing people want to
- have white papers up (the three papers)
- have website done with infographics
- do marketing for one month
- then do listing on the first large exchanges
- then add large exchanges over time (not all the exchanges at once)