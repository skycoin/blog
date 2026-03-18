+++
title = "3月份Skycoin生态系统技术报告  "
tags = [
	"Statement",
]
bounty = 0
date = "2018-04-05"
aliases = [
	"/zh/statement/march-skycoin-ecosystem-technical-report/"
]
+++

#### 3月期间，我们的开发团队在Skycoin生态系统的许多项目中取得了巨大的进展
---

**Skycoin**

-   完成命令行界面文档和整体测试。

-   根据BIP21生成的Skycoin URI，“hours”字段将显示币时的数量。例如：`Skycoin:2hYbwYudg34AjkJJCRVRcMeqSWHUixjkfwY?amount=123.456&hours=70`

-   使用新的 [日志模块](https://github.com/sirupsen/logrus) 替换 [旧模块](https://github.com/op/go-logging) 以确保与未来项目的兼容性。

-   完成了Skycoin Exchange Integration [文档。](http://github.com/skycoin/skycoin/blob/develop/INTEGRATION.md)

-   测试了最新的Go v1.10语言实现。

**Skycoin  钱包**

-   发布钱包v22版本。完成了前端和固定漏洞修复。

-   在最新版本的钱包中增加了[签名](http://github.com/skycoin/skycoin#release-signing) 以证明其可靠性。


**KittyCash**

*KittyCash验证服务 - 利用电子邮件订阅服务来验证客户在IKO中的购买情况*

-   实施并测试KittyCash购买验证服务

-   在验证服务中添加了docker文件。

*KittyAPI*
-   创建了一个命令行界面“ikocli”，可为IKO生成Kitty数据。

-  创建了一个命令行界面“testcli”，可使用个人数据测试KittyAPI。

-  升级了KittyAPI的基础，以整合出纳功能和交易市场API功能。

-   增加了docker文件。


*KittyCash出纳服务*

-   加强预订系统以稳定IKO期间的Kitties预订。

-   将验证服务整合到出纳功能中。

-   将KittyAPI整合到出纳功能中。


*KittyCash 钱包功能 *

-   升级并测试钱包

-   实现钱包中的交易市场功能。


*KittyCash交易市场*

-   升级了基础交易市场功能。

-   将验证服务整合到交易市场。


*电报Kitty拍卖机器人*

-  完成了Kitty拍卖记录机器人（未经测试）。

*KittyCash官方网站*


-   发布了新版本网站。

-   在网站中添加了一个KittyCash游戏。

-   改进了游戏中的记分牌。

**CXO**

-   实现了分割功能，允许分割大型文件以便同时集成到Merkle-tree中。

-   实现了大型文件列举功能，列出数据库中最近使用的对象，改进列表功能。

-   实现了多个功能以提高单个节点MaxObjectSize的数据交换速度，特别是在网络速度较慢的情况下，并减少了服务器和节点之间请求和响应的需求。

-   基于原始BoltDB添加了新的BoltDB存储方法。

-   完成了将数据库导出为JSON文件或二进制文件的功能。



**硬件开发**

-   完成了使用双面电路板和天线的定制OpenWRT路由器测试。

   ![](/img/tech-report-8.png)
---

**SPO矿机开发t**

-   SPO团队正在对采用1TB硬盘的分散存储矿机进行测试。Skycoin团队和SPO团队将继续合作，并为Skycoin开发拥有定制芯片和m.3 SSD的版本。

   ![](/img/tech-report-9.png)
---

**其他**

-  发布了一个全新的改版网站和一份 [新的商业白皮书。](https://www.skycoin.com/skycoin_whitepaper.pdf)

-   与CryptoWolf (<https://www.skycoin.com/buy/>)）合作，实现了在网站直接购买Skycoin的场外交易功能。
