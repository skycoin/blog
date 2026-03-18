+++
aliases = ["/development-updates/development-update-55/"]
date = "2015-01-29"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #55: Skycoin and Skywire Updates"

+++
There will be a blockchain reset soon. There are some minor last minute changes to block header and I don't want to delay the distribution event further to fix this.

###### Skycoin is designed so that we can:
- export the transactions in JSON from the current blockchain
- reimport the transactions in the new blockchain

This means that balances will be preserved. Bitcoin had a lot of bugs that could not be fixed because they would change hashes and break the blockchain going forward. In Skycoin we plan to fix these errors and then roll over the transactions. The balances should always be the same at the end and there should be tools to verify this.

###### Note:
- The emergency alert system is not implemented yet. When its implemented it will give exchanges and users warnings about resets and required upgrades. Exchanges will get a field returned in JSON to signal human attention. Users will get an HTML banner in the client upon startup or the receipt of the message.

###### There are several scheduled changed that will change binary format and require blockchain resets:
- we are adding merkle hashes of the outputs spent and the outputs created by all transactions in a block. This will guarantee bit for bit agreement between all clients about operations applied to the blockchain. If a cosmic ray hits your RAM and flips a bit, this will detect that before it causes problems. If two different CPUs, compiler versions or optimization flags produce different values, this will detect that. This change will happen soon.
- We have a new merkle construction that allows proof that a block header exists in a series of N blocks given the genesis header and header for the blockchain head and log(N) blockchain headers. This needs to be worked out before it is implemented
- We want a merkle-tree of the unspent output set in the headers. However, removing N0 outputs and adding N1 outputs to a tree with N2 outputs would require too much hashing, if we simply took the whole set and reconstructed the merkle tree each block. If there are 1 million unspent output, that is 500,000 hashes minimum, every block for verification. A modern CPU does 50,000 hashes/second. If we have 1 second blocks, we cannot have block verifications that take longer than the block times, or a client downloadings the blocks will never catch up. One solution is to have a list and only allow appending to the list and zeroing elements in list. Then store this run-length encoded. Then the merkle tree can be updated, with N0 new outputs created and N1 outputs zeroed, with (N0+N1)*log2(N2) hashes, where N2 is the number of outputs spent to date. This means the depth increases forever in number of outputs that have ever been created. Another method zeros the spend outputs and keeps a sorted list of the zeros and adds new outputs hashes to the zeroed slots. It is unknown, when we will have this worked out and tested.
- We want to upgrade the hash function from SHA256 to something better. The new "sponge" functions look very good. They are faster and offer better security, but are not ready yet. A sponge function has an internal state of 1024 bits, and you push 256 bits in and the state is updated. Then you squeeze 256 bits out. SHA-3 Keccak is slightly faster than SHA-256 and in hardware or FPGA the speed very good. We are waiting on this, until there is time to evaluate it.
- We may add a turing complete scripting language, which is severely restricted. There will be a deterministic LLVM type virtual machine with restricted type system and minimum number of operands. A piece of code (a function) will hash to H. A transaction using H will prefix the transaction with 256 bit hash H and then the parameters will follow. This would allow new transaction types to be added (multi-sig transactions) and old transaction types to be deprecated, without breaking earlier blocks. Blockchain parsing becomes independent of the golang code or compiler. Skycoin transaction types would be severely restricted to a minimum set, but personal blockchains would have access to arbitrarily powerful contracts. This is deferred indefinitely.

## Meshnet Update:

We have a new group working on meshnet hardware.

Most hardware today is OEM and off the self. Apple gets sames from dozens of companies, tests them and then chooses best one for the price. Then they put the hardware into a nice looking case. We are now looking for off the shelf modules or chips for 5 Ghz and 24 Ghz that give us control over the beam direction or other options. This is being handled by separate people, so wont slow down software development anymore.

We are talking to contracting firms who can source chips, do prototypes or keep us informed of new hardware. There are two groups in San Francisco with same hardware requirements as us, working on a similar project, so we work with them.

5 Ghz is 6 cm band. It is line of sight. It is blocked by leaves, but bandwidth is 150 Mb/s to over 1 Gb/s. There are single chip radios implementing the 5 Ghz band 802.11n/802.11ac protocol with beam forming or a raw 5 Ghz radio with 40 Mhz channels and 4 antennas outputs. We can attach an FPGA to this and a trace antenna or commercial antenna and test it. This is line of sight, so it might have to be placed a pole, on a roof or out the window. However, the antenna direction can be re-positioned electronically and potentially connect to multiple others.

For point-to-point and backhaul, Ubiquity has 24 Ghz hardware. "AirFiber". It has two antennas, one with horizontal and one with vertical polarization. The latency per hop is 1 ms. It is full duplex, so the latency does not increase if other side is transmitting. The cost is $150 per unit. The speed is 150 Mb/s to over 1 Gb/s. However, it requires installation on a pole. The antenna requires alignment to within eight degrees and it is point-to-point only. Wind can knock the antenna out of alignment. However, it also runs linux.

There is another version used for WISP (wireless internet service providers). It can connect four to twelve users at 150 Mb/s. A directional panel beam, with beam forming.

The meshnet is viable now. The technology is here for small scale meshnets, over some geographies. The equipment available is advancing rapidly. Our initial assessment was significantly more pessimistic than reality.

- WiMAX failed because of licensing fees and spectrum costs. Hardware costs never went down to wifi levels. All technologies going forward will be open access (unlicensed spectrum, wifi style licensing).
- 700 Mhz hardware is becoming available. 20 Mb/s radios are available now. This has mile range and penetrates concrete. Will work in urban areas. Latency is poor. Will work for text messages and basic internet.
- 24 Ghz and 5 Ghz are now usable for unlicensed operation. These are high bandwidth and line of sight.
- The 50 Mhz to 700 Mhz television whitespace bands are opening up (802.11af). This will fail miserably because of channel width and restrictions, but could improve in future.
- Freespace optics is becoming viable. DIY and professional hardware exists commercially.
- Cell phone providers are allowing customers to run femto cells on premise. If customers are running stations on premise then we may have an unlicensed LTE band. We may be able to run meshnet over LTE.

###### The hardware for meshnet mass adaption will be ready commercially within five years. It will only improve from there.
- Point-to-point and backhaul is ready now. Wireless Internet Service Providers (WISPs) are proliferating
- Meshnets will not be easy for the first decade. It will not be like plugging in a wifi device. You will have to climb a roof or get someone to do it for you. You may have to install panels on side of house at an elevation. You will need line-of-sight. The wind will blow the antenna out of alignment until hardware improves (beam steering or mechanical gimble, second generation). This is more dangerous than Bitcoin mining.
- The first areas to get deployments will be rural areas or areas where existing internet is slow, not available or expensive.  We have the hardware for this right now,
- Dense urban areas are edge-case. Need SDR, custom equipment.

We looked at the athens meshnet. We determined that the barrier is currently software, not the hardware side. Commercial Wireless Internet Service Providers (WISPs) are essentially commercial meshnets. There is a growing market for hardware aimed at WISPs and the first meshnets will be using this hardware.

Their networks are structured hierarchically. The depth max is three. There is a large microwave uplink to a location they have roof or tower access. Then they beam point-to-point 1.5 Gb/s connection to another roof. then they have directional antenna covering a 60 degree to 120 degree arc that services four to sixteen customers at up to 150 Mb/s each. The network fans in, to fatter and fatter pipes. These are small companies, with usually less than 1000 premises (50k/month revenue).

###### What Skywire provides WISPs is two things
- Non-hierarchical routing (in a non-hierarchical namespace). This means load balancing and potentially redundancy.
- Inter-operability between WISPs. This means ability to bridge network across customer premises, third parties and other WISPs.

###### For testing:
- We need to get Skywire prototyped and working as darknet as internet overlay (in progress)
- We need option to disable link encryption so it can run at line-speed on the ubiquity hardware used by the WISPs. (new requirement)
- The routing needs to work (designed but not implemented)
- load balancing may need to work (more difficult, possible but open problem)
- We need to find people who operate a WISP and determine what their requirements are.

After the prototype for Skywire is done, the meshnet part and the internet part will split and need to be staffed by separate development teams.