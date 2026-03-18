+++
aliases = ["/development-updates/development-update-26/"]
date = "2014-06-22"
draft = true
tags = ["Development"]
title = "Development Update #26: Skywire Code Cleanup"

+++
## Summary:

The darknet repo has been removed and moved into Skywire and Whitepaper.

Two thousand lines of coin have been removed from Skywire. It does the same thing, is much cleaner now. The daemon almost works. Will have some development documentation and sample apps soon.

###### The remaining issues for the meshnet/darknet have been worked out, specifically:
- preventing circular routes (denial of service)
- allowing multi-hop routes to be established quickly without incurring round trip latency for each hop
- binary wire protocol format

There is architectural issue, about the relationship between gnet, Skywire and the relay service. It was not clear whether these should be merged into a single library or whether the darknet router should be a service in Skywire or if Skywire should sit on top of the darknet. There are several constraints:
- the lowest level router must be something that can be implemented in C and has small ASIC foot print
- there has to be separation between the Golang layer and C layer
- some components such as DHT, operate both on the darknet and over UDP over IP

The darknet router service was originally going to be a service in Skywire, but it will now be an independent implementation with Skywire connectivity being built over the darknet.

###### The darknet router has to handle several cases:
- connectivity between nodes over public IP
- connectivity between nodes over private ethernet segment (nodes connected over IP but not necessarily connected over public internet)
- nodes which are connected and peered over wifi
- nodes which are connected over darknet through routes over the darknet, but where there is not not necessarily direct connectivity

###### This is complicated by there being different types of connectivity:
- a node could be directly connected to another node over TCP/ip
- a node could advertise connectivity from multiple 3rd party nodes (TOR hidden service type operation). For instance, an application creates routes to four nodes and then advertise that you can connect to the application from routes to any of those four nodes. The person connecting only knows the intermediate, advertised nodes.  The advertised nodes only each know the previous hop in route for node connecting to them, but does not know the origin node identity.

###### This was confusing, until we figured out that there are actually two identities and pubkeys:
- one pubkey is for the router. Only one computer is allowed to run with each pubkey. The pubkey identifies a unique router and each router has a particular connection topology to the other routers. The connection topography is public. These represent the physical routing topography of the network.
- one pubkey is for the application or service. An application or service can establish connectivity to a router and advertise connectivity to the service, from that router. To connect to an application, you need to know a router that is advertising the application and you need the application pubkey.

In other words, router addresses are not necessarily the terminal point for routes. This is not intuitive at all, but there are several reasons to separate out the topology for physically routing messages and the 0addresses for communication end-points (addresses that receive messages). In IP we take it for granted that routers and communication end-points are in the same address space, but this assumption complicates the design of the darknet. This also means that communication end-points on the network are intrinsically multi-home.