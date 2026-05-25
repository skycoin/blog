+++
date = "2026-05-25"
tags = ["Skywire", "Architecture"]
title = "Skywire as a Personal Fleet Substrate"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

Most discussions of "distributed computing" reach for the wrong frame when applied to a personal cluster of machines you actually own. The Hadoop / Spark / Kubernetes mental model assumes you have a homogeneous workload that splits cleanly across many workers — the "parallelize one big problem" shape. For most personal infrastructure, that workload doesn't exist. You don't have terabytes of data to process or a million-row sweep to chew through every night.

What you almost certainly *do* have, if you're reading this, is more than one machine you trust, scattered across rooms or sites, that you'd like to act in coordination — without inviting third parties (Slack, Tailscale-the-company, AWS) into the trust boundary.

A working name for that posture: **fleet computing**. The machines are yours. The trust is yours. The work is heterogeneous. The substrate's value is letting them collaborate as a single namespace under a single identity, not parallelizing one big task.

A claim that's easy to make and harder to substantiate: skywire is already, today, an unusually complete fleet substrate. This post is mostly about why, and what's actually novel about how it's put together.

### Layer-zero coherence

In a typical "self-hosted with N machines" stack, every layer has its own identity model:

- **Network reachability**: Tailscale or Headscale, with its own account, its own ACLs, its own ephemeral certificates.
- **Remote control**: SSH, with its own per-host known-hosts file, its own per-user `~/.ssh/authorized_keys`.
- **File transfer**: SCP / rsync over the above, or syncthing with its own device IDs.
- **Coordination / human–human or agent–agent comms**: Slack / Matrix / Discord, each with their own identity layer, account model, and trust assumptions.
- **Programmatic remote ops**: Ansible / Nix-deploy / Salt, each layered on top of the SSH identity.

Each of these layers is bolted onto the next. The identity of "this machine," "this user," "this agent," and "this task instruction" lives in five different systems, all of which require their own pairing, key management, and breach-impact analysis.

Skywire collapses these. Every visor has a single ed25519 public key. That key:

- *Is* the network identity (dmsg-discovery is keyed by it; transports are addressed by it; routes resolve to it).
- *Is* the authentication for remote operations (dmsgpty whitelist, hypervisor relationships, visor-RPC listeners all gate on it).
- *Is* the chat identity (skychat messages are signed by it).
- *Is* the application identity (apps inherit their host visor's identity for sub-operations).
- *Is* the storage attestation identity (CXO-stored objects are signed by their publisher's PK).

There is one identity, one key, one trust decision. When PK X sends a message in skychat, that's the same PK that would dial your visor's RPC, the same PK whose dmsg streams you'd accept, and the same PK that would sign data published into the shared storage layer. **The coordination plane, the execution path, and the result attestation share an identity.**

This is unusual. Most distributed systems can't do this because they were built on substrates that didn't have an identity layer; the identity got bolted on afterward, separately at each level. The trust-coherence property is something you have to design from the bottom up.

### What this enables that's hard to do otherwise

**Trust-by-identity all the way down.** When an agent on visor A asks an agent on visor B to perform a task, the request is signed by A's identity, the conn it arrives on is authenticated to A's identity, and A's authorization to ask was decided once (B's whitelist). No tokens to mint or rotate, no per-task auth dance, no separate authentication for the chat layer vs. the execution layer. Either you trust PK A or you don't.

**Trivial mutual authentication.** Two operators can establish a peering relationship by exchanging public keys — once. From that point on, either can `--via dmsg://<other-pk> visor info` (or any other CLI command), assuming the other has whitelisted them in their dmsgpty config. No invitations, no shared third-party account, no recurring credential maintenance.

**Mesh-native group communication.** Skychat is, at first glance, a chat application. Look at it from another angle and it's a peer-to-peer multi-party signed-message bus with persistence. Agents — software ones, AI-driven ones, or human ones — can join a skychat group, sign messages with the visor's identity, and use the chat log as an auditable coordination record. There is no "channel" controlled by a hosting company; there is no rate-limiting backplane; there is no "your account was suspended."

**File transfer with native authentication.** `skywire cli dmsg curl dmsg://<pk>:80/path` fetches a file from another visor using the same identity model that gates every other operation. Replace SCP and rsync with an URL scheme that's authenticated by the same PK system as everything else. Each visor's HTTP-over-dmsg log server is, in effect, a personal file server with auth built in.

**Programmatic fleet control.** The CLI's recent `--via dmsg://<pk>` and `--via skynet://<pk>` flags let any `skywire cli` command target a remote visor through the local visor's identity. The local visor is the bridge; the remote sees the local PK, applies its whitelist, and either accepts or rejects. From a script, looping over your fleet to apply an operation across all of it is a `for` loop. No inventory file, no per-host credential, no ansible-vault.

### The agent-grid use case

Now to the use case that genuinely benefits from a personal fleet, today, in 2026, in a way that wasn't true a few years ago: an agent grid.

Software agents — increasingly AI-driven ones — are naturally specialized, naturally communicate over text or structured messages, and naturally benefit from isolation between agents (a misbehaving agent shouldn't take its peers down). They're light enough to fit on small ARM boards, but they want to be many and distinct.

Most agent frameworks today assume the agents share a backplane: a centralized broker, a hosted API, an `agents` namespace inside one process. That centralization happens because the substrates the frameworks were built on don't have native peer-to-peer authenticated identity, so it's easier to invent one centrally than to compose with what already exists.

Skywire flips that. An agent running on visor A and an agent running on visor B can:

- Address each other by PK (no global naming authority).
- Send signed messages over skychat (no hosted chat backplane).
- Delegate work that the receiver can cryptographically attribute to the sender.
- Build a trust graph over time (PK X has reliably done work Y; lift my whitelist for it).
- Transfer artifacts between machines without re-authenticating each transfer.

That is, materially, a peer-to-peer agent-communication substrate with native cryptographic identity. The closest analogues are specialty p2p projects (Holochain, IPFS, certain Matrix federations) that all had to build their own identity layer because they didn't have one. Skywire already shipped one.

A natural shape for an agent grid on a personal cluster:

- One visor runs a long-running research agent (web browsing, paper reading, summarization). Its job is to maintain a personal knowledge base.
- Another runs a code-execution agent — sandboxed, can run scripts you (or other agents) tell it to. It accepts work over `--via` from PKs in its whitelist.
- A third hosts a personal-data agent: notes, calendar, mail, indexed and queryable. Read-only to most peers; read-write to a specific operator PK.
- A fourth hosts the coordinator: parses natural-language requests from you, dispatches to the others over skychat, aggregates results.

Each agent has its own state, its own permissions, its own failure mode. If the code-execution agent crashes, the others keep working. If you suspect one's been compromised, you can revoke its PK from the whitelists without revoking the others. The fleet shape *is* the security model.

Critically, this is not a use case that fits on one big machine: putting all four agents in one process on one box defeats the isolation that makes the architecture work. It wants to be distributed across small machines.

It's also not a use case that fits well on a hosted-broker model: the coordinator's natural-language requests and the resulting orchestration are inherently personal, and you don't want them going through someone else's API gateway.

### Fleet computing as a frame

This is the rotation that's worth making explicit. The interesting frame for a personal cluster is not "how do I split a big workload?" It's "how do I get N machines to act as one personal infrastructure?"

Concrete shapes:

- **Distributed services**: each machine runs a different role. Mail server on one, git server on another, media server on a third, monitoring on a fourth. Distribution as isolation, not as scaling. One compromised service doesn't take everything down. Replace a failed board without rebuilding the whole stack.

- **Resilient personal storage**: replicate your important state across all N machines, signed by you, addressable through the mesh. CXO provides the primitive; the substrate handles transport and identity. The cluster behaves as a single resilient namespace, not as a single point of failure.

- **Network presence diversity**: machines in different geographic locations, with different network postures (different ISPs, different uptimes). When one is unreachable from somewhere on the internet, another usually isn't. Most "what's on my home network" services can't do this.

- **Distributed development environment**: code on the laptop, build on the cluster, run on the machine with the right capability (the one with the GPU, or the one with the embedded-arm toolchain, or the one with the dataset already mounted).

- **Agent grid**: the case above.

- **Mesh-resident applications**: things you run that simply could not run on a single machine — multi-replica eventually-consistent personal services, distributed games, federated tools.

None of these are "distributed computing" in the Hadoop sense. All of them are "fleet computing" in a sense that's genuinely useful for someone with more than one machine they trust.

### What's actually missing

Almost nothing at the protocol level. The substrate has identity, authenticated transport (dmsg + skywire-routed), authorized remote exec (dmsgpty), authorized remote RPC (`--via` over either transport, all 167 visor methods), file transfer (dmsg HTTP), and signed multi-party messaging (skychat). A distributed object store (CXO) is sitting there for shared state.

What's missing is *convention and tooling on top of these primitives.* Specifically:

- A standard message convention for "task," "claim," "result" over skychat — so agents from different authors can collaborate without inventing their own protocol.
- A small library/CLI subcommand that implements the convention — `skywire cli task post`, `skywire cli task await`, etc.
- Multi-select operations in the hypervisor UI ("start this app on these tagged visors").
- Documented patterns for the use cases above, so people don't have to rediscover them.

This is convention, not infrastructure. The interesting parts are already shipped.

### Closing thought

The reason this matters is the present moment. The agent-driven workflow — multiple specialized software agents collaborating to do work — is the first use case in years that *naturally* wants a personal multi-machine substrate AND has identity / authorization / transport demands that match what skywire already provides. The big-tech-built substrates handle this with centralized accounts and hosted APIs. The right substrate for *personal* agent grids is one with peer-to-peer authenticated identity baked in from layer zero, where the same key signs the chat message, accepts the conn, and signs the result.

That substrate exists. It mostly hasn't been put to use yet because the workloads that justify it are only now becoming common enough to be worth building tooling for. The hardware (Skyminer; any small cluster) is there. The protocol stack (skywire, dmsg, skywire-routed, CXO, skychat) is there. What's left is figuring out what we want to actually *do* with eight machines that trust each other and a substrate that lets them collaborate without trusting anyone else.

The answer to that is probably going to come from playing with it, not from designing it on paper. The encouraging thing is that the substrate is mature enough to play with.
