+++
title = "FileCoin/IPFS和Skycoin/Cxo对比"
tags = [
    "Ask the Developers",
    "CXO",
    "Skywire",
]
date = "2017-08-09"
aliases = [
	"/zh/ask-the-developers/skycoin-vs-ipfs/"
]
+++

我们经常被问到 [CXO](https://github.com/skycoin/cxo) 和IPFS有什么区别？现统一回答如下：

FileCoin与Skycoin基础设施的一部分具有相同的目标，但采取不同的方法。 IPFS有三个独立的协议

- IPLD

- IPFS

- Multi-formats

- IPLD 是用来表示不可变数据对象和散列的表示语言

- IPFS 是一个文件系统

- Mult-formats是一个自描述的数据标准

在Skycoin体系下， CXO完成所有这三个职责：

- Multi-formats就是CXO中的schema

- IPLD 就是CXO (不可变数据结构，散列的链，复制，默克尔树等）

- IPFS 在Skycoin体系中只是在CXO之上的一个应用程序（CXO是不可变的对象系统，文件只是对象，所以不需要特殊的处理，因为文件只是一种object)

FileCoin做&quot;存储证明&quot;，Skycoin采用不同的技术方法，因为我们认为存储的证据太复杂，并不是真正的用户想要的，也不是实际的瓶颈。

IPFS / IPLD / Filecoin旨在集成到现有的Web基础设施和javascript中。 不同的是skycoin正在实施新的生态系统（[skywire](https://github.com/skycoin/skywire)，CXO，CX），因为现有的生态系统缺乏必要的数学属性（javascript不是确定性的，在浏览器之间的实现也有所不同，不能用于嵌入到链上，由于遗留问题也不能完全发挥潜力）。

此外，由于隐私和安全性不是可以将管道粘贴到技术堆栈的顶层就可以获得的，而是需要从底层硬件开始适当地设计每个组件。 Skycoin采用数学上严格，优雅的方式，通过拥有自包含的标准和生态系统，更简单的实现了隐私和安全。

所以filecoin的策略是与现有的互联网集成，只是一个可以导入的JavaScript库。Skycoin将有一个协议和硬件都全新设计的新互联网。

粗糙度和阻抗不匹配总是在系统接口间发生，skycoin采取将组件最小化的方法，自组装并最小化模块之间的依赖关系。 我们没有做&quot;奖励存储证据&quot;的原因之一是它需要使文件存储依赖于区块链，我们认为文件存储已经有效地运行，不需要额外增加区块链的开销，这不是放置用户激励的正确地方。

我们不想建立这样一个&quot;新的互联网&quot;，就像街机一样，因为用户没有投入足够的硬币就会关闭。 我们不希望用户需要为每一个不需要多少成本的体验付费，比如要求每一个功能，按钮点击，文件下载等都要付费。

所以，Maisafe，Ethereum，FileCoin / IPFS都采取不同的方法和理念，但是朝着同一个方向前进，skycoin在范围和技术实施方面和它们存在实质差异

- Ethereum试图把世界上所有的东西都放在一个单一的区块链上（而Skycoin几乎没有在块上放置任何东西，除了代币支付，Skycoin的ERC20代码有一个单独的区块链，而不是把所有的代币放在一个单一的区块链上）

- MaidSafe关注身份，并且具有最小的区块链（在MaidSafe中有全球性的身份，而Skycoin身份标识仅仅是公钥，是伪匿名的，MaidSafe实际上并没有一个区块链）

- FileCoin关心存储和文件存储的证明（Skycoin还包括通信和计算的原语，Skycoin的存储机制独立于块链，仅间接获利）

- Golem只关心租用服务器/ GPU的币时（这与使用比特币的EC2相同，只是较先进网络的一个小功能）

Skycoin项目的一个问题是，文档和 [whitepapers](https://www.skycoin.com/whitepapers.html)只涵盖了共识算法的工作（已经有2年了），但并没有显示当前的开发工作和生态系统建设。 所以网站需要更新，我们需要关于每个子项目的新白皮书。

开发工作进展远远超过了文档。 例如，CXO应用程序（[BBS](https://github.com/skycoin/bbs)）已经在测试和轻量级使用，但CXO的白皮书尚未撰写。

所以我们还在追赶市场营销和补充开发日志。
