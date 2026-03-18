+++
aliases = []
bounty = 0
date = "2019-03-16"
image = "/img/skycoin-development-update-11.png"
tags = ["Announcements", "Skywire", "Development"]
title = "Skywire Mainnet Development Update"

+++
The initial launch of Skywire mainnet is here! The coordinated work and development from our team was a massive effort to launch all the components of Skywire mainnet. Skywire consists of multiple components that all need to work together to allow the user to encrypt and successfully route traffic to peers, while still maintaining the ability to use applications on top of Skywire. The launch involved development of the following:

* Auto Deployment Mechanism
* General Improvements - CLI & User Nodes
* Protocol Packet Confirmation
* Skywire Updater
* New Interface Additions

### Skywire Auto Deployment Mechanism

Launching Skywire not only entailed publishing the software, but also required us to publicly deploy and test services. A lot of the work happened behind the scenes, such as log retrieval and monitoring systems, back ups, etc. We've created a redeployment mechanism that automatically restarts and updates the services as we push updates. This mechanism enables our team to quickly test and run new code while allowing for rapid bug fixes.

### Skywire General Improvements

Improvements have been implemented for user-run nodes, creating solutions for bugs encountered while running nodes in different environments. We have improved the Skywire node CLI and added some convenience functions such as the option to generate a default configuration file for the Skywire node. This facilitates the testing of the software, as it is easier to wipe and rebuild the node without having to manually create its configuration files.

### Protocol Additions

On the protocol level we added acknowledgement (ACK) packets for routes. Since routes span multiple hops and rely on the forwarding efforts of other nodes, these ACK packets allow the sender of a packet to know whether the packet arrived at the intended destination. These ACK packets function similar to TCP ACKs.

### Skywire Updater

We also released the Skywire updater within the Skywire software, which allows for a very convenient way to update the node. Skywire updater allows a user to call either the `Check` or the `Update` function, to check whether a new version of Skywire is available, and then to update to the new version. For now, these can only be called over the CLI, but they will be integrated with the Manager UI once it is updated. This allows the user to update conveniently, until we have integrated Skywire with the most common package managers.

### Skywire Interface

On the frontend side, efforts have been ongoing to make improvements to the interface. We have the new interfaces designed, and will soon be ready to release the routing interface and the exit node toggle.

### Skywire Community & Documentation

We will soon be publishing a more comprehensive documentation of the Skywire system on the Github repo wiki. We have also opened a new [Telegram group](https://t.me/SkywireMainnet) where interested devs can find support and discuss features and issues, etc.

Documentation has mostly been added in the [Skywire wiki](https://github.com/skycoin/skywire/wiki).