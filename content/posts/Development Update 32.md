+++
aliases = ["/development-updates/development-update-32/"]
date = "2014-07-14"
draft = true
tags = ["Development"]
title = "Development Update #32: Node Routing and Altcoin Governance"

+++
## Summary:

For routing, we will have each node report traffic statistics to central server. Then we will aggregate the statistics and publish them. Then "Route Discovery Servers" will download copies of the data, compute optimal routes. When a client wants a route, it will ask a route server and get a route. So the route discovery service is like a DNS type service.

The route discovery servers can use machine learning, big data, linear algebra, ant colony optimization, electron flow routing, whatever it needs to compute the routes. Different people will create route service implementations and benchmark them. Individual users will choose the route servers they use for their node or they can use a default server.

This is highly centralized, but it gets the ecosystem started and it gets it working very quickly.  Eventually, there will be too many nodes for the server to fit every node in memory and then system will fail and have to be replaced. We would like it to be 100% decentralized and eliminate any reliance on special "service" servers. However, it would be impossible to build the system fully decentralized at launch without pushing schedule back several months.

For mobile ad-hoc networking, we are doing breath first search. Most meshnets will have three or four hops to internet. We do not have to worry about ten hops at the start. You really have the local nodes (maybe setups with 3 directional antennas fanning out over area), then you have the "long haul" point-point directional connections. You could spend six month designing an algorithm for routing over 10 hops in an ad-hoc wifi network, but the performance and latency would be so horrible, why would you do it?

Also, at startup there will be no meshnet nodes. So the network will just be running over IPv4. You can still do things on the darknet and run applications and that is important. There will be applications people want to run on the darknet, even before a physical meshnet is built out. For those users its just "faster TOR".

We cannot solve all the problems end to end. We have to get it working and deal with each issue as they come up.

## Implications for Aether

Some of the software we are building is very radical and only tangentially related to the coin. We have no idea what developers will do with the distributed application infrastructure libraries, but feel that it will enable developers to rapidly build applications on the darknet and that these applications will drive adaption. The ideas behind this software (Aether) is so new that it will take a while to understand its importance. Dark Market and half a dozen projects sprung up immediately around the same idea and we are providing it as a library and application platform, instead of building it for a specific application.

We built software for internal use and then that software was refactored into libraries and then our applications built on top of those libraries. So far we have
- Standardized cryptographic and hashing primitives and key storage (private key, public key, address generation, signature generation and verification, ECDH encryption)
- Standardized communication libraries (ability to connect to nodes over darknet via the node's public key)
- Standardized data serialization, messaging and service oriented application framework (soon with machine readable RPC interface)
- Standardized distributed document oriented datastore
- Standardized functionality for generating client side application frontends using Angular.js from data in the distributed document oriented datastore

## Long Term Implications

We already have exchanges such as coinedup which are altcoin only, but are still running on single server. I think we are in good position to have a multi-coin wallet and that it will be very quick for someone to develop a distributed altcoin-to-altcoin exchange on top of the Skycoin service infrastructure.

This means you will be able to have any type of coin in your wallet and be able to instantly convert between coins. So if you have Dogecoin in your wallet and a merchant takes Bitcoin, you will be able to just say "Send 0.5 BTC" and instantly convert at the spot price. People will stop thinking of the coins as being different and it wont matter too much which coins a merchant accepts.

Ethereum is positioning itself to take advantages of cryptoequities and displace the Mastercoin niche. Skycoin is aiming for a large consumer market, but if that fails will have a good position as a reserve and position with respect to coin standardization and interoperability for the community currencies.

## Altcoin Governance

We are also seeing new models. Some coins are trying to generate income from services and then reinvest that back into growth. That is a more sustainable model than buying into a mined coin like PeerCoin or Dogecoin and then promoting it (essentially a pump and dump model). You have coins that will be run as businesses on an on-going basis.

Then there are issues with corporate governance that future coins must address. The Bitcoin Foundation is a complete failure. Maintaining, marketing and improving a coin requires money and requires an organization but Bitcoin does not have a mechanism for funding or managing such an organization. In a well run coin, the coins go to the people who create the most value for the coin stakeholders. I want to see something like a 1% inflation and proof of stake elections for officers/managers and allocation of funds to individual project teams.

Miners and speculators do not actually create any value for a coin. They do not do anything to increase the intrinsic worth of coins, where as people doing marketing or developers improving the coin or designers improving the usability of the coin increase the value of the coin. The current model, is buying up a mined coin, spending your own money to improve it, market it, pump the price and build momentum and then dumping it (Dogecoin, Ripple, PeerCoin, Litecoin). This is not sustainable and the incentives are not aligned for the long term success of the coin.

We need innovation in corporate governance for altcoins. We need mechanism for funding activities to improve coins and market them. We need protection for stakeholders. We need to get rid of miners. Speculators are fine, as long as they are active in promoting the coin but passive speculators do not add any value. Miners subtract value, in that they are receiving new coins, but are not contributing to the success, improvement or adaption of the coin.

Skycoin's model is not perfect, but is the best we could do with existing software. The perfect form of altcoin governance will require a lot of work to implement and is something we have to keep working at.

The Ripple model is interesting. It can work very well if the developers are not idiots and can be trusted, but it relies upon the developers not destroying the coin over a petty personal dispute or turning the coin into a get rich quick pump and dump. It requires a level of restraint not to take back room deals that undermine confidence and a level playing field.

The ideal coin would have proof-of-stake community elections, so the developers can be replaced. It would have inflation to fund marketing, development projects and pay developers. It would have mathematically enforced developer vesting (coins over time) to prevent developer pump and dumps. It would have community proof-of-stake elections of the foundation and development team, so people could be swapped out for more competent people or removed if they become corrupt.

We are heading in that direction, but requires more software and not something we can put on the roadmap yet.