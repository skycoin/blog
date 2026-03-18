+++
aliases = ["/ask-the-developers/ask-the-developers-8/"]
date = "2016-12-25"
description = "A weekly session where users can comment or ask questions to the Skycoin Developers in order to gain a better insight and understanding into the Skycoin Project "
draft = true
tags = ["Ask the Developers"]
title = "Ask the Developers #8"

+++
## Comment:

Quote from: **WigitGetIt** on December 18, 2016, 02:58:55 AM
>Lost me Here: Skycoin has no mining

>Good Luck.

## Response:

Mining is a security flaw. Satoshi's original vision was for a **decentralized** cryptocurrency. The Bitcoin network is controlled by three mining pools. At one point Gigahash.io controlled over 65% of the network.

The objective of the Skycoin project from the start was to fix the problems in Bitcoin. This includes redecentralizing consensus over more than three people.

For security and incentive reasons, the blockchain consensus network has to be independent of coin creation. **It is suicide to link coin creation to whoever controls the consensus network**. Unless you want a "decentralized" coin whose consensus network is controlled by three for profit mining pools (who are basicly a cartel now, who splits ASIC costs and divides the hash power between themselves by agreement).

The idea behind mining is that whoever has the most money, to buy hashing power should own and control the consensus network. "Whoever has the most money should own the government and make the laws".

The original premises (economic and human) required for the security of PoW established by Satoshi have been shown to be empirically false in reality.

Right now, eliminating mining seems absurd. In the future, that mining was accepted will be absurd. People only support the cost of mining as long as they make money from it and the price is going up.

Another objective for Skycoin, was to have transactions that were as fast or faster than credit cards. We are able to do 10 second blocks. In order to do that, PoW and PoS has to be eliminated. Decreasing the block time decreases securities for PoW/PoS coins.

Additionally, mining costs the Bitcoin network tens of millions of dollars per month and does nothing that anyone is willing to pay for directly. Bitcoin requires an exponentially growing influx of new users and capital to offset the mining costs. **No one would use Bitcoin if they had to pay the mining costs directly and each transaction cost $50.**

Skycoin transactions do not cost $50 in inflation from new coins being created every block.

It is my opinion that in the long run, we are going to see all the existing Pow/PoS coins die as people realize the actual economic incentives. The cost of PoW/PoS mining is bounce by the users and paid for in a lower market valuation as money is bled out of a coin by mining costs until the coin is abandoned. Only a few coins, like Bitcoin and Ethereum can achieve enough new users coming in with new money to offset hundreds of thousands a dollar a month to tens of millions a month in electricity costs, just to process seven transactions per second.

The price equation is simple
- this may dollars per month are coming in from new users and capital inflows
- this many dollars per month are being thrown in a pit and burned by mining costs

We are moving away from "free coins for miners" and moving towards "community coins" and treating cyptotokens as digital property and a type of equity. The objective is to make the coins useful and that people doing useful work people are willing to pay for should get coins.

Right now the Bitcoin economy consists of new users putting them money in and then the money being thrown in a pit and burned in a sacrifice ritual to the mining electricity costs.

If the average user had to paid the miners electricity cost directly as transaction fees, instead of it being robbed from them through inflation by the creation of new coins, then each Bitcoin transaction would cost more than $50. It would be more expensive than an international bank transfer.

Achieving mathematically provable consensus in a decentralized way, without the cost ($50 per transaction) and problems of PoW/PoS is a cornerstone of the Skycoin project. Solving the PoW cost problem is a **requirement** for stability and mainstream adaption of crypto assets.

Skycoin is not premined, because Skycoin does not have mining. The objective of the Skycoin consensus algorithm was to eliminate the miners and the downward pressure they create on the coin price.

The most important thing about mining however, is that when everyone had a GPU miner in their house and was getting coins, it was "decentralized". Now that ASICs and three mining pools dominate the network, there is nothing for the Bitcoin community to do or participate in. It is no longer fun and relevant. Its not fun anymore and people are unable to participate in mining in any meaningful way. This is what has driven a lot of the activity and community out of Bitcoin and into the altcoins.

We need a new model for people to get coins.

---

## Question:

Quote from: **laugh2btc** on April 02, 2017, 11:35:41 PM
>question:

>c2c says : Total SKY Redeemed: 310663
>but there are few transactions with millions of coins in it : >http://explorer.skycoin.com/blocks

>how is this possible? dev fund?

## Reseponse:

There are a few special addresses. Where the undistributed coins are
- the total coins always exist, but we calculate the free float by only looking at the coins outside of the distribution addresses
- the coins are locked in 1 million coin tranches
- total_supply is number of coins "in circulation" that can be used for transactions
- max_coins is the total number of coins that can ever exist
- no individual controls more than 1% of the total coins. To prevent situation that happened with NXT and Ripple.

Future Measures:
- we are going to time lock the addresses in the future, so the node will reject transactions spending their outputs-
- we are going to put constraint in the code, so the blocks have to be distributed in sequential tranches

We are putting technical and human measures in place, to ensure that if any of the key contributors starts dumping that it would only be temporary. We want to avoid a situation where someone has 30% of the coins and the community has 2% and that person could dump their coins everyday on the market for a decade before they ran out. That is what happened with NXT and we wanted to avoid that.

One address had 1.5 million coins in it for a transaction, while we were moving around
- coins to exchange for ICO withdrawals
- coins to compensation fund for people in the consortium
- coins to whales
- coins to companies funding development cost/staff/contractors

We are going to be distributing coin bonuses to about thirty contributors, on a vesting schedule over the next few years. For example
- one project manager who has help fix over a hundred fifty bug tickets is getting 250,000 SKY over the next four years (about 40k USD in SKY at price when he joined project)
- website guy/content/marketing/design guy who was critical is getting 60,000 SKY over next two years
- some contractors and major contributors are getting 5,000 SKY to 30,000 SKY distributions over the next two years for work on mesh network, bounties, bug fixes, etc

---

## Question:
>how can I tell my friends to buy skycoin on the ico when I am not confident in the provided exchange..

## Response:

C2CX is still being battle tested. There are new problems discovered everyday, but they fix them very quickly and competently. We have found dozens of bugs, but all of them were on the frontend and all of them were fixed within 24 hours.

We found out that
- SMS confirmation did work in certain countries
- SMS confirmation only went through 50% of the time in certain countries

And within a day, they disabled cell phone number and two factor auth, as a requirement for the Skycoin ICO.

They found out that SMS confirmation did not work, if a person put in their cell phone number but had not put in the email address yet. They fixed that issue in a day.

- They alerted us about a transaction in the unspent output pool not clearing (your withdraw) and then we fixed the problem in four hours.
- However, the fix was not merged into the code base until 24 hours later.
- And the nodes have not been upgraded to the new version year.
- However, we dumped your transaction as hex in the CLI and then reinjected it by hand on the CLI and it propagated and your withdrawal was processed

Normally, withdrawals takes ten seconds. However, your withdrawal discovered a new bug.

---

## Comment:

>update my withdrawal has been pending for 5.5 hours now, that is not nice...

## Response:

We found a new bug and it will be fixed in next version.

If the nodes connect and disconnect in a particular order, then there is possibility that transaction replication fails and that a transaction does not reach all nodes.
- We added a function for rebroadcasting transaction by hand on the CLI
- We are adding more instrumentation to track how many times unconfirmed transactions have been announced, how long a transaction is in the unconfirmed pool and how many times the transaction has been downloaded by connected nodes
- We are adding automatic transactions rebroadcast after a minute if the unconfirmed transaction pool is less than 1024 transactions
- We are adding an unconfirmed transaction page to the wallet to make trouble shooting easier
- We are adding a local time stamp to each transaction, to record when the transaction was first seen and how long the transaction was in the unspent transaction pool
- We are upgrading the transaction replication protocol when we have time.
- The final transaction synchronization mechanism will use CXO and will be much more robust than the current system (Which is using gossip protocol like Bitcoin does)

---

## Comment:

Quote from: **BTCspace** on April 03, 2017, 06:27:21 AM
>just realized skycoin is older than litecoin!

>the Project is almost 4 years and the Dev is still here!

## Reponse:

Yes. The skycoin project started around the time of litecoin. In response to the transaction mutability, signature mutability and duplicate coinbase output problems in Bitcoin.

Some of the Skycoin developers predate Bitcoin.

It took two years just to simply and fix the blockchain and we had rewrites and codebases in four languages before settling on golang.

Then we took on the problem of fixing Bitcoin's consensus algorithm and finding a viable replacement for PoW/PoS. The results of which are under white papers on Skycoin.com

Then we took on the problem of figuring out what a coin with actual, concrete economic activity and value would look like. (which is what CXO and Skywire and these applications we are prototyping are about).

- The first thing we have done.
- The second thing we are now completing
- The third thing we are working on

---
## Comment:


Quote from: **coinspeed** on April 03, 2017, 06:40:54 PM
>ah, man... 90% of the supply is controlled by the unknown dev team? So this is like a decentralized currency?
Unless this coin provides some instantly problem solving features out of the box, the price chart is going to look something like VOX or LBC. Devs will dump coins on the market (c3cx?) each month just to cover expenses and since there's no POW, there's nothing to induce a price floor. I expect that until at least 50% of the coins have been distributed, this will slide into the abyss.

>Am I wrong?
>Please explain

## Response:

If the price goes down, we will cut distribution rate.

There are two conflicting things we have to deal with
- The community wants us to distribute at a rate so the coin becomes less centralized over time
- The community does not want us to distribute so quickly that it drives the price down

So we will do a Bitcoin like distribution schedule. With constant rate, that decreases and tapers over time.

However if this puts too much downward pressure, then we can cut the distribution rate.

We want to distribution coins, slower than the rate of user growth
- If we distribute 10% of the current free float (10% inflation in free float)
- Then the user base growth for Skycoin should be at least 10 or 20% over the same period

I think that is the best policy.

>Devs will dump coins on the market each month just to cover expenses

The max any one person holds, is 1% of the total coins. 1 million SKY.

These are early developers, who have been working on the project for years.

This is to eliminate dumping and prevent NXT/Ripple style situations as people join and leave the project team.

We have an extremely tight coin supply. No one person is in a position to do major damage, like what happened with NXT or Ripple. We studied every way, that every previous coin had failed and then explicitly designed our rule set to avoid those methods of failure.

>Devs will dump coins on the market (c3cx?) each month just to cover expenses

PoW creates a price ceiling, not a price floor. Miners dump 90% of the coins they mine for Bitcoin, the second they get them. Driving the price down for every PoS and PoW coin.

---

## Comment:

Quote from: **justinc2014** on April 04, 2017, 01:25:11 AM
>guy's I understand that qtum is conversational issue, I have not invested in it..
>sky-coin has delivered the goods so far and invested all my btc in it.

>what comes down to it at the end, is do you trust the project, with 90% of the coin held by the developers.

## Response:

>what comes down to it at the end, is do you trust the project, with 90% of the coin held by the developers.

1. People want us to distribute the coins quickly, so a small group is not hoarding all the coins
2. People want us to keep the coin supply tight, so that the price goes up a lot and want us to minimize distribution as much as possible

Those are the two contradictory objectives.

If I had to choose between one or the other, the most important thing is that the coin supply is kept tight. That means the price will go up and everyone will be happy because they made money and we will be able to expand development.

So from a moral, ethical, philosophical perspective the unfairness of the initial distribution is an issue.

However, from a practical perspective of the investors and people willing to put more money in to fund development, they want the coin supply to be kept extremely tight. The Dash and Monero have been experts at this and they have $300 million and $500 million dollar market caps and an extremely healthy volume.

We can achieve a fair distribution AND a tight coin supply, IF
- the inflation in the free float per month, is less than half the expansion in the growth of the skycoin user base

That means that if distribution pushes the coin price down, then we have to cut back distribution. So that it is below the rate of user base growth.

That means, that if we are expanding rapidly and have applications and are doing well with new capital inflows, that we can expand distribution without putting downward pressure on the price.

---

The ideal scenario is that
- we get the money to do everything we want to do
- we expand to 30 separate project teams of 2 to 3 people per project group
- we get our applications built and get 100 million users (there are several scenarios under which this is realistic, based historical examples; but not actually required for skycoin financial success or otherwise. The skycoin userbase can be very small and have market cap similar to monero, dash or maidsafe)
- There are 100 million users and only 100 million Skycoins. Each user can mathematically not each be able to own, even a single full coin.

This is a good example of full distribution and tight supply.

There is a particular very close user community of over 500,000 people, with over 100,000 actives. That was shutdown, in raid. As soon they get shutdown, three more new sites spring up with 300 users each, then start growing exponentially until they are back to 500,000. Just one of those community on network would send us past Monero.

We are seeing a huge uptick in ISP spying, government scandals and wonton abuse of power. VPN usage is skyrocketing year after year and tens or hundreds of million of people who care about their privacy are going to start tunneling all of their traffic because they cannot trust their ISP.

When you buy a mansion in London, the wealthy are already getting offered ISP packages that are five times as expensive as the base package, but which tunnel, mix and encrypt their home traffic so it is not recorded and sold by the ISP or intercepted by the government. They are buying whole house VPNs for $500 or $1200 per month.

While Comcast charges is subscribers $30 per month, to opt out of having their internet traffic, web viewing and search history sold to the highest bidder.

There are about fifty different things we could do on top of the existing technology we built. If even one of them succeeds, then we will be fine and have a good return.

---

Based upon the ICO and the response so far, and how fast the sales have increased per exposure. I think we could easily have 20x or 50x above the ICO just by
- increasing skycoin visibility
- getting listing on the top 5 exchanges
- improve narrative further

No one knows what the Skycoin project is or what we are building. The website is horrible and does not explain anything, yet the coin ICO is selling really well. Even with only a single small website, driving traffic we are doing 3 to 5 Bitcoin per day ($3000 to $5000/day).

One of the first objectives after listing, is going to be to get Skycoin into the top 10 slots of coinmarketcap.com

For visibility. That will require about a 20x increase in price over the ICO price. Which is like going from $0.50 to $10. Its not even like litecoin going from less than $0.01 to $25 in under 3 months, for no reason.

So I think that is a modest and achievable goal for the next milestone.

Achieving a wider coin distribution, will have to wait until we have the user base to support the distribution without putting downward pressure on the price. I do not think we can do that in the next milestone, while still keeping the coin supply tight.
