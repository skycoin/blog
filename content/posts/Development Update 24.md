+++
aliases = ["/development-updates/development-update-24/"]
date = "2014-06-13"
description = "Release notes highlighting the current development behind Skycoin"
draft = true
tags = ["Development"]
title = "Development Update #24: Skycoin Project Teams and Progress"

+++
## Summary:

Its launching now. Cannot wait a year.

A full time engineering manager is being hired and full time VP of engineering is being hired. The VP of engineering will be responsible for producing reports on project implementation, setting and tracking project implementation milestones. The engineering manager will be responsible for managing contractors, developers, coordinating project implementation schedules and  release schedules.

A Google docs spreadsheet will be created, with things that need to be coded and coin bounties. People who contribute unsolicited improvements, will also receive coins. Some full time and part time developers will be put on salary.

##### There are six project application teams:
- Core coin team (done for now)
- Meshnet team
- Wallet/Application usability team (done for now)
- Applications team
- Marketing
- Security Projects Team (unstaffed, later)

## Coin Team:

Coin team is mostly done. The blockchain is done.  There is nothing for cointeam to do, until Obelisk implementation. The Skycoin blockchain parser is about 2,000 lines and have almost no dependencies. It is much simplier than Bitcoin and easier to audit.  It was designed to have nothing in it for security. This part of the code base will be frozen eventually. Only a very small number of people are allowed to make changes to this part of the codebase.

## Meshnet Team:

Skycoin developers will get the meshnet working and its being handled over to the community. The meshnet will work on Debian with SOCKS5 and then others can get it working on OSX, Windows, write the TUN adapter (so that all traffic can be tunneled through the meshnet).

There are also hardware project teams that will be working on hardware devices. The existing networking stack will have to be refactored, to support a C implementation and then verilog implementation suitable for FPGA and eventually ASIC implementation.

There is an overlap between the Meshnet team and the applications teams. The GUI/usability teams are responsible for producing interfaces that are easy to use, for managing meshnet deployments and routine tasks. The meshnet team will be responsible for providing good APIs for the usability team and there will be some back and forth on requirements.

## Wallet/Application Usability Team

The wallet is pretty good right now. After launch, they will start on an improved wallet design with a coinbase like vertical layout and additional features. This team works in Javascript and does a bit of golang for the JSON API.

## Applications Team

Application team will be mostly external contributors and bounties.

##### This team is responsible for:
- personal blockchains
- communication infrastructure for sending messages between addresses
- porting Bittorrent to run on the Skywire darknet
- implemented applications (such as distributed twitter over personal blockchain)
- communication infrastructure for the project

The end goal of the applications team, is to be able to move all Skycoin development and project communication into the darknet.

For instance, one application puts a wiki into a personal blockchain/key vaue store (each page is a value for some key). You view the wiki with a web browser connected to a locally running webserver. You submit changes to wikipages and the changes are communicated to the owner of the wiki (asynchronous API/RPC call, using communication between addresses/Skywire nodes). The server running the wiki, updates a page and signs the update. The updated page is then replicated peer-to-peer by all nodes subscribed to the wiki. Decentralized Message boards, wikis, blogs, Twitter like applications can be built on this technology.

All project communication and coordination should be moved into the darknet as soon as possible. This is extremely important for decentralizing the project and enabling the community to take over development.

##### High Priority Applications:
- Darknet DHT lookup system
- Messaging Between Addresses (secure, native, Bitmessage like functionality for Skywire Darknet)
- Darknet File System (ability to lookup file by SHA256 hash, find peers and download file)
- Native Decentralized Darknet Communications Infrastructure (message boards, wiki, person to person messaging, mailing lists, twitter, 4chan like applications)

Applications are very important for adaption. There will be several dozen or hundred developers across the different application developer groups. The objective is to decentralize as much as possible, everything that we do online and move it into IPv4 and into the darknet
- Email. Messaging
- Youtube. Streaming Video
- Torrents. File Downloading
- AIM. Messaging
- Skype. Voice Chat
- Twitter. Feeds
- 4chan. Discussion Boards
- BBS/forums. Discussion boards

Most applications are websites. The data for the website is decentralized and stored in Aether as JSON. People subscribe to the datastore by its public key. The owner of the datastore may sign updates to the datastore. Updates are replicated peer to peer between users subscribed to the datastore. A key-value paid in the datastore contains the Javascript/Angular that renders the HTML for the website, from the Aether key-value store data. The application also expose a JSON RPC. A user may communicate back to a server running a service, through the Skywire darknet messaging service. For instance, a user may request data or may submit a change to a wiki page. The webfront end, generates an encrypted message for the application server and the application server receives the message over Skywire Messaging Service. Application servers must document the API calls they accept and the required parameters for the calls. The application interface (the html GUI) is generated on a locally running webserver, from data contained in the application datastore.

## Marketing Team:

The marketing team with have a wiki and discussion board. They are responsible for creating marketing messages for specific groups, doing promotion and organizing groups for meshnet deployment.

They will work with PR firm and liason with media. For instance, marketing group may coordinate with local meshnet groups, setup interviews of local meshnet group with media. The media group will organize and provide "Antenna Porn", dramatic pictures of Antenna Deployments for publication, setup interviews with local meshnet groups to get sound bites for news article and otherwise liaison with media.

## Security Projects Team

Sometime in future, we will start discussion board and begin soliciting proposals for the design of the application sandbox and Skywire security related projects. Bounties will be assigned to accepted proposals will be staffed with developers.

After the NSA leaks we do not believe that existing operating systems and hardware platforms can be secured. Recent attacks have been able to compromise the Google Chrome sandbox and achieve root privileges through remotely executed Javascript. Long term Skycoin and Skywire application security will require extensive compartmentalization, code minimization and dedicated hardware devices.

The current implementation of the Skywire uses a three layer application sandbox. The bottom layer has a java-script interpreter and Webkit render, which are independent and communicate through the second layer. The second layer is in Golang and accesses resources (networking, disc) through an API on the top layer, which is also Golang. We are unable to rule out  backdoors in Google's javascript compiler, cpu microcode exploits or backdoors in the webkit render and other third party dependencies. In the long term, we want to move applications to a secure, sandboxed state machine executing a minimalist CIL like assembly language.

We are currently examining alternative sandboxes and application state machines  besides Google V8 javascript. The Asm.js is a candidate for the state machine. NaCl was found unsuitable because of its complexity, platform dependent assembly target and inability to protect against microcode exploits. The chosen sandbox state machine, should also be suitable as base language for blockchain scripting.

##### The security application team will work on projects such as:
- Make application permissions for resource access transparent and specific
- Restricting applications from accessing data outside of their application folder
- Restricting applications from network access if not required
- dedicated hardware device for key storage and signing, independent of the CPU
- Dedicated hardware device for running Skywire Applications independent of CPU (FPGA?)
- Dedicated hardware device for Skywire Networking Stack
- Fuzzing of all external libraries used in sandbox stack
- Ability to audit for unauthorized data ex-filtration and unauthorized resource access
- Ability to detect, record and replay microcode exploit attacks
- Platform based deterministic builds (detects compiler backdoors)
- Automatic reporting of inputs and program state that result in crashes
- Compartmentalization of application dependencies
- Minimizing the amount of code (2000 lines, not 250,000 lines)
- Minimizing application dependencies
- Moving Debian towards good default security (fine grained application resource permissions, deterministic builds, usability for security)

Security is an infinite endless abyss that can consume infinite time and resources. Many of the improvements required will take a very long time and are out of our control. They require hardware manufacturers and Linux distributors and people maintaining dependencies to move in a particular direction. No matter how secure and minimalist the Skywire stack is, it is meaningless if the operating system it is running on has dozens of backdoors.

Some projects such as LibreSSL have started ripping out hundreds of thousands of lines of code from OpenSSL (which it turns out almost no one used). Every line is a potential backdoor. Every unnecessary extension is dangerous, as we learned from HeartBleed.

Similarly, the networking stack in the Linux Kernel could be ripped out put into user space and gutted of protocols not used. The number of kernel system calls could be reduced by a few hundred and system calls for deprecated platforms ripped out. Fine grained application permissions for resource access could be made mandatory, default and easy to modify with a gui instead of being an ad-hod, unusable extension that is only supported for select applications (AppArmor, security enhanced linux).

For instance, "ls" should not be opening TCP/Ip sockets and most applications should not be accessing your Bitcoin wallet. If applications were sandboxed to their directories and had a single application directory, then there is no way a Java app could steal your Bitcoin wallet from the web browser. We accept bad default security, even when it makes no sense.

Achieving good security and usability, will be a bitter war lasting decades. Every sane modification will be opposed tooth and nail "But if you remove that code, I wont be able to run linux on my VAX". Projects like OpenSSL will have to be forked, gutted and then developers shamed to switching over. Even simple things such as getting Empathy to support OTR, took nearly a decade.

Debian contains hundreds of packages. None of the packages can be built deterministicly from source. It is impossible to verify the binaries they distribute from the source code. It is impossible to verify that any of the hundreds of people maintaining packages, have not inserted a backdoor into the binaries they are producing. It is impossible to verify that no one has compromised their build servers and inserted a backdoor that the maintainers do not know about. Applications are not sandboxed, so even the compromise of a single irrelevant component can result in the compromise of the whole system. Merely achieving deterministic builds will require extensive changes to the architecture of linux, that will be rejected by the majority of distributions.

Bitcoin has been barely able to achieve deterministic builds and only if you accept the virtual machine image that is used to build the source (Which itself cannot be produced deterministicly from source for independent verification).

Microsoft and Apple or individual employees at these companies receive direct government orders to backdoor their software. The company being unable to report the existence of such orders. In many countries, these companies are required to hand over private keys for signing updates. The software is backdoored redundantly, at multiple levels, by multiple government agencies that are not necessarily cooperating with each other. Apple, Microsoft and Google products must be assumed to be insecure. Google has the best track record for security, but still has had incidents where wallets could have been looted through Chrome by Javascript by accessing a webpage. The number of exploits in Internet Explorer that resulted in coin theft, is absolutely immense. Hardware devices are the only way to achieve guarantees on those platforms.

Not only is the software stack insecure, but the hardware is back-doored. Many consumer NIC cards can be buffer overflowed and can directly overwrite any part of RAM and compromise a system at the kernel level. Most consumer CPUs contain microcode exploits. Most consumer routers contain backdoors and can be taken over.

We believe open source hardware devices can solve many of the worst problems (Coins being stolen on Windows). We are focused immediately on the issues that can result in coins being stolen that we can control. However, In the long run we an  organization to evaluate and push for improvements in platform security.

## Projects Team

We need some kind of funding and project management mechanism.

For example, someone may start project group for open source Skycoin hardware wallet software (porting ECC signing and key storage to 8 bit arduino processors), another group may prototype hardware for the wallet and another group may manufacture and sell production runs of the hardware. Another group may implement the API interface between the software wallet and hardware wallet. Another group may prototype a different form factor for the hardware wallet and do preorders to fund it into production.

Or ability to fund a "Meshnet Map" application that allows visualization of where nodes are and who they can connect to. Or visualization of bandwidth throughput and node locations, for people running large node deployments.

We need to have project pages, describing the Skycoin related projects and giving and overview, maybe a video and then linking back to the project pages (github, discussion boards, trellos...). The number of things going on is increasing and coordination is becoming a bottleneck. Aether should improve this a bit and allow us to get project pages up.