+++
aliases = ["/development-updates/development-update-44/"]
date = "2014-12-11"
draft = true
tags = ["Development", "Consensus", "Skywire"]
title = "Development Update #44: Coin and Skywire Development Update"

+++
This is over view of current development status and priorities

## Consensus

Consensus is being worked on. The earlier algorithms are being implemented, bench-marked. Then testing them against the newer algorithms, so we have comparison. This is currently in python. Will be moved to golang and integrated as soon as its ready.

This is not required for the distribution , because we can use central signing key until decentralized consensus is implemented.

## Coin

The coin is mostly done. There are only a very few changes.

Right now, visor is managing wallets and the json API daemon is inside of daemon. We want to move the wallet management and json daemon into its own library. The webwallet interfaces through JSON API daemon and the daemon hooks in to visor through function calls. We want the json API to be very close to Obelisk/Dark Wallet. We believe the Dark Wallet API is better than the Bitcoind API.

Once consensus is done, it will act as a state controller for visor.

In Bitcoin, loading wallets takes too long, because the whole blockchain needs to be loaded from scratch and the whole history scanned. Skycoin uses a leaner interface. When a wallet is loaded, the addresses are checked for unspent outputs associated with the address. So checking current balance is instant. The API will also allow you to check balances for addresses, without have the private keys loaded. There are many things you cannot do in bitcoind (like check balances for address easily) and we think Obelisk/Dark Wallet has the best API for developers and want to move away from bitcoind.

The local client and remote/thin clients will be on same API. You can run APIs for balances or injection transactions on a local or remote server just the same. So a cell phone who does not have a copy of the blockchain, but has a wallet file can query balances or inject transactions.

History is not implemented right now. It will likely be a separate library on top. It is outside of the core, needed to run the blockchain. The blockchain on disc will have the blocks and will have copy of unspent output set at interval. Then it can rewind back a month to an unspent output set, then apply the blocks in that month in order until the next checkpoint. So we can load wallet histories going from most recent transactions, going farther back in time.

This means wallets will load instantly, balances will be available instantly, coins can be sent instantly and history (when implemented) will load in background. As the Bitcoin blockchain gets longer, loading wallets will continue to slow down.

Skycoin already has multiwallet support, so you can load/unload multiple wallets in the client. Importing deterministic wallets from keys need to be added to the gui, after the wallet internals and refactor is done.

Bitcoin used Berkeley Key value store for serialization format of the wallet and there was problems. As the library was updated, only version wallets from very early Bitcoin versions, appeared empty when loaded. The old serialization format could not be loaded by the new client. So a wallet may say it is empty, but actually contain 100,000 Bitcoin. You have to manually extract the private keys with a tool and then reimport them on the command line. This caused some confusion and frustration.

Skycoin is using a JSON wallet format. All wallets are deterministic and the generation key will be in the wallet file. As long as you have the wallet seed, you can recover the private keys and coins. The internal format of the JSON wallet is something we have not had time to think through and finalize, but we can safely nuke everything in the wallet file except the wallet seed without risk of losing coins when the wallet storage format is upgraded.

In Bitcoin using unspent output set snapshots was a security risk, because there was no way to validate them without starting from the genesis block and applying every block since genesis. In Skycoin, there is a rolling hash of the operations applied to the blockchain state, so if you have two checkpoints and apply the blocks between the checkpoint to the first checkpoint, you will get the second checkpoint. This means that the blockchain can be divided into check point intervals and each interval can be validated in parallel. So you can validate backwards and can validate forwards, where as Bitcoin only lets you validate forwards.

The system is designed that way, so eventually you will not need to have the whole blockchain on every node. A node only needs a trusted copy of the unspent output set and then every block since that checkpoint. Then it can check balances and inject transactions.

We are evaluating this. We will probably have two hashes. One is the XOR of the SHA256 of each unspent output at the beginning of the block. This is weak hash, but has constant time to update. In theory, someone can add ~300 unspent outputs to the set and find a subset that generate the same same hash for this. We are not relying on this for validation, but it is good for sanity checking.

Checkpoints of the unspent output set need to have a full merkle-tree hash of the SHA256 of the serialization of each unspent output and have to be tied to a particular block header. The checkpoint needs to be signed by a public key of person who vouches for it. If check points are enabled, you would put in public key for ~8 trusted nodes (exchanges, friends, maybe dev key). It would download the 8 copies of the checkpoint hash from each person and make sure they all agree. If two different people in the trusted set have different hashes for the serialized unspent output set at a given checkpoint, then client should go into a warning/emergency mode until it is resolved by user.

The second has is a merkle tree root of the SHA256 of the serialization of the consumed/produced outputs from the block, accumulated into the hash from the previous block. This makes the block header, not only a function of the previous block input, but also a function of the "state" of the blockchain (the unspent output set) when the block was applied. There are three levels
- block header is only function of previous block header and transactions (data in the block), (Bitcoin does this)
- block header is a function of previous block header, contents of current block and subset of "state" the block is being applied against (Skycoin)

We are trying to determine if this adds anything or if it is redundant. If two clients have different internal state, such as an output being created and then having bit flipped randomly in the balance by hardware failure, this will detect the divergence in the next block if the affected data is an input (consumed) or output (created by) of the transaction. This will also detect an error, where a 32 bit system or 64 bit system output different values (rounding errors, optimization, different versions of compiler).

We can catch these errors in the next block, where as in Bitcoin they may persist many blocks until the unspent output is used and then cause a fork. For instance, this method guards against unintentionally introduce rounding errors and protects against the Block Index 0 fork, if Satoshi tried to spend the reward on block 0. We catch the non-determinism in the output set, in the next block.

If two people apply the same block against different states, the header of the accumulator hash in the next block will be different (ideally). Ideally, you would compute a hash of the full state, each block. However, we could not find a fast enough updating function for this and felt a full merkle tree hash each block would slow down block validation too much. The best compromise, is to check the full merkle-hash at the checkpoints. The full merkle-hash will also detect any single bit-errors, in any outputs that have not been spent yet.

## Coin Development Priorities

##### Coin Distribution Requirements:
- Move JSON API/wallet management into its own library, out of visor/daemon
- Make the JSON API look like Obelisk/Dark Wallet, so that balance of addresses can be checked without loading wallet. Allow unspent outputs to be queried for address without loading wallet. Allow transaction injection. Allow fine grained control of which inputs are used in transaction and the outputs created.
- Update webwallet to use new API, add deterministic wallet import

##### Longer Term:
- Figure out what is in skycoin/daemon and replace the daemon with the skywire daemon. This is required for consensus integration.
- Blockchain history, API for history queries?

## Skywire Development Priorities

##### Skywire has multiple components and it was not clear how things should be structured.
- There needs to be a base interface for a physical "connection" where bytes come in through callback function and bytes can be written out. Polling should be minimized, to avoid adding 1 ms per hop.
- We assume messages are 4 byte length prefixed, so there should probably be "bare metal" layer beneath current golang abstraction.
- We need to make route setup simple, for creating route from A to B to C. Protocol needs to be worked through, finalized. Or just get it working and break it later.
- If a user receives a pubkey hash for an endpoint, they must be able to find a route to that pubkey over network. Nodes either must self-publish connectivity through DHT or service must scrape the network topography. Easiest first version is publication through DHT, with latency/performance self-report, then move towards 3rd party reports.

##### Skywire Advanced/Not Essential
- Bonding multiple routes into a route at application layer
- Meet-in-middle type "hidden services" advertised on multiple nodes. This was scrapped in version 1. Version 1 assumes a daemon has single public key and each daemon can run multiple applications, which listen. Opening port on remote node and advertising multiple endpoints is separate.
- RPC for exposing golang objects over network. This may not be used for anything. May improve services implementation?
- Syndicated asynchronous messaging. not used for anything yet. based on XMPP. may be needed for short UDP like packets for some types of lookups or communication.

##### DHT
- Need serialization format. Just list of 16 bit key, 32 bit length, bits. Is there better serialization format for entry? Just use this for now
- Key is hash of public key, there is a PoW hash to prevent spam,
- Assume full replication of whole DHT, between all nodes with gossip protocol.

##### Merkle-Dag
- This is the most important part to users, but on back-burner because it is not blocking completion of anything else right now

##### Goal:
- Get minimum skywire working for routes
- Get minimum DHT working (for ghetto routes, where each node has full table)
- Use DHT to advertise routes to every other client
- Get clients connecting by public key
- Fix problems later

## Skywire Meshnet Development Priorities

###### Our basic 1st generation target for the software defined radio is:
- A software defined radio module, with direct amplitude modulated signal at 700 Mhz. Target 700 Mhz carrier output with with 8-bit of quantization, using amplitude modulation (positive and negative part of sin wave), for maximum of 11.2 Gb/s. This will either be a CLPD or ADC/DAC+FPGA with an ARM processor. We can fund ASICs from the FPGA or CLPD prototype to get to to full rate. The SDR module should have external antenna port and communicate over Unipro. This an ARA module.
- An antenna. This should be directional. It should be steerable electronically.

We need to be able to set the amplitude of a sin wave, for the positive and negative half of the sin wave at 700 Mhz. At 700 Mhz with 8-bit of quantization, using amplitude modulation at 700 Mhz, we can transmit 11.2 Gb/s. This is the target, but we may only be able to do 300 million values per second without upgrading to ASICs. The change of amplitude must occur at the zero crossing to avoid snapping.

There is ringing in antenna and other factors. So we will probably be using the same amplitude for positive and negative portion of the carrier at start. The amplitude value will change slowly over the cycles. Lower resolution in the DAC is acceptable for prototype, but objective is setting amplitude 1.4 billion times per second at the zero crossing and at-least 8 bits of resolution in output.

###### For the radio module, we need to determine:
- CLPD with direct digital synthesis? What is fastest CLPD? Can CLPD do 300 Mhz ADC/DAC? What is highest clock rate and cost.
- FPGA with expensive ADC/DAC?
- CLPD for ADC/DAC direct digital synthesis, fed into FPGA? How fast can we get with a CLPD and what is speed limitation for ASIC?
- What is best cable for external antenna port?
- What are best options for ADC/DAC vs CLPD? In terms of cost and performance.

##### Notes:
- CLPD is our best option for getting a good open source design and validating it, before going to ASICs
- We may be able to find a cheap ADC/DAD or direct digital synthesis chip for a few dollars
- The decoding of symbols from radios, can be done in CPU at first, but must be pushed to FPGA. The higher level forward error correction code may be handled on CPU.
- We want FPGAs/CLPD that are cheap in bulk and require minimum components on PCB. They should have integrated pullup resistors and not clutter the PCB board with components. CLPDs can be $1 and FGPAs can be $5 in quantity.
- There may be way of duplexing a 350 Mhz, CLPD to achieve 700 Mhz with two 350 Mhz units and cleaver timing. We may not need ASICs.
- We will need higher end FPGA with 3 Gigasamples/second 14-bit DAC/ADC to determine antenna transfer function and determine gains from compensation in antenna transfer function and DAC resolution.
- We need to focus on module components that can be evolved, improved independently.

##### For the antenna:
- Meshnet needs directional beams to be viable at high device densities and long ranges
- We need a measurement platform for collecting data on antennas. hackrf and a 3d printed or laser cut acrylic platform with 2 degrees of freedom (servos), to rotate antenna and image the side beams
- We need electronically steerable antennas for 2.4 Ghz.
-- This could be a parabolic reflector with two $5 Chinese servos on a gimbal, controlled by an arduino
-- This could be a traditional phased array, with variable capacitors for delay lines
-- This could be a fractal antenna, cut into copper clad PCB with a laser cutter and arduino with SPI DAC chip for modifying the control elements
-- Flat, electronically steerable 2.4 Ghz antenna panels are good for roof and hanging out windows and have line-of-sight
- We need electronically steerable antennas for 600 Mhz to 700 Mhz
-- Traditional phased array is too large at this frequency, but possible. We have the matlab software for simulating different antenna configurations.
-- Fractal PCB trace antenna have better side lobes, smaller size. Can be laser cut from PCB
-- If antenna has N control elements (amplifiers, variables capacitors) we have the equations for beam forming, if we can measure output with control platform.
- Beamforming, antenna must be under software control

The signal attenuation at 2.4 Ghz for going through a single 5" wall, is 23 dB. Every 3 dB is 50% loss of power. Every 6 dB is 50% loss of voltage.

The signal attenuation at 700 Mhz, for going straight through shopping mall sized concrete building is only 18 dB. The range can be miles and still achieve extremely high speeds. However, if a large number of devices with unidirectional antennas are deployed, with competitive transmission power, then the same congestion and noise floor problems occur as on 2.4 Ghz. However, it is slightly different because almost none of the energy between transmitter and receiver on 2.4 Ghz is on a line-of-sight path, its mostly multipath interference. Simulation shows that viable high density meshnet will need directional antennas (120 degree coverage maximum) and needs pencil beams.

##### Directional beams allow very important simplifying assumptions
- You can always boost the transmission power to achieve given bandwidth and exceed the noise floor at the receiver. This means lower resolution DACs can be used for same signal level.
- You can assume that the received signal is the strongest signal, regardless of whether it is the closest transmitter. In 802.11 on 2.4 Ghz, if you have a 12 bit DAC and the nearest transmitter is 24 dB louder than signal you are trying to receive, you lose 8 bits of accuracy on the DAC, effectively having a 4 bit ADC, severely reducing data rate
- Competitive transmission power has minimum effect on other receivers. In 802.11 on 2.4 Ghz, attempting to make a connection over a 802.11n router, often causes it to jack up signal power, transmitting on multiple overlapping bonding channels, acting like a wideband signal jammer.

The first generation equipment will be a single output or perhaps two. It will be working out bugs and driving down cost. We chose a very modest technology and encoding, that minimizes technical risk. This should allow deployment rapidly. There is a very short lead-time between someone figuring out an opensource design and when commercial manufacturing/assembly/distribution of PCB boards.

The HackRF was built by people who had no experience in electronics. They were able to learn everything from Google and build a software defined radio that goes between 0 hz and 6 Hz, with 20 Mhz bandwidth. With no experience they were able to design a $160 SDR that is more powerful than $15,000 commercial SDRs. That is very encouraging. To bring the meshnet into the physical world, will require multiple teams working on different parts of the problem.

The AM encoding does not interfere with the users of the digital television band. The FM receivers will not even lock on to it. The gain for the directional beams is 20 dB to 30 dB on the receiver and transmitter. The interference produced is below level of spurious emissions from cell phones, computers and wireless telephones. A horizontal beam polarization yields 30 dB attenuation for digital television, receivers. The beam should be horizontally polarized whenever possible.

Second generation meshnet may have ~16 separate antenna elements on a chip for doing digital delay lines and driving phased arrays. The signal may be a directional gaussian type ultra-wideband pulse, with 700 Mhz pulse frequency. The AM modulated signal with 8-bit ADC caps out at 11.2 Gb/s. The ultra-wideband Gaussian modulation has extremely low level emissions across a very large spectrum and can reach theoretical rate that are measured in terabits/second. However, the technology is new and encoding 1024 bits per pulse, will require more complicated electronics, special antennas, novel encodings and engineering work. Even if the bandwidth rate is not improved, the technology is low probability of intercept and below the noise floor a few meters off the beam axis, which is desirable for operation in particular countries.