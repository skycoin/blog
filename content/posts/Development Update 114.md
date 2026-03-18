+++
aliases = ["/development-updates/development-update-114/"]
date = "2016-11-04"
tags = ["Development", "Skywire"]
title = "Community, Website and Skywire Update"

+++
## Summary:

* We need to fix the GUI on the dev branch.
* We need to debug the CLI (command line interface, for exchange))
* We need to get the WebRPC (for exchanges)

### We need to start building out the community.

* Need a chat room
* Need a forum or BBS
* Need a messaging system

### We need to get the three white papers done and the website:

* Coin / Consensus Paper
* Meshnet Paper
* Aether Paper

### Things we need:

* We have to decide if we will float and do the first market internally or use a third party.
* We have to get the roadmap up on the website.
* We have to create the third version of the website.
* We have to get a windows installer (to install under program menu)
* We need to do ansible and docker, build/installation automation scripts.

## Skycoin Website:

The website is a flat file. No-script (no javascript).

This was first version of website, which was visually unacceptable.

![](/img/dev-update-114-1.png)

### Second version is much better.

![](/img/dev-update-114-2.png)

### In the third version:

* Will be stripped down (fewer text, fewer icons, nothing that is not needed)
* Will be focused on directing the user to the wallet download or to the roadmap and infographics
* Links to wallet download, white paper, github, roadmap (infographics)
* Remain very focused on why user is at website and what they are trying to do. With very little text/icons to distract them

## Aether: Skyhash

This is the new internet

### The first version of Skyhash/Aether is done:

* https://www.youtube.com/watch?v=fXD_rdwoKsc
* https://github.com/gagliardetto/skyhash-pub-sub
* https://github.com/skycoin/skyhash
* A person takes their public key and publishes content
* The content is replicated peer-to-peer to all subscribers to the public key

There are no servers. It is completely peer-to-peer.

### This can be used for:

* static websites (shops)
* IoT pub-sub channel
* DNS (looking up public keys, by human readable identifiers)
* caching static content
* blogs
* twitter
* image boards
* building TOX like communication system
* server orchestration
* replacing Bitorrent/IPFS

We trying to get a developer to work on the content browser for Aether.

Instead of going 120 hops in the network, to get data. It will just get the data from whoever is near you that has copies.

* in the current internet, if a content publishers server is in Los Angeles and the requester is in Hong Kong, ever content request and packet will go from Hong Kong to Los Angeles, for each request.
* in Aether, the first copy of the data goes from Hong Kong to Los Angeles, and each subsequent copy can be served from a local content cache or another user

This is also called "Content Addressable Storage" or "Source Independent Networking".

For instance, a file is requested by the SHA256 hash of the data contained in the file. You do not care where the file is downloaded from, as you can verify the contents of the file once it has been received from any source.

If you are using 100 MB/s over 100 hops of fiber (going through 100 routers). You are using 20x the network resource usage, as if you are going through only 5 hops

* resource usage is number of hops times bandwidth usage per hop

So by pushing content to the edge, the aggregate network resource usage is reduced and latency is reduced.

This also enables Multi-cast and enables a higher level of network redundancy (automatic geographically distributed content mirroring).

The next generation HTML, websites, services, social media and video streaming will be built on this principal. The existing model of a CDN is an intermediate stage of the evolution of this type of "EdgeNet". The military, commercial and home IoT and the next generation of "cloud" services will largely be enabled by networking protocols designed on these principals.

We have our object format and serialization format defined and are starting to integrate it into Aether.

We are building the skycoin consensus and block distribution on top of this model, because of the security and speed advantages. It also has the advantage of being a simple three packet protocol.

## Aether: Tox-like messaging

Aether at the basic level, enables cryptographic, peer to peer replication pub-sub channels.

We can take two public keys

* Have pubkey A subscribe to pubkey B's pubsub channel
* Have pubkey B subscribe to pubkey A's pubsub channel
* A publishes a message to B
* the message is replicated peer-to-peer to all subscribers to pubkey A
* B receives the messages
* B publishes an ACK into their message stream, confirming that they have received the message from A

### So we now have a two way channel:

* Can be used like Bitmessage
* Can implement Tox like messaging
* Can implement a cryptographic ratchet
* Can implement asynchronous messaging (for configuring servers, SSH, process monitoring, status monitoring, etc)

The implementation is completely in golang, so no buffer overflows.

### The messages are stored, by everyone replicating the public key

* So if a server is offline when the message is published, when the server comes back online, it will receive the message
* If the server is online, it will receive the message instantly and will see response

This is a very powerful messaging primitive. Especially when you have mobile devices or an unreliable network that is going on and off. This type of network can deliver messages, even over latencies of minutes, hours or months. It is

* Source independent
* Synchronous
* Scale invariance in time

### For instance,

* You can put a node on a ship sailing between japan and new zealand
* When the node on the ship is near japan, it will drop off new messages and get new messages for any pubkeys the node is subscribed to.
* Then when it sails to New Zealand, it will drop off the messages and grab the latest messages
* It will still operate automatically, to distribute blogs and tweets, even if the internet cables are cut and the satellites have been shotdown and it takes two months to send a message back and forth. Only a single copy of a blog posts or static data needs to enter the country, to be replicated peer-to-peer.

The latency can literally be days or months and the protocol still operates reliably (scale invariance in time).

Also, all applications built upon the distributed object store, will operate automatically offline with no additional coding

* Google maps works while you have internet
* When you lose internet, you no longer have a working map
* When a map application is run off of map data in the asynchronous, distributed object store there is no difference to the application between being online and offline. You can cache the map for a whole country locally and it will operate the same regardless of internet connectivity.

I think this will find a lot of applications for drones (drone swarms, mobile communication nodes), satellites, mobile devices (cell phone applications), IoT or mobile networking.

## Meshnet

The data channel and control channel is separated now. We have three things left to do, before its working again. It could be one or two weeks, before the full stack is working end-to-end.

I think we will have someone get the VPN application working again, so that we will have at least one useful application to run over the network.

The long term goal of Aether is to create content and website that are internal to the network only.

### Aether will look exactly like IPFS

* there will be a content browser
* you will put in a public key, then slashes, to navigate to content example: ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme
* then it will find peers and fetch the content

## Roadmap:

Our application stack is
Skycoin + Skywire (Meshnet) + Aether (Skyhash) + CX (application language)

We almost have the coin completed. Then Skywire and Aether in development/demo state.