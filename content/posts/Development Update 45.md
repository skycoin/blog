+++
aliases = ["/development-updates/development-update-45/"]
date = "2014-12-17"
draft = true
tags = ["Development"]
title = "Development Update #45: Skycoin Utility and Price Control"

+++
The Skycoin project is larger than "clone litecoin, change logo and call it Dogecoin". There are multiple parts and it took time from going from a single coder or small group of coders to a structure that can handle the multiple parts of the project. Then there is a larger architectural issue, about what the scope of the project is, what the long term goals are and what the objective for a second generation crypto-currency should be.

Just the coin itself is a massive undertaking. The scope and architecture of the coin has changed significantly over the last two years. Issues such as usability, what the API should look like, security issues, determinism, what the components are and how they should interact. During development we identified several hundred different aspects of the coin, which are individually very involved and each affected other components and design choices subtlety.

As an example, here is how our conception of handling the API/wallets evolved.

###### In Bitcoin you run a local node and it loads wallets from disc. The node authorizes transactions from the wallet it had loaded.
- This is simple, naive, it works
- It does not allow you to expose your node's API to network, to allow queries for thin clients without allowing other people access to your wallet
- It was designed for this use case, so the API is missing things, like ability to get unspent output set or balance for addresses in wallet

In Skycoin, we originally we originally intended to have ability to load multiple wallets and unload them and maybe a user system with permissions.

Then two months ago, we studied the Obelisk API. The API does not load wallets, but gives you functions for checking the unspent output set for an address, checking balances for address and injecting transactions.
- The API does not load wallets
- Anyone can expose their node's API to the network and anyone can use it to check balances, get unspent outputs or inject transactions
- A client using a remote server or a local server goes through the same API

Then this creates a two layer structure. The first layer is the base API, maybe called the Node API
- Check unspent output set for an address, check balances for an address
- Given set of outputs, give me transaction that spends the outputs, so I can sign it with my private keys and inject it
- Inject a transaction

###### The wallet, is at a higher level and keeps track of addresses and private keys:
- The wallet queries for balances and unspent outputs
- The wallet creates transactions, uses private keys to sign the transactions
- The wallet injects the transactions through the base API

This may seem trivial. You have wallet and are checking balances and sending coins. It does the same thing. To the end-user it looks exactly the same as Bitcoin. However for developers it is a 10x improvement
- A cell phone, now only needs a json client and to be able to store and create signatures with private keys and has the capacities of a full node with a copy of the blockchain. This means people in Kenya, who cannot have the full blockchain can use it as effortlessly as someone in the first world with a local node.
- A user can have multiple wallets
- A small standard library for key storage, signing and API improves security.
- Users who want to use default send can, while users who need to choose which inputs to spend and how can create custom transactions (which Bitcoind is unable to do)

This architecture is a very small change and its not immediately obvious that it is an improvement. However consider the following application and effort required to implement with the Bitcoin API, vs the revised API.

A person in Kenya with only SMS but not internet could potentially use the second API, even on phone with a 16 bit processor. A "Kenyan Wallet", might be all coins stored in single address, with SMS from a trusted gateway when a new output is received into their address. The SMS client would be notified when it receives new coins (outputs for its address), the client can say "Send 4 coins to XYZ" and then transaction and transaction hash is sent back (about 140 bytes), the client checks transaction, signs it with the private key stored on the phone and then texts it to gateway. The gateway then injects the transaction to the network. So we can do transactions in two text messages. The gateway can use the public key of the person to send the message encrypted for privacy, so no one but the user and gateway know what was sent, how much or to who. The cell phone operator cannot impersonate the gateway, without the gateway's private key. The client can verify the destination of the transaction and hash before signing it, so the gateway cannot steal coins or redirect them to another address.

With Bitcoin, implementing this application would require a full node-rewrite and then keeping it updated and merging in changes to Bitcoin. It would be a massive undertaking, just to be able to check address balances for an arbitrary address. With the second API, you have a small program that can create signatures with private keys, compute public key from private key and which stores the wallet. It may have to be ported to C to compile on the 16 bit phone but its trivial. Then you need to make the gateway check the balances with JSON query and inject transactions with a JSON query. Then the gateway, written in golang, needs a library for sending SMS messages.

## Corporate Usability

Very small architectural changes have very significant impacts on the applications that will be developed. In particular, limitations of the Bitcoin API and usability considerations have driven merchants to use Bitpay. Few companies have the resources to do an independent implementation or modification of the full node, merely to accept Bitcoin payments.  A company embeds javascript, receives Bitcoin and gets paid in USD through a third party. This was not the original intention.

Similarly, most export company have multiple sales associates taking payments. They may accept Bitcoin, but right now each sale associate has to have their own node and receive payments and then funnel it into a corporate address. It is impossible to build the "user wallet" system a company needs to accept Bitcoin in an easy work flow.

The existing workflow in one export company, for accepting Bitcoin payments
- A customer contacts the sale associate and aspects for particular goods, with payment in Bitcoin
- A sales associate, receives a request for goods and creates an invoice in the company's invoice system
- Then the sales associate asks a financial manager, for bitcoin address to give the customer
- Then the sales associate receives the address and communicates it to the customer
- Then the customer sends the Bitcoin payment for the invoice and notifies the sales associate
- Then the sales associate (who doesnt know how to check if payment went through), asks the financial manager to confirm the payment
- Then the financial manager communicates back to the sales associate that the Bitcoin payment cleared
- Then the sales associate notifies the customer that their order is complete
- Then the sales associate marks the invoice as paid, then forwards the invoice to the shipping and distribution department
- The financial manager is responsible for a certain number of sales associates, at end of week his invoices are added up and the Bitcoin balance received is calculated. Then that is transferred into a main company wallet.

This system is very complex, however it is designed so that the sales associate cannot steal the Bitcoin and so that the financial manager cannot steal the Bitcoin. There is a paper trail, showing how many Bitcoin were invoiced and should be in an account. The owner can check he is not being stolen from by employees.

Companies are eager to accept Bitcoin, but the process is frustrating. If the financial manager is sleeping, the sales associate cannot mark the invoice as paid and there are various complications. The account manager, doesnt create new addresses for each invoice, but reuses the same address for a whole week, then adds up the invoices at end of week to make sure balance adds up. If the balance doesnt add up, he has to go back through every Bitcoin transaction and there is a problem if the payment was split over multiple transactions.

Existing payment systems are very poor, but Bitcoin is still currently more frustrating. Bitcoin needs to be less frustrating, not more frustrating than legacy systems.

The company requires a way of having multiple wallets and restrictions on the wallets. They need to be able to associate individual addresses with transactions with invoices #s . The sales associate needs to be able to generate addresses for invoices and know immediately when they are paid, but should not be able to transfer coins out. Each company has their own system and integration needs to be something that can be implemented with low skill in PHP (most small companies do not have the developers required for a full node implementation). It has to be idiot proof. The company needs to know that if their server is secure and only the API is exposed, that the Bitcoin are safe and subject to certain guarantees. They will want the balance in online wallet minimized. Security has to be simple to achieve.=.

The system has to be simple enough that it is easily understood. One of the biggest failings of Bitcoin is that it is nuanced. It behaves in unexpected ways and requires too much specialized knowledge to use properly. None of the hundreds of people running Bitcoin sites, ever imagined that transaction malleability or signature malleability existed and even fewer understood what implications it could have. There was panic, fear, uncertainty. They began to be aware of how many factors were out of their control and in some sense that Bitcoin was too complex to be "knowable" without significant effort.

People expected that when they restored their wallet from backup, that the coins would be there. However, people with over 200 outgoing transactions found that coins were missing. They did not know that change addresses for transactions were going into newly generated addresses not in the wallet backups.

The requirements for usability, security are immense. The existing system of currency, transactions, commerce and accounting is being redesigned from scratch. In many ways, Skycoin is being crushed under these requirements. There are a few minor changes that may be made in future, but we believe we can now freeze out changes to the core architecture. The final coin, looks identical to the design three months ago but we are more confident that there is not a better architecture for meeting the long-term requirements.

## Inflation

We have been debating whether a coin needs inflation for over a year. We believe any inflation mechanism in the coin, is a threat to survival on a geographic timescale. We are morally opposed to inflation and believe there will be temptation for future developers to increase or modify the inflation value in the future. Inflation privileges and empowers a single group, with the receipts of the money created through inflation. It creates a surface for attack. It also makes the performance of the coin dependent upon the competence of its management.

However, if 1% of currency is created each year and invested in activities that increase the value of the coin network, by more than the cost, then doing so maximizes the value for all coin holders. If $1 in investment in meshnet deployment, PR, advertising or lobbying nets $5 in coin market cap then coins which use this mechanism will out-compete coins that are unable to. The market-cap and values of coins pursuing this strategy will grow significantly faster than the alternative.

In this perspective, coins are like stocks or corporations and have issuance and redemption. A coin does not have profits or offer services directly like a corporation. The value of the coin depends on both its use as a standard, a store of value and in the skill of the managers and community in increasing the coin's long-term value (an investment instrument).

One possibility, is that there will be no universal dominant standard or store of value in the future. The relevance of gold as a standard and store of value over geographic time scales, may have been a sociological anomaly. The future may be a competing market of assets, whose prices rise and fall with changes in their relevance, utility and the power each asset has to impose itself.


##### Goals:
- Usability improvements
- Security
- Marketing/PR/promotion
- Ecosystem and application development
- Expansion/growth
- Buying political influence and representation in jurisdictions which stand to benefit from adapting liberal regulatory frameworks
- Software integration for commerce, banking and export sectors which stand to benefit the most from adaption

In Skycoin, the meshnet and services are federated. The infrastructure is owned and operated by the community and the development organization is not in a position to extract a tax on service revenue. Therefore this is not an option for funding expansion.

We chose to finance, from distribution events of a fixed pool of assets and the founders contribution of early Bitcoin. However, we found that this resulted in under investment. The core team is making steady progress and can complete the existing project scope (at a much lower cost than other projects at a higher quality level, Ripple, ETH but slower). The next stage of the project is expanded in scope and aggressive expansion will require a higher resource intensity and a larger number of project teams and external partners than the software development. As many as eight distinct project teams, external design firms and manufacturing partners may be involved, from design to production of just the hardware portion of the meshnet.

## Factors concerning price stability: creating stable stores of value

Another aspect rendering the current model non-viable, is price stability. One of the core requirements for Skycoin is price stability. Bitcoin intraday volatility is too high. Companies adapting Bitcoin for international trade are unable to hold balances in Bitcoin, without substantial foreign exchange risks. A daily swing from $330 to $315 or monthly swings from $400 to $320 completely precludes Bitcoin for use for settling international trade. Companies cannot hold long-term Bitcoin balances and are forced to liquidate receipts, to local currencies immediately.

Skycoin introduced a method called "the capital ratchet" to lower intraday volatility and reduce speculation, using a fixed pool of Skycoin allocated at the beginning. The method works as long as Bitcoin remains stable. However, if Bitcoin fails or experiences significant volatility then the method fails and eventually exhausts the capital allocated to the strategy. Through simulation, we determined that maintaining a stable currency level and low volatility required an active and constant input of funds. Maintaining a floating peg against speculation may consume 0.2% to 0.6% per year of the market cap of the currency. Maintaining a floating peg may require an inflation mechanism to fund the acquisition of reserves to offset volatility by speculators.

The cost however is offset by the increased market cap and growth of the coin. How much more would Bitcoin be worth today, how much more adaption would it have in commerce if it had stable price levels? We believe that the relationship between volatility and market-cap is substantial.

We also determined, that Skycoin cannot be passive with respect to the exchange infrastructure. Skycoin needs to devote substantial resources to open source development and research into new cryptocurrency exchange infrastructure.  Skycoin cannot achieve the level of price stability required under the existing paper alt-coin regime.

An exchange can add a Litecoin to an account in a database and then a user can sell that Litecoin. The litecoin may not exist and the exchange may have to buy the litecoin, to cover a withdrawal. An exchange with withdrawal limits or withdrawal fees, engaged in heavy manipulation, may be solvent indefinitely. An exchange, suffering insolvency may silently and secretly haircut a fraction of users balances and there is no indication to the user that it even occurred. There is no way to prove that reports of stolen funds are real, instead of an anonymous attack on honest exchanges by dishonest competitors.

This is a subset of the problems we must address over the next twelve months. Skycoin balances and Bitcoin balances, therefore must be held in the local wallet. Exchanges must go through a common API, integrated in to the wallet and positions must be moved back into the local wallet automatically, so that the exchanges are holding no net coins. That is the first step. Until this is achieved, there is unlimited scope for price manipulation in every altcoin.

This is the only way to create absolute guarantees against the manipulations we are seeing in other altcoins. In other words, we have an exhausting amount of work to do, even after launch.