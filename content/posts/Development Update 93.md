+++
aliases = ["/development-updates/development-update-93/"]
date = "2015-12-23"
draft = true
tags = ["Development"]
title = "Development Update #93: Skycoin Major Milestone and What's Next"

+++
The crypto port is done. Major milestone done!

I was almost ready to give up on getting it working, from frustration.

The actual bug was fixed nine days ago and the problem was in the test environment.

The test suite was failing in the test environment, but turns out is passed if the tests are run when the working directory is within the $GOPATH, but fails when the tests are run outside of the $GOPATH. This has something to do with how golang handles symbolic links (which do not exist in Plan 9...).  When the tests are run from outside of $GOPATH it was using a cached, older version of a package in a sub-directory of the original package and was not recompiling the library, when changes were made...

We also recently found another pure golang secp256k1 implementation
- https://godoc.org/github.com/btcsuite/btcd/btcec

## Next:

I am trying to get cross compilation for OSX, Linux, Windows working now.

Then will post new version of the Skycoin client.

## Next:

I am writing small library to get bitcoin unspent outputs for an address and to sign bitcoin transaction.

Then will make small test website, where
- you put in skycoin address
- server generates a deterministic bitcoin address to send coins to.
- server waits for transaction to clear and then sends Skycoin

That will make sure that bitcoin/skycoin transactions are working. (There is minor issue with transaction injection and transaction status in the skycoin client that has to be fixed, where transaction takes too long to propagate if transaction was created before the node is connected to any nodes in the network). We also need improved transaction tracking and status for users and for exchanges.

Then can do order book and will have a full exchange and liquidity.

---

Then can finally do the meshnet/darknet/vpn prototype first version. I want to get something working very quickly, but it may not be mature for a year or even two years, before there is nothing left to do in terms of architecture and scope.

- There is no cross platform implementation of ncurses for terminal applications and other hassles.
- There is no cross platform VPN frontend and it will only run on linux initially.
- Applications like Bitorrent will have to be ported to run directly/natively in the name space (like they do in Tox and I2P)
- Decentralized versions of applications like instant messaging, email, twitter, facebook, youtube will eventually have to be written for the network namespace
- a go like scripting language may be needed for application development, networking
- we may need something like "angular.js for terminal applications" and a cross platform OpenGL terminal with standardized interface for controlling the terminal over the network
- there are open problems with how payments should be settled, pricing, preventing artificially induced scarcity in the coin economy that would restrict network expansion (applied economics, multi-agents simulations, cybernetics, economy design)
- etc..

Over the next decade, the whole internet is being rewritten from scratch to address the current challenges it is facing. There are dozens of protocols under development, such as
- IPFS
- tox
- bitcoin
- cjdns
- aether
- telehash
- bitmessage
- namecoin
- bittorent-sync
- dozens upon dozens of others