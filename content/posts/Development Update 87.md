+++
aliases = ["/development-updates/development-update-87/"]
date = "2015-12-05"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #87: Major Progress to Skywire"

+++
One of the three major project milestones is almost done. The crypto library port is nearly finished.

I am excited about checking this off list, because it is one of the most critical and time consuming things.

## Development

This is the fourth crypto library we have gone through. After first, we had to do testing and write fuzzing library and test suite, to make sure that the new library behaves as it should and do not not have strange edge cases. We found problems or bugs with every library so far.

It is very tedious, because the results needs to be exactly the same down to the bit, or deterministic wallets are screwed up or a weak key can be generated, or if invalid input is allowed it can leak bits of your private key. There are also issues with little endian vs big endian for data inputs and enforcing signature malleability.

For instance, nearly every single implementation of RSA is screwed up. If you input random data or weird/invalid edge cases, you get different outputs for each implementation and you can often get them to leak bits of the private key.

We are using gocoin's goloang port of SIPA's implementation of SIPA's implementation of secp256k1, that he wrote to replace OpenSSL. We found some problems, such as allowing public key generation from a private key with an order greater than the order of the curve. Public key generation from the private key succeeds without error, but the public key fails validation or cannot be used.

I wrote 80 unit tests, generating random instances and checking the implementations against each other on billions of inputs and am going through and fixing up last bugs.

## Meshnet/Darknet

Will have update on this soon.

Major progress. There was no GUI to allow it to do what was needed, so decided on terminal interface and small scripting language. The terminal and shell interface type is very powerful.

You can generate things like this in a few lines. Its a lot better than HTML or gui interface.

![](/img/dev-update-87-1.gif)

The idea is to have a small scripting language like C/Go and have shell, where users can patch together scripts. If HTTPS is unblocked out of country, you might run script to tunnel out going connection over HTTPS or embed the data stream in another protocol, like email.

![](/img/dev-update-87-2.gif)

A node has "severlets" which are these small scripts, that communicate by sending length prefixed messages to each other (simple format). A node will be running multiple scripts at once. A script might expose an API, so other scripts can grab data from it (like a webserver) and then another script locally might render an animated graph. Or you can sub-divide the terminal into panes or sub-windows, with a script that has scripts running in the sub-windows.

The most difficult part of the meshnet, is that you may have three hundred nodes and you need status reports, data, need to be able to rapidly modify them and get information. So you have to have scripts, running scripts on the remote nodes and pulling data into a "command center" where you can see what is going on.

The simplest script and the core backbone, takes in a packet over a "channel", then reads the header and then forwards the packet to the next node on a path.

I want something that a 12 or 14 year old can monkey patch or improve. The kind of internet blocking we will see in the future may be extreme and there is no configure that works best in all situations.

This is technically a "multi-agent system", which is one step beyond "peer to peer". It is "cybernetic" instead of peer to peer. You have multiple agents with their own state, resources and set of actions they can do. They exchanging messages with each other and try to cooperatively achieve a goal, but each agent only has its local view of what is going on and needs to communicate with the other agents to coordinate.

![](/img/dev-update-87-3.jpg)

This is a new research area, but there are very simple algorithms that appear to work pretty well.