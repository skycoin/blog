+++
aliases = ["/ask-the-developers/ask-the-developers-2/"]
date = "2014-01-01"
description = "A weekly session where users can comment or ask questions to the Skycoin Developers in order to gain a better insight and understanding into the Skycoin Project "
draft = true
tags = ["Ask the Developers"]
title = "Ask the Developers #2"

+++
# Ask the Developers - Session #2

### Comment:
Quote from: **Sage** on January 01, 2014, 07:49:40 AM
>Why is nobody contesting the obvious...?

>Endless 2% inflation?  And who gets that wealth?  Developers?  For the "public good" of course.

>"- All coins are created in genesis block." (Effectively a 100% premine.)

>"- The coins will be distributed in a fair, open process."  (Fair and open according to who?)

>Did we easily forget Google's "Don't be evil".

>It took less then a decade for any semblance of that motto to die.

>A coin should not rely on us to trust anyone.  The algorithm should ensure that.

>If we are trusting these guys to "fairly distribute" the coins, and fairly allocate the 2% inflation (robbery) of those holding the coins, then how is this any different then trusting a central banker?

>Skycoin as it stands is violating very basic tenants fundamental to what cryto currencies are all about.

>Skycoin guys... go back to the drawing board.  Get rid of the endless inflation.  Get rid of what amounts to a 100% premine.  Get rid of any need for us to trust you.  Then you might have something.

# Response:

>A coin should not rely on us to trust anyone.  The algorithm should ensure that.

Skycoin is designed to survive if the original development team is eliminated. This is a darknet coin.

The developers do not control who gets coins created from inflation. Skycoin holders vote to determine the distribution. Community voting and coin distribution is part of a mechanism to ensure financial incentives for developers to improve and maintain Skycoin.

Many previous coins have died because the volunteer developers of the coin disappeared and no new developer had an incentive to work on the coin. For a coin to survive for a century, it has to ensure survivability and robustness under unknown future conditions. The community needs to be able to mobilize financial resources to ensure continuity of the blockchain.

With the inflation/voting mechanism, if the community does not like the current development team, they can hire a new development team. Without inflation/voting, the community is at the mercy of whichever developers volunteer to work on the coin.

Voting/Inflation allows the community to decide the direction and priorities of Skycoin, instead allowing the current developers to dictate that direction. For instance, currently the Bitcoin is completely controlled by the development organization. Bitcoin holders do not have any meaningful input into the direction of Bitcoin. Users can sell their Bitcoins for other coins (exit) or theoretically decide to fork the block chain if there is a major disagreement (wont happen) but Bitcoin stakeholders do not meaningfully participate in the governance of Bitcoin.

Bitcoin's reliance upon the development organization and reliance upon miners are the only two things that could destroy Bitcoin in the long term. These are known threats and future coins should reduce their susceptibility to these threats as far as is possible.

>The coins will be distributed in a fair, open process."  (Fair and open according to who?)

Less than 1% of Ripples are owned by the ripple user base. The majority of the free float of Ripple was sold to investors, in secret, in backdoor deals at below market price. Skycoin will not do this. The users will own the majority of the issued Skycoin and no one will receive secret backdoor deals.

>If we are trusting these guys to "fairly distribute" the coins, and fairly allocate the 2% inflation (robbery) of those holding the coins, then how is this any different then trusting a central banker?

Skycoin inflation is distributed through a digital direct democracy. Skycoin stake holders vote and determine who receives the coins and for what. Inflation will be 0% if the majority vetos every project. The inflation is capped at 2% to prevent abuse by large stakeholders.

The voting and distribution process will be centralized at the start, for technical reasons. It will switch over to an autonomous decentralized process as soon as possible. The first project RFCs that will be funded through voting, should be decentralization of the voting and distribution process itself.

---

# Comment#

Quote from: **jimhsu** on January 05, 2014, 12:41:14 AM
>I'll try to ask OP some serious questions instead of "reserved" or trolling.

>How is initial distribution to investors handled? How are early adopter incentives structured, if any exist? What proportions of coins are allocated for developers for, well, development (and I assume, bounties and funds for future projects)?

>How are votes allocated and/or tabulated? If developers control more than 51% of coins, I presume this makes voting worthless? Thus, either the voting scheme is not a 1:1 correspondence with account balances, or the developers control less than 51%.

>How you you plan to transition voting, distribution, and node trust into a decentralized scheme? What is the time frame for such a transition? What are the conditions (node number, time, exposure of coin to wider audience) necessary for such a transition to go smoothly?

# Response:

The transition will occur when someone figures out a protocol for doing it in a decentralized manner and someone implements it. I want to get voting and bounties working as soon as possible, because it would speed up development.

There are other issues we are dealing with besides voting. For instance, we could make a very simple coin or a coin with very powerful support for contracts. In the extreme a simple coin would have no multi-sig, no scripting, no digital contracts. It just has your coin balance and you hit send and the other person gets the coin. It just works. This is how 99% of users use Bitcoin and the other alt-coins.

We noticed Bitcoin supports multi-sig and contracts but no one uses it. Mastercoin takes the prospective of "put everything on the block chain" but maybe contracts should not be on the block chain at all. For distributed exchanges and other types of assets, it appears to be more flexible to keep them off the blockchain.

A block chain is just a public ledger. We are thinking of letting each person create their own personal block chain, which support a more powerful scripting language. Each chain can choose the scripting extension and restrictions it supports.There is one central distributed ledger for Skycoin balances and each identity has their own block chain and securities live on these side block chains and can be moved from one chain to another. So we need a protocol for transferring assets between public ledgers, maybe a two phase commit protocol.

There are several considerations
- protocol for transferring assets between block chains
- preventing the owner of the chain from backdating or rewriting the ledger without it being detected (counter signing, linked timestamping)
- securing the "identity" of the ledger owner, without public key reuse
- handling assets on ledgers whose owners go off line or disappear
- ensuring no one has to replicate the ledgers of people they are not engaging in transactions with (anti-spam)

I want to get voting worked out, but there are many other things we are working on.

---

# Comment:

Quote from: **tk808** on January 10, 2014, 06:52:57 AM
>Skycoin was announced Dec 21, 2013 and they haven't asked for an ICO yet. Visacoin modeled their scam after this (Visa came after this)
I'm 99% they will be showing investors all their work and proof.

>Skycoin seems like the last, safe investment the bitcointalk community will ever see.

>I'll be investing in this project, even if it could be a scam. Skycoin has my trust. That's a lot coming from my attitude on all ICO threads.

# Response:

Non-mined altcoins are like stock in a corporation. A few people start with all the stock and these people sell it off and it becomes more widely distributed. Employees and key contributors get stock. The public buys the stock from employees and the founders.

Companies are about product and it matters what the company produces and does more than who owns the company. Crytocoins however are about community instead of being about product. If early founders hoard as many coins as they could get away with, then it will hamper user growth of a community based coin. That is the lesson of Ripple.

Skycoin needs a driver that will acquire hundreds of millions of users. Having the best coin is not good enough. From the beginning Skycoin was aimed at a number one position. Bitcoin is niche and the challenge of any new coins is not to become the next Litecoin, but how to surpass Bitcoin in terms of adaption.

If you don't have a strategy for surpassing Bitcoin, then the coin should be positioned to take over if/when Bitcoin is destroyed by internal/external forces. If the coin does neither, then its a pump and dump, or at best an inspiration for the successor to Bitcoin.

To succeed Skycoin must be radically different and more intentional than previous coins. Skycoin must achieve a level of necessity that Bitcoin has been unable to achieve.

___

# Comment:

Quote from: **Lordoftherigs** on February 11, 2014, 08:36:24 AM
>1.How is this coin going to be released ?
>2.When will it be released ?

# Response:
1. The initial ICO will be 1% of the total Skycoin for 50 Bitcoins. This is a 2 million euro starting valuation @ 400 €/BTC. The ICO period will be announced five days before the ICO starts.
2. Then 0.1% (100 thousand) SKY will be sold per day at market price to fund development and marketing
3. Distribution will be over five years
4. The rate new coins entering the market will decrease over time
5. The rate of new coins entering the market will be less than the growth in new users

---

# Comment:

Quote from: **vtbean79** on February 11, 2014, 07:06:43 PM

>OH boy...  I mean ..  I believe in devs getting paid for their hard work.  I really do.  But 5000 BTC?  (50 BTCs/ 1 million coins).....  I hope this thread doesn't turn out to be Ethereum...

# Response:

5000 Bitcoin cost a dollar a few years ago.

We looked at a mastercoin style ICO. We feel that selling all the coins at once deters user growth. We want to replicate the successful distribution strategy of Litecoin and Bitcoin.  The price has to steadily appreciate, but has to be kept artificially low by releasing new coins over time, in order to create an incentive for new users.

Mastercoin is worth a hundred million dollars on paper, but it has no volume,  no liquidity and no users. We are trying to avoid that by spreading the distribution over a longer time period like Bitcoin and Litecoin did.

---

# Comment:

Quote from: **Sanglotslongs** on February 11, 2014, 11:10:03 PM
>OMG $0.03 / Skycoin at ICO ? AT ICO ?
>5000 BTC is for dev, for buy ferrari and castle in France.

# Response:


1. Skycoin community members will get free coins, but we are not announcing mechanism yet to prevent cheating.
2. The initial ICO is $30k or 50 Bitcoin, valuing Skycoin at 3 million.
3. Most of the 0.1% per day of new coins will go to community members and people making contributions on project.

Also:
- Developers working on altcoin projects such as Ethereum are being offered $15,000 a month, 300 BTC at launch and then single digit percentage of new coins. Skycoin has teams in place and is not competing on greed basis for developers.
-  A company launching a new brand of Tequora spends 60 million dollars in marketing to reach mainstream and build brand awareness, for a single territory.  To reach Litecoin level acceptance, a new coin needs a 200 million dollar marketing budget or has to be extremely compelling and appealing to a particular niche who will readily adapt the coin. No coin to date has reached widespread mainstream acceptance.

---