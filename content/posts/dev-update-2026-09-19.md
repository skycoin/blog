+++
date = "2026-09-19"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — September 19, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A quieter day after the mux campaign's two heaviest, with four fixes that all trace back to operators actually running the software rather than the rig. A 32-bit ARM visor was found crash-looping every forty-five seconds on a misaligned atomic counter, the standby pool's own route-finding was caught asking the same narrow question of the route finder on every dial and getting the same three routes back each time, half the live-settable config fields the visor already knew how to apply at runtime were still being reported as needing a restart, and a run of small dmsg CLI tools were found registering discovery entries for keys nobody could ever usefully look up.

### Skywire: A Crash Loop on 32-Bit ARM

**`5072`** traced a user's report of a 32-bit ARM visor restarting every forty-five seconds to a panic reading `unaligned 64-bit atomic operation`, thrown from a byte counter the direct-path proxy reporting added back in v1.3.94. On a 32-bit architecture an `int64` field inside a struct is only four-byte aligned by default, while the atomic instruction the runtime uses for a 64-bit counter needs eight — a mismatch that neither compiles as an error nor shows up under `go vet`, only as a runtime panic that takes the whole visor down with it.

Running the affected test suites under `GOARCH=386`, which shares arm's four-byte alignment but can at least run its test binaries on an ordinary amd64 machine, turned up four more structs carrying the identical latent bug, one of them hiding twenty additional counters that only became visible once the first few were fixed and the struct's layout shifted. Every one of them is now a typed `atomic.Int64` or `atomic.Uint64`, which carry the runtime's own alignment marker so the compiler places them correctly regardless of architecture and no later field reorder can reintroduce the problem; a new unit test pins the types so a future revert to a bare `int64` fails in CI rather than on somebody's board.

The fix itself could only be verified on 386, since there was no armhf hardware on hand, but 386 shares the exact alignment rule that caused the crash.

### Skywire: A Standby Pool That Kept Asking the Same Narrow Question

**`5070`** found four separate things worth fixing from one rig session. The standby pool's fill was dialing one route at a time and asking the route finder for only three candidates per dial while excluding whatever it already held — since the finder answers in rank order, those were the same three routes on every single dial, so a 32-tunnel pool collapsed onto four transports with twenty-nine of its members sharing one direct route. A diversifying dial now asks for a window of twenty candidates instead of three, which is the finder's own per-request ceiling. The same session added `hv auth on|off`, since there had been no way to drop the hypervisor UI's login requirement short of a full visor restart; the new RPC rebuilds just the chi router the setting controls and cycles only the UI's own listener, the same narrow scope `hv ui disable` and `hv ui enable` already use.

`hv ls` now also reports which hypervisors each attached visor answers to, the reverse direction of what the tree already showed, and a CSS overlap in the node list that let the transports grid paint over the dmsg numbers below roughly 1400 pixels of width was pinned to its own cell.

### Skywire: Live Config Catches Up With Itself

**`5071`** found ten config paths the visor already knew how to apply live — the reward address, the hypervisor's enable, UI and auth flags, and both resolving proxies' enable, bind and upstream settings — reported by `config set` as requiring a restart purely because nobody had added the corresponding row to the table that routes a path to its setter, taking the live-settable total from thirteen paths to twenty-three. A smaller but sharper fix rode alongside it: a config field that the JSON marshals but tags as internal had been resolving as `unknown config path`, an error that reads as a flat lie next to the very same field appearing in `config show`'s own output; it now says plainly that the field mirrors state held elsewhere and is read-only by path, rather than implying the field doesn't exist at all.

### Skywire: Discovery Entries for Tools That Never Listen

**`5073`** found that a run of small dmsg CLI tools — `dmsgcurl`, `dmsgip`, `dmsgprobe`, the standalone `dial`, and the resolver half of `dmsgweb` — had been registering a dmsg discovery entry on every single invocation despite dialing outbound only and opening no listener of their own. A discovery entry is specifically an advertisement of inbound reachability, so for a tool that generates a fresh keypair and discards it seconds later, registering is a write and a row in the discovery store for a destination that accepts nothing — the config flag to suppress exactly this case, `NoRegister`, already existed and even documented this case in its own comment, but no binary under `cmd/` had ever actually set it. Two genuinely dual-mode tools, `dmsgweb`/`dmsgwebsrv` and the standalone `dmsg-socks5`'s proxy and serve subcommands, now set the flag per subcommand rather than at the package level they share, since only one half of each pair actually listens.
