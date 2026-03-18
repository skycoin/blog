+++
aliases = ["/statement/march-skycoin-ecosystem-technical-report/"]
bounty = 0
date = "2018-04-05"
tags = ["Announcements", "Development"]
title = "March Skycoin Ecosystem Technical Report"

+++
## During the month of March, our development teams have made tremendous progress on many projects within the Skycoin ecosystem

### Skycoin

* Completed command-line interface documentation and overall testing.
* Based on BIP21's Skycoin URIs, "hours" will now be displayed to show the quantity of Coin Hours. For example `Skycoin:2hYbwYudg34AjkJJCRVRcMeqSWHUixjkfwY?amount=123.456&hours=70`
* Using a new [logging module](https://github.com/sirupsen/logrus) to replace the [old module](https://github.com/op/go-logging) to ensure compatibility with future projects.
* Completed Skycoin Exchange Integration's [documentation.](http://github.com/skycoin/skycoin/blob/develop/INTEGRATION.md)
* Tested the newest Go implementation v1.10.

### Skycoin wallet

* Released wallet v22. Completed both the front-end and fixed vulnerabilities.
* Added a [signature](http://github.com/skycoin/skycoin#release-signing) to the newest version of wallet in order to proof its authenticity.

### KittyCash

**_KittyCash Verification Service - utilizing email subscription service to verify the customer's purchase in IKO_**

* KittyCash purchase verification service implemented and tested.
* Added a docker file to the verification service.

**_KittyAPI_**

* Created a command-line interface "ikocli" that can be used to generate Kitty data for IKO.
* Created a command-line interface "testcli" that can be used to test KittyAPI using personal data.
* Upgraded the foundation of KittyAPI to integrate with the Teller cashier function and trading market API function.
* Added docker file.

**_KittyCash's Teller Service_**

* Strengthened the reservation system to stabilise Kitties reservation during IKO.
* Integrated the verification services into the cashier function.
* Integrated KittyAPI into the cashier function.

**_KittyCash Wallet Function_**

* Upgrade the wallet and tested.
* Implemented the trading market function into the wallet.

**_KittyCash Trading Market_**

* Upgraded the basic trading market function.
* Integrated the verification service into the trading market.

**_Kitty Auction Bot on Telegram_**

* Completion of a Kitty auction record robot (untested).

**_Official KittyCash website_**

* Released new website.
* Added a KittyCash game on the website.
* Improved the scoreboard within the game.

### CXO

* Implemented the splitting function in order to allow splitting of large files for simultaneous integration into Merkle-tree.
* Implemented a large file enumeration feature that allows for listing of recently used objects in the database, improving the listing function.
* Implemented multiple features to increase the speed of data exchange for a single node's MaxObjectSize especially during slow network and reducing the need of requests and responses between server and node.
* Added a new method of BoltDB storage based on the original BoltDB.
* Completed the function of exporting the database as a JSON file or into binary.

### Hardware development

* Custom OpenWRT routers tested with a double sided PCB and antennas.

## ![](/img/tech-report-8.png)

### SPO Miners development

* Miners for decentralised storage with 1TB hard discs are being tested by the SPO team. Skycoin team and SPO will continue collaboration and develop a version with custom chips and m.3 SSD form factor for Skycoin.

## ![](/img/tech-report-9.png)

### Miscellaneous

* A brand new website revamp and a [new business white paper](https://www.skycoin.com/skycoin_whitepaper.pdf) were released.
* OTC function for direct Skycoin purchase implemented into the website with CryptoWolf ([https://www.skycoin.com/buy/](https://www.skycoin.com/buy/)).
