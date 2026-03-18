+++
aliases = ["/development-updates/development-update-66/"]
date = "2015-04-13"
draft = true
tags = ["Development"]
title = "Development Update #66: An overview of Skywire"

+++
The network is running. Fixed a bunch of bugs.

## Structure of Skycoin Networking:

##### This is overview of wire protocol.

https://github.com/skycoin/skycoin/blob/master/src/daemon/messages.go#L40

NewMessageConfig("INTR", IntroductionMessage{}),
NewMessageConfig("GETP", GetPeersMessage{}),
NewMessageConfig("GIVP", GivePeersMessage{}),
NewMessageConfig("PING", PingMessage{}),
NewMessageConfig("PONG", PongMessage{}),
NewMessageConfig("GETB", GetBlocksMessage{}),
NewMessageConfig("GIVB", GiveBlocksMessage{}),
NewMessageConfig("ANNB", AnnounceBlocksMessage{}),
NewMessageConfig("GETT", GetTxnsMessage{}),
NewMessageConfig("GIVT", GiveTxnsMessage{}),
NewMessageConfig("ANNT", AnnounceTxnsMessage{}),


- Each message is a struct.
- You put values in struct, then do a "Send" and say who you want to send it to
- It packs up the struct in canonical binary format
- the struct has a .Handle() method. When the data is received, this method gets called on the receiver. The struct is already filled in, with its values


## PEX: Peer Exchange

This is "give me peers" and "request peers". This is for finding other peers running skycoin (and later skywire). These get saved into  ~/.skycoin/peers.txt . Once you have enough peers, you can disable dht with -disable-dht flag.


NewMessageConfig("GETP", GetPeersMessage{}),
NewMessageConfig("GIVP", GivePeersMessage{}),

This is good example:
```
type GetPeersMessage struct {
   c *gnet.MessageContext `enc:"-"`
}

// Notifies the Pex instance that peers were requested
func (self *GetPeersMessage) Process(d *Daemon) {
   if d.Peers.Config.Disabled {
      return
   }
   peers := d.Peers.Peers.Peerlist.RandomPublic(d.Peers.Config.ReplyCount)
   if len(peers) == 0 {
      logger.Debug("We have no peers to send in reply")
      return
   }
   m := NewGivePeersMessage(peers)
   d.Pool.Pool.SendMessage(self.c.Conn, m)
}
```


## Transactions:

This is how transactions are replicated peer to peer. This is before transactions are placed into blocks.

NewMessageConfig("GETT", GetTxnsMessage{}),
NewMessageConfig("GIVT", GiveTxnsMessage{}),
NewMessageConfig("ANNT", AnnounceTxnsMessage{}),

When you connect to someone:
- You request list of hashes for the transactions they have.
- If they have something you don't have, you request the data for it

Gossip Protocol: When you learn about a new transaction
- When you get a new transaction, you broadcast the hash to everyone you are connected to
- If they don't have the transaction already, they request it from you

## Blocks:

Very similar to transactions

NewMessageConfig("GETB", GetBlocksMessage{}),
NewMessageConfig("GIVB", GiveBlocksMessage{}),

## Overview:

This is much cleaner than Bitcoin's wire protocol. There are no bloom filters. There is minimum of code.

Skycoin uses a paradigm of source independent networking, similar to urbit. It is also similar to rsync.

- You have a list of objects in your local store
- Each object is "named" by the hash of its binary serialization
- You connect to remote peer
- You check list of hashes for objects you have, against list of hashes for objects they have
- You do exchange, so you get any objects they have which you don't
- You apply a filter (discarding invalid transactions or executed transactions from your store or whatever policy is)

So if person A injects a new transaction to the network, it will spread throughout the network. Eventually a block minting server will shove it into a block and it will executed.

In Skycoin there are three type of data channels. These are peer-to-peer exchanges required for network operation
- Transactions (things that users create to spend coins, that replicate between nodes and then are inserted into blocks)
- Blocks (lists of transactions, with some header information, such as hash of previous block in the chain)
- Consensus information. This is how a server decides, which chain of multiple competing chains is valid.

## Skycoin Survivability

It is very important that this information is implemented/replicated peer-to-peer.

In a war scenario, Russia, China, Brazil and even the United States will balkanize the internet. There will be communication restrictions. You will not be able to connect in the global namespace, from a server in Brazil to a server in China.

As long as there is a single satellite phone link, or clandestine cross-border radio link between countries, the peer-to-peer replication will succeed. Data replicates independently within the balkanized zones. So the cross border bandwidth may only need to be a few KB/s.

We are designing, specifically for a balkinized internet, with intermediate node connectivity. Especially in war scenario where global communications is sporadic and the electromagnetic environment is unreliable or hostile.

The internet came out of DoD ARPANET. Tor came out of Navy being able to access their secure network web-mail email servers from a public network without NSA snooping in (secure access over public networks). Skywire came out of research on store-and-forward networks for disruption-tolerant networking, mobile ad-hoc networking and diversity routing in mesh networks.

![](/img/dev-update-66-1.jpg)

Store and forward is useful for emergency communication networks. In theory it can tolerate minutes, hours or day of latency as long as the protocol is designed to minimize round trips. It is already used for downloading files and data from space craft, where there are sporadic communication windows.

Current drones require constant network connectivity or are fully autonomous. Future drones with be semi-autonomous and roam between network access points, uploading telemetry data and receiving commands, while operating autonomously when communication networks are unavailable. Store and forward, source independent networking works very well for this application. There are similar applications for asynchronous sensor networks, where a drone or vehicle may drive by a site and connect locally to the sensors and download the data in batches, without requirement for real time network access. Sensor and vehicle networks that have been cut off from global internet can continue to function in the local network without interruption and exchange data when possible.

A drone may have satellite uplink, but is also able to use stationary ground links it encounters. This allows continued operation if the satellite is jammed or shot down or equipment becomes damaged (redundancy). A drone may wander drifting between sources of power and communication and opportunistically uploading/exchanging data about resource locations with other elements of the sensor/vehicle swarm.

Meshnets, emergency communication networks, sensor/vehicle swarms require a new type of networking technology. TCP/IP end-to-end re-transmission no longer works when you have 10 hops and even 5% loss on each hop. The source independent networking and store-and-forward method is "scale invariant" in that it handles latencies of milliseconds the same as latencies of hours and days. However, it is a complete redefinition of the existing network stack.

It is ironic that the network of the future, is going back to Unix-to-Unix Copy.

## Consensus Data

In Bitcoin, PoW is baked into the block headers. You cannot change Bitcoin consensus method without invalidating the whole blockchain. In Skycoin, consensus is flexible, can be changed later. Skycoin will use an open network of nodes, but a bank may fork it and decide to run customer account balances in Euro on a Skycoin chain, but will only use a closed set of bank servers for the consensus process.

Outputs/Transactions are designed to be independent of the blockchain. This means that a ledger of transactions can be migrated from one ledger, to a new ledger when needed. This is to ensure that Skycoin ownership and balances are preserved, while enabling upgrades in the future.