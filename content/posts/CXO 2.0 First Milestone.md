+++
aliases = []
date = 2020-03-22T01:00:00Z
description = "CXO 2.0, the second generation of Skycoin’s immutable object library, reaches first development milestone."
image = "/img/cxo2-milestone-1.jpg"
tags = [" Skywallet", "announcements", "CXO", "CXO 2.0"]
title = "CXO 2.0 Reaches First Development Milestone"

+++
**CXO 2**, the second generation of Skycoin’s immutable object library, has reached the first development milestone toward its full launch later this year! CXO 2 represents a monumental upgrade to the previous version of CXO; it is a critical component of the Skycoin ecosystem, and forms one of the key components of the forthcoming Obelisk consensus protocol.

CXO 2 is a sophisticated data sharing and storage system, enabling users to share file structures (from a single file to a whole directory tree) by means of a default file transfer application. A local copy of the file remains with the user, and anyone who has requested a copy, or “subscribed”, will receive an identical copy of the file in their own local home folders. Whenever a change is made to the original file, only the delta from the original file, (only the portion that has changed), is downloaded to subscribers’ folders. This saves users from downloading the same data multiple times, and leads to a massive reduction in bandwidth use across the network. The ability to share files in a fast, reliable, encrypted, anonymous, and completely decentralized way has massive implications and incredible potential for future application development. 

When CXO 2 is complete, there are a number of groundbreaking applications that may be built to take advantage of CXO’s core functionality in unique ways. These include any peer-to-peer file sharing or storage applications that require the data to be both secure and verifiably authentic. Some potential applications using CXO 2 may replicate and significantly improve upon the functionality of existing services like BitTorrent, Dropbox, or Google Drive. CXO 2 is built to take advantage of the tremendous speed achievable via dynamic mesh network routing, and any application built on Skywire is also end-to-end encrypted, and completely private by default. CXO 2 operates over Skycoin’s decentralized messaging protocol, called DMSG.

CXO 2 consists of two major parts: the **CXO Node** and the **CXO Tracker**. Users are able to send and receive data, as well as subscribe to data feeds over the Skywire network using the CXO Node. The CXO Tracker on the other hand is responsible for tracking publishers and metadata registered in the CXO 2 storage system, as well as store data (initially).

The key features of CXO 2 are Subscribe, Announce, Notify, and Request Data.

1.  CXO 2 users have the ability to **Subscribe** to multiple data feeds. The primary function of cxo-tracker is to keep track of subscribed users and the published data to which they are subscribed.
2. **Announce** is the method for sharing new data to the network. The new data is stored by cxo-tracker, which monitors for any changes to the subscribed data.
3.  Subscribers are **Notified** by cxo-tracker every time new data is available from one of their subscribed feeds.
4.  A **Request Data** mechanism is triggered after a successful change notification, and the new data is retrieved and saved locally.

The *Subscribe* and _Announce_ features are both available through the cxo-node command-line interface, whereas the _Notify_ and _Request Data_ functions are fully automated, and do not require any user input to function.

CXO 2 has two more Milestones to reach before final release. Developers are now hard at work on _Milestone 2_, which is expected to be released quickly after _Milestone 1_. Once Milestone 2 is complete, CXO 2 will no longer require a central storage of data at all, and nodes will instead replicate data on a peer-to-peer basis without any central data point. After Milestone 3, CXO will be ready for app development and for use as part of Skycoin’s revolutionary _Obelisk_ consensus protocol.