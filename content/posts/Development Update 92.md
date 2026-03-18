+++
aliases = ["/development-updates/development-update-92/"]
date = "2015-12-20"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #92: Skywire Mesh-net/VPN"

+++
###### There are three major goals/milestones right now:
- Get crypto port to golang finished (so we can do cross platform builds)
- Get liquidity (exchange platform)
- VPN/meshnet/darknet prototype or version 1 release

###### Crypto:
- Someone else (two other people using the library) is working on the crypto bug (which only affect 1 in a few thousand keys). When they finish it, we will test it again.
- Then we will set this up https://dzone.com/articles/releasing-cross-platform-go-binaries-using-goxc-an
- We will have automatic cross platform builds

## Exchange:

I need a command line environment for doing particular things and testing. Then can expose the data and commands as JSON over local host and someone can do a web interface.

There are many small, very frustrating tasks that need to be done in order to get this working.

There are major changes to software ideology, architecture, simplification and how the user interacts with software. Skycoin is stuck in between the generational changes, in that particular things are needed, that do not yet exist. Most of the time is spent building tools and scaffolding, that later things are built on.

## Meshnet/Darknet/VPN:

The version one is designed. The simplest thing is just wrapping and forwarding packets. Then tagging on a VPN frontend or the networking interface (which we already have).

This part is actually a set of small infrastructure pieces including a terminal environment (interface standard), a scripting language, a virtual machine (machine/node standard).

This is something completely new and may not make any sense. It is a framework for dealing with the problems of building a type of application that currently does not exist and has never existed yet.

- The first generation was single user mainframes (single processor,running single program)
- The second generation was single user mainframes, with ability to switch between programs (single processor, time sharing)
- The third generation was multi-user mainframes (single processor, multi-user, time sharing between programs)
- The fourth generation was personal computers (individual computer per person)
- The fifth generation was networked personal computers (individual computer, per person, multiple applications per computer, inter-computer communication)

In the next generation a person will have a "personal cloud"
- will have six tablets
- will have two laptops
- will have six block storage devices on their personal network
- will have half a dozen routers/access points
- will have appliances
- will have networked microprocessors in their shoes and clothing
- will have thirty speakers, each connected to network, with individual CPUs
- will have a fleet of robots, Roomba or other self-mobile devices attached to network
- ...

You end up with a network, where each device in the network has
- processing
- memory
- networking/communication
- storage

Where an individual may have control or at least read access to several hundred devices, which expose heterogeneous capacities.
- tablets/laptops/screens run GUI/display driven applications
- block storage devices read and write files over the network
- speakers play sound over the network
- thermostats and light-bulbs export data and expose an interface
- etc...

In the current generation, where someone plays an mp3 on a tablet or laptop
- the interface is on the tablet
- the song being played is stored on the tablet
- the song is played outputted from the tablet

In the next generation
- a person selects a song on a tablet (interface)
- the song itself is stored on a disc drive (which has its own CPU and is networked) (not on the tablet)
- the song is played on six speakers in the room they are in (which has own CPUs and are networked)

The interface/command node is different from the node where the file is stored and is different from the action (playing mp3 through speaker).

When a television plays a movie, the movie will be streamed from a disc over the network. There is a unified view of the data, that is accessible everywhere. There is no distinction between local storage and capacities and remote capacities over the network.

These types of applications are beyond "Peer-to-peer" and are "Decentralized" or "IoT" type.

The Skycoin Meshnet/Darknet/VPN/Software Define Networking/Node is one of these applications. There is a minimum framework required, to write an application of this type, which currently does not exist.


The most horrible part about this, is that the time consuming parts do not matter. All of the time is wasted in debugging, fixing small things. The important things are done quickly and the trivial, takes 20x as much time.

For the exchange, I have to get gocoin working for checking address balances, signing transactions and injecting the transactions to the network. I need to add more URLs/functions for checking if a transaction has executed, to the skycoin daemon.

I need an eval/repl loop for the exchange client which is frustrating. The libraries are shit. I almost thinking of writing an opengl program for displaying grids of characters, then a whole library supporting it if I want scrolling with mouse wheel or refocusable widgets (but do not want to write anything if possible).

Just something as simple as a cross platform console or equivalent of ncurses, does not exist. It is very frustrating and maddening.

I am considering an interface in javascript/html, just to finish it quickly.

Ideally I would just like an embedded golang/REPL library that works well. That would solve my problem.

https://github.com/sbinet/go-eval
https://github.com/sbinet/igo
https://github.com/vito/go-repl
https://github.com/motemen/gore

For javascript/html interface, it polls with get/post, but need way to send an event back from the application to the web-browser. This is called "push notifications' or WebRTC.

I have to decide whether the interface should be Angular.JS or just use jQuery or application specific/terminal.