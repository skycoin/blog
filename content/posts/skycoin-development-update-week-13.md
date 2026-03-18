+++
aliases = [
	"/posts/skywire-development-update-week-11/"
]
date = "2019-03-29T00:00:00+00:00"
description = "Skywire has seen work on mainly two areas of the project: the Skywire Manager and automated testing.  The Skywire Manager has been picked up again and we have finished the login/logout of the Manager. Users can sign in and use cookies to authenticate themselves when managing their nodes. This is required for security reasons."
image = "/img/skycoin-development-update-13.png"
tags = ["Skycoin", "Announcements", "Skywire", "Development"]
title = "Skycoin Development Update - Week 13"

+++
**Skywire Update:**

Skywire has seen work on mainly two areas of the project: the Skywire Manager and automated testing.

The Skywire Manager has been picked up again and we have finished the login/logout of the Manager. Users can sign in and use cookies to authenticate themselves when managing their nodes. This is required for security reasons.

The other area where we have made progress is the creation of automated integration tests. Automated integration tests allow us to test the system with multiple services and instances running. So far we have relied on unit tests, which test only a single part, and had to do a lot of manual testing. Automated integration tests using the chat application have been created now and facilitate our work. We have created a development environment with a dockerized node and a docker network, allowing developers to build specific closed-network topologies for testing.

**Skywallet Update:**

This week the Skywallet daemon has become feature-complete. It is a background process that exposes an HTTP API to other services to communicate with the Skywallet over USB. It will replace the node.js integration that we had built into the Electron version of the desktop wall. The daemon will enable Skywallet integration with any future wallet distribution, such as the upcoming web wallet, as well any 3rd party wallets that choose to do so.

On the firmware side, we have temporarily deactivated the signing of generic messages. Previously this feature had been implemented because it allows for some use cases beyond pure cryptocurrency use. (Most likely auth for other things such as SSH or other features that are explained on the trezor site.) However, we decided to not implement it eventually until we have the applications ready that use this functionality.

Furthermore, we have further improved the entropy pool by mixing in multiple salt sources available to the hardware device. Salting the entropy pool mixing can ameliorate the damage from certain classes of attacks on a covertly compromised random number generator.

**Ledger Update:**

A major milestone was reached: the first Skycoin transaction has been signed with a ledger device. Due to memory limitations of the device, we stream transaction inputs and outputs to the device, interlaced with user confirmation of the outputs, rather than sending all inputs and outputs before requesting user confirmation of the outputs. This way, the number of inputs and outputs that can be used for a transaction is almost unrestricted by the device’s memory.

Many large and exciting milestones are just on the horizon as development continues, the near future is looking very bright for Skycoin and Skywire.