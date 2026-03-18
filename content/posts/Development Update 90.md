+++
aliases = ["/development-updates/development-update-90/"]
date = "2015-12-16"
draft = true
tags = ["Development", "Cryptography"]
title = "Development Update #90: One in Twelve-Thousand"

+++
## Crypto Library:

Bad news, the crypto library problem is severe. In the new upgrade the public key for 1 in 1200 private keys will be different. To standardize it to Bitcoin. Only one or two people should be affected and we will replace the coins if they are unable to get them out of the wallet and send us the private key.

Every single crypto library outputs different values for the same inputs for a subset of the keys and it is extremely frustrating.

We had fixed signature malleability before MtGox went down or anyone had heard of signature malleability, but we did not expect that raising the base point to a given power, would give different public keys between implementations, which would pass validation.

There are unit tests, that you do not write because there is no way they can fail, but if you try them for random inputs they often fail. Some of the bugs are incredible, such as implementations returning the same public key for a private key, but the public key fails validation and signing a message succeeds for that private/public key pair, but validating it fails, but the signature operation returned without error.

This is extremely frustrating, because we assumed that these operations were deterministic, standardized and mathematically sound. The equations used, give no room or latitude between implementations, so we have no idea how this happens.

This is also an immense time sink and extremely demoralizing. I fixed sixteen things and then thought I was on last one, but then find two more.

One of the bugs was so severe, that if the library was used in the exchange, then 1 in 16,000 Bitcoin addresses generated, would have resulted in addresses where the coins could not have been recovered from the address. Each Bitcoin project is using slightly different crypto libraries, with different versions and there are some bizarre edge cases.

Also, for EDCH key exchange, raising the power of a public key (a point on a curve) by a private key (multiplication), often givens different outputs. p*Q != q*P for some implementations or some private/public key inputs! This is insane.

There was a Snowden slide where the NSA bragged they could break any crypto currently in use and I believe it is because, if you input shit data, every implementation is currently bugged and spits out bits of the private keys. OpenSSH had bugs such as heart bleed, where you could just buffer overflow the library and read out the private keys or even do remote code execution. So every single HTTPS server with openssh, they can just buffer overflow it and root the box and steal whatever they want.

Each one of these bugs takes six to ten hours to find/fix and the last bug we are dealing with is so bizarre, that I have no idea how it is even possible. Many of these bugs, are similar to
- function does not return error, but the output is invalid
- function does not return error, output is valid, signature using output fails validation but succeeds without error

## Exchange:

I am working on the terminal application for the exchange. This will be like a bloomberg terminal for Bitcoin/Skycoin. You can just put in passphrase and will load the deterministic wallet and can do operations.