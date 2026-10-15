+++
date = "2026-10-12"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 12, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The twelfth of October brought `skywire sh`, a websh shell on an ordinary terminal with skywire running inside the same process, which first meant teaching a command tree that called `os.Exit` in two hundred places to end only the command being run rather than the whole program, and then giving each in-process run its own standard output and error so pipes and redirects work. A visor's port 80 learned to serve several local sites by host name, so a visor can host websites without a separate reverse proxy in front of it. The browser desk stopped keeping a dead visor's memory alive and stopped starting a second visor beside one that was still running, a batched route setup that nobody was waiting for any more is now canceled, and on the Skycoin side a block publisher started without a secret key now returns an error instead of panicking.

### Skywire: A Shell With Skywire Inside It

A shell that runs skywire in its own process, as one on a phone must since there is no separate binary to start, could not do it: the command tree called `os.Exit` in 201 places and `log.Fatal` through the standard logger, and either ended the host. **`5625`** added a way to run the command tree in-process on the caller's input and output and get back its exit status. An exit inside such a run now ends only that run, by unwinding its own goroutine or, from a goroutine the command started, by ending that goroutine and the run it came from. A panic ends the run with status 2 and its stack. Several runs can overlap, as a visor and a CLI command do in one shell, so each run's flags and input and output are kept separate. Outside a run everything behaves as before.

**`5626`** then added `skywire sh`, which runs websh's console on the current terminal, with its shell, applets and line editor working on the machine's own files and programs, and with `skywire` inside it running in-process just as it does in the browser desk. It takes a command line with `-c` or a script file, and is Unix only, as websh's console is. **`5627`** gave each in-process run its own standard output, error and input, so that a pipe or a redirect of a `skywire` command in that shell actually catches its output and its logs. Commands across the tree now print through those streams rather than writing straight to the process's own, and in `skywire sh` a pipe, a redirect to a file, discarding errors and piping JSON into `jq` now behave as they would for a separate process.

### Skywire: Serving Sites by Host Name

**`5628`** turned the port 80 entry on a visor into a set of virtual hosts, each mapping a host name, with optional aliases and an optional public key whitelist, to a local service, while the bare visor name keeps the landing page and links to the sites. `skywire cli serve vhost add`, `ls` and `rm` manage them, so a visor can serve sites without Caddy. It was tested on a local visor with two backends through the resolving proxy over both skynet and dmsg. **`5629`** added a catch-all virtual host named `*` that takes every host name no other entry has, so a visor can hand all its names to a reverse proxy with one command and still keep its own landing page and health check on the bare name. Sites now receive their short name as the host header rather than the full mesh name, and adding or removing a plain port 80 forward no longer drops the virtual hosts.

### Skywire: The Desk Lets Go of Dead Visors

**`5619`** found that a visor which exited or crashed in the browser's exec worker kept its whole wasm memory alive, because any JavaScript callback that outlived the program, such as a timer or a WebSocket handler, still held a reference to it. On a desk tab a crashed 4 GiB visor stayed resident next to the one that replaced it. A bottle update now clears that reference when the run ends; two runs of a test program that leaves a timer behind kept two 103 MiB memories before and none after.

**`5624`** fixed the desk's liveness watchdog taking a closed RPC port as a dead visor and starting another one in the same worker, which could leave a still-booting visor running beside a second one writing the same database files. One desk was seen with four instances in one worker and two database panics. A restart now waits until no instance is still running. The trigger itself could not be reproduced, so the change only removes restarts while a visor is alive.

**`5620`** found a batched route setup request running on its own context for up to two minutes even after every dial in it had given up, so against a setup node that accepts but never answers, each retry left another request holding an RPC client, a dmsg stream and their goroutines. In a test against a mute setup node, twenty short dials left 120 goroutines behind. The request is now canceled as soon as its last member leaves, and the same test leaves none. This bounds one source of growth while setup nodes are unhealthy, though it is not proven to be the whole cause of the browser visor crash that prompted it.

### Skywire: Configuration and Logging

**`5622`** let `skywire cli config set` reach the settings of an embedded service by its name, which until now was refused or found nothing. The change edits the service's own JSON block in place, keeps each value's kind, refuses secret keys, and needs a restart since services read their block at start. **`5623`** accepted `none` and `off` as log levels, mapping them to the quietest level the logger has, and made the help for the log level list every accepted value. **`5621`** fixed a host bridge test that failed in CI because the bridge could close its session before a refusal message had been sent; the bridge now waits for the tab to hang up after reading it, or for the hello timeout. The failure could not be reproduced locally in 900 runs, but the race was in the code path.

### Skycoin: An Error Instead of a Panic

**`skycoin#3096`** fixed a Skycoin node started as a block publisher without a blockchain secret key panicking during config verification instead of returning an error. Verification now checks for a missing key first and says how to supply one, and uses the non-panicking key conversion so a malformed key also returns an error. A table test covers the four combinations of publisher and key.
