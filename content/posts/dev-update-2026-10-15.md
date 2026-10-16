+++
date = "2026-10-15"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 15, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The fifteenth of October was about reaching mesh names from more places. A Linux guest running in the browser desk through LinuxOnTab can now resolve and open .dmsg and .skynet sites, the desk can proxy LinuxOnTab from the site that publishes it, and mesh sites now load inside an isolated desk. Public keys can be given in their base32 form anywhere a hex key was accepted, the visor info page shows a visor's mesh name, and home.skynet now resolves everywhere with a list of the visors the address resolver knows. On the Skycoin side the hardware wallet's protobuf messages and firmware moved into the skycoin repository, and the skycoin.com site was cleaned up, trimmed to English and given current Skywire copy.

### Skywire: Mesh Names Inside a LinuxOnTab Guest

**`5688`** fixed a Linux guest on the tab visor's Wisp server reaching the internet but not mesh sites. Its lookups went to a public resolver through the exit, and the exit could not carry the connection anyway. The Wisp server now answers DNS itself for mesh names on any port 53 stream, with an address from SkyDNS's range, and passes other queries to the resolver the guest asked. Connections to a mesh name, or to one of those addresses, go over the mesh the way the desk browser reaches them. meshgw gained `Resolve` and `DialIP` for callers that are not on a packet path. From the guest, curl fetched .dmsg pages, .skynet pages and a vhost served over skynet, tested in Brave on a local desk.

**`5689`** fixed `curl https://ifconfig.me` hanging in that guest while `curl -4` worked. The guest network is IPv4 only, but its DNS answers carried IPv6 addresses and curl waited on one forever. The Wisp server now answers every AAAA query with no records, so programs go straight to IPv4.

**`5682`** made mesh sites load in an isolated desk. A desk served with `--lot` is cross-origin isolated, so it can only frame origins that send COEP and CORP, and the browse origins sent neither. The browse-origin listener now sends them when the desk has `--lot`; other desks are unchanged. **`5683`** added `hv serve --lot-open`, which opens LinuxOnTab when the desk starts unless the link asks for something else. The linux app now checks `crossOriginIsolated` first and shows a message without it, because LinuxOnTab would otherwise reload the whole page and restart the tab's visor.

**`5685`** let `--lot` take a site URL as well as a directory, and proxy that site at `/lot/`. Keeping LinuxOnTab current meant pairing a kernel from git with a full image from the site that publishes it, and a mismatched pair crashes the tab. The site's own isolation headers and cookies are dropped so the desk's apply, and its redirects stay under `/lot/`. It was unit tested with a fake site and booted to a shell from the proxied files against the real one. **`5684`** stopped the browser-tab visor starting the dmsg local relay, which serves dmsg clients beside a visor on its host and logged a socket error at boot where a tab has none.

### Skywire: Base32 Keys and home.skynet

**`5693`** let a public key be given in its base32 form wherever hex was accepted. Only the 53 character base32 label fits a DNS name, so a key copied from a .skynet link could not be used with the CLI, a config or skychat. `PubKey.Set` and `UnmarshalText` now take both and check the key as hex parsing does, while output stays hex so files and APIs do not change. The pty, scp, ssh and ptyfs destination patterns, skychat's contact and privacy lists and the desk's `?skydm=` link take it too. It was unit tested, and `cli pty exec` reached a production visor by its base32 key.

**`5692`** made the visor info page show the base32 mesh name with a copy button, and links to the visor's landing page over skynet and over dmsg. The name matches `skywire cli visor pk dnslabel` for the same key.

**`5694`** made home.skynet resolve everywhere. It had been answered only inside the visor's resolving proxy, so it did not resolve through SkyDNS, the skynet proxy or a Wisp guest, and it listed only the deployment's own services. "home" is now an alias for the visor itself in the resolvers, SkyDNS and the VPN client, and the visor serves the directory on its landing port for home.skynet or home.dmsg. The directory adds the roughly 1,900 visors the address resolver knows, each linked by its base32 .skynet name, with a filter box. It was tested on a native visor through the resolving proxy and through SkyDNS, but not yet in a Wisp guest.

**`5691`** made a config generated as root on Linux with systemd-resolved start SkyDNS by default, so `curl http://<base32 key>.skynet` works after installing skywire and starting the service. It then takes only the dmsg and skynet zones. Without systemd-resolved it would rewrite `/etc/resolv.conf`, so it stays opt-in there, and an explicit setting in skywire.conf still wins. SkyDNS also turns off LLMNR and mDNS on its interface. Both paths were tested on a Linux host with the visor as root. A host that updated itself to a build with the change regenerated its config and started SkyDNS on its own, and .skynet names resolved there.

### Skywire: Tooling and Docs

**`5686`** let the reward system rely on the surveys visors push, adding `cli log --no-fetch` so the hourly cycle runs only the survey cleanup instead of fetching every survey over dmsg first. **`5687`** and **`5690`** pointed the docs at blog.skycoin.com and dropped the dead GitHub Pages mirror link.

### Skycoin: Hardware Wallet Code Moves In

**`3111`** moved the hardware wallet's protobuf messages and `.proto` schemas into skycoin and dropped the separate module. The generated files are copied unchanged, since regenerating them with a newer gogo rewrites much of the code, so that is left for a later change. **`3112`** fixed the import formatting CI then flagged on those files. **`3113`** did the same for the firmware that `skyhw` embeds, moving the package and its four unchanged images in and renaming `FirmwareType` and `FirmwareInfo` to `Type` and `Info` now that the linter covers it. **`3114`** fixed the release workflow downloading a script into the checkout root, which made v0.28.6 ship `skyhw` reporting `+dirty`; it takes effect on the next release tag.

### Skycoin: skycoin.com Cleanup

**`64`** fixed blog links that pointed at a path that had returned 404 for years, which left the news sections empty. It also replaced a sitemap of 741 dead URLs with one written from the real pages, added canonical, language and Open Graph tags, and removed a geo-IP lookup whose key was rejected and which sent every visitor's address to a third party. **`67`** moved the feeds to blog.skycoin.com. **`65`** removed the newsletter forms, whose endpoints were dead and one of which shipped an API key, plus the store links and several retired pages, and pointed downloads at the v0.28.6 wallet and v1.3.101 Skywire releases with checksum links.

**`68`** fixed the HTML errors the validator found and removed jQuery and other leftovers, and **`69`** made the navigation menus crawlable and the hero animation lighter, which accounted for most of the 6.2 seconds of blocking time Lighthouse measured. **`70`** replaced the 2019-era Skywire copy with a description of the current network and software, and **`72`** restored a quote from a friend of the project that it had dropped. **`71`** dropped the five stale translations in favor of browser translation, shrinking the main bundle from 1,749 kB to 1,320 kB, and **`73`** fixed misaligned download tables. **`66`** made publishing a tag delete the other releases so only the current one is listed.
