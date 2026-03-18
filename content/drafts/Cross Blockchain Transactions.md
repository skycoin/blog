+++
draft = true
title = "Cross Blockchain Transactions"
tags = [
	"Skycoin",
	"Development",
]
date = "2014-04-16"
description = "Current Stance on Cross Blockchain Transactions"
+++

## Comment:

Quote from: **CraigM** on April 15, 2014, 07:11:29 AM
>It seem like most of these proposed features (enforceable contracts, distributed trust-less exchanges, reputation systems etc) all come from the core feature of cross chain transactions. Cross chain transactions allow adding other currencies/goods to the economy that can be securely exchanged. This is a very powerful feature which solves tons of problems including the scalability ones (you can shard the currency if the distributed consensus becomes too expensive, or even add ultra low transaction cost centralized sub-currencies that can be converted back to any other currency)

>I've looked into cross chain transactions before: the idea is not at all new. I've just never seen anyone claiming they had a way to do it (If I missed one, please direct me to it. ZeroCoin seemed kinda close, but didn't solve the general problem as far as I could tell). I tried to design some solutions myself, but I was unsuccessful (No surprise since I'm not an expert). If Skycoin really does solve the cross chain transaction problem, then I think we really have something here. I hope this is the case.

>However I have a couple of doubts: Skycoin appears to claim supporting cross chain transactions involving existing currencies that have their own block chains already that are not effected by skycoin's. This means that actions on the skycoin side (such as a transaction failing to get included due to being involved in a double spend) can not effect the other block chain. If one version of a skycoind/bitcoin trade transaction gets accepted on the bitcoin side, but a double spend is issued on the skycoin side, I don't see how both sides would be guaranteed to reach the same consensus. Even more confusing to deal with: suppose bitcoin forked, what happens then? A block chain forking is a perfectly valid and acceptable thing (if there is a legitimate disagreement about some transaction's validity, then its forked. Usually one side is mostly abandoned (but still existent), but thats not guaranteed)

>Secondly: I don't see how these problems could be solved, even within skycoin one block chains. Solving it there seems more likely to be possible, but I still don't see how it can be done. I won't say it can't be done (cryptography does pretty amazing things), but the explanation for how that works is the main thing I'm looking for.

>To be clear though, even if Skycoin fails to deliver a cross chain transaction solution, it still looks like it has a lot of potential, but I'd start to be more suspicious if such a significant claim ended up being false.

## Response:

We do have a new solution for the byzantine generals problem. **We do not have a solution for cross blockchain transactions.**

## Cross Blockchain Transactions:

We do not have a solution for cross blockchain transactions. What we are planning is personal blockchain for each user, a scripting language and counter signed receipts for transactions.

**What Skycoin is providing, is the libraries for creating personal blockchains and ability to synchronize personal blockchains and providing some infrastructure. We have no idea what people will use this for in the future.** This is for developers and people who want to experiment with blockchain technology and is not a component in any planned consumer facing application.

You could embed a game like huntercoin in your own blockchain or Piratebay could dump their torrent files into their own blockchain. I am sure people will do something creative with it.

There is no "Skycoin" or way to force a transaction in the off blockchain transaction. It requires voluntary compliance on the part of the counter party. **Zero trust cross blockchain transactions are currently an unsolved problem.** Even if the problem can be solved, it is not clear that people would use it.

Until someone solves the problem, what we were planning to do is
- each person has a personal blockchain and signs each block with their private key
- in a contract between A and B, person A signs the hash of the contract and then B counter signs
- the contract signatures and counter signatures are published publicly in A and B's personal blockchain
- A contract that says "A will pay B 500 coins within one month to address X" cannot be enforced, but if A does not fulfill the contract, the default can be verified publicly if B publishes the contract
- contracts can involve a trusted 3rd party escrow that personally guarantees execution of the contract.

If you have an options contract for "right to sell 5 Bitcoin at 20,000 Dogecoin" between A and B. There are two issues
- transferring the contract
- executing the contract

Assume A issued the contract and will fulfill the contract on execution. B wants to transfer the contract to C. B and C sign a transfer agreement and countersigns the agreement. They hand the agreement to C and C signs and then A,B,C publishes the signed transaction (delete contract between A and B, create identical contract between A and C) into their personal chains.

A simple transaction between a user and an exchange is "You owe me 500 Dogecoin". You deposit 500 Dogecoin into the exchange and receive a signed contract saying "You have 500 Dogecoin" and the contract has provision for withdrawing them to a public address.  Now you can transfer the ownership of the 500 Dogecoin withdrawal contract to another person and the exchange signs the transfer and the receiving person can now authorize the withdrawal of the 500 Dogecoin to a blockchain address.

The exchange is obligated, but not required to sign the transfer agreement and is obligated but not forced to send the Dogecoin at execution. However, if the exchange tries to send you a different amount of dogecoin, claims the contract does not exist or wont honor the contract; you can publish the contract and it proves in automated way that the exchange is a fraud.
- If the exchange says the contract is not valid or wont honor it, the exchange has to produce a valid receipt showing you authorized a transfer or withdrawal (which the exchange cannot produce without your private key)
- The exchange cannot make money appear or disappear
- You can transfer your obligation and ownership of assets held by the exchange to a third party

We don't try to eliminate fraud and make it zero trust, we just make it so you can detect and prove fraud to third parties in an automated manner. This allows you to give some data to a third party that proves the other party is not trust worthly and can be verified independently.

A contract may entail a trusted 3rd party. So if A defaults, the escrow agent will execute the contract on behalf of A, but the escrow agent may require holding collateral from A, to take on the risk of default.

It sounds complicated. Its easier to look at example contract scripts and then it makes sense. Scripts take in inputs, have conditions and output new scripts on execution. A script input should be a public condition. A script output may be an action, that can be verified publicly such as "Pay 5000 Dogecoin to address X".

The personal blockchains are public broadcast channels and are used to get inputs which refer to particular transactions and may trigger execution of the scripts. People publish hashes of the blocks from the chains they subscribe to as receipts of the data, in their personal blockchains. This prevents selectively denying receipt of information which would trigger script execution and establishes a distributed time stamping system through the linked cross signed chains.

A script for "I am holding 5000 Dogecoin for person with public key A" reads "If I receive a valid signature for the hash of this transaction, signed by the private key of A as input 1, output (SendObligation Dogecoin 5000 AddressInput)". The script has two inputs a signature to verify that the withdrawal is authorized by the person who the Dogecoin are owed and an address to do the withdrawal to.

The exchange will then send the coins and the person on the other end may publish a signed receipt confirming fulfillment of the obligation. If the obligation is not fulfilled by the exchange, you can publish the contract and it can be publicly verified by anyone that the obligation was not fulfilled.

So its not really "cross blockchain transactions". Each script only exists and executes in a single blockchain. Its more like cross signing receipts and publishing them in your chain. When script conditions can be triggered by events in another chain, then it begins looking like a cross blockchain transaction. However, **payment obligations and contracts involving coins are voluntary and not enforced by the protocol.** Its not zero trust.

I would say that it is similar to open transactions, but using the personal blockchains as a ledger. Its much simpler, much less code and designed for the convenience of developers who want to build something on the technology.

The contents of the personal blockchain blocks are just bytes. You can use any scripting language or extension to the scripting language you want. A single person may have contracts in three different scripting languages on the same chain. As long as the counterparty accepts the scripting language and it can be parsed, its a decision between the peers.  For simplicity and determinism, we might have a base language with a simple VM and communication primitives and let people implement their contract scripting languages on top of that.
