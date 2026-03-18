+++
aliases = ["/development-updates/development-update-62/"]
date = "2015-03-26"
draft = true
tags = ["Development", "Skycoin"]
title = "Development Update #62: Skycoin Bug Fixes"

+++
You have to nuke the blockchain files in .skycoin again. `rm ~/.skycoin/blockchain*`

### Skycoin Transaction Format:

There is an output:
~~~
[
    {
        "hash": "043836eb6f29aaeb8b9bfce847e07c159c72b25ae17d291f32125e7f1912e2a0",
        "src_tx": "0000000000000000000000000000000000000000000000000000000000000000",
        "address": "2jBbGxZRGoQG1mqhPBnXnLTxK6oxsTf8os6",
        "coins": 100000000000000,
        "hours": 100000000000000
    }
]
~~~
An output has:
- a balance of coins
- a balance of coinhours
- an address that "owns" the outputs. the person with the private key, whose public key hashes to the address can spend the output

1,000,000 base units = 1 coin. I think the base unit is called a "drop". So each coin is divisible to 6 decimal places. 1 million coins is 1% of total. So there will only be at most ~6 digits before the decimal and 6 digits after the decimal to keep it manageable. Anything more than 6 digits before/after decimal place becomes difficult to count.

### A transaction is:

~~~
 {
  "hash": "96943281a3fd298bf05c848300d173ab9bf586b4024b080d1ca3aad03a458b9c",
  "inner_hash": "ca67e004b932137f8469d72e1e4147621f890cfc23f6d2f70e38eeb08da85aba",
  "sigs": [
    "5610209b061ff472766f9d36e70834c605a8911aa63dc64538bdf5d83339c8da10522810623a6e8 70865eab6ccdbe61741e27e7a21afd537e11768e90fbf96d900"
  ],
  "in": [
    "043836eb6f29aaeb8b9bfce847e07c159c72b25ae17d291f32125e7f1912e2a0"
  ],
  "out": [
    {
      "hash": "c09d5afa78684e14a676b13961a756e6fa9b2c5bebb7be71cf2dc143b4f633cc",
      "src_tx": "ca67e004b932137f8469d72e1e4147621f890cfc23f6d2f70e38eeb08da85aba",
      "address": "2jBbGxZRGoQG1mqhPBnXnLTxK6oxsTf8os6",
      "coins": 99999990000000,
      "hours": 66666666666665
    },
    {
      "hash": "d5651588726225707c0b3fd97a9325b0863580f5b70d8a081035cb2aabaa8c53",
      "src_tx": "ca67e004b932137f8469d72e1e4147621f890cfc23f6d2f70e38eeb08da85aba",
      "address": "D2S9qZ1x2uiET7zXCdTDcPbbibfRuJdg3U",
      "coins": 10000000,
      "hours": 1
    }
  ]
}
~~~

When executed this will spend output
- 043836eb6f29aaeb8b9bfce847e07c159c72b25ae17d291f32125e7f1912e2a0
and will create outputs
- c09d5afa78684e14a676b13961a756e6fa9b2c5bebb7be71cf2dc143b4f633cc
- d5651588726225707c0b3fd97a9325b0863580f5b70d8a081035cb2aabaa8c53

This transaction takes an output, spends it and creates two new outputs.

##### A transaction is:
- a list of outputs being spent (outputs destroyed)
- a list of new outputs created (new outputs)
- a list of signatures, one per output being spent
- There is an "inner hash" which is the hash of the list of outputs being spend and outputs being created
- You take the hash of the output being spent, compute the SHA256 of the inner hash, with the hash of the output. Then you sign this hash with your public key

A transaction may not create or destroy coins. A transaction must create outputs with exactly as many coins as are consumed in the inputs.

If you have 20 coins in an output, to send 5 coins to someone, you send 5 coins to them and 15 coins back to an address you own. The transaction consumes one output and creates two new outputs.

## Serialization Format:

Skycoin uses a 4 byte length prefix serialization.
- A byte array is serialized by 4 bytes for the length of the array, followed by the bytes.
- An array of 12, 48 byte structs is serialized as a 12*48 in 4 byte prefix, followed by the elements
- structs are serialized similarly

To protect against transaction mutability, the inner hash of a transaction is the "id" of the transaction. The "hash" field is the the hash of the binary serialization of the full transaction.

##### Struct Data:

An output is defined as :
~~~
type UxOut struct {
   Head UxHead
   Body UxBody //hashed part
   //Meta UxMeta
}
~~~
~~~
// Metadata (not hashed)
type UxHead struct {
   Time  uint64 //time of block it was created in
   BkSeq uint64 //block it was created in
   // SpSeq uint64 //block it was spent in
}
~~~
~~~
type UxBody struct {
   SrcTransaction cipher.SHA256  // Inner Hash of Transaction
   Address        cipher.Address // Address of receiver
   Coins          uint64         // Number of coins
   Hours          uint64         // Coin hours
}
~~~

Only the body matters for hashing. The UxHead is metadata, but is used for coinhour computation. Coin hours are intended as "soft constraints". A coin hour constraint may experience a soft violated when moving transactions and balance to a new ledger (ledger migration), but is enforced in general.

#### A transaction is:

~~~ type Transaction struct {
   Length    uint32        //length prefix
   Type      uint8         //transaction type
   InnerHash cipher.SHA256 //inner hash SHA256 of In[],Out[]

   Sigs []cipher.Sig        //list of signatures, 64+1 bytes each
   In   []cipher.SHA256     //ouputs being spent
   Out  []TransactionOutput //ouputs being created
}

//hash output/name is function of Hash
type TransactionOutput struct {
   Address cipher.Address //address to send to
   Coins   uint64         //amount to be sent in coins
   Hours   uint64         //amount to be sent in coin hours
}

The inner hash is the SHA256 hash of the serialization of the In Array and Out array appended together.
~~~

## CoinJoin Transactions

In Bitcoin,
- if two addresses are used as input in the same transaction, they belong to the same wallet
- This allows most addresses in a wallet to be linked as belonging to a single wallet with high probability from the public transaction history

A CoinJoin transaction is a transaction that mixes multiple outputs, from different wallets in a single transaction.
- Even a modest rate of coin mixing through CoinJoin (5% of transaction volume) introduces enough diffusion into network to severely frustrate association of specific addresses to individual wallets or users from public data. Especially for high volume services that end up processing most of the transactions on the network.
- If the third party CoinJoin server is trusted, this has the same level of privacy as ZeroCoin and quantum zero knowledge proof schemes, but with a much simpler protocol.

- In Bitcoin, you can tell CoinJoin transactions apart from normal transactions.
- in Skycoin, there is no difference between a normal transaction and a CoinJoin transaction.

The protocol is simple:
- you send inputs and outputs to a 3rd party CoinJoin server
- they take inputs/outputs from multiple users, randomize order, send back transaction
- each user signs their outputs and sends signature back to the server
- the server injects the transaction into the network

The 3rd party server is unable to steal your coins. If the transaction fails (someone did not send back signatures), you just try again until it succeeds. This is mixing, with no risk of theft of the coins.

There are three axises that information is leaked in Bitcoin
1. addresses from single wallet are colocated in transactions
2. multiple input addresses, single output adddress + change (vs multiple input with sender's coins going into multiple outputs addresses)
3. coin balances vs change addresses are identifiable. If you have 15.328942343 coins and send someone 1.0 coins, then you will have 1.0000 coins in one output and 14.328942343 in the change output. In practice this makes it easy to identify the output address.

Skycoin addresses #1 with CoinJoin for spatial diffusion
Skycoin can address #2 with higher level messaging protocol for receipts exchanging multiple addresses for transactions, off the blockchain, when possible. Also darkwallet type address generation from receiver public key. This also eliminates address reuse automatically.
Skycoin can address #3 by capping coins to integer values and distributing outputs in wallet to a known distribution in combination with #2

Once those three things are done, there is effectively zero bits of information in the public ledger about the receiver or recipient or owners. The outputs, addresses, balances become meaningless pseudo-random numbers that contain no information. They cannot be used to infer the hidden variables from the public record. Nothing can be determined from the public blockchain alone.

With discrete random variable A and random variable B, where A is public and B is unknown, we can ask "How many bits of information does A tells us about B". For transactions these three conditions correspond to P(B | A) = P(B) where A is the public visible variable and B is the unobserved variable that someone ones to infer from the hidden variable.

#2 requires "communication addresses". This is a hash of a public key, that is used to look up data in a DHT (distributed DNS system), to obtain a communication address and receive a list of unused virgin addresses to split the receiving of coins over. The infrastructure for this is almost done, but is a long term project.

Practical CoinJoin, may just be you and the CoinJoin server. The server would maintain a pool of outputs and mix them in with your outputs and never reuses addresses. The CoinJoin server may itself, mix its pool of outputs over other CoinJoin servers. This achieves a high level diffusion at a practical level of cost and implementation complexity.

Temporal diffusion, means that the payment into the N-output addresses occurs over multiple transactions instead of being localized with every input and output in a single transaction. The send is split up over multiple transactions.

##### Example:
- you have a wallet with outputs with coin balances of [1, 3, 5, 7, 11, 17]
- You want to send 12 coins to someone
- You use their communication address to ask for a list of virgin unused addresses for receipt of coins
- You send the output with 5 coins in one coinjoin transactions to address 1 (with multiple other wallets in the transaction); N inputs M outputs
- You send the output with 7 coins in another transaction to address 2
- They now have 12 coins

If the coins are stored with balances sampled from a known statistical distribution (as as uniform distribution of prime numbers less than N) then this does not leak any information

Similarly you could do coinjoin transaction and spent the 17 output, into four outputs
- input [17]
- output [1, 5, 11]
- The outputs all go to never used addresses
- the output of 1 and 11 goes to the recipient
- the outputs of 5, goes to a never used change address

Misc/ Bitcoin Thought Experiment: Perfect Pseudo Anonymity

## Off topic:

To make a Bitcoin variant that leaks no information about wallets or owners from the blockchain, consider the following
- each output can only contain 1 coin
- each transaction can only spend 1 output and create 1 output
- addresses cannot be reused. An address that has received a coin in the past cannot receive another coin.

In this system, to send 10 coins, you have to do 10 transactions. The transactions each transfer a coin from a never used address to a never used address. This is the simplest system that leaks no knowledge about wallets/destinations/recipients.

You could also relax this to allow N inputs and M outputs, but keeping the single coin per output requirement.
- If each send transaction is implemented over a single transaction with N inputs and N outputs,  then the input addresses become "linked" and its no longer anonymous. If two addresses appear as inputs to a transaction you know they belong to the same wallet.
- If the send transaction is implemented with N inputs and N outputs, with CoinJoin, then information is still leaked, but it is fractional bits of information. If two addresses appear as the input to a transaction, the probability they belong to the same wallet is increased.
- If the send transaction is implemented as N inputs and N outputs, as CoinJoin but only 1 address/output from each wallet can be used as input, then no information is leaked. This is back to the 1 input, 1 output case. There is also diffusion. You know that each input will go to one of the outputs, but you don't know which. If you have N inputs and N outputs, there are N factorial ways of assigning the input coins to the output coins.

For a practical system instead of only storing a single coin per output (meaning 150 outputs or transactions to send 150 coins), you fix a probability distribution over the natural numbers and then ensure the inputs output balances conform to that statistical distribution.

##### Example:
Choose uniform distribution over the prime numbers less than 23
{2, 3, 5, 7, 11, 13, 17, 19}

- A wallet is a set of addresses.
- We store outputs associated with the addresses.
- The outputs have balances.
- We never use an address twice (deterministic address generation for infinite sequence of addresses).
- We store our wallet balance over multiple outputs, sampled from a statistical distribution chosen ahead of time

So we have 150 coins in a wallet stored over a number of outputs.
- We will send 50 coins to someone
- We will send 100 coins back to ourselves
- We pick numbers out of the statistical distribution until we get a set that adds up to 150 (our input balance)
- We split the setup into  a subset that sums to 50 and a subset that sums to 100 (if you cant do this, reroll)
- Each number in the subset that sums to 50, becomes an output that is sent to a separate unused address of the recipient
- Each number in the subset that sums to 100, becomes an output that is sent to a separate unused address, back to your wallet
- In practice, you would not spend all the outputs in the wallet

If you have N coins and are sending M coins. You want to sample uniformly from the set of arrays sampled from the distribution, who elements add to N and which can be split into two subsets that each add to N and N-M. There is a proper way of doing this, but its complicated (similar to proper way to shuffle an array, using permutation instead of random substitution for each element of array).

The key here, is that all information about which subset of the outputs is change and without are being sent to someone else, is eliminated. The distribution of outputs no longer depends upon user choice. However, if a user later spends two outputs from addresses in their wallet, in the same transaction, then we can link them as belonging to same wallet (which allows us to go back and gives information about the partition of outputs into the change addresses and the addresses of the recipient after the fact).

Therefore a practical system seems to require a CoinJoin type mixing at each stage and requires that the send is split over multiple transactions rather than all inputs and outputs created in a single transaction.

##### Summary:
- fix the distribution of output balance to a known probability distribution (eliminate information about which addresses are change)
- to do a send, send from N addresses to M addresses. N addresses to 1 address + change, like Bitcoin leaks information
- don't reuse addresses
- CoinJoin with mixing of addresses from multiple wallets as inputs for each transaction is required. Unless each transaction is 1 input and 1 output. Otherwise information is leaked that associates two addresses to the same wallet, by the fact those addresses appear as the owner of the inputs of the same transaction.

It is theoretically possible, if you work through the above, to get perfect level of privacy that cannot be improved, but in practice the requirements are too tedious. "Good enough" privacy means
- all the mixers form a single large mixer network (they mix together over each other over time) and that users have the option of mixing (default support for CoinJoin transactions)
- multiple input and multiple output addresses (unlike Bitcoin's single output address type sends)
- eliminating address reuse for default for transactions (working on this, similar to the above)