+++
aliases = ["/ask-the-developers/ask-the-developers-4/"]
date = "2014-04-10"
description = "A weekly session where users can comment or ask questions to the Skycoin Developers in order to gain a better insight and understanding into the Skycoin Project "
draft = true
tags = ["Ask the Developers"]
title = "Ask the Developers #4"

+++
# Ask the Developers - Session #4

## Comment:
Quote from: **JessicaMILFson** on April 10, 2014, 02:20:17 AM
>When you launch, are you going to have video tutorials, or things explaining this? Because I have no idea what the above means. It seems more complicated than Bitcoin, and adoption is a big concern if there is no way to simplify this.

## Response:

This is for developers.  For end users, you will double click the icon and the wallet will pop up.

The bitcoin wire protocol is so complicated, no one knows how it works. I am leaving documentation on the Skycoin wire protocol that developers need to build applications.

___

## Comment:

Quote from: **l4p7** on April 11, 2014, 01:53:50 PM
>How many people are working in skycoin and will the source code be released completely, possibly also a client, before or during the ICO?

## Response:

Yes. The source code is on github.  We are trying to release client before the ICO.

There are a bunch of people working on it. We are trying to improve coordination between the different groups. We are hiring more developers after the ICO and assigning coin bounties to speed up development.

---

## Comment:

Quote from: CraigM on April 17, 2014, 04:39:45 AM
>Quote from: Chang Hum on April 15, 2014, 07:37:47 PM
>- Also I suspect the coder is a young teen from Hackforums (he's a bronnie and coupled with his writing style fits the demographic of an intelligent 12-14 year old scrypt kiddie from this forum)

>Is that supposed to be bad?

>I'd rather evaluate someone for their works than their age. Aaron Swartz was doing great work at 14. If Skycoin is a 12-14 year old, that says little more than potential to improve. It would make much more sense to criticize Skycoins slipping deadlines, or some other actual issue with the design or project than the age: thats just counterproductive (and without evidence). And really, being a bronnie wouldn't effect anything; it's not relevant.

>And now onto the real issues:

>So if I understand correctly, Skycoin is basically providing (in addition to a currency) tools for building a distributed reputation system. A personal block chain is a set of claims about the identity associated with your public key, and you provide a system to replicate and inspect it. The claims may have multiple signers, and the block chains of those signers may also be inspected.

>This basically provides (in a distributed manner) one of the key features of Silk Road: its a way to build reputations associated with identities which you can send messages and money to.

>However, users of the system (developers of software that uses these features) still have to sort out all the nasty issues: if you can make an identity with a block chain, you can make a billion of them. If trust can be built through relations, your billion clones will do very well. All of them can edit their block chains at well, and all agree with each-other while editing them, or throw them away and be replaced. I could instantly create an exchange that appears to have a long history of millions of transactions with millions of users (my clones). The moment it gets some money sent in, it can send it off into the pool, and create a new exchange with a similar history of transactions between other identities I control. You still need a robust web of trust to prevent this, and thats a hard (and non user friendly) problem to solve.

>Its a nice service to expose, but I don't see any particular benefits it offers, or great uses without cross chain transactions, which likely are impossible in such a case. If you could do bonded transactions (requires cross chain transactions), of have a system for assigning trust (like a clone of Ripple, thats not so amazing) it would be more interesting.

>Leveraging proof of stake by putting proof of sake in SkyCoin in your personal block chain (or signing your block chanin and putting that signature in the SkyCoin block chain) might be useful here. However, the same skycoin can can be mixed and reused to sign your next fake identity (or next million of them), so I don't see how that helps at all, unless you rely on using coins that haven't been transferred or used for trust in a long time. That however destroys fungibility and encourages handing over private keys instead of creating transactions (the value of non transferred coins would be higher): that would wreck the currency.

>I just don't see whats so great about it: it doesn't solve distribution of trust or sybil attacks as far as I can tell.

>I should note that I'm not saying such a system is not totally useless: if you already have a system for assigning trust, it would be a perfectly fine setup for replacing our existing SSL certificate mess for example (Each authority and sub authority gets a block chain, replicated as needed). Nothing very new there, but the libraries could be useful for that kind of thing.

>Personally I find NxtCoin's Colored Coins http://www.nxtcrypto.org/nxt-technology/nxt-colored-coins more powerful since they are tied to the main block chain. You can have your own personal info associated with them, but you can also involve them with transactions trustlessly since they are part of the main block chain (no need for cross chain transactions). Associate those with contracts and you get a system that still doesn't solve the entirety of the exchange problem, solves more of it than personal block chains do.

>I could create my own currency/block chain with NxtColored coins. I set their value to be 1 btc. I could then securely trade my colored coins for how ever many Nxt a Btc is worth at the time. I'd still need to go off chain to give real Btc for one, but it could be securely traded for someone else's colored coins that represent Btc, or Doge for example. Its not a complete solution (no cross chain transactions with existing currencies), but it effectively allows secure cross chain between all Nxt bases currencies / colored coins. Thats pretty useful, and not possible with personal block chains.


>In short: I don't think all the grand claims about features possible with personal block chains are that great: personal block chains might be a fun toy for devs, but they only solve a small part of the problem (part of the tooling). Nxt offers more powerful features that do more to help implement these kinds of things. Skycoin could support colored coins though.

>A modular design that allows easy code reuse for things like personal block chains is great, but I don't think the grand claims about them are warranted: focus on the core feature, the consensus algorithm. Grand claims about that are more interesting and details would be even better.

## Response:

>or have a system for assigning trust (like a clone of Ripple, thats not so amazing) it would be more interesting.

Yes. You could implement Ripple (the old original Ripple, not the new Ripple) on top of it. The important thing is making it easier for developers to build new stuff and creating a system where this stuff is exposed and interoperable while developers experiment.

As you pointed out, messaging and identity are very important. If you can message an address, it means they can give you newly generated addresses for each transaction. You can send the amount to 5 addresses instead of 1 address with change. It increases privacy, security and you get a transaction receipt from the person.

>This basically provides (in a distributed manner) one of the key features of Silk Road: its a way to build reputations associated with identities which you can send messages and money to.

Yes. Merchants could post things they have for sale in their personal blockchains. It would form a distributed market.

>In short: I don't think all the grand claims about features possible with personal block chains are that great: personal block chains might be a fun toy for devs, but they only solve a small part of the problem (part of the tooling).

Yes, this is incremental. However, crytocurrencies need these tools to advance to the next stage of development. These tools and standards are the TCP of the crytocurrency movement. They are the building blocks for the next stage and for applications that have not been imagined yet.

___