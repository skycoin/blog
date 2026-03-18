+++
aliases = ["/development-updates/development-update-83/"]
date = "2015-09-12"
draft = true
tags = ["Development"]
title = "Development Update #83: Skycoin: Client Update"

+++
I fixed the bug! The blockchain now downloads in under 2 seconds!

I actually have no idea why the blockchain was downloading at all.
After receiving new blocks, it was not downloading more blocks until the next block announcement.
Now after receiving new blocks, it asks for more blocks.

# EVERYONE MUST UPDATE THE CLIENT. GIT PULL


I made change, so that clients can control the number of blocks in each request.
The packet format is broken and you need to git pull. I will try to have the windows build updated.