+++
aliases = ["/development-updates/development-update-72/"]
date = "2015-05-08"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #72: Skywire Structure Update"

+++
## Summary:

The coin is basicly done. Other people can come in and polish up the hundreds of other things now. There are two developers working on front end and api, so will speed it along. Nothing else that is absolutely critical and not incremental needs to be done. There are still hundreds of small changes, improvements, refactoring to be done but it can be ignored for now.

After the coin distribution receipts are done, then schedule is cleared for consensus implementation and meshnet/darknet.

This is the CJDNS networking stack

![](/img/dev-update-72-1.png)

Skywire is similar, but is simpler.

###### The Skywire networking is designed to be "modular" in the sense that it can be torn apart:
- The routing algorithm in network can be swapped out/changed, its source routed
- The TUN adapter is just an application on top of the base layer
- Multiple-homing and multiplexing is handled at higher level and can be changed or controlled by application
- Settlement and payments for bandwidth

There are a large number of pieces. The objective is get them working at the ghetto level, even if they have to be centralized. Then people can fix or improve them later. Then we can move on to the next part. The crypto/blockchain had to be perfect, but now we can shift back to cowboy development.

We built most of the infrastructure for internal usage and not for some abstract purpose. We tried doing ICO/exchange with automated bot over bitmessage, tox, xmpp and I was not happy with any of the solutions. I just wanted to be able to put in a public key for a node, connect to that node and be able to send bytes. We had
- Reliability issues. Direct connections from Russia/China/Hong Kong through Europe and North America were failing and connections from US to China were constantly connecting/disconnecting. The reliability of direct routes between nodes on the IP namespace seems to be decreasing and was never 100%. Many users have reported that CJDNS has higher reliability than IP because it is not reliant upon direct paths
- Connecting all nodes to VPN was failing because of DNS failures. Dependence upon DNS resulted in dropped/timed out connections. Failure requiring restart by hand with RTNETLINK answers: Operation not permitted Linux route delete command failed: external program exited with error status: 2
- Bitmessage could not send more than one message every five minutes. Bitmessage was completely taken out by flood attack during a period when we were testing it. Message latency was in minutes, compared to real time
- TOX worked very well, but the programmatic API for golang was lacking and did not work for a full month. After the API was fixed, worked but then connections between the North America and China keep connecting/disconnecting.

###### So the requirements are :
- Multi-hop (unix-to-unix copy, source routed)
- Link layer encryption between nodes
- No reliance upon the DNS system
- Own namespace independent of IPv4/IPv6 (which is only used for transport)

###### There is someone implementing the basic protocol now. Then once we have length prefixed packets flowing over it, then we need to:
- Add a golang TUN adapter, so we can tunnel VPN connection over it and use it like a VPN.
- Need to use add wifi controller library to scan for local nodes and connect automatically and form links (fixed connectivity meshnet functionality)
- Need routing algorithm that will scale. While the network is 10,000 nodes, then any routing algorithm is fine.
- Get coin payments for transit setup. Then people can get coins for reliable links out of difficult countries
- Get "pirate box" you can just plug into ethernet and connect to a bunch of nodes in network and start relaying traffic and provides open access wifi connection over skywire

Once the software is useful, then there will be non-speculative capital inflows.

I don't think end-users care about software quality as much as usability and that it works. It does same thing and has same reliability, but it costs 5x the mental effort and frustration for developers. However, if you are building foundation for larger system it is important. I think we should go on rampage of implementing new things and ignore technical debt/refactoring for a while. As soon as something is working, just move on to next thing instead of improving or refactoring already working components. Then refactor and move things around later.

Then there loose ends that are frustrating. I want to get the ECC cryptography completely in golang, to enable cross compilation for windows/osx/arm/linux, however this will require a significant testing and will require auditing and fuzzing again.

This is a very incremental process. I am moving towards being able to run brain wallet on a raspberry pi and have a remote lib-bitcoin node and be able to check balances and being able to process Bitcoin/Skycoin transactions from that. I am also moving towards, being able to run skywire on a raspberry pi and connect the laptop to the ethernet port and have all traffic for laptop tunneled over skywire, in hardware.