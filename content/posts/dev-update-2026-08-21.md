+++
date = "2026-08-21"
tags = ["Development", "Skywire"]
title = "Development Update — August 21"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A large CLI-standardization sweep runs across almost every command group today, fixing small bugs and converging the flag and help vocabulary, and it lands next to a set of route-setup reliability fixes that stop intermittent skynet route drops and apps stuck in "starting". The proxy status surface gains a real HTTPS certificate and a chunked live route-setup progress stream, and a route-visualizer scaffold goes in.

### Skywire: Route Setup Stops Dropping

**`4078`** sets up candidate route groups in parallel rather than serially, fixing a steady-connection stall where a slow candidate delayed the whole dial. **`4057`** retransmits the route-group setup handshake to prevent intermittent skynet route drops, and **`4051`** stops a route-setup drop from wedging an app in the "starting" state, adding a cascade→classic fallback so a failed cascade setup degrades to the classic path instead of hanging. **`4081`** excludes same-LAN peers as routing intermediates for genuine route diversity, and **`4079`** has the `adaptive` default hold a warm standby with an asymmetric forward/reverse shape, app-agnostically.

### Skywire: The CLI Standardization Sweep

A broad audit converges the CLI's command groups on a common flag and help vocabulary and fixes bugs found along the way. **`4067`** covers `dmsg`/`mdisc`; **`4065`** standardizes the remote-access (pty) group, fixes the host whitelist-size log and drops the dead `dmsgpty` package; **`4071`** unhides six invisible `visor` subcommands and fixes an hv-ui port bug; **`4066`** fixes `sd`/`ut`/`svc` min-version and tpd-uptime handling; **`4068`** validates `--source` on all `route`/`rg` paths and standardizes their vocabulary; **`4064`** audits the `reward`/`rewards` groups; **`4062`** clarifies the `tp`/`tps` transport commands; **`4061`** audits the proxy/forwarding surface (issue #77), fixing a status IP bug and converging the mux/routes vocabulary; and **`4060`** adds a `tp v` online filter with graceful `tp uptime` degrade. **`4058`** gives the remote-access trinity a unified transport vocabulary with `--scheme` targets, and **`4072`**, **`4070`** and **`4076`** honor the global `--json`/`--jq`/`--shape` output flags and polish help across `survey`, `hv`/`log`/`util`/`pv`/`completion` and the apps CLI.

### Skywire: Proxy Status Over a Real Certificate

**`4053`** serves the proxy status page over the browse-origin real certificate with AA-contrast styling, so it loads without a browser TLS warning, and **`4050`** adds per-proxy status hosts behind an HTTPS interstitial permit-gate. **`4054`** streams live route-setup progress to the interstitial via chunked encoding, so the wait page shows the route building in real time, and **`4049`** scaffolds a route visualizer — a live per-leg route view over a new `/route-mux` HTTP seam.

### Skywire: dmsgscp Over Route Groups, and Housekeeping

**`4056`** teaches `dmsgscp` to accept route-group (`routing.Addr`) skynet connections and to ensure a transport exists before an scp skynet dial. **`4059`** and **`4048`** clear errcheck/gosec/misspell/unparam debt to keep `make check` green.
