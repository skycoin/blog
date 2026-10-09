+++
date = "2026-10-08"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 8, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

October eighth completed the embedding of deployment services into host visors with stop, start and restart controls. A visor now serves its own signed reach card and resolved peers from their cards first, eliminating the address resolver as a bottleneck between any two visors. Route setup now sends cascades in parallel, and closes groups without waiting for a peer that never answered. Route calculations now build 3-hop routes from neighbors' own signed transport lists when the oracle has no answer, and crowded dialing spreads over all candidates instead of taking the same one repeatedly. The router's cascade process is now visible in visor state. Concurrent dials to the same peer and type now share a single transport instead of each opening its own. The wasm visor's route setup sessions no longer get disrupted by transport changes on the same path. A visor's HTTP services served over skynet no longer leak goroutines, and sudph and webrtc reads now use shared workers instead of dedicated reader goroutines. Every transport type but dmsg can now be carried by dmsgweb, and dmsgweb now reaches visors over a local visor's transport. A QUIC stream bridged by a dmsg server kept the handshake deadline, cutting responses at 5 seconds; it now stays open as needed. Transport discovery now archives settled metrics on disk, keeps two weeks of history in Redis, and runs cleanup soon after start. The CXO publisher's cleanup sweep now uses Next instead of Seek to avoid looking up every object. Charts now show service start times. The CLI's gRPC commands work in the browser tab, and the health check reads the built-in dmsg server list. Environment-set GOMEMLIMIT now wins over memory_limit, and configuration regeneration keeps explicit limits. A test race on darwin was fixed.

### Skywire: Embedded Deployment Services

**`5513`** brought deployment services into the visor as embedded services running under their own keys with their own dmsg clients. Each runs independently so a failing service does not take the visor down, and they restart with backoff. **`5517`** added setup-node, transport-setup, stun and conf-service as embedded services, so every host visor now runs them in-process. **`5515`** ensured embedded services start before the visor's own modules, preventing deadlocks when startup services depend on features the visor provides. **`5514`** added `cli visor services` to list them and `stop|start|restart` to control them without restarting the visor.

### Skywire: Configuration and Memory

**`5518`** kept memory_limit across config regeneration, so a host that pinned a limit for its embedded services does not see it reset to auto. **`5516`** let environment-set GOMEMLIMIT take precedence over memory_limit, which on production hosts with TPD, RF and AR embedded kept the heap too small and triggered GC every 0.75 seconds.

### Skywire: Peer Discovery from Reach Cards

**`5512`** made a visor serve its own signed reach card over dmsg and skynet, containing its resolver records and updated on network changes. Dialing code holds the cards two minutes and answers from them first, fetching new ones in the background, so the address resolver sits between fewer pairs of visors. The resolver is still asked when no card is held and still used for sudph which needs dial-back probes.

### Skywire: Route Setup and Cascades

**`5498`** sent a route's forward and reverse cascades in parallel instead of one after another, reducing the round trips from six to four. **`5499`** closed a route group the peer never answered without the 2-second wait. **`5489`** built 3-hop routes from neighbors' signed transport lists when the oracle has no answer, and **`5488`** made every visor serve its own signed transport list over transports. **`5490`** added cascade route setup counts to visor state, split by whether the setup node was reached over dmsg or a transport.

**`5495`** made crowded oracle dials rotate through candidates instead of taking the best one repeatedly, so mux legs to the exit spread over all available paths. **`5494`** ensured one dial per peer and type, so legs to the same exit share a single transport instead of each opening its own, with five concurrent datachannels then closing together.

**`5493`** kept route setups off sessions being replaced, preventing setup node RPC failures when sessions moved between transports.

### Skywire: Transport and Dmsg

**`5506`** made dmsgweb carry dmsg over any transport type except sudph and webrtc, and **`5505`** made dmsgweb reach visors over a local visor's transport, removing the need for every visor to have a dmsg server session. **`5504`** fixed a 5-second cutoff on QUIC-bridged responses: a dmsg server keeping QUIC streams past the handshake deadline now stays open as needed.

**`5502`** served sudph and webrtc reads from shared workers instead of dedicated reader goroutines, dramatically reducing threads under TinyGo.

**`5496`** switched to the 0magnet WebRTC fork to avoid goroutines for media machinery a data channel never uses and DTLS record watchers on every packet.

### Skywire: Visor and HTTP

**`5503`** fixed HTTP services served over skynet leaking goroutines by wrapping the connection so that closing it closes the listener, letting Serve return.

### Skywire: Routing and Observability

**`5491`** made the CLI's gRPC commands work in the browser tab by using a passthrough target and dialing through vnet.

### Skywire: Transport Discovery

**`5509`** archived settled metrics days on disk and kept two weeks in Redis instead of all of them, reducing memory usage. **`5510`** ran bandwidth cleanup soon after start instead of only on an hourly tick. **`5511`** reduced the TTL of per-transport bandwidth labels from 35 days to 14 days to match the cleanup window.

**`5507`** marked each service start on the status pages so restarts are visible.

### Skywire: Store and CXO

**`5508`** optimized the CXO publisher's cleanup sweep to walk with Next instead of Seek, avoiding a tree lookup for every object on a 2.4-gigabyte store.

### Skywire: Tests and CI

**`5500`** fixed a darwin race in the stream census test by waiting for the peer to be reachable. **`5501`** fixed the deployment health check to read the built-in dmsg server list instead of fetching from the public discovery endpoint, which now serves only charts. **`5497`** fixed the dmsgweb home page test to check a TPD endpoint that is still served.

### Skywire: Charts

**`5492`** moved to one legend beside the pie on every chart, listing every series with its value and share, removing the plot legend.
