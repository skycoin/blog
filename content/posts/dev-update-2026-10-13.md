+++
date = "2026-10-13"
tags = ["Development", "Skywire"]
title = "Skywire Development Update — October 13, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The thirteenth of October was release day for v1.3.101, which carries the KCP scheduler fix that boards running v1.3.100 needed, and the release itself prompted the browser module to stop being packaged at all, since it had pushed one package past GitHub's file size limit; visors now fetch it when its desk is first opened. Two security changes went in: hypervisor passwords are now hashed with Argon2id, and the post-quantum handshake is now required rather than merely preferred, closing a path by which a man in the middle could force a session down to classical cryptography. The test deployment and the last environment variables that changed behavior outside the config were removed, new systemd units arrived for the Skycoin node and explorer, and the CLI gained `hv map`, a tree of every visor behind a hypervisor and what each one runs.

### Skywire: v1.3.101 and a Module Fetched on Demand

**`5636`** released v1.3.101. The fix operators need is the KCP library update from three days earlier: on v1.3.100 a KCP scheduler shard can stop for good, its sessions are never released, and the visor's memory grows until it drops off the network. Five 2 GB boards running the v1.3.100 package went dark after about two days.

**`5638`** stopped every package carrying the 38 MB browser module, which most installs never use and which pushed the amd64 deb past GitHub's 100 MiB limit, so 1.3.101 could not otherwise be published for that architecture. The module stays a release asset. A visor already fetched it from its source visor over dmsg when the desk was opened; now, with no module on disk and no source to reach, it installs the release's module over HTTPS, checked against that release's manifest, and never replaces a module already on disk. `hv serve` starts without a module and fetches it on the first desk open, writing it to the user's cache directory when the binary's own directory is read-only. This was checked live from a read-only directory; the Windows installer change was not built locally.

### Skywire: Passwords and the Post-Quantum Handshake

**`5639`** changed how hypervisor passwords are stored. They had been a single SHA-256 of the password and a salt, which a leaked user database gives up to fast offline guessing, and were compared in a way that is not constant time. New passwords are Argon2id keys using the libsodium interactive preset, with the costs saved alongside, compared in constant time. A password saved the old way still logs in and is rehashed at that login, and only one derivation runs at a time so login attempts cannot add up memory on a small board. It has not been run against a live hypervisor login.

**`5641`** made the post-quantum handshake mandatory. A handshake whose peer did not take part in the ML-KEM exchange used to fall back to classical, refused only when an environment variable said so, and since the negotiation is not authenticated, a man in the middle stripping that payload could force any session to classical. A classical-only handshake is now refused in both roles with no setting to change it. Every visor since v1.3.80, released in June, negotiates the hybrid handshake, and visors older than that, under one percent of the versions on the status page, can no longer connect until they update. A build with the change opened dmsg sessions with production dmsg servers.

### Skywire: Removing the Test Deployment and Environment Overrides

**`5642`** removed the test deployment, which no longer exists, along with every path that selected it and the port offset config generation applied for it. It also removed three environment variables that overrode the config, each of which had become unnecessary, and config generation output is otherwise unchanged. **`5643`** moved the last two, the log hook level and the route finder's landmark routing switch, into the visor, service and route finder configs; neither was exercised on a live visor or route finder.

### Skywire: Skycoin Units That Follow Updates

**`5632`** added systemd units for the Skycoin node and explorer that skywire can run, since hosts using hand-made units never had them restarted by the updater and kept the old binary after every update. They run as dynamic users with their own state directory and take per-host flags from a defaults file, and autoconfig, which the updater runs after a new binary, now restarts any of them that are active. **`5640`** then fixed the node unit never starting at all, because it set the home directory to the same path as the data directory, which the node refuses; both affected hosts ran with a drop-in override in the meantime.

### Skywire: Seeing What Runs Where

**`5634`** added `hv map`, which asks every visor attached to a hypervisor, in parallel, for its embedded services, apps and forwarded ports, and draws them as a tree rooted at the hypervisor, with sub-hypervisors' visors hanging beneath them. Keys the deployment publishes are marked, and a final branch lists published keys that no visor embeds. It was run live against a hypervisor with twenty-four visors. **`5635`** let it draw only the visors it is given, in order, so a deployment's map can show just its own servers.

**`5633`** added the live heap after the last garbage collection to the visor's diagnostics, since the allocated heap alone also counts garbage not yet collected and cannot tell a leak from a collector that has not run; it is reported where the runtime provides it, including the forked TinyGo runtime, and is meant for measuring the browser visor's heap. **`5637`** made `gotop --remote` show only the remote visor's readings instead of mixing in the local machine's extra cores and temperature sensors.

### Skywire: Pages and Documentation

**`5630`** updated the forwarding guide, which still told people to send port 80 to Caddy and never mentioned the new virtual hosts, to cover named and catch-all virtual hosts, replacing the landing page with a custom site, and moving an older setup over. **`5631`** let `hv serve` add plain links beneath its boot message, so a crawler that runs no script can still find the deployment's other sites from the browser visor's page. **`5644`** dropped stale gotop checksums from go.sum, turning the module integrity check green again.
