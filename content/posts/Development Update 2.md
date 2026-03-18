+++
aliases = ["/development-updates/development-update-2/"]
date = "2014-02-01"
draft = true
tags = ["Development"]
title = "Development Update #2: Development of the Skycoin Wallet"

+++
## Summary:

 We are finishing networking. The test net client will be released at least one week before anything else. We want to make sure the client is working on all operating systems before launch.

For now, you can run wallet with:
 >cd skycoin/cmd/wallet/wallet.go
 >go run ./wallet.go

There are new tools in skycoin/cmd/ for generating addresses from the command line.

After launch several applications will be announced which are being built on Skycoin. In particular
- Secure messaging
- Low latency, high bandwidth darknet using Skycoin as bandwidth credits ("proof of bandwidth", users receive skycoin for providing bandwidth to network, based upon cjdns)
- Peer-to-peer distributed altcoin exchange with escrow

The Skycoin main and test net are running. We are doing unit tests and windows builds right now.
- Changes to the source code are tracked here
https://github.com/skycoin/skycoin/commits/master

- This is the top level API for the block chain parser
http://godoc.org/github.com/skycoin/skycoin/src/coin

- This is the top level API for the Skycoin networking daemon
http://godoc.org/github.com/skycoin/skycoin/src/daemon

# Wallet Development:
New version of Wallet is out:

![](/img/dev-update-2-1.png)

# Milestones:
- The first client synced the blockchain on Feb 6, 2014. Will be publishing best testing instructions for testnet soon.

# Ongoing Development:
1. Windows Builds
2. Obelisk white paper
3. Documentation for developers
4. Long term project plans
5. The alpha client uses a central server to produce and sign blocks until Obelisk is ready. This allows the coin to trade and be tested before Obelisk is completely implemented. The existing blockchain will roll over when Obelisk is ready.

One of the applications under development is the Skycoin darknet routing protocol. The Skycoin routing node enables "link aggregation" across multiple computers which are connected by wifi. If you have a 10 Mb/s internet connection and you have fifteen neighbors with 10 Mb/s internet connections who are running a nodes, the router node can aggregate the wifi connections into a 160 Mb/s connection.

- Peers receive SKY for providing bandwidth and transport to the network and users spend SKY to consume network resources.
- Skycoin is designed with native support for off-blockchain transactions for low overhead bandwidth micro payments.
- The nodes relaying traffic are unable to determine the full network path of the traffic (onion routing)
- The nodes relaying traffic cannot see the the contents of the traffic (end-to-end encryption and link encryption).
- The router runs on $40 Rasberry pi hardware
- Skycoin routers can connect at 1 Gb/s over 15 km using 24 Ghz Ubiquity hardware
- Software defined radio devices running on FPGAs are in development

Skycoin is an attack on ISPs and wireless companies in the same way that Bitcoin is an attack on the banks. One of the long term goals of the Skycoin project to create the financial incentive and software infrastructure required for community ISPs. The Skycoin project is attempting to create the financial incentives to deploy open access community mesh networks that span the last mile between homes and fiber.

The routing protocol will be on github within two months and the coin will be launched within a week.

Skycoin can be used for peer to peer payments like Bitcoin, but is currently primarily the base credit unit and transaction layer for implementation of several proof-of-bandwidth and distributed service protocols currently under development.