+++
title = "April Ecosystem Development Update"
tags = [
	"Announcements",
	"Development",
]
bounty = 0
date = "2018-05-16"
image = "img/skycoin-hardware-wallet-prototype.jpg"
aliases = [
	"/statement/april-ecosystem-development-update/"
]
+++

The inaugural Skycoin Ecosystem Conference in Shanghai marked the start of a very successful April for Skycoin as the project goes from strength to strength. The hard-working development team continues to make exciting progress on many different fronts including Skycoin itself, the blockchain collectibles game KittyCash, the CXO software and our dedicated hardware suite.

There were multiple updates and changes made to the internal systems of Skycoin. Issues with Skycoin wallet synchronization and micro-transactions were resolved.

The CXO project team replaced back-end user interface of the CXO database with an interface based on Go, added versatility for end-users to choose their preferred DB implementation and improved essential features such as the CXO daemon.

The KittyCash project team released an alpha test wallet, made improvements to the KittyAPI and various features of the Kittiverse library.

From his work in the hardware incubator, Skycoin lead developer Synth revealed photos of the Skywire motorized wireless dish antenna prototype that will free people from dependence on traditional ISPs. Pictures were shown of the Skycoin hardware wallet, a custom Open-WRT router and a single-node Skyminer all of which are under development.

Keep up-to-date with Skycoin development on Twitter, Reddit and Telegram for what is sure to be a highly productive month of May!

KittyCash
---------

### KittyCash Test Wallet

-   Alpha version of the test wallet published

-   Added the notification for 'wallet updates'

-   Embedded the first version of the wallet into scoreboard

-   Replaced the wallet logs initially based on STDERR with STDOUT

-   Fixed many bugs.

### KittyAPI

-   Added caching for storing photos of kitties.

-   Added a new version of entry structure for kitties

-   Improved the ability to obtain kitty images by using a new materializer for the Kittiverse library

### Kittiverse Library

-   Completed the first version of materializer for better access to kitty images

-   Added an entry structure for storing relevant information of each kitty

### Infrastructure

-   Added a deployment manager for automated deployment

![](/img/april-ecosystem-update1.jpg)

Skycoin
-------

-   Fixed wallet syncing issues

-   Fixed the bug preventing small transactions

-   Changed logging library and op/go-logging based on logrus

-   Added a new fail-safe feature to prevent sending Skycoin to an invalid address

-   Started AdvancedSpend API. This can be used for custom billing to enable bill production and operations sent from multiple addresses by users

-   Mobile wallet beta version completed

### Features

-   Released a new wallet version with an optional encryption feature

-   Added a wallet wizard to help users make a new wallet

![](/img/april-ecosystem-update2.jpg)

CXO
---

-   Added benchmark to DB to allow end-users to choose their preferred DB implementation

-   Changed the previous DB interface based on BoltDB to be based on Go-interface. This was designed for different DB engines adoption. Also added assistance to end-users in choosing their preferred DB implementation based on their individual needs

-   Added Redis to improve DB and for Redis to be used as LRU cache

-   Implemented connection list (file) for CXO daemon. This can be used to configure files with the .toml suffix

-   Completed the Debian package

Hardware
--------

-   Hardware wallet prototype now completed. Outer casing and software are currently under development

![](/img/skycoin-hardware-wallet-prototype.jpg)

-   Custom designed OpenWRT router prototype development was completed. It features sixteen 100Mb and two 1Gb ports with software configuration dashboard functionality

![](/img/april-ecosystem-update3.jpg)

-   Prototype designs of a one-node software-defined networking Skyminer were released

![](/img/april-ecosystem-update4.jpg)

-   Prototype photos of the Skywire dish antenna were released

![](/img/april-ecosystem-update5.jpg)
