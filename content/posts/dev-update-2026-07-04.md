+++
date = "2026-07-04"
tags = ["Development", "Skywire"]
title = "Development Update — July 4"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A big day with a single unifying idea running under most of it: stop telling services what to do one imperative call at a time, and instead publish desired state and let them reconcile. The transport registry moves from HTTP register/delete calls — which spammed the discovery service with 429s under churn and shutdown — to a declarative model where a visor publishes its transport list over CXO and the transport-discovery reconciles against it. The standalone reward server gets the same treatment, reading CXO feeds instead of HTTP. On top of that: a clearnet-to-dmsg deep-link gateway, a much-improved visor switcher in the hypervisor UI, a guided tour, and a batch of packaging and tooling fixes.

### Skywire: Declarative Transport State Over CXO

**`3377`** feat(transport): declarative CXO transport CRUD — publish the list, TPD reconciles is the pivot. Rather than issuing a register call per new transport and a delete call per removed one, the visor publishes its full current transport list into CXO, and the transport-discovery reconciles its registry to match — desired-state, not a stream of imperative edits. **`3376`** fix(transport): re-register via CXO entry leaves (not HTTP) when CXO is wired and **`3375`** fix(transport): deregister via CXO tombstone, not HTTP delete, when CXO is wired move the two remaining paths onto the same channel: re-registration writes CXO entry leaves and deregistration writes a CXO tombstone, so neither touches the HTTP endpoint when a CXO publisher is available.

**`3378`** fix(transport): deregister-all via empty CXO snapshot on Close closes the worst offender — shutdown. A visor tearing down used to fire a burst of individual HTTP deletes and draw a wave of 429s; it now publishes a single empty snapshot that deregisters everything at once, cleanly. **`3374`** fix(tpdclient): cache 'batch delete unsupported' so old TPDs aren't re-probed each flush handles the transition gracefully: older deployed transport-discovery instances 404 the batch-delete endpoint, and the client now remembers that instead of re-probing it on every flush and falling back to the rate-limited per-ID delete path each time.

### Skywire: The Reward Server on CXO Feeds

**`3389`** refactor(cxo): extract cxosub; wire standalone reward server to CXO feeds factors the CXO subscriber out into its own package and points the standalone reward server at CXO feeds — uptime, metrics, all-transports — instead of polling over HTTP, so the reward host reads the same authoritative CXO data the visors publish. **`3388`** fix(tpviz): source uptime from the TPD-integrated tracker completes the migration on the visualization side: tpviz was still reading uptime from the decommissioned standalone uptime-tracker service and now sources it from the tracker integrated into the transport-discovery.

### Skywire: A Clearnet-to-dmsg Deep-Link Gateway

**`3390`** feat(wasm-hv): deep-link gateway — open a dmsg site full-page from a URL lets a normal clearnet link open a dmsg site directly in the browser wasm-visor: a `?skynet=<target>&kiosk=1` query opens the target full-page, turning the wasm-visor into a clearnet-to-dmsg gateway. The query has to be captured in the very first boot script because the Angular app strips `location.search` before anything else can read it. **`3391`** fix(wasm-hv): resolve rewards.dmsg + point reward-UI nav at dmsg aliases makes the reward UI a first consumer, resolving the `rewards.dmsg` alias and pointing its navigation at dmsg aliases rather than clearnet hosts. **`3393`** docs: reward-host splash page for the dmsg-only deep-link gateway adds a splash page on the reward host that hands visitors into the gateway. **`3385`** feat(wasm-hv): skynet browser — home button + limitations panel + docs rounds out the in-tab skynet browser with a home button, an honest panel spelling out its current limitations, and documentation.

### Skywire: The Visor Switcher

The hypervisor UI gained a persistent way to move between visors, refined over several passes. **`3379`** feat(hv-ui): persistent visor-switcher + home-nav rows on node pages adds the switcher and a home-navigation row that stay present across node pages, and **`3383`** feat(hv-ui): show the visor-switcher row on the visor list page too extends it to the list page. **`3384`** fix(hv-ui): make the switcher/home-nav rows legible (white text) + keep Local Visor tab fixes a real legibility bug — the chips were near-black on a dark bar and effectively invisible despite passing every DOM presence check — by switching to white text, and keeps the Local Visor tab. **`3386`** feat(hv-ui): move the visor-switcher below the home nav; two-line chips and **`3387`** fix(hv-ui): switcher chip shows label over full public key finish the layout: the switcher sits below the home nav with two-line chips, each showing a friendly label above the full public key in a smaller font.

### Skywire: A Guided Tour

**`3392`** feat(hv-ui): in-depth guided tour of the mesh-visor UI adds a walkthrough that leads a new operator through the hypervisor interface, so the growing surface of switchers, node pages, and app controls is discoverable rather than something you have to already know.

### Skywire: Packaging and Tooling

**`3382`** fix(win_installer): MSI major-upgrade actually replaces the old version fixes a Windows upgrade that silently kept the old binary and config: the installer had `RemoveExistingProducts` but no `MajorUpgrade`, so a shared fixed-GUID component was seen as already installed and the new files were skipped — leaving the postinstall step to run the old executable. Declaring a proper `MajorUpgrade` makes an upgrade replace the prior version as intended. **`3381`** chore(format): normalize import grouping via goimports-reviser regroups imports fleet-wide with the local package in its own block, and **`3380`** chore(lint): use latest golangci-lint v2.12.2 in CI and install targets brings the linter up to the current release across CI and the install targets.
