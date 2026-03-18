+++
aliases = ["/development-updates/development-update-37/"]
date = "2014-08-09"
draft = true
tags = ["Development"]
title = "Development Update #37: Organization Update"

+++
## Organizational Update:

The original plan was to put it on Aether, however it will be months before that is working. The networking refactor was a major headache, was a massive amount of work and ended up going nowhere, but took four months. The upside is that we have a very clear architecture now.

The current plan, is that the ICO prospectus is being written. It is about 200 pages. It lays out each component in the Skycoin project, in the details required for implementation. Then coin bounties will be assigned for implementation.

Then we will focus on the meshnet/darknet implementation, put bounties on what we can and focus on the consensus mechanism implementation once the libraries we need are ready.

Skycoin is written as a series of libraries. The libraries are general and reusable. There libraries for networking/rpc, for parsing a blockchain, for replicating blocks between peers, for cryptography and so on. The problem is that writing good libraries requires significantly more design effort than writing blobs of code that merely work.

The community has to take over as much as it can and operate independently of the developers. Maybe we can use a ticket system for bounties?

We can quickly get the software working for transport and encryption working, but the meshnet development has to be on a ticket/bounty system to get all the components in place. We are scoping out the meshnet requires right now and writing up documentation/guidance.

Then there are other organizational issues. We have coordinate with the meshnet hardware groups, do testing, share results, hardware selection, ordering and coordinate local community meshes to get long distance backhaul connections setup. We need software for mapping the meshnet nodes, for reporting connection statistics and allowing node operators to optimize their deployment topologies.

For instance, we need someone to construct a platform that rotates in x/y plane and has controllable tilt. We need to put an antenna on the platform fed with standardized power level and need to put a hackrf 20 ft away and need to measure transmitted power density at the receiver, as a function of angle for different antenna configurations. This data will tell us minimum power we need to transmit with for line of sight to reach a given bandwidth over a given distance with a given noise floor for the receiver.

We need a way of locating Skywire nodes in physical space. We need a cheap active phased array element circuit for inducing phase shifts in a 2.4 Ghz signal. A system might use a GPS and two antennas and measure signal strength from a Skywire node using a HackRF as a function of the induced phase shift between the antennas. That would give us a direction. Multiple readings from multiple positions would give us a spatial position for node. Then people have to put these on their cars and collect data as they are driving around.

Data like this, would probably be uploaded to an aether store as its collected and then aggregated by other applications which expose it over APIs over which other applications can be built for visualization.

We need terrain topological maps. We need to be able to determine which mesh sites a person has line of sight to if they are in third floor on the south side of a building in a particular location. We have to identify collocation sites that are neural and can provide backhaul, so we are not reliant upon comcast and have to establish long distance links spanning out from those sites.

We need nodes to automatically report bandwidth and connectivity statistics (probably into an Aether store). We need reporting for fine grained performance statistics on noise floor, signal strength, connection reliability, throughput and latency. Then we have to aggregate and expose this data on an API for applications.

The earliest network will just be nodes peered over internet. Then a physical mesh will be built out with fixed, point to point directional antennas using commodity 802.11 wifi. Then we move into specializations of commodity 802.11 hardware and eventually a full Software Defined Radio (SDR) network.

The ideal network is going to be point-to-point with directional "pencil beams". By using multiple antennas and inducing a phase shift between the signals through each antenna, we can do active signal rejection so we are only receiving signals coming from a particular direction. Active signal rejection also enables us to triangulate node positions in physical space. We can also transmit highly directional beams that focus most of the beam power on the receiver instead of irradiating it into space.

An ideal hardware configuration, would be something like a 16x16 cm flat sheet with a 4x4 antenna array that someone can just hang out their window, place in window or put on a roof.

A six antenna 2.4 Ghz phased array setup may be as simple as a few variable capacitors a transistor and a $4 arduino or it may be significantly more complicated. Hardware manufactures are reluctant to produce chipsets for the 802.11af whitespace that just opened up because of the FCC requirements. Chinese companies have released extremely powerful $15 to $35 USB Software Defined Radio (SDR) devices that are the size of a USB stick, but which can only receive. We may need custom ASICs or to partner with company building the devices.

We are also trying to standardize on UniPro bus standard for our hardware and we need an open source UniPro bus IP core. UniPro will be able to handle everything except the communication between the ADC and FPGA block.

Then there are questions about whether we should do the Quadrature Amplitude Modulation in the Analog to Digital Converter (ADC) block or whether we should just capture the signal and handle it in the FPGA block. Then there are cost questions, such as whether we can get by with an 8-bit resolution on the ADC.

Ideally we want something going up to 900 Mhz with at least 20 MHz bandwidth around the base band and at least four antenna ports, with ability to modulate phase shifts on the antennas ports and it should be single chip, then we would feed that into an FPGA. Even with an open source design, it will cost at least $120,000 to get something like this at minimum order volumes.

So the meshnet has multiple components. Meshnet will have many more teams than the coin/software side and the requirements are much more specialized. The hardware component of the meshnet effort is going to be an absolute decentralized mess, but will workout. People will have to form their own teams and manage them. The only thing we can offer is funding and guidance.

The objective is to get the price down as low as possible, so we want multiple providers, open source hardware. We do not want to be a position like the Trezor, where you have a piece of hardware that everyone needs and its $700 when it should be $5. We are talking to several hardware vendors and offering coin subsidies to offset the large cost of minimum hardware quantities.

The software, we are confident we are on track for meeting requirements for the coin. Even if it is taking significantly longer than intended. The meshnet to be more than a toy however is going to require massive organization on the ground at community level.

We have no idea how this is going to be organized. I think
- write up project spec in detail for each component, at level required for implementation
- launch coin
- assign bounties on sub-projects. setup ticketing system for managing sub-projects
- Get aether working as a wiki and for publishing webpages
- Get aether working as discussion board
- Get messaging users by public key working, so we can have email/bitmessage type system
- Move project management in Aether/Darknet

Quote from: **CraigM** on August 09, 2014, 07:20:24 AM

>Can you guys please provide better commit messages? Looking at https://github.com/skycoin/skycoin/commits/master shows lots of commits with the same message just referring simple to something that I don't know what it is, some project area, of even just "changes", or "test". The last 3 were better: please continue that trend.

Most of the developers are not working out of that repo. There are three repos. Each one is using a different version of the wire protocol and we have been trying to merge them into a single repo for four months.

The problem is that it is very difficult to move the blockchain download process into an isolated service. We tried to do it as one large refactor and it failed. After writing more code and abstracting the networking library, we finally figured out how to do the refactor as a series of small changes that individually did not break anything.

Daemon and visor are currently a tangled bundle of code and lack elegance. We want to split them off into
- library for handling/storing blocks (blockdb)
- library for downloading the blockchain, given the blockchain public key hash (a service; dependency on blockdb and skywire)
- a service for exposing the JSON RPC the local web wallet is built on
- the actual blockchain state manager (the visor)

The service is being moved into RPC. The dependency of Daemon on Visor is being severed. The visor itself exposes networking over a service on the Daemon. The networking is being changed to an RPC interface to simplify using the wire protocol. The JSON RPC is being moved out of Daemon into Visor. The block database is being abstracted into a library that  Visor pulls in.

Once that is is in place, we can launch. Its a small series of changes.

Then everything is in place for "ghetto consensus" which is a simplified form of the consensus algorithm which is easy to implement (and better than Ripple) but which is just a place holder. Ghetto consensus is being replaced with a version built on top of the Merkle-DAG system, once the library is implemented, then incremental changes made until it achieves the security properties against the known attack scenarios.

After "ghetto consensus" is working, focus will shift to distributed applications and meshnet for a while.