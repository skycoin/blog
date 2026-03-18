+++
aliases = ["/development-updates/announcing-pyskycoin/"]
bounty = 0
date = "2019-01-14"
image = "img/pyskycoin.jpg"
tags = ["Announcements", "Development", "Fiber"]
title = "Announcing PySkycoin, scripting for SkyFiber blockchains"

+++
Skyfleet, we are thrilled to announce the most recent version `0.25.0` of `PySkycoin`, the official Python client library for the Skycoin ecosystem. The library has been under development and testing for about a year. During that time it’s been the key to implement non-trivial numbers of tools and integrations. This article will try to help readers answer some simple questions: _What is PySkycoin? Why should I use it?_.

In short PySkycoin adds a scripting layer on top of the core Skycoin API’s. Now it is possible to use the Python tools we all love to build all sorts of applications powered by the Skycoin blockchain. This is yet another alternative for empowering the many enthusiasts engaged in the unstoppable expansion of the Skycoin ecosystem. The team is committed to ensuring the continued development of this library as well as its companion suite of open-source development tools, and will be hosting each stable release of these code-bases on the official [Skycoin github](https://github.com/skycoin) account. Welcome into the future of cryptocurrencies powered by blockchain!

### **What makes PySkycoin great:**

**1. A rich toolbox feature set**

_PySkycoin_ provides access to the following functionality:

* A client implementation to invoke from remote Skycoin REST API sets enabled for a given node. Support most data sources is included, notably , creating , signing and broadcasting transactions, reading blocks, node status . For the record, it is not possible to retrieve data from endpoints in `PROMETHEUS` API set.
* The Skycoin cryptographic `cipher` functions are mainly aimed at generating pairs of public and private keys from a seed value. This is of paramount importance to generate SKY addresses, to sign hashes, and to perform more advanced operations like generation of shared secrets using [Elliptic-Curve Diffie-Hellman](https://en.wikipedia.org/wiki/Elliptic-curve_Diffie%E2%80%93Hellman) algorithm. All cryptographic verifications can be found here.
* Operations to invoke functionalities offered by the Skycoin command line interface without spawning a separate operating system process.
* Transaction and block operations in the core Skycoin `coin` package.
* Helper functions to deal with currency droplet precision, fees, and logging.
* Configuration and operations on local Skycoin wallets.
* Unlike most of the generic operations mentioned above, the `params` package is fiber-specific. It facilitates the parameters defining an specific SkyFiber coin. This includes, for instance, distribution addresses, and droplet precision.

**2. PySkycoin behaves exactly the same as the Skycoin core API’s**

PySkycoin is not a reimplementation of the core components of Skycoin. In order to make this clear it is necessary to describe how it is built . The first step consists in using the very same Skycoin node source code to generate a [CPython extension module](https://docs.microsoft.com/en-us/visualstudio/python/working-with-c-cpp-python-in-visual-studio) exporting aforementioned functions. As a result PySkycoin:

* behaves exactly the same as Skycoin nodes do
* is as bullet-proof as Skycoin itself
* is highly efficient in terms of memory and CPU usage
* is easy to maintain
* is always in sync with the latest version of the Skycoin node

**3. Intuitive and easy to use**

[PySkycoin releases hosted by PyPI](https://pypi.org/project/pyskycoin/) can be installed using standard tools like `pip`. This will trigger the download and configuration of all other package dependencies required. In order to make things easier for developers the library transforms the go coding styles into more Pythonic, yet equivalent, versions. For instance, go slices returned by core Skycoin functions become `list` objects containing instances of the corresponding type in Python-land.

**4. Python is part of the big programming languages**

Offering the Skycoin API to Python developers opens up an unlimited number of opportunities:

[![Python is TIOBE #1 language in 2018](/img/python.tiobe.2018.jpg)](https://www.tiobe.com/tiobe-index/)

* Python is TIOBE's programming language of the year 2018, and ranks among top 10 languages in all other language rankings.
* It is everywhere.
* It is the most frequently taught first language at universities nowadays.
* It is number one in
  * the statistical domain
  * AI programming
  * scripting
  * writing system tests
* Python is leading in
  * web programming
  * scientific computing
  * big data
  * quantitative economy and financial analysis

### Is PySkycoin an alternative to CX?

Quick and simple, the answer is no. CX is Skycoin’s feature-rich programming language. It is unique of its kind and there is no way all the power and expressiveness of CX can be matched by any other language known to date, even Python. So why bother supporting yet another programming language?

It’s been a while since Skycoin launched, and the community has come a long way in its understanding and optimization of the protocol, availability of development tools, and diversity of client software.

CX is an awesome language that is aimed at facilitating an entire generation of Skycoin applications in the years to come. But we believe open-source ecosystems are strongest when there are a variety of different tools available to developers which offer different features, make different trade-offs and even, to some extent, complement and compete with one another. What if your software is meant to extend an existing solution implemented in Python? What about if your team feels comfortable and proficient enough developing Python applications? Consider as a last example, among probably many others, that you plan to run your application on a restricted environment and installing new dependencies is either not an option or implies additional costs in terms of time and money.

_PySkycoin is the right tool to get the job done_.

We’re proud to offer PySkycoin to the Skycoin community, and are convinced that it’s useful to developers building the next generation of decentralized applications.

In the coming weeks, we’ll also be releasing more tools built around PySkycoin and will be sharing more resources related to other Skycoin client libraries — more announcements to come!

* [Most recent version](https://github.com/skycoin/pyskycoin) of PySkycoin