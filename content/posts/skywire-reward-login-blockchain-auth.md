+++
date = "2026-04-09"
tags = ["Skywire", "Skycoin"]
title = "Blockchain Wallet Authentication: The Skywire Reward Login System"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

### A Proof-of-Concept Blockchain Authentication System

The Skywire reward system includes a user login feature that demonstrates something interesting: **authentication using blockchain wallet ownership, with no passwords, no email verification, and no server-side secrets**. The login flow is more or less an academic demonstration — the reward system doesn't strictly need it for its core function — but the technique generalizes to any scenario where you want to prove ownership of a cryptographic key without exposing it.

This article walks through the design, why it works, and why the BIP44 xpub variant is effectively a one-time pad for authentication.

---

### The Problem

You have a user who claims to own Skycoin address `ABC123...`. They want to log into the reward system to see their reward history and update their reward address. How do you verify they actually control the private key for that address?

Traditional options:

1. **Password authentication** — requires the server to store password hashes, handle resets, etc. Unrelated to the wallet at all.
2. **Signed message challenge** — server generates a random nonce, user signs it with their private key, server verifies the signature. This works, but requires wallet tooling that can sign arbitrary messages. Not all wallets expose this.
3. **Send a verification transaction** — the server asks the user to send a specific amount to a specific address. Only someone who controls the private key can sign and broadcast the transaction.

The reward system uses option 3, with a twist: it runs its own ephemeral blockchain for the verification transactions so **no real coins are spent**.

---

### The Login Chain

When you run `skywire cli rewards loginchain`, the reward server starts a small Fibercoin blockchain on localhost with:

- **Block publisher** on port `6001` (peer) / `6421` (API)
- **Peer node** on port `6002` / `6422` — the one the wallet connects to
- **Ticker**: `SWL` ("SkywireLogin")
- **Coin hours**: `SLH` ("Login Hours")
- **BIP44 coin type**: `8001` (different from Skycoin's `8000`)
- **Max supply**: 1 billion SWL (doesn't matter — these coins have no value)

The login chain is a full Fibercoin created with `skycoin newcoin` — same consensus, same wallet tooling, same everything. It just happens to exist only on the reward server and its coins have no exchange value. This is a neat demonstration of [Fibercoin flexibility](/posts/guide-creating-a-fibercoin/) in its own right.

---

### The Authentication Flow (Simple Address Mode)

When a user logs in with a regular Skycoin address:

**Step 1: User submits their reward address**
```
POST /login
address=ABC123...
```

**Step 2: Server creates a pending login challenge**

The server:
1. Looks up the address in its reward database to find which visors it's associated with
2. Generates a random **challenge** (16 bytes of hex)
3. Derives a **unique verify address** from the server's genesis seed at an incrementing index
4. Creates a pending login record:

```go
type pendingLogin struct {
    Address       string    // user's reward address
    VerifyAddress string    // unique per-challenge receive address
    Visors        []string  // visors associated with this address
    Challenge     string    // random challenge string
    CreatedAt     time.Time
    ExpiresAt     time.Time // 10 minute window
}
```

The key detail: **every challenge gets a unique verify address**. The server uses an incrementing index to derive a fresh address from its genesis seed for each pending login. This prevents confusion or piggybacking — a transaction to a specific verify address unambiguously corresponds to one specific challenge.

**Step 3: Server sends SWL coins to the user's address**

The server runs `createRawTransaction` to send some SWL (login chain coins) from its genesis address to the user's reward address on the login chain. The txid is recorded in the pending login.

This is the key insight: **the user needs SWL coins to complete the verification**, and only the server can produce them because only the server has the login chain's genesis key. So the server is effectively handing the user a one-time authentication token in the form of on-chain coins.

**Step 4: User sends coins back from their address**

The user points their Skycoin web wallet at the login chain node URL (`http://127.0.0.1:6422` or the server's proxy), sees their SWL balance, and sends some coins to the verification address the server showed them.

For the user to do this, they must:
1. Control the private key for their reward address (to sign the outgoing transaction)
2. See the SWL coins the server sent them (which they only see if their address is correct)
3. Send to the specific verify address (which is unique to their challenge)

**Step 5: Server confirms the verification**

The server polls the login chain for the balance of the verify address. When it sees coins (any amount), it knows the user controlled the private key, because only the private key holder could have signed and broadcast a transaction from that address.

```go
verifyCoins, _ := checkBalanceOnLoginChain(loginNodeAddr, pending.VerifyAddress)
if verifyCoins > 0 {
    // User is authenticated. Create session.
}
```

The browser is polling `/login/check` every 3 seconds, and as soon as the verification is confirmed, the user is redirected to their account page.

**Step 6: Session creation**

The server generates a random 32-byte session ID, stores the session with a reasonable TTL, and sets it as a cookie. The user is now logged in.

---

### Why This Works

The security of this system comes from three properties:

1. **Only the private key holder can sign transactions from their address.** This is a fundamental property of ECDSA signatures.
2. **Each challenge has a unique verify address.** An attacker can't reuse a transaction from a previous challenge or another user's transaction.
3. **The login chain is ephemeral and server-controlled.** There's no real money at stake, and the server controls block production, so it sees every transaction immediately.

The server never learns the user's private key. The user never reveals anything beyond their public reward address. The only thing exchanged is a coin transfer on a worthless blockchain, but the signature on that transfer is proof of key ownership.

---

### The Xpub Variant: A One-Time Pad for Authentication

Here's where it gets interesting. Skycoin wallets support BIP44 HD wallets, which means a user can publish an **extended public key** (xpub) that lets anyone derive their public addresses without learning the private keys. The reward system supports setting an xpub as the reward address, which has privacy benefits — rewards can be paid to a fresh address each time, so reward payouts are unlinkable on the blockchain.

For login, the xpub case works a little differently:

**Reward addresses** come from the **external chain** of the BIP44 hierarchy: `m/44'/coin'/account'/0/index`. Each reward payment goes to the next unused external chain index, so the user's rewards are spread across many addresses.

**Login addresses** come from the **change chain**: `m/44'/coin'/account'/1/index`. The server derives the user's change chain address (specifically `m/account'/1/0` — the first change chain address) and uses that as the `LoginAddress` for verification.

Why the change chain? Two reasons:

1. **No collision with reward addresses.** The external chain is used for reward payouts. If login used the same chain, verification transactions could collide with or be confused for reward transactions.
2. **Change chain addresses are rarely used externally.** In normal wallet usage, change addresses only receive the change from outgoing transactions. So requesting a transaction from a specific change chain address is a very focused challenge — it's proof that the user not only controls the xpub's private derivation path but specifically has the change chain wallet set up.

**The one-time pad analogy** — here's the beautiful part. When a user publishes their account-level xpub:

- Anyone can derive external chain addresses: `xpub → child(0) → child(i)` for i = 0, 1, 2, ...
- Anyone can derive change chain addresses: `xpub → child(1) → child(i)` for i = 0, 1, 2, ...
- But **only the user** can sign transactions from any of those derived addresses.

Each derived address is used **exactly once** for a specific purpose:
- `m/account'/0/0` receives the first reward
- `m/account'/0/1` receives the second reward
- `m/account'/1/0` proves login via a verification transaction

Every authentication interaction derives a new address from the xpub, and each address is cryptographically independent of the others. An attacker observing multiple logins from the same user sees transactions from different addresses that look unrelated on-chain. The derivation path itself is the shared secret between the user and the verifier — like a pre-shared pad where each entry is used once and then forgotten.

Unlike a traditional one-time pad, there's no finite supply of pad entries — the BIP44 hierarchy gives you $2^{31}$ indices per chain, which is effectively unlimited. And unlike a traditional one-time pad, the user doesn't need to store any secret beyond their wallet seed — the addresses are deterministically derived on demand.

---

### The Depth Gotcha

One subtle issue motivated a bug fix and documentation push earlier this month: **the Skycoin web wallet shows the depth-4 xpub by default, but the login system needs depth-3**.

BIP44 path levels:

| Depth | Path | What it is |
|-------|------|------------|
| 0 | `m` | Master key |
| 1 | `m/44'` | BIP44 purpose |
| 2 | `m/44'/8000'` | Skycoin coin type |
| 3 | `m/44'/8000'/0'` | **Account-level** — this is what login needs |
| 4 | `m/44'/8000'/0'/0` | External chain (reward payout addresses) |
| 5 | `m/44'/8000'/0'/0/i` | Individual external address |

The web wallet's "Show xpub" button exports the **depth-4** external chain xpub (path `0/0`). From this, you can derive more external chain addresses — which is what the wallet UI wants, so you can monitor balances for future addresses. But you **cannot** derive the change chain from a depth-4 external chain xpub, because the change chain is a sibling of the external chain, not a child of it. Going from depth 4 back up to depth 3 is impossible (that's the whole point of hierarchical deterministic keys).

So if a user exports the depth-4 xpub and uses it as their reward address, rewards still work (the server derives more external chain addresses from the depth-4 xpub). But **login breaks**, because the server can't derive the change chain address it needs for verification.

**The fix** — `DeriveLoginAddressFromXpub` now checks `accountKey.Depth` and returns a clear error:

```go
if accountKey.Depth == 4 {
    return "", fmt.Errorf("xpub is at chain level (depth 4), not account level (depth 3); " +
        "use 'skywire skycoin cli walletKeyExport WALLET -k xpub --path=0' to get the account-level xpub")
}
```

And the login UI shows a dedicated error page explaining the BIP44 hierarchy, pointing users to the right CLI invocation. The correct command is `skywire skycoin cli walletKeyExport WALLET_FILE -k xpub --path=0`, which exports the account-level (depth 3) xpub. The default `--path=0/0` gives the external chain xpub (depth 4, wrong for login).

---

### What This Demonstrates

The login chain is, more or less, a technical curiosity. The reward system would work fine without it — you could just use standard authentication and a database. But running an entire ephemeral Fibercoin blockchain just to do authentication demonstrates a few things:

1. **Fibercoin creation is cheap enough to be disposable.** A full blockchain with its own ticker, ports, and distribution addresses can be stood up as a dev dependency. This is only possible because [Fibercoin infrastructure](/posts/guide-creating-a-fibercoin/) is lightweight and embedded in the Skycoin binary.

2. **Blockchain-native authentication is practical.** No passwords, no email verification, no server-side secrets related to the user's identity. The server just watches an on-chain address for transactions. The user's wallet is the authenticator.

3. **BIP44 xpubs enable stateless server-side identity.** The server doesn't need to store anything about the user beyond their xpub — addresses are derived on demand for each interaction. Combined with per-challenge derivation indices, this gives genuine forward secrecy: compromising a session doesn't leak anything about past or future sessions.

4. **Depth-3 vs depth-4 matters, and wallet UIs should expose both.** The account-level xpub is strictly more useful than the external chain xpub for integration purposes. The Skycoin web wallet's default export is the less-useful one — something the developer tooling should probably change in the future.

The login chain remains running as a proof of concept. It's not particularly user-friendly compared to a password prompt, but it's theoretically interesting — you can authenticate to a service using nothing more than your wallet, and the service learns nothing about you beyond the fact that you control a specific key.

See also: [Transitioning to Bandwidth-Based Rewards](/posts/skywire-bandwidth-rewards-transition/) | [Creating Your Own Fibercoin](/posts/guide-creating-a-fibercoin/) | [Skycoin v0.28.4 Released](/posts/skycoin-v0.28.4/)
