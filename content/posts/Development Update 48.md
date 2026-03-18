+++
aliases = ["/development-updates/development-update-48/"]
date = "2014-12-25"
draft = true
tags = ["Development"]
title = "Development Update #48: Software Wallet Fixes and Hardware Wallet Proposal"

+++
I pushed a few fixes. The wallet is still buggy but looks great.

![](/img/dev-update-48-1.png)

Refactoring is not as easy as I would like. If you split two modules in golang, that have minor depedencies, it will not compile because of circular dependencies. Golang can handle circular dependencies, but the language developers force this constraint upon the developer. This makes refactoring some things, drawn out. I cannot do a series of small, incremental refactors, but am forced to refactor five things at once. It is like untangling a ball of yarn.

Working on migration to new API now.

###### The new wallet API will separate out checking balances, getting unspent outputs and injection transactions.
- the node is physically separated by an API layer from the private keys
- this makes hardware wallets easier
- this makes it easier to add Bitcoin, Dogecoin and Litecoin into the Skycoin wallet. Every coin can go through a common API interface.
- this means wallets can be like blockchain.info, but completely local. There is no risk of javascript injection or anyone stealing wallet through web-browser.
- nodes are able to query balances, create/sign transactions and inject transactions without running full blockchain. They can use remote nodes through same interface as local nodes.
- dark wallets will not work without a full transaction history. There is no way to do darkwallets in Skycoin with a thin client. Generating a shared address with recipient public key requires a full copy of the blockchain.

## Hardware Wallet

This is a proposal for a graphical representation of 256 bit deterministic wallet seeds, in a form that can be committed to memory more easily than a 64 character hex string. It is designed to be easy to write down on paper, with human checkable error correction coding to reduce transcription errors.


We think this is better than Trezor. Its very simple too. A OLED display ($5), a $2 32 bit arm processor and five buttons. We want a hardware wallet implementing this standard.

https://github.com/skycoin/skycoin/wiki/Brain-Wallet-Sigils

There is a square with 4 quadrant. Each quadrant has a 3x3 grid, with 16 states per element. The advantage is that the format can be written on paper, can be inputted onto hardware device or can be remembered easily compared to a 64 bit hex string. There is also built-in human check-able error correction to prevent transcription errors.

![](/img/dev-update-48-2.png)
![](/img/dev-update-48-3.png)