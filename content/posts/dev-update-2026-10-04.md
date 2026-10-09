+++
date = "2026-10-04"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 4, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

October fourth saw the release of v1.3.99 and a major rebuild of the dashboard and browser visor. The mail system graduated from a desk-only feature to a full dashboard tab with read, compose, attachments and settings, working on both native and browser visors. The browser visor gained interactive PTY sessions through websh, replacing the refusal it gave before. The dashboard's Terminal tab started working in browser visors, and the desk's tour was refactored to show the newly integrated menu and mail. A visor's deployment services can now be followed live from a CXO feed, the router's RSN-oracle 2-hop path is now always on, and skysocks no longer races when a route leaves or joins mid-object. The browser visor can now forward ports to and from its vnet, and a single proxy port can answer both mesh and clearnet names at once. The native e2e tests no longer depend on dmsg route setup, and a real Windows TUN bug was found and fixed. The module was shrunk by twenty percent and moved to Go 1.27, and the dependency tree was brought forward across the board. Finally, a fleet visor stuck in a bbolt cursor loop that ate 1.4 gigabytes of heap was fixed, and the project README was restructured with comparisons to other overlay networks and a table of capabilities.

### Skywire: Mail in the Dashboard and Desktop Tour Revision

**`5402`** brought the mailbox from the desk and CLI into the hypervisor dashboard, adding a Mail tab beside Chat. The dashboard now serves the visor mail API at `/api/visors/{pk}/mail`, which works for remote visors too, with read, compose, attachments, delete, whitelist and settings all accessible through the dashboard's mail interface. **`5404`** marked the async views so the OnPush detector works correctly on mobile builds, and **`5405`** brought the Terminal tab online for browser visors: the PTY UI now accepts WebSocket upgrades through a small wrapper that handles coder/websocket natively and bottle's vnet WebSocket over js, with the shell seeing the visor's own filesystem.

**`5409`** refactored the desk tour to show the menu, exit IP and dashboard, with the browser step opening ip.skycoin.com and the browser opening the dashboard in a new tab. The last step hands off to the dashboard's own tour, which gained Mail and Terminal steps and now shows the desk's wasm hypervisor inside itself.

### Skywire: Interactive Shell in a Browser Visor

**`5396`** gave the browser visor an interactive PTY session over websh, replacing the refusal it gave before. The remote terminal's input goes to websh's line editor or the running command's stdin, and the shell sees the visor's filesystem and can run skywire commands on the page's process layer. The websh dependency was bumped for head and tail with counts.

### Skywire: Vnet Bridges and Port Forwarding

**`5394`** made skynet forwarding and the `serve add` command work on browser visors by routing them through bottle's vnet loopback instead of net.Listen and net.Dial, which never touch the page. A port served or forwarded now works identically in both native and browser visors.

**`5403`** fixed a /vnet/ page surviving a hard reload: the :8443 server and the native hypervisor's desk now answer /vnet/ with a small page that reloads once through the worker, or says to open the desk if no worker is registered.

**`5395`** raised the vnet worker's per-request timeout from 8 seconds to 35 seconds so slow API calls like the hypervisor's visors-tree-summary would not get a 504.

### Skywire: Proxy Consolidation

**`5388`** eliminated the need for a browser to configure separate proxies for the clearnet and the mesh. One resolving proxy now publishes itself as a LOCAL SERVICE that skysocks-client reaches in-process over net.Pipe, and the client hands matching mesh names straight there without an extra SOCKS handshake, so one browser proxy setting covers both.

### Skywire: Routes and Spread-Cut

**`5378`** made the RSN-oracle 2-hop route path always on, no longer conditional on a setting. **`5389`** fixed spread-cut sometimes finishing with one route stuck at 50% against a lower cap, caused by a race during standby promotion; the cap is now re-read even when a pick promoted nothing, and held against every byte the object has placed.

### Skywire: The Wisp Module Extracted

**`5393`** moved pkg/wisp to its own module at github.com/0magnet/wisp and updated skywire's wisp command and embedded server to import from there. A new `Logger.Slog()` method lets the embedded visor pass skywire's loggers in to the wisp module.

### Skywire: Visor State and Configuration

**`5376`** made the visor follow its deployment services configuration live from a CXO feed rather than loading it once at startup, so changes propagate without a restart. **`5352`** ensured that autoconfig-controlled fields survive an autoconfig rebuild.

### Skywire: Browser and Native Visor Builds

**`5377`** shrunk the js/wasm module by twenty percent through aggressive dead-code elimination and struct layout optimizations. **`5374`** moved the entire project to Go 1.27. **`5407`** fixed the Android build budget failure by moving the embedded deployment services to a file built only without the mobile tag, saving 3.9 megabytes; a phone never runs them.

### Skywire: Dependencies

**`5401`** picked up a fix to 0magnet/bbolt so NoSync is now honoured on js, and bumped websh. **`5398`** moved the 0magnet modules forward: metrics, gotop, sh and wisp to their latest commits. **`5390`** included a critical fix in the 0magnet/bbolt fork: a cursor that cycles through a self-referencing corrupt page now panics after 64 levels instead of eating all available heap, allowing a stuck visor to start again. This fix picked up on visors in the fleet that had been wedged and unable to start. **`5379`** sized transport discovery's routing PutBatch for the puts only.

### Skywire: Documentation and Project Comparison

**`5406`** added a comparison showing which Skywire to run — native, in a browser tab or on Android — with a matrix of capabilities including transports, inbound links, exits, VPN, browsing mesh sites, apps, PTY, dashboard, desk, wallet, background running and rewards. **`5380`** and **`5381`** added two new comparison tables in the README showing how Skywire's design borrows from other projects like BitTorrent and Google's BBR, and how it stacks against other overlay networks in terms of features and use cases. **`5382`** added more capability columns and a carriers table. **`5386`** restructured the whole README, splitting wide tables and refreshing the architecture graph and line counts. **`5392`** documented the design ideas Skywire took from other projects.

### Skywire: Performance and Testing

**`5385`** added a flight recorder to the visor that can be read through the CLI or exported for debugging, along with a goroutine leak profile endpoint. **`5384`** and **`5375`** ported tests to a fake clock so spread-cut and the router's stream benchmark run deterministically without requiring physical time to elapse. **`5372`** fixed a dmsg mutual peer test that was not properly synchronized.

**`5391`** rewrote the native e2e test suite to use a direct stcp transport instead of dmsg route setup, making the tests run in 46 seconds with no retries instead of over 200 seconds with multiple attempts. The Windows TUN wrapper was also fixed to report byte counts correctly, preventing false "short write" failures.

### Skywire: Release

**`5397`** released v1.3.99, with highlights including the bbolt cursor fix that unblocks stuck visors, the Windows VPN TUN short write, the yamux receive lock behind slow standby recovery, and the max_share race in route spreading.

**`5387`** bumped Angular Build to 22.2.1.

**`5371`** fixed the endgame test waiting for the duplicate it checks before validating correctness.
