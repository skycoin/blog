+++
aliases = ["/development-updates/development-update-76/"]
date = "2015-07-26"
draft = true
tags = ["Development"]
title = "Development Update #76: Skycoin Upgrades"

+++
## Priorities:

There are many thing we want to do, but have to focus and defer a lot of things for future. Right now, there are a few things in progress.

1) Porting crypto to golang. To cross compile (to compile skycoin for windows, android, linux and OSX from a single server) all the code has to be in golang. Skycoin crypto wraps a secp256k1 library. This is being rewritten to golang but is an incredibly difficult and time consuming task. The person working on this sounds like they are going mad. I have no idea how long this will take. Skycoin uses compressed elliptic curve points and signatures, so the library has to support these. Satoshi tried to use them for Bitcoin but gave up because getting them to work in openssl was too difficult and we have to do it from scratch. We have to do a lot of testing and generate billions of keys and signatures with both the new library and old library and make sure they get same results.

2) Skycoin exchange. We have to have exchange written from scratch. We need lib-bitcoin bindings for golang and there is contractor working on this. We don't want "paper skycoin". People never withdraw coins to wallets, so exchanges are free to sell fake coins that do not exist, in infinite quantities. If someone tries to withdrawal large numbers of coins to wallet, the exchange shuts down or delists the coin or stops withdrawals and goes and buys the coins up on a second exchange or just refunds the order in bitcoin at the current price. Many people are also buying paper bitcoin because they are not withdrawing the bitcoins to their wallet and the exchange is running fractional reserve. This severely suppressed the price of the altcoins and allows exchange operators to engage in massive price manipulation. For Skycoin we want to keep the bitcoins/skycoins in the wallet with the private keys on the computer as much as possible.

3) Hiring contractors. This is difficult. We have tried this a couple of times and it failed. If the project is too large or complex, then outsourcing fails. So we are trying to outsource smaller fixes and improvements that are limited in scope and are very clear.

4) Consensus implementation. No one is working on this right now, but its important that this gets done. The design for multi-round consensus is done and should be one or two thousand lines of code, its not that much. So will be done quickly after its started.

5) Getting the skycoin.com website up. The domain is registered and cloudflare is setup and has been for six months. There are four people with access to the account and I do not understand why the website is not online for wallet download.

## Longer Term:

The GFW is a nightmare.  We funded three different teams to work on pseudo-wire implementation for tunneling traffic and designs for multi-hop, multi-homed VPNs. However, we now have VPN/TUN adapter code from the gohop project that works on linux and can separate out the VPN front-end from the pseudo-wire implementation and get something working quickly.

##### Experience with the GFW has changed the design requirements for the VPN/meshnet.

- The GFW is doing protocol enumeration attacks, where if it suspects an openvpn server, it is making connection attacks to the server and if it sees OpenVPN, then it is throttling the connection. Therefore Skywire needs to use preshared keys and ignore or drop packets that don't the secret, to protect against network enumeration attacks.
- The set of nodes, if they can be enumerated by IP address are easily blocked by the firewall. An ISP can load a set of IP addresses for Bitcoin nodes, Bitmessage nodes, or tox nodes and just block that application. Making it impossible to enumerate the IP addresses of the nodes in the network, requires a change to existing idea of P2P. This is especially important for countries where authorities might try to identify and crack down on node operators.
- The firewall is cisco hardware and uses some type of simple machine learning to detect protocols differences. So if you use OpenVPN and it has an HTTPS/SSL wrapper and the protocol is similar to Apache HTTPS/SSL but there is a difference, like a single fixed bit or a difference in packet size during the hand shake, then it will try to determine that "This connection is OpenVPN and not actually HTTPS".
- The traffic is being blocked at the exit from the country. Traffic is being dropped based upon congestion and how much money is paid to the ISP by the subscriber. So going from China to Singapore is cheaper so those packets wont get dropped as much by China Telecom (unless it is peak hours) but China to California traffic will be dropped like crazy. Business traffic will be dropped less than residential traffic, because they are paying more money. This means, that to get the best speeds, you have to bounce first within china to a fast server, then bounce from that server out of the country on a business line. You need a multi-hop VPN and that doesnt exist, except for MPLS and expensive corporate solutions, so we have to write that from scratch.
- The traffic congestion varies over the day. China to Singapore works certain hours but gets congested, but China to Japan still works. The routes that are congested depend on the time of the day, the source city and destination and are constantly changing. This means the VPN needs to be multi-homed and have two or three routes and change routes based upon congestion and latency. This requires breaking the messages into chunks and doing a simple Trellis coding, fountain coding over a sliding window, whose size depends on the path latency.
- The network needs to support asymmetrical connectivity. Packet drop rate and throughput is not symmetrical. Similar things occur in radio environments.
- The internal network needs its own address space. China, Russia, Brazil and other countries are breaking off from the internet and we wont have a unified global IP address space soon. We already see proxies with IP routing rules, to use proxy A for Chinese destination traffic and use proxy B for Japan and proxy C for US traffic.
- The Cisco traffic shaping equipment is using packet sizes and statistical information to determine what applications people are running under the VPN and then throttle them if they see P2P, bittorrent or Youtube activity. The protocol needs to use padding and fixed sized packets and minimize the statistical information about the underlying protocols.
- The firewall is injecting fake TCP reset packets or is dropping TCP packets strategically to throttle connections. UDP needs to be used and the link-layer implementation may need options for different types of throttling. TCP just keeps increasing the transmission rate until packet drop, then scales it back by half. TCP ignores latency. Each TCP connection is doing congestion control independently, so when you have 200 sockets open, the all compete. Balancing traffic in this environment is an open research problem, so congestion control and traffic management needs to be component that can be swapped out.
- We need Skycoin payments and settlement to give incentives for users to setup nodes and relay traffic.

So this is a new type of VPN and will require new software.

 After working on this for a year, we have a good idea of what architecture should look like to make it as simple as possible
- an interface abstraction at the link layer, so implementation can be swapped out (sstunnel/HTTPs for china, UDP for other areas)
- a basic or default link-layer UDP implementation
- an interface/abstraction for the return path for packet confirmation, to allow asymmetric connections
- a network namespace for nodes and service for announcing paths
- client side choice of paths (return to unix-to-unix copy type connection oriented source routing)
- an administrative control plane service or interface, for querying and controlling the state of a large number of nodes. Diagnostic information
- a path/route resolution service
- a VPN/SOCK5 pseudo-wire gateway server for tunneling back to IPv4/IPv6
- settlement and payment for bandwidth on external networks

So there is a large number of small projects. These are being outsourced to various groups. The main development team does not have time to work on this, except for design, until the high priority things on the coin are done.

This architecture requires a network daemon and requires a large number of small processes communicating with each other. Golang is very good until we got to this point. Then we have to choose network serialization like SWIFT, Thrift, capnpro, JSON or our own. We end up with two functions, one for golang when the service is being used internally and one when it is being called over the network and golang lacks the concurrency primitives to make this type of application natural in the syntax.

The networking primitives are subscriptions, events, synchronous and asynchronous RPC.

It is for instance, impossible to number the goroutines and then stop the goroutine in the middle of a function and then resume it from an external goroutine on an event. There are lower level atomic concurrency primitives that could be used to implement the golang channels, that are not exposed by the runtime and would be useful.

Right now, we have a struct and send it and then the remote server get it as an event and then there is a handling function. That works well for some types of programming (block sync) but
- in other instances you want to do a function call on a remote server and block within the function until the result comes in.
- Other times you want to do a "promise" for the result, so you can do N queries and not block on each query until you use the results. - Other times you want to push messages through and then have a channel that blocks until the responses come in and then processes them.
- Other times a process or object is receiving a stream of external events. Such as diagnostic information.

So the RESTFUL type handling does not always suit the application. I have to write a library for making writing these "serverlet" applications easier.

The functional or Nook/Urbit view would be to make communication between the serverlet, an ordered stream of messages, where each message is tagged with a wrapper with optional handler id echoed in the response, that denotes and object or function handling the response to the message.
- a message can be handled by a default handling function (RESTFUL, current, default) (all messages of type A are handled by the same function)
- a message can be handled by an event channel (all messages with tag A, are responded to with a message with tag A, which are passed to a specific event channel instance)
- a message can be handled by a specified function (all messages with tag A, get passed to a function instance A)
- a message can be handled by a handling function attached to a particular object (all messages with tag A, get handled by function attached to specific object instance)

The first type of response is used for static web content, like "Get me this picture" or "get me this page". The four type of response is used when when the page depends on user data (cookies, of whether the user is logged in) and there is an object or user state per user. The fourth type is used for challenge response (where state or communication history is required for the current message response).

- invariant functional (same data for all requests, all users, never changes. Ex. SHA256 of hash or javascript file by SHA256, content addressable networking)
- invariant (same data for all requests, but may change)
- state per user (depends on cookie or other user/auth)
- state per connection (state that depends on specific connection, such as bitorrent requests to specific user)
- state per request (request id)

When communication between two processes becomes a stream of ordered messages, then push and pull become the same thing.
- a remote server can push a message onto the channel
- the remote server can poll the server and ask for messages since message N

So synchronous and asynchronous message handling is unified or occurs through the same interface. Public broadcast channels and content addressable networking, generalize this to peer-to-peer multi-cast transmission and bitmessage generalizes to global anycast type transmission.

These are the types of requests in web-applications and the granularity for caching and building web-applications.
- web applications started with a page that queries database one by one and spits the html at the user
- web applications then were build by splitting them up to multiple backend apis, or separate serverlets and each serverlet gets queried and returns the results and the results are assembled into the widgets/components of a page. HTML is spit back at the user
- web applications are moving towards client side generation of the interface, with the client side making dozens of queries to the serverlets, which expose their APIs on the network. This is how Skycoin is written right now, especially the frontend and API.
- We are moving towards fully decentralized serverlets, where each process exposes an API to the network and the API is accessed the same for local severlets and remote serverlets. File systems become serverlets exposing an API over the network and a local file system becomes the same as a remote file system, which are accessed through the same interface. This is the direction that the Skywire architecture is heading

Skycoin is already very similar to this internally.
- The cryptography library is functional, it does not need an instance. It does not depend on anything external and can be used by external applications.
- The wallet library for reading/writing wallet files can be run on its own or used by 3rd party applications without running a skycoin node. Thin clients can query outputs over json and get the wallet and create/sign transactions and then inject them over JSON without running a node
- The history database for transactions (which currently does not exist yet) is a separate library/process that only depends on the blockchain library and the blochain database library. Most nodes do not have to even run this.
- The full node exposes most of its functions over JSON.
- The GUI and web wallet is built from data returned by JSON queries on the node.

Transactions, outputs and blocks all use content addressable networking.
- There is a single unique binary serialization of the object
- The SHA256 of the object is the ID or name of the object
- If you have a byte sequence that SHA256s to the same value as someone else, you have the same data, otherwise you can request it from the other person

There are a few things I would change about Golang, but it is "good enough" right now to use this type of architecture without writing too much code.

Skywire needs to be something simple, like Shadowsocks and it has to be written in phases, with the minimum amount done to get it working at each stage.  If you need a lot of code to get it working, it means the design is shit.
