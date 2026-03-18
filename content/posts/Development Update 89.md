+++
aliases = ["/development-updates/development-update-89/"]
date = "2015-12-12"
draft = true
tags = ["Development", "Cryptography"]
title = "Development Update #89: Skycoin: Purging the Bugs"

+++
## Fixes:

Fixed dozens of bugs with the crypto library port.

The sipa and gocoin libsecp256k1 implementation differ slightly and output different public keys for the same private key for some inputs (every few thousand keys).

Slightly different public keys are outputted for the same secret key.

seckey  = 8ba2269ad9d5090c891043dcbda618802d50bbfd7aa548173a9ecb5d2107ffbc
pubkey1 = 02ec9b470f72b4a28d1ae507d7c8ddfa5c5385db96e905400175093e48ef5ace0d
pubkey2 = 02ec9b470f72b4a28d1ae507d7c8ddfa5c5385db96e905800175093e48ef5ace0d

seckey  = e329e5d4f6224566c3464dbe16bdae499566504d7cbca6b77274f835e4838c7e
pubkey1 = 022c3166ffaed91846653d0179b2daf467d0a736e94ca1c0020cd165881aeee572
pubkey2 = 022c3166ffaed91846653d0179b2daf467d0a736e94ca200020cd165881aeee572

seckey  = 27fa25141c11169208c822e8bb6a1dcd3f991dfd20f393a184498434695e0e14
pubkey1 = 03bd957a507e3f7fdeeb7487613acfbd931a600f9d0806000042fc54bc548a2e05
pubkey2 = 03bd957a507e3f7fdeeb7487613acfbd931a600f9d0806400042fc54bc548a2e05

seckey  = 7ab1d121b0884002b583dec1a48d7dec5f8677836b1bbb77701b1a581a6f2398
pubkey1 = 02532980c1d8c8f2989a31e4b412705da65c60ab6f6b6ac0018ed87f3d080d77c3
pubkey2 = 02532980c1d8c8f2989a31e4b412705da65c60ab6f6b6b00018ed87f3d080d77c3

seckey  = e56e99ebef0383058765e780dd1f7f5b3dfa6dffe47e545cf4c2a0d908b9c06d
pubkey1 = 021e41e0ad1778ad20aaa2d4c3780973f330f002b292a54001da80e4e467c4f742
pubkey2 = 021e41e0ad1778ad20aaa2d4c3780973f330f002b292a58001da80e4e467c4f742

The only contractor who knows what library is doing, cant/wont help because it is too time consuming. It took about 6000 lines of unit tests (almost larger than skycoin), just to find all the bugs. I cannot release it until the unit tests for deterministic wallet generation pass.

If you raise the same base point to the same power, you should get the same public key. It should not differ between implementations, for some small subset of keys.