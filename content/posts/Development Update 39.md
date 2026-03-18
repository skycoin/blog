+++
aliases = ["/development-updates/development-update-39/"]
date = "2014-10-01"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #39: Skycoin Unspent Outputs and Mesh-net Update"

+++
## Summary:

We have library now, for checking the unspent outputs for addresses. We are using obelisk tool kit and it is working well. The bitcoin blockchain synchronization has been running for a week now. It is on block 285,100 of block 323,354. It is 70 GB on disc and we don't know why. It has slowed down periodically, but has not stopped completely like bitcoind has. It is downloading a block a second. Blockchain synchronization should be finished within a hundred thousand seconds in the worst case (hopefully) and then we can test to make sure the ICO software works.

A basic exchange will run over bitmessage and possibly IRC. Bitmessage will have a few problems. You have to download 20 GB of messages before the message response appears. The server will also only be able to send out a few messages per minute because of the PoW requirement on the message. Another solution, might be a web server with cloudflare and it might be enough, depending on the DDoS conditions. A tor hidden service is another option. The Skycoin darknet is not ready to host this application yet because required components have not been implemented yet.

We want to get the distribution over and get back to the darknet and encryption utilities.

Right now development is disorganized. Trying to get all developers in one place. Skycoin has a large number of active developers, but very few of them are working at one time, because no one knows what needs to be done. There is not enough project documentation and technical specifications.

I think there needs to be a developer chatroom. Marketing and most everything outside of the core cryptography and blockchain, will be handed over to the community after launch. After the darknet is up, communication will increase significantly.

The meshnet will be a massive coordination effort. It requires people on ground and several different hardware teams. It will probably require ASICs eventually and its an undertaking far larger than the coin implementation. Right now the focus is finishing the coin ICO, then getting the darknet working at basic level. This will enable file sharing (distributed file system), websites and communication tools. The darknet will still be useful, even if it is merely running over traditional internet.

Then we can add mesh, peer-to-peer connections to the darknet topology. Then eventually tunnel normal internet traffic over the darknet/meshnet to a peerage point and transit back to the normal internet (similar to a VPN, but running over meshnet to exit point). Just getting those simple steps working, would be a great achievement.

The good news, is that after much frustration and coding, we discovered that the meshnet/darknet implementation is actually much simpler than imagined. The internet will face palm at the power and elegance of the resulting architecture.  The implementation is simple enough, that there can be no unanswered questions about its security and the performance and privacy are beyond Tor. Tor is over 180,000 lines of code and this method is clearly superior with significantly less complexity and higher performance.