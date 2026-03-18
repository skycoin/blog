+++
aliases = []
date = "2019-05-14T00:00:00+00:00"
description = ""
image = "/img/blog_community_update.jpg"
tags = ["Announcements", "Development"]
title = "April 2019 Community Update"

+++
***

Skycoin’s hectic progress flowed over from March to April. Starting with Skywire developer mainnet continuing its refinement, the Coin Hour Bank nearing public release, CX Labs offering developers earning potential via the creation of CX apps, and a collaborative Skycoin team attended the biggest Blockchain Hackathon in the world! Just to mention a few highlights. Read on for the full scoop!

### Skywire

We are starting with Skywire, our scalable peer-to-peer mesh network, delivering secure, uncensored, and lightning fast internet access across the globe.

The central focus is on mainnet development. It continues to move forward quickly, thanks in part to the Skyfleet who are testing and flushing out bugs faster, enabling quicker refinement. Features are being routinely added to Skywire making it more user-friendly with every week.

**Anticipation builds as Skywire usability readies for general adoption.**

Skywire will feature a rich application ecosystem. All kinds of services you know and enjoy over the internet today like social networks, cloud storage, entertainment, and business services will be delivered via Skywire. The main focus for Skywire in April was on the Skywire Manager, improvements to the network protocol and bug fixing. Developments included:

* Fixing a major bug that was corrupting ACK packages and causing applications to hang
* An intermittent bug that affected transport creation
* Addition of centralized logging for the local testing environment and migration of the Route Setup Node to the public Skywire repo, simplifying the development process

For an up-to-date view of what’s going on with the Skywire mainnet check out the [repo branch here.](https://github.com/skycoin/skywire/commits/mainnet)

**A reminder Skyfleet,** if you want to assist testing the developer Skywire mainnet, make sure to install the software on a pi _not_ whitelisted for testnet, otherwise you’ll forgo your testnet rewards. Speaking of, the total reward pool for April was 40,000 Skycoin, 16,000 to DIY and 24,000 to official miners.

![Skywire Route Creation](https://cdn-images-1.medium.com/max/2133/1*5pvoSW6Xnp1SGBJNNHSSTQ.jpeg)

### The Coin Hour Bank

An essential component of Skycoin’s closed-loop ecosystem, the Coin Hour Bank is built around sending and receiving Coin Hours for services. The most immediate use for the Coin Hour Bank is the sending and receiving of Coin Hours, which will be used for Skywire bandwidth payments.

We’re excited to announce that Coin Hour Bank beta testing began late April and was received outstandingly! Some insignificant bugs were uncovered and fixed quickly, but all available functionality worked as expected.

**Beta testers currently have access to the following features:**

* Authentication (Including 2FA)
* Deposits of Coin Hours
* Balance monitoring
* Transaction history of deposits and transactions
* Internal transfer of Coin Hours (Off-chain, via email)
* Withdrawals (Enabled after sufficient testing of the other features)

Eventually, Coin Hours will openly trade on exchanges, thus securing a market rate reflecting their perceived value within Skycoin’s ecosystem. Driven by demand for bandwidth, storage or computation on Skywire; for items within CX games, chips to play poker and blackjack, or transacting on Skycoin’s decentralized exchange. The Coin Hour price will reflect their usage, and the value attached to the services we acquire with them.

For a refresher on Coin Hours, [**read this article**](https://medium.com/skycoin/skycoin-coin-hours-f537fa7ae614).

{{< figure src="/img/Coin Hour Bank.png" link="https://www.skycoin.com/blog/posts/the-skycoin-coin-hour-bank/" caption="Check out the announcement article for the [Coin Hour Bank](https://www.skycoin.com/blog/posts/the-skycoin-coin-hour-bank/)" >}}

### Skycoin Core

[BIP 32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki "BIP 32 ") support was added to Skycoin’s cryptography libraries.
Initially proposed by G. Maxwell, BIP 32 is a common standard that enables compatibility with Ledger, TREZOR and other 3rd-party wallets that use hierarchical, deterministic wallets (HD wallets).

### CX

CX version 0.7 underwent its final touches and documentation in April.
This release will include:

* A polished version of CX chains (CX + blockchain)
* "Formal" integration of CXFX (CX’s game engine)
* A web API for CX chains (For querying a list of programs stored on the blockchain, sending a program to be run, etc.)
* And refactorization of CX code

A massive step for CX; blockchain integration has been a long time in the making and it’s no coincidence that we’ve recently announced…

### CX Labs

CX Labs is a hybrid between rewards, bounties, and a Hackathon-style program, aiming to encourage and incentivize the creation of apps using CX and Fiber chains.
CX Labs officially launched at the beginning of May.

* The top prize is **$2,500 USD paid in Skycoin**
* Second place will be awarded **$1,500 USD paid in Skycoin**
* Participation awards of **$300 USD paid in Skycoin** and **20 tickets** for the **Skycoin Rewards Program** will be distributed as well
* Dishonest and low effort submissions will not qualify for participation bonuses and will not be rewarded. Put forth your best effort!

CX is a programmers playground waiting to be explored, the possibilities are endless and only constrained by one’s capability to think of them. Initially, we’re looking for apps to effectively showcase CX and it’s interaction with Fiber chains. Some starter ideas include:

* A decentralized fully encrypted messaging app
* Poker on Blockchain using Coin Hours and Skycoin
* Decentralized peer-to-peer file sharing with a user interface
* A Skycoin arcade with global high scores and Coin Hour rewards

You can find a comprehensive list of ideas pinned in the [CX Lab’s Telegram room](https://web.telegram.org/#/im?p=@CXLabs). However, creativity and originality are encouraged.

{{< figure src="/img/CX Labs.jpeg" link="https://medium.com/skyfleet-captains-log/experimenting-in-cx-labs-c7f8bcef4e6" caption="Check out the [CX Labs launch article](https://medium.com/skyfleet-captains-log/experimenting-in-cx-labs-c7f8bcef4e6)." >}}

### CXFX

CXFX now supports vertex buffers of mixed data type, this was the last missing piece needed for CXFX, before starting to animate skinned meshes.![](https://cdn-images-1.medium.com/max/500/1*ttdGXqIgshEjP53Swd07kg.jpeg)

### CXM

A powerful maths library for CX programming, CXM provides additional functions and utilities for developers, extending the current capabilities of CX. Currently in early development, [CXM aspires to deliver fast analysis and computation on an abstract level.](https://medium.com/@bksquared1024/cxm-cxs-math-library-9d50011478e2)

Let’s say Jeremy wants to use CX to develop a digital audio workstation (DAW) so people can create music. Chances are, he will need a powerful maths library to make the mixer, effects, and synths, etc. Likewise, if Amy wants to build machine learning applications using neural networks, she will need fast, powerful maths libraries too. Luckily, they now have CXM for this!

Reminiscent of how CXFX started, CXM is another community-driven CX project. To lend a hand is quintessential Skyfleet, if you’d like to assist with CXM development please join the [CX Telegram room ](https://web.telegram.org/#/im?p=@skycoin_cx)and voice your interest.

### Skywallet

The Skywallet now has secure cryptography and is nearing its final security review. To guarantee secure seed generation, we implemented an option to build firmware for the Skywallet that verifies its Random Number Generator is functioning correctly. The Simelo Team took it upon themselves to develop and implement such firmware.

Further Skywallet developments include:

* The hardware daemon is feature complete with improved documentation
* On the security front, an entropy pool was implemented that mixes in a few salts from device-specific data
* A UI was completed, revised and is now undergoing polishing
* A [Skywallet user manual](https://github.com/skycoin/hardware-wallet/wiki) is currently in draft form

### Skycoin Ledger Support

April produced extensive testing of the Skycoin Ledger flow while working towards complete Ledger firmware functionality. Many milestones were hit including:

* The logic for signing larger transactions was completed for Ledger
* UI was refactored to improve on the user experience and to comply with the Ledger UI standards and is now integrated with the signing mechanism
* UI now dynamically switches to the SKY address and display number for currently approved outputs
* A Golang wrapper that will enable functions to communicate with the hardware wallet daemon is underway
* The ledger app should support transactions with around 60 total inputs and outputs, but this number may change by the time of release

### Synth Speaks

The long-anticipated episode of The Future is Now from the Malta Blockchain Summit 2018 was released. Skycoin is featured throughout the 38-minute masterpiece; so find some food, a comfy seat and sit back while you’re taken through the journey of Malta 2018. It’s well worth the watch!

Synth’s full interview with Miguel will be released in the near future.

{{< youtube WVtW-HDf5L8 >}}

<br>

### Official Articles

In April the team brought you articles such as "[_Inside The Skywire Mainnet_](https://medium.com/skycoin/inside-the-skywire-mainnet-1349134f0ea5)_,"_ a look at Skywire, the issues it faces, and a glimpse at what’s to come. The "[_March 2019 Community Update_](https://medium.com/skycoin/march-2019-community-update-721148dc40e6)_"_ compiled Skycoin’s highlights. We had our first look at "[_The Skycoin Coin Hour Bank_](https://medium.com/skycoin/the-skycoin-coin-hour-bank-e10eec316050)_,"_ which nears completion.
Then to round off the month we saw "[_Skycoin at Odyssey Hackathon 2019_](https://medium.com/skycoin/skycoin-at-odyssey-hackathon-2019-e116c29ea274)_."_ A recap of what was achieved by the Skycoin team over a 3-day period.

April development updates: [**Week 14**](https://www.skycoin.com/blog/posts/skycoin-development-update-week-14/) **|** [**Week 15**](https://www.skycoin.com/blog/posts/skycoin-development-update-week-15/) **|** [**Week 16**](https://www.skycoin.com/blog/posts/skycoin-development-update-week-16/) **|** [**Week 17**](https://www.skycoin.com/blog/posts/skycoin-development-update-week-17/)

### Official Videos

To accompany the article "[_Skycoin at the Odyssey 2019 Hackathon_](https://www.youtube.com/watch?v=pWW3FMgB5xc&t=24s)_"_ depicted the team's Hackathon fanatics. Another beautiful [Skywallet unboxing](https://www.youtube.com/watch?v=X2Lh47FGKA8) lulled us further into euphoric yearning for the proclaimed Trezor killer. Topping it off, we were treated to the first two in what will be many Skycoin update videos, found [here](https://youtu.be/mdlT1LkTweI) and below.

{{< youtube mu3HDa9abIM >}}

<br>

### Meetups/Events

As mentioned above, some of the Skycoin troops teamed up with Milvum a development house hailing from The Hague (Netherlands) and with Hiber, a startup focused on low cost, low energy communications satellites.

The Odyssey Hackathon is the world’s biggest AI and Blockchain Hackathon. This year there were 1,500 participants competing in 11 tracks to solve 20 real-world societal challenges.

The team competed in the disaster relief track and elected to solve the specific challenge " [Co-creating and sharing validated data during a disaster](https://www.odyssey.org/ifv-challenge-sharing-validated-data-during-disaster/)."
Dubbed _Hummingbird,_ the team’s solution deployed a Skywire mesh using Hiber satellite nodes to create a multi-tiered, mesh network, independent from traditional Internet infrastructure and accessible via a mobile app.

<table>
<tr>
<td>
<figure>
<img src="https://cdn-images-1.medium.com/max/500/1*zZiRcfrsGfbWgdsHXXTHnw.jpeg" />
</figure>
</td>
<td>
<figure>
<img src="https://cdn-images-1.medium.com/max/500/1*9O7FUKzvxK7gLyIo_ZBWIQ.jpeg" />
</figure>
</td>
</tr>
</table>

**Olemis Lang** hosted another Cuban Tech development meetup focusing on various components of the Skycoin ecosystem, and first-timer **Redcurse** gave an introductory presentation to an intrigued blockchain gathering in Canada.

![](https://cdn-images-1.medium.com/max/500/1*NPWTGLfSta8L5X8wan8BuA.jpeg)

In the upcoming months there’s plenty of Skycoin and Skyfleet meetups to look forward to. Make sure to join the [Skycoin meetups Telegram room](https://t.me/MeetupsWorldwideSkycoin) and ask if there’s anything happening in your area.

### Skycoin Rewards Program

The Skycoin Rewards Program (SRP) continues to stir up creative content from Skycoin’s community, the Skyfleet. [**Earn Skycoin by contributing your skills and time (Click me)**](https://medium.com/skyfleet-captains-log/starting-with-skycoin-rewards-6e9ce6effbd2)**.**

Make sure to tune in for the next live-stream awards show on the 5th of May at 08:00 a.m. UTC. Hosted on the [_Skyfleet_ YouTube channel](https://www.youtube.com/channel/UCsWgASci1NzCtSNU25w8qPg). For a full list of all 2019 awards shows, save the below calendar.

![](https://cdn-images-1.medium.com/max/667/1*VKiXgxbGYF9x4xvc5_qxPw.jpeg)


Although there were many excellent contributions to SRP this month! This article on "[_Skywire Competitor Analysis_](https://medium.com/skyfleet-captains-log/skywire-competitor-analysis-8f409733f128)_,_" by Marco Casino and the below video by Fray deserve some limelight. The video impressed the Chinese marketing team so much so, that they’ve translated it!

{{< youtube 6KdEIpD3RgU >}}
<br>

### Skycoin Jobs

If you are interested in working directly on various aspects of Skycoin alongside the dev team, check out the [jobs listed on the official site](https://www.skycoin.com/jobs/).
We are currently looking for a Mechanical Engineer, Circuit Engineer, Software Engineer (Backend), Firmware Engineer, Marketing Manager, Operations Manager, and Technical Writer.

### Skycoin Telegram Groups

It can be hard to keep track of all the different Telegram groups in the Skycoin project. Here are some groups that you may not yet have joined:

* [**Skywire Mainnet**](https://t.me/SkywireMainnet) — a place for developers interested in exploring the first versions of Skywire mainnet, and for support and to discuss features/issues.
* [**Skywire Antenna Group**](https://t.me/SkywireAntenna)— discussion and support for Skyfleet working on building out the Skywire wireless mesh network.
* [**Skycoin Game Dev**](https://t.me/skycoin_game_dev/4738) — discussions on game development written in CX.
* [**Skycoin CXFX**](https://t.me/Skycxfx) — a Telegram group for those building and using the CXFX game engine.
* [**Skycoin 3D Print**](https://t.me/Skycoin3DPrint) — the place to go for all Skycoin 3D-printing-related discussion.
* [**Skycoin Meetups Worldwide**](https://t.me/MeetupsWorldwideSkycoin) — the place for posting/announcing your Skycoin meetup.
* [**Skyfleet News**](https://t.me/SkyfleetNews) — only Skyfleet news links, no chat. Great for keeping up to date with the growing amount of ecosystem development and content.
* [**Skycoin Rewards Room**](https://t.me/SkycoinRewards) — for submitting Skyfleet content and claiming your tickets to the monthly Skycoin Rewards Program (SRP)
* [**CX Labs**](https://web.telegram.org/#/im?p=@CXLabs) — for creating CX apps and getting rewarded in Skycoin, run by Lawful this fledgling project will be massive in a few months.
* [**Skycoin memes**](https://t.me/skycoinmemecontests) — Skycoin memes and graphics creations live here.

That concludes the month of April, what a busy one.
Yet with the Coin Hour Bank, CX Labs, CX Blockchain integration and the Skywallet on our horizon, April will be dwarfed by months to come!

Make sure you check out the [latest Skyfleet Monthly Manifest](https://trello.com/c/4kSdaDAf/61-monthly-update) for all the latest Skyfleet developments and keep an eye on the [Skyblog](https://www.skycoin.com/blog/) for all the future development updates. You can also follow Skycoin on [Blockfolio](https://blockfolio.com/coin/SKY).

See you in the May update!
