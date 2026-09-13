+++
date = "2026-09-11"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — September 11, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The day's largest finding was fleet-wide: the transport discovery had become a prerequisite for booting a visor at all, so when it went unreachable the visors restarting afterwards never reached their launcher — no RPC server, no dmsgpty, no apps, and no way in to fix it. Fixing that exposed a second defect underneath, a subscription goroutine closing a channel it did not own, which crash-looped a real visor twice in six minutes. A second thread ran through the dmsg discovery, where three pieces of code still assumed a key means one thing now that one key carries both a client and a server.

### Skywire: The Transport Discovery Became a Boot Prerequisite

**`4801`** fixes the day's worst bug. `connectToTpDisc` retried constructing the transport-discovery client on `context.Background()` with an unbounded try count, not cancellable by shutdown either. Constructing it does network I/O, so a visor that could not reach the TPD never returned from the transport module, which gates the RPC server, the launcher and therefore dmsgpty, the hypervisor RPC and every app listener, and the router. Such a visor is alive and holding dmsg sessions, its await-setup listener on port 136 still answers, and nothing else does — and the way in is the thing that is down.

It cascades, because the deployment services are reached over dmsg: a visor co-located with the TPD takes the TPD down with it, and every visor restarting afterwards wedges on the missing TPD. One host went first, then hosts healthy minutes earlier showed the same signature as a rollout restarted them — port 136 answering, ports 22 and 46 dead — and the advertised dmsg-server set fell from nine servers to two. Boot now makes one bounded thirty-second attempt and otherwise carries on with a deferred client that keeps connecting in the background. Verified live against the still-unreachable TPD: before, no RPC listener three minutes in; after, RPC up and fifteen apps running.

**`4802`** is what that fix uncovered. The CXO subscription manager's feed cycle goroutine closed whatever `f.done` held when it returned, racing its own stopper — the grace timer captures the channel, nils the field, then cancels the cycle's context, so the loop woke only after the field was nil, read it, and panicked closing a nil channel. The goroutine is now handed the channel it owns at launch. It had been masked all along: a visor blocked on the transport discovery never got far enough into boot to acquire a feed, so it was hit immediately once that blocking was removed — two crash loops in six minutes. Shipping the boot fix alone would have traded a wedge for a crash loop.

### Skywire: One Key, Two Halves, Three Wrong Assumptions

**`4797`** handles the first: a discovery key stopped being proof of server liveness, because a folded visor's client half keeps the shared Redis entry alive long after the in-process server behind it has stopped listening. The entry stays in the servers set advertising a reachable address and around 1200 free sessions, so clients keep picking it and every dial homed on it fails. In production four visors whose dmsg listeners were down stayed in the server set for 13 to 22 minutes, taking the address resolver, transport discovery and route finder homed on them off the network — and with the address resolver unreachable, no direct transport could be made to those peers. A registration older than three update intervals is now withdrawn from the servers set; the key stays, so the visor is still dialable as a client.

**`4800`** corrects that a few merges later. The staleness check read the entry timestamp as UnixNano, which production entries carry, while several constructors and tests write Unix seconds into the same field — read that way round, a seconds value dates the entry to 1970 and a live server is withdrawn permanently. Guessing wrong is a factor of a billion rather than a rounding error, so both units are now accepted, split at 1e12.

**`4809`** is the third assumption, running the other way: setting an entry forced the short two-minute server expiry onto anything with a Server section, and since a folded visor's two halves share one Redis key it landed on the client registration too. Sixty minutes down to two is a thirtyfold cut in the re-registration gap a visor tolerates, and past that window it vanishes from discovery and is unresolvable as a client — the harder failure, and a silent one.

### Skywire: Failures That Say What Actually Happened

**`4798`** stops three places collapsing a specific failure into a generic one, which together made a `proxy start --direct` failure unreadable. The dial ladder returned a bare cannot-connect-to-delegated-server error once every phase had failed, discarding what each phase knew: no listener on that port, a server that cannot forward, a refused connection. The first per-attempt cause now travels out alongside the unchanged error code. `EnsureBestTransport` kept only the last error, so a creation where all five direct types failed identically surfaced as a webrtc signaling failure when stcpr, sudph, squicr and swtr had each died one line earlier at the same address-resolver lookup.

**`4795`** adds the view missing for this whole class of problem. A visor can run a dmsg server on its own key, share its transport TCP port with it and relay dmsg for attached peers, and none of it was visible from the visor — finding out took `mdisc entry`, `ss` on the host and a pass over the logs. A `roles` subtree now reports whether an in-process server is running and in which of its two modes, plus both directions of the relay against the configured stream ceiling.

**`4805`** removes a diagnostic trap that produced a plausible wrong answer rather than an error. `--pk` carries a no-option default so a bare `-p` means the local visor, and pflag's price is binding only the `--pk=<value>` form, leaving the spaced form's value as a positional argument the command discarded — so asking for another visor's transports printed the local visor's under the requested key's name. Verified live at 934 transports local against 550 for the requested key.

### Skywire: Settings That Never Reached Anything

**`4811`** fixes two config fields dropped silently in both directions. The dmsg config's codec is hand-written, because the array/object duality of that section defeats `encoding/json`, and a field carrying a json tag is not serialized unless explicitly listed — `direct_only` and `relay_max_streams` never were, so an operator's value never reached the client and was erased on the next rewrite. The second is the only configured limit on relay amplification, and it has been unsettable since it was added, on every visor — while its default was recently raised from 256 to a full dmsg server's cap.

**`4796`** fills a gap of the same shape in the install-command generator, which builds its form from the flag-to-`skywire.conf` variable table: the flags for the legacy hypervisor UI and the in-visor dmsg server were registered but never added to that table, so an operator could not generate a config using the visor-plus-dmsg-server combination. Six entries are added, with a note that the in-visor server shares the transport port. The canonical flag list in its test had drifted by about thirty flags, which is why CI never caught the gap.

**`4806`** closes a sharper hole: a secret key passed as `--sk` is visible to every process through `ps` and lands in shell history, 43 places in the repository register such a flag, and the file to keep a key in already exists, written by autoconfig. Flag initialization now fills any unset secret-key flag from it — opt-in, since adopting the visor's identity by default would have two dmsg clients racing for one discovery entry.

### Skywire: A Cheaper Feed and a Help Screen That Fits

**`4794`** takes a third of the transport discovery's CPU seriously. The CXO metrics publisher accounted for that third in a fresh profile, two thirds of it inside the encode — deflate at the default level plus reflection-based JSON, republished every tick on a body nothing reads directly. Compression drops to its fastest level and the marshal moves to jsoniter: at 13,000 transports, 74ms down to 42ms per encode for 5.1% more bytes.

**`4804`** fixes the help screen, unwrapped because cobra asks pflag for its flag usages at width zero, which means do not wrap. A long description runs off the right edge and the terminal folds it back to column zero under the flag names, where it reads as another flag — `cli pty exec --help` carries a 180-column line on develop today. Both blocks are now wrapped to a hardcoded 80 — hardcoded, because help gets piped, redirected into bug reports and read on a terminal other than the one that produced it.
