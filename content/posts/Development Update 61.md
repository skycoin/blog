+++
aliases = ["/development-updates/development-update-61/"]
date = "2015-03-13"
draft = true
tags = ["Development"]
title = "Development Update #61: Skycoin Bug Fixes"

+++
## Summary

Two days were spent fixing a bug with where "req.ParseMultipartForm()" needed to be called instead of "req.ParseForm()" because URL get/post parameters were not showing up correctly in logs. The url was working in unit tests, but was broken in wallet gui and still trying to determine reason. As soon as this is fixed, will begin sending out test coins.

Then the transaction "readable" for human readable transaction format is broken. I had to spend four hours writing function for serializing binary transaction format to human readable JSON transaction format, so that a transaction can be converted to JSON and then back, without changing the SHA256 hash of the binary serialization of the transaction.

This is very important, because users of Bitcoin do not understand what a transaction is. They have never seen a Bitcoin transaction. Bitcoin transactions are not human readable. They are in some Forth like stack language that makes most C programmers wince. Skycoin transactions are simple enough that most users will be able to understand what they are and what they do. You can look at the transaction and visually see that it is correct. I think the average user will be able to create Skycoin transactions by hand if they need to and that it will help them understand what a balance actually is and what a transaction actually does.

The JSON serialization is important for tool, that generates transactions offline so they could be moved in human readable form from a cold computer to active node for "injection".  When we tried to move the genesis transaction for the coin distribution, we found out that the wallet readable serialization was completely broken... You cannot convert from a wallet readable back into a binary transaction with the same SHA256 hash as the original transaction. The function for injecting transactions into network from GET/POST request was also missing. That is in place now.

We did not realize this was not working, until we tried to move the genesis transaction from the cold computer.

The JSON serialization is also required for doing cron job to backup the transactions and balances in human readable format every hour, so they can be rolled over to a new chain or ledger if required. ASICminers was listed on three different stock exchanges and each exchange went under one after another. They were able to track ownership stakes through multiple shutdowns of the exchanges and contact investors and pay rewards. By having cron job and doing hourly backups of the transactions and balances, we can have contingency in place ensure that the balances are preserved if the coins need to be rolled over to a new ledger.

There is only one planned rollover in the future, but we want to be prepared if there is a severe attack that requires changes to the binary format of the blockchain that would require an emergency rollover. The transactions are exported from one ledger as JSON, imported into the new ledger and balances are same. The problem without the JSON format for transactions is that modifying the binary format of the blockchain breaks the block serialization format, so the old blocks cannot be loaded from disc. So the JSON standard makes it human readable, easy to run scripts on, future proofs it for import. This is part of emergency/contingency planning.

We also had to write bash scripts and generate a wallet deterministically using the Skycoin deterministic address/private key generator, insert the private keys into bitcoind, lock the wallet and then move that from cold store. SX was broken, which is what we were using before. Two days after bitcoind was working, we found out that SX is not longer being maintained was replaced by BX and that BX works.

bx tool from the lib-bitcoin/darkwallet team
- http://chimera.labs.oreilly.com/books/1234000001802/apd.html

SX was one of the inspirations for the Skycoin command line and JSON interface. Except that our interface is designed to be usable and instead of trying to do everything. BX is revolutionary because it allows you to do things that you cannot do with bitcoind, such as checking the balance of a bitcoin address without having the address private key in your wallet.

That is the state that Bitcoin is five years after launch. It is still impossible to query the balance of an address without a third party utility, using blockchain.net or having the address in your wallet.

## Bitmessage Problems:

Some users are reporting that Bitmessage is not syncing and they are not getting message confirmations. We had the same problem in testing. We attempted to connect to Bitmessage and it depended on which country we connected to network from. If you connected to Bitmessage through server exiting in particular countries from clean state, we were later unable to sync all the messages, unless we deleted the node/peer lists from the bitmessage data directory. Without deleting the peer list in the data directory, message syncing failed even if connecting through another country.

This could be a bit of unluck or could indicate something else (sybil attack? slow nodes?).

We think Bitmessage is working good enough (we tried everything else and its worse), but that will affect some users.