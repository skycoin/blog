+++
title = "天空币BBS v5.0发布公告"
tags = [
    "Development",
    "BBS",
    "CXO",
]
bounty = 1
date = "2017-12-18"
aliases = [
	"/zh/bbs/bbs-release-v5.0/"
]
+++

天空币BBS v5.0终于发布了，我们这次做了很多的更新呢！

## 轻客户端
最明显的变化就是轻客户端的推出。您现在可以在不需要设置节点的情况下访问Skycoin BBS！只需要简单的前往[bbs.skycoin.com](http://bbs.skycoin.com).


在以前的版本中，只能（也应该）通过本地提供的Web用户界面访问/提交内容。由于这个网络接口（以及它所调用的API）可以直接控制节点本身，并且使用存储在节点（或服务器端）中的私钥对内容进行签名，因此将其暴露给公众是不合适,不安全的。

因此，引入轻客户端的时候, 我们需要用户管理以及签名提交内容的过程，以便客户端的处理。这需要全新改进的内容提交端点（或多于一个端点），并对前端进行大量更改。
有关新内容提交过程的详细信息可以在BBS Wiki: [github.com/skycoin/bbs/wiki/Content-Submission-Process](https://github.com/skycoin/bbs/wiki/Content-Submission-Process)上找到.

目前，前端加载非常缓慢。这是由于使用 [GopherJS](https://github.com/gopherjs)来处理种子和公钥/私钥生成以及数据的签名和验证所致。在将来的版本中，我们将使用原生JavaScript库来提高性能。


## 命令行接口(Command-line Interface)

引入公开可见的简化客户端之后，我们删除了处理管理控制的API端点，并引入了一个命令行接口(command-line interface)来处理这种交互。

更多信息可以在这里找到：: [github.com/skycoin/bbs/tree/master/cmd/bbscli](https://github.com/skycoin/bbs/tree/master/cmd/bbscli).

## 其他改进

* 导入/导出的改进（不幸的是，这不能与BBS v4.x的导入/导出向后兼容）
* 简化代码和性能改进，以便与Skycoin Messenger进行远程提交和交互。请用更新并且使用最新的Messenger。
* 改进的文件管理性能。
* 更好地处理无效的CXO根(roots)。
* 更好的处理断开连接。

##下载

要下载BBS，请前往 [github.com/skycoin/bbs/releases](https://github.com/skycoin/bbs/releases) (源代码也在这里）。

请注意，您也可以通过 [bbs.skycoin.com](http://bbs.skycoin.com) 访问BBS。

## 文档
我们在[github.com/skycoin/bbs/wiki](https://github.com/skycoin/bbs/wiki)上启动了一个wiki页面。

请理解，这还在进行中。

## 社区

我们有一个电报频道: [@skycoinbbs](https://t.me/skycoinbbs).
