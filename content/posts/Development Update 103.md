+++
aliases = ["/development-updates/development-update-103/"]
date = "2016-08-17"
draft = true
tags = ["Development", "Skywire"]
title = "Skywire Updates and Improvements to the Skycoin Wallet"

+++
## Exchange:

Exchange is done
- https://github.com/skycoin/skycoin-exchange
- bitcoin deposits
- bitcoin withdrawls
- skycoin deposits
- skycoin withdrawls
- order book

The Angular 2.0 gui for the client JSON API is being integrated right now.

This is not just an "exchange", but
- has "local" wallet (private keys and local wallets) and remote wallet (coins deposited in the exchange)
- has a thin client, API, so that you can get unspent outputs and inject transactions
- is multi-coin (the coin handling is pluggable, so that we can add new coins over time)
- does not use HTTPS or even IP addresses. Is designed to identify the server by public key and to run over meshnet/darknet eventually. Crypto is secp256k1 with ECDH and chacha20. Will have first level of crypto at meshnet and identification of server by public key, then ephemeral transport layer encryption.
- accounts with the exchange are 33 byte secp256k1 public keys
- eventually you will be able to disable the order book and most of the coins and use the "exchange" server as a thin client API for querying unspent output balances and injecting transactions from thin clients (this is the API the multi-coin mobile wallet is being built on)

Still a lot of work on this

The idea is that you do not hold the coins in the exchange. So if the exchange is attacked and coins are stolen, you will not care.

You can move skycoin into the exchange in 2 to 10 seconds, perform your trades and then withdrawal the coins back to your local wallet. There is a "local wallet" for each coin, where you can withdrawal your litecoin, dogecoin, ethereum to and where you control the private key for each address. Without having to run the blockchain for each coin.

This solves the problem, that people are trading on dozens of coins and never withdrawing the coins to their wallets, because they cannot have the blockchains installed for twenty seperate coins.
- therefore the users never withdraw the coins
- therefore the exchanges sell coins that do not exist and that they do not have, knowing that the user will never withdraw them.
- this avoids the problem of where the exchanges are running on fractional reserve and where when a large user attempts a withdrawal, the exchange has to go and buy up the coins from other exchanges (who may not have them and in term has to buy them from another exchange).

## Meshnet

Meshnet is in version 12 and is passing unit and integration testing.
- https://github.com/skycoin/net
- https://github.com/skycoin/skywire

Pluggable transport is working.

The mesh network is being heavily refactored.

You can currently
- spawn nodes (identified by public key)
- create a pluggable transport and attach it to the node
- create "routes" or source-routed multiple hop paths, that allow communication between nodes
- run a tun/tap VPN on linux/OSX over a route

The meshnet should be ready for general use by version 14 or 15.

Things that are not done
- analytics (one way latency, round trip latency, transport throughput, reporting)
- multi-homing
- network topology reporting/route finding service
- everything

## Development

Development is chaotic because we are currently developing five separate applications.
- exchange
- wallet
- transaction database/explorer API backend
- consensus
- meshnet
- CX
- mobile wallet
- multi-coin API
- etc...

##### Development Priorities
- get website up for wallet/exchange client downloads (build process is fixed now)
- exchange (skycoin/bitcon liquidity)
- get first consumer version of meshnet out
- get first applications out

Once the exchange is working, we should have the wallet download on the website and available for non-developers.

We have two applications now (soon four; wallet, exchange, mesh node, vpn). We have to decide if these should be packaged separately or as one unit with an electron menu for application selection.

## Build Status

The builds work on OSX, Linux, Window and ARM.
- The 32 bit windows problem in the crypto library has not been fixed
- All skycoin applications are using a local webserver, which exposes a JSON data API and then an Angular 2.0 web application served statically from local host (which calls the JSON API)

All of the CGO dependencies have been removed from all Skycoin applications and libraries and so automatic cross platform builds are working now.

For GUI we are using Electron, which embeds chrome with the wallet. Instead of using the system web-browser. This increased the executable size from 10 MB to 60 MB.

## Wallet Improvements:

New tabs are being added to the wallet, to make data more accessible.

![](/img/dev-update-103-1.png)
![](/img/dev-update-103-2.png)

- There is now a tab for seeing the unspent output balances.
- There is another tab for modifying default node connection lists.

We now have the libraries working, for multi-coin support, but it has not been added to the wallet yet.

## Applications:

We are doing corporate stuff and dealing with CentOS deployment. I think we will have a suite of self-hosted applications, after the network is running.