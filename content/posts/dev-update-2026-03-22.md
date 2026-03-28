+++
date = "2026-03-22"
tags = ["Development", "Skycoin"]
title = "Development Update — March 22"
+++

### Skycoin: Code Quality and Windows Release

A cleanup and hardening day following the v0.28.4 push.

**Internal package restructuring** — the `internal/` directory was eliminated. The `chacha20` package was moved up to a public location and fuzz packages were renamed. This removes Go's `internal/` import restrictions, making these packages available for use by the Skywire vendor and other dependents.

**Cyclomatic complexity reduction** — three functions that had grown unwieldy were refactored: `serve()`, `postProcess()`, and `addressGenCmd()`. Each was broken into smaller, testable functions.

**Viper state isolation** — the fiber config application logic was simplified. Viper state (used for configuration management) was isolated to prevent cross-contamination between tests and between different fiber.toml loads.

**Dead code removal** — unused `help` variable, `tagName` function, deprecated `rand.Seed` calls, unused `metaAccountsHash` constant, and the entire `base58_old.go` file (along with its benchmark and test references) were removed.

**Windows release fix** — the Windows build was updated to keep CGO enabled while excluding the hardware wallet via build tags. Hardware wallet DLLs (`libhidapi-0.dll`, `libusb-1.0.dll`) are now bundled in the archive.

**Flaky test fix** — `TestWalletCreateTransaction` was flaky because test UxOuts used `BkSeq=0`, which could collide with real genesis state. Fixed by using non-zero block sequences.
