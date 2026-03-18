+++
title = "Skycoin BBS Development Update #1"
tags = [
    "Development",
    "BBS",
    "CXO",
]
bounty = 3
date = "2017-08-05"
description = "The first development update for Skycoin BBS."
aliases = [
	"/bbs/bbs-development-update-1/"
]
+++

## An Introduction

BBS stands for Bulletin Board System. Although traditional BBS systems are no longer widely used, BBS in the modern era is an icon for social services.

Skycoin BBS is one of the first web applications to be implemented using the skycoin ecosystem. Skycoin attempts to revolutionize the internet; decentralizing it and encrypting protocols by default.

Underlying Skycoin BBS is a peer-to-peer self-replicating database named CXO (part of the Skycoin ecosystem). It features immutable tree structures of Golang objects. All objects are referenced via their hashes alongside defined schemata. Each tree has a root object and signed against a public/private key pair. To update the tree, roots have incremental versions called "sequences". This design allows for fast, bandwidth efficient data replication.

## Data Structure

The data structure of Skycoin BBS (version 0.2 - in development ) contains boards, threads and posts. Boards and threads can be voted on. This is how it all looks in a CXO tree:

![](/img/cxo_bbs_datastructure_v0.2.png)

This is a simplified diagram.

All submitted objects (threads, posts and votes) are to be verified via the submitting user's public key and provided signature.

Each root contains data that is used to represent/store a single board. BoardPage contains the "content"; the board itself, threads and posts. Threads are referenced by the hash of the "Thread" object while posts are referenced by the hash of the "Post" itself. Hence, posts and threads cannot be modified once submitted.

ThreadVotesPages, PostVotesPages store the votes for the content. The "ref" field of the VotePage contains the hash of the content in question. The "Votes" field stores votes for the specified content. The VotePages are to be "compiled" by the BBS node into a storage structure that can quickly obtain a "view of votes" for the front end.

Votes are stored separate to the content to reduce the number of tree nodes that needs to be changed with every vote. It also allows for easier vote data manipulation by the vote's compiler.

## Releases

Currently, only one stable version of Skycoin BBS has been released. The features are basic, but the CXO data structure is more complicated than the one specified above. Content addition and voting resulted in the root sequence to increment multiple times per action.

Version 0.2 of BBS (currently in development), not only increases performance and code clarity, but also will implement the following new features:

* Improved content loading - We will make use of WebSocket connection(s) between client and server to allow for real time updates and more efficient content loading.
* Content voting/viewing improvements - Both in actual performance and fluidity from the user's perspective. Spam reporting will also be introduced.
* Permissions - Boards will be able to set permissions on as to who can perform what actions (e.g. submitting content / voting). The ability to block users will also be available.

## Participate

Get up to date with the development of Skycoin BBS by joining our [Telegram Group](https://t.me/skycoinbbs).

Skycoin BBS is open source. The git repository is located [here](https://github.com/skycoin/bbs). Note that the development for version 0.2 is in the "v0.2" branch.
