+++
aliases = ["/development-updates/development-update-101/"]
date = "2016-04-08"
draft = true
tags = ["Development", "Skywire", "CXO"]
title = "Skycoin Ecosystem Update Overview"

+++
## Meshnet:

Version one meshnet is almost done

https://github.com/skycoin/skycoin/commit/f959d0875baf990e43ca3f045a9cba82d4d8f24a

This is the sixth or eighth design iteration, so it is very clean conceptually. I was simulating the meshnet packet passing algorithms with punch cards and paper and it works well. You could implement it on a punch card sorting machine and telegraph lines if you wanted to.

## Exchange:

Exchange is being refactored and fixed. We have a revolutionary exchange design, that simplifies the exchange, improves the security and enables easy support for multiple coins.

The exchange has a limited number of function:
- Deposit bitcoins
- Withdrawal bitcoins
- Deposit skycoin
- Withdrawal skycoin
- Bid/ask order
- Very small number of simple API commands. Very small code base.

The exchange has a JSON RPC, tunneled over ChaCha20 + secp256k1 channel, running over the Skycoin meshnet/darknet.
- Man in the middle attack is not possible

- The user has a local wallet, a json file that contains their private keys.
- The identity of the user is their public key
- User signs exchange requests with their public key
- The user has a local wallet and a remote wallet (coin balance on the exchange, coin balance on addresses for private keys held locally)
- The user can withdrawal all coins from the exchange to their local wallet
- The wallet can store the private keys for and sign transactions for all coins supported by the exchange (native multi-coin)

- There is a consistent wallet format and private key storage format for each coin type and it is modular
- Other coins can be added easily (shellcoin, bitcoin, litecoin, dogecoin, zerocoin, ehtereum)
- The exchange queries unspent output balances and blockchain state over websocket RPC
- The external coin interface is running on a physically separate computer (not virtualized) and on a different network namespace
- The application running each coin blockchain is separated from the private key and transaction signing server

There is invariant checking on the wallets, so if coins disappear or a 51% attack occurs or some invariant is broken, it should detect it.
- The local user interface is a local web application

There are a number of very  specific things. I am glad they are finally getting done.

## Wallet

We have a new build system and modernized our build scripts

- Cross compilation is working now
- Windows builds are working
- OSX builds are not working
- Linux builds are working

We should release the wallet again, but we have to add UDNP firewall tunneling and have to fix peer-exchange.

## Swiss Banker Protocol

We designed a simple two packet protocol for doing micro-transactions through a trusted third party (the exchange), without going through the blockchain.

## R&D: CX

Before the blockchain there was a thing called tuple spaces
- There was a object store
- Objects would be stored in the object store
- A process would check objects out of the object store
- A process would modify the object or perform transactions/operations on the object
- A process would check the object back into the object store

- A process could be internal or external (could be an external process, or could be a process running in the tuple store)
- A process could non-destructively read a tuple/object
- A process could destructively read a tuple/object (get copy of it and destroy original)
- A process could instantiate a new process on the object store
- A process that creates a new tuple/object and stores it in the object store

If the tuple store itself is an object, that admits transactions, then you get a blockchain type object
- There is a transaction that instantiates a process, which destructively reads a series of unspent outputs (spends them) and creates a new series of unspent outputs)

There is a class of mathematical objects that are "blockchain like". That are more general than the blockchain. There is an ontology on those objects, which is useful to think about them
- A transaction (an operation that is applied to the object state, mapping it to a new state. The state of the object, is a series of transactions applied in sequence upon the null object. For instance a wikipedia page starts blank, then a series of diff transactions are applied to it). A transaction is a "function on" the object. A transaction has a representation as a byte string and as an operator or the action of a computation being performed on an object.
- A "function of", these are functional type functions (such as the SHA256 hash of the serialization of the object). They do not change the state of the object and are properties, predicates and non-destructive reads and invariant checks
- A communication, an event, the emission of a length prefixed byte string.

Examples:
- A twitter feed starts empty (null object)
- A series of "create tweet actions" are applied to the feed object, to add each tweet

- A wikipedia page starts empty (null object)
- A series of diff operations are applied in sequence to create the head page

- A git repo starst empt (null object)
- A series of commit and add files operations are applied in sequence to create the current file

- A text file starts empty
- A series of edit, delete, insert operations are applied in sequence to create the current document

- A blockchain with all the coins allocated in the first block is created (a series of unspent outputs)
- A series of transactions or operations are applied, which consume (destroy) unspent outputs and create new unspent outputs (the unspent output set is the state, upon which the transactions/operations operate)

Bitcoin type blockchains are simple or one of the simplest types of this this kind of mathematical object
- They have one transaction
- Each transaction has a validity invariant (to determine whether it can be applied to the current state)
- There is one type of operation/transaction on the object
- There is one type of object (the unspent output)
- The state is a list (of the one object type, the unspent output set)
- Each transaction destructively reads the unspent outputs it consumes (outputs are destroyed) and new outputs are created
- The unspent outputs and the transactions that create and consume them, form a bipartite directed graph

We are planning a very simple scripting language (implemented in 2000 lines of go), called CX. It is a research language for implementing these types of objects.

It is also very good for blockchain business logic.

The problems are:
- I proved mathematically that no language with the required properties can have a representation as a text file. The program is actually a program object, constructed by applying a series of operations upon a null program object. I am still trying to imagine what an interface would look like or how to interact with the program objects.
- It is turtles all the way down. It appears to be a self-implementing set of mathematical abstractions. There is a set of symmetries or invariants and set of operations, and the invariant are preserved for all objects in the transitive closure over the set of operations.
- There does not appear to be a difference between compilation and interpretation in the language
- There is a clear difference between "functions on" and object and "functions of" an object
- There is a sort of transitive closure under a type of reification operation on a program (what is the inverse of reification?).

Here is one thing you might do with this type of language or computer
- You take a program that can be represented as x1 as a byte string. x1 hashes to H1
- You take data whose byte string representation is x2 and which hashes to H2
- You apply program x1 to data x2 and get output x3, which hashes to H3

Assumptions:
- Computation is deterministic
- There is a program, which canonically represents each program or data as a byte string and back. If you serialize any program or object x, then serialize it, you get x back. x = f(g(x)) for all x, where f is serialization and g is deserialization.

You have a network of computers:
- Each computer runs a program and scans for tuples and grabs or replicates peer-to-peer tuples matching certain properties
- Each computer stores a subset of the tuples
- A computer may introduce new tuples

Example:
- A computer or node stores (H1, H2, H3) (the tuple for program hashing to H1, applied to data hashing to H2, which returns output which hashes to H3)
- Another computer scans and matches, then replicates (H1, H2, H3) and then triggers a process, creating another tuple pair, which consumes H3

This is a sort of distributed, fully functional, distributed computer in the Urbit style.

- Each node has a key value store (Redis, to store data x1 which hashes to H1 as key -> value, h1 : H1)
- A list of tuples (H1, H2, H3)
- A program/script running on the node which curates, scans, communicates, replicates tuples and key/value pairs when asked

This is an interesting, but weird sort of distributed computer.
- It is fully functional or non-mutable (any two nodes with (H1,H2,H3) with same data , who perform same computation, will get same result)
- Nodes can communicate by taking message and signing it with their public/private key and publishing tuple/message, which is then replicated by other nodes
- It is a very simple model of computation, with very few operations

The Skycoin consensus algorithm appears capable of running on this type of machine.

You could also build a file system on top of this type of computer
- A block of data or hash H1, could be a block of data from a movie, text file or MP3
- Another block of data H2, could be the list of blocks of data composing a file whose byte string hashes to H3
- Another block of data H4, could be the list of nodes replicating chunks of data mentioned in H3

"BitTorrent on DMT". This is some kind of content addressable distributed storage system.

Some of the modes of computations or systems are very general and I do not know what to use them for yet. There is a whole class of types of computation and data structures, besides the blockchain and they have not been implemented or classified yet.

I found one type of data structure, that can be used for syncing workspaces or operating on shared data objects in a peer-to-peer manner. It reminds me of this

- https://en.wikipedia.org/wiki/U-form
- https://en.wikipedia.org/wiki/Tuple_space
- [https://en.wikipedia.org/wiki/Linda_(coordination_language)](https://en.wikipedia.org/wiki/Linda_(coordination_language))

One of them looks like the pi-calculus or some kind of distributed anti-aircraft defense system. Its a blackboard design pattern, which is primarily used for multiprocessors and aircraft defense systems.

- https://en.wikipedia.org/wiki/Blackboard_system
- [https://en.wikipedia.org/wiki/Blackboard_(design_pattern)](https://en.wikipedia.org/wiki/Blackboard_(design_pattern))

The lambda-calculus is the algebra of procedural computation and the pi-calculus is the algebra of communication. There are some interesting implementations of this.