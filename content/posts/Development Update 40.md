+++
aliases = ["/development-updates/development-update-40/"]
date = "2014-10-17"
draft = true
tags = ["Development", "Consensus"]
title = "Development Update #40: Obelisk Testing"

+++
## Consensus Simulation:

Here is basic python simulation of the Skycoin consensus process http://pastebin.com/5DJ9d29D

We don't have much time for academic details until its done, but found that Ben-Or's consensus process could be modeled used a mathematical model called a "spin glass". https://en.wikipedia.org/wiki/Spin_glass

Each node has a state. Each node is subscribed to a subset of nodes in the network. There is a local function (a function of the node's state and the state of the nodes it is subscribed to) that can be called "energy". The "energy" of the network is the sum of the energy of each node. The network has achieved consensus (all nodes are in the same state), when the energy is minimized. A node changes its state at each round, to minimize its energy function. Through local energy minimization, it can be proved that the global energy reaches a minimum within a finite time bound for a particular type of network topology and update rule.

Spin glass are mathematically equivalent to 2-SAT/3-SAT optimization problems and several messaging passing algorithms on graphs have been proposed with known scaling laws and performance guarantees. This leads into analogies of Belief Propagation and Survey Propagation, where nodes pass more powerful state information to each other and the network can reach a convergent state faster. Normally, it can require exponential time for a network to reach the ground state if the energy function is too complicated (3-SAT). However, in Skycoin type consensus network the energy function is a 2-SAT problem at worse and actually more trivial than that (convergence through local hill climbing). Worse case network topology for 2-SAT makes number of rounds to convergence linear in the number of nodes (linear time in number of rounds for distributed process of N nodes, but quadratic time big O runtime for a centralized process). For "average" random graph the problem appears to be trivial and the system reaches the minimum through message passing, extremely quickly for even most basic stochastic local hill climbing update rule.

We do not have a proof yet, but the time to consensus seems to scales no worse than the square root of the number of nodes for a random graph at worse, but is usually logarithmic in the number of nodes in the network for most update rules. For a graph with a power law connection rule with preferential attachment, the convergence time appears very good in simulation. It does not change noticeably with graph size.

We have found that almost all the update rules for message passing result in network convergence. However, some rules are not "robust" in the sense that a relatively small number of colluding nodes are able to prevent network convergence and delay convergence indefinitely. In the real world, this may not matter because the required tie condition occurs rarely (worse case) and nodes blocking convergence would be detected and people would remove them from their trust lists. Some rule sets result in faster convergence, but may make it easier for malicious nodes to influence the network.

There are suggestions that there exist messages with augmented state information that would allow faster convergence and allow a node to partition the nodes they are following into two sets and apply meta-rules for adding/removing node relationships, expelling "bad" nodes to a disconnected/disjoint sub-graph.

There will be many changes after launch. This is a whole new area that needs work.

## Measuring the Influence of Nodes

In Bitcoin, the two largest mining pools completely control the network. Together they control 51% of the hash rate and could attack the network, exchanges and gambling sites if they chose to. Mining has led to a severe concentration of power in the hands of a small group. The number of people who must collude to attack the network is much smaller than Satoshi intended.

In Skycoin the objective is to keep network control decentralized enough that a successful attack requires collusion of at-least a few hundred highly respected and trusted people (an unlikely conspiracy) and then minimizing the scope of damage that could result even then.

We need a measure of power or influence, in the Skycoin network, that allows us to compute whether a sub-graph of nodes has enough influence to carry out an attack in collusion. We would also like a visible measure of power of individual nodes, so that people can re-balance their node subscriptions to prevent any node in the network from obtaining too much influence.

We believe the influence of a node in the simple consensus system, can be approximated well using a page rank type algorithm. The link adjacency matrix is constructed, such that A_ij equals 1 if node i subscribes to node j and is zero otherwise. We normalize each row to 1 to get the modified link adjacency matrix. The "page rank" or power rating of the ith node is the ith entry of the dominate eigenvector of the modified adjacency matrix for the network graph.

The dominant eigenvector of the modified link adjacency matrix A, can be quickly computed by choosing a random vector, applying A to it by multiplication, normalizing the result and repeating successively with the resulting vector as the new input, until convergence.
Example `x <- A*x / ||A*x||, while || x - (A*x / ||A*x||) || < ε  (multiply A*x, normalize result, feed it back in)`

This simple metric gives an approximate ordering of the most trusted and influential nodes in the network.

## Development News

I am not sure what is left until the ICO. I think the Python scripts are done.
- python scripts
- verify that loading deterministic wallet loading is working in the GUI
- start distribution?

There is a split between the active development branch and the ICO branch because of a networking library golang dependency. The distribution branch daemon wont compile with the updated networking library and the new Daemon is not ready to replace the Daemon implementation in the distribution branch. However, this should not affect the distribution  as the existing client should still compile and run. Doing a huge refactor instead of a series of very small refactors that kept the software working was a major mistake and setback.

The darknet prototype is now running over Tox. Tox allows communication via public key, has UDP hole-punch working and has good binary data performance and latency. Using Tox as start point will allow us to get a prototype working faster and defer implementing public key to IP address DHT look-up. It also allows back-communication to distributed service servers over the darknet, before the asynchronous messaging implementation is done (which was a major problem/hurdle for implementing darknet application servers).

In a typical darknet application, you have a website with static pages. The public key owning the pages signs the data with their private key and the data is replicated peer-to-peer between the subscribers to the application. This is good for publishing static content and files. However, sometimes you need to make an API call to the application server (such as updating a wiki page). It was possible to subscribe, but not to communicate back to the public key controlling the server. Now the application can give a Tox public key that can be used as a communication end-point for API calls on the application server.

Skycoin distributed applications previously used Ether, then Aether but now uses Merkle-DAG as the standard format. Implementation documentation and the Merkle-DAG spec is being written up now.

Merkle-DAG is Skycoin's distributed file system. Merkle-DAG is like Bitorrent, but lets you make updates to files after publication. You generate a public key, then sign updates with your private key. The updates are replicated peer-to-peer between subscribers. Merkle-DAG replaces the ad-hoc replication that was previously used for publishing personal block-chains and distributed applications.