+++
date = "2026-11-12"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — November 12, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The twelfth of November made the new server rendered interfaces the defaults. The hypervisor, the Skycoin wallet, the explorer and the skydex client now open on their templ and htmx pages, with the old Angular or React interface one path away at `/angular/`. The rest of the day went into making Skywire, Skycoin and the skycoin.com site build the same way, with one Go version, one linter release, one TinyGo, the same file descriptors and the same naming rule for booleans. Group chat messages also stopped waiting a second at every hop.

### Skywire: New Interfaces by Default

**`6185`** serves the new hypervisor interface at the root and moves the Angular one to `/angular/`. Old `/ui2/` addresses answer with a permanent redirect to the same path at the root, and old desk links that asked for the embedded Angular page still land there. Skycoin did the same for each of its apps. **`skycoin#3278`** puts the new wallet at the root of the node's interface and of skycoin web, **`skycoin#3276`** does it for the skydex client, and **`skycoin#3275`** moves the explorer's old interface from `/classic/` to `/angular/` so every app uses one path for it. **`6194`** took those changes into Skywire and **`6195`** forwards skycoin web's wallet at `/wallet/web/` from the hypervisor, with the old wallet addresses redirected.

The in-browser visor showed what a root move can break. Its service worker rewrites a page's base to the page's own directory, so every new page below the root loaded unstyled with broken links, and **`6196`** carries the intended base in the layout. **`6197`** fixed the font paths, which resolved at the root of a native hypervisor but outside the visor's path in the browser tab, where every icon showed as its name. Both were found in the browser tab on a TinyGo build.

Two features the parity table still listed as missing arrived. **`6180`** adds voice calls to the chat tab, with ringing, answer and decline, mute and deafen, a timer and a level meter, while the visor plays the audio as before. **`6181`** adds this browser as a push alert device, reusing the desk's service worker where there is one. In the Skycoin wallet, **`skycoin#3285`** adds the Skywallet hardware wallet to the new interface at the level of the Angular one, from seed setup and PIN to signing, and fixes a signing fault on the way.

### One Toolchain for Three Repositories

Skywire, Skycoin and the skycoin.com site generator had each drifted on Go, linter and TinyGo versions, which let CI build with something other than what the code named. **`6186`** and **`skycoin#3279`** read the Go version from go.mod in every workflow, with Skycoin moving to 1.27.3 to match. **`6189`**, **`skycoin#3280`** and **`skycoin.com#92`** pin golangci-lint v2.15.0 in all three, and Skycoin's linter configuration now starts from Skywire's. **`6192`** runs `gofmt -s` in `make format`, as the other two already did, and **`6193`** repaired a workflow left with an empty block.

TinyGo took two tries. **`skycoin#3283`** builds Skycoin's TinyGo release with the prebuilt fork release that Skywire and the site also use, where before it compiled TinyGo from source on every release, and skycoin.com moved to the same release. **`6191`** switched Skywire's wasm test lane to it too, but a routing policy module trapped there that passed on the official 0.42.0, so **`6198`** put that lane back until the fork's wasi build is understood. **`skycoin#3284`** adds the CodeQL and OpenSSF Scorecard workflows Skywire already runs, and **`skycoin#3281`** fixes the new coin template, which had drifted from the file it generates without any check noticing.

### Descriptors and Boolean Names

Every Go file across the three repositories now carries a descriptor naming its layer, domain and system, from the SSS3 standard. **`6182`** adds the Go adaptation of the standard under `docs/sss3`, **`6183`** tags every Skywire file and package and runs the check in `make check`, and **`6187`** fixed the two test failures that followed. **`skycoin#3277`** and **`skycoin.com#90`** do the same for Skycoin and the site. **`6190`** and **`skycoin#3282`** run the descriptor check on macOS and Windows as well, and **`skycoin#3288`** fixed the Windows job that then hung for six hours by reading only each file's header.

**`6188`** changes the standard's rule on boolean names, so variables, parameters and fields take plain names with no is or has prefix, while predicate functions may keep them as the standard library does. The renames followed with type information in **`6199`**, **`6200`**, **`6201`** and **`6202`** for Skywire, **`skycoin#3286`** and **`skycoin#3287`** for Skycoin, and **`skycoin.com#91`** for the site, which also passes the generator an options value and returns an error where a malformed animation used to panic. Exported fields stay as they are, since other modules and wire formats depend on them.

### Skywire: Faster Group Messages

Group messages reached other members seconds late. Every CXO hop waited the publisher's one second batch window, and a message between two members who are not admins can take two hops. **`6177`** adds a leading edge to the publisher, so the first change after a quiet window goes out at once and later changes still coalesce. **`6178`** and **`6203`** fixed two tests that raced, one on the mail outbox clearing and one on a group member's listener coming up.
