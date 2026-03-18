+++
aliases = ["/development-updates/development-update-113/"]
date = "2016-11-03"
tags = ["Development"]
title = "SKY Wallet Update"

+++
## Wallet Development

The password feature is "wallet encryption". We are still implementing wallet encryption. Wallet encryption will encrypt your private keys and the seed, so that if the wallet file is stolen, no one can spend your coins, without knowing the password. We are using sha256 + secp256k1hash (very slow on ASIC, GPU, CPU 1000x attempts per second max) for password derivation function and then ChaCha20.

We added a lot of new features to the wallet and have not had time to QA everything.
- We now have a version number, so we can automatically upgrade old wallets to newer wallet formats
- We now have a "last seed" value, so that we can generate an infinite rolling series of addresses quickly
- The software now supports multiple addresses and adding new addresses to the wallet
- We are moving the seed and private key values into their own area, so we can encrypt them for wallet encryption

These upgrades and changes to software broke the GUI and we are cleaning that up now.