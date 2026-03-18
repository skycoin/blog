+++
title = "Obelisk: Skycoin Konsens-Algorithmus| Informationsseiten"
tags = [
    "Consensus",
    "Obelisk",
]
date = "2017-09-09"
author = "johnstuartmill"
image = "img/obelisk-the-skycoin-consensus-algorithm.png"
aliases = [
	"/de/overview/obelisk-skycoin-consensus-algorithm-information-pages/"
]
+++

<!-- MarkdownTOC autolink="true" bracket="round" -->

- [Konsens-Highlights](#konsens-highlights)
	- [Warum Konsensus](#warum-konsensus)
	- [Hohe Skalierbarkeit und niedriger Energieverbrauch](#hohe-skalierbarkeit-und-niedriger-energieverbrauch)
	- [Robust gegenüber koordinierten Attacken](#robust-gegen%C3%BCber-koordinierten-attacken)
	- [Die "51%-Attacke"](#die-51%25-attacke)
	- [Versteckte IP-Adressen](#versteckte-ip-adressen)
	- [Unabhängigkeit von der Taktsynchronisation](#unabh%C3%A4ngigkeit-von-der-taktsynchronisation)
	- [Zwei Knotentypen: Konsens und Blockerschaffend](#zwei-knotentypen-konsens-und-blockerschaffend)
- [Wie der Skycoin Konsens-Algorithmus funktioniert](#wie-der-skycoin-konsens-algorithmus-funktioniert)
- [Referenzen](#referenzen)

<!-- /MarkdownTOC -->


## Konsens-Highlights

### Warum Konsensus

Der Skycoin Konsens-Algorithmus ("Obelisk") synchronisiert den Zustand der Skycoin-Blockchain quer über alle Netzwerkknoten. Dies resultiert in einer konsistenten Buchführung, soll also der Kontostand eines gegebenen öffentlichen Schlüssels (oder Adresse) berechnet werden, so liefert jeder Knoten dasselbe Ergebnis bei der Berechnung.

### Hohe Skalierbarkeit und niedriger Energieverbrauch

Bedingt durch das Design ist der Algorithmus hoch skalierbar und eine günstig berechenbare Alternative zu Proof-of-Work, deshalb kann der Konsens-Algorithmus und das Blockerschaffen auf einer low-budget Hardware mit niedrigem Energieverbrauch und niedrigen Anschaffungskosten laufen, was das Cryptowährungsnetzwerk robuster gegenüber Zentralisierungsversuchen macht (sprich die Knoten sind für die breite Masse erschwinglich).

### Robust gegenüber koordinierten Attacken

Unser Konsens-Algorithmus (i) konvergiert schnell, (ii) benötigt minimalen Netzwerktraffic und (iii) widersteht groß angelegten, koordinierten Attacken von einem gut organisierten Netzwerk bösartiger Knoten. Der Algorithmus ist schnell, nicht iterativ und kann auf einem dünn besetzen Netzwerk mit auschließlich nächster-Nachbar-Konnektivität (nearest-neighbor; z.B. auf einem vermaschten Netz (mesh network)) laufen, zudem funktioniert er auch dann gut, wenn Zyklen im Konnektivitätsgraph vorhanden sind (sprich DAG-mäßige Konnektivität ist *nicht* benötigt).

### Die "51%-Attacke"

In einer eingeschränkten Betrachtungsweise kann die Basisversion des Algorithmus, Ziel einer solchen Attacke sein. Speziell wenn die modifizierten oder bösartigen Knoten in der Mehrheit sind und einen protokollkonformen, UTXO-konformen Blockkandidaten versenden und dieser die Konsensfindung gewinnt. Allerdings wird ein Bock, der auf irgendeine Weise nicht Regelkonform ist, sofort von dem (unmodifizierten) Algorithmus ausgeschieden, bevor der Block die Chance bekommt an dem Konsensprozess teilzunehmen.

Konsensknoten können optional das Konzept des Netz-des-Vertrauens verwenden, indem Nachrichten von unbekannten Knoten (sprich signiert mit nicht vertrauenswürdigen öffentlichen Schlüsseln) bezüglich des Konsensprozesses ignoriert werden.

Wenn das Netz-des-Vertrauens eingeschaltet ist, würde das Zuschalten einer großen Menge an bösartigen Konsensknoten um (a) einen Blockchainfork auszulösen, (b) den Konsensprozess zu unterbrechen, wenig Wirkung zeigen, sofern nicht eine große Menge der Mitglieder des Netz-des-Vertrauens unwissentlich diese bösartigen Knoten in ihre lokale Liste von vertrauenswürdigen Knoten aufnehmen würden.

### Versteckte IP-Adressen

Die Knoten werden mittels ihres kryptographischen öffentlichen Schlüssels adressiert. Die IP-Adresse der Knoten ist nur den Knoten bekannt, zu denen sie eine direkte Verbindung haben.

### Unabhängigkeit von der Taktsynchronisation

Der Algorithmus nutzt keine "Wanduhr" (sprich kalendarische(s) Datum/Zeit). Stattdessen werden Blocksequenznummern verwendet, welche aus validen konsens- und blockchainrelatierten Nachrichten extrahiert werden, um die knoten-interne Zeit zu berechnen. Diese kann informell als "Blocktakt" bezeichnet werden.

### Zwei Knotentypen: Konsens und Blockerschaffend

Ein Konsensknoten erhält seinen Input von einem oder mehreren blockerschaffenden Knoten. Der Algorithmus für den Konsens und das Blockerschaffen sind separat, dennoch operieren sie beide auf denselben Datenstrukturen. Wir erwähnen das Blockerschaffen an den Stellen, an denen es hilft den Konsens-Algorithmus und wie dieser sich in das restliche System integriert, zu verstehen.

Beide Knotentypen führen stets eine Verifikation des Autors und eine Betrugserkennung des eingehenden Datums durch. Betrügerische oder ungültige Nachrichten werden erkannt, ausgeschieden und niemals verbreitet; Verbindungen mit Peer-Knoten, die in verdächtige Aktivitäten verwickelt sind, werden abgetrennt und ihre öffentlichen Schlüssel werden gesperrt.

## Wie der Skycoin Konsens-Algorithmus funktioniert

Aus darstellerischen Gründen setzt die folgende Beschreibung voraus, dass (i) jeder Knoten zugleich Konsens, als auch Blockerschaffend ist, (ii) konsens-relatierte Nachrichten von nicht-vertrauenswürdigen Knoten akzeptiert werden, sprich kein filtern, basiert nach dem Netz-des-Vertrauens durchgeführt wird. Die volle Implementation (sprich ohne diese vereinfachenden Annahmen) wird auf Skycoins Github-Repository verfügbar sein. Für die Simulationsergebnisse und die detaillierten schematischen Beispiele des Konsensprozesses, siehe [\[1\]](#references). Eine Simulation, welche die Vertrauenswürdigkeit beachtet, kann hier, jedoch für einen Anderen als den Skycoin-Algorithmus, gefunden werden [\[2\]](#references). Die Beschreibung des Skycoin Konsens-Algorithmus folgt.

1. *Blockerschaffen*. Jeder blockerschaffende Knoten sammelt neue Transaktionen
    und verifiziert diese mit den UTXO der gewünschten Sequenznummer,
    bündelt die konformen Transaktionen in einen neuen Block zusammen
    und verbreitet diesen Block im Netzwerk.

2. *Sammeln von Blöcken*. Jeder Konsens-Knoten sammelt die Blöcke,
    welche von den Blockerschaffern generiert wurden und packt diese
    in einen Container (abgesondert von der Blockchain) kodiert mit der Blocksequenznummer.

3. *Auswählen des gewinnenden Blocks*. Jeder Konsens-Knoten findet,
    nachdem eine ausreichend große Menge [^1] von Blockkandidaten erhalten wurden
    oder nachdem andere Kriterien erfüllt wurden, den Block, der von
    der Mehrheit der Blockerschaffer generiert wurde.
    Gleichstände werden deterministisch gelöst. Derartige Blöcke werden
    als "lokale Gewinner"[^2] markiert und in die lokale Blockchain eingefügt.
    Der zugehörige Schlüsselwert zur Blocksequenznummer des lokalen Gewinners wird gelöscht,
    damit der Speicherplatz wieder freigegeben wird.
    Der Hashwert des lokalen Gewinners wird verbeitet/verkündet.

4. *Verifikationsschritt*. Jeder Knoten behält Statistiken über die,
    von anderen Knoten gemeldeten, lokalen Gewinner. Wenn lokale Gewinner von
    allen oder den meisten Knoten gemeldet wurden [^3], bestimmt der Knoten den
    globalen Gewinner für die spezifische Sequenznummer. Wenn der globale Gewinner der
    lokale Gewinner ist, dann fährt der Knoten wie oben beschrieben fort.
    Anderenfalls entscheidet der Knoten, basierend auf externen Daten und
    lokalen Protokollen, zwischen (a) Resynchronisation mit dem Netzwerk,
    oder (b) Ausscheiden aus dem Konsensprozess und/oder Blockerschaffen,
    oder (c) behalten seiner Blockchain und Anfordern eines Notstopps.

[^1]: Dies ist ein konfigurierbarer Parameter des Algorithmus.
[^2]: Unter bestimmten idealen Bedingungen sind lokale Gewinner (für eine
    gegebene Blocksequenznummer) alle identisch, sprich enthalten
    eine identische Menge an Transaktionen. Der Unterschied entsteht durch die
    Netzwerklatenz, hohe Frequenz von Transaktionen, Nachrichtenzustellung außerhalb der Reihe,
    Nachrichtenverlust, Störungen durch bösartige Knoten etc.
[^3]: Diese Nummer kann festgelegt werden, zum Beispiel, indem man auf rekursive Weise seine
    vertrauenswürdigen Knoten fragt, die öffentlichen Schlüssel ihrer vertrauenswürdigen Knoten anzugeben.

## Referenzen

\[1\] johnstuartmill et al. A Distributed Consensus Algorithm for
Cryptocurrency Networks.
<https://github.com/skycoin/whitepapers/blob/master/whitepaper_skycoin_consensus_v01_jsm.pdf>
2016

\[2\] Houwu Chen and Jiwu Shu. Sky: an Opinion Dynamics Framework and Model
for Consensus over P2P Network.
<https://github.com/skycoin/whitepapers/blob/master/Sky-%20Opinion%20Dynamics%20Based%20Consensus%20for%20P2P%20Network%20with%20Trust%20Relationships.pdf>
201?

*Lest mehr:*

* *[Skycoin Konsens-Algorithmus Whitepapers](https://www.skycoin.com/whitepapers)*
* *[Obelisk der Skycoin Konsens-Algorithmus](/statement/obelisk-skycoin-consensus-algorithm/)*
