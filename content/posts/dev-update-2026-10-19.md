+++
date = "2026-10-19"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 19, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The nineteenth of October was about addresses whose public keys are on the blockchain. An address that has spent has published its key, so whatever it holds or later receives could be taken by a future quantum computer, and nothing warned about it. The Skycoin wallet GUI, skycoin-web and the visor's reward address now all flag such addresses. Work also began on merging the two Skycoin wallet GUIs into one. On the Skywire side the GeoIP data was corrected for recently assigned address blocks, the GeoIP API can now run inside a visor, and the hypervisor map in the CLI got labels and listen ports.

### Skycoin: Marking Exposed Addresses

**`skycoin#3123`** made the wallet detail check each address against the node's `address_uxouts`. An address that has sent coins is shown in red with a warning icon, one that still holds coins gets a red row, and a banner above the list counts them. **`skycoin#3124`** fixed bip44 wallets showing as a flat address list with no visible xpubs, because the wallet was copied without its accounts on its way to the detail view. Both reached Skywire's bundled wallet in **`5729`** and **`5733`**.

**`5728`** brought the same check to the visor's reward address. Operators who reuse one reward address and spend from it once had no sign that later rewards sent there are exposed. The visor now asks the Skycoin node for the address's history, `skywire cli reward` prints a warning when it has spent, and the hypervisor's rewards page shows it in red along with the balance still sitting there. Because the hypervisor and the CLI answer from their own visor, remote visors on older builds are covered too.

### Skycoin: One Wallet GUI

The node GUI and skycoin-web are two Angular apps doing the same job, and they have drifted far apart, with 77 of their 99 shared paths differing in 40 percent or more of their lines. **`skycoin#3125`** recorded that measurement and a plan: skycoin-web becomes the base, since it already separates server and browser wallets and is shared with the Skywire dashboard, and the node GUI's features move over in steps. **`skycoin#3126`** took the second step, putting server wallets and browser wallets behind one backend interface instead of choosing between them inside every method, with no change in behavior across 2,245 specs.

**`skycoin#3127`** brought the exposed address marks to skycoin-web. **`skycoin#3128`** added the node GUI's backup page, which saves a wallet's addresses as CSV and shows its seed, decrypting a browser wallet's own copy with its password. Testing it showed skycoin-web displayed no error messages at all, because its message bar was handed to the service before it existed, and that is fixed too. **`skycoin#3129`** added the network page, listing the node's peers with direction, address, block height and last traffic. Skywire picked up all of these in **`5736`** and **`5737`**, rebuilding the hypervisor UI that compiles skycoin-web as its wallet page.

### Skywire: GeoIP Corrections

The GeoIP database Skywire embeds is from September 2025, so visor addresses from blocks assigned or leased since then came back with no country or with the block's old one. **`5731`** compared the 372 addresses the reward system has surveyed against the bundled data, DB-IP's October 2026 data and the regional registries' delegation files, and wrote a corrected record for each of the 15 addresses where two sources agreed on a country the bundled data does not give. Eleven of them are in Indonesia. 200,000 random lookups match the old file apart from the patched addresses. **`5732`** added the tool behind it as its own module, with instructions for running it again when the bundled data is replaced, and a second run on its own output finds nothing left to patch.

**`5735`** let a visor run the GeoIP API as an embedded service from a single config block, answering over the visor's dmsg HTTP and on a local address with the database the visor already carries. Until now it ran only as a separate command in its own container.

### Skywire: Rewards and Tooling

**`5727`** closed a leak in the reward system's server. The raw pool share files list each visor's reward xpub next to its key, address and UUID, and while the history page linked them only for whitelisted keys, the route served them to anyone who asked by name. They now return 404 to everyone else. **`5730`** fixed xpub reward addresses landing repeatedly on the first few indexes, and each date now gets an index past every one already assigned or used on chain.

**`5734`** labeled the hypervisor map in the CLI. The root, the key and role columns, and each visor's address, version and region are now named, and services and apps show where they listen and, for apps that take one, how many keys their whitelist holds or whether they are open. Running state is shown only when something is not running.
