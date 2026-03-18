+++
title = "Die Bedeutung von Aether"
tags = [
    "Decentralization",
    "CXO",
]
bounty = 5
date = "2017-09-25"
aliases = [
	"/de/statement/the-meaning-of-aether/"
]
+++

*Dies ist ein archivierter Post aus dem Bitcointalksthread vom 5. Mai 2014.*

'Aethers originales Design hat sich in etwas entwickelt, das nun CXO genannt wird.*

*Zitat von: **Tobo** am 4. Mai 2014 um 02:11:12 nachmittags*
> Ich habe bemerkt, dass ihr bisher den Namen Ether verwendet habt, welcher schon von Ethereum benutzt wurde.
Jetzt habt ihr ihn in Aether geändert, was ebenso von einigen Leuten in diesem Forum schon verwendet wurde.
Warum mögt ihr diese beiden Namen so sehr?

Ether durchdringt den Weltraum. Dann haben wir rausgefunden, dass Ether Alkohol ist, den die Leute schnüffeln um high zu werden und Aether ist die mystische Substanz, die den Weltraum durchdringt.

Es trägt den Namen Aether, weil die Daten nicht auf einem Server exisitieren. Sie exisitieren im Kollektiv über das Internet verteilt (oder wenigstens innerhalb der Abonnenten). Einmal veröffentlicht können sie nie wieder zerstört werden. Es gibt keinen zentralen Punkt, es gibt keinen Server der beschlagnahmt werden kann. Die Herausgeber können nicht geortet oder verfolgt werden, denn wenn die Daten veröffentlicht worden sind, sind sie einfach nur ein Peer von vielen.

Es ist ein perfektes System. Es gibt einen Skycoin Adresstypen und dieser ist ein Endpunkt für Datenspeicherung auf einem
pubsub System. Es gibt einen anderen Skycoin Adresstypen und dieser hält Coins. Dann gibt es noch einen weiteren Skycoin Adresstypen und dieser ist ein Knoten, mit dem man kommunizieren kann und dem man Nachrichten senden kann.

Man generiert einen öffentlichen Schlüssel (pubkey), welcher gehasht wird zu einer Adresse und das ist dann die ID.
Die Adresse ersetzt IP-Adressen für das Identifizieren von Geräten oder Computern, wenn diese zur Kommunikation genutzt werden. Sie bezeichnet einen Datenspeicher (genauso wie ein Magnetlink ein Hash einer Torrent-Datei ist und den Torrent bezeichnet), wenn sie für Datenspeicherung verwendet wird. Wenn der Datenspeicher eine Dateiliste und eine Hashliste für Datenblöcke innerhalb der Dateien enthält, ist sie nur ein Torrent den die Leute aktualisieren können. Wenn sie ein Skywire-Knoten ist, wird sie zur Kommunikation verwendet, ähnlich wie eine IP-Adresse den Namen eines Computers angibt.

Wenn man also ein verteiltes Twitter mit Aether kreieren möchte, generiert man einen öffentlichen Schlüssel.
Man verbreitet Aktualisierungen zu seinem schlüsselbasierten Speicher und signiert diese mit seinem privaten Schlüssel.
Jeder Schlüssel im schlüsselbasierten Speicher ist eine Nummer, welche mit jedem Tweet inkrementiert wird und der
Körper des Tweets wird in JSON verfasst.

Man gibt jemand den Hash seines öffentlichen Schlüssels (eine Adresse) und dieser kann nun den eigenen Feed downloaden
und kopieren. Sie können die Feeds von jedem dem sie folgen beziehen. Sie können ihren eigenen Filter-Algorithmus lokal anwenden, um die Sachen aus den Feeds die sie abonniert haben, zu bewerten und einzustufen, sowie ihre individuelle Benutzeroberfläche wählen. Es sind Websiten, aber Websiten, die auf dem eigenen Rechner laufen und sie laufen mit Daten, von denen man selbst eine Kopie besitzt.

Man lädt nicht die Feeds, die man abonniert hat, von einem Server herunter, sondern
von anderen Leuten, welche diese ebenso abonniert haben. Es ist vollständig dezentralisiert.
Es ist pubsub, es ist ein Kommunikationskanal, es ist ein schlüsselbasierter Speicher, es ist ein RSS-Feed, es ist
eine dokumentenbasierte Datenbank (wenn man JSON speichert), es ist ein aktualisierbarer Torrent (wenn man Dateilisten und Dateiblocklisten speichert).

Die Erfindung dieser Datenstruktur ist genauso mächtig wie die Blockchain. Es ist genauso
mächtig wie verteilte Hashtabellen (DHT). Es ist eine Kernkomponente der nächsten Generation von
dezentralisierten Systemen.

Aether ist ein mystisches Element, dass den gesamten Weltraum durchdringt und ich denke dies
ist ein angemessener Name.

Bei Tor identifiziert man einen Pfad zu einem Dienst mittels Traffic-Analyse, indem
man nach Variationen der Latenz von Traffic Ausschau hält und diese mit der Latenz von
anderem Traffic, der durch Knoten läuft, in Korrelation setzt. Das Aufrufen von Seiten ist langsam, weil
die Daten mehrere Etappen (Hops) zu absolvieren haben. Mit unserer Architektur findet die Replikation von Peer-zu-Peer statt.
Es gibt kein "Zentrum", es gibt keinen "Server". Die Websiten sind unmittelbar, weil man die Daten nicht abfragt, sondern eine vollständige Kopie der Daten lokal besitzt. Man generiert die Webseite selbst aus der Datenbank.

Im Internet der Dinge (IoT) hat man eine LED-Glühbirne. Man möchte diese Glühbirne auf Rot schalten.
Die Glühbirne hat eine IP-Adresse und ist drahtlos mit dem WLAN im Haus verbunden. Man bewegt die
Glühbirne und sie bekommt eine neue IP-Adresse, man kann sie also nicht finden und ihr keine Nachrichten senden.
IP-Adressen sind keine "IDs" für Geräte, sie ändern sich sobald das Gerät sich bewegt und das Netzwerk
über andere Endpunkte betreten wird. Skycoin gibt Geräten oder Anwendungen "Namen", welche netzwerkunabhängig sind.
Dies ist eine Funktion des DNS, einen realen Namen zu nehmen und diesen in einen Server oder IP-Adresse aufzulösen.

Die Glühbirne kann eine Skycoin-Adresse haben und man kann an diese Adresse Nachrichten senden.
Man kann sagen "werde rot" oder ein neues Programm auf die programmierbare LED hochladen. Skywire findet
automatisch die Route zum Gerät.

Zusätzlich dazu, kann man sich beim Betreiben einen Skywire-Meshknotens mit bis zu vier verschiedenenen Drahtlos-Netzwerken und einem Router verbinden.
Der WiFi-Knoten hat fünf verschiedene IP-Adressen. Eine IP-Adresse ist nicht länger eindeutig identifizierend für
einen Knoten. Eine IP-Adresse ist lediglich ein Pfad zu dem Knoten. Die IP-Adresse der Router sind oftmals nichtmal
öffentlich wegen der Netzwerkadressübersetzung (NAT).

Den Satz an Computern den man kontrolliert, seinen Desktop, sein Tablet und seine zwei Laptops bilden zusammen eine persönliche Datenwolke (Cloud). Jedes Gerät hat ein Skywire-Daemon und eine Knotenadresse,
von welcher es Kommunikation empfangen kann. Man hat Anwendungsserver auf seiner Cloud laufen. Zum Beispiel kann
man mehrere Speicheranwendungsserver (welche ein Laufwerk im Netzwerkdateisystem preisgeben, wie Dropbox) haben.
Man könnte auch Anwendungsserver haben, wie Webserver oder Email-Server.

Die Idee des mystischen "Aether" beschreibt am besten die Vision, welche wir versuchen zu erreichen.
