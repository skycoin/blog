+++
aliases = ["/development-updates/development-update-52/"]
date = "2015-01-21"
draft = true
tags = ["Development"]
title = "Development Update #52: Bug Fixes and Polishing"

+++
![](/img/dev-update-52-1.png)

There is a major problem. All of the coins are in the genesis address and I cannot spend them for an unknown reason. The output is not being found. I working on this.

- The unit tests, test for this and the genesis spend test passes and the later spends work. This should not be occuring.
- The problem may be in the wallet code I changed yesterday
- More functions are being added to troubleshoot. The whole blockchain explorer can run inside of the local webclient if enough API functions are added.
- The balance function may have broken.

The software is evolving and becoming smaller, simpler and more elegant. At great cost of suffering and refactoring. I tried to make very large changes and refactoring was too frustrating. Now I am making small incisions and making sure it compiles and runs. This avoids being stuck in an impossible refactoring situation for weeks. However, the process of refactoring is now several hundred small changes.

The modules are becoming more single purpose and the dependencies they import are being minimized. Daemon is at the top level, but Visor will eventually be at top level and Visor will pull in the networking library (Visor becomes a Skywire application, with Skywire replacing Daemon).

###### This requires moving:

- Almost everything out of Daemon not related to networking
- Severing the Daemon -> Gui -> Daemon -> Visor -> Wallet call chain and having Gui access wallet directly with Gui -> Wallet
- Removing wallet dependencies from Daemon and eventually from Skywire
- Moving the JSON RPC server from Daemon to Visor
- Moving balance checking and spending functions to the /src/gui or maybe /src/wallet.
- Visor will only export a thin client API for querying address outputs and injecting transactions and then the API will build on this
- Javascript may stop us from running the visor API on another port and then querying it from the GUI if the gui server is running on separate port because of javascript cross scripting. We may need to have a hook in or export the visor web-server to

###### Then there are several other improvements that can be done:

- Improvements to block storage (a slotted structure that accommodates the outer wrapper)
- A dedicated module that handles block storage and allows you to get blocks by header hash (blockdb?)
- A blockchain explorer and history module that interfaces with the block storage module