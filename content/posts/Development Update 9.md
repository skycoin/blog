+++
aliases = ["/development-updates/development-update-9/"]
date = "2014-03-21"
draft = true
tags = ["Development", "Security"]
title = "Development Update #9: Skycoin Blockchain Checkpoints and Security"

+++
## Summary

- Wire protocol almost done
- Deterministic wallets RPC almost done (in branch)
- Fixing wallet GUI to match new RPC
- Windows, OSX and linux build scripts are done

We are working towards a launch where the coin is trading as soon as possible. After launch, there is still work to do.

## Skycoin Checkpoint System

This is overview of the Skycoin checkpoint system. The checkpoint system addresses the exponential growth of the blockchain, by keeping the data required to run a full client to less than one gigabyte. This was a core design objective for Skycoin, to enable usage on mobile phones.

The checkpoint system allows users to check balances and do transactions without downloading the full block chain. The client only requires a copy of the unspent output set and the blocks since the unspent output set to parse the next block.

1. Every 16384th block will be referred to as a "checkpoint block"
2. Every 16384 blocks (every 68 hours), each obelisk node will publish and sign
- the SHA256 merkle tree hash of the unspent output set
- the SHA256 merkle tree hash of the blocks since the last snapshot
3. Upon reaching a checkpoint block, each client will verify its state against the checkpoints published by the obelisk nodes it is subscribed to
4. The checkpoint at block 2*16384 is for blocks 0 to block 16384.
5. If snapshots are enabled, clients will download the UxSet and blocks since the last checkpoint block. The client will be fully functional at this point and then will begin to download the history since the first block.
6. Verification against Checkpoint Blocks will be enabled by default, but use of snapshots will be disabled for security unless explicitly enabled.
7. High security applications such as exchanges are recommended to disable snapshots and parse the blockchain from the genesis block.
8. If there is a discrepancy between the checkpoint hashes for the nodes a user is subscribed to, the user will be alerted and additionally security measures (such as disabling coin sends) may be put in place until the situation is resolved.

## Unspent Output Set Hash:
Additionally, for each block the unspent output set is hashed and the first 4 bytes of this hash are included in each block. This is a checksum hash and is designed to be constant time for addition/removal of outputs and not designed to be a cryptographic hash. This hash detects non-determinism and bugs in the unspent output state before they can cause blockchain forks.

## Skycoin Blockchain Security:

We have made progress on the design of Obelisk. We are evaluating Obelisk under an attack scenario where 90% of the nodes are malicious. We have determined that a severe sibyl attack may slow down block consensus or slow down execution of specific transactions but cannot fork the blockchain earlier that a few blocks into the past (no 51% attack, no double spending). The success rate of blockchain forks in Skycoin, decreases exponentially quickly in the number of confirmations a block has (where as Bitcoin attack difficulty increases approximately linearly in number of confirmations).

An attacker who dominants the Bitcoin hash rate can mint blocks with 0 transactions (slow down network) and 51% attack (revert previously executed transactions). Skycoin does not use mining and an attacker using a colluding majority of Skycoin Obelisk nodes is only able to slow network consensus and transaction processing, but cannot revert previous transactions.