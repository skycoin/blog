+++
aliases = ["/development-updates/development-update-127/"]
date = "2017-03-16"
tags = ["Development"]
title = "Skycoin Partnerships and Content Revision"

+++
Skycoin is finally getting an order book. This took too long.
- next exchange upgrade/rewrite skycoin will float against bitcoin

The blog is going to be ready tomorrow and we will start migrating content.

We are going to announce several partnerships with large mainstream institutions, so have to cleanup a bunch of stuff and will migrate anything relevant to blog.

We will put a lot of content on the blog and things we have not revealed yet.
- information about coin distribution plans and any loose ends will go on the blog
- for the blog we are using hugo for the blog, which takes flat files in markup and generates static html files. So will work over IPFS and eventually CXO.

We are doing rewrite and improving the narrative on

- http://skycoin.com
- it will be easier for people to take a simple message away from the website about long term project goals, what is skycoin, etc
- we will test out a new, simpler narrative and see how people react. We will deemphasize the software aspects and infrastructure

We need to get the first application for the platform/ecosystem on the website.

The blockchain explorer is up at

- http://explorer.skycoin.com

We are doing the third generation skycoin wallet and completely redoing the wallet frontend and design, to start multicoin support (for Skycoin, Bitcoin, Ethereum and Qtum). The new wallet will be based upon the design of the Byteballs wallet.

We are getting more developers and focusing on improved project management process and expanding the development team further.

The CXO standard for immutable data objects and CXO daemon is almost done

- http://github.com/skycoin/cxo
- Skycoin block and transactions will eventually be stored, synchronized and exchanged over the network as CXO objects. The skycoin blockheaders and the transaction list in the Skycoin blocks will be stored as separate objects, to allow headers first download.

Congestion control on the meshnet is done. We have ~4 tickets left before will have something working. It works very well at 2 MB/s per core but needs optimization and there are still bottlenecks in the congestion control.

We have a skycoin introduction video in production now. We need to find a good narrative and message.
