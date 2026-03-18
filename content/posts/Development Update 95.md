+++
aliases = ["/development-updates/development-update-95/"]
date = "2016-01-06"
draft = true
tags = ["Development"]
title = "Development Update #95: Skycoin Cross Compilation"

+++
## Cross Compilation

##### To cross compile skycoin, do:

Install Gox:
go get https://github.com/mitchellh/gox
gox -build-toolchain

##### Compile:
cd $GOPATH/src/github.com/skycoin/skycoin
$G = skycoin-0.3
gox -output="$HOME/builds/$G-{{.OS}}-{{.Arch}}/$G/address_gen" ./address_gen/
gox -output="$HOME/builds/$G-{{.OS}}-{{.Arch}}/$G/skycoin" ./skycoin/

It will even output NaCl (native client) for ARM.
- native client is an execution sandbox by Google for memory safety and running applications in the browser and phone
- it abstracts the networking and directory access
- it is likely next standard for Android apps and replacement for flash
- there is portable native client, which is like LLVM IR for native client

Right now, most exchanges are using PHP and software libraries that have XML parses with remote code execution exploits. New exploits are being added everyday and others being patched. bitcoind has them too.

Achieving security in the long term, requires going as close to the metal as possible. Getting rid of reliance on excess dependencies we cant control which  are in non-memory safe languages and have exploits and reducing the number of lines of code.
- Raspberry Pi or ARM hardware (no microcode exploits; eventually ideally MIPS or RISC-V)
- L4 kernel (35,000 lines, instead of +2 million lines, formally verified, all actions and drivers in user space)
- Libre linux drivers (open source drivers instead of binary blobs)
- deterministic builds

Those are the minimum requires for acceptable security against a nation state actor.