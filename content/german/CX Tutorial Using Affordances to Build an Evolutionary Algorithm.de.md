+++
title = "CX-Tutorial: Affordanzen nutzen um ein kleines textbasiertes Adventure zu erschaffen"
tags = [
    "CX",
]
bounty = 5
date = "2017-09-20"
aliases = [
	"/de/cx/cx-tutorial-using-affordances-to-build-an-evolutionary-algorithm/"
]
+++

<!-- MarkdownTOC autolink="true" bracket="round" depth="2" -->

- [Einführung](#introduction)
- [Challenge-Response Architektur](#challenge-response-architecture)
- [Affordanzsystem](#affordance-system)
- [Objekte](#objects)
- [Fazit](#conclusion)

<!-- /MarkdownTOC -->

# Einführung

Dieses Tutorial stellt ein textbasiertes "Spiel" vor (der User interagiert nicht mit dem Programm,
er kann die Entscheidungen des Charakters nicht beeinflussen), welches eine
[anforderungsreagierende Architektur](#challenge-response-architecture)
nutzt, um zu bestimmen welche Aktionen der Spielcharakter ausführen kann.
Den kompletten Quellcode finden Sie unter [CXs Repository](https://github.com/skycoin/cx),
in der Datei *examples/text-based-adventure.cx*.

Das Spiel beschreibt ein Abenteuer eines Reisenden, welcher vor einem Monster flieht (nächsten Monat
ist schließlich Halloween). Wenn der Reisende eine bestimmte Anzahl von Stunden überlebt (das sind nur
Iterationen in einer *for*-Schleife), hört das Monster auf den Reisenden zu verfolgen.
Ein Beispiel einer Runde ist unten:

```
Der Reisende folgt dem Weg, ignoriert seine Schmerzen.
Heulen und Knurren, das Monster kommt.
Heldenmut kommt zum Vorschein, in der Hoffnung noch eine weitere Nacht zu leben.
Naiv und etwas dämlich, aber das Verhalten des Reisenden betäubt das Monster.
Norden, Osten, Westen, Süden. Jede Richtung ist gut, solange kein Monster gefunden wird.
Heulen und Knurren, das Monster kommt.
Der Reisende rennt weg und seine Feigheit lässt ihn einen weiteren Tag leben.

Du hast überlebt.
```

Wenn der Reisende sich dazu entscheidet das Monster zu bekämpfen und sein
heroischer Versuch scheitert, endet das Spiel. Ein Beispiel eines Spielendes ist:

```
Norden, Osten, Westen, Süden. Jede Richtung ist gut, solange kein Monster gefunden wird.
Heulen und Knurren, das Monster kommt.
Heldenmut kommt zum Vorschein, in der Hoffnung noch eine weitere Nacht zu leben.
Aber ein Fehlschlag beschreibt diese Abwehr und plötzlich kommt dieses Abenteuer zu einem Ende.

Du bist gestorben.

Call's State:
flag:			true
nonAssign_32:		""

halt() Arguments:
0: "Du bist gestorben."

65: call to halt
```

Wie man sehen kann, wird ein Error produziert wenn man stirbt (das ist angebracht, denn es ist
eine erschreckende Situation für einen Programmierer).

# anforderungsreagierende Architektur

In dieser Architektur wird eine Frage gestellt und verschiedene Agenten (in diesem Fall Funktionen)
müssen diese Frage beantworten. Eine einfache Frage wäre "Wer kann im Moment ausgeführt werden?" und die
Funktionen die ausgeführt werden können, werden daraufhin ausgeführt.

Die folgende Prototyp einer Funktion repräsentiert die möglichen Aktionen,
welche während des Abenteuers des Reisenden eintreten können.

```
func laufen (flag bool) () {}
func geräusch (flag bool) () {}
func überlege (flag bool) () {}
func chance (flag bool) () {}
func kampfErgebnis (flag bool) () {}
func dasEnde (flag bool) () {}
```

# Affordanzsystem

Eine weitere Funktion muss die Funktionsaufrufe koordinieren. In diesem Fall wird das
CX Affordanzsystem dazu verwendet, um zu bestimmen, ob es erlaubt ist eine Aktion
auszuführen, oder nicht.

```
ja := wahr
nein := falsch

remArg("laufen")
affExpr("laufen", "ja|nein", 0)
:tag laufen;
laufen(falsch)
```

Im obigen Code sucht *remArg()* nach einem Ausdruck mit dem "laufen"-Tag und entfernt dessen Argument.
Dies wird getan, damit das Affordanzsystem die Argumente, welche zum Ausdrucksoperator gesendet werden
können, auflistet. Danach sagt *affExpr()* CX, "unter allen Argumenten, die an *laufen* gesendet werden
können, können *ja* oder *nein* als Argumente verwendet werden und wende die
*0'te*-Option der Affordanzsystemliste, die du zurückerhälst, an."

Die vorherige Prozedur wird auf alle Aktionen, die während des Abenteuers des
Reisenden auftreten können, angewendet. Für jede dieser Aktionen werden die folgenden Regeln
abgefragt, um zu bestimmen ob die Aktion erlaubt sein sollte oder nicht.

```
setzeKlauseln("
          aff(laufen, ja, X, R) :- X = monster, R = falsch.
          aff(geräusch, ja, X, R) :- X = monster, R = falsch.

          aff(überlege, ja, X, R) :- R = falsch.
          aff(chance, ja, X, R) :- R = falsch.
          aff(kampfErgebnis, ja, X, R) :- R = falsch.
          aff(dasEnde, ja, X, R) :- R = falsch.

          aff(überlege, ja, X, R) :- X = monster, R = wahr.
          aff(chance, ja, X, R) :- X = kampf, R = wahr.
          aff(kampfErgebnis, ja, X, R) :- X = kampf, R = wahr.
          aff(dasEnde, ja, X, R) :- X = tot, R = wahr.
        ")
```

Die erste Regel kann gelesen werden, als "Ich werde abgefragt ob du überlegst das *ja*-Argument zur *laufen*-Aktion zu senden. Wenn das Objekt *monster* anwesend ist, dann ist dieses Argument eine *nicht*-Option"

Die Regeln im zweiten Block (die vier Regeln nach der ersten Leerzeile) sagen dem Affordanzsystem "niemals" *ja*
als Argument zu akzeptieren. Wir machen dies, weil wir das als Standardverhalten haben möchten, aber wir können später
Regeln aufstellen, die dieses Verhalten überschreiben. Dieses Überschreiben passiert in den letzten vier Regeln.
Im Prinzip sagt dieser Regelblock CX, *ja* als Argument zu akzeptieren, wenn ein bestimmtes Objekt im Objektstapel
vorhanden ist.

# Objekte

Einige der Aktionen fügen Objekte vom Objektstapel hinzu, oder entfernen sie.
Zum Beispiel, wann auch immer die *geräusch*-Aktion entscheidet das Monster erscheinen
zu lassen, wird *addObject("monster")*  ausgeführt. Wenn sich der Reisende dazu entscheidet vor
dem Kampf zu fliehen, wird das "monster"-Objekt vom Stapel entfernt.

Im Falle der *chance*-Aktion kann sich das Monster dazu entscheiden, dem Reisenden ein paar Sekunden
zu schenken, sodass dieser überlegen kann was er als nächstes tun möchte. Um dies zu realisieren wird
das "kampf"-Objekt entfernt (da das Monster den Kampf noch nicht beginnen möchte), aber das
"monster"-Objekt verbleibt auf dem Stapel.

# Fazit

Das CX Affordanzsystem nutzt Objekte und Regeln um komplexe Entscheidungen darüber zu treffen,
wie Affordanzen gefiltert werden sollen.

Indem Objekte verwendet werden können wir entscheiden, welche Aktionen aktiviert oder deaktiviert
werden sollen. Für dieses Beispiel wurde eine kleine Menge an Aktionen für den
Aktivierungsprozess in Betracht gezogen und der Vorteil dieser Architektur könnte zunächst
nichtig erscheinen. Nichtsdestotrotz können komplexere Regeln kreiert werden, die mehr Objekte involvieren
und eine einzige Regel könnte das Kommando über die Aktivierung etlicher Knoten in einem Netzwerk von
Aktionen haben. Zudem werden in diesem Beispiel nur zwei mögliche Argumente in Betracht gezogen:
*ja* und *nein*; wir hätten mehr Argumente kreieren können und zugehörige Aktionen, welche andere
Typen von Eingabeargumenten als Booleans akzeptieren.
