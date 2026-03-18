+++
title = "Skycoin: Security for Next-Generation Cryptocurrency"
tags = [
    "Statement",
    "Security",
]
bounty = 8
date = "2017-12-13"
aliases = [
	"/statement/skycoin-security-for-next-generation-cryptocurrency/"
]
+++

In 2011, the Skycoin team launched a major research project to correct flaws inherent in Bitcoin. We redesigned Bitcoin from the ground up to create a next-generation cryptocurrency that was faster, more usable, and more secure than any previous coin. The result is Skycoin: the next step in cryptocurrency evolution.

Skycoin’s design philosophy is built on the idea that a simple, usable system provides the best security for its users. By creating a decentralized network that’s optimized for usability, Skycoin protects against attack and encourages transparency. Skycoin introduces a new cryptographic primitive called a public broadcast channel. It also uses Obelisk, a novel consensus algorithm implementation that solves issues arising from Bitcoin’s Proof-of-Work and mining processes. Skycoin security features include:

-	Improved ease of use and better security for non-technical users
-	Deterministic ECDSA and enforced signature mutability
-	Hardening against SHA256 pre-image attacks, hardening against side channel attacks
-	Hardening against “offline” attacks on secp256k1
-	Optional quantum computer resistant TwoStep protocol transactions
-	Standardized remote signature HMAC API for hardware wallet devices

By fundamentally rethinking cryptocurrency with the user in mind, Skycoin delivers a level of security far beyond what Bitcoin and other cryptocurrencies can offer today.

## Bitcoin’s Security Flaws

Skycoin takes a modular, layered approach to security. It addresses both the mathematical, technical attacks that compromised Bitcoin and the design and usability issues that create problems for the user.

Bitcoin’s security flaws include:
-	Individuals or groups that can purchase enough hashing power can revert transactions.
-	Individual nodes are vulnerable to adversaries that can influence a node’s consensus decisions.
-	Bitcoin exchanges are vulnerable to 51% attack.
-	Attacks and buying of options against Bitcoin are becoming more profitable.
-	States and corporations may attack the Bitcoin network to protect their financial interests.
-	Services allow renting of hashing power for majority attack.
-	Hackers can exploit security holes in routers and networking equipment to steal coins.
-	Bitcoin’s security requirements create large amounts of electrical waste, which is both costly to users and environmentally unsound.
-	Secure Bitcoin transactions take over 10 minutes and cannot be sped up.

Most of Bitcoin’s flaws result from its reliance on Proof-of-Work and mining processes. However, the POW algorithm and mining are fundamental to Bitcoin. The only way to fix these flaws is a complete redesign that provides a new consensus mechanism and a solution to mining. Skycoin’s public broadcast channels and Obelisk consensus algorithm do exactly that. By rethinking Bitcoin’s underlying structure, Skycoin provides a new type of network that addresses existential security threats and provides an airtight experience for the user.

## Obelisk and Public Broadcast Channels

Skycoin achieves security and transparency by using public broadcast channels. A public broadcast channel is a personal blockchain for each consensus node in the Skycoin network. Although the chain is visible to everyone, only the owner can mint blocks for it, and each block must be signed by the owner’s private key. The nodes are part of Obelisk, Skycoin’s consensus algorithm system.

Because there is a public record of everything a node does, the community can audit nodes for cheating or collusion. Public broadcast channels reveal how and why consensus decisions are reached. These channels promote transparency by imposing constraints on the blockchain:

-	Once a block is published, it cannot be unpublished. It spreads to all peers on the network.
-	Blocks are numbered in sequence, so that a node cannot publish another version of an earlier block without being detected.
-	Timestamps increase with block count. A node cannot backdate the timestamp on the receipt of a block.
-	A block in the middle of the chain cannot be changed without invalidating every block that comes after it.

Nodes in the Skycoin network function based on a “web of trust.” Each node has other nodes it subscribes to. Nodes with more subscribers – more “trust” – have more influence on the network. This network of relationships empowers the community to shift power away from untrusted nodes. If an attack occurs, the network severs connection with untrusted nodes, protecting the core. Since each node has a public record, the community can identify which nodes were involved and take the necessary action.

Obelisk and public broadcast channels create a democratic network of nodes run by the community. Node consensus is public and consensus is achieved based on a simple binary voting algorithm. Each node is accountable both to the community and to third-party audits. This solves the security and influence issues seen in Bitcoin, where hashing power can be purchased and adversaries can influence nodes. Skycoin’s system protects the security and transparency of the network and benefits all users.


## Protecting Network Value with Coin Hours

Skycoin solves Bitcoin’s issues with spamming and stealing coins by introducing a new mechanism called Coin Hours. In Skycoin, transaction fees are paid in Coin Hours, not in coins. A user earns 1 Coin Hour for holding 1 coin for 1 hour. Spending an output requires spending 50% of Coin Hours. The outcome of this setup is that in spamming transactions, a user’s Coin Hour balance is quickly depleted. Not only do Coin Hours deter spamming, they incentivize positive user contribution to the network, creating an atmosphere where valuable exchange is rewarded.


## Benefits of a Secure Crytocurrency

A digital currency should serve the user, not the other way around. The whole point of blockchain was to introduce a secure, fast, and usable decentralized system for value transactions. Developers of public ledger systems and associated cryptocurrencies aimed to remove the sources of unfairness and potential corruption inherent in traditional financial systems.

Bitcoin failed to achieve these goals. It developed numerous security flaws due to its reliance on POW and mining, and created an environment where influence could be purchased and networks were vulnerable to attack. Ultimately, the users shouldered the risk and the cost associated with maintaining Bitcoin’s increasingly expensive and ineffective system. They did not have access to a secure, fair public ledger system – in fact, Bitcoin’s network has become just as compromised, or more so, than the financial institutions it was designed to replace.

Skycoin delivers the security, usability, and accountability that users should expect from a cryptocurrency. It’s built on a democratic consensus mechanism that puts user experience first. Built on Obelisk’s web-of-trust, it eliminates potential threats to network integrity before they appear. Skycoin is streamlined, fast, and fair. With Skycoin, all users can enjoy the benefits of a decentralized and truly democratic blockchain network.

