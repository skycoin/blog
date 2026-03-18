+++
title = "Skywire e Viscript"
tags = [
    "Development",
    "Skywire",
]
bounty = 3
date = "2017-08-15"
image = "image/old-messenger.png"
aliases = [
	"/it/skywire/skywire-and-viscript/"
]
+++
## Introduzione


### Viscript

[Viscript](https://github.com/skycoin/viscript) is a cross platform CLI, and application launcher and for cluster management eventually. It is based on signal library as a signal server, so it can manage the signal clients, like node and the components in skywire. It can be run in GUI mode or headless mode.
[Viscript] (https://github.com/skycoin/viscript) è una CLI multipiattaforma un *application launcher* ed eventualmente usato per la gestione dei cluster. Si basa sulla libreria di segnali come i server di segnale, quindi può gestire i client di segnale, come il nodo e i componenti in skywire. Può essere eseguito in modalità GUI o in modalità headless.

#### Viscript GUI Screenshot:

![screenshot](/img/viscript.jpg)

Possiamo aggiungere configurazioni di app nel file config.yaml, come il meshnet-socks-server:

```
  meshnet-socks-server:
    daemon: true
    desc: DESCRIPTION GOES HERE
    path: bin/meshnet/meshnet-run-socks-server
    default_args: []
    help: |
        [1] Text name of app, must be unique
        [2] Node address which app will be talked with. ex 101.202.34.56:9000
        [3] Port which socks server will use for connecting with target host. ex 8000

        Full Example Command:
            start meshnet-socks-server sockssrv0 101.202.34.56:9000 8001
```

Dopo il riavvio di viscript, possiamo controllare le applicazioni che possono essere avviate da viscript, tramite app di comando.

Come puoi vedere nello screenshot, possiamo avviare l'app usando il comando breve `s` (`s apptracker 127.0.0.1: 20000`).

Quindi viscript inizia con un id di sequenza univoco, possiamo eseguire il ping (`ping`), controllare l'utilizzo delle risorse (`ru`) e shutdown (`sd`) attraverso questo id.

### Skywire

[Skywire](https://github.com/skycoin/skywire) è una rete alternativa peer-to-peer che prende il controllo dagli ISP e la restituisce agli utenti. Ci sono diversi componenti al suo interno, il gestore nodo, il nodo e le applicazioni eseguite su meshnet come client vpn, server vpn, client di calze, server di calze e così via.

Tutti i componenti all'interno di Skywire sono basati sulla libreria di segnali come client di segnale. Così possono essere lanciati, gestiti e chiusi da viscript.

## Architettura

#### Diagramma dell'architettura:

------

```
                                   +-----------+-------------+
           +---------------^-----+ |     vpn   |    socks    |
           | controllato da|       +-----------+-------------+
           |               <-----+ |          nodo           |
           v               |       +-------------------------+
                           <-----+ |   manager dei nodi      |
+-------------------+      |       +-------------------------+
|      viscript     |      +-----+ |        messenger        |
+-------------------+--------------+-------------------------+
|                        segnale                             |
+------------------------------------------------------------+
|                         rete                               |
+------------------------------------------------------------+
```

------

Ci sono applicazioni lato client e lato server per ogni servizio, come client VPN e server VPN. Funzionano su Skywire meshnet. Come sappiamo, Skycoin è la valuta di Skywire, quando l'utente inoltra il traffico o fornisce risorse di rete, riceve Skycoin. Allo stesso modo, quando l'utente consuma risorse di rete o media, spende Skycoin. Una volta implementata la misurazione e il regolamento, Skywire genererà monete per il funzionamento della rete.

Nodo, Manager dei nodi e Messenger sono i componenti chiave di Skywire meshnet. Il nodo è un nodo mesh peer to peer. Le applicazioni di servizio si registreranno su Nodo e il loro traffico verrà inoltrato dal nodo. il manager dei nodi gestisce i percorsi tra i nodi in meshnet. Messenger consente agli utenti di controllare i cluster tramite chiave pubblica. Questi sono i capisaldi di Skywire meshnet.

## Sommario

Viscript e Skywire sono ancora sotto pesante sviluppo. Ma abbiamo raggiunto molte eccitanti pietre miliari attorno all'ecosistema skycoin. E stiamo godendo e andando a sbloccare il pieno potenziale di una connessione internet gratuita per il futuro!
