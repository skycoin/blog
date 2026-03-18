+++
aliases = ["/development-updates/development-update-59/"]
date = "2015-02-23"
draft = true
tags = ["Development"]
title = "Development Update #59: Consensus and Computer Security Notes"

+++
## Research Note

I do not want to announce anything prematurely, but it may be possible to use VerSum to lock out 51% attacks completely at overkill level. http://people.csail.mit.edu/nickolai/papers/vandenhooff-versum.pdf

Previously we had designed a check pointing system and it appeared to not introduce any edge cases that were exploitable. Instead of doing distributed checkpoints on the program state every few hours or ten thousand blocks, this pushes the check points down to incremental block by block level.

This means some hashes we were intending to put in the block header are redundant and should be pushed to the block wrapper. There are several possible uses for VerSum type block by block incremental checkpoints.

Skycoin recovers from an attack on the network by identification of the attacking nodes and users collectively kicking them off or marginalizing the influence of the attacking nodes. The kicking of bad nodes off the network can be done by hand or it can be automated if it can be done safety. This incremental checkpointing system even if it is not used to prevent attacks that would revert previously executed transactions, may be useful for automatically identifying the bad nodes.

This has to be worked through very carefully to ensure that it would not introduce any edge cases, so will be something we look at for the second generation consensus algorithm implementation. I don't think there is time to fit into this iteration.

I think the existing Skycoin consensus design is 51% attack proof, because the number of nodes required for performing the attack is much larger than the number of mining pools that need to collude and if it occurred, the chain would just fork and run both chains until they were pruned by hand and the bad nodes are kicked off by hand. So it is not clear what the economic incentive for a 51% attack in Skycoin, or why anyone would attempt it. Its more annoying than anything else.

The most important property is that the network quickly recovers and survives. In Bitcoin if someone attacks the network once, they still have enough hashing power to repeatedly attack the network over and over and over again. In Skycoin, the attacker spends a large amount of time building up the trust relationships, then they attack (which may succeed or may fail) then they get their ass kicked off network.

The number of nodes that need to collude to successfully attack is at least the top 2% of the nodes (absolute worst case). With 10,000 nodes in the network, that means 200 people need to collude to merely attempt an attack. In Bitcoin, only the top two or three mining pools need to collude to attack the network.

In Skycoin, even if they succeed in attacking the network, one approach merely forks the network into two concurrent branches and it is resolved by hand, by individual node operators. Attackers branch just gets pruned. This is one technique we are evaluating for second generation Skycoin consensus. The network should never get to the point where this needs to be used.

The ability to survive the very worst attack and keep the ledger running, is very important. We call this "survivability". In Bitcoin a successful attack, would send price down and mining equipment would be shutoff and the next attack would require even less hashing power. So a 51% attack could be a death spiral for Bitcoin, like it has been for other altcoins based upon Bitcoin. In Skycoin the network security does not depend on the coin price and the network quickly continues operation after an attack that would destroy any existing PoW coin.

The second generation Skycoin consensus implementation will not be a change to the consensus algorithm itself, but automating the detection of bad node behavior and trust revocation, to marginalize the bad nodes automatically. I can see a use for the continuous distributed check-pointing system for this purpose. What is also interesting, is that some of these defense and detection systems are independent and can be layered on top of each other.

If the continuous check pointing system works, the number of nodes for a secure network could be reduced to 10 or 15 for an open network that anyone can join. For a closed network, for a central bank running a private ledger on secure hardware we think 3 to 5 nodes in a fully connected topology is sufficient for a secure network, with a sufficient level of redundancy.

## Consensus/Ledger Topologies: bank control vs public control

###### There are different topologies and they have different use cases and security concerns
- single server, with no replication (centralized, SQL database)
- master server, with peer-to-peer slave replication (where we are now)
- peer-to-peer consensus in closed network, with peer-to-peer slave replication (central bank, bank running assets on a private ledger for internal or for customer use. Ripple. Skycoin ledger running on closed network)
- peer-to-peer consensus in open network, with peer-to-peer replication (Bitcoin, where we will be at version 1.0)

The danger is that if we don't solve the last problem, that we will have Bitcoin like systems, but they will be controlled by the banks and not the public. The third topology is a special case of the forth and the security problems are easier. If we have last problem solved, then we we end up with a hybrid system inter-operable of closed an open consensus networks on the same code base.

If the solutions are only extended to the third case, then the banks control the ledgers and can still impose transactions fees as gate keepers and can still charge merchants chargeback fees involuntarily and can still add involuntary debits and fees to customer accounts, such as overdraft fees. That is where the industry is being herded right now and why the consensus problem in open networks needs to be solved. Bitcoin in its current form will be obsolete as soon as those systems are in place, but the system will have been recentralized with banks as the gate keeper.

You might have a banks with ten branches and they each branch runs two servers and all the servers on are a closed consensus network and use the ledger for clearing between the branches and for customers to move digitized assets. So you have a network where there are twenty computers (bank computers) that can create new blocks and determine network consensus. All blocks and transactions are replicated peer-to-peer and there may be 200 computers, but most of them are slaves that replicate transactions/blocks over same system and network and have same internals but are not influencing the network consensus at all.

There are hybrid topologies between the full crypto with peer-to-peer replication and the legacy SQL finantial ledgers. For instance, where the block introduction servers are "closed" and there might be five servers and one of them is a master and there is paxos for fall over and leadership election, but the blockchain/ledger is also replicated peer-to-peer to nodes outside of the closed network (slaves instances, maybe on customer premise).

Then there are fully peer-to-peer systems like Open Transactions, that do not have a central ledger or need replication. We believe that the Bitcoin triple entry accounting has won and that the SQL-master-slave double entry model will die out in mainstream use.

So Skycoin is only concerned with that case. It is also the most difficult case. The Bitlicense requirements put heavy tolls on the decentralized variants like Bitcoin, while exempting gift cards and all use of blockchain technology outside of the walled garden. So blockchain traded gift cards will be completely unregulated, blockchain traded bank products with be completely unregulated, but Bitcoin and other coins will be completely locked down. Coinbase will be required by law to seize coins that are "tainted" because they were sent from an address not registered under the KYC standards.

This is really a question about whether we end up with the Bitcoin technology in a walled garden, with gate keepers or whether it remains decentralized.

___

Survivalability was another design criteria for Skycoin. In Skycoin the consensus wraps the blockchain. If the network is attacked, destroyed, infiltrated, taken over. You just swap out the consensus module and its running again. It cannot be killed. The ledger cannot be shutdown. It does not relay upon DNS, or even IPv4/IPv6. It is more survivable than the Piratebay.

If Bitcoin is attacked at the level of PoW, the network is dead. It cannot recover. Its just dead.

___

## Coin Distribution Technical note: State of Computing in 2015

We tried to use TOX. Had problems with NaCl library missing from debian, so toxcore would not work within docker container in VM. Spent six hours on this. Not spending more time on it.  Bitmessage was under attack with 10 GB/s spam attack last time and was not working. Bitmessage appears to be working again, so we will use that.

We had difficulty syncing Bitmessage and the network may be under attack. If Bitmessage is not working, then we will need to find another communication method. Based on our experience, every system for secure communication that exists is being actively targeted for disruption of service.

Software barely works in 2015. Key crypto packages like NaCl and toxcore have had deb packages for a year but are still not in debian and do not have alternative repositories. Golang dependency and path management is nowhere as easy or reproducible as it is in python right now. Debian packages do not have deterministic builds, so we cannot be assured there are not back doors in the package binaries that are not present in the source.

The state of computer security right now is very bad. This is a bug in PHP. If you send a server a timestamp or date field, it parses it and takes over the server. Or allows private keys to be read out.

- https://github.com/80vul/phpcodz/blob/master/research/pch-020.md

This bug was released yesterday. This is very similar to the types of exploits that would be used to attack Silk Road and identify the services. There are hundreds of bugs like this. Some of them are intentional. Many of these exploits are in the wild for a decade before they are found. These bugs allow bitcoin exchanges and servers running websites like Silk Road to be hacked.

Skycoin is using Golang instead of PHP (MtGox) or C++ (like Bitcoin), so we can guarantee that there are no buffer overflows that will allow computer to be hijacked from the Skycoin client (unlike Bitcoin). At best, an attacker will be able to crash the Skycoin client.

There is no guarantee that there is not an unknown exploit in the Bitcoin client or library dependencies that would allow remote hijacking of the client and theft of Bitcoin from all active Bitcoin clients. The recent vulnerability in the glibc library that allows remote code execution from DNS resolutions, that escaped all protections on remote code execution is evidence that all the standard libraries are backdoored (intentionally or unintentionally) and that achieving security will require fundamental changes to toolchains, compilers and operating systems and not just the patching of individual exploits.

The vulnerabilities found, just in glibc are very worrying.

- https://www.exploit-db.com/search/?action=search&q=GLib

Bitcoin uses OpenSSL which has daily security exploits. Skycoin has its own cryptography library that wraps a small C library by sipa. The Skycoin cryptography library is on the 3rd generation and the 4th generation library has been commissioned. For 4th generation we want to get cryptography completely into Golang  for cross compilation and have a common cryptography core across all the major coins (Bitcoin, Dogecoin, Litecoin, Skycoin). The 5th generation will focus on native support for open source key storage and signing devices.

In Bitcoin the node and the wallet are a single piece of software that cannot be separated out. If the node is successfully attacked over the network, then the wallet private keys will be gone and all coins will be lost. In Skycoin, the node is designed to be separated out and communicate with the node over a JSON interface fire-walling the public network from private key storage.

We cant protect against web-browsers, Java or security vulnerabilities in the operating system. There was recently an exploit in firefox, that would allow your computer to be hijacked through javascript. You merely needed to click a link and a buffer overflow exploit was triggered in an XML parsing library that Firefox used as a dependency.

Skycoin uses a web-browser (local web-client). By default Google Chome saves everything you type into fields and sends it to a remote server to be saved (form autocomplete). So we had to package our own version of Chrome and V8 into the Skycoin repo. This is working, but is only so-so. That is what the ./gui.sh script is.

I think in future will we will see private contracts that do 90% of NSA hacking, looting random computers for coins with the thousand upon thousands of security vulnerabilities. They will do this just because it makes money. As coin adaption increases and becomes serious money, the level of hacking will accelerate beyond anything we have seen before. The attacks we have seen so far are amateur level.

###### Fixing every bug in every piece of software used is impossible. The best we can do is:

- standardizing a subset of LLVM IR as a CIL and achieving platform independent deterministic builds at the compilation unit
- compilers that enforce memory safety  (to rule out buffer read overruns and remote code execution attacks)
- CPU architectures and compilers that enforce memory safety
- compartmentalizing the applications
- funding low cost open source hardware wallets and doing computations on external CPUs connected over USB
- ARA like hardware and standardization of hardware specifications to achieve security.
- pushing as much of kernel and standards library into user space as possible.
- pushing the network, graphics and sound stack into user space
- pushing POSIX and the gnu standard library into user space. See: https://www.exploit-db.com/search/?action=search&q=GLib

CoreOS, Docker and LLVM are bringing us much closer to these goals. We will not need to implement everything from scratch. It will however be a very expensive process, taking years. We are realistically look at a cost $4 to $15 million dollars over five years and seven dozen small, high intensity six month projects that can be completely by one to three developers.

This is an open-source computer on a USB thumb stick. USB Armory. 800 Mhz Arm processor, 512 MB of ram

https://www.crowdsupply.com/inverse-path/usb-armory

We may be able to get this down to $10 and then move all the cryptographic and key storage operations to this. Locking down the coins and making cryptocoins safe for average user will be a long journey.

![](/img/dev-update-59-1.png)