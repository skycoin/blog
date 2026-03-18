+++
date = "2015-02-25"
description = "Discussion regarding Default Wallet Security."
draft = true
tags = ["Security", "Development", "Skywallet"]
title = "Concerns about Default Wallet Security"

+++
We are also concerned about "**Default Security**" for average user.

Here is an example. Many people want "vanity addresses". Third party services generate the addresses, then you import the private key. They store the private key, wait until you have a bunch of coins and then steal some of them! Users think it was trojan or they don't even know how the coins were stolen. To protect against that, we have to make sure vanity address gen is client side and integrated into the skycoin wallet. We have to make sure that the default way is the easiest way and that it is secure, for every single action that can result in coins being stolen or lost.

Normally, when a vanity address theft happens, they only steal a fraction of the coins. The user wonder why they stole only a few and not every coin. If they had a trojan, why would someone steal a few coins when they could steal them all? The user is confused. It is because if they did transactions, then some of the coins are in the vanity address and some of the coins are in change addresses. The thief is the 3-rd party who generated the vanity address and they only have the private key for that address (which only has fraction of the keys in the wallet).

A theft of a few coins, but not whole wallet can also occur when private keys are generated with a weak random number generator. Bitcoin was using OpenSSL and we are finding many many bugs in OpenSSL and many system random number generators are being discovered to be weak. So we are not using OpenSSL and we made sure Skycoin salts the key generation wont be compromised even if the random number generator is faulty. We are improving that even further in future with using SHA3 to accumulate entropy every random number call.

I could write a 200 page book about every way that Bitcoin has been lost or stolen. We have to make hundreds of small, incremental changes over time.

We have multiple wallets in Skycoin, because we have seen people delete wallets with bitcoin in them, because we had to swap out wallets. Its easy to overwrite a wallet with coins in it and panic. So we tried to make it easy to have multiple wallets loaded in Skycoin and make it easy to backup the wallets (a simple seed or pass phrase).

We have deterministic wallets and only deterministic wallets as the default, because we have seen people lose coins unexpectedly by loading a wallet from backup after making transactions, because backups do not contain the newly generated change addresses! Bitcoind generates new change addresses after every transaction, which bitcoin are sent to. So if you restore a wallet from backup, you may be missing coins. This also means in Bitcoin, if you have two thumb drives with the same wallet on them and do transactions on each, they will end up with difference coin balances! Each wallet will have different change addresses after being used for a while!

Skycoin doesn't do this at all, because it would mean unexpected behavior and people would lose coins. We made sure that the default behavior is exactly what users expect and that the defaults don't result in people losing coins.

There are so many ways to lose coins in Bitcoin, that addressing every situation is overwhelming. We need to hire contractors to work on each little detail (vanity gen in wallet, locking/unlocking wallets, default on screen keyboard), because we will go mad otherwise. I think we have covered 90% of the causes of coin theft than the user could not control.

We will add a password feature on wallet, but it is a false sense of security. It will stop someone from passively grabbing the wallet, but if they have a key logger, they will get the password. It does make it more difficult (grab file + keylogger). If you use an on-screen keyboard, then it makes it painful. It would put wallet theft beyond skill level of most script kiddies.

The average user will lose more coins from unexpected behavior, than security. We have almost eliminated unexpected behavior. Exchanges are where we need enough software and hardware security to protect against government level infosec/hacker firms.

## Wallet Seed Security

We recommend creating a new wallet from scratch and using a strong password. Anything less than 12 characters will get brute forced. Some GPUs can brute force 2,600,000,000 passwords per second and anything less than 12 characters will get broken eventually (but is safe for small balances). Hackers combine very fast hash rates (trillions of passwords per second) with rainbow tables. So generally, most passwords comely used can be brute forced.

Lowercase 10 letters/numbers: 51.7 BoE (bits of entropy)
5 common words (2000 word dictionary): 54.8 BoE
Mixed case 10 letters/numbers: 59.5 BoE
6 common words (2000 word dictionary): 65.8 BoE
Lower case 13 letters/numbers: 67.2 BoE
Mixed case 13 letters/numbers: 77.4 BoE
12 common words +120 BoE

Brute forcing all wallets with 64 bits of entropy is doable in four years. Electrum pass phrases are 128 bits of entropy and this is minimum. Skycoin should adapt the electrum pass phrase model with 8 to 12 random words from dictionary. This is easier to write down than the hex. It is harder to screw up.

If you need security, we recommend using a SHA256 hash as the seed. Or take a decent password, then add your phone number after it or birthdate. Something you will remember and that an attacker wont know usually.

## How to Get a Wallet Seed

Look at the interface, see **"import from seed button"**. This lets you type in a need seed/passphrase and generate a wallet

![](/img/default-wallet-security-1.png)

New Wallet: creates a new wallet, with a random pass phrase (also called a seed)

Import Wallet From Seed: Lets you generate a wallet from a pass phrase you choose (Which becomes the seed that generates the wallet)

In the web-wallet, add /wallets to the URL and you can see your wallets and copy down the seed.

## Remote Wallet Example:

This is a remote wallet. Its public, so don't inport your wallet seed here. This is for publicly checking balances and demonstration.

http://skycoin-chompyz.c9.io/

These are the "outputs". This is where coins are stored. You can check balance here.

http://skycoin-chompyz.c9.io/outputs

If you open your wallet through the web interface and do "/wallet", you get the list of wallets. As long as you have written down "seed", then you cannot lose your coins.

http://skycoin-chompyz.c9.io/wallets

Try creating a wallet with a seed (import wallet from seed), then close the client, delete the wallet, then go and reimport the wallet from the seed. Make sure you get the same address and private key the second time.

## Wallet seed security guidelines:

A small server with 100 AMD GPUs can brute force 1 trillion passwords per second.
- 16 bits of entropy = 0.0000006 seconds to steal all coins secured with a password with 16 bits of entropy
- 32 bits of entropy = 0.0042949 seconds to steal all coins secured with 32 bits of entropy
- 48 bits of entropy = 281 seconds to steal all coins secured with 48 bits of entropy
- 64 bits of entropy  = 18,000,000 seconds to steal all coins secured with 64 bits of entropy
- 128 bits of entropy = 34,000,000,000,000,000,000 years to brute force at 1 trillion hashes/second
- 256 bits of entropy = 34,000,000,000,000,000,000 years squared, to brute force at 1 trillion hashes/second

numbers only password:
- 3.3 bits per character

lower case letters and numbers:
- 5.2 bits per character

lower and upper case letters and numbers:
- 5.9 bits per character

lower,upper case letters, numbers and symbols
- 6.2 bits per character

So a 10 digit number will have 3.3\*10 bits = 33 bits of entropy. That password will be cracked in 0.0004 seconds and your coins will be looted.

You think your wallet password is secure. Someone has a GPU cluster than can break that password. So once they get the wallet file, its over. If they are able to get your wallet file, it probably means you have key logger on your computer, so they just have to wait anyways.

We are assuming worst case. This is for using md5 for hashing. The Skycoin deterministic wallet generation function uses SHA256 and elliptic curve multiplication operations, so is ten thousand to 1 million times slower. A top end Intel i7 can do about 1,000 to 8,000 passwords/second. So instead of taking 281 seconds, it actually takes atleast 281 thousand seconds to steal coins if your seed has 48 bits of entropy.

64 bits is minimum that is secure. 128 is minimum recommended. Skycoin uses 256 bit by default.

Human generated passwords are not secure either. They are not random. The theoretical entropy is higher than the actual entropy achieved in practice.

We will switch to word based 128 bit pass phrases from word, that are machine generated, like Electrum uses. It is dangerous to allow users to choose their own passwords, but we allow this. Just make sure not to shoot yourself in the foot. It is safer to let the machine generate the seed for you.

However, if you copy the seed into a clipboard then it can be stolen by trojan on computer. If you type the seed, it can be stolen by key logger or by radio emissions from your keyboard. Using an onscreen keyboard is safer.

## Hardware Key Storage Device:

For generating and loading keys on to a hardware key storage devices, we will need to fund open source hardware keypad. Could be $10 to $30.  A hardware key storage device can be as simple as a $1 ARM processor on a PCB board.

This is a $1 ARM processor, 32 bit, 50 Mhz, 16 Kb of flash memory. Just enough for a program and a few private keys. The cost is $1.15 to manufacture. The PCB board is $0.10, the other components are less than a penny each and total unit will cost $0.30 within two years and the 500 Mhz ARM processors will be $1 soon.

![](/img/default-wallet-security-2.jpg)