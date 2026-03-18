+++
title = "Skycoin BBS v5.0 Release Announcement"
tags = [
    "Development",
    "BBS",
    "CXO",
]
bounty = 1
date = "2017-12-18"
aliases = [
	"/bbs/bbs-release-v5.0/"
]
+++

Skycoin BBS v5.0 has finally been released with many changes under the hood!

## Thin Client

The most apparent change of all, is the introduction of the thin client. You can now access Skycoin BBS without setting up a node! Just head to [bbs.skycoin.com](http://bbs.skycoin.com).

In previous versions, one can only (and should only) access/submit content via a web user interface that is served locally. As this web-interface (and the API that it calls) has direct control over the node itself, and signs content with private keys that are stored in-node (or server-side), it is not appropriate to expose it to the public.

Hence, the introduction of a thin-client requires that user management, and the process of signing content for submission, to be handled client-side. This requires a completely revamped content-submission endpoint (or endpoints), and heavy changes to the front-end.

Details on the new content submission process can be found on the BBS Wiki: [github.com/skycoin/bbs/wiki/Content-Submission-Process](https://github.com/skycoin/bbs/wiki/Content-Submission-Process).

Currently, the front-end loads very slowly. This is caused from the use of [GopherJS](https://github.com/gopherjs) to handle seed and public/private key generation, as well has signing and verification of data. In future releases, we will make use of native JavaScript libraries to improve performance.

## Command-line Interface

After the introduction of a publicly-visible thin-client, we removed API endpoints that handled administrative control and introduced a command-line interface to deal with such interactions.

More information on this can be found here: [github.com/skycoin/bbs/tree/master/cmd/bbscli](https://github.com/skycoin/bbs/tree/master/cmd/bbscli).

## Other Improvements

* Improvements to Import/Export (unfortunately this is not backwards compatible with import/export for BBS v4.x)
* Simplifications to code and performance improvements for remote submission and interaction with Skycoin Messenger. Updated to use the latest Messenger.
* Improved file-management performance.
* Better handling of invalid CXO roots.
* Better handling of disconnections.

## Downloads

To download BBS, head to [github.com/skycoin/bbs/releases](https://github.com/skycoin/bbs/releases) (source code will be here too).

Note that you can also access BBS via [bbs.skycoin.com](http://bbs.skycoin.com).

## Documentation

We have started a wiki page at [github.com/skycoin/bbs/wiki](https://github.com/skycoin/bbs/wiki).

Please understand that this is still work in progress.

## Community

We have a Telegram channel: [@skycoinbbs](https://t.me/skycoinbbs).
