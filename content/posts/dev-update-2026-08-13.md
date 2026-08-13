+++
date = "2026-08-13"
tags = ["Development", "Skywire"]
title = "Development Update — August 13"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

A quiet day after yesterday's large one, with a single release-hygiene fix on the mobile side — the kind of thing that is invisible until a version string is wrong in the field, and then matters.

### Skywire: Correct Version Stamping on Mobile

**`3865`** fix(config): derive the visor version from release tags, not the mobile-v* APK tag corrects a wrong version being written into the visor config on mobile releases. The Skywire Mobile build carries its own `mobile-v*` APK tag, and the version-derivation logic was reading *that* tag when stamping the embedded visor's version — so a released build reported the mobile app's tag as the visor version rather than the actual Skywire release it was built from. The fix teaches the version parse (`pkg/visor/visorconfig/parse.go`) and the Makefile to derive the visor version from the release tags proper, ignoring the mobile-specific APK tag, so the config and the visor's self-reported build line agree with the real release across both desktop and mobile packaging.
