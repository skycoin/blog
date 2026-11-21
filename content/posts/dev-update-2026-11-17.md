+++
date = "2026-11-17"
tags = ["Development", "Skywire", "Skycoin", "CX"]
title = "Skywire Development Update — November 17, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The seventeenth of November brought CX, Skycoin's programming language, back into active development. Its scattered repositories were merged into one new repository, `skycoin/skycoin-cx`, and three more appeared beside it: a small Forth VM that runs a subset of CX's intermediate form on microcontrollers, a web playground, and an Android playground for CX apps. Skywire itself had a smaller day of fixes to configuration, the new interface and the reward distribution, and both Skywire and Skycoin went back to the upstream logging library.

### CX: One Repository

CX's code had been spread across several repositories that had not seen work in years. **skycoin-cx** gathers them into one module, renamed to match the repository and flattened into numbered packages, with the CX and Go benchmarks from the old benchmark repository and the CX unit test library from the old games repository. A cleanup list names every path of the former repositories with an action to keep, merge or delete it. The parser gained a way to read source strings that returns errors instead of exiting, the first of many changes that let CX run as a library inside a longer lived program. The dependencies were updated and vendored.

### CX: Forth on Microcontrollers

**skycoin-cx-forth** is a small Forth VM in Go that runs a base subset of CX's intermediate form, built with Go for the host and with TinyGo for microcontrollers. Its cells are tagged as integers, floats, strings or ternary values, which can be true, false or unknown, with Kleene logic for AND, OR, NOT and implication and a three way branch. Its ternary words follow an existing eForth vocabulary for ESP32 and accept that vocabulary's integer encoding as well as the tagged cells. The repository has a REPL for the host and a UART REPL for the ESP32, along with a translator from the CX subset to Forth words.

### CX: Two Playgrounds

**skycoin-cx-playground** is the web playground, rebuilt against the new repository. The CX compiler keeps global state and exits on a compile error, so the playground's server now runs each program in a child process, killed after 20 seconds, where reusing one process gave wrong results from the second program on. It builds with Go 1.27.3 to match.

**skycoin-cx-playground-android** is new. It is an Android app built with Gio, the same stack as the Skywire Android app, that lists CX apps and runs them. An app is a directory of CX sources with a small description file, which a tool turns into a manifest listing each file in hashed chunks, and the app's hash is the hash of that manifest. The bundle the app carries is content addressed, and every manifest, chunk and file is checked against its hash before anything runs. CX programs draw a display list that the host renders on the GPU, and read touch and key events from a queue. Fetching apps over the network is left for later, with the interface for it already in place.

### Skywire: Configuration and the New Interface

`skywire autoconfig --no-proxyserver` wrote the right setting, yet the proxy server kept starting, because regenerating the config copied every app's old autostart value over the new one. **`6276`** lets a server setting that is declared by flag or in the config file decide the autostart, while an unset one keeps the old value. **`6267`** fixed the new interface's VPN server picker, which showed a bad service list in a browser because an in-process call passed on the browser's request for gzip and got a compressed body back.

**`6269`** takes in **`skycoin#3325`**, so the Skycoin node inside Skywire reports the exact commit it was built from and node.skycoin.com shows the build it runs, not just the last tag. **`6277`** and **`skycoin#3326`** import the upstream logrus again, after the one fix the fork carried, for TinyGo on Windows, was merged upstream that day. **`6268`** fixed a lint failure on macOS and Windows, and **`6272`** a reconnect test that waited for a dial where it needed a full echo.

### Skywire: Reward Distribution

The reward payout script lived outside the repository and its copy inside had drifted, so **`6273`** adds `skywire cli rewards send` to do the same steps, and **`6274`** makes the bare command refuse unknown arguments. **`6270`** and **`6271`** hold a payout against a recalculation that could run between preparing the payout and broadcasting it, by checking the transaction against a hash of the current payout list. **`6275`** stops the reward server from running the environment file through bash when any command started. A file that called skywire inside it made every command, even `--help`, start itself again without end.
