+++
date = "2026-09-02"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — September 2, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The whole skywire binary runs in a browser tab now. Not a trimmed edge build — the full command tree, compiled to wasm, running `skywire autoconfig` in a terminal, booting a foreground visor that joins the P2P transport mesh, and serving its own hypervisor UI to a nested browser on the same page. By the end of the day that visor forms WebTransport transports like a native peer, renders the hypervisor UI natively through a service worker, and chains its proxies by default so any tab of the nested browser browses through the mesh. A try-it-now playground is live on the docs site at skycoin.github.io/skywire/playground.

### Skywire: The Whole Binary in the Browser

**`4404`** is the substrate. The entire root binary compiles to wasm with no vendor edits — dependencies that needed a browser platform layer became proper forks imported by their own module paths, and the TUI machinery is split at file level so the command tree stays single-sourced. Around the binary, an OS layer: an in-memory Linux-layout filesystem (skywire "installed" at /opt/skywire, an /etc/skywire.conf exactly as the Linux packages ship it), a virtual loopback network so separate wasm instances — visor, CLI, apps — share one localhost and speak the real RPC protocol across it, and a terminal whose `skywire` command executes the real binary per invocation with argv, environment, exit codes and Ctrl+C. The Linux ritual works unchanged in the tab: `autoconfig` generates a config and starts a foreground visor, `cli visor pk` dials it, `cli proxy start` puts SOCKS5 on the loopback's :1080, `curl -x` fetches through the mesh. The playground page on the docs site opens to a terminal that has just run `skywire --help`.

### Skywire: The Converged Desk

**`4405`** assembles the desk page: a terminal auto-running `skywire autoconfig`, a second for the CLI, and the nested browser opening the hypervisor UI from the virtual loopback — with native-parity help colors and log colors, and interrupts delivered into wasm command instances so a foreground visor shuts down on Ctrl+C exactly as on SIGINT. The session persists across reloads: same visor identity, same config, and a visor the operator deliberately stopped stays stopped. **`4408`** fixes what persistence surfaced — a stop-verdict recorded during boot, database files snapshotted mid-write, and autoconfig silently disabling an implicitly enabled hypervisor on regen (a footgun on native too, now fixed there as well). **`4415`** then gives the desk tabs: the browser window becomes a tab strip of full browser panes, the terminal window likewise, and the desk boots to two windows — terminal tabs plus a browser with the hypervisor UI active and the mesh pages in background tabs.

### Skywire: The Hypervisor UI, Rendered Natively

The nested browser had rendered pages through a transcoder, which cannot express a module graph — the Angular UI polled its API but painted nothing. **`4408`**'s vnet service worker turns virtual-loopback ports into real same-origin URLs (`/vnet/<port>/…`) forwarded to the page's port table, so loopback windows load unsandboxed and the full single-page app — chunk imports, XHR, the router — runs natively in the nested browser.

### Skywire: WebTransport From the Tab, and a Router Fix

**`4414`** restores swtr for browser visors: an autoconnect phase dials WebTransport (then WebSocket) to public visors that lack any direct transport, the browser WT dial resolves a peer's endpoint and certificate hash from the address resolver exactly like native, and dmsg carriers default to WebTransport-first with a converge ticker upgrading bootstrap wss sessions to wt. Validated live in the desk: a swtr transport up, most dmsg sessions on WebTransport. Two follow-ups tighten it: **`4424`** makes the converge ticker dial only the carrier it wants rather than churning through fallbacks, and **`4425`** gates the WebSocket autoconnect phase on the page protocol. **`4413`** fixes the router's `--direct` on-demand transport creation to use the host-aware type order — a browser visor now tries the transports it can actually create instead of failing two hardcoded ones and settling for a dmsg relay, and native gains the fuller order on that path too.

### Skywire: The Proxy Chain, On by Default

With **`4415`**, browser visors generate configs with the resolving proxies enabled and chained on the virtual loopback — dmsgweb on :4445 into skynetweb on :4446 into the SOCKS5 client on :1080 — and the proxy client picks its exit automatically from service discovery instead of crash-looping without a pinned server. A cold desk boot has the full chain listening in under half a minute.

### Skywire: Overview Truth and CI Toolchains

**`4412`** has the Overview report the public IP observed by a connected dmsg server, with STUN as fallback — so a visor on a UDP-blocked network shows its address instead of a NAT failure label — and labels the hypervisor badge with the serving visor's architecture; with **`4414`** suppressing the meaningless js hostname, browser visors get sensible IP-based default labels. On CI, **`4417`** through **`4420`** fix the test failures peculiar to loaded runners, and **`4422`** points the workflows at latest toolchains — Go stable, TinyGo 0.42.0, golangci-lint latest — and folds the routing-policy bundle into the main module, dropping its replace directive and moving the unsafe wasi ABI behind the tinygo build tag. **`4421`**, **`4407`** and the routine wasm blob refreshes ride along.
