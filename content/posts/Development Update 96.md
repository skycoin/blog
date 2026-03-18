+++
aliases = ["/development-updates/development-update-96/"]
date = "2016-01-20"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #96: Skywire Research and Development"

+++
Finished some small things, but mostly design work

##### There are some minor changes
- UPNP support for Skycoin networking is done. Can tunnel through firewalls now.
- Networking will probably be switched from TCP/IP to UDP

## Exchange:

This is ready to go almost, but have to finish

## Other:

The GUI for interaction with networking and meshnet configuration is extremely frustrating. I am trying to find some way to take a shortcut or make this easier.

- I need a cross platform pseudo terminal and a metacircular evaluator for golang. Very frustrating. There is nothing like ncurses that is cross platform.
- I feel like this will require writing an application in opengl on top of SDL. This is annoying because the code base currently cross-compiles 100% and this will break that

I feel like I am rewriting a bunch of software from the 70s and 80s, such as ncurses and pseudo terminal multiplexing... I think if I just keep coding, that it will work out.

There is a new programming technique called CODA that is extremely powerful. TCP/ip implementation is about 20,000 lines in C. In Alan Kay's CODA type environment, TCP/ip type flow control can be implemented in 150 lines.

He was able to implement a full operating system from scratch, with document editor, email and a webbrowser, in 20,000 lines of code

The mesh network requires something like this and may have to implement a simple scripting language for this.

![](/img/dev-update-96-1.png)
![](/img/dev-update-96-2.png)
![](/img/dev-update-96-3.png)
![](/img/dev-update-96-4.png)
![](/img/dev-update-96-5.png)

After two weeks, I figured out how to implement it in very few lines but still has to be implemented and debugged.

This is extremely occult tier mathematics.
- The programs in this language, do not have a representation as a text file
- The syntax looks exactly like golang
- All programs are deterministic
- The programs have a very elegant algebraic representation
- there does not appear to be a difference between local program objects and program objects on a remote machine
- the programs accept only length prefixed bytes as input and emit length prefixed bytes
-  it is recursive (turtles all the way down), in that you can instantiate a "world" or program context and within that context, instantiate three "worlds" or program contexts (own computers) and network them (top level passing messages between them) and run them. The top level programming context appears to be recursive.
- the programs are constructed by applying a series of operators on an object starting in a null state
- the programs themselves are program objects
- the meaning of the program or action of a statement upon the program state is not fixed, but defined in terms of another program object
- it is impossible to write software that is not open source in this language

When we use the computer, we do not interact with software objects. We interact mediated through the computer but not on "computer objects", but rather interact with twitter, facebook, youtube mediated by the computer object, tool, interaction

![](/img/dev-update-96-6.png)

There is a triangle like this, with
- the object on the left (representation, visual thing, object)
- the interaction/goal or outcome on the right  (pragmatics, what you are doing, the operation or action)
- the tool or action at the top (the intermediating thing, the tool that immediate between the object, the reification of the action)

An object starts as a null state, then a finite series of actions are applied to it
- a twitter feed starts empty and then "create tweet" actions are applied in series
- a coin starts with an unspent output set, then transaction actions are applied, that destroy unspent outputs and create new unspent outputs
- a text file is opened and begins empty, then a series of key press or "insert characters", "remove characters" actions are applied
- a wikipedia page starts as a blank text file and then a series of "apply diff" actions are carried out upon the state

The state of the object and the sequence of reifed of the actions to the current states are dual. They are isomorphic and equivalent.
- starting with the null object and applying the actions in series to the state will yield the same result as transmitting the current state itself

This may seem abstract, but the reason it is important is that the nodes act like agents
- they have a goal (such as multiplexing packets across multiple connections)
- they have multiple things or actions they can attempt in order to possibly achieve the goal
- they have to choose a sequence of actions to accomplish the goal

- There are procedural or pragmatic aspects of actions (what an action does) (the result of applying the action to the program state)
- There are declarative aspects of actions (when actions ca be applied, serialization for transmission over network)

This is needed for constructing a program, which can be set with a goal and which can attempt a series of actions to accomplish that goal.
- "retransmit messages from a list of messages, until a receipt confirmation has been received from the destination"
- "find a list of peer who each have data item that hashes to H" (DHT lookup)

Downloading a file is
- "find a list of peers who each have data item that hashes to H"
- "from the list of peers make download requests for chunks of file, until all chunks are received"

- there is a series of attempts to retrieve peers for the hash (DHT or super node)
- for each peer, there is attempt to connect to them (may fail)
-- for each connection attempt, there is an attempt to find a path to the peer (may fail)
- for each connection, there is an attempt to make the chunk download request (may fail)

This type of program is not procedural or declarative, but uses both and is defined in terms of behaviors.

- if file is not downloaded, find peers to who have the file which hashes to X
- if peer is known, but are not connected, then attempt to connect to the peer
- if connected to peer, requests chunks which have not been downloaded
- if file is done downloading, terminate

The language actually looks identical to golang, except that there is a meta-syntactic operator for creating higher order structures like behaviors, attributes, goals and higher order concepts for implementing things like this.

The language has everything stripped out, so I may be able to implement it in a few thousand lines. I am trying to figure out
- should I do this later
- should I do prototype first before writing this

The largest problem is that I don't have a pseudo-terminal that is cross platform and I need a meta-circular interpreter for driving the terminal gui widgets and the best way to do that is an early version of the scripting language.

The scripting language has added security benefit of being memory safe. In theory, you can strip out the whole operating system and just have a program for the networking drivers and another program for disc.