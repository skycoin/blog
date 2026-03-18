+++
aliases = ["/development-updates/development-update-54/"]
date = "2015-01-25"
draft = true
tags = ["Development", "Consensus"]
title = "Development Update #54: Obelisk: a Web-of-Trust Consensus"

+++
### Consensus Algorithm Update:

**White paper Draft**: http://128.199.188.22:1337/consensus.pdf
**Graphs**: http://128.199.188.22:1337/

![](/img/dev-update-54-1.png)

This is a histogram of convergence times. The x-axis is "rounds" the network takes to reach consensus (all nodes in the same state) for a single round consensus process.  The top algorithm is hill climbing, the middle algorithm is simulated annealing and the bottom algorithm is changing randomly between hill climbing and simulated annealing.

There is a network of nodes. Each node follows a number of other nodes. Each node has a state 0 or 1. Each node sets its state based upon randomness and the state of the nodes it is following. The process is simulated in a python discrete event simulator and includes network latency.

The network of the graph used in simulation is a real world social network, taken from the Stanford Wikipedia admin dataset.

We see that the top graph (hill climbing) converges within 10 rounds and usually in less than 5 rounds. However, there is a probability that consensus is not achieved within 45 rounds (The bar on the right on the first graph). The network reaches a local minimum and gets stuck there and never convergences, but only rarely.

One round for a network of global servers, is about 250 ms (the network latency latency between Canada and Australia).  Convergence in 5 rounds, means block times of 1 second.

For the second graph (simulated annealing), we see that there is a constant probability of convergence. This is because of "Symmetry Breaking". The simulated annealing process is driven by the "Delta" at each node. The network starts with half the nodes as 0s and half as 1s and so the delta is small. As the network becomes biased, the network converges exponentially quickly to one state or the other state. The symmetry breaking process is a random walk and can take arbitrarily long.

In the third graph (each node switches random between simulated annealing and hill climbing). The hill climbing breaks the symmetry and the simulated annealing prevents the network from getting stuck in a local minimum.

This is a graph of the commutative convergence probability function for each algorithm. Even with a real world social network graph, the probability of convergence for algorithm 3 is 1 for 20 rounds. This corresponds to 4 second blocks. The majority of blocks will achieve consensus within one second. This is competitive with credit card transactions. Bitcoin transaction confirmation times are 10 minutes.

![](/img/dev-update-54-2.png)

There is an even faster one round consensus algorithm, based upon the method of 1-Replica Symmetry Breaking and the cavity method for spin glass systems in statistical mechanics. The existing algorithm is fast enough for now.

Consensus is the idea that the network reaches a ground state. There is a global energy function of all nodes. There is a local energy function for each individual node, which depends on the state of its neighbors in the graph. The network has minimum energy and is in the ground state when all nodes are in the same state (consensus). Each node has a local view of the network and acting independently achieve global consensus.

In Bitcoin the blockchain which required the most hashing to produce is the consensus chain. When consensus changes a fork becomes the longest blockchain in the tree of blockchains. A reorganization happens and transactions may be invalidated (double spending).

In Skycoin, malicious nodes can slow down or manipulate the consensus process but cannot revoke consensus of previous blocks (under most circumstances). A large enough group of influential and colluding nodes can completely control which blocks are accepted or rejected. The attacking nodes, however cannot revocate previous consensus decisions.

The consensus algorithm is based upon Ben-Ors randomized decision process over a Web of Trust (WoT) network. The nodes each node is subscribed to, represents the friends (personal contacts), peers and institutions (merchants, exchanges, websites, services) the user believes are trustworthy and reliable. Instead of spreading consensus across two or three mining pools which control 51% of the hash rate (three institutions), consensus is distributed across several dozen or several hundred of high influence nodes with network centrality which must be individually subverted or collude to influence the network.

In Skycoin, nocd trust relationships can be modified to marginalize nodes which have been shown to be involved in attacks of the network. Therefore, control of the network can be reclaimed if it falls into the control of a malicious faction. Nodes lose the influence required for a successful attack, once they have acted maliciously, as people will remove those nodes from their trust list as a result of an attack. In Bitcoin, hashing power cannot be removed from people who exploit majority control of the network.

Bitcoin has no mechanism to recover once a 51% attack occurs. Once a 51% attack occurs it will lower the price of Bitcoin, hash rate will decrease as unprofitable miners shut off equipment and the cost of subsequent attacks will be reduced. Bitcoin may suffer death spiral under a successful attack. This has not occurred with Bitcoin yet, although has occurred in several alt-coins.

The primitives in Skycoin's consensus process relay heavily on "randomization. It is impossible to guarantee consensus within a finite amount of time or guarantee the absence of blockchain forks (randomization), but the probability approaches zero exponentially quickly in time.

###### The final implementation will have multiple tiers of transaction and consensus mutability.
- There is a small probability of a revocation for a transaction in a 0-confirmation block.
- The probability of a revocation of a block decreases exponentially in the number of confirmations
- After N-confirmations the block cannot be revoked in the consensus process without introducing a fork (consensus diversity). The network will stop and wait rather than continuing if alternative candidates remain which have unresolved fork candidates to block depth N/2.
- Even if a fork occurs, it will not affect the majority of transactions or outputs. Most transactions and outputs will exist on both forks and there is minimal ability of an active attacker to modify the validity of transaction chains they were not involved in.
- There is a federated mutability check-point every M blocks, once the block has reached sufficient depth. This includes a hash of the full blockchain state and unspent output set. A node issuing a checkpoint should subscribe to several thousands nodes in the network (possibly all nodes) and certify global consensus. These will probably be run by developers and exchanges. An individual node should compare the output of several independent checkpoint issuing nodes. I am having trouble imaging an attack that could result retroactively introduce a fork that occurs before the last check-point. If 80% of the nodes in the network disappear because of a netsplit or nuclear war, it becomes more important to avoid issuing a checkpoint which misrepresents confidence in the network state.

## Federation vs Decentralization

Skycoin's architecture relies heavily on "federalization", which is a form of decentralization but different than Bitcoin's form of decentralization, Examples:

##### Banking:
- Centralized: a global central bank that issues money and clears all transactions through hierarchical sub-banks
- Federated: each bank issues their own notes, redeemable against gold (free banking)
- Federation to the user level: every user issues their own notes and credit to other users, every user is a bank (Ripple-pay (not ripple))

##### Communications:
- Centralized: AIM/QQ, a centralized entity which forwards all communications between users
- Federated: Email, a network of email servers where each server is run by a different person, each of which support multiple users as clients. users@domain.com . Users have a choice of servers and can run their own server if they do not trust any existing server.
- Federation to user level: Tox, each user communicates directly with their peers

"Decentralized" and "peer to peer" are vague. A protocol can be federated but have peer-to-peer replication. A protocol can both be centralized on one level, federated on another level and peer-to-peer on another level. Decentralization or federation at the user level is not always superior to decentralization either.

##### File Sharing:
- Centralized: FTP server (which is actually federated, as a protocol, but is not federated as a source of a particular file!)
- Federated: Torrents. Federation of torrent file distribution (no global centralized index of torrent files, but anyone can host an index of torrent files. Choice of multiple directories of torrent files), but peer-to-peer replication of files within an individual torrent
- Peer-to-peer: Kazaa. Decentralized index, decentralized searching, decentralized downloading from peers. Notice that Kazaa is completely "decentralized" but is not as robust, useful or survivable as Torrents, because it did not have a mechanism for curation. Here, decentralization of everything was inferior to federation, because the completely decentralized service (Kazaa) was flooded with junk files, while the federated service (Torrent Trackers) was able to maintain high quality files, without creating a single point of failure which could destroy the network. Kazaa was quickly destroyed, but even destroying a single directory such as Piratebay or Demonoid has been frustrating and resource intensive. What.cd replaced its predecessor within hours of the original being taken down.

In Skycoin federation means that there are privileged servers that the client must trust (such as the mutability checkpoint servers). However, each client has a choice of which servers to trust. You can run your own server or if you are running an exchange or bank, you should be running your own checkpoint server and you should also be checking against external servers. You should only accept the consensus if there is unanimous and uncontested agreement.

This is similar to N of M signatures. You choose a list of N people and you only accept something if all N agree. With 10 servers a successful attack on 9 servers will fail as the client will detect a discrepancy. For a bank or exchange, this would mean freezing transactions until issue is resolved by a human. This represents escalation from algorithmic resolution to human judgement.

Federation enters into the design of Skycoins in several places. If you have a common protocol for exchanges and each exchange is a public key, you put a list of five public keys (exchanges) on the list of exchanges you "trust". Then you look for the best Dogecoin/Bitcoin exchange rate across all five exchanges and can execute at the best quote across the five exchanges.

In Skywire, public keys replace IP addresses. This is a cryptographic version of DNS. A public key uniquely identifies a service, server, entity or communication end-point. The protocol is immune to man-in-middle attacks and no one can impersonate a service without obtaining the private-key for the service.

## Multi-round consensus

We are now working on research of the multi-round "tree consensus" algorithm. Tree consensus algorithm is the multi-block consensus process and will be the algorithm implemented for Skycoin. The tree-consensus algorithm supports consensus process concurrency (consensus debate on multiple chains concurrently) and consensus diversity (there may be one or more "consensus" chains. A  rare and severe netsplit condition or successful attack may introduce forks where the preferred consensus candidate should be resolved by hand by each individual node operator. If a transaction has been executed on all consensus chains, then it has been executed for all purposes).

Consensus diversity means that if there are five forks open for consensus and your transaction has been executed on all five forks, you can safely spend the outputs of the transaction without risk of it being invalidated and the output made retroactively unspendable on any of the forks. This is a notion of "blockchain fork forward security". Forks can be introduced in future, but not retroactively. This is enforced by all honest nodes in the network through use of local timestamping (later distributed time stamping) of block publication time and strong insistence against accepting a block into the census set which could not have existed at the block publication time.

Security of local time stamping relies on several assumptions. The most important assumption is that each node has at-least one node it is connected to, that is not a Sybil attack node. If a node is connected to 10 nodes and 9 of the nodes are Sybil attack nodes that may arbitrarily delay block propagation. as long as 1 node is not in the Sybil set then the timestamps will be reasonably accurate.

## Road Map

1. Paper on single round consensus
2. Research on multi-round tree consensus and python simulation
3. Some aspects of skywire, moving Visor on top of skywire
4. Implement tree consensus in go and integrate into Skycoin
5. Misc. infrastructure. Check-pointing, network monitoring, emergency alert system, merkle-DAG for parallel block downloads

#1 is in progress. #2 and #3 are happening concurrency. #5 will have to be handled by the community because we don't have time.