+++
date = "2026-11-14"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — November 14, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The fourteenth of November found a pattern and fixed it everywhere it appeared. Several listeners and request handlers bounded their work with a cap that bounded nothing, or with no cap at all, so a peer that opened streams and stayed silent could grow goroutines without limit. The same mistake was behind a browser visor that sat at thousands of goroutines and over a gigabyte of heap. Group chat messages got faster again, a Skycoin send too large for one transaction now splits into several, and a Skywallet send in the Angular wallet stopped asking the device to sign the wrong amounts.

### Skywire: Caps That Bound Something

The browser visor's goroutine bursts traced back to CXO's filler. **`6232`** found that it released its parallelism slot as soon as each goroutine started, so the limit on parallel fills did nothing, and one TinyGo tab visor had 2,020 of its 2,733 goroutines parked there with 1.76 GB of live heap. The goroutine now holds its slot until its walk returns, and walks past the cap run inline, so they cannot deadlock. **`6237`** caps the object and delta requests one CXO connection serves at once at 64 and 8, since an object request can wait almost a minute and a delta reply can be half a megabyte.

The same shape turned up in the network listeners. The integrated route setup node took its slot inside the goroutine it spawned for each stream, so its cap of 20 bounded nothing, and a test that floods the port with silent streams had 2,189 accepted. **`6234`** takes the slot before accepting and gives each stream a deadline. **`6235`** bounds the WebRTC answers in flight at 16, each one a peer connection held up to 30 seconds, which a browser visor cannot afford without limit. **`6238`** stops the QUIC listener accepting new connections while 64 wait, so quic-go's own backpressure applies again. **`6240`** drops a group relay or voice stream that sends nothing in its first 30 seconds, and **`6239`** fixed the transport setup listener, which closed a stream from an untrusted key and then served RPC on it anyway. It failed at once only because the stream was closed.

### Skywire: Group Messages Without the Wait

A subscriber filled a new group message one object at a time, about twelve sequential round trips per hop. **`6230`** has each node remember the objects new in its last Roots, so a filling node asks the peer that sent the Root for all of them in one request, capped at 256 objects and 512 KiB. **`6231`** replaces the skychat app's once a second poll for group messages with a call that waits up to 20 seconds for the next one, which takes up to a second off each message, and fixes a stream that skipped a live message whose timestamp tied the last one sent. Older visors fall back to the poll. **`6233`** fixed the test that the change broke on coarse clocks.

### Skywire: Rewards and Release Plumbing

The reward system kept moving toward running inside a visor. **`6227`** adds a serve command that runs the reward pages and the hourly cycle in one process, **`6228`** lets a visor host it as an embedded service under its own key, and **`6220`** moves the reward server out of the command tree into a library. **`6217`** keeps the cycle going when bandwidth collection fails, and **`6229`** and **`6236`** fixed tests on Windows.

The develop build was stamped v1.3.109 plus 155 commits and looked older than v1.3.110 in the hypervisor, because that release is a lightweight tag and the version stamp only counted annotated ones. **`6215`** counts them, after a report in the Telegram group. **`6216`** publishes the rolling binary from develop only, since the master channel was never built and always failed.

### Skywire: Descriptors, Names and the Browser Frame

The descriptors added two days before showed 88 imports pointing up a layer, against the standard's first rule. **`6218`** retags the apps the visor launches, **`6219`** the embedded deployment services, and **`6223`** fixes the rest, mostly descriptors that disagreed with what their package imports. **`6226`** finishes the boolean renames on the names that cross RPC between visors, which had kept their old names for mixed versions. **`6222`** regenerates the templ files in one place so `make format` stops rewriting them, and **`6221`** sends the VPN helpers' warnings on Windows and macOS through the logger.

A remote hypervisor opened in the desk's browser could not subscribe for push alerts, because its page is a cross-origin frame that may not ask for notification permission. **`6224`** has the frame ask the desk, which subscribes a push-only worker of its own on the frame's behalf.

### Skywire Mobile

**`6179`** brings the second batch of fixes from the Skywire Mobile 0.0.9 testers. The mail limit now counts the files rather than their base64 encoding, so a 4.9 MB file is no longer refused as over 10 MB. An attachment over 4 MiB no longer comes back cut at 4 MiB when saved. Mail between a phone and a PC on the same LAN now makes a direct transport when the address resolver sees both behind the same public IP, instead of going out to a dmsg server and back.

### Skycoin

A send that needs more than about 330 inputs is over the transaction size limit, and making the parts one after another fails because the second picks the same outputs as the first. **`skycoin#3304`** builds every part in one pass from separate chunks of the outputs, so they can all be injected at once in any order. The API returns the parts when asked to split, and the CLI splits by itself.

**`skycoin#3298`** fixed a Skywallet send in the Angular wallet, which passed each output's coins in droplets to a daemon that reads a decimal amount, so the device was asked to sign outputs a million times too large. It was not run against a Skywallet or the emulator. **`6225`** brought the fix to the hypervisor. **`skycoin#3297`** returns errors from the encoder where it panicked, **`skycoin#3299`** renames the exported predicates, and **`skycoin#3305`** updates the Go and npm dependencies. On skycoin.com, **`skycoin.com#95`** removes nine unused images.
