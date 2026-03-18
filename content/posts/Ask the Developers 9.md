+++
aliases = ["/ask-the-developers/ask-the-developers-9/"]
date = "2017-04-13"
draft = true
tags = ["Ask the Developers"]
title = "Ask the Developers #9"

+++
## Comment:

Quote from: **solix** on April 08, 2017, 11:14:49 PM
>hang on guys... so 10% of the coins will be sold in the ICO? 90% held back, where 70% will be used "in the future". Can you guys elaborate on that a bit? I'm interested in this project, but not while only 10% of the supply is circulating. I also suspect this will prevent quite a few exchanges from getting involved. Maybe I didn't understand this proposed distribution... can anyone help me with that? I'm likely to wait until more than 60% of the supply is out there to jump in, but good luck on your project! (hello from NEM Xtester)

##  Reponse:

There is no scheme of distribution, that will make everyone happy. No matter what we do, some people will complain.

Distributing 30% of the coins at once, like Ethereum did, is a mistake (for various reasons). We spent a year evaluating different methods and a slow tapered, Bitcoin like distribution was the best option. This means a constant rate of new coins being released on to the market over time, with that number decreasing over time.

However we have not determined the optimal rate yet. We need to find an empirically good policy.

We have to do this by hand, because of the way the coin is designed. No coins are created or destroyed when new blocks are created, which simplifies the mathematical structure of the blockchain and makes it cleaner, but it means all the coins are created in the genesis block.

So there are two separate issues

- are coins distributed and put into circulation gradually
- are coins put into distribution all at once, with a giant crowd sale

We chose a hybrid of a small crowd sale and then bitcoin like distribution schedule, as being optimal

The other issue is
- are coins put into circulation by automatic mechanisms such as blockchain rewards
- are coins put into circulation by hand, by the developers

If the developers put the coins into circulation, then it requires more trust in the developer . However, if distribution is driving down the coin price, then the distribution can be cut back to protect the earlier investors. Otherwise, the coin price would be eternally decreasing, so everyone would dump the coin because the price is going down at a constant rate for a persistent amount of time and the rate of new coins cannot be cut back because its an automatic part of the block reward.

Where as, we can cut back distribution (because we are forced to do it by hand), to avoid this.

It is not perfect, but this was the best system and policy we found.

The distribution rate the market can sustain, reflects how well the development, marketing and community growth is going. So if those are doing very well, it means we can sustain a larger development effort. And if not, then we can scale back and the coin will still survive and appreciate.

It is simply impossible to choose an optimal, automatic and preset distribution rate parameter, because it depends on empirical things outside of the blockchain itself. No matter what the developers set the parameter to at launch, it will end up being either too high or too low.

A very important thing, is that no one actually cares how many coins there are or how many have been distribution. People only care
- how many coins they own
- what the price per coin is

So if you have 25,000 coins and you bought them at $0.10 and the price goes to $50, then you made 500x. The investors only care about the price per coin.

So we are focused on the price per coin metric. If we distribute too quickly, then it would drive down the price per coin. So it our opinion is better to keep the coin supply tight, than to dump a massive number of coins on the market (like byteballs and stellar did).

If the number of coins in circulation doubled, from 5 million to 10 million. It does not matter, because they made 500x. There is a multiplier for the impact of putting new coins into circulation, for effect it has on coin price
- if 100% coins are dumped for bitcoin, then every dollar of coins put into circulation will end up in the capital outflows for the coin (driving price down). This is what happens when people GPU mine shitcoin and the miners instantly dump every coin they earn for Bitcoin.
- if new coins are going to people that are driving improvements, community growth, development, marketing then every dollar of coins distributed, can produce multiple dollars of direct and indirect new capital inflows, driving the price per coin up faster than the inflation caused by new coins (This is what we want to see for Skycoin and what will determine how aggressive the distribution rate is)

We do not have a simple distribution strategy, because it depends on what we are trying to do.
- if we are trying to raise funds for development, we will do an ICO for bitcoin
- if we are trying to get people to run nodes, we will allocate 1% as bonus to be distributed over people running nodes
- if we are trying to get apps developed for the network, we will allocate coins as bounties for high priority apps to drive growth
- if there is a crash and we want the price per coin to recover quickly, then we might cut back distribution rate
- etc

As long as the distribution schedule protects the price per coin, then no one will complain

We also tend to do small experiments. Smaller ICOs, testing bounties. We never plan do Ethereum/Stellar/Byteballs style distributions, where a large number of new coins come on to the market at once. We want to do smaller tests and if they work, then do more of that.

---

## Comment:
Quote from: **GTTIGER** on April 15, 2017, 08:22:04 PM
>Such a good coin, comparable to maidsafe etc. But... this distribution confusion kinda takes away from everything.

## Response:

We are trying to address issues

http://explorer.skycoin.com/api/coinSupply

The reality, is that we are only able to focus on one thing at a time and do it well.
- we focused on
-- getting wallet fixed and on website
-- APIs implemented
-- blockchain explorer
-- website
-- exchange listing
-- quality assurance

we finished that
- but we had to cut back on hiring for new software development and hiring developers

now we are doing
- hiring marketing people
- infographics
- narratives
- video production for introduction and educational videos
- translation of website
- exchange listing
- communication with user community
- building up user community

Then after that, we are doubling the number of project managers and tripling the number of developers.

We have a single frontend developer, spread across three applications and he has backlog of 80 tickets. It will take him eight months, just to get through those ticket and that does not even include our next generation "universal wallet" and completely redoing the wallet from scratch, for multicoin, exchange and thin client support.

Then we have to do consensus/node explorer

We have to get first meshnet applications working

We have to get meshnet binaries on the website

We have to upgrade the execution environment so it runs headless

We have to add UDP firewall hole punch and STUN to the meshnet node

We have to implement first version of orchestration and bandwidth metering for the meshnet node.

We have to do benchmarking and optimization

We have to do four months of work on consensus implementation, moving consensus over to CXO and then have to gut and rewrite the whole skycoin networking stack (this is six months worth of work).

Then we have to hire two to three developers per team and need six teams working on six separate applications on top of Skywire and CXO.

We need to hire more infographics, marketing, community managers. We need to hire person full time just to prepare infographics, narrative and press kit and do media relations with the bloggers and pod casters.

We have to get part time devops guy to build bot for running integration tests. Our automated golang installations are failing because of DNS blocking and we have to switch from docker to coreOS. We have to have custom golang program written for doing SSH proxying so we can access servers behind firewall that do not have static IP.

We have to deal with peer-exchange for skycoin nodes, which was just enabled and get peer-exchange working for CXO. We need some type of DHT or tracker service for peer-discovery.

We have to start upgrading the skycoin and CXO networking stack, so it will be ready to run over Skywire in the future.

We have to have mobile team start on a native mobile wallet, now that the gomobile API bindings are done.

We need to do website, wallet and mobile translations into English, Chinese, Japanese, Korean, Russian and French.

We have to hire people for writing script, story board and then for video production and animation for our first videos. Then as soon as those are done, we need to start from scratch and do second round of improved videos.

That is just the next 8 months and is intermediate term.

ETC...

The "distribution issue" is not something we can "solve", so there is no time or anyone assigned to it. We have to stop focusing on issues that have no practical solution and need to focus on what we can make progress on.

We have determined that no solution is possible that a large percentage of people will not complain about, so no amount of effort will be able to make progress on that issue. So any effort placed into it, will be unproductive and wasted.

While we have MASSIVE backlog of bugs just to fix, and also massive hiring backlog and massive project management backlog, and massive marketing backlog and massive backlog of future development tasks to work through.

http://explorer.skycoin.com/api/coinSupply

Our distribution schedule is based upon Bitcoin's distribution schedule. We are only at 5.5% of coins distributed. It is going to take at least five years until we get to the distribution percentage Bitcoin is at right now.

We are not even at the development point, where the infrastructure needed for optimal distribution is implemented yet. The meshnet is not operating and it is impossible to run a node right now we have several years worth of development work and several dozen applications to implement, to just bootstrap the core network.

None of the documentation or infographics is done and 95% of people do not even understand what they are buying.

We do not even have the white papers for the network or skycoin ecosystem up yet or anything on website about applications or timeline. WE ARE NOT AT STAGE TO BE WORRYING ABOUT DISTRIBUTION.

## How Skycoin Screwed Up

We did it wrong, we should have
- released no source code
- done no work on software
- focused completely on marketing, website and video
- raised 10 million dollars in an ICO
- spend 80% of the money raised, for buying media to pump the coins and then run away with the other 20%

Then we would not have to answer criticism over the distribution.

I have never seen anyone, ever complain about the distribution of the pump and dump coins or recent ICOs.

Skycoin seems to be held to a much higher standard than the other coins.

It is like people complaining about the distribution of Google stock. "I want free Google stock", "The ownership of Google stock is too concentrated", etc. To get the stock, you have
- contribute something to its success to get it
- buy it

Else you do not get any. They did not do a "Coin Drop".

One person started with 100% ownership and the ownership became more decentralized over time. The ownership never became fair or equal. Most people are in debt and working at minimum wage jobs and are one pay check from starvation and will never be able to afford to own even a single Google share.

I do not know what the solution to the "distribution" problem is. I do not think there is a solution, that will make everyone happy. No one has suggested any solution.

We should be focusing on the price per skycoin, not the distribution. If you bought Skycoin at a penny and the price went to $50, then no one is going to complain. The price per coin is concrete, while the "distribution" is ephemeral and meaningless.

And we should especially be focusing, not on the price, but what we achieve in the world. Even the price per coin is secondary to impact and the project goals.

In every other coin
- they raise a huge amount of money
- they spend the money on marketing, to pump the price up from the ICO
- whether they achieve what they set out to do, is irrelevant because the developers will become rich and quit as soon as the pump is successful. Even if the developers keep working, they will be lazy and slow. Everyone who knows the Ethereum people, knows this problem.

I think ultimately we have to say "Skycoin is not about the price" and the distribution is probably irrelevant also. I think Bitcoin failed, as a crypto-currency as soon as the community measured its success and failure based upon what the price is every five minutes. People forgot why Bitcoin exists and what it was a response to and then it just became a number that went up and down and became like horse racing or fantasy football, with no real impact on the world. It simply became irreverent.

We should not let the community get dragged down into discussion of the price/distribution and should focus on the project objectives and what we are trying to accomplish and how we are going to get it done.

---
## Comment:

Quote from: **jordan coins** on April 17, 2017, 08:42:41 PM
>Total Supply : 5,250,299 SKY
>$0.799565

>The price is high ؟؟؟ why

## Response:


31	 Alternate cryptocurrencies / Announcements (Altcoins) / Re: [SKY] Skycoin Launch Announcement	on: April 18, 2017, 07:35:55 AM
Quote from: jordan coins on April 17, 2017, 08:42:41 PM
Total Supply : 5,250,299 SKY
$0.799565

The price is high ؟؟؟ why  Embarrassed

It has been in development for over six years

Now $1.09.  Roll Eyes

Look at the white papers
- http://skycoin.com/whitepapers.html

If we succeed we will have
- a solid coin (with the first new consensus algorithm since PeerCoin, pioneering innovation in UXTO model, transaction faster than a credit card transaction, pioneer in JSON APIs for ease of user with external applications and thin client interface, no external dependencies and solid security model).
- a solid wallet (with multi-coin support "universal wallet", intrinsic support for gmaxwell's CoinJoin protocol and improved privacy). I think we are the only coin who did CoinJoin correctly. It gives Skycoin ZeroCoin zsnarks level transaction privacy, using a trusted third party and with no overhead over a normal transaction.
- A solid user community and application ecosystem. The Skycoin application ecosystem will become very important for driving adaption.

Ultimately, Skycoin aims to be best in class in every attribute.

The coin on its strengths and technical merit alone, can easily achieve a top 10 position. But we will need the application ecosystem to get a position among Ethereum and Bitcoin and be a top 3 coin.

---

## Comment:

>We are talking about distribution in the telegram chat, it would be great if all the community members could jump in. It's all to play for - the correct distribution has to occur though for the network to remain decentralized. So far there is no common solution to distribution problems.

>There is no POW or POS in relation to this coin, so it has to be taken with a gentle approach. So I invite anyone to come in and talk about the distribution model because the community can really help with this.

>https://t.me/Skycoin

## Response:

Yes. The best solution is
- raise money from early investors through ICO, to fund development
- do most of the distribution through the network operation (while keeping the price per coin high; this will not be a "coin drop")

The people who bootstrap the network should benefit the most. Although the early investors will get 20x to 50x from the pop, from ICO to exchange listing. The earliest investors are already up 8x to 16x from when the coin was sold for 10 cents per Skycoin.

The current market cap is $4,481,768.
- https://coinmarketcap.com/currencies/skycoin/

This means for early network/bootstrap, we would need to see another 50x to 250x increase in price/coin after the 20x to 50x ICO pop. To show a good return for the early network stakeholders. Which I think is reasonable.

We are only going to be able to do that, if the coin supply is kept tight. We can not do "free coins" raining from the sky and people dumping them for bitcoin the second they get them.

We have a responsibility to achieve a good return for the early investors, project sponsors and stakeholders. We have to look at not the distribution and whether it is "fair" or "decentralized", but look at the price per coin and then make sure that the people who bought coins in early rounds, do not end up losing money. As long as the price per coin goes up, no one will complain.

- The people complaining about the distribution are all people who do not own Skycoins.
- The people who own coins, want us to keep the coin supply tight and are indifferent about the distribution . They want to know that we will not do anything to drive down the price per coin

And the most important thing is that we achieve the project objectives and get the software working.

## Coin Burn:

If Skycoin has too much money and we need to do a "coin burn", we will sell $60 million dollars in coins and produce open source RISCV ASICs or will put a satellite into orbit with skycoin node for marketing. Or fund twenty software defined radio projects.

There are less retarded things to do, than throwing the coins in a hole and burning them for no reason.

Skycoin is already at 5% distributed, so the distribution issue is no irreverent.
- If every coin was dumped, then coin supply would only increase 20x from current value
- The Skycoin price could easily go up 20x or more from current value
- If the coin supply increased 20x and the market cap goes up 600x, then the price per coin has still increased 30x.

Our distribution policy is to sell off coins, then invest the money in projects that will increase or grow the equity of the Skycoin network and ecosystem.

Locking up coins or throwing money in a hole and burning it, is retarded as long as we have productive projects to invest in to build the equity of the network.

A massive distribution only benefits the pump and dump people who want coins to stir-fry. It does not work for a long term project or anything that has to be around in a year.

---

## Comment:

Quote from: **BTCspace** on April 24, 2017, 12:03:53 AM
anyway the distribution model is not that good now.

## Response:

The distribution is mathematically optimal. You cannot design a better distribution scheme than the Skycoin scheme. We enumerated all previous distribution schemes and chose the best one.

You are used to seeing pump and dump style distributions and that is what people are asking for and we will not do it. We are also not going to do some NXT style scam and pretend the coin was "distributed" in a way that the user base cannot complain, when in reality three people own 98% of the coins. The undistributed Skycoins are locked, for a reason and that is to prevent a reoccurance of the dumping that destroyed NXT.

We combined a publicly auditable distribution scheme with with a Bitcoin tapered distribution schedule, while eliminating the capital outflows from miners. We chose this distribution scheme, because mathematically it is the best possible that can exist.

Until someone proposes something superior to "I think they should do a massive coin drop on me and give me free coins", the "distribution" complaints are just divide and conquer, meaningless babble and foaming at the mouth.

The Skycoin distribution will follow the Bitcoin model of a constant number of coins over a time period, with tapering and halving over time, up to a fixed maximum value.

Distribution will take at least seven years. We are in a hurry and some of us have already been here four or five years. I think we will get to 70% distribution within ten years. Rushing distribution, only hurts the investors, so we are in no hurry to dump coins faster. If anything we will probably decrease the rate of releasing new blocks of coins.

This is to create  a slow, steady appreciation of the coin and reason for people to hold on to it. Instead of a massive Ethereum style pump and dump (which worked for Ethereum, but which is a very bad type of distribution style in general).

We think our distribution scheme is the best possible. No one has given any superior alternative, or even a proposal that would not drive down the price per coin. Skycoin's distribution scheme is designed to maximumize the price per coin over time and to avoid driving own the price per coin.

The Skycoin distribution schedule and philosophy is identical to Bitcoin's distribution rate, or how Facebook or Google stock was distributed. Google did not distribute 80% of its shares by doing a massive Ethereum style crowd sale, before any of the work was done. It sold off fixed, small slices of equity at each step at an increasing price. Then they dumped the money into development and increasing the value of the equity for all stakeholders by investing the money raised in infrastructure.

This is what makes sense for funding a large, long term project whose value is increasing. We are using this model, because it works.

If we can raise $1 and invest it in marketing, software development and hardware and produce a $100 increase in market cap, then we are doing well. If we are only producing $0.25 in value for every dollar spent, then we should stop raising money and cut distribution back. We do not want to crowd out our return rate.

---

## Comment:

Quote from: **elelegzet** on May 14, 2017, 01:17:38 PM
The best coin ever developed is still barely traded while scams of all sorts are highly demanded... Mad mad world )

## Response:


There are only three real coins (actually three and a half).

The rest are just marketing scams, or they are doing tokens or something else.

I think smart contracts are interesting, but they are still just widgets a solution looking for a problem. Almost none of the existing coins are focused on what Satoshi originally intended Bitcoin for or have any concern with improving Bitcoin.

It is a fundamental question of values and purpose. The altcoin market right now, is like real money fantasy football. People are putting money into things that they know are non-viable (and everyone else knows that), but as long as it trades and the marketing is good, then they can make money.

Markets are just a game.

It is our fault. We do not have any information on the website and we are not communicating anything effectively at all. We need to communicate "What is Skycoin?".

When it is very difficult to communicate people "What is Bitcoin?". Bitcoin itself was a new category and there was nothing to compare it to. It was completely new. Now that people are getting familiar with coins, there is something to compare Skycoin to, so it is easier to describe.

However, we also need to describe it to people who have never heard of Bitcoin. Who are completely new to the crypto space.

---

## Comment:

Quote from: **provenceday** on June 09, 2017, 07:52:42 AM
skycoin should sold more coins to potential users.

## Response:

By distributing coins to people running skywire nodes, we are effectively paying them to use the Skywire VPN and services.

Same as Steemit pays people to create content.

There is going to be a cross over point, where the buybacks (percentage of services transaction value) exceed the rate of distribution of new coins. So the model is very similar to ASIC miners.

- ASIC miners issued new stock
- ASIC miners sold the stock for money
- ASIC miners used the money to buy bitcoin mining hardware
- ASIC miners use the bitcoin produced by the mining hardware to pay rewards to investors and to buyback ASICminers shares

ASICminers was the first cryptostock to break 100 million dollar marketcap. Its marketcap was larger than litecoin for years, but it was before ethereum so it was traded by hand OTC, instead of being a ETH token like it would be today. They did not have a blockchain or distributed ledger to record ownership. They still did it by hand

Skycoin is using a very similar model.

The reason we are not "distributing" more coins, is because the applications are not ready yet.

Skycoin was designed to be backed by real economic activity and infrastructure. The 100 million supply cap is actually just a cap on equity issuance.

The Skycoin holders are receiving a CoinHour reward (Which is a second parallel currency in Skycoin, used for transaction fees and network services). If Skycoin reaches the transaction limit, then the transaction are prioritized by transaction age and CoinHour burn. Then you can purchase CoinHours for transaction fees, in Skycoin from CoinHour holders in a CoinJoin transaction (which also has privacy benefits). So the Skycoin/CoinHours will eventually have an exchange rate and be interconvertable at market rates once they become scarce.

CoinHours solve the problem of providing "Freemium" services, while still rationing scarce and finite resources to maintain a high QoS level (bandwidth that is not used is lost and bandwidth cannot be stored. If you only use 10 kb/s of a 1 Gb/s line, then the bandwidth that is not used is lost forever; so it is better to keep the line at full capacity. The unused bandwidth is wasted and cannot be stored for future use. It is a flow, not a stock).

Everything in Skycoin is that way for a particular and very specific reason, including the distribution.

No one knows how to price Skycoin right now, because huge parts of the infrastructure have not been explained or released yet. With ASICminer they could compute the reward and know "If I put in 1 BTC, they are going to pay me 3 Bitcoin in rewards over the next 3 months".

- Pulling skycoin out of circulation is the same as decreasing the CoinHour production rate
- Putting Skycoin into circulation is the same as increasing the CoinHour production rate.
- CoinHours decay as each transaction must burn a minimum of 50% of the accumulated CoinHour balance, so the CoinHour supply is inversely proportional to the "monetary velocity" or the turnover rate of the CoinHours (which relates to the volume of service consumption).

It is designed to be a closed system, with consumption and production, with positive and negative feedback loops in equilibrium.

Skycoin is like a security, but for legal reasons it is not a security. There are actually two parallel currencies and the rewards are in the second currency, which does not have a nominal value until there is a market clearing mechanism (an exchange and scarcity).

The value of Skycoin needs to be "backed" by something real, useful and concrete. While Bitcoin and fiat (government issued money) is just paper and purely speculative in value.

CoinHour burn also allows Skycoin to establish a partial ordering over the directed acyclic bipartrate UX/TX graph. The aggregate coinhour burn, allows a total or partial ordering over different chains (similar to PoS but without staking).

Different prospective blockchains can be ordered by their CoinHour burns (total CoinHours burned on transactions tell you how many users are using that chain and uniquely resolve choices between competing chains, while Skycoin transactions are designed to minimize merge conflicts between blockchain forks and the Skycoin consensus is design to make blockchain forks mathematically impossible (as long as certain mathematical prerequisites are true, then 51% attack becomes a mathematical impossibility)).

This allows us to transcend the blockchain and will eventually enable migration to a DAG or Tangle structure, instead of being limited to a total overing over transactions/blocks (a blockchain).

The CoinHours can be on chain, but can act as gas for memory, computation and storage for an offchain, non-blockchain DAG/UXTX based turing complete distributed computer. Which is CX.

We are implementing Skycoin Stage III and CX is stage IV or V.
- Stage I and Stage II were wallet, consensus, security primitves
- Stage III is services, (VPN, BBS)  communication (Skywire) and distributed immutable object systems (CXO)
- Stage IV and V are computation, infrastructure, markets, etc... (CX)

By Stage IV/V we will be on "Skycoin 2.0" and will be upgrading the blockchain to
- use immutable object system (CXO)
- use partial ordering on the UX/TX graph nstead of a blockchain total ordering (UXTX, DAG/Tangle instead of blockchain)

The project is too large to solve all the problems at once, so it is being done incrementally in stages and designed to be useful and usable at every intermediate stage.

---
