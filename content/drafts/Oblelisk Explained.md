+++
draft = true
title = "Obelisk Explained"
tags = [
    "Obelisk",
    "Consensus",
]
date = "2014-03-24"
+++

## What is Obelisk?

Obelisk is what makes Skycoin, Bitcoin 2.0. Obelisk is a sustainable alternative to proof-of-work. Obelisk is a system that replaces proof of work for blockchain consensus and eliminates the possibility of a 51% attack.

Obelisk was inspired by academic research into adversarial distributed time-stamping and algorithms such as Ben-Or's, Paxos, and the Castro-Liskov PBFT algorithm. Obelisk is a new solution to the Byzantine Generals problem which offers strong mathematical security guarantees, even when the majority of nodes are hostile.

## How does Obelisk Improve on Bitcoin:

Obelisk and specific design decisions may allow Skycoin to achieve transaction confirmation times as low as four seconds, without compromising security.

Skycoin does not waste electricity or consume exponentially growing, unsustainable amounts of electricity unlike Bitcoin.

Skycoin cannot be 51% attacked. No matter how much money or hashing power an adversary has, they cannot reverse transactions.

## Obelisk Technical Aspects:

Obelisk allows consensus on multiple concurrent branches simultaneously so the network does not stop for consensus. For instance, if there are two outstanding candidate branches in the possible consensus set and both branches have executed your transaction, your transaction is effectively executed and the outputs available for spending regardless of the future consensus decisions. The output hashs only depend on the input and the transaction hash, not upon the block the transaction was executed in.

The chance of a blockchain fork at block X in Skycoin approaches zero exponentially quickly in the number of blocks minted on top of X. Therefore increasing block rate improves Skycoin security (up to a point) where as increasing block rate decreases Bitcoin security (increases orphan rate). In Bitcoin, the effort required to fork at a particular block is the network hash rate times the time since the block. Decreasing the time between blocks leaves this number constant. Forking a chain with 10 blocks one minute apart requires the same level of effort as forking a chain with one block 10 minutes apart.

In Skycoin each Obelisk node has a "public broadcast channel" which timestamps block announces and counter timestamps the arrival of messages from other Obelisk nodes (construction of public broadcast channel is in Obelisk paper). If a node attempts to revert network consensus and fork the chain at a earlier block, the other nodes can prove mathematically that with high probability the block did not exist (was not announced to network) at the time the node claims to have made its local consensus decision in favor of the block.

Its possible to construct an unforgable mathematical "proof of fail" using the signed timestamps. The proof can be verified by third parties, showing the node is retroactively claiming consensus for a block that was not announced to the network at time it claims consensus. Any node receiving the proof would sever its trust (public broadcast channel subscription) relationships with the cheating node and furthermore you can safely sever trust relationships with any node that fails to sever trust relationships with the cheating node.

Ripple assumes that the nodes running the network can be trusted. Skycoin assumes they are cheating, detects the cheating and bans them.  Skycoin uses a "relational consensus" model, similar to Ripple but Skycoin should not be compared to Ripple because Ripple does not meet the Bitcoin criteria for decentralization.
