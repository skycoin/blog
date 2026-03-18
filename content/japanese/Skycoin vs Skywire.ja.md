+++
title = "Skycoin vs Skywire"
tags = [
    "Skywire",
]
bounty = 4
date = "2017-08-30"
aliases = [
	"/ja/statement/skycoin-vs-skywire/"
]
+++

SkycoinとSkywireはSkycoinプロジェクトにおいて二つの別々の要素です。
Skycoinはブロックチェーンです。
Skywireは[メッシュネットワーク](https://ja.wikipedia.org/wiki/%E3%83%A1%E3%83%83%E3%82%B7%E3%83%A5%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF)です。

まずSkycoinが初めにつくられました。
これはそれ自体で独立しています。
Bitcoinのもつ問題を解決するためにつくられました。
Bitcoinの最大の問題は、ビットコインの中央集権化を引き起こすマイニングです。
その他のBitcoinが抱えていた問題は、ほぼソフトウェアのバグや暗号化部分であり、[トランザクション展性](https://en.bitcoin.it/wiki/Transaction_Malleability)などの問題を引き起こしました。

Skycoinは[Obelisk](https://www.skycoin.com/whitepapers)と呼ばれる新しい合意形成アルゴリズムを開発しました。
このアルゴリズムは、マイニング（または[Proof-of-Stake](https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AB%E3%83%BC%E3%83%95%E3%83%BB%E3%82%AA%E3%83%96%E3%83%BB%E3%82%B9%E3%83%86%E3%83%BC%E3%82%AF)のような他の代替手段）を排除します。
以下は[ホワイトペーパー](https://www.skycoin.com/whitepapers)の内容です。
合意形成アルゴリズムは、ネットワークのセキュリティを確保するためにweb-of-trust（信用の輪）メカニズムを使用します。
ネットワーク内の各ノードは、信頼できる通信の一覧を持ちます。
利用者はお互いにブロックを共有します。
[二重使用](https://en.wikipedia.org/wiki/Double-spending)を含むブロックなどの不良ブロックがある場合には、利用者はそのブロックを拒否し、信頼できる通信を行うことができます。
ネットワークには多くの悪意あるノードが潜んでいる可能性がありますが、それを信頼しなければ影響はないのです。

Skywireはインターネット自体の問題に対処するために開発されました。
インフラに対する大きな支配力を持っているため、特に政府にとってはたくさんの[attack points](https://en.wikipedia.org/wiki/BGP_hijacking)があります。
しかし、大規模なISPもカスタマーにとってはかなり悪いです。
これらの問題の全ては、インターネットの集中化によるものです。

Skywire自体はSkycoinなしでも動作できます。
これは最初のメッシュネットソフトウェアというわけではありません。
メッシュネットの構築にはいくつかの試みがありましたが、全てボランティアの努力によるものだったこともあり、どれも大きくは成長していません。
SkycoinとSkywireを統合することで、個人が大規模なISPの代わりにインターネットを運営するためのお金を稼ぐことができます。
これは、インターネットのインフラを民主化するための唯一の持続可能な道です。
さらに、Skywireネットワークは、現在のインターネットよりずっと高いセキュリティとプライバシーを備えています。

インターネットで動作するあらゆる種類のアプリケーションも、Skywire上で動作することができます。
ビデオ、ファイルストレージ、VPN、そのすべて。
Skywireは無料で使用できますが、ユーザーはトラフィックを転送するためにネットワーク内のノードに支払いをすることができ、より良い帯域幅と優先サービスを受けることができます。
これはSkycoinの長期的な需要を提供します。
まず初めに、SkycoinプロジェクトはSkywireネットワーク上のノードのオペレーターに補助金を支払うために、一部の未配分コインを使用します。
その後、Skywire上で実行されるアプリケーションのネットワークを利用するユーザーに補助金が与えられます。

SkycoinのブロックチェーンとSkywireネットワークは、相互に独立して使うことができますが、相互に利益をもたらします。
SkywireはSkycoinの様々に使える目的を提供し、SkycoinはSkywireネットワークを拡張するための財政的な動機を提供します。

*Read more:*
* *[Skywire Posts](/tags/skywire/)*
* *[Skycoin Overview](/overview/skycoin-overview/)*
* *[Skywire - Skycoin Meshnet Project](/overview/skywire-skycoin-meshnet-project/)*
