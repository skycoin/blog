+++
aliases = []
date = "2019-07-19T00:00:00+00:00"
description = "Updates covering recent developments throughout the Skycoin ecosystem. "
image = "/img/Dev-Update-Jul-2019_19.png"
tags = ["Skycoin", "Development"]
title = "Skycoin Development Update - Week 28 & 29"

+++
### Skywire Update

The past two weeks' work on Skywire has centered on two main objectives: switching to dmsg and improving the public deployment's performance, and writing automated integration tests. Both of these are essential to migration; along with a stable, working public deployment, we need automated integration tests that accurately resemble it in order to ensure the code we push doesn't break the mainnet.

A lot has gone into achieving this:

First, we have made the switch to dmsg transport, a rewritten messaging transport that replaces the previous one. Toward that end we fixed a range of issues that were affecting SSH on the public environment, and also changed the way the setup nodes interact with regular nodes. Specifically, we removed the transport settlement handshake between regular nodes and setup nodes, decreasing the number of interactions needed to set up the network. This in turn increases the speed of the public environment for users. Yet another benefit of this is that it eliminates the potential issue of transports between regular nodes and setup nodes being used accidentally for the network data plane, as these transports will not be registered in the transport discovery.

Meanwhile, we renamed the Skywire node module to disambiguate the physical node from the software -- it is now called Skywire visor.

Finally, we created a setup for automated integration tests that use docker and that mirror the public deployment in terms of network topology and conditions. This helps support the deployment process, as so far we have had to run manual, interactive integration tests.

### Core Update

Skycoin Core is currently preparing ledger support and additional security and convenience features for Coin Hour Bank and general Skycoin use, for instance with HD wallets. To that end we have implemented wallet support for the HD wallet and BIP 44 (a wallet standard needed for ledger integration). This functionality is already available to use through the CLI and will be integrated in the front end as soon as this becomes necessary.

### CX Update

The last two weeks of work on CX have focused on the CX Garbage Collector, for which the team fixed issues causing it to become dysfunctional for pointer-like structures, as well as adding documentation. All of this is part of our ongoing preparation for CX 0.7.1, which needs the garbage collector to enable blockchain storage of arrays and slices.

### Coin Hour Bank Update

Coin Hour Bank continues to work through the beta testing phase, most recently focusing on a number of important fixes as we approach the final stages.

### Skywallet Update

For the Skywallet we continue to review and rework parts of the codebase that are critical to the security of the release. Specifically, we recently reviewed and completed the correct implementation of the entropy generation and usage, reviewed the bootloader signature checking, and improved documentation for Skywallet's security features. We also finished the linux packaging for the daemon.

Things are progressing rapidly at Skycoin, from improving Skywire to getting the upcoming version of CX ready for release. Be sure to check back soon for the latest updates and news from throughout the Skycoin ecosystem!

{{< youtube UiWrI52zVGs >}}