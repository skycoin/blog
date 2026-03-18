+++
draft = true
title = "Quorum Proof of Stake"
tags = [
    "Decentralization",
    "Consensus",
]
date = "2014-05-23"
+++

# Comment:

Quote from: **iruu** on May 18, 2014, 10:40:39 AM
>A decentralized distributed consensus currency, so to speak. At least aiming to be decentralized.
>I don't really get the why. Why not some variation of proof of stake? For example a version where one stake equals one virtual node. No need for trust when there's financial interest.

Yes. We actually have two layers of proof-of-stake. There is the blockchain consensus, then within the blockchain we have coinhours, which are burned as fees. That is a form of proof-of-stake.  A forked blockchain with transactions reverted will have a lower total coinhour burn.

## Quorum Proof of Stake

During development, we came up with several new algorithms.

In one algorithm, coin holders elect a quorum of servers who determine blockchain consensus. The elected pubkeys/nodes vote between blocks in a public process. Then each of them unanimously signs the hash of the consensus block. Once all the quorum members have signed the block, they cant go back and sign another block with the same sequence number (example, block 5000). If the quorum members try to sign an earlier block, that has already been decided, then it results in the quorum being invalidated and a new quorum election.

To vote, a user moves their keys from address A to address B. Then they can sign a voting message with the public key for address A. If a user has 10 coins, they have 10 vote shares. If you require each person to have 10 coins to vote and there are only 100 million coins, then the maximum number of votes is 10 million. At 200 bytes per vote, that is only 200 megabytes of votes. Its tractable.

A corrupt quorum can vote for bad blocks (blocks with no transactions) or selectively deny transactions from particular addresses. However, a bad quorum cannot 51% attack or create a new block the network would accept.

Open issues, with this are whether to have the votes on the blockchain or off-blockchain and whether quorum decisions should be on blockchain.

Skycoin has a "blob replicator" and "public broadcast channel" and the idea, is that once data has been published, its replicated peer-to-peer and cannot be unpublished. So if a quorum publishes signatures for two separate blocks with the same sequence number (tries to 51% attack), then everyone will replicate that data. The existence of the signatures cannot be hidden and it must force a new quorum election.

## Hybrid Systems

Consensus in a Quorum is much faster (only ~15 nodes have to agree) than consensus for 200,000 nodes. So we might use the web-of-trust to elect the quorum and then have them do blockchain consensus.

We could require that a vote requires holding Skycoin. You have 10 coins in address A. You send the coins to a new address B. Now the public key for A can sign a vote slip and gets 10 votes. This proves you have coins and are a Skycoin holder and are not a bot.

You can combine, web-of-trust with the proof of stake/voting mechanism. You could require that changes to the Skycoin source code (for the blockchain module) require a majority of coin holders to vote to ratify the changes. You hash the files in some way and get a root hash and people vote on the hash. Then if someone gives you source files, you can hash them and get a hash and compare it to what it should be.

## End Game

We think we can go beyond proof-of-stake. We believe it is possible to be 51% attack proof, even if the attacker controls the majority of the coins and the majority of hashing power. We want an absolute, mathematical guarantee and that is what we are working towards.

