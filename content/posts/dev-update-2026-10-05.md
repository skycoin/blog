+++
date = "2026-10-05"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 5, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

October fifth completed the wallet-in-the-tab and skycoin-web integration that started on October second, made the browser desk a single-tab application that hands the Web Lock to another tab when needed, restored the group chat deep links that had vanished, and deployed Bitcoin support through the browser visor's proxy. The wallet now runs in-process on a browser visor, using its own wallet files and reaching a Bitcoin backend through electrum servers over the proxy. One live desk tab per origin is now enforced, with other tabs showing a notice and forwarding their links to the live one; the lock holder is handed over when another tab takes over or when the live tab closes. Service request bodies to deployment services are now capped to prevent heap exhaustion from oversized POSTs. A QUIC stream that closed only its send side left its slot occupied forever, causing the stream limit to wrap; it now drains to the peer's FIN before cancelling the read. A promise rejection with no reason stopped the wasm visor; undefined rejections are now handled gracefully. The browser visor's skychat now resolves against its actual base path and streams responses properly, and the portless CLI now works through the RPC.

### Skywire: Skycoin-Web in the Browser Tab

**`5410`** brought skycoin-web from a stub into the browser visor as an in-process app, serving from the dashboard and keeping its wallets in /opt/skywire/wallets. **`5411`** and **`5412`** set Bitcoin as the default, configured through electrum servers that failover and persist across reloads. The resolving proxy is passed to skycoin-web so Bitcoin queries go through the visor's exit, keeping the user's IP from the electrum server. **`5417`** moved the wallet proxy behind the session auth so only authenticated clients can make it fetch external URLs.

### Skycoin-Web: Bitcoin Support

**`skycoin#3084`** ported skycoin-web to js/wasm and let it run without opening a port, so skywire can embed it as a visor app. **`skycoin#3087`** added default electrum servers with failover, reaching them through a SOCKS5 proxy when provided. **`skycoin#3088`** added the Bitcoin health endpoint that the wallet checks. **`skycoin#3086`** made the node proxy work in a browser and made late nodes retryable, and **`skycoin#3085`** kept the proxy inside skycoin-web instead of setting it globally. **`skycoin#3089`** offers Bitcoin by default from the built-in server list. **`skycoin#3090`** sorted the imports for goimports.

### Skywire: One Live Desk Tab Per Origin

**`5416`** enforced one live desk tab per origin: only the tab that holds the Web Lock is the desk; other tabs load nothing, show a notice with "Use here", and forward their links to the live tab. "Use here" takes about 24 seconds, handing over the lock and the visor. Closing the live tab hands the lock to another tab if one is waiting. This prevents each tab from starting its own visor with the same key. The deep links `?skydm=<pk>` for chat and `?skynet=<site>&kiosk=1` for full-screen sites are restored.

### Skywire: Skychat and Chat Fixes

**`5419`** fixed three skychat gaps: the browser desk's chat now resolves against its actual base path and streams responses properly, the portless CLI works through the RPC using the buffered proxy the hypervisor already uses, and `?skygroup=<invite>` deep links are restored to open the join panel with the invite filled in.

### Skywire: Service Stability

**`5418`** capped service request bodies to prevent heap exhaustion: 8 megabytes for transport discovery and 1 megabyte elsewhere, with batched lookups rejecting more than 1000 keys.

**`5413`** handled promise rejections with undefined reasons, which had stopped the wasm visor with "call of Value.Get on undefined". The pty exec and desk command handlers had the same pattern.

**`5414`** freed memory on a visor crash in a browser tab: bottle now drops the wasm memory pointer on exit, so the garbage collector can reclaim about 500 megabytes per crashed instance.

### Skywire: QUIC Stream Lifecycle

**`5415`** fixed a QUIC stream closure that left its slot occupied under the stream limit. When a stream closed only the send side, the slot remained occupied until both sides were done; closing now drains to the peer's FIN before cancelling the read, so the slot is freed.

### Skywire: Configuration

**`5412`** ensured that skycoin-web keeps its own electrum default and respects the SKYCOINWEBELECTRUM override across autoconfig rebuilds.
