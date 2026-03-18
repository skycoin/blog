+++
draft = true
title = "Is Skycoin Decentralized?"
tags = [
    "Decentralization",
    "Skycoin",
    "Skywire",
]
date = "2014-04-19"
description = "To prototype Skycoin, we used a mix of centralized and decentralized components for prototyping.  We prototyped Skycoin and the emphasis was getting each component working. Over time the centralized components have been replaced by fully decentralized components."
+++

To prototype Skycoin, we used a mix of centralized and decentralized components for prototyping.  We prototyped Skycoin and the emphasis was getting each component working. Over time the centralized components have been replaced by fully decentralized components. Skycoin will be fully independent of any developer run servers and infrastructure by the time Obelisk is finished.

**Right now**
- the ledger is decentralized, everyone has a copy of the transaction ledger
- transactions are decentralized and the transaction relay is peer to peer
- blockchain consensus requires Obelisk for full decentralization

For the mesh net, we will use a centralized routing database and payment clearing, to get it working as soon as possible. We have less than two months to do the ICO and get the meshnet working to stay on schedule. We will decentralize those components as soon as possible. However the priority is getting the network working as soon as possible.

The meshnet balances being exchanged are microtransactions that should not pollute the blockchain, so we are creating a system where the balances are stored and moved around internally by a third party and automatically withdrawn to a wallet after a threshold balance is reached. The current Skycoin implementation allows coins to be divisible to 6 decimal places, but rejects transactions whose outputs are not a multiple of a whole coin, to reduce blockchain spam. This system will be replaced by the decentralized Gateway Protocol at some point.

The idea is that we are making it easy to move around subcoin balances off chain and do microtransactions without polluting the blockchain. Then when your balance is large enough enough, it can be withdrawn to your wallet.

## Ideological Differences in Skycoin's Decentralization Philosophy:

"Decentralization" means a lot of things to different people. Bitcoin has an ideology of "decentralization" in terms of zero trust and zero counter party risk. Bitcoin takes an ideologically motivated stance against trusted third parties. Skycoin accepts that complete technical decentralization is necessary, but rejects Bitcoin's ideological insistence against trusted third parties. For instance, anyone using and exchange or making a purchase is creating a trust relationship.

Skycoin is not ideologically opposed to trusted third parties, as long as the user is the one choosing the third parties.

**Bitcoin Decentralization**: No Trusted Third Parties
**Skycoin Decentralization**: No Trusted Third Parties When Possible, but Trusted 3rd Parties are OK when technically necessary and where choice of the third party is under control of the user

The Bitcoin developers would reject any feature on ideological grounds, that would introduce a third third party relationship into any officially sanctioned part of the Bitcoin protocol, because it would compromise the ideological purity of Bitcoin's decentralization philosophy. Skycoin has technical decentralization but accepts that trusted third parties are sometimes a necessary evil (example: you cannot currently have exchanges without using a trusted third party).

For example, If there are multiple exchanges and Skycoin has an exchange API, that API is interacting with a trusted third party. This is OK in Skycoin as long as we don't force the users to use a particular exchange and they choose which exchange they are extending trust to.

In Skycoin, 3rd party escrow in the protocol is OK as long as the user gets to choose which escrow authorities they will accept. The Bitcoin developers are ideologically opposed to any third parties and would not include sanction for escrow in the protocol or client, unless it can be enforced mathematically and under zero trust assumptions.

The Bitcoin developers are ideologically opposed to official support for anything that introduces trusted third parties into the Bitcoin protocol. Skycoin is slightly more pragmatic and accepts trusted third parties as a necessary evil for doing necessary things conveniently.

For instance, the Bitcoin developers are ideologically opposed to a check pointing system. Skycoin will have a check pointing system where the hash of the current consensus block will be signed by a particular public key and broadcasted. The purpose being to detect network failures or a successful attack and trigger an alert for human action (to detect, not to take a specific action which may introduce a security vulnerability through the checkpoint system). Such a system can be extremely useful for determining if the local client state has diverged from the network because of an attack or manipulation and for prompting human action. If the checkpoints were published by the Skycoin developers, this would introduce a single point of centralization and possible security vulnerability. However, if the check pointing system is a service and trusted community members and other large Skycoin stakeholders are each able to publish their own checkpoints and each user is able to choose whose checkpoints their clients will verify against and to verify against multiple parties (no single point of failure), then it is acceptable within the Skycoin decentralization philosophy, but would be unacceptable in Bitcoin because it introduces a trusted third party.

That is what "decentralized but pragmatic" means.

## Skycoin Controversy:

Skycoin will receive a lot of criticism from hardcore Bitcoin people, because Skycoin is taking the perfect ideologically pure, identity less, trustless, creditless garden of Eden that Bitcoin has created and reintroducing the sin of trust and credit that is required for day to day financial transactions.  Bitcoin takes an ideological perspective on money as a "hard" mathematical commodity concept, but Skycoin takes the perspectives of money as arising out of social relationships. The messaging systems (systems for communication), personal block chains (identity and markets) play a much larger role in the long term vision of Skycoin than Bitcoin, which merely aspires to be a mathematical perfect form of commodity money.
