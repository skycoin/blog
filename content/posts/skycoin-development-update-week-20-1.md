+++
aliases = []
date = "2019-05-17T00:00:00+00:00"
description = "Updates about the Skycoin ecosystem development of the week. "
image = "/img/Skycoin-devupdate-051719.png"
tags = ["Skycoin", "Development"]
title = "Skycoin Development Update - Week 20"

+++
### CX Update

The biggest announcement this week is the CX blockchain beta release, kicking off our first CX Labs contest. Check out the news around the contest in the [CX Labs Telegram room](https://t.me/CXLabs "CX Labs Telegram room"). 

Work on the CX programming language has also seen progress on the installation script, with extensive testing on a new Debian VM. This has helped identify possible reasons for why some users have been having difficulty, from issues installing Golang to conflicts between versions. To deal with these we have now updated the wiki, and work continues on the [CX-Chains tutorial](https://github.com/skycoin/cx/wiki/CX-Chains-Tutorial "CX Tutorial"). (The examples here are simple, but they work!)

### Skywire Update

This week Skywire implemented a new uptime tracker service that we will be testing in the days ahead.

In terms of fixes, writing a new integration test script for the chat app happened to reveal a number of smaller issues that were occurring when intermediary route nodes restarted. We fixed several of these right away, which involved changes to the noise library (i.e. encryption library) wrapper.

In other news, the shutdown logic for various functions has been improved, and several race conditions in the system have been spotted and fixed. We have also started work on the improved App to Manager connection.

### Skywallet Update

Among other tests and fixes for the Skywallet firmware and daemon, we have refactored the USB library that the daemon uses, resolving a bug that was causing it to crash on Windows.

Meanwhile, we successfully automated parts of the release process, as well as the testing setup for the Skywallet firmware and related repos.

### Coin Hour Bank Update

All efforts at Coin Hour Bank this week have focused on its withdrawal functionality, which we continue to improve through testing.

### Whitelisting Update

Owners of miners will be happy to learn we have introduced new mail notification triggers. These will help alert them of low uptime or missing Skycoin addresses in the whitelisting system.

As throughout the Skycoin ecosystem, we are working hard to spot and fix problems as we continue to improve the development experience on Fiber blockchains.