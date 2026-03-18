+++
aliases = ["/development-updates/development-update-28/"]
date = "2014-06-29"
draft = true
tags = ["Development", "Skywire"]
title = "Development Update #28: Skywire and Skycoin Application Framework"

+++
## Skywire Meshnet

The design is amazing. Skywire darknet router may be able to replace BGP and existing corporate VPN solutions. Its reverse comparable with IPv6 (IPv6 can be embedded over Skywire). Its very simple.

I don't want to talk much about this. Just have to finish implementation and get source code out there.

## Skycoin Application Framework

Extremely exciting.  We have compiler for compiling Golang down to Javascript.

https://github.com/gopherjs/gopherjs

- Aether apps will be in Golang.
- The Golang will be compiled down to Javascript.
- The Javascript app will be stored in key zero in the Aether store.
- The other keys will contain data driving the application
- The app uses the AngularBinding for DOM manipulation
- Some functions will be exposed via API through DOM (DHT lookup, messaging)

This is a major step towards having iOS/Android style Darknet apps running on Skywire darknet.

## Skywire Daemon Progress

Almost working. A few changes left. Changes to service introduction packet format, refactoring, removal of 2,000 lines of redundant code and other changes.

## Project Management

Some things can be written down and handed by other developers. They are isolated, independent and easy to describe in detail.

Other things are very complicated design problems, where there is not a correct answer. Very difficult to outsource or delegate. These are problems, where if three developers are working on it, they each have own solution and insist it is the best solution. They cant agree at all. If they compromise the design ends up being worse than any of the individual solutions (design by committee).

We are getting through the last of the difficult problems. These design choices relating to how project components are structured, API interface and messaging formats. This is blocking the work the other developers need to do.  We are nearing end of this and can expand development effort soon.

## Distribution

The blockchain was running in January and we should have kept it running and just made that the blockchain. Remaining changes affecting blockchain should be finalized and then coin will be "launched". However, much work ahead.