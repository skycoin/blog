+++
aliases = ["/development-updates/development-update-21/"]
date = "2014-05-08"
draft = true
tags = ["Development"]
title = "Development Update #21: Skycoin Project Update"

+++
## Project Update:

1. We are getting a Trello for organizing developers.
2. We are moving white papers to a wiki. Its better if the community can organize and modify them. Each wiki page can be more focused on a single topic than the white papers.
    - Overview for general public
    - Tutorials for software developers, with code samples
    - Marketing documentation
    - Engineering documentation that describes systems at level required for implementation
3. We will launch code in a personal blockchain so it can trade while Obelisk is under development
4. The public **DOES NOT CARE** about the technology.  Only developers understand the implications of what we are doing. The public only cares about the coin for ideological reasons (the meshnet) and what it does for them. Public adaption will require a working meshnet and good marketing explaining it.
5. The public does not know how Bitcoin works and they probably don't care. "Its digital money". Anything that is like Bitcoin but is not Bitcoin, is "Bitcoin 2.0" to the public. 99% of the users will not become educated about the differences between the coins. We need to have very simple marketing messages.  In contrast, the document outlying the differences between Skycoin and Bitcoin is currently 40 pages long and deal with transaction malleability, signature malleability, duplicate coinbase outputs, hash collisions and the treatment of unspent outputs. We have no realistic hope of educating the public about these differences.
6. We need to build communication infrastructure for the developers to communicate.
    - Message board for discussion
    - wiki for documentation
    - wiki for organizing marketing materials to public
    - Code tutorials
    - Issue tracker/Trello for tracking immediate project objectives
    - IRC for discussion and technical support
7. The foundation of any coin is the community and we need to focus on tools for building out the community. Communication tools are very important for the community development.
8. We want someone to write a wiki in  golang on top of Aether. With each page as a value in a key value store.
9. We need a Skywire Daemon service that takes an address, finds the node and sends it a message. Just has to work and will improve or swap out implementation later. This will be for submitting update requests to the wiki at first.