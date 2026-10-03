+++
date = "2026-09-20"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — September 20, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A short day with two fixes, one of them idling down a cost the standby pool's own growth had quietly created, and the other explaining why the test suite had effectively stopped running at all for a stretch of time.

### Skywire: A Quiet Route Group Still Spins Its Loops

**`5074`** found that every route group runs twelve goroutines regardless of whether it is carrying any traffic, verified directly against both a local visor and an exit holding thirty-two live groups. Five of those loops — the send-window and TLP timers, the reorder-stall check, leg-state resync and the unidirectional-flip controller — cannot do anything useful on a group that is simply holding a route open with nothing moving on it, and between them they were waking roughly twenty-three times a second per group per end, dominated by the two timers running at ten hertz each. That cost is invisible at one tunnel and becomes most of a visor's idle CPU once the standby pool is holding dozens of groups toward a ceiling in the hundreds.

Those five loops now stop their tickers and park on a broadcast fired by the write, receive and leg-append paths instead, cutting a quiet group down to roughly a quarter of a wakeup per second; the gate counts received bytes as well as sent ones, since a group being downloaded to sends almost nothing itself and would otherwise have read as idle on every single incoming packet. The four loops that specifically exist to notice a quiet group going wrong — keepalive, leg liveness, SACK and the sole-leg black-hole check — stay ungated, since parking them would defeat the reason they run at all.

### Skywire: The Lint Lane That Was Hiding the Tests

**`5075`** fixed six lint findings that had been failing the linux CI lane outright, which runs `golangci-lint` before `make test` ever starts — meaning the Go test suites had not actually been executing in CI for as long as the lane stayed red. Three were a security linter flagging an `int`-to-`uint64` conversion in a setup-metrics test as not provably non-negative, fixed with an explicit guard rather than a blanket suppression since the value in question is already floored at one by its own registration; the other three were US-locale spelling flags on `honoured` and `behaviour` in comments. With the lane unblocked, two previously hidden and unrelated test flakes surfaced on their own — an emulated-leg scenario failing roughly one run in four under CPU pressure, and an intermittent CXO churn test — both left for their own fixes rather than folded into this one.
