+++
aliases = ["/development-updates/development-update-69/"]
date = "2015-04-19"
draft = true
tags = ["Development"]
title = "Development Update #69: Skycoin: Attack of the Bugs 2"

+++
##### There was a "disappearing coins" bug on windows.
- You download all ~120 blocks, you see 100 coins
- You close client, there is not sig signal for clear program exit triggered on windows, so you lose all the blocks (they are not saved to disc, like they are on exit, on linux)
- You open client and the coins are "missing", until you redownload the blockchain to current head

So coins were still there and appears to just be bug with blockchain not being saved to disc on exit on windows. So coins don't appear until the blockchain has been redownloaded.

This needs to be fixed.

##### Other bugs/Things to do
- Connecting to network takes a bit of time. Some users cannot connect at all.
- PEX stores and exchanges peer lists. It is exchanging peers that cannot be connected to (only allow outgoing connections). PEX should only store peers that allow incoming connections.
- PEX should keep time you last connected to peer and keep list sorted. So you immediately connect to old peers on restart.
- PEX should be moved into the skycoin repo, so we can update it
- PEX needs interface in GUI, to allow you to see peers you are connected to and to add peers by hand, as default connections
- PEX needs option to only connect to selected list of peers and not publicly (in case you need hide application)
- Networking is still TCP/IP. We need to upgrade to UDP with hole punching. Until then, it is very difficult to connect to people behind firewall. The connection interface is abstracted, so adding new types of connection type (HTTPS, UDP) should be easy

##### Transaction Queue TODO
- The /transactions does not show pending transactions, but instead shows outputs. Need to fix this
- Need to show pending transactions in and out, for your wallet, in the gui
- Need to queue up transactions when multiple transactions are outgoing from same wallet

There are a few hundred improvements, like this that need to be made until its perfect.