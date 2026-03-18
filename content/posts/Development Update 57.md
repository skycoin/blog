+++
aliases = ["/development-updates/development-update-57/"]
date = "2015-02-04"
draft = true
tags = ["Development"]
title = "Development Update #57: Skycoin Overview"

+++
## Skycoin Project Overview

This is overview of the Skycoin project code complexity. Skycoin began as an attempt to simplify bitcoin and make a minimalist bitcoin with reduced complexity, improved security and improved usability.

Skycoin was not designed to add hundreds of features, but was designed to strip out all the edge cases and everything unnecessary from Bitcoin.

## Bitcoin Complexity

 ~/bitcoin-0.9.2.1-linux/src/bitcoin-0.9.2 $ cloc .
     593 text files.
     584 unique files.
     191 files ignored.

http://cloc.sourceforge.net v 1.60  T=4.03 s (100.1 files/s, 30359.6 lines/s)

| Language      | files | blank | comment | code  |
|---------------|-------|-------|---------|-------|
| C++           | 194   | 8991  | 5294    | 53356 |
| Bourne Shell  | 15    | 2357  | 2149    | 18205 |
| C/C++ Header  | 159   | 4108  | 4316    | 15847 |
| m4            | 17    | 377   | 102     | 3563  |
| HTML          | 3     | 85    | 0       | 1136  |
| make          | 6     | 167   | 29      | 895   |
| Python        | 5     | 88    | 79      | 379   |
| C             | 1     | 43    | 11      | 336   |
| Objective C++ | 2     | 37    | 14      | 155   |
| CSS           | 1     | 10    | 1       | 78    |
| SUM:          | 403   | 16263 | 11995   | 93950 |


## Skycoin Complexity

~/skycoin/src $ cloc .
     645 text files.
     638 unique files.
      77 files ignored.

http://cloc.sourceforge.net v 1.60  T=4.73 s (120.8 files/s, 41069.5 lines/s)

| Language     | files | blank | comment | code   |
|--------------|-------|-------|---------|--------|
| Javascript   | 370   | 13829 | 35038   | 91821  |
| Go           | 137   | 4450  | 5151    | 26487  |
| CSS          | 15    | 1712  | 129     | 9214   |
| C/C++ Header | 27    | 448   | 353     | 2564   |
| C            | 5     | 151   | 83      | 954    |
| HTML         | 10    | 83    | 130     | 487    |
| Assembly     | 1     | 62    | 61      | 346    |
| m4           | 1     | 30    | 0       | 276    |
| make         | 1     | 6     | 1       | 59     |
| Bourne Shell | 2     | 0     | 5       | 54     |
| Java         | 1     | 7     | 19      | 34     |
| YAML         | 1     | 8     | 0       | 11     |
| SUM:         | 571   | 20786 | 40970   | 132307 |

## Skycoin Complexity Drill Down

Removing the one external C library and the javascript for angular we get:

cloc --exclude-dir=aether,_deprecated,./gui/static,./cipher/secp256k1-go
      69 text files.
      69 unique files.
     665 files ignored.

http://cloc.sourceforge.net v 1.60  T=0.55 s (123.7 files/s, 34026.3 lines/s)


| Language | files | blank | comment | code  |
|----------|-------|-------|---------|-------|
| Go       | 68    | 2029  | 2459    | 14210 |
| SUM:     | 68    | 2029  | 2459    | 14210 |

## Summary

Bitcoin is 53356 lines of C++, 15847 lines of C/C++ headers. 15,000 lines of bash scripts.

Skycoin is 14,210 lines of Golang. At peak Skycoin was over 80,000 lines, but has become more elegant over time.

##### Skycoin Drill Down

cloc --exclude-dir=aether,_deprecated,./gui/static,./cipher/secp256k1-go --by-file .
      69 text files.
      69 unique files.
     665 files ignored.

http://cloc.sourceforge.net v 1.60  T=0.51 s (132.7 files/s, 36494.5 lines/s)

| File                        | blank | comment | code |
|-----------------------------|-------|---------|------|
| ./daemon/visor_test.go      | 127   | 94      | 1202 |
| ./daemon/daemon_test.go     | 131   | 112     | 1144 |
| ./coin/blockchain_test.go   | 102   | 86      | 925  |
| ./visor/visor_test.go       | 113   | 70      | 872  |
| ./visor/unconfirmed_test.go | 67    | 45      | 735  |
| ./daemon/daemon.go          | 53    | 117     | 611  |
| ./coin/transactions_test.go | 56    | 41      | 489  |
| ./coin/blockchain.go        | 66    | 141     | 478  |
| ./visor/spend_test.go       | 41    | 42      | 377  |
| ./daemon/visor.go           | 60    | 88      | 376  |
| ./visor/visor.go            | 81    | 234     | 371  |
| ./coin/outputs_test.go      | 43    | 23      | 362  |
| ./daemon/messages_test.go   | 60    | 25      | 338  |
| ./cipher/crypto.go          | 51    | 56      | 325  |
| ./visor/readable_test.go    | 40 | 6   | 315 |
| ./gui/wallet.go             | 71 | 282 | 259 |
| ./coin/transactions.go      | 45 | 57  | 250 |
| ./daemon/messages.go        | 36 | 57  | 246 |
| ./cipher/crypto_test.go     | 33 | 23  | 241 |
| ./coin/unspent_pool_test.go | 19 | 19  | 236 |
| ./cipher/hash_test.go       | 23 | 15  | 221 |
| ./cipher/base58/base58.go   | 41 | 24  | 178 |
| ./visor/unconfirmed.go      | 25 | 36  | 173 |
| ./util/file_test.go         | 23 | 3   | 162 |
| ./visor/readable.go         | 29 | 34  | 153 |
| ./visor/blocksigs_test.go   | 21 | 8   | 152 |
| ./coin/outputs.go           | 34 | 55  | 138 |
| ./visor/rpc_test.go         | 20 | 9   | 137 |
| ./visor/spend.go            | 23 | 23  | 132 |
| ./daemon/peers_test.go               | 16 | 4   | 121 |
| ./cipher/ripemd160/ripemd160block.go | 24 | 19  | 118 |
| ./coin/coin_test.go                  | 55 | 119 | 108 |
| ./cipher/hash.go                     | 20 | 13  | 108 |
| ./coin/unspent_pool.go               | 15 | 21  | 106 |
| ./daemon/dht.go                      | 13 | 20  | 105 |
| ./wallet/deterministic.go            | 27 | 27  | 104 |
| ./daemon/gateway.go                  | 29 | 103 | 96  |
| ./wallet/readable.go                 | 19 | 25  | 95  |
| ./visor/serialization_test.go        | 20 | 11  | 95  |
| ./visor/blocksigs.go                 | 12 | 17  | 93  |
| ./cipher/ripemd160/ripmd_160.go      | 19 | 14  | 87  |
| ./visor/serialization.go             | 10 | 4   | 86  |
| ./wallet/wallets.go                  | 11 | 8   | 84  |
| ./util/file.go                       | 10 | 8   | 84  |
| ./daemon/peers.go                    | 10 | 14  | 82  |
| ./daemon/pool.go                     | 11 | 14  | 81  |
| ./cipher/address.go                  | 20 | 29  | 80  |
| ./wallet/entry.go                    | 12 | 11  | 77  |
| ./cipher/address_test.go             | 9  | 5   | 72  |
| ./gui/http.go                        | 8  | 15  | 72  |
| ./util/cert.go                       | 15 | 7   | 70  |
| ./daemon/rpc.go                      | 10 | 10  | 68  |
| ./daemon/pool_test.go                | 8  | 6   | 64  |
| ./daemon/dht_test.go                 | 7  | 0   | 57  |
| ./visor/rpc.go                       | 18 | 38  | 56  |
| ./gui/blockchain.go | 6  | 1  | 51 |
| ./gui/cert.go       | 5  | 9  | 49 |
| ./wallet/balance.go | 11 | 6  | 46 |
| ./gui/json.go       | 7  | 6  | 36 |
| ./wallet/wallet.go  | 11 | 37 | 32 |
| ./gui/error.go      | 7  | 1  | 29 |
| ./gui/template.go   | 4  | 1  | 25 |
| ./gui/network.go    | 4  | 1  | 23 |
| ./util/time_test.go | 4  | 0  | 20 |
| ./util/cert_test.go | 3  | 0  | 17 |
| ./util/time.go      | 4  | 3  | 13 |
| ./visor/json_rpc.go | 1  | 7  | 1  |
| ./wallet/wallet_util.go | 0    | 0    | 1     |
| SUM:                    | 2029 | 2459 | 14210 |

We see that most of Skycoin's code is unit tests. The unit tests are larger than the files.

##### Removing unit tests

cloc --exclude-dir=aether,_deprecated,./gui/static,./cipher/secp256k1-go --not-match-f='.+_test.go' --by-file .
      45 text files.
      45 unique files.
     665 files ignored.

http://cloc.sourceforge.net v 1.60  T=0.41 s (107.4 files/s, 20570.1 lines/s)

| File                                 | blank | comment | code |
|--------------------------------------|-------|---------|------|
| ./daemon/daemon.go                   | 53    | 117     | 611  |
| ./coin/blockchain.go                 | 66    | 141     | 478  |
| ./daemon/visor.go                    | 60    | 88      | 376  |
| ./visor/visor.go                     | 81    | 234     | 371  |
| ./cipher/crypto.go                   | 51    | 56      | 325  |
| ./gui/wallet.go                      | 71    | 282     | 259  |
| ./coin/transactions.go               | 45    | 57      | 250  |
| ./daemon/messages.go                 | 36    | 57      | 246  |
| ./cipher/base58/base58.go            | 41    | 24      | 178  |
| ./visor/unconfirmed.go               | 25    | 36      | 173  |
| ./visor/readable.go                  | 29    | 34      | 153  |
| ./coin/outputs.go                    | 34    | 55      | 138  |
| ./visor/spend.go                     | 23    | 23      | 132  |
| ./cipher/ripemd160/ripemd160block.go | 24    | 19      | 118  |
| ./cipher/hash.go                     | 20    | 13      | 108  |
| ./coin/unspent_pool.go               | 15    | 21      | 106  |
| ./daemon/dht.go                      | 13    | 20      | 105  |
| ./wallet/deterministic.go            | 27    | 27      | 104  |
| ./daemon/gateway.go                  | 29    | 103     | 96   |
| ./wallet/readable.go                 | 19    | 25      | 95   |
| ./visor/blocksigs.go                 | 12    | 17      | 93   |
| ./cipher/ripemd160/ripmd_160.go      | 19    | 14      | 87   |
| ./visor/serialization.go             | 10    | 4       | 86   |
| ./wallet/wallets.go                  | 11    | 8       | 84   |
| ./util/file.go                       | 10    | 8       | 84   |
| ./daemon/peers.go                    | 10    | 14      | 82   |
| ./daemon/pool.go                     | 11    | 14      | 81   |
| ./cipher/address.go                  | 20    | 29      | 80   |
| ./wallet/entry.go                    | 12    | 11      | 77   |
| ./gui/http.go                        | 8     | 15      | 72   |
| ./util/cert.go                       | 15    | 7       | 70   |
| ./daemon/rpc.go                      | 10    | 10      | 68   |
| ./visor/rpc.go                       | 18    | 38      | 56   |
| ./gui/blockchain.go                  | 6     | 1       | 51   |
| ./gui/cert.go                        | 5     | 9       | 49   |
| ./wallet/balance.go                  | 11    | 6       | 46   |
| ./gui/json.go                        | 7     | 6       | 36   |
| ./wallet/wallet.go                   | 11    | 37      | 32   |
| ./gui/error.go                       | 7     | 1       | 29   |
| ./gui/template.go                    | 4     | 1       | 25   |
| ./gui/network.go                     | 4     | 1       | 23   |
| ./util/time.go                       | 4     | 3       | 13   |
| ./wallet/wallet_util.go              | 0     | 0       | 1    |
| ./visor/json_rpc.go                  | 1     | 7       | 1    |
| SUM:                                 | 988   | 1693    | 5748 |

So Skycoin has 6000 lines of golang code. 8000 lines of unit tests.

#### Sorted by Name

| File                                 | blank | comment | code |
|--------------------------------------|-------|---------|------|
| ./cipher/address.go                  | 20    | 29      | 80   |
| ./cipher/base58/base58.go            | 41    | 24      | 178  |
| ./cipher/crypto.go                   | 51    | 56      | 325  |
| ./cipher/hash.go                     | 20    | 13      | 108  |
| ./cipher/ripemd160/ripemd160block.go | 24    | 19      | 118  |
| ./cipher/ripemd160/ripmd_160.go      | 19    | 14      | 87   |
| ./coin/blockchain.go                 | 66    | 141     | 478  |
| ./coin/outputs.go                    | 34    | 55      | 138  |
| ./coin/transactions.go               | 45    | 57      | 250  |
| ./coin/unspent_pool.go               | 15    | 21      | 106  |
| ./daemon/daemon.go                   | 53    | 117     | 611  |
| ./daemon/dht.go                      | 13    | 20      | 105  |
| ./daemon/gateway.go                  | 29    | 103     | 96   |
| ./daemon/messages.go                 | 36    | 57      | 246  |
| ./daemon/peers.go                    | 10    | 14      | 82   |
| ./daemon/pool.go                     | 11    | 14      | 81   |
| ./daemon/rpc.go                      | 10    | 10      | 68   |
| ./daemon/visor.go                    | 60    | 88      | 376  |
| ./gui/blockchain.go                  | 6     | 1       | 51   |
| ./gui/cert.go                        | 5     | 9       | 49   |
| ./gui/error.go                       | 7     | 1       | 29   |
| ./gui/http.go                        | 8     | 15      | 72   |
| ./gui/json.go                        | 7     | 6       | 36   |
| ./gui/network.go                     | 4     | 1       | 23   |
| ./gui/template.go                    | 4     | 1       | 25   |
| ./gui/wallet.go                      | 71    | 282     | 259  |
| ./util/cert.go                       | 15    | 7       | 70   |
| ./util/file.go                       | 10    | 8       | 84   |
| ./util/time.go                       | 4     | 3       | 13   |
| ./visor/blocksigs.go                 | 12    | 17      | 93   |
| ./visor/json_rpc.go                  | 1     | 7       | 1    |
| ./visor/readable.go                  | 29    | 34      | 153  |
| ./visor/rpc.go                       | 18    | 38      | 56   |
| ./visor/serialization.go             | 10    | 4       | 86   |
| ./visor/spend.go                     | 23    | 23      | 132  |
| ./visor/unconfirmed.go               | 25    | 36      | 173  |
| ./visor/visor.go                     | 81    | 234     | 371  |
| ./wallet/balance.go                  | 11    | 6       | 46   |
| ./wallet/deterministic.go            | 27    | 27      | 104  |
| ./wallet/entry.go                    | 12    | 11      | 77   |
| ./wallet/readable.go                 | 19    | 25      | 95   |
| ./wallet/wallet.go                   | 11    | 37      | 32   |
| ./wallet/wallets.go                  | 11    | 8       | 84   |
| ./wallet/wallet_util.go              | 0     | 0       | 1    |
| SUM:                                 | 988   | 1693    | 5748 |

## Skycoin Module Overview

skycoin.coin is the blockchain parser
skycoin.cipher is the cryptography library and address parser
skycoin.visor runs the the blockchain. Downloads blockchain, manages blockchain state, exposes API
skycoin.daemon is the networking module. It does DHT, packets and peer-exchange. It is being replaced by Skywire
skycoin.gui runs the html web-wallet frontend and JSON API.
skycon.wallet is the JSON wallet library.
skycoin.util is functions for saving files to disc and other tasks

Bitcoin uses OpenSSL for encryption. Skycoin includes the encryption library and has the absolute bare minimum of external dependencies. The dependencies that it does have, are being removed or reduced over time.

##### Remaining Work

- The wallet needs to be refactored and cleaned up. 800 lines of code were just removed and the wallet format is being improved https://github.com/skycoin/skycoin/commit/98cb1b3dad6cd34791b69bc54026a2bce48f374b
- Daemon needs to be replaced by Skywire. This will allow consensus algorithm implementation and allow the operation of the darknet/meshnet. There is a single DHT library that needs implementation for the meshnet/darknet to be fully operational. Skywire is "the new internet", where IP addresses have been replaced by public key hashes. It is similar to Tor but can have lower latency than IPv4/IPv6 (mostly because of hot potato interdomain routing).
- Cipher needs ChaCha20 support
- Cipher's secp256k1 code needs to be moved from C to Golang, so that we can do cross platform builds easily without any cgo dependency.
- Visor could be cleaned up. Visor is being refactored soon.
- There needs to be a thin-client separation between /src/gui and /src/visor so that cell phones can do transactions easily, without running the full blockchain. We may add a golang RPC layer between visor and the JSON api exposed by GUI.
- We need a library for doing blockchain storage. blockdb
- We need a library for doing transaction history and exploring the blockchain, exposing a JSON api. Skycoin is designed to be minimalist so this was not included as part of the core libraries.
- Merkle-DAG needs to be implemented, so that we can download all blocks in the blockchain in parallel. Merkle-DAG is Skycoin's peer-to-peer content addressable storage standard, "Bitorrent 2.0" protocol based upon IPFS. Merkle-DAG is a stripped down minimized version of IPFS that uses Skycoin's cryptographic primitives and Skywire for networking.

We also need to put together a full time team, working on infrastructure investment. After Skywire and consensus is implemented. This will move us towards deterministic builds for golang and improve the language run-time to meet the needs of the project.
