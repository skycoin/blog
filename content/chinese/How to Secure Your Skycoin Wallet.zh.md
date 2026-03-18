+++
title = "如何保障你的Skycoin钱包安全"
tags = [
    "Statement",
]
date = "2018-01-03"
aliases = [
	"/zh/statement/how-to-secure-your-skycoin-wallet/"
]
+++

## Skycoin安全存储指南

我们目前正在努力开发钱包的加密功能，具体进展可通过GitHub社区的话题进行了解：https://github.com/skycoin/skycoin/issues/479 。同时，我们想清楚地给大家介绍安全存储Skycoin的最佳方法。你可以点击链接https://www.skycoin.com/downloads/ 下载Skycoin钱包（有Mac、Linux和Windows三个版本可选）。然后打开应用，你会看到创建新钱包的选择，点击选择按键，会出现一串单词，这是你的钱包密语（seed），你要用它来保障Skycoin的安全。有了这串单词，即使你的电脑没有下载Skycoin钱包，你也可以在任何时候通过特定的钱包地址获取你的资金。你可以在多个地方抄写这串单词，写好之后，把抄写这串单词的纸或笔记本放在安全的地方，确保只有自己可以拿到。如果有人拿到你的钱包密语，他们可以登录你的钱包，随意地将你的天空币转到任何地方。为了尽可能保障钱包安全，抄写密语后，你可以将电脑中的天空币钱包文件删除，或手动加密。如果要删除钱包文件，你需要使用命令行移除wlt文件。如果是Mac OS电脑，Skycoin的文件保存在/Users/yourUsernameHere/.skycoin；Windows电脑则保存在\Users\yourUsername.skycoin。你要使用命令行来访问这个文件夹。在Mac OS上打开命令行，点击command +空格键，找到“终端”，然后按回车键，你就进入命令行了。要浏览Skycoin文件夹，你要用这个命令

cd ~/.skycoin

到这里之后，你要将这个文件夹备份，方便访问wlt文件，以防你弄丢了你的密语。您可以使用U盘或移动硬盘来备份文件，将该文件夹复制过去。然后你就可以继续删除钱包文件了。输入此命令，查看列出的文件夹：

ls

在终端输入命令后，你会看到一个“钱包”文件夹。将这个文件夹里的文件从你的电脑上移除掉，你就能删除wlt文件。那么你要用到以下这个命令:

cd wallets

之后你会进入钱包文件夹，查看这个文件夹里的文件，然后删掉它们。

ls

文件列出来后，你会看到一个或多个wlt文件。要删除这些文件，需要使用以下命令。

rm InsertWalletNameHere.wlt

如果你将每个钱包的文件都这样删除掉，它们将不会出现在你的电脑上，所以即使你的电脑被病毒或黑客入侵，也没人能窃取你的资金。如果你想再次访问Skycoin钱包，你要用之前抄写下来的密语来载入钱包。

Windows和linux用户也可以按照这个指南操作，但是需要换掉这些命令，要使用Windows操作系统的特定命令来执行。这些都可以在谷歌上找到。

如果你不想完全删除钱包文件，你可以选择手动加密。我们社区的一位成员也给出了不错的操作指南： https://skywug.net/forum/Thread-Encrypt-Skycoin-Wallet

如你有任何问题，请通过https://t.me/Skycoin或contact@skycoin.com在Telegram上与我们联系。
