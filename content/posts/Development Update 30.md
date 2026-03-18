+++
aliases = ["/development-updates/development-update-30/"]
date = "2014-07-10"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #30: Skywire Mesh-net News and Multihoming"

+++
## Summary:

IPv6 support is working. We were having trouble before. Many of the residential routers appear as IPv4 but actually have IPv6 public IP addresses and are IPv4 NATs.

Configuring the IPv4 DNS settings on the local host does not override the IPv6 DNS server the router is using during 4to6 translation. We have no idea what is happening.

We are not sure if IPv4 and IPv6 hosts are able to operate on the same DHT network.

## Meshnet News

The meshnet design is really a darknet, that allows ethernet and peering over wifi. This has several implications and we are still working out everything this implies

###### There is an IPv6 tunnel. If two nodes are running the software:
- The traffic can be routed over the darknet
- This means automatic opportunistic encryption between end points
- The traffic can take multiple paths between the endpoints, meaning increased reliability

###### We think the darknet can act as a simple corporate VPN replacement:
- There is a plugin or service that runs a TUN adapter and authenticates with an organizations VPN
- There is a TUN adapter exposing the IPv6 address
- The VPN service identifies a correspondence between Skywire public keys (darknet addresses) and the private address space addresses
- The address space is private to an organization
- Traffic over the VPN is opportunistically encrypted automatically
- The VPN can identify "gateways" that act as bridges between the public IPv6 space and the private internal address space
- Non-native applications can run over the network without any software changes

## Skywire Multihoming and BGP

We proved that efficient stateless multihoming is impossible. IPv6 is stateless and Skywire routing is stateful.

We accidentally noticed that Skywire can achieve IPv6 multihoming by tunneling IPv6 over Skywire.

###### We noticed several things:
- IPv6 is not actually stateless. IPv6 is only "stateless" with respect the the address space, but the routing the routing tables still have state and are configured by BGP.
- It is not possible for a "stateless" protocol to support multihoming. That is why IPv6 multihoming standards have failed.
- the BGP tables are growing exponentially
- BGP cannot support multihoming
- BGP cannot support non-hierarchical, dense mesh like connectivity

###### We believe that the new darknet may be able to replace BGP for routing between domains
- It is intrinsically multi-home
- It does not suffer from route flapping
- The routing within an autonomous system is extremely simple. Much simpler than parsing IP addresses. Skywire is actually a link layer protocol
- Gateway routers can choose the full network path for different types of traffic (routing VOIP and high priority traffic over shortest hop)

###### Within an AS:
- A server operating over IPv6 over Skywire can have multiple network adapters but a single public IPv6 address
- Skywire automatically routes over the shortest hop path for the network topology
- There is a simple rule for determining if an IPv6 address is within the route prefix for the AS
- Traffic outside of the AS goes through the gateway routers
- Each server must support Skywire

###### The tunnel is:
IPv6/IPv4 (private addresses) -> Skywire -> IPv6 (public address)

In this tunneling application Skywire acts as intermediate layer between the physical network topology and the IP address space.

## IPv6 Address Space Reverse compatibility

What we are trying to figure out, is whether the darknet can be reverse compatible with legacy applications at the application layer without modification, or whether the darknet will require application such as Bitorrent to be rewritten into the Skywire address space.

###### A user running over the IPv6 reverse comparability adapter:
- will be able to run applications within the Skywire address space without modification of the application
- only TCP/IP will be supported
- they will only be able to connect to other people in the darknet
- the traffic will be encrypted
- there will be privacy, but not at level of a native application (applications on the same "IP" will share route endpoints)

**A native Skywire application**
- will have increased privacy (each application connection will have independent route endpoints)
- will have application level control over routes and traffic policies  (low latency, high throughput and so on)

External Traffic off the Skywire Darknet will go through a "gateway" which is similar to a VPS provider. Your IP to public will appear as the gateway server's IP. This is like a TOR exit node. However, for quality of service, a person will probably have to subscribe to an individual gateway service provider.

Public gateways in TOR are unusable because their IPs are banned from most websites because of spamming. The IP addresses are also easier to identify than private gateways and are prime targets for monitoring. Private gateways are more difficult to identify and offer a higher quality of service.