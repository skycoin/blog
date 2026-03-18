+++
aliases = ["/development-updates/development-update-7/"]
date = "2014-03-11"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #7: Skywire Protocol Update"

+++
## Development Updates:

We are updating the Skywire protocol. This is the last thing on checklist before launch.

## Blob Replicator:

The Blob Replicator is done. Blob replicator is used for transaction replication and the emergency messaging system.

- https://github.com/skycoin/cxo

###### This uses a gossip protocol to replicate data among a swarm of peers:

- A blob is a series of bytes. The id of a blob is its SHA256 hash
- On connect a peer receives a list of all the hashes of the Blobs the peer has.
- The client requests any blobs peers have that the local client doesnt have
- When a client downloads a new blob, it announces the hash of the blob, so other peers know it exists
- There is a callback function that determines if blob is valid, should be ignored or if peer sending the blob should be kicked
- Blobs are only replicated if they  are "valid" and the callback function judges validity

## Uses of blobs include:

- Emergency messaging system (criteria: blobs contain valid signature)
- Transactions (criteria: transactions must be valid and meet various criteria)

## Request Manager:

Request manager is under development and almost done. Request Manager rate limits requests and is used to protect against DDoS and Sybil attacks.

#### Request Manager:
- Queues up requests for data and spreads them over times
- Leeps tracks of what requests are in progress
- Limits requests per peer
- Disconnects clients who are not responding to requests
- Disconnects clients who send data that was not requested
- Stores information for detecting DDoS and Sybil attack nodes
- Kicks nodes that are slow, to speed up blockchain downloads

## Hash Chain Replicator:

This is like the Blob Replicator, but used for block chain replication. This component is used for downloading the blockchain and for Obelisk.

This is last component of the wire protocol before launch.