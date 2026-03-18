+++
title = "Development Update #105"
tags = [
    "Development",
]
date = "2016-09-01"
aliases = [
	"/development-updates/development-update-105/"
]
draft = true
+++

##### These are the things we need to fix for :

- Launch
- Exchange listing
- There is a bug, where if you are running a skycoin node that starts with computer boot and you unplug the power to the server, there is a chance that the node wont start up again (corrupted files on disc, very annoying). However, we rename files before writing to ensure there are backups of the previous version, so
- We need a database that stores each transaction hash and the block that the transaction was executed in (for exchanges, to enable API to track skycoin transaction status)
- We need a database (sqllite?) for storing the block hash, previous hash and block depth and then key-value store for storing the block binary blob.
- A transaction database, to run JSON history API. Also blockchain explorer in wallet (no calls to remote servers, to leak data about what addresses or history you are querying or what coins might be in your wallet).

- The website [skycoin.com](https://www.skycoin.com). More description. White papers. Documentation on protocols, gmaxwells coinjoin, server API, thin client, consensus network, meshnet components, etc... We need to write hundreds of pages of documentation.
- Enable HTTPS on server. Force HTTPS. Force ChaCha20-Poly1305. Also do binary distribution over bitorrent (higher security than HTTPS, but may be using md5 hashes? have to check). IPFS is probably best, but does not have the installed base of bitorrent. HTTPS will not protect against state sponsored attacked, because of timing channel attacks for recovering private keys, on any webserver running OpenSSL based HTTPs/TLS. Additionally attacks/govt mandated backdoors at certificate authority level. We will eventually have an internal distribution network (based upon skycoin content addressable storage, running on top of meshnet).

- Consensus. In progress. The full consensus network should be done soon. The prototypes were in python and we had to write a new version from scratch in Golang. /src/visor needs to be refactored a bit, in order to support the new mechanism.

##### So:

- APIs for exchanges to interact with the skycoin wallet
- Skycoin website
- Blockchain storage for scaling to large number of blocks
- Integration of consensus into the chain

I think we will cut down other development for a while and try to get this done.

##### Right Now:

- block storage (make sure it scales)
- transaction history (have library for querying this)
- blockchain explorer in the wallet (on top of the transaction API)
- website (add graphics and basic information)
- API (make sure the json/wallet API is ready for exchange listing
- consensus integration
- bug fixes in wallet

Then we are 100% ready for Skycoin exchange listing.

## What is Skycoin?

I am having trouble explaining what we are doing or why we are doing it.

##### The "Coin" is:

- A new block chain
- A new crypto library
- A new consensus algorithm (non-POW, non-POS), based upon Ben-Os and new crypto/consensus research (no miners)
- Some libraries for peer-to-peer replicating the transaction and blocks over the network
- A wallet format
- A "local web wallet" (the wallet is HTML but is hosted locally instead of a remote server)

##### The coin is only a small portion of the project.

- Next generation networking (new networking protocol to enable mesh networking, new address space, source routing, basicly a new internet from scratch). Default link level encryption and end-to-end encryption. IP addresses replaced by public keys. Source routed. Codress messaging (the destination and source of communications are not revealed). Payments to nodes from bandwidth consumers, to bandwidth producers. I call this "Skywire" because that is what it is used for, but it is actually a completely new type of networking.
- A solid crypto library https://godoc.org/github.com/skycoin/skycoin/src/cipher
- Prototypes of content addressable storage and peer-to-peer object replication protocols for social media, blockchain, file sharing and next generation internet
- A new scripting language for blockchain applications. That is flexible enough to replace SQL for ERP systems and which has applications in IoT.
- A networking and packet serialization and binary RPC with near zero overhead
- Social media test applications built on top of the meshnet and content addressable storage primitives. Example. Your identity is public key. You create tweet, you hash the tweet (content addressable storage) and sign the hash with your private key. You publish the tweet. Everyone who is subscribed to your feed (your public key), replicates the data peer to peer. This is like bitorrent but for data/websites/tweets/blog posts, everything.
- A multihop VPN application that can tunnel over the meshnet (can do Shenzhen->beijing->Russia or Shenzhen->Hong Kong->Japan->Russia and choose geographic data paths, based upon latency and throughput instead of accepting default data path. Can bond bandwidth from multiple independent paths). This is done, but only works for OSX/Linux and does not have a GUI yet.
- A secure messaging app, similar to TOX, that allows you to send messages to people based upon their public keys.  Secp256k1+ChaCha20
- A native IPFS implementation using the skycoin crypto primitives and networking.
- A multi-coin thin wallet API (part of skycoin-exchange) that allows you generate private keys, generate addresses, check balances and perform transactoions for multiple coins from the same API (currently only Skycoin and Bitcoin). github.com/skycoin/skycoin-exchange
- A federated open source exchange infrastructure. Enables easily converting between coins and allows people to receive or make payment, in any set of supported coins (you can accept payment in litecoin, but store the value as Skycoin or Bitcoin through automatic conversion). If you have only Skycoin in your wallet, you can pay a merchant in Dogecoin, through automatic conversion through the exchange API. This will be more important, as soon as cities and localities begin to issue their own blockchain traded currencies.
- Ability to send and receive invoices and receipts by public key over the messaging facility
- Asynchronous minimalist messaging facility, similar to XMPP (but binary instead of XML and with all the crap cut out). For management and messaging. (I am trying to avoid this if possible, but do not think it can be avoided because later things need this). Needs to run natively on the mesh fabric and cannot depend on DNS/BGP/TCP/ip etc. Internal mesh only.
- Electrum like multi-coin wallet, that is able to generate addresses, check balances and generate transactions over multiple coins (skycoin-exchange).
- A node manager for managing dozens or hundreds of meshnet nodes, from a central command server. Checking status, adding routes, SSHing to node, deploying processes. Auto updating.
- Analytics for Skycoin Meshnode pluggable transport. One way latency. Two way latency. Packet drop rate. Throughput/bandwidth at different time scales and resolutions.
- "Pluggable transport" interface and specification for node-to-node connections. Transport can be tunneled over HTTPS, SSL, SSH or an IoT protocol in the future. The transport is swappable.
- Exchange API for facilitating bandwidth micropayments, without going through the blockchain (off chain payments through third party).
- Route lookup service and crawler service for determining mesh connection topology.
- Golang object serialization library
- Golang content addressable storage object library
- database and network replication libraries for content addressable golang/storage objects (blocks, transactions, social media posts, files, etc)
- Library for saving files to disc, so that they are not corrupted, when power fails in the middle of save. The corrupted files, crash the node on the next startup and frustrate automated deployment of a large number of nodes. Hash objects/content addressable storage is also more immune to data corruption and detects flipped bits and media/RAM failure automatically. Corrupted objects can be discarded and redownloaded from the network.
- A new console in OpenGL, so that we can have cross platform command line for node administration. We actually had a new console written in Golang/OpenGL, so that we can get the same interface on OSX/Linux/Windows.
- etc...

Once we have the base layers working and libraries and networking, then we need applications. We are going from one application (the wallet), to multiple applications (messaging, exchange, vpn, meshnet, etc).

##### We almost have standardization of:

- Containerizing reading/writing to disc for a given application
- standardization of how application renders GUI (JSON API, angular, typescript)
- Containerizing networking (only through meshnet, connection by pubkey)
- Starting and stopping processes on nodes

We have no thought through, how we are going to distribute and support multiple applications being built out of the lower level infrastructure.

At that point, we are almost at an "app store" level. Or atleast "package manager" level. Where people will be able to write open source apps in golang, on top of a limited set of libraries (the skycoin networking, crypto, the method of display and generating a GUI).

##### For instance:

- https://blog.cloudflare.com/building-the-simplest-go-static-analysis-tool/
- https://godoc.org/golang.org/x/tools/go/loader

We can take a program in golang, in a folder as source code. Do static analysis on it, to ensure that it only import the current networking and file system libraries (approved list of libraries). Containerize and isolate file system and networking access for security. Then compile it from source into an executable. Run a process, track the process, shutdown the process remotely.

So eventually, I think we will be able to deploy applications to remote nodes and start, stop and configure these application remotely.

In the long term, we have our own application programming language in development (which is almost identical to golang, but with stricter mathematical constraints, so as enforcing determinism). This would be primarily for blockchain applications and contracts but also can be used for application development.

---

##### In general there are:

- libraries needed for implementing other libraries or applications
- applications that increase Skycoin capital inflows directly (can be monetized)
- application that increase Skycoin user base
- applications that increase Skycoin liquidity
- applications/refinements that increase Skycoin usability

Currently I think the primary development priorities are:

##### Exchange Listing: (requirements)

- Consensus integration
- Scaling blockchain storage (blockchain database)
- Transaction history API and blockchain explorer API
- The website and more documentation
- vVerifying that the wallet API has all functions required (we found out we were missing a few, after building our own exchange)

Then parallel priority for development is:

##### Meshnet:

- Get this working ASAP
- Pluggable transport, refactoring, cleanup, node manager, analytics, network topology and route service

##### Then secondary priorities are:

- Multicoin API
- Internal exchange ( github.com/skycoin/skycoin-exchange)
- Applications over the new network (social media, content addressable storage/IPFS, messaging, self hosted applications, etc...)
- Bug fixes,  usability improvements and scaling
- Improving project management, number of developers and the number of projects we can have in progress at once

##### Then tertiary priorities are:

- Own programming language (with metacircular interpreter and mathematical determinism, for application development and blockchain scripting for third party blockchains).
- App store? figure out how to deal with proliferation of user facing applications
- Metrics and graphs and visualizations for consensus network
- Speculative research projects

##### So doing the small changes and refactor for exchange listing, is #1 thing to get developers on.

- I did not notice these things were missing, until the Skycoin/Bitcoin internal exchange was done and we were going through integrating it. You do not notice that an API function is not there, until you go to use it.
- We are saving all blocks to disc, everytime we save, even if the block is already on disc. Because we are gobbing all the blocks. This needs to be fixed, because will slow down severely once we have a new block every ten seconds.
