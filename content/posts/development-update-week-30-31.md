+++
aliases = []
date = "2019-08-02T00:00:00+00:00"
description = "Updates covering recent developments throughout the Skycoin ecosystem. "
image = "/img/Dev-Update-Aug-2019_02.png"
tags = ["Skycoin", "Development"]
title = "Development Update - Week 30 & 31"

+++
### Skywire Update

The latest progress on the Skywire meshnet has focused on two key areas, beginning with the improvement of automated tests and addition of new test scenarios. We also introduced a second transport implementation, which as well as being simpler than dmsg is also able to directly connect two nodes. (dmsg will be used for the network's control plane and the TCP transport in the data plane, as it does not tunnel traffic over an intermediate server.) 

### Skywallet Update

Skywire has focused recently on resolving an issue with HTTP timeouts that we detected during seed backup, which we fixed by changing the backup logic in the daemon. Meanwhile, we implemented automated tests for the bootloader signing and completed extensive testing for the Skywallet RNG, as well as running through multiple iterations of our ongoing pre-release testing.

### CX Update

Work at CX is currently focused on enabling programmers to make use of any data constructs that rely on pointing to objects stored on the heaps of CX chain program states, which has primarily involved fixing a range of bugs in the Garbage collector. We have now successfully added the option of storing heap objects in CX chains, and fixed a number of additional heap-related problems.

In addition to the news above, Coin Hour Bank continues with testing and minor fixes as it moves closer to being ready for release. Check back soon for the latest development news from across Skycoin!

{{< youtube hH97x3k76x0 >}}