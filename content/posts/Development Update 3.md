+++
aliases = ["/development-updates/development-update-3/"]
date = "2014-02-23"
draft = true
tags = ["Development", "Security"]
title = "Development Update #3: Security Measures"

+++
## Summary:

Skycoin now has bullet proof security.
- There are very strict rules in place for transaction propagation and signature verification.
- Bitcoin is only able to fix 6 of the 8 transaction malleability problems. Skycoin has 0 transaction malleability and 0 signature malleability bugs.
- Most of the code base is unit tested. There are three lines of tests for every line of code.
- we fixed bug in the struct encoder and the change broke compatibility with packets from earlier versions.
- the Skycoin connection pool library now has non-blocking writes. faster block propagation

The coin is almost done and the project is moving into the next phase.

## New Anti Spam Mechanisms:

Skycoin has coins and has coin hours. You get 1 coin hour for holding 1 coin for one hour. Transaction fees are paid in coinhours, not in coins. When you spend an output, you must spend 50% of the coin hours. Therefore spamming transactions depletes your coin hour balance exponentially quickly. If there are 100 coinhours in the inputs and only 40 coin hours created in the outputs, then the "fee" is 60 coin hours. The number of coins in the output must equal the number of coins in the input. This is hardcoded.

Transaction priority is <transaction size> / <coinhour fee>. If the priority is too low, the transaction will not be propagated and it will not be included in blocks. This will dramatically cut down on small transaction spam and keeps the blockchain small.

Each Skycoin is 1 million droplets. Each coin is divisible to six decimal places. At launch, output balances must be multiples of 1 million droplets (a whole coin). This is to prevent transaction spam. As the price goes up, this will be reduced to 100,000 droplets. We want to keep the minimum output size to 0.25 Euros  Skycoin does not have 0.000000000005 dollar transactions.

All very small "microtransactions" must be executed as off blockchain transactions. Microtransactions are instant and they are free and they don't pollute the block chain with spam.

## Official Position on Scripting Languages on the Blockchain:

We are watching Ethereum closely. If powerful transaction scripting language support becomes something that is used widely, we will implement the best scripting language into Skycoin.  Until the transaction malleability issues are resolved and until we see widespread usage of scripting, Skycoin transactions will remain simple.  A later version may include multisig transactions if they do not introduce transaction malleability into Skycoin.

So far, most users are only using "send" and there has not been widespread usage of Bitcoin's scripting capacity. Scripting has however created numerous security, denial of service attacks and caused substantial increases in the size of the Blockchain . Until we see use causes for scripting languages on the blockchain, we plan to support scripting as an off-block chain extension.

## To Do List:

1. Last minute refactor and cleanup.
2. Launch!

## Developer Positions:

1. We need a golang wrapper around ifconfig for controlling wifi dongles and connecting/disconnecting. Should scan for wifi connections, return list. Should have function for connecting and disconnecting to network. Should return information about signal strength and speed. Bonus points if it supports adhoc connections.
2. We need golang ChaCha20 wrapper
3. We need library that connects to peers using sykcoin/gnet (connection pool). Each peer has list of hashes and hashes are ordered. Each hash  corresponds to data. Each peer should should poll and download any new hash and from peers, that it doesnt have.
4. Given an ordered list of 100,000 things, poll peers, figure out if they have something you don't have, get the things you don't have

#### We have list of:

>type Entry struct {
>Seq uint64
>Hash [32]byte
>Data []byte
}

The list is ordered by Seq. Poll peers and efficiently determine what they have that you don't.