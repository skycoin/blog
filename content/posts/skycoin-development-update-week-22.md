+++
aliases = []
date = "2019-06-07T00:00:00+00:00"
description = "Updates about the Skycoin ecosystem development of the week. "
image = "/img/June 7.png"
tags = ["Skycoin", "Development"]
title = "Skycoin Development Update - Week 23"

+++
### CX Update

We have big news to announce this week thanks to the public beta release of CX version 0.7. This version of our programming language integrates it with Skycoin's Fiber blockchains, enabling developers to write programs that will be stored on blockchains specialized for CX code. It also introduces plenty of new features, language fixes, libraries and bug fixes. Learn more [here](https://github.com/skycoin/cx/blob/bbc77962142a8dadd19a81d82bf666b7abfcf142/releases/RELEASE-0.7beta.md "CX beta version 0.7") and check out [the tutorial](https://github.com/skycoin/cx/wiki/CX-Chains-Tutorial "CX Chains Tutorial")!

In other news, we fixed a memory issue for CX chains, added capabilities for creating wallets on CX chains, and made a range of improvements to the CX tracker that enables registration and configuration distribution for CX apps.

### Skywallet Update

Development on Skywallet this week focused on fixing a bug with the re-occurrence of entropy acknowledgement that was affecting the Go interface. We also refactored tests for libskycoin (the C wrapper for Skycoin's API) that will be run against the Skywallet crypto API.

### Skywire Update

Skywire made a progress this week, effectively eliminating all of the encryption issues we have faced so far by adding sequence numbers to packets (simplifying the encryption implementation). We also rewrote large portions of the messaging system to simplify the ID assignment logic and fixed a bug affecting transport redial by improving the transport and router shutdown logic.

### Coin Hour Bank Update

To quickly summarize the latest work on Coin Hour Bank, we have now improved its responsiveness and usability on mobile devices and refactored email notifications.

We are looking forward to bringing more news from throughout the Skycoin ecosystem in the coming week as the latest version of CX for Fiber blockchain development takes effect!

{{< youtube dX3As3Bdyak >}}