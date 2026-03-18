+++
aliases = ["/development-updates/development-update-11/"]
date = "2014-03-31"
draft = true
tags = ["Development", "Skywire"]
title = "The New Skywire Protocol 2"

+++
## Summary:
Most of the work in last week has been in the new wire protocol repo. Should be on github soon.

## Skycoin License:

###### The license will be a standard open source license. Current license is:
- You can distribute code for non-commercial use
- You can modify code for non-commercial use
- You agree to copyright assignment under the to be determined open source license
- You grant perpetual license to use, distribute and modify any contributed code

We might have terms like **"no forking coin without permission for 24 months after date X"** and then license is MIT or GNU after that. We have already had to remove build scripts from the repo because someone tried to fork and launch the coin before us.

## Skywire: Skycoin Wire Protocol:

The wire protocol is almost done.

The new connection pool has "channels" (uint16). Each channel expose a "service" (a thing that sends/receives packets within a channel). Each connection between two peers in the connection pool can support multiple services running over the same TCP connection.

This is implemented by a connection pool and length prefixed messages with a "dispatcher" that handles the messages for each channel. Raw bytes can be read and written from channels, but gnet has a default dispatcher that allows you to register structs as network messages. When a message is received, the .Handle(...) method of the corresponding struct is called on the receiving end. The struct fields on receiving end are already set to the values that were transmitted. This makes building distributed P2P services very easy (summary: you put data in struct, hit send and on receiving end the .Handle() function is called on the struct).

##### Current services:
- Block chain relay server
- Transaction relay server
- Emergency messaging server
- Obelisk node server

There are tools for finding peers running particular servers using DHT (distributed hashtable) and exchanging peer lists between peers (PEX, peer exchange). Example, If you have a blockchain genesis hash, you can use the hash to find peers running a blockchain server for that chain and download the blocks from them.

If a user wants to create a new, more efficient system for blockchain replication, they can create their own service/server and put it on github and other people can use it. Its extremely modular and not monolithic like the Bitcoin wire protocol.

## Darknet Service Example:

This service architecture is the starting point for many of the darknet services. I will write a tutorial with code snippets, for creating a new darknet service.

This is a toy example for creating a distributed exchange through the Skycoin wire protocol, in a few hundred lines of code. You define structs for "check balance" and buy/sell commands and order book listing command. You run the exchange service and it automaticly connects to peers running the exchange service. You say "I want to sell 5000 dogecoin for 1 Skycoin", someone takes the order. The service negotiates the receiving address, receives the Skycoin and sends the 5000 Dogecoin.

That is a fully functional distributed exchange, but does not address cheating. What if you send coins, but do not receive coins? You could
- Use a white list and only send coins to trusted exchange services (simpliest and works right away)
- Use a more complicated protocol

To prevent cheating you might both agree "I will send 5000 dogecoin to address A within one hour. You will send 1 skycoin to address B within one hour". You both sign the hash of the agreement. If the person does not send the coins, you publish the transaction to Bitcoin talks and everyone can verify it and prove he is a scammer.

Or you both have coins in escrow with mutually agreed upon third party C. The signed agreement is given to C. If one side fails to execute the agreement, the amount is taken out of escrow and C executes that person's side of the agreement at current price.

Skycoin has a protocol under development, called the **"gateway protocol"** that will simplify these types of transactions. This is an outline for doing a simple distributed exchange with a "raw" service on top of what is implemented right now.

## Bugs:

One developer merged in the new wallet RPC and the wallet GUI developer has not updated the wallet to use the new RFC yet. There is a --web command line option for running GUI in browser, for debugging. Its better for development than the QT client. You can inspect the javascript and see the errors.

The new wallet JSON interface allows loading and using multiple wallets in the same client, but broke the wallet GUI.

The wallet developer will fix this tomorrow.