+++
draft = true
title = "How Well Does the Meshnet Work?"
tags = [
    "Decentralization",
    "Skywire",
    "Development",
]
date = "2014-06-19"
description = "Can the Meshnet Bypass the Great Firewall of China?."
+++
Quote from: **Korean** on September 26, 2014, 05:45:00 AM
>How well does the Meshnet work right now?
>Can it get pass the great firewall of China?
>Is there a standard hardware that you recommend?

Yes. It was designed explicitly to defeat existing state-full packet inspection hardware. This includes the great firewall.

There is no fixed port, no protocol headers. There is not a single byte of plain text traffic in wire protocol, which can be used for identification of the protocol type. The traffic is complete noise. Disguising the traffic to be recognized as SSL or HTTPS is very easy.

The darknet is designed to run over IPv6. If you are tunneling over clearnet, you can potentially create thousands of different IPv6 addresses for your server, have each connection use a different IP address and rotate out IP addresses. If you are only connected to a fixed set of hand chosen nodes, there is no way to trace your node public key back to an IP address.

The traffic can only be identified through a statistical analysis. Blocking the traffic effectively requires installing hardware close to the end-user and for controlling traffic within the data center at peerage and cross-connect points.  Detecting and blocking access at the edge of the network, is much more practical than blocking it at the center. However, doing this requires installing large amounts of very expensive hardware.

Blogs, twitter feeds and other static content on the darknet would be stored in Merkle-DAG format and peer-to-peer replicated. So syncing data in china only requires the data leave border once (once a copy of the data is outside of the border, its replicated peer-to-peer between the subscribers and each chunk has signature checked against public key of the publisher). A satellite uplink, or few clandestine connections to Hong Kong might be enough.

China is focused on blocking traffic entering and leaving the country (at border), which is tightly controlled. The focus is on blocking access for end-users. We have to do test to see if they are able to block traffic internal within China (which we doubt). We also think there is minimum ability to block traffic within and between data-centers within the country. Most of the blocking will be at the border between China and rest of internet and at the ISP level on the individual user.



