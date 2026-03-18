+++
title = "Skycoin BBS Entwicklungsupdate #2"
tags = [
    "Development",
    "BBS",
    "CXO",
]
date = "2017-08-31"
aliases = [
	"/de/bbs/bbs-development-update-2/"
]
+++

Es ist mehr als ein Monat vergangen, seitdem die Version 0.1 veröffentlicht wurde und Version 0.2 wird schon bald fertig sein!

Die Änderungen sind wie folgt:

- Nutzen der aktuellen CXO-Version (Peer-zu-Peer selbstreplizierende Datenbanken).
- Reimplementierung der CXO-Objekte und Bäume (In Vorbereitung für neue Features).
- Vorstellung eines `Views`-Moduls, das die Implementierung von verschiedenen Wegen Inhalte zu "betrachten" erleichtert.
- Erste Implementierung für das Folgen oder Vermeiden von Usern.
- Komplette Neuaufsetzung der Benutzeroberfläche (UI).

## CXO-Änderungen

CXO wurde graviend refaktorisiert, um schneller und stabiler zu sein.

Die API funktioniert nun besser mit Hash-Arrays - Zugriff in konstanter Zeit, schnellerer Replikation und der Möglichkeit, Elemente mit gegebenem Hash direkt abzurufen.

Diese Änderungen haben dazu veranleitet, die Mehrheit der Codestruktur des BBS ebenso zu verändern.

[Schaut hier in das CXO-Repository.](https://github.com/skycoin/cxo)

## CXO-Datenstrukturänderungen

Änderungen der Datenstruktur um folgende Probleme zu adressieren:
1. Implementieren einer Struktur, in der User in Zukunft zu ihrer eigenen Wurzel migrieren können.
2. Leichtes Bestimmen von "diffs" zwischen Root-Sequenzen (auch genannt Änderungen). Das wird dem Kompilieren der Views nützlich sein und Echtzeitupdates für den Endnutzer bereitstellen.
3. Leichtes Bestimmen des Typs eines Root-Objektes für verschiedene Root-Typen.

![Skycoin BBS v0.2 CXO-Datenstrukturen](/img/bbs_cxo_datastructure_v0.2.png)

Die `Wurzelseite`-Objekt (`RootPage`) bestimmt den Typ der Wurzel. Vorerst werden alle Daten unter einer Wurzel pro Board angehäuft.
In der Zukunft werden User und Threads ihre individuellen Wurzeln haben.

Zukünftig wird die `Brettseite`(`BoardPage`) eine Liste der öffentlichen Schlüssel haben, anstatt die href für die Threads, da diese ihre eigenen Wurzeln haben werden. Dies wird das Umziehen von Threads zwischen Boards einfach machen.

Die `Änderungsseite` (`DiffPage`) wird verwendet, um Änderungen der Root-Sequenzen zu bestimmen, um diese auf der `Brettseite`-Wurzel einzutragen. Dies ist im Grunde genommen, ein Satz von sich stets-erhöhenden Arrays, bei denen eine Erhöhung der Länge, als Änderungen interpretiert werden.
Die `Userseite` (`UserPage`) wird letztendlich eine Liste von öffentlichen Schlüsseln werden (diese werden wie "Teilnehmer" eines Bretts sein). Jeder User wird seine eigene Wurzel haben.

## Ansichtmodulimplementation

Eine Ansicht (view) ist grundsätzlich nur eine Oberfläche:

```go
type View interface {

	// Init erstellt die Ansicht.
	Init(pack *skyobject.Pack, headers *pack.Headers, mux *sync.Mutex) error

	// Update aktualisiert die Ansicht.
	Update(pack *skyobject.Pack, headers *pack.Headers, mux *sync.Mutex) error

	// Get erhält Informationen von der Ansicht.
	Get(id string, a ...interface{}) (interface{}, error)
}
```

Aktuell werden alle kompilierten Ansichten im Speicher abgespeichert. Dies wird allerdings unpraktisch werden, sobald sich unsere Userbasis vergrößert. Ansichten werden in künftigen Veröffentlichungen schlüsselwertbasiert (key-value), auf der Festplatte, abgespeichert werden.
Für Version 0.2 gibt es zwei Implementierungen der `Ansicht`; eine für den Inhalt (Bretter/Threads/Posts/Votes) und eine für das Kompilieren einer Follower/Vermeiderliste pro User.

## Eine neue Usererfahrung

Während dieser Post verfasst wird, ist das Vorgestellte schon fast fertig gestellt. Hier ist ein Youtubevideo des Fortschritts:

[![Skycoin BBS Vorzeigeprojekt 4](/img/bbs-4.jpg)](https://youtu.be/Oue3WVkmGh4)

Um auf dem Stand der Dinge der Skycoin BBS-Entwicklung zu bleiben, schaut hier regelmäßig rein und tretet unserer [Skycoin BBS Community](https://t.me/skycoinbbs) bei, sowie unserer Gruppe auf Telegram.
