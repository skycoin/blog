+++
title = "Skycoin BBS v5.0 Release Ankündigung"
tags = [
    "Development",
    "BBS",
    "CXO",
]
bounty = 1
date = "2017-12-18"
aliases = [
	"/de/bbs/bbs-release-v5.0/"
]
+++

Skycoin BBS v5.0 wurde endlich veröffentlicht - mit vielen Änderungen unter der Oberfläche!


## Thin Client

Die wichtigste Änderungen von allen ist die Einführung des Thin Clients. Man kann ab sofort auf Skycoin BSS zugreifen, ohne einen Knoten zu erstellen. Gehe hierzu einfach auf [bbs.skycoin.com](http://bbs.skycoin.com).

In Vorgängerversionen konnte man (und sollte man) nur durch ein lokal betriebenes Webinterface zugreifen bzw. Inhalte versenden. Da das Webinterface (und die API, die es aufruft) direkte Kontrolle über den Knoten selbst haben und Inhalte mit einem privaten Schlüssel signiert werden, der im Knoten gespeichert ist (oder serverseitig), ist es nicht sinnvoll es öffentlich zugänglich zu machen.

Daher benötigt die Einführung eines Thin Clients eine Nutzerverwaltung. Weiterhin muss der Prozess zur Signierung von Inhalten für die Übertragung clientseitig durchgeführt werden. Dies benötigt komplett neue Endpunkte für die Inhaltsübertragung und tiefe Veränderungen im Frontend.

Details zum neuen Übertragsungsprozess können im BBS-Wiki abgerufen werden: [github.com/skycoin/bbs/wiki/Content-Submission-Process](https://github.com/skycoin/bbs/wiki/Content-Submission-Process).

Momentan läd das Frontend sehr langsam. Dies ist auf [GopherJS](https://github.com/gopherjs) zurückzuführen, welches für das Setzen des Seeds und die Generierung von öffentlichen und privaten Schlüsseln zuständig ist und auch die Signierung und die Verifikation von Daten übernimmt. In zukünftigen Releases wird durch native JavaScript-Bibliotheken die Leistungsfähigkeit verbessert.

## Kommandozeilen-Interface

Nach der Einführung eines öffentlich zugänglichen Thin Clients haben wir die API-Endpunkte entfernt, die administrative Kontrolle ermöglichten, und ein Kommandozeilen-Interface für diese Belange eingerichtet.

Weitere Informationen sind hier zu finden: [github.com/skycoin/bbs/tree/master/cmd/bbscli](https://github.com/skycoin/bbs/tree/master/cmd/bbscli).

## Weitere Verbesserungen

* Verbesserungen für Import/Export (leider ist diese nicht kompatibel mit früheren Versionen des Import/Export für BBS v4.x)
* Codevereinfachungen und Leistungsverbesserungen für Remote Submissions und Interaktionen mit dem Skycoin Messenger. Aktualisierung auf den aktuellen Messenger.
* Verbesserte Leistungsfähigkeit beim File-Management.
* Besser Behandlung von nicht validen CXO Roots.
* Bessere Behandlung von Verbindungsunterbrechungen.

## Downloads

Den BSS-Download findet du hier: [github.com/skycoin/bbs/releases](https://github.com/skycoin/bbs/releases) (Quellcode wird hier auch zu finden sein).

Du kannst auf BBS auch über [bbs.skycoin.com](http://bbs.skycoin.com) zugreifen.

## Dokumentation

Wir haben eine Wikiseite eingerichtet: [github.com/skycoin/bbs/wiki](https://github.com/skycoin/bbs/wiki).

Die Seite ist immer noch im Aufbau!

## Community

Wir haben einen Telegram-Kanal: [@skycoinbbs](https://t.me/skycoinbbs).
