+++
aliases = ["/development-updates/development-update-123/"]
date = "2017-01-27"
tags = ["Development", "Skywire"]
title = "Skycoin: Attack of the Bugs 5"

+++
We fixed eighty wallet bugs. Look at commits on github.

The CLI is substantially upgraded and automated deposits and withdrawals are working now. Hundreds of changes and improves to the Skycoin CLI interface.

We upgraded to latest version of electron and the copy/paste issues are fixed.

32 bit windows builds should be ready in next release.

We are creating installers for windows and OSX, so that you can install skycoin like a native application.

## Meshnet

The meshnet daemon now has a command line CLI, that you can play with.

Starting off with a GUI was a mistake. We should get everything working with a CLI interface first, then attempt a gui interface after the CLI works.

## CLI environment

We have too much software and are trying to package all of our application daemons into  a single executable and cross platform environment.

### This environment will allow you to run:

* The skycoind daemon
* The meshnet daemon
* The CXO daemon
* Address generation
* Skycoin command line / RPC client
* More applications later