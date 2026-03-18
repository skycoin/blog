+++
aliases = ["/development-updates/development-update-68/"]
date = "2015-04-18"
draft = true
tags = ["Development"]
title = "Development Update #68: Skycoin: Attack of the Bugs 1"

+++
## New Bugs:

- If you try to send and the send fails because of insufficient coins, it did not give a popup and only printed error in terminal. That is fixed now.
- There was a bug discovered yesterday, where you can do multiple transactions from the same inputs (only one of the transactions will succeed). So if you do two sends form same wallet and transaction propagation is not successful, then some of the transactions wont go through. Fixing this now.
- Transaction sync on connect may not be working. It works sometimes, but I think problem was somewhere else. I think network was experiencing a netsplit. Connecting to random nodes does not guarantee a robust network topology. We need to allow user to create persistent list of nodes you should always try to connect to. To ensure the core-nodes are fully connected.
- Two people reported disappearing and reappearing coins. there may be a bug in coin balance calculation. The coins never moved, but it is just bug in GUI, looking into this.

## Network Status:

We will be out of things to code soon and then it will just be debugging and polish.

There are cyber warfare drills and border gateway protocol redirect attacks in middle east that are deteriorating VPN service and dropping people from IRC in Europe. I think we were seeing internet kill switch tests yesterday. We were seeing protocol specific deterioration of VPS traffic between hosts, only for traffic passing between particular countries and only for VPN but not for HTTPS or SSH traffic. Skycoin block and transaction peer-to-peer propagation seem to be holding up and were only intermediately affected for a few hours, even through the vpn was out.

We still have a lot to do in order to harden the network.

Once Skywire is working, we might want to put in some networking instrumentation for transaction/block/consensus propagation and node connectivity and then have nodes publish/aggregate that. Quantitative data on block propagation and network state could be helpful. Then we can verify Sybil attacks, diagnose outages, detect net-splits and identify disruptive nodes, instead of just guessing.

One of our site installations was using a consumer wifi router. The router was hacked and the DNS on the router was changed, so that it inserts popup ads into webpages. It could also hijack your computer if you downloaded an exe or and pdf, or potentially steal Bitcoin or other nasty things. We recommend routers with open source firmware like openwrt. Ubiquity hardware tends to be very and the security is much better than Linksys or other consumer routers.

It is worth $80 to get a router and networking equipment, that is not going to get hijacked and get your stuff stolen. If a website has 3rd party http tracking stuff in it and the router dns hijacks the page, I think they can keylog whatever you type through javascript even if the webpage is https.

## Diagnostics:

This is the crypto-logic level data. This is canonical and is more reliable than the gui.

http://skycoin-chompyz.c9.io/blockchain/blocks?start=0&end=500
http://skycoin-chompyz.c9.io/outputs
http://skycoin-chompyz.c9.io/blockchain

##### This is
- The blockchain (the ledger of transactions and blocks)
- The unspent output set (the current account balances)
- Tthe state of the client (the head block the client has)

If you are running a local skycoin client you can access these locally using

http://127.0.0.1:6420/blockchain/blocks?start=0&end=500
http://127.0.0.1:6420/outputs
http://127.0.0.1:6420/blockchain

This is very clean. This is what I think a second gen interface should look like.

The second generation is just cleaning up Bitcoin and making it usable. The third generation is where we begin to go beyond Bitcoin.