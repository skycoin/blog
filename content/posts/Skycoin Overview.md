+++
aliases = ["/overview/skycoin-overview/"]
bounty = 15
date = "2017-08-26"
tags = ["Skycoin", "Statement"]
title = "Skycoin Overview"

+++
<!-- MarkdownTOC autolink="true" bracket="round" depth="1" -->

* [Skycoin Introduction](#skycoin-introduction)
* [Innovations And Flaws With Bitcoin And The Current Blockchain Protocols](#innovations-and-flaws-with-bitcoin-and-the-current-blockchain-protocols)
* [Innovations Produced By Bitcoin](#innovations-produced-by-bitcoin)
* [Major Flaws Of Bitcoin](#major-flaws-of-bitcoin)
* [Desirable Properties For Systems Of Distributed Consensus For Financial Ledgers](#desirable-properties-for-systems-of-distributed-consensus-for-financial-ledgers)
* [Skycoin Security Philosophy](#skycoin-security-philosophy)
* [Transparency And Security: Obelisk And Public Broadcast Channels](#transparency-and-security-obelisk-and-public-broadcast-channels)
* [Obelisk](#obelisk)
* [Simple Binary Consensus Algorithm: Choosing Between Two Blocks](#simple-binary-consensus-algorithm-choosing-between-two-blocks)
* [Consensus On Multiple Concurrent Branch Choices](#consensus-on-multiple-concurrent-branch-choices)

<!-- /MarkdownTOC -->

# Skycoin Introduction

Skycoin is based on technology
which introduces a new cryptographic primitive
known as a public broadcast channel. It also introduces
a new consensus algorithm implementation, called
Obelisk, which mitigates the commitment problems
arising from the Proof-of-Work and mining processes
underlying Bitcoin, thus addressing a host of security
issues associated with the latter. Obelisk is not a
single algorithm, but an implementation employing
multiple techniques to deliver specific security
guarantees.

# Innovations and Flaws with Bitcoin and The Current Blockchain Protocols

In Bitcoin, new transactions are placed into
a block, which is appended to the blockchain. Any
peer in the Bitcoin network can create new blocks.
Each block therefore has a single parent but one or
more valid successors (children). The chains form a
tree and the core problem that Bitcoin solves is getting
every node in the network to agree on which of the
prospective chains in the chain tree is the consensus
blockchain.

Bitcoin uses a technique called Proof‐of‐Work
(PoW) to determine a unique blockchain. A valid
block requires a hash value, which is below a target
value. Nodes add transactions to a new block and
randomly try nonces until a valid hash for a block
is found.

A function is used to create a total ordering
of chains in the block tree. The chain which has the
highest difficulty and required the most hashing
operations to produce is “the longest chain” and
forms the consensus chain. The notion of “block
depth” and “difficulty” create a total ordering over
all linear chains in the block tree and only the most
resource intensive chain is accepted to produce the
consensus chain.

Bitcoin nodes connect to each other randomly
and each node relays the most difficult chain of
blocks that it knows about to its peers. If one node
has a more difficult to produce chain than another
connected peer, the peer will receive the blocks
sequentially. The peer will evaluate the function and
decide whether the received chain is more difficult
to produce and thus potentially switch its consensus
to the received chain. The peer will then advertise
its new chain to its peers. In this way, consensus is
propagated throughout the network and all nodes
reach the same consensus.

Bitcoin does not assume that nodes have
identities and does not assume that nodes are honest.
Nodes may send other nodes any data and it cannot
affect consensus decisions because difficulty is
something that can be independently verifed on its
own merit.

# Innovations Produced by Bitcoin

### * The Blockchain

A single data structure that everyone
can possess.

### * Public Ledger for Transactions

Storing financial transactions in the
blockchain.

### * Use of PoW and Difficulty Retargeting to Maintain A Constant Rate of Block Production

### * Use of Public Key Hashes as Addresses

Public keys are not disclosed until
used.

### * Use of “outputs” for Balances

It ignores trying to create divisible digital
cash: To pay $20 from a $25 output,
send $20 to person and $5 back to
yourself.

### * Pow Difficulty Function and Block Depth

First use of a function that defines total
ordering on block trees. The public ledger
circumvents the double spending problem
of traditional digital cash.

# Major Flaws of Bitcoin

These are the issues that must be addressed in the
development of new cryptocurrency solutions. Bitcoin
should be regarded as an embryonic cryptocurrency
upon which future developments must improve. The
technology upon which Skycoin is based addresses
Bitcoin’s major deficiencies by redesigning the entire
system of distributed consensus.

### * Consensus Decisions in Bitcoin Are Not Final and Can Be Reverted

A person or organization that can rent
or buy enough hashing power can
revert transactions.

### * Bitcoin Achieves Network Consensus But Individual Bitcoin Nodes Are Highly Vulnerable to Adversaries Who Control The Routers Through Which Packets Pass

A router-controlling adversary has
absolute control over the view of a
node and can arbitrarily influence the
node’s consensus decisions.

### * Bitcoin Exchanges Have Become Highly Vulnerable to Attack

Skilled attackers may employ 51%
attacks and the buying and selling of
alt coins at Bitcoin exchanges to drive
the latter into insolvency.

### * Banks and Gambling Sites Have Become Vulnerable to 51% Attacks

### * As Bitcoin Matures, The Buying of Options Against Bitcoin and Attacks Against The Networks Become More Profitable

In the future, successful attacks on
Bitcoin could result in several hundred
millions of dollars in profit from
options trading.

### * States With Strong Capital Controls, As Well As Competing Corporations, May Directly Attack The Bitcoin Network to Protect Their Financial Interests

Such entities may easily absorb the
costs of attacking the network and
undermining Bitcoin’s security.

### * Services That Allow “Cloud Hashing” and Rental of 3rd Party Hash Power Are Increasingly Successful

Many large pools now have the ability
to rent the hash power for a majority
attack.

### * Hackers Can Use Numerous Security Holes in Routers and Networking Equipment to Steal Coins From Banks and Exchanges

An attacker can control the peers
connected to a Bitcoin node and ensure
connections to attacker-controlled
nodes. For instance, an attacker may
introduce a deposit transaction to the
side chain of a bank and get the bank
to issue a withdraw transaction which
is then relayed to the main network.

### * Bitcoin Cannot Offer Security at A Low Cost

The Bitcoin network is using immense
and exponentially growing amounts of
electricity. Bitcoin’s security purposely
relies upon creating as much electrical
waste as possible. As security is related
to the cost of achieving majority hash
rate, the cost of running the Bitcoin
network are constantly driven up. In
a well-designed system, $1 in security
costs $1000 to circumvent. In Bitcoin
the ratio is $1 to $1. In addition, this is
environmentally irresponsible.

### * Bitcoin Fundamentally Cannot Decrease Transaction Times Without Compromising Security

Bitcoin transactions take on average
10 minutes to get included in a block,
and more time is required for more
security.

# Desirable Properties for Systems of Distributed Consensus for Financial Ledgers

The criteria on which Bitcoin can be improved are:

### * No Double Spending

Once a transaction has executed,
it should be impossible to revert
consensus. Consensus should be as
irreversible as possible.

### * Efficiency

The cost to run a perfectly secure
ledger should be extremely low.

### * Speed

The system should allow transactions
to be confirmed within seconds.

### * Transparency

It should be easy to audit and identify
malicious nodes.

### * Router Attack Security

Nodes should be able to detect if their
consensus differs from the network.

Some security properties should remain intact
even if the vast majority of nodes in the network are
malicious and colluding.

On a fundamental level, many of the security
issues associated with the Bitcoin system arise from the
inherent commitment problem of the Proof of Work
and mining processes. Its security issues represent
a real-world Byzantine General Problem. Incentives
exist for participants to manipulate verification
processes, by engaging in bribery and hacking for
instance. Attackers will manipulate system clocks,
compromise routers, use hash collisions, flood the
network with hundreds of thousands of bots and
exploit signature malleability.

A secure system must not only protect against
every known attack, but be robust enough to evolve
and adapt to future attacks. Some issues in Bitcoin
can be fixed, such as signature malleability. Other
issues are fundamental and cannot be addressed
without defining an entirely new framework, such as
the reliance on Proof of Work and miners.

# Skycoin Security Philosophy

Security is a process of continuous identification
and fortification against threats. A good system
achieves “defense in depth”, has multiple redundant
systems and will survive the complete failure of
any individual measure. Good security requires the
differentiation between threats which are existential
and those which are mere annoyances.

While it is obvious that no single system can
eliminate all security threats and simultaneously
achieve all the objectives listed above, Skycoin
represents the next step in cryptocurrency technology
because it takes a modular layered approach to
security and uses different systems to enforce
particular guarantees. Skycoin security is focused on
addressing the existential threats faced by Bitcoin and
protecting users from day-to-day threats, attempting
to give the highest degree of protection against the
class of attacks that would infict the greatest losses
upon its users, stakeholders and institutions. This
requires a complete redesign of Bitcoin at both ends
from wallet generation to blockchain consensus and
fundamental innovation is several other areas.

Most of the losses in Bitcoin derive from
deficiencies in design, a lack of usability, and end user
mistakes rather than fundamental technical attacks in
the software or mathematics. Skycoin must address
both the looming existential mathematical threats
and the security perils that Bitcoin’s incomplete and
poorly thought out user experience has created for
everyday users. The poor usability and design has
forced users to compromise security, with millions
of dollar routinely relying on insecure web wallets.
Despite the frequent and massive thefts reported by
the media on a daily basis, to date more Bitcoin have
been lost due to usability issues than all the efforts of
criminals to steal Bitcoin.

As many as half of all existing Bitcoins have
never been moved from their initial addresses and
never will be because they are lost as unrecoverable
wallet files, lost wallets, or misunderstandings of
what was actually being backed up in a wallet file.
Mt. Gox recently reported “finding” 200,000 Bitcoin
in a wallet they were unaware carried Bitcoins. The
wallet had been previously ignored and could have
easily been deleted by mistake. Wallets are frequently
mistaken as empty because computer software was
unable to load a wallet created by software that is “too
old”. Thus most security issues concerning Bitcoin
occur at the level of usability, end users and exchange
security.

The rest of this section covers some of the new
techniques we have created in cooperation with our
partners to address network level security issues and
render the Skycoin blockchain more secure than
previous networks.

We have proven mathematically that our system
achieves consensus, has the security properties we want
and operates well under normal network conditions.
We have some exciting new data‐structures that have
not been seen in any coin or piece of software before.
At the moment we are prototyping the system for
deployment. The Skycoin development process is
iterative. There will be changes, improvements and
refinements as we work through the details, address
known flaws, test the system and get feedback.

# Transparency and Security: Obelisk and Public Broadcast Channels

To address the commitment problems associated
with the Bitcoin system, the technology underlying
our Skycoin implements the blockchain in the form
of a public broadcast channel. Everyone can read
the chain, but only the owner can mint blocks for it.
To be valid for a personal chain, each block must be
signed by the owners private key. Each node in this
consensus algorithm system (Obelisk) has a personal
blockchain and it is the core primitive in the Obelisk
system.

The public broadcast channel imposes several
constraints:

### * Once A Block is Published, It Cannot Be Unpublished

Blocks are replicated peer to peer to
all subscribers. Once a block has been
published, it spreads to all subscribers.
You have to destroy all peers who have
received the block to erase it from
internet.

### * A Node Cannot Publish A Different Version of An Earlier Block Without Detection

Blocks are numbered and it would
be detected if the node signed two
different blocks with the same
sequence number.

### * A Node Cannot Backdate The Timestamp on The Receipt of A Block, Without Delaying The Publication of A Block

Timestamps only go up, timestamps
increase monotonously with block
sequence count.

### * A Block in The Middle of The Chain Cannot Be Changed Without Invalidating Every Block That Comes After It

In a hash chain, each block header contains
a hash of the previous block.

# Obelisk

Each Obelisk node (Skycoin Consensus Node)
has a public key (an identity) and personal blockchain
(a public broadcast channel). Consensus decisions
and communication happen within the personal
blockchains of each Obelisk node. This is a public
record of everything a node does. This allows the
community to audit nodes for cheating and collusion.
It gives the community a way to identify nodes which
are participating in attacks on the network and
it makes public how decisions in the network are
being made and which nodes are influencing those
decisions.

Each node has a list of other nodes that it
subscribes to. Nodes with more subscribers are more
“trusted” and yield more influence in the network. If
the community does not trust the nodes representing
them or feels that power within the network is too
concentrated (or not concentrated enough) the
community is able to collectively shift the balance of
power in the network by collectively changing their
trust relationships in the network.

Node subscription relationships can be
random and/or can be formed through web of trust
(subscribe to nodes of people you know and people
in the community you trust).

When a node receives a new block from a chain
it is subscribed to, it publishes the hash of the block
it publishes. This is a public acknowledgment of the
receipt of the block. Each block is timestamped
and counter-references blocks from other chains.
This creates a dense interlinked chain of block
acknowledgments. These chains establish causal
relationships and can act as a distributed time
stamping system as described in the next section.
This allows the network to prove that data did not
exist or was not published to the network or establish
that particular nodes were active or offline during a
particular time interval.

The current Obelisk consensus algorithm
is based upon Ben‐Or’s randomized consensus
algorithm.

A Sybil attack in a random graph (worst case)
allows the Sybil nodes to control consensus, but the
nodes are unable to revert transactions, removing the
only economic incentive to attack the network. In real
world graphs the Sybil resistance of the network is
actually very high and running a node is moderately
costly in terms of bandwidth, which makes large
botnets prohibitive.

Trust relationships are scarce and can be
rescinded. In the event of an attack, the network
reacts by severing connections to less trustworthy
nodes and contracting to a smaller core of trusted
nodes. The public record left by each node’s personal
blockchain makes it very easy to identify the nodes
participating in an attack. As attacking nodes are
identifed, individuals sever relationships with those
nodes, reducing their influence. Therefore, the major
benefits of the Skycoin network are:

* Skycoin consensus is democratic and nodes are run by the community
* Skycoin node consensus is public
* Every node is accountable to the community and 3rd party audits
* Influence within the skycoin consensus system is democratic and transparent (but unequal)

# Simple Binary Consensus Algorithm: Choosing Between Two Blocks

Each voting decision is a hash pair (A,B). A is
the hash of the parent of the block and B is the hash of
the block. Each node votes on the next block
it believes should be the consensus block. If 40% of
the nodes it is subscribed to have the same candidate
for consensus, the node changes its consensus to that
block. The node flips randomly between candidates
until consensus is reached.

# Consensus on Multiple Concurrent Branch Choices

A more advanced system publishes (A,B,P),
where P is a value from 0 to 1. P values across all
successors to block would sum to 1. This allows for
concurrent consensus decisions on multiple chain
branches.

If the majority of nodes in the network are
honest, they will also converge to the same consensus.

Skycoin also has a limited form of Proof of
Stake. We bias voting in favor of blocks with a larger
transaction fee.

If there are only two possible consensus
choices for a given parent and both blocks execute
your transaction, then the transaction is effectively
executed regardless of which of the two blocks end up
chosen by the network. The probability of reversion
of an early consensus decision declines exponentially
with block depth.