+++
date = "2026-03-18"
tags = ["Development", "Skycoin", "Skywire"]
title = "Skywire Development Update — March 18, 2026"
+++

### Skycoin: BIP32 Panic Fixes and Fibercoin CI

**BIP32 panic-to-error conversion** — the `bip32` package used `log.Panic` for error conditions, which would crash the entire process on invalid xpub keys or derivation failures. These were converted to proper error returns so callers can handle them gracefully. New `verifyXpub` and `nextAddress` CLI commands were added for xpub key validation and unused address derivation.

**Fibercoin genesis CI test** — an integration test was added that creates a Fibercoin from scratch in CI: generates a genesis wallet, creates a fiber.toml, starts a daemon, creates the genesis block, distributes coins, and verifies the chain state. This catches regressions in the Fibercoin creation workflow automatically.

**Makefile improvements** — `update-dep` and `sync-upstream-develop` targets were added for easier dependency management and upstream synchronization.

### Skywire: Transport Layer Reliability

**TPD rate limiting** — transport registration was being rate-limited by the TPD, causing registrations to fail silently. The fix adds proper retry logic with backoff to the Address Resolver bind and TPD registration endpoints (#2222).

**Deferred transport registration** — instead of registering transports immediately on creation, registrations are now deferred to the batch re-registration loop that runs every 90 seconds. This reduces load on the TPD and prevents registration storms during visor startup (#2223).

**Batch TPD deletions and STCP support** — transport deletions are now batched instead of one-at-a-time, STCP (plain TCP without hole-punching) is now supported as a transport type, transport statistics (count by type, unique visors) were added, and STCPR retry logic was improved (#2224).

**Skychat fix** — the `--addr` flag parsing for skychat was broken, and proxy start failures weren't showing the underlying app error. Both fixed (#2225).

These transport layer improvements collectively make the Skywire network more resilient — transports are registered more reliably, the TPD is under less load, and operators can see transport statistics from the CLI.
