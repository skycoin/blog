+++
aliases = ["/ask-the-developers/ask-the-developers-7/"]
date = "2014-05-07"
description = "A weekly session where users can comment or ask questions to the Skycoin Developers in order to gain a better insight and understanding into the Skycoin Project "
draft = true
tags = ["Ask the Developers"]
title = "Ask the Developers #7"

+++
## Comment:

Quote from: **illodin** on May 07, 2015, 12:05:22 AM
> Is there any use of running "full nodes" or w/e they are called in Skycoin, i.e. running the client with port 6000 open?

## Response:

Yes. PM me your node IP address and I will add it to the default list.

Skycoin has two modes of peer-to-peer connections
- DHT lookup
- PEX

DHT is disabled by default now and pex is disabled until there is time to fix issue. DHT was too slow and didnt work well.

PEX works very well but peers are exporting ip addresses, even if they are unable to connect to that IP address with an outgoing connection because of firewall, so it was slowing down time to connect to network to unacceptable levels, because vast majority of clients did not have an open port for other peers to connect to. Peer exchange over PEX needs to be refactored, so that there is an exponential backup for failed connections and so failed connections are not constantly readded to list of peers by PEX messages. Then PEX will be re-enabled.

The more full nodes there are, the most copies of the blockchain and the more robust the network. However, we have found that any P2P system is going to end up under sybil attack. We believe, from the Bitcoin node statistics that the network has been captured and that less than ~5000 nodes control block and transaction propagation already.

The number of full nodes is suspiciously constant and does not vary with the number of users running the Bitcoin client
https://getaddr.bitnodes.io/dashboard/

There is a cloud of sybil nodes and they only refer you to other nodes in the sybil cloud. They will never give you an address of a client outside of the set of attack nodes. That is the situation Bitcoin appears to be in, but its not clear.

To deal with this, in Skycoin, we will do a mixture of hard-coded network links between nodes (allowing users to have preferred peer lists, that users can edit by hand) and peer-to-peer connections, to augment the network. The objective is to prevent the sybil nodes from controlling propagation of transaction, block and consensus propagation.

![](/img/ask-devs-7-1.png)

---
## Comment:
Quote from: **houlala1** on September 30, 2016, 09:33:42 PM
>When i invested in this coin i was single

>Now im married and have 2 kids

## Response:

LOL. R&D work is slow. It took us two years of research, trial and error and prototyping to figure out how to solve particular problems.

There is no longer any coherent explanation for what we are developing, that will make sense to 95% of people.

Q: "How is it different from Bitcoin?" A: "No duplicate coinbase outputs", "No miners", "No transaction malleability", "No signature malleability".

"The skycoin UXTO/TX graph is a directed bipartrate graph, while Bitcoin has a multi-graph." Explaining the different, does anyone care?

The coin is more a series of mathematical properties and constraints that the implementation must obey.
- The properties the consensus algorithm needed to have (constraints), imposed the consensus algorithm we developed
- The requirement for bounded memory usage, imposed the transaction graph structure and way things were done differently than Bitcoin
- The properties that the networking and communications between nodes (source independence, immunity to various attacks), imposed the "Skywire" (really an overlay network, that can be used to build meshnets, but has nothing to do with meshnets)
- The properties for minimizing damage during blockchain forks imposed the constraints of no signature malleability, no transaction malleability, no duplicate coinbase outputs and a functional/stateless UXTO state that did not depend on previous blocks or which block a transaction was included in. It is actually possible to do consensus over a partial ordering of transactions (directed bipartite graph). Technically do not even need a total ordering over the transactions (application to distributed database systems, because allows distributed writes without a central master or needing to lock).

It is like having to invent calculus, so that you can solve a physics problem, then complaining it took so long. Some of the things are Urbit level and they do not even have names.
- "I think I will call this crypto thing a public broadcast channel"
- "I will call this a blip blop replicator"
- "This type of software defined networking, lets call it a meshnet"
- In Bitcoin the process of creating coins, doing consensus and introducing new transactions into the ledger are the same. In Skycoin, they are separate and orthogonal and can be swapped out because they are not coupled with each other at all. If we can do consensus on the equivalence classes of the bipartite graph of UXTOs and TX, then we might not even need a blockchain at all. Any two arrays of transactions are equivalent, as long as they map to the same UXTO/TX bipartite graph. So this leads into "post-blockchain".

We are behind schedule, in clock time, but geopolitically we are on schedule. After all, only a crisis, real or imagined, produces change.

I want to close out the coin part and get it listed and have all the requirements finished. Its about time.

---
## Comment:

Quote from: **dev gone?** on November 27, 2016, 08:46:41 PM

>Is there anywhere to trade skycoin yet?

>I haven't seen any trading threads, or exchange listings.

## Response:

We are very bad at this part. This is a new coin from scratch, so if we need something, then we have to code it.

 To get listed we need
- working CLI
- working WebRPC interface
- blockchain explorer
- website
- white paper
- wallet download

We could have done these two or three years ago and should have made this a priority.

In the last few months we did
- the CLI is done
- the webRPC API is done
- the blockchain explorer or sort of done (APIs are there but still fixing bugs)
- the website is sort of done, but undergoing multiple rounds of improvements ( https://github.com/skycoin/skycoin/commits/master )
- the whitepapers, we need three white papers plus infographics, because this is a large project and its not clear to people what we are trying to do
- the wallet download works and now we have automated installation/build scripts for ansible and docker ( http://github.com/skycoin/devops )

All of those are in progress, then we are 100% done with everything for listing. Then the coin will be a "finished product".

I think it is tradable now. We are just finishing the blockchain explorer (which turns out to have been massive task, with 60 sub-tasks and new bugs and full of API calls that were missing when the frontend developer went to implement the interface).

---

Getting to this point however is extremely daunting. If you broke it down into sub tasks, its hundreds of small things that need to be done.

We have an exchange partner now too. To handle ICO and listing, liquidity and stabilizing price across all the exchanges.

This is getting complicated too, because we just write code. We did not have people in place for product stuff (like finishing working software and launching it). Now we are at point of launching five separate "products" or end-user applications, at the same time.

We have several applications (like the VPN and meshnet) that are ready or working, but which do not have user facing interfaces and can only be used from linux/osx on the command line. The Skycoin consensus network, block, transaction prorogation and network stats will eventually need their own web GUI dashboards (like this ethstats.net )

So now we are building up product launch (finishing wallet and getting it to the users), marketing and user community experience/capacities. Where as we had no one doing this before.

We had too few people working on this. Right now, I think for just the white papers there are about five people involved on it and it will still take weeks (but is finally in progress). For blockchain explorer and API, took backend and frontend developer weeks and we had backlog of ~60 bugs or things to do (API requests moving, blockchain storage changes, changes to transaction history API, bugs with timestamp parsing etc).

The website, also needs dozens of small changes to be good. And we can only get a few changes in per week. We did a lot of work on the home page and are now working on the download page. Most of the work is deleting useless things one at a time. Then will go back and do the info-graphics and content pages. The evolution and revisions of the skycoin webpage design, could be a twenty page blog post, even through it is a simple two page sit with just a home page and then a download page.

You can track progress here:
- https://github.com/skycoin/skycoin/commits/master

The two highest importance things right now are
- complete the coin (100% status, for coin product). So that we can do listing and begin market/float
- get the user community on the same platform (so that we can coordinate the developers)

---

## Question:

>>do you plan to update your website in order for us potential users to get some info on developments, basic features and opportunities regarding this coin?

## Response:

We have ~30 people working. There are ~4 people doing the white papers.
- we only have one frontend dev part time on the website, so will take a while to get all the content
-- he is only doing the download page and wallet page right now
- we have one vector graphics guy, to do illustration
- have ~5 different people working on various white papers for the website
- we just got a community manager, who will handle updates and pushing notification to community on the social media channels
- we only have one angular 2.0 person part time for the wallet GUI and we have backlog of 40 to 60 bugs (wallet, blockchain explorer) and he is working through that
- Our ICO and exchange platform integration has been handed over to a third party and there are ~15 people getting exchange and ICO ready.
- we have one person working full time on the coin
- three people working on meshnet actively right now
- two people working on skyhash/aether
- one person working on CXO
- one person working on CX
- two people working on consensus implementation
- one person doing logo, infographics part time
- We had meetings with the exchange people and have liaison person and he needs to follow up.
- We have one person working on build scripts, docker and ansible 20 hours a week
- etc

So we are spread pretty thin right now. I am nagging the website person everyday and recruiting other people to nag him. After the download page is satisfactory and we have the white paper page, then we will start adding more information to the website.

The website has a backlog of twenty or thirty things and we are only getting one or two things done per day. Its four to six iterations to get a good download page and we are only doing one iteration per week.

We need to hire a person to just do documentation and improve our documentation for installation (for OSX and to verify build scripts work and to clean up documentation).

---

## Question:

>In the OP I read that less than 1% of the coins will be distributed and more than 99% held by someone

## Response:

2.4% of the coins have already be distributed. Each of the core developers is only getting 1% each and they are locked for several years.

The next ICO will be about 0.3% . Then we may have a 0.6% to 1% ICO at higher price.

We need a 8x to 25x appreciation, for the investors who have been holding coins for the last three years.

The market cap is the free float, times the price per coin. The speculators, marketing and exchange partners want the coin ranked in the first ten by valuation, for viability. Then they want a stable price that varies within a range and which gradually appreciates over time.

Our distribution schedule is very similar to Bitcoin.
- We are not doing a large sale of 30% of the coins at once like Ethereum. We think this distribution schedule sells to many coins and limits the upside for investors and will destroy the long term price when the speculators/miners dump.
- We are not hoarding 98% of the coins like Ripple (the Ripple free float is a lie)
- We think a gradual distribution with the number of new coins decreasing over time is the best distribution schedule.
- If the distribution negatively impacts the price, we will cut the distribution back and if it continues to fall we will begin buybacks.
- We have a professional market maker partner who is invested for the long term and will provide liquidity on both sides of the order book.

We think the Bitcoin distribution schedule is the most natural and has been the most successful. We do not have miners and no new coins are created, so it has to be done by hand, but we think that is best way to allow gradual long term appreciation.