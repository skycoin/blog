+++
aliases = ["/development-updates/development-update-91/"]
date = "2015-12-18"
draft = true
tags = ["Development"]
title = "Development Update #91: Skycoin Exchange Client"

+++
## Exchange

Exchange GUI is in progress.

![](/img-dev-update-91-1.png)

- The exchange client is a very light weight terminal application.
- When exchange app starts, you put in your pass phrase for deterministic wallet generation
- It communicates with exchange over encrypted channel.
- You can transfer between local wallet and the exchange very easily

- As long as you remember you wallet password (the phrase that generates the wallet), then you can access the coins from anywhere.
- There is no physical wallet, on disc that can be confiscated or even proven to exist

##### Example 1:
- start exchange
- put in key for deterministic wallet generation
- send Skycoin to exchange from local wallet
- sell Skycoin for Bitcoin
- Send Exchange Bitcoin to remote address
- Pull remaining skycoin back to local wallet

##### Example 2:
- start exchange client
- put in wallet generation pass phrase
- check bitcoin balance for local wallet
- send bitcoin from local wallet to an address (sign transaction, inject transaction)
- close exchange client

This is not really an "exchange" or a client. It is more like a bloomberg terminal for Bitcoin/Skycoin.

You do not need to "login" to the exchange with a user name or password
- your public key authenticates your identity

Cell Phones, Windows 10 and all operating systems are backdoored.
- This will eventually run on a MIPs or ARM processor, that is not even running an operating system.

There is an RPC between the client and exchange server. There are a small number of actions on the command channel.
- Check BTC balance [address list]
- Check SKY balance [address list]
- Withdrawal Bitcoin (pull coins from local wallet)
- Deposit Bitcoin (push coins form local wallet)
- Withdraw Skycoin (pull coins from local wallet)
- Deposit Skycoin (push coin from local wallet)
- Place Bid/Ask (update order book)
- Cancel Bid/Ask

Then there are events such as
- order book updates
- coins received into address
- pending withdraw completed (transaction executed on blockchain)
- bid/ask order executed

The command and event channel are asynchronous and will run over anything that can send bytes. In this case I am running over uTP.
- Bitmessage
- IRC
- TOX
- Torchat, etc
- email
- SMS
- tor

Eventually it should be possible to have multiple transports and go hop to hop from nodes to communicate with a destination designated by a public key hash (purpose of the darknet/meshnet/vpn).

This is moving away from
- no dependence upon the operating system
- no dependence upon a web browser
- no dependence upon DNS
- no dependence upon HTTPS
- no C code that can be buffer overflowed (memory safe)
- no external library dependencies (4,000 lines of code)
- easy to extend or modify

Maybe will have a command line for getting the unspent outputs for an address or creating transactions by hand.

Right now, the exchange just has to replace bitmessage for buying/selling, because it is too slow and frustrating.

This is also a test, to see if this is the right interface type for darknet/vpn/routing administration.