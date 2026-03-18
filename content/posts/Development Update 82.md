+++
aliases = ["/development-updates/development-update-82/"]
date = "2015-09-11"
draft = true
tags = ["Development"]
title = "Development Update #82: Skycoin: Attack of the Bugs 3"

+++
There is a major and very severe bug. I am upset that no one found this or brought it up earlier.

For some reason, for some clients under some networking conditions the blockchain is not downloading until it reaches the head block. On LAN and running multiple instances on the same machine, the blockchain always synchronizes between all the clients in testing. In the real world, behind VPN, with latency, and servers in multiple countries the blockchain is not always syncing. The client can require multiple restarts to get the head block.

This is a race condition.

However, as soon as there is a new block, then the process of downloading blocks appears to resume. This is why I have not noticed this before.

This means, that if I have sent someone coins, for the distribution. They may not have shown up in their wallet! They have the coins in their address, but their client does not know it because they have not received the block with the transaction, no matter how long the client was run locally. That is why some people were reliant upon the public blockchain server to confirm their balances.

I am very upset that this was not communicated to me as a bug. I am looking at problem now.

The whole skycoin networking right now is this set of messages

```
// Creates and populates the message configs
func getMessageConfigs() []MessageConfig {
   return []MessageConfig{
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
   }
}
```

The problem will be in

```
NewMessageConfig("GETB", GetBlocksMessage{}),
NewMessageConfig("GIVB", GiveBlocksMessage{}),
NewMessageConfig("ANNB", AnnounceBlocksMessage{}),
```

The network messages are very simple and elegant.
- get (ask for data)
- give (send data)
- announce (announce you have data)

This demonstrates how difficult distributed systems are. Even in this system with three messages, for syncing the blockchain and where I was 100% sure synchronization was mathematically guaranteed. It still does not occur under certain conditions.

This is also why it is important that the protocol is simple and easy to understate, has the fewest lines of code and has the fewest branch conditions possible.

## Limits of Testing For Distributed Systems:

This is a condition where something does not occur (synchronization does not occur under certain conditions).
- It is very easy to detect when something occurs and it is wrong
- it is impossible to prove or demonstrate in general, that something will not occur

As a property of a distributed system, it is equivalent to proving that god does not exist.
- proving a condition occurs
- proving a condition does not occur

In testing, it is easy to verify that the condition occurs and the behavior is correct for the default case or in the test environment.

It is difficult to show that for N nodes, for all possible states of each node and all possible messages that each node emits and in all possible sequences the messages are received, that a particular node eventually reaches a particular state.

## Implications of bug

If I said I sent you coins and you cannot see them in wallet. Wait until I fix this bug. The coins are there, but the client sometimes stalls before it reaches the block with the transaction in it. I am fixing this now.

Until then, you can check balances and unspent outputs and transactions for your addresses here

http://skycoin-chompyz.c9.io/outputs
http://skycoin-chompyz.c9.io/blockchain/blocks?start=0&end=500