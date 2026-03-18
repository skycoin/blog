+++
aliases = ["/development-updates/development-update-109/"]
date = "2016-10-18"
draft = true
tags = ["Development"]
title = "New Wallet"

+++
##### There is a new wallet format:
- https://github.com/skycoin/skycoin/pull/168/files


- BACKUP YOUR CURRENT WALLET
- Write down your wallet seeds and store them somewhere safely
- Open wallet with a text editor and look for "seed" value

As long as you have your wallet seed, you will get the same addresses and private keys

## Questions about installation

Skycoin can be installed in one line
```
go get github.com/skycoin/skycoin
```
However, $GOPATH has to be setup. gvm is supposed to do this.

The installation instructions are in readme.md
- https://github.com/skycoin/skycoin/blob/master/README.md
- https://github.com/skycoin/skycoin