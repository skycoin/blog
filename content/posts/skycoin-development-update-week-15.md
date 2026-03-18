+++
aliases = []
date = "2019-04-12T00:00:00+00:00"
description = "Skycoin Update on the development of Skywire and the Skywallet."
image = "/img/photo_2019-04-12 23.00.28.jpeg"
tags = ["Skycoin", "Skywire", "Development"]
title = "Skycoin Development Update - Week 15"

+++
### Skywire

Progress on Skywire continues this week with updated commands, bug fixes (completed and ongoing), and important steps toward a completed UI.

We have now improved the Skywire Command Line interface by refactoring skywire-cli commands into separate groups that identify the services they interact with, rather than having them all grouped under skywire-cli as before. For example, commands that interact with skywire-node will now be grouped under skywire-cli node <command>, and so on.

In terms software usability, we have identified and resolved an ACK bug that was appearing due to the node comparing the ACKs it received to the wrong expected ACK. Likewise, we have started work on a bug in ChaCha authentication that has been causing encryption/authentication to fail at every interval, leading to apps hanging.

We are still working to fix the bug that has been causing applications running on the Skywire node to create multiple transports, and hope to have this resolved soon. Likewise, work continues on the loop endpoint for the manager interface, which has taken some refactoring of the node backend. This marks the last major endpoint to get the Skywire UI up and running!

### Ledger Updates

Development on Ledger this week has focused on integrating the interface for transaction signing with the actual signing of transactions, as well as some important refactoring to the UI that is improving convenience for users. Because we are approving outputs for transactions on a one-by-one basis to increase allowed inputs, the UI now dynamically switches to the SKY address and display number for currently approved outputs.

### Skywallet Updates

Skywallet is getting ready for a final security review, and now has secure cryptography.

To guarantee secure seed generation, we have implemented the option to build firmware for Skywallet that will verify the hardware’s Random Number Generator is doing what it is supposed to. (When built, this allows the client to request numbers from the device and run a test suite on them.) This matters because it ensures the random number generator is truly random so that coins cannot be stolen by hackers.

Meanwhile, documentation for the hardware daemon has improved, and we have resolved an issue that was causing the dep not to initialize the submodule in one of the hardware daemon’s dependencies.

### Whitelisting/Auth System

On this front, we will soon be releasing a fully redesigned UI with a consistent theme throughout that has been polished up for better usability.

The project is moving ahead quickly, with Skywallet preparing for final security testing and Ledger becoming more user-friendly. Skywire’s UI is nearing completion, while lingering bugs should be resolved soon. Look forward to news on these and more important updates in the days ahead!