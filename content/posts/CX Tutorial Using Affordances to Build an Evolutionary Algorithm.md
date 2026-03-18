+++
title = "CX Tutorial: Using Affordances to Build a Small Text-based Adventure"
tags = [
    "CX",
]
bounty = 5
date = "2017-09-20"
aliases = [
	"/cx/cx-tutorial-using-affordances-to-build-an-evolutionary-algorithm/"
]
+++

<!-- MarkdownTOC autolink="true" bracket="round" depth="2" -->

- [Introduction](#introduction)
- [Challenge-response Architecture](#challenge-response-architecture)
- [Affordance System](#affordance-system)
- [Objects](#objects)
- [Conclusion](#conclusion)

<!-- /MarkdownTOC -->

# Introduction

This tutorial presents a text-based "game" (the user does not interact
with the program, and can not influence the character's decisions) that uses a
[challenge-response architecture](#challenge-response-architecture) to
determine what are the possible actions the game's character can
do. The full source-code can be found in
[CX's repository](https://github.com/skycoin/cx), in the file *examples/text-based-adventure.cx*.

The game describes the adventure of a traveler that is escaping from a
monster (Halloween is coming next month, after all). If the traveler
survives certain number of hours (well, these are just iterations in a
*for* loop), the monster will stop chasing the traveler. An example of
a session is below:


```
The traveler keeps following the lane, making sure to ignore any pain.
Howling and growling, the monster is coming.
Bravery comes into sight, in the hope of living for another night.
Naive, and even dumb, but the traveler's act leaves the monster numb.
North, east, west, south. Any direction is good,
as long as no monster can be found.
Howling and growling, the monster is coming.
The traveler runs away, and cowardice lets him live for another day.

You survived.
```

If the traveler decides to fight the monster and his heroic attempt
fails, the game ends. An example of a game ending is:

```
North, east, west, south. Any direction is good,
as long as no monster can be found.
Howling and growling, the monster is coming.
Bravery comes into sight, in the hope of living for another night.
But failure describes this fend and, suddenly, this adventure comes to an end.

You died.

Call's State:
flag:			true
nonAssign_32:		""

halt() Arguments:
0: "You died."

65: call to halt
```

As you can see, an error is raised if you die (this is suitable, as
it's a scary situation for a programmer).

# Challenge-response Architecture

In this architecture, a question is raised and different agents (in
this case, functions) must answer to that question. A simple question
that can be asked is "Who can be executed at this moment?" and those
functions that are allowed to execute will do so.

The following function prototypes represent the possible actions that
can occur during the traveler's adventure.

```
func walk (flag bool) () {}
func noise (flag bool) () {}
func consider (flag bool) () {}
func chance (flag bool) () {}
func fightResult (flag bool) () {}
func theEnd (flag bool) () {}
```

# Affordance System

Another function must coordinate the function calls. In this case,
CX's affordance system is used to determine if an action is allowed to
run or not.

```
yes := true
no := false

remArg("walk")
affExpr("walk", "yes|no", 0)
:tag walk;
walk(false)
```

In the code above, *remArg()* looks for an expression with the "walk"
tag and removes its argument. This is done in order to make the
affordance system list the arguments that can be sent to the
expression's operator. Next, *affExpr()* is telling CX "among all the
arguments that can be sent to *walk*, tell me if *yes* or no *no* can
be used as arguments, and apply the *0th* option from the affordance
list that you return."

The previous procedure is applied to all the actions that can happen
during the traveler's adventure. For each of these actions, the
following rules are queried to determine if the action should be
allowed or not:

```
setClauses("
          aff(walk, yes, X, R) :- X = monster, R = false.
          aff(noise, yes, X, R) :- X = monster, R = false.

          aff(consider, yes, X, R) :- R = false.
          aff(chance, yes, X, R) :- R = false.
          aff(fightResult, yes, X, R) :- R = false.
          aff(theEnd, yes, X, R) :- R = false.

          aff(consider, yes, X, R) :- X = monster, R = true.
          aff(chance, yes, X, R) :- X = fight, R = true.
          aff(fightResult, yes, X, R) :- X = fight, R = true.
          aff(theEnd, yes, X, R) :- X = died, R = true.
        ")
```

The first rule can be read as "I will be queried if you're considering
to send the *yes* argument to the *walk* action. If the object
*monster* is present, then this argument is *not* an option."

The rules in the second block (the 4 rules after the first empty line)
tell the affordance system to "never" accept a *yes* argument. We do
this because we want this to be the default behaviour, but we can
later declare rules that override this behaviour. This override
process happens with the last 4 rules. Basically, this block of rules
is telling CX to accept *yes* as arguments if a particular object is
present in the object stack.

# Objects

Some of the actions add or remove objects from the object stack. For
example, whenever the *noise* action decides to make the monster
appear, *addObject("monster")* is executed. If the traveler decides to
run away from the fight, the "monster" object is removed from the
stack.

In the case of the *chance* action, the monster can decide to spare
the traveler a few more seconds to see what he will decide to do
next. To do this, the "fight" object is removed (as the monster does
not want to start a fight yet), but the "monster" object remains.

# Conclusion

CX's affordance system uses objects and rules to make complex
decisions about how affordances are going to be filtered.

By using objects, we can decide what actions will be activated or
deactivated. For this example, a small amount of actions are being
considered for this activation process, and the benefit of using this
architecture could seem worthless at first sight. Nevertheless, more
complex rules involving more objects could be defined, and a single
rule could be in charge of activating several nodes in a big network
of actions. Also, in this example only two possible arguments are
considered: *yes* and *no*; we could have more arguments, and actions
that accept different types of arguments other than booleans.
