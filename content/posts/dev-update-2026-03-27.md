+++
date = "2026-03-27"
tags = ["Development", "Skycoin", "Skywire"]
title = "Development Update — March 27"
+++

### Skycoin: BIP44 Wallet UX Overhaul

A major UX improvement day for the wallet GUIs:

**xpub key display** — account-level extended public keys are now exposed in both the API and both wallet GUIs (desktop and web). Users can see and copy their account xpub for watch-only wallet setups or sharing with accounting tools.

**Address hierarchy** — BIP44 wallet addresses are now displayed nested under their parent xpub key, with BIP44 child indices shown and path labels (e.g., `m/44'/8000'/0'/0/3`) on each address section. This makes the HD wallet structure visible and understandable instead of showing a flat list of addresses.

**Change chain addresses** — the web wallet GUI now supports generating change chain (`m/44'/coin'/account'/1/n`) addresses in addition to external chain addresses, matching the BIP44 chain selection exposed in the API on March 19.

**Server-managed wallet signing** — a fix for how `skycoin-web` handles transaction signing when the wallet is managed by the remote node (server-managed mode). Server-managed wallets now use server-side signing instead of requiring the user to enter their seed in the browser.

### DMSG: Idle Stream Timeout

**Ephemeral port exhaustion fix** — streams that completed the noise handshake but never received data would block in `smux.waitRead` indefinitely, holding their ephemeral port forever. Over time this exhausted all ~16K ports (49152–65535) on the DMSG Porter, causing "ephemeral port space exhausted" errors for new streams.

A 2-minute idle timeout was added: set as a read deadline after the stream handshake, refreshed on every successful read. Active streams are unaffected. Stale streams time out and release their port back to the pool.

This is another piece of the DMSG reliability work this week — after the server CPU exhaustion fix yesterday and the ephemeral keypair pool on Tuesday, today's idle timeout closes the last major resource leak: stale streams holding ports open forever.
