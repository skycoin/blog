+++
aliases = ["/development-updates/development-update-117/"]
date = "2016-11-23"
tags = ["Development", "BBS", "Skywire"]
title = "Skycoin Social Platform Launch"

+++
## Summary:

We are launching our own post blockchain social platform. Starting with an immutable object replication system, inspired by Urbit and IPFS. Which is designed for decentralized social networking and source independent networking.

We started this on friday and we almost have a decentralized text only version of 4chan working, five days later.

- https://godoc.org/github.com/skycoin/cxo
- https://godoc.org/github.com/skycoin/bbs

- Each object has a schema and is a struct (with basic set of atomic types)
- Each object has a canonical serialization as a byte string
- Each object instance IDed as the SHA256 hash of its []byte serialization
- Each object can Href (hash ref) over objects (like a pointer to an immutable object)
- The objects are stored in a map from SHA256 hashes to []byte
- We track which objects we have references to, but which we do not have local copies to
- Garbage collection is easy because we have a directed acyclic dependency graph in this form (like Rust, there are no pointer cycles allowed)

This type of immutable object system is designed for peer-to-peer replication over Skyhash/Aether
- https://github.com/gagliardetto/skyhash-pub-sub

In Aether, there is a swarm of people subscribed to public key A
- A serializes a root object as a []byte, hashes it, signs it with their private key and then publishes it
- the root object is published peer-to-peer
- the objects referenced by the root object are pulled in recursively

This will replace Bitorrent, IPFS, zeronet, maidsafe, Tox, bittorrent sync, http, bitmessage and more with a single protocol that can cover a wider range of use cases more easily.

If public key A subscribes to pubkey B and pubkey B subscribes to pubkey A, then it gives you a Tox or Bitmessage like asynchronous messaging channel with peer to peer replication.
- Nodes A, B by public key
- A subscribes to B
- B subscribes to A
- A publishes a message that only B can read, into its pubsub channel
- B publishes an ACK to A, confirm message receipt
- A removes the href to message in next round

This protocol is very good for peer-to-peer replication of static content like websites, blogs and youtube videos.

## Meshnet sequence diagrams

We are doing UML protocol sequence diagrams for the meshnet now.

![](/img/dev-update-117-1.png)

The network is very similar to I2P, except that it is designed to be fast. I want to get this working (again) soon.

--- build automation

We are doing docker, ansible and juju. For node installation, deployment. Will have scripts that automatically SSH into node with ansible and install golang and install from source and run nodes.

This should help with large deployments.

## CLI

The Skycoin CLI and WebRPC is working and is better than Bitcoin or Ethereum.

We fixed issue with the CLI and web-wallet contending to write for same wallet files. We will add ability to disable the web-wallet APIs for nodes that will be used over the thin client interface.