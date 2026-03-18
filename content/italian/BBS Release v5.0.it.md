+++
title = "Skycoin BBS v5.0 Release Announcement"
tags = [
    "Development",
    "BBS",
    "CXO",
]
bounty = 1
date = "2017-12-18"
aliases = [
	"/it/bbs/bbs-release-v5.0/"
]
+++

Skycoin BBS v5.0 è stato finalmente rilasciato con molti cambiamenti sotto il cofano!

## Thin Client

Il cambiamento più evidente di tutti è l'introduzione del thin client. Ora puoi accedere a Skycoin BBS senza impostare un nodo! Basta andare su [bbs.skycoin.com] (http://bbs.skycoin.com).

Nelle versioni precedenti, è possibile (e dovrebbe solo) accedere / inviare contenuti tramite un'interfaccia utente Web che viene offerta localmente. Poiché questa interfaccia web (e l'API che chiama) ha il controllo diretto sul nodo stesso e firma il contenuto con chiavi private che sono archiviate in-node (o lato server), non è appropriato esporlo al pubblico .

Quindi, l'introduzione di un thin-client richiede che la gestione degli utenti e il processo di firma dei contenuti da inviare siano gestiti dal lato client. Ciò richiede un endpoint (o endpoint) di invio dei contenuti completamente rinnovato e pesanti modifiche al front-end.

I dettagli sul nuovo processo di invio dei contenuti possono essere trovati sul Wiki di BBS: [github.com/skycoin/bbs/wiki/Content-Submission-Process](https://github.com/skycoin/bbs/wiki/Content-Submission -Processi).

Attualmente, il front-end si carica molto lentamente. Ciò è causato dall'uso di [GopherJS] (https://github.com/gopherjs) per gestire la generazione di chiavi seed e public / private, nonché la firma e la verifica dei dati. Nelle versioni future, faremo uso di librerie JavaScript native per migliorare le prestazioni.

## Interfaccia della riga di comando

Dopo l'introduzione di un thin client pubblicamente visibile, abbiamo rimosso gli endpoint API che gestivano il controllo amministrativo e introdotto un'interfaccia della riga di comando per gestire tali interazioni.

Maggiori informazioni su questo possono essere trovate qui: [github.com/skycoin/bbs/tree/master/cmd/bbscli](https://github.com/skycoin/bbs/tree/master/cmd/bbscli).

## Altri miglioramenti

* Miglioramenti all'importazione / esportazione (purtroppo questo non è retrocompatibile con importazione / esportazione per BBS v4.x)
* Semplificazioni al codice e miglioramenti delle prestazioni per l'invio e l'interazione a distanza con Skycoin Messenger. Aggiornato per utilizzare l'ultimo Messenger.
* Miglioramento delle prestazioni di gestione dei file.
* Migliore gestione delle radici CXO non valide.
* Migliore gestione delle disconnessioni.

## Download

Per scaricare BBS, vai su [github.com/skycoin/bbs/releases](https://github.com/skycoin/bbs/releases) (il codice sorgente sarà anche qui).

Nota che puoi anche accedere a BBS tramite [bbs.skycoin.com] (http://bbs.skycoin.com).

## Documentazione

Abbiamo avviato una pagina wiki su [github.com/skycoin/bbs/wiki](https://github.com/skycoin/bbs/wiki).

Si prega di capire che questo è ancora in corso di lavorazione.

## Comunità

Abbiamo un canale di Telegram: [@skycoinbbs] (https://t.me/skycoinbbs).
