+++
aliases = ["/development-updates/development-update-36/"]
date = "2014-07-29"
draft = true
tags = ["Development", "Cryptography"]
title = "Development Update #36: Skycoin Cryptography Audit and Changes"

+++
## Summary:

We are exhausted. We just finished 4th cryptography audit. Some minor issues were found and fixed. All the issue involved impossible conditions, but are fixed anyways.

## Cryptography Audit/Changes:

### Fixed:
- Someone with a private key from a deterministic wallet who is able to do a SHA256 preimage attack was able to derive all subsequent keys in deterministic wallet (but not the keys for addresses preceding). SHA256 preimage attacks are currently impossible but may become an issue in thirty years. The new deterministic wallet generation function has been strengthened by salting the SHA256 hash with an intractable elliptic curve inverse operation.
- Private key generation takes a 20 byte value and always succeeded in the library we are wrapping. Some very rare keys (1 in 2^255 keys), which are larger than the order of the curve but valid 20 byte integers, passed the private key generation function without generating error, but could cause an error in later operations which enforced checks on whether the integer was less than the curve order. This condition is statistically impossible, but it is now being handled correctly.
-  If a seckey generation fails for a given input, the SHA256 of the input is used instead. This is recursive until the private key generation succeeds. This allows us to guarantee success of private key generation for any 20 byte input while retaining determinism.
- Improvements to determinism of cryptographic operations on very rare edge cases

### Overview:
- Everything has been fuzzed and no defects were found for statistically occurring cases
- The deterministic wallet generation function can be considered final.
- All generated wallets, addresses and private keys from now on should be forward compatible with any future changes.
- Check sums for addresses are only the base58 representation of addresses and no longer in blockchain
- We have verified that the cryptographic functions are side-effect free and do not modify their calling arguments, to the extent that we are able to enforce that in golang
- Cryptography and hashing has been move to a standard library /src/skycoin/src/cipher. This library has the standard cryptographic primitives for building distributed applications. It can also be imported by other golang programs and used independently of Skycoin.
- Cipher Library is still WIP and new functionality is in progress.

We are delayed on problems with ChaCha20. We are getting different results from two different reference implementations.

### Coin Distribution Website:

Now that deterministic wallets work, we can start the distribution.

The distribution is open for a particular period. It is not a first come first serve distribution. This is a very small distribution and not intended to distribute huge number of coins.

We have an immense amount of work left and this does not mean the coin is anywhere close to being finished.
We will do our best to ensure that
- Sending coins work
- Checking balance of address works
- If we have to reset the blockchain, that address balances will be preserved in the new chain.

### Project Management: Bounties

We are beginning to see the overall project architecture and begin breaking the long term goals of the project into a series of very small, specific libraries.

We are beginning to post several development bounties on Github. Each bounty is for implementation of a library that satisfies a particular specification. Each bounty will be worth between 10,000 and 30,000 SKY. Multiple implementations and improvements to existing implementations are encouraged.

- One of the bounties is for implementation of libraries for Skycoin's distributed file system, which is very exciting
- One of the bounties is for implementation of a golang struct serialization library (mostly done)
- One of the bounties is for implementation of a reflective RPC library using the struct serialization library
- One of the bounties is for an implementation of a simple service that performs synchronization of a Merkle encoded Directed Acyclic Graph structures.
- One of the bounties is for a golang FUSE wrapper for the distributed file system (exposing files in memory to the operating system through the FUSE library). We have some example code.
- One of the bounties is for an RFC specification for a syndicated distributed messaging system (similar to XMPP) with no reliance on DNS (probably using server public keys and DHT lookup of IP address)
- Implementation of TUN adapter for meshnet
- design/implementation in C of minimalist virtual machine for deterministic execution of LLVM IR like language
- FPGA Verilog implementation of ChaCha20 core

###### Address Format:

The binary representation of Skycoin addresses are
```
struct {
   uchar8 Version;
   uchar8[20] PubkeyHash;
} Address;
```
PubkeyHash is computed from a compressed secp256k1 pubkey by SHA256(SHA256(RIPMD16(pubkey))). Skycoin only uses compressed public keys.

Version is 0. In Bitcoin, Version means "main network, test network". In Skycoin, version is same across different blockchains and is reserved in case stealth addresses, group addreseses or addresses with different len must be added.

The base58 representation of a Skycoin address is the base58 representation of
<PubkeyHash> + <Version> + < 4 byte checksum >

The checksum is computed as the first 4 bytes of SHA256 of <PubkeyHash> + <Version>

Note. The reason version comes after PubkeyHash is so that vanity addresses can have arbritary prefixes. This is very important. In Bitcoin the

###### For reference, private keys are:
```
struct {
   uchar8[32] Seckey //32 bytes
} Seckey;
```
A private key is a 256 bit integer (32 bytes). The base point is raised to the power of the Seckey in the curve to generate your public key.

A public key is a point on the curve (a pair of two 256 bit integers) and has a compressed binary representation as 33 bytes
```
struct {
   uchar8[33] Pubkey; //33 bytes
} Pubkey;
```
A Pubkey can be "multiplied" by a seckey, by raising the pubkey (a point on the curve) to the power of the seckey (an integer). This generates another pubkey. This is the basis of Elliptic Curve Diffie Hellman Key Exchange (ECDH). Skycoin will soon have a standardized encrypted message format using ECDH with ephemeral keys and ChaCha20. This functionality will be exposed as a library for application developers.

### Consensus:

After doing a finite state machine diagram, we determined that the distributed time stamping system did not add any security over the node using its local clock. Therefore it is not needed for preventing 51% attacks. However the distributed time stamping system can be used to prove to third parties the publication time of a block.

The new system is much simpler. Consensus nodes will still affirm receipt of blocks by publishing the block's hash in their personal block chains in the next block after receipt. Nodes will remember the time they first learn about a block using their local clock and that will be used for negotiating consensus during chain forks.

###### Bitcoin:
- accepts blocks up to 300 seconds into the future from system time (its a fixed window)
- sets local time by averaging in time delta from the nodes the client is connected to (nodes in bitcoin are unathenticated)

If are evaluating if there is an advantage to a stricter window and more accurate clocks.

Skycoin will use deltas from the trusted consensus nodes to set local system time and use NTP severs for verification. If the NTP servers and trusted consensus nodes go out of sync by more than a reasonable window, the client will go into warning mode and all transactions will be considered pending and unconfirmed until the issue is resolved (to protect exchanges against double spending attacks).

Valid block headers whose timestamps are too far in the future, will still propagate to allow time stamping by consensus nodes. We are still working through whether anything needs to be done about these.

### Reducing Block Propagation Time:

In Skycoin, in the long term we are trying to keep the time between announcement of a block and receipt by all nodes to below 2 seconds across the global network. There are two reasons for this
- Ensure timestamps with local clocks for block publication times are reasonably accurate
- Enable real time transactions with confirmation times in seconds

Bitcoin is very robust and has a very low orphan rate, despite block propagation speeds because of the 10 minute block time. However, other coins with more frequent blocks have been subject to Sybil attacks. The altcoin is flooded with thousands of nodes, which forward blocks mined by one pool very quickly, while uploading blocks from other pool at the slowest rate possible. Combined with small time between blocks, this has led to several 51% attacks on smaller coins.

###### In Bitcoin, when a client gets a new block:
- The client announces the hash of the block to each node it is connected to
- The client looks at the hash and determines whether to download the block
- The client requests the block download
- The client waits for the download to finish. The client can only download the block from one peer at a time.
- The client transmits a hash of the blocks to its peers

The fact that Bitcoin only downloads blocks from one peer at a time, means that a peer can delay propagation of a block by purposely uploading the block as slow as possible. This has not been an issue for Bitcon, but has been a significant problem for coins with faster blocks.

###### There are several bottlenecks for propagation:
- There is a round-trip delay between becoming aware of the block and requesting download
- There is a delay for the download and bottleneck from downloading from a single peer
- Bitcoin blocks are generally 50 KB to 500 KB, which cannot be downloaded instantly

In Skycoin, there are several things we can do to reduce these bottle necks

###### In Skycoin when a client gets a new block:
- The client broadcasts the header of the block (~60 bytes) to all connected peers
- The client can rebroadcast the header before the body has been downloaded
- The body is downloaded through a separate mechanism
- The block body is part-file encoded, so that the body can be reconstructed from any N of M messages generated from the body, allowing download of the body in parallel from multiple peers. Each part-file encoded segment is designed to fit into fragmented maximum MTU UDP packet.
- The blocks in Skycoin are very small (micro-transactions are done off blockchain, skycoin transactions are smaller than bitcoin transactions) and more frequent (seconds instead of minutes)
- Option to connect to authenticated nodes, who can speed up block propagation, but cannot slow it down. Combination of authenticated nodes and random nodes, reduces sybil attack potential for delaying block propagation. Bitcoin mining pools are already using dedicated connections between pools to minimize orphan rate and we want to make this a bit easier for users to speed up blockdowns by pointing at a fast node (by setting public key of a fast node).

If you are connected to 10 peers and each block averages 10 KB and each peer sends a 1500 byte, part-file encoded block body immediately upon receipt of the body, without round trip delay then propagation delay is significantly reduced at the cost of some extra bandwidth usage. This is the fastest possible theoretical full block propagation, at the cost of extra bandwidth.

There are delicate DDoS edge cases that need to be designed around. If we prevent block propagation from blocks so far outside of the consensus set (forks of the chain more than N blocks in the past), then it eliminates certain DDoS attacks but leads to an edge case with netsplits, but also eliminates propagation of 51% attacks.

These are some of the long term technical measures we are looking at. We don't see a technical reason why global block propagation should take more than a few seconds.