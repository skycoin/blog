+++
aliases = [
	"/posts/skywire-development-update-week-14/"
]
date = "2019-04-05T00:00:00+00:00"
description = "During the past week, the bulk of the work dedicated to Skywire was focused on the Skywire Manager and on improvements to the network protocol."
image = "/img/skycoin-development-update-14.png"
tags = ["Skycoin", "Skywire", "Development", "Announcements"]
title = "Skycoin Development Update - Week 14"

+++
**Skywire Update**

During the past week, the bulk of the work dedicated to Skywire was focused on the Skywire Manager and on improvements to the network protocol.

Work on the Skywire manager re-commenced with a strong push to complete the login/logout functionality of the manager. Tests were written, run and passed. The login/logout function, critical to the security of the Skywire manager, is now complete and changes have been documented.

The integrity of the network protocol was improved with the fixing of two bugs. The first bugfix was for a major bug that was corrupting ACK packages and causing applications to hang. The second was for an intermittent bug that affected transport creation. It would randomly create a second transport in addition to the one required and continue creating additional transports whenever the unnecessary transport was removed. The transport bug was caused by an issue related to the creation of UUID’s. Both the ACK bug and the transport bugs are now mostly resolved but more work is required on a race condition that appears in the messaging transport and causes system instability.

Additional work this week went into the creation of tools for a local test environment that allows developers to easily customize the environment in terms of the number of nodes and messaging servers running.

Next steps for Skywire will be the addition of endpoints for loop management and the implementation of endpoints used for calling the Skywire updater. As these endpoints are implemented on the backend, the changes are integrated with the frontend.

**Skywallet update**

Work on both the design and the development aspects of Skywallet continued this week. A design for the user interface was completed but it didn’t meet the requirements and is now being reworked. We do feel that we are approaching the final version of the UI though and are confident that the look and feel of the UI will be on point.

On the development side, the team focused on improving security. An entropy pool was implemented that mixes in a few salts from device-specific data, the device’s internal entropy and external entropy from the host machine.

Other than that, work was done to increase test coverage of the hardware wallet. Additionally, efforts were dedicated to the automation of testing. To that end, work commenced on improving the functionality of the Skywallet emulator by allowing buttons to be programmatically pressed.

The daemon for communication with Skycoin hardware devices was improved on and integration tests were written. Work commenced on implementing Ledger functionality in the daemon.

Research was conducted on the correct procedure for validating the device’s Random Number Generator so that sufficient and appropropriate tests can be carried out for this functionality.


A [Skywallet user manual](https://github.com/skycoin/hardware-wallet/wiki) is currently in draft form. 


**Ledger**

Logic for signing larger transactions was completed for Ledger. The ledger app should support transactions with around 60 total inputs and outputs, but this number may change by the time of release.

The UI was refactored to improve on the user experience and to comply with the Ledger UI standards. A Go wrapper for Ledger APDU calls as well as the tests for it were picked up and worked on.

In closing then, another productive week is under the belt of the Skycoin development team as milestones are closed in on and glitches straightened out.
