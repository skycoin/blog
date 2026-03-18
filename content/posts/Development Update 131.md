+++
title = "Development Update #131"
tags = [
    "Development",
]
date = "2017-05-16"
aliases = [
	"/development-updates/development-update-131/"
]
+++

## Bug Fix:

We found a bug last night, where the node goes into infinite loop when trying to create a new block and transactions on network stopped.

The node was assembling 5 transactions into a block, then failing because two transaction tried to spend the same output. Then failing and waiting a few seconds and then trying again with same result.

The code is now enabled to take the list of pending transactions and add random transactions from the list, one at a time, discarding a transactions which if added to the block, would make the block unexecutable against the current unspent output set.

The bug is fixed now.

We could stop these bugs from stalling the network, by adding randomization or enabling a flag; but we are running network in mode where errors like this will completely stop the network and with strict validation, so that we can detect these edge cases and make sure they get fixed. Otherwise we would not notice that these edge cases were not handled properly.
