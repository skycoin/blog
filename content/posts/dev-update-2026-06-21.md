+++
date = "2026-06-21"
tags = ["Development", "Skywire"]
title = "Development Update — June 21"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Two threads from the week converge into shippable artifacts today. The browser-hypervisor work reaches its natural endpoint: a single self-contained `hypervisor.html` file, assembled by a generator, that inlines everything it needs to run a serverless visor UI from one artifact. And the embedded push clears a real milestone — the dmsg client now compiles under TinyGo for wasip1 and IoT targets, which meant extracting QUIC behind an interface and, along the way, catching two latent QUIC stream bugs. A wallet-like key ring for deterministic derived keys and a Windows test flake fix round out the day.

### Skywire: The Single-File Hypervisor

Three PRs build up, in layers, to a hypervisor you can carry as one HTML file.

**`3200`** feat(wasmhv): single-file standalone hypervisor.html generator (core assembler) is the engine: a core assembler that gathers the pieces of the browser hypervisor into a single document. **`3201`** feat(wasmhv)+cli: `hv gen` — generate a standalone hypervisor.html, with derived key puts a CLI handle on it — `hv gen` — and folds in a derived key so the generated file is bound to a visor identity without shipping the parent key. **`3202`** feat(wasmhv): inline runtime assets into the standalone hypervisor.html finishes the job by inlining the runtime assets — the Angular frontend, the gzip-compressed WASM, the override script, and supporting assets — directly into the HTML, so the result is genuinely self-contained: one file, zero HTTP bootstrap, openable offline or air-gapped, proving the whole UI can boot with no server behind it.

### Skywire: Deterministic Derived Keys

**`3203`** feat(visorconfig)+cli: wallet-like KeyRing for deterministic derived keys introduces a wallet-like KeyRing to the visor config, letting keys be deterministically derived rather than independently generated and stored. This is the mechanism behind the standalone hypervisor's key: a derived child key that's a one-way function of the parent, so a generated `hypervisor.html` can hold its own identity without exposing the visor key it came from.

**`3204`** refactor(visorconfig): drop the skycoin address from KeyRing entries trims the KeyRing entry down, dropping the skycoin address field from each entry — keeping the structure focused on the key material it actually needs rather than carrying a derived address that belongs elsewhere.

### Skywire: dmsg Under TinyGo

**`3199`** feat(tinygo): dmsg client compiles under TinyGo (wasip1/IoT) — Phase 3 is a genuine milestone: the dmsg client now compiles under TinyGo targeting wasip1 and IoT platforms. TinyGo's newer toolchain handles the gob, JSON, and logging paths that were previously assumed to be showstoppers, which opens dmsg toward constrained microcontroller-class targets rather than only full Go runtimes.

Getting there required **`3198`** feat(dmsg)+tinygo: extract QUIC behind an interface; fix two latent QUIC stream bugs. QUIC couldn't come along for the TinyGo ride as-is, so it was extracted behind an interface — letting the client build with or without it depending on target. Isolating QUIC that way also surfaced two latent stream bugs that had been hiding in the coupled code, both fixed here as a direct benefit of the refactor.

### Skywire: A Windows Flake, Squashed

**`3192`** fix(dmsg): deterministic port-hit ordering — fix the Windows TestPortHitTracker flake makes the port-hit tracker's ordering deterministic, eliminating a `TestPortHitTracker` failure that only surfaced on Windows. Nondeterministic ordering in a test is exactly the kind of thing that turns CI red at random and erodes trust in the signal; pinning the order makes the test say what it means.
