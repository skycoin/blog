+++
aliases = ["/development-updates/development-update-51/"]
date = "2015-01-20"
draft = true
tags = ["Development", "Skycoin"]
title = "Development Update #51: Skycoin Crisis Tolerance and Mitigation"

+++
We had a productive day yesterday. Some people were able to get builds working immediately. Other people had problems with golang and path issues we are working through.

##### We launched the blockchain after a few hours of work. Fixed half a dozen bugs.

- Several changes to build script
- Updated gvm curl build flags
- Updated to go1.4
- Fixed bug with genesis block timestamp not accepting configuration setting
- Improved transaction malleability (more on this later)
- Fixed fprintf formatting bug in wallet names

##### Now:

- I am refactoring /src/gui
- The wallet format on disc is JSON. This avoids the dependency issues in Bitcoin's wallet storage format. However, it is not pretty printing the JSON, so fixing that.
- Adding function for querying outputs for arbitrary addresses
- /src/gui calls to /src/daemon which calls to /src/visor for wallet operations, which calls to /src/wallet. I am refactoring so that /src/gui calls to /src/wallet directly. This will remove 1,500 lines of code without reducing functionality. This is something I have been trying to do for months.
- Then I will call in the GUI/web wallet dev to update the wallet HTML/javascript/angular.js
- then test coins will be transacting across the network

Then we will live code the trading bot, test it with Bitcoin. Then start trading for real!

## Skycoin: Transaction Malleability

###### A crypt-coin does two things:

- Check balance
- Send

###### So as an application, a coin is very boring by itself.

- Ethereum tries to make it more exciting by adding new features and infrastructure.
- Dogecoin tries to make it more exciting through marketing, memes and emphasis on the user community
- Ripple tries to be something that is optimized to be purchased and controlled by Visa (all the consensus nodes controlled by banks and so on)
- BitShares X (Bytemaster) adds new types of assets and asset pegs, creating USD and gold equivalents which are collateralized by Bitcoin
- StoreJ adds a service offering to drive capital inflows into the coin

###### Skycoin has combinations of these:

- A service offering
- An application infrastructure and set of libraries. Ethereum is at one extreme of putting everything inside of the blockchain (a full turing complete language on the ledger). Skycoin is at that other extreme of putting nothing in the blockchain except coins and transactions (pushing contracts onto personal blockchain and off the main ledger).

###### More fundamental, the majority of the work and design in Skycoin so far has been on the extremely boring fundamentals of:

- Check balance
- Send

###### This may seem trivial but it is actually done poor by every existing coin:

- Bitcoin's default client is unusable. People have coins stolen daily because they are forced to use insecure web-wallets over usability concerns.
- Bitcoin is not easy to understand and people often lose coins because of differences between what it does and what they think it does (such as losing coins when loading a wallet from backup after 200 transactions).
- Bitcoin's long term survival is not a matter of mathematics, but a matter of social institutions and the honesty of a small number of mining pools.
- Mining pools selling off 500k/day of Bitcoin are pushing the price down and this might not good for the long term.
- There are severe issues in Bitcoin that cannot be fixed. Only a small number of experts care about these edge cases but they become important in a crisis.

The inner details of Skycoin's blockchain design and it differs from Bitcoin only interest a very small number of developers. The improvements Skycoin makes in these areas are not visible, like improvements to the wallet GUI. They only become apparent or important in a crisis.

## Transactions:


###### Overview of Skycoin/Bitcoin. Most people do not understand what a "transaction" is in Bitcoin.

- There are unspent outputs. they contain coins.
- A transaction consumes outputs
- A transaction produces new outputs

You must spend a whole output. If there are 10 coins, the whole output is consumed. You cannot partially spend the output. So to send 5 coins to someone, you send them 5 coins and send 5 coins back to yourself.

- You have 5 coins in an output and want to send 2 coins to someone.
- You create a transaction that spends the output, creating two new outputs
- One of the outputs sends 3 coins back to yourself (change)
- Oone of the outputs sends 2 coins to the recipient
- Outputs are tied to addresses.
- To authorize the spending of an output, you need the secret key for the address the output is tied to.
- You don't "own" Bitcoin in the same way you own gold (by possessing it). Instead of "owning" 10 bitcoin, someone "knows 10 bitcoin".
- They know the secret that allows them to authorize transactions with the Bitcoin in those addresses.
- "Ownership" of bitcoin is about "knowing" rather than "controlling".
- The Bitcoin do not exist on your computer, but only the secret key needed to authorize valid transactions from an address.
- The balance of the address is the number of coins in "unspent outputs" for that address

Outputs are named by hashes. In Bitcoin a transaction might be identified as

590f7f552aedb219ff814331201a97c3467b08d590016991c4d31dfdcd4b88ce

The transaction may have three outputs.

590f7f552aedb219ff814331201a97c3467b08d590016991c4d31dfdcd4b88ce:0
590f7f552aedb219ff814331201a97c3467b08d590016991c4d31dfdcd4b88ce:1
590f7f552aedb219ff814331201a97c3467b08d590016991c4d31dfdcd4b88ce:2

In Skycoin, there is an explicit output set. Outputs are actual data objects and part of the blockchain "state". Transactions are functions that act upon the blockchain state. Transactions consume outputs in the state and create new outputs.

## Malleability

Malleability means that someone can take a transaction and modify it, so that it is still valid but the hash is changed.

- in Bitcoin, the output is named by the transaction hash
- in Bitcoin, anyone can take a transaction and modify it, so that it is still valid but has a different hash. Even if they do not know the secret keys for any address for any of the inputs used in the transaction. This is non-intuitive and subtle but has implications in a crisis, such as a blockchain fork.

If there is a chain of transactions
T1
T2
T3
And each transaction spends, outputs created by an earlier transaction. Then if the hash of T2 is modified, transaction T3 becomes invalid. T3 is trying to spend an output that does not exist. This only becomes a problem in a blockchain fork or 51% attack scenario.

###### There are three levels transaction malleability

- Anyone can modify anyone else's transaction output hashes, without being a party to the transaction. This is the level Bitcoin is at.
- Any party to the transaction can modify the output hashes. At least one private key for an output address spent in the transaction is required.
- The transaction outputs are mutable. A new transaction can be created, but the outputs cannot be changed by anyone. This is level enforced by Skycoin.

###### In the event of a major attack or blockchain fork on Bitcoin

- Anyone can modify anyone else's bitcoin transactions when copying them to the fork of the chain. This will invalidate swaths of later transactions, which depend on the hashes of the now modified transactions. The scope for damages is unlimited and everyone performing transactions over the interval of the attack, will have unpredictable coin balances after the attack.

## Effect of Signature Malleability on Loss Ratio in Crisis Scenario

A transaction invalidation attack, is any attack where a previously executed transaction is revocated and some of the outputs spend by the transaction are spent into different outputs. This only happens during blockchain reorgs, forks or other crisis scenarios.

## In Skycoin:

- If the chain forks or an attack occurs (which should be impossible, but may occur anyways), then your transactions can always be copied from the old chain and executed on the new chain and the resulting balances will always be the same, as long as certain conditions are met.
- Only chains of transactions that involve a malicious party, who specifically and intentionally spends a particular output to a different address on fork A than occurred on fork B affect final balances. If you did not transact with the malicious party and your outputs did not originate through a transaction chain involving the malicious party, your balances cannot be affected. The private key for spending at-least one input for a transaction is required to effect an attack on a particular transaction (which may affect later transactions).
- A user can only perform this attack on transactions involving outputs whose addresses they control the private key for
- This means that a 51% attack or fork has limited scope for damages for most users and especially users who take precautions. The damages in Skycoin are limited and controllable, where as they are potentially unlimited in Bitcoin (potentially all transactions are affected as anyone can change the output hashes when copying the transactions between the blockchains). Services such as exchanges, which are performing high volume transactions with large numbers of users will be hit the hardest by this crisis scenario.
- If there are weekly checkpoints that are immutable, then an absolute guarantee against loss is possible. Example: A large transaction is received and is not moved until the next checkpoint. No attack is possible that would now redirect that balance to a different address or invalidate the transaction creating it.
- Skycoin loss ratios are computable. It is possible to to calculate the worse case loss of coins in the event of a blockchain invalidation or fork, from a transaction invalidation.
- Segregation of funds can reduce loss ratios. Funds received from random users at high risk malicious behavior can be segregated from transactions and funds of trusted counterparties (banks, exchanges, peers).
- Funds from each user can be segregated. If thousands of users have deposits in an exchange and receive addresses are segregated, then loss of funds from a transaction invalidation attack, may be recovered from individual users whose transaction chains were affected (participants in the attack), rather than from the whole pool of users.
- If an exchange mixes outputs from 1000 users and the private keys of 5 users are involved in the attack, then the impact of transaction invalidation is greater if the outputs received from each user are mixed, rather than segregated by user.
- The beneficiaries of the attack can be clearly identified and are district from honest users.
- The malicious branch of the chain tree where outputs have been retroactively modified can often be clearly identified as an attempt at an attack. Especially when the chain contains a large number of coinjoin transactions.
- The "quality" and "risk" of each received coin output can be calculated. An output generated from outputs, which are older or past the last immutability checkpoint, have significantly lower risk of invalidation in an attack than outputs which are dependent on large chains of transactions since the last checkpoint. Exchanges may require longer holding periods before releasing full balance for coins at higher risk.

###### This is extremely important. In a crisis, the number of users affected is limited:

- Users which did not transaction during the crisis did not have their balances affected
- Only a minority of users are affected or have changed balances, limiting scope for damage
- The impact on the price of the coin is limited
- Controllable risk is better than uncontrollable risk

## Survival of Crisis

Transaction malleability has effects

###### In Skycoin, if an attack succeeds at introducing a fork then there are several remedies

- The differing outputs between the chains will be limited
- Cold store will be unaffected
- Personal transactions between people or companies not involved in the attack will be unaffected
- High volume, automated transaction processors will be affected the most
- Don't choose between chains. Run both chains. A transaction is only considered executed if its in both chains
- Coins in outputs that differ between the chains should be frozen. Blocks that have transactions which attempt to spend contentious outputs should be rejected in the consensus process
- Have users figure out which branch is the attack branch and then prune it. This has to be done by hand and through human choice, instead of algorithm.
- We may not have to resolve forks algorithmic at all
- The nodes involved in the attack need to be identified and flagged. People should prune connections to these nodes from their subscriptions

There are several steps to prevent it from getting this far, such as local timestamps, distributed timestamps.

###### In Bitcoin, if there is a fork:

- Every transaction is up for revocation because of multiple forms of malleability. The victims will be random and potentially every transaction on the time interval of the attack.
- Cold store will be unaffected
- Personal transactions between people or companies will be affected if they spend the outputs (transaction malleability)
- High volume, automated transaction processors will be affected the most
- Bitcoin price will drop as people panic sell
- Mining difficulty will drop as price drops as miners turn off equipment
- A person who rents, already owns or acquires at firesale prices 20% of mining capacity can now 51% attack the network repeatedly if hash rate drops to 20%
- A 51% attack over less than 8 blocks from the head, can be made irrelevant if clients are patched to not make transactions that spend outputs that do not have atleast 8 confirmations.
- An attack spanning over a day or more of transactions would cause problems for high volume services.
- Bitcoin would be patched and probably survive, but volatility would be increased.

Bitcoin has a simple failure case, but when it does fail it is very difficult to "fix". There is not an effective response or remedy to an attack and there is only limited scope for preventing similar future attacks.