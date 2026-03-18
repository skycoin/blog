+++
aliases = ["/development-updates/development-update-60/"]
date = "2015-02-27"
draft = true
tags = ["Development"]
title = "Development Update #60: Skycoin Protocol Update"

+++
## Research Update:


##### Homomorphic Secret Sharing

I think we now have homomorphic secret sharing for for secp256k1. This means that Skycoin can do multisig transactions without having an explicit multisig transaction. Multisig transactions happen outside of the blockchain are not a different transaction type than non-multisig transactions. There is no way to tell them apart on the blockchain.

##### Background
- there is a basepoint b on the curve
- there is a group operation that takes two points on the curve and generates a new point on the curve
- you apply the base point to itself N times as the operation (exponention of the base point in the curve)
- You choose a random 256 bit integer, N. This is your private key. Your public key is the base point raised to the power of N

##### You have two people
- one generates a private key N and public key P
- the other generates a private key M and public key Q
- They exchange public keys. Each other raises the other's public key to the power of their private key
- They both arrive at the same public key
- They hash the public key to generate an address

This is implemented in the cipher module as cipher.ECDH(seckey, pubkey)

That is the multisig address. The coins at that address can only be spent if one of the parties obtains both the private keys.

So for A to send coins to B, then A discloses the private key N to B. Now B can spend the coins but A cannot. So B owns the coins. The coins have been transferred, without the "transaction" being on the blockchain or the address even have been changed. B can now move those coins.

The question is whether one of the parties can choose a "weak" private key that allows exploitation (faking a signature or allows the private key of the other party to be easily calculated). It has to be proven, that if a weak key can be found that allows signatures to be faked or the private key recovered, that it allows the solution to the discrete logarithm problem on the curve.

For instance, if someone chooses a small private key, then they can recover the other persons key if it is possible to do square roots over the elliptic curve operation. However, the square root operation appears to be equivalent to solving the discrete logarithm problem (however, not certain).

## Continuous Settlement and Clearing

We still need explicit multi-sig with timeout eventually, for exchange infrastructure and settlement. This allows an infinite steam of micropayments of potentially millions of payments, with only a single transaction appearing on the blockchain.
- A puts coins in multisig output with signatures from A and B required to spend
- the output becomes spendable by A alone after a week (to prevent coins from being held hostage)
- A and B settle every minute (millionths of a coin) and create a valid multisig transaction with the updated balance, paid from the coins A put into the output. However, the transaction is not published to the blockchain until very end
- If B disappears, then A will get their coins back after the lockup period. B cannot steal the coins without signature or private key from A.
- A cannot double spend the coins to another address without B
- we may need to place a "max time" property or ensure that earlier transactions do not settle before the largest transaction if the whole transaction stream is published.
- B loses coins if an earlier transaction from the stream is published, so A will be attacker. If there is a max time that each transaction can be published and is valid, theft is limited, but A can get their coins back if they knock B off network so window expires. Then B will be unable to execute the spend transaction. There are a series of problems here that make this not simple.

This allows continuous settlement and clearing between peers, without going through blockchain at all, until the transaction is finally published and executed. This is the cornerstone a decentralized exchange infrastructure.

Skycoin settles in a second anyways, so this is more useful for Bitcoin. It is technical curiosity and I am not sure how useful it will be. It is definitely useful for Bitcoin because of longer block time, but does not seem to add anything to Skycoin and only increases the technical complexity.

## Minimalist Protocol

The simplest protocol, uses the 2 of 2 homomorphic ECC multi-sig in the first part, with a timeout that allows an output to be spendable without a signature, but only to a specific address. This is a standard transaction with a timeout, that allows it to be spendable to particular address after certain time, if it has not otherwise been spent.

On balance, I still have not found a use-case where the complexity, security and attack problems from a scripting language are balanced out with something more than 1% of users will ever use.