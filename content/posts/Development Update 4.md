+++
aliases = ["/development-updates/development-update-4/"]
date = "2014-03-03"
description = "Release notes highlighting the current development behind Skycoin"
draft = true
tags = ["Development", "Security"]
title = "Development Update #4: The Design of Obelisk"

+++
## Software Update:

The design of Obelisk is finalized. All the pieces come together and its a major milestone for cryptocoins. We believe that Skycoin will be the most secure, most difficult to attack non-mined cryptocoin to date.

## Changes:
- There is now list of things for developers to do https://github.com/skycoin/skycoin/wiki/SOFTWARE-DEVELOPERS-CLICK-HERE
- We introduced proof of work and difficulty re targeting to keep block production rate constant. As the network scales from 10 nodes to 100,000 we need to keep the block rate constant and prevent it from growing linearly with the number of nodes. This minimizes the number of decisions and rounds Obelisk needs to converge to network consensus. Proof of work will be used for block minting, but not for block consensus. There will be no reward for block minting. Malicious blocks (blocks with no transactions or few transactions) will be weighted against, to deter abuse. The proof of work is not in the block headers, but occurs at a higher level that wraps the blockchain. This makes it more modular and easy to swap out and modify without causing a hardfork.
- We proved that probability of a block fork under Obelisk approaches 0% exponentially quickly with block depth.
- Transaction and block replication in /src/daemon are being abstracted into a library. The emergency messaging system and transaction propagation will use "blob replication". Blockchain and obelisk replication will use "hash chain replication". This will make the system more modular and make improvements to block and transaction propagation easier.
- We are working on builds for testnet client. Obelisk is not implemented yet, but you will be able to run client and send coins around and hunt for bugs
- There is a massive refactor going on. Replication functionality  in /src/daemon is being moved into /src/sync. /src/visor functionality is being moved into /src/blockchain and the top level of Skycoin is being moved, to make changes required for Obelisk integration.
- /src/coin and the cryptography libraries are "done".  The changes to this part of program will be minimal going forward.
- We are finalizing the JSON RPC for exchanges and wallets