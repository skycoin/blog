+++
aliases = ["/development-updates/development-update-34/"]
date = "2014-07-18"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #34: Skycoin Github Repository and the Skywire Switch"

+++
## Summary:

Massive changes. Everything is now in one repository. https://github.com/skycoin/skycoin

## Changes

skycoin/src/coin is the **blockchain parser library**
skycoin/src/cipher is the **Skycoin Standard Crytographic library**
skycoin/src/aether is the **distributed application services library**
skycoin/src/skywire is the **Skycoin Meshnet/Darknet switch**
skycoin/src/gui is the **HTML local web wallet and infrastructure**

- All of the cryptographic and hashing functions have been moved into a common library, that can be imported and used across different applications
- Skywire is now the meshnet/darknet instead of the services daemon.
- The services daemon is deprecated
- dht has been moved into its own library, skycoin/src/aether/dht
- Aether is now the name for the full distributed service stack, not just the distributed key-value store and personal blockchains
- The C implementation of the darknet relay is being pushed to skycoin/src/skywire as the code comes in

## Future Changes:

- gnet is being renamed to something better. the library is getting an RPC style interface
- The new RPC interface will allow darknet services to expose machine readable interfaces
- Peer lookup for distributed services (PEX) was previous in daemon. It is being moved into a struct that can be associated with a distributed service through the RPC interface, instead of having a singleton in daemon for peer discovery. To use pex you will create a PEX struct for the service and then register the struct with the RPC interface.
- gnet currently handles the connection pool. Connection pool management is being switched over to the skywire darknet library. gnet will be deprecated, renamed and responsible for data serialization and the rpc module
- /src/daemon and /src/visor are undergoing heavy refactoring. These are the two modules blocking coin launch. The libraries they depend on are not stable and are rapidly changing. The new visor uses the distributed application infrastructure for blockchain sync and transaction relay.
- gnet functionality is being split up between skywire and aether and therefore the repository for gnet will be deprecated

## Skywire: Darknet/Meshnet Switch:

###### There are four layers in the Skywire stack:
- Physical layer. Physical connectivity over public internet, wifi, ethernet, fiber
- Switch layer. Handles circuits and forwarding packets between Skywire switches
- Application layer. This where route discovery, circuit bundling and native distributed application operate.
- Tunnel Layer. Simulates an IPv6 private virtual network so legacy applications can reach public internet or run over Skywire without modification.

###### At the physical Skywire nodes connect to each other over:
- Public internet (TCP, UDP)
- wifi (meshnet operation)
- Private ethernet (connected by switch over ethernet or fiber)

The switch layer is very simple. A Skywire node connects to another Skywire node and then establishes a circuit. A packet inserted into a circuit is forwarded node to node until it reaches the destination.

- All traffic between Skywire nodes is encrypted
- Traffic is encrypted end-to-end
- Each node knows the previous hops and next hop, but does not know the source or the destination of traffic
- Traffic is encrypted end-to-end
- The nodes keep track of traffic over routes exchange coins every once in a while

## Skywire Switch Design
- The switch is written in C and designed to be extremely fast.
- This part of the network can be implemented in Verilog for FPGA/ASIC implementation.
- The switch communicates with a control node for reporting traffic statistics and managing coin payments
- On an ARM meshnet device with FPGA and multiple antennas, the switch would be implemented on the FPGA and the control node software in Golang runs on the ARM core.
- There is a default packet (short form header) and an extensibility flag. If the flag is set, the message will be forwarded to the CPU for processing. This allows for protocol extensions and means the protocol can be upgraded in future.

## Division of Labor
- The core devs have enough time to get the switch working
- The community is responsible for the application layer and physical layer, but there are coin bounties for library writers!
- There is a golang library by falcore3000 for scanning and connecting to wifi networks in skycoin/src/aether/wifi

## Meshnet Hardware:

We are standardizing on the ARA platform. ARA uses a UniPro baseboard that lets you add and remove modules.  UniPro provides power and up to 10 Gb/s of bandwidth between the components on the baseboard.

###### For an mesh node, you get a baseboard
- You add a dualcore 1.2 Ghz ARM cpu module with 800 MB of ram
- You add an FPGA module, to run the Skywire switch with full acceleration
- You plug in three antenna modules and wire them to directional antennas
- You plug in a gigabit power over ethernet module to power the node and provide connectivity to the other nodes
- You plug the node into a Ubiquity Power of Ethernet gigabit router

We believe this will be the best platform in the long-term. However, ARA will not be ready until January.

## Community Handover:

Marketing, websites and so on will be handed over to members of community as soon as Aether is up we can coordinate it. A wiki will be created and hundreds of pages of documentation, roadmaps, milestones and infrastructure designs will be posted for discussion (and editing). There will be RFC requests for purposing solutions to problems and then process for getting solutions implemented and then integrated.

## Skycoin Coin Distribution

The coin distribution website is under development now. It will not be anything complicated because there is no time. The coins is launching as soon as visor is running on the new distributed applications library.