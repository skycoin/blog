+++
date = "2026-10-30"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — October 30, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The thirtieth of October ended in the v1.3.104 release, the first with TinyGo builds of skywire published beside the Go ones. Getting there took a release job for five Linux architectures and fixes for TinyGo on 386, arm and macOS. A live review of the hypervisor UI turned into three sets of fixes, among them a visor page that kept flipping back to the previously viewed visor, and the sudph transport's kcp-go and pfilter dependencies moved to their newest releases, with pfilter back on upstream.

### Skywire: v1.3.104 and TinyGo Builds

**`5940`** builds skywire with the TinyGo fork for every release tag and uploads the stripped binaries beside the Go assets with a `-tinygo` suffix. Linux amd64 and arm64 use the cores scheduler that has been on trial on a deployment server, while arm, armhf and 386 use TinyGo's default scheduler. A failed architecture never blocks the release. On stock runners the five builds take 13 to 21 minutes, arm64 peaking at 15.2 GB of memory against a 16 GB limit, and each binary prints its version and generates a config, the 386 one natively and the arm ones under emulation. macOS does not link yet and Windows waits on a logging library fix. The same change makes a tag with a dash, such as an alpha, a prerelease that never becomes the latest release, and **`5941`** lets the Android build handle such tags.

The release job found the remaining TinyGo gaps. On 386 TinyGo aligns 64-bit fields to four bytes, which broke a compile time check, so **`5936`** puts the field first, and on arm Skycoin's poly1305 package built both its assembly and reference files, which **`skycoin#3182`** fixed by excluding TinyGo from the assembly files. For macOS, **`5937`** has the host and system stats calls return an error under TinyGo, since gopsutil reads them through cgo with SDK headers TinyGo does not ship, and **`5938`** and **`5939`** move the metrics library's process stats to its non-cgo file under TinyGo. **`5942`** is the v1.3.104 release, with the changelog from **`5809`** to **`5941`**.

### Skywire: Hypervisor UI Review

After moving from one visor's page to another, the info page kept switching between the two for about a minute, because the page is reused across visors and each route change subscribed to the new visor without dropping the old one. **`5930`** drops the previous subscription on each change and shows saved data only for the visor being viewed. Sampling the page every three seconds for 75 seconds, it showed the previous visor in 17 of 25 samples before and the right visor in all 25 after.

**`5934`** lets the header tabs wrap instead of scrolling under the version label, stops tables from breaking words mid-word except for long keys, and makes the mobile top bar follow the theme. **`5935`** greys stopped apps so that red means failed, gives the two lists on the apps tab headings and matching columns, drops the commit hash that versions repeated after the tag, and renders the settings toggles as switches. Both were checked at four widths in both themes against a live hypervisor.

### Skywire: Transport Dependencies and Rewards Docs

**`5931`** moves the kcp-go fork to v5.6.84, which merges upstream's latest changes: rate limited batches wait in the session instead of a sleeping worker, post-processing uses a shared worker pool, and closing a session releases its packet receiver. pfilter v0.0.14 kept that released receiver live, so the read loop panicked on the next packet, and the bump to v0.0.15 clears it. **`5933`** then switched from the pfilter fork to upstream v0.0.12, since everything the fork carried has landed there.

**`5943`** added a guide to setting an account xpub as the reward address, from making a BIP44 wallet in the web wallet or the CLI to telling the account xpub apart from the two chain xpubs, and **`5932`** stopped the reward server from reading an archive folder inside its history as extra days.
