+++
title = "Fragen bezüglich der Privatsphäre und Latenz des Meshnet"
tags = [
    "Ask the Developers",
    "Skywire",
    "Privacy",
]
date = "2017-08-18"
aliases = [
	"/de/ask-the-developers/question-regarding-latency-and-privacy-of-the-meshnet/"
]
+++

*Dieser Post bezieht sich auf eine frühere Konfiguration von Skywire, bevor es diesen Namen erhalten hat. Übernommen aus einem Bitcointalk-Post vom 9. August 2014.*

Zitat von : **CraigM** am 9. August 2014, 07:20:24 morgens
> Das Meshnet (vermaschtes Netz) ist dazu gedacht ein nettes Tool für die Privatsphäre zu sein, mit ähnlichen Vorteilen wie TOR, nur mit geringerer Latenz, stimmt das?

> Das Meshnet ist dazu gedacht, mittels Mikrobezahlungen in Skycoin, die Bandbreitenkosten zu decken, stimmt das? Zwingt das die Knotenbetreiber nicht dazu, öffentliche, detaillierte Protokolle (deren persönlichen Blockchains) zu führen, welche all die Transaktionen, die über ihren Knoten gelaufen sind, auflisten? Das scheint so, als würde es beliebigen Drittparteien die Möglichkeit geben, Korrelationsattacken über den Traffic durchzuführen, ähnlich wie bei TOR, nur das man keinen Zugang zu den Verbindungen haben muss. Selbst wenn sie nicht öffentlich einsehbar sein werden, alles zu protokollieren könnte wirkliche Probleme verursachen (könnte von Strafverfolgungsbehörden eingefordert werden, braucht viel Speicherplatz auf).

> Die erste Version wird mit einem zentralen Routenfindungs-Server ausgestattet sein, stimmt das? Das bedeutet, wenn man mit jemand eine Verbindung aufbauen möchte, muss man einer Drittpartei davon mitteilen, stimmt das ? Scheint so, als ob das nicht auf dem gleichen Level der Privatsphäre wie TOR ist, zumindest solange, bis das behoben ist. Gibt es einen Grund zu glauben, dass ihr zeitnah eine Lösung finden werdet (oder sogar: ist dies schwer)?

> Wie findet man eine Route zu dieser zuverlässigen Drittpartei, die das Routenfinden für einen übernehmen soll? Ich nehme an, ihr werdet es einfach als einen Spezialfall behandeln (nicht verwenden der Absenderroutenwahl), aber ich bin neugierig, ob ihr dafür eine andere Methode habt.

## Antwort

Genau. Es ist tatsächlich schneller als TCP/IP. IDAs(ISPs) Routen nach dem Schema "heiße Kartoffel". Die Latenz sollte nicht schlechter als bei TCP/IP sein, in der Theorie sogar schneller.

**Die Privatsphäre wird garantiert durch***
- jeder Knoten kennt nur seinen vorherigen und seinen nachfolgenden Hop
- die Übetragung zwischen Knoten ist verschlüsselt
- Übertragungen allgemein sind Ende-zu-Ende verschlüsselt
- eine Übertragung ist gegen man-in-the-middle-Angriffe mittels der öffentlichen Schlüssel geschützt, welche die Knotenendpunkte repräsentieren (Netzwerkaddressen sind öffentliche Schlüssel im Netzwerk)
- jede Verschlüsselung ist widerlegbar und flüchtig
- das Protokoll ist so designt, dass Versuche der Deep-Packet-Inspection zur Identifikation von protokollbetreibenden Usern in Frustration enden (keine fixen Ports, kein Plaintext im Wire-Protokoll, keine fixen Knotenvernetzungen der Datenübertragungsleitung und so weiter)

Es ist also wie TOR, nur mit sehr geringer Latenz und Mikrobezahlungen für Bandbreite.

- Es ist sicherer und bietet höhere Privatsphäre als HTTPS.
- Es ist schneller als TOR und skaliert, dennoch gibt es weniger Angriffsmöglichkeiten.
- Der Code ist wesentlich einfacher als der von TOR, es gibt also weniger Spielraum für Hintertüren und versteckte Schwachstellen. Es gibt nur eine externe Abhängigkeit im gesamten Code.
- Wenn man absolute Sicherheit gegen Timing-Channel-Attacken braucht, sollte man einen Mixing-Service nutzen, oder Bitmessage über das Darknet laufen lassen.
- alle Netzwerke mit geringer Latenz sind Ziele von Timing-Channel-Attacken.

## Routen-Server

Zugegeben, Routen-Server sind eine Schwachstelle. Für maximale Privatsphäre, sollte man seinen eigenen internen Routen-Server betreiben. Wenn man allerdings einen öffentlichen Routen-Server verwendet, so wird man über mehrere Hops mit ihm verbunden, er kann einen also nicht identifizieren. Trotzdem wäre es sicherer, seinen eigenen zu betreiben.

## Behandeln der Mikrobezahlungen für Bandbreite

Mikrobezahlungen werden über eine Dritt-Partei behandelt. Der Knoten verbindet zu einem **Gateway**, hinterlegt einen Coin am Gateway und erhält einen Kredit. Der Knoten kann nun ein 64-Bit Pseudonym generieren, dass als "Addresse" für das Gateway funktioniert. Das Gateway kennt die eigenen Identität nicht, ebenso kennt es nicht die Identität des verbundenen Knotens. Es kennt nur den vorherigen Knoten, der die Verbindung weitergeleitet hat.

Wenn man also zwölf Verbindungen an ein Gateway aufbaut, sehen sie alle aus, als wenn sie von zwölf verschiedenen Usern wären. Schlussendlich wird die Kommunikation zum Gateway über einen asynchronen Nachrichtenchannel stattfinden.

Der Knoten, der die Bandbreite weiterleitet, verbindet ebenso zum Gateway. Die beiden Knoten können sich nun gegenseitig über das Gateway bezahlen, ohne, dass das Gateway die Identität von einem der beiden kennt. Sobald ein Knoten genug Coins durch Kredit gesammelt hat (einen ganzen Coin), kann er eine neue Skycoin-Addresse generieren und an diese Abheben. Gateways verwalten nur kleine Beträge von Coins.

Ein Gateway im Skycoin-Protokoll ist jeder Server der Coins besitzt, oder Accountsaldos im Auftrag von Drittparteien. Gateways sind Einzahlungsinstitutionen und sie haben ihr eigenes Protokoll, sowie API.

**Letztendlich,**

- wird es vielfache Gateways geben und somit auch viele Gateway-Coin-Übertragungen. Diese Transaktionen finden im privaten statt und tauchen nicht in der Blockchain auf, solange man die Coins nicht vom Gateway abhebt.
- Kommunikation mit dem Gateway wird über einen asynchronen Nachrichtenchannel stattfinden (jede Nachricht wird eine neue pseudonyme Identität erhalten).
- Ein Teil des Gateway-Protokolls ist eine OT-Implementierung, welche es erlaubt zu beweisen, falls ein spezifisches Gateway Coins klaut. Man signiert jeden API-Aufruf zu dem Gateway, das Gateway führt diesen dann aus und signiert die Ausgabe. Es gibt also eine Kette von Signaturen und wenn etwas verschwindet, kann man sein Transaktionsprotokoll veröffentlichen und der Besitzer des beschuldigten Knotens muss ein Protokoll vorzeigen, das die Bewilligung aufzeigt, dass der Coin irgendwo hinversendet wurde. Wenn sie keinen signierten API-Aufruf aufzeigen können, beweist es, dass sie gelogen haben und nicht ehrlich waren.
- Eines Tages werden die Exchanges nach dem Gateway-Protokoll arbeiten

Dein Vorschlag, eine öffentliche Blockchain für die interne Bilanz des Gateways zu haben, ist interessant. Die internen Transaktionen auf eine öffentliche Blockchain zu legen, könnte die Exchanges aufrichtig halten, während die Privatsphäre der User gewährleistet bleibt.
