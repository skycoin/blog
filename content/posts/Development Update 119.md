+++
aliases = ["/development-updates/development-update-119/"]
date = "2016-12-06"
draft = true
tags = ["Development"]
title = "Skycoin Development Operations"

+++
## DevOps

###### We have ansible scripts and docker containers for automating deployment.
- https://github.com/skycoin/devops
- We need a lot of help with this

###### Install docker and docker-compose
- git clone github.com/skycoin/devops
- cd devops
- docker-compose up

###### Then it will:
- Start up a debian VM and a Alpine Linux VM
- Use the alpine linux VM as ansible agent to do installation on the debian hosts
- Install golang
- Pull skycoin
- Pull dependences
- have skycoin image ready for running and deployment

## Switch from Void linux to Alpine:

###### We are switching defaults for our server deployment from Void Linux to Alpine linux, because of better support
- no SystemD
- MUSL instead of glibc
- minimum image size of 6 Mb for docker container
- runs on ARM
- alpine linux can run docker and docker-compose

## Network Unreliability Affecting Unattended/Automated installs:

In China, Japan, Hong Kong and South East asia, DNS is not working reliably and we are internalizing external dependencies and golang repos into IPFS for peer-to-peer replication.

###### We have experience network unreliability for:
- github (dns fail, https timeout, https works then is throttled down to 4 Kb/s, then drops later, sporadic unavailability in south-east asian region)
- debian/apt-get (DNS resolution failure for debian, speed throttled to 4 Kb/s, sporadic unavailability in south-east asian region)
- golang installation (google servers blocked in china)

###### To rebuild client gui requires:
- golang binaries (static file IPFS, or wget/remote server dependency)
- golang dependencies in the gopath (dependency on github, or later can be moved into IPFS)
- apt-get install npm (debian dependency)
- NPM install (NPM server dependency)

###### To only run the client/server/meshnet requires:
- golang binaries (static file IPFS, or wget/remote server dependency)
- golang dependencies in the gopath (dependency on github, or later can be moved into IPFS)

So we should be able to have skycoin node and meshnet nodes running completely from IPFS without depending on DNS and using only local resources. This should significantly improve deployment speed and reliability for unattended and automated installation.

###### The end goal is that:
- all our files required for installation should be in one volume (zip file or IPFS)
- everything required for install should be in that volume
- install will complete and server will run reliably, even if network cable is unplugged from server (offline installation, with no network resources or foreign dependencies)
- installation should be fully automated (unattendend installation and automated deployment)

###### This solves the following problems:
- Our build process has been very poor and needs to be completely automated (for build bot)
- The internet is falling apart internationally and has been getting progressively worse over last year, especially for Russia, China, Brazil and South East Asia. Scripts that would work perfectly are failing because of inability to access cross border network resources, because of filtering, throttling at border or cyber attacks on the DNS system.
- Even within China, traffic between different ISPs will often completely drop for seconds at a time, screwing up installation scripts, while overseas traffic is also dropping sporadically or being filtered. Within China, all installations requiring access to github.com, apt-get repos often fails. Access to all google servers is blocked (including golang binaries and git repositories hosted on google servers).
- Several people have offered us single VPS servers to run nodes on. Someone offered us 3 nodes. Another person offered 5 servers. Another sent us a list of IP, username/password for 30 VPS servers. Another person offered  two hundred servers. We do not have time to maintain and update the nodes by hand. We need completely automated deployments with ansible.
- A medium sized meshnet node deployment for VPS might be ~30,000 nodes. So we need perfectly reliable, automated installation, deployment and self-testing. The human time, should not increase as the number of servers/nodes increase. It has to be zero marginal cost.

For instance for servers in Singapore, japan and Tokyo we are getting errors like this.


![](/img/dev-update-119-1.png)


So for reliability we need to internalize all our dependencies to eliminate the possibility of disruption of access to network resources, preventing deployment and installation.

These are problems we are having right now. There is not even a war yet and the submarine cables have not even been cut yet. I cannot figure out why there are are so many problems with HTTPS, SSL and DNS lately.

We have even seen our installation scripts broken by errors indicating a SSL packet injection attack, which were only observed on servers at a large corporation that may be an interesting target for attack and only if we are accessing overseas resources. We have also observed DNS problems, when a VPN is used to particular countries and where traffic passes through particular countries.

DNS Is completely insecure and broken. DNS is completely unencrypted and 3rd parties can easily modify DNS packets in transit. It is not reliable anymore, because of the increasing weaponization of DNS by ISPs. I am getting these DNS problems in Singapore, Hong Kong an Taiwan now.

We also had failed DNS resolution cause an inability to access STUN servers, so the node was unable to determine its public facing IP address.

China's cyber security policy appears to include blocking every overseas resource (such as docker), controlled or owned by an entity subject to US/NATO national security orders. Unreliable networking causes a slew of meaningless Docker errors that the program is not designed to handle.