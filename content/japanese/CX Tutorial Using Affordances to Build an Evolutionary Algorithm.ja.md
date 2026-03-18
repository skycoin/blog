+++
title = "CXチュートリアル: アフォーダンスを使って小さなテキストベースのアドベンチャーを構築する"
tags = [
    "CX",
]
bounty = 10
date = "2017-09-20"
aliases = [
	"/ja/cx/cx-tutorial-using-affordances-to-build-an-evolutionary-algorithm/"
]
+++

<!-- MarkdownTOC autolink="true" bracket="round" depth="2" -->

- [イントロダクション](#%e3%82%a4%e3%83%b3%e3%83%88%e3%83%ad%e3%83%80%e3%82%af%e3%82%b7%e3%83%a7%e3%83%b3)
- [チャレンジ-レスポンス アーキテクチャ](#%e3%83%81%e3%83%a3%e3%83%ac%e3%83%b3%e3%82%b8%2d%e3%83%ac%e3%82%b9%e3%83%9d%e3%83%b3%e3%82%b9%2d%e3%82%a2%e3%83%bc%e3%82%ad%e3%83%86%e3%82%af%e3%83%81%e3%83%a3)
- [アフォーダンスシステム](#%e3%82%a2%e3%83%95%e3%82%a9%e3%83%bc%e3%83%80%e3%83%b3%e3%82%b9%e3%82%b7%e3%82%b9%e3%83%86%e3%83%a0)
- [オブジェクト](#%e3%82%aa%e3%83%96%e3%82%b8%e3%82%a7%e3%82%af%e3%83%88)
- [結論](#%e7%b5%90%e8%ab%96)

<!-- /MarkdownTOC -->

# イントロダクション

このチュートリアルでは、チャレンジ-レスポンス アーキテクチャを使用して、ゲームのキャラクターが実行可能なアクションが何であるかを判断する、テキストベースの「ゲーム」（ユーザーがプログラムとやりとりすることはなく、キャラクターの意思決定に影響を与えることはできない）を示します 。
完全なソースコードは、 [CXのリポジトリ](https://github.com/skycoin/cx)の*examples/text-based-adventure.cx*ファイルにあります。

このゲームは、モンスターから逃れる旅行者の冒険を描いています（ハロウィンはとうとう来月に迫っています）。
旅行者が特定の時間を生き抜いた場合（これは*for*ループの繰り返しです）、モンスターは旅行者の追跡をやめます。
セッションの例は次のとおりです。

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
旅行者がモンスターと戦うことを決意し、彼の英雄的な試みが失敗した場合、ゲームは終了します。
ゲームのエンディングの例は次のとおりです。

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
ご覧のように、あなたが死ぬとエラーが発生します（これはプログラマーにとって恐ろしい状況です）。

# チャレンジ-レスポンス アーキテクチャ

このアーキテクチャでは、質問が提起され、異なるエージェント（この場合は関数）がその質問に答える必要があります。
問われ得るシンプルな質問は、「誰がこの時点で実行され得るか？」であり、実行が許されている機能はそうするでしょう。

次の関数プロトタイプは、旅行者の冒険中に発生する可能性があるアクションを表しています。

```
func walk (flag bool) () {}
func noise (flag bool) () {}
func consider (flag bool) () {}
func chance (flag bool) () {}
func fightResult (flag bool) () {}
func theEnd (flag bool) () {}
```

# アフォーダンスシステム

別の関数は関数呼び出しを整合させる必要があります。
この場合、CXのアフォーダンスシステムが、アクションの実行が許されているかどうかを決定することに使われます。

```
yes := true
no := false

remArg("walk")
affExpr("walk", "yes|no", 0)
:tag walk;
walk(false)
```

上記のコードでは、*remArg()* は "walk"タグを持つ式を探し、その引数を削除します。
これは、式の演算子に送ることができる引数をアフォーダンスシステムに列挙させるために行われます。
次に、*affExpr()*　はCXに、「*walk*に送ることができるすべての引数の中で、*yes* か *no* が引数として使えるか私に教えてくれ、そしてあなたが返すアフォーダンスリストのインデックス0のオプションを適用してくれ」と指示します。

前の手順は、旅行者の冒険の間に起こり得るすべての行動に適用されます。
これらのアクションごとに、アクションが許可されるべきかどうかを決定するために、次のルールが照会されます。

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

最初のルールは次のように読むことができます。「あなたが*walk*アクションに*yes*引数を送ることを検討しているなら、このルールは照会されます。オブジェクト*monster*が存在する場合、この引数はオプションではありません。

2番目のブロック（最初の空行の後の4つのルール）のルールは、アフォーダンスシステムに*yes*引数を "決して"受け入れないよう指示します。
これをデフォルトの動作にしたいのでこれを行いますが、後でこの動作をオーバーライドするルールを宣言することができます。
このオーバーライドプロセスは、最後の4つのルールで発生します。
基本的に、このルールブロックは、特定のオブジェクトがオブジェクトスタックに存在する場合、引数として*yes*を受け入れるようにCXに指示します。


# オブジェクト

いくつかのアクションは、オブジェクトスタックにオブジェクトを追加または削除します。
例えば、*noise*アクションがモンスターを出現させることを決めると、*addObject("monster")* が実行されます。
旅行者が戦いから逃げることを決定した場合、「モンスター」オブジェクトはスタックから取り除かれます。

*chance*アクションの場合は、モンスターは、旅行者が次に何をするか見極めるために、彼に数秒与えることを決定できます。
これを行うには、「戦闘」オブジェクトが削除されます（モンスターはまだ戦いを開始したくないため）、しかし、「モンスター」オブジェクトは残ります。

# 結論

CXのアフォーダンスシステムは、オブジェクトとルールを使用して、アフォーダンスをどのようにフィルタリングするかについて複雑な決定を行います。

オブジェクトを使用することで、どのアクションを有効または無効にするかを決めることができます。
この例では、この有効化プロセスでは少量のアクションしか考慮されていないので、このアーキテクチャを使用する利点は、一見すると無意味に見える可能性があります。
それにもかかわらず、より多くのオブジェクトを含むより複雑なルールを定義することができ、単一のルールは、大規模なネットワークで複数のノードを有効化する役割を担うことができます。
また、この例では、考えられる2つの引数*yes*と*no*のみが考慮されますが、より多くの引数や、ブーリアン以外のさまざまな種類の引数を受け入れるアクションを持つこともできます。
