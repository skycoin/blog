+++
aliases = ["/development-updates/development-update-104/"]
date = "2016-08-30"
draft = true
tags = ["Development"]
title = "Consensus and Generating Skycoin Wallet Addresses"

+++
The builds are on the website, www.skycoin.com

The electron builds use Electron for the gui.
The binary builds use the system browser (chrome or firefox)

## Production:

Consensus prototype is done and needs to be integrated into the client and src/daemon and /src/visor needs to be cleaned up. Then we are in launch/production.

## Security:

https://bitcointalk.org/index.php?topic=915893.0
http://boingboing.net/2016/06/15/intel-x86-processors-ship-with.html

## Exchange:

https://github.com/skycoin/skycoin-exchange

![](/img/dev-update-104-1.png)
![](/img/dev-update-104-2.png)
![](/img/dev-update-104-3.png)
![](/img/dev-update-104-4.png)

We are integrating the API into the angular GUI prototype and making incremental improvements.
- The "local wallet" and bitcoin/skycoin thin client API is being implemented

## Generating Skycoin Wallet/Address:

Download wallet here:
- skycoin.com
- OR preferrably compile from source

Hit "Load Wallet From Seed", to generate a wallet deterministically from seed
- WRITE DOWN THE SEED AND DO NOT LOSE IT. You can regenerate the wallet, as long as you remember the seed value
- OR run client and goto http://127.0.0.1:6420/wallets and copy the randomly generate value "seed" for your wallet
- OR use address generation.
-- cd skycoin
-- go run ./cmd/address_gen/address_gen.go --seed="REMEMBER_THIS"

Command line address generation:

![](/img/dev-update-104-5.png)

Bitmessage  BM-2cU8XJp3GPVQG75ZwMjiyzdDEa9eD4B7iM, with

{
skycoin_address: "DLLDajtufEG1KPg6VxGCoCQjwJ53XUSNni"
coins_requested: "2500"
btc_address; "address to return bitcoin to if there is a problem"
contact_address; "BM-2cU8XJp3GPVQG75ZwMjiyzdDEa9eD4B7iM, btctalks:coinman, optional"
}

OR, You can use bitcoin talks private message, but it is less secure.

Then we will send address to send BTC to.
Then message back when coins are sent (or we will send coins and the transaction id and outputs)

To see outputs (address balances), do
- http://127.0.0.1:6420/outputs
- OR in gui, click the gear and look at the output tab

To confirm transactions, look at transactions in
- http://127.0.0.1:6420/blockchain/blocks?start=0&end=5000

Then we will send a bitcoin address for the send.
