+++
aliases = ["/development-updates/development-update-106/"]
date = "2016-10-05"
draft = true
tags = ["Development"]
title = "Checklist for Skycoin Launch"

+++
Going through the launch check list

Mostly check commit log:
- https://github.com/skycoin/skycoin

- block storage is done. Key/value store. boltdb. memory mapped files
- blockchain history API is done. GUI is in progress.
- first version of website is done. Second version in progress, then will be on domain. will post screenshots soon
- some consensus simulations using random mean field sampling are in the repo in the /src/ directory now. We have someone starting on the public broadcast channel implementation and then remaining integration tasks. This should not block exchange listing, but may drag on for a while.
- fifty tickets on UI and GUI bug fixes. Everything critical fixed.

##### Todo:
- CLI for exchanges
- WebRPC API for exchanges and documentation
- GUI for blockchain history API

## Wallet:

We have +50 tickets on development tasks for wallet QA, bugs, improvements and user interface behavior.

We are transitioning towards an electrum style wallet.

![](/img/dev-update-106-1.png)
![](/img/dev-update-106-2.png)
![](/img/dev-update-106-3.png)
![](/img/dev-update-106-4.png)
![](/img/dev-update-106-5.png)

## Exchange Listing Checklist

Of the five things that were required, three of them are now done.
- block storage is done
- blockchain history API is done
- website is done

The last thing that is required is now
- CLI + WebRPC client for exchanges + documentation (required for exchange listing)
- Blockchain explorer front-end (required for exchange list. This was supposed to be done two days ago, but have not checked yet).
- documentation, info-graphics and technical information on website (this will be iterative over months)
- consensus integration (this is not blocking anything)

Our first exchange integration for testing and QA will be with a darkpool liquidity provider/market maker who sits on both sides of the order book and arbitrages from the major exchanges across multiple coins. Then will work on the large exchanges.

I think we have the APIs in place for automatic conversion between Bitcoin and Skycoin, in the wallet, so we can do something like Ethereum's "ShapeShift".

Then after launch, wallet and future improvements
- Add Shapeshift
- Add multicoin support (Skycoin, Bitcoin, Ethereum)
- Electrum style interface
- Wallet encryption

## Misc

I want to say more about project management and changes and how we are dealing with this, but would be too long.

We are spawning off different project groups, with a single focus (website, marketing, coin, wallet QA, meshnet, applications, build/DevOps, consensus, exchange integration, mobile wallet team, project manager for customer facing applications for tech that was spun off or licensed to corporate clients, etc...). For development we are doing one to three developers per area and each developer has single focus or task.

"The last 10% is 90% of the work", is especially true for launching. Getting everything that needs to be in place ready, is a time sink. I think its taking six people, two months to get the requirements for listing done after the coin was "finished" and "working".

So now we are focusing on one or two top priorities at a time and then assigning resources to them, to make incremental progress. Instead of doing long term R&D and research of indefinite duration. We are also delegating or spinning off as many project groups we can and getting dedicated project managers to manage particular sub-projects. (wallet QA and wallet improvements has dedicated project manager now).