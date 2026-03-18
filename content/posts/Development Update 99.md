+++
aliases = ["/development-updates/development-update-99/"]
date = "2016-03-16"
draft = true
tags = ["Development"]
title = "Development Update #99: Skycoin Development Priorities"

+++
## Project Priorities:

##### Right now the priorities are:
- Improve project management
- Have a place where everything that needs to be done, can be written down as a ticket so developers can find it
- Get developers to implement the tickets

We not have a radical simplification of the consensus implementation and simplification of the meshnet/vpn/darknet and it is almost trivial. It should not be more than 2,000 lines for the core, but we need to make sure it gets implemented.

Finding good contractors and people to work on project has been very time consuming.

## Development:

##### Right now
- Wallet cross compilation was done months ago
- We need to get gulp script working that dumps angular js 2.0 example app, into "dist" directory we can serve from golang. This is amazingly frustrating.
- We need to port the skycoin webwallet to angular 2.0 eventually (not high priority)
- We are having meeting and trying to get SKY/BTC exchange up as next priority
- We figured out how to simplify consensus implementation

The meshnet/vpn/darknet has undergone radical simplification. It very clear what is needed at this stage and is almost a joke. I do not have an excuse for not finishing this or hiring someone to do it. I have a triangle of three components, which depend on the other two components and together it just works.