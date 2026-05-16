+++
date = "2026-05-14"
tags = ["Development", "Skywire", "Skymail"]
title = "Skymail-Bridge: Email Over Skywire"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Email is the oldest addressable identity on the internet, and it's been outside Skywire's reach since the project began. Today's PR #2598 closes that gap: **`skymail-bridge`** — a sender-side SMTP bridge that lets an operator send email to and receive email from a Skywire identity, using the same Postfix machinery they already run.

### The address shape

A Skywire identity is a 33-byte compressed secp256k1 public key. Base32-encoded (RFC 4648), that's 52 characters — small enough to fit inside RFC 1035's 63-octet DNS label limit, which is the hard constraint email addresses have to live within. Hex would be 66 characters and break.

So an address looks like:

```
alice@4cflnfwwlkc6jl5jhqq6c5j6c6jl5jhqq6c5j6.skynet
```

The `.skynet` TLD signals the bridge should route this over Skywire; the base32 label is the destination visor's public key.

### The two halves

**Sender side** — skymail-bridge listens on a local SMTP port (default `127.0.0.1:1025`). Postfix is configured with a transport map:

```
.skynet relay:[127.0.0.1]:1025
```

When Postfix sees an outbound envelope for `alice@<pk>.skynet`, it routes through the bridge. The bridge:

1. Decodes the base32 PK from the recipient's domain part.
2. Opens a skywire route to the destination visor.
3. Sends the envelope (RFC 5322 message) over the route, terminating to the receiver's local SMTP listener.

The hop is a single TCP-over-skynet stream; no clearnet relay involved.

**Receiver side** — skymail-bridge runs as a virtual-transport target on the receiving side's Postfix. Postfix delivers mail destined for `*.<base32-pk>.skynet` to the bridge; the bridge strips the `<pk>.skynet` portion and hands the bare-envelope to the local Postfix's `virtual_alias` chain for normal delivery (mailbox, forwarding, etc.).

The strip-and-resubmit pattern means the operator's existing alias / forwarding rules apply unchanged. A user who has `alice@example.com` aliased to `alice@localhost` gets `alice@<pk>.skynet` routed the same way once the bridge is configured.

### Mode A and Mode B

Two configurations land in this first cut:

**Mode A — Direct**: the receiver adds `<pk>.skynet` to Postfix's `mydestination`. Postfix accepts mail at that domain natively; the bridge is purely a transport. Simpler config; no resolver layer.

**Mode B — Virtual-host**: the bridge inserts itself as a transport target, strips the `.<pk>.skynet` suffix from the envelope, and resubmits to Postfix's virtual-alias chain. This is the more general configuration: it lets one mail server host many domains, with `<pk>.skynet` being one of them, and lets existing aliases route to it without per-PK config.

PR #2605 the same day extends Mode B to accept both host-prefixed and bare-PK envelope shapes, so the upstream client can be configured either way.

### Why a CLI bridge and not a daemon?

The bridge is a small standalone binary (`cmd/skymail-bridge`). It doesn't try to replace Postfix; it doesn't try to be a full mail server. It does exactly one thing — translate SMTP envelopes between Postfix's existing transports and Skywire's routing layer.

This shape has three properties operators care about:

1. **Existing mail infrastructure is preserved.** SpamAssassin, DKIM, mailbox storage, IMAP — all the existing Postfix-side machinery keeps working. The bridge is a thin protocol-translation layer.
2. **The bridge is easy to operate.** One binary, one config knob (`-c bridge.json`), runs under systemd or as a foreground process. No new dependencies.
3. **Skywire is invisible to mail clients.** A user sending mail through their normal MUA sees `alice@<pk>.skynet` as just another address. The MUA doesn't know about Skywire. The recipient's MUA receives the message in their mailbox with no protocol marker. The Skywire hop is purely a transport-layer detail.

### What about spam?

The same threat model that makes Skywire's chat-app pairing necessary applies here: a public key, once published, can be addressed by anyone who learns it. Two mitigations land with this PR:

**Per-bridge whitelist**: the receiver-side bridge can be configured with an allow-list of source PKs. Envelopes from unlisted senders are rejected at the Skywire-layer accept (before they reach Postfix's spam pipeline). The operator who shares their `<pk>.skynet` address with five contacts can whitelist exactly those five PKs, ignoring everyone else.

**Postfix's existing spam pipeline still runs.** Whitelist-accepted envelopes still get evaluated by SpamAssassin, RBLs, content filters, whatever the operator has wired up. The bridge isn't trying to replace any of that; it's a transport sieve in front of the existing receive chain.

The combination — Skywire-layer PK whitelist + Postfix-layer content filtering — is more restrictive than ordinary SMTP, where the receive-side has no identity-layer signal at all. For low-volume personal mail it's likely sufficient; for high-volume infrastructure it's a first cut that future PRs will tune.

### Operator recipe

PR #2604 ships the operator-side documentation: `docs/guides/skymail-bridge.md` walks through the Postfix overrides, the bridge configuration, the systemd unit, and the verification steps. Briefly:

1. Install the bridge: `go install github.com/skycoin/skywire/cmd/skymail-bridge@latest`.
2. Generate a config with your visor's PK + Postfix's listen address: `skymail-bridge gen-config`.
3. Add the transport map line to Postfix's `master.cf` + `main.cf` and reload.
4. Start the bridge under systemd. Send a test message to `<your-pk>.skynet` from another visor.

The full recipe is six steps + verification. For an operator who already runs Postfix, it's a 30-minute setup.

### What's next

This is the first cut. Several items are explicitly out of scope and tracked separately:

- **Reverse direction in Mode A** — receiving mail at `alice@<pk>.skynet` requires the receiver's bridge to be reachable. Right now that's a configuration step; future work is to make it automatic when the visor has a published forwarded-port-80 entry.
- **DKIM signing of bridge-relayed mail** — currently the bridge passes the envelope through as-is. Bridge-side DKIM signing (with the visor's identity key as the signing identity) would let receivers verify the message originated from the claimed PK regardless of any post-receive forwarding.
- **TUI / hypervisor surface** — operators can interact with the bridge via Postfix-shaped tools (`postqueue`, mail logs) today. A hypervisor-tab equivalent is in the queue.

For today, every Skywire visor can send and receive email over Skywire-as-transport with about thirty minutes of Postfix configuration. The address shape (`user@<base32-pk>.skynet`) is human-shareable and survives RFC 1035. The privacy property is what you'd expect: the body travels over Noise-encrypted Skywire routes, never touching clearnet between the two visors.
