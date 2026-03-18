+++
aliases = ["/development-updates/development-update-29/"]
date = "2014-07-08"
draft = true
tags = ["Development", "Consensus"]
title = "Development Update #29: Summary of Skycoin Consensus Research"

+++
## Summary:

Its July. Meshnet was promised in July. Spec is done. Implementation in progress.

We end up writing everything five times and refactoring it before its perfect. Sorry this takes so long.

## Summary of Skycoin Consensus Algorithm Research to Date

###### We solved adversarial byzantine generals for full connected graphs with a:
- Cryptographicly constructed "**public broadcast channel**" with fully connected nodes, but solution does not scale to 300,000 nodes.
-> global consensus must result from local consensus in practical system
-> Proved global consensus from local consensus in random graphs using probabilistic Ben-Ors consensus process

###### We have mathematical proof that 51% attack proof is achievable with a single trusted timestamping server.
- Distributed time stamping did not meet conditions for proof
- However, distributed time stamping useful for detecting 51% attack.
- If 51% attack can be detected reliably, it can be eliminated. Practical 51% attack now require compromosing two seperate indepedent systems.

## Mathematical Results:
- There is no deterministic adversarial Paxos solution for the blockchain.
- However, probability of attack success can be reduced to being exponentially small in block confirmation depth using "randomization"
- practical, miner-less 51% attack proof consensus is possible, but require trade offs

## Threat Reduction Measures
- Increase cost of 51% attack (increase resource cost)
- Make 51% attack success probabilistic (decrease payout to attacker)
- Allow identification of attacking nodes (auditing, identity)
- When detected, attacking nodes automatically lose resources needed for attack (node social trust metric as scarce resource for network consensus)
- Bound time frame over which transactions can be reverted.

## Current Skycoin Consensus System Design:
- Public Broadcast Channel for consensus negotiation
- BenOrs randomized consensus protocol in web of trust network
- Detect attack states, mitigate attack, identify attacking nodes
- Multiple layered detection systems that must be defeated for a successful attack.

## Consensus

The formal state transition diagram for network consensus for netsplit and 51% attack prevention is coming together. We are sure that if 90% of the nodes in a random graph attempt to revert block consensus, they will fail. There are three difficult conditions that must be met in succession for a block consensus reversion attack to succeed.

There were two states for nodes. A new third state for network bifurcation has been added. This third state simplifies the state transition diagram for dealing with attacks and netsplits
- Converged with network (this is determined at minimum by the "Consensus Oracle" mechanism)
- Not converged. This is state where the current node block consensus is on a different chain than rest of network and knows it.
- A new "bifurcated network state". This is the state a node goes into when it detects two or more divergent consensus chains on network subgraphs. This is the state the network is left in after a netsplit or consensus reversion attack attempt. This state begins conflict resolution.

There is a window of blocks. Nodes can remain in the converged state during the consensus process for this many blocks in the presence of blockchain forks while remaining in the converged state.
- This is the "consensus window" in which the network has to resolve choices between alternative blockchains.
- Once a block goes outside of window, it is "final" and reversion should be impossible.
- It is acceptable for the network to stop until consensus is achieved if the window would be exceeded by the additional of new blocks. Stopping or slowing down the network during an attack is preferable to introducing a 51% attack. Once attacking nodes have been identified, people can remove them from their trust lists and their influence on the network eliminated.
- The probability of forks decreases exponentially with block depth within the consensus window

Unconverged states happen when consensus process runs on and exceeds the window. This may indicate a pathological subgraph slowing down convergence or a DDoS attack. It may also reflect lose of connectivity between continents slowing down blockchain convergence.

**Note:** For the purposes of the finite state machine transition diagram, the unconvergence state is discrete. Block introduction is rejected or discouraged while pending consensus decisions are processed. As a practical matter, there may be transaction throttling, with block rate decreasing as a function of the size of the open decision set. This is called the "soft throttle". The "hard throttle" is when nodes begin rejecting block introduction until the current backlog of consensus decisions are globally resolved.

Bifuricated network state occurs when peers announce a chain which forks before the window and which was not previously in the consensus decision set (fork introduction). This only occurs doing a netsplit when nodes rejoin the network or during a directed attack. Most nodes in the bifurcated network state resolve automatically.

There are several detectable error states, that should not occur in normal operation but will occur. Such as local node assumes a consensus state that differs from the state suggested by the consensus oracle.

## Handling Bifurication State:

This state should never be reached, except in emergencies and major coordinated attacks. An attacker must have the resources and the will to attempt to put the network into this state. This will never occur on a network of non-malicious unmodified clients running on a reliable internet.

###### If this network state has been reached:
- There is a severe Skycoin bug that needs to be patched
- Skycoin is under attack from a powerful group with significant resources
- World World III has begin. Global internet connectivity has been severed. The colocation centers have been nuked. The undesea cables have been cut and communication satellites no longer function.

This is the state that triggers the 51% attack detection. This is being worked through. This state should not be triggered during normal operation.

- If someone manages to get enough nodes colluding to influence the consensus, they can DDoS attack the network by minting blocks with no transactions in them and preventing network from accepting valid blocks. This wont last for long. As soon as the nodes are identified, people will remove them from trust lists and its effectively a ban.
- Then there are planned measures in place, that make node consensus decision deterministic. This makes it very difficult for a large number of nodes to collude to influence voting, even if they are controlled by a single person. It turns vote manipulation into an intractable and frustrating optimization and coordination problem.
- If someone tries to 51% attack, it fails with high probability, deterring an attack
- If someone 51% attacks and succeeds, it will trigger automatic resolution, which will block most attacks based upon the block timestamps.
- If they get past the automatic resolution procedures, then it would go into manual resolution.

The network is designed to never get to this point, but if it does then there are a number of possible resolution procedures we are looking at. The network will run both branches concurrently until the split is resolved.
- Manual resolution (each user setting chain by hand). The honest nodes and exchanges affected by the split, will just revert the fork and their nodes will discard the bad chain. In Bitcoin the pools participating in an attack are likely to be in on the attack and the victims are the exchanges and service operators, making it difficult to revert the chain after an attack. In Skycoin, people are unlikely to use a chain that is not the consensus chain of the large exchanges and Skycoin service providers (who are the victims and targets of the double spending attack). The incentives are therefore slightly better aligned.
- A developer emergency signing key with 2 out of 3 keys required. Instantly resolves deadlock. Should never get to this point.

## Transaction Confirmation States and Block Depth:

There is a separate flowchart for transaction confirmation. Transactions will be reported by the client JSON API as
- Pending: transaction relayed by network, but not entered into block yet
- Confirmed: transaction entered into block in consensus chain with N confirmations.

N confirmations means the block in which the transaction was entered, has N successor blocks up to the first block which has 0 or more than one remaining candidate child blocks pending network consensus. Skycoin can have multiple child blocks and branches pending consensus, the network does not slow down to decide a single block and then the network block. Therefore each transaction has a "depth" with respect to the last block with more than two remaining parents and the transaction has a depth with respect to each of the pending consensus chains.

So for example, if a netsplit occurs at block 10. The netsplit chain is on block 20. A transaction is entered in netsplit chain in block 15. The transaction has five confirmations with respect to the head of the netsplit chain, but has 0 confirmations (pending state) because block 10 has two children (block 10 was last block when the local node was in the "converged" state).
- If the netsplit chain and mainchain merge at block 25, if the netsplit chain becomes dominant and the other chain pruned, then the transaction now has 10 confirmations
- The transaction can never go into the confirmed stated while the node is in unconverged or bifurcated state. This automatically prevents the vast majority of double spending attacks against exchanges and merchants, as most exchanges will not apply a credit to an account until the transaction has reached N confirmations.
- In Bitcoin "Confirmations" are the number of blocks since the block containing the transaction, for the longest block. In Skycoin, confirmations are the number of blocks after the transaction which have

There is a closely related concept, the "confirmation min" and the "confirmation max". If there are two chain branches open for consensus and the transaction has four confirmations on the first chain and six confirmations on the second chain, the transaction will have a minimum of 4 confirmations regardless of which chain is chosen for consensus.

## Scenario
- There are two blockchain branches
- The first branch has 15 blocks
- The second branch as 12 blocks
- The branches fork at block 7 (block seven is the last block the two branches have in common)
- A transaction was entered into the first branch at block 11 and the second branch at block 10
Therefore
- The transaction has "0 confirmations" because the transaction was not entered before the chain forks on block 7
- The transaction has 4 confirmations on the first branch
- The transaction has 2 confirmations on the second branch
- Regardless of which branch is chosen for consensus, the transaction will be executed (unless one forks is chosen and then another fork occurs at a block the transaction was executed in)

There is a calculus of blockchains. There is a min, a max, a join and a bottom. We need to develop good terminology for talking about the blockchain forks, diagrams and software examples.  Documentation is low priority until its working and the wiki is up. Someone will have to make a tutorial on the wiki, make python scripts for generating diagrams and come up with terminology.