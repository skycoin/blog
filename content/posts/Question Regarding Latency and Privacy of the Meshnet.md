+++
title = "Question Regarding Latency and Privacy of the Meshnet"
tags = [
    "Ask the Developers",
    "Skywire",
    "Privacy",
]
bounty = 4
date = "2017-08-18"
aliases = [
	"/ask-the-developers/question-regarding-latency-and-privacy-of-the-meshnet/"
]
+++

*This post refers to Skywire earlier on in its formation, before it was named Skywire. Adapted from a bitcointalk post dated August 09, 2014.*

Quote from: **CraigM** on August 09, 2014, 07:20:24 AM

>The meshnet is intended to be a nice privacy tool with benefits comparable to tor, but lower latency correct?

>The meshnet is intended to allow funding nodes via micropayments in skycoin to cover bandwidth costs correct? Doesn't this leave force all node operators to record detailed and published logs (on their personal block chains) describing all the transactions which inherently correspond to everyone who send data through their node? This seems like it would allow any third party to do traffic correlation attacks much like the ones on tor, except you don't need access to the connections. Even if they don't end up being publicly inspectable, logging everything seems like it might have some real issues (it can be requested by law enforcement, and takes up a lot of space)

>The initial version is going to ship with centralized route finding server correct? This means if you want to connect to someone, you have to tell a third party about it, correct? It seems like this is not a Tor like privacy service until that's fixed. Is there reason to believe you will find a solution to this soon (or ever: its hard)?

>How do you find a route to this trusted third party which will do route finding for you? I assume you will just special case it (don't use sender side route selection), but I'm curious if you have another design.

## Response

Yes. It is actually faster than TCP/IP. ISPs do "hot potato" routing. The latency should not be worse than TCP/IP and in theory can be faster.

**The privacy guarantees are**

- each node only knows the previous and next hop
- transmission between nodes is encrypted
- transmission is encrypted end-to-end
- your transmission is protected against man-in-middle attacks through the use of public keys for node endpoints (network addresses are public keys on the network)
- all encryption is deniable and ephemeral
- the protocol is designed to frustrate attempts at deep packet inspection to identify users running the protocol (no fixed ports, no known plaintext in wire format, fixed node connectivity for backbone and so on)

So it is like a very low latency TOR with micropayments for bandwidth.

- It is more secure and has higher privacy than HTTPS
- it is faster than TOR and scales but there are still attacks against it.
- the code is much simpler than TOR, so there is less room for backdoors or hidden vulnerabilities. There is only one external dependency in the whole implementation.
- If you need absolute security against timing channel attacks, you should use a mixing service or run Bitmessage on top of the darknet
- all low latency networks are subject to timing channel attacks


## Route Servers

Yes route servers are a weak link. For maximum privacy you should run your own internal route server.

However, if you do use a public route server, you are connected to it through several hops, so it cannot identify you. It would still be safer to run your own.

## Handling of Micropayments for Bandwidth

The way micropayments are handled, is through a third party. The node connects to a "**gateway**", deposits a coin with the gateway to get a credit. The node can now generate pseudonymous 64 bit "addresses" with the gateway. The gateway does not know the identity of the connecting node. It only knows the previous hop the connection came through.

So if you establish twelve connections to the gateway, they look like twelve different users to the gateway. Eventually communication to the gateway will be over an asynchronous messaging channel.

The node forwarding the bandwidth, connects to the gateway also. The two nodes can now pay each other through the gateway, without the gateway knowing the identity of either of the two nodes. When a node has enough coins in credit (a full coin), it can generate a new Skycoin address and withdrawal the coin to that address. Gateways are only handling small amounts of coins

A gateway in the Skycoin protocol is any server that holds coins or account balances on behalf of 3rd parties. Gateways are deposit institutions and they have their own protocol and API.

**Eventually,**

- there will be multiple gateways and cross gateway coin transfers. These transactions occur in private and do not appear on the blockchain until you withdraw the coins from the gateway.
- messaging with gateway will occur through an asynchronous communication channel (each message steam will get a new pseudonymous identity)
- part of the gateway protocol is an OT implementation, which allows you to prove if a particular gateway is stealing coins. You sign each API call to the gateway, then gateway executes and signs the output. So there is a chain of linked signatures and transactions and the gateway cannot make coins disappear without being able to forge your signature. If you deposit coins somewhere and they disappear, you can publish your transaction log and then the owner of the accused node has to produce a log showing that you authorized the coins to go somewhere. If they cannot produce a signed API call, then it proves they are lying/dishonest.
- Eventually exchanges will operate under the gateway protocol

Your suggestion of having a public blockchain for the internal balances in the gateway is interesting. I think putting the internal transactions on a public personal block chain, could keep exchanges honest while still maintaining user privacy.
