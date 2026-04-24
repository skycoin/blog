+++
date = "2026-04-16"
tags = ["Development", "Skywire"]
title = "Development Update — April 16"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Skywire: CLI Refactor and Skynet Integration

PR #2313 is one of the largest single changes in recent Skywire history — a complete restructuring of the CLI, a new deployment configuration system, and the foundations of the skynet integration.

#### CLI Directory Reorganization

The command structure was reorganized for clarity:

- `cmd/dmsg-commands` -> `cmd/dmsg` — DMSG-specific commands
- Services moved to `cmd/svc/` — all deployment service binaries
- Utilities moved to `cmd/util/` — helper tools
- `cmd/skywirevisormobile` removed — dead Android scaffold that was never completed

Cobra command groups introduced across all command trees: `skywire cli` now has 8 groups (Network, Transports, DMSG, Visor, Services, Utilities, Config, Debug), `visor` has 5, `tp` has 3. The flat list of 60+ commands is now navigable.

A new `help` command with `-r` (recursive tree), `-t` (full tree), and `-d` (documentation) flags replaces the old standalone tree/doc generation scripts. All command README files regenerated.

#### Deployment Configuration System

**`deployment.DeployConfig`** — a unified JSON config format for deployment services. Instead of scattering configuration across environment variables, compose files, and command flags, a single `deploy.json` file describes the entire deployment: service URLs, public keys, DMSG servers, per-service operational config (ports, Redis URLs, TTLs, pprof), and secret key file paths.

**`deployment.Keyring`** — a single encrypted file holding all public/secret key pairs for a deployment (services, DMSG servers, route setup nodes, transport setup nodes, survey whitelist, network monitors, reward system). Can export individual keyfiles and print public keys for sharing.

#### Uptime CLI

New `ut` subcommands (`sd`, `mdisc`, `tpd`) with a shared factory for querying uptime data from any of the three discovery services. Timeline graph mode (`-T`, `--per-day`, `--hours N`) renders the v3 bitmap data as shaded hourly blocks — a visual representation of visor uptime directly in the terminal.

**`tp` commands switched from standalone uptime tracker to TPD** — all transport commands that queried the standalone uptime tracker now query the TPD's integrated uptime endpoint instead. The TPD is the authoritative source since transport re-registration is the primary heartbeat.

**POST `/transports/edges`** added to TPD — accepts an array of PK hex strings and returns all transports involving those PKs. More efficient than fetching all transports when only specific visors are needed.

#### Data Fetch Optimization

The `tp add` command was one of the heaviest CLI operations, fetching the entire transport list and the entire DMSG discovery entry list just to check a few PKs. Three rounds of optimization:

1. **Replace `/all-transports` with `/all-transports/per-key-stats`** — the command only needs transport counts per visor, not full entries. Orders of magnitude smaller.
2. **POST `/dmsg-discovery/entries/batch`** — fetch entries for specific PKs instead of all entries.
3. **Remove dmsg discovery pre-check entirely** — the visor's DialStream already returns "entry not found" with a clear error. The pre-check was a redundant HTTP round-trip.

#### DMSG Probe Command

**`skywire cli dmsg probe <pk> <port>`** — explicitly test DMSG port reachability for any PK. The noise handshake completing confirms a listener is active on that port. Reports reachable/unreachable with latency.

`tp add` now probes the destination on DMSG port 136 before establishing transports. If route setup can't reach the destination, the transport would be useless. `--no-probe` disables.

Standalone mode (`-s` flag) creates an ephemeral DMSG client for probing without a running visor.

#### Circuit Breaker Fix

**Source-side dial failures no longer poison the destination's breaker.** A new `DialError` type carries the failed PK through the error chain; the collector checks it against src/dst before tripping. This fixed a production pathology where popular public visors were blocked for hours because flaky source visors were tripping the destination's breaker.

#### E2E and CI

**`GODEBUG=madvdontneed=1`** added to all Go service containers — without this, Go uses `MADV_FREE` which marks pages as reclaimable but the OS doesn't actually reclaim them, making RSS appear to grow indefinitely. The production deployment already had this; now E2E matches.

Deployment compose files updated to match production, with dependency-ordered startup stages to avoid healthcheck timeouts on dual-core CI runners.
