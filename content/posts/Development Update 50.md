+++
aliases = ["/development-updates/development-update-50/"]
date = "2015-01-13"
draft = true
tags = ["Development"]
title = "Development Update #50: Skycoin Core Updates"

+++
## Changes
- The unit tests are fixed
- The refactoring is still not done, but getting closer
- The json output formater for transactions is fixed/pretty printer.
- The way transactions are signed has been modified. Instead of signing the hash of the transaction, with the private key for the output being spent. You now sign the hash of the SHA256 sum of the output being spent with the transaction hash. This has subtle implications. Before you could spend all outputs for an address with one signature in one transaction. This means you could spend 200 outputs with one signature, reducing leakage of private key information if there is an attack on secp256k1 (but addresses should not be reused anyways). However, during coin join transactions a malicious server could spend outputs you didnt intend if your client did not validate the transaction. I decided the validation code was inelegant and so changed the way the hash was constructed, so each input now requires a unique signature. I am conflicted about this. Its like choice between painting shed red or blue, so I should ignore it.
- Transactions have two hashes, an "inner hash" of the inputs/outputs excluding signatures and an "outer hash" which is the binary serialization of the transaction. Transactions only have malleability if you have the private key for one of the inputs for the transactions, where as all Bitcoin transactions have malleability. This means, in a Bitcoin 51% attack anyone can invalidate a chain of transactions by using malleability to change the hash of the transaction (even if they were not a party to the transaction). In Skycoin, there is no way to retroactively modify a transaction hash or change an output hash unless you have a private key for an address used as input in the transaction chain.
- I am trying to decide if there is an advantage or difference of using the inner hash vs outer hash as the "ID" of the transaction. I resolved this in favor of using the outer hash, because it allows you to verify the binary network serialization. You hash the canonical binary serializatoin and get an ID uniquely verifying the hash.
- I would prefer to use the new SHA3 Keccak sponge function instead of SHA256, to add security margin but do not have time to study it in depth required. This is a decision that will require months of reflection and the benefit is marginal. When Kazaa was launched MD5 was state-of-the-art, but a few years later the network came under attack and the RIAA was successfully creating hash collisions in order to corrupt MP3s. The hash was used to validate files and RIAA found some attack to find collisions, allowing them to pass data that validated but was corrupt. Bitcoin has edge cases where you can create hash collisions (duplicate coin outputs) and does not check for collisions, requiring monkey patching. Skycoin will be extremely frustrating to attack, even for someone with an oracle for SHA256 collisions and second preimage attacks.
- The security margin of secp256k1 is excessive. RSA-512 can be broken, but if you stored a maximum of 5 coins per address the cost of doing so would make the attack unprofitable. RSA-1024 is still unbroken. By the time secp256k1 is in danger, there will be a need for a blockchain reset (rolling over balance).
- Skycoin has one transaction type. I was worried that I would have to add inflation, in order to fund on-going acquisition of foreign currency reserves to maintain a currency peg. This would require multiple transaction types. Adding multiple transaction types would pollute the code and destroy its elegance. At the last minute, a solution for funding the currency peg was found that did not require inflation. So there are no remaining cases where inflation is desirable or necessary. The coin number can be hard constraint, with no future increase (under the current assumptions).
- Transactions now have a type and length prefix just in case more transaction types have to be added later.

##### Skycoin Transactions are
- 97 bytes per input +  37 bytes per output + 37 bytes
Bitcoin Transactions are
- 180 bytes per input + 34 bytes per output + 10 bytes

- The merkle tree is always padded to power of 2 and zero padded.  This was originally a radix-16 merkle tree, but Ripple uses a radix-16 merkle tree so I looked at it more carefully and decided that radix-2 was better. If there are 2^N transactions, there will be N levels in the merkle tree and it will require 32*N bytes to describe a path from the root of the merkle tree to the leaf (to prove that a hash is an element of the merkle tree). For radix 16 with 256 bit hashes, it requires 16 32 byte hash even for a one level merkle tree. For radix 16 the size of the descriptor for a tree of depth 1 is same size as radix-2 for depth 4.  So its 32*ceil(log2(N)) for radix-2 vs 16*32*ceil(log16(N)). So radix-16 increases hash speed marginally, but explodes the proof lengths for typical cases. Ripple also uses SHA512 and discards the last 256 bits, which feels ad-hoc. The proof length is more important than the hashing speed (which is already very fast).

I noticed something interesting.

The key for the first 16 rounds in SHA256 are the 16 message blocks in order. A compressed pubkey is 33 bytes. SHA256 takes input, breaks it into 512 bit blocks, adds a 64 bit length to end and then pads with 1 followed by zeros. The padding is fixed after the 33 bytes. Most of the bits in the input are fixed. The compression function takes in two 256 bit blocks and compresses to a 256 bit output. However, almost half of the inputs are determined. For SHA256(SHA256(x)) for 256 bit x and for SHA256(pubkey) for 33 byte compressed pubkey.

The key schedule for 0 to 16, is just the two 256 bit input blocks block up into 32 bit segments, in order
    for i from 0 to 15
        w = w
The key schedule from 16 to 63 is
    for i from 16 to 63
        s0 := (w[i-15] rightrotate 7) xor (w[i-15] rightrotate 18) xor (w[i-15] rightshift 3)
        s1 := (w[i-2] rightrotate 17) xor (w[i-2] rightrotate 19) xor (w[i-2] rightshift 10)
        w := w[i-16] + s0 + w[i-7] + s1

w[8] to w[15] are fixed. 1 followed by zero padding.  For any 256 bit input to SHA256 this is true. For compressed secp256k1 pubkey of 33 bytes, the w[9] to w[15] are known. The padding that fills w[8] to w[15] is only a function of the length of the input, where input length is less than or equal to 256 bits.
- For bitcoin mining, most of the fields/bits are fixed for the problem. Everything except nonce bits.
- For hashing a compressed pubkey to address of the 64 bytes of input to the compression function forming the key input, 33 bytes are fixed/known.
- 3-SAT can invert 20 rounds assuming 512 bits of entropy in input and naive SHA256 encoding. If half the bits in the key schedule are already known, may be exponentially easier than solving for a 512 unknown bits in key schedule. If you modify SHA256 to take out the mixing and feedback in the key schedule, then this appears insecure against 3-SAT attack. The first 16 rounds fall quickly, but only 4 rounds can be broken after the key schedule mixing starts in round 16.
- For Bitcoin mining, only ~32 bits in the key schedule appear undetermined which are unknown
- w[0] to w[15] are just the two 512 bit input blocks.
- There is optimized SHA256 encoding using carry-save adders, used for mining that is simpler to work on and may be faster
- If you can find preimage for SHA256(x) for 256 bit x (x is expanded to 512 bit block but the last 256 bits are padding knows bits are known in advance), you can can find preimage for SHA256(SHA256(x))
- Ripemd160 is a similar Merkle–Damgård compression function. If you can break SHA256 with that attack its likely to break Ripemd160
- If you can preimage Ripemd160, you get random SHA256(x) for 256 bit x (and 256 bits of known padding bits in key schedule) which you then preimage to get a random compressed secp256k1 pubkey
- If the probability that a random secp256k1 pubkey is weak, is 1 in 1024, then you have to do this on average 1024 times, before you get a pubkey that is valid for the address, which you can recover the private key for. If almost all randomly generated public keys are strong, then attack fails.
- We know that almost all randomly generated secret keys produce strong public keys (public keys we cannot recover the private key for). The secret key is 32 bytes and the compressed public key is 33 bytes.
- Recovering the private key from a random public key is the discrete logarithm problem on an elliptic curve. I don't know what percentage of random points on the curve, have easily recoverable exponents. It is probably close to zero.
- The majority of headers do not have a 32 bit nonce that puts the output hash below the current difficulty target. Trying to use 3-SAT for mining would be more interesting and practical with a 64 bit nonce. I think in benchmarks it beat CPU mining with brute force trial and error SHA256 hashing, then brute force became more competitive as difficulty increased. Its not clear why. Now, brute force SHA256 miners commonly run through the nonce without generating a block below the target, so its futile even if there was fast algorithm.