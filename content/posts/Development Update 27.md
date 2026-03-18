+++
aliases = ["/development-updates/development-update-27/"]
date = "2014-06-23"
draft = true
tags = ["Development"]
title = "Development Update #27: Aether, Bounties and Distributed Twitter"

+++
## Summary:

Aether is coming along well. Soon development discussion will be moved into Aether. Coin bounties will be assigned for developing communication tools on Aether.

###### For instance:
- user creates private/public key pair
- user publishes stream of tweets (as JSON) into blockchain and signs each block with their private key
- user subscribes to another person's feed
-- user takes hash (address) of person they want to subscribe to
-- user looks up peers replicating the chain via DHT
-- user connects to the peers and downloads the chain (which is replicated P2P)
- web server on local hosts, allows person to see feeds of people they are pulling in

Most of this is two lines of code in Skywire, so the work is creating a service in Golang and then taking the JSON and creating an HTML interface from it. This is a sort of "App" on top of Aether/Skycoin. Aether also implements a key-value store, which is probably more useful than blockchain for these types of apps.

Twitter is easiest to implement. It is not more difficult to implement a twitter clone on top of Aether than it is to implement one with Redis. Twitter is easiest to implement, because in distributed twitter, each user controls their own feed data.

###### We also want:
- a distributed forum
- a distributed reddit
- messaging (email replacement. most difficult)
- a distributed wiki

These will be used for coordinating development and building up the user community.

For a forum, the forum data would be controlled by a single public key. A user submitting something to forum, would message the forum with a signed message, then it would trigger API and forum server would update the forum data.

For a wiki, each key/value stores a page. The wiki data is controlled by a single public key. Users submit messages to the wiki server, the wiki server updates the data for the page. The updates are replicated peer-to-peer between subscribers to the Aether store. One key has AngularJS for generating the HTML website from the data in Aether.

###### For application distribution we have three options:
1. make people pull the service/app from github
2. have key value store and put Javascript in key 0 (using AngularJS), that gives information for how to render the page and APIs. This means an "app" is javascript that generates the HTML locally and can call a limited number of APIs
3. Have a sandboxed, minimal virtual machine which apps are compiled down into. This is the best long-term solution, but we will use AngularJS until we can get this developed and it meets our security/quality standards.