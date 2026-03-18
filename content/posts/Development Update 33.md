+++
aliases = ["/development-updates/development-update-33/"]
date = "2014-07-16"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #33: Skycoin Cryptography Standard Library Update"

+++
## Skywire Repo Moved:

The Skywire repository has been merged into the main Skycoin repository. Still being integrated to replace visor and daemon.

## Skycoin Cryptography Standard Library

All the cryptography, hashing and address operations have been moved into github.com/skycoin/skycoin/src/cipher

https://github.com/skycoin/skycoin/tree/master/src/cipher

The library is in progress. It will be common core for addresses, hashing and cryptography across Skycoin, distributed applications and wallets.

###### The new library will support:
- secp256k1 public and private key generation
- secp256k1 signature, signature verification and chksig operations
- Secure deterministic wallet generation operator (secp256k1 curve right multiplication with SHA256 hashing)
- Secure random number generation (mixes entropy from multiple sources on top of system secure random number generator)
- SHA256 merkle tree implementation for radix 2 and 16
- ECDH (Elliptic curve Diffie-Hellman) deniable encryption with secp256k1 and ChaCha20
- SHA256, Ripmd160, ChaCha20 implementation
- Base58 encoding for Skycoin and Bitcoin Addresses
- May in future specify binary wallet file format for key storage

## Project Management: Dependency Difficulties

Golang is a new language and dependency management is still difficult. We have different developers using different versions of different libraries in different repositories.

###### A typical scenario:
- library A uses library B
- library B is updated and library A is broken because it uses the old interface for library B
- library B is now broken
- everything using library B is also broken

Library A and B have to updated in lockstep, but library A will not get updated to use the new interface for B until B pushes his changes and A breaks. The developer of A gets notification from someone using his library that the library is broken and will then update A.

###### In response we have been:
- Moving everything into single repo to avoid duplication of dependencies (short term solution)
- Severing modules dependency chains (skywire does not import anything in coin)
- Moving functionality into "base" libraries that do not import other libraries (skywire, cipher)
- Reducing dependency chain depth to 2 from the base libraries

## Unit Testing:

We had 100% coverage testing. The unit tests were extremely tedious and did not tell us if program was working. The complexity of the unit tests, helped simplify the program however. If something was difficult to unit test, it should probably be moved out or eliminated (such as time dependencies in the blockchain parser).

A few thousand lines have been gutted from project. Flow paths are being eliminated throughout the project. This will reduce the size of the unit tests. Features such as testnet addresses and rarely used command line options are being gutted to eliminate program flow paths.

We are moving away from 100% coverage testing and will probably focus more on functional and integration testing that can be done from outside of the module.

## Deterministic Build Road Map: Autonomous Corporations

###### Four major security requirements for future altcoins:
- Deterministic builds
- Program determinism
- Process isolation

###### Deterministic builds mean:
- The average user should be able to compile/run the binary from source
- Each user should be able to hash their binary and the hash should match the hash every other user generates
- Developers cannot put back-doors in binaries. Users can verify the binaries.

###### Program determinism means:
- Two users running the program with the same inputs on different hardware should get the same output
- This is necessary to prevent blockchain forks

###### Process isolation means:
- The program is sandboxed
- The program cannot access file outside of its directory (cannot steal wallets)
- The program cannot access network resources it should not need

## Digital Autonomous Corporations: Technical Requirements

###### In the long term:
- The source code for coins will be in blockchain (or a merkle hash of the source code)
- Changes to the source code and client should be ratified by proof-of-stake election by the coin stakeholders

The source code is the bylaws of the corporation. The bylaws specify corporate governance (who can do what, who can change the bylaws and under what conditions).

So for instance, you may require that the source code for the coin be in the blockchain itself and that any changes to the source code require agreement of half the coin holders in a proof of stakes election. With the source code itself enforcing the vote counting and update. That is an alternative to a "foundation" controlling the source code and repository.

Bitcoin skirts the digital governance issue. Each participant in the network is allowed to choose a different implementation. Bitcoin is "decentralized" in theory, but in reality a small group of developers controls and owns the standard. Control of coins is decentralized and network operation is decentralized but control of the source code and the governance of Bitcoin is centralized.

If the implementations Bitcoin differ, the attitude of the foundation is "the majority of miners will just decide which implementation is correct. The miners control the blockchain and in theory have veto over changes to the source code, but in reality are helpless. The coin-holders (the stakeholders) have no representation in the governance.

- Coinholders have no power
- The foundation developers determine all changes to the source code
- Miners have theoretical veto power over decisions by the foundation, but in reality cannot exercise veto without losing mining profits. Miner interest may not be aligned with the interests of coinholders.

The veto in corporate governance over the souce code and changes should be in the hands of the coinholders (the stakeholders).

We cannot have Digital Autonomous Corporations until deterministic builds, program determism and process isolation are technically feasible.

## Digital Autonomous Corporations: Seperation of Blocks Contents from Block Consensus Mechanisms

Bitcoin combines blockchain consensus and parsing of blocks (transaction). The consensus mechanism in Bitcoin is the block headers along with transaction information. From Skycoin's perspective the contents of the blocks (the transactions) should be logically separate from the mechanism used to determine consensus between blocks. Consensus determining information should wrap and be independent of the block contents.

Skycoin carefully separates out the blockchain format from how consensus is determined. This means:
- Stakeholder elections may elect to change the blockchain format power and how the blocks are parsed (Which may affect number of coins, types of transactions types supported and other information)
- Stakeholder elections may elect to change the consensus mechanism

In Bitcoin, there are multiple competing implementation of both the blockchain parser. There is a chance a block might be valid on one implementation and not valid on another, causing a fork. Multiple concurrent version of the chain parser are in the wild, with different ideas about what constitutes a valid block.

For digital governance the blockchain parser itself is the first target for placing its source code within the blockchain itself and amendments or changes becoming subject to stakeholder elections.

In Skycoin the blockchain parser must be standard and deterministic and agreed upon by all parties, while the current consensus mechanism is currently allowed to be varied on an individual basis in the network consensus system (which may change).

## Digital Autonomous Corporations: Functional Unspent Output State

In Skycoin the state of the unspent outputs is U and a block (list of transaction) is applied to that state B(U) to yield a new state.

B(U) -> U

A block is a function from an unspent output state to a new unspent output state. There are conditions that must be true of each transaction in a block and conditions that must be true of the transactions jointly.

- Skycoin uses a functional programming style, which in theory allows blocks validity checks to be independently checked in parrallel.
- Skycoin defines a formal canonical binary serialization of the current unspent output state.
- Skycoin defines a formal canonical binary serialization of each block.
- The source code defines the state of the unspent output state (the state)
- The source code defines the meaning of an application of a block (a function mapping an existing unspent output state to a new unspent output state).
- The source code determines whether a block is valid or not for a given unspent output state.
- The consensus mechanism determines which blocks are applied in which order.
- The consensus mechanism is independent of the block parsing and interpretation mechanism.

This is similar to Bitcoin, but conceptually more advanced in that it was designed to accommodate the direction crytocurrencies will take in the future.

## Digital Autonomous Corporations: Mathematical Notes, Object Process Algebra

Bitcoin type systems are specific examples of very specific types of mathematical constructions. There are transactions and transactions take unspent outputs and destroy them, creating new unspent outputs. Access control is by signature, only the person whose the private key can use the object.

Outputs are objects with state, which have methods and the methods describe who can call the methods. A method might say "Only the person with the privatekey can call me".  The state of the object does not exist on the blockchain, the blockchain only records the methods or transactions which act upon the state.

## Bitcoin's operator
- Destroys a list of outputs
- Creates a list of outputs

Each output is destroyed when used. To send $20 if you have $30 in an output, you send $20 and send $10 back to yourself (your output is destroyed by the transaction and two new outputs are created). Bitcoin objects are immutable.

Bitcoin objects are immutable because they are named by the SHA256 of their binary serialization. Modifying the object would change its hash and therefore its "identity" (which is the hash). Therefore you can only destroy, but not modify the object.

###### There is a more general construction than Bitcoin, which is:
- Object oriented (objects are named)
- Objects are possibly mutable (the state of the object can still be a hash, but the object and its state only uniquely identify the same thing if the object is immutable)
- Objects have methods
- The methods have their own source code in the state of the object, which describes what the method does and who can call it
- In Bitcoin methods only come from "outside". objects cannot generate messages which act upon other objects in Bitcoin
- The transactions or methods acting on the object are published in the blockchain
- The state of the object is implicit, but changed by application of methods (transactions)
- There are creation and deletion operators for the objects
- How the object state is changed by applications of methods is described by the object itself (homoiconic representation)

###### For instance for methods on an object you could have different program preconditions, that determine if a call on that object is valid:
- Anyone can call this method
- Only the person who knows this public key can call the object
- This method requires signatures from these two public keys
- These are just different programs/preconditions that can be described in the object itself (the source code for the method is in the object state)

###### Chain Visibility:
- In Bitcoin every transaction is public and synchronized between all clients. This does not need to be.
- Some chains could only be visible to group of people
- Some chains could be visible to everyone but only writable by a single person
- Some chains could be private or only internal within a program

The whole Bitcoin is just an instance of one of these systems, with a special singleton that takes in lists of outputs, destroys them and creates new outputs. So Bitcoin is just a singleton object with a method that has a creation/destruction operator on another type of object (which it creates and destroys).  Once you have a public ledger and you have this type of "Object Process Algebra" then Bitcoin is just 30 lines of code. There is no reason you could not have a billion Bitcoins or everyone could not have their own Bitcoin. There are systems that are apparently more general and powerful than Bitcoin, but its not clear what they do or how people will use them.

Etheurem is closing in on this idea, but choosing to do all the computation on a single chain. We have no idea what people will use these systems for, but believe people need personal blockchains.

We were thinking of scripting languages like this, but decided to keep them off the Skycoin blockchain, which should only be for coins and payments. This kind of blockchain is for something else entirely.
Of course we are going to implement this, but its not priority compared to other things. It distracts from more important and urgent development priorities. Its more like a developer toy right now.

## Digital Autonomous Corporations: Implementation

The Skycoin Project is drafting a standard for a minimal virtual machine which will allow program determinism, process isolation and deterministic builds for golang and a restricted subset of C.

- A standard for producing a merkle tree hash from a directory of source files
- A abstract syntax tree representation which is to be produced by the compiler
- A minimalist, deterministic assembly language closely matching LLVM intermediate representation
- A compiler for a subset of golang, into the intermediate representation

Golang's compiler is currently written in C. Golang is getting a new compiler written in Golang. The library allows us to parse golang modules into an AST representation. We are then able to convert the golang program AST into the deterministic IR representation.

###### Steps:
- We compile the golang compiler into the IR using the golang runtime
- We run the Golang to IR compiler on an interpreter for the IR.
- We used the interpreted IR compiler to compile the Golang, Golang to IR compiler to IR

###### Result:
- The hashes of the IR outputs should match
- We have a deterministic Golang to IR mapping
- We have hash of compiled Golang to IR compiler
- For performance the IR representation can be compiled down to platform specific machine code by LLVM (this may destroy determinism at machine code level, but is ok).
- The IR representation is very close to LLVM input and is equivalent to C if bounds checking and security are disabled

The non-deterministic parts outside of the IR are the system dependent file system, networking and the interpreter (we will call this "the runtime"). However, this part is very small. Since networking and file system access go through the runtime, we are able achieve process isolation.

###### This is a long term goal, but something that
- We believe this is necessary for the ecosystem
- We believe two or three developers could finish in a few months.
- We will write it out in terms of subprojects
- We will fund it when developers are available.

Eventually a strict subset of C and minimalist subset of C++ could be compiled to the IR representation. This would allow migration of the Bitcoin source, after deprecation of dependencies. Bitcoin's qt-depedency, idiosyncractic wallet storage format and dependence on OpenSSL, mean that a Bitcoin port is unlikely. The C standard does not define integer overflows and other behavior required for Bitcoin to achieve determinism.

However, Dogecoin or new altcoins prepared to make radical changes to the Bitcoin source code would be able to take advantage of deterministic builds and improved security.