+++
date = "2026-08-15"
tags = ["Development", "Skywire"]
title = "Development Update — August 15"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Most of today is the browser visor becoming trustworthy to use: the hypervisor-UI tabs that spun forever now render at once, clearnet and mesh browsing stop failing on transient races, and a POST-body corruption that had been silently rewriting every request body is fixed. Underneath it the transport layer sheds two sources of wasted goroutines and one half-open leak, the CXO subscription goes live instead of polling, and the CLI gains two output filters that work on both binaries.

### Skywire: The HV-UI Tabs Stop Spinning

The manager UI polls its overview tabs on a short `interval → switchMap` cadence, so any backend call slower than the poll is cancelled before it emits — which is exactly why several tabs spun forever on the single-threaded wasm visor. **`3943`** fixes the Services-Health tab: `SelfServiceHealth` probed seven deployment services over dmsg synchronously (blocking the caller up to 9s, worse when serialized behind other calls), so it now serves a cached snapshot immediately and refreshes in the background. **`3945`** does the same for the Network and Transports overviews — `SelfNetworkView` aggregates SD/TPD/UT over dmsg (~28-30s) and `SelfNetworkTransports` fetches TPD metrics (~45s cold), both far past the tab's poll — routing them through a small `bgCache` helper (serve last snapshot instantly, refresh in a background goroutine, 30s TTL) so a cold cache returns the empty fallback and the tab fills in on the next poll; the same PR also mounts the full tp-viz `/api/*` set the visualizer bundle fetches.

### Skywire: Clearnet and Mesh Browsing, Reliable

**`3935`** fixes a body corruption that affected every browser POST through the in-tab visor: `jsFetchDmsg`/`jsFetchClearnet` read the request body with `[]byte(args[3].String())`, but the browse responder passes it as a `Uint8Array`, and `syscall/js` `Value.String()` on a non-string returns the literal `"<object>"` — so a POST of `x=42&y=sky` arrived at the server as the 8 bytes `<object>`. **`3936`** stops clearnet dials failing on a transient route-init collision: a "noise route group already being initialized" error from `DialRoutes` was treated as an exit failure and marked a healthy exit dead, when it only means a concurrent dial to the same exit is mid-handshake and this one is rejected until the first lands. **`3939`** fixes a runtime wedge where `EnsureBestTransport`'s dmsg-relay last resort created a new relay transport per exit that accumulated unbounded — `types.DMSG` in the skip set now opts out of the last resort so a failed direct dial routes multihop over existing entry transports — and adds a more verbose browse interstitial.

### Skywire: Transport — Fewer Goroutines, No Half-Open Leak

**`3940`** gives WebRTC PeerConnections an empty `MediaEngine`. skywire uses WebRTC for data channels only, but the default pion MediaEngine registers audio/video codecs and spawns SRTP/SRTCP and RTP/RTCP media-processor goroutines per connection (~4-5 parked each, hundreds on a busy exit — an ARM board could carry 1000+); a codec-free MediaEngine suppresses all of it, since SCTP data channels need no media codecs. **`3933`** reaps half-open links whose ping writes persistently fail: a hub visor had accumulated thousands of inbound transports its own TPD view did not have (observed live: 1523 local, 1477 inbound, vs ~111 in discovery) because an asymmetric half-open link — peer still sends, our writes fail — fell into a gap between the two liveness reapers and was never removed.

### Skywire: CXO Goes Live, CLI Gains Filters

**`3932`** replaces the CXO subscription's 5-minute poll with a persistent live subscription: `cycleLoop` had kept a subscriber only long enough to grab the first Root, snapshotted it, closed, and slept the full interval — so held feeds were up to five minutes stale — and now one subscriber stays connected for as long as the feed is held, re-walking the snapshot on every Root the publisher pushes. It is both snappier and lighter on the publisher (one dial instead of a re-dial per tick). **`3934`** hangs two output post-processors off the CLI's existing `PrintOutput` chokepoint so all ~40 JSON-emitting commands get them for free: `--jq <filter>` runs the value through the already-vendored gojq before printing (implies `--json`), and `--shape` prints the output type's zero-value skeleton so you can learn a command's schema without parsing a live response, with `--help --json` working on both binaries.

### Skywire: Housekeeping

**`3937`** makes the in-memory log `RingBuffer` a zero-alloc fixed circular buffer — it had grown its slice with `append` and re-sliced to cap on every `Write`, reallocating the whole default 256 KB buffer roughly every `max` bytes and showing up as a top live allocation site on a busy dmsg-discovery — now writing in place and copying only at read time, allocation-free in steady state with behavior preserved. **`3938`** corrects a misspelling to unblock the CI lint, and **`3931`** regenerates the embedded wasm-visor blob from a clean tree.
