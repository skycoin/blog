+++
aliases = ["/development-updates/development-update-63/"]
date = "2015-04-01"
draft = true
tags = ["Development"]
title = "Development Update #63: Skycoin: the Rolex of Crypto"

+++
If you know your wallet seed, you will be fine. You can open up the wallets with text editor and grab the seed. As long as you have this value, your wallet can never be lost. You can also just copy and paste the wallet directory.

Eventually, I want to change the wallet deterministic generation function to SHA3/Keccak sponge function based instead of SHA256, but it is too late for this. It is best to not make major changes like this at beginning. In a year or so, there may be a major overhaul of the wallet.

##### There is a huge backlog of refactoring and improvements with
- wallets
- wire protocol
- networking
- block storage
- etc

Getting architecture "perfect" is a lot of work and can only be done incrementally and over months and years. We already delayed over a year for launch, so will just get this over will and make incremental improvements over time (even if the balances need to be moved to a new ledger). For Skycoin, improvements mean that the libraries are smaller, modular, simpler, more specific, have fewer edge cases and have less code. We are not adding things, but simplifying things.

The crypto library is almost perfect, but this will have another iteration of improvement too. The new library will be pure go, to allow cross compilation, wallet encryption and will have support for external key storage devices. The blockchain library is very good too and cannot be improved much. These are the two areas with security implications and where attention and testing has been exhaustive.

As you go from the crypto/blockchain, to networking and then to javascript/GUI you get more errors and more areas that need polish and can be made more elegant.

###### Skycoin has an onion structure:
- The inner parts of the onion are almost perfect (crypto, blockchain, address/hash utilities)
- The mid layers are working but could be improved (visor, daemon, networking, blockchain storage, json API, consensus)
- The outer libraries are still being implemented (next gen DHT, skywire, merkle-dag block storage for bitorrent like block downloads in parallel, darknet application framework, communication addresses, distributed exchange)

The team for the inner layers and mid layers is done. There are a very large number of outer layer projects that rely upon the inner layers. These are independent and can be worked on by multiple teams and developers. Each project is designed to be short, limited scope, something that a single developer can get working quickly (lightning project).

The inner parts have to be exhaustively tested and cannot permit failures or error. A failure here is a lose of coins or major error (such as Ethereum integer overflow allowing you to send negative balances from your account to another person and steal their coins). This increases development effort, attention requirement and code review by 10x to 20x over normal code. These layers can only be worked on by very small group of people and require specialized skills and heavy testing (fuzzing, 100% coverage unit testing, failure analysis).

The outer layers can tolerate failure and can be developed cowboy style and duct taped back together if it falls apart. These are the easiest part to develop. The fastest and easiest.

Libraries and interfaces that are used by other applications, have to be high quality and clean, requiring about 8x the time/effort as code that is functional but not intended for reuse. The crypto library, address generation library and JSON interface are intended for use by other applications and hence development time requirement, attention and elegance requirements are higher. Where as the web-wallet is something that merely needs to work and function as intended ("throwaway code") and can tolerate cowboy development.

Then there are open ended research problems and infrastructure projects. These are things like personal blockchains, merkle-DAG, project ARA, SDR hardware, languages, compiler toolchains/environments for deterministic builds and next-generation infrastructure that gives us new capacities. Once things in this category are figured out, enough to break them into a finite scoped project, then we can push that on queue.

After the coin is launched and working 100%, it will be extremely boring. You will be able to check balances and to send coins. The coin only does two things. The functionality of a cryptocoin is underwhelming. The external functionality is simple and trivial, but the internals (the crypto, blockchain, networking) are precision components. The engineering has a similar analogy to a jet-engine or pocket watch.

There are watches that have micron machined titanium components, a minimum of components, ruby bearings, sapphire watch face, illumination by tritium. The difference from a $5 watch is only on the edge cases.
- The $5 watch stops functioning after 15 years because it has an oil bearing that drys up, while the dry ruby bearing watch keeps functioning. See: http://en.wikipedia.org/wiki/Jewel_bearing
- The $5 watch does not work in the dark, while the watch illuminated works. (the tritium is produced in the Russian fast breeder reactors that are used to produce materials for thermonuclear nuclear weapons)
- The $5 watch stops working and "freezes" after Hiroshima or Nagasaki because the EMP blast from the nuclear weapon magnetized the watch internals, while the titanium watch continues to function
- The $5 watch is machined on commodity hardware, while the titanium watch assembly required years in investment for the design of a new type of CNC machine specialized to the components and materials in the assembly
- The $5 watch cracks easily and its face scratches, while the sapphire watch face can only be scratched by diamond and can withstand pressures that will easily kill the owner
- A watch with twice as many components is more likely to break if subjected to a 50 g shock, than a simpler watch. Every component adds more surfaces for wear, more things that can break and more things that need to be replaced.

Each design choice, each material has a very specific reason. Some of the materials are extremely exotic. The owner probably does not understand the neutron irradiation process for breeding tritium, the design of the fast neutron reactor, the tritium extraction process or how  radioluminescence and tritium beta decay can be used for illumination. See: https://en.wikipedia.org/wiki/Tritium_illumination

![](/img/dev-update-63-1.jpg)
![](/img/dev-update-63-2.jpg)

The owner of the watch will never open it. They will never see the inside. They will never know the material it was made from. They will never see the bearings or have any idea that there is tritium in the watch or where it came from. Yet that level of engineering and the use of the best materials and engineering for each respective function is what defines luxury. Luxury is quality, purposeful design and the best in each aspect.

Faux luxury is advertising. A multitude of features, buzz words, hype, endorsement and marketing over substance. Bling and branding.
- The most accurate watch (Marine chronometers) has seven jeweled bearing. Jeweled bearings are better than normal bearings, so more becomes associated with "better" in the minds of consumers. 15 Jeweled bearing become "better" than 11 Jeweled bearings and soon there is a Jewel marketing arms race and watches are manufactured with 150 Jewels, even through 136 of them are non-functional. See: http://en.wikipedia.org/wiki/Mechanical_watch#.27Jewel_inflation.27
- Watches proliferate that are full of bling and branding at the cost of quality. "Quality" becomes associated with the number of buzz words. There is a proliferation of features. Watches begin to sacrifice elegance to show you the time in three different time zones, the day of the week, the month and to remind you of your birthday. Until the watch is heavy, prone to failure and impossible to repair or understand.
- Marketers create a slew of new buzz words for products to compete on and to be thrown around. They try to create a meaningless standard metrics. In watches, the number of jeweled bearings. In CPUs, the number of megahertz, until the CPUs are so fast that frequent cache misses stalls the CPU for 30 clock cycles. In altcoins hashing functions, blocktimes and increasingly esoteric and useless contracts and features. In CMOS cameras the sensor size. The easily marketed attributes are oversold, beyond any gain in performance or quality.
- Faux luxury is taking a product that is essentially corn processed in a chemical plant and injecting it with some oil and then advertising the fact that it has 200 mg of Omega-3 in it and stamping a paid endorsement form the American Medical Association on the box.

False luxury is the belief that a $2 shirt is "worth" $120 because of a "luxury" brand on it, that advertises the price you paid. It is the belief that value of a $2 shirt is twice as much if you pay $120 for it than if you pay $60. Where as true luxury comes from the quality, design, beauty, elegance and materials and hides the brand behind the artifact.

Normally, you would take existing materials and create a best of breed design. Satoshi took visual studios, SVN, openssl, berkleyDB and the software libraries that were available at the time and cobbled together Bitcoin. You can still see the effects of these libraries, long after they have been deprecated and removed. Such as the weird endianess flips in the calculation of block hashes.

When the Skycoin project started, we took the best tools available and began there. I believed the project was going to be finite, that we would fix Bitcoin, change the hashing function and a few things and the launch. That turned into:
- Writing a new cryptography library
- New consensus algorithm
- New programming language (golang instead of C++)
- New deterministic wallet generation function
- New bipartite transaction graph structure instead of a multigraph
- Local webwallet
- New blocksync algorithms
- New networking primitives
- etc...

Most of these things were driven by external events and became requirements for any new coin, rather than "features" . The amount of new things that need to be designed and implemented, left me feeling like an insane watch maker who was forced to invent a nuclear reactor to get tritium, just to build the perfect watch. The existing materials and libraries were everywhere insufficient. The scope of the project is becoming clear and its is very large. We are finally getting a clear perspective of everything that needs to be done.