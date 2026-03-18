+++
aliases = ["/development-updates/development-update-129/"]
date = "2017-04-26"
tags = ["Development"]
title = "Quality Control and Bug Fixes"

+++
We are doing misc quality control and major bug fixes now

***

We fixed a few bugs and path directory issues for the windows non-electron build. There was an error in the packaging script and assets were copied to the wrong path and the executable could not find the assets and server terminated on start.

This should be fixed wallet version 15.

***

We are hunting down and fixing a transaction prorogation issue, where a small number of TX hashes are not propagating to all nodes because of some race condition. We think it is fixed, but are still testing. We have implemented transaction rebroadcast, but disabled it by default because new state information flag for TX in unconfirmed pool should resolve the issue.

* A node will only broadcast a TX if it can be executed against the current set of unspent outputs
* If a new block is created, but a node receives a TX spending a UX output created in the next block, but the node has not received the new block yet, then the node will not announce the TX hash
* Then when the new block is received, the state of the transaction becomes valid/executable but the UX object was not broadcast
* The node will ignore all future TX announces for that TX, without broadcasting the hash because the TX object is already in the unspent output set

### This edge cases happens:

* If TX spending UXTO object created in next block ,comes in before the block (happens to exchanges somtimes if doing transactions in rapid succession)
* If the node is just starting up after a few hours of being offline and receives a TX set, while still catching up on latest block set

### To fix this edge case we

* Ensure that nodes now announce the hashes of their whole unspent TX set on connect (we thought this was implemented but it was not)
* Persist transactions in the UXTO set by default (now enabled)
* Added a manual TX rebroadcast JSON and CLI function
* Track transaction status with a boolean flag. If a TX object in the unspent output pool goes from unexecutable, to executable on the current unspent output set, then it will automatically trigger a broadcast for that TX

### This should also fix the unrelated bug where:

* a TX is injected and the node has zero peers
* the node connects to one or more peers but the TX object never propagates

### This bug was resolved by:

* Key value store persistence of unspent TX pool by default between node restarts
* Announce of all TX in the unspent output pool by default on connection between nodes

## Exponential Backoff with Zero Peers Bug

If the internet goes down, all the peers in peer list get blacklisted by the exponential backoff algorithm.

We are resetting exponential backoff time for peer connection attempts now, upon connections falling below 2.

This will speed up time for node to reconnect to network, after internet is down for a period.

## Peer Exchange Bug

Peer exchange is now disabled again by default. Needs more testing. There is problem with handling of unsolicited connections and the loopback auto disconnect, to prevent two connections to the same node.

If a node has an open port, then it can attempt to connect out to a node. That same node can also attempt to open a connection in to the node, so we end up with two connections between the node and we have bug in the loop back auto detect connection, for unsolicited (incoming connections), that end up disconnecting both the incoming and outgoing connection between the node.

We think this is what is causing a bug where server with peer exchange enabled, is getting zero peers but are not sure.

Will fix this soon.