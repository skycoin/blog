+++
aliases = []
date = "2019-07-06T00:00:00+00:00"
description = "Updates about the Skycoin ecosystem development of the week. "
image = "/img/711674AD-99AB-48A0-BFCA-34161B7CE762.png"
tags = ["Skycoin", "Development"]
title = "Skycoin Development Update  - Week 27 "

+++
### Skycoin Core Update

Over the past week we have been working to redesign the wallet management library to support multiple wallet "types" (a prerequisite for full bip44 wallet support).

### Skywire Update

Skywire has now implemented benchmarks for dmsg structures. Meanwhile, we have moved the dmsg library into its own repo and created a wrapper for it in Skywire, as well as increasing test coverage for dmsg. Because we want other services to be able to use dmsg, we have now made it independent of Skywire. As a result, Skywire imports dmsg so that projects using it for communication do not need to import Skywire.

Among other developments, we also fixed a data race on the SSH server.

### Skywallet Update

As part of the ongoing security review, Skywallet this week implemented salting for the random values used for nonce generation. We also implemented checks for buffer overflows in fsm_impl.c and fixed compilation issues for the full Skywire firmware.

### CX Update

CX has now created a heap memory debug tool. We also fixed a number of issues contributing to incorrect writing of the heap memory.

### Coin Hour Bank Update

The major news from CHB this week is that we have implemented an intelligent UTXO selection algorithm for withdrawals.

Check back for news on the coming week's progress and development at Skycoin!

{{< youtube XU-k92Jt4BU >}}