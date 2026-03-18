+++
aliases = ["/development-updates/development-update-43/"]
date = "2014-12-09"
draft = true
tags = ["Development", "Consensus", "Skywire"]
title = "Development Update #43: Consensus, Mesh-net and Skycoin Core Update"

+++
## Consensus Algorithm

We have a new member on team focused on the consensus algorithm. His work has been great and we are making a lot of progress.
 We now have a discrete event simulator in Python and have tested several candidate consensus algorithms on real world social graphs from the wikimedia admin dataset. Failure modes such as collusion, or nodes timing out have been implemented and tested.

The naive consensus algorithm, converged quickly enough for 15 second blocks. Refinements to this algorithm have been developed which have significantly faster convergence rates. I think the main consensus algorithm will be ready to be written in Golang and moved into the code base within a few months.

The single round decision context is worked out. It is much simpler than Ripple. It can be understood by a human. It can be modeled mathematically. Simulations can be performed against different attacks easily. The implementation will be only a few hundred lines of code after libraries are pulled in. Consensus occurs in public, so it can be audited for manipulation by anyone.

This system will quickly eliminate need for PoW for securing blockchains. I will leave analysis of the algorithm and its advantages till after release.

## Meshnet Update

It has been two and a half years since the begining of project meshnet and OP redecentralize.

https://www.youtube.com/watch?v=1tEkyLOh-tY

In July we finished implementation of the basic meshnet/darknet. Upon testing, we discovered that Wifi is unable to provide the range or bandwidth required for a viable meshnet.

We do not believe that is feasible to build a viable meshnet with 802.11 on the 2.4 Ghz band. We determined that if every third house in city, had a meshnet node, the nodes would be unable to connect to each other. 802.11n devices are using multiple bonded overlapping channels and competitive transmission power. Attempting to connect two meshnet nodes over a house with an 802.11n device, results in the device increasing transmission power until the link connectivity fails.

The range of devices on the 2.4 Ghz band for 802.11 will never exceed 500 ft and beamforming had not resulted in significant range improvements for wifi. However, free space performance is very good. 100 Mb/s, 50 km line-of-sight links are easily possible for backhaul. Signal attenuation is less than 0.2 dB per km in free space.

There was debate over whether we should go forward with distribution until we are certain that we are able to deliver a working meshnet.

After nearly six months of research and testing, we have found solution to the range limitations. We believe a viable meshnet is possible. However, the work required is significantly more than anticipated. We need FPGAs (later ASICs), directional antennas and to develop a software defined radio platform for operating on the 600 Mhz to 700 Mhz whitespace bands. We have a few hundred pages of notes on the radio requirements that are being edited, organized and prepared for publication.

## Cryptosystems for Geographic Time Scales: Future Proofing Skycoin

Gold has retained value for thousands of years and had relatively low interest rates. Bitcoin may not survive on that time-scale because of social and technological advance. Gold may lose its scarcity if future improvements in robotics or mining technology dramatically reduce cost of gold extraction. Future advances (such as robotics) may allow mining large quantities of previously inaccessible gold veins deep in the earth, on the ocean floor or in space.

Gold may fail as a store of value, within the next hundred years. As gold prices increase, more deposits become profitable to extract from. This price dynamic puts a price ceiling on gold. If price increased 100x, then ocean floor production or marginal productivity mining sites become profitable, and supply increases, until the supply meets the demand curve.

Mathematics such as cryptography allows us to create new assets, which are scare and superior to gold in many ways. However, there is no insurance that these mathematics/software systems can be stable over hundreds of years of technological and social change.

## Future Proofing Skycoin: Salted Hashes at Network Level

Bitcoin, Skycoin's hashing and cryptography algorithms will be vulnerable within twenty years. Skycoin can survive complete vulnerability and defeat of SHA256. There are two methods for this

##### Salted Hashes:
- Each person generates a random "salt" and the data to be hashed is salted.
- The SHA256, the salt value and salted hash is sent.
- You download the data for the hash one peer. (you want to verify the data you received is not different than the data other peers have for same hash, even if SHA256 is easily preimaged attacked)
- You have the salted hash of the data, computed by a list of user selected trusted peers and all the peers you are connected to.
- You compute the salted hash of the data received, using the salt value, for each for the trusted peers.
- If the salted hashes match, for each peer then the data is correct.
- If the data was modified, so that it has same SHA256 hash as intended data but is something else, then its easily detected.

If the internal state of the hash algorithm, between rounds is N bits and the hash salt value is M bits and its validated against n peers, then if n*M is greater than N, then it is not even possible to generate a piece of data that will pass the n salted hash checks (with probability 1).
- Even if the hashing algorithm is completely weak (you could use XOR function), as long as outputs of hash are "random enough" function of the input and salt value
- Even if the opponent knows the peers and salts that the hash will be validated against.
- We can prove this with Kolmorogov complexity theory.

## Future Proofing Skycoin: Rolling State Hashes at Blockchain level

Salted hashes are very useful for validation at the network level, assuming the hashing algorithm is broken and weak against preimage attack. This is one way of future proofing Skycoin so that will continue to operate, regardless of future mathematical or computational advances.

Another future proofing mechanism, is that the Skycoin blockchain state is functional and has canonical binary serialization. If S is the state of the block chain and B is a block, then there is function mapping S x B -> S. The block is applied against the state and there are no side effects, in that output only depends on the two inputs.
- A block is validated transaction by transaction (to make sure they are valid)
- The transactions are validated against each other (to make sure they do not double spend the same inputs or conflict)

There is a canonical binary serialization of the outputs and the "state" of the blockchain. As operations are applied that change the blockchain state, the inputs to these operations can be rolled into a hash. Each block must have a matching hash, for the internal state which it was created to be applied against.

This means, that two clients will only arrive at the same internal state hash from the genesis block, only if they applied the same sequence of blocks. Even if SHA256 is broken completely, there is no way to generate a valid sequence of blocks that will be accepted for Skycoin. For Bitcoin, if SHA256 is broken, an adversary may be able to construct and insert a modified block between two blocks in the chain and it will be accepted.

These safety measures at the network and blockchain level were developed, after analyzing Bitcoin against "oracle attacks", where we assume a god-like computer can do arbitrary SHA256 preimage and collision attacks attacking the blockchain.

## Future Proofing Skycoin: Cryptography For Geographic Timescales

Can a software system based upon cryptography operate securely for hundreds of years, despite future advances in mathematics?

secp256k1 will be broken or insecure within a few decades. The development of a quantum computer would eliminate the security of existing public key systems. RSA, secp256k1, Bitcoin and to a lesser extent Skycoin would be vulnerable to attacks.

In Bitcoin/Skycoin, if an address has never been used before, only the owner knows the public key. Therefore an adversary who can break sepk256k1 has to wait until someone uses the address in a transaction to begin attacking. If a user can break secp256k1 and generate a privatekey from a public key in 200 hours of work, they can steal coins from addresses suffering from address reuse.

If they can break secp256k1 in under 10 minutes, they can read public keys off transactions, recover the private key and inject a new transaction that spends the coins before the other person's transaction is in a block. They can have a higher reward for the transaction and Bitcoin miners will prefer the theft transaction, to the original. Miners may even orphan blocks, to collect the higher transaction fees from the theft transactions.

###### In Skycoin:
- With blocks at 3 to 15 seconds each (maybe even 1 second depending on how testing goes), there is less time and ability to crack public keys
- address reuse is mostly being eliminated. It is still allowed, but we are moving towards options with better usability and security. If you have a users public key, you can generate new addresses for that user, that have never been used before. You have a public key and salt value and give it to user and they can generate infinite addresses for you, with ECDA. Even if the pubkey is published and private key recovered, both the pubkey and salt need to be recovered to steal the funds.
- Communication addresses allow you to request a new address for transaction. Most transactions will eventually have receipts/invoices for ecommerce (hopefully machine readable). We are streamlining usability here.
- Today, you can view your credit card invoice, but you cant click an item and see what items you bought at grocery store and spent $30 on. You cannot click an item on bill and see the tracking number for shipping or where it was mailed to. You cannot click a payment and be able to message the merchant. In Skycoin, this will eventually be integrated and receipts/invoices may even be machine readable someday. "Communication addresses" are at a level above the blockchain and eliminate address reuse. The whole purpose of asynchronous messaging infrastructure is to support this. The communication addresses are used for DHT lookup and are shorter than Bitcoin addresses, but are secure until the hashing algorithm is broken. If the hashing algorithm is broken, it can be upgraded to an unbroken hashing algorithm. If no secure hashing algorithms exist, then longer or unique communication addresses needed. This decreases usability (long strings to type in, no autocomplete), but is still secure in the event of advances that render all known hashing systems insecure.
- If an attacker can crack a public key, recover private key in under 1 second, there is also a commitment scheme. We plan to have signatures on the people introducing blocks to network. If you need secrecy, you can communicate the block directly to block creator, without public publication until it is entered into the block. If the attacker is not colluding with the block publisher, the network can continue operation securely until solution is found.

###### So there are different attacks:
- an attack that recovers private key from public key in 200 hours (Skycoin is OK. Bitcoin address with address reuse, get coins stolen).
- an attack that recovers private keys from public keys in 5 minutes (Skycoin is OK. Bitcoins used in transactions are being stolen).
- an attack that recovers private keys from public keys in less than 1 seconds (Skycoin needs upgrade in cryptography but can still operate if the servers created blocks are not colluding with attackers)

If there is a closed set of servers, elected by the consensus network which mint the blocks and there is commitment scheme that allows a server colluding with the attacker to be identified and the individual transactions are small enough ($1000) that they are not worth detection over, then the network may be able to continue operation, for hundreds of years, even if secp256k1 is broken.

###### One commitment scheme:
- there is finite set of elected servers who create blocks
- a person publishes their transaction to one of those elected servers, who keeps it secret
- the elected servers communicate transactions to each other as hashes
- the elected servers come to unanimous consensus about the ordering of the transactions in the next block, without any of the servers knowing what the transactions are
- the transactions are revealed after the next block is determined

###### A more advanced consensus scheme uses an N of M approach, which requires collusion of N servers to collude/cheat to achieve knowledge about the public key.
- a finite set of servers who creates blocks
- a person publishes their transaction to N of M of the minting servers, with secret sharing. Each server have a token identifying the transaction. The N servers need to exchange information to reconstruct the transaction.
- the servers agree on the order of transactions in the next block
- the servers exchange the secrets needed to construct the transactions
- the servers enter the block

Therefore, we believe that a system exists that can survive, even if secp256k1 and all existing public key cryptography are broken. Lamport-signatures will also still work, as long as hash preimage and collusion attacks remain difficult.

## Future Proofing Skycoin: Attacks on the Address Generation

The weak part may be the relationship between the addresses and the publickey. Future 3-SAT solvers may be able to invert this relationship within sixty years for Bitcoin addresses. They would have to find a preimage of two SHA256 and an RIPMD160 compression.

The 65 byte public key (520 bits) maps into a 256-bit (32 byte) value from the SHA256 and then is compressed to 160 bits (20 byte) by RIPMD160. For each address, there are 2^96 preimage public keys. Each 32-byte, 256 bit private key maps into a 520 bit public key. Bitcoin uses DER encoding, which may allow malleability and reduce security over a canonical form, however I have not looked at implementation.

With a canonical form, there are a finite number of preimages that are valid public keys, but with DER encoding there may be an infinite number of valid preimage keys and it could be vulnerable to future length extension attack, based upon how SHA256 hashes data blocks together. Skycoin is using a canonical form without malleability. If Bitcoin accepts mutable signatures in DER, there may be an infinite number of input public keys that pass, unless Bitcoin firsts reduces the DER format into a reduced form (removing zero padding). However, there are only a finite number of valid preimages for Skycoin addresses (fixed length, canonical form).

Skycoin has 33 byte compressed pubkeys hashed to 32 bytes (double SHA256), then reduced to 20 bytes (RIPMD160). Private keys are 32 bytes and almost every privatekey corresponds to a valid pubkey. This means that the chance a valid 32 byte seckey exists, for a randomly generated 33 byte public key is better than one in 256.

This means, that if a preimage attack on y = SHA256(SHA256(RIPMD160(x))) is possible, that there are 2^96 preimages and fewer than 256 of them need to be found, before a publickey is found that has a valid seckey, that could possibly recovered. Therefore if secp256k1 and the preimage attack on SHA256(SHA256(RIPMD160(x))) become possible separately, both Bitcoin and Skycoin balances become insecure, even for addresses who public key have not been published.

An improvement to Bitcoin's address function, would be to ensure that statistically, there are a large number (2^96) preimages, to the hash, but that statistically very few (ideally only one) of them has a valid seckey for the resulting preimage of the address.

Another method, is to allow the attack, but only keep balances in 1 to 5 coin amounts per address. If it cost $5 in resources or effect to steal $1 from a random, unknown user, then the money is safe. Deterrence and frustration may ultimately be the only security possible.

The Skycoin addresses are prefixed with a version byte (currently 0), so we can upgrade later if either a preimage attack or secp256k1 is broken. Once communication addresses and asynchronous messaging are implemented, we may move away from 20 byte "human sized" addresses at blockchain level.