+++
title = "Funktioniert die 51%-Attacke bei Skycoin?"
tags = [
    "Statement",
    "Obelisk",
    "Consensus",
]
bounty = 8
date = "2017-10-07"
aliases = [
	"/de/statement/can-skycoin-be-51-attacked/"
]
+++

*Dies ist ein archivierter Post aus dem Bitcointalksthread vom 16. Februar 2015.*

> Zitat von: **iamback** am 16. Februar 2015 um 09:28:38 morgens

> Ein nicht PoW-basierter Konsens ist bei der Fertigstellung bereits tot (DOA), denn es ist nicht genügend Zeit übrig um die Probleme zu beseitigen, bevor die globale Wirtschaft in 2016 zusammenbrechen wird. Zum Beispiel wurden die eigennützigen Miningattacken jahrelang nicht erkannt (oder sagen wir mal, weitgehend geprüft und anerkannt), nachdem Satoshi PoW vorgestellt hat. Deshalb wird der seröiöse Markt keinem neurartigen nicht-PoW-Konsens vertrauen. Stattdessen habe ich ein PoW-System kreiert, dass viele der Probleme, die Bitcoin plagen, beseitigt, eingeschlossen der ASICS-Ökonomie. Einige Hinweise sind in meinem oberhalb verlinkten Post.

> Ich habe zudem eine gewisse mathematische Intuition, dass das Vermeiden der 51%-Attacke immer ein Handel mit der Sicherheit sein wird.

Bei Skycoin spielt die 51%-Attacke keine Rolle. Das Netzwerk könnte 20-mal pro Tag von ihr betroffen sein und es würde sich fast niemand dafür interessieren.

Skycoin hat andere mathematische Eigenschaften als Bitcoin und ist unnachsichtiger. Wenn jemand Coins zwischen fünf Leuten hin und her handelt, beeinflusst die 51%-Attacke sie nicht. Man benötigt einen privaten Schlüssel von jemandem in der Transaktionskette um Schaden mit einer 51%-Attacke verursachen zu können. Es gibt keine Transaktionsgestaltbarkeit in Skycoin. Fast jeder wird exakt dieselben Ausgaben, Bilanzen und Transaktionschroniken auf der originalen, als auch auf der abgezweigten Chain haben, bis auf den Angreifen und einige Leute, die mit ihm Coins gehandelt haben. Wenn es eine Abspaltung (fork) der Chain gibt, kopiert diese nur die Transaktionen der anderen Chains herüber.

Die 51%-Attacke wird nur Leute beeinflussen, die Tageshandel mit zwielichtigen Gestalten betreiben oder Glücksspielseiten nutzen. Es wird die kommerziellen Transaktionen nicht sonderlich beeinflussen. Wenn ein Exchange anständige Sicherheitsvorkehrungen hat und die Wallets der User abgetrennt aufgewahrt, hat die schlimmste Attacke sehr milde Auswirkungen.

Bitcoin verfügt über ein Transaktionsvolumen von 100 Millionen Dollar pro Tag. Das absolute Transaktionsvolumen von Bitcoin liegt bei etwa 200,000 Bitcoins. Bitcoin hat Transaktionsgestaltbarkeit, was bedeutet, dass wenn jemand eine 51%-Attacke ausführt und die Transaktionen der letzten Stunde zurückdreht, etwa 4 Millionen Dollar und 10,000 Bitcoin in Transaktionensbilanzen verbockt werden. Eine Rücklauf-Attacke, die 24 Stunden zurück geht, könnte 100 Millionen und 200,000 Bitcoins an Schaden verursachen. Ein Angreifer könnte jedwede Transaktion in Bitcoin zurückdrehen.

Bei Skycoin können sie die Transkationskette nicht beeinflussen oder modifizieren, ohne den privaten Schlüssel einer Adresse in der Kette der Transaktionen zu kennen. Wenn also fünf Banken unter sich handeln und alle eine gute Walletsicherheit haben, bekommen sie eine 51%-Attacke nichtmal mit. Die Kontostände bleiben gleich. Das ist basierend auf der Annahme, dass die 51%-Attacke mathematisch möglich ist, dass jemand sich also so darum schert, dass er die Ressourcen aufbringt um es zu versuchen und das dies dann auch noch erfolgreich ist.

Wenn jemand es fertig bringt eine 51%-Attacke auf Skycoin durchzuführen (was vielleicht möglich ist, aber mathematisch unwahrscheinlich),  werden die Kaufleute singend und tanzend vor Freude durch die Gegend hüpfen, denn die Verluste werden viel geringer sein, als bei einer Visa-Rücklastschrift. Viele Händler verkaufen Laptops und machen weniger als 5%-Marge pro Laptop. Wenn jemand behauptet, den Laptop nicht erhalten zu haben, erleidet der Händler 1000$ Verlust, bekommt den Laptop nicht zurück und muss die Gebühr von 80$ an Visa bezahlen. Das Unternehmen muss 25 Laptops verkaufen um die Kosten des einen Betruges zu kompensieren. Wenn jemand eine Kreditkarte stielt und einen Laptop damit kauft, kommt Visa nicht für den Verlust auf, sie wälzen den Verlust auf den Händler ab.

Der Skycoin Konsens-Algorithmus und das Konto sind separat. Der Konsens-Algorithmus ist modular und kann ausgetauscht werden. Wenn es in fünf Jahren einen besseren Algorithmus gibt, können wir den Konsensprozess einfach austauschen. Das Konto und der Kontostand bleiben komplett unverändert.

Skycoin:

- behebt exisitierende Probleme von Bitcoin
- zukunftssicherer Bitcoin
- beendet die Todesspirale, in die sich Bitcoin eingewickelt hat.

Es ist zu 100% wahr. Es gibt mehrere Trade-offs. Zum Beispiel schnellere Konsenszeiten für den Skycoin relatierten Konsens bedeuten, dass eine kleinere Menge von Knoten benötigt werden, um das Netzwerk zu DDossen. Jedoch können die Leute trotzdem reagieren und die Leute von ihrer Liste der vertrauenswürdigen Knoten werfen.

Es wird Probleme geben und diese werden gelöst werden müssen.

## Skycoins Transaktionsstruktur

https://github.com/skycoin/skycoin/blob/master/src/coin/transactions.go

Eine Skycoin Transaktion ist:

1) Eine Liste von Outputhashes, welche ausgegeben werden
2) Eine Liste der Signaturen, welche den Output authorisieren ausgegeben werden zu dürfen (Signaturhashes des inneren Teils
   der Transaktion)
3) Eine Liste der Outputs die erstellt werden

Coins können nicht erschaffen oder zerstört werden. Die Anzahl der Eingabe an Coins muss gleich Anzahl der Coins der Ausgabe sein. Transaktionsgebühren werden in "Coinhours" abgerechnet.

## Skycoin unterstützt Coinjoin von Geburt an

Es gibt keinen Unterschied zwischen normalen und Coinjoin-Transaktionen.

- Zwei Leute wählen ihre Ausgaben die sie ausgeben möchten, die Ausgaben die sie erstellen möchten und den Remoteserver.
- Der Server erstellt die Transaktion und rührt die Befehle zu Ausgaben der Eingehenden und Ausgehenden zusammen.
  Sendet diese anschließend zu jeder Person.
- Jede Person sendet ihre Signatur für ihre Ausgabe an den Server.
- Der Coinjoin-Server injiziert die Transkation in das Netzwerk.

- Der Coinjoin-Server kann keine Coins stehlen.
- Nur der Coinjoin-Server weiß, wieviele Personen involviert sind (1, 2, 4?).
- Nur der Coinjoin-Server weiß, welche Ausgaben zu welchen Personen gehören.
- Es gibt keinen erkennbaren Unterschied zwischen Coinjoin und normalen Transaktionen.

Die Signatur im `i-ten`-Slot gehört zur Adresse der `i-ten`-Ausgabe. Der Hash des inneren Teils der Transaktion wird aus den ausgegebenen Ausgaben gehasht und wird dann mit dem privaten Schlüssel des Ausgabenbesitzers signiert.

Dies ist also sehr schlicht, verglichen mit anderen Coinjoin-Systemen.
