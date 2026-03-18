+++
aliases = ["/development-updates/development-update-12/"]
date = "2014-04-04"
draft = true
tags = ["Development"]
title = "Messaging System, Wallet and Roadmap for Skycoin"

+++
# Summary:

##### Current changes being worked on:
- Wallet GUI is being fixed to use new RPC
- New repo for wire protocol: https://github.com/skycoin/net

We are moving towards a **"service architecture"** for networking. You have a connection pool, which manages connections to multiple peers. Each peer is running multiple "services" they advertise. Services communicate over "channels" on a physical connection. Channel 0 is used for QoS, initiation, teardown and service metatadata.  Service peers are found through DHT (distributed hash table) and PEX (peer exchange).

Blockchain downloading/replication is a service, transaction relay is a service. Darknet routing, Darknet relay and off-blockchain transactions are a "service". Distributed exchange will be a service. Messaging will be a service.

Node identities will be authenticated later, but system has not been finalized yet. The identity system will make the service architecture IP address independent. You will be able to find, connect to and message peers from the hash of their public key. Messaging service will offer asynchronous communication between peers by pubkey hash (essentially skycoin addresses).

The messaging system will let your wallet contact the merchant, generate new unused addresses for a transaction and give you a signed receipt for the transaction from the merchant. It will also enable invoices for reoccurring payments, such as for VPS services. Merchants will be able to send shipping confirmations and other information over the messaging channel. This will be major improvement for usability.

We will be assigning development bounties for services like **"folder syncing"** between computers. We want service that allow users to rent out their disc space and bandwidth to third parties for Skycoin. The system has to do something useful, that people will pay coins for and which does not create a botnet.

## Roadmap:

##### Coin Launch Requirements:
- Blockchain replication ported to Skywire repo using new service architecture
- Transaction relay ported to Skywire repo
- Blockchain database pulled out from skycoin/src/visor and skycoin/src/blockchain

##### Darknet Launch Requirements:
- darknet relay node service
- darknet routing node service
- golang library for controlling USB wifi devices and initiating connections

We are going to get coin done first, launch. Then work on Darknet, then go back and finish Obelisk.

We have some major announcements, but will wait until after launch.