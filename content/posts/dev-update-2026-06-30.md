+++
date = "2026-06-30"
tags = ["Development", "Skywire"]
title = "Development Update — June 30"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The theme today was cutting external dependencies out of the transport layer. dmsg gained the ability to serve secure WebSockets itself, obtaining its own certificate via Let's Encrypt, so a dmsg server no longer needs a Caddy reverse proxy in front of it to reach browsers. WebTransport was folded onto the same unified transport port as the QUIC-based transport, and the hypervisor mini-desktop got a real window manager.

### Skywire: Built-In Secure WebSockets

**`3356`** feat(dmsg): optional built-in wss via Let's Encrypt autocert (no Caddy required) lets a dmsg server terminate secure WebSockets on its own. Browsers on HTTPS pages can only open `wss://` connections, and dmsg servers previously spoke plain WebSocket — so reaching them from a browser meant standing up Caddy (or another reverse proxy) in front of each server just to add TLS. This wires an autocert manager directly into the dmsg server: it obtains and renews a Let's Encrypt certificate itself and serves `wss://` natively, removing the reverse proxy from the deployment entirely.

**`3355`** feat(dmsg): wss_domain_suffix in services-config.json — one source for the fleet wss domain supports that by putting the fleet's wss domain in the services config as a single field. Each server derives its own `wss://` hostname from the shared suffix rather than every server carrying its full domain independently, so the fleet's browser-reachable domain is described in one place.

### Skywire: One Transport Port

**`3354`** fix(transport): WebTransport rides the unified transport_port (ALPN-muxed with squicr) collapses two listeners into one. WebTransport and the QUIC-based `squicr` transport both run over QUIC, so instead of binding a separate port for WebTransport it now shares the single `transport_port`, with ALPN distinguishing the two on the same listener. One open port instead of two, and one less thing to configure and firewall.

### Skywire: A Window Manager for the Mini-Desktop

**`3353`** feat(hv-ui): WinBox window manager for the mini-desktop (browse/terminal/log/cli) turns the collection of hypervisor tool windows into a proper desktop. The browse, terminal, log, and CLI windows are now managed by WinBox — draggable, resizable, minimizable, with real stacking — so several tools can be open and arranged at once rather than fighting over a fixed layout.
