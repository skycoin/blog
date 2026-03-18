+++
title = "Skycoin/CXO vs FileCoin/IPFS"
tags = [
    "Ask the Developers",
    "CXO",
    "Skywire",
]
date = "2017-08-09"
aliases = [
	"/de/ask-the-developers/skycoin-vs-ipfs/"
]
+++

Wir wurden gefragt, was der Unterschied zwischen [CXO](https://github.com/skycoin/cxo) und IPFS ist.

FileCoin hat dieselben Ziele, wie ein Teil der Skycoin-Infrastruktur, aber wählt einen anderen Ansatz.
Sie haben drei separate Protokolle:

- IPLD
- IPFS
- Multi-formats

wohingegen,

- IPLD ist eine Repräsentationssprache für unveränderbare Datenobjekte und Hashes ist.
- IPFS ein Dateisystem ist.
- Multi-formats ein sich selbstdefinierender Datenstandard ist.

Bei Skycoin erfüllt CXO diese drei Sachen auf einmal.

- Multi-formats ist nur ein "Schema" in CXO
- IPLD ist einfach CXO (unveränderbare Datenstrukturen, Hashketten, Replikation, Merkle-Bäume etc.)
- IPFS sind einfach Anwendungen, aufbauend auf CXO (CXO ist ein unveränderbares Objektsystem und Daten sind darin einfach Objekte, benötigen also keine besondere Behandlung, weil sie einfach nur eine Art vom Typ Objekt sind).

FileCoin verwendet "Proof of Storage" (Beweis durch Speicherung). Skycoin hingegegen verwendet einen anderen technischen Ansatz, weil wir denken, dass Proof of Storage zu kompliziert ist und das Problem bzw. den Flaschenhals an der falschen Stelle identifiziert hat. Ausserdem ist es nicht das, was der User möchte.

IPFS/IPLD/FileCoin ist so konzipiert, dass eine Integration in die existierende Web-Infrastrukur und Javaskript notwendig ist. Skycoin implementiert stattdessen von Grund auf ein neues Ökosystem ([skywire](https://github.com/skycoin/skywire), CXO, CX), weil es dem existierenden Ökosystem an diversen notwendigen mathematischen Eigenschaften mangelt (JavaScript ist nicht deterministisch, Implementierungen variieren zwischen Browsern, es kann nicht dazu verwendet werden um Blockchains einzubetten und das volle Potential kann es auch nicht entfalten, da vererbte Probleme bestehen).

Dazu kommt, dass Privatssphäre und Sicherheit nicht etwas ist, das mit Klebeband auf die oberste Schicht eines Stapels geklebt werden kann, sondern es erfordert das richtige, aufeinander aufbauende, Design der Komponenten - bei der Hardware beginnend.
Skycoin wählt einen strikten und eleganten, mathematischen Ansatz, der mittels einem eigenständigen Standard, sowie zugehörigem Ökosystem, eine einfachere Implementierung erlaubt.

FileCoin wird sich also in das existierende Internet integrieren und einfach eine zu importierende Javascript-Bibliothek sein. Skycoin will ein neues Internet schaffen, mit zugehörigen Protokollen und Hardware.

Der grobe und falsche Zuordnungsvergeich wird immer geschehen. Skycoin wählt die Herangehensweise, die Komponenten auf das Minimum zu reduzieren, netzunabhängig und mit minimalen Abhängigkeiten der Module. Einer der Gründe, weshalb wir "Proof of Storage" nicht als Anreiz gewählt haben, war, dass Datenspeicherung dann notgedrungen auf der Blockchain stattfinden müsste. Wir finden, dass die Datenspeicherung, auch ohne den Mehraufwand einer Blockchain, schon effizient funktioniert - dies ist also nicht der richtige Weg um den Usern Anreize zu bieten.

Wir wollten nicht ein "neues Internet" aufbauen, dass wie ein Spielautomat herunterfährt, weil der User nicht genug Münzen eingeschmissen hat. Wir wollten keine Nutzererfahrung, in der man für jede, eigentlich kostenfreie, Aktion - ob Klick, Datendownload oder sonstige Aktivitäten - bezahlen muss.

Maidsafe, Ethereum, FileCoin/IPFS wählen also alle einen verschiedenen Ansatz und haben verschiedene Philosophien, streben aber in dieselbe Richtung. Es gibt jedoch substantielle Unterschiede im Anwendungsbereich und in der technischen Implementierung.

-Ethereum versucht alle Daten auf eine einzige Blockchain zu packen (wohingegen Skycoin fast nichts ,außer Zahlungen, auf die Blockchain packt. Skycoin hat individuelle Blockchains für seine Version der ERC20-Tokens, anstatt alle Token auf eine monolithische Blockchain zu packen).
-Maidsafe sorgt sich um die Identität der Nutzer und hat die geringste Blockchaingröße (während Skycoin globale Identitäten hat. Identitäten sind einfach nur öffentliche Schlüssel und sind Pseudonyme).
-FileCoin ist auf Proof of Storage bedacht und zwar ausschließlich Datenspeicherung (Speicherung enthält zudem Kommunikation und Berechnung als Primitive. Skycoins Speichermechanismus ist unabhängig von der Blockchain und wird nur indirekt monetarisiert).
-Golem ist darauf fokussiert Server bzw. GPUs zu vermieten und dafür einen bestimmten Beitrag pro Stunde zu erhalten (was dasselbe wie EC2 ist, das Bitcoin nimmt und nur ein kleineres Feature aus einem viel fortgeschritteren Netzwerk ist).

Eines der Probleme des Skycoin-Projekts ist, dass die Dokumentation und die [Whitepapers](https://www.skycoin.com/whitepapers.html) nur den Konsens-Algorithmus abdecken (schon zwei Jahre alt) und nicht die aktuelle Entwicklung und das entstandene Ökosystem zeigen. Die Website muss also aktualisiert werden und wir müssen neue Whitepaper über die diversen Unterprojekte schreiben.

Die Entwicklung ist der Dokumentation signifikant voraus. Zum Beispiel die CXO-Anwendungen ([BBS](https://github.com/skycoin/bbs)) sind schon in der Testphase , also in der beginnenden Verwendung, wobei die Whitepaper über CXO noch nicht einmal geschrieben worden sind.

Wir haben im Marketing und der Kommunikation noch einiges an Aufhohlbedarf, um mit dem technischen Fortschritt aufzuschließen.
