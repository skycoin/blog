+++
aliases = ["/development-updates/development-update-86/"]
date = "2015-09-26"
draft = true
tags = ["Development"]
title = "Development Update #86: Organization Structure and Survival"

+++
There are some improvements coming up
- Deprecation of the C secp256k1 library for golang version
- Dependency vendoring. Means all dependencies of skycoin will be inside of the skycoin repo, for version 1.5. Improves security, makes it so that no one can insert a back door in an upstream library
- golang almost has deterministic builds working. This will be exciting. If two people build the binary from source on different machines, they get SHA256 identical binaries. This guarantees the absence of backdoors.
- Cross compilation. Windows, OSX, Linux and ARM builds, all from same machine. Automated. This will save a lot of time. Windows builds are the most frustrating part.
- This is major milestone in terms of pain and things I want to check off. We are still waiting for golang 1.5 for some of these features.

Once it is running on a formally verified L4 linux, on a raspberry pi or ARM processor, then we will have highest level of security hardening that is currently possible.

This is an absolute and very satisfactory grade of security. There are very few components. No buffer overflows attacks and the number of components is small enough that the security model is intuitive and simple.

One of the largest problems right now, that stops Bitcoin from capturing the largest flows of money is that Bitcoin is unknowable. After "Signature Malleability" and other incidents, there was always a persistent fear of sea monsters in the Bitcoin ecosystem.

## Exchange/Liquidity:

We are getting a wrapper over gocoin, that will allow us to check balances for Bitcoin addresses and inject transactions. Skycoin can already generate Bitcoin addresses and public keys.

The second generation bootstraps upon the first, so the API is simpler and legacy system can be skipped completely. It took Bitcoin two years to get over this hurdle. This is one of the four major long term milestones we need to check off.

## Marketing:

Coin adaption is a process of behavior change.

- information influences beliefs and values
- beliefs and values influence behavior

Human behavior changes according to the Hegelian dielectric. Discontent creates the need for change. “Only a crisis—actual or perceived––produces real change."

The background that drove Bitcoin was ideological. Bitcoin grew out of the same discontent as the occupy movement and it was destroyed when the community was taken over, infiltrated and diverted from ideological issues to issues of mere price and what the coin price was at today. That is when Bitcoin lost the ability to covert, motivate or interest members outside of the existing community.

Bitcoin died when the movement was diverted from issues of values and goals and aspiration, to mere greed. That is when Bitcoin become controllable, inert and aimless.

Every single person who represented the ideological, aspiration or liberatory aspect of Bitcoin has been arrested, alienateded, marginalized or otherwise systematically driven out of the community, while the banal and corrupt has been promoted in power and influence.

##### The Bitcoin community
- is divided by idle speculation
- has had the participatory aspect of the community eliminated by mining pool centralization
- has been cut up into vertically integrated corporate fiefdoms
- is falsely divided over "512 KB blocks or 1024 KB blocks" instead of unified behind the communities goals and aspirations
- the symbols and group unifying memes have all been scrubbed from /r/bitcoin and the major communities as policies

We need to figure out what the group process for Skycoin should be, to form a powerful and effective community.

- membership
- communication channels
- goals, values, aspirations, objectives, planning organization
- the nature of the participatory element
- resources

## Survivable Organization Structures:

Survivable organizations need to be resistant against network deconstruction and need to have intelligence, planning, goals and must be able to deploy resources and capacities in pursuit of those goals.

This is one of the fatal flaws of Bitcoin.

For the Skycoin community that is
- personnel
- developers
- projects
- servers, networking, storage, facilities
- intelligence, planning, goal setting
- information sharing
- communication infrastructure (collaboration), standards

We need to find the most effective neo-corporatist structure for accomplishing the project goals and for the benefit of the community.