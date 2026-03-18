+++
aliases = ["/development-updates/development-update-108/"]
date = "2016-10-12"
draft = true
tags = ["Development"]
title = "Website, White papers and Blockchain Explorer"

+++
##### We want to have everything done for the coin in three weeks:
- The three white papers
- The website
- The CLI and WebRPC listing
- The blockchain explorer interface in the wallet
- Exchange listing
- Full consensus implementation
- Easy way for people to buy and sell coins

##### The critical things are:
- Website
- CLI / WebRPC
- Block chain explorer in wallet

Everyone agrees that getting listed and completion of the coin is a higher priority than finishing the apps.

###### There is a debate about whether we should:
- Start marketing before demonstration applications are ready
- Start marketing after demonstration applications are ready

###### So the time line looks like:

## A:
- Completion of website
- Completion of CLI and WebRPC interface for exchanges
- Completion of blockchain explorer (API is done, just needs front end)
- Get listed on small exchange for testing API or internal exchange

## B:
- Add more documentation to the website (Roadmap, Infographics, technical documentation, feature list, API usage documentation)
- Publish the three white papers (one paper for coin, one for meshnet and one for consensus. On top of the three white papers that have already been published with the network simulation. Then will have other white-papers about our DHT network and public broadcast channel, but can do those later)

## C:
- Start marketing on coin?
- More exchange listings over time (The marketing people want to do the exchange listings over time instead of all at once).

## D:
- First applications (we will expand and put together application teams)
- The first app will be the meshnet node, which will not have any applications built on it yet but will let you connect to someone by public key (similar to CJDS)

## E:
- The second thing will be a VPN client built on the new networking namespace
- Peer-to-peer replicated, self-hosted, distributed file system (like IFPS)
- Then we will implement TOX like messaging and go from there

## F:
- Build out user and development community (dedicated communication channels and platforms for coordination).
- Supply resource to the third party developers building applications on top of the platform

## G:
- Planning tools for physical mesh deployment
- OEM hardware suppliers, antenna suppliers, tools for mass scale deployment, provisioning
- SDR experiments and pluggable transports for different hardware platforms

## G: (Continued)
- CX (our blockchain applications platform)
- We need this because we have multiple applications and need to standardize deployment provisioning, user interface, security sandboxing, standardized machine readable RPC, deterministic builds, service discovery, etc (a mesh node, a network namespace, a file system, messaging, a VPN, per customer blockchain applications, third party applications, then another level of applications building on the lower levels).
- Deployment, provisioning and analytics for large scale deployments.
- This will probably be like an app store for Skycoin golang apps initially. I think we can ship a runtime and compile apps from source on site for each platform and user. We can also enforce security sandbox on which modules and imports are allowed.

I think we will do A, then do [B,C,D] at same time and start on [E,F,G].

We need to figure out how to communicate what we are doing.

We should get a roadmap on the website.