+++
aliases = ["/development-updates/development-update-47/"]
date = "2014-12-22"
draft = true
tags = ["Development"]
title = "Development Update #47: Happy Birthday Skycoin!"

+++
## One Year Anniversary

In celebration of the first year anniversary of the launch announcement, we are launching coin!

I will update when everything is on github.

I tried to launch it ten hours ago, but every time I open the directory I notice more things that can be simplified, removed, or refactored.
- I decided that micro-optimizing the block header size is pointless. I am doing 160 byte blockheaders instead of 105 bytes. Even with 1 block per second, the difference is 0.1 KB/s vs 0.2 KB/s. The overhead is less than single transaction.
- I never finished ripping out the wallet code from visor. Visor will agnostic over which transactions/addresses/wallets are yours. It just injects transactions and allows queries on the blockchain state.
- I am updating the blockchain serialization format, so its future proof.
- I am simplifying the command line options. There are too many useless command line options.
- The address checksum is now in the written version, but not the version on blockchain (which is redundant)
- The 100% coverage unit tests are broken, but I was never satisfied with them. They feel verbose and still miss most of the conditions I wanted to test for. I want functional and integration tests.
- I am cutting out flow paths in the coin core and moving out as much out as possible
- Minimum coinhour fees for transactions will be soft enforced at consensus level, instead of hard failure checks in blockchain. If the parameter is wrong, then it can be changed without invalidating previous blocks. The network may need to dynamically adjust the rate if spamming becomes a problem.
- I found a memory leak, but it does not matter until the blockchain is a few hundred megabytes, so fixing it is not extremely urgent.
- Since the existing daemon works, I will not force upgrading the networking to the new library while it is still undergoing changes. We had people experiencing problems that depended on the date they fetched the libraries. Its better to get it working and use that, develop the new version and then swap it out once its done, rather than using a constantly changing library in dev that breaks builds.

I will try to do a soft launch, get it working with command line tools, so that it can launch and the the GUI wallet can be fixed later. I think the initial distribution of coins will be over tox group chat and there will be a google spreadsheet. There may be a trader bot to automate it later.

Ideally you should build client and run the client to generate addresses for receiving coins. However, we can always send coins to deterministic wallet and maybe add a bot for querying balances, getting addresses and doing sends from the wallet. We do not recommend this from a security perspective, but for small balances, should be fine. We do not trust TLS/HTTPS and feel the tox bot is more secure. Remotely hosted web wallets over HTTPS are becoming high-value targets.

We have hardened linux, behind a firewall with physically secure hardware, with all incoming ports firewalled, with a proxied public IP address. So should be secure enough for running a webwallet bot over tox.

If the build scripts are working, we will try to put binaries up. However, you should build from source if you are able to.