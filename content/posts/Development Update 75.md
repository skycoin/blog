+++
aliases = ["/development-updates/development-update-75/"]
date = "2015-06-13"
draft = true
tags = ["Development", "Consensus", "Skywire"]
title = "Development Update #75: Skywire, Applications and Consensus Update"

+++
The coin is done. We are working on networking. There are three different groups working independently on that and its not on github yet.

##### The coin needs:
- Database for storing blocks
- Database for history
- gui improvements
- Misc improvements (the blockchain does not save on windows when closing)

We have to move on to next part to keep schedule. Then new people can work on coin improvements. The improvements are marginal at this stage and could take up almost all the project resources if we only focused on that at this stage.

## Development Priorities:

##### Right now, Skywire is blocking next stage of project.
- Skywire is like Tox, tor, I2P or CJDNS in that a hash of a public key becomes and endpoint for communication.
- Each Skywire server is connected to other servers in a fixed topography
- Data between Skywire servers is encrypted
- Skywire servers can forward traffic along a route

##### Ideally, I want to be able to:
- Unzip file with a Raspberry PI distro on it on sd card
- Set a "master server" public key in a text file in the root
- Plug in and boot pi
- Pi should generate its public key/address on first boot and communicate back to master/control server

If the PI is behind a firewall it will connect to some default public servers, so can connect to it even if incoming connections are impossible. Then it will be accessible to network. Then I can modify the pi or change configuration or see its connection topology through some master interface.

So I should be able to setup and control two or three hundred nodes will this system. I want to be able to SSH or get terminal on the remote nodes. The set of nodes you control is your "personal cloud".

We are starting with debian but moving to seL4 once we get team in place to work on this. The seL4 kernel is the fastest and most secure linux kernel and uses about 30 Kb of memory and boot time should be less than a second. The code base is 30,000 lines, very small, very fast, no closed source binary blobs.

## Applications:

There will be "applications", which are golang directories of source code, that contain everything (all dependencies). I should be able to compile the application (eventually deterministically) and then deploy it on a remote node.

Applications will get one directory for configuration, one directory for data and one directory source code. They will only have
- Networking (through Skywire)
- Storage
- CPU/computation

- Applications will not be allowed to spew data across the hard drive in random directories like linux programs
- Pigeon will not be allowed to put data under .config of .local, .cache or .purple or unrelated directories
- Applications must be portable and capable of being backed up or moved from machine A to machine B.
- Applications should not need to be able to access data in other applications directories by default (a bad app should not be able to steal your bitcoin wallet or scan your drive or overwrite executives in other directories)

## Wifi:

If a node has a wifi adapter, I should be able to deploy an application to scan for other skywire wifi nodes and auto-connect to them and peer.

###### Long Range: Emergency Communications Network

I want a hardware module for HAM radio. There are modules for this in China. Or may us Baofeng. They are relatively cheap.  136-174 MHZ to 400-520MHz bands.

This is for communication during emergency at low bit rate. Emergency communication (SMS type). This project is ASAP priority.

I do not know if the bandwidth will be 5 bits/second to 300 bits/second. Up to 500 Kb/s

- http://hackaday.com/2013/02/28/hacking-a-ham-radio/
- http://www.radioforeveryone.com/p/blog-page_28.html
- http://www.radioforeveryone.com/2014/02/shootout-shortwave-for-50-dollars.html

I need system that is just plug and play and takes less than five seconds to start working. Has to be commercial parts and ready for shipment. Should be able to update the software remotely with the above system. The faster this gets built, the faster the bugs can be worked out and hardware improved.

## Hardware Wallet:

I also want a raspberry pi node that has a 3" or 4" touch screen, that can be used as a hardware wallet

![](/img/dev-update-75-1.jpg)

So you would have computer (possibly insecure), communicate back to this. Then approve transaction on the device.

I want to be able to check Bitcoin balance through lib-bitcoin (get unspent outputs for address and inject transactions). This requires zero-mq to connect to lib-bitcoin server. Also requires extension to skycoin crypto library to allow construction of local bitcoin transactions. This is planned out but needs resources.

## File Storage:

I should be able to do "OwnCloud" type file storage on the nodes. This can be simple golang server with RPC with
- List files (inode record)
- Read file
- Write file

## SOCKS5 Proxy / VPN:

I should be able to deploy an application that lets me connect out of the node to the normal internet. I should be able to tunnel my traffic over Skywire to the exit point. This is a sort of replacement for OpenVPN.

The GUI needs to look like this

## Consensus Algorithm:

The consensus algorithm is done. I can do ghetto version with cryptographically signed CSV files on webservers and just poll servers every second. It is not that exciting.

To do it right, it is bottled necked on Skywire. The network connections right now (TCP) are asymmetric (can connect out of firewall, but people cannot connect in) and still based upon IP addresses instead of pub key hashes. So until Skywire is working/designed at basic level its very difficult to run/test this.

I proved mathematically that as long as the user graph has certain property, that it converges.