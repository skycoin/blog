+++
date = "2026-10-05"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 5, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The fifth of October was a lighter day, split between hardening and the browser desk. Two holes in what services accept were closed: the hypervisor's wallet proxy had been answering without a session and could be made to fetch any URL on the visor's behalf, and the deployment services read request bodies of any size. A QUIC session to a dmsg server was found running out of streams for good after sixteen thousand of them, because closing a stream only ever closed half of it. In the desk, a second tab no longer starts a second visor with the same key, the deep links that open a chat or a site came back, the dashboard's chat went live inside the tab, and a crashed visor in a tab stopped holding on to half a gigabyte of memory until reload.

### Skywire: Two Services That Accepted Too Much

**`5417`** found that with `enable_auth` on, the hypervisor's `/wallet/coin/<idx>/` routes answered without a session. The caller picks the wallet's backend through a request header, so anyone who could reach the hypervisor port could make the visor fetch any URL, loopback addresses included, and read the reply. The route had been mounted outside the authorization group; it now gets the same middleware as the hypervisor's other routes outside `/api`, while the static cipher files stay public, and a new test fails before the change and passes after it.

**`5418`** capped request bodies across the deployment services, which had read them with no size limit at all. The auth middleware buffers a whole body before it checks the signature, behind a public nonce, and the route finder and the dmsg discovery batch lookup read unbounded bodies with no auth, so a single large POST was enough to spike a service's heap. A shared limiter now caps bodies once at each service's root router, at 8 MiB for transport discovery and 1 MiB elsewhere, sized from transport discovery's largest real body, a registration from the busiest visor at about 1.3 MiB. Oversize bodies get a 413, and the batch lookup rejects more than a thousand keys with a 400.

### Skywire: A QUIC Stream That Only Closed Half Way

**`5415`** found a QUIC session to a production dmsg server that had stopped opening new streams: every dial through it waited out the ten-second open timeout while its existing streams kept working, so the session reaper saw it as healthy and kept it. Closing a quic-go stream ends only its send side, and a stream frees its slot under the peer's incoming stream limit only once both sides are done, so a busy session ran out after 16,384 streams in total over its life. Closing now drains to the peer's FIN, bounded by a timeout, and then cancels the read side. The new test lowers the limit to twenty and dials two hundred streams one after another, and without the fix it fails at stream twenty.

### Skywire: One Desk Per Origin, and the Links Are Back

**`5416`** stopped a second desk tab from starting a second visor with the same key, which each tab did because each runs its own worker. The tab holding a Web Lock is now the desk; other tabs load nothing, show a notice with a "Use here" button, and forward their link to the live tab. "Use here" halts the live visor and moves the lock over, and closing the live tab hands it on too. The same change restored the deep links that went away with the old boot page: `?skydm=` opens the dashboard chat with that recipient and `?skynet=` with `kiosk=1` opens a site maximized. With two tabs open, the second stayed inert, its chat link opened the chat in the first and a message from it reached a native visor's skychat, "Use here" took about 24 seconds, and closing the live tab handed over in about 12.

**`5419`** filled three skychat gaps found while restoring those links. The dashboard chat in the desk showed "Disconnected" and could not send, because it built its URLs from the origin root, which misses a visor served under `/vnet/<port>/`, and bottle's vnet service worker returned responses whole, so the live stream never arrived; the chat now resolves against the document's base URI and the bottle fork streams response bodies. `skywire cli skychat` failed against a skychat run with `--portless`, so the visor RPC now carries the same buffered proxy the hypervisor uses, and the CLI goes through it when nothing listens on its address or when it is pointed at another visor; `listen` and `events` still need a port and say so. `?skygroup=` links are back as well, opening the chat's rooms with the join panel filled in, while joining stays a click. In the desk the chat showed Connected and a reply from a native visor appeared in about two seconds.

### Skywire: A Crashed Tab Visor Lets Go of Its Memory

**`5414`** found that a visor which crashed in a browser tab kept its wasm memory, about half a gigabyte each, until the page was reloaded, because its leftover JS callbacks kept the Go object reachable and that object pins the memory buffer. One long-running desk tab held two of them, for a 2.3 GB footprint. The bottle fork now drops those references when a program exits, and a Node test with a program that leaves a callback registered shows the memory collected only with the change. **`5413`** fixed the tab visor dying twice with "call of Value.Get on undefined" when a WebTransport promise rejected with no reason and the handler read `.message` from it; the message is now read only from an object, the same pattern in the pty exec and desk command handlers was fixed too, and a js/wasm test covers a rejection with undefined.

### Skycoin: Bitcoin On by Default in the Wallet

A visor writes skycoin-web's arguments into its config once and keeps them on every regeneration, so the electrum default passed as an argument on the fourth never reached any existing config. **`skycoin#3089`** made skycoin-web offer Bitcoin through its built-in electrum list when given no flag at all, with `none` turning Bitcoin off, and servers still contacted only on the first Bitcoin call. **`5412`** then stopped config generation passing the flag, and added a `SKYCOINWEBELECTRUM` variable in `skywire.conf` that sets it and also replaces it in kept arguments on regeneration. **`skycoin#3090`** sorted three files' bbolt imports for goimports, which the import move earlier in the wallet work had left out of order, turning the Linux and macOS lint lanes red.
