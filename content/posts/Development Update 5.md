+++
aliases = ["/development-updates/development-update-5/"]
date = "2014-03-04"
draft = true
tags = ["Development", "Cryptography"]
title = "Development Update #5: The Skycoin Hash Function"

+++
## Summary:

The hash function for Skycoin deterministic wallet generation is finished. We believe our new deterministic wallet hash function is the most secure hash function against GPU and ASIC brute forcing to date. We are using a new hash called "secp256k1 Hash" that combines SHA256 with elliptic curve signature operations.

## Secp256k1 Hash Implementation:

1) SHA256 seed value
2) Compute deterministic private key, pubkey pair from seed value
3) Generate deterministic secp256k1 signature from seed and generated private key
3) Append signature to seed and compute its SHA256 hash