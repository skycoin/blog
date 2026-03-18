+++
aliases = ["/ask-the-developers/ask-the-developers-1/"]
date = "2013-12-22"
description = "A weekly session where users can comment or ask questions to the Skycoin Developers in order to gain a better insight and understanding into the Skycoin Project"
draft = true
tags = ["Ask the Developers"]
title = "Ask the Developers #1"

+++
# Ask the Developers - Session #1

### Comment:

Quote from: **Eliavres** on December 22, 2013, 03:07:20 AM

> Hmm this might just be a game changer..

> Since youre just starting to introduce this coin - for the love of god look at what viral advertising has turned Dogecoin into. Here's something I posted in another thread:

Quote from: **Eliavres** on December 22, 2013, 03:02:58 AM

> I like dogecoin because it is the proof that marketing, be it by a snazzy name or proper advertising or such, plays a major role in the success of a coin. The technical concept for a coin can be flawless but the coin will still fail if not properly advertised.

> Some people call it a gagcoin, I call it an eye opener.

> For this coin to succeed, please keep this in mind.

### Response:

Exactly! Yes. We love Dogecoin.

After witnessing the success of QuarkCoin we realized how important marketing and getting buy in from key people is to a coin's success. We have the best PR firm in the Bitcoin space. We are positioning Skycoin as an environmentally friendly, ecologically aware coin.

Tech first, marketing later. For adaption, Skycoin is part of a larger project and there will be Skycoin integration in several applications that will be announced later.

***

### Comment:

Quote from: **vlight** on December 23, 2013, 11:45:15 AM

> The features of this coin are amazing. 15 sec transaction time .. just wow.

> The only thing that worries a little bit is the 2% inflation. Wouldn't it de-incentivize people to keep money in Skycoins? I certainly do not want my money to lose 2% of value a year. Basically, i would be forced to store the money in other coins. For instance, there is a coin that gives 3.8% interest a year, which gives \~5.8% difference when you combine it with Skycoins inflation.

### Response:

The inflation is capped at 2% per year.  If you do not think a particular project will increase the market cap of Skycoin more than what it cost everyone in inflation, you can vote against it.

If inflation works as intended, each dollar spent through inflation should create multiple dollars of Skycoin market cap for Skycoin holders, by driving the price up. So if used correctly, the inflation will cause deflation, not inflation in the Skycoin price.

The reason we added inflation is because of Bitcoin-qt. The Bitcoin community has billions of dollars but the default wallet is horrible. It is so bad that it is probably the worse piece of software created since 1995. I always wonder "If we have all this money, why cant we bring in a designer? Why is it so poorly designed? Why does it have all these bugs and security problems? Why is it so ugly and difficult to use?".

The Bitcoin community collectively has billions of dollars, but few people spend their own Bitcoin to improve Bitcoin. We needed some mechanism to ensure that improvements to Skycoin are funded.

##### Self Governance:

The inflation is the financial part of a system of governance that allows the community to collectively deploy resources against threats and to pursue opportunities which will increase the value of Skycoin.

If governments begin censoring Bitcoin clients from the internet, the Skycoin community might decide to fund a massive number of open source projects to improve security and decrease the ability of governments to identify and block Bitcoin/Skycoin traffic. They might even fund a darknet or peer to peer mesh network running on software defined radio.

The inflation will ensure that development is well funded and survives the current development team.

##### Voting Protocol Draft:

There is a simple site like kick-starter or reddit where people can post projects. We want wiki functionality and discussion threads for each project. The website backend should be in Golang or Python.

Everyone who wants to vote puts a hash into the unspent outputs for coins they hold. The person who knows the preimage for the hash can claim the vote shares for that output. Vote shares can then be applied towards projects.

There are better ways to do it, but this can be up and running extremely quickly.

***

# Question:

Quote from: **digicoin** on December 24, 2013, 01:56:10 AM

> 15 seconds per block is too fast. Do you take network latency, orphan block into account?

# Response:

The problem in Bitcoin is that the currently accepted head can be orphaned. In Skycoin a block has three states "accepted, rejected, or open". Blocks go from an open state to an accepted or rejected state. Each Obelisk node will eventually come to the same consensus about each block. A block can be in the candidate set for consensus, it can be the accepted consensus block or it can be outside of the candidate set. The network narrows the consensus set until each block has a single parent that is accepted.

After consensus is closed for the block, it cant be orphaned by later decisions (under usual circumstances). If a transaction has been accepted by all blocks in the consensus set then it is effectively executed, even the network has not decided on which chain is valid yet.

In Bitcoin you cannot know that the current head will not be orphaned later by someone with more hashing power. In Skycoin you know definitely whether a particular block can or cannot be later orphaned. We get 15 second block times because Obelisk does not wait for a decision to be made about a branch. The nodes can debate multiple branches at the same time, without waiting for decisions about the parents.

***

# Comment:

Quote from: **Fujireloaded** on December 24, 2013, 11:25:19 AM

> I start with the belief that any kind of inflation will eventually turn into a tax.

> It might be true that, in the beginning, projects funded with the inflation tax will help skycoin to increase its market cap (still not convinced about this...). But in the longer run, when the market cap is already at its maximum, there won't be space for growth anymore: you simply cannot grow forever! There is a limit to growth. At that point we'll have a forced freaking 2% tax. Maybe only 0.01% will be needed to polish skycoin at that point, however we'll be wasting 2%.
> This will give rise to a new elite of people working at skycoin with money from tax payers. They'll be the new central bank and government.
> A free market with competition and 0 taxes is better than this inflation tax.

# Response:

If the majority of Skycoin holders feel that they are being "taxed", they can vote against all funding for all programs. In which case the inflation falls to 0%. Both Skycoin holders and the people running Obelisk servers can collectively veto the inflation or "tax".

Skycoin has no miners. There is no group of people that can form a cartel and send transaction fees through the roof. There is no guarantee that Bitcoin miners might decide that you are not paying enough money for their services and start "taxing" you.

***

# Comment:

Quote from: **sighle** on December 25, 2013, 05:11:29 AM

> For those of you wondering HOW Skycoin is generated, it's not. The entire market cap will already exist at coin launch and the only way to get it is to buy it from the developers at the price that THEY set.

# Response:

One possible distribution method is releasing a certain percentage of the coins per day onto an exchange.

Another distribution method involves people putting Bitcoin into a pot and they receive coins proportional to how many coins were put into the pot. This is the distribution strategy used by Nxt and Mastercoin, which many consider to be unfair.

A continuous release of coins may be more fair than a single large ICO.

***

# Comment:

Quote from: **falkspearl** on December 25, 2013, 08:48:29 AM

> I think that solution have been already developed. Make a normal coin on sha256 or scrypt and let people mine coins, then you shall assign number of coins in the old coin blockchain to the number of coins in skycoin genesis block. This should be more fair than creating another scam like ripple or nxt. I think you can do method of generating priv addresses the same as in the old coin. So what you'll have to do is just type in your priv key in skycoin client.

# Response:

Problems with mining

* in CPU coins, all coins go to people with botnets
* in GPU coins, all coins go to people with GPU farms
* in SHA256 coins, all coins go to people with ASICs
* mining gives all new coins to a small cartel of already wealthy miners
* most miners are invested in coins for the short term and not really part of the community

The vast majority of mined coins today are extremely well organized pump and dumps.
The exciting thing is not where the coin is today, but what it will be.

***

# Comment:

Quote from: **FrictionlessCoin** on December 25, 2013, 01:20:58 PM

> I think NXT is a scam based on my quick analysis of their code base.  28 classes without any special libraries.

> Furthermore, no peer review of source code at the same time, they are taking money from investors while alpha testing their coin.

> I am however here waiting to see what you've got in terms of 'distributed consensus with adversarial attackers'.

> Best of luck.

# Response:

Not having cryptography libraries is a problem for Nxt. I have to re-examine Nxt.
This is the blockchain implementation
https://github.com/skycoin/skycoin/tree/master/src/coin
Notice the elegance and simplicity of the code compared to Bitcoin.

***