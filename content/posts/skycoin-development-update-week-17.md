+++
aliases = []
date = "2019-04-26T00:00:00+00:00"
description = "Summary of the development of Skycoin, Skywire and the Skywallet. "
image = "/img/Skycoin-devupdate-042619.png"
tags = ["Development", "Skycoin", "Skywire"]
title = "Skycoin Development Update - Week 17"

+++
### Skywire Update:

This week Skywire has moved toward better organization and simplicity. Key changes include the addition of centralized logging for the local testing environment and migration of the Route Setup Node to the public Skywire repo, simplifying the development process. We have also refactored the app package (with naming updates for improved clarity) and implemented pathfinding logic for the Skywire updater configuration file (much like what is used for the main Skywire repo).

### Ledger Update:

Among other updates, the Ledger UI is now integrated with the signing mechanism. We have tested the flow extensively, and work continues to complete functionality for the Ledger firmware. Meanwhile, we have started writing a Golang wrapper that will enable functions to communicate with the hardware wallet daemon.

### Skywallet Update:

Along with numerous bug fixes, Skywallet will benefit from content work this week to improve firmware documentation, as well as the contribution guide.

### Coin Hour Bank Update:

A lot of work has gone into Coin Hour Bank since the last update, from introducing a new design to implementing and fixing the first version of withdrawal. User actions will now generate email notifications, and we have adjusted the transaction trigger to fit the new structure.

Other improvements include display fixes for deposit addresses, transactions, and authentication responses, as well as correction of an issue that was affecting logout. There has also been much in the way of refactoring, testing, and research into bugs, so we expect more improvements soon.

### Whitelist:

Whitelist updates this week include new, improved test cases and an updated miner condition check for an edge case, as well as miscellaneous tests and changes.

The coming week should see continued simplifications to Skywire and progress on Coin Hour Bank’s new design. Be sure to check back for news of the next few days of development!