+++
aliases = ["/development-updates/development-update-107/"]
date = "2016-10-10"
draft = true
tags = ["Development", "Skywire"]
title = "Mobile API is Done"

+++
The Skycoin Mobile wallet API is done. For Bitcoin and Skycoin. Will add Litecoin, Dogecoin and Ethereum later.
- https://github.com/skycoin/skycoin-exchange/tree/master/src/api/mobile
- The library is wrapped with gobind and can be used as a plug-in in Phonegap applications or natively by Android or iOS applications

###### The Skycoin blockchain history JSON API is done:
- The web interface is in progress
- https://godoc.org/github.com/skycoin/skycoin/src/visor/historydb
- https://github.com/skycoin/skycoin/tree/master/src/visor/historydb

###### The first version of the Skycoin block storage library is done:
- Memory mapped file and BoltDB key value store
- https://godoc.org/github.com/skycoin/skycoin/src/visor/blockdb
- https://github.com/skycoin/skycoin/tree/master/src/visor/blockdb

###### The Skycoin CLI and WebRPC interface API is in progress:
- This is last step required for integrating Skycoin into existing exchanges.

###### The first version of Skywire interface is done. It is being integrated with the JSON API now.
- You can run current version with cd skycoin; ./run-mesh.sh
- also the mesh command in skycoin/src/mesh. ( `cd skycoin/cmd; go run ./mesh/mesh.go` )

![](/img/dev-update-107-1.png)

I will explain this more, as it is closer to working.

###### You will have a number of "Nodes" that you control (your "personal cloud" or "personal botnet" really)
- You will be able to provision additional nodes (installing node on additional computers or rent out 20 VPS instances in different geographic location, by the hour for Skycoin)
- The nodes will appear in your botnet list
- You will be able to deploy applications on the nodes and perform orchestration

###### For instance, for dropbox type storage
- You may attach a Raspberry Pi to a 100 TB hard disc and run a node
- You may run multiple such nodes and run a "distributed file system" service on the nodes (which will automatically sync and replicate files within your personal cloud)
- You may rent a number of VPS servers by the month with 10 GB storage and deploy the storage service across them.

###### This is actually a distributed multi-agent system. So when you attempt to download a file
- There will be a list of files or things to download
- The downloads will be delegated across the agents or node (the goal)
- The agent will take incremental actions towards accomplishing the goal (the file will be downloaded into your personal cloud or personal botnet. Then once inside the network, the file will be replicated within your network, to where it needs to be consumed)

###### If you are encoding a video file
- the network is aware of locally available nodes and compute resources
- the video will be cut up and the pieces distributed over available compute resources

###### If you have a computer, a tablet and two cameras
- All devices will share a global networked file system
- When you take a photo on the camera, the photo will automatically be replicated and available to any other computer in your botnet or swarm or personal cloud

###### If you have fifteen drones with cameras
- They will automatically form a meshnet over wifi
- They will automatically replicate peer-to-peer, saved images

###### For the base level network there are new primitives
- Nodes
- Transports
- Routes

###### Node:
- A node is a thing (identified by a pubkey) that accepts and emits length prefixed messages.
- A node has a list of transports

###### Transport:
- A transport is a point-to-point connection between nodes (from Pubkey A to Pubkey B), for the emission and receipt of length prefixed messages.
- Transports are pluggable (are defined by an interface, that allows multiple transport implementations)
- A transport stores and forwards length prefixed messages between nodes

###### Routes:
- A route is a software defined networking, rule for forwarding length prefixed messages. In I2P they are called "tunnels" (however, it is not a darknet and we do not use onion routing and it is designed to be low latency). These are a primitive from MPLS.

###### Then on top of that, there will be another level of primitives for implementing
- RPCs
- pubsub
- point-to-point messaging (TOX type)
- federated messaging (XMPP type)
- asynchronous messaging (Email/Bitmessage Type)
- machine readable RPCs
- service discover
- multihoming (network bridges/tunnels)
- source independent networking (concept from Urbit, used heavily in Skycoin in the consensus algorithm)
- public broadcast channels (cryptographic primitive, similar to DHT but for peer-to-peer replication of messages signed by a particular host). There are three different types of public broadcast channel primitives or types, that are useful for developers.

Then on top of that layer, there is another layer, which includes the skycoin-exchange serves, services and application servers that expose machine readable RPCs.

##### Ignore Below Line:

Then on top of that, there will be more experimental projects

For the multi-agent system, it requires new primitives
- behaviors
- goals
- affordances (see: https://en.wikipedia.org/wiki/Affordance )
- predicates
- etc...

This part is the furthest away, because it requires a new programming language that satisfies particular mathematical invariants and symmetries
- Algebraic (programs are constructed by application of a series of operators applied to a null object)
- Abstract syntax tree based (it has no representation as a text file)
- Requires a metacircular interpreter
- Is deterministic (programs accept and emit length prefixed messages and the output is a deterministic function of the input)
- Has a meta-syntactic operator
- supports COLA (combined object lambda architecture) type programming
- Reflection (every program and object has a canonical serialization as a byte array)
- Has a "choice" operator (the interpreter or executing object is given a choice between N things)
- Transitive closure under particular mathematically operations (the ability to simulate ten individual processes or a network of computers, under a single process, with those processes able to in turn simulate other processes. Genode model.)

- The language will look exactly like Golang or C.
- The memory model is identical to C and the speed should be the same.

###### One of the things we need to do is
- Take a program or code
- Serialize it into a canonical representation as a byte string
- Invoke the code on a remote server, by the hash of the byte serialization of the code

###### So example:
- Each "swarm" or "personal cloud" or "personal botnet" will have a DHT (key-value store, with SHA256 hash mapping to the data which hashes to that value)
- An orchestration server will send message "Run project H1 (hash), with input data tuple (H2, H3). Then when it is done, the result will be H4 (The result is data that serializes to []byte that hashes to H4).
- (H1) (H2, H3), (H4)
- { program: H1, Input: (H2,H3), Output: H4 }
- Any program that runs H1 on (H2,H4) will get H4 as output
- If a compiler H1 compiles its own source code H2, then it should get H1 back.

###### For distributed functional reactive programming
- You give a tuple a label, (LABEL A, (H2,H3))
- You define (LABEL B, (RUN H1, A) ) //B is the output of running H1 on A
- You can use B somewhere
- When A is modified (an operator modifying A is applied to a blackboard shared between the processes), then the label B will be recomputed
- Then any result depending on B, will then be recomputed
- One type of "blackboard" for posting transactions (such as modifying the assignment of a label), can be a blockchain (multi-owner consensus) or a public broadcast channel (single owner).

This can occur within a single process or program (such as rendering a web-page), or on a blackboard shared between multiple processes (distributed).

###### This area is an algorithmic goldmine
- I found a new type of codress messaging, that is immune to traffic analysis
- There appears to be a new type of simple cryptographic ratchet, that appears to be equivalent to a method of distribution of one-time pads over a public network, where an opponent cannot distinguish the correct decryption of a message, even if they have intercepted all messages in the stream of messages between x and y AND they have a turing machine, that can be run for an infinite number of steps (infinite computation). It can be shown using a proof from Kolmogorov complexity, that if certain conditions are met, that no function exists which can select the correct plaintext for a given encryption, even if all possible states of the cryptographic ratchet are exhaustingly tried, because no function exists which can determine the decryption (equivalently the probability distribution on the plaintext is uniform over the set of plaintext, given the message stream in the ratchet, even if the state of the ratchet and potential decryption can be enumerated exhaustively).
- the most trivial case of this reduces to the case of if there are two parties, A and B with an unknown preshared key. A generates 512 bytes of random junk, then encrypts it with AES. Then sends the message to B. Someone intercepts this message and tries to "decrypt" it by exhaustively trying all possible AES keys. There does not exist a function f, that will determine the correct decryption, so having infinite computational power and exhaustive search of all AES keys, does nothing.
- A cryptographic ratchet, between A and B, is a stream of messages between A and B, with a shared state S. The shared state S is updated as the stream of messages between A and B proceeds (based upon the content of the messages). Each message is encrypted with a function of S and as packets are send and ACKed, both A and B update S. S is used to derive encryption keys for the messages between A and B.
- Kolmogorov complexity shows that for a stream of messages, that compressibility is equivalent to decryptability for an adversary with infinite computational resources.
- If I encrypt "aaaaaaaaaaaaa" (compressible message) with ChaCha20, then the correct decryption (the correct key) is usually the key that produces the most compressible plaintext output. The compressibility of the plaintext output (size in bytes of smallest turing machine program that produces the output) can be used to define a Bayesian probability distribution over the plaintext and encryption key (or cryptographic ratchet state at each step in the message exchange process), with keys producing more compressible outputs being more likely.
- for f(plain_text, key) = cipher_text. A 256 bit plaintext, encrypted with a 256 bit key, will have ~1  valid key for each plaintext input
- for  f(plain_text, key) = cipher_text . A 256 bit plaintext, 512 bit key, 256 bit cipher output, there will be ~2^256 keys that generate the same cipher text for a specified plaintext
- for f(plain_text, key) = cipher_text . A 256 bit plaintext, 128 bit key, 256 bit cipher output (example; ChaCha20 default usage), there will be ~1 key that generate the same cipher text for a specified plaintext
- for f(plain_text, key) = cipher_text . A 256 bit plaintext, 128 bit key, 512 bit cipher output ...
-  for f(plain_text, key) = cipher_text . A 256 bit plaintext, 512 bit key, 512 bit cipher output ...
- for an opponent that has the cipher text and can exhaustively try every possible encryption key, they will have different probabilities distributions over the plaintext, for the above cases. The entropy or sum(x of X for P(X), P(x) log2(P(x)) ) of the distribution P(x) (estimate of probability of cipher x was used, based upon the contents of what was recovered from the cipher text under this key). This "entropy" is how peaked the distribution P(x) is, determines a measure of "information leakage" per message, against an opponent with infinite computational power and who had intercepted all messages in a chain of messages.
- This metric can be useful to make a particular algorithm "maximally annoying" by selecting the parameters that will make the most work, for an opponent with infinite computational resources and omniscient ability to intercept and record messages.
- If you send junk (random noise, uniform distribution) and have no known plaintext in the message, for an opponent with infinite computational resources and interception ability, the best probability distribution for a given plain-text being sent, for a given intercepted ciphertext output is a uniform distribution (no information).
- So under certain conditions, a message can be sent between two parties, which gives no information to attacker with infinite computational resources and the ability to intercept all messages. However, these types of messages can be accumulated into an entropy pool in a cryptographic ratchet.
- Using the above argument, you can show that one-time pads can be securely distributed over a network (even if all messages are intercepted), assuming there exists a one-way function that is "strong" with respect to the adversary with finite computation, but perfect interception ability. By accumulating entropy from uniform distribution messages into the ratchet state, using the secure one way function and using the same function for deriving keys from a nonce and the ratchet state, then deriving the "one time pad" from a nonce and window over the ratchet state passed through the one way function.
- ECDH can be used, but the ratchet and one-way function is stronger (has fewer assumptions, more frustrating for attacker with state resources or infinite computational ability), then just ECDH+ChaCha20. Even if an attacker has a "quantum computer" or can solve discrete logarithm in polynomial time, it will not help them much.
- It is better to ratchet with a one-way compressible function AND ECDH, than just using ECDH
- Including any known plaintext inside of a message or any data that is non-uniform, repeated or compressible, reduces the theoretical entropy against an attacker with infinite computational resources and interception ability. If a nonce is a uniformly distributed, random 256 bit integer, then encrypting it and sending it does not reduce theoretical entropy (for attacker with infinite computation and perfect interception). Encrypting known plaintext or compressible text (error correction codes, attributes that can be computed from message such as length prefixes, or compressible attributes or sequence numbers) does reduce theoretical entropy. This is a consideration for what should be included in the encrypted part. Leaving some data out, makes traffic analysis easier but maximizes the entropy measure. The greatest reduction is in sending know plaintext (where attacker can guess the protocol being used and where the message content is non-uniform distribution. If you have a one-way function and can send N byte messages with 2*N bytes (double bandwidth usage), then it is possible to perfectly "randomize" even a null string, with respect to the entropy metric (assuming a one-way function).
- There are other methods of "frustration" that can be maximized for a ratchet, besides the entropy metric against attacker with infinite computational resources and perfect interception ability. Another metric is circuit size for 3-SAT and memory usage.
- There are other "frustration" metrics for traffic analysis and timing channel attacks (such as numbering and funneling all operations that require private keys into an input queue and only handling output queue every 5 ms, to prevent timing channel attacks from achieving temporal resolution greater than 5 ms). Constant time operations.
- For Deep Packet Inspection, a network where every packet is exactly 512 bytes in size would be "maximally frustrating", because the histogram of packet sizes would contain zero information. Constant sized packets.
- For traffic analysis, a connection where the rate packets are being sent over a time interval, is statistically independent of the rate packets are being received. Is maximally frustrating. Constant rate channel.
- Another "maximum frustration" metric is maximizing the volume and rate of data that must be exfiltrated, to reconstruct a stream.

There are some thing I do not believe should be open sourced. It would be problematic.

It is interesting to see Open Whisper Systems and Matrix starting to implement cryptographic ratchets.