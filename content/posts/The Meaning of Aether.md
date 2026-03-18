+++
title = "The Meaning of Aether"
tags = [
    "Decentralization",
    "CXO",
]
bounty = 5
date = "2017-09-25"
aliases = [
	"/statement/the-meaning-of-aether/"
]
+++

*This is an archived post from the bitcointalks thread on May 05 2014*

*Aether's original design has evolved into what is now called CXO*

*Quote from: **Tobo** on May 04, 2014, 02:11:12 PM*
>I noticed that you previously used the name of ether which was used by
Ethereum. Now you changed it to aether which has been used by some other
people at this forum. Why did you like these two names so much?

Ether permeates space. Then we found out ether is alcohol that people snuff to
get high and aether is the mystical substance that permeates space.

Its called Aether because the data does not exist on a server. It exists
collectively throughout the internet (or at least the subscribers). Once
published, it cannot be destroyed. There is no central point, there is no
server that can be seized. The publisher cannot be located or tracked because
once the data is published, they are just a peer.

Its a perfect system. There is one type of Skycoin address and its is an
endpoint for a datastore or a pubsub system. There is another type of Skycoin
address and it holds coins. There is another type of Skycoin address and it is
a node you can communicate with and send messages to.

You generate a pubkey, which hashes to an address and that is an ID. The
address replaces IP addresses for identifying a device or computer if its used
for communication. It names a datastore (just like a magnet link is a hash of a
torrent file and name the torrent) if its used for a datastore. If the
datastore contains a filelist and a hash list for chunks in the files, then
its just a torrent that people can update. If it names a Skywire node if its
used for communication, like an IP address names a computer.

So if you wanted a create a distributed twitter with Aether, you create a
pubkey. You publish updates to your key value store and sign them with your
private key. Each key in the keyvalue store is a number incremented each tweet
and the body is json for the tweet.

You give someone your pubkey hash (an address) and now they can download and
replicate your feed. They can pull in the feeds of everyone they are
following. They can run their own filtering algorithms locally for ranking
things in the feeds they are subscribed to and choose their gui. Its a
website, but its a website running on your computer and its running from data
you have a copy of.

You are not downloading the feeds you subscribed to from a server, you are
downloading them from other people who are subscribed to them. Its completely
decentralized. Its pubsub, its a communication channel, its a key-value store,
its an RSS feed, its a document oriented database (if you are storing JSON),
its an updatable torrent if you are storing file lists and chunk lists.

This innovation, this data structure is as powerful as the blockchain. Its as
powerful as DHT. It is a core component for the next generation of
decentralized systems.

Aether is a mystical element that permeates all of space and I think its
appropriate.

In Tor, you can identify the path to a service through traffic analysis by
looking at variation in latency for traffic and correlating them to latency of
other traffic passing through the nodes. Requesting pages is slow because you
have to go through multiple hops. Here the replication is peer to peer. There
is no "center", there is no "server". The webpages are instant, because you
are not requesting the data but have a full copy of the data locally. You are
generating the webpage from the database.

In the internet of things, you have an LED lightbulb. You want to set the
lightbulb to red. The lightbulb has an IP address and its connected wirelessly
to your house. You move the light bulb and it has a new IP address, so you
cant find it or send it messages. IP addresses are not "ids" for devices, they
change as the object moves and accesses the network over different endpoints.
Skycoin gives devices or applications "names" that are network independent.
This is the function of DNS, to take a name and resolve a server or IP.

The lightbulb has a Skycoin address and you can send messages to the address.
You can say "turn red" or upload a new program to the programmable LED
lightbulb. Skywire automatically figures out how to find a route to the device.

Additionally, when you are running a Skywire Mesh node, the node may be
connected to four wireless networks and a router. The wifi node has five
different IP addresses. An IP address no longer uniquely identifies the node.
An IP address is merely a path to the node. The IP addresses on the router are
often not even public addresses because of NAT.

The set of computers you control, your desktop, your tablet, your two laptops.
They form a personal cloud. Each device has a Skywire daemon and a node
address it can receive communication to. You have application servers running
on your cloud. For instance you may have several storage application servers
(which expose a volume of a drive as a network file system, like Dropbox). You
might have application servers such as web servers or email servers.

So the idea of the mythological "Aether" reflects the vision with what we are
trying to accomplish.
