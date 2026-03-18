+++
aliases = ["/development-updates/development-update-35/"]
date = "2014-07-23"
draft = true
tags = ["Development", "Consensus"]
title = "Development Update #35: Consensus Research Update"

+++
## Research Update

Incredible breakthrough on consensus. We have been discussing methods for distributed consensus, creating terminology for understanding the consensus process. We think we have a good formal mathematical model now.

We drew out a finite state machine diagram for client transition states and found a new way of reasoning about state. We discovered that there are security measures that can be layered on to coins, which provably only improve the security of the coin without possibility of introducing a new attack. The coin client has a finite state machine and there is an operator that composes with the finite state machine, creating  a new finite state machine. If a mapping from the new state machine back into the original state machine, exists, which satisfies a property, then no sequence of input exists where the new state machine fails where the original state machine did not also fail with respect to a security property.

The property was originally proven using a state machine and constructing a binomial lattice type diagram of the transitions for the state machine for a single input. The result generalized to machine with arbitrary sequence of input.

We are looking at Harel Statecharts and Hierarchical Moore Machines models now, for modeling the Skycoin consensus process and proving properties. We have very good results so far. If this works we can implement the Skycoin consensus system as a formal state machine being emulated by a golang program to ensure we get the mathematical guarantees on the security properties (such as state unreachability).


###### Types of Double Spending Attacks:
- Public Chain Forks: Two different groups of miners are mining on different branches, but are publicly publishing the blocks. This is not bad, because the client can run and replicate both forks. The client knows transactions are not final until the alternatives have been reduced to one. Exchanges avoid double spending by not crediting accounts until "10 confirmations AND there is only one public candidate chain". In contrast, Bitcoin switches from one branch to another aruptly, instead of running both alternatives until resolved and one chain is abandoned. Concurrent execution may be desired to switch over for some stability. Awareness of the publicly published alternatives allows exchanges and merchants to eliminate double spending as long as their clients are aware of the fork.
- Private Chain Forks: A miner with majority hash power, mines a longer chain in secret and then publishes it. Everyone switches to the new chain and previously "confirmed" transactions and blocks are reverted. This is the real threat.

Bitcoin is susceptible to double spending from Public Chain fork attacks, where a fork is public and eventually grows to overcome the main chain. Skycoin is not. The Skycoin client tries to be aware of alternate chains and for older history its impossible to create a public chain fork from blocks past a certain number of confirmations, which can become a consensus chain. The only issue left is ruling out chains that were mined in secret and then published to network.

###### We have identified two types of client behavior with respect to forks:
- Hard Forking: As soon as the client sees a longer blockchain, it switches over immediately (Bitcoin)
- Soft Forking: A client is aware of forks and maintains state for both chains. The client has awareness that there is not consensus among the publicly published chains. Exchanges avoid double spending by not crediting accounts or counting transactions as executed until there is a single alternative chain (or until the transaction has been executed on both candidate chains). This is how Skycoin handles forking behavior.

We show that public chain forks are benign. They cannot result in double spending with a properly designed client.

We show that timestamping can be used to eliminate the Private Chains from being accepted. This is the last challenge to eliminating economically significant double spending attacks in Bitcoin like systems. For simplicity, we examine different centralized solutions, then will discuss decentralized alternatives.

## Example System for Analysis:

###### Example 1: Insecure Time Stamping
- Security property: 51% attack proof (a person should not be able to get client to change to a blockchain fork  once a block has reached 10 confirmations.
- In Bitcoin the longest chain is valid. A person can mine a longer chain in secret and publish the chain and each node will switch to the new chain.
- Example Attack. At block 5 a person mines a secret chain fork to block 20. The public chain is at block 15. Block 5 has 10 confirmations.
- Attack: Each public node accepts the chain with 15 blocks as valid. The attacker publishes the secret 20 block chain. Each node sees that the chain is longer and downloads it. Each node switches to the new chain. Transactions may have been reverted (The attacker deposits Bitcoin to exchange, gets Dogecoin, then uses the chain fork to revert the deposit transaction. The attacker now has his Bitcoin back and the Dogecoin).

###### Here we have:
- Node state
- Condition transition between the nodes states
- An attack success state
- A security property (reachability of the attack state)

Assume we have a trusted 3rd party time stamping server. The server signs each publicly announced block after it has received five confirmations. A client will use the time stamps to determine which chain is valid.

###### In this system:
- An attack on the time stamp server can be used to 51% attack (by only signing blocks on a chain fork instead of signing the public consensus blocks, resulting in the clients rejecting the valid chain.)
- An attacker with majority hash rate cannot perform a 51% attack without also compromising the timestamp server. If they mine a longer chain in secret and later publish the chain, then the clients will examine the time stamps by the 3rd party, realize that the blocks which would cause a 51% attack were not published to the network and reject the chain.

This system is not stronger than hashing. It introduces a new attack state transition (compromising the timestamp server).

## Diagrams

To simplify analysis, we will gloss over network state and focus on individual clients. We will also simplify issue of orphan chains. To simplify analysis and diagrams, we assume that
- The client has a consensus chain (the longest chain the client knows about)
- We ignore issues of orphans and assume blocks are either successors to consensus chain or an unpublished side chain, that is being published in a 51% attack.
- This analysis for simplicity is client level, not network level

Some of these nodes are "State nodes" which represent changes in state of the client chain. The state nodes are the symbols the model emits in each round in response to an input. Other nodes are decision nodes, where a node must make a decision. There is actually a series of "state nodes" in succession, an input comes in and then an output is emitted by the machine on certain nodes, then the machine resets and the next symbol comes in. The diagram over a sequence of inputs actually looks like a linked Markov model diagram. Each transition node itself, could be a program which looks at some state variables and outputs the transition.

The decision nodes, themselves may be state machines themselves (hierarchical state machines). The network enters the sub-machine and the submachine emits the transition the parent machine is to take, as an output.

These diagrams are simplifications of a more precise hierarchical state transition model which is still on paper. Issues such as netsplits, clients joining the network are ignored as special cases.

## System 1
![](/img/dev-update-35-1.png)

###### Rules:
- Normal Bitcoin
- Client Accepts Longest Chain accepted

###### States:

**S1**: Client accepts new block on existing chain
**S2**: 51% attack. Client accepts chain that forks at a block which has more than N confirmations

###### Transitions:
**T2**: Normal operation. Addition of blocks or acceptance of new chain, which does not fork at a block with more than N confirmations
**T1**: New chain is longer and forks at a block which has more than N confirmations

###### End Nodes:
**S1**: emits action to do nothing or extend the current consensus chain
**S2**: changes the consensus chain

The client reaches S2 and the 51% attack succeeds only if the new chain is longer (more hashing power).

## System 2:
System two is system 1 but with a developer run timestamp server, to prevent 51% attack

![](/img/dev-update-35-2.png)

###### Rules:
- Client accepts longest chain
- If blocks with more than N confirmations must be signed by time stamp server or are rejected

###### States:
**S1**: Normal Functioning (stop node)
**S2**: A new longer chain has been presented to client. The presented chain forks current consensus chain before a block that has N confirmations. The client needs to decide between the old consensus chain and newly presented chain. The client accepts the chain based upon time stamps
S3: Attacker succeeds and attack chain was accepted

###### Transitions:
**T1**: Normal operation. Extension of current consensus chain. Block must extend the current chain. If addition of the new block to the chain would cause the block to go over N confirmations, then it must be timestamped by the server.
**T2**: New longer chain presented to client
**T3**: Client accepts chain which is potential 51% attack
**T5**: Client rejects 51% attack chain and maintains current consensus chain
**T4**: 51% attack without majority hash power. Attacker compromises timestamp server and client rejects the legitimate chain for the attack chain. The client will reject blocks with more than N confirmations, which do not have timestamps. The attacker simply only timestamps the attack chain, until it becomes longer than the current consensus chain.

###### State Nodes:
**S1**: emits action to do nothing or extend the current consensus chain
**S3** changes the consensus chain

###### Decision Nodes:
**S2**: checks time stamping server to determine whether to reject the 51% attack chain (T5), or accept the chain (T3)

The machine starts at S1. Under normal operation (a new block extending the current consensus chain) T1 is taken and the consensus chain is extended uneventfully.

###### There are 4 conditions:
1. Normal operation (no 51% attack and working timestamp server)
2. 51% attack and non-compromised timestamp server (attack fails)
3. Attacker does not have enough hash power to create a longer chain, but compromises the timestamp server to get clients to reject the legitimize chain (attack succeeds)
4. Attack has majority hash rate and controls time stamp server (attack succeeds)

###### This system is interesting:
- It cannot operate without the developer timestamp server. the system stops without the timestamp server
- The timestamp server has no control over transactions in blocks but can veto blocks and cause small forks which revert up to N blocks by not time stamping blocks from that chain
- With linked timestamping, signatures and peer-to-peer replication, the timestamp server cannot backdate timestamps
- There is no 51% attack. After N block, confirmation consensus cannot be reverted, regardless of hash power. Transactions are finalized
- Depending on implementation the 51% attack requires compromising the timestamp server and backdating timestamps (which can trigger a STOP condition, requiring human resolution). This should be treated as a special condition which cannot be handled automatically in software and requires human judgement.

# System 3:

Here we use a timestamp server to rule out chains that were mined in secret and later published. However, we only fallback or even look at the timestamps if a switch over between chains is being considered. The timestamp server can prevent a double spending attack, but cannot be used to cause one.

- System 3 is system 2 with the T4 transition removed.
- System 3 is exactly like Bitcoin normally
- A third party timestamps blocks as it sees them, signs the timestamp and publishes it
- A 3rd party block timestamps only when a client receives a chain which would cause its consensus chain to change. Otherwise timestamps are ignored.

###### Rules:
- The timestamp server timestamps all valid published blocks as it sees them
- Timestamps are only used in S2. Timestamps are only examined if an incoming blockchain is long enough to become the new consensus chain and if that chain would replace the existing chain.
- **S3** state literally means "Accept new longest chain"
- **S1** state literally means "remain on current chain"

![](/img/dev-update-35-3.png)

###### End States:
**S1**: Extend current chain by one block or do nothing
**S3**: Accept new consensus chain (accept fork)

###### Decision States:
**S2**: Check timestamps on forked blocks and decide to accept the chain as the new consensus chain(S3) or reject the chain and keep the current chain (S1)

###### Transitions:
**T2**: A new longer chain has appeared that would change the consensus chain. Move to S2
**T5:** The timestamps of the new chain were examined and the new chain was determined to be a 51% attack attempt (someone mined an unpublished chain until it was longer than current public chain and then published it). The new chain was rejected.
**T3**: The attack chain was accepted

###### In this system:
- Two systems, instead of one must be compromised. The attacker must control both the timestamping server and must have majority hash rate, for the attack to be successful. The previous system failed if either of two systems were compromised. The current system "composes" by replacing a state node with a a sub-machine, which is only triggered if the first security measure has failed.
- Compromising the timestamping server cannot result in a 51% attack
- It is impossible to mine blocks in secret and the publish them to network to 51% attack, if timestamping server is working


## Challenges:
- A client connecting to network must ensure that it has the same head and consensus chain as the other clients before running this algorithm, or it may end up in a different state than the other clients. Discussing this edge cause would complicate discussion, but there is a resolution if you work through it.
- Clients need a notion of "network state" and need to ensure they are converged. We think we have this solved (but not within Bitcoin framework, will discuss it later). Skycoin clients have notion of "network state" which is different from client state. Each client only has local information, so sometimes network state can only be inferred probabilisticly and requires a randomized process for global convergence from local information.

## Assumptions:
- Blocks may come in, in different orders on different clients and state of client will be same eventually, but propagation delay has to be reasonably low. We assume that if a block is valid the client will have received it reasonably quickly. Although blocks may come in different order on different clients,  If a block exists but is not propagating, the client needs to know, or else it can end up in a divergent state from the other clients.
- The client needs way of getting to the consensus state the other clients are in, before beginning the process or it may end up in a divergent state
- Monitoring whether the node is "converged" is part of the "network state". Network state is a property of the whole network of nodes, as opposed to the individual client or node state. Local state is based upon local information, where as Network state is an estimation of a property of all nodes as a network. The most important network state attributes for ensuring convergence, are netsplit detection and determining whether blocks exist that have been published publicly but which the client is not receiving within a temporal window.
- As long as the client can accurately estimate global state variables, then the edge cases at client startup and during netsplits can be mitigated. The attacks resulting from invalid global state estimation are rare, difficult to produce and not that severe. They can be ruled out by simply cross referencing the local client's estimate of global state variables against a number of user chosen trusted clients. Global state estimation can be made arbitrarily reliable, depending on the requirements of the applications (exchanges which may be subject to double spending attacks will want higher reliability in global state variable estimation, where as normal clients will likely not care).

## Implications:


By using a honest third party service which timestamps each block we can eliminate the Private Chain Fork attack. The timestamp acts as a proof of publication of the block. Blocks mined in secret and then later published will not have timestamps and therefore can be identified as 51% attack attempts.

## Fair Timestamping:

The original Skycoin consensus system, gives each user a personal blockchain. The users publish blocks and subscribe to other user's blockchains. When a user becomes aware of a block, they publish the hash of the block in the next block published to their personal blockchain. Each published block is timestamped and therefore attests to the existence and publication of the block.

## Alternatives:
- Web of trust, distributed timestamping system (like Skycoin)
- Delegated Proof-Of-Stake is used to elect five "fair" timestamping servers
- Putting the timestamps in the Bitcoin blockchain
- Putting timestamps or block headers in different altcoin chains and then referencing them against each other. This exploits tags like Mastercoin uses, which are not stored in the unspent outputs but which can be embedded in blockchain and querried.
- Each coin can be check-pointed in the blockchain of other coins and the checkpoints countersigned. A significant 51% attack which reverts a coin back to significantly earlier block, now requires simultaneously 51% attacking a dozen other coins. This is Skycoin's distributed timestamping system, but operating on altcoins chains instead of personal chains.
- Banks and financial institutions running centralized cryptocoins who do not want to incur the security costs of mining, may run their own centralized timestamping servers

## Proof-of-Stake with Delegated Timestamping:

###### Bitcoin combines three separate things in a single entity in the block headers:
- Consensus, determining which chain is the correct one, "network state"
- Choosing who gets to create each block
- Rate limiting block creation

In Bitcoin these separate functions are combined into a single block header.
- The group of miners with the most hash power determines which chain is valid
- The miners choose what is in each block
- Difficulty rate limits block creation rate

However, it does not have to be designed that way. In Skycoin these functions are separated out in a more fine grained way.

###### We could imagine a system where:
- Blocks are created by hashing through Proof-of-Stake (coinhours can be burned to reduce target or substitute for hashing).
- Proof-of-Stake is used to elect five timestamping servers (one coin one vote). Bad timestamp servers are automatically voted out.
- Each block is timestamped and signed by the public keys of each of the five elected servers. Consensus is determined by the timestamps (first block published wins. average of time the five timestamps).
- The timestamp servers will only sign blocks after they have been confirmed for five confirmations
- No block rewards for mining
- transaction costs in coinhours (no transaction costs, but rate limiting through coinhours)

###### In these systems the questions to ask are:
- Who determines what blocks are created
- How is the consensus chain determined

There can be different groups of people serving these functions

The consensus mechanism can be complex, can be outside of the blockchain and can contain multiple factors or mechanisms. Hashing is the weakest mechanism and most expensive per unit of security. Proof of stake is second mechanism but also imperfect. An ideal system would combine Proof of Stake with a second mechanism indepedent of coin ownership, where even a majority coin holder could not attack the system without also compromising the independent mechanism.