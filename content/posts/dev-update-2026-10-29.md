+++
date = "2026-10-29"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 29, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The twenty-ninth of October built an app catalog into the hypervisor UI in five steps, from a list of every app a visor can run to settings forms generated from each app's flags, a server picker fed by service discovery and bulk app actions across the fleet. The UI also got a light theme with measured contrast and layouts that fit a phone. CXO publishers now refuse at once a request for an object they have already swept, which ended the longest standing flaky test on develop, and the Android app got ready for its F-Droid release and learned to say when an update is out.

### Skywire: An App Catalog

There was no way to see which apps a visor could run without knowing the binary. **`5923`** adds a catalog: every app the visor can run, merged with the instances it has configured. The launcher now keeps each app's kind, a one line description and whether several instances make sense, and an instance the registry does not know is listed as external. It is served over RPC, through the hypervisor API and by `skywire cli visor app catalog`. **`5924`** adds a Catalog view beside each visor's apps list, grouped by kind, where each card shows its instances' status, port and autostart, or that the app has not been added, with add, start, stop, logs and settings on the existing endpoints.

**`5925`** gives every app's settings panel an Edit flags section built from the flags the app accepts, with typed inputs, defaults, reset to default and the same value checks as the visor settings form. In-process apps register their flag set beside their run function, and other apps fall back to parsing their help output. The form still saves through the same arguments path as before. **`5926`** adds a Choose server button to the server flag of skysocks-client and vpn-client, listing service discovery's servers for that app type with a country filter and search, sorted by the latency of any direct transport to them. It also fixed the proxy list being empty, since the discovery feed tags proxies "skysocks" and the UI only accepted "proxy".

**`5927`** brings the catalog to the whole fleet. The visor list gets a running app filter, an optional apps column and bulk actions on ticked visors to add an app from the catalog, start it or stop it. Four visors are asked at a time and each visor's result is shown, so one failure does not stop the batch. Visors behind a sub-hypervisor can now have apps added and listed too, and `skywire cli visor hv apps` does the same from the command line.

### Skywire: Light Theme and Phone Widths

**`5928`** moves the hypervisor UI's colors to CSS custom properties with a dark and a light set. The dark set reproduces the current look, dialogs always take the light set, which replaces a pile of per component contrast patches, and the theme follows the system preference unless one is picked in Settings or the command palette. Text contrast was measured from computed styles in both themes on the main pages, and every body text element reaches at least 4.5 to 1.

At phone widths of 360 to 414 pixels the visor list and node info scrolled sideways, the header's menu button sat off screen and most controls were under 40 pixels. **`5929`** fixes the overflow at its sources, lets routing's sub tabs scroll, makes dialogs full width with scrolling bodies on small screens, and raises controls to 40 pixels. Under device emulation the main pages, dialogs and the server picker show no horizontal scroll and no control under 40 pixels. Desktop is unchanged.

### Skywire: CXO Requests That Cannot Be Answered

The day before showed that a subscriber falling behind asks for objects the publisher has already swept. The publisher treated the miss as "not yet" and waited out the 59 second response timeout, so the fill stalled on a stale root, which was also the `TestCXOChurn_Sustained` flake on develop. **`5919`** has a node with no fills of its own answer such a request with an error at once, so the subscriber moves on to the newer root. **`5920`** narrows that to the object instead of the node, because a node that publishes one feed while filling others, such as the transport discovery aggregator, still parked the request. The churn test went from failing 3 of 96 runs under parallel stress to passing every run.

**`5917`** fixed two more timing tests and cut the Windows lane, which took 31 minutes on one pull request. It saved a new build cache on every run, threw away the restored test results, ran the linter twice and ran one package with the race detector for over ten minutes. The cache is now saved only on develop pushes.

### Skywire: Android Releases

**`5921`** got the F-Droid side ready for the 0.0.9 mobile release. The shell window code had vendored Gio's compiled shaders and a gzipped font, which F-Droid's scanner fails as prebuilt binaries, although the mobile build never imports them, so the recipe now removes them before the scan. The store description now names the outside services the app talks to, as an F-Droid reviewer asked, including that dollar prices come from a price service only when turned on. **`5922`** dropped three scanner lines that removed nothing, which F-Droid also fails a build on.

A new release only reached a phone if its owner opened Settings. **`5918`** has the app check once after it starts and show a banner with Update and Later, and either button records the version so the banner never comes back for it. Update follows whoever installed the app: a Play Store install opens the Play Store, an F-Droid install opens the F-Droid client, and a direct install downloads from Settings. F-Droid installs are checked against F-Droid's own index, because F-Droid builds each release days after the tag.
