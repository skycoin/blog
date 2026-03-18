+++
title = "Skycoin BBS Development Update #2"
tags = [
    "Development",
    "BBS",
    "CXO",
]
bounty = 4
date = "2017-08-31"
aliases = [
	"/bbs/bbs-development-update-2/"
]
+++

It's been a bit more than a month since the release of version 0.1, and 0.2 is soon to be ready!

The changes are the following:

- Uses the latest CXO version (peer to peer self-replicating database).
- Reimplementation of CXO objects and tree (in preparation for new features).
- Introduction to a `views` module for easy implementation of different ways of "viewing" content.
- Initial implementation of user following/avoiding.
- Completely revamped UI.

## CXO Changes

CXO has been seriously refactored to be faster and more stable. The API has been made to work with hash arrays better - with constant time access, faster replication and the ability to access an element directly with a given hash.

These changes have prompted BBS to change the majority of it's codebase too.

[Check out the CXO repository here.](https://github.com/skycoin/cxo)

## CXO Data Structure Changes

Changes to the data structure is to address the following problems:

1. Implement a structure so that user data can be migrated to it's own separate roots in the future.
2. Easily determine "diffs" between root sequences (a.k.a changes). This will be useful in compiling views and providing real-time updates to the end user.
3. Easily determine the type of root object for different root types.

![Skycoin BBS v0.2 CXO Datastructure](/img/bbs_cxo_datastructure_v0.2.png)

The `RootPage` object determines the type of root. For the time being, all data is accumulated under one root tree per board. In the future, threads and users will have their own individual roots.

In the future, `BoardPage` will have a list of public keys instead of hrefs for threads, as threads will have their own roots. This makes threads easy to migrate between boards.

`DiffPage` is used to determine the changes between root sequences for the `BoardPage` root. This is essentially a set of ever-increasing arrays, where an increase of length is interpretted as changes.

`UsersPage` will become a list of public keys (these will be like "participants" within a board). Each user will have their own root.

## Views Module Implementation

A view is essentially just an interface:

```go
type View interface {

	// Init initiates the view.
	Init(pack *skyobject.Pack, headers *pack.Headers, mux *sync.Mutex) error

	// Update updates the view.
	Update(pack *skyobject.Pack, headers *pack.Headers, mux *sync.Mutex) error

	// Get obtains information from the view.
	Get(id string, a ...interface{}) (interface{}, error)
}
```

Currently, all compiled views are stored in memory. But this will become impractical when our user base increases. Views will be stored in a key-value store on disk in future releases.

For version 0.2, there are two `View` implementations; one for content (Boards/threads/posts/votes) and one for compiling a follow/avoid list per user.

## A New User Experience

In the time of this post, this is near completion. Here is a youtube video of this work in progress:

[![Skycoin BBS Showcase 4](/img/bbs-4.jpg)](https://youtu.be/Oue3WVkmGh4)



To keep up to date with Skycoin BBS development, watch this space and join our [Skycoin BBS Community](https://t.me/skycoinbbs) on Telegram.
