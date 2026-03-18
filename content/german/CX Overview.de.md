+++
title = "CX Übersicht"
tags = [
    "CX",
]
bounty = 20
date = "2017-09-06"
aliases = [
	"/de/overview/cx-overview/"
]
+++

<!-- MarkdownTOC autolink="true" bracket="round" depth="2" -->

- [Einführung in CX](#cx-introduction)
- [Repository des Projekts](#projects-repository)
- [Syntax](#syntax)
- [Affordanz](#affordances)
    - [Aritätsrestriktionen](#arity-restrictions)
    - [Typrestriktionen](#type-restrictions)
    - [Existentialrestriktionen](#existential-restrictions)
    - [Bezeichnerrestriktionen](#identifier-restrictions)
    - [Grenzrestriktionen](#boundaries-restrictions)
    - [Userdefinierte Restriktionen](#user-defined-restrictions)
- [Striktes Typisierungssystem](#strict-typing-system)
- [Kompiliert und Interpretiert](#compiled-and-interpreted)
    - [Lesen-Evaluieren-Ausgeben Schleife](#read-eval-print-loop)
    - [Meta-Programmierbefehle](#meta-programming-commands)
    - [Stepping](#stepping)
    - [Interaktives Debugging](#interactive-debugging)
- [Integrierte evolutionäre Algorithmen](#integrated-evolutionary-algorithm)
- [Serialisierung](#serialization)

<!-- /MarkdownTOC -->

# Einführung in CX

CX ist beides, eine Spezifikationssprache und eine Programmiersprache, designt um ein neues
Paradigma, basierend auf dem Konzept der Affordanz zu begrüßen.
Affordanzen erlauben es einem Programm zu wissen, welche Aktionen ausgeführt werden können
und welche nicht. Zum Beispiel können wir das Programm fragen, welche Argumente einer Funktion
mitgegeben werden können und das Programm antwortet mit einer Liste der möglichen Aktionen.
Nachdem entschieden wurde, welche Aktion der Liste angebracht ist, können wir eine der Aktionen
wählen und das Programm wird die gewählte Aktion anwenden. Konsequenz des CXs Affordanzsystems
ist die Erstellung eines genetisches Programmieralgorithmus, der angeborene Funktion bereitgestellt wird
und genutzt werden kann, um die Programmstruktur während der Laufzeit zu optimieren.

Die CX-Spezifikation besagt, dass dem Programmierer ein Compiler sowie ein Interpreter zugänglich
sein müssen. Der Interpreter kann leicht durch eine Lesen-Evaluieren-Ausgeben-Schleife aufgerufen
werden, in der der Programmierer interaktiv Elemente dem Programm hinzufügen und entfernen kann.
Nachdem das Programm beendet ist kann es kompiliert werden, um dessen Performance zu verbessern.

Die Typisierung in CX ist sehr strikt. Das einzige "implizite Casting" tritt auf, wenn der Parser
bestimmt was ein Integer ist, ein Float, ein Boolean, ein String oder ein Array. Wenn zum Beispiel
eine Funktion einen 64 Bit Integer als Eingabeparameter benötigt, muss man explizit mittels
einer Cast-Funktion zum geforderten Typ konvertieren.

Zu guter Letzt kann ein CX-Programm vollständig in Byte-Arrays serialisiert werden,
was es seinen Ausführungszustand und seine Struktur behalten lässt. Diese serialiserte
Version eines Programmes kann später deserialisiert werden, um die Ausführung, auf einem
beliebigen Gerät mit CX Interpreter/Compiler, fortzusetzen.

Die folgenden Abschnitte gehen auf die oben besprochenen CX-Features detaillierter ein.

# Repository des Projekts

Der Quellcode des Projekts kann aus seinem Github-Repository heruntergeladen werden:
[https://github.com/skycoin/cx](https://github.com/skycoin/cx).
Das Repository enthält die Spezifikationsdatei, Dokumentation, Beispiele und natürlich
den Quellcode selbst.

# Syntax

Wie schon in der Einführung erwähnt ist CX zugleich Spezifikations-, als auch Programmiersprache.
Die CX-Spezifikation verhängt keine Syntax, sondern die Strukturen und Prozesse, welche ein CX-Dialekt
implementieren muss um als CX erachtet zu werden.
Das hat zur Konsequenz, dass man zwei CX-Dialekte implementieren kann, einen mit einer lisp-ähnlichen
Syntax und einen anderen mit c-ähnlicher Syntax. Diese zugrundeliegende Sprache wird CX-Base genannt,
oder auch "die Basissprache". In diesem Dokument wird eine Implementation genutzt, um die Möglichkeiten
der Spezifikation zu präsentieren, obwohl deren Zweck nicht nur das dienen als akademisches Tool ist,
sondern sie soll eine vollständige und robuste Sprache für universale Anwendungen werden.

Die in diesem Dokument verwendete CX hat das Ziel eine Syntax aufzuweisen, welche der Syntax der
Sprache Go so ähnlich wie nur möglich ist.

# Affordanzen

Ein Programmierer muss eine Plethora von Entscheidungen während der Konstruktion eines Programmes
treffen, beispielweise unter anderen wie viele Parameter eine Funktion erhält, wie viele Parameter sie
zurückgibt, welche Statements benötigt werden um die gewünschte Funktionalität zu erhalten und
welche Argumente dieser Statement-Funktion als Parameter mitgegeben werden müssen. Das Affordanzsystem
in CX kann befragt werden, um eine Liste der möglichen Aktion, die auf einem Element angewandt werden können,
zu erhalten. In diesem Kontext stehen Elemente für Funktionen, Strukturen (structs), Module und
Ausdrücke (expressions).

Ohne einen Satz von Regeln und Fakten zu haben, die diktieren was der Zweck und die Logik hinter einem
Programm sein müssen, kann man jedoch einige einfache Einschränkungen bestimmen, welche zumindest die
semantisches Korrektheit eines Programms garantieren. Das Affordanzsystem stellt solche Einschränkungen
als erste Filterschicht bereit und wird unten näher beschrieben.

### Aritätsrestriktionen

Ausrücke in CX können mehrere Werte zurückgeben. Dies kreiert eine Herausforderung für das Affordanzsystem,
da die Anzahl an Variablen, welche die Ausgabenargumente eines Ausdrucks erhält, der Anzahl der Ausgaben,
die durch den Operator des Ausdrucks definiert werden, entsprechen muss.

```
out1, out2, ..., outN := op(inp1, inp2, ..., inpM)
```

Wenn das obige Bespiel korrekt ist, dann muss *op* Argumente in der Anzahl von *N* zurückgeben.
Dieses Problem wird noch schwieriger, wenn wir bedenken das die Definition von *op* vom
Affordanzsystem selbst, oder vom User, zukünftig geändert werden könnte: Sobald sich die Definition
von *op* verändert, können neue Affordanzen zu jedem Ausdruck, der *op* als Operator verwendet, angewendet
werden, weil die Anzahl der erwarteten Ausgabevariablen von *op* nun nicht mehr mit den tatsächlich ausgebenen
übereinstimmen.

Die bisherige Logik impliziert ebenso, dass wenn die Anzahl der eingehenden Variablen gleich der Anzahl der
Ausgabeparameter des Operators des Ausdrucks ist, die Aktion des weiteren Hinzufügens neuer eingehender
Variablen nicht mehr ausgeführt werden kann.

Aritätsrestriktionen können ebenso auf Eingabeargumente von Ausdrücken angewendet werden, sprich ein
Funktionsaufruf hat bereits alle seine Eingabeargumente festgelegt, dann sollte das Affordanzsystem
als potentielle Aktion keine weiteren Argumente zum Hinzufügen einberufen. Gleichermaßen sollte das
Affordanzsystem, sofern befragt worden, dem Programmierer mitteilen, dass das Hinzufügen von neuen
Argumenten zum Funktionsaufruf möglich ist, sofern ein Ausdruck versucht einen Operator mit weniger als den benötigten Argumenten aufzurufen.

**Beispiel:**

*Vermerk: String-Verknüpfungen wurden noch nicht implementiert. Ebenso fügt die Print-Funktion
stets eine neue Zeile an das Ende des ausgegebenen Strings an. Eine zukünftige Version der
CX-Implementation, die in diesem Dokument vorgestellt wird, adressiert diese Probleme.*

```
var age i32 = 18
var steps i32 = 23

func advance (direction str, numberSteps i32) () {
    printStr("Advancing:")
    printStr(direction)
    printStr("Number of steps:")
    printI32(numberSteps)
}

func main () () {
    advance("North")
}
```
Im obigen Beispiel fehlt dem Aufruf von *advance* in der *main*-Funktion ein Argument.
Wenn man das Affordanzsystem befragt sollte dieses, unter anderen Dingen, Aktionen, ähnlich wie
die Folgenden, anwerben:
```
...
(k)       AddArgument advance age
(k+1)     AddArgument advance steps
...
```

wobei k den arbiträren Index repräsentiert. Wie man erkenne kann, sagt das Affordanzsystem dem
Programmierer, dass zwei der möglichen durchführbaren Aktionen, das Hinzufügen eines weiteren Arguments
zur advance-Funktion ist, sowie das die globalen Definitionen *age*, *steps* als mögliche Argumente in Betracht
kommen.

Es ist bemerkenswert, dass die Affordanzen stets aufgezählt sein sollte und deren Ordnung sollte
konstant über mehrere Aufrufe des Affordanzsystems bleiben. Der Grund dafür ist, dass der Programmierer
in der Lage sein sollte dem System anzugeben, welche Affordanz nach dem Begutachten der Befragung
angewendet werden soll.

### Typrestriktionen

Das übliche Verhalten von Programmiersprachen ist es, ein Typisierungssystem zu haben, welches den
Programmierer im Senden von unerwarteten Argumenten in Funktionsaufrufen einschränkt.
Selbst in schwach-typisierten Programmiersprachen verursachen Operationen wie `true / "hello world"`
einen Error (außer natürlich im Falle einer [esoterischen Sprache](https://en.wikipedia.org/wiki/Esoteric_programming_language)). CX befolgt ein sehr
[striktes Typisierungssystem](#strict-typing-system) und Argumente, welche nicht exakt dem erwarteten
Typen entsprechen, sollten nicht als Kandidaten für die Affordanzaktionen betrachtet werden (obwohl
ein Workaround wäre, diese Argumente in Cast-Funktionen einzuhüllen, bevor sie dem Affordanzsystem
gezeigt werden).

Typrestriktionen müssen auch beim Zuweisen eines neuen Wertes zu einer bereits existierenden Variable
bedacht werden. In CX muss eine Variable, die mit einem bestimmten Typ deklariert wurde, diesen Typ
während ihrer gesamten Lebenszeit behalten (solange dieser nicht mittels Meta-Programmierbefehlen/
funktionen entfernt wird und erneut deklariert wird). Deshalb sollte eine, als 32-Bit Integer deklarierte
Variable nicht als Kandidat für das Erhalten eines 64-Bit Float Ausgabewerts in Betracht bezogen werden.

### Existentialrestriktionen

Dieser Typ von Restriktionen kann auf den ersten Blick trivial erscheinen: Wenn ein Element nicht
existiert, sollte eine Affordanz, die des involviert, ebenso nicht existieren. Nichtsdestotrotz
wird diese Restriktion zur Herausforderung, wenn wir eine Situation in Betracht ziehen, in der eine
Funktion umbenannt wurde und durchgehend durch ein Programm bereits als Operator in Ausdrücken
verwendet wurde. Wenn das Programm in der Form seines Quellcodes ist, wird dieses Problem auf ein
einfaches "Suchen & Ersetzen"-Problem reduziert, aber während der Laufzeit wird das Affordanzsystem
sehr nützlich: Eine Affordanz um die an diesen Operator gebundene Bezeichnung zu ändern.

Selbst wenn ein Element nicht umbenannt worden ist, ist das Bestimmen, ob ein Element existiert
oder nicht keinesfall trivial. Die in den Affordanzen zu verwendenen Elemente müssen auf dem
Aufrufsstack gesucht werden und zwar innerhalb des aktuellen Scopes, des globalen Scopes und im
Scope anderer Module.

### Bezeichnerrestriktionen

Das Hinzufügen von neu benannten Elementen sind übliche Kandidaten für Aktion von Affordanzen.
Eine Restriktion, welche beim Versuch solche Typen von Affordanzen anzuwenden, ist das sicherstellen
einer eindeutigen Bezeichnung des neuen Elements, damit Redefinitionen umgangen werden.
Das Affordanzsystem kann entweder innerhalb des Scopes des Elements eine eindeutige Bezeichnung
erstellen, oder den Programmierer nach einer angemessenen Bezeichnung fragen.

### Grenzrestriktionen

CX stellt standardmäßig Funktionen für das Zugreifen und Modifizieren von Elementen aus Arrays bereit.
Beispiele eines Array-Lesers (reader) und eines Array-Schreibers (writer) sind:

```
readI32([]i32{0, 10, 20, 30}, 3)
writeF32([]f32{0.0, 10.10, 20.20}, 1, 5.5)
```

Im ersten Ausdruck wird auf ein Array von vier 32-Bit Integern zugegriffen an der
Indexposition 3, welche das letzte Element des Arrays zurückgibt.
Im zweiten Ausdruck wird das zweite Element eines Arrays aus drei 32-Bit Floats
auf den Wert 5.5 geändert. Wenn auf eines der beiden Arrays mit einem negativen Index
oder einem Index außerhalb der Länge des Arrays zugegriffen werden würde, würde ein
"außerhalb der Grenzen"-Error auftreten.

Wenn nur die Typrestriktionen befolgt werden, wird das Affordanzsystem dem Programmierer
sagen, dass ein beliebiges 32-Bit Integer Argument als Index verwendet werden kann, um auf
das Array zuzugreifen. Obwohl diese Programme kompilieren würden, sind "außerhalb der Grenzen"-Errors
sehr wahrscheinlich, außer der Programmierer würde dem ausgewählten Index für die Anwendung besondere
Aufmerksamkeit schenken.

Das Affordanzsystem muss die Affordanzen nach den folgenden Kriterien filtern:
Verwerfen von jeglichen negativen 32-Bit Integern, verwerfen von jeglichen 32-Bit Integern, welche
die Länge des Arrays überschreiten und an das Array als Array-Schreiber oder Array-Leser gesendet werden.

### Userdefinierte Restriktionen

*Vermerk: Das userdefinierte Restriktionssystem ist aktuell noch im Experimentierstadium.*

Die grundsätzlichen Restriktionen garantieren zumindest die Abwesenheit von Laufzeit-Errors.
Diese Restriktionen sollten genügen, um eine interessante System zu erstellen, sowie der CX
systemeigene [evolutionärer Algorithmus](#integrated-evolutionary-algorithm). Trotzdessen sind
in einigen Situationen robustere Systeme notwendig. Für diese Zwecke werden Klauseln, Anfragen
und Objekte genutzt, um die Umwelt eines Modules zu beschreiben. Diese Elemente werden über einen
internen Prolog-Interpreter und die CX systemeigenen Funktionen *setClauses* (stelle Klauseln auf),
*setQuery* (stelle eine Anfrage) und *addObject* (füge Objekt hinzu).

Die allgemeinste Beschreibung dieses Restriktionssystems ist, dass der Programmierer eine Serie
von Prolog-Klauseln definiert (Fakten und Regeln), welche unter Nutzung der definierten Prolog-Anfrage,
für jedes hinzugefügte Objekt angefragt werden. Dies wird für jemanden, der dies zum ersten Mal liest
keinen Sinn ergeben. Ein Beispiel sollte die Konzepte und den Prozess etwas klarer machen:

```
setClauses("bewege(roboter, norden, X, R) :- X = noerdlicherWall, R = falsch.")

setQuery("bewege(roboter, %s, %s, R).")
```

In diesem Beispiel wird nur eine Regel definiert. Die Regel kann grob als "wenn der Roboter sich
nach Norden bewegen möchte, frage was X ist. Wenn X die nördliche Wand ist (northWall), dann kann
er sich nicht bewegen" übersetzt werden. Die Anfrage ist nur ein Stringformat, das als Anfrage für
die *move*-Aktion (Bewege) und für das *robot*-Element (Roboter) dient, welches zwei weitere
Argumente erhalten wird: Die Richtung und ein Objekt.

Objekte können mittels der *addObject*-Funktion definiert werden:

```
addObject("suedlicherWall")
addObject("noerdlicherWall")
```

Das Restriktionssystem wird das System für jedes dieser, im Modul präsenten, Objekte anfragen.
In diesem Beispiel wird das System zuerst die Anfrage "bewege(roboter, norden, suedlicherWall)" ausführen und das System
wird mit "nil" antworten, was bedeutet, dass es keine definierte Regel für diese Situation implementiert hat
und die Standardaktion ist die Affordanz nicht zu verwerfen.
Die zweite Anfrage wird "bewege(roboter, norden, noerdlicherWall)" sein und das System wird mit "falsch" antworten.
In diesem Fall hat die Affordanz den Test nicht bestanden und wird verworfen.

Das obige Beispiel illustriert wie diese Regeln eine Affordanz unter der Benutzung einer Bedingung
zunichte machen können. Regeln können jedoch auch für das Akzeptieren von Affordanzen verwendet werden,
selbst wenn diese von den vorherigen Regeln verneint wurden.

```
setClauses("bewege(roboter, norden, X, R) :- X = noerdlicherWall, R = falsch.
    bewege(roboter, norden, X, R) :- X = noerdlichesWurmloch, R = wahr.")

setQuery("bewege(roboter, %s, %s, R).")
```

Die hinzugefügte Regel im Code sagt dem System, dass es in Ordnung ist die nördliche Bewegung des
Roboters zu akzeptieren, wenn ein Wurmloch vorhanden ist. Wenn das Objekt-Array unberührt bleibt,
wird die Bewegungs-Affordanz trotzdem verworfen, aber wenn ein `"addObjekt("noerdlichesWurmloch")`
ausgewerdet wurde, wird das "noerdlicheWurmloch" hinzugefügt und der Roboter kann nun durch die Wand
unter Verwendung des Wurmlochs durchlaufen.

# Striktes Typisierungssystem

Wie in der Einführung erwähnt gibt es kein implizites Casting in CX. Deshalb gibt es mehrere
definierte Versionen der primitiven Typen im Kernmodul. Zum Beispiel gibt es vier native Funktionen
für die Addition: addI32, addI64, addF32 und addF64.

Der Parser fügt einen Standarddatentyp zu den Daten, die er im Quellcode findet, hinzu:
Wenn ein Integer gelesen wird, ist der Standardtyp *i32* oder 32-Bit Integer; wenn ein Float
gelesen wird, ist der Standardtyp *f32* oder 32-Bit float. Es gibt keine Mehrdeutigkeit mit den
anderen, vom Parser gelesen, Daten: *true* und *false* sind immer Booleans; eine Serie von Symbolen
zwischen zwei doppelten Anführungszeichen sind immer Strings; einem Array muss seinem Typ vor der Liste
der Elemente angegeben werden, z.B., `[]i64{1, 2, 3}`.

Für die Fälle, in denen der Programmierer explizit einen Wert in den Typ eines anderen casten muss,
stellt das Kernmodul eine Anzahl von Casting-Funktion bereit, um mit primitiven Typen umzugehen.
Zum Beispiel, `byteAToStr` castet ein Byte-Array zu einem String und `i32ToF32` castet einen
32-Bit Integer zu einem 32-Bit Float.

# Kompiliert und Interpretiert

Die CX-Spezifikation schreibt einen CX-Dialekt vor, um dem Entwickler zugleich einen Interpreter und einen
Compiler bereitzustellen. Ein interpretiertes Programm ist, wie zu erwarten, wesentlich langsamer als sein kompiliertes
Gegenstück, aber erlaubt ein flexibleres Programm. Diese Flexibilität kommt von den Meta-Programmierfunktionen und
Affordanzen, welche die Programmstruktur während der Laufzeit beeinflussen können.

Ein kompiliertes Programm benötigt eine starrere Struktur als ein interpretiertes, da für viele der Optimisierungen
diese Starrheit wirksam verwendet wird. Die Konsequenz daraus ist, dass das Affordanzsystem und jede Funktion, welche
auf der Programmstruktur operiert, limiert wird, auf die Funktionalitäten bei einem kompilierten Programm.

Der Compiler sollte verwendet werden, wenn die Performance das größte Anliegen ist, während ein Programm interpretiert
bleiben sollte, wenn der Programmier die bereitgestellte Flexibilität der CX-Features benötigt. In den folgenden
Unterabschnitten werden einige dieser Features vorgestellt, jedoch ohne das Ziel als Tutorial zu dienen, sondern nur als
eine Vorstellung.

### Lesen-Evaluieren-Ausgeben Schleife (Read-Eval-Print Loop)

Die Lesen-Evaluieren-Ausgeben Schleife (REPL) ist ein interaktives Tool, in dem der Programmierer neue
Programmelemente eingeben und evaluieren kann. Eine neue REPL-Sitzung wird die folgenden Nachrichten
auf der Konsole ausgeben:

```
CX REPL
More information about CX is available at https://github.com/skycoin/cx

*
```

Der "*" sagt dem Programmierer, dass REPL bereit ist eine neue Zeile Code zu empfangen. Die REPL
wird bis zur Eingabe eines Semicolos und einer Zeilenvorschubzeile die Eingabe des Users lesen.

Wenn kein Programm anfänglich in die REPL geladen wurde, wird CX mit einem leeren Programm starten.
Dies kann erkannt werden, wenn der `:dProgram true;` Meta-Programmierbefehle als Eingabe gegeben ist:


```
* :dProgram true;
Program

*
```

Die REPL gibt nur das Word "Program" aus, gefolgt von einer leeren Zeile.
Als einen ersten Schritt können ein neues Modul und eine Funktion deklariert werden:

Als erste Schritte sollten einen neues *main*-Modul und eine neue *main*-Funktion deklariert werden:

```
* package main;
Program
0.- Module: main

* func main () () {};
Program
0.- Module: main
	Functions
		0.- Function: main () ()

*
```

Wie gesehen kann, wird die Programmstruktur jedesmal ausgegeben, wenn dem Programm ein neues Element
hinzugefügt wird.

### Meta-Programmierbefehle

`:dProgram` wurde im obigen Unterabschnitt verwendet. Jedes Statement, dass mit einem Doppelpunkt (:) beginnt,
ist ein Teil der Kategorie der Instruktionen, bekannt als "Meta-Programmierbefehle".

Elemente in der REPL zu deklarieren instruiert CX, diese zu der Programmstruktur hinzuzufügen. Aber wie in vielen
anderen Programmiersprachen auch, sind diese Deklarationen limitiert darauf hinzugefügt zu werden, bestenfalls werden sie
neu definiert.

Wie aber in vielen anderen Programmiersprachen die eine REPL bereitstellen ist auch hier der Programmierer darauf limitiert,
einem Programm neue Elemente hinzuzufügen und höchstenfalls Elemente neu zu definieren. Meta-Programmierbefehle erlauben
es dem Programmierer, bessere Kontrolle, über die Art und Weise wie die Programmstruktur modifiziert wird, zu haben.

`:dProgram`, `:dState`, und `:dStack` werden ausschließlich für Debugging-Zwecke verwendet, durch die Ausgabe in folgender
Reihenfolge von, der Programmstruktur, dem aktuellen Befehlsaufrufszustand und dem vollen Aufrufsstack des Users.
`:step` instruiert den Interpreter einen Schritt vorwärts oder rückwärts in seiner Ausführung zu gehen. `:package`, `:func`
und `:struct`, bekannt als *selectors* (Selektoren), werden verwendet um den Scope des Programms zu ändern. `:rem` gibt
dem Programmierer Zugriff auf die *removers* (Entferner), welche verwendet werden können, um selektiv Elemente aus der
Programmstruktur zu entfernen. Zuletzt die `:clauses` (Klauseln), welche verwendet werden um die Klauseln eines Moduls
zu setzen, die von dem [userdefinierten Restriktionssystem](#user-defined-restrictions) verwendet werden; `:object` und
`:objects` werden in dieser Reihenfolge für das Hinzufügen und Ausgeben von Objekten verwendet; die letzten beiden
Meta-Programmierbefehle `:query`, welches für das Konfigurieren der Anfragen des Moduls verwendet wird und `:dQuery`, welches ein Helfer für das Debuggen der userdefinierten Restriktionen ist.

### Stepping (Stufung)

Ein Programm, das im REPL-Modus gestartet wurde, kann mit einer in einer Quelldatei definierten Programmstruktur
initialisiert werden. Zum Beispiel_
Aktuelles Verzeichnis

```
$ ./cx --load examples/looping.cx

```

lädt `looping.cx` aus dem Beispieleverzeichnis (die volle Liste von Beispielen kann im
[Projekt Repository](https://github.com/skycoin/cx) gefunden werden). Auch wenn ein Programm geladen wurde, wurde
es noch nicht ausgeführt. In der REPL muss man um ein Programm auszuführen, den Meta-Programmierbefehl `:step` verwenden.
Um ein Programm bis zum Ende durchlaufen zu lassen, muss `:step 0` verwendet werden. `:step` ist jedoch interessant,
denn es kann auch andere Integer als Argument erhalten (sogar negative Interger). Zum Beispiel:

```
CX REPL
More information about CX is available at https://github.com/skycoin/cx

* :dStack false;

* :step 5;
0

* :step 5;
1

* :step 5;
2

*
```

The *examples/looping.cx* program is being run 5 steps at a time. We
can see that 5 steps are required in order for the program to
re-evaluate the *while* condition, print the counter, and add 1 to the
counter.

Likewise, we should "go back in time" if the REPL is instructed to
`:step -5`.

```
...

* :step 5;
2

* :step -5;

* :step 5;
2

*
```

Nachdem CX instruiert wurde weitere 5 Schritte zu machen, wird die 2 auf der Konsole ausgegeben.
Es muss beachtet werden, dass der Zählen nicht nur mit einem anderen Wert belegt wird. Was ist passiert ist,
dass der Aufrufsstack auf seinen vorherigen Zustand umgekehrt wird.

### Interaktives Debugging

Ein CX-Programmier wird den REPL-Modus betreten, sobald ein Error gefunden wurde. Dieses Verhalten gibt dem
Programmierer die Möglichkeit, dass Programm zu debuggen, bevor versucht wird seine Ausführung fortzusetzen.

Im Beispiel unten wird ein Error wegen der Division mit 0 erhoben, die REPL alarmiert den Programmierer über
den Error, der letzte Aufruf des Aufrufsstack wird gedumpt und die REPL führt mit der Ausführung fort.

```
CX REPL
More information about CX is available at https://github.com/skycoin/cx

* package main;

* func main () () {};

* :func main;
main
:func main {...
	* foo := divI32(5, 3);
main
:func main {...
	* bar := divI32(10, 0);
main
:func main {...
	* :step 0;
fn:main ln:0, 	locals:
>> 1
fn:main ln:1, 	locals: foo: 1

Call's State:
foo:		1

divI32() Arguments:
0: 10
1: 0

0: divI32: Division by 0
main
:func main {...
	*
```
Gleichermaßen wird, wenn bei einem gegebenen Input eines Programmes an den CX-Interpreter, ohne den Aufruf
der REPL aber mit dem Erheben eines Errors, die REPL für den Programmierer/Systemadmin aufgerufen,
um das Programm zu debuggen.
Gleichermaßen wird, wenn der CX-Interpreter bei einem gegeben Programm als Input einen Error erhebt, ohne dass die REPL
aufgerufen wurde, diese für ihn (oder den Systemadmin) gestartet, um das Programm zu debuggen.

```
$ ./cx examples/program-halt.cx
1

Call's State:
nonAssign_0:		1
nonAssign_1:		1

divI32() Arguments:
0: 5
1: 0

5: divI32: Division by 0
CX REPL
More information about CX is available at https://github.com/skycoin/cx

*
```

# Integrierte evolutionäre Algorithmen

Das Affordanzsystem und die Meta-Programmierfunktionen von CX erlauben
die Flexibilität die Programmstruktur auf eine beaufsichtigte Weise
zu ändern. Allerdings können Affordanzen trotzdem automatisiert werden,
indem eine Funktion den Index der zu verwendenen Affordanz auswählt.

`evolve` ist eine systemeigenen Funktion, welche user-definierte Funktionen
konstruiert, indem zufällige Affordanzen verwendet werden. Ein iterativer
Prozess wird für das Testen verwendet.

`evolve` befolgt die Prinzipien der evolutionären Berechnung. Im speziellen führt
evole eine Technik durch, welches genetisches Programmieren genannt wird.
Genetisches Programmieren versucht die Kombination für Operatoren und Argumente
zu finden, welche ein Problem lösen. Zum Beispiel kann man `evolve` instruieren
die Kombination von Operatoren zu finden, welche bei 10 als gegebenem Argument,
20 ausgibt. Dies mag trivial klingen, aber genetische Programmierung und andere
evolutionäre Algorithmen können sehr schwere Probleme lösen.

Im dem *examples*-Verzeichnis des Repositorys kann man ein Beispiel (*examples/evolving-a-function.cx*)
finden, dass den Prozess eines [Curve-Fitting](https://en.wikipedia.org/wiki/Curve_fitting) beschreibt.

# Serialisierung

Ein Programm in CX kann teilweise oder vollständig zu einem Byte-Array serialisiert werden.
Die Serialisierung erlaubt es dem Programm ein Abbild des Programms zu erstellen (ähnlich wie bei
[Systemabbilder](#https://en.wikipedia.org/wiki/System_image)), in dem der exakte Zustand des
Programms zum Zeitpunkt der Serialisierung erhalten bleibt. Dies bedeutet, dass ein serialisiertes
Programm deserialisiert werden kann und seine Ausführung zu einem späteren Zeitpunkt fortführen kann.
Serialisierung kann ebenso für das Erstellen von Sicherungen (Backups) verwendet werden.

Ein CX-Programm kann seine integrierten Features einsetzen, um interessante Szenarien zu erschaffen.
Zum Beispiel kann ein Programm serialisiert werden, um eine Sicherung von sich selbst zu schaffen
und einen [evolutionären Algorithmus](#integrated-evolutionary-algorithm) auf einer seiner Funktionen
zu starten. Wenn der evolutionäre Algorithmus eine Funktion findet, die besser performed als die
vorherige Definition, kann man diese neue Version des Programms behalten. Hingegen wenn der evolutionäre
Algorithmus schlecht performed, kann das Programm aus dem gesicherten Abbild wiederhergestellt werden.
All diese Arbeitsschritte können automatisiert werden.
