+++
title = "Skycoin Updates Skywire and Releases New VPN"
tags = [
    "VPN",
    "Skywire",
    "Skycoin",
    "Mainnet"
]
bounty = 5
date = "2021-03-19"
image = "/img/skywire_release.jpeg"
+++
Version **0.4.1** of Skywire, the Skycoin Project’s decentralized networking protocol, is being released with new features and bugfixes to make Skywire better than ever. The new update patches several known issues with version 0.3.0, includes a number of stability enhancements and performance improvements, and includes long-awaited improvements of the Skywire VPN.

The Skywire VPN leverages the unique network infrastructure of Skywire to provide a truly secure and anonymous VPN for users.

The 0.4.1 update includes reconnection logic for the Skywire VPN client and server, so that if a connection ever breaks down, it will reconnect automatically. In the event that a connection does break, the VPN now also features a killswitch that will prevent any traffic from leaking, and will stop the connection from defaulting to a less-secure non-VPN source.

The update also adds an update-config command which will come in handy for developers as it allows one to modify visor configuration from the command line or a terminal without needing to manually edit the file.

In addition, Skywire 0.4.1:
- Removes the separate hypervisor binary
- Adds --is-hypervisor flag to gen-config
- Includes various fixes and improvements to Skybian such as headless wifi setup and UI improvements

In order for existing users to update their miners, simply follow the steps outlined in the [migration guide](https://github.com/skycoin/skywire/wiki/Upgrade-Guide-v0.4.1). New users can setup their nodes with our Skyimager tool that allows a speedy setup as described in our [Skyimager guide](https://github.com/skycoin/skywire/wiki/Skyimager-User-Guide).

As always, Skyminer operators should make sure they’ve joined t.me/skywirePSA to keep up-to-date with the latest news and developments regarding Skywire and Skyminers.
