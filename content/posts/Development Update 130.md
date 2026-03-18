+++
aliases = ["/development-updates/development-update-130/"]
date = "2017-05-15"
tags = ["Development", "Infographics"]
title = "C2CX Listing and update"

+++
## C2CX Skycoin/Bitcoin Order Book

We are trying to get C2CX skycoin volume listed on coinmarket cap and get the APIs implemented.

We are also going to open up the SKY/BTC order book, so Skycoin will not only be pegged to the yuan.

## Infographics

We are working on an infographics deck. We will have \~240 infographics and diagrams on various topics, explaining the internals of Skycoin and usage.

These are uncorrected examples with a lot of errors.

![](/img/dev-update-130-1.png)
![](/img/dev-update-130-2.png)
![](/img/dev-update-130-3.png)
![](/img/dev-update-130-4.png)
![](/img/dev-update-130-5.png)
![](/img/dev-update-130-6.png)
![](/img/dev-update-130-7.png)
![](/img/dev-update-130-8.png)
![](/img/dev-update-130-9.png)
![](/img/dev-update-130-10.png)

## Video and Marketing:

We have full time person working on video story boards now.

We will do a major cleanup and then start porting older content onto the blog.

We will start story board production for the videos. We will have eight videos on various topics.

## Development:

We are trying to get the first two applications to release but dealing with bug back log.

## New Wallet:

We are completely redoing the wallet

* Support for multiple coins
* Thin client scanning wallet
* New UI based upon the byteballs and electrum wallet
* Fixed wallet size in pixels, so that layout can be controlled precisely to avoid cluttering

### This wallet will:

* Force you to backup your wallet seed when you start it up
* Will be able to run as a thin client if you do not want to download the whole blockchain

We are removing the full blockchain explorer from the wallet as it was a mistake and is too cluttered. And the blockchain explorer will be a separate application we will package with the node.

We will also start development of a "Consensus Explorer" to allow a user to subscribe to all nodes participating in consensus and to see the network status and global consensus state.

We also have to start development of a distributed logging system, that allows nodes to record and optionally publish publicly events such as

* Consensus state updates
* Time when block was received
* Time when transaction was received
* Node peer connection and disconnection events

This logging system will allow us to verify that the mathematical invariants for network consensus are satisfied (netsplit detection, early detection of non-propagating transactions, early detection of block flooding attacks, early detection of transaction flooding attacks).

The logging daemon will also implement a remote RPC (Skycoin Command and Control RPC) for allowing use controlled or chosen remote public keys to modify soft node settings (connection pool size, connection/disconnection from nodes, transaction rebroadcast) and will allow us to do cyber warfare drills on the live network.

* For instance if the network is flooded by 40,000 transaction backlog, we might use the command infrastructure to set transactions per block to 10,000 and clear the backlog.
* Or may increase the minimum coin hour fee for transaction prorogation to end the spam attack

### We will have three sets of connections:

* User defined hard coded connections (node your node must be connected to, that are chosen by the node operator)
* Peer-to-peer nodes (random nodes chosen by peer-to-peer process)
* Optional automatic recommended connections (command server suggestions for optimizing block/transaction/bandwidth availability)

### Also in the next generation architecture:

* Block prorogation will be moved to CXO
* Transaction prorogation will be moved to CXO
* Transaction relay functionality will be something that can be disabled or enabled independent of other features in the node
* The key-value store for blockchain historical information and indices will be something that can be enabled or disabled independent of other functionality in the node
* The wallet functionality will be refactored out of the node and will be something that can be enabled or disabled
* There will be no difference at the API level between a thin client and a full node for wallet operations and no difference in API usage between a local node and a remote node operating over a network
* The blockchain history database will use range queries and user will be able to configure whether to index and store the full history since genesis or only the last few million blocks or whether to begin pruning the index after a certain range limit. The key value stores for each type of index data will eventually be independent programs exposing an RPC, that can be run on different nodes completely. With no difference between a locally running and remote node. This is part of the BlockDB architecture (however is a low priority and may take two years to get this done).

## Naming:

We are probably going to rename the Skycoin transaction standard UXTO, to UXTX.

And we will call the old, Bitcoin way UTXO.

And we will call the way Ripple and Ethereum do it "The Accounts Model".

We have to standardize the naming conventions between different groups, because everyone is calling the same thing different names.

## Applications:

We are trying to launch the first two applications.
