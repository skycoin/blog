+++
aliases = ["/statement/can-skycoin-be-51-attacked/"]
bounty = 8
date = "2017-10-07"
draft = true
tags = ["Statement", "Obelisk", "Consensus"]
title = "Can Skycoin be 51% Attacked?"

+++
*This is an archived post from the bitcointalks thread on February 16 2015*

> Quote from: **iamback** on February 16, 2015, 09:28:38 AM

> A non-PoW consensus is DOA, because there isn't enough time to thresh out the
issues and trust it before the global economy begins to collapse in 2016.
For example, the selfish mining attack wasn't discovered (or let's say widely
proven and recognized) until years after Satoshi published PoW. Thus, the
serious marketplace isn't going to trust a novel non-PoW consensus.
Instead I have designed a PoW system which resolves many of the issues
that plague Bitcoin, including ASIC economics. Some hints are in my linked post
above.

> Also I have some mathematical intuition that avoiding the 51% attack will
always tradeoff security in another facet.

In Skycoin the 51% attack does not matter. The network could be 51%
attacked twenty times a day and almost no one would care.

Skycoin has different mathematical properties than Bitcoin and is stricter. If
you are trading coins back and forth between five people in a closed network,
the 51% attack does not affect them. You need a private key of someone in the
transaction chain to do any damage in a Skycoin 51% attack. There is no
transaction malleability in Skycoin. Almost everyone will have exactly the same
outputs and same balances and same transaction histories on both the original
chain and the fork, except the attacker and people they were trading coins
with. If there is a fork in the chain, it just copies the transactions over
from the other chains.

The 51% attack is only going to affect people day trading with shady people
and gambling sites.  It will not affect commerce transactions very much. If an
exchange follows best security practices and keeps the user wallets
segregated, their worst attack is pretty mild.

Bitcoin is doing 100 million dollars a day transaction volume. Total
transaction volume in Bitcoin is about 200,000 Bitcoins. Bitcoin has
transaction malleability, this means that if someone 51% attacks and rolls back
transactions in the last hour, then about 4 million dollars and 10,000 Bitcoin
in transactions balances will be screwed up. A rollback attack going back 24
hours could be 100 million in damages and up to 200,000 Bitcoins. An attacker
can roll back any transaction in Bitcoin.

In Skycoin, they cannot affect or modify a transaction chain without knowing a
private key for an address used in that chain of transactions. So if five
banks are just trading back and forth between each other for settlement and
they all have good wallet security, the 51% attack would not even be noticed.
Their balances are the same. That is assuming, the 51% attack is even
mathematically possible, that someone bothers expending the resources to
attempt it and that it succeeds.

If someone manages to 51% attack Skycoin (which may be possible, but is
mathematically unlikely) merchants will sing and dance with great rejoicement
because losses will be so much less than for a Visa charge back. Many
merchants sell laptops and make less than 5% margin on each laptop. Someone
claims they didnt get the laptop and the merchant loses $1000, does not get
the laptop back AND has to pay Visa an $80 fee. The company has to sell 25
laptops to make back the cost of the loss of a single fraud. If someone steals
a credit card and buys a laptop with it, Visa does not take the loss, Visa
pushes the loss on to the merchant.

The Skycoin consensus algorithm and the ledger are separate. The consensus
system is modular and can be swapped out. If there is a better algorithm five
years from now, we can just swap out the consensus for the new one. The ledger
and coin balances will be completely unchanged.

Skycoin:

- fixes existing problems with Bitcoin
- future-proofs Bitcoin
- eliminates the death spiral conditions that Bitcoin has engineered in

It is 100% true. There are severe tradeoffs. For example, faster
consensus times for Skycoin-type relational consensus means that a smaller
number of nodes are required to DDoS the network. However, people can react
and remove the nodes from their trust lists.

There will be issues and they will need to be worked out.

## Skycoin Transaction Structure

https://github.com/skycoin/skycoin/blob/master/src/coin/transactions.go

A Skycoin transaction is:

1) A list of output hashes, being spent
2) A list of signatures authorizing the outputs to be spent (signature of hash
   of inner part of transaction)
3) A list of outputs to be created

Coins cannot be created or destroyed. The number of coins in has to equal
number of coins out. Transaction fees are in "coinhours".

## Skycoin supports Coinjoin natively

There is no difference between normal and coinjoin transactions.

- Two people choose the outputs they want to spend, the outputs they want to
  create, send to remote server.
- The server creates a transaction and scrambles orders of outputs in/out.
  Then sends it to each person
- Each person sends the signatures for their outputs to the server
- The coinjoin server injects the transaction into the network

- The coinjoin server cannot steal the coins
- Only the coinjoin server knows how many people are involved (1, 2, 4?)
- Only the coinjoin server knows which outptus belong to who
- There is no difference between coinjoin and normal transactions (they look
  exactly the same)

The signature in the `i`th slot is for the address owning the `i`th output. The
inner hash of the transaction is hashed with hash of output being spent, then
this is signed with the private key owning the output.

So it is very simple compared to other coinjoin systems.