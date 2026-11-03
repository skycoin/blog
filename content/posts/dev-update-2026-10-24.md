+++
date = "2026-10-24"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 24, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The twenty-fourth of October was about visors that share one home network, and it ended in the v1.3.103 release. An operator with eight visors behind one router saw game pings jump from 50 ms to 700 ms, and got worse with each visor online. Two changes answer that: maintenance pings are now spread over their interval instead of leaving in a burst, and autoconnect keeps only a couple of transports between two sites instead of one per pair of visors. A small write on a busy TCP transport also no longer waits behind everything the kernel has queued, a `.skynet` name can now pick its transport, and native TinyGo visors load the static deployment again.

### Skywire: One Router, Many Visors

Every 60 seconds the maintenance loop pinged all transports at once, and every 20 seconds all sudph ones, so a visor sent a burst of a few hundred packets to as many addresses. **`5804`** gives each transport a slot in the interval from a hash of its ID, and a one second tick pings only the transports that are due. Each transport keeps its 60 second ping and 20 second sudph keepalive. Sampling UDP output every 100 ms on a visor with about 1,450 transports, the largest burst fell from 763 packets to 119 and the 99th percentile from 258 to 82, while the average stayed about the same.

Autoconnect dialed sudph to every reachable non-public visor. With about 900 visors on about 300 public addresses, two multi-visor sites held up to 64 transports between them through the same two NATs, and one operator had 2,967 transports from a single address. **`5805`** treats the visors behind one public address that share a LAN subnet as a site, using the address resolver's bindings feed, so visors behind one carrier NAT stay apart. Between two sites autoconnect now keeps `site_links` links (two by default) for the types in `site_types` (sudph by default). It picks the member pairs with the lowest hash of the two keys, so both ends agree and the links spread over each site. Visors in the same site are not limited.

The same change moves the squicr, swsr, swtr and webrtc caps from constants to `transport.autoconnect.max_per_type`, plus a `max_total`, and the caps count only transports this visor dialed. They are live through `config set`, and `visor state` reports the sites. On a live visor the feed grouped 1,831 visors into 740 sites, 216 of them with more than one visor, and a visor in a 15-member home site would dial 121 of its 464 sudph peers directly.

### Skywire: Small Writes on Busy Transports

A small write on a busy stcpr transport waited behind everything the kernel held for the socket. To one of the deployment servers, a tiny request that takes 0.40 seconds when idle took up to 1.6 seconds during a 4 second download, and a long transfer once queued for 22 seconds and dropped the web pty. **`5811`** sets `TCP_NOTSENT_LOWAT` on TCP transports, 128 KiB by default and live as `transport.tcp_notsent_lowat`, on Linux and Android. It also fixes connections accepted on the shared transport port getting no TCP tuning at all, `TCP_NODELAY` included, because the port multiplexer wrapped them.

That same 22 second queue sat on an stcpr transport while a squicr transport to the same server answered in 200 ms, and a `.skynet` name had no way to choose between them. **`5803`** lets `<tpid>.<pk>.skynet` open the direct stream on that one transport, with no fallback, and skydns gives a pinned name its own address and passes the labels to the resolving proxy. The request log now names the transport type and ID for direct, pinned and relayed dials. Through skydns, a plain name, a name pinned to squicr and one pinned to stcpr each moved a 2.3 MB download over the expected transport, and a pin to a transport that was down failed without falling back.

### Skywire: TinyGo, Dependencies and v1.3.103

A native TinyGo visor started with an empty built-in deployment. The static deployment files carried a TinyGo build tag, but their `_js` file suffix also limited them to the browser, so no init ran. The visor then seeded only the services in its own config, and every dmsg request to the discovery failed with "circular lookup" about 20 times a minute. **`5802`** renames the files so both TinyGo targets load them.

**`5806`** updated dependencies, including websh, which now keeps background jobs alive through the sh fork's merge of upstream's job model. gvisor and go-fuse stay pinned, because the newest gvisor lacks its generated files and go-fuse v2.12 does not build on 32-bit. That bump raised the go directive to 1.27.3 although nothing needed more than 1.27.2, which broke the docker deploy, and **`5807`** set it back. **`5809`** moved visorconfig from a sysinfo fork to upstream v1.2.1, which now carries the fork's ARM CPU parsing and also fills in the product name on ARM boards, one of the survey fields the reward statistics read. **`5810`** fixed the import order it left behind. **`5808`** is the v1.3.103 release, with the changelog for **`5800`** to **`5807`**.
