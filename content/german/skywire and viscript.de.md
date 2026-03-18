+++
title = "Skywire und Viscript"
tags = [
    "Development",
    "Skywire",
]
date = "2017-08-15"
image = "img/old-messenger.png"
aliases = [
	"/de/skywire/skywire-and-viscript/"
]
+++
## Einleitung

### Viscript

[Viscript](https://github.com/skycoin/viscript) ist eine plattform-unabhängige CLI, sowie ein Anwendungsstarter und wird letztendlich auch für das Clustermanagement verwendet werden. Es basiert auf einer Signal-Bibliothek, welche als Signal-Server fungiert, sodass es die Client-Signale, ähnlich wie die Knoten & Komponenten in Skywire, verwalten kann. Es kann im GUI-Modus oder im Headless-Modus ausgeführt werden.

#### Viscript GUI Screenshot:

![Screenshot](/img/viscript.jpg)

Wir können App-Konfigurationen im config.yaml file hinzufügen, wie z.B. den meshnet-socks-server:

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
Nachdem viscript neugestartet wurde können wir die Anwendungen, welche von viscript gestartet wurde, mittels Kommando-Anwendungen überprüfen.

Wie man in dem Screenshot erkennt, können wir Anwendungen mit dem Kommando `s` (`s apptracker 127.0.0.1:20000`) starten.

Danach startet viscript mit einer eindeutigen Sequenz-ID und wir können die ID anpingen (`ping`), die Ressourcennutzung überprüfen (`ru`), oder die Anwendung mittels der ID herunterfahren (`sd`).

### Skywire

[Skywire](https://github.com/skycoin/skywire) ist ein alternatives Peer-zu-Peer Netzwerk, dass die Kontrolle den IDA (ISP) entzieht und den Usern zurückgibt. Es enthält etliche Komponenten, Knotenmanager, Knoten und Anwendungen, welche über das Meshnet (vermaschtes Netz) als eine Art VPN-Client laufen, VPN-Server, Socks-Client, Socks-Server und so weiter.

Alle Komponenten aus Skywire basieren auf einer Signal-Bibliothek und agieren als Signal-Client. Sie können also via viscript gestartet, verwaltet oder heruntergefahren werden.

## Architektur

#### Architektur-Diagramm:

------

```
                                   +-----------+-------------+
           +---------------^-----+ |     vpn   |    socks    |
           | verwaltet von |       +-----------+-------------+
           |               <-----+ |          Knoten         |
           v               |       +-------------------------+
                           <-----+ |       Knotenmanager     |
+-------------------+      |       +-------------------------+
|      viscript     |      +-----+ |        messenger        |
+-------------------+--------------+-------------------------+
|                        Signal                              |
+------------------------------------------------------------+
|                         Netz                               |
+------------------------------------------------------------+
```

------

Für jeden Service gibt es clientseitige und serverseitige Anwendungen, wie den VPN-Client und den VPN-Server. Sie laufen über das Skywire-Meshnet. Wie bereits bekannt, ist Skycoin die Währung von Skywire und wenn ein User Traffic weiterleitet, oder Netzwerkressourcen bereitstellt, erhält er oder sie Skycoin als Vergütung. Gleichermaßen werden Skycoin ausgegeben, um Netzwerkressourcen zu verbrauchen, oder Medien zu konsumieren. Sobald die Gebührenerfassung und die Begleichung implementiert sind, wird Skywire Coins, für das Betreiben des Netzwerks, generieren.

Knoten, Knotenmanager und der Messenger sind zentrale Komponenten des Skywire-Meshnet. Knoten sind Peer-zu-Peer Meshknoten. Service-Anwendungen registrieren sich bei einem Knoten und deren Traffic wird über den Knoten weitergeleitet. Der Knotenmanager verwaltet die Routen zwischen den Knoten im Meshnet. Der Messenger erlaubt es den Usern, Cluster, über deren öffentliche Schlüssel anzusehen. Dies sind die Eckpunkte des Skywire-Meshnet.

## Zusammenfassung

Viscript und Skywire sind immernoch unter heftiger Entwicklung. Wir haben jedoch viele spannende Meilensteine rund um das Skycoin-Ökosystem erreicht. Wir genießen es, das volle Potential eines freien Internets der Zukunft freizuschalten!
