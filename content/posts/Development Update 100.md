+++
aliases = ["/development-updates/development-update-100/"]
date = "2016-03-30"
draft = true
tags = ["Development"]
title = "Development Update #100"

+++
Some of the developers had problem with management style and were confused about what needed to be done. Now I am trying
- I assigned one thing to each developer
- I narrowed the task down to be very simple and self contained
- There is a group to recruit developers and staff developers to tasks now

We are trying to split everything up, into small manageable tasks.

Now they are saying everything will take two weeks.

We are building up a separate project management and marketing team, so the core developers can be left alone and focus.

Right now we are transitioning into a:
- Research/design/security team (researchers and core developers)
- Marketing/PR group (completely separate and is actually composed of multiple overlapping groups of the skycoin investors, altcoin cartel members and other)
- Project management group, who can handle miscellaneous tasks and find developers to do them (like putting the wallet on the website, frontend development, fixing bugs, hire developers to work on sub-projects etc...)

We have a problem, because we are not set up to manage the number of sub-projects and developers for the next stage of the coin.

Whole parts of the project are still unstaffed and we have several software components on the critical path, that are unstaffed. We also had no project management infrastructure setup for the first four years of the project, so many of the developers did not know what to do.

For instance, this is what getting the skycoin wallet builds looks like

- Person C communicated to person A had to put new version of the wallet on a website
- Person A reported CGO cross compilation error
- Person C communicated to person B to try to compile in the VM natively
- Person B accidentally deleted the VM for compilation
- Person C had to spent 2 months deprecating C crypto library to avoid CGO
- Person D had to fuzz crypto library and found bug
- Person D communicated back to person C about the bug
- Person C communicated to library author and had to wait two weeks for bug to be fixed
- Person C asked person D to fuzz library again and finds that we need to upset sipa's libsecp256k1 because the old version has different outputs for some rare private keys than the new version
- Person C updates repo with new software
- Person C gets gox cross compilation working
- Person C tells person A to cross compile
- Person A cannot cross compile because the build scripts are not documented and no one knows who to get them working
- Person C looks at it and finds out that gox compiles the exe but now packaging is broken
- Person C asks person E who wrote the build scripts to update them
- Person E finds that embedded npm package is bitrottened and does not want to maintain it and it is breaking the builds and needs to be deprecated for cross compilation. Three days are spent fixing "bug" because golang did not recompile library automatically when source code changed, because of bug in how cgo follows symlinks outside of the $GOPATH
- Person E starts deprecating nwging something library
- We have to wait until nwging something is deprecated and packaging is fixed for windows
- The go cross compilation fails for 32 bit because of a file in the cypto library with 4 megabytes of constants in arrays, that trigger and "out of registers" error.
- Now we want to deprecate the secp256k1 library for another library, because we don't know what these 10,000 lines of constants in this file are and why we should trust them. Why do we need 10,000 lines of hard-coded constants to raise the base point to the power of a 256 bit integer in an elliptic curve mode some 256 bit prime? Where did these constants come from?
- Then we have to find the person who registered the skycoin domain and get DNS setup
- Then we have to ask person to start a server and put the website on the server, then login and upload the builds
- To get a system icon for skycoin wallet, we need a library that has not been ported to Windows yet

This is just to get the fucking wallet on the website. I want to stab someone.

This reminds me of the minute man missile tests, where if they had a nuclear war and actually tried to launch the missiles that 60% of the missiles would fail during launch because of software bugs.

Getting cross compilation working is literally a fifty step process, that entailed rewriting a secp256k1 elliptic curve cryptography library from golang.

Now we have to upgrade the wallet from Angular JS to Angular JS 2.0, so we can run the wallet on mobile. We have to get build scripts setup for typescript and whole toolchain working. There are still bugs in the original wallet from a year ago, that have not been fixed because we do not have person assigned to it yet.

We are trying to get project management infrastructure setup and project management team, so that they can assign developers to as much as possible, without involving the core team.

I am trying to focus on day to day, getting to the next thing.

CX:

The Skycoin white papers are two years out of date.

We are finishing:
- Wallet
- Exchange
- Meshnet

Those are only three things the core team is working on and there is one person assigned to each sub-part

After that, there are a number of projects and infrastructure we are building to promote adaption of Skycoin and which is also shared infrastructure.

CX is the planned base application layer for the Skycoin applications ecosystem.
- CX is similar to C and Golang
- It is very simple and easy to use
- It is deterministic
- It is designed to be embedded in personal blockchains, but also as an application language
- It is based upon the pi-calculus, communicating sequential processes and Combined Object-Lambda Architectures (COLA)

It is designed for implementing application business logic and protocols, where software objects on different personal blockchains need to communicate.