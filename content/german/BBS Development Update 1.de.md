+++
title = "Skycoin BBS Entwicklungsupdate #1"
tags = [
    "Development",
    "BBS",
    "CXO",
]
date = "2017-08-05"
description = "Das erste Entwicklungsupdate für Skycoin BBS."
aliases = [
	"/de/bbs/bbs-development-update-1/"
]
+++

## Eine Einführung

BBS steht für schwarzes Brett-System (bulletin board system). Obwohl traditionelle BBS-System nicht mehr wirklich benutzt werden, waren BBS in der modernen Ära ein Vorreiter für soziale Netzwerke.

Skycoin BBS ist eine der ersten Webapplikationen, welche unter Verwendung des Skycoin-Ökosystems implementiert werden.
Skycoin versucht das Internet zu revolutionieren; Dezentralisierung und Verschlüsselung der Protokolle sind Standard.

Skycoin BBS liegt eine selbstreplizierende Peer-to-Peer Datenbank mit dem Namen CXO (ein Teil des Skycoin-Ökosystems) zugrunde. Es nutzt unveränderbare Baumstrukturen von Golang-Objekten. Alle Objekte werden mittels deren Hashes nach einem definierten Schema referenziert. Jeder Baum hat ein Wurzelobjekt und wird mittels eines öffentlichen/privaten Schlüssels signiert. Um den Baum zu aktualisieren besitzen die Wurzeln inkrementelle Versionen namens "Sequenzen". Dieses Design ermöglicht schnelle und effiziente Datenreplikation.

## Datenstrukturen

Skycoin BBSs Datenstruktur (Version 0.2 - In Entwicklung) enthält Boards (Foren), Threads (Themen) und Posts (Beiträge). Über das Ranking von Boards und Threads kann abgestimmt werden. So sieht das alles in einem CXO-Baum aus:

![](/img/cxo_bbs_datastructure_v0.2.png)

Dies ist ein vereinfachtes Diagramm.

Alle eingereichten Objekte (Threads, Posts und Abstimmungen (Votes)) werden, mittels des öffentlichen Schlüssels und der entsprechenden Signatur des Users, verifiziert.

Jede Wurzel enthält Daten welche ein einzelnes Board repräsentiert. BoardPage enthält den "Inhalt"; das Board selbst, Threads und Posts. Threads werden durch den Hash des "Thread"-Objekts referenziert, wohingegen Posts durch den Hash von sich selbst referenziert werden. Deshalb können Posts und Threads nach dem Einreichen nicht mehr modifiziert werden.

ThreadVotesPages, PostVotesPages speichern die Abstimmungen über den Inhalt. Das "ref"-Feld der VotePage enthält den Hash des zugehörigen Inhalts. Das "Votes"-Feld speichert Abstimmungen über einen bestimmten Inhalt. Die VotePage werden durch den BBS-Node in eine Speicherstruktur "kompiliert", welche sehr schnell den "Stand der Stimmen" für die Präsentationsschicht bereitstellt.

Stimmen werden separat vom Inhalt gespeichert um die Anzahl der Baumknoten zu reduzieren, welche mit jeder neuen Stimme geändert werden müssen.
Dies ermöglicht einfachere Datenmanipulation durch den Compiler des Abstimmers.

## Veröffentlichungen (Releases)

Zurzeit ist nur eine stabile, aktuelle Version des Skycoin BBS veröffentlicht. Die Eigenschaften sind aufs Wesentliche begrenzt, aber die CXO-Datenstruktur ist komplizierter, als die oben beschriebene. Das Hinzufügen von Inhalten und Abstimmungen resultieren darin, dass sich die Wurzel-Sequenz mehrmals pro Aktion vergrößert.

Version 0.2 des BBS (aktuell in der Entwicklung), erhöht nicht nur die Performance und die Codelesbarkeit, sondern wird auch die folgenden Funktionen Implementieren.

* Verbessertes Laden von Inhalten - Wir werden die WebSocket-Verbindung(en) zwischen Client und Server verwenden, um Updates in Echtzeit sowie effizienteres Laden zu ermöglichen.
* Inhalte Ansicht/Voting Verbesserung - In tatsächlicher Leistung und flüssigem Ablauf aus der User-Perspektive. Spammeldungen werden ebenfalls eingeführt.
* Erlaubnisse - Boards werden die Möglichkeit besitzen Zugriffsrechte zu bestimmen (z.B. das Abschicken von Inhalten/Voting). Die Möglichkeit User zu blockieren wird ebenfalls verfügbar sein.

## Teilnahme

Bleibt auf dem neusten Stand der Entwicklung des Skycoin BBS indem ihr unserer [Telegram Gruppe](https://t.me/skycoinbbs) beitretet.

Skycoin BBS ist frei verfügbar. Das Git-Repository ist [hier] (https://github.com/skycoin/bbs) zu finden. Beachtet das die Entwicklung der Version 0.2 in dem "v0.2"-Branch stattfindet.
