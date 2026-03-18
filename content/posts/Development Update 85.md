+++
aliases = ["/development-updates/development-update-85/"]
date = "2015-09-19"
draft = true
tags = ["Development"]
title = "Development Update #85: Skywire Mesh-net Cleanup"

+++
I simplified the lowest level of the networking. I stripped everything out.
- The mesh network protocol is now so simple that it can be operated by hand, over paper, punch cards or carrier pidgeon if the internet is destroyed and humanity loses the ability to use electricity.
- the algorithm being used is scale invariant in time. It works over milliseconds, seconds, days, months, years, centuries. The key parameters between two links is the bandwidth/latency product (the bandwidth of the link in bits/second times the latency between when a message is sent and when the confirmation of receipt is received). That defines the buffer size (which is bounded and finite) for the connection between two nodes.
- The simpler, human readable version actually works better
- The network allows for directed, one way communication paths between nodes. It does not assume two way communication at the link layer.
- With a network with three layers of protocols, the message is guaranteed to get through eventually (even decades or centuries later) as long as the nodes do not end up on two disjoint subgraphs of the graph of transitive closure of the layer 1 connection graph.
- the routing can be done, by hand, by a human, using file cards and an double entry accounting table. The most difficult operation is keeping lists sorted for log N lookup.
- operating over punch cards is immune to the NSA
- If the internet goes down and there is no longer a blockchain, the system of debits and credits still functions by hand.
- Transactions can be still be processed and peer-to-peer replicated by hand if each node can do SHA256 and secp256k1 signature verification
- if the internet goes down and there is no electricity, transactions can still be processed by hand and it is guaranteed to be conflict free as long as each node in the network can agree on a hierarchical embedding.

The graph of nodes and communication pathways at link-layer is a directed graph. The graph of connections is a directed acrylic graph.

The graph of transactions is a directed bipartite graph, with each node A being transactions and node B being outputs. There is an arrow from A to B if transaction A creates output B (if output B is created by the execution of transaction A). There is an arrow from output B, if A is an input to transaction B.

If each node in the communication graph designates one or more other nodes as "superior" or "trusted" and that graph is hierarchical or at-least acyclic, then  there is a message passing algorithm on that graph, that uniquely determines a total or partial ordering of the transactions in less than log(n)^2 ticks,  in the depth of the graph, assuming each node broadcasts one message per tick.

We may not need a blockchain anymore and all the research and benchmarks we did may turn out to be pointless.

For a closed set of nodes, where every node in the network is known, we do not need a blockchain. The only purpose of the blockchain is to create a partial or total ordering of the transactions.

I am looking to see if there is a decentralized way of stably assigning each node in a directed graph an integer or hash, that would lead to a natural partial or total ordering of the nodes. This problem seems very similar to the secure decentralized coin flipping protocol. I am still doing research on this.