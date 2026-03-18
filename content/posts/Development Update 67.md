+++
aliases = ["/development-updates/development-update-67/"]
date = "2015-04-17"
draft = true
tags = ["Development"]
title = "Development Update #67: Skycoin Bug Fixes and Documentation"

+++
Fixed a lot of bugs.

The top levels, the gui and json are not as polished as lower levels (blockchain/crypto). I have not even looked at some of this code and discovering new things. There were things implemented, I didnt know we had working and things that needed to be cleaned up.

- There was a coinhour calculate bug that prevented transactions in strange cases. I hardcoded coinhour fee for transactions to 1, to get it working, but then after receiving coins, some people were unable to send them out.
- There was bug where sometimes send failed if balance for wallet was split among multiple inputs. Should be fixed now.
- I am removing code, simplifying the top level. We are at point for several months, where most of work is removing code, simplifying.
- Most users are behind firewall, they can connect out but not in. Two servers are running with open ports. We need more servers with open ports, running the client
- We need indicator for how many clients you are connected to, what block number is and time since last new block
- We need button for connecting to server by hand
- We need better configuration for how many outgoing connections to maintain, how many incoming connections and a list of server that you should always be connected to. Once Skywire is working, you will be able to just put in address/pubkey hash and then have authenticated communication to end point and that will speed up network a lot. Right now, it is possible to flood network with dead nodes or bad nodes and prevent honest nodes from connecting.
- We need json function for returning the pending unconfirmed transactions. This is six or twelve lines of code and almost done. (see below)
- We need the pending transactions for your wallet (incoming and outgoing) to show in the interface
- We need the unspent output set at http://127.0.0.1:6420/outputs to be sorted, either by time, block # or output id. We store a metadata uint64, that indexes each output, so you can say "output 15" created by "transaction 3" and each output and transactions will have a unique sequentially numbered int, for a given chain. However this value is not in the hash and may change if the transactions are migrated to another ledger, but the transactions/output hash will be same.
- If there are N-transactions from same wallet, we need to freeze later transactions (return error) or queue up transactions. The outputs from the wallet will be spend, so if the first transaction clears the second will be invalid (it needs to use outputs of the wallets after transaction 1 clears, not outputs that existed at time transaction was created).
- Base58 encodes addresses as integers. Some private keys generate addresses that decode to less than length of what addresses should be. I tested 128,000 random addresses during testing and decoding never failed for any of them. If someone has a private key, where people are unable to send to that address, because it is invalid please go into http://127.0.0.1:6420/wallets and send me the wallet seed to BM-2cXFat4fHmeRe8EFJjY3Dzo6RoifcgiKgp . No one will have coins in this address, because send fails because address is invalid, but it seems to happen to a few person. I cannot tell if people are copy/pasting addresses incorrectly or if its a base58 issue
- When a new block is minted, if you are connected to three people, you will request block as soon as you get notification. So you will end up making 3 download requests and getting block three times. This speeds up block propagation, so may not be a bug.
- Skycoin still kills someone's wifi for unknown reasons (one user has reported). This may be DHT (which is same as bitorrent uses). The issue is probably the router firmware.
- PEX may need to be modified, so that it only keeps list of clients that allow incoming connections. If you cannot connect to the peer, knowing about them does not help the client.

People have reported that port 6000 is X11. Skycoin to prevent blocking by ISPs is not bound to particular port. DHT assumes port 6000. So disable DHT and then make sure you have people in your peer list, or manually connect to server. Once you are finding peers through PEX, you don't need DHT and port does not matter.

## Other:

There are API commands I did not know about, that I just found in the code. Someone should document the API/json urls

You can test these on http://skycoin-chompyz.c9.io/blockchain/block?seq=5

##### Get blockchain head, header:
http://127.0.0.1:6420/blockchain
Get block as JSON
http://127.0.0.1:6420/blockchain/block?seq=5
Get range of blocks as JSON
http://127.0.0.1:6420/blockchain/blocks?start=2&end=30

##### Unspent Outputs:
http://127.0.0.1:6420/outputs

##### Get Network Connections:
http://127.0.0.1:6420/network/connections (renamed from /api/network/connections )

##### Make a network connection to peer:
http://127.0.0.1:6420/network/connection?addr=127.0.0.1:6000 (renamed from /api/network/connections )

##### Blockchain Progress:
http://127.0.0.1:6420/blockchain/progress

This is the highest block you know about. If you are not connected to anyone it will be zero, I think. There appears to be off by one error.

## Documentation:

https://github.com/skycoin/skycoin/blob/master/src/api/wallet.go

In /src/api/wallet.go there is a URL handler that returns the JSON serialization of the unspent output set. Let us look at how that is implemented.

We define a function, that handles the URL request. Grabs the outputs from Visor and then returns the JSON or 404 error.
```
// Returns the outputs for a wallet
func getOutputsHandler(gateway *daemon.Gateway) http.HandlerFunc {
   return func(w http.ResponseWriter, r *http.Request) {
      ret := gateway.Visor.GetUnspentOutputReadables(gateway.V)
      SendOr404(w, ret)
   }
}
```
Then we add the handler to :

```
func RegisterWalletHandlers(mux *http.ServeMux, gateway *daemon.Gateway) {}...

//get set of unspent outputs
mux.HandleFunc("/outputs", getOutputsHandler(gateway))
```

So it is about 7 lines of code, to expose the outputs as JSON. The "readable" for converting internal Skycoin objects to json is in /src/visor/readable.go https://github.com/skycoin/skycoin/blob/master/src/visor/readable.go

Looking at the godoc for Visor, we can see the functions it exposes

https://godoc.org/github.com/skycoin/skycoin/src/visor#Visor

Visor is one of the dirty libraries that need to be refactored and cleaned up. However it is very clean already. Some cleanup steps could be
- Moving blocks into a blockstore library that visor pulls in and removing block serialization/saving to disc from visor
- Removing the remaining functions in "spend.go" and moving into wallet handler
- Fixing the unit tests
- Exposing the full blockchain client API over network with Golang/RPC (partially implemented?)
- Moving the readable to its own library or subfolder
- Deleting json_rpc.go (which is empty)
- Decide if the JSON api web server should be in visor, instead of gui or if it should be its own library or should stay where it is
- Move the functionality out of /src/daemon into /src/visor and deprecate the existing daemon for the skywire daemon, making visor top level instead of daemon being top level

There is no transaction history. You can look at the blocks and the transactions using json API. You can check balances by looking for your address in the unspent output set ( http://skycoin-chompyz.c9.io/outputs ).

##### The coin history and Skycoin blockchain exporer, should
- Go through block by block, creating index of addresses, transactions, blocks
- Be its own library
- Should run in the skycoin web wallet, locally, not on third party site
- Should have a JSON api