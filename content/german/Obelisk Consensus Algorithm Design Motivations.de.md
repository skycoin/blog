+++
title = "Obelisk Konsens-Algorithmus Design-Beweggründe"
tags = [
    "Obelisk",
    "Consensus",
    "Skywire",
]
date = "2017-10-26"
bounty = 20
aliases = [
	"/de/statement/obelisk-consensus-algorithm-design-motivations/"
]
+++

*Dies ist ein archivierter Post aus dem Bitcointalksthread vom 19. Juni 2014.*

> Zitat von: yxxyun am 19. Juni 2014 02:52:38

>> Zitat von: skycoin am 19. Juni 2014 02:31:59.

>>> Zitat von: FrictionlessCoin am 18. Juni 2014 21:15:07

>>>> Zitat von: skycoin am 18. Juni 2014 um 21:08:56

>>>> Entwicklungsupdate:

>>>> Wir haben einen Weg herausgefunden, wie Sybil-Attacken durch die Verwendung
     eines hybriden Proof-of-Stake-Systems verhindert werden können.

>>>> Um einen Knoten zu erstellen, muss man erst beweisen, dass man Coins besitzt.
>>>> Sagen wir 10 Coins. Man sendet 10 Coins zu Adresse A. Dann sendet man 10 Coins
>>>> von Adresse A zu Adresse B. Dann führt man eine Signature hinzu, indem man den
>>>> öffentlichen Schlüssel von A nutzt um die Nachricht in seiner
>>>> Obelisk-Blockchain zu signieren.

>>>> Alternativ kann man seinen öffentlichen Schlüssel für die Adresse A bekanntgeben
>>>> und dann einfach eine Nachricht mit diesem öffentlichen Schlüssel signieren.
>>>> Der Knoten muss dann in einem bestimmten zeitlichen Intervall, oder innerhalb einer
>>>> bestimmten Anzahl von bewegten Reserve-Blöcken eine Signatur bekanntgeben, um
>>>> die Vertrauensbeziehung mit anderen Peers aufrecht zu erhalten.

>>>> Alternativ kann man Proof of Burn erfordern (Beweis durch verbrennen), bei dem
>>>> die Coins von Adresse A zu Adresse B gesendet werden, für welche kein privater
>>>> Schlüssel bekannt ist. Proof of Burn kollidiert aber mit dem Vorsatz, dass niemand
>>>> die gesamte Blockchain herunterladen muss um einen Knoten laufen lassen zu können,
>>>> ist also eher unwahrscheinlich.

>>>> Dieses System begrenzt die Anzahl von Obelisk-Knoten nach oben und beschränkt
>>>> die Fähigkeit Obelisk-Knoten laufen zu lassen auf Coin-Besitzer.
>>>> Die obere Grenze der Anzahl der Knoten und die Coin-Bedingungen fügen eine
>>>> weitere Schicht gegen die Sybil-Attacke hinzu.

>>> Bin mir nicht sicher, wie das eine Sybil-Attacke verhindern soll.
>>> Fügt ihr nicht einfach nur Kosten für das Hinzufügen eines Knoten zum Netzwerks hinzu
>>> und deshalb verursacht eine Sybil-Attacke finanzielle Kosten?

>> Dies ist aktuell nur eine Idee. Habe eine Verbesserung gefunden. Jeder Obelisk-Knoten
>> hat einen öffentlichen Schlüssel. Wir hashen diesen öffentlichen Schlüssel
>> zu einer Adresse und diese speichert dann 10 Coins in einer Ausgabe,
>> welche von dieser Adresse besessen werden.

>> Es werden keine Kosten hinzugefügt. Es beweist nur, dass man 10 Coins besitzt.
>> Es beweist, dass man den privaten Schlüssel für einen öffentlichen kennt,
>> wessen Adresse 10 Coins aufweist. Man kann diese Coins immernoch ausgeben.

>> Die Idee ist, die obere Grenze der Anzahl von Knoten zu begrenzen. Wenn 10 coins
>> gehalten werden müssen und es insgesamt 100 Millionen Coins gibt, begrenzt es das Netzwerk
>> nach oben auf 10 Millionen Knoten. Die obere Grenze scheint aktuell mathematisch nicht
>> nützlich zu sein, aber sie ist etwas, was wir im Hinterkopf behalten sollten.

>> Wenn ein Obelisk-Knoten betrieben wird, "vertraut" dieser zufälligen Peers.
>> Der User kann einige Knoten, welchen vertraut werden soll, von Hand eingeben (Exchanges oder
>> vertrauenswürdige Community-Mitglieder). Ein Knoten wird mit dem Hash seines
>> öffentlichen Schlüssels identifiziert über DHT gefunden. Es ist nicht wie bei Bitcoin,
>> wo Knoten IP:Port-Paare sind. Man kann seinen Computer herumbewegen und die Identität
>> des Knotens beruht nicht auf der IP-Adresse.

>> Wir wollen, dass das Netzwerk sicher ist, indem zufällige Knoten gewählt werden.
>> Wir wollen keine Situation wie bei Ripple, in der drei Entwickler das Netzwerk
>> kontrollieren. Jedoch wollen wir auch eine Situation verhindern, in der jemand
>> 200,000 Knoten betreibt und versucht die Vertrauensbeziehung mit neuen Usern einzugehen.
>> Diese Sybil-Attacken-Knoten können immernoch, im Allgemeinen, keine 51%-Attacke ausführen,
>> aber alles Mögliche, dass die Kosten der Attacke erhöht ist sinnvoll.

>> Vielleicht werden wir es so begrenzen, dass neue User nur zufällig gewählten Knoten vertrauen,
>> welche eine Coinbilanz aufweisen. Vertrauensbeziehungen würden nicht getrennt werden, wenn der Knoten
>> keine Coinbilanz aufweisen kann, aber sie würden keine neuen zufälligen User erhalten.

>> Der Konnektivitätsgraph für Vertrauensbeziehungen sollte vermeintlich ein komplett
>> verbundener Zufallsgraph sein. Einige Knoten (vertrauenswürdige Community-Mitgleider, Exchanges,
>> Webseiten, Organisationen) werden eine höhere Anzahl an Vertrauensbeziehungen haben, was
>> der Konvergenzzeit des Block-Konsens zu Gute kommt. Es reduziert den Netzwerkdurchmesser
>> ein wenig. Einige Knoten werden verwendet werden um den Konsens zu verifizieren (man wählt
>> ein Haufen von Exchanges oder verschiedene öffentliche Schlüssel), diese Knoten beeinflussen
>> den Konsensprozess nicht, aber fungieren als "Konsensorakel" um zu überprüfen, ob der Knoten
>> mit dem Netzwerk übereinstimmt.

>> Wenn zwei große Exchanges zu einem unterschiedlichen Konsens für einen bestimmten Block kommen,
>> ist das ein Problem. Dies könnte auf einen Netzwerkspalt hindeuten oder auf eine Attacke auf
>> das Netzwerk. Exchanges könnten den Handel bis zur Behebung des Problems aussetzen wollen.

> Obelisk ist Skycoins verteilter Konsensknoten? Ich dachte immer der Skycoind ist der Knoten...

Genau.

Skycoin hat eine Blockchain. Die Blockchain ist auf
https://github.com/skycoin/skycoin/tree/develop/src/coin.
Diese gliedert die Blöcke auf und kümmert sich um unausgegebene Ausgaben und Transaktionen.

Skywire ist der Daemon und hat eine "Service-Architektur". Er kann auf Services laufen,
wie Blockchain synchronisierenden Services und anderen Dingen. Das Meshnet (vermaschtes Netz) ist
zurzeit auf Skywire aufbauend implementiert (obwohl dies sich dies ändern könnte).

Der Konsensmechanismus findet unabhängig von der Blockchain statt. Obelisk-Knoten (welche
vermutlich als ein Skywire-Service implementiert werden) haben eine Blockchain. Jeder Knoten hat
einen öffentlichen Schlüssel. Dieser öffentliche Schlüssel identifiziert den Obelisk-Knoten.
Jeder Obelisk-Knoten hat eine eigene Blockchain (es gibt auf dieser Chain keine Coins).
Der Knoten erschafft einen neuen Block und signiert diesen mit seinem privaten Schlüssel.
Die Obelisk-Blockchain wird verwendet, um den Konsens zu verhandeln (den neuen Head in der
Skycoin-Blockchain bestimmen). Obelisk verwendet Ben-Ors für den zufälligen Konsens. Jeder Obelisk-Knoten
hat seine Liste von anderen Knoten, die er abonniert hat. Diese Knoten beeinflussen den Konsens
und die Abstimmungsentscheidungen für den lokalen Knoten. Für nicht-pathologische Netzwerktopologien
passt sich der lokale Konsens nachweislich dem globalen Konsens an.

Jeder Knoten stimmt über den nächsten Block in der Chain ab. Ein Knoten schlägt
den nächsten Knoten vor und die Knoten stimmen dann über diesen Nachfolger ab.
Die Stimmen werden in den Obelisk-Blockchains eines jeden Knotens veröffentlicht.
Dein Knoten stimmt zufällig über Alternativen ab und wechselt seine Entscheidung
nach einer Weile. Sobald 40% deiner Peers (die Knoten, die du abonniert hast) einen Konsens
erreicht haben, wechselt man zu diesem Kandidaten. Das Netzwerk kann auf mehreren Abzweigungen
auf einmal abstimmen, dies verlangsamt nicht das Warten auf einen Konsens. Die Abzweigungen
werden mit der Zeit auf einzelne Chains zurechtgestutzt. Aufteilungen von zwei oder drei Blöcken sind normal,
aber nach einigen Bestätigungen wächst die Wahrscheinlichkeit, dass ein Block zurückkehrt
exponentiell gegen 0. Wenn eine Transaktion auf allen Chains der Kandidaten ausgeführt wurde,
dann ist sie im Wesentlichen ausgeführt, selbst wenn sich die betreffende
Konsens-Chain noch nicht entschieden hat.

Das ist binärer Ben-Ors und Skycoin wird etwas verwenden, was ein wenig schneller und weiterentwickelter ist,
wenn mehrere potentiell nachfolgende Blöcke aus dem Netzwerk zur Auswahl stehen. Randomisierung ist wichtig
um die Teilgraphen des Netzwerks am feststecken zu hindern. Der Abstimmungsprozess ist eine Form des "Glühens",
bei der jeder Knoten unabhängig voneinander zum globalen Konsens findet, ausschließlich bedingt
durch seine lokal verfügbaren Informationen.

Der Konsensprozess findet in der Öffentlichkeit statt. Ein Knoten veröffentlicht Blöcke, signiert diese mit
seinem privaten Schlüssel und diese Blöcke werden Peer-zu-Peer zwischen den Abonnenten der Chain repliziert.
Es gibt dann keine "Konsensorakel", was Knoten sind, die genutzt werden um den Konsens zu verifizeren,
diesen aber nicht beeinflussen. Man wählt also den öffentlichen Schlüssel einiger Exchanges und einigen
vertrauenswürdigen Community-Mitgliedern und dein Knoten wird diese verwenden um zu bestimmen,
falls mal etwas nicht ganz richtig sein sollte. Dies wird verwendet um ein Spalten des Netzwerks zu verhindern.
Ebenso schützt dies vor einer Attacke, bei der ein Hacker den eigenen Router kontrolliert
und somit auch Einfluss darüber hat, zu welchen Peers man eine Verbindung aufbauen kann.

Wenn ein Knoten im Netzwerk auftaucht und versucht das Netzwerk zur Akzeptanz einer anderen Chain
zu bekommen (51%-Attacke, umkehren der Transaktionen), wird er üblicherweise ignoriert.
Die meisten 51%-Attacken benötigen bösartiges Knotenverhalten, was automatisch erkannt wird und darin endet, dass
abonnierte Knoten diesen bösartigen Knoten von ihrer Vertrauensliste streichen. Die einfachste Strategie der
51%-Attacke ist mathematisch simpel zu beweisen, nämlich das versucht wird Transaktionen umzukehren, denn
dies erfordert das Rückdatieren von Block-Konsensentscheidungen.
Dies erfordert das veröffentlichen von zwei signierten Blöcken mit derselben Sequenznummer, wir haben daraus also
eine automatisch verbannende Straftat für einen Knoten gemacht.

Wir versuchen die letzte Möglichkeit der 51%-Attacke zu eliminieren, welche so funktioniert,
dass ein Teilnetzwerk der Knoten offline geht (Netzaufspaltungsattacke), sich dann
wieder mit einer anderen Konsens-Blockchain zusammenschließt und versucht diese dem Netzwerk aufzuzwängen
um Transaktionen rückgangig zu machen. Die meisten dieser Attacken werden fehlschlagen, weil das
Teilnetzwerk nicht genügend Einfluss haben wird.

Diese Attacke ist schwierig zustande zu bringen. Im Falle einer erfolgreichen 51%-Attacke ist eine Lösung,
das gesamte Netzwerk einzufrieren und jeden User/Knoten individuell auswählen zu lassen, welche Chain
die valide ist und die attackierenden Knoten manuell bannen zu lassen.
Das Konsensorakel erlaubt jedem Knoten mit hoher Wahrscheinlichkeit zu wissen, ob der Zustand synchronisiert ist
und ob der globale Konsens erreicht wurde oder ob sie ein Teil des Teilgraphen der Netzaufspaltung sind.
Wir glauben, dass es für jeden Knoten möglich ist, anhand gegebenen lokalen Informationen, mit hoher Wahrscheinlichkeit zu wissen, ob ein Knoten während eines Konsensprozesses offline war - ist dies der Fall, so soll dieser Knoten,
der offline war und plötzlich aufgetaucht ist und versucht dem Netzwerk eine Chain aufzuzwängen, ignoriert werden.

Bei Bitcoin ist es so, dass wenn man über die meiste Hashingpower verfügt, die Möglichkeit hat Transaktionen umkehren, wann immer es einem beliebt.

Bei Skycoin muss folgendes erfüllt sein um Transaktionen umzukehren:

- Kontrolle über eine große Anzahl von Knoten.
- Die Knoten, welche man kontrolliert, müssen "einflussreich" sein und vertraut sein innerhalb
  der Netzwerktopologie.
- Deine Knoten müssen extrem eklatantes pathologisches Angriffsverhalten aufweisen,
  ohne dass dieses Verhalten detektiert wird, weil die Detektierung in dem Verlust
  der Vetrauensbeziehung enden würde, welche man benötigt um das Netzwerk anzugreifen.
- Deine Knoten müssten in einer pathologischen Angriffstopologie sein, ohne detektiert zu werden
  (die meisten Bot-Knoten werden von sehr wenigen Menschen Vertrauen erfahren und sehr offensichtlich erkennbar sein).
- Man muss seine kontrollierten Knoten in einer Art und Weise kolludieren, welche in einer
  erfolgreichen Attacke endet (dies ist nicht gerade offensichtlich).
- Wenn die Attacke erfolgreich ist, muss man verhindern, dass das Netzwerk manuell vor die Attacke zurückgesetzt wird
  (Dies ist sehr schwierig, denn Leute werden Coins oder Geld aufgrund der Attacke verlieren).

Um zu beweisen, dass etwas geschützt gegen 51%-Attacken ist, muss man alle Annahmen die man trifft aufschreiben
und ein einfaches mathematisches Model kreieren, anschließend beweisen unter welchen Bedingungen Dinge geschehen können
und unter welchen Bedingungen Dinge nicht geschehen können. Sobald man die Bedingungen kennt, die für eine Attacke
nötig sind, versucht man diese zu eliminieren und wenn man dies nicht kann, macht man sie so schwierig
wie nur irgendwie möglich. Man erhöht die Kosten für die Attacke oder reduziert die Wahrscheinlichkeit,
dass eine spezifische Attacke funktioniert. Dann reduziert man auch den Lohn und den Anreiz, den eine Attacke bereitstellt.

Der Konsensprozess ist ein schlichtes und einfaches Modell, aber nicht gerade intuitiv ohne es betrachten zu können.
Es wird irgendwann eine Javascriptseite geben, welche einen animierten Konsensprozess darstellt,
mit dem man herumspielen kann.
