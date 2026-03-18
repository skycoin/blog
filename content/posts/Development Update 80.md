+++
aliases = ["/development-updates/development-update-80/"]
date = "2015-08-25"
draft = true
tags = ["Development"]
title = "Development Update #80: State Interference and Skycoin Peer-to-Peer Algorithm Update"

+++
GoAgent was forced off of Github by state security
- https://github.com/goagent/goagent

A few days ago Shadowsocks author was contacted and forced to rescind the repo by state security
- https://github.com/shadowsocks/shadowsocks
- https://github.com/shadowsocks/shadowsocks/commit/938bba32a4008bdde9c064dda6a0597987ddef54

All the tools for breaching the firewall are being purged.


## Development Update: Peer Exchange Algorithm Problems

There is no satisfactory solution for sharing peer lists. You should only share peers if they accept incoming connections, otherwise the client spends a lot of time trying to connect to the majority of peers, which cannot accept incoming connections, so sharing the peer does not help anyone.  Knowledge that the peer accepts incoming connections will not propagate until it receives at least the first incoming connection. However if a peer accepts incoming connections, it will initially only connect to peers in a list using outgoing connections, so no one will ever connect back to the peer and learn that it accepts incoming connections.

Peer-to-peer has major problems because of this and became the majority of peers do not accept incoming connections. The majority of connection attempts fail and it takes too long to connect to the network. At once connection attempt per 5 seconds and with one in ten peers accepting incoming connections, it takes up to 50 seconds to connect to network and sometimes two minutes.

There is no solution, so the brute force method might be best. I may put exponential back-off per per on outgoing connection attempts and then change the 5 seconds per connection attempt, to 1 second per connection attempt.

## Development Update:

Skycoin could be made into a very solid coin, that is efficient, has no unneeded features or clutter and has a secure and innovative consensus algorithm that could be the first coin that offers a viable alternative to Bitcoin's mining. That would put it around litecoin.

Then the priority is on creating capital inflows.

About 10% of internet users are using VPNs for accessing content that is blocked in their geographic region. The Chinese firewall is severe and another large market. Meshnets in the long term. All of Youtube, video, music content on the internet will eventually be pushed into the darknet and unregulated spaces. Reddit, blogs and secure communication applications will eventually be pushed there also.

So the bulk of internet traffic.

The content is not being pushed to a darknet space, but to a distributed space such as IPFS, content addressable networking and OpenBazaar. This will happen over the next twenty years. It is already happening now, but piecemeal and the base layer of the software stack does not exist yet and developers are just duct-taping together whatever tools they can get their hands on.

If you have the SHA256 of a video file, you don't care where you download the actual data from because you can verify the data.You don't care where you downloaded it from, you so you don't need a centralized server. If you know the SHA256 hash of an html website, then you don't care where the data comes from. The website becomes decentralized. You do not need Youtube anymore and the HTML and video gets moved into a content addressable space and the data gets replicated peer-to-peer.

I have the base layer designed. I am implementing a simple tool like shadowsocks, that can connect point-to-point between multiple servers (the node), assign itself an address and then just copy/paste packets. Then a simple "control plane" for remotely controlling the node over json. Or just a json configuration file to start. Then a web application for integrating all the data from the control planes for multiple nodes, to allow multiple nodes to be controlled from one place.

Once you are inside the network, no one can find the IP address of the servers being used. So they cannot be raided or taken down. However, if you have a list of public nodes, then the government can identify them and take them down.