+++
date = "2026-08-27"
tags = ["Development", "Skywire"]
title = "Development Update — August 27"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A day about the lifecycle of a mux leg. With per-frame noise aggregating a single stream across legs, the remaining failure modes are legs themselves misbehaving — black-holing, congesting, sitting in a different latency class, or living on the same LAN as their sibling — and today the router learned to admit, demote, replace and retire them deliberately. On top of that: a seamless in-flight route switch for proxy sessions, and a round of housekeeping from the SOCKS listener to the transport-discovery database.

### Skywire: Managing the Legs

**`4248`** adds latency-band admission, so the mux active set stays homogeneous — a leg far outside the band of its siblings waits in standby instead of dragging the reorder frontier. **`4256`** applies the same idea continuously, demoting gross latency outliers to standby in all modes. **`4247`** replaces a sole black-holing leg instead of wedging the group at zero, **`4246`** retires a manually removed leg on the far endpoint too, and **`4253`** rejects same-LAN legs at mux-set — route calculation cannot see that two paths share a first-hop LAN, so the router checks at attach.

### Skywire: The Scheduler Learns Completion

**`4250`** makes ECF, the completion-aware scheduler, the mux default — the fix for multi-leg throughput collapsing below a single leg's. **`4254`** then closes two of ECF's own traps: over-feeding a congesting leg whose buffer inflates its apparent capacity (the BDP trap), and dumping a cold-start burst onto an unmeasured leg. **`4255`** adds proactive head-of-line retransmit, re-sending the packet the frontier is stuck on before the timer fires.

### Skywire: Switching Routes Without Dropping the Stream

**`4258`** adds `proxy switch`: a running proxy session's primary route moves onto a caller-supplied one without dropping the app's SOCKS5 connection. Make-before-break — the new route attaches as a leg, the switch waits for it to actually carry, then the old primary retires; the route group and its encrypted session are never torn down, so the byte stream continues across the swap.

### Skywire: Housekeeping

**`4245`** sets SO_REUSEADDR/PORT on the SOCKS listener so a reconnect can't leak the port, **`4252`** adds startup GC and compaction to reclaim unbounded `cxds.db` growth, **`4251`** gives dmsgscp an idle no-progress deadline instead of a fixed total timeout, and **`4249`** fixes unreadable dark-theme text across the manager UI. **`4257`** moves the real-origin browser substrate — the service worker, bridge protocol and responder guarding the trust boundary — out to a library, keeping in-tree only the skywire-specific transport fetch and bootstrap.
