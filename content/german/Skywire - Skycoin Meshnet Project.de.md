+++
title = "Skywire - Skycoin Meshnet-Projekt"
tags = [
    "Skywire",
]
bounty = 15
date = "2017-08-29"
aliases = [
	"/de/overview/skywire-skycoin-meshnet-project/"
]
+++

![Skywire: The New Internet](/img/skywire-new-internet.jpg)

<!-- MarkdownTOC autolink="true" bracket="round" -->

- [Einführung](#einf%C3%BChrung)
- [Routing: Überblick](#routing-%C3%9Cberblick)
- [Belohnungen: Bezahlprokotoll](#belohnungen-bezahlprokotoll)
- [Source Routing: Link Layer-Verschlüsselung](#source-routing-link-layer-verschl%C3%BCsselung)
	- [Beispielprotokoll: Knoten `A` und `B`](#beispielprotokoll-knoten-a-und-b)
	- [Mögliche Verbesserungen:](#m%C3%B6gliche-verbesserungen)
- [IPv4 Gateway: Existierende ISPs umgehen](#ipv4-gateway-existierende-isps-umgehen)
	- [Beispiel Eins](#beispiel-eins)
	- [Beispiel Zwei](#beispiel-zwei)
- [Skywire Daemon Services Architecture](#skywire-daemon-services-architecture)
	- [Beispiel-Service: Blockchain-Synchronisation](#beispiel-service-blockchain-synchronisation)
- [Multihome Routing und Link Aggregation](#multihome-routing-und-link-aggregation)
- [Meshnet Routing: Store-and-Forward-Verfahren](#meshnet-routing-store-and-forward-verfahren)
- [Store-and-Forward-Verfahren: Kapazitätsnutzung](#store-and-forward-verfahren-kapazit%C3%A4tsnutzung)
- [Store-and-Forward-Verfahren: Beispiele](#store-and-forward-verfahren-beispiele)
	- [Beispiel des üblichen Ablaufs](#beispiel-des-%C3%BCblichen-ablaufs)
	- [Beispiel mit Überlastung](#beispiel-mit-%C3%9Cberlastung)
	- [Beispiel mit Paketverlust](#beispiel-mit-paketverlust)
- [Store-and-Forward-Verfahren: Verzögerungs-Bandbreiten-Produkt](#store-and-forward-verfahren-verz%C3%B6gerungs-bandbreiten-produkt)
- [Store-and-Forward-Verfahren: Kapazitätsnutzung, Qualität und Service](#store-and-forward-verfahren-kapazit%C3%A4tsnutzung-qualit%C3%A4t-und-service)
- [Source Routing: Mobile Konnektivität für mehrere Routen](#source-routing-mobile-konnektivit%C3%A4t-f%C3%BCr-mehrere-routen)
- [Source Routing: Zuverlässigkeit für mehrere Route](#source-routing-zuverl%C3%A4ssigkeit-f%C3%BCr-mehrere-route)
- [Source Routing: Guard-Knoten](#source-routing-guard-knoten)
- [Source Routing: Grenzen von BGP](#source-routing-grenzen-von-bgp)
- [Virtuelle Routen: Skywire Network Topology skaliert](#virtuelle-routen-skywire-network-topology-skaliert)
- [Source Routing: Virtuelle Routen, SONET Topology](#source-routing-virtuelle-routen-sonet-topology)
- [Source Routing: Asymmetrische Verbindung](#source-routing-asymmetrische-verbindung)
- [Source Routing: Routenermittlung](#source-routing-routenermittlung)

<!-- /MarkdownTOC -->

## Einführung

Skywire Ziele:

* Breitbandwettbewerb erhöhen. Anbieten einer Alternative zu den existierenden IPs. Überbrückung der letzten Meile.
* Nutzergemeinden ermöglichen, selbst ISPs auf Basis einer nutzerbetriebenen Infrastruktur zu bauen.

Skywire ist das neue Darknet-Protokol.

* Geringe Latenz (so schnell wie TCP/IP und theoretisch schneller auf dem nativen Netzwerk)
* Hohe Performanz (entworfen für Video, File Sharing und Applikationen mit hohem Durchsatz)
* Privatsphäre bewahrend
* Unterstützt Operationen über Wifi (Meshnet)
* Unterstützt Clearnet Operationen (Darknet/Overlay)

Skywire löst die Probleme des Anreizes und des Leechens im Netz.
* Nutzer erhalten Skycoins für die Bereitstellung von Netzwerkressourcen
* Nutzer verbrauchen Coins für die Nutzung von Netzwerkressourcen

Skywire ist offen zugänglich.
* Jeder mit einem Client kann sich zu einem Skywire-Knoten verbinden
* Ziel ist es ein globales offenes Meshnet zu erschaffen

Skywire bewahrt die Privatsphäre.
* Der Traffic, der durch deinen Knoten geht, kann nicht zu deiner IP zurückverfolgt werden
* Knoten, die Traffic weiter leiten, können nur den letzten und den nächsten Hop sehen
* Dritte Parteien, die den Traffic passiv überwachen, können keinen einzelnen Pakete zu einem Datenstrom oder Nutzer zuordnen
* Dritte Parteien und Forwarding-Knoten können nicht den Inhalt des Traffics lesen

## Routing: Überblick

Das Skywire-Meshnet nutzt Source Routing und ein Store-and-Forward-Protokoll.

Der Kern eines Overlay-Netzes ist eine Menge von Knoten.

* Jeder Knoten wird durch einen Public Key Hash identifiziert
* Jeder Knoten empfängt Nachrichten und leitet Nachrichten weiter
* Knoten erhalten Coins

Kommunikation von Knoten A zu C durch Knoten B:
* Knoten `A` verbindet sich zu Knoten `B` und stellt eine Route her
* Knoten `A` erweitert die Route zu `C`
* Traffic, der über die Route auf `A` gesendet wird, kommt bei `C` an

In einer Route `A -> B -> C -> D`:

* Knoten kennen nur den vorhergehenden und den nächsten Knotenpunkt der Route.
* `C` wird wissen, dass die Nachricht über `B` kam und an `D` addressiert ist. `C` wird jedenfalls nicht die Identität von `A` kennen.
* `B` kann nicht ableiten, dass `A` der Ursprung der Route ist.
* `C` kann nicht ableiten, dass `D` das Ziel der Nachricht ist.
* `B` und `C` können den Inhalt der Nachricht nicht lesen (Ende-zu-Ende-Verschlüsselung)
* Ein passiver Beobachter, der nicht am routing teilnimmt, kann keine Informationen über den Inhalt der Nachricht erlangen (Link Layer Encryption).
* Mehrere Nachrichten von mehreren Routen können auf dem Weg zum selben Ziel gebündelt werden und die Möglichkeiten von passiven Beobachtern zur Traffic-Analyse reduzieren.

Die einfachste Implementierung einer Route ist ein 128-Bit-Präfix. Jeder Knoten ließt den Präfix und schaut in einer Tabelle nach, um den nächsten Knoten zu ermitteln, an das Paket geschickt werden soll.

Die Quelle hat die komplette Kontrolle über das Routing.

* Jeder Knoten kann sein Routing-Protokoll unabhängig aktualisieren, um ihn auf seine Anforderungen anzupassen.
* Die Quelle kann die Netzwerkpfade für VOIP oder Spiele auf geringe Latenz optimieren
* Die Quelle kann die Netzwerkpfade für hohen Datendurchsatz für Videos oder File Sharing optimieren
* Die Quelle kann mehrere routes zum Ziel bündeln, um Redundanz, geringe Latzenz und Durchsatz zu erreichen

Manche Anwendungen werden mehrere parallele Routen auf der Application Layer nutzen:

* Privatsphäre (Gatekeeper Nodes, Tor-Typ Gateway/Anon Services)
* Durchsatz
* geringe Latzenz
* Redundanz

Das ist der Kern des darüberliegenden Skycoin-Netzwerks. Es ist sehr einfach, aber sehr mächtig. Technische und Implementierungsdetails werden im Anschluss besprochen.

Skywire präfixt ein Paket einfach mit der Route-ID.

* Routing ist ein sehr einfacher Tabellen Lookup
* Der Zusatzaufwand pro Paket ist konstant und nimmt mit langen Routen nicht zu

Hinweise:
* Das Ziel kennt nicht die Identität des Ursprungs. Identität ist nicht länger in der Routing Layer, sondern auf der Application Layer. Identität muss durch eine Public Key Infrastructur bestätigt werden.
* Man-in-middle-Attacken sind nicht möglich. Eine Quelle kann das Ziel durch ihren Public Key identifzieren.
* Privatsphäre ist gegenüber IPv4 signifikant verbessert, da jeder, der mit dem Paket zu tun hatte, das Ziel, die Quelle und den Inhalt des Pakets sehen konnte.
* Die Perfomanz ist verbessert im Vergleich zu IPv4/BGP, weil ISPs Hot Potato Routing verwenden.
* Ende-zu-Ende-Verschlüsselung eliminiert Packet Injection Attacks und Spoofing. Spoofing von Traffic erfordert die privaten Schlüssel von beiden Enden der Tunnelverbindung.
* Verschüsselung ist schnell. Ziel sind 10 Gb/s Durchsatz auf FPGA Hardware und 200 mb/s auf ARM.

## Belohnungen: Bezahlprokotoll

![Skywire miner](/img/skywire-new-internet-skyminer.jpg)

*[Skywire "miner"](/statement/skywire-miner-hardware-for-the-next-internet/)*

Knoten werden Traffic weiterleiten und Coins erhalten. Dies ist äquivalent zum "Mining" bei Skycoin, und viel Nutzer werden ihre ersten Coins bekommen.

Bezahlungen für den Transit sollen nicht die Identität des Quellknoten offen legen. Skycoin wird Blindet Escrow Payments über eine dritte Partei nutzen, bis ein besseres Protokoll entwickelt wird.

Jeder Knoten in der Route zeichnet den Traffic auf und der Ursprungsknoten zeichnet den Traffic auf. Sie vereinbaren periodisch eine Zahlung für die Bandbreite.

Der Ursprungsknoten halt Coins in escrow mit einer dritten Partei. Ein Pseudonym-Account wird mit der dritten Partei erstellt. Jeder Koten kann die Reputation und die Zahlungsfähigkeit des Ursprungs über die dritte Party verifizieren, ohne die Identität der Partei zu wissen. Gegenüber der dritten Partei wird jeder Ursprung als mehere unverbundene Pseudonym-Accounts erscheinen. Jeder Transitknoten wird als mehere unverbundene Pseudonym-Accounts erscheinen.

Kleine Transaktionen werden intern in kleinen Off-blockchain-Transaktionen ausgeglichen. Off-blockchain-Transaktionen können in eine neu generierte, niemals zuvor verwendete Adresse ausgezahlt werden, wenn der Bestand eine bestimmte Grenze überschreitet (momentan 1 Skycoin).

## Source Routing: Link Layer-Verschlüsselung

Es gibt eine standardmäßige Link Layer-Verschlüsselungen zwischen den Hops und eingebaute Ende-zu-Ende-Verschlüsselung. Eine typische Anwendung wird die Link Layer-Verschlüsselung, die Ende-zu-Ende-Verschlüsselung und eine passende Applicatoin Layer-Verschlüsselung nutzen.

Die Verschlüsselung zwischen den Knoten sollte schnell sein. FPGA-Implementierungen müssen 10 Gb/s an Operationen über die Verbindung unterstützen. ARM müssen 250 Mb/s unterstützen.

Der momentan beste Kanidat ist ChaCha20 mit ECC scp256k1 Ephemeral Key Exchange.

ChaCha20 nutzt nur sehr einfache arithmetische Operationen, ist schnelles als AES für eingebettete Geräte und ist widerstandsfähiger gegenüber Channel Attacks als AES.

Ein moderer CPU kann 6000 SECP256k1-ECDH-Operationen pro Sekunde unterstützen. Der Austausch von Session-Schlüsseln sollte einmal pro Sekunde erfolgen oder doppelt so lange wie ein Round Trip zwischen den Nodes. Es sollte unterschiedliche Schlüssel für jede Verbindungsrichtung geben.

Der vorhergehende Session-Schlüssel sollte in das Geheimnis, welches über ECDH empfangen wird, eingehen.

Der Session-Schlüssel, der über Public Key Cryptography (ECC) ausgetauscht wird, wird verwendet um die Kommunikation zu verschlüsseln, die über eine schnellere symmetrische Verschlüsselung (AES, ChaCha20) erfolgt. Dies ist die grundlegende Link Layer-Verschlüsselung zwischen den Knoten.

### Beispielprotokoll: Knoten `A` und `B`

- Knoten `A` will einen Session Key generieren, um verschlüsselte Daten zu Knoten `B` zu senden.
- Knoten `B` hat den öffentlichen Schlüssel `P`, mit dem privaten Schlüssel `p`. `P` ist ein Punkt auf der ECC sep256k1 Kurve. `p` ist ein 256 Bit Integer. `P` ist Basispunkt b hoch p mit der Kurvenadditionsoperation.
- Knoten `A` generiert ein ephemeral öffentlichen Schlüssel `Q` mit dem privaten Schlüssel `q`. (Knoten `A` generiert zufällig ein 20 Byte Integer. Dies ist der öffentliche Schlüssel `q`. Knoten `A` rechnet den Basispunkt hoch `q`, um den privaten Schlüssel `Q` zu generieren, der ein Punkt der Kurve ist).
- Knoten `A` sendet, `P`*`q` (der Punkt auf der Kurve `P`, der `B`s öffentlicher Schlüssel hoch `q` ist)
- Knoten `A` sendet `P` zu Knoten `B`
- Knoten `B` empfängt `P` und errechnet `P*q`, Knoten `A` kann `p*Q` berechnen. Beide sind gleich. Dies ist ein Shared Secret, welches gehasht wird, um ein Session Key zu zeugen.
- `P = b*q`, also `P*q` ist identisch zu `(b*p)*q`. `P*q = (b*p)*q = (b*q)*p = Q*p`, da `Q=b*q`. `A` kennt `q,Q` und `P` und `B` kennt `p,P` und `Q`. Daher können `A` und `B` beide `P*q` und `Q*p` berechnen und dies als Shared Secret verwenden. Eine dritte Partei kennt weder den privaten Schlüssel `q` für `A` noch den privaten Schlüssel `p` für `B`. Daher kann eine dritte Partei das Shared Secret nicht berechnen und daher auch keine mit dem Shared Secret verschlüsselten Daten lesen.
- Knoten `B` bestätigt den Erhalt der Aktualisierung des Session Keys. Knoten `A` beginnt mit dem neuen Session Key zu senden, so bald die Bestätigung von `B` erhalten wird.
- Knoten `A`, sendet verschlüsselte Nachrichten zu Knoten `B` und nutzt ChaCha20 als symmetrische Verschlüsselung, welches den Session Key nutzt.

### Mögliche Verbesserungen:

- Regelmäßige Session Key-Aktualisierungen. ECDH-Schlüsselaustausch alle paar Sekunden oder Minuten.
- Hashen des alten Session Keys mit neuem ECDH Secret, um einen neuen Session Key zu generieren.
- Nonces bei Paketen nutzen und Secrets in die Nonce hashen, um einen Schlüssel für jede Nachricht zu generieren. Derselbe Schlüssel wird niemals wieder verwendet. Reduziert Auswirkungen von bekannten Plaintext-Attacken.
- Eliminierung von bekanntem Plain Text in Nachrichten.
- Füllen Nachrichten auf Vielfache von 16 oder 32 Byte auf.

## IPv4 Gateway: Existierende ISPs umgehen

Viele Menschen haben nur eine Wahl für ihren ISPs. Dies beschreibt kurz wie Skywire den Wettbewerb erhöhen kann.

Manche Anwendungen können nativ im Skywire Adressraum ausgeführt werden. Manche Anwendungen wie Bittorrent, Filesynchronisation und Kommunkationsanwendungen profitieren sehr stark von der Skywire Infrastruktur und werden so angepasst werden, dass diese nativ darauf betrieben werden.

Legacy-Anwendungen, wie Netflix, Facebook und Twitter benötigen ein Netzwerk Gateway als Schnittstelle zum Skywire Netz mit IPv4 und IPv6 Netzwerken.

Ein Nutzer wählt ein Skywire Gateway, welches auf einem Server in einem lokalen Zentrum betrieben wird. Der IPv4-Traffic des Nutzers wird durch das Gateway (vergleichbar mit einem VPN) getunnelt. Die Nutzer IP wird als die IP des Gateway servers erscheinen. Der Server hat eine Gigabit-Verbindung zu meheren Internet Backbones bei Providern, die die Netflix-Raten nicht beschränken. Der Nutzer hat mehrere Wahlmöglichkeiten an Providern für Skywire IPv4 Gateways. Der Gateway Provider wird mit Skycoins auf Basis einer Messgröße bezahlt.

Der Skywire-Knoten im Haus des Nutzers verbindet sich zu dem Gateway über alle möglichen Routen. Der Skywire-Knoten tunnelt den IPv4-Traffic von einem Router zu einem Gateway im Colocation Zentrum. Die IP-Adresse des Gateway-Knotens erscheint als IP-Adresse für den Nutzer.

### Beispiel Eins

Ein Nutzer hat ein 10 Mb/s Kabelmodem. Sie installieren einen Skywire Router. Der Router ist mit ihrem Computer, einem Skywire Wifi-Knoten und dem Kabelmodem verbunden. Der Router ist als Skywire IPv4-Tunnel konfiguriert. Sie stecken den Computer in den Router.

Der Skywire Wifi-Knoten verbindet sich zum Skywire Wifi-Knoten des Nachbars, der mit einem 10 Mb/s Kabelmodem verbunden ist. Der Nachbar hat auch eine direktionale Punkt-zu-Punkt-Verbindung mit 200 Mb/s 5 GHz Wifi, die sich mit einem Skywire Wifi-Knoten am Ende der Straße verbindet, wo ein Geschäft betrieben wird.

Der Skywire Knoten des Nutzers führt eine rekursive Ersten-Suche für Knoten mit Klarnetzverbindung durch und stellt Routen her über

* sein Kabelmodem
* Wifi -> das Kabelmodem seines Nachbars
* Wifi -> 5 GHz Punkt-zu-Punkt -> 100/30 Mb/s Geschäfts-/Glasfaserleitung

Der Nutzer wird in der Lage sein die Bandbreite über alle Routen zuzugreifen und zu aggregieren, wenn der über den IPv4-Tunnel verbunden ist. In Gemeinden, in denen die aggregierte Bandbreite und die Verfügbarkeit ein bestimmtes Level erreicht haben, brauchen die Nutzer ihr Kabelmodel nicht länger.

### Beispiel Zwei

Das Geschäft am Ende der Straße hat einen 100/30 Mb/s Glasfaseranschluss mit SLA. Das Geschäft bezahlt einen Festpreis für das Internet. Jede Bandbreite, die nicht genutzt wird, geht verloren. Das Geschäft hängt einen Skywire Knoten an das Netz. Der Router hat 3 Ports. Der erste Port ist ihre WAN-Verbindung, der zweite Port ist ihr internes Netzwerk, der dritte Port geht zu ihrem Skywire Wifi-Knoten auf dem Dach. Der Router speichert und priorisiert den Traffic aus dem internen Netzwerk und weist ungenutzte Kapazitäten dem Skywire Wifi-Knoten auf dem Dach zu. Der Betreiber erhält Skycoins für den Transit, welcher die Kosten für den Glasfaseranschluss amortisiert.

## Skywire Daemon Services Architecture

* Jeder Skycoin Knoten hat einen Secpk256k1 öffentlichen Schlüssel.
* Jeder Skycoin Knoten hat eine Skycoin-Adresse, die ihn identifiziert. Die Adresse ist ein Hash des öffentlichen Schlüssels des Knotens. Dieser öffentliche Schlüssel ist äquivalent zu einer IP-Adresse aus dem Netzwerk.
* Jeder Skycoin Knoten hat einen Verbindungspool aus Peers, mit denen er verbunden ist. Diese können über TCP, UDP Klarnetz, physische Verbindungen über direktes Ethernet und Wifi (Meshnet Modus) verbunden sein. Eine Verbindung kann auch eine virtuelle Verbindung, die über eine physikalische oder Klarnetzverbindung getunnelt wird. Dies wird später beschrieben.
* Jede Verbindungsinstanz mit Peers hat Kanäle. Ein Kanal ist ein 16 Bit Integer, der vergleichbar mit einem Port in TCP, ist.
* Alle Nachrichten, die versendet und empfangen werden haben einen Präfix mit 32 Bit Länge und einen 16 Bit Kanal.
* Kanal 0 ist für die Kommunkaton zwischen Skywire Daemons reseveriert und stellen Metainformationen über die Services, die auf dem Daemon laufen und andere erforderliche Daten für die Netzwerkoperationen bereit.
* Ein Skywire Daemon kann Services auf dem Kanal verfügbar machen. Ein Service ist ein Prozess, der empfangene Datennachrichten auf einem Kanal managt und Datennachrichten an entfernte Peers und Services weitergibt.

### Beispiel-Service: Blockchain-Synchronisation

*Dieses Beispiel bezieht sich auf eine Golang-Implementierung, aber die Daemon Architektur ist sprachverwandt.*

Du willst zwei unterschiedliche persönliche Block Chains mit den öffentlichen Schlüsseln A und B synchronisieren. Du initialisierst zwei "Block Chain Sync Service"-Instanzen, konfigurierst diese mit den passenden öffentlichen Schlüsseln and verknüpfst diese mit dem Skycoin Daemon. Diese Services laufen auf einem lokalen Daemon, jeder auf einem eigenen Kanal.

#### Peers finden

Die Blockchain Sync Daemons hashen den öffentlichen Schlüssel und schauen in der DHT (Distributed Hash Table) nach, ob ein anderer Peer die Blockchain synchronisiert. Wenn ein Peer gefunden wird, können die Peers sich gegenseitig gegenüber weiteren Peers über PEX (Peer Exchange) vorstellen.

#### Senden und Empfangen von Nachrichten

Services registrieren bei der Erstellung eine Liste aus Nachrichten, über die sie angesprochen werden. Nachrichten haben Golang-Strukturen. Die Nachrichtenstruktur wird ausgefüllt und dann gesendet. Die Daten kommen and und die .Handle()-Methode wird bei der korrespondierenden Nachrichtenstruktur aufgerufen.

## Multihome Routing und Link Aggregation

Wenn du ein 2 Mb/s Kabelmoden hast und dein Nachbar hat ein 2 Mb/s Kabelmoden und jeder von euch einen Skywire-Knoten betreibt, dann kann sich dein Skywire-Knoten zu seinem Knoten verbinden und die Bandbreite beider Verbindungen aggregieren. Pakete können nun Routen über dein Kabelmoden und sein Kabelmodem nehmen. Die Kabelmodems sind der Knackpunkt. Um eine 4 Mb/s-Verbindung zu erhalten, muss der Traffic parallel über beide Modems gehen.

Anwendungen wie Bittorrent werden in der Lage sein, die Bandbreite über alle verfügbaren Verbindungen zu aggregieren, da die nativ für eine große Anzahl von Verbindungen ausgelegt sind, die distrikte Routen nehmen.

## Meshnet Routing: Store-and-Forward-Verfahren

Für Knoten an den Kanten der Netzwerkkommunikation über Mesh gibt es ein paar Probleme.

Wenn man ein Wifi-Netzwerk mit 8 Hops hat und 505 der Pakete bei jedem Hop verloren gehen, dann erreicht nur 1 von 256 Paketen das Ziel. Verlorene Pakete sind normal bei Wifi, aber traditionelle Netzwerke behandeln verlorene Paket als Überlastung und drosseln die Verbindungsgeschwindigkeit.

Am Rand des Netzwerks wird Skywire das Store-and-Forward-Verfahren" für die Routen nutzen. Dies stellt bestimmte Anforderungen an den Speicher der Skywire-Knoten, verbessert die Netzwerkperformanz jedoch signifikant.

Für die Route `A->B->C`

* Jeder Knoten hat einen Zwischenspeicher.
* Jeder Knoten sendet die Nachrichten bis sie die empfangen werden und eine Bestätigung vorliegt.

* Ist der Zwischenspeicher von `B->C` für eine Route voll, dann wird `A` dies wissen und wird aufhören Daten zu senden bis die gesendeten Daten bestätigt wurden und Platz im Zwischenspeicher ist. Daher gibt es zwei Bestätigungen zwischen den Knoten auf der Link Layer. Die eine Bestätigung ist eine Bestätigung, dass die übertragenen Datensegmente empfangen wurden. Die andere Bestätigung, dass die Daten aus dem Zwischenspeicher zum nächsten Knoten gesendet und von diesem bestätigt wurden.

## Store-and-Forward-Verfahren: Kapazitätsnutzung

Wenn in traditionellen Netzwerken sinkt die Effizienz, wenn die Netzverbindungen nahe an der Kapazitätsgrenze betrieben werden. Ein Netzwerk, das bei 80%-Kapazität betrieben wird hat das Risiko, dass es bei einer kurzzeitigen Mehrbelastung über die Kapazitätsgrenze hinaus geht und Netzwerkpakete verloren gehen.

TCP interpretiert verlorene Pakete aus irgendeinem Grund als Überlastung und drosselt die Geschwindigkeit zurück.

Die verlorenen Pakete erfordern zudem einen erneuten Versand über TCP und führen zu Verzögerungen so lange die Anwendungs auf das Timeout und den erneuten Versand wartet, bevor der Rest des Datenstroms gelesen werden kann.

Mit "Speichern und Forward"-Operationen läuft der Zwishenspeichers des Routers voll und es passiert nichts weiter. Wenn der Zwischenspeicher sich füllt, hört der Eingangsknoten auf Daten zu senden bis eine Bestätigung über den Speicherplatz im Zwischenspeicher zur Verfügung steht.

Diese Store-and-Forward-Operationen sind besonders für praktische Wifi-Meshnets wichtig. Es gibt nur drei nicht überlappende Kanäle im 2,4 GHz-Band. Die Anzahl an verlorenen Paketen nimmtin Wifi-Netzwerken im Vergleich zur Bandbreitensättung sehr schnell und sehr früh zu. Der Verlust von Wifi-Paketen ist unumgänglich und ermöglicht keine verlässlichen Aussagen über die CONGESTION und die Kapazitätsgrenzen.

Store-and-Forward ermöglicht es Wifi-Knoten mit voller Kapazität und der gesamten verfügbaren Bandbreite zu nutzen, ohne die TCP-CONGESTION-Kontrollmechanismen auszulösen.

Praktische Netzwerke werden folgendes benötigen:

* Software-definiertes Radio
* MIMO
* Beam Forming
* Direktionale Antennen
* Kooperative temporäre und geophysikalische Koordination der Übertragungszeit, Sendeleistung und Frequenznutzung
* 801.11af Whitespace-Frequenzen

## Store-and-Forward-Verfahren: Beispiele

Jeder Knoten überwacht für jede Route:

* Zwischenspeichergröße des empfangenden Knoten der Route
* Vorhergesagte Zwischenspeichergröße (für bestätigte und unbestätigte übertragene Datensegmente)
* Bestätigte Zwischenspeichergröße
* Offset, Größe und Sequenz jeder übermittelten Nachricht, die nicht bestätigt wurde
* Ringspeicher aus Bytes für ausgehende Datagrame, die keine Bestätigung erhalten haben

Auf der Link Layer kann ein Datensegment mehrere verbundene Nachrichten von mehreren Routen enthalten, die den selben Knoten addressieren. Dies erschwert Traffic-Analysen und verbessert die Leistung durch größere Datagramme auf Netzwerken, die höhere MTUs unterstützen.

Für jede übertragene Nachricht, gibt es zwei Bestätigungen. Die erste Bestätigung ist, dass das Datagramm vom nächsten Knote in der Route empfangen wurde. Dies eine Bestätigung für ein Datagramm, dass mehere Nachrichten enthalten kann, die mit unterschiedlichen Routen korrespondieren. Nachdem dieses Datagramm empfangen wurde muss der Knoten das Datagramm nicht länger behalten. Wenn das Datagramm nicht bestätigt wird, muss es erneut gesendet werden.

Die zweite Bestätigung umfasst Aktualisierungen über die verbleibenden freien Bytes im Eingangszwischenspeicher für eine Route. Wenn die freien Bytes im Zwischenspeicher groß genug sind, können weitere Nachrichten für diese Route gesendet werden.

Ein weiterer möglicher Ansatz besteht darin, einen Puffer pro Sender statt pro Route beizubehalten, wobei der Empfänger blockierte Nachrichten an den Absender für überlastete Routen sendet. Dies reduziert die Anzahl der vom Absender benötigten Suchvorgänge für gehashte Routen und dies ist möglicherweise etwas, mit dem experimentiert werden muss.

### Beispiel des üblichen Ablaufs

Route: `A->B->C`

* B hat 1024 KB Zwischenspeicher für die Route
* A sendet 512 KB zu B
* B bestätigt die 512 KB gegenüber A
* < A empfängt die Bestätigung (und löscht die ersten 512 KB, die nicht länger gespeichert werden müssen) >
* B leitet 512 KB an C weiter
* C bestätigt den Empfang von 512 KB
* C bestätigt gegenüber A, dass die 512 KB weitergeleitet wurden

### Beispiel mit Überlastung

Route: `A->B->C`

* B hat 1024 KB Zwischenspeicher für die Route
* A sendet 512 KB zu B
* A sendet 256 KB zu B
* A sendet 256 KB zu B
* < A stoppt das Senden, da wartende Pakete vorliegen, die den Speicher von B bereits füllen >
* B bestätigt gegenüber A den Empfang von 512 KB und 512 KB
* B sendet 256 KB zu C
* C bestätigt den Empfang von 256 KB gegenüber B
* B bestätigt gegenüber B die Weiterleitung von 256 KB gegenüber A
* < A kann nun weitere 256 KB senden >

Es wird angenommen, dass die Daten mit Wifi oder direktionaler Internetverbindung in der Sendereihenfolge empfangen werden.

### Beispiel mit Paketverlust

Route: `A->B->C`

* B hat 1024 KB Speicher für die Route
* A sendet 512 KB zu B
* A sendet 256 KB zu B
* B bestätigt die 256 KB
* A leitet ab, dass die 512 KB nicht empfangen wurden
* A sendet die 512 KB erneut
* B bestätigt die 512 KB
* < B kann nun den Stream weiter in Reihenfolge an C senden >

## Store-and-Forward-Verfahren: Verzögerungs-Bandbreiten-Produkt

Beim Store-and-Forward-Verfahren wird auf dem absenden Knoten eine Speicheranforderung in Höhe de Produkts der Round Trip Latenz und der Übertragungsrate multipliziert. 1 GB RAM ist genug bei einer 8000 ms Round Trip-Latenz bei 1 Gb/s Übertragungsrate.

Das Store-and-Forward-Verfahren sollte der Standard sein, aber optional.

## Store-and-Forward-Verfahren: Kapazitätsnutzung, Qualität und Service

Video, Audio und File Downloads sind zwischengespeichert. Absolte Durchschnittsdurchsätze über eine Zeitfenster von Sekunden sind wichtig, während Latenz irrelevant ist. Anderer Traffic, wie Webseitenanfragen, Videospiele und VoIP in Echtzeit sollten so schnell wie möglich geliefert werden.

Mit zwei Service Level-Qualitäten, "Echtzeit" und "Bulk", können wir Traffic von VoIP, Webseiten und Videospiele zuerst übertragen und die Latenz hierfür reduzieren. Latenzinsensitiver Traffic wie Video, Musik und File Sharing würde nur über einen Knoten fließen, wenn der Echtzeit-Traffic-Speicher leer ist.

Wir sind in der Lage Links nahezu mit 100% ihrer Kapazität zu betreiben, während die Latenzen für Echtzeit-Traffic gering sind. Daher unterstützen wir zwei Service Level-Qualitäten für unsere Routen.

## Source Routing: Mobile Konnektivität für mehrere Routen

Wenn die Verbindungen zwischen Knoten stabil sind sowie geringe Latenzen und hohe Bandbreite aufweisen, dann ist eine einzige Route für die meisten Anwendungen ausreichend. Manache Anwendungen wie BitTorrent öffnen eine hohe Anzahl an Verbindungen und können nativ die Bandbreite aller Routen nutzen.

Wenn die Links zwischen den Knoten langsam und unzuverlässig sind oder die Konnektivität sich verändert, verlangen Zuverlässigkeit und Performanz, dass der Traffic über mehrere Routen aufgeteilt wird.

Wenn ein Skywire Knoten auf einen Mobiltelefon betrieben wird und ein Auto die Straße entlang fährt, werden sich die Netzwerke, die zugänglich sind, ändern. Netzwerkknoten werden in Reichweite kommen und andere Netzwerknoten werden die Reichweite verlassen. Die Knoten sollten kontinuierliche Konnektivität auf der Anwendungsebene haben, sogar wenn die physikalische Verbindung erstellt oder zerstört wird.

Ein Ansatz ist die Wahl einer Menge von zuverlässigen Knoten des Netzwerk Backbones als Endpunkte für eine Route und die Leitung des Traffics über diese Knoten als Proxy und über eine Menge von mehreren kurzen Routen.

## Source Routing: Zuverlässigkeit für mehrere Route

Wenn Lins nicht zuverlässig sind oder eine hohe variable Latenz haben, ist es wünschenswert Anwendungsdaten über mehere Pfaden zu kodieren, so dass die Daten wiederhergestellt werden können, wenn die Daten von einem der Pfade empfangen werden. Fountain Coding und anderen existierende Encodierungsmethode könnten hierfür angewendet werden.

## Source Routing: Guard-Knoten

Wenn Nutzer aus Gründen der Privatsphäre die Rückverfolgbarkeit von ihrer Skywire-Knotenadresse (Hash des öffentlichen Schlüssels) zu Ihrer IP-Adresse weiter verschleiern möchten, können sie eine feste Menge an Knoten bestimmen, die als Transitknoten für den Traffic ihres Knotens ausgegeben werden oder als erforderliche Knoten für eine Route von ihrem Knoten.

## Source Routing: Grenzen von BGP

Das Border Gateway Protokoll, das momentan am weitest verbreitete Protokoll, löst das Routing Problem ohne den Status der Pakete zu speichern. BGP erlaubt jedem Netzwerk eine Reihe von Ad-hoc-Regeln für jeden seiner Routern zu erstellen, die auf die Quelle und das Ziel eines Pakets schauen und entsheiden welche Netzwerkschnittstelle für die Weiterleitung verwendet werden soll. Router tauschen mit einander Verbindungsinformationen aus und ein anderer Routing Algorithmus wird verwendet, um das Routing zwischen den Netzwerkdomänen abzuwicklen.

BGP ist dafür konzipiert Schnittstellen für eine Reihe von unabhängigen autonomen Netzwerken zu schaffen. BGP hat eine Homogenitätsannahme. Das Routing innerhalb einer autonomen Domäne wird als zentral gemanagt und hochverfügbar angenommen. Das Mesh-Netzwerk und ISPs der Gemeinde werden ad-hoc mit heterogenen Geräteverbindungen und Routing sein.

Verbindungen in Mesh-Netzwerken, Ad-Hoc-Konfigurationen und dicht verbundene Netzwerke mit meheren redundanten Routing Pfaden verletzten die hierarchischen Annahmen von BGP komplett.

BGP hat mehere Probleme, die ein Protokoll der nächsten Generation behandeln sollte:

* BGP ist nicht selbst konfigurierend. BGP-basierte Netzwerke benötigen detailliertes technisches Wissen, um sie zu betreiben und zu konfigurieren
* BGP-System benötigen häufig manuelle Konfiguration, um Probleme zu umgehen und sie sind nicht robust gegenüber falschen Konfigurationen
* BGP benötigt manuelle Erstellung von ad-hoc Route-Filterregeln und erhöht die Komplexität für Netzwerke mt Multihome-Konnektivität.
* BGP-Netzwerke setzen eine hochzentralisierte Planung voraus
* Die NSA hat Fehler im BGP-Protkoll ermittelt mit denen gewünschter Traffic an Abfangpunkte umgeleitet werden kann
* Die Annahmen von BGP bekommen mehr und mehr überholt, gerade für Ad-Hoc-, Mesh- und Mobile-Netzwerke.
* Die hierarische Einzelpfadannahme von BGP gestalten Implementierunge von Multihome und anderen Anforderungen der nächsten Netzwerkgeneration sehr schwer.
* BGP bekommt große Probleme wenn die Netzwerk-Links unzuverlässig sind, wie beispielsweise wechselnde Routen.
* Die Größe der BGP-Routing-Table wächst exponentiel mir der Anzahl der verbundenen Subnetze.
* Multihoming führt zu einer massiven Explosion der BGB-Routing Table Size.
* BGB hat Probleme mit Load Balancing und Multihome-Routing. BGP schränkt
* BGP hat Schwierigkeiten mit der Lastverteilung und Multihoming-Routern. BGP limitiert die Möglichkeiten in praktischen Netwerkwerken, um aus Parallelverbindungen zwischen Standorten Vorteile zu ziehen.
* BGP schafft einen Anreiz für die ISPs, den Netzwerkverkehr so schnell wie möglich an andere weiter zu geben (“Hot Potato Routing”), wodurch die Leistung eingeschränkt und die Latenz erhöht wird.

Es gibt keine Alternative zu BGP. BGP BGP ist die beste Lösung innerhalb seiner Designbeschränkungen.

Der Nachfolger von BGP muss:

* Nicht-hierarchisch sein
* Selbstkonfigurierend (Zero-conf)
* einen guten Betrieb bei dichten ad-hoc und redundanten Verbindungen zwischen Netzwerken


## Virtuelle Routen: Skywire Network Topology skaliert

Die Routing Implementierung von Skywire benötigt einen Knoten, um Informationen zu jeder Route zu verwalten, die weitergereicht wird. Individuelle Knoten sind nicht in der Lage tausende individueller Routen abzuwicklen, daher wird Skalierbarkeit über andere Mechanismen sichergestellt.

Skywir experimentiert mit einer nicht hierarchischen, selforganisierendem Routing, das nativ Multihoming und nicht hierarchische Netzwerktopologien unterstützt und effizient skaliert.

Skywire minimiert den Durchmesser des Netzwerks durch virtuelle Routen, wenn das Netzwerk skaliert. Virtuelle Routen ermöglichen die Bündelung tausender Verbindungen über eine Backbone-Verbindung mit hoher Bandbreite mit dem Mehraufwand einer einzigen Route.

Eine "virtuelle Route" erstellt einen Tunnel über existierende Routen:

`A -> B -> C -> D`

Die virtuelle Route erscheint als A->D. B und C könnten Verbindungen über lange Distanzen mit hohen Bandbreiten sein. B und C haben nur den Mehraufwand einer einzelnen Route, während A und D den Mehraufwand der Verwaltung der Routen über den Tunnel von A->D haben.

Die virtuelle Route kann den Traffic von hunderten gebündelten Routen von A zu D haben, während B und C nur den Mehraufwand einer einzigen Route haben. Weiterhin kann die virtuelle Route mehrere redundante Netzwerkpfade zwischen dem Ursprung und dem Ziel hinsichtlich Leistung, Durchsatz und Redunanz zusammenfassen.

Virtuelle Routen ermöglichen es, die Netzwerkkapazität grob hierarchisch zu gruppieren, wobei die Knoten auf jeder Ebene einen konstanten Fan-In und Overhead aufweisen.

Knoten an der Netzwerkkante münden in Aggregationsknoten. Die Aggregationsknoten der Kanten sind mit hoher Bandbreite zum intradomänen Transit verbunden und geben den Traffic zu Gateway-Knoten weiter, die die Netzwerke verbinden. Gateway-Knoten sind mit hoher Bandbreite und dem Fernverkehr verbunden.

Virtuelle routen sind eine Repräsentation existierender Routing-Beziehungen zwischen Domänen, welche nativ unterstützen:

* Nicht hierarchisches Routing (Data Centers)
* Multiplehoming
* Dichte Netzwerkverbindung zwischen den Domänen auf unterschiedlichen Ebenen der Hierarchie
* Multi-Path-Routing innerhalb und zwischen den Domänen

Virtuelle Routen folgen einer Dreiecksgleichheit. Wenn die Kosten einer Route A->B C(A->B) ist, dann ist

`C(A->B->C) >= C(A->B) + C(B->C)`

Die Ursprungspräferenz für niedrige Latenzzeiten, niedrige Kosten und niedrige Hop-Routen schafft wirtschaftliche Anreize, um eine effiziente Netzwerktopologie zu schaffen. Das Netzwerk ist nicht hierarchisch und selbstorganisierend. Die virtuellen Routen, die geschaffen werden, sind Routenzusammenfassungen, die den natürlichVerkehrsfluss widerspiegeln.

Mit BGP versuchen die Netzwerke den Traffic so schnell wie möglich los zu werden (Hot Potato Routing). Bei Skywire konkurrieren die Netzwerke um den Transit (um Coin-Belohnungen zu erhalten). Skywire Clients werden Route mit niedrigen Kosten, wenigen Hops und geringen Latenz bevorzugen. Netzwerke mit direkten Fernverkehrkapazitäten zwischen Quelle und Ziel haben geringe Latzen und einen geringeren Hop Count und werden daher bevorzugt.

Aus Effizienzgründen müssen Bandbreitenkapazität und Fan-In (Anzahl der Routen, die jede virtuelle Route bündelt) auf jeder Ebene der Netzwerkhierarchie konstant sein, um einen konstanten Netzwerkdurchmesser und ein logarithmisches Routing-Tabellenwachstum bzgl. der Anzahl der Hosts zu erreichen.

## Source Routing: Virtuelle Routen, SONET Topology

Eine virtuelle Route mit mehreren Eingängen und mehreren Ausgängen kann physisch als ein SONET-Ring implementiert sein, mit Skywire-Knoten in jeder Stadt, die die SONET-Topologie durchläufen. Die Skywire-Knoten fungieren als Gateway-Router zwischen dem Skywire-Netzwerk und der SONET-Topologie.

Knoten sind in der Lage, große Datagramme zusammenzufügen, die mehrere Nachrichten aus der selben Quelle aus Effizienzgründen an dasselbe Ziel leiten.

Die Nachricht tritt in einem Colocation-Center in einer Stadt in den Skywire-Knoten des SONET-Rings ein. Das Nachrichtenziel oder die Route wird gelesen und die Nachricht wird für den Transport über das SONET-Segment codiert. Die Nachricht erreicht den Ziel-Skywire-Knoten im SONET-Segment und setzt ihren Pfad fort.

Eine virtuelle Route mit mehreren Eingängen und mehreren Ausgängen ist daher eine Liste von Skywire-Knoten mit Transitkosten, die einen SONET-Ring oder eine vollständig verbundene Topologie beschreiben, wobei jeder Knoten in der Liste zu einem anderen Knoten in der Liste übertragen wurde.

## Source Routing: Asymmetrische Verbindung

Die nächste Generation von Wifi-Systemen werden 4x4 oder 8x8 Antennen in einerm Phasenarray mit MIMO haben. Diese Systeme sind in der Lage hoch fokusierte direktionale Strahlen zu projizieren. Diese Systeme erhöhen die Leistung und die Signalstärke am Empfänger erheblich, verbessern jedoch nicht symmetrisch die Antennenverstärkung für Rücksignale.

In gleicher Weise kann ein hochleistungsfähiges, verstärktes WLAN-Signal durch eine Richtantenne an einem fünfzehn Meilen entfernten Ort empfangen werden, aber der Empfang des Signals von dem Standort kann nicht in gleicher Weise so einfach verstärkt werden, wie die Leistung bei der Übertragung erhöht werden kann.

Wir schlagen asymmetrische Routen für Situationen vor, in denen Nachrichten von einem Knoten empfangen werden können, der Knoten jedoch nicht direkt zurück kommunizieren kann. In einer asymmetrischen Route werden Bestätigungsnachrichten über das Netzwerk über eine Route weitergeleitet, wodurch die vollständige Nutzung der asymmetrischen Verbindung über Einweg-Kommunikationskanäle ermöglicht wird.

Situationen, in denen dies zunehmend relevant wird

* Städtische SONET Arrangements mit verstärktem Wifi über Richtantennen
* Städtische Verbindungen zwischen stark gerichteten und ungerichteten Antennen, die mit den gleichen Leistungsstufen senden
* Konkrete Durchdringung in 802.11af-Systemen
* LiFi-Ausbreitung außerhalb der Sichtweite kann über 200 Mb / s übertragen, ist jedoch sehr asymmetrisch
* Li-Fi-Systeme vom Typ RONJA haben theoretische Kapazitätsgrenzen über 10 Gb / s in Sichtlinie und es gibt ein Kosten / Setup-Vorteil für asymmetrische Konnektivität

Durch die Nutzung asymmetrischer Verbindung und Routen, die nur eine einzige Möglichkeit für die direkte Datenübertragung zwischen Knoten ermöglichen, gibt es mehrere Fortschritte, insbesondere im Hinblick auf die Entwicklung des ländlichen Raums und die Senkung der Kosten für die Integration hoher Kapazitäten der Technologien der nächsten Generation.

## Source Routing: Routenermittlung

IPv4-Gateway und Meshnets für Community-ISPs erfordern nur eine Breitensuche über die Pfade zur Clearnet-Konnektivität. Die besten, zuverlässigsten Routen mit dem höchsten Durchsatz weisen eine sehr geringe Tiefe auf. Daher betrachten wir das Routing für diesen Fall als gelöst. Wir werden uns das allgemeine Routing anschauen.
