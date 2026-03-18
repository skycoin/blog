+++
aliases = ["/development-updates/development-update-46/"]
date = "2014-12-19"
draft = true
tags = ["Development"]
title = "Development Update #46: Skycoin Roadmap for 2015"

+++
The coin was done in January. The only difference if we launched today would be the coin would be trading. There are a few things missing on github, so no one can compile it and launch it before us, without knowing how to program.

## Roadmap For 2015
- We would like to have networking working for the darknet/meshnet.
- The new consensus algorithm will be implemented
- We would like to have some written standards for what is done and tutorials for developers
- Then we have to do hardware
- We are deciding the roadmap for the next phase of the project.

If you look at Bitcoin, there are less then three people working on it. I would say three people but only one person at a time. People come in, finish something and then leave when its done. It took Bitcoin about a year to implement headers only downloads. "Ok we finished Litecoin!" What do you do after you finish Litecoin, Dogecoin or Ripple or anything else? There is no programming or design left, its just marketing. Pump and dump. Every existing altcoin is a pump and dump with no long term viability.

To survive and grow, Skycoin needs to meet a higher standard than other coins. Skycoin has to be useful. It must satisfy a need. It has to breach the great firewall. It has to make meshnets viable and offer an alternative to monopolistic ISPs. It needs to be an effective response to the encroaching threats on the internet. Skycoin needs be able to survive and carry on if Bitcoin fails for internal or external reasons.

People are measuring the success of Bitcoin or Ethereum in terms of piles of cash, instead of impact. They are asking whether Bitcoin is at $300 or $1200 instead of asking what has it changed and what impact it has had. Today Bitcoin was effectively banned in Australia. Bitcoin is being taxed at purchase and double taxed at the point of sale. The tax treatment is so punitive that Bitcoin has been effectively driven underground in Australia. It took five years from launch, until the first government decided to regulate it to death. If we released everything today and the meshnet hardware and software worked perfectly and it was mature, it would still be five years before the node density was enough to threaten ISPs or cell phone companies.

Similarly, Bitcoin survived for five years but we did not know that the mining process would continually drive down the price. We did not know that if miners are spending 100 million/year on electricity and ASICs, that people must buy 100 million/year into Bitcoin to just keep the price where it is against the miners selling Bitcoin. We did not understand the security issues.

Instead of coins with longer term duration, the vast majority of coins have lasted for significantly less time than Bitcoin. We have not seen a single coin that is as solid as Bitcoin, in the last five years.

___

We have a bunch of volunteers and people helping. The development will be opened up in the next stage. Right now, we have more developers than things to do.

###### Right now, we have the following three priorities:
- Consensus needs to be finished (someone is working on this and its fairly specialized). Its phd level research, trial and error. Its ready to move into the codebase, except for a networking library prerequisite.
- The coin is ready to launch
- The software/networking for darknet needs to be finished, which is specialized. The bottleneck is the protocol design, not implementing it. Once the spec is on paper, anyone could implement it quickly. We decided to cut corners if its something we can fix later, to get it working quickly. So we are ignoring problems like designing the protocol to allow establishing a N-hop route without incurring round distance time between node. That will be something someone can figure out and add later.

Those are the three things we are focused on, with our limited resources right now. What comes afterwards, will require a larger number of developers and there will be many smaller projects that need to be done.

For instance, once you can publish data with your public key and have it peer-to-peer replicated, then you will want to do something like implementing Twitter or Blogging over that. Once the darknet works, then you will want to do instant messaging. You will want to be able to tunnel all your traffic over it and use it like a VPN. You will want improved routing service that find faster routers to target nodes. You will want to bundle multiple routes together for performance or latency. You will want to be able to publish websites or services on the network.

The overlay network will be running on software, over the normal internet. Then you will want to add mesh or physical links and that is when the hardware meshnet can start. Then there has to be antenna development, hardware development projects. We have to find people who can do hardware. This is when money helps, is for funding this.

So we are entering a phase where there will be a lot for developers to do. Right now we are only working on those three things.