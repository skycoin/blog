+++
aliases = ["/development-updates/development-update-53/"]
date = "2015-01-23"
draft = true
tags = ["Development"]
title = "Development Update #53: More Skycoin Code Polishing"

+++
Overall, the architecture is very good. However, the details need polish. This involves removing code and simplifying, removing unnecessary things. I don't feel like the Bitcoin API has changed in five years. You still cannot check balances and get outputs for an address not in your wallet, in Bitcoin. So in some sense, the Skycoin API has evolved faster than in two days than Bitcoin did since launch.

We are using JSON format, so people will not lose wallets like in Bitcoin where a new client cannot load an old wallet serialized with older version of the key-value store library. There are people who has 20,000 Bitcoin and deleted wallet because it said it has zero coins, (old wallet format, with new bitcoin client) when Bitcoind loaded wallet with silent error. You have to know there are coins in wallet and then export the privatekeys by hand, then import them by hand on command line to even know if there are coins in the wallet.

Also, JSON is good, because you can pull out a single private key or address by hand. You have to do this on command line with Bitcoin.

The seed value is good, because as long as you have that, you wont lose the coins.

Multiple wallets in client is good (will be able to switch wallets from dropdown). Most people keep a small wallet (for mobile phone) and a larger wallet. People often delete wallets with coins in them by accident, because they have to rename, move wallets in bitcoind and restart client. Skycoin will have a button from creating a wallet from seed in the web wallet gui.

There are a number of polish issues. Such as if you write a wallet to disc, but the power goes out. The write will "finish but the hard drive didnt write the data to disc and your wallet is gone. So we can't overwrite the wallet, we write a new wallet, then we flush the disc cache by hand, then we rename the first wallet and then rename written wallet to first wallet, then we write random data over the old wallet, then delete it.  You have to make sure all of those steps occur.

If you don't overwrite the old wallet with random data before deleting it, then it can be recovered from disc. If every transaction generates a new address and writes a new wallet to disc, you might have 200 copies of the wallet seed written to disc after a few hundred transactions. Someone could scan the empty space on disc and possibly steal the seed value, even if the wallet is "deleted". So you have overwrite the wallet with random data before deleting it.

I want to get it working, then get skywire prototyped and come back to polish it to that level later.