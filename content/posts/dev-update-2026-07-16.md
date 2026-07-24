+++
date = "2026-07-16"
tags = ["Development", "Skywire"]
title = "Development Update — July 16"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The discovery and transport-discovery hosts had been running hot — 124% CPU, load hovering around 7 — and the culprit turned out to be the fleet talking to itself too eagerly. A dmsg server re-registers its discovery entry every time a client session comes or goes, and under a busy server that innocent bookkeeping was amplifying into a handshake storm that thrashed the discovery's garbage collector. Today's work bounds the amplifier at both ends.

### Skywire: Taming the Registration Storm

**`3496`** fix(dmsg): bound entry-registration retry + coalesce session-churn re-registration traces the elevated CPU and load on the dmsg-discovery and TPD hosts back to a self-amplifying registration storm. A dmsg *server* carries `AvailableSessions` (`maxSessions − len(sessions)`) in its discovery entry, so every session add or remove nudges the update loop — a server churning clients emits roughly 25 registrations a minute. Each registration is a read-modify-write under optimistic sequence locking, and under contention about two-thirds of them lose the race and come back HTTP 422 "wrong sequence." The old `PutEntry` retried those in a tight, unbounded loop with no backoff — and because every POST/GET over dmsg opens a fresh stream with a full Noise handshake (secp256k1 plus PQ ML-KEM), that crypto allocates heavily, so the retry loop turned one contended update into a handshake storm that GC-thrashed the discovery. The fix works both sides of the problem. First, `PutEntry`'s sequence-conflict loop in `pkg/dmsg/disc/client.go` gets a capped exponential backoff — five attempts, 100ms climbing to 2s — and becomes context-aware, so a persistently-contended entry can no longer spin out a storm. Second, `pkg/dmsg/dmsg/entity_common.go` coalesces nudge-driven server re-registrations to at most one every 10 seconds: `AvailableSessions` is only a soft capacity hint for weighted server selection and doesn't need per-session freshness, and the periodic refresh still keeps it current. The client entry loop needs no equivalent — it already skips updates when its delegated-server set is unchanged. Together these cut discovery and TPD registration load by roughly an order of magnitude with no meaningful loss of entry freshness.
