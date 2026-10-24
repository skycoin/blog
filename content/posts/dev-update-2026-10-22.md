+++
date = "2026-10-22"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 22, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The twenty-second of October was a light day for merges. Transport discovery stopped counting lifetime byte counters twice after a gap in its intake, the development visor loop learned to reload itself, and the Skycoin repository caught up on its npm dependencies and a lint failure.

### Skywire: Transport Byte Counts

Transport discovery's daily bandwidth total jumped from about 1 TB to between 2 and 7 TB on four days that week. A report arriving with no previous snapshot was credited in full, and snapshots expired after six hours without a report, so after any gap in intake each visor's lifetime counter was counted again, on both ends of a transport at once. On one WebRTC transport both ends were credited 40.3 GB in a day against 4.8 GB in the two visors' own counters. **`5774`** makes a report without a snapshot credit nothing and become the new baseline, and keeps snapshots for seven days. It also leaves out of the bandwidth pool transports whose two ends the address resolver sees at one public IP, since a WebRTC connection carries no peer address for a visor to recognize its own network by. The store tests cover the new baseline, though the same-IP rule was not yet checked against the live bindings feed.

### Skywire: The Development Loop

**`5773`** made the development visor loop script reload itself after each visor exit, so an edit takes effect at the next restart without stopping the loop. It replaces itself in the same process, so restarts do not nest, and an edit that fails a syntax check is skipped while the running copy carries on.

### Skycoin: Dependencies and Lint

**`skycoin#3158`** and **`skycoin#3161`** replicated the pending dependabot updates for the explorer, skycoin-web and the skydex client, rebuilding the committed bundles so a second build reproduces them byte for byte. One of the dependabot updates targeted the old wallet GUI, removed two days earlier, so it had nothing to apply. **`skycoin#3157`** marked the golden transaction test's file access for gosec, which had flagged it and failed lint on every open pull request.
