+++
aliases = ["/development-updates/development-update-133/"]
date = "2017-06-13"
tags = ["Development", "Skyminer"]
title = "Skycoin: Introducing the Skyminer"

+++
Update:

## Comment:

Quote from: **hannusolo** on June 12, 2017, 07:55:31 PM

>Regarding tha subject, how much compute power and memory would these nodes require? I saw the renders on telegram about the proposed hardware node, but I have a mining pc that has a mostly unused cpu and memory, thinking about a little upgrade on this side in the future.

## Response:

Many hacking firms, used to take over peoples computers so they could put adware on them or build up a botnet, or do clickfraud to make websites look like they were getting more views than they actually are.

Today, they are hacking computers to get the bitcoin.

Every AMD and Intel processor has a remote management backdoor, that is essentially unpatchable and which is being exploited in the wild now. Even USD and SSD firmware is getting hacked and weaponized (BadUSB).

All of the consumer routers are made by a small number of firms (the chipsets and firmware) and government backdoors and clandestine backdoors. There are +40 OEM manufacturers but the firmware and hardware is actually just white labeled and done by less than 3 firms.

So Altcoins (including bitcoin) have already reached 80 billion in marketcap and are on a trajectory to reach 8 or 10 trillion.

However, most of the exchanges and users are going to be looted and have their coins stolen in on way or another, on the way to 10 trillion. The security level right now is really pathetic.

"Wallet Encryption" is not even an option, because any software that can grab your wallet is also going to install a key-logger and wait until they can get your wallet password.

Companies are already bundling their software and operating systems with built in key-loggers masquerading as "analytics" packages and selling everything you type to third parties. Even GPU manufacturers are starting to ship drivers with built in key loggers, to collect more data for sale. In the US it has been legalized for ISPs to intercept and record all of your internet traffic and search history and sell it to everyone they can get money from.

So over time, users who want any degree of security or privacy are going to migrate towards dedicated hardware products and everyone else will have to deal with having all of their stuff stolen or looted constantly.

---

So these boards are
- 4 CPU cores per board
- ARM processor (no intel/AMD and no remote management engine backdoor)
- 2 GB of RAM per board
- 32 GB to 256 GB flash storage per board
- standardized, high security, minimalist linux
- no glibc, no SystemD, no known backdoored libraries or libraries with a history of exploits
- a single process or daemon per board (one daemon, one computer, hardware segmentation for security, so that if one service is compromised, it cannot compromise other services on the same machine)
- OpenWRT router with strict packet forwarding rules and access control

A typical setup would be 4, 8, 16 or 32 boards
- 4 boards would be 16 cores and 8 GB of RAM
- 32 boards would be 128 Cores and 64 GB of RAM

---

The primary applications for deployment on these types of clusters are
- Hardware Wallet (deticated daemon for coin storage)
- CXO Daemon
- Skycoin Node
- Skycoin Consensus Node
- Skywire Node
- Skycoin VPN (Hardware VPN, VPN with dedicated hardware box and a cable, not just a software VPN)
- Skycoin DHT, etc

---

![](/img/dev-update-133-1.jpg)
![](/img/dev-update-133-2.jpg)
![](/img/dev-update-133-3.png)
![](/img/dev-update-133-4.png)
![](/img/dev-update-133-5.png)
![](/img/dev-update-133-6.jpg)
![](/img/dev-update-133-7.jpg)
![](/img/dev-update-133-8.jpg)


This is being built now. Because we have too many daemons and things that need to be running for the system to work, so make senses to have deployment and orchestration framework and a cluster configuration. We need a plug and play, zeroconf solution.

We are building one 8 card unit (32 core, 16 GB of RAM) for marketing/PR/Press Release.

Then building six 4 card (16 core, 8 GB of RAM) units for a test net for Skycoin/VPN.

Then we want to start shipping units (probably through third party) and have several hundred units distributed globally to act as the backbone of the network.

## "Skyminer"

Skycoin does not have "mining" for block creation and there are no "miners" as far as the blockchain goes. However, Skycoin has a surrogate and substitute for mining, where people can get coins and this is Skywire.

This hardware and cluster configuration is what the first Skycoin "Miners" will look like.

This can be used as a "Hardware VPN" and you can plug it in and VPN the whole traffic through your house, or run Skywire or CXO nodes for coins.

The Skycoin network itself, will be running on its own private, internal internet, with its own namespace. On dedicated hardware.

This hardware configuration allows us to extend it later, to support physical wireless mesh networks, build on top of the Software Defined Networking standard. You could even run the nodes/clusters on top of Ham Radio.

CXO is a peer-to-peer replicated, immutable data object store. With self validating data objects. It is very similar to Urbit's networking design and content addressable storage.

Each local CXO cache is supposed to hold all of the data and programs, needed for the operation of the cluster, without using external resources from the internet. When you download a file, you are actually just copying the object into your local cache. Then other peers looking for the object can grab the object from you and the objects can be passed and replicated peer-to-peer because they self validating (the identity of the object, is a hash of the []byte serialization).

So this is a practical, immediate thing for getting the Skycoin VPN and Skywire network up and running. And it is a longer term, stragetic thing to enable things that we want to do in the future.