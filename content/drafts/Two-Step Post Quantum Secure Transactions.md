+++
draft = true
title = "TwoStep: Post Quantum Secure Transactions"
tags = [
    "Development",
    "Security",
]
date = "2014-01-11"
+++
# TwoStep: Post Quantum Secure Transactions

Future advances in mathematics may render Bitcoin insecure. This is a draft protocol for securing cryptocoin transactions against future advances in mathematics or computing which render discrete logarithm based public key cryptography insecure.

TwoStep is part of QuantumEclipse, a suite of next-gen cryptocoin protocols developed under OP Darknet Plan for the Skycoin Project.

This protocol is
- simple
- adaptable to Bitcoin
- lower overhead than Lamport Signatures
- works with SHA256 preimages equally as well as Secp256k1 signatures
- not dependent on the security of discrete logarithm based public key cryptography

## Overview:

### Protocol:
1) A user creates a transaction and publishes the SHA256 of the transaction onto the block chain
2) The user waits several blocks and publishes the transaction. Miners enter the transaction onto the block chain.

A transaction has a pre-published hash it is "timestamped" by the publication of the hash. A transactions without a prepublished hash is a "non-timestamped" transaction.

### Rules Followed by Miners:
1) If an unconfirmed non-timestamped transaction spends outputs used by a non-confirmed timestamped transaction, the non-timestamped transaction is invalid (time-stamped transactions have priority over non-timestamped transactions).
2) If two unconfirmed timestamped transactions spend non-disjoint sets of unspent outputs, the transaction with the earliest timestamp is the valid one.

### Analysis:

This protocol relies on
- Address pub keys are not published until they are first used in a transaction (address non-reuse)
- Private keys cannot be recovered from public keys until the public key is published (preimage resistance of ripmed120(sha256(sha256(x))) )
- The publication of transaction hash into the block chain is a reliable timestamp (no 51% attack, total ordering on transactions)

This protocol delays the publication of the public key for an address until transaction publication and then renders any transactions an attacker creates from the recovered private key invalid.

The attack must now recover the private key, 51% attack the block chain to orphan the user's timestamp and enter an earlier time-stamp for his transaction that would steal the Bitcoin. The longer the user waits between the publication of the hash and the publication of the transaction, the more difficult the required 51% attack becomes.

### Integrating into Bitcoin:

Skycoin supports this protocol naively. Bitcoin requires a small modifications to support TwoStep.

- We need an op code for the publication of transaction timestamps. The OP code should include a time or block number when the hash expires. The expiration should be capped, to allow pruning of old timestamps.
- Miners should obey the two precedence rules. The protocol is only secure if miners do not collude with people who are able to recover secp256k1 private keys from public keys.

### Weaknesses:

There is no way in Bitcoin to enforce precedence rules if miners are dishonest. There is no way in Bitcoin to prove that a particular block violated the precedence rules. Bitcoin can therefore only support soft/voluntary precedence rule enforcement. There is no mechanism in Bitcoin to blacklist provably dishonest miners.

Enforcement of TwoStep transaction protocols requires new cryptocoin blockchain primitives. The Skycoin Obelisk whitepaper will introduce two new block chain primitives which enable "hard" enforcement of transaction precedence rules.

More information about Skycoin: https://bitcointalk.org/index.php?topic=380441.0
