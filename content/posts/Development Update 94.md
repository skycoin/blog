+++
aliases = ["/development-updates/development-update-94/"]
date = "2016-01-04"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #94: Compilations, Builds, Dependencies, and Skywire Updates"

+++
## Cross Compilation:

Cross compilation is now working flawlessly! We have builds for Windows, OSX, Linux, BSD, Plan9, Arm, NaCL. It is completely automated.

![](/img/dev-update-94-1.png)

## Deterministic Builds:

Deterministic builds and pulling all the dependencies inside of the library will be done by about Go 1.6!

Deterministic builds, means that if two people compile the source, they will receive binary identical outputs. This means that the binaries cannot be back doored and can be verified.

You take the source code for the golang binary and compile it, with itself and should get the same binary output as the original executable. Then you compile the binary, to get the output.

This is a major milestone for security.

## Elimination of external dependencies:

Bitcoin has had several bugs introduced (intentionally or not) by external dependencies, that would have allowed every node on the network to be taken our or a quarter of the total bitcoin stolen.

See:

- http://www.talosintel.com/reports/TALOS-2015-0035/
- https://bitcoin.org/en/alert/2015-10-12-upnp-vulnerability

For instance

- heartbleed in the bitcoin merchant protocol from OpenSSL
- the remote execution UPNP vulnerability introduced into bitcoind and enabled by default
- the glibc DNS resolution remote code execution vulnerability

If a developer can introduce one of these bugs, they can sell it for hundreds of thousands of dollars to the NSA, private companies, FSB or others. They can also use it to loot millions of dollars from exchanges and users. We are in the middle of a cyber war.

Skycoin has removed all external dependencies. Everything is in golang. Everything is memory safe. Everything will eventually be moved into the repo once golang support for vendored dependencies is worked out.

We are not even dependent upon the system DNS resolver.

We are moving towards being able to run skycoin on an seL4 kernel (34,000 lines of code) on a raspberry pi. This eliminates everything (systemd, the operating system, just everything cut out). You can run it over a serial cable, if there is not a USB driver. The exchange, wallet and other infrastructure will be able to take advantage of this also.

MtGox and Silk Road was running with a PHP front end, but there are numerous PHP zero days. Even running Silk Road over tor, governments can root the server or get remote execution very easily.

When a government, like the EU bans cash and goes ballistic on Bitcoin, they will begin attacks on the global network and we will see things that seem insane right now. I have been told things that are disturbing, that I cant disclose. The EU is doing capital controls in Greece and has bail in legislation that just went into effect today.

## Meshnet Routing Algorithm

I have a simple DHT algorithm now that embeds the node public key hashes onto a chord and can find nodes by address.

This is one of the most difficult parts.

This is another algorithm that is similar. This part of the meshnet can be swapped out and its an area that will take years of research and testing and something that will need to be updated as better algorithms are developed.

Multi Named VDHT Routing

- https://www.freedomlayer.org/multi-named-vdht-routing.html
- https://www.freedomlayer.org/experimenting-with-virtual-dht-routing.html

![](/img/dev-update-94-2.png)

We have a few graduate students, who are only interested in this problem and bench marking and trying different algorithms and writing papers.

There is an efficient algorithm using ant colony optimization and a version using particle swarm optimization that approximates a path integral for electron diffusion on a graph that has a name like "quantum electron something" that someone wanted to implement.

## Meshnet Adaption

On the ground, people are creating their own ISPs and communication networks.

- http://arstechnica.com/information-technology/2015/11/how-a-group-of-neighbors-created-their-own-internet-service/

## Global Survey of Free Networks

- http://p2pfoundation.net/Global_Survey_of_Free_Networks

I have researched all the tools and hardware they are using.

Not that meshnets are becoming viable, the government/FCC is trying to ban the ability to flash the firmware or use open source firmware for wifi routers. "Hackaday reports that the FCC is introducing new rules which ban firmware modifications for the radio systems in WiFi routers and other wireless devices". "The PDF explicitly mentions DD-WRT as an example of what should not be permitted".

## Radios

There is new radio equipment and software being released monthly now. We do not have to worry about this

- https://github.com/srslte/srsue
- http://spectrum.ieee.org/telecom/wireless/softwaredefined-radio-will-let-communities-build-their-own-4g-networks
- http://spectrum.ieee.org/geek-life/hands-on/softwaredefined-radio-part-ii

##### Proxygambit

https://hackaday.com/2015/07/16/proxygambit-better-than-proxyham-takes-coffee-shop-wifi-global/
https://hackaday.com/tag/proxyham/

https://github.com/samyk/proxygambit

- 150 Mbps+
- +10 km range, line of sight