+++
aliases = ["/ask-the-developers/skycoin-coin-interview-youtube-transcript/"]
date = "2017-11-25"
description = "Log of Interview with Synth from Skycoin, held live on Coin Interview's youtube channel (from 2017-10-30)"
tags = ["Ask the Developers"]
title = "Skycoin Coin Interview Youtube Transcript"

+++
_Originally held October 30, 2017 on the Coin Interview Youtube channel (https://www.youtube.com/watch?v=BuY5IbkkbXg)_

_Synth is the Skycoin representative in this AMA. Christian and Evan are the interviewers_

**Christian**
We're talking to Synth, one of the lead project managers from Fiber, Skycoin, you know what it is. Just wanted to announce the fact that we still have support from ark.io. If you're interested in sponsoring the show let us know.

**Synth**
Love Ark.

**Christian**
Those guys are cool.

**Synth**
Yea they helped us out a lot and the Lisk guys too.

**Christian**
Yea, I haven't had Max on the show yet. I don't even know what Lisk is doing, but let's not talk about Lisk let's talk about Skycoin right now. They're going to come on the show eventually. We need to make a big list of all the projects that havent been on yet or something.

**Synth**
We are working with the bitseed Mike guy, I think we might be sharing a factory in Shenzen, the Ark guy. He has the bitseed boxes for Ethereum and Bitcoin, we are going to do that for Skycoin, for hardware.

**Christian**
You want to tell us what Skycoin is? For the people who don’t know. It’s a new blockchain? Is it a blockchain?

**Synth**
Well it’s not new, it’s been around for about six years. So basically, when Bitcoin came out there were a lot of the early Bitcoin people who did the audit on Bitcoin. They were brought in by these financial service firms and they wanted to know is this going to work? Do these algorithms work? Are there problems? If I put money in this am I going to lose it? Is it like a house of cards that is going to fall over tomorrow? So they wanted to know more about Bitcoin and they wanted it audited at a code level and at a cryptographic level. So a lot of people, including the early Skycoin developers were sent in to do this and we looked at it and we found all these problems. There were about three or four different groups that were trying to fix Bitcoin. So we came in and we ended up spending the next six years rewriting the whole thing from scratch like three times. There were things like duplicate coinbase outputs. You have a transaction and a transaction creates an output and the output is what you spend in the transaction. You could have two outputs that had the same hash, so Bitcoin had hash collisions in it. Like Satoshi got 90% right, but there was about 10% that was sort of wonky. So, we fixed duplicate coinbase outputs, signature mutability, transaction mutability, and other issues like that and then later on the consensus algorithm in Bitcoin became a problem. This was around the time of gigahash.io. There was a group of friends in this little city in northern Ukraine who all got involved in Bitcoin very early. One of them started a mining pool, another started a company producing Bitcoin mining hardware, and another started exchanges like BTC-E; so this group of friends had their own mini Bitcoin industry. Gigahash.io ended up controlling over 60-70% of the total mining power for Bitcoin. So we had the Bitcoin network running for years on one single mining pool. They were hiding their hashing power in other mining pools basically because they realized it looked bad if they said that they had over 60% of the network.

**Synth**
With Proof of Work, Satoshi originally wanted it to decentralize the Bitcoin network over hundreds of thousands of computers located in different countries, but what has happened is the mining network is now three mining pools in China. So Bitcoin is not decentralized, at all, it is very centralized. And there is only one producer now of ASIC mining hardware for Bitcoin so it is even more centralized. So we wanted to fix the consensus algorithm and that was a huge, huge, huge research project that took like three years. Skycoin started out just improving the Bitcoin blockchain and building Bitcoin into a mature technology that would be usable because Bitcoin still has a lot of rough edges. Over time, the project just expanded and expanded. Now, we have around fifteen development teams working on different projects. So when you say what is Skycoin, well, we have the blockchain, we have a consensus algorithm \[obelisk\], we now have a programming language called CX, which I wouldn’t call a smart contract language because I think smart contracts are bullshit, but this is an actual programming language for applications. cx.skycoin.com. We have CXO, which is like an immutable data storage library because we realized that blocks and transactions and outputs were all immutable data objects, so we created a whole library to deal with these objects and replicate them; which was a two year project. And then somehow, we ended up getting a mesh network. A distributed telecom provider called Skywire. So, people are running these nodes and they are exchanging packets and getting paid for the bandwidth that they’re providing to their neighbors. So it’s sort of like a ground up community internet on the blockchain, where you are getting paid for providing these services to people. And we have the ability to tunnel VPN over that, so I can hook up a node in shanghai and a node in Hong Kong and a node in Los Angeles and I can do multihop VPN; so I can bounce through five different locations to anonymize the traffic. I can use it for myself but I can also let other people use it and get coins for that. Skywire I think took four years, which was a huge development effort. The reason that Skywire came out was because there was an attack on Bitcoin, where you could attack people’s IP addresses. So if you had a Bitcoin node and you were connecting out to like five IP addresses and the ISP or the NSA controls your cable modem, then they can hijack all the traffic to that IP address; so you don’t even know if you are connected to the actual Bitcoin network. The government can create a fake Bitcoin network with a thousand nodes that they all control and only let you connect to that network; while you think that you are connected to the Bitcoin network and you are not. So there’s this question of how do you determine if you are connected to the real Bitcoin network or if you are connected to a shadow network where the IP addresses are hijacked.

\[pauses to fix microphone\]

**Christian**
See this is the stuff that people don’t even realize...

**Evan**
Yea that was quite the introduction.

**Synth**
So that’s a massive effort, and we are just starting to get that on, people are just starting running these nodes. Since we have these nodes, we need a lot of hardware to run this network. We don’t want people running this on Amazon, so we’re actually producing our own hardware; which should be shipping in about a month. There are pictures on the website and it’s probably going to be open source. Also, we are getting a hardware wallet. We just hired our first Electrical Engineer last week to start working on our hardware wallet. And then, it turns out people started cloning Skycoin and making their own coins so now we have something called Fiber. So we have fifteen or twenty coins launching on top of Skycoin as a platform. We say it’s like Skycoin’s ERC-20 platform. Basically, we couldn’t stop people from cloning Skycoin and launching their own coins, so we decided to build a coin platform around this.

**Christian**
So where did the initial funding come from? And how is this project being sustained?

**Synth**
So when we started, Bitcoin was less than like a $1, so we were just... balling \[laughs\] so we never really needed money.

**Christian**
So there’s no state sponsors there’s no corporate sponsors, there’s no bullshit, there’s just developers? Anonymous developers? Well known public developers?

**Synth**
So we have a lot of anonymous people and a lot of early crypto people. The crypto people are really weird like..

**Christian**
Yea I’m sure

**Synth**
So Bitcoin has had twelve different generations of people. So the people that you see coming in now are just like, “Get rich quick!!” “Make money while you sleep!!” “Ahh high yield” “This coin pays me 10% per month why am I gonna buy your coin if this coin is paying me... etc.” They’re just in it for the greed. The early people in Bitcoin, the first generation, were really paranoid like crypto anarcho capitalist. They wanted to take out the FED. They were like central banking is slavery and we need to get rid of the central banks and that was really why they were building this thing. You see like, Satoshi, one of the messages he embedded in the blockchain was about this engineered banking crisis, which was like a bunch of banks looting... basically they had a crisis and the response to the crisis was the government printed out 20 trillion dollars and put it in their friends pockets.

**Christian**
Sure

**Synth**
So it’s like, “ohh yea give us twenty trillion dollars or the world’s gonna end tomorrow” \[laughs\]

**Christian**
Right. Right.

**Synth**
So these people just getting looted by the central banks. So the early Bitcoin people.. Ironically, a lot of them worked for government, so if you’re a crypto person you’re working for huge corporations, working for government, working for people who have money and you have to sign all these NDAs. They were never publicly associated with the Bitcoin project at all. So Bitcoin had a few public faces, but most of the actual people behind Bitcoin were just in the shadows. I went to a Bitcoin conference in Vegas and I would see one of these guys and he would just sit in the corner and watch people. He would just like never talk to anyone, he would sit there like, “Hmmm what’s going on, who’s a scammer etc.” So these people are watching Bitcoin and the direction it is developing in, but they’re not really participating in the community. Then, every six months we have a completely new crowd coming into cryptos and it has been like that for eight years now. I think we’re on like the twentieth generation of crypto people.

**Christian**
So there’s a lot of developer communities around the world. I got into this only really at the beginning of 2016. I heard about Bitcoin in 2013 but obviously if you don’t know anything about code and what shit actually does and you just read the news, basically 2010 to 2015 was all negative. It’s all like this is all for darknet shit etc. My question would be, there’s a lot of communities... like there are all of these hacker communities like black hat and there are conferences like devcon. Is there a lot of overlap from those security professionals into this fintech/crypto/money thing? That we know as Bitcoin/Skycoin? Or are they really still separate? Like the guys who are hard core into security, are like yea Bitcoin... but like I’m breaking networks etc.

**Synth**
They’re not... I wouldn’t say separate. What you have to realize is that the groups are very small. You can look at the group in Ukraine as an interesting example. They were just a bunch of friends in a pub and they hear about Bitcoin and they all buy it at a dollar, well they buy it at a penny and then Bitcoin goes to one hundred dollars, now they’re all rich. So one of them starts a Bitcoin mining pool, Gigahash, one of them starts a Bitcoin exchange, BTC-E, one of them starts a Bitcoin mining company, Starfury, and they have their own internal Bitcoin ecosystem. They were actually the first people to invest in... they were called structured ASICs. They’re like FPGA type mining things. So they were the first people to fund GPU mining, and then first people to switch to FPGA mining, and the first people to do ASIC mining because they had the money and they were interested in this for so long. It was just like a small group of friends. So within the security community, you might have like twenty people who are interested in Bitcoin and who are hard core developers and they’re doing their own thing. I wouldn’t say that the communities are that organized. It’s just like a giant blob of people and there’s a little group inside of that that maybe does this or that.

**Christian**
So when people see something like devcon, they’re like “oh my god these guys can bring down the world” but it’s not really like... it’s just a bunch of people in a room, it’s not like nation state level where they have like 3,000 to 4,000 hackers very organized at the military level.

**Synth**
\[laughs\] Yea I’ve seen the government hacking squads, they’re running like windows xp... and like \[laughs\] Yea it’s, it’s a joke.

**Christian**
I’m sure the NSA has some top level guys though, you know. I’m sure there are some cats that fuck around but there are those guys who are very well funded and they know what the fuck they’re doing.

**Synth**
They’re all private sector.

**Christian**
Yeah, exactly they’re private sector because they’re not gonna sit there and deal with bureaucratic bullshit. They’re gonna get shit done. You know money talks at the end of the day. Ok so it’s self funded it’s organic, so Skycoin.. I’m sure you have developers all over the place. Is there a sort of a base for Skycoin?

**Synth**
No.. we have like twenty Ivans. \[laughs\]

**Christian**
Got it, got it.

**Synth**
We have people in Russia, people in China, people in the United States, a few in Europe, not so many in South America but it's global mostly.

**Christian**
So you know, for a lot of people, a very simple question would be... Ok so we have the difference between Skycoin and Bitcoin, but honestly number two in line is Ethereum. And you mention Fiber so you can print your own sort of ERC-20 like token, what’s the biggest difference between you and Ethereum like why isn’t everyone just using Skycoin instead of something like Ethereum?

**Synth**
Well our scripting language wasn’t finished until two months ago, so that's one reason. Ethereum has really evangelized, sort of, blockchain and they've pushed it out there. They've built this huge development community and they've done a great job, but their stuff isn't really ready for production. An example, you’ll have four thousand applications on Ethereum w/ four thousand ERC-20 tokens and if one token is doing an ICO, the whole network will shut down for two days just to process the transactions for that ICO. So if you’re a company like Siemens, and you’re trying to build a power grid on Ethereum, and the power grid goes out for two days because you know, Catcoin is doing an ICO, that would be ridiculous. So, these companies do like Ethereum, they like the blockchain but they don't want to build their business on it. They want a blockchain that they own. So one of the differences, and one of the reasons we built Fiber, is because these companies were coming to us and saying, “we want our own blockchain.” We don't want to use their blockchain. We want our own. So they are doing pilots and tests on Ethereum, but for actual production, for legal reasons.. like if there’s a hack and six hundred million dollars is stolen, they need to go in and reset the blockchain and get that money back and Ethereum won't do that for them. Also, they’re worried about all this money. They keep reading these news articles like “twenty million dollars stolen” or something like “my friend sent eight hundred thousand dollars to an unspendable address and now the money is sitting there and you can look at it and can't spend it.”

**Christian**
Are you fucking serious dude? Eight hundred thousand dollars?Holy shit.

**Synth**
Yea, if someone like did a typo in an address and now the money is stuck in an unspendable address and they’re like, “how do we get it out?” Because they had some scripting bugs or something.

**Christian**
Oh yea, I did hear that before. Yea there’s this big problem with ICOs, this huge problem, especially with these hardware wallets. I know exactly what you are talking about now, it makes sense.

**Synth**
Yea and some of the money, the amounts of money. It’s like, “Oh I lost a billion dollars.” For Bitcoin that’s normal, I probably had a wallet with like five thousand Bitcoin in it and like oops I deleted it. Like aw I can’t find it where did I put that wallet, and that's really just... losing millions of dollars experimenting with these cryptos is normal, but with businesses \[they have regulations\]. If you're running a power grid, they have all of these laws about customer billing and if they overcharge the customer by 0.3%, they get a million dollar fine. They like blockchain but they don't like this unreliability. So for Fiber, we don't put all of the applications on one blockchain. It doesn't make sense for instance to put all of the world’s data on one giant blockchain and then force everyone to download one hundred terabytes of data. It just doesn't make sense to do that. We give each individual application their own blockchain. So we have this platform where we can spin up a million blockchains and this is very interesting. Delaware said that if your company, you know a little small cap company, registers in Delaware, you can put your stock on a blockchain. And if your stock is on a blockchain... you know your little bakery in Delaware and you incorporate and issue shares. People can buy and sell those shares now on the blockchain. It’s very easy and there are no fees. So say that little bakery becomes a publicly traded company and they want to raise money. If they want to sell their shares and the bakery makes more money, their share price might go up; so this is very interesting, but so for that particular company we would just want to give them their own blockchain. Like, here’s your stock ledger, you don't have to interact with anyone else. Here’s your blockchain. We might have ten million other companies in Delaware and they all need their own blockchain. They don't want to all be shoved on to this giant thing that stores all the world’s data.

**Christian**
Ok, so you solve this by spinning up parallel blockchains, basically making more lanes for traffic right?

**Synth**
Yea

**Christian**
Ok, I see what you’re saying. Ok so, if I spin up my own blockchain, am I spinning up tokens as well for that chain or?

**Synth**
So that’s the interesting part, everyone is obsessed with tokens because they can do an ICO and sell tokens and make money, but the blockchain is just a database. It doesn't need to be tokens at all. It can be shipping containers. It can be tracking cars or tracking boxes or tracking the delivery status of a package or tracking parts in a machine and when they need to be replaced. People don’t understand what blockchain is, blockchain is just a database. And when you say blockchain is just a database, they get really depressed because they are like well databases are boring, but that's really what the blockchain is. So most of the applications for corporations are just gonna be the company using the blockchain like a database. Thomas Reuters internally, they don't need a token. It doesn't make sense for them, but they have data they want to store and they have operations on the data that they want to perform. So when you start thinking of blockchain as a database you start getting closer to the real world applications. But if you want to make money you have to have a token so that's why everyone is obsessed with ICOs and the tokens. Because once you have a token, you can put it on the market and you can pump it up and you can speculate which is what they’re doing.

**Christian**
Yea i see what you're saying. So with Skycoin, the actual token I mean. Ethereum will be moving to, hopefully, Proof of Stake with the Casper implementation probably in 2018-2019. How does Skycoin work? Is the token mined? Is there some sort of staking? Is it like a masternode tech? Or is it its’ own kind of thing?

**Synth**
Completely new, this is the next generation.

**Christian**
Ok so, how to you earn Skycoin without buying them on the market and just accumulating them?

**Synth**
Ah ok so there is two questions here. For Skycoin, we didn’t want the people controlling the consensus network to be fighting to control the network to get all the transactions fees because we saw what was happening internally what was happening on the inside with Bitcoin; which was the miners made money from fees so they were holding the network hostage for fees to drive the fee price up. One of the mining pools was actually spamming the blockchain network for years with like crap microtransactions to fill the blocks up to force the transaction fees higher so they made more money. The miners, that's their business, so their relationship is actually one of antagonism with the community; so we wanted to get rid of that. To get rid of that, we had to get rid of the mining reward and we had to get rid of the transaction fee. Because if someone received the transaction fee and they received the mining reward for coins, they are going to fight to control this consensus network and it’s going to consolidate into one or two giant companies.

**Synth**
So we created this new consensus algorithm called Obelisk, it’s sort of a web of trust. You have a consensus network and each node has a public key and each node subscribes to other nodes. It has a trust list of people, for instance if you know me personally you can add my public key to your trust list and the nodes subscribe to each other and they publish messages. Through this process, it’s actually a very old algorithm from the 1980s, the nodes all reach global consensus on what the current block head is. This type of mining doesn't require a lot of electricity. You could run it on a 30 watt cell phone processor. You don't need to have 600 gigawatt power like the Bitcoin mining network rigs. This is a much more efficient, much faster type of consensus process, but it does it in a completely different way. We have some whitepapers, but we have to write a sixty page whitepaper to go over more the implementation specifics because they matter a lot. Because most of the attacks aren’t actually an algorithm and they’re not the math it’s about how the thing is implemented. So since we don't have mining rewards and we don't have transaction fees, we are forced to create all the coins in the genesis block. And this was a problem because a few years ago people would always say “well that's premined!” Now people are sort of used to premined. They don't call them premines anymore it’s just the way it’s done. We had to figure out a way to distribute the coins fairly, so instead of just running this machine and doing mining and like blowing electricity like throwing money in a pit and burning it, we tried to find ways that people can receive coins for providing services that people are willing to pay for. One of the applications is Skywire, which is sort of a decentralized ISP where people will receive coins for forwarding packets. So once that's up, that’s going to be the primary method for distributing the rest of the Skycoin.

**Christian**
Ok that makes sense because there has to be a way to distribute it, either manually or... so who is in charge of the keys to the master wallet right now? Is it a group of developers, what you have nine out of twelve signatures or something?

**Synth**
Yea, It’s actually worse than that. It would’ve been better if it were nine out of twelve but it’s unanimous, so whenever we say we are going to distribute another million coins we have to get all of the developers to agree; which is why the distribution has been so slow. Because you have one guy who says, “well I don’t think that’s a good use of the coins and we shouldn’t do that etc.” Basically the community was screaming loud enough for enough years that it forced us to distribute this many coins on a set schedule and we finally found an agreement. I don’t think that it’s aggressive enough. I would’ve preferred to distribute 50% of the coins, but we have an agreement to get up to 30% and then to do 5% per year for the next fourteen years.

**Christian**
So right now, I’m sure that you are paying people for work in Skycoin. Wait let’s slow it down here, coinmarketcap says one hundred million Skycoin? Is that right?

**Synth**
No, well actually there is one hundred million, but only twenty million of them are spendable because they are time locked.

**Christian**
Oh I see.

**Synth**
That’s actually wrong, they haven’t updated this. The maximum supply, the total that will ever exist is one hundred million. Skycoin has six decimal places before the zero. If you have one million coins, you have 1% of the coins and then it goes six decimal places to the right of the zero. So this is a really human number because I didn't like the twelve zeroes or the 0.05969785 where you screw with the zero and you don’t know if it’s twelve zeroes or eleven zeroes or how many digits the thing is. So there’s one hundred million total and the reason that number was chosen was that one million coins is exactly 1% of Skycoin. The maximum that will ever exists is one hundred million. The total that exist right now that are spendable is actually less than twenty million, but coinmarketcap for some reason hasn’t updated and it still says one hundred million.

**Christian**
Yea it only says circulating supply of like six million.

**Synth**
Yea, and then six million have been distributed.

**Christian**
Well let’s slow down, so in terms of how the coins get out right now. There’s an organization of developers and they are choosing where these coins go. Now, so there are strategic partners, I know you said Skywire, there are projects associated with this. Are there any other modes to get in and get coins other than buying on the exchange right now?

**Synth**
Well you know buying them, doing work, bounties, translations, software development. For the coins, we have to distribute up to 20% and the next 10% are reserved for mining rewards so those will be distributed to the early people running the Skywire nodes. After the 30%, there’s a time lock and there’s a maximum of 5% per year of coins being released from that. So it will take fourteen years to get to the rest. So, essentially there is only thirty million coins and then the rest of the coins are going to take like two decades to get out and I don’t even think that they are going to be distributed at the maximum rate that they have been unlocked. We have twenty million coins unlocked right now and we have only been able to distribute six million so far and we’re distributing as fast as we can. For distribution, there are two major things: in two weeks we are launching an OTC market and we are going to start putting up ten Bitcoin per day of Skycoin on the OTC market so that the whales and the traders can start getting the coins more easily. So one of the complaints that we’ve have is that Skycoin is listed on cryptopia but nobody can buy it because nobody is selling the coin. So if you wanted to buy twenty Bitcoin worth of Skycoin, nobody will sell it to you. So there’s no trading because  you have a market and nobody will sell it to you at the market price.

**Christian**
I mean, mine are sitting in a private wallet. I don't even know why they are even on exchanges at all right now. I mean I guess people need to spend their money, some people work in crypto like you have to move the coins. Anyways, so let’s keep going, so how are these coins getting out?

**Synth**
Well this is very interesting. So we have some whales and they will buy twenty dollars a day, fifty dollars a day, two hundred dollars a day and they only buy but they won’t sell. Because the attitude is, if there is a coin and it can get listed on a larger exchange or it’s launching all this stuff then they’re expecting the price to increase in the future. They’re like why would I sell now if I could for 150x more in a year from now or six months from now. So we have a lot of really long term holders and they are just taking the coins, putting them in cold store, and they never leave cold store. We tracked down the cryptopia wallet and basically less than like 4-6% of the total Skycoin ended up back on the exchange and there are so few coins on the exchange that you can't day trade on it. So this is a problem with liquidity, because the traders want to trade and they can't trade because there isn't enough depth on the order book. We are trying to get through this distribution phase to add more liquidity and get the volume up a little bit.

**Christian**
Do you think Skycoin will have their own exchange one day?

**Synth**
We have github.com/skycoin-exchange, so we actually wrote our own exchange. This is a dark net distributed federated exchange and we wrote it about a year ago, but we haven’t had time to fix it and get it into production. In the end, we ended up scrapping that and then using a third party exchange. Parts of that exchange became the OTC market so now we are gonna have the OTC market and I think that eventually we will have that exchange up. It's more like a dex.

**Christian**
Yea, I mean its only going to be for the super hardcore guys right?

**Synth**
No no, it's really easy

**Christian**
Oh it is? ok

**Synth**
So with Bitcoin, when you are trading on an exchange... since Bitcoin can take over an hour or twenty minutes to deposit money, you have to take your one hundred thousand dollars of Bitcoin and leave it on the exchange. Sometimes it gets stolen. For our exchange, we didn’t want our users taking a lot of money and having the exchange hold it for them. So with Skycoin, the transaction time is as low as two seconds. If you want to make some trades, you just deposit the money in two seconds, you make the trade and then you withdraw the money back to your wallet in five seconds. We have this exchange that doesn’t actually hold any money, which is a pretty good design. You can actually hit a button and it will withdraw all of your money from the exchange right back to your wallet. So the client and the server are actually integrated and it’s all public key based, so there’s no username, password, or email. It’s just a Skycoin public key that identifies you to the exchange and the order book. Also, if your account is idle for like a year, or a month, when you want to create your account it gives you a deposit address to return the money so that if you close your account it will just send all of your money back to this default address. So it’s a very interesting design, its not like an http exchange, its like an application that you run locally and it opens the web browser. It connects through the darknet to the order book backend. Anyways, I could go on for hours about that.

**Christian**
Yea I hear what you’re saying. So I mean, what got you into this whole thing? I mean this project itself as you said it has been around for a number of years. What specifically was your sort of jump into this?

**Synth**
I’ve been doing this like forever. It feels like fifteen to twenty years for me. I was in the early like crypto anarcho-capitalists like underground newsgroup servers. I was one of the first people to hear about Bitcoin and I was stuck fixing the bugs. When Bitcoin was released and it wouldn’t compile on Linux because the guy was just like svn, there was no way to submit changes so you would fix this bug and they didn’t have Github so you couldn't do a pull request. So you would make a fix and then nobody would actually incorporate the fix into the repo, then next week somebody would end up having that same problem again. As far as crypto, I’ve been doing crypto and networking for awhile... like I did a video game, I worked at a hedge fund, I did early Bitcoin stuff. Now, I’m involved with like fifteen coins I think.

**Christian**
I’ve always been very curious like because I you know I’m like most white guys in their mid twenties, buying Bitcoins and storing it in wallets, doing some cool stuff with coin interview and stuff, but not anything like... how do you even begin to?? I always try to get into programming but I could never—

**Synth**
—adderrall \[laughs\]

**christian**
Yeah.. so where do you start? So you say you’re fresh out of high school, you know I can go to the military, or go to college or I can start poking out on the web and getting into some sort of code, especially with crypto and coins. How do you learn how to code and fix things and do that? Did it just come natural for you?

**Synth**
No... Well you start with math and you start hard things like video games, like puzzle games or something, and then you go start programming. I started programming at like eight or something in logo. I had an apple two and this program with a turtle and it was like “turtle go right, turtle go forward” and like drawing stuff. After college, I started doing websites and I created a bot that would spam up one hundred thousand websites to get ad revenues. It would just take this database and generate all these websites and it would catch google search results and people would come in on mobile and accidentally click the ads and I would make like twelve cents or something like that \[laughs\]. I had like a whole botnet going and that was in PHP. Then for some reason, I started making a video game in Javascript and then after I realized Javascript was too slow I moved to C++ and I ended up making a 3D video game. That took like two years. Then I started doing like hedge fund stuff which is the same stuff as the video game, you have a database and you have to do all these fast operations and networking. We were using Amazon EC2 when it just came out and we were renting like fifteen thousand servers from Amazon and blowing like seventy five thousand dollars in one go \[laughs\] you know? Ummm and then Bitcoin and then I started getting into crypto because I was fixing the bugs in Bitcoin and I was dealing with things like, “oh does it compile, or why don’t they have compressed signatures enabled?” and then I got pulled into doing this audit for this other crap you know it just keeps going and going and going and going.

**Christian**
Yea so its kind of like a snowball effect, you just kind of start messing around and then you just get into it because I’ve tried reading books on Python and I’m like okay—

**Synth**
\[laughs\]

**Christian**
\--like this hurts

**Synth**
The books are shit. You just have to go in and figure out a game you want to make like flappy bird or something. Like ok how do I draw something?

**Christian**
You know I don’t play games I used to have like a gaming addiction so I stay away from that shit now.

**Synth**
\[laughs\]

**Christian**
Here’s another thing, you can't fucking do everything in life either. Some people are not fucking like renaissance geniuses like I cannot do thirty things perfectly. We’re not fucking robots. Everyone has their own specialty. I really should ask that question more though because it’s a rabbit hole right? Like there’s so much fucking shit you can do it’s almost infinite right? It’s just code, as long as you can think it you can do it right?

**Synth**
Theres this guy who made this thing like Worm Online. He started a project in college making like an MMO and its sort of like Morrowind. He spent like fifteen to twenty years doing this and he essentially wrote like World of Warcraft by himself. \[laughs\] It’s pretty funny. You just start on it and it never ends, and thats how Skycoin has been. We’re not even finished with one thing and we’re starting like five more projects. Like, “Oh now we need to double the developers, oh we need to double the teams, more projects etc.” For example sometime last week, we decided like oh were gonna have a hardware wallet now; so we just hired a guy who does pcb boards and he designed a pcb board and we just had it sent to the factory and he needs to solder the components. Then we have to flash the firmware and do testing and then in two weeks we'll have a hardware wallet and then we have to use a factory to start shipping out these hardware wallets. Then the other people on Fiber, like we have Solarbankers and we have spaco.online, which is some like distributed file storage project. All of these coins on Fiber, they want branded wallets, so we have to customize the wallet with their logo on it and something like that. We have a sports betting company and we have a forex company who is launching a coin too and they want gold plated, you know like a solid gold hardware wallet, so now its like hey how do I find a machine shop who does a solid gold casing wallet \[laughs\] and it just keeps going and going and going you know?

**Christian**
Right, so in terms of going and going and going, with digital currency there really is no end to this right. People are going to find a way to monetize every single fucking thing that they can that make sense, because some things just don’t fucking make sense to monetize.

**Synth**
I think its very funny because we are seeing like ten ICOs per day and most of these projects... it doesn’t make sense to have a coin, like theres an instant messenger and they’re launching a coin and they want to raise one hundred fifty million dollars on an ICO. It's like ok now I have messenger coin. So it’s like, “oh what do we need messenger coin for?” “Oh you want to send somebody a message on your cellphone and it costs coins!!” So every message would be like ten coins right and I’m like this is retarded. They are trying to take things that you are already getting for free and then attach coins on it so you can have an ICO and it doesn’t make any sense at all. These coins are not... they are just apps they are like app coins.

**Christian**
So like me, I don’t understand the app coins. I run some of the dynodes for the Duality Project and for me its always cooler for someone who’s not really interested, you know I can follow tutorials and shit. For me, setting up the nodes or the validators and staking the wallets that for me where it makes a lot more sense to put your time and attention into rather than just... I mean yea I’m gonna send a message to my friend and I’m gonna get like .000001.

**Synth**
\[laughs\] and you’re gonna get paid for messaging your friend? Oh yea and this, “we’re gonna get paid to watch ads bullshit thing” like, oh yea people watch ads so were gonna pay them money to watch ads and then this company would like spawned ten thousand bots to collect the points and then try to redeem them for like Amazon gift cards \[laughs\].

**Christian**
Yea theres like really hard questions. I wish I always had like a programmer on our show so I could ask the most ridiculous questions. because that how I was like.. now that you mention it I interviewed Bitclave and they have some really cool devs on their team but like cant you just get bots to run on the...

**Synth**
\[laughs\]

**Christian**
Like how do you protect against botnets? Like those are just malicious nodes right?

**Synth**
Substratum... you know I shouldn’t shit talk people but this is pretty funny. They have a server and they say you’re gonna run your server and you’re gonna get coins every time someone accesses your web server right? So why wouldn’t I just get a bot and have it hammer my page one hundred times a second and just get coins in my wallet? Companies like Google and Facebook spend billions dollars a year trying to stop this type of fraud and they cant stop it, it’s essentially impossible. It’s funny because Facebook was selling hundred of millions of dollars of ads for the advertisements on the right hand panel of Facebook and what was happening was people were spending like fifty million dollars on an ad campaigns, but some of these companies had analytics. They start saying, ”well where are these IPs coming from?” and they found out 50% of the traffic from the Facebook ads are coming from China and they’re like, “Hey wait isn’t Facebook blocked in China? Why are we getting all of these?” so they realize, “Oh they’re bots.” So even with Facebook, as long as the advertisers are willing to pay for the bot traffic they don’t care, but when they find out they have a problem.

**Christian**
They can get sued, basically sued right?

**Synth**
Well you would just switch your ad money to some other platform.

**Christian**
Well you could switch the ad money, but you’re not gonna fucking sue Facebook like good fucking luck with that. \[laughs\] I mean it’s only when an entire fucking you know, like I think the entire EU had to sue Amazon or Google recently like it has to be a conglomerate of like fifty fucking countries to take a chip out of their fucking pay and it really isn’t even that much money they’re getting back like.

**Synth**
Their margins are really thin, so like if you have an ad account and you’re giving some little advertising thing that’s barely making money, maybe like two hundred thousand a year. You’re god, like you say get rid of that fucking article, fire that guy, they don’t want to lose that ad account because their margins are so thin. They actually lose money most years. New York Times is trying to put up pay walls and Washington Post isn’t making money and had to be sold.

**Christian**
So lets get into that, the fake news thing. I think the probe today, Mueller, they’re indicting people now. The Trump campaign. This is like fucking really big news, so how can Skycoin help with the fake news. It’s basically a sybil attack right? I can hack the whole fucking country’s propaganda and get the president elected so like where are we going with all this shit.

**Synth**
Basically there is a group of people and they want to control what articles and narratives people are seeing. So for instance, there are the people who own the banks and they own the oil companies and they own the industrial interests and they own the factories and they own most of the land. One family might own like one third of western New York like some of these families own whole cities. And it’s not actually clear that it’s all owned by one person but they’re some very closely knit group or intermarried, maybe it’s four families but they’re all married to each other so they have different names but it’s the same group. And traditionally they control the media, so if you own the banks and you own the factories and you employ all the people in some city then you also control the newspaper. So they’re used to having this power over what gets published and what doesn’t get published and because of the internet they are losing that now. The other thing is if you are a nation state like the US then the government would have some control over the New York Times and everyone would wake up in the morning and they would have one local newspaper for their city and they would have one national newspaper so they have two newspapers and they couldn’t really have more information then that. So the government would come in and say “Well Ohhh the Vietnam War they would say this and that and don’t go over there and blah blah” So they are basically losing control over the information that people receive in the media and Google has come in, Google, Apple, Twitter and they have basically taken over the media; like google is the media. If you go to Google news, that’s where people are getting their news from, so these very rich, wealthy, powerful groups that own these companies… they are sort of losing power because they own the New York Times but it doesn’t get them the power that they had before, the influence. So they basically ganged up on Google, this is very funny, all these corporations pulled out I think seven hundred or eight hundred million dollars of advertising money, all at once. They all pulled out at once the money from Google to show how powerful they are. They say this is our money and if you want our money you have to do what we say. Then the CEO of Google comes out, Eric Schmidt, he comes out publicly and he says it’s not censorship, we are just removing the pages from the search results.

**Christian**
What??

**Synth**
\[laughs\] So what do you mean its not censorship? So it’s a very funny Eric Schimdt quote because Google is a company and they have a price to earnings ratio, for their stock price. If they get one dollar of money coming in, their stock goes up sixty dollars or twenty dollars or whatever it is. So if you pull out six hundred million dollars from Google a year, that removes like sixty billion dollars of stock price from the owners’ pocket, so they basically have to do what they say. It’s just like this is how it’s going to be and you’re going to do it, if you want our money you have to do what we say. The European Union did the same thing but the politicians at the European Union did a fine. They said you’re gonna do what we say or we are going to fine you four billion dollars. So that's what’s happening basically. If you are a powerful group in a country like France or Germany, you want to control your population and you want to control your media. You don’t want Google, which is a US company in San Francisco, you don’t want them controlling your population. Because if you control Google, you control who gets elected, you control whether people are rioting or not, you control whether they are focused on the sports game or if they are focused on some pedophilia scandal. You basically control the whole attention of the mob. So these politicians will go to Facebook and Google and they say, “You support my campaign and you don’t support his campaign, I only want negative things about them,” and if that person has the power he has the ability to send the regulator a Google or Facebook and fine them a billion dollars unless Facebook does what they say.

**Christian**
What? I don’t understand that, fine them for what?

**Synth**
Anything, the government can pull reasons out of their ass. They can make shit up. They say, well Google is too big we need to fine you for being too big. The reasons that they create for fining these companies are just ridiculous. It’s like, “Google is too big, it’s too successful, so we need to fine you for being a monopoly.” But it isn’t a monopoly because you could just switch to Yahoo, you could switch to Bing, but nobody uses them because they aren’t as good. So it’s not really a monopoly, nobody forced you to use Google with a gun to your head. People just prefer to use it because the service is better, but the European Union could come in and say that you’re market share is too large so we have to break you up into smaller companies or something like that. And they did this remember? They did this to Microsoft. When Microsoft was getting pretty powerful, the government came in and they had some federal lawsuit against Microsoft. They said they are going to break the company up into six or eight pieces, but, “Oh if you do what we say we can help you out here and get rid of this,” and then Microsoft got in bed with the NSA and the government and the department of defense and now they’re one of their boys. So if you get to a certain level of power, you eventually have to get incorporated into this system and cooperate with these people or they’ll crush you like a fly.

**Christian**
So this is where we are going with this narrative right, so we’re going back into crypto because ok well you can’t stop me because you don’t know how much money I own, you don’t know who I’m in bed with, you can’t track all of these IPs.

**Synth**
So whats happening is very interesting, China wants to control its' population, European Union wants to control its’ population, United States wants to control its’ population, so they are complaining now that Russia is going into the United States and buying ads and influencing the election. They are basically complaining like, “We want to control our population we don’t want Russia interfering with our stuff.” So what is going to happen pretty soon, I think in ten to fifteen years, you are not going to have a global internet. We had this period where there was a global internet. Now we're getting a Chinese internet. We're getting a Russian internet. We're getting a North American internet. We're getting an European Union internet. We're getting a Brazilian internet. If you are on the Chinese internet and you try to use Dropbox or Google Drive, it doesn’t work because the government blocks it. You have to use Baidu’s drive, so the Chinese government can get all of your data. If you are in the United States then you have companies like Dropbox and Amazon. So if you give your data to Dropbox then Amazon has your data and then through Amazon the United States government has your data. So the United States government wants people on Dropbox, so they might stop slowing down or blocking overseas services like Baidu.

**Christian**
Wait let's stop there for a second before we go further. So we are talking data, so there are definitely malicious people that want to blow up fucking buildings and shit, like that’s real that actually happens, but why would a government in general want to... I guess the question would be how do you feel about surveillance? Because it really is surveillance and to a certain degree you need surveillance, like you cant just have someone walk in and just take down the entire city block, which they will if theres no... right?

**synth**
Well they don’t want... I mean its very interesting because if someone goes and blows up a building, they get their budget increase, so they wish there were more buildings blowing up I think. Because they have these huge budgets and they need another terrorist attack every six months because people are like, “Why are we spending all this money?” I mean I think there are some good people, but mostly I think it’s about money. I think that’s all they care about.

**Christian**
Right, ok. Well lets keep going then.

**Synth**
So we had this global internet, which was nice, and now since every country wants to control its’ own people and survey its own own people and keep the other countries from controlling its population and controlling the elections and being a spy on them. So like if you use Dropbox in Brazil, then the US government is getting a copy of all data that the companies that Brazil is producing and then the Brazilian government says, “No we want that data, we don't want the US government to have it.” So they start blocking Dropbox, or they pass a law saying that if the company operates that country then the data for that country has to stay in that country. The Chinese government didn’t shut down Apple and the iPhone. They just told Apple that if you want to operate in China you have to build data centers in China and you’re not allowed to operate the data centers. We’ll do that for you on our servers and you will pay our state owned companies to operate the servers and all the data for the Chinese iPhone users has to stay in China. So now Apple has to build these data centers because the Chinese government, they didn’t want a government official using iMessage and that going back to California and then the US government being able to blackmail someone with the iMessage chat logs or something. So what is happening is the internet is balkanizing by country. With Skycoin, what we are doing is building another layer on top of the internet basically a new internet with Skywire, and we are going to have the Dropbox and a Twitter and some of the social media and the messaging, and it is designed in a way so that it really cant be blocked by borders. It is designed in a way such that the users will be able to control their own data. It is not going to be controlled by a third party like Facebook or Twitter but the users are actually going to own the data.

**Christian**
So this is going like way past like... there’s Tor, there’s ITP, there’s Freenet.

**Synth**
This is a whole new internet this isn’t like a widget.

**Christian**
Ok so this is way beyond those sort of programs that you can run today to get around censorship and things like that.

**Synth**
Yea, so for instance, for tweets we store all of our tweets on Twitter and Twitter provides the servers, but since they’re providing the servers they control the data. So if the Chinese government wants to block Twitter, they just block the Twitter servers and then you cant access it. So with this service, your identity is a public key. Your identity is like a Bitcoin address. If you wanted to publish a tweet you sign it with your public key. You take your data you sign it with your public key and you publish it and if a thousand people are subscribed to your data they all get a copy. So once one copy of the data enters the country it just replicates peer to peer. There is no way to block it. There are no web servers. There is no third party. There is no corporation that owns your data. There’s no one that can ban or block you. So this gives people a lot of freedom but then there’s questions like...

**Christian**
So how do you stop the people who are just gonna straight up be like I think it’s funny to post child porn everywhere. Some people are just fucking retarded.

**Synth**
You remember the goatSC the guy who would hold his anus with the hands and people would just spam it everywhere in 2002, you remember that?

**Christian**
So how does the community censor, well, well yea censor because people don’t wanna fucking see that shit. So how do you censor stupid actors on your network?

**Synth**
So it is impossible to censor by design, but what we do is, you have subscription lists. So these are your friends, these are the people you care about and the people you trust so you only get their data. So the guy posting goatSC, just ban him. Hopefully no one subscribes to that. This is more like a network of trust and it is based upon communities.

**Christian**
That makes complete sense. That is the answer I didn’t even think of that as even possible. So thats how, that’s kind of how I get data nowadays. The only thing that I read is like who’s coming into my email. My attention is going to people who contact me and then maybe like the front page of like the world news sub-reddit where I’m just reading all the headlines to stay updated. It is a community because you just block out all the other bullshit. Like who uses Facebook anymore?

**Synth**
\[laughs\] I know it’s like, they’re dying. There’s this model that shows if about 1% of people leave, the other five hundred million people are gonna flee like a giant herd and they know that. They’re actually like MySpace. People come in, they do it for awhile and they leave. All the cool kids aren’t on Facebook, the cool kids are on this new platform and they are trying to sort of cover that up and make up for it with bot traffic and stuff like that.

**Christian**
Do you think it is because by design, the engineers are fucking stupid? Or I think its because the more logical point is they took on VC money they took on government money and now they cant fucking move as quick. They’re like we have higher fucking obligations over the next five years to pay contracts back to shareholders.

**Synth**
So people, when it came out it was cool, they were like, “Oh yea I can share photos cool and I can etc etc..” But do you really want to be sitting in front of the Facebook all day clicking likes on other people photos? Like don’t you want to go snowboarding or I could go swimming or I could go mountain climbing or I could go build this video game. People want to go do something with their lives. They don’t want to sit online and click like on photos all day, so thats really Facebook’s core audience, the people who are sitting there like zombies all day doing that.

**Christian**
So basically, I think, they do appeal to the lowest common denominator and that’s fine because that is legitimate market, but when it comes to an entire generation that is intelligent; it is sort of, well you need to be more and more intelligent every fucking day to keep up with the whole fucking thing. I mean here’s the thing it’s like… I just thought of something when you were talking about storing the data. I mean like soon, people are just going to be launching their own satellites and then they’ll just...

**Synth**
Yea we want to do that for Skycoin. If we hit a billion dollar market cap, we definitely want to do that for Skycoin. They are only like ten thousand dollars.

**Christian**
So someone just asked in the chat, like how big does the Skycoin network need to be where it would be impossible for governments to shut it down?

**Synth**
I mean it could be two people. Can you shut down a Bittorrent? Like someone sharing something on Bittorrent? The government has been trying to do that for like decade now. They have installed hundreds of thousands, and millions of dollars of equipment to figure out who your computer is connecting to and if using Bittorrent, if using VPN, shut it down or slow it down and they’ve failed. They havent been able, even the Chinese government, they’ve spent a lot of money on this. They control their borders, the ISPs are all state-owned, they have backdoors on the cable modems, but the VPNs are still not shut down most of the time. It’s impractical because if they shut one thing down the people will just do another thing. it is a losing battle if the government cracks down on it too much. They would prefer to control it. So for instance, if you shut down all the Bitcoin exchanges in the country people start trading Bitcoin locally with their friends in cash. You can’t track it. The government would prefer that you move all your Bitcoin through Coinbase so they can see how much money you’re moving, who you are sending it to, how often, who’s using it, they want that data. If they shut down all the exchanges for Bitcoin, people just move to cash then they are screwed.

**Christian**
I don’t have a problem with people paying taxes. Yea it kind of sucks that the government can just get a court order and say give me your records, right? But they have actual fucking legitimate weapons, like they can put a gun to your head. Do you want to get shot in the back of the head or you can just hand over your finances and we can figure this out?Like if you have a court order for your finances, you are in some deep shit, they know who you are, they know your name, they know how much money in your account, who the money is going to its like dude. Sure I know they have a wide net to see the relationship like the thin thread program developed in the nineties by the NSA. They can see all the traffic and where its going, but they are looking for very bad guys.

**Synth**
Ahhhhh it depends, it is very funny because some of these hacking firms, the NSA, people are always like “Ohh the NSA," but all the real stuff is in private sectors. So you have these huge companies that no one has ever heard of and they are the ones who get the dirty jobs because the government can’t do it because they have these regulations and these laws. If you are a private company, you can do whatever the hell you want and you don’t have these laws restricting what the government can do. So they’ll sort of farm it out to these companies. What’s very funny is what I’ve seen, some of these companies doing these zero day exploits, they are hunting down Bitcoin wallets and steal them because if they steal a Bitcoin wallet who is going to know? Right? So they are like what can we get away with? We have all this stuff we built, so how can we make some money on this. You know its the same thing as like the police, you go to some country and the police pull you over and they say, “Oh we found drugs on you,” and they just make it up because don’t really want to arrest you they just want a hundred dollars.

**Christian**
So here’s the thing and it gets quickly into human nature. Some people obviously are sociopaths and psychopaths and things like that, but then its just like why? It’s so strange like why the world is... you ever asked yourself that question like, “Why the fuck is the world the way it is?” Like you’re an engineer, you’re a programmer, like I can fucking build a better system than all these fucking idiots.

**Synth**
Well better for who right?

**Christian**
Right, exactly, yea.

**Synth**
The people at the top. They know how the game works and it benefits them. They like the way it is. They don’t want it “better” because it is better, they designed it.

**Christian**
Does that scare you a little bit though?

**Synth**
I’ve met some of these people and its actually pretty funny, like you have this dinner with this family and they made this money from this oil well from this civil war where six hundred thousand people were murdered and they are sitting there at dinner complaining about these other people over seas who started this civil war and the are bad because two hundred thousand people died because of some civil war that they started to get money, but when they start the civil war then it was for the greater good.

**Christian**
You see this is a fallacy because this is how the whole fucking thing comes crashing down right. I mean we’re starting to see... first of all there have been people killing each other since before the beginning of time but now there is this cascading effect where countries are fucking falling apart. That’s a little different.

**Synth**
They are just looting everything.

**Christian**
Yea thats the thing like the whole fucking thing is coming down and that’s a little different than just, “yea the world is a bad place etc.” What I’m getting to is like, it seems to be a little more engineered now, it seems to be methodically going in and abstracting everything out and dumping all the bullshit on people for people to deal with and thats not sustainable. That’s how we get into this whole fucking global energy crisis and that’s a whole other thing.

**Synth**
So you create problems and then people react, and if people aren’t stupid they fix the problem and they survive and we get to the next level. So one example, in the UK you had this little island and they don’t have many resources, they don’t have much population and this is maybe 1800s and they are burning coal for warmth in the winter and they would freeze to death because they didn’t have enough coal. There weren't enough trees on their little island to heat them. So they are digging for coal and they run out of coal and because they have water lines, they dig deep enough and the coal mine they are digging fills with water, so some guy invented the steam engine to pump the water out. Then somebody took that steam engine and put it on wheels and then somebody put it on railroad tracks and then later somebody puts it on a plane with a propeller and the later on that gets replaced by a jet engine. So if you didn’t have the wells flooding, then people would just keep digging the coal the way they had been digging coal for five hundred years. When you run out of coal, and people’s lives depend on fixing the problem, then you see the innovation. So yea this corruption is bad, but it’s part of a cycle. We see governments cracking down and we see 80% taxes in Europe and they’re banning cash. So they’re like we are going to tax you 80-90%, all your money belongs to us, and you’re lucky we let you keep five cents. People are starving because they cant afford to heat their homes in the winter because it’s too expensive. And the government wants more and more and more and they are banning cash, but at the same time that they are banning cash, cryptos are coming in. So this is, it’s just part of a cycle and eventually it will work out.

**Christian**
Yea I mean it’s funny, a lot of people think they are in control, even at the top and they’re actually not.

**Synth**
No its complete chaos.

**Christian**
I mean it is chaos because we are all just moving towards death. If you don’t accept that, then I am sorry for those listening but you just gotta wake up in the morning like I’m going to die some day. That should be the number one thing on top of your mind, and number two should be ok what should I do to have a good life. And if you’re a white guy like me, in the United States, whoa, you’re doing pretty fucking good compared to like 99% of the planet, but here’s the scary thing about that. Now everyone just turns around like, “well the United States has everything, or Europe is doing pretty good so I’m gonna go take their shit because they are just like pissing on me.” And that’s kind of scary because I woke up in 1990 like, hey I’m here. Oh look Desert Storm, ok 9/11, ok this is my fucking narrative. That’s another fucking weird thing like you’re born into fucking conflict.

**Synth**
\[laughs, mocking\] “They hate our freedoms! We’re gonna fight the freedom haters.”

**Christian**
I guess to bring it all back to crypto. You need tools to be able to have some fucking leverage on what you are doing. If you don’t have fucking control of the actual things that you create, then it’s fucking hell on earth.

**Synth**
You either control it or someone else controls it.

**Christian**
So this is going to be like a master-slave dichotomy, but i feel like the crypto thing evens that all out, so its still kind of there because there are still social Its still kind of there because there are still relationships but it isn’t so binary where its like slave-master. There’s more variation. I’m not into the whole nihilist, the Ayn Rand shit. It’s like ok dude calm the fuck down.

**Synth**
This crypto thing is very funny because if you look the government says, you printed like twelve trillion dollars.

**Christian**
\[responding to comments in live chat\] Wait we need to shout out the guy talking about white guilt. Its not like, dude, its not about being white. I realize I’m way fucking luckier than most fucking... like I’ve been around the world man. I’ve been to a lot of countries. You know go ahead man I'm sorry.

**Synth**
The whole thing is they want people to feel guilty about who they are.

**Christian**
Oh sure sure.

**Synth**
Like, “Oh you’re white you’re etc.”

**Christian**
Guilt, ok, but you also need to have some fucking degree of empathy for your fellow human being. If you have no mental, like if you have nothing to compare your shit to because you’ve never been outside of the United States. You just like, you know the whole white guilt thing is big right now but its not about being white. Ok lets take out the skin color shit, its just money, like I am way more set up than most people will ever be in their life. So if you need to feel guilty about that then ok so to speak, I’m thankful to even be in a fucking room talking about crypto at this point because its like ten, fifteen years ahead of some people at this point.

**Synth**
Oh so this is uh, so you have these governments these central banks, supposedly there’s fifteen trillion dollars in fiat, like the USD, EUR, YUAN, YEN, and so on and thats the number they officially published, but theres actually all this money and nobody knows how much money there actually is. They lie. They don’t have to report the exact number. They always smudge the numbers. Every country smudges the numbers to make them look better so they can get more loans and all this other stuff. They always understand inflation and they have all these different ways of fudging the numbers. I was talking to this guy and he does some offshore stuff. Basically, they think... there’s documented like seventy trillion, so the government says there is fifteen trillion but there is actually seventy trillion dollars offshore. What’s happening now is the US government is coming in with GACTA and FACTA and the G20 and all these laws and international treaties that are forcing all of the people out of these offshore tax havens. They did the Panama Papers and hacking banks and leaking all of this information about who is storing money overseas and like Putin’s friends, the families in China, and the ruling elite in Britain and basically like saying that you can’t hide your money from us we are going to find you. So this money that is like seventy trillion dollars, is basically being forced into the US because if you are overseas, the US is actually a tax haven. The US government requires data from every other country, but if you put your money in the US, the US government will not give its’ data to any other country. So if you hide your money in the US and you are from like Saudi Arabia, if another country tries to get that money or find where it is and who has it, they’ll just shoot down the lawsuit. But if you are a bank in Saudi Arabia you have to report your data to everyone... so this moves all this money into the US dolars and whats happening though is this seventy trilllion dollars that is offshore is now flooding into crypto. You see a lot, and these people don't know how to use it they are not technically literate it is still early but we are seeing this massive flood of money into crypto. The volume is unimaginable and the crypto market is one hundred and eighty billion right now and i think that it will go to ten trillion before it pops. Deoitte said that it will be worth five trillion dolars by 2030. The growth rate is over 1% a day and it has been that way for ten years now. If you actually plot, if you take the Bitcoin market cap and you put a straight line a regression line, the slope of that line is 1% per day. The boom and the bust cyle hasnt chagned that. This is also going to be a dot com bubble and burst too because most of these coins don’t have any value, so there is a huge amount of money flooding in and people are taking advantage of that. There are fifteen different smart contract platforms. 90% of these smart contract platforms don’t have any users, so if a smart contract platform doesn’t have any users then why is it worth ten billion dollars.

**Christian**
A fucking scam thats why

**Synth**
And it is very funny because I saw one pop up into the top ten or something. They didn’t even do an ICO. They had no ICO, no pre-ICO. They just sold some coins to some people and just put it on Bittrex and were trading it at like a billion dollars or something. Some company I'd never heard of. And um, its like, "Our thing has scale!" but they have no users and its like why is this worth a billion dollars. So whats gonna happen is, people are gonna ride the bubble, they are gonna invest in these speculative things if the marketing is good. Then before the bubble bursts, when it's near its' peak, the smart money is going to start moving all their assets into the coins with actual value. Like you have a coal mine, you have a gold mine, you have a silver mine, you're selling sand for coins. You have an ISP, a distributed utility company, you have actual solar panels. They are going to want physical infrastructure, like collateral that actually ensures these coins. Then we are going to have a bubble in these asset or commodity backed coins because all of this money has nowhere to flee. The other thing is, the money only flows into Bitcoin. If you bought Bitcoin at a penny and it goes to six thousand dollars, you can't sell one hundred fifty million dollars of Bitcoin. They don't even want to be taxed on it. They don't know if they are going to have to pay a 30% tax, a 10% tax or a 15% tax, they would actually rather just sit on the Bitcoin. No one actually ever sells the coins. It comes in they make the money and they just don't want to deal with the problems of running it back into paper money.

**Christian**
It's not really.. it's not that there is a huge problem because there is no money moving. There is no money moving, there is no economy. Ok, you have a whole pile of shit, cool. Are you gonna move it? No you're not? Ok I don't give a fuck then.

**Synth**
Well you can buy houses with it now--

**Christian**
\--so what do you think about the royal mint gold token? The royal mint england should be launching it in 2018 I think.

**Synth**
I met the one from Dubai. The xantum or xannium, or um..

**Christian**
Yea fuck that though, this is like the royal mint England, this is legit like fucking, gold, royal mint has been around for a millenia dude. It's been around forever.

**Synth**
You know... gold is really weird because you buy a gold ETF or like paper gold and they'll take the same bar of gold and sell the same bar to three hundred different people, giving a piece of paper saying they own the same bar. So I don't even really trust.. I'm very suspicious about it. Like, "Oh yea we have these gold bars!" but when you actually ask for the bars they don't have them. If that is an actually legit one that could be good I don't know. Like just take it and bury it in your backyard or something \[laughs\].

**Christian**
Well this is all the gold in our city, the royal mint owns it; so it's actually their gold. It isn't like the United States where you get a certificate or something like that. Anyway, umm,

**Synth**
Oh this is funny, we had a guy who had some mountain with a piece of paper saying he has a bunch of gold on the mountain and he wants to do like an ICO for the mountain.

**Christian**
What????

**synth**
\[laughs\] I was like ok...

**Christian**
What???? Get that shit dude, get the blocks out and mine the shit out.

**Evan**
What????

**Synth**
Remember sandcoin? That zirconium coin?

**Christian**
Yeaaa dude, we interviewed them. What happened to that project? Are they still around?

**Synth**
It's only been two weeks. \[laughs\] What do you mean are they still around? That quick?

**Christian**
Well I mean I guess they just finished their ICO. We interviewed them before they finished their ICO.

**Synth** So they finished the ICO and two weeks later they're like gone?

**Christian**
I would not be surprised... I would not be. I'm telling you. Ok so we are almost at an hour and a half, so what's the next steps? The hardware ledger? The hardware wallet?

**Synth**
So we are launching the mobile wallet. We just put in a new version of the desktop wallet, completely from scratch. We were just fixing bugs. There were like twenty bugs we didn't know about, so we fixed those. We are trying to get larger exchanges. We are going to be listing on CyberX when they launch. They were supposed to be launching a week ago, but they had project management delays and whatever. We are talking to binance. It's very hard to get in contact with any human at these exchanges. We have people who are just full time contacting these exchanges, but they just have these zen forms, so it's like fill out the zen form and hope someone contacts you. There are so many coins now. There is like a thousand coins and the exchanges only have room to list like fifty coins, so we are trying to get through that and get our marketing stuff in order and do more exchanges. We are trying to get the OTC listing done. We are trying to launch the Skycoin Skywire miner, which is the hardware platform for doing this decentralized internet. We are trying to ship the first units within a month. We have a supplier and we want three thousand CPUs, but they only have one thousand CPUs so we have to wait three weeks for the factory to produce more. So we are dealing with supply chain and how do we ship it and things like will customs reject it because they are electronics. So we're shipping those out we are getting started on the hardware wallet. We are starting with the marketing. We did a marketing campaign test, but we couldnt do anything because the media is focusing on this hard fork for Bitcoin. So we are waiting for this to die down so we can start our marketing coverage. We just did a new logo. We did our rebranding. We just finished getting like sixty thousand stickers printed up. I have a stack of stickers that is like sixty feet high.

**Christian**
Oh my god.

**Synth**
We're just hiring more people, hiring more developers. We're doing more interviews. We have like twelve more interviews lined up. It's exhausting. There is so much going on. The CX language. We don't have any press releases about that. We need to get the press releases for Skywire. There is just a billion things. It is really massive. It's exhausting too.

**Christian**
This CX language is really interesting.

**Synth**
We have a guy. Do you remember Huntercoin?

**Christian**
Yea.

**Synth**
That was one of my favorite coins. He did Namecoin too. He dropped dead at like 28 for no reason, this Russian guy. Huntercoin was like this MMO on the blockchain where you would fight people and you would get real money coins for fighting them. This sort of like nethack or something. This idea of a video game on the blockchain I really liked. With CX, we have this developer working on Dwarf Fortress or like Sim Ant and I want him to do some video game demos to show off what we can do with CX. Ethereum you can't really do poker on the blockchain because each block is thirty seconds. With Obelisk we can get the block time down to like half a second, so we can do real time games like poker or chess on the blockchain. So I want to see what people can do with that. So we are opening a dev platform and we are letting people come in and make games, and they can create their own token for the game and so on. Skycoin won't make money from that directly, but we will get people on the platform, get attention, and get people to install the software.

**Christian**
Hmmm, yea I think the guys changed the project to like Chimera, the Huntercoin.

**Synth**
They renamed it?

**Christian**
They forked the code yea. They are pushing that fork.

**Synth**
That's cool.

**Christian**
I mean shit man, this Skywire thing, I am going to look into it as soon as it's launched and starts running. Basically a mesh network right?

**Synth**
Yea a mesh net, but it's actually more general than the mesh net. Mesh net is a good marketing term but it's actually software defined networking. This just lets software control the networking. Like you can throw up a bunch of nodes on your roof, or your neighbors roof, and it will just automatically reconfigure to work and route the packets to the right place because each node has a computer in it. Whereas with IP, with the old internet protocol, you just look up the IP and the router looks it up and it forwards it to the next port. It's stupid. It uses like BGP. There isn't any intelligence on the network. With software defined networking, we put the whole network and how packets are routed under control of the software. It could literally be used for anything, for any type of networking. For VPNs, Socks5 proxies, mesh networks, or satellites, for whatever you are doing, you can just run a program to change how the network behaves. So this is very interesting.

**Christian**
Well I'm happy to hear that. I didn't even know you guys had a discord group. Is it pretty active there?

**Synth**
I don't really use it. We have a telegram and we are active there. We had a slack. We log into the slack and we see that there is like 28,000 messages a day. There are just spam bots spamming each other. One spam bot says, "Hi!" and the other spam bot says, "Hi!" and they just go back and forth in an infinite loop in private messaging and then the message queue ends up filling over.

**Christian**
Yea I understand.

**Synth**
With Telegram too, we have so much.. like every five minutes someone comes in and they're like, "Join our pump groups!! We have the biggest pumps!!" It's like penis pump cartel. "Coin pump, pump, pump, pump!"

**Christian**
Apparently, Skycoin is pumping right now. That's what they're saying in the chat dude. We're not fucking responsible for that shit.

**Synth**
What is it at now?

**Christian**
I have no idea they're probably just fucking with us.

**Synth**
I gotta check this

**Christian**
We had the guys from Golem on our show. They went crazy in the Polo trollbox and they pumped fucking Golem up. I was like I'm not fucking responsible for you guys losing your money. I couldnt believe that shit dude.

**Synth**
Oh we're almost at $4 we're up like 20% that's great

**Christian**
That's good there you go. Fucking boom Skycoin dude, go get that shit.

**Synth**
I can't wait for the Cliff High interview. He mentioned us in like his investment report and the price doubled in like eight hours.

**Christian**
Have you heard of the Palm Beach Confidential group? These guys? Aw man, they took ZenCash from like $6 to $25 dude it's like alright.

**synth**
What's ZenCash?

**Christian**
It's like a fork of Zcash.

**Synth**
\[laughs\] A fork of a fork.

**Christian**
I don't understand. Like I guess it's not illegal to do that. Like ok, "This is my pick and this is my bias and this is what I'm telling other people to buy." It's not illegal to do that. I would not fucking trust anybody who buys that coin. Like dude what the fuck are you talking about, if I read about it and it makes sense I'll get it.

**Synth**
I see these investment newsletters with these guys on a caribbean island on like a beach with two hot girls and a giant gold necklace and its' like, "buy this coin!! make 5000% profit!!" and I'm like what the fuck.

**Christian**
Good luck.. good luck. Yea I just got back from Spain. The whole idea of just being on the beach. It's where devcon is. I was going to go to devcon, but man... Cancun dude I don't know man. I just don't know about people who only want that in their life. Let's be real dude. For three days, you're like ok, and then you're like let's get the fuck out of here. I have other shit to do man.

**Synth**
"Snowboarding"

**Christian**
Yea exactly \[laughs\]

**Synth**
How hard is it to get onto Polo? I can't even get a hold of anyone on Polo at this point.

**Christian**
Dude let me tell you a story about Polo. I've been waiting about six months for my ticket to be answered.

**Synth**
\[laughs\]

**Christian**
They have like $10,000 of my coins in their master wallet because my friend sent me a transaction. There are only two transactions in that wallet. He had to resend the transaction to pay me again. Like you guys have my fucking coins they are sitting right there like right there you can see it on the blockchain. Who else has a wallet with like twenty eight million fucking AMPs that's Poloniex's fucking wallet. They still have not answered me. I think Polo is a fucking scam dude I'm going to be honest with you.

**Evan**
I think it is.

**Synth**
I think they're all... like most of them are scams. One exchange wants like $250,000 to list a coin.

**Christian**
I know Kraken is like that, you have to pay Kraken up to get on Kraken. You have to pay Kraken 150 Gs to get listed on there. Have you talked to the guys at Bittrex?

**Synth**
We were scheduled to be listed, but then the SEC shit happened--

**Christian**
\--Yea you have to do some paperwork with them

**Synth**
\--and like 30 coins that were supposed to get listed got cancelled and then Bill was like being evasive and disappeared.

**Christian**
You have to talk to like Julian or that other lady. They are doing more compliance shit now like, "Is this legit? Do you have developers?--

**Synth**
\-- \[laughs\] "Do you have developers, do you have a blockchain?" Most of these coins don't--

**Christian**
\--"Oh you do have developers. Is it a security? Oh it isn't a security? ok. Oh you guys actually have a blockchain? ok." You could also try the um.. I could put you in touch with the guys in charge of the exchange in Switzerland. There's not a lot of liquidity on it yet but that's a solid fucking team behind that. That's not a bullshit squad. I mean let me look up the volume on the exchange right now.

**Synth**
Oh and they're pumping the volume on these exchanges. For some of these exchanges to keep their ranking in the top 20, they are doing a lot of wash trading. Like I see it, and they are just using bots trading back and forth between each other like a million times a second.

**Christian**
I have guys that want to setup arbitrage so bad. It's nothing to move the money, like moving money from the US to...

**Synth**
The fees are ridiculous too, like the .1% fee. If you have a million dollars of volume, you are paying tens of thousands dollars a day for a million dollars. And it's on both sides because the buyer pays the fees and the seller. So if you are doing ten million dollars a day in volume, that coin is paying twenty thousand a day on the exchange. So the exchange not only wants $250,000 to get listed, but they want us to pay them like $20,000 a day for volume basically. I'm like fuck that I could just buy like 3 houses.

**Christian**
Yea exactly, I mean there's the guys at Bithumb.

**Synth**
Yea I like Bithumb.

**Christian**
There's HitBTC that came out of nowhere. They really stepped up their shit.

**Synth**
Is that real?

**Christian**
Yea I think, maybe. Who knows dude lets be real. I can't talk shit if I don't fucking know em. HitBTC is there. Um Kraken.. I mean you're just dropping down from there. Why don't you talk to the guys at Liqui?

**Synth**
Liqui is good yea.

**Christian**
Liqui is not terrible, like eighteen million dollars a day that's good.

**Synth**
We are doing this OTC thing for Fiber so when the coins launch on Fiber, that coin is going to be liquid and traded from day one. They are going to trade their coin and five minutes later they are going to have an order book. These coins like, they raise one hundred and fifty million dollars in an ICO and they cannot get listed on any exchange at all. It's retarded.

**Christian**
Yea I mean I did message Bill one day and I was like how much does it cost to get listed on Bittrex like 40 Gs? He was like, "No, we don't fucking need your money, we need you to be fucking legit so our ass is covered." Like that's where I think it's going, the guys running these exchanges have so much money now.
These guys are running Bithumb like how much fucking money do you need. "I've got five hundred million dollars cash" like alright dude chill.

**Synth**
Look at their volume. If their volume is real and they are getting .02% on each trade on the bid and ask and their volume isn't fake. I think that they are rebating the fees for special accounts and institutional investors and they lie and say that they aren't doing that. But if you take the volume and like a billion dollars, and look at the fees they would pay if the fees are actually paid, then you have this exchange that's making ten million dollars a day. It's like this four person exchange is not making four million dollars a day. I think the volume is there just to get the smucks in to buy. Like, "Oh look at this volume, people are trading! Buy this!" For some of these exchanges like HitBTC, if you don't have volume, they have a volume expert and you can go to this guy... like I talked to one of these guys. Not the one from HitBTC, but this was very funny. He wanted three million dollars in coins and all he does is just sit there and day trade on the coin and create volume. I was like, "Why would I give you three million dollars to sit there and day trade?" And he was like well that's what the other coins are giving him so he wouldn't do less than that and he has like four people asking him.

**Christian**
That is fucking insane dude.

**Synth**
\[laughs\]

**Christian**
It makes complete sense but like what the fuck are we doing out here guys. Of course this shit happens, like duh, but it's just like. I would fuck up the trade so bad like, I'd make the price go down 80%.

**Synth**
\[laughs\] Yea just like dumping em, and he probably wants a kick back from the exchange for the volume fees. Like, "I'm giving you ten million dollars in volume, how much are you giving me?"

**Christian**
That's actually a good point though. It is curious how some of these coins have so much volume. Like $26,000,000 in volume, like Vertcoin.

**Synth**
Yea Vertcoin, my favorite coins is Veriteseum. This guy created four hundred million coins and put them in his pocket, then he gave like 2% of the coins out to the community and he gets an exchange to list it. And he's like, "Look I have four hundred million dollars of bling!!" He's really cool, but it's just funny..

**Christian**
He is a cool guy. I did an interview with him and he sounded pretty knowledgeable. Everyone I've talked to about that project says it's a scam like look at the website.

**Synth**
He knows how to play the game though. Like we could do that, "Oh look Skycoin is sixteen billion dollars!" You just create a bunch of coins and then trade them back and forth between yourself at like $3. It's like "Ohh look we have thirty billion dollars." I mean that's what Ripple does and these other coins.
If you can create a huge number of coins and then not distribute them, but still get coinmarketcap to say they are distributed. With Skycoin, we get a lot of shit because of the distribution number. We didn't say it was 60%. We could say it was 60% and nobody would complain but that number is actually accurate in calculation. Whereas some of these other coins, they release billions of coins supposedly, but actually the community only has one hundred thousand coins to trade on so their market cap gets blown up by like 600x. They have to pay people to do the volume or else they get delisted off of coinmarketcap.

**Christian**
I mean there are so many coins. They don't have any tangible shit behind it. They don't have users or anything it's just a fucking coin. Once the volume goes sideways its going down and I'm telling you it's not going back up. You better fucking get something going or it's done. I know so many coins, like Numerai. It was $150 now that shit's at $12. It collapsed by like 15x. If you bought at the fucking top, you are fucking completely done.

**Synth**
I like ByteBalls. There are some coins that have developers and they might not know what they're doing, but there are like five coins that have developers and they all fucking blow up from like one penny to $700.

**Christian**
Well ByteBall was actually a fair distribution.

**Synth**
Yea they did a really good job.

**Christian**
That shit, people just speculated it like way too high. It went up to like $900 and now its like $200.

**Synth**
I got it at $.10 \[laughs\]. It was at like $700 and I was like "Yea!!".

**Christian**
Yea when it hit the exchange it was trading at like $50 so if you sell at $1000 you cannot fucking complain like.. and you can stake those right? You just lock them all up and run.. I sold all of mine but.

**Synth**
So if you look at these coins that have actual applications and they have actual users and a real user community and you buy them early you can't lose money on them. Their communities are growing like 3% a day, 5% a day and the price eventually reflects that. The Skycoin telegram. We had 100 people in our telegram like a few months ago and now we are near 1,000. We just got fifty people in the last two days and its growing like 3% a day. It's been growing like that for years but you just start out really small. When you have ten people and you get 10% a day you only get one person but it's 10% growth. And eventually you have 1,000 people and you are still getting 1 or 2% a day and it continues for years. That's what we saw with Litecoin. The coins that were really successful they grew at a constant rate over years, like four or five years and then the price for no reason goes from a penny to like $50.

**Christian**
I mean let's be real though it only takes like three or four whales and a couple coordinated moves and they can really move the whole market.

**Synth**
Yea

**Christian**
That's what happened with Ripple.

**Christian**
Same thing with NEM. Somebody told me to buy in February. They said it was going to go to a $1 and it didnt go to $1 but it fucking went up like 20x like alright dude.

**Synth**
Ooh another thing that I look at when I'm investing um, I look at do people actually have the wallet? So I was talking to this Ethereum whale and he had like $300M in Ethereum and I asked him what Ethereum wallet did he use. I needed an Ethereum thin wallet because I didn't want to download this huge blockchain. I asked him what wallet he was using he was like, "I don't know." Like what do you mean you don't know? You're a freaking Ether whale. I talked to another user and it was the same thing, so if you ask these people like... they have this coin most of the users do not community even have the wallet. Their coins are sitting on an exchange waiting to get stolen and they never install the wallet for that coin. It's just incredible.

**Christian**
I don't hold any coins on the exchanges unless like... right now the Dynamic blockchain is down so they are storing them on their central server. So you're storing them with Duality or you are storing them on the exchange but thats it everything else fucking stays in cold storage dude. You have got to move your shit to cold storage guys.

**Synth**
Yes. But how can you have a cold store for like 300 coins? I can't even deal with like four wallets. Like how do people?

**Christian**
I mean the Jaxx Wallet. They are putting out an update which will work for like sixty coins soon.

**Synth**
I think we are going to get on there. Some guy messaged us about that. We have to follow up on that.

**Christian**
I mean Exodus is pretty good. I heard the security on Exodus is better.

**Synth**
Is that the Louis Vutton one?

**Christian**
No I mean Exodus is legit ummm.. and then like you can get a Ledger. You can store only a couple cryptos on a Ledger though, but Ledger is good because it's hardware. What you could also do... have you ever seen that cryptosteel shit? It's like a block of fucking--

**Synth**
\--Yea I love that thing. I want to go to the airport with that. \[laughs\] Like, "what the fuck is this??"

**Christian**
Like, "What is this?" It's a fucking piece of metal they'd be like, "Yea ok you can go through with this..." \[laughs\]

**Synth**
Yea like sheet metal. It's like $200 right?

**Christian**
Yea my friend was like thats some real cypher shit right there like some 1990s shit.

**Synth**
You got the Hex one and you have the numeric--

**Christian**
\--So thats what the Royal Mint that's what they are going to be using. If you have an account with RMG, they give you a cryptosteel and you put it in their lockbox in their vault. It's so legit dude. That's the fucking future like you go in and you cant rob the fucking vault because they are all fucking crypto steels dude.

**Synth**
You want to do like an interview series every week? Or every month?

**Christian**
Yea we can. We can do it biweekly or weekly. It just depends. If the guests are hot, or if there's hot news, or if you just want to talk bullshit and bring developers on or.. really anything we're here.

**Synth**
Yea, like what are we on an hour and forty?

**Christian**
Yea we can slow down. We can cut this off in a minute. I don't really see any questions in the chat. A lot of people came to support. There were like twenty people watching, which is pretty cool.

**Synth**
That's great. Yea so besides Skycoin, we have a bunch of coins. Spaco is really interesting. They're doing like a filecoin but it's based Skycoin and our CXO and it runs on Skywire. So the people get Spaco and they get Skycoins for running this thing. And then the Solarbankers and then we are actually talking to a company in Mauritius and they are a huge forex site. They have like meta trader four and these people... they are even more hardcore gamblers then these altcoin people. They are just like Forex, like 400x leverage trades on currency pairs and we are going to do a coin for that Forex exchange. With the profits from the Forex exchange, about half of them are going to go back to the coin I think. I saw some coin that was trying to do derivatives and they tried to raise like a billion dollars, so I'm wondering if these guys are going to do a hundred and fifty million dollar ICO or what, but we have some pretty interesting coins signing up now.

**Christian**
Cool. I mean that's what you need right. You just need some volume in and then some cool shit to back it up. Once you have the financial framework down then you can just add like the fun stuff to it right.

**Synth**
Yea.

**Christian**
Cool.

**Synth**
You want to end it?

**Christian**
Yea, this is an interview with Skycoin. Synth, I guess will be back at some point. We definitely have some cool shit to talk about. Well it was a pleasure having the interview.

**Synth**
Yea this was great.

**Christian**
Cool, alright and we're out, we're gonna sign out and end it here. Uhh I guess we'll be back whenever.

**Synth**
Is this on Youtube or?

**Christian**
Yea its gonna go right to Youtube. It's already on Youtube so.. cool, alright I'm gonna end it now guys, later.
