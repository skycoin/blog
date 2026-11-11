+++
date = "2026-11-08"
tags = ["Development", "Skywire", "Skycoin"]
title = "Skywire Development Update — November 8, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The eighth of November closed a hole in the hypervisor's CSRF protection, where a handful of write routes took no token at all. The Skycoin wallet gained joint transactions, in which two wallets spend in one transaction and each signs only its own inputs, and its BIP44 and xpub wallets now find payouts at addresses past the last one they list. Several of the day's wallet changes came from users restoring wallets or sending from them, the dmsg scp tool stopped hiding its real errors, and both Skycoin and Skywire moved to a logrus fork that builds with TinyGo on Windows. Two upstream changes were merged, frame pointers for TinyGo on Linux and a colored help renderer that works under TinyGo.

### Skywire: Cross-Origin Writes

The hypervisor checked its CSRF token only on the routes that act on a visor, so a few writes outside them took none, among them changing the network, reconnecting dmsg, setting the dmsg session count, the browse fetcher and the skychat proxy. A page on another site could have a logged in browser call them, and with authentication off any page could. **`6064`** checks every write in the authorized API group. A write passes with a valid token, or when Go's cross-origin protection sees a same-origin browser or a client that is not a browser, which keeps the skychat pages and the CLI working. On a running visor a cross-site request with no token now gets 403, and the change closes issue **`1088`**.

### Skycoin: Joint Transactions

A joint transaction spends outputs from two wallets, with the coins and coin hours of every output set by hand, and each party signs only its own inputs. One use is paying in coin hours alone. Customer and vendor each put in a small output, and the customer gets their SKY back in the same transaction while the vendor gets the hours, with no trust needed, since each signature covers the exact outputs. **`skycoin#3219`** adds it to the CLI, with a review mode for decoding a raw transaction and signing limited to the inputs the wallet owns, and a joint page to the web wallet for node and browser wallets, with two new end to end tests in CI. **`6066`** brings the page to the dashboard through the hypervisor's existing wallet proxy.

### Skycoin: Finding Every Address

A user's BIP44 wallet showed no balance while the explorer showed coins at addresses derived from its account xpub. Reward payouts use a new index each time, often past the addresses a wallet lists, and the node checked one window of addresses and stopped. **`skycoin#3216`** has the node scan until a run of unused addresses as long as the BIP44 gap limit, has the web wallet scan BIP44 and xpub wallets past their last address on each balance refresh while the node is in sync, and adds Scan Addresses to each wallet's options.

The seed passphrase is used as typed. **`skycoin#3217`** stops browsers filling a saved password into that field, which would derive a different wallet from the same seed, and **`skycoin#3218`** shows a note when the passphrase starts or ends with a space, after a user restoring a funded wallet saw a zero balance that way. **`skycoin#3215`** has `--enable-gui` turn on the wallet API, which it had needed separately, without saying so. **`6060`** and **`6062`** brought these to the dashboard, along with the transaction size check from the day before.

### Skywire: Fixes

With `--transport auto`, any failure of the visor's scp fell back to the standalone dmsg client, which uses a random key. The peer whitelists the visor's key, so the retry was always refused and the real error lost. **`6065`** falls back only when no visor answers, and that exposed a second bug, where a host's refusal was read as a file header and reported as an unknown record type. It now reads the refusal first. **`6061`** fixed white on white text in the login password field in the dark theme, reported on v1.3.106.

### TinyGo

logrus did not build with TinyGo on Windows, because a file that does not exclude TinyGo declares a function twice. **`skycoin#3220`** and **`6067`** move both projects to a fork with the one line fix, imported by its own path, as a step toward a Windows TinyGo release.

**`tinygo#6088`** keeps frame pointers in TinyGo's native Linux binaries on amd64 and arm64, as Go does, so perf and eBPF profilers can unwind TinyGo stacks. Turning them on exposed a bug in `recover`, where the recovering function resumed with the frame pointer of the frame that panicked, and that is fixed in the same change. **`coloredcobra#8`** gives the colored help library a renderer that does not go through `text/template`, whose method calls need reflection TinyGo does not implement, so a TinyGo build prints its help instead of panicking.
