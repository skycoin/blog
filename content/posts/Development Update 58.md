+++
aliases = ["/development-updates/development-update-58/"]
date = "2015-02-16"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #58: Cold Storage and Exchanges"

+++
## Offline Wallets:

Skycoin will have some more features for doing offline wallets or wallets on computers not connected to a network. You for instance, may generate a wallet and seed on a computer not connected to any internet. Your "cold wallet". Then you send the coins to the first address in the code wallet. Then you load the unspent output hash by hand (typing it into the computer).

To send coins out of the code wallet, without connecting the computer to the internet,  the wallet generates a transaction on the computer not connected to the network and produces a QR code you scan with a cell phone to injection that transaction into the network.

There should be a way of doing this safer than USB. Maybe coupling a cell phone app to a laptop over speaker/microphone.

## Skycoin Exchange Proof of Concept

###### We think:
1) All exchanges should have a common API
2) Exchanges should not be holding balances of coins. The coins should automatically be withdrawn back into the users wallet. The user should be holding the private keys, not the exchange.

In this type of exchange, an exchange is a publickey hash, you add exchanges you trust to a list. The wallet queries the exchanges on the list and looks for the best bid/ask on each coin. Then you do trades and settlement and clearing.

The problem is that Bitcoin takes 10 minutes for settlement, while a person may enter in ten trades per second. If Skycoin achieves 1 second transaction times, then you can do settlement but wont have the Bitcoin in your wallet for 10 minutes. However the Bitcoin will be stored locally and cannot be stolen if the exchange goes down.

It is possible to do instant settlement with Bitcoin without waiting 10 minutes or going through the blockchain at all
- You place your Bitcoin in a multisig transaction, where moving the coins requires your signature and requires the exchange's signature.
- To send the Bitcoin to the exchange, you merely disclose the private key for that Bitcoin address.
- Now the exchange can authorize transactions with the Bitcoin but you cannot
- The exchange cannot steal the coins without your permission
- If you exchange discloses the private-key to you, now you own the coins and you can move the coins but the exchange cannot

So it is possible to do "instant" settlement of Bitcoin off the blockchain. However:
- Exchanges can hold your coins hostage (sign this transaction giving us 50% of the coins you get nothing)
- if the exchange forgets or loses the private key then you cannot get access to the coins

To get around this, you set a timer and make the signature check short circuit after 30 days. So if the coins are not moved, within thirty days they return to the person who owns the privatekey for the first address. This prevents the coins from being held hostage or prevents coins from being lost if the exchange forgets the privatekey.

To implement that, you would need a bitcoin scripting language op code that can read the time in the blockchain header for the current block and compare it to a target value. Or which can compare block depth of current block to a target value.

## Bitcoin/crypto Infrastructure

So the exchange problem has been solved for a while, but no one has implemented the solution. It requires a series of libraries, scaffolding and infrastructure that does not exist and which no one is building.

I see Bitcoin/crypto as a sort of "money operating system" and it a platform with missing core libraries and capacities. Just like the standard library for "open file", "read file", "write data to file", there are a set of standard operations for Bitcoin. Private key generation, signature verification, communication, settlement/clearing and dozens of others. Bitcoin only implements "check balance" and "send" and has a very crude implementation of a fraction of the capacities or libraries needed.

Some of these core operations overlap with the standard library for the operating system. Why you connect to an IP address, you have no idea if the traffic is being intercepted or man-in-the-middle attacked. Any router between you and the destination can intercept and redirect the traffic. The  IP addresses does not actually identify anything in the real world.

When you are on OkCoin or an exchange and you send an HTTP request for "withdraw my coins to this address", what stops someone from sitting in the middle and replacing the address you wanted the coins withdrawn to, with their own address? What prevents them from withdrawing all your coins to themselves? Nothing. HTTPS sometimes (but in practice not, depending on your browser, your ISP and the security of the exchanges HTTPS private keys). Instead of hacking OkCoin, you can hack a frontend server, bribe and employee, get the private key for HTTPS and then hack any router between the user and the exchange and then steal all their coins by intercepting their traffic and withdrawing the coins to your address once they have logged in. How many coins could one person steal with a single BGP hijack and the HTTPS privatekeys for one exchange, without even having to hack the exchange itself or grab the private keys for the Bitcoin.

When you replace IP addresses by a pubkey hash, then unless the person has the private key for that pubkey, they cannot even read the messages you are sending.

You can guarantee that the end-point, if it is able to respond, at-least knows the private key for the publickey. Once you have that, you would deprecate the use of UDP/TCP/IPv4/IPv6 for all Bitcoin applications, because there is no reason you would use those protocols because they only have relative disadvantages in every category for security and do not offer superior performance. Eventually, it moves up the protocol stack and the operating system itself deprecates UDP/TCP/IPv4/IPv6.

###### So I want Skywire to replace:
- UDP
- TCP
- IPv4
- IPv6
- HTTPs
- SSH
- SSL/TLS
- BGB
- MPLS
- TOR
- IPsec
- VPN protocols
- ...

Ironically, Skycoin started as a universal token for traffic settlement in the Skywire protocol. However, Skycoin itself began to require Skywire itself to meet security guarantees for higher level protocols.

This is very boring to most users. Very difficult to sell. People take for granted infrastructure like water and electricity, until it goes out. I think people will eventually end up using it in a way that is invisible to the user. No one thinks or cares whether they are using IPv4 or TCP/IP or HTTPS  when they open a Facebook page.