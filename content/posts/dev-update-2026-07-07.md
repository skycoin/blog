+++
date = "2026-07-07"
tags = ["Development", "Skywire"]
title = "Development Update — July 7"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A big day for skychat: the mesh messenger grew two features that make it a real communication tool rather than a text demo — **file sharing** and **real-time voice** — both built on the same principle that everything rides the encrypted skywire transport and nothing touches the clearnet. Underneath that, a memory leak that had been quietly bloating the transport-discovery server to 4 GB got root-caused and fixed, and the committed browser-visor blob finally got its bloated git history pruned. This post walks the arc: the leak, file sharing on native and in the browser tab, and the voice stack from RFC to a working call.

### Skywire: Plugging the TPD Accept-Side Leak

The transport-discovery server had been climbing to ~4 GB of resident memory and spending most of its time in GC — a slow leak that only showed under real fleet churn. Two fixes close it.

**`3409`** fix(cxo): close the superseded conn on peer reconnect (accept-side leak) is the root cause. When a peer reconnected, `DMSG.addConn` overwrote `d.cs[pk]` with the new connection **without closing the one it replaced** — so the old `Conn`'s read-loop goroutine blocked forever on a socket nobody would ever close again, one leaked connection (and goroutine, and buffers) per reconnect. On a server like TPD that every visor connects to, reconnect churn accumulated to gigabytes. The fix makes `addConn` close the superseded connection outside the lock, with an identity check in `closeConn` so it never closes the wrong one.

**`3408`** fix(cxo): back off the fill-break reconnect kick (TPD accept-side leak) fixes the amplifier. A fill-break "kick" added earlier reconnected instantly with no backoff, so against TPD's un-fillable 8 MB all-transports feed it spun in a tight reconnect loop — turning the latent `addConn` leak into a fast one. An exponential backoff (base 2 s, cap 60 s, reset on a successful fill) turns the tight loop back into an occasional retry, so the leak fix has time to actually settle the connection.

Together these take TPD from a GC-bound 4 GB back to a flat memory profile under the same churn.

### Skychat: File Sharing, Telegram-Style

**`3414`** feat(skychat): file sharing — Telegram-style, 1:1 + group, over dmsg/skynet makes a file just another message in the conversation. The design mirrors the voice work: a reusable offer→accept→chunked-stream primitive (`pkg/skychat/xfer`) where the sender announces an offer, the receiver auto-accepts if it's an established chat or a shared group, and the bytes stream **out of band** on a dedicated port (skyenv `SkychatFilePort`) so a large transfer never blocks the chat conn. Every chunk is length-prefixed and the whole transfer is verified with a trailing sha256; the accept/decline handshake happens *before* any bytes move, so a declining peer never receives the body. It works 1:1 over the non-CXO framed skychat and to a group by fanning the file out to each current member — all over the encrypted dmsg or skynet transport, never the clearnet. A `skywire cli skychat send-file` command exposes it to the CLI (and CI), matching the GUI.

**`3415`** feat(wasm-hv): file sharing for the browser-tab skychat (parity with native) brings the exact same primitive to the browser visor, wire-compatibly, so a browser tab and a native visor exchange files with each other. The only difference is that a tab has no filesystem: a received file buffers in memory and is handed to the page as a Blob download, and a sent file's bytes come from a `File` the page reads — surfaced through new `skychatSendFile` / `skychatFile` bridge calls and a 📎 attach button plus download link in the desktop chat window. This was validated live in both directions between a native visor and a browser tab, byte-identical and sha256-verified.

### Skychat: Real-Time Voice on the Encrypted Mesh

The day's largest new surface is 1:1 voice, built in three PRs from design to a call.

**`3411`** docs(skychat): voice RFC — real-time voice with all media on the encrypted mesh sets the constraint that shapes everything: WebRTC is used only as a *media library* (Opus, RTP, jitter handling), with the skywire transport replacing ICE and DTLS-SRTP entirely — so audio rides the same Noise-encrypted mesh path as everything else and never opens a raw-internet ICE candidate. Media travels on the faithful-UDP datagram route groups already wired into the router.

**`3412`** feat(skychat): voice core — signaling (dmsg+skynet, one port) + RTP media is the transport-agnostic engine: a signaler that exchanges invite / accept / decline / hangup over **both dmsg and skynet on the same port**, and a session that paces PCM frames through a codec into length-prefixed RTP over a skywire stream. It ships with a passthrough PCM codec and pluggable mic/speaker seams so the whole control-and-media plane runs and is unit-tested before any real audio device is attached.

**`3413`** feat(skychat): wire voice into the visor — init + RPC + CLI brings that engine up on a running visor: it listens for inbound call signaling over dmsg and skynet, dials outbound calls skynet-first with a dmsg fallback, and exposes `voice call` / `voice hangup` / `voice list` over RPC and the CLI. For now the visor auto-answers with silent media — accepting a call leaks no audio — a deliberate placeholder until a real audio backend and an explicit-answer consent flow land.

### Skywire: Pruning the Browser-Visor Blob History

**`chore(wasm-visor): re-add embedded blob after history prune`** closes out a repository-hygiene issue. The committed browser-visor blob (`pkg/wasmhv/wasmbin/wasm-visor.wasm.gz`) is regenerated and re-committed on every wasm change, and git keeps every past version forever — ~40 copies had accumulated to roughly 350 MB of a bloated `.git`. A one-time `git-filter-repo` pass (now scripted behind a `make prune-wasm-embed-history` target) stripped every historical copy and re-added only the current blob, so history holds it exactly once — reclaiming the space while keeping the blob committed so a from-source build still works without a wasm toolchain.
