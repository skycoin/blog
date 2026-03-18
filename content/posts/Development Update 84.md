+++
aliases = ["/development-updates/development-update-84/"]
date = "2015-09-13"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #84: Skywire Meshnet Update"

+++
The exchange is in progress. As soon as the bitcoin/skycoin withdrawals/deposits are done, then it will take a few hours to get order book working.

I cannot wait for the order processing to be automated and to have some liquidity. Application developers will like this exchange and its API. It is very modular.

## Windows Builds:

The maintainer for the windows build slipped their fingers and actually deleted the virtual machine for doing the builds. Figuring out a permanent solution for the window builds. Maybe cross compilation with cgo dependencies will work with go 1.5 finally. There is also now a candidate golang implementation of secp256k1 that we could try to get rid of the cgo dependency.

## Meshnet:

I am simplified the mesh networking node. I realized that cryptographically signed peer-to-peer message replication is at a higher level than the base routing. I am now doing a dumb ATM type base layer with variable frame sizes and then moving all the logic into the control plane over something like XMPP. I found a stripped alternative to XMPP with everything torn out, that will be good for the router node control plane.

It is called ssmp and can do a million messages a second in benchmark and is very stripped down and has a golang implementation
- https://github.com/aerofs/ssmp
- https://github.com/aerofs/lipwig

It is basicly IRC or AIM/messenging. This is also the protocol that I am standardizing the exchange and miscellaneous skycoin RPCs over.

Networking architecture for the meshnet/dark is complicate and very difficult to get right.
- there are computers
- there is the node, the program/daemon running on the computer
- there is one or more networking interface (physical networking cards, wifi dongles)
- each interface has one or more connections to other nodes (routes)
- each route is transferring messages for one or more paths (multi-segment source to destination packet forwarding)
- within the routes there is a frame, which contains one or more messages
- within the frame there are messages

Then that is just the base layer. You have to do route discovery, announcing routes, path setup, message confirmation, payment settlement and other discrete tasks. That is just the base layer and there are networking layers we need to build up on top of that.

Its been almost two years of prototyping and  thinking of how to structure this and simplify it and what the requirements are and what the best way to implement this will be. I am very happy with result so far.

There are other issues like presenting it as a gui and letting users interact and control it and what the unit operations are for user interaction. That is going to be very important. Not everything can be automated and some things requires human judgement and the ability for people to fiddle with it.

The resulting networking stack is epic.