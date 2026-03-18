+++
title = "Motivazioni per la progettazione dell'algoritmo di consenso Obelisk"
tags = [
    "Obelisk",
    "Consensus",
    "Skywire",
]
date = "2017-10-26"
bounty = 20
aliases = [
	"/it/statement/obelisk-consensus-algorithm-design-motivations/"
]
+++

*Questo è un post archiviato da una discussione sul forum BitcoinTalks del 19 giugno 2014*

>Citazione di: yxxyun del 19 Giugno, 2014, 02:52:38 AM

>>Citazione di: skycoin del 19 Giugno, 2014, 02:31:59 AM

>>>Citazione di: FrictionlessCoin del 18 Giugno, 2014, 09:15:07 PM

>>>>Citazione di: skycoin del 18 Giugno, 2014, 09:08:56 PM

>>>>Aggiornamento di sviluppo:

>>>>Abbiamo scoperto un modo per prevenire un attacco Sybil usando un sistema
>>>>Proof of Stake ibrido.

>>>>Per creare un nodo, devi dimostrare di avere monete. Diciamo 10 monete. Invii 10 monete ad un indirizzo A e si inviano le 10 monete dall'indirizzo A all'indirizzo B. Poi aggiungi una firma usando la chiave pubblica nell'indirizzo A per firmare un messaggio nella blockchain di Obelisk.

>>>>In alternativa, è possibile pubblicare la chiave pubblica per l'indirizzo A e quindi firmare un messaggio con tale chiave pubblica. Il nodo dovrebbe pubblicare una firma ogni periodo di tempo, o ogni determinato numero di blocchi di valute di riserva che vengono spostati, per mantenere relazioni di fiducia valide con altri peer.

>>>>In alternativa, può essere richiesta una Proof of Burn (prova di ustione), quando le monete vengono inviate dall'indirizzo "A" all'indirizzo "B" che non ha una chiave privata. La Proof of Burn entra in conflitto con il requisito che nessuno dovrebbe scaricare l'intera blockchain dall'inizio per operare all'interno di un nodo, risulta quindi improbabile.

>>>>Questo sistema superiore limita il numero di nodi Obelisk e limita la possibilità di eseguire nodi Obelisk ai possessori di monete. Il limite massimo del numero di nodi e i requisiti di moneta aggiungono un altro livello di protezione da un attacco Sybil.

>>>Non sono sicuro di come ciò prevenga un attacco Sybil. Stai semplicemente aggiungendo un costo per l'aggiunta di un nodo alla rete e quindi un attacco Sybil richiederebbe un costo finanziario per farlo?

>>È solo un'idea in questa fase. Abbiamo trovato un miglioramento. Ogni nodo in Obelisk ha una chiave pubblica. Facciamo l'hash della chiave pubblica in una direzione e si memorizzano 10 monete in un'uscita di proprietà di quell'indirizzo.

>>Non aggiunge un costo. Dimostra solo di possedere 10 monete. Dimostra che conosci la chiave privata, per una chiave pubblica, il cui indirizzo contiene 10 monete. Puoi ancora spendere le monete.

>>L'idea è che imposti un limite massimo al numero di nodi. Se si devono conservare 10 monete e ci sono 100 milioni di monete, si imposta un limite superiore sulla rete di 10 milioni di nodi. Il limite superiore non sembra matematicamente utile, per ora, ma è qualcosa che dovremmo prendere in considerazione.

>>Quando viene eseguito un nuovo nodo Obelisk, si "fiderà" di alcuni peer casuali. L'utente può anche aggiungere manualmente alcuni nodi di cui si fida (scambi o membri di una comunità fidata). Un nodo è identificato dall'hash della chiave pubblica e trovato da DHT. Non è come Bitcoin dove i nodi sono IP: coppie di porte. Puoi spostare il tuo computer e l'identità del nodo non dipende dal suo indirizzo IP.

>>Vogliamo che la rete sia sicura con i nodi casuali scelti. Non vogliamo una situazione come Ripple, in cui i tre nodi degli sviluppatori controllano la rete. Tuttavia, volevamo evitare una situazione, in cui qualcuno gestisce 200.000 nodi e cerca di raccogliere le relazioni di fiducia dai nuovi utenti. Questi Sybil attaccano i nodi, non possono ancora attaccare il 51% in generale, ma tutto ciò che aumenta il costo dell'attacco è ancora utile.

>>Forse, lo limitiamo in modo tale che il nuovo utente possa fidarsi solo in modo casuale dei nodi che hanno un bilancio di monete. Le relazioni di fiducia non verranno interrotte se il nodo non ha un saldo di moneta, ma non otterranno nuovi utenti casuali..

>>Si presuppone che il grafico di connettività per le relazioni di trust sia un grafico collegato in modo casuale. Alcuni nodi (membri della comunità fidati, case di cambiamento, siti Web, organizzazioni) avranno più relazioni di fiducia e questo aiuterà un po' al momento della convergenza per il consenso sui blocchi. Riduce leggermente il diametro della rete. Alcuni nodi saranno utilizzati per verificare il consenso (si scelgono un gruppo di Exchange o diverse chiavi pubbliche), tali nodi non influenzano le decisioni di consenso, ma sono "oramenti di consenso" per verificare se il proprio nodo è convergente con la rete.

>>Se due grandi Exchange hanno un consenso diverso per un particolare blocco, questo è un problema. Potrebbe indicare un netsplit o un attacco alla rete. Gli Exchange potrebbero voler sospendere il trading fino a quando il problema non sarà risolto.

>Obelisk è il nodo di consenso distribuito di Skycoin? Pensavo che Skycoin fosse il nodo ...

Si.

Skycoin ha una blockchain. La blockchain si trova qui:
https://github.com/skycoin/skycoin/tree/develop/src/coin.
Questo analizza i blocchi e tratta gli output e le transazioni non spese.

Skywire è il "Daemon", e ha una "architettura di servizio". È in grado di eseguire servizi come la sincronizzazione blockchain e altro. La rete mesh è attualmente in fase di implementazione come servizio su skywire (anche se potrebbe dover cambiare).

l meccanismo di consenso è al di fuori della blockchain. I nodi Obelisk (che saranno probabilmente implementati come servizio Skywire) hanno una blockchain. Ogni nodo ha una chiave pubblica. La chiave pubblica identifica il nodo Obelisk. Ogni nodo Obelisk ha la sua blockchain (non ci sono monete in questa catena). Il nodo crea un nuovo blocco e lo firma con la sua chiave privata. Gli Obelisk blockchain sono usati per negoziare il consenso (determinando il blocco in cima nella blockchain Skycoin). Obelisk usa Ben-Or per un consenso casuale. Ogni nodo Obelisk ha una lista di altri nodi a cui si abbona. Quei nodi influenzano il consenso e le decisioni di voto per il nodo locale. Per le topologie di rete non patologiche, il consenso locale converge stabilmente in un consenso globale.

Ogni nodo vota sul prossimo blocco della catena. Un nodo propone il prossimo blocco e i nodi votano sul successore. I voti sono pubblicati nei blocchi nella blockchain di Obelisk per ciascun nodo. Il tuo nodo vota a caso tra l'alternativa e capovolge il suo voto di tanto in tanto. Una volta raggiunto il consenso del 40% dei tuoi peer (i nodi a cui sei iscritto), passa a quel candidato. La rete può votare su più biforcazioni contemporaneamente, non rallenta in attesa di un consenso. Le biforcazioni vengono potate in una singola catena nel tempo. Le divisioni di due o tre blocchi sono normali, ma dopo alcune conferme la probabilità che il blocco venga ripristinato diminuisce esponenzialmente fino a zero. Se una transazione è stata eseguita su tutte le catene candidate, viene essenzialmente eseguita, anche se la particolare catena di consenso non è stata ancora decisa.


Questo è il binario Ben-Or e Skycoin userà qualcosa di leggermente più avanzato, che è più veloce quando ci sono più blocchi successori tra cui scegliere nel gruppo di consenso. La randomizzazione è importante per impedire che i sottogrammi della rete rimangano bloccati. Il processo di voto è una forma di "ricottura" in cui ogni nodo arriverà al consenso globale in modo indipendente, solo dalle sue informazioni locali.


Il processo di consenso avviene in pubblico. Un nodo pubblica blocchi, li firma con la propria chiave privata ed i blocchi vengono replicati peer-to-peer tra gli abbonati della catena. Poi ci sono i "consensus oracle" che sono i nodi utilizzati per verificare il consenso ma non lo influenzano. Quindi potresti scegliere le chiavi pubbliche di alcuni scambi e alcuni membri della comunità fidati e il tuo nodo userà quelli per rilevare se qualcosa non va. Questo è usato per scovare netsplits. Ciò protegge anche da un attacco, in cui un hacker controlla il router e può controllare i peer ai quali è possibile connettersi.

Se un nodo si presenta alla rete e tenta di far accettare alla rete una catena diversa (attacco del 51%, ripristino delle transazioni), di solito viene ignorato. La maggior parte degli attacchi del 51% richiede un comportamento maligno del nodo che viene rilevato automaticamente e ne genera uno di sottoscrizione che rimuove quello maligno dall'elenco di attendibilità. La più semplice strategia di attacco del 51% è facile da rilevare e dimostra con certezza matematica che era inteso come un tentativo di annullare le transazioni, poiché richiede decisioni di consenso sul blocco a posteriori. Richiede la pubblicazione di due blocchi firmati con lo stesso numero di sequenza, quindi abbiamo appena reso questo un attacco automaticamente interdetto per un nodo.

Stiamo cercando di eliminare l'ultimo possibile attacco del 51%, ovvero quando una sottorete di nodi passa offline (attacco netsplit) e poi si ricongiunge alla rete con un consenso diverso sulla blockchain e tenta di forzare questo sulla rete per ripristinare le transazioni. La maggior parte di questi attacchi fallirà, perché la sottorete non avrà abbastanza influenza.

Questo attacco è ancora molto difficile da realizzare. Nel caso in cui si verifichi un attacco del 51%, una soluzione è quella di bloccare la rete e consentire a ciascun nodo/utente di scegliere individualmente quale catena è valida e consentire alle persone di escludere manualmente i nodi di attacco. L'"oracle" del consenso consente a ciascun nodo, con un'alta probabilità, di sapere se lo stato è sincronizzato e se è stato raggiunto un consenso globale o se fanno parte di un sottografo netsplit. Riteniamo che sia possibile per ogni nodo conoscere con alta probabilità di correttezza dalle informazioni locali, se un nodo era offline durante una decisione di consenso e quindi ignorare i nodi offline che improvvisamente appaiono e provare a forzare un fork di catena sulla rete.

In Bitcoin, se si disponesse della massima potenza di hashing, sarebbe possibile annullare le transazioni
quando si vuole.

In Skycoin, per invertire le transazioni:

- È necessario controllare un numero elevato di nodi
- I nodi che controlli devono essere "influenti" e affidabili nella topologia della rete
- I tuoi nodi devono esibire un comportamento di attacco patologico estremamente ovvio, senza che questo venga rilevato, perché il rilevamento determina la perdita delle relazioni di fiducia necessarie per attaccare la rete.
- I tuoi nodi devono essere in una topologia di attacco patologico, senza essere rilevati (la maggior parte dei nodi "bot" sarebbero considerati affidabili da pochissimi umani e sarebbero facili da individuare)
- È necessario portare i nodi sotto il tuo controllo per colludere in un modo che si traduca in un attacco riuscito (il che non è molto semplice)
- Se l'attacco ha successo, è necessario impedire alla rete di invertire manualmente l'attacco (abbastanza difficile se le persone hanno perso monete o denaro per l'attacco)

Per dimostrare che è a prova di attacco del 51%, devi scrivere le tue ipotesi e creare un semplice modello matematico per testare le condizioni in cui è possibile un attacco, provare ad eliminarle e, se non puoi, le imponi il più difficile possibile. Aumenti il costo di un attacco e riduci così la probabilità che uno specifico abbia successo. Quindi riduci la ricompensa e gli incentivi per l'attacco.

Il processo di consenso è semplice e facile da modellare, ma non intuitivo senza poterlo vedere. Alla fine ci sarà un sito javascript con un processo di consenso animato con cui potrai giocare.
