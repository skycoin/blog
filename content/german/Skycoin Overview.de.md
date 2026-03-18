+++
title = "Skycoin Übersicht"
tags = [
    "Skycoin",
    "Statement",
]
bounty = 15
date = "2017-08-26"
aliases = [
	"/de/overview/skycoin-overview/"
]
+++

<!-- MarkdownTOC autolink="true" bracket="round" depth="1" -->

- [Einführung in Skycoin](#skycoin-introduction)
- [Innovation und Fehler von Bitcoin und den gegenwärtigen Blockchain-Protokollen](#innovations-and-flaws-with-bitcoin-and-the-current-blockchain-protocols)
- [Innovationen erzeugt von Bitcoin](#innovations-produced-by-bitcoin)
- [Größte Fehler von Bitcoin](#major-flaws-of-bitcoin)
- [Gewünschte Eigenschaften für Systeme des verteilten Konsens für digitale Konten](#desirable-properties-for-systems-of-distributed-consensus-for-financial-ledgers)
- [Skycoins Sicherheitsphilosophie](#skycoin-security-philosophy)
- [Transparenz und Sicherheit: Obelisk und öffentliche Verbreitungskanäle](#transparency-and-security-obelisk-and-public-broadcast-channels)
- [Obelisk](#obelisk)
- [Einfacher binärer Konsensalgorithmus: Auswählen zwischen zwei Blöcken](#simple-binary-consensus-algorithm-choosing-between-two-blocks)
- [Konsens auf mehreren konkurrierenden Zweigwahlen (branch choices)](#consensus-on-multiple-concurrent-branch-choices)

<!-- /MarkdownTOC -->

# Einführung in Skycoin

Skycoin basiert auf einer Technologie, welche eine neue krytographische Primitive einführt,
bekannt als ein öffentlicher Verbreitungskanal. Er führt ebenso die Implementation eines
neuen Konsens-Algorithmus ein, genannt Obelisk, welcher die verbundenen Probleme, die aus
dem Proof-of-Work-Konzept und dem Miningprozess entstehen, entschärft und eine Heerschar
der, aus dem Mining resultierenden Sicherheitsprobleme, adressiert.
Obelisk ist nicht nur ein einfacher Algorithmus, sondern viel mehr eine Implementierung,
welche mittels mehrerer Techniken spezifische Sicherheiten garantiert.

# Innovation und Fehler von Bitcoin und den gegenwärtigen Blockchain-Protokollen

Bei Bitcoin werden neue Transaktionen in einem Block untergebracht,
welcher dann an die Blockchain angeknüpft wird. Jeder Peer des Bitcoin-Netzwerkes
kann neue Blöcke generieren. Jeder Block hat deshalb genau ein Elternteil, aber mehrere
valide Nachfolger (Kinder). Die Kette (chain) formt einen Baum und das Kernproblem das Bitcoin
gelöst hat ist, dass sich alle Knoten im Netzwerk einig sind, welche der prospektiven Kette
dem Konsens entspricht.

Bitcoin nutzt eine Technik des Names Proof-of-Work (PoW) um eine eindeutige Blockchain zu
bestimmen. Ein valider Block erfordert einen Hashwert, welcher unterhalb eines Zielknotens liegt.
Knoten fügen Transaktionen zu einem neuen Block hinzu und wählen zufällig Nonces bis ein valider
Hash für einen Block gefunden wurde.

Eine Funktion wird verwendet um absolute Ordnung unter den Ketten des Blockbaums zu schaffen.
Die Kette mit der höchsten Schwierigkeit und die die meisten Hashingoperationen benötigt,
ist die "längste Kette" und formt die Konsenskette. Die Vorstellung der "Blocktiefe" und
"Schwierigkeit" schaffen eine totale Ordnung über alle linearen Ketten des Blockbaumes und
nur die ressourcenintensivste Kette wird zur Produktion der Konsenskette akzeptiert.

Bitcoin-Knoten bauen Verbindungen untereinander zufällig auf, jeder Knoten übermittelt die
schwierigste ihm bekannte Kette seinen Peers. Wenn ein Knoten eine schwierigere Kette als ein
anderer verbundener Peer hat, dann erhält der Peer die Blöcke der Reihe nach in der richtigen
Reihenfolge. Der Peer wird die Funktion evaluieren und entscheiden, ob die erhaltene Kette
schwieriger zu produzieren ist und potentiell seinen Konsens für dieser Kette treffen.
Der Peer wird dann anschließend diese Kette seinen Peers anpreisen. Auf diese Weise wird der
Konsens durch das Netzwerk hindurchpropagiert und alle Knoten kommen zu einem Konsens.

Bitcoin geht nicht davon aus, dass die Knoten Identitäten haben und ehrlich sind.
Knoten dürfen anderen Knoten Daten senden und es kann den Konsens nicht beeinflussen,
denn die Konsensentscheidung ist etwas, dass unabhängig, alleine durch ihren eigenen Wert
getroffen werden kann.

# Innovation erzeugt von Bitcoin

### * Die Blockchain

Eine einzelne Datenstruktur die jeder besitzen kann.

### * Öffentliches Konto für Transaktionen

Speichern der finanziellen Transaktionen auf der Blockchain.

### * Nutzen von PoW und wiederholende Schwierigkeitsausrichtung um eine konstante Rate der Blockerschaffung zu gewähren

### * Nutzen der Hashes von öffentlichen Schlüsseln als Adresse

Öffentliche Schlüssel werden nicht bekanntgegeben, bis sie benutzt werden.

### * Nutzen der "Ausgaben" für Bilanzen

Es ignoriert den Versuch, teilbares digitales Geld zu erschaffen:
Um $20 aus einer $25 Ausgabe zu bezahlen, sendet man $20 Dollar
zu der Person und $5 zurück zu sich selbst.

### * PoW Schwierigkeitsfunktion und Blocktiefe

Erste Verwendung einer Funktion, welche eine totale Ordnung auf Blockbäumen
definiert. Das öffentliche Konto umgeht das Problem der doppelten Ausgaben von
traditionellem digitalen Geld.

# Größte Fehler von Bitcoin

Es gibt Probleme, welche bei der Entwicklung neuer Lösungen
für kryptographische Währungen adressiert werden müssen.
Bitcoin sollte als Cryptowährung im Embryostadium betrachtet werden,
bei dem sich die zukünftige Entwicklung verbessern muss. Die Technologie
auf der Skycoin basiert adressiert die großen Unzulänglichkeiten von Bitcoin,
indem man sie das komplette System der verteilen Konsensfindung neu gestaltet.

### * Konsensentscheidungen in Bitcoin sind nicht endgültig und können umgekehrt werden

Eine Person oder Organisation, welche genügend Hashpower mieten kann,
hat die Möglichkeit Transaktionen umzukehren.

### * Bitcoin erreicht Netzwerkkonsens aber individuelle Bitcoin-Knoten sind höchst gefährdet durch Gegner, welche den Router kontrollieren, durch den die Pakete wandern

Ein routerkontrollierender Gegner hat absolute Kontrolle über die Sicht
eines Knotens und kann willkürlich die Konsensentscheidung des Knotens
beeinflussen.

### * Bitcoin-Exchanges sind hoch anfällig gegenüber Attacken geworden

Erfahrene Angreifer können 51%-Attacken durchführen und
durch das Kaufen und Verkaufen von Altcoins auf Bitcoin-Exchanges
dieses in die Insolvenz treiben.

### * Banken und Wettseiten sind hoch anfällig gegenüber 51%-Attacken geworden

### * Sowie sich Bitcoin entwickelt, sind die Optionsscheine gegen Bitcoin und Attacken gegen das Netzwerk profitabler geworden

In der Zukunft könnten erfolgreiche Attacken gegen Bitcoin,
mit dem Handel von Optionsscheinen, Profite in der Höhe von
hunderten Millionen Dollar erzielen.

### * Staaten mit hoher Kapitalverkehrskontrolle, sowie konkurrierende Unternehmen könnten das Bitcoin-Netzwerk direkt attackieren um ihre finanziellen Interessen zu wahren

Solche Instanzen können die Kosten für eine Netzwerkattacke
mit Leichtigkeit stemmen und die Sicherheit von Bitcoin
untergraben.

### * Services welche "Cloud-Hashing" und das Mieten der Hashpower von Drittparteien anbieten sind zunehmend erfolreich

Viele große Pools haben nun die Möglichkeit Hashpower
für eine Mehrheitsattacke zu mieten.

### * Hacker können zahlreichen Sicherheitslücken in Routern und Netzwerkequipment nutzen um Coins von Banken und Exchanges zu stehlen

Ein Angreifer kontrolliert die Peers die mit einem Bitcoin-Knoten
verbunden sind und kann sicherstellen, dass die Verbindung nur mit
den von ihm kontrollierten Knoten aufgebaut wird. Zum Beispiel kann ein
Angreifer eine Einzahlungstransaktion auf eine Seitenkette (side chain)
einer Bank einbringen und die Bank dann dazu bringen, eine Abhebtransaktion
auszugeben, welche anschließend an das Hauptnetzwerk weitergeleitet wird.

### * Bitcoin kann keine kostengünstige Sicherheit bieten

Das Bitcoin-Netzwerk nutzt eine immense und exponentiell
wachsende Menge an Elektrizität. Bitcoins Sichheit beruht
bewusst darauf, soviel Elektrizität als nur möglich zu verschwenden.
Da die Sicherheit mit den Kosten verbunden ist, welche notwendig sind
um die Mehrheit der Hashingpower zu erreichen, werden diese Kosten, das
Bitcoin-Netzwerk zu betreiben, konstant nach oben getrieben.
In einem gut entworfenem System kostet $1 an Sicherheit $1000 um diese
zu umgehen. Bei Bitcoin ist das Verhältnis $1 zu $1. Zusätzlich dazu ist
die ganze Sache umwelttechnisch unverantwortlich.

### * Bitcoin ist es grundlegend nicht möglich die Transaktionszeiten zu senken ohne die Sicherheit zu kompromittieren

Bitcoin-Transaktionen brauchen im Schnitt 10 Minuten um in einen
Block integriert zu werden und mehr Zeit wird für höhere Sicherheit benötigt.


# Gewünschte Eigenschaften für Systeme des verteilten Konsens für digitale Konten

Die Kriterien, in welchen Bitcoin verbessert werden kann, sind folgende:

### * Keine doppelten Ausgaben

Sobald eine Transaktion ausgeführt ist, sollte es unmöglich sein den Konsens
rückgängig zu machen. Der Konsens sollte so unumkehrbar wie nur möglich sein.

### * Effizienz

Die Kosten ein perfekt abgesichertes Konto zu betreiben
sollten extrem niedrig sein.

### * Geschwindigkeit

Das System sollte Transaktionen innerhalb von Sekunden bestätigen.

### * Transparenz

Es sollte einfach sein bösartige Knoten zu überprüfen und zu identifizieren.

### * Routerattackensicherheit

Knoten sollten in der Lage sein zu erkennen,
ob ihr Konsens sich von dem des Netzwerks unterscheidet.

Einige Sicherheitseigenschaften sollten auch dann aufrechterhalten bleiben,
wenn die große Mehrheit der Knoten des Netzwerks bösartig und konspirierend ist.

Auf einem fundamentalen Level sind viele der angeborenen Sicherheitsprobleme
des Bitcoin-Systems verbunden mit dem Proof-of-Work-System und dem Miningprozess.
Seine Sicherheitsprobleme repräsentieren die generell auch real-vorkommende
byzantinische Problematik. Anreize existieren für Teilnehmer die Verifikationsprozesse zu
manipulieren, beispielsweise mittels Bestechung und Hacking.
Angreifer werden den Systemtakt manipulieren, die Router kompromittieren, Hashkollisionen
erzeugen, das Netzwerk mit hunderten und tausenden von Bots fluten um die
Signaturgestaltbarkeit auszunutzen.

Ein sicheres System muss nicht nur gegen jede bekannte Attacke geschützt sein,
sondern auch robust genug sein um sich gegen zukünftige Attacken weiter zu entwickeln.
Einige der Problem von Bitcoin können behoben werden, wie etwa die Signaturgestaltbarkeit.
Andere Probleme sind fundamental und können nicht adressiert werden, ohne dass ein komplett
neuer Rahmen definiert werden muss, wie etwa die Verlässlichkeit von Proof-of-Work und den Minern.

# Skycoins Sicherheitsphilosophie

Sicherheit ist ein Prozess der kontunierlichen Identifikation und Befestigung gegen Bedrohungen.
Ein gutes System erreicht "tiefgehende Verteidigung", hat mehrere redundante Systeme und wird
das totale Versagen individueller Maßnahmen überleben. Gute Sicherheit bedingt eine Unterscheidung
zwischen Bedrohungen, welche existentiell sind und solchen, welche nur Belästigungen sind.

Während es offensichtlich ist das kein einzelnes System alle Sicherheitsrisiken eliminieren kann
und gleichzeitig alle oben genannten Zielsetzungen erfüllen kann, repräsentiert Skycoin den nächsten
Schritt in der Technologie der Cryptowährungen, denn es nutzt den bausteinförmigen Ansatz zum
Erreichen von Sicherheit und verwendet verschiedene Systeme, um diverse spezielle Garantien
geben zu können. Skycoins Sicherheit fokusiert sich auf die Adressierung der exisitierenden Bedrohungen,
welchen Bitcoin sich gegenübergestellt sieht, und dem Schutz der User vor alltäglichen Bedrohungen,
im Versuch den höchsten Grad an Sicherheit gegen die Klasse von Attacken zu gewährleisten, welche
Stakeholdern, Insitutitionen und Usern den größten Schaden zufügen würde. Dies benötigt ein
komplettes neu gestalten von Bitcoin an beiden Enden, von der Walletgeneration zum Blockchain-Konsens
und von den fundamentalen Innovation in zahlreichen anderen Gebieten.

Die meisten Verluste in Bitcoin resultieren aus den Unzulänglichkeiten des Designs,
ein Mangel an Usability, und Fehler der Endnutzer, nicht etwa aus fundamental technischen
Attacken auf Softwareebene oder der Mathematik. Skycoin muss beides adressieren, die sich
abzeichnenden mathematischen Bedrohungen und die Sicherheitsrisiken, welche die schlecht
überlegte Nutzerfahrung von Bitcoin für alltägliche Nutzer kreiert hat. Die schlechte Usability
und das Design hat die User gezwungen die Sicherheitsvorkehrungen zu kompromittieren, was dazu
geführt hat, dass Millionen von Dollar gewohnheitsmäßig auf unsicheren Webwallets liegen.
Trotz der regelmäßigen Bedrohungen und massiven Diebstählen, über welche täglich von den
Medien berichtet wird, wurden durch schlechte Usability mehr Bitcoins verloren, als durch all die
Bemühungen der Kriminellen.

Fast die Hälfte aller existierenden Bitcoins wurden nie aus ihrer initialen Adresse bewegt und
werden dies auch nie, weil sie, als unwiderherstellbare Walletdateien verloren sind,
als Wallets verloren gegangen sind, oder über Missverständnisse, was tatsächlich beim Backup eines
Wallets gespeichert wird verloren gegangen sind. Mt.Gox hat kürzlich gemeldet, dass sie
200,000 Bitcoin in einem Wallet "gefunden" haben, von dem sie sich nicht bewusst waren, dass
es überhaupt Bitcoin hält. Das Wallet wurde bisher ignoriert und hätte leicht durch einen Fehler
gelöscht worden können. Wallets werden regelmäßig für leer gehalten, weil Computersoftware
nicht fähig war das Wallet, was mit einer "zu alten" Software erstellt wurde, zu laden.
Deshalb treten viele der Sicherheitsrisiken bezüglich Bitcoin auf dem Level der Usability,
der Endnutzer und der Exchanges auf.

Der Rest dieses Abschnitts behandelt einige der neuen Techniken die wir, in Kooperation mit
unseren Partnern entwickelt haben, um Sicherheitsrisiken auf Netzwerklevel zu adressieren und
um die Skycoin-Blockchain sicherer als vorherige Netzwerke zu machen.

Wir haben mathematisch bewiesen das unser System einen Konsens erreicht, die
geforderten Sicherheitseigenschaften hat und unter normalen Netzwerkbedingungen
gut operiert. Wir haben einige aufregende neuen Datenstrukturen, welche bisher
in noch keinem anderen Coin oder Stück Software gesehen wurden. Im Moment
arbeiten wir an einem Prototypen des System für den Einsatz. Die Skycoin-Entwicklung
ist iterativ. Es wird, während wir uns durch die Details arbeiten, bekannte Fehler adressieren
sowie Feedback erhalten und das System testen, Änderungen, Verbesserungen und Verfeinerungen geben.

# Transparenz und Sicherheit: Obelisk und öffentliche Verbreitungskanäle

Um die mit dem Bitcoin-System verbundenen Probleme zu adressieren, implementiert die
Skycoin zugrundeliegende Technologie die Blockchain in der Form
eines öffentlichen Verbreitungskanals. Jeder kann die Kette lesen, aber nur der Besitzer
kann Blöcke für sie prägen. Damit ein Block für eine persönliche Kette valide ist, muss er
mit dem privaten Schlüssel des Besitzers signiert sein. Jeder Knoten in diesem System des
Konsens-Algorithmus (Obelisk) hat eine persönliche Blockchain und diese ist der Kern-Primitiv
des Obelisk-Systems.

Der öffentliche Verbreitungskanäle stellt verhängt mehrere Einschränkungen:

### * Sobald ein Block veröffentlich wurde, kann er nicht mehr unveröffentlicht werden

Blöcken werden von Peer-zu-Peer zwischen allen Abonennten kopiert. Sobald ein Block
veröffentlicht wurde, verbreitet er sich zu allen Abonennten. Man müsste alle Peers
die den Block erhalten haben zerstören, um den Block aus dem Internet zu löschen.

### * Ein Knoten kann keine andere Version eines vorangegangenen Blocks ohne Detektierung veröffentlichen

Blöcke sind nummeriert und würden detektiert werden, wenn ein Knoten zwei Blöcke mit derselben
Sequenznummer signiert hätte.

### * Ein Knoten kann den Zeitstemptel des Erhalten eines Blocks nicht rückdatieren, ohne die Veröffentlichung des Block zu verzögern

Zeitstempel zählen nur nach oben, Zeitstempel erhöhen sich monoton mit der Blocksequenznummer.

### * Ein Block in der Mitte der Kette kann nicht geändert werden, ohne dass jeder andere nachfolgende Block ungültig wird

In einer Hashkette enthält jeder Header eines jeden Blocks, den Hash seines Vorgängers.

# Obelisk

Jeder Obelisk-Knoten (Skycoin Konsensknoten) hat einen öffentlichen Schlüssel (eine Identität)
und eine persönliche Blockchain (einen öffentlichen Verbreitungskanal). Konsensentscheidungen
und die Kommunikation geschehen innerhalb der persönlichen Blockchain eines jeden Obelisk-Knotens.
Dies erlaubt der Community den Knoten auf Betrug und Kollisionen zu prüfen. Es schafft für die Community
außerdem einen Weg Knoten zu identifizieren, welche sich an einer Attacke gegen das Netzwerk beteiligen und
zudem macht es Entscheidungen, die im Netzwerk getroffen werden, öffentlich, sowie welche Knoten diese
Entscheidungen beeinflussen.

Jeder Knoten hat eine Liste von anderen Knoten die er abonniert hat. Knoten mit mehreren Abonnenten sind
"vertrauenswürdige" und erbringen mehr Einfluss im Netzwerk. Wenn die Community Misstrauen gegen die
knotenbetreibenden Personen hat oder das Gefühl hat, dass die Macht im Netzwerk zu konzentriert
(oder zu wenig konzentriert) ist, hat sie die Möglichkeit als Kollektiv ihre Vertrauensbeziehungen
im Netzwerk zu ändern um die Macht im Netzwerk auszugleichen.

Die Beziehung von Knotenabonnenten kann zufällig sein und/oder sie kann mittels eines
Netz des Vertrauens ausgebildet werden (abonnieren der Knoten von Leuten denen man vertraut und
die man kennt und Leuten aus der Community, denen man vertraut).

Wenn ein Knoten einen neuen Block von einer Kette, die er abonniert hat, erhält, veröffentlicht
dieser den Hash des Block den dieser veröffentlicht. Dies ist eine öffentliche Bestätigung
des Erhaltens des Blocks. Jeder Block ist zeitgestempelt und querverweist auf Blöcke von
anderen Ketten. Dies schafft eine dichte verflochtene Kette von Blockbestätigungen.
Diese Kette baut kausale Beziehungen auf und kann als eine Art verteiltes Zeitstempelsystem agieren,
wie im nächsten Abschnitt beschrieben. Dies erlaubt dem Netzwerk zu beweisen, dass Daten nicht existierten,
oder nicht im Netzwerk veröffentlicht wurden, oder nachzuweisen, dass bestimmte Knoten in einem bestimmten
Zeitintervall aktiv oder offline waren.

Der aktuelle Obelisk-Konsens-Algorithmus basiert auf Ben-Ors randomisierten Konsens-Algorithmus

Eine Sybil-Attacke auf einen zufälligen Graphen (schlechtester Fall) erlaubt dem Sybil-Knoten
den Konsens zu kontrollieren, aber die Knoten sind nicht dazu fähig, Transaktionen umzukehren, was
den einzig ökonomischen Anreiz dieser Attacke entfernt. In echten Graphen ist die Sybil-Resistenz des
Netzwerks tatsächlich sehr hoch und das Betreiben eines Knoten, moderat ausgedrückt, sind die Kosten der Bandbreite,
was große Botnetze untragbar macht.

Vertrauensbeziehungen sind knapp und können aufgehoben werden. Im Falle einer Attacke reagiert das Netzwerk,
indem es die Verbindung zu weniger vertrauenswürdigen Knoten abtrennt und sich zu einem kleineren Kern an
vertrauenswürdigen Knoten zusammenzieht. Die öffentliche Akte jedes Knotens macht es sehr einfach, die an der
Attacke teilnehmenden Knoten zu erkennen. Sobald attackierende Knoten identifiziert sind, kappen die
Einzelpersonen ihre Beziehung mit diesen Knoten, was deren Einfluss reduziert. Deshalb sind die großen
Vorteile des Skycoin Netzwerks:

- Der Skycoin Konsens ist demokratisch und die Knoten werden von der Community betrieben
- Der Konsens der Skycoin-Knoten ist öffentlich
- Jeder Knoten ist der Community und Drittpartei-Prüfungen gegenüber rechenschaftspflichtig
- Einfluss innerhalb des Skycoin Konsenssystems ist demokratisch und transparent (aber ungleich)

# Einfacher binärer Konsensalgorithmus: Auswählen zwischen zwei Blöcken

Jede Stimmentscheidung ist ein Hashpaar (A,B). A ist der Hash des Elternteils des Blocks und
B ist der Hash des Blocks selbst. Jeder Knoten stimmt für den nächsten Block ab, von dem er
denkt, dass dieser der Konsensblock sein sollte. Wenn 40% der abonnierten Knoten eines Knotens
einen gleichen Kandidaten für den Konsens haben, ändern der Knoten seine Stimme zu diesem Block.
Die Knoten wechseln zufällig zwischen Kandidaten, solange bis der Konsens erreicht ist.

# Konsens auf mehreren konkurrierenden Zweigwahlen (branch choices)

Ein fortgeschritteneres System veröffentlicht (A,B,P), wobei P ein Wert zwischen 0 und 1 ist.
Die P-Werte aller Nachfolger eines Blockes addieren sich zu 1 auf. Dies erlaubt eine konkurrierende
Konsensentscheidung auf mehreren Kettenabzweigungen (chain branches).

Wenn die Mehrheit der Knoten des Netzwerks ehrlich sind, werden sie zu demselben Konsens konvergieren.

Skycoin hat also eine limitierte Version des Proof-of-Stake. Wir beeinflussen das Abstimmen zum Vorteil
von Blöcken mit größeren Transaktionsgebühren.

Wenn es nur zwei mögliche Konsensentscheidungen für ein gegebenes Elternteil gibt und beide Blöcke
deine Entscheidung ausführen, ist die Entscheidung effektiv ausgeführt, unabhängig davon, welcher
der beiden Blöcke letztendlich vom Netzwerk ausgewählt wird. Die Wahrscheinlichkeit der Korrektur
einer frühzeitigen Konsensentscheidung fällt exponentiell mit der Blocktiefe.
