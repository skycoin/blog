+++
aliases = ["/ask-the-developers/ask-the-developers-5/"]
date = "2014-04-10"
description = "A weekly session where users can comment or ask questions to the Skycoin Developers in order to gain a better insight and understanding into the Skycoin Project "
draft = true
tags = ["Ask the Developers"]
title = "Ask the Developers #5"

+++
# Ask the Developers - Session #5

## Comment:
Quote from: **FrictionlessCoin** on April 26, 2014, 01:29:41 PM
>I for one would be wary about owning a coin on a network that is still undergoing changes.

>The alternative of course is to just wait until you are ready.

>Or take the NEX approach of receiving pledges but not transferring coin until we're ready.

## Response:

The blockchain security is solid. No one can spend your coins without your private keys. We can guarantee that.

Our cryptographic security is higher than Bitcoin's. Ethereum is using the same cryptographic library and we have tested everything to death.

We are using golang so there are no buffer overflow attacks or way that remote party can take over the client and steal your wallet. The worse than can do is crash the client, but cannot loot the wallet remotely. Bitcoin is using C++ and OpenSSL and was affected by the HeartBleed bug. It was possible to buffer overflow Bitcoin through the OpenSSL library and possibly steal wallets through the merchant protocol.

Skycoin was implemented with almost no dependencies. There are no 3rd party libraries in Skycoin that can be exploited. The only 3rd party library we are using is for encryption and we fuzzed the library for days and put in strict constraints on the data allowed to pass into the library. The program is designed to crash, rather than accept the invalid input that could lead to leaking the private keys. Even if attacked, we do not know of any way that the client can be used to exfiltrate the wallet or private keys over the network.

On the client side, the security is already at level where it cannot be improved without moving the private keys to a dedicated hardware device.

The breaking changes we plan on making are related to networking. We have to make changes to the connection pool library and peer discovery protocol. The transaction related parts of the coinbase are finished and in a frozen state.

There might be an advantage to saying that this is a test network and the coins are tokens which will convert into a future coin when its ready rather than saying its "alpha". The blockchain is done and we are not making any large changes. The existing blockchain will just roll over, so its technically incorrect to call it a separate coin or a coin placeholder. However, it might be better to say that for the purposes of communicating what people are buying.

---