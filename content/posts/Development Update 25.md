+++
aliases = ["/development-updates/development-update-25/"]
date = "2014-06-18"
draft = true
tags = ["Development", "Consensus"]
title = "Development Update #25: Further Enhancing the Obelisk Consensus"

+++
## Summary:
We figured out way of preventing Sybil attack using a hybrid Proof of Stake system.

To create a node, you must prove you have coins. Say 10 coins. You send 10 coins to address A. Then you send the 10 coins from address A to address B. Then you add a signature using the public key in address A to sign a message in your Obelisk blockchain.

Alternatively, you could publish the public key for address A and then just sign a message with that public key. The node would have to publish a signature every time period, or within some number of blocks of the reserve coins being moved, in order to maintain valid trust relationships with other peers.

Alternatively, proof of burn could be required, where the coins are sent from address A to an address B that has no private key. Proof of burn conflicts with the requirement that no one should need to download the whole blockchain from the beginning to operate a full node, so is unlikely.

This system upper bounds the number of Obelisk nodes and restricts the ability to run Obelisk nodes to coin holders.  The upper bound on the number of nodes and coin requirements adds another layer of Sybil attack protection.

Just an idea at this stage. Found an improvement. Each Obelisk node, has a public key. We hash the public key into an address and then it stores 10 coins in an output owned by that address.

It does not add a cost. It just proves that you own 10 coins. It proves you know the private key, for a public key, whose address has 10 coins in it. You can still spend the coins.

The idea is that it upper bounds the number of nodes. If 10 coins must be held and there are 100 million coins, then it upper bounds the network at 10 million nodes. The upper bound does not appear to be mathematically useful right now, but is something we should keep in mind.

When a new Obelisk node is run, it will "trust" some random peers. The user can also add a few nodes by hand that it trusts (exchanges or trusted community members). A node is identified by its public key hash and found by DHT. Its not like Bitcoin where nodes are IP:port pairs. You can move your computer around and the identity of the node does not depend on its IP address.

We want the network to be secure with random nodes being chosen. We don't want a situation like Ripple, where the three developers nodes control the network. However, we wanted to prevent a situation, where someone runs 200,000 nodes and tries to collect the trust relationships from new users. These Sybil attacks nodes, still cannot 51% attack generally, but anything that increases the cost of the attack is still useful.

Maybe, we restrict it so that new user will only randomly trust nodes that have a coin balance. Trust relationships wont be severed if the node does not have a coin balance, but they just wont get new random users.

The connectivity graph for trust relationships, is supposed to be a fully connected random graph. A few nodes (trusted community members, exchanges, websites, organizations) will have more trust relationships and that helps the convergence time for block consensus a bit. It reduces the network diameter a bit.  Some nodes will be used to verify consensus (you choose a bunch of exchanges or different public keys), these nodes do not affect consensus decisions, but are "consensus oracles" to check if your node has converged with network.

If two large exchanges have different consensus for a particular, block, that is a problem. It could indicate a netsplit or an attack on the network. Exchanges may want to suspend trading until the issue is resolved.