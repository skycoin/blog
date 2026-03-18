+++
title = "Skycoin BBS v5.0 リリースのお知らせ"
tags = [
    "Development",
    "BBS",
    "CXO",
]
bounty = 1
date = "2017-12-18"
aliases = [
	"/ja/bbs/bbs-release-v5.0/"
]
+++

ついにSkycoin BBS v5.0が多くの変更を加えてリリースされました！

## シンクライアント

最も大きな変化は、シンクライアントの導入です。
ノードを設定せずにSkycoin BBSにアクセスできるようになりました！
[bbs.skycoin.com](http://bbs.skycoin.com)へぜひ。

以前のバージョンでは、ローカルに提供されるWebユーザーインターフェイスを介してコンテンツにアクセスしたり、コンテンツの送信をしたりすること（のみ）ができました。
このWebインターフェイス（およびそれが呼び出すAPI）はノード自体を直接制御し、ノード内（またはサーバー側）に格納された秘密鍵でコンテンツに署名するため、公開することは適切ではありません。

したがって、シンクライアントの導入において、ユーザー管理、および提出するコンテンツに署名するプロセスをクライアント側で処理する必要があります。
これには、まるごと改良されたコンテンツ提出エンドポイントと、フロントエンドへの大幅な変更が必要です。

Details on the new content submission process can be found on the BBS Wiki: [github.com/skycoin/bbs/wiki/Content-Submission-Process](https://github.com/skycoin/bbs/wiki/Content-Submission-Process)
新しいコンテンツ提出プロセスの詳細は、BBS Wiki：[github.com/skycoin/bbs/wiki/Content-Submission-Process](https://github.com/skycoin/bbs/wiki/Content-Submission-Process)

現在、フロントエンドの読み込みは非常に遅いです。
これは、GopherJSを使用してシードおよび公開鍵/秘密鍵の生成を処理し、データの署名と検証を行うことによって発生します。
今後のリリースでは、純粋なJavaScriptライブラリを使用してパフォーマンスを向上させていきます。


## コマンドラインインターフェイス

公開されているシンクライアントの導入後、管理上の制御を処理するAPIエンドポイントを削除し、そのようなインタラクションに対処するためのコマンドラインインターフェイスを導入しました。

詳細は、こちらを参照してください：[github.com/skycoin/bbs/tree/master/cmd/bbscli](https://github.com/skycoin/bbs/tree/master/cmd/bbscli)

## 他の改善点

* インポート/エクスポートの改善。（残念ながら、BBS v4.xのインポート/エクスポートとの後方互換性はないです。）
* スカイコインメッセンジャーとのリモート提出とインタラクションのためのコードとパフォーマンスの改善の簡素化。最新のメッセンジャーを使用するように更新しました。
* ファイル管理のパフォーマンスの向上。
* 無効なCXOルートの処理の改善。
* 接続の切断の取り扱いの改善。


## ダウンロード

BBSをダウンロードするには、[github.com/skycoin/bbs/releases](https://github.com/skycoin/bbs/releases)　にアクセスしてください（ソースコードもここにあります）。

[bbs.skycoin.com](http://bbs.skycoin.com)からBBSにアクセスすることもできます。

## ドキュメント

wikiページを[github.com/skycoin/bbs/wiki](https://github.com/skycoin/bbs/wiki)　で始めました。

これはまだ進行中であることをご理解ください。

## コミュニティ

Telegram チャンネル: [@skycoinbbs](https://t.me/skycoinbbs)
