+++
date = "2026-03-19"
tags = ["Development", "Skycoin"]
title = "Development Update — March 19"
+++

### Skycoin: BIP44 Chain Selection and Release Build Fixes

**BIP44 chain selection** — the API, CLI, and web wallet GUI now support selecting different BIP44 derivation chains (external vs. internal/change addresses). This gives users more control over address generation for privacy-conscious workflows — change addresses can be generated separately from receiving addresses, matching standard Bitcoin wallet behavior (#2817).

**Release build hardening** — the `cmd/release` binary (which includes hardware wallet support via libusb/cgo) was fixed to compile correctly on platforms where cgo is available and degrade gracefully where it isn't. The `DisallowUnknownFields` restriction was removed from the API client JSON decoder, which was causing failures when the API returned fields the client didn't expect — a forward-compatibility issue that would break older clients talking to newer nodes (#2820).

**Dependency updates** — `fast-xml-parser` was bumped from 5.5.5 to 5.5.6 in the explorer to address a security advisory.
