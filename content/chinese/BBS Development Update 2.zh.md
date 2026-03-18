+++
title = "天空币BBS开发更新#2"
tags = [
    "Development",
    "BBS",
    "CXO",
]
date = "2017-08-31"
aliases = [
	"/zh/bbs/bbs-development-update-2/"
]
+++


自版本0.1发布以来已经有一个多月了，0.2即将到来！

更改如下：

- 使用最新的CXO版本（点对点自复制数据库）。
- 重新实现CXO对象和树（为新功能准备）。
- 引入“views”模块，轻松实现多种“查看”内容的不同方式。
- 初始实现用户关注/忽略。
- 完全改版的UI.

## CXO变更


CXO已被大量重构，现在更快更稳定。 API已经被更好地与散列数组一起使用 - 具有恒定的访问时间，更快的复制速度和直接使用给定散列值访问元素的能力。

CXO的这些变化促使BBS跟着改变了大部分的代码库。
[在这里查看CXO仓库.](https://github.com/skycoin/cxo)

## CXO数据结构变更

对数据结构的更改是为了解决以下问题：

1.实现一个结构，以便将来可以将用户数据迁移到自己独立的根。
2.轻松确定根序列之间的“差异”（a.k.a变化）。 这将对编译视图和向最终用户提供实时更新非常有用。
3.轻松确定不同根类型的根对象类型。


![Skycoin BBS v0.2 CXO Datastructure](/img/bbs_cxo_datastructure_v0.2.png)


`RootPage`对象决定了root的类型。 目前，所有数据都在每个板块上的一根根树下累积。 在未来，主题(线索)和用户将有自己的根。

在将来，“BoardPage”将有一个公钥列表，而不是主题的hrefs，因为主题将有自己的根。 这使主题易于在板之间迁移。

`DiffPage`用于确定“BoardPage”根的根序列之间的变化。 这本质上是一组不断增加的数组，其中长度的增加被解释为变化。

`UsersPage`将成为一个公钥列表（这些将是一个公告板上的“参与者”）。 每个用户将有自己的根。

## 视图模块实现


视图本质上只是一个接口：

```go
type View interface {

	// Init initiates the view.
	Init(pack *skyobject.Pack, headers *pack.Headers, mux *sync.Mutex) error

	// Update updates the view.
	Update(pack *skyobject.Pack, headers *pack.Headers, mux *sync.Mutex) error

	// Get obtains information from the view.
	Get(id string, a ...interface{}) (interface{}, error)
}
```

目前，所有编译的视图都存储在内存中。 但是，当我们的用户群增加时，这将变得不切实际。 在将来的版本中，视图将存储在磁盘上的键值存储中。

对于版本0.2，有两个`View`实现; 一个用于内容（Boards / threads / posts / votes），一个用于编辑每个用户的关注/忽略列表。
## 新用户体验

在写这篇文章的时候，几乎已经完成了。 下面链接是关于这项工作的YouTube视频：

[![天空币 BBS展示4](/img/bbs-4.jpg)](https://youtu.be/Oue3WVkmGh4)



为了跟进最新的天空币BBS开发，加入我们在Telgram上的[天空币BBS社区](https://t.me/skycoinbbs)
