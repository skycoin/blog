+++
aliases = []
date = "2019-04-19T00:00:00+00:00"
description = "Weekly Skycoin Development Updates about Skywire, Skywallet and more. "
image = "/img/Skycoin-devupdate-041919.png"
tags = ["Development", "Skycoin"]
title = "Skycoin Development Update - Week 16"

+++
### Skywire Update:

Progress on Skywire this week has mainly focused on important refactorings and simplifications. We deduplicated tests and rewrote unstable tests. We have also removed ACKs from the messaging system, simplifying the implementation.

Among other developments, the node summary endpoint now contains the node IP address and the version of the node. The loop endpoint is finished, and we have started work on exposing the application APIs to the manager. This requires a refactoring of the app package.

Look out for news in the week ahead of highlights from last weekend’s Hackathon – Skywire helped other teams build an advanced messaging application that we will discuss in detail in a later article.

### Skywallet Update:

Skywallet updates this week continue to advance in the direction of stronger security.

To verify that random number requests are really generating random numbers, developers can now get entropy from the physical device (including GetRawEntropy and GetMixedEntropy) by building special firmware. We have also added an additional check that ensures the device will only load your wallet if it was manufactured by Skycoin Foundation (based on USB HID), eliminating the threat of imitation devices.

Along with various other fixes and improvements, you can now apply language settings, and the salted entropy pool mixer is finished. Skywallet is also in the process of rebranding, and we have made code changes and graphic asset changes accordingly.

### Ledger Update:

Progress on Ledger this week continues with refactoring to combine UI and transaction signing. Look out for more news on this front soon.

### Skycoin Core Update:

This week [BIP 32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki "BIP 32 ") support was added to Skycoin's cryptography libraries. This will enable compatibility with Ledger and other 3rd party wallets in the future. BIP 32 is a common standard to implement hierarchical, deterministic wallets.

### Whitelisting/Auth Updates:

This week we have successfully handled the last of several high-priority issues that proved difficult to resolve. Improvements continue for test cases, and we have made additional changes to the export functionality.

### Coin Hour Bank Updates:

New work on Coin Hour Bank has seen improvements to deposit and scanning flow, as well as for generating addresses. We have started the implementation of the admin dashboard and admin-related APIs. Admin access has almost been completed on the backend. Finally, we spent time researching the right way to go about integration tests. This can be especially challenging in deposit-related cases, so we are looking into a workaround for that.

As mentioned above, we are looking forward to bringing news from last week’s Hackathon in the days to come. Meanwhile, progress continues on building a simpler, stronger, more secure Skycoin ecosystem.