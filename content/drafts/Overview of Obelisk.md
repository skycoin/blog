+++
draft = true
title = "Overview of Obelisk: Distributed Consensus "
tags = [
    "Development",
    "Obelisk",
    "Consensus",
]
date = "2013-12-27"
description = "A brief overview of the distributed consesus behind Skycoin "
+++
# Overview of Obelisk: Distributed Consensus

In Obelisk, each person runs their own Obelisk nodes. Each node has a set of trust relationships with other nodes. Each node has a list of servers it "trusts". A new node can be initialized by randomly choosing a few dozen existing nodes to trust, with only two or three of the nodes being nodes run by trusted institutions or persons.

Servers publish "blocks" every 5 seconds. Blocks are sequential and it is detected when a node backdate a block or retroactively change an already published block. It uses a very secure linked time stamping scheme.  The block publishing creates a "public broadcast channel" and that is the key primitive in the Obelisk protocol.

In Ripple, clients can cheat or fail to obey the protocol and it cant be detected. Consensus protocols only work if all nodes obey the protocol, which is a bad assumption if there are financial incentives to cheat.

Skycoin solves this by having Obelisk nodes publish both their decisions and the data needed to reconstruct the decisions. Obelisk nodes receive blocks from other nodes, time stamp them and include the time stamps in their blocks. We can audit servers for causal violations.

Obelisk nodes publish enough information for 3rd parties to replicate their internal state. During an audit a 3rd party can reconstruct the internal state and simulate decisions of a particular Obelisk node and will produce the same successor block as what the server published, if the server is in fact obeying the protocol.

If a node cheats, other nodes will sever their trust relationship with it. You can create a proof that a node cheated and it give it other node and they can verify it. If the node is colluding or something something strange, that is not provably wrong, it can be detected because decisions are public and people running nodes can make decisions about their trust relationships with the colluding nodes.

Obelisk is a very simple protocol. Obelisk is designed to be simple to allow  security properties to be easily modeled with mathematics and simulation.

## Alternative Uses for Obelisk:

With a well defined state machine and scripting language, Obelisk may in in the future support OT style digital contacts off the block chain which can be executed between counter parties. Each counter party would be an Obelisk node with its own independent block chain.

However, right now are extremely focused on a version of Obelisk specialized for blockchain consensus.

## Open Problems:

When Skycoin development began, there were two open problems with Obelisk. The first problem was proving the identity of a node without key reuse. Key reuse introduces timing side channel attacks and weakens the crpytographic security of Skycoin. In our security audits we found that attacks on the identity infrastructure for Obelisk nodes would be significantly easier than attacks on the Skycoin blockchain and transaction infrastructure.

It was not until last week that we had a solution to avoid key reuse in the identity protocol. We have a very good solution now, that meets our standards for elegance and cryptographic security.

The second problem, is that consensus protocols need to take into account netsplits. If connectivity is severed between two sub-graphs of the network, it breaks some of the assumptions when the networks remerge. We like the assumption that a block is consensus is final once it has been reached because it eliminates double spending. However, if two subgraphs come to different irreversible consensus results during a netsplit, it is problematic. Either the fork must become permanent or consensus is not in-fact irreversible.

The netsplit problem is not unique to Skycoin and is actually much worse in Bitcoin. There are netsplit based attacks on Bitcoin that allow double spending. The ability to selectively control the peers a node can connect to, enables very specific and highly targeted attacks that Bitcoin does not even attempt to address. This attacks require control of hardware at the ISP level and we have not seen them yet, so they are still theoretical.

Skycoin has a preliminary solution to the network split problem.  However, it is not high on our priority list right now.




