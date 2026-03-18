+++
aliases = ["/ask-the-developers/ask-the-developers-3/"]
date = "2014-03-24"
description = "A weekly session where users can comment or ask questions to the Skycoin Developers in order to gain a better insight and understanding into the Skycoin Project "
draft = true
tags = ["Ask the Developers"]
title = "Ask the Developers #3"

+++
# Ask the Developers - Session #3

### Comment:

Quote from: td services on March 23, 2014, 04:01:09 PM
![](/img/ask-devs-3-1.jpg)

> Does the above display look right, or should I be seeing some numbers or transaction activity?

> I'm trying it out an ArchLinux install now to run it on Beaglebone once I get it running on Virtualbox on the Indiebox stack.

## Response:

Yes. You have it working! The wallet gui is running a GTK window that embeds webkit. The wallet is HTML/Angular with a localhost golang webserver. That is what you are looking at. The wallet uses the JSON interface to check balances and do sends.

* We don't have transaction history yet. You can check balance and do sends using the unspent output set, but transaction history requires parsing old blocks and putting it in a database.
* The wallet RPC is currently being updated (in branch) to support multiple wallets and the new deterministic wallet seeds.
* Then the wallet code will be updated to match the new RPC before launch
* You can run a local blockchain, but the global testnet blockchain is not running right now.
* There is a tool in ./compile/test-coverage that generates an HTML coverage test across repo
* ./test.sh runs the unit tests for each module
* you can generate addresses and test out deterministic wallets with `go run ./cmd/address_gen/address_gen.go -a -n=5 -seed="test"`. This tool needs some work. This prints 5 (pubkey, seckey, address) pairs generated from wallet seed "test"

Technically, we can launch testnet right now. Everything is working.  There are a few changes I wanted to make however

* new wire protocol
* reduce number of command line options
* simplify module interfaces and take steps towards requirements for Obelisk integration
* hardcode genesis block parameters into source instead of using configuration files
* document JSON RPC that exchanges need

After launch we have to

* work on darknet
* language translations for wallet
* improvements to connection pool and wire protocol required for Obelisk
* work on Obelisk and achieve full decentralization
* blockchain explorer and transaction history
* blockchain database module (for storing and querying transaction history)
* benchmarks for blockchain parsing

The priorities are

1. Get blockchain running and windows, osx and Linux binaries released
2. Skycoin Darknet v0.2 Running
3. progress towards Obelisk implementation

The user community is giving a lot of support. We have volunteers working on the wifi controller library for the darknet and others have made significant contributions to the darknet design. Others have donated Bitcoin to pay for build and testing servers and others are working on a Docker wrapper for Skycoin node deployment and working on the Chinese wallet translation.

The code base is becoming very clean and modular. Skycoin will be much easier for new developers to work on and improve compared to the Bitcoin source.

**Update:**

The new wallet and wallet rpc branch has been merged into the main branch.

***

## Comment:

Quote from: **td services** on April 06, 2014, 11:54:04 PM

> I'm negotiating to buy and resell the quad core ARM Odroid and/or NanoPC boards to run Skycoin and other PoS coin nodes for a mesh darknet, personal/public cloud storage, and encrypted VOIP. The boards are at http://hardkernel.com/main/main.php and http://nanopc.org/NanoPC-T1_Feature.html . A Ubuntu 12.04 build is already available for them, which I also have running with Skycoin on Virtualbox. I'm considering setting up a bunch of these in the Mission District of SF to start a cryptocoin based meshnet, so the proposed Skycoin subsidy would be a boon for this.

> An $8 wi-fi USB module is available. Anyone have any idea if I should have 2 Wi-Fi radios per unit? Maybe even 3 if using 802.11b or g, 1 for each distinct channel, 1, 6, and 11. Directional antennas would be better, but will require a pricier Wi-Fi module.

> Looks like not all dongles are created equal as far as using as an access point, http://forum.odroid.com/viewtopic.php?f=8&t=1952 . Their Wi Fi 3 does have a threaded connector and is 802.11n, but antenna is an omni. I'd rather have 3 radios with 120 degree sector antennas for 360 coverage with 3 channels.

## Response:

For hardware:

* Edimax EW-7811Un (good linux support)
* TP-LINK TL-WN722N (external antenna support for long distance directional links)
* Ubiquiti Nanostation routers (1 mile range line of sight, $80 each)
* Ubiquity AirFiber (15 mile ranges, 1.4 Gb/s, $1500)
* TP-LINK TL-ANT2424B 24dBi 60 cm Directional Grid Parabolic Antenna (10 mile range line of sight)

The subsidy will be about $200/access point.

We need libraries in golang for controlling the wifi devices from linux, scanning for networks, connecting to them, disconnecting.

***

## Comment:

Quote from: **l4p7** on April 07, 2014, 11:08:30 AM

> Can someone explain what the services are Skycoin will provide? By services I mean "remittance" or e-commerce / micro transactions which Bitcoin enables? Is Skycoin another Bitcoin with own code base that overcomes the design flaws of POW/Bitcoin? How does it enable mesh networks? And will Skycoin have applications beyond mesh networks?

## Response:

Yes. Skycoin starts with security and usability. Skycoin eliminates the waste of mining and eliminates the 51% attack threat. Skycoin fixes signature malleability, hash collisions in coinbase outputs and several flaws in Bitcoin.

Then Skycoin adds a new, more usable wallet and features to make it easier to use than Bitcoin.  For instance, if you have Dogecoin in your Skycoin wallet and a merchant wants Bitcoin, you hit send and it will convert the Dogecoin to Bitcoin at an exchange at market rate and send the coins to the address. We are able to do conveniences like that. We want to support the major coins in the wallet and want to have receipts, messages and other improvements that streamline usage.

Then Skycoin is focusing on applications that drive adaption and utilize the coin. The mesh network is something we can get working quickly and see if it gets adaption. However, it just one application that we are working on. Skycoin is really an application stack and ecosystem.  Ethereum and several other projects are already using libraries that were developed under the Skycoin project.

Another example, Ethereum offers the ability to do computations in the blockchain and the Skycoin wire protocol is gradually adding support for "personal blockchains". So instead of having one global blockchain, each person can have their own blockchain, which is cryptographically secured and which the people who need the chain replicate. So it may end up making more sense to embed Ethereum's contract system and scripting language in "local" chains instead a single global chain (which can become bloated) and the moving assets between chains.  This could be the basis for an open transactions style crypto-securities system.

You generate a public key and only the person with the private key can mint new blocks, but everyone can replicate the chain if they know the hash of the public key. The block body can be any array of bytes. This is a major set forward for making it easy for developers to create new blockchain based applications.

Skycoin is not just a coin, but a set of libraries and standards.

***

## Comment:

Quote:

> You would need a wallet that has an inherent market for that. Or would you just allow users to hold all kinds of coins in the one wallet and let them then spend whatever coin is required at a given exchange rate?

> The personal blockchains base, the wallet and all that is quite a big endeavour. What development time did you plan for all this?

Ethereum and several other projects are already using libraries that were developed under the Skycoin project.

> Can you point me to those libraries and/or a prove of Ethereum using them? Sorry for the dumb questions. Due diligence is necessary at a place where anonymous developers are doing ICOs...

> Thanks and kind Regards

## Response:

> You would need a wallet that has an inherent market for that. Or would you just allow users to hold all kinds of coins in the one wallet and let them then spend whatever coin is required at a given exchange rate?

We are able to expose exchanges as a Skycoin "service" in the wire protocol. There will be a single API and multiple exchanges implementing the API. Any exchange that runs an exchange service will be discoverable and automatically usable by the wallet. This is part of the "Gateway Protocol".

> . What development time did you plan for all this?

Personal blockchains are done.

The only thing left is the wire protocol for replicating the chain.

Exchange service is part of the "gateway protocol". The gateway protocol requires coin launch and several other components under development.

> Ethereum

We received pull request from them and they resolved the gmp dependency bug we had for OSX, so I am assuming they are using some of our libraries. Not too familiar with the code base. There are a number of golang coins in development and the toolchain is evolving faster than the Bitcoin mainline tool chain.

***