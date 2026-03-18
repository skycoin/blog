+++
aliases = ["/development-updates/development-update-102/"]
date = "2016-05-31"
draft = true
tags = ["Development", "CXO", "Skywire"]
title = "Updates to CX and Skywire"

+++
The first packet over the VPN, connected through the meshnet worked yesterday.
- This is a major project milestone.
- We have a multi-hop VPN client running over the Skycoin meshnet namespace. This is the first multi-hop VPN that I know of.

The port of the wallet from Angular 1.0 to Angular 2.0 is in progress and almost done. This means the design firm can start on the mobile wallet and multi-coin wallet.

Cross compilation is working on all platforms now (except for 32 bit windows, because of compiler bug when compiling the secp256k1 library, which causes an "out of registers" error). There are still many Windows XP users in China, so we need to replace the crypto library, to get rid of this bug.

We hired the 4th person to attempt to write the library for getting the unspent outputs for a Bitcoin address (using a local node, not blockchain.info) and they failed. This has been a saga. We will have to iterate the blockchain for each coin, block by block, transaction by transaction, creating a database of the unspent output and transaction set apparently. This is milestone for getting multiple coins supported in the Skycoin wallet.

We switched to Electron from Atom text editor for creating taskbar icons and managing the Skycoin application process startup, because of problems packaging on OSX.

The meshnet/vpn still has no GUI, need json configuration file written by hand and does not have a command-line REPL loop.

Skycoin setup instructions do not work in china because gvm pulls the golang repository from a Google server, that is blocked by the firewall. The installation also often fails even when using a VPN client. We are not sure what to do about this.

The CX design specification is done. We will start on this soon and then begin development of more applications inside the Skycoin networking address namespace.

## Mesh network

There is still a lot to do here:
- encryption
- pluggable transport
- asymmetric connection topology support
- multi-homing
- GUI / user interface
- default deployment for wireless setups
- applications
- clean, easy to use application API

We have a lot of interest from multi-national corporations, operating across different jurisdictions who want to use this as an easy MPLS setup for machine-to-machine communication between their application servers.

## CX

We are getting this working and doing some pilot applications for large financial services firms.

The core technology, is probably better suited for distributed anti-aircraft defense radar and missile systems.

The financial service firms do not know what they want and most of them, just want to replace their SQL databases with a blockchain, but leave everything else the same. The buzz word "blockchain" in financial services, just acts as a distributed database that is good for financial transaction ledgers.

The technology is very banal. Blockchains are just a type of decentralized database. It is not any more exciting than an SQL database.

I think many banks are looking at blockchain technology for dual purposes. I think they are looking at it as a means to decentralize their payment and settlement operations and get out from under SWIFT and the Office of Foreign Asset Control as NATO falls apart.