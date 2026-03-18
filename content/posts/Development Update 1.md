+++
aliases = ["/development-updates/development-update-1/"]
date = "2014-01-01"
draft = true
tags = ["Development"]
title = "Skycoin: A New Hope"

+++
## Summary:

- Rational for eliminating mining from Skycoin was added to initial prospectus
- Information about Skycoin's TwoStep post-quantum transaction protocol was also added
- Foundations of the Skycoin protocol were built and many commits were submitted to Github
- Skycoin peer bootstrap from DHT is now working
- Webkit embedding for Skycoin Wallet working
- Wallet GUI first draft pushed to github

## Features:
- 1 millionth of a Skycoin is called a **"Drop"** or "**Droplet"**. Skycoins are divisible to 6 decimal places
- Wallet can load/unload multiple wallets independently
- Receive tab has been removed from wallet to improve usability
- Cat tab added to connect to the Skycoin IRC channel from the wallet
- The Skycoin client is an HTML6 application. It runs a web server and webkit rendering in an application window. So its HTML, but without a remote server.

## Milestones:

- The first Skycoin transaction executed on Jan 14, 2014.. Public builds will be ready within week.
- Run `go run wallet.go` to start wallet
![](/img/dev-update-1-1.png)

## Ongoing Development:

- We are translating the wallet into Chinese.
- Wallet team is working on the JSON RPC
- Team is working on cryptographically secure messaging between wallets using Skycoin addresses. Skycoin addresses can act as email addresses and can send and receive messages securely. Working on "Identity Address" and "Wallet Address" RPCs.