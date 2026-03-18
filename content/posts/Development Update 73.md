+++
aliases = ["/development-updates/development-update-73/"]
date = "2015-05-10"
draft = true
tags = ["Development"]
title = "Development Update #73: The Skycoin Advantage"

+++
I am trying to do something very simple. I am trying to get the balance of a Bitcoin address against a remote server, from Golang using a thin client. It is impossible. I have to write the server/client and wrap libbitcoin because it does not exist.

In Skycoin, I can go :

http://skycoin-chompyz.c9.io/outputs

And I can see list of output for all addresses against a remote full node and get the balances for addresses instantly.

If I am a merchant and I need a thin client, to check addresses for balance changes, I
- Keep a counter (integer) for last block I have seen
- I query http://skycoin-chompyz.c9.io/blockchain and look at "seq" (the block height)
- If I have only seen blocks since 160 and it is at 165, then I get the next block with http://skycoin-chompyz.c9.io/blockchain/block?seq=160 and I keep doing this until I am at the head. I scan each block for transactions I am interested in.

So in Skycoin, I can keep a map of addresses that I am watching for incoming transactions, then I can "walk the chain" and pick out those transactions with a thin client. I can have a billion addresses on the watch list and the map lookup operation is constant time.

In Bitcoin, I am just screwed only thing that has come close to enabling Bitcoin to be usable for developers is libbitcoin and there is not a golang wrapper yet.

I expect the bitcoin client to be hacked. It is going to be buffer overflow attacked. So I want the nodes running the full nodes to be separate from the the user wallets (which should be able to operate as full nodes or thin clients), so that an intentional OpenSSL bug does not loot the Bitcoin private keys. I should not have to run a full node to get balances and inject transactions.

The best solution is to wrap libbitcoin (address unspent balance check and transaction injection), then expose that over a golang RPC. So we can have nodes that are exposing a golang RPC thin client interface. Two functions "get unspent outputs for these addresses" and "inject transaction". Then we craft transactions and handle private key storage on the local computer. This is exactly the same as electrum architecturally but would be a programmatic API that other applications (like the Skycoin wallet) can use.

We might be able to do a libbitcoin RPC in golang. There is very little documentation, but someone is looking into that.

##### Why we need this:

This infrastructure is required for several things
- we can generate bitcoin addresses deterministically with `go run ./cmd/address_gen/address_gen.go --seed="passphrase" -n=3 -b`

![](/img/dev-update-73-1.png)

- If you change n, you can generate as many or as few addresses/keys as you want
- if you put -b, they are bitcoin addresses, if there is no -b, they are skycoin addresses
- if there is no --seed="" it will generate a 256 bit seed for you

So we can generate addresses, but cannot check the Bitcoin address balances or send from them yet. As soon as this is done running a brain wallet will be
- Pull from github
- Run command with pass phrase, then can do balance check and send (in Bitcoin or Skycoin)
- There may be a terminal gui type interface (golang termbox or other terminal interface libraries)

This toolchain completely eliminates the need for wallet files or computers for transporting Bitcoin/Skycoin.

This is being designed to run on portable open source ARM software/hardware, like a raspberry pi. This will be even easier once the crypto library port to pure golang is done. So this tool chain should enable secure hardware wallets. There will be $9 to $20 single chip ARM computers that can run the tool chain soon.

![](/img/dev-update-73-2.jpg)


A hot wallet would be loaded from a deterministic wallet seed, then discard the seed and only retain the private keys/addresses. A cold wallet device would load the seed from a secure input device, load keys into ram, do operations (check balances/send) and then forget everything.

Yesterday we throught "it should only take 20 minutes to build one of these devices", but we cannot, because bitcoind is missing API functions and there is no golang library that has them.

###### We have the private keys, we have the address, we need to:
- Get the unspent output set for the Bitcoin addresses
- Create a Bitcoin transaction, sign it with the private keys, dump it as hex
- Inject the transaction into the network

We cant even do that without writing new custom software. This is insanity.

If anyone knows where the documentation is for the libbitcoin zeromq interface wrapper, that would help.