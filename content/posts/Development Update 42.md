+++
aliases = ["/development-updates/development-update-42/"]
date = "2014-11-12"
draft = true
tags = ["Development"]
title = "Development Update #42: Skycoin Security Concerns and Measures"

+++
The recent attacks on Tor and incidents with Bitcoin are putting pressure on us to release.

##### Changes
- Standardizing serialization formats.
- Finishing documentation.
- Changes to internal organization of /src/visor (which runs the blockchain). The wallet manager is moved out of visor. Visor has golang interface based upon the Obelisk Darkwallet API, then another module will run a web-server and manage your local wallets and checks for balances and so on. This makes it more flexible for using visor as a library without running a full node.
- All the branches are on same version of networking library now. We are going to branch that off into its own repo. I think we can pull that in as dependency from the public repo and see what is left in the daemon module, then move that somewhere. Then everything should be in order.

When documentation is done, there are a small series of golang libraries that need to be developed. This is great project for anyone who knows golang.

## Darknet/Distribution Application Security Concerns

The Skycoin web wallet is using Webkit renderer and Google V8. We believed that we could run darknet apps securely on top of same infrastructure, where the javascript and data was from a synced MerkleDAG store replicated locally. This would allow Dark-market type functionality and more complicated applications. Since the data is local, the page load time is zero for static content. So it would be much faster than tor and also protects the host from DDoS attacks, as the static data and updates to that data is replicated peer-to-peer rather than querying server for each page request.

We assumed that a remote service could not break out of the sandbox, regardless of input to the sandbox. The Javascript engine and rendering engine is huge and has a large number of dependencies. Google is rapidly making changes and there are bugs, crashes and zero day exploits. We cannot rule out a zero day exploit that might arise in future or be present in the version being used. The webkit window is running in separate process, which adds some security, however its not perfect.

Google intends to compile and run Blink and V8 inside of Portable Native Client (PNaCl). This would solve the security problems and ensure sandboxing regardless of exploits in V8 or Blink. However, Google is not ready with this yet and it may be a few months. V8 appears to be running in NaCl however.

Portable Native Client, PNaCl is a subset of LLVM Bitcode (the binary representation of LLVM intermediate form). It is compiled down by LLVM to a machine dependent format. There are checks to ensure that the program cannot perform operations that would escape sandbox.

PNaCl takes C/C++ (gcc toolchain) and outputs a subset of LLVM Bitcode. Then the bitcode is compiled to native code with LLVM. The compiled binary is verified and modified so that it cannot break out of sandbox if executed. The slowdown from V8 inside of NaCl sandbox is 50%, but this is acceptable for the security.

Network and file access occur through an API. The application does not have native access to network or file system. This prevents the application from being able to find the IP of the machine it is run on or other identifiable information.

This type of high security browser would be good frontend for rendering and interacting with darknet applications. It is also relevant for the Tor project, as there is less room for meta-data leaks and browser exploitation.

We know for instance, that there was a zero day in a firefox XML library that could be triggered through javascript, which has ability to hijack the process. If a hidden service is seized or compromised, that attack could have been used to identify users and install a backdoor or key logger on their computer or merely obtain their IP address.

Another concern is browser fingerprinting. A darknet application should be unable to identify a computer uniquely, by running a program on it. We are not sure if LLVM Bitcode to NaCl bitcode is deterministic. Run times for various operations will vary between different CPUs and this can be used to finger print. If the compilation from Bitcode to NaCl is not deterministic, then a specific cached compilation of a darknet app can be fingerprinted.

Interpretation of the LLVM Bitcode on an emulator type virtual machine, eliminates finger printing but slows it down. V8 uses runtime code generation which makes this approach frustrating, because it now requires implementing a secure x86 emulator rather than a simpler and more flexible emulator that implements LLVM Bitcode.

Natively compiled code may be subject to microcode exploits. V8 may even allow microcode vulnerability exploitation from javascript, given that it is doing run-time compilation to machine code. A microcode exploit may allow a computer to be rooted by clicking a link over tor/darknet, where the page runs specific javascript. However, this would only be used against a high value target. The only way to mitigate this attack is to disable javascript or compile everything down to LLVM IR, interpret the code on an interpreter for the IR.

That was our original approach, but I don't see how it will work with Blink/V8 as the frontend for the application.

What we can now works and its very secure, but in long term we have to work out these problems.