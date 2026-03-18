+++
title = "Skyminer Troubleshooting FAQs"
tags = [
	"Skywire",
	"Skyminer",
]
bounty = 0
date = "2018-04-08"
image = "img/skyminer-the-new-internet-is-here.jpg"
aliases = [
	"/statement/skyminer-troubleshooting-faqs/"
]
+++

#### 1\. Why won't my Orange Pis turn on or light up when I turn on my Skyminer?

The Orange Pis will only light up and turn on when you flash the SD cards with the appropriate images and then insert into the Orange Pis.

#### 2\. Why won't anything light up or turn on when I turn on the Skyminer?

Some switches come with the on/off sides reversed, as compared to instructions in the manual, which expects the "on" side to be on the right. To fix this, first make sure that the Skyminer is not plugged in to your wall AC power outlet.  Then, on the back of the switch, simply remove the brown wire from its connecting tab, and connect it to the other tab as indicated in the image below.

![Skyminer Troubleshooting 7024](/img/skyminer-assembly-7024.png)

#### 3\. Why won't my nodes light up on the router when I turn them all on?

It is best to turn on the manager Orange Pi node first, allow it to boot, and then wait for its respective light on the router to signify that it is on. Then turn on the other Orange Pis one-by-one, allowing time for them to boot individually and light up their LED on the router.

#### 4\. Why won't my Skywire Manager show up at the proper IP address in browser?

To view the Skywire manager, connect your computer to the router at one of the ports occupied by any Orange Pi other than the manager node. Pull up an internet browser and type 192.168.0.2:8000 in to the url box, and hit enter. If the manager does not appear, there is an issue with the the way the IP addresses have been setup.

Check the IP address in your network settings for the Skyminer's router that you are connected to via the ethernet cable. If the IP address is not 192.168.0.1, as indicated on the router itself, then there is an issue with the Skyminer router's IP settings.

Go to the IP address that is showing in the network settings, change the LAN settings for the router to be 192.168.0.1, and save the settings. Reboot the Skyminer and your Orange Pis should be able to use the correct IP addresses. Go in browser to 192.168.0.2:8000 and you will now see the Skywire manager showing there.

#### 5\. Why won't my Skywire router show up with the proper IP address in my browser even after I change it manually?

In setup, you connect the Skyminer's router to your Internet Service Provider's router via the WAN port on the Skyminer router with an ethernet connection.

In some cases the ISP router will take over the default IP address of 192.168.0.1, and this will cause issues for the Skyminer router and nodes, as they try to use the same IP address.

Go into your ISP router settings and change the LAN to another IP address such as 192.168.1.1, and then reboot everything.

Now your ISP router should have a different IP address and the Skyminer router can setup as expected. You can now go to 192.168.0.2:8000 and your manager node login should appear.

#### 6\. I can't change my ISP's router settings to use a different IP address. How do I setup the Skyminer in this case?

In some cases the IP address used by default with ISP-provided routers is fixed, and this also happens to be the same IP address required by the Skyminer. In this happens, it is best to set your ISP router to modem mode, which will force it to use a different IP address. In most cases this address is 192.168.100.1, which will allow the Skyminer router to use 192.168.0.1 as expected.

In this case, in order to have a wifi connection to your ISP router operating in modem mode, you may need to acquire and connect an additional wifi router to your ISP-provided router, and use that wifi router for wireless access.

Also of note, when operating in modem mode some routers will only have one ethernet port active. The active port is commonly the one nearest to the internet input cable/fiber optic cable.

#### 7\. I can't login to my Skywire Manager node?

Your manager node will show a login screen requiring a password, and the default is 1234.

#### 8\. When I log in to my Skywire Manager node on a browser it behaves unexpectedly. How can I fix this?

A common solution to this is to remove or disable any adblockers or similar from your browser, as this can interfere with the Skywire manager.

#### 9\. My nodes aren’t showing up in the manager?

It can take a few minutes for everything to sync with the manager node and to then be reflected in your browser. Click refresh and if the problem persists try rebooting the Skyminer.

#### 10\. I can’t connect to any nodes from the manager. How do I connect?

Open the terminal operation of a node and check to make sure that there is no error message, confirming that it is connected properly. If there is an error message, a common fix is to simply reflash the SD card with a newly downloaded image, then reboot the Skyminer. Repeat the reflashing process a few times if necessary.

Another tip is to fix the IP address of the laptop computer you are using to connect to the Skyminer’s router. Set the IP address to 192.168.0.20, assuming that is not one of the IP addresses that the Orange Pis are trying to use, and it should work much more reliably.

If you set a static IP for your laptop computer, then you can turn off DCHP in the Skyminer router.
