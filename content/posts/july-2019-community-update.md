+++
aliases = []
date = "2019-08-08T00:00:00+00:00"
description = "The Skycoin development team continues to impress, Skycoin expands into Korea, and Floss Weekly interviews the CX team."
image = "/img/blog-com-updates-2019-june_blog_updates_2500x1774.jpg"
tags = ["Development", "Announcements"]
title = "July 2019 Community Update"

+++
As always, the Skycoin team continued to deliver regardless of market fluctuations and general Cryptosphere craziness. July saw a flurry of activity across the board as Skycoin closes in on realizing a vision of true decentralization.

![](/img/Development.png)

Skycoin remained a high flier on coincodecap.com during July with 1216 commits across all the Skycoin repositories, confirming yet again that Skycoin is one of the most active projects in the space.

![Skycoin ranked 2nd for Github activity in July](/img/CoinCodeCap.com July.JPG "CoinCodeCap.com July")

## **Core**

The Skycoin Core team has been hard at work preparing ledger support as well as additional security and convenience features for both the Coin Hour Bank and general Skycoin use. Full support for hierarchical deterministic wallets (HD wallets) is close, the team is putting final touches on BIP44 integration.

[BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) defines a logical hierarchy for deterministic wallets based on an algorithm described in [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki). The implementation of these standards are some of the final steps required for integrating Skycoin with ledger and potentially other hardware wallets. This functionality is now available through the CLI and will be integrated in the front end soon.  
<br>

## **Skywire**

July saw the completion of the switch to dmsg in Skywire and it's separation into an individual repository. This allows dmsg to be used in other applications outside Skywire. Dmsg was written from scratch to improve on, and replace the previous messaging transport, Skymessager.

A second major objective achieved on the Skywire front was to improve performance of public deployment and to write automated integration tests for the aforementioned. The transport settlement handshake between setup nodes and regular nodes was removed. This decreased the number of actions required to deploy the network, increasing the speed of the public environment.

The Skywire node module has been renamed to Skywire Visor. This was done to eliminate ambiguity between the physical node and the software.

This month also saw the creation of a setup for integration tests that uses docker and mirrors the public deployment in terms of network topology and conditions, supporting the deployment process.  
<br>

## **CX**

[CX version 0.7.1](https://github.com/skycoin/cx) was released during July, this release is heavily focused on improving Blockchain integration and some bugs uncovered in 0.7. This release also includes the ability to store heap objects on CX chains, which allows a developer to store strings, arrays, and slices on the Blockchain, not possible in previous versions. A complete redesign of the built-in garbage collector was required for this, which, despite not being visible to the user, constitutes a major improvement.

CX version 0.7.1 is backward compatible with CX version 0.7.0 and as such, existing applications built using that version will still be able to run after an upgrade.

Another focus for July was improving CX documentation, lot's of work was put into updating the book and CX tutorials. Expect a new version of the CX book sometime this month!  
<br>

## **Coin Hour Bank**

Beta testing of the Coin Hour Bank continued throughout July. An intelligent UTXO selection algorithm for withdrawals was implemented while the team remained focused on final fixes and preparation for release.  
<br>

## **Skywallet**

![Skywallet showcased in the box with key-chain](/img/Skywallet in Box.jpg "Skywallet in Box")

The Skywallet team continued to review and rework the Skywallet code base to ensure the highest possible security standard. To this end, July saw the review and correct implementation of entropy generation and usage, a review of the boot loader signature checking, and improvement of the documentation pertaining to Skywallet's security features.

An exciting development around Skywallet is the anticipated release of the [Skywallet Development Kit](https://twitter.com/Skycoinproject/status/1156053964409847810) that allows developers from other projects to tinker around with Skywallet and add support for other coins.  
<br>

## **Skyflash**

The latest release (V0.0.5) of Skyflash is out which is exciting news for anyone who has built a Skyminer before! Skyflash is a tool used to download, configure and flash Skybian, the Skyminer's operating system from a single interface.

This handy tool, which is downloaded as a single file rather than multiple .img files, will ensure that your Skyminer is always running the latest version of Skybian.

Skyflash v0.0.5 is available for [Windows](https://github.com/skycoin/skyflash/releases/tag/Skyflash-v0.0.5-win), [Linux](https://github.com/skycoin/skyflash/releases/tag/Skyflash-v0.0.5-lin) and [Mac](https://github.com/skycoin/skyflash/releases/tag/Skyflash-v0.0.5-osx).  
<br>

## **Libskycoin**

Libskycoin is the Skycoin C library used to export the Skycoin API to DApps using the C programming language. Libskycoin can also be used as the foundation from which to build libraries for other programming languages. During July the team released [version 0.26.0 of Libskycoinand](http://exports the Skycoin API to DApps using the C programming language. Libskycoin can also be used as the foundation from which to build libraries for other programming languages. ) with a bunch of awesome new features and changes that can be found in the release notes.

![](/img/Events & Visibility Title.png)

## **Weiss Ratings Review Skycoin**

For those not familiar with [Weiss ratings](https://weisscrypto.com/en), they are a financial rating agency that has been around since 1979 and is the only financial rating agency that provides coverage for crypto assets. Weiss provides the broadest coverage, the strictest independence, complete objectivity, high ethics and a commitment to safety.

Weiss ratings are reviewing Skycoin and will publish the report in the near future.

![Weiss Crypto has promised to review Skycoin](/img/Weiss Crypto Skycoin Review.png "Weiss Crypto reviewing Skycoin")

## **Floss Weekly CX Interview**

Free Libre Open Source Software. Not only does this term describe what Skycoin is all about fundamentally, but it is also what the FLOSS in [FLOSS TV](https://twit.tv/shows/floss-weekly) is an acronym for. Skycoin was invited onto the show for an hour long [interview with Amaury and Inge](https://twit.tv/shows/floss-weekly/episodes/536?autostart=false) from the CX team. During the interview they elaborated on the nature of Blockchain, some of the challenges faced by the Blockchain space and how CX solves many of these problems.  
<br>

## **Skycoin in Korea**

Skycoin is continuously expanding and creating new areas of exposure with the Korean market being our newest venture. Documentation including the Skycoin whitepaper and advertisements are now available in Korean and the Korean Skyfleet can now come together on Kakaotalk.

![Skycoin ventures into Korea with KakaoTalk](/img/Skycoin South Korea Kakaotalk.png "Skycoin is on KakaoTalk")

## **Skycoin NYC**

The meshnet in NYC will initially be set up using directional yagi antennas to establish a functional initial footprint. The Skycoin motorized antennas will accompany and compliment these as the project ramps up over time.

![Skycoin prepares to roll out a mesh of Yagi antenna in New York](/img/Skycoin Yagi Antenna.JPG "Skycoin Yagi Antenna NYC")

NYC is a logical venue for rolling out the first Skywire meshnet as it is a major international financial center and home of the stock exchange. Historically speaking, NYC has also been ground zero for multiple successful Blockchain projects such as Consensus which gained tremendous traction here.  
<br>

## **First ISP-Free Data Transmission** **Over Skywire**

A historical moment occurred during July when community member Freedom Domains established a proof of concept by connecting two Skywire nodes without using an ISP and then proceeded to use Skycoin BBS to communicate between the two nodes. A [video](https://github.com/FreedomDomains/BBS-Video) of the event is posted on Github along with a more technical explanation of the process.  
<br>

## **Skycoin Havana Meetup**

Cuban Tech hosted a Skycoin meetup in Havana, Cuba. Attendees were treated to a comprehensive [presentation](http://slides.cuban.tech/skycoin.libs.html#/) which zoomed in on the Skycoin API and a hacking challenge was issued to teams. Every team has to choose a different programming language and then rewrite the Skycoin REST API test suite to run against the specific client library to ensure that it runs according to the Skycoin core specifications. Work is underway to integrate these slides into an official Skycoin repository.

Prizes in $SKY will be awarded to the three highest scoring teams in the one week challenge.

![The Cuban Tech team worked on Rest API for Skycoin](/img/Skycoin Cuban Tech Meetup July.png "Cuban Tech Skycoin Meetup July")

## **Skycoin Alberta Meetup**

"Great!" This was the report back from the second Canadian Skycoin meetup in Alberta. Attendance numbers exceeded the first meetup. Notably, the event was attended by representatives of the Alberta Blockchain Consortium who invited us to participate in their events and even picked up everyone's tab. At least two attendees committed to buying and building an official Skyminer and numerous delegates joined the Skycoin Telegram and news channels.  
<br>

## **Skycoin Los Angeles at Crypto Kids Camp**

![Crypto plug single Skywire node](/img/Single Skywire Node Crypto Plug.jpeg "Single Skywire Node")

Crypto Blockchain Plug in Inglewood hosted a Crypto Kids Camp dedicated to Cryptocurrency and Blockchain technology. The event was the first of its kind and ran over 5 days during July.

"_Camp attendees received new cell phones and laptops, and naturally they installed the Skycoin wallet on their devices while learning about best wallet practices and how to safely store their seeds._"

![Kids learning about Skycoin and Skywire](/img/Crypto Kids Skycoin Skywire Miner.jpeg "Kids learning about Skycoin and Skywire")

The kids learned to send and receive donated Skycoin using their mobile Skycoin wallets the easy way by simply scanning an address from a QR code but these talented youngsters didn't stop at merely learning to transact. The highlight of the week was when every kid built a single node Raspberry Pi DIY Skyminer!

All the nodes were verified and tested online, adding 20 new nodes to the ever expanding Skywire testnet. These kids certainly deserved the branded Skycoin merchandise they received at the end of the event.  
<br>

## **Skyfleet**

This month's shining star among the Skyfleet is without a doubt long time member Lawful, CX community manager, who contributed a whopping 43 minute read on Medium detailing the [Skycoin community map](https://medium.com/skyfleet-captains-log/skycoin-community-maps-telegram-dd4500072771).

Well done on this massive effort and a heartfelt thanks from all of us. It is this level of commitment that distinguished Skycoin from the many other projects out there.