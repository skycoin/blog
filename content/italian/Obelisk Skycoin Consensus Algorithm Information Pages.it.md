+++
title = "Obelisk: Skycoin Consensus Algorithm | Information Pages"
tags = [
    "Consensus",
    "Obelisk",
]
bounty = 10
date = "2017-09-09"
author = "johnstuartmill"
image = "img/obelisk-the-skycoin-consensus-algorithm.png"
aliases = [
	"/it/overview/obelisk-skycoin-consensus-algorithm-information-pages"
]
+++

- [Punti Salienti del Consenso](#punti-salienti-del-consenso)
    - [Perchè Consenso](#perch%C3%A8-consenso)
    - [Elevata Scalabilità e Basso Consumo Energetico](#elevata-scalabilit%C3%A0-e-basso-consumo-energetico)
    - [Robusto ad Attacchi Coordinati](#robusto-ad-attacchi-coordinati)
    - [“Attacco del 51 Percento”](#%E2%80%9Cattacco-del-51-percento%E2%80%9D)
    - [Indirizzi IP Nascosti](#indirizzi-ip-nascosti)
    - [Indipendenza dalla Sincronizzazione d'Orologio](#indipendenza-dalla-sincronizzazione-dorologio)
    - [Due Tipi di Nodi: Consenso e Block-making](#due-tipi-di-nodi-consenso-e-block-making)
- [Come Funziona l'Algoritmo di Consenso Skycoin](#come-funziona-lalgoritmo-di-consenso-skycoin)
- [Referenze](#referenze)

## Punti Salienti del Consenso

### Perchè Consenso

L'algoritmo di consenso skycoin ("Obelisk") sincronizza lo stato della blockchain Skycoin
attraverso tutti i nodi della rete. Ciò risulta in una contabilità coerente,
es: quando si calcola il saldo per una data chiave pubblica (o indirizzo)
si ottiene lo stesso valore su ciascun nodo che ha eseguito il calcolo.

### Elevata Scalabilità e Basso Consumo Energetico

Di design, l'algoritmo è scalabile e computazionalmente economico, alternativo
al proof-of-work, di conseguenza sia l'algoritmo di consenso sia
il block-making possono essere eseguiti su hardware poco costoso con basso
consumo energetico, rendendo così la rete della cryptovaluta più robusta
ai tentativi di centralizzazione (es: via nodo essendo accessibile
al grande pubblico).

### Robusto ad Attacchi Coordinati

il nostro algoritmo di consenso (i) copertura veloce, (ii)richiede un
traffico di rete minimo, e (iii) può resistere a un attacco coordinato
su grande scala da parte di una rete ben organizzata di nodi malevoli.
L'algoritmo è non iterativo, veloce, può essere eseguito su una rete
sparsa con solo la connettività più vicina (es: sulla Mesh Network), e
funziona bene in presenza di cicli nel grafico di connettività (es:connettività
DAG-type is *not* required).

### “Attacco del 51 Percento”

In senso limitato, la versione base dell'algoritmo può essere soggetta
a questo attacco. Specificamente, quando i nodi modificati o malevoli
trasmettono la maggiorparte un blocco candidato conforme al protocollo
e conforme UTXO, tale blocco vince il consenso. Comunque, con qualsiasi tipo
di inadempienza viene lasciato dall'algoritmo (immodificato) prima che il
blocco abbia la possibilità di partecipare al processo di consenso.

I nodi di consenso possono opzionalmente utilizare un concetto di Web-of-Trust così
che i messaggi relativi al consenso che vengono da nodi sconosciuti (es:
firmati da una chiave pubblica non attendibile) sono ignorati.

Quando la modalità Web-of-Trust è abilitata, avviare un elevato numero
di nodi di consenso malevoli per (a) causare un fork della blockchain o (b)
disgregare il processo di consenso dovrebbe avere un effetto piccolo, salvo che
una vasta maggioranza di membri Web-of-Trust involontariamente includa qui nodi
malevoli nella loro lista locale di nodi fidati.

### Indirizzi IP Nascosti

I nodi sono indirizziati dalla loro chiave pubblica crittografica. L'indirizzo
IP dei nodi è conosciuto solo ai nodi al quale si è collegati direttamente.

### Indipendenza dalla Sincronizzazione d'Orologio

L'algoritmo non utilizza un “orologio a muro” (es: data del calendatio/tempo).
Invece, numeri di sequenza di blocco che vengono estratti da un consenso
convalidato da messaggi correalti - e blockchain- sono usati per calcolare
il tempo interno del nodo. Ciò può essere informalmente chiamato “block clock”.

### Due Tipi di Nodi: Consenso e Block-making

Un nodo di consenso riceve il suo input da uno o più nodi block-making.
Gli algoritmi per il consenso e il block-making sono separati, tuttavia
essi operano sulla stessa struttura dati. Parliamo di block-making dove
aiuta a capire l'algoritmo di consenso e come esso interagisce con il
resto del sistema.

Entrambi i tipi di nodi compiono sempre la verifica di paternità e il
rilevamento di frodi della data in arrivo. Messaggi fraudolenti o invalidi
vengono rilevati, lasciati cadere e mai propagati; nodi impegnati in atività
sospette sono disconnessi, e le loro chiavi pubbliche bandite.

## Come Funziona l'Algoritmo di Consenso Skycoin

Solo a scopo di esposizione, la descrizione seguente presuppone che (i)
ogni nodo è sia block-maker sia partecipante al processo di consenso, e (ii)
 sono accettati i messaggi di consenso generati da nodi non attendibili,
es: nessun filtro basato sul web-of-trust viene eseguito. una
implementazione completa (senza queste ipotesi semplificative) sarà
disponibile sull'archivio di Skycoin su Github. Per risultati di simulazione e un
dettagliato, esempio schematico sul processo di conenso, vedere [\[1\]](#references).
una simulazione di una rete con relazione di fiducia, sebbene usi un
algoritmo diverso da quello di Skycoin, può essere trovato in [\[2\]](#references).
Segue la descrizione dell'algoritmo di consenso di Skycoin.

1.  *Block-making*. ogni nodo block-making colleziona nuove
    transazioni, le verifica contro il UTXO del numero in sequenza
    desiderato, impacchetta le transazioni conformi in un nuovo blocco, e
    trasmette il blocco alla rete.

2.  *Collecting blocks*. Ogni nodo di consenso colleziona i
    blocchi generati dai block-makers, e li mette in un container
    (separato dalla blockchain) etichettato dalla sequenza numerica del blocco.

3.  *Selecting winning block*. Ogni nodo di consenso, dopo
    aver ricevuto un numero sufficiente di blocchi candidati [^1] o
    dopo aver soddisfatto altri criteri, trova il blocco creato dal
    maggior numero di block-makers. I legami vengono risolti deterministicamente.
    Tale blocco è etichettato “local winner”[^2] e viene aggiunto alla
    blockchain locale. la coppia chiave-valore corrispondente al numero di
    sequenza del blocco del vincitore locale viene eliminato, risparmiando
    così spazio. Il codice hash del vincitore locale
    è trasmesso/annunciato.

4.  *Verification step*. Ogni nodo mantiene statistiche sui vincitori
    locali riportati da altri nodi. Quando i vincitori locali sono stati
    riportati da tutti o la maggior parte dei nodi [^3], il nodo determina il
    vincitore globale per il numero di sequenza particolare. se il vincitore
    globale è il vincitore locale, allora il nodo continua a funzionare
    come sopra. Altrimenti i nodi decidono, basandosi su dati esterni e
    logs locali, tra (a) risincronizzarsi con la rete o
     (b) abbondonare la partecipazione al consenso e/o block-making
    e (c) mantenere la sua blockchain e richiedere una fermata di emergenza.

[^1]: Questo è un parametro configurabile nell'algoritmo.
[^2]: Sotto determinate condizioni ideali, i vincitori locali (per una dato
    numero di sequenza del blocco) sono tutti uguali, es: includere un insieme identico
    di transazioni. la differenza è dovuta alla latenza di rete, alta
    frequenza di transazioni, consegna del messaggio fuori sequenza, perdita del
    messaggio, malfunzionamento o nodi malevoli etc.
[^3]: Questo numero può essere determinato, per esempio, chiedendo ai nodi
      di fiducia di riferire le chiavi private dei loro nodi di fiducia, ricorsivamente.

## Referenze

\[1\] johnstuartmill et al. A Distributed Consensus Algorithm for
Cryptocurrency Networks.
<https://github.com/skycoin/whitepapers/blob/master/whitepaper_skycoin_consensus_v01_jsm.pdf>
2016

\[2\] Houwu Chen and Jiwu Shu. Sky: an Opinion Dynamics Framework and Model
for Consensus over P2P Network.
<https://github.com/skycoin/whitepapers/blob/master/Sky-%20Opinion%20Dynamics%20Based%20Consensus%20for%20P2P%20Network%20with%20Trust%20Relationships.pdf>
201?

*Read more:*

* *[Skycoin Consensus Algorithm Whitepapers](https://www.skycoin.com/whitepapers)*
* *[Obelisk The Skycoin Consensus Algorithm](/statement/obelisk-the-skycoin-consensus-algorithm/)*
