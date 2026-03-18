+++
title = "Obelisk: Der Skycoin Konsens-Algorithmus"
tags = [
    "Statement",
]
date = "2017-09-08"
image = "img/obelisk-the-skycoin-consensus-algorithm.png"
aliases = [
	"/de/statement/obelisk-the-skycoin-consensus-algorithm/"
]
+++

Die Skycoin-Blockchain nutzt einen neuartigen Typ eines Konsens-Algorithmus mit Namen "Obelisk", welcher Proof of Work ("PoW") und Proof of Stake ("PoS") ersetzt.

Das Ziel der Entwickler von Skycoin war es, die wichtigen Sicherheitslücken und die "zentralisierenden Tendenzen", welche mit Blockchain-Netzwerken, die mit PoW oder PoS-Algorithmen funktionieren und bei denen die Coinerschaffung mit einem Mining-Prozess verbunden ist, assoziiert sind, zu korrigieren. Skycoin versucht somit, eine Cryptowährung zu erschaffen, welche Satoshis originale Vision, eines absolut dezentralen digitalen Währungssystems, besser erfüllt.

Auf diese Weise schafft Skycoin ein Blockchain-Netzwerk, das kein Mining erfordert, eine feste Menge an Cryptotoken, zehnsekündige Transaktionszeiten und besserer Sicherheit hat. In einem System, indem die Coinerstellung und die Kontrolle über das Netzwerk getrennt sind, verlieren Cryptotoken ihre politische Machtposition und werden mehr als eine Art unkomplizierter, digitaler Besitz betrachtet.

## Proof of Work und das Bitcoin-System

Es war eine fundamentale Fehlkalkulation in der frühzeitigen Programmierung von Bitcoin, dass der Mining-Prozess einen ökonomischen Anreiz bieten würde, der die Dezentralisierung vorantreiben würde.
Fakt ist, dass die Verbindung zwischen Konsens und Hashing dazu geführt hat, die Machtanreize, das Konsens-Netzwerk über die, sich stets-erhöhende, Verarbeitungskapazität zu kontrollieren, erhöht hat.

Das Bitcoin-Netzwerk zum Bespiel ist de facto unter der Kontrolle von drei profitablen Mining-Pools, welche es geschafft haben eine große Menge der Hashpower des Netzwerks auf ihren Servern zu konzentrieren. Diese Pools haben begonnen, sich wie ein Kartell zu verhalten und die Hashpower untereinander über Absprachen aufzuteilen. Die Verbindung zwischen Mining und der Kontrolle über das Netzwerk wurde bereits von Satoshi, als nicht-kryptographische Hauptbedrohung der Stabilität des Netzwerks, identifiziert. Es erlaubt denen, welche genügend Rechenkraft ansammeln können, die Mehrheit der Hashrate zu erlangen und somit Transaktionen zu fälschen oder rückgangig zu machen - die 51% Attacke. Einige behaupten, dass diese Schwachstelle weniger dringend ist, da die Teilnehmer mit großer Hashrate glechzeitig großen Summen in Bitcoin investiert haben und ihr Überleben somit von dem hohen Wert des Coins abhängig ist. Dennoch ist die Fähigkeit, das Netzwerk zu beeinflussen, stark konzentriert, was den Zweck einer, auf verteiltem Kontobuch (distributed ledger) basierenden, Cryptowährung verfehlt.

Der PoW-Algorithmus des Bitcoin-Netzwerks führt also zu Sicherheitsproblemen und zur Monopolisierung durch das Verknüpfen der Macht über das Netzwerk mit der Person, die genügend ökonomische Ressourcen hat, um den Mining-Prozess zu kontrollieren.

Dies impliziert, dass der Betrieb des Netzwerks betriebswirtschaftlich und ökologisch ineffizient ist. Das kontinuierliche Hinzuführen von Rechenkraft, welche der Mining-Prozess benötigt, kostet große Mengen an Elektrizität und erzeugt monatliche Kosten in der Höhe von zweistelligen Millionenbeträgen. Diese Kosten können nur mit einem exponentiellen Zufluss von neuem Kapital, einhergehend mit neuen Usern, gedeckt werden. Nur eine kleine Menge der fest etablierten Coins wird es schaffen, solch einen kontinuierlichen Zufluss zu generieren. Im Falle der meisten anderen PoW/PoS-basierten Coins, werden die Mining-Kosten durch das Abwerten des Coins gedeckt, solange bis aufgegeben wird.

> Aktuell besteht das Bitcoin-Wirtschaftssystem darin, dass neue User ihr Geld reinschmeissen und dieses Geld wird dann in einer Grube gesammelt und in einem Ritual den Elektrizitätskosten des Minings geopfert. Wenn der durchschnittliche User die Elektrizitätskosten der Miner direkt als Transaktionskosten bezahlen müsste, würde jede Bitcoin-Transaktion mehr als $50 kosten. Es wäre teurer als ein internationaler Banktransfer.

## Die zentralisierende Tendenz von Proof of Stake

Obwohl der Proof of Stake-Algorithmus das Sicherheitsproblem der 51%-Attacke bekämpft, sind sie sogar noch gefährdeter aufgrund der Zentralisation als PoW-Netzwerke. Bei PoS bestimmt der prozentuale Besitz einer Cryptowährung eines Partizipienten über dessen Authorität und Stimmgewalt bezüglich der Implementierung von technischen Veränderungen im Netzwerk. Partizipienten haben die Möglichkeit eine äquivalente Portion ihres Anteils zu minen, unabhängig von ihrer Rechenkraft.

Dieses Prinzip erhöht die ökonomische Barriere eine 51%-Attacke zu starten signifikant, weil die finanziellen Kosten eine Mehrheit der Tokens zu erwerben, sehr wahrscheinlich die potentiellen Gewinne übersteigt. Wenn ein Angreifer es schafft die Mehrheit der Coins als Stakeholder zu besitzen, dann wird er am größten unter den Auswirkungen der Attacke, bezüglich der Stabilität des Netzwerkes sowie des externen Werts der Cryptowährung, leiden.

Obwohl die Barriere der Netzwerkattacken auf die menschliche Ebene gehoben wurde, verursacht PoS einen zentralisierenden Impuls, der mindestens genauso stark, wenn nicht sogar stärker, als der von PoW ist. Joseph Young fasst dies seinem Vergleich der beiden Systeme auf [coinfox.info](http://www.coinfox.info/) zusammen "Ein System, bei dem der größte Stakeholder umfangreiche Kontrolle und Authorität über technische, aber auch ökonomische Aspekte des Netzwerks hat, verursacht eine bedeutende Monopolproblematik." Während in PoW das Abstimmen über die Implementation von technischen Änderungen des Netzwerks "aufgeteilt (wird) zwischen Minern und anderen essentiellen Mitgliedern der Community", wird im PoS-System "die technische Fähigkeit Änderungen ohne den Willen der Community, Unternehmen, Minern und anderen Entwicklern den größten Stakeholdern eingeräumt. Diese Zentralisation der Abstimmungsmacht, eigentlich also der Kontrolle über das Netzwerk, verfehlt das Konzept einer auf distributed ledger basierenden Cryptowährung, indem es dem kompletten Prinzip, der Verteilung aller Elemente im Netzwerk und der Abwesenheit einer zentralen Behörde, widerspricht."

## Obelisk: Skycoins verteilter Konsens-Algorithmus

Um diese Zentralisationsproblematik anzupacken, schreitet Skycoin über PoW/PoS hinaus.
Ein verteilter Konsens-Algorithmus namens Obelisk wird verwendet, welcher die Einflussnahme in Übereinkunft mit einem Netz des Vertrauens (web of trust), im Netzwerk verteilt. Im Wesentlichen hat jeder Knoten eine Liste der Knoten, die er abonniert hat und die Dichte der Abonnenten eines Knotens bestimmt seinen Einfluss im Netzwerk. Jedem Knoten ist eine persönliche Blockchain zugeteilt, welche als eine Art "öffentlicher Rundfunkchannel" funktioniert, indem alle Aktionen des Knotens sichtbar und einsehbar sind. Da alle Konsensus-Entscheidungen und Kommunikationen auf der persönlichen Blockchain eines Knotens erscheinen, kann die Community die Knoten sehr einfach auf Betrugsfälle oder Kollisionen kontrollieren. Wie Entscheidungen im Netzwerk getroffen werden und welcher Knoten welche Entscheidung beeinflusst, ist vollständig transparent.

Das öffentliche Protokoll der persönlichen Blockchain eines jeden Knotens, erlaubt es dem Netzwerk auf Abtrünnige zu reagieren und die Verbindung mit diesen weniger vertrauenswürdigen oder bösartigen Knoten zu trennen, was zu einem Zusammenziehen des Netzwerks in einen kleineren, aber vertrauenswürdigeren, Kern führt. Infolgedessen hat die Community prinzipiell die Möglichkeit, bei einer zu konzentrierten (oder zu wenig konzentrierten) Einflussmacht, sowie bei Misstrauen gegen knotenbetreibende Personen, die Balance der Power im Netzwerk auszugleichen, indem sie als Kollektiv ihre Vertrauensbeziehung im Netzwerk ändern. Die Rechenschaft der Knoten gegenüber der Community und die Prüfungen von Drittparteien, sowie die Transparenz der Konsensfindung, stärken die Entscheidungsfindung im Kollektiv und führt deshalb ein höchstdemokratisches und dezentrales Element in das Netzwerk ein.

Dieses System bietet einem digitalen Währungssystem viele Vorteile, signifikant reduzierte Transaktionszeiten, keine Benötigung von Mining-Equipment, sowie großartige Sicherheit.

*Lest mehr:*

* *[Skycoin Konsens-Algorithmus Whitepapers](https://www.skycoin.com/whitepapers)*
* *[Obelisk The Skycoin Consensus Algorithm | Information Pages](/overview/obelisk-skycoin-consensus-algorithm-information-pages/)*
