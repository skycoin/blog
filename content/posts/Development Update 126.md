+++
aliases = ["/development-updates/development-update-126/"]
date = "2017-03-09"
tags = ["Development", "Distribution"]
title = "New Skycoin Website is Live"

+++
### The blockchain explorer is up

* http://explorer.skycoin.com

### The next generation of the skycoin website is online

* http://skycoin.com

### Several bug fixes:

* Race conditions in networking pool fixed
* Blockchain explorer moved from node to golang backend server
* Congestion control added in meshnet library
* New wallet build etc...
* CXO was completely written from scratch and is now half the size and simpler
* The CLI interface is battle tested and all the major bugs fixed. Automated deposits and withdrawals are working flawlessly now
* Rreenabled peer to peer exchange of peers (PEX) and several improvements, such as only relaying peers that allow incoming connections.
* Skycoin now has installer on OSX and Windows. We do not have auto update or anything advanced yet

### We are :

* Creating a skycoin blog and moving appropriate content there
* Creating marketing content and a press kit
* Creating our next generation infographic set, revealing more about the project. We need to communicate more clearly and with a message that audience will understand and which they will come away with and be able to transmit or communicate to others. We will have another set of messages for developers/technology focused segment.

### We also made a significant mathematical breakthrough on the skycoin economy:

* You already receive coin hours for holding Skycoins (holding 10 coins for 1 hour, gives you 10 coin hours). These are used to pay transaction fees right now
* We figured out how to make Skycoin and coinhours convertible into tokens exchangeable for networking services
* This means we will be able to pay a bandwidth or network services reward to the Skycoin holders
* We are still evaluating if we should do this and if it would making holding Skycoin more attractive.

## Marketing

### We are:

* Opening up development community
* Starting chatrooms for the development community and skycoin community
* Starting a systematic and sustained marketing effort (content creation, internal channels, push to external channels, press kit). This area we have put no effort in to date. This has to be ready, by the time the first applications on our platform launch.

> Any technical updates on mesh network and all those exciting topics?

Yes. We are trying to get the first application working on CXO. Which is our peer-to-peer immutable data storage/exchange standard. We will start with a simple BBS system.

The meshnet works. Except when you try to send 50 MB at once, it dies because there is no congestion control. Look in skycoin/src/mesh . You can run a skycoin meshnet daemon and command line client now.

As soon as we have congestion control implemented and working, then we will get the old VPN application working on top of the new meshnet.

After almost a year of development, our cross platform terminal/app store/application widget is almost done. This will allow us to bundle and distribute all Skycoin applications with a single executable and installer.

### Right now we want to package:

* Skycoin daemon (and web + CLI client)
* CXO daemon (and CLI client)
* Meshnet daemon (and CLI client)
* The BBS application (and web client)

Those will be the first applications.

The meshnet, we may rename "SDN" for "Software defined Networking" or just call it "Skywire". "Skywire" will just be a specific transport module or configuration. This type of networking is more general than "Skywire" and is something new completely. This is a new type of networking, mathematically and it is its own namespace and independent from the current internet.

The meshnet or this new type of network, requires a centralized coordinator (Which can be decentralized, using a decentralized, shared state machine, like a blockchain). Eventually we will federalize the network into "Domains" or server groups and are trying to figure out what the best way to federate the network is.

This type of networking will work very well for a few hundred or thousand server, but to go to a trillion devices, we run into the BGP problem and have to logically split the network up into smaller groups, so that each node does not have to maintain the state information for the whole network.

The test network will have a "Coordinator" service, which will be federated like XMPP, that will act as a messaging backbone, to allow nodes to message each other and do route setup and teardown. The messaging backbone will also handle payment settlement and clearing for bandwidth.

This will create a sort of "bandwidth bank" that will create demand for Skycoin tokens. Then we may have a second token that only exists on an internal ledger on the communication backbone for network coordination.

I think people will give away bandwidth for free or allocate a fixed percentage of excess capacity to free level, but in congested areas where bandwidth demand is high (such as between cities and crossings of national borders), where there is congestion, there will be speed and throughput advantage for payment to receive a lower packet queuing delay (latency) or higher throughput. We are trying to figure out the best economic incentives and how to structure the Quality of Service and economic factors. For instance, the lowest latency and highest capacity routes will naturally be "congested" and there is a natural premium that will be earned to create an incentive for more network capacity in the choke point regions. For simplicity, we are starting with a fixed cost model, but will evaluate auction models later.

We also found several trade offs in testing. A node operator to have the lowest latency path, wants to minimize his packet queuing delay by keeping 10-50% congestion rate (only utilizing less than 50% of capacity on network). While a node operator who wants to have the highest capacity route and to carry latency insensitive traffic, will queue up to two times the product of his transmission rate, times the latency to receive a packet ACK from the other end.

Example. If you can transmit one packet in 1 ms. And you have 100 packets queued up, then it will be 100 ms until the last packet in the current queue is sent. So the node wants to make sure that the rate the packets are coming in, is equal to the rate the packets are leaving. The node also wants to minimize the number of packets queued up, to minimize queuing delay.

For bulk traffic (like files or video) or latency insensitive traffic, the queuing delay becomes irrelevant and we only care about maximizing the throughput.

So the packets in/ packet out rate only has to be equal and average out over a large time horizon (1 to 30 seconds), while for real time traffic (video games and voip) the packet in/out rate needs to be balanced so that we keep the packet out rate above the packet in rate at nearly all times, to avoid queuing delay.

So for real time traffic, we want to have the transmitting, upstream node, commit to a data rate. Or the data rate over the transport, needs to change more slowly than twice the latency between when we send a packet and receive an ACK from the next node in the chain.

This works perfectly for constant rate, real time traffic but does not allow for instant burst capacity. Information about rate limits and expansion of transmission rates, propagates \~twice as slowly as data packet flow through the network. So the packet rate ramp up will be much better than UDP and the maximum rate will be discovered automatically and more quickly than TCP, but it will not be as fast as UDP.

So still researching the best way to do this. The congestion control is very important part of the network design and we are just researching it.

A node operator, who is maxing out his throughput, will incur larger latencies. While the lowest latency path operators, will want to minimize their capacity utilization.

* file download, video streaming, CDN and latency insensitive traffic will flow naturally along one type of route. Asynchronous communication
* real time traffic and VOIP or video game will flow naturally on the lowest latency route. Synchronous communications

Our congestion control algorithm, will have a single parameter for allowing the node operator to set the desired congestion level (percentage of capacity utilization and buffer size) to specialize the node for each type of traffic (lowest latency real time traffic, or throughput maximization latency insensitive bulk traffic).

We have the low level infrastructure and architecture working. We are now building the higher level coordination infrastructure.

## Coin Supply Update:

Many people are confused about what the Skycoin supply is.

We added function to the blockchain info and to the blockchain explorer. It will automatically calculate the total supply, by subtracting out the locked coins.

This will make it clear what the Skycoin free float is.

We will also be adding a time lock, to make the locked coins unspendable until a certain date. We will post details to the blog when we figure out details.
