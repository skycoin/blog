+++
date = "2026-03-21"
tags = ["Announcements", "Skywire"]
title = "Route Multiplexing in Skywire"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### Route Multiplexing

Skywire v1.3.37 introduces route multiplexing — the ability to spread a single connection's traffic across multiple transports simultaneously. When a visor has more than one transport to the same peer (e.g., one STCPR and one SUDPH transport), the mux layer can distribute packets across all of them, improving throughput and resilience.

This is the first phase of a multi-transport routing capability that has been a long-term goal for Skywire.

---

### How It Works

Previously, a RouteGroup (the abstraction that represents a connection between two visors) would use a single transport for all traffic. If that transport degraded or failed, the connection was lost.

With the new mux layer, a RouteGroup can use **multiple transports in parallel**:

1. **Outgoing packets are sequenced** — each packet gets a monotonically increasing sequence number before being sent
2. **Transport selection** — the mux picks which transport to send each packet over, using latency-weighted selection when latency data is available, falling back to round-robin
3. **Reordering on receive** — since packets may arrive out of order (different transports have different latencies), a reorder buffer reassembles them in sequence before delivering to the application
4. **SACK-based retransmission** — Selective Acknowledgment tracks which packets the receiver has gotten. When gaps are detected, the sender retransmits only the missing packets from a retransmission buffer

#### Transport Selection

The transport selector builds a weighted schedule based on measured transport latencies. Faster transports (lower latency) get proportionally more packets. When latency data isn't available — for example, right after a transport is established — it falls back to equal-weight round-robin.

The weights are rebuilt periodically and when transports change (added, removed, or closed).

#### Packet Reordering

When packets are spread across transports with different latencies, they arrive out of order. The reorder buffer holds packets until their predecessors arrive, then delivers a contiguous batch in sequence. A configurable maximum gap (default 64 packets) prevents unbounded buffering — if the gap gets too large, buffered packets are force-flushed in order.

The common case (in-order arrival over a single transport) requires no buffering and no allocation.

#### Selective Acknowledgment (SACK)

SACK provides reliable delivery without the overhead of per-packet ACKs:

- The **receiver** tracks which sequence numbers it has received and generates a SACK: the last contiguous sequence number plus a 64-bit bitmap of received packets beyond that point
- The **sender** holds unacknowledged packets in a retransmission buffer and, on receiving a SACK, can determine exactly which packets were lost and retransmit only those
- SACK is negotiated during the route handshake — both sides must advertise the capability for it to be enabled

---

### Architecture

The mux layer is implemented as a separate `routeMux` type that is composed into the existing `RouteGroup`:

```text
RouteGroup (net.Conn over a single route)
  └── routeMux (optional, nil when mux not negotiated)
        ├── transportSelector   (latency-weighted transport picking)
        ├── reorderBuffer       (in-order reassembly)
        ├── sackTracker         (receiver: tracks received seqs)
        └── retxBuffer          (sender: holds unACKed packets)
```

Key design decisions:

- **Lazy initialization** — the mux and its buffers are only allocated when mux capability is negotiated during the route handshake. Non-mux connections (the common case today) have zero overhead.
- **No wire format changes** — sequencing and SACK use the existing packet format with a sequence number field. No protocol version bump is needed.
- **No exported API changes** — RouteGroup still implements `net.Conn`. Applications (VPN, proxy, Skynet) don't need any changes.

---

### Related Improvements

This release also includes several stability fixes to the routing layer that were discovered during mux development and testing:

- **Accept loop crash fix** — the route accept loop would permanently die when encountering a stale route with a missing transport. Now it distinguishes fatal errors from per-route errors and continues accepting on transient failures.
- **Ping route bypass** — latency probe routes (used to measure transport RTT) were flooding the accept queue, blocking application routes (proxy, VPN) for up to 30 seconds. They now bypass the accept queue and are handled directly.
- **Ping timeout** — ping route handshakes now have a 10-second timeout to prevent goroutine accumulation.
- **Shutdown fix** — the accept loop no longer spins on shutdown; closed connections are treated as shutdown signals.

---

### Status

Route multiplexing has passed end-to-end CI tests but has not yet been extensively tested in production. The mux capability is negotiated per-connection — visors that don't support it continue to work exactly as before with single-transport routes.

This is included in [Skywire v1.3.37](https://github.com/skycoin/skywire/releases/tag/v1.3.37).

See also: [Skywire v1.3.37 Released](/posts/skywire-v1.3.37/) | [Skywire: One Binary, Everything You Need](/posts/skywire-unified-binary/)
