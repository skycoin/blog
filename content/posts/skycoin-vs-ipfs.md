+++
title = "Skycoin/CXO vs FileCoin/IPFS"
tags = [
    "Ask the Developers",
    "CXO",
    "Skywire",
]
bounty = 4
date = "2017-08-09"
aliases = [
	"/ask-the-developers/skycoin-vs-ipfs/"
]
+++

We have been asked what is the difference between [CXO](https://github.com/skycoin/cxo) and IPFS.

File Coin has the same objectives as a part of the Skycoin infrastructure, but is taking a different approach.
They have three separate protocols:

- IPLD
- IPFS
- Multi-formats

where,

- IPLD is a representation language for immutable data objects and hashes.
- IPFS is a file system
- Mult-formats is a self describing data standard

In Skycoin, CXO does all three of those

- Multi-formats is just a "schema" in CXO
- IPLD is just CXO (immutable data structures, hash chains, replication, merkle trees etc)
- IPFS is just an application on top of CXO (CXO is immutable object system and files are just objects, so do not need special treatment because files are just a type of object)

FileCoin does "proof of storage". While Skycoin takes a different technical approach, because we think proof of storage is too complicated and is not really what the user wants and its not actually the bottleneck.

IPFS/IPLD/Filecoin is designed to integrate into the existing web-infrastructure and javascript. While skycoin is implementing a new eco-system de-novo ([skywire](https://github.com/skycoin/skywire), CXO, CX), because the existing ecosystem lacks required mathematical properties (javascript is not deterministic, implementations vary between browsers, cannot be used to embedded on blockchain or used to full potential because of legacy issues).

And additionally, because privacy and security is not something that can be duct taped on to the top level of a stack, but requires the proper design of every component from the hardware, up. Skycoin takes a mathematically strict, elegant approach that allows a simpler implementation by having a self contained standard and eco-system.

So file-coin will integrate with the existing internet and will just be a javascript library that can be imported. Skycoin will have a new internet with parallel protocols and hardware.

The roughness and impedance mismatch is always going occur at the system interfaces and skycoin took take the approach of minimizing the components to the minimum, being self contained and minimizing dependencies between the modules. One of the reasons we did not do "proof of storage" for incentives was that it required making file storage a dependency upon the blockchain and we felt file storage already operates efficiently, without adding the overhead of a blockchain, so that this was not the right place to put the user incentives.

We did not want to build a "new internet" that simply shuts down like an arcade machine because the user did not put in enough coins. We did not want the user experience, to be having to pay for every single feature, button click, file download or action, when each action is effectively costless.

So Maidsafe, Ethereum, FileCoin/IPFS, are all taking a different approach and philosophy, but heading in the same direction. There are substantial differences in scope and technical implementation

- Ethereum tries to put everything in the world on a single blockchain (while skycoin puts almost nothing on the blockchain, except coin payments. Skycoin has an individual blockchain for its version of ERC20 tokens, instead of putting all the tokens on a single monolithic blockchain)
- MaidSafe is concerned with identity and has the least blockchain (while in skycoin there are global identities. Identities are just public keys and are pseudo anonymous)
- FileCoin is concerned with proof of storage and only file storage (Skycoin also includes communication and computation as primitives. Skycoin's storage mechanism is independent of the blockchain and is only monetized indirectly)
- Golem is only concerned with renting out servers/GPUs by the hour for coins (which is the same as EC2 that takes Bitcoin and will just be a minor feature of more advanced networks)

One of the problems in the Skycoin Project, is that the documentation and [whitepapers](https://www.skycoin.com/whitepapers.html) only cover the work on consensus (two years old already) and do not show the current development work and ecosystem. So the website needs to be updated and we need new white papers about each of the sub-projects.

The development is significantly ahead of documentation. For instance CXO applications ([BBS](https://github.com/skycoin/bbs)) are already in testing and light usage, while the white paper for CXO still has not been written yet.

So we are still catching up on the marketing and communication back log.
