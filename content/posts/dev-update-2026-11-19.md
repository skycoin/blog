+++
date = "2026-11-19"
tags = ["Development", "Skywire", "Skycoin", "CX"]
title = "Skywire Development Update — November 19, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The nineteenth of November began a long cleanup of the CX compiler and runtime. CX had no CI at all, and its test runner hid failures. So the day started by making the checks honest and the tests green, then set rules for how the code is put together and fixed the bugs those checks exposed. On the Skywire side, the browser visor's heap growth was traced to garbage held by stale stack slots, and the proxy's standby pool now fills to its ceiling instead of stopping at 13 tunnels.

### CX: Honest Checks

**`skycoin-cx#37`** adds CI that runs `make check` on Linux, macOS and Windows, with a separate job that vets the graphics code against the GL, X11 and OpenAL headers. **`skycoin-cx#33`** made `make check` pass, with every test that still fails commented out beside the cause and an issue number. **`skycoin-cx#34`** then fixed the CX test runner, which ran a test when any of its tags was enabled, passed a program that exited cleanly when an error was expected, and never fired its timeout. Eight more failures surfaced once it told the truth, and the cheap ones were fixed there, including a stack size flag that was never applied and a precedence bug that wrote past the end of memory. **`skycoin-cx#69`** makes main the only long lived branch, and **`skycoin-cx#62`** rewrites the readme, which still described the old repository.

### CX: Rules for the Code

Importing the parser used to run hidden init functions in four packages, which built the syntax tree, registered opcodes and filled constant tables before main parsed its flags, so the heap size flag never applied. **`skycoin-cx#10`** makes them explicit functions that the `cx` command calls in a numbered order after the flags, and a check forbids new ones. **`skycoin-cx#85`** removed the last, from the program store, which opened a database next to the executable on import and exited on any error. **`skycoin-cx#82`** adds a rule against interfaces embedding other interfaces, checked the same way, and **`skycoin-cx#11`** marks every piece of state, pointer at rest and object creation that will later move into a manager, as comments only.

The package loader got the most attention. **`skycoin-cx#70`** returns the errors it dropped, **`skycoin-cx#72`** builds paths with the standard library and refuses stored names that would write outside the save directory, and **`skycoin-cx#76`** checks arguments at entry and stops on import loops, which hung it before. Redis had no stated purpose there, so **`skycoin-cx#79`** commented it out and **`skycoin-cx#114`** deleted it, leaving bbolt as the only store. **`skycoin-cx#61`** moved to the maintained bbolt fork, since the archived one failed Go's pointer checks under the race detector, and **`skycoin-cx#142`** adds notes at each loader oddity not yet fixed, pointing at its issue.

### CX: Bugs from the Issue List

Once the tests ran, old issues could be closed one by one. **`skycoin-cx#163`** registers the string comparison operators, which had no operator at all, and fixes one that computed greater or equal for greater. **`skycoin-cx#164`** returns the real working directory, which was always empty, and **`skycoin-cx#168`** starts the REPL when `cx` runs with no arguments, where it exited silently. **`skycoin-cx#166`** drains program output while the REPL runs it, since output over 64 KiB blocked until a timeout. **`skycoin-cx#165`** sizes an error channel that could block forever on a bad package line, and **`skycoin-cx#169`** spells a runtime constant correctly. **`skycoin-cx#171`** makes the TCP package use its arguments and keep what it opens, where it closed connections at once and crashed when a dial failed.

**`skycoin-cx#172`** found a real bug among the dead unsigned checks, a loop that counted down past zero and panicked when stepping out of a call. **`skycoin-cx#173`** makes LZ4 compression total, since it panicked on input it could not shrink, without changing the serialized format. **`skycoin-cx#53`** ports the random program generator to type signatures, after it panicked on every run. **`skycoin-cx#167`** fixed the Go Ackermann benchmark, which computed the wrong function and so did not match the CX one, and **`skycoin-cx#170`** wrote a benchmark file with mode 644 decimal rather than octal. **`skycoin-cx#36`** notes that the mobile package does not compile and links the issue describing the options.

### Skywire: Heap in the Browser Tab

The visor in a browser tab grew from about 150 MB to 2.8 GB a day, while a native visor on the same code stayed flat. A heap census found about 1.4 GB of dead buffers held only by goroutine stacks, mostly the transport read goroutines parked in a read. TinyGo scans stacks conservatively, and the read loop handled each packet on its own stack, so stale slots there kept old buffers alive. **`6285`** dispatches packets off the read goroutine. **`6286`** reuses the render and JSON buffers of the proxy status page and the visor summary, which were a large part of that pinned garbage.

### Skywire: Pool Depth and Small Fixes

A proxy's standby pool settled at 13 tunnels, reporting no disjoint first hop left, although 837 intermediates shared a transport with both ends. A dial that lost its first hop claim to a sibling dial excluded only that transport and peer, then kept re-picking hops other siblings held or that sat behind the same IP, and each loss spent a fetch attempt. **`6283`** refreshes the exclusions from every sibling after a lost claim and does not count the loss as an attempt. On a live visor the pool now fills to its ceiling of 32, each tunnel on its own first hop.

The dashboard wallet warned that CSRF was not working whenever its node had CSRF off, although the browser never talks to that node and the hypervisor puts every node call behind its own login. **`skycoin#3327`** lets a host app turn the warning off and **`6284`** does so. **`skycoin#3328`** carried the build commit fallback into the new coin template. **`6282`** detects a truncated bbolt file before opening it, which the earlier fix needed on Windows, and **`6287`** and **`6288`** fixed two flaky tests, one of which failed only in the first fifteen minutes after midnight UTC.
