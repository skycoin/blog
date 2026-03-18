+++
aliases = ["/development-updates/development-update-64/"]
date = "2015-04-02"
draft = true
tags = ["Development", "CXO", "Skywire"]
title = "Development Update #64: Skycoin Merkle-dag System"

+++
## IPFS Demo:

This is IPFS. This is the successor to Bitorrent.

https://www.youtube.com/watch?v=8CMxDNuuAiQ

##### Skycoin Merkle-dag system is based upon this.
- A directory is a list of nodes. The id of the node is the hash of its serialization
- Each node is either a folder or a file.
- The contents of files are hashes
- The owner signs the root hash with their private key
- The node metadata and files are replicated peer-to-peer
- The directory is referenced by a

Users can update the files after they upload them. If you have a javascript file, instead of rerequesting the file from the server, everytime the page is loaded, the file is named by its hash. If the hash is in the local cache, it does not need to redownload it.

This will speed up blockchain downloads, but has other applications. The Skycoin version is:
- A stripped down version of IPFS using skycoin cryptography primitives
- Runs over Skywire