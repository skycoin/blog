+++
aliases = ["/development-updates/development-update-81/"]
date = "2015-09-10"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #81: Skywire Infrastructure Update"

+++
## Exchange Overview:

This is a prototype for a next-generation exchange infrastructure.

http://github.com/skycoin/skycoin-exchange

This is very rough. Your username/login is a public key. Your identifier is a hash of your public key. You sign your messages to the exchange with your public key. This will be stored in a json file locally on the client.

```
//send this with every request
//
type MsgAuth struct {
   Address   cipher.Address
   Hash      cipher.SHA256 //hash of the JSON message
   Signature cipher.Sig    //set to zero
   Type      uint16
   Seq       uint64 //nonce, unix time, nanoseconds?
   Msg       []byte
}
```

On the client, each function will be exposed as a JSON/HTTP request

```
/*
   The server gets events from the client and processes them
   - get balance/status
   - get deposit addresses
   - withdrawl bitcoin
   - withdrawl skycoin
   - add bid
   - add ask
   - get order book
*/
```

```
//get status
type PingStatus struct {
   Auth MsgAuth //must be included with every message

}

type PongStatus struct {
   Err string //error?

   Balance map[string]uint64

   DepositAddresses []string

   //list of orders unexecuted?
   //bid orders?
   //ask orders?
}

func (self *server) HandleStatus(in PingStatus, out *PongStatus) {
   addr := in.Auth.Address //user ID

   account := self.AccountStates.GetAccount(addr)
   if account != nil {
      out.Err = "account does not exist"
      return
   }

   out.Balance = account.Balance
   //out.SKY_balance = account.SKY_balance
}
```

```
//withdrawl coin

type PingWithdrawl struct {
   Auth     MsgAuth //must be included with every message
   CoinType string  //string for coin type
   Address  string  //address
}

type PongWithdrawl struct {
   Err string //error?

}
```

There will be a couple of functions like this. The exchange is designed for machines, not humans. It is designed to be integrated into the Skycoin wallet.

The libraries can create Bitcoin, Skycoin, Litecoin, Dogecoin addresses and transactions. You can withdrawal coins from the exchange and back to local wallet with one button.

The exchange is not meant to hold persistent balances. It is only for transacting between the coins.

The data feed that comes from the exchange, gets stored locally. Then you generate the exchange front end from your local data store. This means the response time is instant. It is not querying a remote server for data. The user also can choose their frontend and modify the software for the gui or run algos for trading on top of the exchange API.

The exchange is not distributed, but is federated. This means there can be multiple exchange instances, run by different people that can be accessed, with the same standard API.

##### You may
- create an account on the exchange
- deposit coins into the account
- then transfer them to another account on the exchange.
- Then the person may withdrawal the coins to their wallet

This enables very fast off blockchain transactions.

Bitcoin may take 10 minutes to move. Skycoin takes 10 seconds to move.
- if you have Skycoin and need to send someone 1 Bitcoin
- you send the exchange Skycoin
- the exchange sells the Skycoin for Bitcoin
- the exchange sends the Bitcoin to the address

So the exchange never needs to hold coins for more than a few minutes. Its not designed like MtGox, where the exchange is going to hold a million Bitcoin until they get hacked and stolen.

The exchange will have a common API for querying and balances and transactions for multiple coins (Skycoin, Bitcoin, Litecoin, Dogecoin).

There is a Chinese company that will build a mobile wallet on top of our libraries, that can store and send multiple coins in the same wallet.

## Meshnet:

Massive progress on the mathematical basis of the meshnet.

I found the perfect mathematical representation and method for the meshnet/darknet. The whole meshnet may only be 4,000 lines of code at most. However, it uses an expensive secp256k1 cryptographic operation that takes 250,000 CPU cycles and adds 1 to 4 ms of latency per packet.

I am using openssl with two layers on encryption on a cell phone and it drains the battery. This approach would absolutely annihilate the battery, on the cell phone, but is so elegant compared to the alternative, it maybe the easiest thing to start with.

Maybe can use 64 bit prime and generate a random curve and base point for each connection instead of using the 256 bit curve. This could be broken in a few minutes on a regular computer, but does not matter because it only allows people to forge packets on a path, but the packets are meaningless and traffic is still protected by the end to end symmetrical encryption. So it still achieves the mathematical elegance of the elegant approach and maintains source independent networking.

Instead of doing exponentiation by 256 multiplications on 256 bit numbers in a 256 bit field, this would do exponentiation in 64 bit field with 64 multiplications. I have to do benchmarks to make sure I can do 10 to 20 datagrams a second, without killing the cell phone battery.

So maybe support for a 64 bit, 128 bit and 256 bit secp256k1 curve.

## Meshnet Traffic Analysis:

I have also determined that there is no way to stop traffic analysis attacks. If the attacker knows your computer is off or on or has a node on the path you are using, or can listen in on the encrypted traffic they can do traffic analysis and each packet leaks a fractional bit of information. With enough bits of information, they can identify a path, determine whether a specific path transited over a particular link.

If you need anonymous communication, you need to route through a remix network.

- You need a set of nodes, that are sending fixed bandwidth of messages between each other (example: 1 Mb/s) that does not depend upon the traffic being send between the nodes
- You need to bounce through multiple nodes onion routing style
- You must transmit data at a constant bit rate and packet size (one packet per second, every second with  1024 bits per packet)
- at least one node in each bounce must be trustworthy or not belong to the NSA. Ideally your organization should be running the remix nodes and from physically secure locations.
- you need to use asynchronous messaging, not real time

That is the only way to get privacy at a mathematical level. Everything else leaks fractional bits of information.

Another approach is Bitmessage type networks, were every message is replicated peer-to-peer to every peer in the network.

Another approach that is more bandwidth efficient, is to use linear homophobic encryption and network coding over a fixed topology of relay/mixer nodes. This is still an open research area, but there will be functioning networks within a decade on this method.

If each node publicly recorded
- each packet
- its path identifier
- the time it was received
- the time it was sent out and to who

And published this data publicly, then it would not reduce the privacy of the network.

## Meshnet/Darknet Structure

I found a way of doing source independent networking for the network.
- a node has a public key and hashes public key to an address
- a route is also identified by a public key
- a node can push or pull over a path and "subscribes" to the route
- each message on the route is signed by the public key for the route

In the graph of nodes, there are transitive closures over a communication path

If node A is connected to B, A->B and B->C and A->C

If path A->C gets blocked, then A can use the transitive closure and send data A->B->C

The way the math works, point-to-point, any-cast and multicast are unified. multi-homing and the default case are unified.

Multi-homing means
A->B1->C
A->B2->C

It means that traffic from A to C can be multiplexed over both routes. Then A exposes this as A->C

The networking is also, asymmetric. This means that the data-flow can be uni-directional and the control channel can be on a transitive closure to the data source.

I am not doing network coding yet. I have not reduced it to a tractable math problem yet.

There is a very important parameter for the network called the bandwidth latency product. It is the product of the bandwidth per second between two links and time between when a packet is sent and when the confirmation of a packet is received. This defines the size of the window of data in transit between two nodes.

So if you have a connection that is transmitting to Mars at 1 Mb/s and it takes 13 minutes there and back. It will be 13 minutes until packet arrives and 26 minutes until packet confirmation. So if packet drops, then you will not be able to re-transmit for 26 minutes. There is 780 Mbits of data in the transit at a time. Then another 780 Mbits which has been received, but is awaiting confirmation.

The highest throughput path and the lowest latency path are different.
- latency from sending to receiving
- latency from sending to confirmation
- maximum bandwidth along the path
- available bandwidth along the path

Latency and throughput are difference criteria. There are different paths that minimize these.

The network need to be scale and time invariant. So if you have a truck, with a node with a 1 TB hard disc, that drives between two access points every 8 hours. Then it can ferry 1 TB every 8 hours. It will have a fixed buffer, for each path and will fill up the buffer, then when it has access, will dump the buffer.

This is a multi-agent system. Each node is an agent. It has two levels
- individual nodes
- groups of nodes controlled by same person

Each node has inputs/output connections. There are things like peering connections, meaning that your network and another network agree not to charge each other for transit.

You have a mixture of cooperation and competition.
If there is a path
A -> B
B -> C

And A->B is on one network controlled by person 1 and B->C is controlled by person 2. Then you may both make more money by creating path A->B->C and announcing it as A->C and then splitting revenue over path.

So this type of network has
- nodes
- paths
- routes

I do not have the optimal algorithm yet or a good rule for aggregation of paths across the network between two pool operators.

You have
- local metrics (for individual node)
- metrics over your internal network of nodes
- global metrics over the whole network of nodes

So a node may use a lot of bandwidth, but if the bandwidth is between nodes within your network, then over the network the cost sums to zero. It balances out. You are charging yourself for bandwidth and crediting yourself for bandwidth.

Maximizing over whole network is another thing.

Then there is congestion control. Which is difficult. In TCP/IP, congestion control occurs by waiting for packets to drop and then halving the connection speed. In Skywire, the bucket fills and latency increases. The connection is not bidirectional, so there is no direct control channel for confirmations. So it is similar to UDP but is only in one direction.

In TOR there is one algorithm for encrypting data going forward and one for data going backwards. Here there is only one algorithm.

Another thing is that the identifier of the node and the location of a node are two separate things now. A location is a position of the node in the network topology and an identifier is a public key. A node knows its connections and maybe the second degree connections. There are location sensitive hashes where two things that are close together will hash to similar values. There is a network topology where each node is a fixed number of hops from any other node, while keeping memory usage constant.

Normally developers throw together whatever they can with the tools they have. The power of the software is at the level of the scaffolding they are building on.  For these types of projects we have had to build two or three levels of scaffolding from scratch, just to make it tractable. To work, it needs to be simple in terms of the number of concepts and components. The concepts need to be simple, but they appear complex because they are new. I do not think a viable network is possible on the same networking concepts as IPv4.

Nothing like this has ever been built before. I am simplifying it as much as possible.