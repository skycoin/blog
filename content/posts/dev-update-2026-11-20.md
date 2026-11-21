+++
date = "2026-11-20"
tags = ["Development", "Skywire", "Skycoin", "CX"]
title = "Skywire Development Update — November 20, 2026"
image = "img/skywire-the-next-internet.png"
image_position = "left bottom"
+++

The twentieth of November was CX's biggest day in years, with 88 pull requests merged into skycoin-cx. The language got its first numbered revision, which removes the built-in operators on strings, and its built-in libraries moved under `sys/`. The compiler's intermediate objects began moving into managers with checked handles, the run loop stopped allocating, and programs that lower fully now run on a new flat VM. Behind that came a long list of compiler, runtime and loader fixes, and a sandbox for the files a program can open. On the Skywire side, Skywire Mobile 0.0.13 was released with fixes from a tester of 0.0.12.

### CX: Language Revision 1

Opcode numbers used to come from registration order, so removing an operator renumbered every later opcode, and the numbers also moved with build tags. **`skycoin-cx#297`** gives every opcode a fixed number and versions the language. **`skycoin-cx#184`** adds library functions that compare strings by value, by pointer and in order, and **`skycoin-cx#197`** makes revision 1 remove the built-in operators on strings and the ordering operators on pointers, with each now a compile error that names its replacement. **`skycoin-cx#204`** describes the revision in the language guide. Later that day **`skycoin-cx#399`** moved the string functions to the built-in package `sys/string` with full names, so `str.concat` becomes `string.Concatenation`, under a new dated version.

**`skycoin-cx#381`** adds the convention that built-in libraries live under `sys/` and still need an explicit import. **`skycoin-cx#395`** teaches the parser and both package loaders to resolve those paths, and **`skycoin-cx#396`**, **`skycoin-cx#397`** and **`skycoin-cx#398`** moved os, time, json, tcp, regexp, cipher, cx and the graphics and audio libraries. A bare import of any built-in package is now a compile error that names the `sys/` path.

### CX: Errors, Documents and History

**`skycoin-cx#271`** writes down the error policy. A failure of a path, a file or the network returns the module's own error struct. Anything else, such as a broken precondition or an impossible state, is an assert that crashes the process, with no recovery. **`skycoin-cx#273`** gives each module its own error struct and a range of codes, so no package has to import a shared table above its tier. **`skycoin-cx#298`** documents the compiler's intermediate form and serialized layout, and **`skycoin-cx#182`** adds a changelog that runs from the merge of the CX repositories through the day's work.

### CX: The Object Model

The compiler kept its intermediate objects in plain Go slices with raw pointers between them. **`skycoin-cx#373`** adds a standard for keeping them in managers instead, addressed by handles that carry a type tag, an index and a generation, along with a list of every site that does not follow it yet and a compile speed baseline. **`skycoin-cx#374`** marks all 1,628 of those sites, **`skycoin-cx#375`** moves each of the 14 object types into its own definition file, and **`skycoin-cx#376`** adds the managers. **`skycoin-cx#377`** gives every program its own set of them.

The migration then went object by object. Lines moved in **`skycoin-cx#378`**, array and struct signatures in **`skycoin-cx#394`** and **`skycoin-cx#400`**, and argument debug records in **`skycoin-cx#403`**, after **`skycoin-cx#402`** passed the program to the argument constructors. **`skycoin-cx#404`** grows a manager's array only at fixed boundaries, so a pointer stays valid across later allocations. Arguments and type signatures moved in **`skycoin-cx#405`** and **`skycoin-cx#406`**, and **`skycoin-cx#421`** and **`skycoin-cx#429`** allocate the built ones in their managers and release those nothing names. **`skycoin-cx#427`** drops fifty empty placeholder arguments, **`skycoin-cx#430`** stops the VM building whole arguments when it needs two or three fields, **`skycoin-cx#431`** records the change in capacity, and **`skycoin-cx#434`** inlines the handle checks so the success path makes no call.

### CX: A Faster Run Loop and a New VM

**`skycoin-cx#424`** adds a run benchmark and a test that holds each program under an allocation ceiling. **`skycoin-cx#422`** takes the current expression by pointer, since the copy escaped and cost an allocation on every step, and **`skycoin-cx#425`** fetches each step's operator and function once rather than four times. **`skycoin-cx#426`** and **`skycoin-cx#428`** steadied the ceiling test on Windows, where a garbage collection during a run added an allocation. **`skycoin-cx#192`** keeps LZ4 state in an explicit codec that does not allocate per call, on the maintained v4 library from **`skycoin-cx#228`**.

**`skycoin-cx#436`** lowers the scalar subset of a compiled program, booleans, integers, floats and their control flow, to a flat image of fixed 32 byte instructions. **`skycoin-cx#437`** runs a program on that new VM when every function lowers, and on the old loop otherwise. A run on it allocates nothing, and a flag can force either loop.

**`skycoin-cx#435`** keeps a running program's files inside a sandbox. The file opcodes joined a program's path to the working directory, so `../x` and symlinks escaped. A run now opens one root at start, the working directory or a directory given by flag, and every file operation goes through it.

### CX: Compiler and Runtime Fixes

Many fixes came from programs that panicked the compiler or gave wrong answers. **`skycoin-cx#195`** fixed nested slices under 64 bit pointers, **`skycoin-cx#220`** a nested slice literal that lost its second inner slice to a stale pointer, and **`skycoin-cx#266`** taking the address of a slice. **`skycoin-cx#265`** makes `*p` on a struct pointer the struct value, and **`skycoin-cx#263`** prints `%v` values from their real address. **`skycoin-cx#211`** made regexp callable again and turned a package type used without its import into a compile error. **`skycoin-cx#213`** stops after an unknown package function, where it panicked, and **`skycoin-cx#253`** makes an unknown member of an imported package a compile error, where the program had run and exited cleanly. **`skycoin-cx#252`** gives a constant that overwrote another its own code, and **`skycoin-cx#215`** bounds checks substrings.

Errors now point at the right place. **`skycoin-cx#223`** keeps the token line in both lexers, where several errors reported line 0, **`skycoin-cx#260`** gives each expression statement a line marker, and **`skycoin-cx#264`** reports test and operator type errors on their own line rather than the closing brace. **`skycoin-cx#255`** stops a failing test from printing raw byte dumps. In the REPL, **`skycoin-cx#206`** no longer runs a program that failed to compile and **`skycoin-cx#205`** gives each program its own copy of the native arguments. **`skycoin-cx#225`** makes the operation limit only a limit, without a tracer that printed to the program's output, **`skycoin-cx#227`** stops regexp growing the program on every call, **`skycoin-cx#229`** splits commands for `os.Run` properly, and **`skycoin-cx#258`** writes a CPU profile to the path given.

### CX: The Loader and the Rest

The package loader kept only its second version in **`skycoin-cx#181`**, with **`skycoin-cx#180`** noting that bolt supersedes redis. **`skycoin-cx#241`** finds import loops of any length, **`skycoin-cx#243`** reads imports with one scanner that skips comments, **`skycoin-cx#244`** uses the compiler's list of built-in packages, and **`skycoin-cx#246`** gives each external import one ID. **`skycoin-cx#240`** hex encodes a stored hash that came back as different bytes, **`skycoin-cx#242`** opens the database once at a path the caller gives, **`skycoin-cx#245`** removes two maps that were written and never read, **`skycoin-cx#247`** rejects stray arguments, **`skycoin-cx#249`** reads stored programs in one place, and **`skycoin-cx#248`** closes files in the tests for Windows.

Duplicates went too. **`skycoin-cx#187`** keeps one program serializer, **`skycoin-cx#251`** serializes in name order so the output is stable, and **`skycoin-cx#209`**, **`skycoin-cx#214`**, **`skycoin-cx#219`** and **`skycoin-cx#222`** keep one copy each of the exit codes, a length helper, the argument parser and the profiling package. **`skycoin-cx#257`** shares duplicated printer code, **`skycoin-cx#230`** joins the working directory one way, **`skycoin-cx#233`** and **`skycoin-cx#235`** remove an unused package and functions nothing calls, and **`skycoin-cx#237`** drops a double import. **`skycoin-cx#232`** moves the test runner to urfave/cli v3, and **`skycoin-cx#236`** fixed a benchmark that serialized zero bytes because its fields were unexported.

### Skywire Mobile 0.0.13

Skywire Mobile 0.0.13 was released with **`6289`**, the fixes from a tester of 0.0.12. A voice or video message between two phones showed as failed on the sender while the receiver already had it, because the receiver's close could overtake its answer on a route group, and each retry gave the receiver another copy. A peer the phone has written to now counts as known, so its files arrive without a re-request. Group notifications carry the group's name, and the wallet keeps its last dollar price with its date instead of showing nothing after a failed fetch. **`6290`** builds the F-Droid presets with TinyGo built from source, after the prebuilt toolchain's bundle trapped in the F-Droid build.
