+++
date = "2026-11-18"
tags = ["Development", "Skywire", "Skycoin", "CX"]
title = "Skywire Development Update — November 18, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The eighteenth of November put CX in the browser. The CX command now builds for WebAssembly, and the web playground runs it entirely in the page with no server, published on GitHub Pages. The Forth VM got a browser REPL too, and booted on two ESP32 chips under emulation. The new CX repository took the package layout it will keep, ordered by where each package sits in the import graph. Skywire fixed a crash on Android that restarted the core on every VPN connect, and a reported bug where the visor's internal apps vanished from the list.

### CX: Packages Ordered by Import

**`skycoin-cx#1`** renames every package directory to `t<N>-<name>`, where N is one more than the highest tier it imports, tests and build tags included. A package can then only import packages of lower tiers, and a script checks the rule in `make check`. The binaries moved to the root the same way, so the `cx` command is now `t11-cx`, and no Go file sits deeper than one directory. **`skycoin-cx-playground#2`** and **`skycoin-cx-playground-android#2`** followed the rename, and **`skycoin-cx#2`** fixed the spelling and filled in the update steps in the readme.

**`skycoin-cx#3`** drops an unused call that fails under WebAssembly and made `cx` panic at startup there. With it gone, the playground's sixteen examples give the same output under Node as natively, apart from the platform string and a sort on random input. **`skycoin-cx#4`** fixed the command line, which took any first argument containing help, version, env, ast or tokenize as that subcommand, so running a file called `conversions.cx` printed the version.

### CX: Playgrounds and Forth in the Browser

**`skycoin-cx-playground#3`** runs the playground entirely in the browser. The page builds `cx` for WebAssembly and uses bottle's in-memory filesystem and process model, so each run writes the editor contents to a file and starts `cx` as a new process in a worker. Compiler state and exits stay inside that run, and a 20 second timeout or the stop button ends a program that never returns. It is published at skycoin.github.io/skycoin-cx-playground on every push. **`skycoin-cx-playground#1`** made the page plain HTML with no stylesheet, editor library or jQuery, and **`skycoin-cx-playground-android#1`** gave the Android app a plain monospaced terminal look in one font.

**`skycoin-cx-forth#2`** builds the Forth REPL for WebAssembly with the standard Go toolchain and serves it at skycoin.github.io/skycoin-cx-forth. **`skycoin-cx-forth#1`** boots the UART REPL on the classic ESP32 and the ESP32-C3 in Espressif's QEMU, with a script that types a session of arithmetic, definitions, ternary words, an error and all four CX examples and checks every reply. Both chips give the same output as the host REPL. On the C3 the REPL first saw no input, because the UART driver refused zero pins and the error was ignored, and the REPL now names the pins and prints that error. Neither chip has been tested on real hardware yet.

### Skywire: A Fault on Android and Vanishing Apps

A user's Android app restarted its core on every VPN connect. A truncated bbolt file leaves pages past the end of the file, and the integrity probe read them through memory mapping, which raises a memory fault rather than a panic, so its recovery never ran and the process died. **`6281`** turns that fault into a panic during the probe, so the file is moved aside and a fresh one created. The new test crashed the test binary the same way before the fix.

Changing an app's arguments reset the launcher from the config's app list, which dropped the apps the visor adds itself, such as pty and SkyMail. They kept running but vanished from `skywire cli visor app ls` and the interface until a restart. It was reported on v1.3.112 in Telegram, and **`6280`** keeps those entries.

**`6278`** builds the TinyGo targets with the current release of the fork's toolchain, kept up to date in the user's data directory, where before they used whatever TinyGo was on the path. **`6279`** fixed the reward send test on Windows, where Git Bash turns home paths into MSYS paths.
