+++
title = "CX教程：使用可供性建立一个小型文字冒险游戏"
tags = [
    "CX",
    "Tutorials",
]
bounty = 5
date = "2017-09-20"
aliases = [
	"/zh/cx/cx-tutorial-using-affordances-to-build-an-evolutionary-algorithm/"
]
+++

<!-- MarkdownTOC autolink="true" bracket="round" depth="2" -->

- [引言](#introduction)
- [质询 - 响应架构](#challenge-response-architecture)
- [启示系统](#affordance-system)
- [对象](#objects)
- [结论](#conclusion)

<!-- /MarkdownTOC -->

# 引言

本教程提供一个基于文本的“游戏”（用户和程序没有相互影响，同时不能影响游戏之中人物的决策），它使用一个[挑战-响应架构](#challenge-response-architecture)  ，以确定哪些是游戏中的人物可以做的动作。完整的源代码中可以在 [CX的存储库](https://github.com/skycoin/cx)
找到，在文件 *examples/text-based-adventure.cx.*

游戏描述了旅行者从怪物的追踪中逃跑的冒险（万圣节快到了!）。如果旅行者能够生存若干小时（当然，这只是一个在*Loop循环*中的迭代），怪物就会停止追逐旅行者。以下是一个例子：




```
旅行者继续沿着车道，忘记了身上的痛。
嚎叫和咆哮，怪物来了。
勇敢进入眼前，希望再多活一天。
天真，甚至愚蠢，但旅客的行为使这个怪物麻木。
北，东，西，南。任何方向都很好，
只要没有怪物可以找到我。
嚎叫和咆哮，怪物来了。
旅客逃跑了，懦弱让他活了一天。

你活了下来
```

如果旅客决定和怪物决一死战但他的英勇尝试失败了的话，游戏结束。游戏结局的一个例子是：

```
北，东，西，南。任何方向都很好，
只要没有怪物可以找到我。
嚎叫和咆哮，怪物来了。
勇敢进入眼前，希望再多活一天。
但失败的就是失败，突然之间，这个冒险就结束了。

你死了。


Call's State:
flag:			true
nonAssign_32:		""

halt() Arguments:
0: "You died."

65: call to halt
```

正如你所看到的，如果你死了，将引发程序错误（这是合适的，就如程序员看见了一个程序错误一般的可怕）。

# 质询 - 响应架构

在此架构下，一个的问题提出了,不同的代理（在这种情况下，是一个函数）必须回答这个问题。有一个简单的问题“谁能在这一刻被执行?”所有允许执行的函数都可以。

下面的函数原型表示可以旅行者的冒险过程中发生的可能的行动。

```
func walk (flag bool) () {}
func noise (flag bool) () {}
func consider (flag bool) () {}
func chance (flag bool) () {}
func fightResult (flag bool) () {}
func theEnd (flag bool) () {}
```

# 启示系统

另一个函数必须先和函数调用协调。在这种情况下，CX的启示系统会用来确定操作是否允许运行或否。

```
yes := true
no := false

remArg("walk")
affExpr("walk", "yes|no", 0)
:tag walk;
walk(false)
```


在上面的代码中，*remArg()*查找表达式与"walk" (“行走”) 的标签，并删除其参数。这样做是为了使启示系统列出所有可发送到表达式的操作。接下来，*affExpr()*告诉CX“在所有可以被发送到*walk*(行走)的参数中，告诉我*yes*  ; *no* (是和否) 是不是一个可用的参数，之后应用你输入的*最顶*的启示列表选项。”

在前面的过程将应用于所有可在旅行者的冒险过程中发生的操作。对于这些行为，以下规则查询，以确定是否采取行动应该被允许与否：

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

第一条规则可以被读作“我被查询如果你考虑选择以 *yes* 参数 到 *walk 的动作上 (行走)。如果对象- 怪物存在，那么这参数将不是一种选择“。

在第二块的规则（第一个空行之后的第4规则）告诉启示系统"决不"接受*yes* 参数。我们这样做是因为我们希望这是默认的行为，但我们可以在以后宣布，覆盖此行为规则。这种覆盖过程将发生在最后的4个规则。基本上，规则此块是告诉CX接受*yes*作为参数，如果一个特定的对象存在于对象集。

# 对象

一些行动从对象集中添加或删除的对象。例如，每当噪声*noise*动作决定作出使得怪物的出现，*addObject("monster")* 被执行。如果旅客决定逃避战斗，"怪物"对象从集中删除。


在的采取*chance*(机会)情况下，怪物可以决定腾出旅客几秒钟，看看他会决定下一步做。要做到这一点，"fight"(战斗)的对象被删除（因为怪物还没有希望开始战斗），但"monster" (怪物)的对象仍然存在。


# 结论

CX的启示系统使用对象和规则来拙把是复杂的决定过滤。

通过使用对象，我们可以决定什么样的行动将被激活或停用。在这个例子中，动作少量正在考虑这一激活过程，而采用这种架构的好处可能乍一看似乎一文不值。然而，涉及到更多的物体更复杂的规则可以被定义，一个规则可以负责激活或停用一个大的网络的节点。此外，在这个例子中只有两个可能的参数被认为是：*yes*  *no*( 是和否) ; 我们可以有更多的参数，并接受不同类型除了布尔(逻辑数据)之外的动作。
