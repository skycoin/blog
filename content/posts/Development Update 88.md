+++
aliases = ["/development-updates/development-update-88/"]
date = "2015-12-11"
draft = true
tags = ["Development", "Cryptography", "Skywire"]
title = "Development Update #88: Skycoin: Attack of the Bugs 4"

+++
The crypto library is not deterministic. It is failing for every one in twelve thousand keys.
- A private key should be a 32 byte integer, that is not zero and which is less than the order of the curve.
- The base point is raised to the power of the private key, to generate a public key

If you use the same private key, you should get the same public key. Between two different secp256k1 implementations.

This is not happening! It is failing. We wrote 80 unit tests putting random examples in and they do not match up. We have to go line by line, figuring out where it fails and why.

- It is absolutely exhausting
- It is extremely time consuming
- When it is done, the program will do exactly the same thing it does now (it is just replacing a library in C, with a library in Go that does exactly the same thing)

An example, is that a square root operation may fail for some input in library 1, but in library 2 the square root operation does not fail and the program gives a different output.

Getting the cryptography to be deterministic has been a nightmare.

Every single crypto library we have tested has had a few bugs. Sipa's library was perfrect, except for small crash for certain inputs, which he fixed. We put redundant error checking everywhere
- check that same private key generates same pubic key for same implementation (across large number of random keys)
- check that same private key generates same public key for different implementations
- check that signatures/recovery works for large set of random keys
- check that invalid keys are rejected (negative tests)
- test that randomly generated invalid signatures are rejected (negative tests)
- ... 80 other tests

Most of the library succeed on the positives (they work), but they often fail the negative tests.

We are working with two other companies now, who have similar infrastructure/needs and they are sharing developers.

## Research

In past four months, we have made some research advances.
- architecture for how meshnet/darknet needs to be implemented (no fixed program will work in long term, so collection of small specialized programs and method of chaining them together into useful system)
- primitives for network node (how to structure it so there are as few primitives as possible and they are easy to understand and implement)
- interface for how user will interact with software. Bitorrent is P2P, but it is still a single application running on a single machine. This type of network requires user to interact with +300 nodes, each independently running their own software and communicating together. Allowing users to interact with system and have introspection into what is going on, is difficult. If the user cannot see into the software and see what it is doing, they cannot fix it when it breaks or gets blocked. We decided console/terminal interface is best.
- we decided that users need to be able to perform introspection and monkey patch software if necessary. If it is not working, it cannot just show red circle like VPN GUI. They have to be able to see what is working or not working, then be able to take actions to fix or mitigate it. It is impossible to automate completely, handling many network situations.

Some of these issues, are issues I have with other software. Such as Bitmessage getting blocked if traffic goes through certain countries. Governments are beginning to block bitorrent. They will not just block bitorrent, but any traffic transiting through that country will be blocked also. The internet will fragment into hundreds of pieces and whether you can connect to an IP address will depend on where you are trying to connect from, the destination and multiple harassment, degradation and connection throttling way points the data has to travel through.

You wont have a single IP address. Application A will tunnel through to node B on protocol B1 and then from node B to node C using protocol B2 to country C. Application B will be running on a different pathway.

There are scripts for tying the paths together, or multiplexing multiple paths for higher bandwidth. Each hop on a path is a route.

Another major innovation (which is very significant), is that we figured out mathematically how to use one way asymmetric data links in the network as the basic primitive. This means that Node A can only send data to Node B, but node B cannot communicate back directly.
- military and intelligence applications will benefit from this, but does not affect most users
- This means for rural areas, you can take a wifi transceiver and an amplifier and boost the signal to illegal power levels. You can send data over 50 km and receive it on other side, but the weaker receiving antenna wont necessarily be able to send a signal back that can be picked up.
- A powerful HAM setup may be able to transmit long range and get picked up by a handset, but the handset does not have enough power to transmit back to the mega antenna

Military and intelligence often use systems like this
- A large radio receiver transmits a numbers station over a whole country
- The signal can be received by innocuous civilian radio and the message transcribed and decrypted
- a dead drop or another message channel is used to confirm message receipt, which eventually get routed to the station chief

The transmit and receive channel are not the same.

Satellite internet also uses an asymmetrical channel
- the satellite beams data to the local user at an extremely high rate
- the user communicates back to the satellite over a telephone line

Asymmetric connections are too complicated for normal users, but some organization have a use for them. For instance, if operating in country with blocking and extensive traffic analysis, messages or data feeds can be embedded in Youtube video. The access pattern looks normal and wont get someone tortured or flagged for interrogation.

Another thing is protocol tunneling. The encryption and encryption is very general. There is a just a script that the length prefixed messages get encoded by and then passed on.
- for an internal corporate network, you can have private keys and what application opened connection from what computer  and have deterministic private key generation so that the traffic can be read by exit point for policy enforcement
- you can swap out encryption algorithm just by changing script

An example of script chaining is
- a script that outputs binary packets as markov chain text (make it look like email/chat conversation)
- a script that tunnels the connection over AIM/XMPP/Skype from username/password to destination account

Another concept is called "idiotypic selection".
- You choose a metric/goal
- You choose a set of methods of solving problem
- the software chooses the best method for the current situation

For example;
- You are in Virginia piloting a drone in Afghanistan
- There are multiple satellites and ground stations you can bounce through
- The drone may be in range of a military base with ground radio connection and the drone also has lower speed direct satellite communication
- You want software to choose path that has lowest latency, but lowest jittter. So 100 ms latency may be better, than 50 ms latency with plus minus 50 ms on each packet.
- The software will make multiple paths and dynamically try to minimize target by changing traffic flow and opportunistically using connections as they become available or go out of range

If the software performs badly, you can still go in and set a route by hand or set multiple routes by hand. For instance, if a transceiver becomes congested and stops sending packets for seconds at a time, you might explicitly blacklist that path. Changing the network policy, should be a few key strokes in an environment that looks like Dwarf Fortress.

There is a feedback loop between the human/computer system
- user can set policy script that will behave automatically (default automatic behavior)
- user can see results and introspect operations graphically (introspection and feedback)
- user can make strategic action inputs into system if needed (actions, policy changes)

For a VOIP call, you want low latency, but you do not want network cutting out every four seconds for one second. The delay/latency should not change from 1 second to 4 seconds and go back and forth, but should be constant.

"idiotypic selection" is important not at the single node level, but for the system as a whole. A communication system may have dozens of users and consist of hundreds of radios, fiber optic links, free space communication paths, satellites, aircraft and ground installations.
- The communication network will have multiple users with competing uses
- A user cannot manual configure or control hundreds of nodes, so default and automatic policy is important

"idiotypic selection" reifies the "system of systems", into a single system that can be acted upon. Each node sends state and performance information to other nodes, who can aggregate that information and then make changes to nodes lower in the network to achieve performance objectives.

The simpliest idioypic selection algorithm, might be (one armed bandit)
- if there are 12 wifi channels
- flip through different frequency channels to find the one that works best

For instance, some Ghz frequencies work very well, except when it rains and then they are useless. Or 700 Mhz penetrates very well if you are inside in concrete building, but if you have line of sight then you will use other frequencies.

A frequency for wifi may work very well, except at certain times of the day or when it is congested. Going over 50% channel capacity utilization, can cause Ethernet frame collisions with other devices, causing endless cycle of retransmission attempts and collisions, or bursts of network outage or competitive transmission power dynamics that are pathological (such as wifi connection working very well, but dropping every 20 seconds or sporadically).

At a basic level the "Do random things until it works" strategy can be automated. So a soldier or cell phone user is not sitting there, fiddling with settings and hitting buttons or connecting and reconnecting to the VPN until it works. This works when you have a finite, enumerated lists of actions and the software measure whether its working.

Look at the military requirements and systems the DoD has used and naval communication systems has helped a lot.

![](/img/dev-update-88-1.jpg)

![](/img/dev-update-88-2.jpg)

They want
- horizontal links between devices at each layer
- vertical links between layers
- dynamic network reconfiguration

This type of networking, is impossible in the existing paradigm. You cannot achieve this with IP addresses and BGP. IPv6 did not solve multihoming. It requires new types of routing and address space, I proved that a year ago.

When different types of networking were being chosen in the early internet, the NSA must have looked at CISCO's packet switching technology and said "We can do this, then route all the traffic through the US and intercept everything". Certain companies were bought out, shutdown. Certain protocols like end-to-end opportunistic encryption were stifled from being standardized. Certain protocols like IPSEC were compromised.

Centralizing control of information, surveillance was a means of obtaining and maintaining power and hierarchy. The technologies were carefully steered and other technologies prevented from development. The groups that exploited or benefited from this, where clandestine and outside or above the state. The "NSA" was just pretense to put the capacities in, but they were left wide open (which is reason for current OPSEC and cyber-security problems, they were by design).

The next generation internet for IoT, has particular properties and there are few ways to meet the requirements. You can enumerate the properties/structures of all possible networking systems and protocols at an abstract level, using category theory.

There is not a choice. You end up with a very simple form of  software defined networking. You end up throwing out all the crap the existing network is built on and get two or three primitives. Even if you use IPv6, you are only tunneling the native protocol over it.

The governments will try to "pass laws" or backdoor the devices, ban encryption or monitor all the traffic somehow, but from a mathematical perspective, there is a futility to it. They might as well try to pass a law banning odd integers or changing the value of pi and then try to force that on people at gun point. Despite the futility, they will try anyways and will get laughed at.

"We flooded the country with 3rd world immigrants and had them stage terrorist attacks to get this bill passed and what do you mean its 'not enforceable'!?".  We have seen this before.

## Meshnet/VPN/Darknet

I have a simple scripting language, that you can write on a napkin, with three types (uint64, uint32 and []byte) and structs. C like, very similar/identical to golang but may simply syntax.

The routing is very simple.

I want to get to this soon.