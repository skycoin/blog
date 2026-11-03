+++
date = "2026-11-02"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — November 2, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The second of November gave dmsg-async its first consumers. Queued mail is now parked on the recipient's inbox hosts, a 1:1 skychat message that no network delivers is parked instead of failing, and pair requests to an offline peer wait for it too. Inbox hosts now apply the recipient's mail whitelist before they store anything, dmsg-async settings change live, and the whole of it has a specification. A run of fixes came from reports in the community chat, a TinyGo evaluation order bug that made every mail send look like a failure in the browser visor was found and guarded against, and a round of Go modernization went through the tree. skycoin.com reorganized its Skywire page around why it is different and now links the v1.3.104 downloads.

### Skywire: Parked Mail and Messages

Queued mail reached a visor that came back only while the sender or one of its helpers was online. **`5983`** has the outbox, once the first delivery attempt fails, seal the message for each recipient visor and park it on that visor's inbox hosts. The recipient fetches parked mail and files it through the same checks as mail over SMTP, and a copy that also arrives directly is dropped as a repeat. The live test between two visors found two bugs fixed in the same change: a failed park was retried in a tight loop, and a shutdown in the middle of an attempt dropped the park. **`5985`** fixed a race in its new test, and **`5994`** fetches parked mail every two minutes instead of every ten.

A 1:1 skychat message to a contact no network reached failed, and skychat has no outbox to retry it. **`5990`** parks it instead: the visor seals it for the contact, signs it with its key and leaves it on the contact's inbox hosts, and the contact files it when skychat starts and every two minutes after. A send also parks when its requested acknowledgment never comes, because a write into a dead connection succeeds. **`5997`** does the same for pair invites, accepts and declines, which now carry an ID the peer acknowledges. With no acknowledgment within ten seconds the frame is parked, and the peer handles each ID once.

**`5993`** closed a gap on the host side. An inbox host took parked mail from any sender, and only the recipient's mailbox refused one its whitelist did not list, after it had used the recipient's share on the host. A policy can now narrow a port to listed senders, and the visor narrows the mail port to its mailbox whitelist while skychat's port is unaffected. **`5992`** shows which outbox mail is parked in the CLI and the hypervisor UI, and **`5996`** lets `skywire cli async settings` change the host's limits, the hosted keys, the inbox hosts and the sender list live, kept in a settings file that survives a restart. **`5991`** specifies dmsg-async, from the record, policy and frame formats to the host operations, the discovery endpoint and the visor's behavior, and adds parking to the skymail specification. **`5995`** fixed a pty client race that showed up in CI.

### Skywire: Fixes from the Community

Several fixes came from operators reporting in the community chat. Setting a reward address from the hypervisor UI wrote it to one file but not to `skywire.conf`, so the next autoconfig brought back the old address, and **`5976`** saves it to both. A changed `SKYCHATADDR` never reached a visor that already ran skychat, because regeneration keeps each app's old arguments, and **`5977`** lets it replace the address while still keeping one set by hand. **`5981`** makes the skychat address default the explicit `127.0.0.1:8001` and says in the help that `*:PORT` or `0.0.0.0:PORT` binds all interfaces. **`5978`** made the autostart switch work for skymail, which is added at runtime, and **`5984`** keeps the autostart choice for the resolving proxies across a restart.

In the TinyGo browser visor every `cli mail send` failed with "not delivered to any recipient" and the inbox looked empty, although the mail was filed. The visor's mail methods returned a result and the call that wrote it in one statement, and the language leaves the order of those two open: the Go compiler read the result after the call, TinyGo before it. **`5973`** assigns first and returns after, at that site and six others with the same shape, and adds a check that rejects any return reading a variable that a call in the same return writes.

**`5980`** logs a placed call that was not answered as "Unanswered call", where it had left no record, and **`5982`** shows skychat's replayed messages in the hypervisor's Chat tab with their own time and direction. **`5979`** adds a Simplified Chinese translation of the hypervisor UI, machine produced and still waiting for a native speaker's review.

### Skywire: Modernization

A set of changes brought the code up to the current language and library. **`5986`**, **`5987`** and **`5988`** applied the `go fix` modernizers for every platform the tree builds for, including `wg.Go`, `t.Context` and `errors.AsType`, and dropped the old `// +build` lines and per-iteration loop variable copies. **`5975`** moved sorting to the `slices` package across 217 files, with typed comparators that cannot index the wrong slice. **`5974`** uses `errors.Is` for file system errors so wrapped errors are seen, moves random numbers to `math/rand/v2`, and moves raw netlink and ioctl calls from the frozen `syscall` package to `x/sys/unix`. **`5972`** holds the VPN's addresses as `netip.Addr`, with a test that the hello messages older visors read are byte for byte the same. **`5989`**, **`skycoin#3191`** and **`skycoin#3194`** took the open dependency updates with their bundles rebuilt.

### skycoin.com

The Skywire page explained the mechanism before the motive, repeated what Skywire is three times at the top, and put getting started below a transport table, a long CLI listing and a 2.2 MB animation. **`skycoin.com#85`** reorders it as why it is different, what you can do, trying it, how it works, running visors and hardware, the network, and the docs and community, and keeps the contents list to one short row on phones. **`skycoin.com#86`** points every Skywire download at the v1.3.104 release, where the downloads page still offered v1.3.101.
