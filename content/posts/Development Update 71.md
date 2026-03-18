+++
aliases = ["/development-updates/development-update-71/"]
date = "2015-04-26"
draft = true
tags = ["Development"]
title = "Development Update #71: Improvements to Queuing Transactions and PEX"

+++
The network has been operating for a few weeks now. It is working pretty well, but there are reliability issues over open internet that did not occur in the VPN testing environment.

##### The two major improvements that are needed are:
- Queuing pending transactions, ensuring they are executed, blocking wallet from creating new transactions until existing transactions are executed, putting indicator in GUI to allow diagnosis of transactions that fail to propagate
- Major refactor of PEX (peer-exchange). Peer-to-peer works perfectly when every client is equal, fast, has reliable network connection, allow incoming connections and same version of software. In real world, we have encountered a bunch of edge cases that require a full refactor of PEX. PEX is the library that manages peer-swarms, exchanges peer introduction and is component for maintaining connectivity in peer-swarms. This is only used in Skycoin Daemon right now, but can be used to build other P2P applications in future.