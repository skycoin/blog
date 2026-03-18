+++
aliases = []
date = "2019-05-10T00:00:00+00:00"
description = "Updates about the Skycoin ecosystem development of the week. "
image = "/img/Skycoin-devupdate-051019.png"
tags = ["Skycoin", "Development"]
title = "Skycoin Development Update - Week 19"

+++
### Skywire Update

This week Skywire has benefited from implementation of a human package that allows us to request user input for a number of actions, including transport creation. We have also started implementation of a new uptime tracker, which will soon replace the previous discovery uptime tracking implementation used for the testnet.

Other work has focused on writing for router package tests and ongoing efforts to refactor the app package.

### Skywallet Update

Important progress on Skywallet this week has seen the implementation of the ability to read the manufacturer device UUID, meaning this can now be used as an additional salt source to strengthen the cryptography and prevent attacks.

Other work has focused on cleaning up deprecated code, increasing test coverage, and starting a comprehensive review of crypto-related code, as well as analyzing some vulnerabilities reported by Trezor.

### Coin Hour Bank Update

Among many updates this week, we have now fixed the CHB icon to support pinning on the homescreen and improved the transaction list with a better table that improves convenience and searchability, as well as its overall design and responsiveness. We have also made adjustments to improve limits and rules for withdrawals and ensure that the proper destination address is used in all cases.

Fixes include resolving an issue that was preventing miner transfer in certain edge cases, as well as one that was preventing users from being re-enabled if shut out improperly. The export threshold is now configurable, and work continues on testing across the board as we prepare for the the second CHB instance.

### Ledger Update

Put briefly, work on Ledger has seen completion of the Go wrapper and testing, as well as merging the transaction signing mechanism.

Step by step and feature by feature, Skycoin continues to improve through our work to build a more secure, user-friendly, and powerful ecosystem.