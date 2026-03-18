+++
aliases = ["/development-updates/development-update-97/"]
date = "2016-01-30"
draft = true
tags = ["Development", "Consensus"]
title = "Development Update #97: Skycoin Mathematics Update"

+++
The interface is just being done in angular for now. The new angular is much cleaner.

However, npm is dumping the compiled javascript files in the same directory as the type script files, which is ugly and frustrating. I have not found the setting for setting the output directory yet.

## Math Update:

I found a simple message passing algorithm that finds all nodes in the network that are not in consensus with the current node, with ~log N messages in the size of the network).

This is VERY important and a major breakthrough for verifying consensus.

- Nodes currently broadcast their state, to nodes that they are connected to (information about a single node's state)
- It is possible to publish meta-information that summarizes state state of the nodes that a particular node is connected to ("surveys")
- It is possible to do gradient decent on the surveys, for some types of messages to find the nodes that have forked blocks or to verify that no such nodes exists

A simple gossip protocol works as follows
- when a nodes gets a new message, it hashes it and announces the hash of the message to every peer it is connected to
- if a piece receives a hash announcement, it checks if it has the data for that hash and if not, it downloads that data from a peer that has announced the hash

This simple protocol guarantees replication of every message across every node on the network

"Gossip with counting" is as follows
- a node announces a data item, which has a counter
- the data item is re-announced periodically
- each node sets a "count" value that it attaches to the data item, the count value is the minimum of the count values of the nodes it is connected to, plus one
- the node that announced the message has count 0

If you get a count value of 7, it means the minimum path between you and the announcer is 7 hops.

In this "gossip with counting", if the nodes are honest, you can do gradient decent
- you look at all the nodes you are connected to
- you "Decent" by asking the node announcing the lowest count value and then ask him, who his peer with the lowest counter value is
- you keep doing this recursively until you reach the sender
- if you fail at a certain step, you backtrack with depth first on the next lowest count for the current node, etc
- if you see a node whose does not have a node whose announced, count value which is lower than the account value that node has announced, then the node is lying/cheating

It is even better, if the data in the gossip with counting, session is in a public broadcast file like IPFS, so that it has replication and peer-to-peer verification and does not depend on direct communication with the node for verification and replication.

There are several places for these algorithms
- there is an algorithm, that can find any node that is not in consensus in the network by starting a "gossip with counting" session
- another use is it may be an alternative to mining for consensus.

We previously showed that mining can be eliminated if there was a trusted time stamp authority (a single trusted node, that time stamps blocks). We also showed that consensus is more generally, the problem of assigning a total ordering to the blocks (if there is a split, or two options, the problem of resolving the two choices deterministicly).

You can simulate a shared clock between the nodes as follows
- when each node receives a block, it timestamps it (64 bit time) and signs HASH(timestamp+block)
- each node stores for each of its connections
-- the timestamp (and signature) that the node claims to have first received the block
-- the timestamp the current node, first heard the announcement of the time that the node claimed to have first received the time stamp

IF the clocks are synchronized, then the time another node claims to have first receive the block, will always be less than the time the notification of receipt was time-stamped by its peers.

What happens if someone injects a block 5 minutes later, that did not exist 5 minutes ago and attempts to fork the chain? What operations can your node to show that the block did not exist and should be rejected?

There are more complicated versions
- two stage time stamp commit protocols, where you announce a candidate time stamp (or range which narrows each round)
- then you must choose a time stamp, that is not less than 30% of the lowests time stamps of the people you are following

## Mathematical Representations of Distributed Systems

I finally have a good mathematical model, that is very simple, which has simple algebraic properties that can be reasoned about and which is executable for simulation.

- C like (functions, structs)
- two data types (int32, char[])
- all operations are deterministic
- the operation of running the program or one line is f (so f*f*f would be stepping forward three lines)
- if program state S is idempotent under f (if f*S = S, then the program is stalled or there is nothing for it to do)
- there is an operator, that applies f on the context (the state of the program S), until it is idempotent
- all communication between the programs is length prefixed messages (program receives and emits length prefixed byte arrays, CSP)
- there is an operator s that injects a "Signal" (a length prefixed message)
- structs have a canonical serialization and reflection (so that they can be used for data apis)
- there is a "universe" which is just a struct/data object containing other computers. So you can spawn five computers, then top level computer can read out the length prefixed messages and pass them between the computers. A program run looks like f*f*f*f*s(...)*f*f*f*... and you can derive partial orderings on the program state, across different delivery orders for the signals..
- a computer, its state is called a "Context" and can be serialized/deserialized
- there are functions OF a struct and functions ON a struct (or operators).  A function of a struct is functional but does not change its state and is a property, or descriptive, while a function on a struct, entails a state change. (this is not very important, except for keeping track of algebraic properties of function application)
- there is a meta-operator for creating new operators
- the program is itself a software object (this is most important thing from mathematical perspective and simplicity, but means the program is no longer a text file, but a program object that operations are applied to)

This sounds very boring and would not seem to have any avantages over C or golang, however it simplies
- the skycoin blockchain
- the consensus algorithm
- the meshnet
- the exchange
- simulating interacting components
- unit testing algebraic properties and behaviors of systems of interacting components

Especially for simulation.

For unit testings, I have to
- spawn N computers under one universe (a context running a universe)
- setup initial state (give them program)
- each at the top level, shuffle the order of the packets and choose one packet (length prefixed message to deliver)
- run until each computer in the universe is in an idempotent state (until it halts)
- serialize state of top level computer to a []char and hash it, also write down how many packets/cycles it took

##### Now
- run this for 1024 runs
- show that the end state is the same for all orderings of the packets (that the hashes match)

- graph the number of packets, bandwidth, linear time required, under different network topologies and a function of number of nodes

I need to be able to spawn a whole network, run it and then crunch it down to a few numbers or a graph.

Both Bitcoin and Skycoin and the meshnet are cooperative multi-agent systems.
- P2P like bitorrent and Bitcoin is the boring case where every agent is the same, passing same messages
- the Skycoin meshnet has to deal with computers, controlling computers and networks of computers engaging in cooperative, competitive and coordinated action to solve optimization tasks across the network and accomplish goal.

The meshnet nodes are not just calling data APIs on each each, but need to communicate in both data and programs.

![](/img/dev-update-97-1.png)

If you have a metric that you can measure or a goal, and you have multiple programs or methods for accomplishing that goal, the program will be able to evaluate the scripts and choose the best or most effective one. It will also be able to do this at the system level and the system of system of level because the description of the programming language is closed under reification.