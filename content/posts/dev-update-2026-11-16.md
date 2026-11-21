+++
date = "2026-11-16"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — November 16, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The sixteenth of November shipped two Skywire releases before most of the day had begun. v1.3.111 gathered everything from the interface ports onward, and v1.3.112 followed a few hours later with three skychat group fixes found on Skywire Mobile 0.0.12. The rest of the day went into the multipath router, where a dead leg now gets reported to the far end at once and a skynet forward keeps spare routes ready to take a lost leg's place.

### Skywire: v1.3.111 and v1.3.112

**`6252`** updated the Go dependencies across every platform and took in Skycoin's split sends, the web wallet hang fix and the sweep of exposed addresses. **`skycoin#3324`** did the same on the Skycoin side. **`6253`** adds the v1.3.111 changelog, a short summary of the user facing changes followed by the pull requests from **`6135`** onward. Its arm64 TinyGo build ran out of memory on the 16 GB runner, which reported only a cancel, and **`6256`** gives those builds a swap file so the assets could be rebuilt.

Three bugs from group chat on the phone made v1.3.112, with its changelog in **`6258`**. A member who lost the owner's feed could fail every redial to the owner's CXO node for over an hour and stay cut off from the group. The accepting node closed its old connection to the peer and then waited the full response timeout before answering, while the dialer waited the same timeout for that answer, and **`6257`** answers at once. **`6254`** stops a voice or video message sent to a group from showing up twice in the sender's thread, since the faster group delivery from two days before let the echo arrive before the send had answered. **`6255`** pulls a recorded clip posted to a group as soon as it arrives, under 16 MB and an hour old, where before it showed as a file card that had to be requested before it would play.

### Skywire: Dead Legs and Spare Routes

A download that lost its active leg past the first hop slowed to about 50 KB/s for over a minute. The receiving end pruned the leg at once, but the sending end still listed it as alive and kept striping data into it, because its liveness probe needs three missed echoes thirty seconds apart before it rules. **`6262`** has the end that prunes a leg send a leg-gone frame on every surviving leg, so the peer drops it within moments.

A multi-route skynet forward replaced a dead leg by dialing a fresh route on the spot, ranked by first hop latency, and in a live test the replacement ran at about 130 KB/s while other paths to the same peer ran at 2 to 10 MB/s. The proxy avoids this with a standby pool of measured routes, but forwards had none. **`6263`** gives a forward with more than one route three spare route groups to the peer, labelled as standby, so a lost leg is replaced from routes already dialed and measured.

### Skywire: Operators' Reports

On a Raspberry Pi running Armbian without iptables, the VPN server reported permission denied, and its DNS helper failed with a bare exit status because the kernel had no TUN driver. **`6266`** names the missing piece in both cases. **`6265`** corrects the documentation of two transport limits. The maximum transports setting applies only to a public visor, counts distinct peers and pauses the service discovery listing while over the limit without closing anything, and its documented default was wrong. The address resolver transport limit only uses its sign.

The reward side of the visor was tightened in **`6259`**, **`6260`** and **`6261`**. A finished day is fetched once, the calculation runs when an input changes instead of every hour, and a visor pushes its survey as soon as its reward address changes, so a new address no longer waits up to an hour to count.

### Skywire Mobile

**`6264`** fixes the app icon, which the system update dialog showed as a clipped ellipse of stripes because its foreground held a bitmap at a fixed size. The foreground is now a vector built from the cloud of the Skycoin logo, centered, in the app's blue.
