+++
aliases = ["/development-updates/development-update-65/"]
date = "2015-04-06"
draft = true
tags = ["Development"]
title = "Development Update #65: Skycoin Connections"

+++
Unit tests work for networking. It works locally. It works with multiple clients on the internal virtual private network for testing. It is 100% working. However, on public internet cannot connect to anything and there are strange errors. The peers/connection list is empty.

[skycoin.daemon:DEBUG] Removing 89.110.41.155:23547 because failed to connect: dial tcp 89.110.41.155:23547: i/o timeout
[skycoin.daemon:DEBUG] Removing 122.31.215.119:9721 because failed to connect: dial tcp 122.31.215.119:9721: no route to host
[skycoin.daemon:INFO] Removing 124.11.192.188:10167 for not sending a version
[gnet:DEBUG] Failed to read from 124.11.192.188:10167: read tcp 124.11.192.188:10167: use of closed network connection
[skycoin.daemon:INFO] 124.11.192.188:10167 disconnected because: Version timeout
[skycoin.daemon:DEBUG] Sending introduction message to 111.250.149.229:23790
[gnet:DEBUG] Failed to read from 111.250.149.229:23790: EOF
[skycoin.daemon:INFO] 111.250.149.229:23790 disconnected because: Read failed

##### To see list of connections do:

http://skycoin-chompyz.c9.io/api/network/connections
http://127.0.0.1:6420/api/network/connections

##### We are getting:

- "no route to host"
- "i/o timeout"
- connection opens and version (first packet) is never sent
- EOF when trying to read from socket

##### TCP/ip has bizarre error conditions. It is also forced in golang. We have

- a listening go routine for each pool of sockets
- a go routine for accepting new connections
- two go routines per socket. a goroutine for reading from socket and a goroutine for sending over socket, with queues for messages
- a goroutine for checking the messages and processing them, that came from the goroutines

We have a full refactor and rewrite of daemon and networking, but cant use it because of other major refactoring, which is a bit exhausting. There is no way to do the refactor incrementally without introducing circular imports, which prevents compilation. I think I want to deprecate TCP/ip completely because it is too frustrating.

##### Also, we have other issues

- running skycoin is disconnecting some people's VPN
- skycoin appears to disconnecting some people's wifi connections

Skycoin is using the Bitorrent kadmelia DHT, so it might be mistaken for a bitorrent client and could be seeing some type of purposeful disruption. I have no idea why the client appears to work on local host and on the internal VPN for testing, but does not work on the public internet.

Skycoin is using DHT with UDP on port 5798 for Bitorrent DHT and listening with TCP on port 5798 for incoming connections. It is possible that this condition causes crashes or confusing behavior on some operating systems, virtual private network implementations and may crash some poorly implemented routers.

This may be some weird NAT traversal and VPN problem.

I will try to fix the port number, to something else and hardcode it, then see if it works.