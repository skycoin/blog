+++
date = "2026-10-06"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 6, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

October sixth focused on visibility and observability across every deployment service, bringing charts pages and time-series storage to all of them. Transport discovery gained a WebGL graph rendering engine for its topology, and serves time-series data for transports, visor versions and daily bandwidth. The address resolver and route finder each gained a charts page with their own data. Dmsg-discovery publishes registered and LAN servers on a CXO feed so every visor can follow the server list without fetching it every five minutes. The transport discovery now holds transports correctly when both edges republish at different times, and retries re-registering transports whose entries were deleted. The route finder's hops now carry type and throughput so dialing code no longer needs to fetch the entire transport graph. Android gained full SkyDNS support for every app, allowing any program to open .dmsg and .skynet names natively, while the wallet now lets users change the Bitcoin and Ethereum backends, and the settings let users change the DNS server. The Android build removed the desktop's prebuilt files to pass F-Droid's binary scanner, and fixed call screen permission detection and the recipe's Binaries line parsing. A CXO schema kind encoding bug meant TinyGo subscribers saw corrupted schemas; kinds now use Go's numbering on the wire. A log level endpoint was added for whitelisted keys to raise the log level temporarily while reproducing a problem. Transport discovery fixed a long-standing bug where local DNS dmsg servers were exposed to every skynet peer. Time zone awareness was added to all charts pages.

### Skywire: Charts and Visibility

**`5430`** brought time-series history to transport discovery and dmsg-discovery, sampled every five minutes and stored for 8 days raw and 400 days of hourly aggregates in Redis. Each service now serves a charts page at `/` with SVG graphs and a table view. **`5434`** added visors by transport count, daily latency per type, and the top 25 visors by bandwidth for the previous day. **`5439`** added a transport graph page at `/graph` for each visor pair joined by a transport. **`5440`** renders that graph with a WebGL engine that keeps main-thread lag under 4 milliseconds even on the live network's 1,122 visors and 98,953 links, where a 2D canvas would freeze the browser for minutes. **`5443`** marks which visors run registered dmsg servers and which run LAN servers on both the table and the graph.

**`5438`** added a charts page to the address resolver showing visors bound per transport type and the reachability results of its dial-back probes. **`5437`** added a charts page to service discovery showing services by type, VPN and proxy servers by country, and the versions services report. **`5435`** added a charts page to the route finder showing route requests, success rates, latencies and failures, and reading each route setup node's own `/stats` aggregate for the stats of multi-hop paths.

**`5436`** added a donut beside each stacked chart showing every series' share at the latest point, which follows the cursor on hover and pins until clicked. Each page now fetches itself once a minute while visible and swaps in new content.

**`5433`** separated registered and LAN dmsg servers on the dmsg-discovery charts page, showing each group separately with distinct colors and a table view.

**`5444`** shows all times in the viewer's time zone rather than UTC, with the axes redrawn on local hour, day and month boundaries.

### Skywire: Dmsg Server Discovery Feed

**`5446`** made dmsg-discovery publish each registered server on a CXO feed at `clients-by-server/servers/<pk>`, reconciled once a minute. Every visor can now follow that feed instead of fetching the server list over HTTP every five minutes, which across the network added up to about four requests a second for a list that rarely changed. The visor's cache refresh reads the leaves directly and falls back to HTTP only when the feed has no servers.

### Skywire: CXO and Transport Discovery

**`5445`** fixed a schema encoding bug that broke TinyGo subscribers: a `reflect.Kind` went on the wire as its raw number, and TinyGo numbers kinds differently than Go. The wire now uses Go's numbering through a fixed table, translated at encode and decode. TinyGo subscribers to a Go publisher's feeds now fill roots correctly.

**`5429`** fixed a long-standing bug where one edge of a transport omitting it from its snapshot would delete it even though the other edge still listed it, so on production about 5% of dmsg sudph transports left and came back every minute. The throttle now only deletes a transport once neither edge has listed it within the refresh gap.

**`5428`** fixed entries that were deleted outside the CXO reconcile never being re-registered: an omission from a refresh `EXPIRE` succeeded without checking whether the key was gone, so the mark was renewed but the entry stayed missing until TPD restarted. `TouchTransports` now returns ids whose keys are gone, and the reconcile re-registers them in the same pass.

### Skywire: Routing and Visor Features

**`5427`** made the route finder return each hop's type and throughput alongside latency, so dialing code no longer fetches the entire transport graph just to rank a found route. Mixed versions interoperate since both fields are optional.

**`5441`** added `/debug/loglevel` on the survey-whitelisted surface so whitelisted keys can raise the log level temporarily while reproducing a problem, with a time-to-live and automatic revert. **`5447`** made the `cli log level` command honour `--json` output.

**`5442`** removed the unauthenticated localhost log server from the allowed ports that skip the whitelist check, which had let any skynet peer read debug endpoints without being on `survey_whitelist`. The localhost listener stays for local tools.

### Skywire: Android and SkyDNS

**`5421`** brought SkyDNS to every app on the phone, not only proxied browsers. A new skydns app takes a tunnel that routes only 198.18.0.0/15, and mesh names get a synthetic IP through the mesh gateway. Other names go to the phone's own resolver or 1.1.1.1 over DNS-over-TLS. **`5426`** extended the same DNS support to Linux desktops using systemd-resolved or a modified resolv.conf.

**`5425`** made the wallet's node configurable for every coin, not just Skycoin and Fiber coins. Bitcoin now takes an Esplora API, and the Ethereum family has separate fields for the balance and indexer nodes. Settings gained a DNS server card that pins a chosen server into the VPN and SkyDNS apps. SkyDNS on its own now uses the phone's own resolver instead of hardcoding 1.1.1.1. **`5422`** fixed the call screen permission detection and spacing in the Settings UI.

**`5424`** moved the browse jar to a separate file built without the `mobile` tag, removing the public suffix tables and skycoin-lite wasm from the mobile build. F-Droid's binary scanner had blocked the mobile releases because these files were no longer needed there.

**`5423`** fixed the F-Droid recipe's sed command that removes `Binaries:` from folded lines; the orphaned URL was then parsed as the rest of `Repo`, causing `fdroid build` to fail with an unsupported protocol.

### Skywire: Build and Testing

**`5432`** serialized the address-resolver and dmsg-discovery redis store test packages so they do not flush the database in the middle of each other's tests.
