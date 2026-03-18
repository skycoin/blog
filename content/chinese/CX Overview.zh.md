+++
title = "CX Overview"
tags = [
    "CX",
]
date = "2017-09-06"
aliases = [
	"/zh/overview/cx-overview/"
]
+++

<!-- MarkdownTOC autolink="true" bracket="round" depth="1" -->

- [CX 简介](#CX+%E7%AE%80%E4%BB%8B)
- [项目仓库](#%E9%A1%B9%E7%9B%AE%E4%BB%93%E5%BA%93)
- [语法](#%E8%AF%AD%E6%B3%95)
- [Affordances](#affordances)
  - [数量限制](#%E6%95%B0%E9%87%8F%E9%99%90%E5%88%B6)
  - [类型限制](#%E7%B1%BB%E5%9E%8B%E9%99%90%E5%88%B6)
  - [存在性限制](#%E5%AD%98%E5%9C%A8%E6%80%A7%E9%99%90%E5%88%B6)
  - [标识符限制](#%E6%A0%87%E8%AF%86%E7%AC%A6%E9%99%90%E5%88%B6)
  - [边界限制](#%E8%BE%B9%E7%95%8C%E9%99%90%E5%88%B6)
  - [用户自定义限制](#%E7%94%A8%E6%88%B7%E8%87%AA%E5%AE%9A%E4%B9%89%E9%99%90%E5%88%B6)
- [严格的类型系统](#%E4%B8%A5%E6%A0%BC%E7%9A%84%E7%B1%BB%E5%9E%8B%E7%B3%BB%E7%BB%9F)
- [编译和解释](#%E7%BC%96%E8%AF%91%E5%92%8C%E8%A7%A3%E9%87%8A)
  - [读-求值-打印循环](#%E8%AF%BB-%E6%B1%82%E5%80%BC-%E6%89%93%E5%8D%B0%E5%BE%AA%E7%8E%AF)
  - [元编程命令](#%E5%85%83%E7%BC%96%E7%A8%8B%E5%91%BD%E4%BB%A4)
  - [步进](#%E6%AD%A5%E8%BF%9B)
  - [交互性调试](#%E4%BA%A4%E4%BA%92%E6%80%A7%E8%B0%83%E8%AF%95)
- [集成的进化算法](#%E9%9B%86%E6%88%90%E7%9A%84%E8%BF%9B%E5%8C%96%E7%AE%97%E6%B3%95)
- [序列化](#%E5%BA%8F%E5%88%97%E5%8C%96)

<!-- /MarkdownTOC -->

# CX 简介

CX既是一种规范又是一门编程语言，旨在基于[affordance](https://en.wikipedia.org/wiki/Affordance)(*译者注: affordance没有好的中文翻译词，保留原单词*)概念来接受新的编程范式。affordances允许程序知道它可以做什么不可以做什么。我们可以问程序什么样的参数可以被传给函数，程序就会返回一系列可能的动作。当选定这一系列动作中哪个是合适的，我们就可以在其中做出一个选择，然后程序会按照选择的动作执行。由于CX的affordances系统，基因编程算法就可以建立在其基础之上并作为一个原生函数，这可以用来优化程序的运行时结构。

CX规范指出程序员对编译器和解释器必须是可访问的。解释器可以通过读取-求值-打印(read-eval-print)的这一循环来访问，在这个循环里面，程序员可以交互式的增加和删除程序里面的元素。一旦程序运行结束，它可以被编译出来以增强程序的性能。

最后，一个CX程序可以被完全的序列化为字节数组，并保持程序运行状态和结构。被序列化的程序之后又可以反序列化，并可以继续运行在安装有CX解释器/编译器的设备上。

在接下来的章节中，会对在上述段落中讨论的CX的特性进行更加详细的描述。

# 项目仓库

这个项目的源码可以在Github仓库下载:[https://github.com/skycoin/cx](https://github.com/skycoin/cx). 该仓库包含了说明书，文档，例子和源码本身。

# 语法

正如在概述中提到，CX既是一种规范又是一门编程语言。 CX规范并没有对语法进行限定死=，而是规定了CX规范的结构和满足CX规范的CX方言必须实现的过程（process）。因此，可以实现两种像这样CX方言，一种类Lisp语法，一种类C语法。这种底层语言叫做基于CX的语言，或者叫做“基础语言”。 在文档中，有一种实现用来展示CX规范的能力，它的目的不仅仅是作为学术工具，而是作为一门完整并且健壮的通用编程语言。

CX在本文档中的目标是尽可能做到和Go语言语法相似。

# Affordances

程序员在构建程序的时候往往需要做出大量的决策，比如说，函数需要接受和返回多少个参数，需要哪些语句才能得到想要的功能，需要给函数传递什么参数，诸如此类。CX规范中的Affordances系统可以通过查询得到一系列可能的可应用在某个元素（element)的动作(action)，其中函数（function)，结构（struct)，模块 （module）和表达式(expression)都是元素的例子。

没有一系列的规则和事实指导什么是必要的逻辑和程序背后的意图，人们至少可以决定一些保证程序语义正确的基本约束。affordance系统提供这样的第一层约束。接下来会详细解释。

### 数量限制

CX中的表达式可以返回多个值。由于接受表达式输出的参数需要匹配表达式操作符的输出数量，这对affordance系统构成了一个挑战。

```
out1, out2, ..., outN := op(inp1, inp2, ..., inpM)
```

如果上面的例子是正确的，那么*op*需要输出*N*个参数。这个问题可能会变得更有挑战性如果我们考虑到*op*的定义可以由affordance系统自己改变或者被将来的用户改变。只要*op*的定义改变了，新的affordances可以应用到任何使用*op*作为它的操作符的表达式。因为接收*op*的输出参数的变量个数现在已经不匹配了。

从之前的推理来看，如果接收的参数和表达式的操作符输出的参数个数相匹配，那么增加新的接收变量的操作将永远不会执行。

数量限制同样适用于表达式中的输入参数，例如，如果函数调用已经定义了所有的输入参数，那么affordance系统不应该再列出增加另一个参数作为可能的行为。同样，如果表达式试着调用操作符的参数少于所需参数，那么affordance系统在需要的时候，应该告诉程序员新增一个函数调用的参数也是可行的。

**Example:**

*注意: 字符串连接功能还未实现。同样，print函数总是在要被打印的字符串后面增加一个新行。在将来的CX的实现版本中会解决这些问题。*

```
var age i32 = 18
var steps i32 = 23

func advance (direction str, numberSteps i32) () {
    printStr("Advancing:")
    printStr(direction)
    printStr("Number of steps:")
    printI32(numberSteps)
}

func main () () {
    advance("North")
}
```

上面的例子中，*main*函数中的*advance*调用缺少一个参数。如果查询affordance系统，系统会列出一些列行为类似于:

```
...
(k)       AddArgument advance age
(k+1)     AddArgument advance steps
...
```
其中k表示任意的索引。正如我们所见，affordance系统告诉程序员两个可以执行的操作，一个是为advance函数增加另外一个参数，另一个是全局定义的*age*和*step*是作为advance参数的可选项。

值得一提的是affordance应该总是可以被枚举的，并且对affordance系统的多次调用不会改变它们的枚举顺序。这样做背后的原因是: 当检测了查询结果之后，程序员应该能指示系统应用哪个affordance。

### 类型限制

编程语言的通常做法是用类型系统来限制程序员传入非预期的参数类型给函数调用。甚至在弱类型编程语言中，像`true / "hello world"`这样的操作应该引发错误(当然，除非在这种情况下[esoteric language](https://en.wikipedia.org/wiki/Esoteric_programming_language))。CX遵循非常[严格的类型系统](#strict-typing-system). 如果参数不是预期的类型，那么不应该作为affordance动作的候选项（虽然一个可行的办法是将这些参数包裹在强制转换函数（cast function）之前作为affordance显示出来）。

类型限制同样必须考虑到当把一个新的值赋给已经存在的变量的情形。在CX中，变量声明的某种类型应该保持到它的整个生命周期（除非用元编程(meta-programming) 的命令/函数或者创建一个新的变量删除）。这样，举个例来说，被定义为容纳32位的整数就不应该考虑作为用来容纳64位的浮点数输出参数。

### 存在性限制

乍一看，这种限制非常繁琐。如果元素不存在，那么包含它的affordance也不应该存在。然而，这种限制成为了一个挑战一旦我们考虑到函数被移除的情形，并且它已经在整个程序中作为表达式中操作符广泛使用。如果程序是源代码的形式，这个问题就简化为了简单的“查找/替换”工作，但是如果程序在运行时，affordance系统将变得非常有用：affordance改变绑定到操作符的标识符。

即使元素没有被重命名，决定元素是否存在也不是那么繁琐。要在affordance中使用的元素必须搜索当前调用栈空间，全局空间和其他模块的全局空间。

### 标识符限制

新增命名元素通常是affordance系统的候选动作。应用这种类型的affordcance带来的一个限制是需要确保新元素的表示的唯一性，防止重定义。affordance系统既可以在元素的空间内产生唯一的标识符，又可以让程序员提供一个合适的标识符。

### 边界限制

CX提供从数组访问和修改元素的原生函数。数组读写的例子：

```
readI32([]i32{0, 10, 20, 30}, 3)
writeF32([]f32{0.0, 10.10, 20.20}, 1, 5.5)
```

在第一个表达式中，4个包含32位整数的数组在下标3处被访问，这将返回数组最后一个元素。在第二个表达式中，包含3个32位浮点数的数组的第二个元素被修改卫5.5。如果这两个数组中任意一个使用负数下标或者超过数组长度的下标访问，那么将会引发“越界”的错误。

只凭借类型限制，affordance系统会告诉程序员任意32位整数参数可以用作访问任意数组的下标。虽然程序可以编译通过，但是越界错误很可能发生，如果程序员没有对所选择应用的值引起额外的注意。

affordance系统需要按照如下标准来过滤affordance:丢弃小于0的32位整数和超过传入数组读者和写者长度的32位的整数。

### 用户自定义限制

*注意: 用户自定义限制系统仍处于试验阶段.*

上面描述的基本限制应该至少能保证程序不会遇到任何运行时错误。这些系统应该足够构建一些有趣的系统，比如CX的原生[进化算法](#integrated-evolutionary-algorithm)。然而，在某些时候需要更健壮的系统。在这种需求下，语句（clause)，查询（query)和对象(object)用来描述模块的环境。这些元素通过整合的Prolog解释器，CX的原生函数 *setClause*， *setQuery* 和*addObject* 来定义。

对这个限制系统最通用的描述是这样: 程序员定义一系列的Prolog语句(facts and rules)，对每个新增的对象，这些语句会用定义的Prolog query来查询。对第一次读到这句话的人可能基本上没什么作用。用个例子应该能使概念和过程更加清晰：

```
setClauses("move(robot, north, X, R) :- X = northWall, R = false.")

setQuery("move(robot, %s, %s, R).")
```

在这个例子中，只定义了规则。这个规则可以粗略的解释为：“如果机器人想往北移动，那么询问X是什么。如果X是northWall，那么它将不能移动” 查询只是一个作为*move*函数的查询格式化字符串，并且*robot*元素会得到两个额外的参数：方向和对象。

对象可以用*addObject*函数来定义:

```
addObject("southWall")
addObject("northWall")
```

类型限制系统会查询出现在模块中的每个对象。在这个例子中，系统首先会执行第一个查询  "move(robot, north, southWall)," ，系统会响应“nil"，这意味着没有定义任何规则来处理这种情况，默认的动作就是不丢弃affordance。第二个查询是 "move(robot, north, northWall),"，系统会响应"false"。这种情况下，affordance没有通过检查，随之被丢弃。

上面的例子演示了这些规则如何通过条件否定affordance。虽然被之前的规则否定，但是规则也可以用来接受affordcance。


```
setClauses("move(robot, north, X, R) :- X = northWall, R = false.
    move(robot, north, X, R) :- X = northWormhole, R = true.")

setQuery("move(robot, %s, %s, R).")
```

上面的代码新增的规则告诉系统如果机器人遇到虫洞，那么就让机器人往北移动。如果对象数组保持和先前定义的一样，那么移动affordance同样会被丢弃掉。但是如果`addObject("northWormhole")`被求值，那么"northWormhole"会新增进来并且机器人可以使用虫洞穿墙。

# 严格的类型系统

在简介中提到，CX中没有隐式转换，因此，核心模块中每个原语类型定义了多个版本。举个例说，存在4个加法的原生函数： addI32, addI64, addF32, addF64。

解析器会对在源码中发现的数据附加默认的类型： 如果读取到一个整数，默认类型就是*i32*或者32位整数；如果读取到一个浮点数，默认类型就是*f32*或者32位浮点数。被解析器读取的其他数据不会有歧义：*true*和*false*总是布尔类型；被双引号包围的一系列字符总是字符串类型；数组在列出它的元素前需要表明它的元素类型，比如，`[]i64{1, 2,3}`。

当程序员需要显式的把一个转换为其他类型的时候，核心模块提供了许多供原语类型使用的转换函数。举个例，`byteAToStr`把字节数组转换为字符串，`i32ToF32`把32位整数转换为32位浮点数。

# 编译和解释

CX规范强制CX方言提供开发者编译器和解释器。正如我们所料，解释执行的程序相比编译之后执行的语言慢得多，但是解释执行的程序会更灵活。这种灵活性来自于元编程(meta-programming)函数和可以在运行时改变程序结构的affordance系统。

编译执行的程序相比解释执行的程序需要更多的严格死板的结构，而对程序的优化使得这种严格死板的结构加剧。因此这种在程序结构上做操作的afforandance系统和函数的功能在需要编译执行的程序上大打折扣。

当程序性能是我们最大的关注点的时候就应该使用编译器，而当程序员需要CX系统提供的特性以使程序有最大的灵活性时，那么程序就应该解释执行。在接下来的子章节，会出现一些这样的特性，不是作为教程而仅仅是一个简单介绍。

### 读-求值-打印循环

REPL(read-eval-print) 是一个交互工具，通过这个工具程序员可以输入新的程序元素和对他们求值。启动新的REPL会话会在控制台打印下面的消息：

```
CX REPL
More information about CX is available at https://github.com/skycoin/cx

*
```

“*”告诉程序员REPL已经准备好接受一行新的代码。REPL会持续读取用户输入直到遇到分号和换行符。

如果没有重新从REPL启动程序，CX会启动一个空程序。我们会看到 `:dProgram true;`如果元编程命令作为输入：


```
* :dProgram true;
Program

*
```

REPL只打印了一个单词"Program"和随后的一个空行。作为第一步，新的模块和函数可以声明了：

作为第一步，新的*main*模块和新的*main*函数应该这样声明：

```
* package main;
Program
0.- Module: main

* func main () () {};
Program
0.- Module: main
	Functions
		0.- Function: main () ()

*
```

可以看到，每次一个新的元素增加到程序中，程序结构就被打印出来了。

### 元编程命令


`:dProgram`用来作为上面章节的子章节。任何以冒号(:)开头的语句都是一类指令的一部分，这种指令叫做“元编程命令”

CX会将在REPL中声明元素的元素加入到程序的结构中。但是，与其他的许多编程语言一样，这些声明被限制在添加，最多就是重定义。

但是，像其他许多提供了REPL的语言一样，程序员的能力限制在增加新元素到程序中，最多对元素进行重定义。元编程命令允许程序员对程序结构的修改更有控制力。

`:dProgram`, `:dState`, and `:dStack` 命令分别通过打印程序结构，当前调用状态和用户的调用栈的全部信息来对程序进行调试。`:step`命令使解释器向前或者向后执行。`:package`, `:func`, and `:struct`被成为*选择子(selectors)*, 他们被用来改变程序的作用域。`:rem`赋予程序员*删除者*的角色，这可以用来选择从程序的结构中移除一些元素。`:aff`用来访问CX的afforandance系统；这个元编程命令既可以用来查询又可以把affordance系统应用到程序的元素。最后，`:clauses`用来设置模块的语句，这些语句通常被用户定义限制系统[user-defined restrictions system](#user-defined-restrictions)使用;`:object`和`:objects`分别用来增加和打印对象；最后两个元编程命令：`:query`用来设置模块查询，`:dQuery`是用来调试用户定义限制的辅助函数。

### 步进

在REPL模式下运行的程序可以通过定义在源文件中的程序结构初始化。举个例子：在当前目录：


```
$ ./cx --load examples/looping.cx

```

这个例子从example目录（较全的示例代码可以在这个项目中找到 [project's repository](https://github.com/skycoin/cx)）加载`looping.cx`。虽然程序被加载了，但是还没执行。在REPL中，要执行程序需要使用元编程命令`:step`。为使程序运行终止，需要使用`:step 0;`命令。但是`:step`很有趣因为它可以带上其他的整型参数（甚至是负数）。举个例子：

```
CX REPL
More information about CX is available at https://github.com/skycoin/cx

* :dStack false;

* :step 5;
0

* :step 5;
1

* :step 5;
2

*
```

*examples/looping.cx* 一次性执行了5步。我们看到为了使程序重新计算*while*的条件，打印计数器和对计数器加1，执行5步是必须的。

同样的，我们应该“及时后退”如果REPL中的指令是`:step -5`。

```
...

* :step 5;
2

* :step -5;

* :step 5;
2

*
```

CX又向前运行了5步之后，2又在终端上被打印出来。必须注意的是计数器不仅仅是被赋予了不同的值，调用栈也被回退到先前的状态。

### 交互式调试

CX程序会进入REPL模式如果程序执行中出现了错误。这使得程序员有机会在尝试恢复程序执行时进行调试。

在下面的例子中，触发了除0错误，REPL对这个错误向程序员发出警告，调用栈的最后一个调用被dump出来，REPL继续执行。


```
CX REPL
More information about CX is available at https://github.com/skycoin/cx

* package main;

* func main () () {};

* :func main;
main
:func main {...
	* foo := divI32(5, 3);
main
:func main {...
	* bar := divI32(10, 0);
main
:func main {...
	* :step 0;
fn:main ln:0, 	locals:
>> 1
fn:main ln:1, 	locals: foo: 1

Call's State:
foo:		1

divI32() Arguments:
0: 10
1: 0

0: divI32: Division by 0
main
:func main {...
	*
```

同样的，如果程序在CX解释器中有输入参数而没有调用REPL，但是执行过程中有错误，REPL会被调用方便程序员或者系统管理员调试。

```
$ ./cx examples/program-halt.cx
1

Call's State:
nonAssign_0:		1
nonAssign_1:		1

divI32() Arguments:
0: 5
1: 0

5: divI32: Division by 0
CX REPL
More information about CX is available at https://github.com/skycoin/cx

*
```

# 集成的进化算法

CX的affordance系统和元编程命令使得改变可以在有监督的方式下改变程序的结构带来了灵活性。然而，affordance系统仍然可以依靠一个函数来选择应用哪个affordance来自动化完成。

`evolve`是原生函数，它通过随机的affordance来构建用户自定义的函数。遵循进化计算的基本原则，使用了迭代过程来测试`evolve`函数。特别的，进化催生出了一种叫做基因编程的技术。基因编程试图找到解决问题的操作符和参数的组合。举个例子，你可以指挥 `evole`去寻找当传递10作为参数，返回20的操作符组合。这听起来可能很简单，但是基因编程和其他进化算法可以解决非常复杂的问题。

在代码库的*example*目录可以找到描述进化函数进化过程的例子（*examples/evolving-a-function.cx*）[curve-fitting](https://en.wikipedia.org/wiki/Curve_fitting) 。

# 序列化

CX中的程序可以全部或者部分的序列化为字节数组。这种序列化的能力使得程序可以创建程序镜像(类似于 [system images](#https://en.wikipedia.org/wiki/System_image))。程序镜像保持了程序被序列化时的确切状态。这意味着序列化的程序可以被反序列化，而后恢复执行。序列化也可以用来创建备份。

CX程序可以提高它的综合特性来创建有趣的应用场景。举个例子，程序可以通过序列化来备份自己，然后开始在程序中的一个函数执行[进化算法](#integrated-evolutionary-algorithm)。如果进化算法找到了比先前定义更好的函数，我们就可以保留这个新版本的程序。然而，如果进化算法执行结果不理想，程序可以恢复保留的备份。这些所有的工作都可以自动化完成。
