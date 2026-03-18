+++
title = "Development Update: Introducing CX v0.6 & 0.6.1"
tags = [
	"Announcements",
	"CX",
	"Development",
]
bounty = 0
date = "2019-03-19"
description = "Skycoin Development Update: Introducing CX v0.6.1: CX is Skycoin’s programming language, packed full of features. CX provides numerous advancements within the Skycoin project."
image = "img/Skycoin-cxv061.jpg"
aliases = [
	"/development-updates/introducing-cx-v0.6-and-0.6.1/"
]
+++

#### About CX

CX is the programming language for smart contracts on the [Skycoin](https://www.skycoin.com) blockchain. CX is a general purpose, interpreted and compiled programming language, with a very strict type system and a syntax similar to Golang. CX provides a new programming paradigm based on the concept of affordances.

CX Version 0.6
==============

2019--01--25
----------

Version 0.6 of CX includes a number of features that were introduced in 0.5, including serialization, callbacks, improved error reporting and many more additions that will be laid out in the 0.6 release of the CX book.

The focus of this release is two-fold:

-   Prepare CX for the integration into the blockchain

-   Fix many of the issues in the language from previous releases

### New in This Release

#### Serialization

A CX program has a 'binary' representation that is intended to go on the blockchain. This binary representation is often called a bytecode, and is a common feature in many languages. The difference between CX and most other languages is that in CX you have a bytecode representation of both the program itself and a running state. CX 0.6 has serialization of any program and running state, as well as deserialization of both.

In the next step of the Skycoin development, you will be able to store a CX program on a blockchain (a chain on Fiber) and store its state on the chain as well. The next time the program is started, the state will be read from the chain and continued from where it left off, then run, providing a service of some kind, and the new state will be put back into a new block. This is similar to what is called a smart contract on other blockchains.

#### Language Improvements

There are a number of new language features that were present in CX release 0.5 that are now officially supported. These are:

-   Functions as first-class objects

-   Callbacks (used in some libraries, like OpenGL)

-   Much improved handling of slices, especially resize/copy/insert/remove functions, and boundary checks.

-   New control flow keywords: break and continue

-   New formatting for printf: %v for values of any type

-   Labels can now appear anywhere in a function.

-   Improved error reporting

-   ...and many improvements that were introduced during late stages of CX 0.5

#### Library Improvements

-   Added GIF support to OpenGL

#### Many issues fixed

-   [#32](https://github.com/skycoin/cx/issues/32): Panic if return value is used in an expression

-   [#40](https://github.com/skycoin/cx/issues/40): Slice keeps growing though it's cleared inside the loop

-   [#41](https://github.com/skycoin/cx/issues/41): Scope not working in loops

-   [#50](https://github.com/skycoin/cx/issues/50): No compilation error when using an invalid identifier

-   [#51](https://github.com/skycoin/cx/issues/51): Silent name clash between packages

-   [#52](https://github.com/skycoin/cx/issues/52): Some implicit casts were not being caught at compile time

-   [#53](https://github.com/skycoin/cx/issues/53): CX was not catching an error involving invalid indirections

-   [#55](https://github.com/skycoin/cx/issues/55): Single character declarations are now allowed

-   [#59](https://github.com/skycoin/cx/issues/59): Fields of a struct returned by a function call can now be accessed

-   [#61](https://github.com/skycoin/cx/issues/61): No compilation error when passing *i32 as an i32 arg and conversely

-   [#62](https://github.com/skycoin/cx/issues/62): No compilation error when dereferencing an i32 var

-   [#63](https://github.com/skycoin/cx/issues/63): Fixed a problem where inline initializations didn't work with dereferences

-   [#65](https://github.com/skycoin/cx/issues/65): Return statements now work in CX, with and without return arguments

-   [#77](https://github.com/skycoin/cx/issues/77): Fixed errors related to sending references of structs to functions and assigning references to struct literals

-   [#101](https://github.com/skycoin/cx/issues/101): Using different types in shorthands now throws an error

-   [#104](https://github.com/skycoin/cx/issues/104): Dubious error message when indexing an array with a subtraction expression

-   [#105](https://github.com/skycoin/cx/issues/105): Dubious error message when inline initializing a slice

-   [#108](https://github.com/skycoin/cx/issues/108): Solved a bug that occurred when two functions were named the same in different packages

-   [#131](https://github.com/skycoin/cx/issues/131): Problem with struct literals in short variable declarations

-   [#132](https://github.com/skycoin/cx/issues/132): Short declarations can now be assigned values coming from function calls

-   [#154](https://github.com/skycoin/cx/issues/154): Sending pointers to slices to functions is now possible

-   [#167](https://github.com/skycoin/cx/issues/167): Passing the address of a slice element is now possible

-   [#199](https://github.com/skycoin/cx/issues/199): Trying to call an undefined function no longer throws a segfault

-   [#214](https://github.com/skycoin/cx/issues/214): Fixed an error related to type deduction in references to struct fields

-   [#218](https://github.com/skycoin/cx/issues/218): Type checking now works with receiving variables of unexpected types

#### Documentation

-   Updated CX Book\
    The CX book for CX programmers is being updated during the development phase of CX 0.6. However, most of the contents are still relevant to CX 0.5.x. It does not yet contain all the information about new features in CX 0.6, which will be released in a new CX 0.6 edition as soon as possible.

-   Improved Documentation About the CX Internals\
    It has become much easier to contribute to the development of CX, as documentation now exists to support CX activity. This documentation contains suggestions for many contributing roles, not only software development. It also contains documentation on internal data structures and control flow, thereby shortening the learning period for new developers.

CX version 0.6.1
================

2019--02--20
----------

The focus of this release is to improve the quality of the language compiler and interpreter. This is the first bugfix release of the CX 0.6 series, but it also includes some major improvements, including support for lexical scoping and if/elseif/else constructs now work correctly.

### New in This Release

#### Language Improvements

There are a number of major improvement over 0.6.0:

-   Support for lexical scoping.

-   This means that a construct like this:

```
if (...) {
  var x i32 = 0
  i32.print(x)
}
```

x = 10

will fail because the scope of x ends at the right brace that ends the if clause. From CX 0.6.1 the CX language will enforce strict lexical scoping.

-   `if/elseif` and `if/elseif/else` constructs now work correctly.

-   The `+` operator can now be used to concatenate strings:

```
var conc str
conc = "Hello " + "world!"
```

-   Expressions can now be used when initializing slice/array literals:

var slc []i32

slc = []i32{i32.add(1, 2), foo()}

#### Library Improvements

-   Test functions (assert, panic, test) now check that their first two input arguments are of the same type, which prohibits comparing values of different types. In a future release a function that checks the equality of their arguments regardless of types will be introduced.

#### Fixed issues

-   [#54](https://github.com/skycoin/cx/issues/54): No compilation error when defining a struct with duplicate fields.

-   [#67](https://github.com/skycoin/cx/issues/67): No compilation error when var is accessed outside of its declaring scope.

-   [#69](https://github.com/skycoin/cx/issues/69): glfw.GetCursorPos() throws error

-   [#82](https://github.com/skycoin/cx/issues/82): Empty code blocks (even if they contain commented-out lines) crash like this.

-   [#99](https://github.com/skycoin/cx/issues/99): Short variable declarations are not working with calls to methods or functions.

-   [#102](https://github.com/skycoin/cx/issues/102): String concatenation using the + operator doesn't work.

-   [#135](https://github.com/skycoin/cx/issues/135): No compilation error when using arithmetic operators on struct instances.

-   [#153](https://github.com/skycoin/cx/issues/153): Panic in when assigning an empty initializer list to a []i32 variable.

-   [#168](https://github.com/skycoin/cx/issues/168): Type deduction of struct field fails.

-   [#169](https://github.com/skycoin/cx/issues/169): No compilation error when assigning an i32 value to a []i32 variable.

-   [#170](https://github.com/skycoin/cx/issues/170): No compilation error when comparing value of different types.

-   [#247](https://github.com/skycoin/cx/issues/247): No compilation error when variables are inline initialized.

-   [#244](https://github.com/skycoin/cx/issues/244): Crash when using a constant expression in a slice literal expression.\
    The problem actually involved the incapability of using expressions as values in slice literals

-   [#264](https://github.com/skycoin/cx/issues/264): Trying to determine the length of a slice of struct instances throws an error.

#### Documentation

-   Updated CX Book

The CX Book is being updated, so it is not part of this code release. The CX Book version 0.6 will have its own release at a later time. If you want to look at the work in progress, you can find a snapshot of it in the book/ subdirectory.
