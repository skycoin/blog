+++
date = "2026-06-03"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — June 3, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A day about taking plain HTTP off the critical path. With the overlay's reliability and egress now in good shape, the default generated config drops the plain-HTTP service-discovery fallback — services are reached over the peer-to-peer overlay (dmsg today, skynet transports by design). Plain HTTP now survives only as a compatibility shim for custom deployments; on the public network it's headed for the door entirely. Getting there safely meant draining "ghost" transports at the source, cutting the transport-discovery's egress with gzip + caching, and bounding a runaway CXO goroutine spawn. Plus the Windows installer is fixed and v1.3.64 is prepared.

### Skywire: Drop the Plain-HTTP Fallback by Default

Skywire's services — service discovery, transport discovery, the address resolver — have always been reachable two ways: over plain HTTP, and over the overlay. The default config carried both, with HTTP as a fallback. That fallback made sense when the overlay path was less proven; it makes less sense now that it is.

**`2983` feat(cli/config): generate dmsg-only config by default; add --dual flag** — `config gen` now generates a config *without the plain-HTTP fallback* by default: services are reached over the overlay (dmsg today, and skynet transports by design), with `--dual` to restore the http+overlay fallback config and `--http` to generate an http-only config for environments that need it. This is a pivot *away from depending on plain HTTP* — not a narrowing of the transport story. Everything reachable over dmsg is meant to be reachable over skywire's own p2p transports too; the change is about which path the default trusts.

Where this is headed is worth stating plainly. The plain-HTTP path now survives only as a **compatibility shim for custom and self-hosted deployments** — not as a direction. On the public skywire network the intent is to retire it outright: the plain-HTTP *write* path — services registering and updating their records over HTTP — is slated to be dropped by the end of June, and the *read* path after that. Once both are gone, skywire's deployment services are reachable **only over the encrypted, key-addressed overlay** — invisible to a plain HTTP client. The infrastructure itself moves off the clearnet. There's a fair way to characterize that as the network becoming more of a *darknet* — not in the sense of what it carries, but in the structural sense that you have to be *on* the network, speaking its transport, to even see that its services exist.

Making that default safe required hardening the no-HTTP-fallback path:

**`2981` fix(dmsg/disc): empty discovery URL → no-op client (no invalid-host retry spin)** + **`2982` fix(visor/servicedisc): service-discovery dmsg fallback + nil-client guards** + **`2985` fix(visor/autoconnect): don't re-default dropped service_discovery to prod HTTP** — three fixes so a config that omits an HTTP discovery URL behaves correctly: an empty URL yields a no-op client instead of an invalid-host retry spin, service-discovery falls back to its dmsg URL with nil-client guards (so a dropped HTTP URL doesn't panic the visor at startup), and public-autoconnect stops silently re-substituting the hardcoded prod HTTP endpoint when the field is dropped. A dropped field is an intentional choice, and the code now treats it as one.

### Skywire: Drain the Ghost Transports

A long-standing reliability problem: a transport to a visor that has gone offline could stay *routable* in the transport-discovery, because the still-live edge kept re-registering it. The route-setup node would then try to build routes through a dead intermediate and fail.

**`2979` fix(transport): detect half-open links via missed transport pongs** + **`2980` fix(tpd): drain ghost transports (per-edge-TTL) + cache/gzip /all-transports egress storm** — visors now detect a half-open link by missed transport pongs (so the live edge stops insisting a dead peer is reachable), and the transport-discovery expires each edge's transport set on its own TTL rather than refreshing both edges whenever either one checks in. Together they drain the ghosts at the source. #2980 also tackles the dominant egress cost: the `/all-transports` endpoint is served from a cached, pre-gzipped body instead of re-marshaling and re-sending a multi-megabyte payload per call.

### Skywire: Transport-Discovery Egress + CPU

**`2986` fix(dmsghttp): advertise Accept-Encoding: gzip + transparent decompress** — the dmsg-http client (the path the overlay uses to reach services) advertises `Accept-Encoding: gzip` and transparently decompresses, so overlay service reads compress the way clearnet ones already did. With the default config now favoring that path, this matters network-wide.

**`2987` fix(tpd): cache /transports/edge:<PK> response body + gzip** — the second-busiest transport-discovery read gets the same cached-and-gzipped treatment as `/all-transports`.

**`2988` fix(cxo): bound Filler goroutines — populate MaxFillingParallel + sane fallback** — the CXO `Filler` was spawning thousands of parked goroutines because a `MaxFillingParallel` default was never populated, falling back to a magic 1024 per filler. Populating it (and dropping the fallback to the documented default) bounds the spawn.

**`2984` feat(cipher,dmsg/noise,cmdutil): instrument the verify / DH caches + /debug/cache endpoint** — instrumentation for the signature-verify and Diffie-Hellman caches, exposed through a `/debug/cache` endpoint, so the cost of the cryptographic hot paths can be measured rather than guessed at.

### Skywire: Windows Installer + Release

**`2989` fix(release): stage skywire-autoconfig.bat for the Windows MSI build** — the MSI build had been failing since v1.3.62 (a `Product.wxs` file reference added in the install-time config work was never staged in the release workflow), so two releases shipped with no Windows artifacts. Staging the file fixes the build.

**`2991` chore(changelog): v1.3.64; publish release without draft gate** — v1.3.64 is prepared, and the release workflow is changed to publish immediately rather than create-as-draft-and-publish-when-every-job-succeeds (the draft gate is what stranded the previous releases as drafts when the Windows job failed).

### Skywire: Misc

- A reward-calculation parameter adjustment for June (`2990`).
