+++
aliases = ["/development-updates/development-update-41/"]
date = "2014-10-31"
draft = true
tags = ["Development", "Consensus"]
title = "Development Update #41: Tutorials, Reflections and Requirements"

+++
## Summary:

Everything is going very rapidly. We will be out of new things to code within a finite amount of time on the current trajectory. All the project goals will have been achieved and then we need to figure out what happens next.

1) We must finish the developer documentation and tutorials.
2) We must do the distribution.

When we started development, Golang was experimental and frustrating. Build reproducability was difficult, developers were stepping on each others toes and debugging goroutines was impossible. The Golang tool chain is maturing rapidly. Many problems we had a year ago are solved.

For organization, we found the best thing is to put everything on github. Use the github wiki, use the github issue tracker for bounties. The project is being split up into coherent logical blocks. We did not know the best way to split up the components of the project until everything was implemented.

## Reflections on Consensus:

In the last year there has more formal research into Skycoin type consensus algorithms. We are confident that mining will soon no longer be a requirement for blockchain security or consensus. There is on going explosion of formal research (see: SybilLimit https://www.comp.nus.edu.sg/~yuhf/yuh-sybillimit.pdf ).

As we developed and refined the consensus algorithm, it went from simple to complex and then back to simple. One of the requirements is that it worked and was only a few thousand lines of code (so that it could be audited) and edge cases and flow paths were minimized. As the algorithm was examined through different facets, we found the core and were able to determine what class of attacks were acceptable and which attacks were existential and unacceptable (primarily attacks resulting in financial loses). The elegance of implementation is only possible because the implementation rests upon several layers of libraries for implementing new cryptographic and networking constructs.

The last of these primitives are designed and implementation is proceeding. Documentation is becoming important as Skycoin is not the only application that requires these components.

## Reflections on Requirements for Distributed Applications:

There have been advances in containerization and sandboxed runtime environments (Docker, pNaCl). Recent application sandboxes are coming close to meeting Skycoin project security requirements. Many things that we believed we would need to write ourselves, have begun appearing.

The basic requirement for the Skycoin distributed application and "personal cloud" infrastructure were
- Ability to run sandboxed services (processes identified by a public-key)
- Separation between configuration and data storage for services
- Sandboxed networking (networking only through execution environment API)
- Sandboxed disc access (each process occupies its own encapsilated disc environment, shared storage by remote application exposing the disc as a service over the network)
- Ability to run process in full emulation (for untrusted code), with option to compile down to native code for performance
- Sound, video and other privileged services exposed by services (processes) over network
- LLVM intermediate representation for deterministic builds for C, C++, Golang (platform independent when builds are run within emulated build environment through bootstrapping process).

Tools such as emscripten allow us to achieve this easily in a javascript emulation environment for C,C++, Golang and Python. A full tool-chain may be possible with a simple emulator and single LLVM backend from LLVM intermediate form to the emulator language. The emulator language itself will be stripped down version of LLVM intermediate form.

The existing sandbox executes javascript with Google's V8 interpreter and does not have disc or network access.  Distributed applications are still waiting on implementation of infrastructure components required to build a useful application.

## Reflections on Skycoin Communication Infrastructure:

Tox has solved many of problems we are facing, for messaging nodes by public-key. Tox was forced to use the Kadmellia type DHT and leaks metadata and timing information, which is undesirable. We have a document for new DHT infrastructure that would alleviate many of these problems.

As Tox is working and duplicates functionality required by Skywire, we are using it for prototyping the darknet. Tox does not protect IP identities of the public key. However, the functionality for finding and messaging nodes by public key is working which is the important thing.

We may introduce a "Connection" interface class to allow new connection types in the future, deprecate TCP/IP and move all existing Skycoin/Skywire communications over Tox. The dependencies are minimal and it appears that Tox can be built by the golang built tool.

###### The Tox project is very close to what we will end up with, however with a few changes.
Tox uses NaCl, Curve25519, Salsa20, SHA512.
- We would recommend Secp256k1,ChaCha20, SHA256
- For standardization with Skycoin primitives.
- For 32 bit performance
-- secp256k1 acts as a "coal mine canary". When algorithm becomes broken, Bitcoins will be stolen.
- We would recommend implementation of new type of DHT to replace existing peer look-up system
- Value is not Hash(key) but where the key is 20 byte hash of secp256k1 public key and the value is {KEY}, { POW, SEQ, EXPIRE, DATAHASH, SIGNATURE}, {DATA}.  (There is Key, Header, Value).
-  POW is a 20 byte proof of work (anti-spam)
-  SEQ is 32 bit number that is incremented on update (DHT nodes replicate value with highest SEQ number for the key. SEQ may be unix time at publication)
-  EXPIRE is the expiration date in unix time
--- DATAHASH is SHA256 of binary data in the key-value entry.
--- DATA is the 32 bit length prefixed contents of the key -> value
-- DHT nodes replicate tuples peer-to-peer. Invalid headers are discarded.
- The public key is extracted from the sigature. The public key is hashed. The key must be hash of public key.
- The signature is set to zero and serialization hashed with SHA256. Alternatively a subset of the fields is hashed (insuring immutability, inability of 3rd parties to modify data without invalidating the signature/hash). The signature must be a valid signature for the extracted pubkey and for the resulting hash.
- Tuple Serialization / Network Format:
- For serialization of structs/headers, for future proofing and cross platform implementation, { KEY, POW, SEQ, EXPIRE, HEADERHASH, SIGNATURE, DATA } is serialized as a map. [(int16,int16,data), (int16,int16,data), ...].  Each element has int (ex. KEY = 1, POW = 2, SEQ = 3, EXPIRE = 4, DATAHASE = 5, SIGNATURE = 6), length prefix for binary data, then binary data follows as bytes.
-- New fields may be added or removed as protocol evolves, without breaking compatibility / serialization.
- Cryptography Serialization
-- Signatures are 64+1 bytes (compressed secp256k1 signature plus recovery byte. Only non-malleable signatures are valid)
-- Pubkey Keys are 33 bytes (compressed secpk256k1 pubkeys. Compression is required.)
-- Pubkey hashes (Addresses) are 20 bytes. Address = {ripmd160(SHA256(SHA256(Pubkey)), VersionByte}. A one byte version byte is post-fixed to end of address (for upgrading curve in future). Default version byte value is 0.
-- Address serialization is base64. The 21 byte address serializes to 28 characters. ex. LS0tIFBPVyBpcyBhIDIwIGJ5dGU
- Peer Discovery Through DHT
-- This system allows contents of the DHT entry to be updated (unlike Kadmelia DHT). However it requires a new protcol to be throughout for friend requests. This needs to be worked out

###### DHT Replication:

Each DHT node should fully replicate every DHT entry in network (full replication, not Kademlia)
- Privacy (currently sybil attack appears successful at determining nodes making queries for particular pubkeys)
- Simpler replication, reduced complexity from Kadmelia. Increased bandwidth/storage usage.
- DHT replication can now run "within TOX" through TOX network, without external UDP queries leaking metadata
- There may be optional "Selector" in DHT
-  Some nodes may choose to only replicate portion of network, when cost of full replication becomes too great (support single application DHT key sets). Alternatively, nodes may start dropping the entry with lowest POW.
- Format supports multiple types of DHT and evolving DHT implementations as required.

This new DHT system is very similar to Bitmessage. However, instead of sending messages it gives each public key an area it can write to and update. You could call it a bitmessage-DNS system. This system supports the case where you want only people who know your pubkey to know things and when you want to publish something publicly to everyone (such as route information).

We will end up reimplementing something with same functionality as Tox, but slightly different. However for now, we can prototype the higher layers on top of Tox and save time.

We intially thought there were two layers to the darknet routing network. However, the lowest layer ended up being nodes with public keys which are identified with published IP addresses and accept connections from the public. Then there are nodes that are only privately peered. The network topology is mostly public for the purpose of finding routes, but there is no correspondence between the public keys of the node and an IP address.

###### This produces a new kind of pseudonyous networking. There are two kind of pseudonymity.
- There is no relationship between IP addresses and node public keys (unless the node is publicly advertising and peering with the public).
- A node passing traffic can only identify the previous and next hop for the traffic, not the origin or the destination for the traffic.

###### However this type of pseudonymity creates three problems:
1. Resource exhaustion attacks, route exhaustion (one node creating 10,000 routes cannot be differentiated from 10,000 nodes creating 1 route)
2. In a pseudonymous network, nothing stops leaching so the performance will be bad without a financial incentive
3. Nodes may lie about performance or route information. Bots may lie.

#1 is difficult. The attack requires as much resources for the attacker as the person being attacked. IP/TCP/UDP suffers from a similar attack. If a router can switch 10 Gb/s to a particular port and you send 10 Gb/s to an IP with destination on that port, it will cause packets to drop. The failure case for stateful networking is not dropped packets, but is that attempts to create new routes through that node will fail. However, many of these attacks only affect nodes with public peering.
#2 can be solved through coin incentives. This is relatively easy. Leachers will end up competing with other leachers for bandwidth in the leacher pool, but leachers wont be competing with the non-leachers for bandwidth.
#3 is difficult. You need one or more trusted source of 3rd party route and performance information. There is no "trust-less" way of doing this. It might be as simple as having bunch of people crawl the network and publishing data. A solution to this will develop over time. It will be incremental.

Once implementation is done, we have to deal with other problems. It is not clear why Tor is more successful than I2P. Tor has about 2 million users a day, so its still niche. Just getting the network working and ensuring it is well designed is not enough. We have to ensure that there are applications that will drive adaption.