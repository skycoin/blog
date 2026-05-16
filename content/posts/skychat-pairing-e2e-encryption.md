+++
date = "2026-04-28"
tags = ["Development", "Skywire", "Skychat"]
title = "Skychat Pairing: End-to-End Encryption + Consent"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Skychat — Skywire's built-in messaging app — had been a "best-effort" DM system since it shipped. Any peer who knew your public key could open a chat-app stream to you and send a message. Bodies traveled in cleartext on the wire (over Noise-encrypted transports, but with no app-layer secret of their own), and there was no mechanism to refuse a sender ahead of time. Today's PR stack changes both of those: consent-gated pairing, plus end-to-end encrypted message bodies that the transport layer never sees in plaintext.

### The pair flow

The threat model is straightforward. A skywire visor's public key is the same identifier used for transports, discovery, and authentication. Once it leaks (or is published — e.g. on a website to invite contact), anyone can open a chat-app stream and dump messages into your inbox. Pre-pair, the chat-app would surface every such message; you could ignore them, but you couldn't prevent the delivery, and the sender had no signal that their message wasn't desired.

The new flow:

1. **Initiator dials, sends a `pair-invite`.** The invite is a framed envelope over the existing chat-app wire. It carries the initiator's PK and an ephemeral half of an ECDH key exchange.
2. **Receiver sees the invite in their pending list.** The hypervisor UI shows a card with `Accept` / `Decline` buttons; the CLI has `skywire cli visor pair list/accept/decline`. No messages from this initiator are surfaced to the inbox until the operator chooses.
3. **On accept**, the receiver completes the ECDH (their static identity key + the initiator's ephemeral half) to derive a shared secret. They send back a `pair-ack` containing their own contribution to the binding. The shared key is persisted in a per-pair bbolt store and the pair record's status flips to `Accepted`.
4. **On decline**, the pair record is persisted with `Declined` status. The same initiator can't reopen the invite; further pair-invites from that PK are silently dropped.

The receiving operator gets a real consent step before any cleartext payload reaches their inbox. The sender gets a clear ack/decline signal back, so they know whether to keep trying or move on.

### The wire shape

Once paired, every message body between the pair is encrypted with ChaCha20-Poly1305 using the derived shared secret as the AEAD key. A fresh 12-byte nonce per message; the nonce travels in the envelope alongside the ciphertext. AAD includes the sender PK and the message id, binding the ciphertext to the originating identity.

The interesting choice here was where to put the encryption. The chat-app already rides on Noise-encrypted transports — every byte between two visors is already encrypted in transit. Why a second layer?

Three reasons:

1. **The transport-layer encryption protects the wire, not the message.** A chat-app message is durable: it's persisted in the inbox, replayed on visor restart, optionally mirrored into a group feed. The transport-layer key is per-session; once the bytes hit storage, the protection is gone.

2. **The CXO-feed path (used for groups) doesn't pass through transport-layer encryption at all.** It writes leaves into a tree that anyone with subscriber access can read. Per-message AEAD is necessary, not optional, for the group case. Building it for 1:1 first gave a uniform shape.

3. **The pair binding is the consent record.** Encrypting with the pair-derived key means a message body decrypted by the recipient is provably from the paired sender. The transport layer doesn't have access to that semantic — it only knows what visor the bytes came from, not what identity at the app layer signed them.

### What it builds toward

The pair primitive isn't just for DM. The same per-pair feed primitives back the consent layer for **group chat** (where each member's send arrives as an encrypted leaf in their per-PK feed, decryptable only by other members with whom they're paired), and for future features like **per-pair file transfer** (the dmsgscp utility already rides on the dmsgpty allowlist, but a pair-derived key would let it ride on the same trust surface the chat-app uses).

The CXO publisher allowlist (added in PR #2378 the same day) is the underlying primitive on the CXO side: each pair's feed is created with the allowlist `[me, peer]`, so a third party who learns the feed ID still can't subscribe.

### CLI and UI surface

Operators get three entry points:

```
skywire cli visor pair list
skywire cli visor pair accept <pk>
skywire cli visor pair decline <pk>
skywire cli visor pair send <pk> <message>
```

The hypervisor's chat tab shows a "Pending invites" panel with accept/decline; paired contacts get a lock icon in the contact list to distinguish them from open chat-app DMs.

There's also a `--pair-enable` config knob that defaults on for new installs. Pre-existing configs without the knob get the legacy open-DM behavior on upgrade; flipping the knob enables consent-gating without breaking existing conversations.

### What's next

The pair flow ships in v1.3.51 (the hotfix release later this week) and is exercised by an end-to-end integration test that boots two visors, runs invite + accept + encrypted-message-round-trip, and asserts decryption integrity. Group chat (which lands May 12) rides on the same primitives — the per-pair feed is the foundation, group sessions are layered on top.

For operators, the practical effect is small: a one-time accept per peer, after which the messaging surface looks identical to before — except now the bodies on disk and in flight are encrypted with a key only the two paired endpoints hold.
