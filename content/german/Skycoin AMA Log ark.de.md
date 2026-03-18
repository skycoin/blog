+++
title = "Skycoin AMA Protokoll (gehalten auf ark.io)"
tags = [
    "Ask the Developers",
]
date = "2017-08-01"
description = "Protokoll des Fragt-mich-alles(AMA) gehalten auf ark.io/slack/ (vom 02.07.2017)"
aliases = [
	"/de/ask-the-developers/skycoin-ama-log-ark/"
]
+++

*ursprünglich gehalten am 2 Juli, 2017 im [ark.io slack](https://ark.io/slack/)*

*synth ist Skycoins Stellvertreter in diesem Fragt-mich-alles(AMA)*

**boldninja**
Lasst uns alle @Synth von Skycoin.com herzlich willkommen heißen und uns bei ihm bedanken, dass er sich die Zeit für dieses AMA nimmt.

**synth**
*Hallo.*

**mike**
Hi Synth.

**jakethepanda**
Hey @synth.

**thrice.pi**
Hey synth.

**dr10**
Hi.

**boldninja**
Ich denke wir können beginnen - Leute ihr wisst wie es läuft. Gebt ihm etwas Zeit zu antworten (nicht mehr als 2-3 Fragen anhäufen, damit er aufholen kann).

**dr10**
Wie würdest du - kurz & in einfachen Worten - die Vorteile von Skycoin für Zeitschriften und für nicht-crypto Leute zusammenfassen?

**mgaruccio**
Kannst du etwas über das vermaschte Netz (mesh net) erklären? Ist es einfach nur ein MPLS-Netzwerk zwischen Knoten, oder findet dort etwas anspruchsvolleres statt?

**michaelthecryptoguy**
Was geht ab @synth.

**tranzer**
Hi Synth. Ich habe eine Frage - sind die nicht-zirkulierenden Coins in einem Offline-Wallet, denn laut Coinmarketcap (CMC) befindet sich zurzeit nur eine kleine Menge im Umlauf? Was würdest du sagen, ist die eine einzigartige Eigenschaft die Skycoin besitzt?

**synth**
Das ist schwer zu sagen, denn Skycoin ist ein großes Projekt, indem mittlerweile schon über 6 Jahre an Entwicklung stecken. Verschiedene Teile des Projektes haben verschiedene Ziele.
Der Crypto-Coin dreht sich darum, die vorherrschenden Probleme mit einem Konsens-Algorithmus zu beheben. Die Möglichkeit zu haben, +300 Transaktionen in der Sekunde auszuführen, Transaktionen innerhalb von Sekunden anstatt von Minuten zu vollführen (schneller als Kreditkarten), das obsolet werden der Miner, eliminieren der Block-Belohnungen (Eliminierung der Inflation), Eliminierung der 51%-Attacke und anderer Probleme, die mit dem Mining zusammenhängen.
Außerdem gibt es andere Repository und experimentelle Projekte unter https://github.com/skycoin, wie z.B. das vermaschte Netz und der verteilte VPN-Prototyp, wo die Leute für das Weiterleiten von Traffic in Coins bezahlt werden. Des Weiteren verteilte Social Media Sites mit Peer-to-Peer Replikation, aber auch andere, verschiedene Versuche. Forschen an unveränderbaren Datenstrukturen für die nächste Generation des Internets. Einige von ihnen sind sehr radikal.

**dr10**
Wie funktioniert der Konsens-Algorithmus Obelisk und wie unterscheidet er sich von bekannten Algorithmen, wie 'Proof of Work' und 'Proof of Stake'?

**mgaruccio**
Wie viel ist bisher fertiggestellt? Könnte ich eine App auf der Plattform aufbauen, sofern ich das wollen würde?

**mike**
Bezüglich der Fortschrittgeschwindigkeit, was ist aktuell euer größtes Hindernis - wie z.B. Finanzierung, Arbeitskräfte, oder die zurzeit verfügbare Technologie?

**synth**

> Kannst du etwas über das vermaschte Netz (mesh net) erklären? Ist es einfach nur ein MPLS-Netzwerk zwischen Knoten, oder findet dort etwas anspruchsvolleres statt?

Es ist nicht wirklich ein vermaschtes Netz. Es ist ein per Software festgelegtes Netzwerk, welches viel mächtiger als ein einfaches vermaschtes Netz ist. Es ist eine neue Art eines Netzwerks mit komplett neuen Protokollen und Netzwerknamensgebung, unabhängig vom existierenden Internet.
Es unterstützt Source-Routing, wohingegen das existierende Internet heiße-Kartoffel-Routing betreibt, also nie dieselbe, optimale Latenzzeit erreichen wird.
Es unterstützt Multihoming, was IPv6 nicht kann (was ausschlaggebend ist, wenn man von Gigabit oder Terrabit-Netzwerken ausgeht und man mehrfach-redundante Bandbreitenpfade hat.
Es hat standardmäßig opportunistische Kryptographie implementiert, zwischen Link und den Schichten, sowie Ende-zu-Ende; also ist alles vorgegebenermaßen verschlüsselt, anders als im gegenwärtigen Internet.
Es hat die Möglichkeit des Teilstreckenverfahrens und könnte in Afrika, oder unter Bedingungen, in denen die Latenzzeit in die Minuten oder Stunden geht, mit einhergehendem, exzessivem Paketverlust funktionieren. Aktuell existierende Protokolle funktionieren dort nicht verlässlich. Es ist weitaus robuster als IPv4/IPv6 oder TCP/IP.
Es bietet eine verbesserte Privatssphäre. Wenn ein Paket eine Route wählt, die über 10 Teilstrecken (Hop) geht, dann ist jedem Hop nur sein Vorgänger und sein Nachfolger bekannt. Es ist nicht wie bei IPv4, wo jedes Paket Quelle und Ziel kennt. Dieses Privatssphäreniveau ist im existierenden Internet, in dieser Form aktuell nicht vorhanden.
IP-Adressen werden mit öffentlichen Schlüsseln ersetzt, damit der Datenverkehr zu einem Ziel nicht ausgelesen werden kann, ohne den zugehörigen privaten Schlüssen, der das Ziel eindeutig identifiziert, zu kennen. Das System braucht keine Drittparteien oder Zertifizierungsstellen. Dieses Design ist eine Revolution.

> Sind die nicht-zirkulierenden Coins in einem Offline-Wallet, denn laut Coinmarketcap (CMC) befindet sich zurzeit nur eine kleine Menge im Umlauf?

Die Coins sind in 100 verschiedenen Adressen verschlossen, jede versehen mit 1 Millionen Coins. Sie werden nacheinander freigegeben. Es gibt eine komplizierte Verschlussprozedur und das Freigeben von neues Coins, benötigt die einstimmige Zustimmung und ein unter den Entwicklern geteiltes Geheimnis. Jeder in der Gruppe dieses geteilten Geheimnisses kann die Freigabe von neuen Coins blockieren (um das Problem das NXT gekillt hat zu verhindern). Schon im Entwurf sollte es schwierig sein die Coins zu verteilen, es muss einen guten Grund oder Rechtfertigung für eine genehmigte Verteilung geben.

**mike**
Was sind die Hardwareanforderungen um einen drahtlosen Skywire-Knoten (Der Name des oben beschriebenen Protokolls) zu betreiben?

**arc-over-water**
Ich denke NXT geht es gut..

**synth**

> Wie funktioniert der Konsens-Algorithmus Obelisk und wie unterscheidet er sich von bekannten Algorithmen, wie 'Proof of Work' und 'Proof of Stake'?

PoS und PoW benutzen Miner. Miner erhalten Coins für jeden neuen Block als Blockbelohnung. Die Miner verdienen also Geld und werden über die Kontrolle des Netzwerkes kämpfen. Jeder wird darunter leiden, weil die neu geschaffenen Coins Inflation bedeuten.
Skycoin wurde designt um Mining zu eliminieren und um Inflation zu eliminieren. Keine Blockbelohnungen, keine neuen Coins. Wir waren deshalb gezwungen einen neuen Konsens-Algorithmus zu entwickeln und es gibt nur einige Methoden, welche unter diesen Einschränkungen funktionieren. Der Konsens-Algorithmus basiert auf Ben-Or's Randomisierungsprozedur um Übereinstimmung in einem verteilten System zu erreichen, mit einigen Verbesserungen, um konfliktreiche oder bösartige Knoten zu erkennen, welche versuchen den Konsens-Prozess zu verhindern.

Es gibt auf skycoin.com Whitepaper über die Spezifikationen. Ich würde es "Netzwerk-Konsens" nennen und es nutzt eine Art Netz des Vertrauens (WoT), indem von der Community Leute, welche einen schlechten Job bei dem Erstellen von Blocks machen, oder das Netzwerk sogar angreifen, ausgeschlossen werden können. Gleichzeitig haben die Leute, welche das Netzwerk kontrollieren, keine wirkliche Macht um das Netzwerk anzugreifen, sie können lediglich die Transaktionsgeschwindigkeit verringern und nervtötend sein, deshalb ist das einzige Problem wenn sie bösartig werden die Frage, wie man sie los wird und wie man neue Leute auswählt.

**mike**
Irgendeine Vorstellung wann Skywire veröffentlicht wird und bereit ist auf Hardware-Knoten getestet zu werden (Testnetz oder Hauptnetz)?

**mgaruccio**
Wenn es keine Block-Belohnung gibt, was ist dann der Anreiz einen Knoten laufen zu lassen?

**vega**
Was wird die eigentliche Funktion von Skycoin selbst sein? Wird der Coin als Währung verwendet werden, als Werttransfer in und zwischen all diesen sich entwickelnden Funktionalitäten und halb-geteilten Projekten um sie zusammen zu binden oder wird seine Verwendung eingeschränkter sein?

**michaelthecryptoguy**
Hast du eine Ahnung von den Spezifikationen die Knoten benötigen würden, zu Beginn oder auch später mit 10.000 Usern? (bearbeitet)

**synth**

> Ich denke NXT geht es gut..

Es gab drei Leute, welche jeweils 30% des Coins besaßen. Einer entschied sich auszusteigen und begann damit rasant Coins zu verkaufen. Ich glaube NXTs Börsenwert war damals über 150 Millionen.
Sobald er begann zu verkaufen, hat es NXT praktisch getötet.
Skycoins Distribution wurde so designt, dass Dumping, durch die Gründer und Frühnutzer, verhindert wird.
Nachdem Skycoins Distribution zu 30% angestiegen ist, wird es vermutlich einen festes Zeitschloss für den Rest der Coins geben, sodass ein Maximum von 5% jährlich herausgegeben wird. Die Distribution der verbleibenden 70% wird also mindestens 14 Jahre und möglicherweise sogar länger dauern.
Wir können nichtmal den Rest der Coins verkaufen, denn wenn wir 10% des Gesamten für die jetzigen $5 pro Coin verkaufen, wären es 50 Millionen oder sowas in die Richtung und wir können soviel Geld nicht ausgeben oder nutzen. Nicht in dieser Phase.
Ethereum hat 30 oder 70 Millionen innerhalb ihres ersten, oder ihrer ersten zwei Jahre nach der ICO ausgegeben und sind beinahe bankrott gegangen. Silicion Valley Büros, dementsprechende Gehälter und so weiter. Wir waren sehr konservativ und haben die Kosten niedrig gehalten und sie verantwortungsvoll gehalten. Jetzt haben wir Coins wie EOS, welche eine Milliarde Dollar sammeln wollen und noch nichtmal ein Produkt besitzen, keine Blockchain haben und keine Idee, wofür sie das Geld ausgeben würden, schmeißen aber $350.000 Feste im Time Square aus Marketing-/PR-Gründen etc...

**arc-over-water**
Was hindert dich daran zu verkaufen? Jeder könnte diese Menge an Geld ausgeben?
NXT ist eine neuere Plattform als SKY, der Börsenwert ist $220 Millionen plus $166 Millionen, ich verstehe was du sagst, aber die Belege sind falsch. Die Community von NXT ist riesig und aktiv. Aber du sagst NXT ist tot, dass begreif ich nicht?

**synth**

> Was wird die eigentliche Funktion von Skycoin selbst sein? Wird der Coin als Währung verwendet werden, als Werttransfer in und zwischen all diesen, sich entwickelnden Funktionalitäten und halb-geteilten Projekten um sie zusammen zu verknüpfen, oder wird seine Verwendung eingeschränkter sein?

Ja. Bitcoin hat keinen Verwendungszweck. Ein Altcoin macht zwei Dinge - Prüfe deine Bilanz - Sende Geld zu anderen Leuten. Zwei Eigenschaften - Prüfe Balance - Versende.
Damit ein Coin intrinsischen Wert besitzt, müssen Leute gezwungen sein ihn zu kaufen, um spezifische Services zu genießen. Um Nachfrage zu erzeugen muss es Sachen geben, für die Leute den Coin ausgeben können. Bitcoin ist demnach eine rein spekulative Anlage. Es wird kein Cashflow generiert und sein Wert ist bestimmt durch die Auffassung der Öffentlichkeit, oder auch der sozialen Übereinkunft.
Im Idealfall würde Skycoin als 'besserer Bitcoin' durchstarten (schneller, sicherer, neuer Algorithmus, einfacher, etc.) und mit der Zeit würden wir ein Ökosystem aufbauen, um eine Art finanzielle Unterstützung zu haben, aber auch um den Wert des Coins an das Netzwerk und die grundlegende Nutzung zu binden.
Das vermaschte Netz (Skywire) ist gut, denn es stellt einen Grund dar, für den die Leute Coins kaufen können und es ermöglicht es den Menschen, diese auch wieder zu verbrauchen. Man kann seinen Internet-Traffic über einen VPN laufen lassen der über Skywire tunnelt und möglicherweise wird dies einen nominellen Kostenpunkt haben (tatsächlich einen absurd kleine Geldmenge), aber es würde reale ökonomische Aktivität bedeuten und eine echte, reale Userbase und Community welche den Coin verwendet. Nicht nur Spekulation. Der spätere Anwendungsbereich ist wesentlich umfangreicher.

**arc-over-water**
Also wird das Skycoin-Wallet ein VPN für unsere Internetnutzung sein?

**synth**

> NXT ist eine neuere Plattform aus SKY, der Börsenwert ist $220 Millionen plus $166 Millionen, ich verstehe was du sagst aber die Belege sind falsch. Die Community von NXT ist riesig und aktiv. Aber du sagst NXT ist tot, dass begreif ich nicht?

Was ich sage ist, dass NXT wesentlich fortgeschrittener wäre, als es jetzt ist und wahrscheinlich auf der Stufe, auf der Ethereum jetzt ist, wenn der Fehler mit der zu gebündelten Distribution nicht gewesen wäre. Es hat sie Jahre zurückgesetzt. Sie haben es nicht in Betracht gezogen, was es für Auswirkungen auf den Preis über längere Zeit haben könnte, wenn einer der frühzeitigen Wale abrupt verkaufen würde, oder sich dazu entscheidet raus zu wollen.

**arc-over-water**
Aber sie haben dasselbe erneut mit IOTA gemacht, derselbe führende Entwickler.. Es wurde über eine $Milliarde freigegeben und sie lassen es über den Marktpreis verteilen.

**synth**

> Also wird das Skycoin-Wallet ein VPN für unsere Internetnutzung sein?

Das VPN ist nur eine Anwendung, welche Bandbreite über Skywire verwendet. Es sind mehrere Dinge in der Entwicklung.
Dies ist ein BBS wie 4chan, welches vollständig mittels CXO dezentralisiert ist - https://github.com/skycoin/bbs.
Es wird ebenfalls über Skywire laufen, das ist in etwa, als wenn man ein komplett neues Internet vom Grund auf entwickelt. Die Anwendungen, die darauf laufen werden, sollen spezialisiert und fokusiert auf Privatsphäre sein etc.
GitHub skycoin/bss - tragt zur Entwicklung der BBS-Entwicklung bei, indem ihr euch ein Account auf GitHub erstellt.

**mike**
Also is Skycoin ein Proof of Resource Coin, dessen Wert über nützliche Services gedeckt wird, in diesem Fall sicheres und privates Networking? Gibt es Pläne für dezentrale Speicherung, oder sogar verteilte Rechenleistung?

**arc-over-water**
Also diese 100 Millionen Coin-Accounts werden in 100 ICOs verteilt, oder wie soll die Distribution stattfinden? Ist dies im Code verankert, oder obliegt es der Entscheidung der Entwickler?

**rockyj**
!Berechne

**slackbot Custom Response**
https://docs.google.com/spreadsheets/d/1FGo3FkC3uSWXGHatPQyny2brMWjAIJsHFCR-Lhkl_m0/edit#gid=0

**synth**

> Wenn es keine Block-Belohnung gibt, was ist dann der Anreiz einen Knoten laufen zu lassen?

Einen 'consensus'-Knoten laufen zu lassen kostet überhaupt nichts. Man kann es auf einem Raspberry Pi laufen lassen.
Die wichtigste Sache ist, dass falls Leute einen schlechten Job bei der Konsens-Sache machen, kann die Community sie loswerden und austauschen. Die andere ebenfalls genauso wichtige Sache ist, dass sie automatisch überprüft werden können, ob sie den Regeln des Protokolls gehorchen.
Die Miner in Skycoin sind nicht sehr mächtig und können nichts anderes tun, außer die Transaktionen zu verlangsamen. Sie sind nicht dazu fähig anderer Leute Geld ohne deren private Schlüssel auszugeben, also sind die Mining/'consensus'-Knoten fast schon irrelevant. Es ist nicht wie bei Bitcoin, wo die Miner das Netzwerk als Geisel nehmen können und selbstbestimmt agieren können (die Transaktionsgebühren für ihren eigenen Vorteil erhöhen und Fortschritte zurückhalten, welche Bitcoin für jedermann verbessern würde, etc.).

> Also is Skycoin ein Proof of Resource coin, dessen Wert by nützlichen Services gedeckt wird, in diesem Fall sicheres und privates Networking? Gibt es Pläne für dezentrale Speicherung, oder sogar verteilte Rechenleistung?

Wir haben bereits dezentrale Speicherung mit dem Namen CXO. Nur die Bandbreite ist monetarisiert über Skywire. Wir zählen nicht jeden Cent und versuchen den Coin an jeden API-Aufruf zu binden. Alles, das umsonst sein sollte, ist umsonst. Es ist also eine andere Philosophie. Aufgesetzt auf CXO haben wir außerdem soziale Medieneinsatzmöglichkeiten (ähnlich zu Steemit).
CXO ist sehr ähnlich zu IFPS, aber einfacher und designt für unsere interne Infrastruktur und mit unseren Kryptographiestandards, anstatt einen Mix zu bilden.

**mike**
Ist es in Skycoin möglich die besten Pfade und Route um schlechte oder langsame Knoten, welche das Netzwerk beschädigen, zu suchen, um deren Einfluss auf den Konsens zu verringern?
Sieht so aus, als hättest du die Frage oben schon beantwortet, während ich am Schreiben war...

**tranzer**
Wie viele Transaktionen pro Sekunde (tx/s) kann Skycoin verarbeiten? Wie lange ist die Blockdauer?

**thrice.pi**
300 richtig? ^

**arc-over-water**
Auf eurer Website sagt ihr, dass ihr einen nicht-turing-vollständigen Lisp-Dialekt haben werdet?

**synth**

> Also diese 100 Millionen Coin-Accounts werden in 100 ICOs verteilt oder wie soll die Distribution stattfinden? Ist dies im Code verankert, oder obliegt es der Entscheidung der Entwickler?

Wir werden bald eine Distributionsseite auf unserer Website haben. Es ist kompliziert.
Skywire wurde designt um Coins aus der Zirkulation zu ziehen über eine Art 'zehnten Teil' und es werden automatisch und effektiv Coins zurückgekauft. Die Distribution wird sich also zuspitzen und anschließend abfallen. Eine Distribution verteilt die weggeschlossenen Coins, diese zirkulieren anschließend und enden schließlich wieder am Ursprungsort (der 'zehnte Teil' von Skywire zieht sie aus der Zirkulation), welche aber dennoch zur freien Zirkulation gezählt werden.
Die Coinbesitzer erhalten zudem eine Coinhour-Dividende (Coinstundendividende) und es wird eine Konversionsrate zwischen Coinhours und Skycoins geben, wobei Coinhours die tatsächliche Währung für das Skycoinnetzwerk sind. Wenn man nicht genügend Coinhours besitzt, dann verkauft man Skycoins für Coinhours zum Marktpreis und erwirbt damit Bandbreite; aber wenn man viele Coins besitzt, dann besitzt man genug Bandbreite um Filme herunterzuladen oder VPN-Dienste zu nutzen und es ist unterm Strich umsonst.
Es ist also eine zweischichtige Ökonomiestrukture. Mit Coinrückkäufen Coins aus der Zirkulation zu ziehen und mittels der Dividende einen Ansporn für die User geben, den Coin nicht zu verkaufen, wenn sie das Netzwerk verwenden.

**arc-over-water**
Es wird also zwei Währungen geben, die eine zu besitzen wird einem Einkünfte in der Anderen geben.

**synth**

> Ist es Skycoin möglich die besten Pfade und Route um schlechte oder langsame Knoten, welche das Netzwerk beschädigen, zu suchen um deren Einfluss auf den Konsens zu verringern?

Ja. Das ist sehr wichtig.
Die Person, welche die Verbindung aufbaut, wählt den Pfad der Verbindung!
Man kann den Pfad mit der geringsten Latenzzeit für Videospiele oder Skype wählen, oder Pfade mit der höchsten Durchsatzrate für Videodownloads etc.
Man kann auch Pfade wählen, welche über spezifische Knoten, Einrichtungen oder Länder gehen, sofern man Sicherheitsbedenken hat oder um die Anzahl der potentiellen Abhörstellen zu verringern.

**mike**
Wird Skycoin den Subventionsplan für das Einrichten und Registrieren der Mesh-Knoten, wie ursprünglich geplant, beibehalten?

**dr10**
Wann habt ihr vor eure geplante Technologie und Service der breiten Masse vorzustellen? Wann kann man benutzen, was ihr versucht umzusetzen?

**synth**

> Auf eurer Website sagt ihr, dass ihr einen nicht-turing-vollständigen Lisp-Dialekt haben werdet?

Das ist vermutlich ein Fehler. LOL. Wir werden bald eine neue Website haben.
Es gibt keine Skriptsprache auf der Skycoin-Blockchain. Jede Transaktion findet in konstanter Zeit statt (aus Effizienz und Sicherheitsgründen und um die höchste Transaktionsrate zu erreichen, sowie um den Coin einfach zu halten).
Jedoch haben wir eine Sprache mit dem Namen CX in Entwicklung, welche eine Sprache der nächsten Generation ist und über "smart contracts" und die Spielsachen von Ethereum hinaus geht. Sie verwendet unveränderbare Datenstrukturen und ist etwas fundamental neues. Die meisten der Skycoin "smart contracts" werden vermutlich abseits der Blockchain oder in persönlichen Blockchains stattfinden, denn wir wollen nicht alle Daten in die Haupt-Chain stopfen, weil sonst jeder dazu gezwungen wird die Verträge von anderen herunterzuladen und das ist schlichtweg nur ein Zuspammen der Blockchain bis zum Tode.
Es gibt klügere Wege um das zu tun.

> Wird Skycoin den Subventionsplan für das Einrichten und Registrieren der Mesh-Knoten, wie ursprünglich geplant, beibehalten?

Ja. Wir werden von 20 auf 30% der Coindistribution kommen, durch Netzwerkanreize für die Leute, die Skywire-Knoten, Konsensus-Knoten und Services laufen zu lassen.
Ich denke das wird gewaltig für das Marketing sein. Dazu kommt, dass das der beste Weg ist die Coins an die User zu verteilen, ohne dass alle von einigen wenigen Walen besessen werden.

**samuelvihollandia**
Ich habe gelesen wie du vorgeschlagen hast, dass Skycoin für VPN-Verbindungen verwendet werden kann, ist das der größte Anwendungsfall?

**arc-over-water**
Maidsafe arbeitet seit über 10 Jahren an dem Neudesign des Internets, was macht ihr gleich und was sind die Unterschiede?

**synth**

> Ich habe gelesen wie du vorgeschlagen hast, dass Skycoin für VPN-Verbindungen verwendet werden kann, ist das der größte Anwendungsfall?

Nein. Das ist nur etwas simples an dem wir gearbeitet haben. Es ist bei weitem nicht der größte Anwendungsfall.
80% des Internetstraffic zur Zeit ist bedingt durch Bitorrent und diese Bitorrent-Seiten werden systematisch abgeschaltet und aus dem Internet vertrieben. Sie werden nicht verschwinden aber untertauchen. 'What.cd' (die größte Musiksuche, mit 800k Mitgliedern) wurde zuletzt abgeschaltet, bakabt (größte Animesuche) hat die Registrierung geschlossen, Nyantorrent etc...
Community mit Mitgliedern in Millionenhöhe werden vom Clearnet (das existierende kommerzielle Shit-Net) zum "neuen Internet" migrieren. Wir werden die Migration von Millionen von Leuten beobachten, ganze Communities von Millionen von Leuten.

**arc-over-water**
Seid ihr ein Unternehmen, eine Stiftung oder eine Charity? Registriert? Ich bin mir nicht sicher etwas gelesen zu haben, wer ihr seid? Wie groß ist die Teamgröße? Hintergründe? - Maidsafe ist offen und transparent, genau wie IOTA und Stellar etc. Kannst du uns wissen lassen, wer du und dein Team seid? Gerade deshalb, weil du von 15 Jahren und mehr an Verpflichtungen sprichst...

**techbytes**
Müssen wir Skycoin besitzen um Skywire-Knoten oder Konsensus-Knoten, wie Masterknoten bei anderen Coins, laufen zu lassen?

**synth**

> Maidsafe arbeitet seit über 10 Jahren an dem Neudesign des Internets, was macht ihr gleich und was sind die Unterschiede?

Maidsafe ist aktuell in der zweiten oder dritten Version. Maidsafe wird keinen richtigen Coin bis zur neunten Version haben. Jede Version kostet sie in etwa zwei oder drei Jahre. Bei der Geschwindigkeit wird Maidsafe für die nächsten 18 Jahre nicht "fertig" werden.
Skycoin ist seit ~6 Jahren in der Entwicklung, das vermaschte Netz seit 4 Jahren und wird in einigen Monaten fertig sein. Bis zu dem Punkt, dass Leute es tatsächlich verwenden können.
Skycoin ist in der Zielsetzung Maidsafe ähnlich, hat aber einen anderen Ansatz, andere Architektur und andere Primitive. Wir haben nicht versucht alles zu tun, sondern haben uns auf ein kleines Gebiet, ein nachverfolgbaren Kern fokussiert und diesen fertiggestellt.
Es wird in diesem Gebiet mehrere Projekte geben, aber nur wenige Teams sind dazu fähig, den notwendigen Zeitplan zu schaffen um ein neues Internet aufzubauen, oder um die Komponenten eines Systems dieser Größe zu designen, oder um herauszufinden wie man es umsetzen kann, sodass es in jeder Phase seiner Konstruktion einen Nutzen bereitstellt, in einem Projekt, dass ein Jahrzehnt zur Umsetzung benötigen könnte. (Bearbeitet)

**mike**
Kannst du einen Weg sehen, wie Ark und Skycoin aufeinander, in einer synergistischen Art, aufbauen können? Ich bin absolut dafür, das Rad nicht neu zu erfinden, besonders wenn es mit etwas wie Skycoin ersetzt werden soll.
Im Grunde genommen sehe ich Skycoin als Ersetzung des TCP/IP, sowie der Bereitstellung von Mesh-Netzwerk-Funktionaltität auf Hardwareebene. Ark würde darüber als eine Art Top-Anwendungsschicht laufen.

**arc-over-water**
Bist auf dem Stand der Dinge bezüglich Maidsafe, sie sind fast aus der Alpha draußen und es sieht mehr so aus, als ob sie zu Beginn des nächsten Jahres releasen würden? Im gleichen Zuge sagt Maidsafe, dass es wie ein Virus oder eine Art autonome artifizielle Intelligenz, Tau Chain ebenso, sowie HunterMinerCrafter - sind wir auf dem Wege zu einer artifiziellen Intelligenz mit Maid, Sky, Tau und Autonomic?

**dr10**
Smartbridge, sofort! :kappa:

**mike**
Skycoin würde also also eine Art dezentral globaler Cloudserver sein, auf den man aufbauen könnte.
Um zu kommunizieren ist es mehr so, als ob man verschlüsselte Dateien zu ausgewählten Rezipienten sendet, als dass man Nachrichten verschickt, oder Seiten auf einem spezifischen Server hostet.

**synth**

> Seid ihr ein Unternehmen, eine Wohltätigkeitsorganisation oder eine Stiftung? Ich bin mir nicht sicher ob ich etwas darüber gelesen habe wer ihr seid ? Wie groß ist die Entwicklerteamgröße? Hintergründe?

Ich denke es gibt über ~60 Leute, welche an Skycoin mitgearbeitet haben, oder wesentliche Beiträge geleistet haben. Es ist regelrecht ein Projekt, dass aus dem Darknet stammt.
Viele der Mitwirkenden sind anonym. Einige von ihnen unterliegen verschiedenen Sicherheitsfreigaben und waren im industriellen, militärischen Komplex tätig, einer von ihnen hat am 'San Diego Naval Defence Research Lab' gearbeitet und viele der Ideen für die Netzwerkprotokolle stammen aus dem öffentlichen Sektor der akademischen Forschung, welche auch durch diesen finanziert worden sind.
Wir haben also einige der sehr frühen Bitcoin-Leute, hardcore-crypto Leute, welche aus der Zeit der Bitcoinentwicklung und der Ethereum-Kern-Entwicklung stammen, etc...
Auf der chinesischen Seite haben wir frühzeitige Investoren, einer in Alibaba und einer in Telecom. Zudem haben wir ein Pilot-Projekt mit einem chinesischen Luftfahrtkonzern, welche vier öffentlich gehandelte Fluggesellschaften besitzt und scheinbar jetzt auch Sinopec, welches das zweitgrößte, öffentlich gehandelte Unternehmen auf der Welt ist.
Darüber hinaus sind Leute aus der 'United States Intelligence Community' an Bord, sowie aus der 'Israeli Intelligence Community', welche eine Art Geldwäsche betreiben oder eine andere Art psychologischer Untergrundoperation und aus irgendeinem Grunde aufgetaucht sind. Diese Gruppe ist sehr interessiert an den 'Anwendungen' dieser Coins und wie man Transaktionsprivatsshpäre verbessern kann, sowie der Spezifikation der CoinJoin-Protokoll-Implementierung.
Wir haben viele Ratschläge & Anforderungen von Leuten, die im 'forensic Accounting' (forensische Buchhaltung) tätig sind, erhalten und sie haben uns mitgeteilt, inwiefern Bitcoin unzureichend ist in der Form, dass Metadaten preisgegeben werden.
Außerdem gibt es einige Doktoranden, welche Forschung in der Richtung der verteilten Datenbankenkonsensusalgorithmen betreiben und eine andere Gruppe forscht an Programmiersprachen.
Dazu kommen viele Leute aus den Tiefen des Darknet, anonyme Personen, Frog, Twitter und Cypherpunk sowie aus der Bittorrent-Community (sollte man eigentlich als zwei separate Gruppen aufgezählen). Nicht zu vergessen die Leute aus der russischen Darknet-Community. Wir haben ungefähr acht Ivans. (bearbeitet.)

> Im Grunde genommen sehe ich Skycoin als Ersetzung des TCP/IP, sowie der Bereitstellung von Mesh-Netzwerk-Funktionaltität auf Hardwareebene. Ark würde darüber als eine Art Top-Anwendungsschicht laufen.

Ja. Die Kernfunktionalität sind zwei Dinge - Verbindung von Leuten via öffentlichem Schlüssel (public key networking) - Verteilen von sich selbstvalidierenden, unveränderbaren Daten von Peer-to-Peer (Transaktionen, Blöcke, etc... Inhaltsadressierbarer Speicher).
Man kann fast alles auf diesen beiden Blöcken bilden. Das ganze Internet wird schlussendlich, aufgebaut auf diesen Primitiven, neugeschrieben werden und die bisher exisitierenden Protokolle ersetzen.

**arc-over-water**
Wer ist die Organisation die das alles finanziert? Ich glaube ihr habt zwei ICOs gemacht? Wie viel habt ihr erhalten? Es wurden 6 Millionen Coins freigegeben und die Erste war bei 10ct pro Coin angesetzt und die Zweite bei 50ct pro Coin, stimmt das?

**samuelvihollandia**
Plant ihr in nächster Zeit auf weiteren Exchange-Seiten gelistet zu werden?

**arc-over-water**
Bist du persönlich in Skycoin von Anfang an involviert gewesen? Wieviel besitzen die Mitglieder/Entwickler? Wer alloziiert die ICO-Geldmenge etc... Ich hoffe du verstehst, dass die Dezentralisierung von Investitionen ein zweiseitiges Schwert ist, wir investieren in Leute, können diese aber nicht kennen... also... fragen wir. (bearbeitet)

**thrice.pi**
Mit all diesen außenstehenden Parteien, die helfen Skycoin zu schreiben und es an den Punkt, an dem es heute ist zu bringen, wer ist der Kern des Teams und wer wird helfen all diese coolen Funktionen am laufen zu halten? Werden diese außenstehenden Parteien langfristig hinzugezogen werden?

**synth**

> Wer ist die Organisation die das finanziert? Ich glaube ihr habt zwei ICOs gemacht? Wie viel habt ihr erhalten? Es wurden 6 Millionen Coins freigegeben und die Erste war bei 10ct pro Coin angesetzt und die Zweite bei 50ct pro Coin, stimmt das?

Die Leute, die das Projekt für die ersten vier Jahre finanziert haben, waren frühzeitige Bitcoin-Leute und sehr überzeugte Crypto-Leute, welche unglücklich darüber waren, dass Bitcoin und die anderen Altcoins die Probleme nicht ernstnahmen. Sie haben uns über 1200 Bitcoin im Laufe der Jahre gegeben und wollten nichts als Gegenleistung sehen.

Die ursprünglichen Skycoin-Entwickler haben akademische Forschung betrieben bezüglich der Architektur von neuen Algorithmen. Protoypen und Simulation. Die spätere Stufe waren mehr Projektmanager und Leute, die die Implementierung vollführt haben.
Wir haben vier ICOs mit kleineren Mengen durchgeführt um die Entwicklung zu finanzieren und um den Entwicklern, die an dem Projekt arbeiten, die Möglichkeit zu geben sich einzukaufen.
Ich erinnere mich, dass die erste ICO bei $0.10 pro Coin war und der Preis jetzt ist in etwa $4.00 pro Coin, also ist der Kurs etwa ~35x oder 40x gestiegen, aber wenn man bedenkt, dass der Preis von Bitcoin von $100 zu $3000 gestiegen ist, ist die Zunahme nicht so groß. Lol. (bearbeitet)

**arc-over-water**
Mit dem Anstieg des Preises um das 35x in etwa einem Jahr, ist jetzt nicht die Zeit um den Anstieg abzuflachen und eine weitere ICO stattfinden zu lassen? Mit welcher Menge an releasten Coins und mit welcher Methode?

**mike**
Würden Intel Edison, Joule oder Samsung Artik 10 gut als Skywire Wireless-Knoten funktionieren? Sie haben 2Gb-8Gb RAM, 8-64 Gg eMMC Speicher, 802.11 Wireless, bluetooth und einige mit Zigbee?

**synth**

> Bist du persönlich in Skycoin von Anfang an involviert gewesen? Wieviel besitzen die Mitglieder/Entwickler? Wer alloziiert die ICO-Geldmenge etc... Ich hoffe du verstehst, dass die Dezentralisierung von Investitionen ein zweiseitiges Schwert ist, wir investieren in Leute, können diese aber nicht kennen... also... fragen wir.

Ich denke es gab drei verschiedene Gruppen, die innerhalb der ersten drei Jahre verschmolzen sind und ähnliche Zielvorstellungen hatten. Der Code war in verschiedenen Sprachen verfasst. Es gab Python, C-Code und schließlich Golang und der Golang-Code wurde die Basis für den aktuellen Code.
Die Coin-Alloziierung funktioniert auf folgende Art und Weise: Es ist eine einstimmige Zustimmung für den Release von Coins nötig und es muss für einen spezifischen Einsatz sein, es kann also von jedem der Entwickler blockiert werden.

Außerdem gibt es einen Pool an Bitcoin, den die jeweiligen Projektmanager zu verteilen haben. Das Geld ist dazu da, um Entwickler, Lieferanten und Marketing etc. zu bezahlen. Verschiedene Leute tragen unterschiedliche Verantwortlichkeiten. Zudem verfügen wir über Unternehmensförderung und Sponsoring, sowie einige Unternehmen, welche unsere Vollzeit-Entwickler bezahlen etc., was große Erleichterung mit sich bringt.

**arc-over-water**
Silicon Valley hatte kürzlich ein dezentrales Internet auf einem Netzwerk aus Kühlschränken am laufen gehabt? Ich schätze also Smartphones, Smartgadgets, Home-Gadgets etc. könnten Netzwerk-Services anbieten und Sky als Belohnung erhalten?

**mike**
Das Beste, wäre ein völlig frei verfügbares System auf einem Chip für die Knoten, dass öffentlich geprüft wird um eventuelle Hintertüren zu verhindern. Sogar Chip-Designer wissen heutzutage nicht mehr wirklich was sie in ihre Chips packen, da sie einfach aus uneinsichtigem Sortiment, bekannt als IP-Cores, die Chips in das ASIC-Design implementieren.

**synth**

> Mit dem Anstieg des Preises um das 35x in etwa einem Jahr, ist jetzt nicht die Zeit um den Anstieg abzuflachen und eine weitere ICO stattfinden zu lassen? Mit welcher Menge an releasten Coins und mit welcher Methode?

Ich denke der Skycoinpreis hat sich alle 40 Tage verdoppelt, solange ich mich zurückerinnern kann. Wie auch immer, es wird trotzdem Jahre brauchen bevor er in den Top20 sein wird, es ist ein langer Aufstieg. Bitcoin hat Jahre gebraucht um von 0 zu $1 zu kommen, obwohl er mit 1% Wachstum pro Tag für sechs Jahre lang gewachsen ist.

> Das Beste wäre ein völlig frei verfügbares System auf einem Chip für die Knoten, dass öffentlich geprüft wird um eventuelle Hintertüren zu verhindern.

Wir werden ARM verwenden.

**arc-over-water**
IOTA arbeitet ebenso an ihrer eigenen Hardware für Knoten etc. Trinärvorteil ist JINN.

**synth**
Alle Intel und AMD-Systeme haben per remote bedienbare Hintertüren. Sie sind also nicht sicher um große Mengen an Coins zu speichern. Wir haben zudem Alpine-Linux und eine spezielle Version von Linux, die 6MB groß ist und alles nötige besitzt, um unsere Toolchain auszuführen. Es wird keine binären Überbleibsel im Kernel haben oder irgendetwas, was wir nicht direkt aus der Quelle kompilieren können, geben. Es hat kein systemd und kein GLI, aber verwendet MUSL (Standard C-Bibliothek um Betriebsysteme auf Linux-Basis zu betreiben; lizenziert vom MIT). Ebenso verfügt es nicht über OpenSSL.

**mike**
Sieht also so aus, als ob der Samsung Artik 5 und 10 keine Probleme mit dem Ausführen haben werden, da beide ARM basiert sind. 25x35x4mm Paket für den Artik 10, der Artik 5 ist kleiner, besitzt weniger Leistung aber hat zwei separate Antennenschnittstellen, ideal für Meshnetzwerke, welche eine omnidirektionale und eine gerichtete Antenne verwenden.

**earlyarkinvestor**
Wie lässt sich Ark mit Lisk vergleichen?

**synth**
Hat dieses Bild hochgeladen: 1923810435.jpg Füge Kommentar hinzu.

**earlyarkinvestor**
Möchte Lisk nicht ebenso Interoperabilität zwischen Blockchains erreichen?

**synth**
Hat dieses Bild hochgeladen: 1433594905.jpg Füge Kommentar hinzu.

**synth**
Hat dieses Bild hochgeladen: 1432540863.jpg Füge Kommentar hinzu.

**synth**
Hat dieses Bild hochgeladen: 2049465686.jpg Füge Kommentar hinzu.

**mike**
Stark! Sieht aus wie ein ARM basiertes Serverrack. Lass mich wissen wenn du Hilfe damit brauchst. Wie ich sehe, arbeitest du mit solidworks, die habe ich auch am laufen.

**synth**
Das ist der Skycoin-Cluster; er hat 8 CPU Boards; 4 Kerne pro CPU, 2 GB Arbeitsspeicher pro CPU, welche 64 Bit ARM-Prozessoren sind. Nur ein einziges Programm wird auf jedem Board laufen, es ist also Kompartimentierung und eine physische Lücke vorhanden, was dazu führt, dass das Kompromittieren eines einzelnen Systems nicht die Möglichkeit bietet, alle anderen Prozesse auf dem System zu kompromittieren.

**mike**
Schaut nach 2 Ethernet-Ports pro Board aus.

**synth**
Die Hardware hat außerdem nicht die Qualcom-Hintertüren und ist von Haus aus chinesisches Equipment; die Hintertüren sind normalerweise auf Kernelebene, weil sie noch nicht auf Hardwareebene implementiert werden.
Lol.

**mike**
Haben sie SATA-Ports, vielleicht für M.2-Speicher?

**synth**
Wir werden letztendlich einen ARM OpenWrt haben. Dieses Model hat keinen SATA-Anschluss, aber wir eins mit SATA-Anschluss; man könnte bis zu 16 2 TB Platten anschließen, lol und das halbe Piratebay in sein Cluster downloaden (bearbeitet).
Die Skycoin-Infrastruktur ist gruppenbasiert und dafür designt, auf mehr als 300 Computern zu laufen, mit einem "Knoten" vorgeschalten vor jeden Rechner. Entweder ein CXO-Speicherknoten, ein Skywire SDN/Meshnetknoten, ein VPN-Endknotenpunkt, ein Konsensnetzwerkknoten, oder ein Skycoinknoten etc. Wir haben verschiedenste Knoten/Anwendungstypen.
Dies ist also an und für sich schon eine 'Cloud'.
Es ist nicht wie bei StoreJ, wo man andere Leute hat, die die eigenen Sachen speichern; man wird ca. 5 Cluster haben und 300 Rechner und man kann seine eigenen Daten speichern, sein eigenes Internet, seine eigene Hardware. Man muss sich nicht außerhalb seines Netzwerks bewegen.

**mike**
Ich dachte einfach es wäre nett ein Board zu haben mit einem Array von M.2 Sockets um SSDs, ohne die ganzen Kabel, betreiben zu können und um die Busse von der Leiterplatine abzuschirmen.

**synth**
Ja, es wird schlussendlich M.2 geben, diese hier verwenden microSSD als Speicher mit 48MB/s.

**mike**
Irgendeine Preisvorstellung für eure ARM-Boards bezüglich der Menge? Wir überlegen aktuell Intel für Bitseed V3 zu verwenden, aber ARM würde gut sein um dabeizubleiben, besonders wenn eure Boards SATA unterstützen.

**arc-over-water**
Hast du eine generelle Idee, in welcher Reihenfolge die nutzbaren Funkionalitäten veröffentlicht werden? Die erste Veröffentlichung war der Coin und das Wallet, danach die ICOs - kannst du einen Ausblick, evtl mit Daten, geben?

**synth**
Die Boards kosten $30 pro Stück, der SSD-Speicher kostet aktuell mehr als das Board/Arbeitsspeicher/CPU. Das ist gewissermaßen wahnsinnig.

**mike**
Ihr habt also microSSD, was ist die maximale Größe? Wir versenden zur Zeit welche mit 1 TB Festplatten.

**synth**
Mike von Bitseed wird uns dabei helfen; sodass wir die Boards zusammenschließen können und eine maßgeschneiderte Leiterplatine (PCB) erstellen können.

**mike**
Genau dort sind die Kosten versteckt, im Arbeitsspeicher und im eMMC-Speicher. Es ist schwer günstige Boards mit SATA-Anschluss zu finden.

**synth**
Schau dir den Orange Pi an, der Preis steigt um 30% wenn man eine SATA-Anschluss möchte.

**mike**
Ja, das sind sehr schöne Spezifikationen.

**synth**
Ich denke wir werden letztendlich ein Board fertigen, dass eine maßgeschneiderte Leiterplatine (PCB) besitzt und wie ein Bladeserver funktioniert.

**mike**
Ich mag die Samsung Artiks aufgrund der geringen Größe für Dronenrouter, Cubesat/Picosat Möglichkeiten. Aber ich mag die Tatsache, dass ihr viel größere Kontrolle über die Versorgungskette mit euren Boards ausübt.

**synth**
Wir brauchen nur RAM, CPU und einen microSD slot; das ist alles. Wi-Fi und der ganze andere Kram ist nur Mist und Schrott. Wir haben nur Kommunikation, Speicher und Berechnung; sollte also minimalistisch sein.

**mike**
Genau, wir verwenden sehr wenige Ports des pcDuino nano, kein Verwendungszweck für Video, Audio, IR.

**synth**
Es gibt sogar eine frei verfügbare FPGA-Toolchain und ein 1-Instruktion-Rechner(OISC) mit Substraktion oder Sprung sofern es nicht Null ist; wenn man ein RAM und Byte-Array hat kann man die Funktionalität sogar auf diese Stufe herabkompilieren; das ist zwar Trolling, aber zum Signieren von Transaktionen oder ähnlichem, könnte man auf diesem Level agieren.

**mike**
Hast du einen Link zu dem FPGA? Mein Favorit war bisher die ZYNQ 7000 Serie, aber das hier hört sich wesentlich günstiger an.

**synth**
I muss wegen des FPGAs nachfragen.

**mike**
Blue Canyon nutzt den ZYNQ 7000 wegen deren Cubesat-Bus.

**synth**
Ist das die Schulungsfirma in Shanghai?

**thrice.pi**
Ich möchte die Unterhaltung zwischen dir und Mike nicht unterbrechen, denn es ist spannend das Gespräch zu verfolgen.. aber hier ist eine einfache Frage die Mike vorher gestellt hatte und zu der ich keine Antwort gelesen habe. Er fragte wieviel Bandbreite notwendig ist um einen Skycoin-Knoten laufen zu lassen?

**synth**
Wieviel kostet ein Cubesat-Start? 200 für 3 Millionen?

**mike**
Es hat einen Dual-Core ARM mit einem angehängten FPGA, beide analog mit GIO, PWM.

**synth**

> Er fragte wieviel Bandbreite notwendig ist um einen Skycoin-Knoten laufen zu lassen?

Wir versuchen das Level so halten, dass 2 Ghz ARM-Board mit 1 GB RAM dazu fähig ist. Im Idealfall.

**mike**
50K pro 1U Satellit war die Preisrate, aber diese ist mittlerweile stark gefallen.

**synth**
Skycoin ist sehr minimalistisch; Es ist sehr viel schonender in Sachen Ressourcennutzung, als Bitcoin oder Ethereum; Die Bandbreitennutzung ist geringer als 10Kb/s
*10 KB/s

**thrice.pi**
Dankeschön.. Ja es klingt nicht nach sehr viel..danke für deine Antwort @synth. Vielleicht habe ich diese Antwort überlesen, aber wann soll die nächste ICO stattfinden?

**mike**
Die aktuelle Bitseed V2 kann es also ohne Probleme laufen lassen, das ist ein Dual-Core ARM mit 1GB RAM, 1G Ethernet und SATA-Schnittstelle, 4GB eMMC auf dem Board.

**synth**
Die nächste ICO ist nur ein Marketingevent, aber es müsste der 20te Juli sein glaube ich.
Es ist nur ein kleiner Anlauf, bevor die großen Exchangelistungen geschehen und das Marketing einen PR-Anstoß ausführen wird etc. Oh der Dual-Core ARM kann Bitcoin und Ethereum laufen lassen; Das ist fantastisch; Ethereum sollte der CPU-Vielfraß sein.

**thrice.pi**
Wie lange wird sie andauern?

**michaelthecryptoguy**
Techbytes hatte eine gute Frage >>>>> Müssen wir Skycoin besitzen um Skywire-Knoten oder Konsensus-Knoten, wie Masterknoten bei anderen Coins, laufen zu lassen?

**synth**

> Müssen wir Skycoin besitzen um Skywire-Knoten oder Konsensus-Knoten, wie Masterknoten bei anderen Coins, laufen zu lassen?

Nein. Wir wollen eine Art Freemium-Sache haben. Wenn man keine Coins bezahlt, wird der Knoten 20% der Bandbreite für diese freie Stufe alloziieren. Wenn man bezahlt, kann man Verzögerungen ausschließen und man erhält viel bessere Geschwindigkeit und Service, aber wir wollen nicht, dass Leute nicht die Möglichkeit haben einen Service zu nutzen, nur weil sie keine Coins im Wallet haben.
Wir müssen allerdings die Ressourcennutzung der Freemiumstufe limitieren, sodass das nicht außer Kontrolle gerät und das Netzwerk blockiert.

**michaelthecryptoguy**
:excellent:

**thrice.pi**
@synth die ICO im Juli für Marketingzwecke die du erwähnt hast.. bezieht sich das auf das, auf was Mike sich bezogen hat als er fragte "Wird Skycoin den Subventionsplan für das Einrichten und Registrieren der Mesh-Knoten, wie ursprünglich geplant, beibehalten?"(bearbeitet)

**synth**
Es ist einfacher Leute ins Netzwerk zu bekommen, wenn sie nichts tun müssen; Sie werden den Rest später herausfinden, wie man es optimieren kann, wie man ein 32-Knoten-Cluster aufsetzt und Coins reinlädt und wie man Linux und CLI nutzt, sie werden Mini-Barone werden mit 10Gbps Uplink und physischen Kabeln zu ihren Nachbarn und WiFi-Knoten auf ihren Dächern etc, lol.

**thrice.pi**
lol

**mike**
Sieht so aus als würdet ihr den Orange Pi PC nutzen, einer der Anschlüsse ist USB, der andere Internet. http://www.orangepi.org/orangepipc/. Das sind nette Karten. orangepi.org orange pi pc - Orangepi

**synth**
Schlussendlich, wenn man 40Ghz und gerichtete Antennen hat, Satelliten oder Drohnen machen Sinn für Langstreckenkommunikation oder Vermittlung von Traffic zwischen Städten. Ich glaube, wenn wir das zum Laufen bekommen, werden die "Miner" und Hardware-Innovationen verrückt sein.
Wir haben ein Mitglied, der seine Doktorarbeit über gedruckte Phased-Array und Fraktalantennen mit organischem semi-leitender Druckerfarbe schreibt und er will sogar schon Firmen gründen, die Antennen für die Skycoin "Mining" Hardware produzieren; aber die Software benötigt noch einiges an Arbeit, bevor wir diese Art Wahnsinn starten können.

**mike**
Genau darauf haben wir mit Bitseed gewartet, BTC-Komplettknoten in mittlerer Zeit laufen lassen.

**thrice.pi**
Es scheint so, als wäre Skycoin ein höllischer Coin.. aber es könnte für den alltäglichen User schwer sein, das Ganze zu begreifen.. Denkst du es gibt Potential für etwas wie Ark, dass als eine Art Gateway zu Skycoin fungieren könnte.. sodass der alltägliche Nutzer etwas einfaches wie das Ark-Netzwerk nutzen könnte, um zu etwas umfassenderen, komplexeren und revolutionäreren wie Skycoin anzuschließen? @synth (bearbeitet)

**synth**
Ich werde euch die "Baupläne" geben, sodass ihr diese selbst in Massen produzieren könnt; wir haben keine Fabrik und sogar der Zusammenbau von 30 Einheiten auf einmal ist für uns schwierig.

**thrice.pi**
Entschuldigung falls das schon besprochen wurde.. ich habe vielleicht geblinzelt und es verpasst mit all diesen großartigen Fragen. (bearbeitet)

**mike**
Diese Antennen können mit Graphendruckertinte gedruckt werden, haben über 200 dB Stärke in einem cubesat-kompatiblen Format, wenn es richtig gemacht wird.

**michaelthecryptoguy**
Das würde wirklich helfen :dancing:, Leute in Dritte-Welt-Ländern in :sun: (selbst :this:owned) finanzielle Services und Kommunikationsfirmen zu verwandeln  :bananadance::goodjob: :hadouken:. Jetzt müssen wir nur noch einen Weg finden, ihnen ein Smartphone zukommen zu lassen :partysaurus::tophat:. (bearbeitet)

**mike**
Würde das sehr gerne tun, vielleicht mit einer Art Paket herauskommen, dass viel weniger Zeit braucht es aufzusetzen bei geringeren Kosten. Obwohl Makerbeam cool ist...
Das war die Intention, stationäre Knoten mit Speicher zu haben und frei verfügbare modulare Mobile mit mesh-netzwerk, welche globale Reichweite erreichen mit sicherem, verschlüsseltem Networking.

**synth**
Genau, stationäre, denn mobile Knoten verursachen eine Menge Probleme.
Skywire funktioniert nur, weil es dafür designt ist von Punkt-zu-Punkt Segmenten zu laufen und nicht für "mobiles ad hoc Networking", bei dem die Leute sich umherbewegen.

**arc-over-water**
Habt ihr ein einfaches Produkt veröffentlicht? Stimmt es, dass aktuell nur das Wallet draußen ist?

**mike**
Die Routingtabellen aktualisieren sich also nicht so oft?

**synth**
https://github.com/skycoin hat eine Menge verschiedener Anwendungen.
https://github.com/skycoin/bbs funktioniert in diesem Moment.
Die Routingtabellen ändern sich nur bei einer neuen Verbindung; man hat also ~10 Verbindungen zu einem öffentlichen Schlüssel und falls einige ausfallen kreiert man neue. Es gibt also Redundanz in den Pfaden und der Durchgangsmethode. "Vielfältigkeitsrouting".
Wohingegen die direkten Verbindungen zwischen Knoten sich in einer geringeren Frequenz ändern sollen, nicht öfter als alle 10 Sekunden. Im Idealfall niemals verändert. Jede Änderung der zugrundeliegenden physischen Verbindung, resultiert in einer Aktualisierungskaskade und verändert die Netzwerkstruktur (sollte minimiert werden).
Wohingegen Verbindungsverlust oder Verbindungsherstellung die Netzwerkstruktur nicht verändern und keinen administrativen Mehraufwand in Sachen Bandbreite verursachen.
Kurzstrecke, mobiles ad hoc Routing muss von einem anderen Protokoll wie BATMAN behandelt werden, während feste Infrastruktur wie WiFi-Hotspots, Fiber zwischen Städten, Ethernet-Kabel etc. von den Skywire-Sachen behandelt wird; wenn man also einen Coffee-Shop betritt und dort 30 Minuten verbleibt, dann hat man kein Problem; wenn man aber die Straße herunterfährt und alle fünf Sekunden zu einem anderen Hotspot verbindet, dann hat man eins. Es ist nicht dafür designt, das zu behandeln und es wird eine weitere Protokollschicht benötigt, um "mobil" zu behandeln.

**mike**
Knoten können sich also Bewegen, falls die Übertragung nicht unterbrochen wird, wie eine Beamforming-Antenne, die solange sendet, wie die Beams schnell genug bewegt werden können, ohne das die Kommunikation abbricht.

**mike**
Knoten können sich also Bewegen, falls die Übertragung nicht unterbrochen wird, wie eine Beamforming-Antenne, die solange sendet, wie die Beams schnell genug bewegt werden können, ohne das die Kommunikation abbricht.
Update, sie funktionieren sogar mit geringen Unterbrechungen normal.
Macht auch Sinn, funktioniert mit kleinen Mobilfunkmasten und Access-Points, Mobil ist ein anderes Protokoll, wenn es von Handymast zu Handymast springt.

**synth**
Genau, Phased-Array wäre in Ordnung; sogar wenn das Singal für einige Sekunden unterbrochen werden würde, oder auch, wenn das Signal für Stunden ausfallen würde und wieder ankommen würde.
Fundamentale Änderungen der Netzwerkstruktur sind lästiger, weil jeder, der am Routing durch das Netzwerk beteiligt ist, informiert werden muss; man muss also tatsächlich Aktualisierungen Peer-zu-Peer durchführen, mittels CXO; letztendlich muss das Netzwerk segmentiert werden, sodass jeder Knoten zu einer oder mehreren Routing/Abonnement-Domain gehört, welche in einer vernünfigen Weise separiert sind - im aktuellen Internet kann die Anzahl der Hops zwischen zwei Personen ~40 bis zu 80 oder irgend so einer irren Zahl sein; in Skycoin wird es 4 oder maximal 7 Hops sein etc., von Haus zur Nachbarschaft, zur Stadt, zu Stadt/Land und dann zum Ziel. Es wird nicht wie 40 Hops erscheinen, welche jeweils ihre eigene Stauuung erfahren können.
Die Vorteile eines Phased-Array sind, dass man es einfach auf sein Dach werfen kann und es scannt nach allen, mit denen es verbinden kann; dann kann man zu verschiedenen Personen, oder der besten Person, verbinden, ohne auf das Dach klettern zu müssen und alles zu justieren; der Beam-Fokus wird per Software kontrolliert.
Ich mag das BBS und VPN, weil wir kein neues physisches Internet bauen müssen um sie laufen zu lassen; wir können einfach über das exisitierende Internet tunneln und es ist verwendbar. Es wird Jahre dauern, bevor wir eine Hardware-Alternative zu dem aktuellen Internet sehen werden. Selbst wenn die Leute 100.000 Knoten pro Monat installieren würden und es eine Wachstumsrate von 1% pro Tag geben würde, dauerte es immernoch 10 oder 15 Jahre bis es das gesamte Netz ersetzen könnte.
Es ist einfach so viel Equipment installiert und auch mit massiver Wachstumsrate, dauert es ewig.

**mike**
Genau, das ist auch das, was mich anspricht, es ist viel einfacher ein automatisches Setup zu haben, als dass man die Antennen ausrichten muss, auch besser als motorisierte Richtungssteuerung.
Habe darüber nachgedacht tiefe Frequenzen für Knoten zu verwenden, um GPS-Koordinaten zu senden, für die gegenseitige zu Lokalisierung und um die höchst mögliche Frequenzrate, die zur gegenseitigen Verbindung möglich ist, anzuwenden.

**synth**
Das VPN wird eine große Anwendung sein; Hardware-VPN, VPN für das gesamte Haus; man steckt es ein und es liefert einen VPN-Service für das gesamte Haus und alle seine Verbindungen.
Die Internetdienstanbieter (ISP) haben die Erlaubnis, alle Daten die sie sammeln zu verkaufen.
Man kann sogar damit beginnen, die IP-Addressen von Werbeservern und Trackingservern zu blockieren und so weiter; verschiedene VPN-Auflösungspunkte für jedes Gerät im LAN und man wird die Möglichkeit haben, diese zu automatisch zu rotieren.
Geschehen wird folgendes: Alle Torrent-Seiten und Communities werden untertauchen; und wenn das geschieht, werden die Downloads schließlich blockiert oder verlangsamt durch die IDAs werden und man wird ein "neues Internet" brauchen, um eine Vielzahl der aktuell verfügbaren Inhalte zu erhalten.
Vor fünf Jahren gab es noch keinen Grund dies zu tun. Heutzutage zeigen sich Intentionen, welche die Leute zu etwas neuem drängen werden.
Eine andere Sache ist, dass Reddit von Bots überrannt wurde; sie kontrollieren alle Upvotes und die Inhalte jetzt. Unternehmen haben Twitter und Facebook total übernommen und unterminiert.
Die Leute werden nach dezentralen Plattformen Ausschau halten und es wird eine mächtige Bewegung zu diesen Plattformen geben, welche das Botmanipulierungsproblem lösen können, das Shilling-Problem und das Problem der Unternehmen, die sich mittels kommerziellen Geldströmen kaufen lassen.
Es wird also Versuche geben, dezentrale Twitters und Facebooks aufzubauen, aber vor fünf Jahren war das noch nicht notwendig; jetzt sind die Leute fähig dazu zu wechseln und die Technologie ist bereit.
Das Skycoin-Projekt baut die Substanz auf, die Communities bilden ihre eigenen Projekte. Wir geben ihnen nur die Mittel und Wege.

**mike**
Exakt, zum Beispiel hat Twitter meine Registrierungsemail öffentlich gemacht, ohne mich zu informieren und ich wurde aus dem Nichts plötzlich zugespammt; schlussendlich habe ich es herausgefunden, als ich auf Twitter gegangen bin, um nicht mehrfache Datenschutzerklärungen zu erhalten.
Ich würde Skycoin sehr gerne mit Ark überbrücken, sodass Ark aufgesetzt auf dieses VPN läuft und der Vorteil ist, dass euer VPN vertrauenslos funktioniert, oder wesentlich dezentralisierter als sich auf einen einzelnen VPN-Provider zu verlassen, der alleine zu 100% auf Vertrauensbasis handelt.

**xano**
Wie glaubst du, wird das unfassbare Potential für illegale Aktivitäten, die Zukunft von Skycoin und der Massenadoption beeinflussen?

**charles**
Ich verstehe nicht so ganz, wie Skycoin das Bot-Problem auf Reddit löst?

**xano**
Fast jeder liebt kostenlose Filme, Serien und Musik, aber was wenn z.B. ISIS beginnt dies zu nutzen.

**synth**
Erstmal zu Twitter; Im Fall der Wahlkampagne von Hillary Clinton wurde Twitter Geld gegen "Markenmanagement" bezahlt und wenn 300 Leute denen man folgte, etwas negatives über sie geschrieben haben, dann hat man keinen ihrer Tweets gelesen. Sobald aber eine der 4000 Personen, die mal etwas positives geschrieben hat, einen Tweet verfasst hat, dann hat man diesen Tweet sofort in seinem Feed gesehen.
Die Unternehmen kontrollieren was die Leute sehen und welche Informationen in ihren Feeds erlaubt sind. Es ist nicht mehr natürlich. Es ist nicht mehr basierend auf Präferenzen. Es basiert darauf, die Plattform für Werbetreibende sympathisch zu machen, welche ihr Geld abziehen könnten.
Sie treiben ihre sozialen Agendas voran und zwingen die Firmen, denen sie Geld geben, bestimmte Personen und Bewegungen aktiv zu zensieren, oder sie behalten ihr Geld ein.
Sogar Google ist dazu gezwungen diesen Anforderungen zu gehorchen. Fortune 500 hat 700 Millionen/Jahr in Werbeeinnahmen zurückgezogen und dann hat Google zugestimmt, die Suchergebnisse den Wünschen der Werbetreibenden anzupassen. Gleichzeitig bedrohen sie sie mit Strafgeldern, wenn sie nicht mit den Regierungen und den Unternehmen zusammenarbeiten.
Dezentralisierte soziale Medien bedeuten, dass man selbst Herr über seine eigenen Daten ist. Es bedeutet, dass man seinen eigenen Rechner kontrolliert, die Algorithmen die den Feed sortieren und priorisieren. Anstatt zu erlauben, dass der Feed von einer Dritt-Partei kontrolliert und manipuliert wird, welche meist nur eine Geldhure ist, die versucht die Geldstrafen der EU zu umgehen, die unterwürfig zensiert, wenn die Soap-Unternehmen damit drohen ihr Werbegeld abzuziehen.
Ja, ARK könnte das Skycoin-Netzwerk für Block und Transaktionsverteilung verwenden, ebenso wie es das Netzwerk für networking verwenden könnte, um Blockierungen zu umgehen.
ARK könnte als Knoten im selben Framework wie Skycoin eingesetzt werden, innerhalb der Skycoin-Cluster. Es gibt https://github.com/skycoin/viscript und wir können ARK dort hinzufügen. Es gibt eine cross-plattform CLI und auf lange Sicht ein Anwendungsstarter und Clustermanagement.

**mike**
Danke! Das werde ich unseren Entwicklern senden. Wir haben und fügen aktuell viele APIs und CLIs für verschiedenste Sprachen hinzu.

**synth**

> Ich verstehe nicht so ganz wie Skycoin das Bot-Problem auf Reddit löst?

Es ist außerhalb des Skycoin-Projekts, aber die Leute, welche das BBS aufbauen haben einen sehr coolen Filteralgorithmus. Jeder wird mit seinem öffentlichen Schlüssel identifiziert und so bildet sich eine Art Netz des Vertrauens (web of trust). Es ist wie eine Art Rang auf einer bestimmten Seite. Es ist eine dezentrale Art der Moderation, es läuft automatisch. Ist ARK in Golang geschrieben?

**jarunik**
Die ARK-Chain ist in Javascript, aber wir haben eine Golang-API.

**arc-over-water**
Warum sollte man Golang Rust oder Scala vorziehen?

**mike**
Der ARK-Kern ist in Node.js geschrieben, könnte portiert werden. Es wird eine Go API/CLI geschrieben, von @chris denke ich.

**arc-over-water**
Wann wird es eine Lispcoin-Plattform geben :slightly_smiling_face: ?

**mike**
Golang ist fertig? Klasse!

**boldninja**
https://github.com/ArkEcosystem/ark-go GitHub ArkEcosystem/ark-go ark-go - Ark GO client für ARK.io blockchain Ökosystem #golang #ark #blockchain

**mike**
Lisp - das wäre ein Spaß! Bin immernoch davon fasziniert, dass es Lisp immernoch gibt, aber klar - es ist beliebt für Anwendungen des maschinelles Lernens. Ja, wir sollten Lisp hinzugefügen, kannst du das machen arc-over-water?
Lisp scheint eine gute Funktion für parallele Prozesse zu haben, aber die Details kenne ich selbst nicht.

**arc-over-water**
Nun ja, es gibt Shen.. http://shenlanguage.org/.

**synth**

> Wie glaubst du, wird das unfassbare Potential für illegale Aktivitäten, die Zukunft von Skycoin und der Massenadoption beeinflussen?

Die Drogenhändler werden Skycoin lieben. Bitcoin war wertlos, bis die Leute herausgefunden haben, dass sie damit Drogen verkaufen können, dann erst wurde es zu Geld und ist von $0.01 zu $1000 innerhalb eines Jahres gestiegen.
Als das Internet erschaffen wurde war das Erste, was die Leute taten, Pornos herunterzuladen. Als Bitcoin erschaffen wurde war das Erste was die Leute taten, Drogen und Waffen zu kaufen.
ISIS benötigt Skycoin nicht, sie verwenden XBOX-Messenger und Facebook-Messenger. Sie brauchen Crypto nicht. Jeder terroristische Akt bedeutet ein Erhöhen der Budgets, deshalb liebt die Regierung ISIS. Terrorismus ist eine Wirtschaftskraft und je mehr Terror, umso mehr Geld ist dort zu holen. Die Leute machen zuviel Geld durch ISIS, als dass sie das Problem in nächster Zeit beseitigen werden.
Die Pädophilen waren ebenso die Ersten, welche Stenografie, i2p, Tor, Tails und Bitmessage adaptiert haben. Das sind stets die Ersten, welche den neuen kryptographischen Kram ausprobieren. Man sollte auf die Logos der Stenografie-Apps schauen und man kann raten, welche Art von Leuten diese Art Anwendung geschrieben hat.
Sogar zwei Jahre bevor Skycoin begann, hatten die Geheimdienste und Geldwäscher bereits ihre Anforderungen abgegeben, um Metadaten wegzuscheuern oder zu verstecken.
Wenn ich die nächste Silk Road aufbauen würde, dann würde ich auf Technologie wie Skycoin setzen. Ich denke jeder hatte diese Idee bereits.
Wir können nicht wirklich kontrollieren was die Leute mit all den Sachen anstellen werden. Es ist ein unausweichlicher Prozess und es wird passieren, ob wir es tun oder andere, wie Maidsafe. Es wird stattfinden. (bearbeitet)

**mike**
Schaut interessant aus. Kennst du Julia, https://julialang.org/ ? Bin sehr beeindruckt von den Benchmarks, vergleichbar zu Go denke ich. Die beste Art Terrorismus zu beenden ist, ausländische Interventionen zu beenden. Mein letzter Wissensstand war, dass die Schweiz kein Problem mit Terroristen hat.

**arc-over-water**
Killary and Obomba

**michaelthecryptoguy**
Traurig aber wahr.

**mike**
Und dann die Bushs.

**synth**
Hat dieses Bild hochgeladen: Screenshot from 2017-06-29 14:42:25.png Füge Kommentar hinzu.

**synth**
Hat dieses Bild hochgeladen: Screenshot from 2017-06-29 14:41:55.png Füge Kommentar hinzu.

**arc-over-water**
Fake News auf einem erstaunlichen Level... Sandy Hook... 911
Mondlandung... Stephen Hawking...
wie auch immer..

**charles**
Nord-Korea hat ebenso kein Problem mit Terrorismus :)

**arc-over-water**
Sky! ist das Limit.

**mike**
Man muss nichtmal auf dieses Level absteigen, schon allein die aktuelle Farce über das russische Eingreifen der Wahlen und die angebliche Verbindung zu Mitgliedern aus dem Team Trump. Krieg ist die Gesundheit eines Geschäftslandes.

**synth**
Terroristische Attacken sind jetzt Werbeevents für Nike; sie kämpfen darüber, wer die Produktplazierung in der nächsten ISIS-Attacke bekommt. Es hält die Leute vor ihren Fernsehern und sonst würden die Leute die Nachrichten nicht ansehen. Sogar Terroristenattacken halten die Leute vor ihren Fernsehern und die Fortune 500 streiten darüber, wer den Werbesport für diese Leute vor ihren Fernsehern bekommt.
Die Regierungen und Unternehmen laufen ein, wie Haie mit ihrer letzten "Überwachungs"-Rechnung, um der Regierung die Möglichkeit zu geben, für Milliarden von Dollar nutzloses Equipment zu kaufen. Die Regierungsbehörden hetzen alle danach die Presse zu beeinflussen und ihr Budget aufgestockt zu bekommen.
Es ist einfach nur Irrsinn. Sie denken nur ans Geld.

**mike**
Es wäre sehr unvorteilhaft die Beziehungen mit Russland zu verbessern, für jene, welche Geld und Macht mit eskalierenden globalen Spannungen machen.

**arc-over-water**
War nicht erste Hauptskandal einer Attacke an Trump, dass er "etwas" auf eine Prostituierte in Russland ausgeschieden hat? OMG

**synth**
Sie haben Erdölfirmen und Russland produziert Öl; also möchten sie jede mögliche Ausrede für "Sanktionen", um die Leute dazu zu zwingen ihr Öl zu kaufen, anstatt das russische Öl. Sie würden einen Krieg beginnen, nur um eine russische Ölpipeline nach Europa zu verhindern. Es geht nur ums Geld.

**arc-over-water**
Putin tritt tatsächlich, mit seinen Reden des letzten Jahren, in einige Ärsche.

**synth**
Wenn Russland mir Prostituierte umsonst geben würde, dann würde ich auch auf sie pinkeln, lol. Warum auch nicht? (bearbeitet)

**mike**
Pussygate nicht zu vergessen - die Presse hat den Streifen für über 10 Jahre einbehalten, bis drei Wochen vor den Wahlen, anstatt es vor den Primaries zu veröffentlichen.

**arc-over-water**
Verrückte scheiße da draußen...
Zeit für Crypto zu glänzen...

**xano**
Ich wundere mich nur, wie Services wie Mega enden werden mit etwas wie Skycoin.

**synth**
Das "Y2K" war ebenso eine Ausrede um zweistellige Milliardenbeträge an Dollars für "Upgrades" an Regierungen und Unternehmen abzusetzen. Sie haben ihnen gesagt "gebt uns das Geld, oder der Himmel wird herunterfallen".
Terrorismus ist die gleiche Geschichte, es ist hat sich einfach ein Betrug zum Geldschöpfen entwickelt. 90% des Überwachungsmists ist einfach nur eine Ausrede der Unternehmen, mit Lobbyarbeit die Regierungen dazu zu drängen, überteuertes Equipment zu kaufen, sodass sie Profit schlagen. Sie wissen nichtmal, was sie mit den gesammelten Daten anfangen sollen. Sie tätigen Insider-Trading Marktmanipulation und ein Haufen Mist mit den Daten, aber reagieren panisch, wenn die Leute beginnen HTTPS zu verwenden, weil es für sie dann schwerer ist, auf dieselbe Art weiterhin Geld zu verdienen.

**arc-over-water**
Mega2 ist bereit seinen Prototype vorzuführen.

**synth**
Man hat Mama und Papa, die lokalen Polizeiämter, welche für $150,000 Stingray Handyüberwachungsequipment kaufen auf NSA-Level, welche das eigentlich nicht bezahlen könnten, aber es wird aus den 10 Milliarden DHS "Terror"-Funds finanziert, um nutzloses Equipment für die lokale Polizei zu kaufen. Um "Terrorismus zu bekämpfen". Es ist ein regelrechter Witz.

**arc-over-water**
SKYs Ziele über die nächsten zwei Jahre?
Die Preise der nächsten ICO und wie wird sie veröffentlicht?

**synth**
Die Leute wisen, dass Unternehmen wie Apple und Google obligatorisch dazu veranlagt sind, all ihre Daten der Regierung auszuhändigen. Eingeschlossen der Nachrichten, also warum würde irgendjemand iMessenger oder iCloud verwenden?
Sie kreieren also vorgespielte Events, wie "Polizei kann nicht den 4-stelligen Pin auf einem iPhone knacken, es ist unknackbar", wobei sie das Handy vom Betreiber aus per Trojaner infizieren können und verschiedenste Arten von Sachen machen können, wie verrückte, obligatorische Hintertüren.
Wir sind also auf dem Weg zu einem dezentralisierten Internet mit diesen Apps, weil die Leute es satt sind, wie Tiere ausgespäht zu werden.

**michaelthecryptoguy**
@synth Was ist dein Background? Kannst du mir etwas über deine bisherige Erfahrung, unabhängig des Gebietes geben? (bearbeitet)

**synth**

> SKYs Ziele über die nächsten zwei Jahre?

Das Meshnet zusammen mit dem BBS, den ersten Demo-Apps, dem VPN zum Laufen zu bekommen und es auf mehr Exchanges zu listen. Aufbauen der Community, verbessern des Wallets, aktualisieren der Website, Übersetzungen in weitere Sprachen etc.

**arc-over-water**
Sind die zwei Chinesen, die Wissenschaftler, welche das technische Whitepaper geschrieben, ein Teil des Teams?

**synth**
> @synth Was ist dein Background? Kannst du mir etwas über deine bisherige Erfahrung, unabhängig des Gebietes geben?

Ich habe eine Menge Dinge getan. Videospiele, Hedge-Fond/Finanzwesen, Crypto, Investmentzeug etc... Jetzt bin ich eine Art Projektmanager.

**charles**
Wie wird der Preis der Skycoin für die nächste ICO bestimmt werden, ich vermute es kann nicht überhalb des Marktpreises sein, denn sonst werden die Leute es nicht kaufen, aber zu tief würde den Coin abwerten?

**arc-over-water**
Wollen sie überhaupt einen hohen Preis an diesem Punkt, oder eine gute Verteilung unter den Leuten?

**synth**

> Sind die zwei Chinesen, die Wissenschaftler, welche das technische Whitepaper geschrieben, ein Teil des Teams?

Einer der chinesischen Jungs hat nichts damit zu tun. Er ist ein Professor, der sein Namen auf das Paper seines graduierenden Studentens gesetzt hat. Jetzt möchte der Professor das Paper verstecken, weil er denkt, dass die chinesische Regierung hart mit Bitcoin durchgreifen wird; aber er liegt falsch und die Regierung kümmert es nicht und das Paper ist in Englisch, also können sie es ohnehin nicht lesen.
Der andere Kerl ist ein ETH-Kern-Entwickler. Chen hat am Kern von ETH gearbeitet und hat die Golang-Implementierung von Ethereum geschrieben. Er steht nicht sehr in der Öffentlichkeit und möchte nicht im Spotlight stehen, oder belästigt werden.
Die meisten Mirarbeitenden an Skycoin sind im Hintergrund oder verstecken sich. (bearbeitet)
Viele der ETH-Leute verkaufen sich für Ratgebergremien für verschiedenste Tokens, oder Dutzende von Tokens und ICOs; aber die meisten der ernsthaften Crypto-Leute ist sehr reserviert und bleibt im Hintergrund.
Beziehungsweise sie haben teilweise schon genug Geld und wollen nur versteckt bleiben. Sie sind außerdem faul, weil sie nicht mehr arbeiten müssen, oder sie sind mit anderen Dingen beschäfigt.
Dazu kommt, dass sie Steuern vermeiden wollen oder die Anklage des Diebstahls, wollen also keine Aufmerksamkeit von den Regierungen.
Skycoin kann kein öffentliches "Team" oder "Ratgebergremium" auf der Website haben, weil wir alle gefragt haben und keiner möchte öffentlich bekannt gemacht werden, oder in einer öffentlichen Position stehen...

**arc-over-water**
Exakt, am besten lebt man in einem Land, in der man kein Staatsbürger ist und man verdient Geld aus einem Land, in dem man nicht lebt... Mache das seit 10 Jahren und es ist viel weniger Stress. (bearbeitet)

**synth**
Viele der frühzeitigen Bitcoin-Leute, welche sich öffentlich auf Twitter identifiziert haben, können nicht nach Brasilien, oder in andere bestimmte Länder, ohne das Risiko einzugehen, für Lösegeld gekidnapped zu werden.
lololol.

**arc-over-water**
Vitalic kann vielleicht Kung Fu, vielleicht spricht er ja mit den Chinesen...

**charles**
Glaubst du, dass die fehlende öffentliche Person, die Adoption von Skycoin negativ beeinflussen wird?

**arc-over-water**
Ich denke das hat es... sechs Jahre alt und stille Foren und Slack.

**synth**
Wir können öffentliche Personen kaufen oder ein Beratergremium, aber sie würden nichts mit dem Projekt zu tun haben, außer das sie ihren Namen zum Schaffen von Vertrauen der Öffentlichkeit hergeben; was das ist, was all diese Beratergremien in Wirklichkeit sind.

**arc-over-water**
Im Hintergrund, ich nehme an in der Technologieentwicklung.
Die Preise der nächsten ICO und wie wird sie veröffentlicht werden?
Github ist stets aktiv...

**synth**
Ich weiß wirklich nicht was mit der nächsten ICO ist.

**arc-over-water**
Ok.

**synth**
Sie wird um den 20ten des nächsten Monats sein und es wird 1%-10% der Gesamtmenge an Skycoin sein. Ich bin nicht sicher, ob die exakte Anzahl festgelegt ist, es wird jedoch vermutlich ein fixer Preis sein.

**dr10**
Das ist ein AMA-Marathon :trollbounce: nice!

**arc-over-water**
Wieviel der 100 Millionen sind dem Team zugeteilt und den Leuten, die es finanziert haben?

**synth**
Gefolgt von einer wöchentlichen Auktion oder einer zweiten, bepreiste Auktion für eine feste Menge an Coins, welche für acht Wochen lang jede Woche geschehen wird; bin mir aber nicht sicher wieviele Coins, oder ob es überhaupt stattfinden wird.

**arc-over-water**
Wenn es also zu einem hohen Preis ist, dann die 1%, bei einem geringen könnten es bis zu 10% werden.

**synth**

> Wieviel der 100 Millionen sind dem Team zugeteilt und den Leuten, die es finanziert haben?

Die Leute, welche Skycoin finanziert haben, haben nichts dafür erhalten. Sie haben keinen Anspruch auf die Coins. Sie mussten sich in ICOs einkaufen, wie jeder andere auch. Selbst die Entwickler die daran arbeiten, mussten sich einkaufen.

**arc-over-water**
Ok, also sind sie bereits verschlossen worden nach der 10ct ICO-Runde?

**synth**
Ich denke, dass die nächste ICO zum großen Teil nur ein Marketingevent ist und einfach nur ein "lasst es hinter uns bringen". Wir sind aktuell in einer Blase, also sollten wir Geld beschaffen, bevor die Blase platzt. Das ist das, was einige Leute uns raten.
Wir können nicht 50 Millionen ausgeben, also macht das Verkaufen von einer irren Menge keinen Sinn. 10 bis 15 Millionen ist vermutlich angemessen für die nächsten drei Jahre. Das beinhaltet ein sehr gutes Vollzeit-Marketing-Team und das verdreifachen der Anzahl der Entwickler SOWIE das Finanzieren verschiedener, paralleler Hardware-Projekte.

**mike**
Mein Herangehen an Skycoin ist, dass egal welchen finanziellen Ertrag es auch generieren wird, es ist ein Investment in eine Zukunft, die ich sehen möchte.
Ich sehe außerdem den Einnahmen, durch das Betreiben eines Knotens, entgegen.

**arc-over-water**
Es könnte also sein, dass ihr 10,000,000 Coins für $10,000,000 verkauft, um eure Kosten für die nächsten drei Jahre zu decken?

**charles**
Kann eine Person mit limitierten, technischen Fähigkeiten einen Knoten betreiben?

**arc-over-water**
Oder $20,000,000, je nach dem.

**synth**
Die Leute, welche den Coin nach oben aufpumpen, möchten so schnell als möglich wieder verkaufen. Sie drängen uns sehr dazu das zu tun. Wie auch immer, wenn wir weniger Coins verkaufen, wird der Preis pro Coin höher sein.
Wenn wir nur 10 Millionen Coins verkaufen, wird der Preis viel höher steigen, als wenn wir 500 Millionen verkaufen würden.
Ich denke EOS wird eine Milliarde Dollar zusammenbekommen und ich habe keine Ahnung, was sie mit dem Geld anstellen werden, außer es dazu zu nutzen, EOS zu kaufen und den Preis nach oben zu treiben. Sie werden es nicht für die Entwicklung ausgeben. Lol.

> Kann eine Person mit limitierten technischen Fähigkeiten einen Knoten betreiben?

Schlussendlich, ja. Aktuell vielleicht noch nicht. Nachdem Tutorials zur Verfügung stehen, ja.

**arc-over-water**
EOS scheint zu versuchen leichte Knochen zu haben und nicht so kompliziert wie ETH zu sein...

**mike**
Ich denke es ist klug, eine große Menge für die Verteilung an die Knotenbetreiber zu haben, als eine Art Ersatz für das Mining sowie eine gute Distribution, zudem der Verkauf an einige, welche zwar interessiert sind, aber technisch nicht versiert genug um einen Knoten zu betreiben.

**synth**
> Es könnte also sein, dass ihr 10,000,000 Coins für $10,000,000 verkauft, um eure Kosten für die nächsten drei Jahre zu decken?

Der Preis pro Coin ist irgendwas um die $4 oder fast $5 hoch. Die ICO wird denke ich bei $5 sein. Der Börsenwert hat sich, seit einer ganzen Weile, alle 40 Tage verdoppelt.
10 Millionen Coins bei $5 pro coin sind 50 Millionen.
Um es fair zu gestalten, müssen wir die Coins über die Skywire-Knoten verteilen; ICOs sind kein guter Weg Coins in die Hände der User zu bringen. Sie sind nur gut für das Sammeln von Geld und für Wale.
Wir haben uns entschlossen, die meisten Coins an unsere User zu verteilen und ICO/Verkäufe an Wale nur zu nutzen, um die Entwicklung zu finanzieren.

**arc-over-water**
Es muss doch Wege geben, die 10,000,000 Coins an verschiedene Gruppen zu verteilen?

**synth**
Das Problem ist, dass alle ICOs darin enden, von weniger als 20 Walen aufgekauft zu werden.

**arc-over-water**
Jedes Mitglied eines Altcoin-Slack-Channels bekommt einen Code als Invite. Wenn eine ICO deren Kunden bekannt sind, kann das verhindert werden...

**synth**
Es gibt Leute, welche ein großen Anteil der ETH besitzen und diesen diversifizieren möchten; sie können 20 Millionen in eine ICO werfen und das 50-fache zurückerhalten, aber wenn sie es Verlieren, ist es ein kleiner Verlust; sie haben soviel ETH, dass sie es nichtmal verkaufen oder konvertieren können, ohne den Markt abstürzen zu lassen.

**arc-over-water**
An einem Tag könnte jedes Mitglied eines Altcoin-Slack-Channels eine einmalig genutzte BTC-Addresse bekommen, in die er einen maximalen Betrag einzahlen kann etc...

**synth**
Ja, im Idealfall könnte das funktionieren.
Wir hatten begonnen OTC zu Marktpreisen zu machen; limitiert auf 10 BTC und das hat gut funktioniert.

**arc-over-water**
Tauchen die OTC-Verkäufe in der Blockchain auf? (bearbeitet)

**synth**
Wir haben jedoch einige einzelne Wale, welche 700 BTC auf einmal haben möchten und jeder für sich genommen, ist größer als alle Teilnehmer, die an den OTC-Verkäufen teilgenommen haben.
OTC bedeutet "über die Theke", oder auch Direktverkauf; Wenn die Leute einen Entwickler per privater Nachricht anschreiben und bitten, etwas kaufen zu dürfen.

**arc-over-water**
Alles klar, dann finden Privatverkäufe also statt.

**mike**
Hat dieses Bild hochgeladen und kommentiert: TEC chart.png 1 Kommentar: Hier ist eine Beispielmethode für das Bepreisen nach dem Potenzgesetz, das ich für Ark-basierte Projekt-Token-Exchanges geplant habe, beinhaltet das Finanzieren von Ark/Skycoin basierten Knoten. Je mehr verkauft werden, desto stärker steigt der Preis an, nach dem Potenzgesetz, so können die Leute nach ihrer erwarteten ROI einkaufen, ohne durch FOMO in emotionale Entscheidungen gedrängt zu werden.

**mike**
*irsk=risk
Also der Eintritt an irgendeinem Teil der Kurve sieht genauso aus, wie jeder andere Teil.

**synth**
Hmmm.
Wie funktioniert das?
Je mehr Geld man reinpackt, desto mehr bezahlt man?

**arc-over-water**
Nachdem ihr die OTC-Verkäufe tätigt, sind sie dann hier aufzufinden? http://explorer.skycoin.com/blocks

**mike**
Hier ist ein Link zu der Tabelle, dort sind die Formeln und die Berechnungstabelle für den Graphen, https://docs.google.com/spreadsheets/d/1en9lqzBIuHgp0-Q3ohoq3yJUe1lJcOK9U4bF2TiXZew/edit?usp=sharing
Genau, je mehr man reinschmeißt, desto höher wird der Preis.
Es wird etwas Erfahrung brauchen, um die besten Parameter zu bestimmen, sodass kein abrupter Ausverkauf stattfindet und das Exchange nicht unbegrenzt Hingehalten wird und verschiedene Projekte sind vielleicht am besten für bestimmte Exchange-Raten über eine bestimmte Zeit geeignet.

**synth**
Wir haben aktuell eine sehr gute Strategie.
Wir können Coins an die produzierenden der Top-Inhalte auf dem BBS verteilen.
An Leute des Prämiensystems (wie das Skycoin-Logo, Sticker, Design etc.).
An Leute, die an der Entwicklung mitwirken möchten (Mobiles Wallet etc., einige Feature des BBS sowie Bug-Behebungen).
Dann die kontinuierliche, lang andauernde Distribution an die Leute, die die Skywire-Knoten betreiben.
Ebenso die Distribution an Knoten, welche Inhalte des CXO hosten.
Dann die Distribution an Leute, die auf unsere Plattform kommen und Communities mit Millionen von Nutzern mitbringen (wir sind seit Jahren mit diesen Leuten im Gespräch und sie haben keine richtigen Entwickler, also müssen wir ihnen helfen; sie haben nur Webdesigner und Verwalter und Community-Manager, können also nichts neues entwickeln).

**mike**
Ich mag das langfristige ArkSpace-Projekt zur Weltraumerkundung und die Entwicklung muss über eine wesentlich längere Zeitspanne, als die Finanzierung eines Indexcoins überbrückt zu Ark, stattfinden.
Ja und in beiden Fällen, das Projekt kann die Blöcke von Token an Mitwirkende verteilen, anstatt sie mit Geld zu kompensieren.
Ich bin ein Fan der Methode, den Kuchen zu teilen.

**arc-over-water**
Ok, du sagst also es wird zwischen 1%-10% im nächsten Monat sein um die Finanzierung zu sichern, aber auch um die Marketing-Kampagne zu starten. Nach dieser Distribution wird es monatlich kleinere Versionen von ICOs geben und die Mehrheit werden die Belohnung des Prämienprogramms erbringen, sowie die Knoten etc..

**mike**
http://slicingpie.com/ Kuchenteilen, perfektes gleiches Teilen, Bootstrapped Startups Kuchenteilen ist eine Formel, die es erlaubt den Erschaffern eine perfekt geteilte Aufteilung zwischen Gründern, Investoren, Partnern und Angestellten zu schaffen. (92KB)
Skycoin ist sehr ähnlich, aber es manuell umzusetzen, erfordert einige Anpassungen.

**synth**
Genau.
Woran ich interessiert bin, ist, ob wir das BBS aufmotzen können mit dem Anreiz, dass jeder Dollar den wir OTC verkauft haben, den Skycoin-Börsenwert um $4 gesteigert hat.
Wir haben Coins verkauft und in der nächsten Woche ist der Preis explodiert, weil die Leute es auf Twitter beworben haben und darüber Blogposts verfasst haben.
Skycoin muss auf mehr Exchanges.

**synth**
Ich muss jetzt schlafen. LMAO. Wir sollten das AMA bald beenden.

**arc-over-water**
Cool, danke für deine Zeit... haha 3.17 morgens hier.

**synth**
4 Stunden?

**dr10**
XD

**synth**
Gibt es ein Archiv für dieses AMA?

**dr10**
Reddit hoffentlich :joy:

**michaelthecryptoguy**
Vielen Dank, dass du dir die Zeit genommen hast, alles bis ins Detail zu beantworten. Es war sehr nett, dass du dir soviel Mühe gemacht hast, alles sorgfältig zu beantworten.

**boldninja**
@michaelthecryptoguy kannst du alles kopieren und es reddit-freundlich machen?
Danke an @synth, dass er sich die Zeit für dieses AMA genommen hat, es war :mindblown:, sehr interessante Sachen.

**techbytes**
Marathonsitzung heute.

**michaelthecryptoguy**
Sicher, kann ich machen. Solange jarunik nicht schon damit begonnen hat. (bearbeitet)

**mike**
Vielen herzlichen Dank für deine Teilnahme synth, bitte schau mal wieder vorbei.
Ich werde weiterhin den Skycoin-Slack für Updates besuchen, [skycoin.herokuapp.com](https://skycoin.herokuapp.com).
Je enger die Integration von Skycoin mit Ark ist, umso besser.
