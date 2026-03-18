+++
aliases = ["/development-updates/development-update-22/"]
date = "2014-05-14"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #22: Skycoin Mesh-net and Obelisk Announcement"

+++
## Summary:
We need to close out work on the coin so we can get onto the meshnet. We are trying to do too much:
- Coin
- Aether
- Meshnet
- Obelisk

Any one of these projects is an immense burden that requires a full development team.

The coin is done and we are just doing refactoring and cleanup of minor issues, but it is still requiring a lot of time. Aether and Meshnet are on track for completion. Obelisk is not scheduled. Development of Obelisk requires Aether and will be delayed until we get more development resources or until the meshnet is working and new people take over development.

We have people working on a applications for Aether. For instance, a user creates a key-value store. Each value is JSON data for a tweet. The first key is Angular code for rendering the feed and creating webpages from the JSON feed. A user subscribes to other feeds and pull them in. So we will have something like a distributed Facebook feed or Twitter feed where each user controls their own data.

The meshnet is designed. The implementation is pretty easy, but it wont be practical or useful until you can tunnel traffic through it and do file syncing and things like torrents. It needs to support clearnet nodes as well as physical mesh nodes, because most users will not be able to physically peer over wifi or ethernet with another Skywire node until network density is high enough. It has to be useful as a clearnet overlay for bootstrap as well as supporting wireless peering.

Once the meshnet is operating, we have developers who can come in and deal with the remaining issues and long term support and infrastructure build out. We have to get it working at a basic level.

Skywire and Skycoin repos are being merged. $GOPATH is very annoying and pulling in three repos to get it working is very frustrating. One repo makes development setup easier, but means each of the teams will be working on different git branches. Skywire is undergoing massive changes and reverse compatibility with older versions of networking will be broken constantly.

We might have to add functionality to WGET a text file from a website or some mechanism to notify clients about required updates. Ideally we should have functional tests and regression testing to ensure that minor updates are not breaking compatibility with older versions, but this is not in place yet. A number of issues with release schedule and deployment are coming up.

## Aether:

Having a message board and wiki running on Aether, for coordinating development would be good. That would help the community coordinate and make development less dependent on the central developers (who are currently overburdened).

We are finishing up Aether and have a full developer working on applications. Getting code tutorials out for third party developers is an extremely high priority.

## Altcoin Hell:

Massive amount of refactoring. Exhausting. Spent a full week helping new developers get repo setup and explaining stuff. $GOPATH issues from hell. Documentation. Going back and forth with big bitcoin investors and they are submitting changes to white paper and have to review and its back and forth, back and forth, endless revisions. Impossible to code and do eighty whitepaper revisions. Have to move everything to wiki, so community can help with editing.

Have to merge the Skycoin/Skywire repos and move all the crypto stuff out into its own module. Deprecating Visor. All the unit tests are broken and cant fix them, because the new refactor will break all the unit tests again. Arguments about functional tests vs 100% coverage tests.

Developers asking for Aether RPC and have to finish Aether and push it. The meshnet dev cant start until services architecture is ready and one of coin devs wont touch anything until the two monthly long massive refactor is pushed because it breaks all his code. Golang wifi controller library is done and meshnet design is done, but its not written down anywhere and the meshnet implementer needs doc so he can sit down and pound out implementation.

The faster we get some kind of communication channel and discussion board and wiki up, the more work can be distributed.

Quote from: **cryptrol** on May 08, 2014, 06:52:37 AM
>So what is the status of the different parts of the project ? Can you please make a briefing ?
>I have compiled the main skycoin code and it works, but I am unsure as of how to join the different skycoin components like the darknet.
>Is there a testnet working ? Where can we get some (testnet) coins to test the wallet functions ?

Large refactoring going on. The block replication and transaction relay server is currently in the Skycoin repo. It is being replaced by the Skywire wire protocol.

Then the command line options are being simplified and visor is being refactored. The cryptography and address generation needs to be moved out as its own package. This means you will have to pull three repos into the gopath, the crypto library, skywire and skycoin. Skywire has block replication, transaction relay service, aether and will probably contain the meshnet as a service.

Skywire does not import Skycoin and uses callback functions when needed. Obelisk may be in Skycoin, but will be a Skywire service. We have to see how it works out. It might make sense to merge everything into a single repo.