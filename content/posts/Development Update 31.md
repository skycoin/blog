+++
aliases = ["/development-updates/development-update-31/"]
date = "2014-07-13"
draft = true
tags = ["Development", "Skywire", "Cryptography"]
title = "Development Update #31: Skycoin Cryptography Upgrades"

+++
## Cryptography Upgrades:

We are getting a function for encrypting blocks of data with ECCDH. There will be simple function that takes a public key and encrypts to binary and a simple function that takes the recipients private key for decryption from bytes.

## Encryption Format:

```
struct EncryptedMessage {
   Pubkey Pubkey //ephemeral pubkey Q
   Data []byte   //padded to 4096 bytes, length prefix and 32 bit checksum
}
```
Their pubkey is P, your ephemeral pubkey is Q.

You generate random 20 byte integer q (your private key). You raise the base point in the curve to power of q to generate your public key Q.

You raise their pubkey P to power of q to get secret S. You publish Q (your pubkey). They raise Q to power of their private key p to generate the same secret S. p*Q = q*P as p*Q = p*(q*b) and q*P = q*(p*b) and p*(q*b) = q*(p*b).

The Data is encrypted asymmetrically with ChaCha20, using key SHA256(S). A new private/public ephemeral key is generated for each and every message.

## Address Format Changes:

#### Previously the binary address format was:
```
struct {
 char[20] address; //public key hash
 uint8 version;
 char[4] checksum; //first 4 bytes of sha256 of the
}
```
#### The new format is:
```
struct {
 uint8 version
 chat[20]  address
}
```
Checksum is only in the printed, base58 string of the address and no longer in the blockchain. In the Base58 representation of an address, version comes after address, followed by the checksum. This is to allow vanity addresses with arbitrary prefixes. Version should prefix the binary representation to enable variable length address fields if changes to address generation become necessary in future.

## Data Serialization:

We are formalizing the struct and serialization format used for the wire protocol. This will be the standard across Skywire applications (including the Skycoin wire protocol).

The wire protocol and services protocol is switching from struct based messages with a handler function, to RPC style function signatures. This will replace the existing Bitcoin/Bitorrent style packet system with an RPC system with a cleaner machine readable interface for distributed application development.

#### Instead of:
```
struct Message {
 //data
}

func HandleMessage() {
 //called when client receives message of type Message
}
```
#### The New API will be :
```
func MessageAPI(in MessageStruct, ret *ResponseStruct {
//read in input, fill out response
}
```
This function will be registered with RPC interface, exposing it over network to remote hosts. Remote hosts can invoke the method and receive the returned data. The protocol will eventually allow servers to expose methods for labeled objects across the network.

The RPC and binary serialization format are extremely low overhead compared to ProtocolBuffers, Thrift and Golang's Gob. However, they are more restricted and specialized for fixed sized and variable sized binary data. The protocol is specialized for implementation of distributed applications with mostly fixed fixed sized data such as Bitcoin Wire and Bitorrent, but JSON blobs with optional fields can be treated as special case by marshaling and encoding as variable length binary data.

## Changes to Daemon

There are major changes to the networking stack occuring.

Currently the application stack is
gnet -> Skywire -> Applications

gnet handles connection pools, packet serialization and the services stack
Skywire is the Daemon which services are registered with and handles service peer lookup
Applications are things like the blockchain wire protocol and distributed applications

The new networking stack has the meshnet/darknet at the lowest level. This handles connectivity and has 3 modes of physical/link layer connectivity
- TCP (darknet, peering over legacy internet)
- Wifi/802.11 (meshnet operation, peering over wifi)
- Ethernet (peering between nodes over ethernet on non-public IP address space)

The new "Skywire" is the meshnet/connection pool module. Gnet has been deprecated. Daemon has been deprecated. Services interface with Skywire directly. Most of the functionality in Daemon has been eliminated and the peer lookup itself will be moved to a library or service.

The Kadmedlia DHT peer lookup is a singleton. It takes a port and should be shared between service instances, instead of creating a new instance for each service and we have to figure out where this goes.

## Low Latency Internode Messaging:

Skywire is connection oriented. Streaming video, Bitorrent, SSH, Skype, Video games, website requests and other application streams fit into the existing "route/circuit" model very well (including UDP between two hosts).

Short messages have significant overhead. Such as sending 200 bytes to a node and never contacting node again. The only application that does this is unfortinately DHT lookups.

One solution for low latency internode messaging over a connection oriented protocol, is to have supernodes.
- Eeach node connects to one or more supernodes
- Super nodes maintain connections to each other
- Messages are routed over the super-node topology without client incuring route setup cost between end-points

We are looking into solutions for problem. Skywire will need some kind of telehash messaging implementation. Several applications require fast connectionless messages for pub/sub notification, connection setup, DHT lookup and other distributed application use cases.

## Lessons from Skywire Networking So Far

Some of the networking problems we are facing are completely new.
- It may take several years to achieve optimal solutions (how to do completely decentralized route discovery!?).
- The best solutions will come from the community and academia, not necisarily the core development team (ex. Bitorrent DHT)
- The framework should be flexible enough to allow multiple competing implementations of each component and continious evolution of the application ecosystem
- Put in place a centralized system to get it working quickly, then swap it out with something decentralized as soon as possible
- measure and instrument performance of different solutions, so they can be compared

###### In particular:
- How do you quickly find efficient routes when addresses are non-topological?
- How do you quickly find efficient routes in a fully decentralized manner?
- How do you set up routes between N nodes without incuring the round trip latency between each node in chain?
- How do you deal with nodes with rapidly changing multipath connectivity (mobile-ad hoc routing)