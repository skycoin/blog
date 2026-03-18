+++
aliases = ["/development-updates/development-update-70/"]
date = "2015-04-19"
draft = true
tags = ["Development"]
title = "Development Update #70: Skycoin Connection Issue Hot-fixes"

+++
## Bug Fixes: Networking

Yesterday, as soon as soon people started connecting to network, we found out how unreliable the internet is. People had difficulty connecting to servers. The majority of client did not have open ports so could not accept incoming connections. People had to wait hours for connections and then transactions were not propagating for some users, depending on country.

I disabled DHT and PEX and just hardcoded list of servers and then clients connected within half a second and it worked.

Peer-to-peer appears to work best when there are at least a few fast servers the client is guaranteed to connect to.

- PEX needs to be updated to keep track of which peers allow incoming connections.
- A user should not pass a peers unless they have succeeded at making an incoming connection to that peer
- Only a fraction of the peer list should be passed each request
- Connection attempts should use exponential back-off
- PEX needs to store and save the last time a connection succeeded for that peer
- We need to get UDP+hole punch for next networking refactor

I have a sketch now, of how Skywire will fit into the existing networking refactor.