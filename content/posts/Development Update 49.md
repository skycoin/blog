+++
aliases = ["/development-updates/development-update-49/"]
date = "2015-01-03"
draft = true
tags = ["Development"]
title = "Development Update #49: An Effort to Build \"The New Internet\" is Growing"

+++
The tutorial on Cipher is done.

https://github.com/skycoin/skycoin/wiki/cipher

This library handles address generation, deterministic wallets, signing transactions with private keys and encrypting data to a public key. It is the core of the Skycoin Project. The coin and everything else is built on top of this.

## Roadmap

In Bitcoin a public key has an address that you can send coins to. In Skycoin at the coin level it is exactly the same.

At the networking level, however public keys can represent servers, devices, darknet nodes or processes. They are communication end-points. So if all the light bulbs in your house had CPUs and were running Skywire, they would have public keys and you would be able to connect to them from a hash of the public key and turn the lights on and off from the internet. For some end-points knowledge of a private-key might represent access, ownership, or ability to control.

The cryptography layer is done. It does everything we need and its a solid foundation.

The coin layer is done and completely implemented, but is undergoing a few updates. It just needs to be launched publicly. Some parts of consensus are still in development and will be added when they are ready (they need the next layer to operate).

The next layer is a networking layer. That is where the new development is shifting. The coin has components which will be rebuilt on top of this layer. The network layer is focused on public keys as communication end-points. The darknet router overlays the internet or other networking infrastructure. It provides transit between nodes and has some privacy properties. This is similar to a VPN. This is the layer that file storage, processes and user applications interface with. This is the foundation for "Distributed Applications" (no one knows what a distributed application is yet because they don't exist, but they will defined as whatever can be built on top of these platforms).

This is part of the effort to "build the new internet". Which came out of OP Redecentralize. There are hundreds of projects working towards this goal, but they are currently, fragmented, non-interoperable and a small piece of a much larger mosaic that is emerging. We are trying to set the standards for the base layers.

Then the meshnet is just a physical extension of the lower layer. It is just a physical connectivity between darknet nodes, that transits locally in dedicated point-to-point manner instead of over the legacy internet. The legacy internet can in-turn be tunneled over the meshnet, just as a VPN tunnels traffic. As soon as the networking layer is done, the physical meshnet is plug-and-play in a few hundred lines of code. This is part of the transition towards community ownership of the networking infrastructure and escaping centralized corporate control of communications.

The ideological roots of Bitcoin originated in agoric computing. Bitcoin is neither inevitable, nor apolitical but rather was a vision of the future. It took thirty years until each pieces of the solution, until each each component was developed to enable the realization of that future. Satoshi assembled the pieces and we have sat back for six years in reflection of what Bitcoin means in historical context and what it means for the direction society is heading. In the past year, there has been frantic land grab as people staked out key positions in the ecosystem, staking claims to wealth, but also a lack of direction, lack of purpose, an aimlessness, coupled with a feeling of banality. Disillusionment with the level of impact Bitcoin has had. Greed, theft and betrayal as all the scammers in the world flock to the GoxCoins.

As soon as components of the networking stage are finished, the project development will need to branch out and begin pursuing multiple sub-projects to achieve relevance. This is the stage focused on user acquisition and being useful, rather than being a marketing gimmick. There is a very non-linear relationship between work and output here. There are dozens of things we could build or do that people would say "thats cool" but have no impact and there are things that are trivial and have a potentially very high impact.

We perceive a huge gap between the visionary, future sounding unproven "revolutionary features" of smart contracts and distributed widgets that send investors and marketers in to a frenzy and the very banal demands of usability, security and other requirements for mainstream adaption that still need to be addressed.