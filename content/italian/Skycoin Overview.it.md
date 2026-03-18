+++
title = "Panoramica di Skycoin"
tags = [
    "Skycoin",
    "Statement",
]
bounty = 15
date = "2017-08-26"
aliases = [
	"/it/overview/skycoin-overview/"
]
+++

<!-- MarkdownTOC autolink="true" bracket="round" depth="1" -->

- [Introduzione a Skycoin](#skycoin-introduction)
- [Innovazioni e Difetti del Bitcoin e gli Attuali Protocolli Blockchain](#innovations-and-flaws-with-bitcoin-and-the-current-blockchain-protocols)
- [Innovazioni Prodotte dal Bitcoin](#innovations-produced-by-bitcoin)
- [Maggiori Difetti del Bitcoin](#major-flaws-of-bitcoin)
- [Proprietá Desiderabili per Sistemi di Consenso Distribuito per Registri Finanziari](#desirable-properties-for-systems-of-distributed-consensus-for-financial-ledgers)
- [La Filosofia di Sicurezza di Skycoin](#skycoin-security-philosophy)
- [Trasparenza e Sicurezza: Obelisk e Canali di Trasmissione Pubblici](#transparency-and-security-obelisk-and-public-broadcast-channels)
- [Obelisk](#obelisk)
- [Semplice Algoritmo di Consenso Binario: Scegliere tra Due Blocchi](#simple-binary-consensus-algorithm-choosing-between-two-blocks)
- [Consenso su Scelte Multiple Concomitanti Diramate](#consensus-on-multiple-concurrent-branch-choices)

<!-- /MarkdownTOC -->

# Introduzione a Skycoin

Skycoin é basato su una tecnologia
che introduce una nuova crittografica primitiva
conosciuta come un canale di trasmissione pubblica. Implementa
anche un nuovo algoritmo di consenso, chiamato
Obelisk, il quale mitiga i problemi di impegno
che si presentano dal Proof-of-Work e dal processo di mining
sottostante al Bitcoin, quindi affrontando una serie di problemi
di sicurezza associati a quest'utlimo. Obelisk non é un
singolo algoritmo, ma un'implementazione che impiega
tecniche multiple per fornire garanzie di sicurezza
specifiche.

# Innovazioni e Difetti del Bitcoin e gli Attuali Protocolli Blockchain

In Bitcoin, le nuove transazioni vengono collocate
in un blocco, aggiunto alla blockchain. Qualsiasi
peer nella rete Bitcoin puó creare nuovi blocchi.
Pertanto ogni blocco ha un solo genitore ma uno o piú
validi successori (bambini). Le chains formano un
albero e il problema principale che Bitcoin risolve é far in
modo che ogni nodo nella rete sia d'accordo su quale delle
chains prospettate nell'albero é la blockchain
di consenso.

Bitcoin usa una tecnica chiamata Proof‐of‐Work
(PoW) per determinare ch la blockchain sia unica. Un blocco
valido richiede un valore hash, al di sotto di un valore
target. I nodi aggiungono transazioni a un nuovo blocco e
randomicamente provano finché un hash valido per un
blocco viene scoperto.

Viene usata una funzione per creare un ordine di chains
nell'albero del blocco. Per la chain con la difficoltá
piú elevata é richiesta la maggior quantitá di operazioni
hash per produrre “la chain piú lunga” e
formare la chain consenso. La nozione di  “profonditá del blocco”
e “difficoltá” crea un ordine su tutte le
chains lineari nell'albero blocco e solo la catena
ad alta intensitá di risorse é accettata per produrre
la chain di consenso.

I nodi Bitcoin si connettono fra di loro in modo casuale
e ogni nodo trasmette la catena di blocchi che conosce
ai suoi simili. Se un nodo a maggior difficoltá di produrre
la chain allora si un altro peer connesso, il peer riceverá i
blocchi sequenzialmente. Il nodo valuterá la funzione e
decide se la chain ricevuta sia piú complicata da
produrre e quindi potenzialmente scambiare il suo consenso
alla chain ricevuta. Il nodo, in seguito, la pubblicizzerá
agli altri peer. In questo modo, il consenso viene
propagato attraverso la rete e tutti i nodi raggiungono
lo stesso consenso.

Il Bitcoin non presuppone che i nodi abbiano identitá
e non presuppone che i nodi siano onesti.
I nodi possono mandare agli altri nodi ogni dato e ció
non puó influenzare le decisioni di consenso perché la
difficoltá puó essere verificata indipendentemente da
sé.

# Innovazioni prodotte dal Bitcoin

### * La Blockchain

Una singola struttura dati che ogniuno
puó possedere.

### * Registro Pubblico Per Le Transazioni

Memorizzazione delle transazioni finanziarie
sulla blockchain.

### * Uso del PoW e Ricalcolo della Difficoltá per Mantenere una Produzione di Blocchi Costante

### * Uso di Chiavi Pubbliche come Hashes e Indirizzi

Le chiavi pubbliche non vengono divulgate
fin quando non usate.

### * Uso di “outputs” per i Saldi

Ignora il tentativo di creare denaro
digitale divisibile: Per pagare $20 da un output di $25,
inviare $20 a una persona e $5 indietro a te stesso.

### * Funzione PoW Difficoltá Grandezza Blocco

Il primo utilizzo della funzione é definire
l'ordine dei blocchi. Il registro pubblico
risolve il problema denominato double spending
delle valute digitali tradizionali.

# Maggiori Difetti del Bitcoin

Questi rappresentano i maggiori problemi che devono
essere affrontati nello sviluppo di una cryptovaluta.
Il Bitcoin dovrebbe essere considerato come una cryptovaluta
embrionica sulla quale sviluppare futuri miglioramenti. La
tecnologia sulla quale Skycoin é basata affronta le maggiori
deficienze del Bitcoin, riprogettando l'intero sistema di
consenso distribuito.

### * Le Decisioni di Consenso nel Bitcoin non Sono Definitive e Possono Essere Ripristinate

Una persona o un'organizzazione che possa
affittare o comprare abbastanza hashing power
puó ripristinare le transazioni.

### * Il Bitcoin Raggiunge il Consenso della Rete ma i Singoli Nodi della Rete Sono Altamente Vulnerabili da Parte di Avversari che Controllano i Routers Attraverso i Quali Passano i Pacchetti

Un avversario che controlla il router
ha l'assoluto controllo sulla vista
di un nodo e puó influenzare arbitrariamente
le decisioni di consenso del nodo.

### * Gli Exchanges di Bitcoin Sono Diventati Altamente Vulnerabili ad Attacchi

Gli attaccanti professionisti potrebbero
impiegare l'attacco del 51% e comprare
e vendere alt coins sugli exchanges di Bitcoin
per guidare quest'ultimo verso l'insolvenza.

### * Le Banche e i Siti di Gioco D'Azzardo Sono Diventati Vulnerabili all'Attacco del 51%

### * Al maturare del Bitcoin, L'Acquisto di Opzioni Contro il Bitcoin e Attacchi Contro la Sua Rete Diventano piú Redditizi

In futuro, attacchi al Bitcoin possono
risultare in centinaia di milioni di dollari
di profitto in opzioni trading.

### * Stati Con Un Forte Controllo Dei Capitali, Cosí Come Societá Concorrenti, Potrebbero Direttamente Attaccare La Rete Bitcoin Per Proteggere I Loro Interessi Finanziari.

Queste entitá potrebbero facilmente
assorbire i costi di un attacco alla rete
e compromettere la sicurezza del Bitcoin.

### * I Servizi Che Permettono L'hashing In Cloud e L'affitto Di Potenza Hash Di Terze Parti Hanno Sempre Piú Successo

Molte grandi pools hanno la capacitá
di affittare potenza hash per sferrare
un attacco di maggioranza.

### * Gli Hackers Possono Usare Numerosi Buchi Nella Sicurezza Dei Routers E Nelle Apparecchiature Di Rete Per Rubare Monete Da Banche e Exchanges

Un attaccante puó controllare i peer
connessi a un nodo Bitcoin e assicurare
connessioni ai nodi controllati
dall'attacante. Per esempio, un
attaccante potrebbe introdurre
una transazione di deposito alla
side chain di una banca e ottenere
dalla banca l'emissione di un ritiro
il quale viene poi inoltrato alla
rete principale.

### * Il Bitcoin Non Puó Offrire Sicurezza A Basso Costo

La rete Bitcoin sta usando immense e
crescenti quantitá esponenziali di
elettricitá. La sicurezza del Bitcoin
fa affidamento sul creare di proposito
quanto piú spreco elettrico possibile.
Siccome la sicurezza é correlata al costo
del raggiungimento della maggior quantitá
di hash, il costo per mantenere la rete
Bitcoin é costantemente in aumento. In un
sistema ben progettato, $1 in sicurezza
costa $1000 per essere eluso. Nel Bitcoin
il ratio é $1 a $1. In aggiunta, ció é
ambientalmente irresponsabile.

### * Il Bitcoin Non Puó Fondamentalmente Ridurre i Tempi Di Transazione Senza Compromettere La Sicurezza

Le transazioni in Bitcoin richiedono
in media 10 minuti per essere incluse
in un blocco, e maggior tempo é richiesto per
maggior sicurezza.

### * Proprietá Desiderabili Per Sistemi Di Consenso Distribuiti Per Registri Finanziari

I criteri secondo i quali il Bitcoin puó essere migliorato sono:

### * Nessuna Doppia Spesa

Una volta che una transazione viene eseguita,
dovrebbe essere impossibile ripristinare
il consenso. Il consenso dovrebbe essere
il piú irreversibile possibile.

### * Efficienza

Il costo per mantenere un registro
perfettamente sicuro dovrebbe essere
estremamente basso.

### * Velocitá

Il sistema dovrebbe permettere che le
transazioni siano confermate in pochi
secondi.

### * Trasparenza

Dovrebbe essere facile ispezionare e
identificare nodi malevoli.

### * Sicurezza Da Un Attacco Al Router

I nodi dovrebbero essere capaci di rilevare
se il consenso differisce dalla rete.

alcune proprietá di sicurezza dovrebbero rimanere
intatte anche se la vasta maggioranza dei nodi nella rete
é malevolo o sta colludendo.

A livello fondamentale, molti dei problemi di
sicurezza associati al sistema Bitcoin sorgono dal
problema di impegno intrinseco del Proof of Work e
il processo di mining. I suoi problemi di sicurezza
rappresentano un problema reale del c.d Byzantine General
Problem. Eistono gli incentivi per i partecipanti di
manipolare il processo di verifica, impegnandosi in
corruzione e hacking per esempio. Gli attaccanti possono
manipolare i clocks di sistema, compromettere i routers,
usare collisione di hash, inondare la rete con centinaia di
migliaia di bots e sfruttare la malleabilitá delle firme.

Un sistema sicuro non solo protegge contro ogni
attacco conosciuto, ma é robusto abbastanza per
evolversi e adattarsi ad attacchi futuri. Alcuni
problemi nel Bitcoin possono essere aggiustati, come
la malleabilitá delle firme. Altri problemi sono
di carattere fondamentale e non possono essere
affrontati senza definire interamente una nuova
struttura, come la dipendenza dal Proof of Work e dai i
miner.

# Filosofia Di Sicurezza Di Skycoin

La sicurezza é un processo di continua identificazione
e fortificazione dalle minaccie. Un buon sistema
realizza la "difesa in profonditá", ha piú sistemi
ridondanti sopravviverá al fallimento completo di ogni
singola misura. Un'ottima sicurezza richiede la differenziazione
tra minaccie che sono esistenziali e minacci solamente fastidiose.

E' ovvio che nessun singolo sistema puó eliminare
tutte le minaccie sulla sicurezza e simultaneamente
realizzare tutti gli obiettivi elencati precedentemente,
Skycoin rappresenta il prossimo step nella tecnologia delle
cryptovalute perché adotta un approccio modulare alla
sicurezza e usa differenti sistemi per mantenere
particolari garanzie. La sicurezza di Skycoin si concentra
nell'aggredire le mianccie esistenziali affrontate dal Bitcoin
e proteggendo gli utenti dalle minaccie di tutti i giorni,
sforzandosi di dare il piú elevato grado di protezione contro
la classe di attacchi che infliggerebbero le piú grandi perdite
ai suoi utenti, sogetti interessati e istituzioni.
Ció richiede una riprogettazione completa del Bitcoin da entrambe le
estremitá, dalla generazione del waller fino al consenso della
blockchain e innovazioni fondamentali in diverse altre aree.

Le maggiori perdite nel Bitcoin derivano dalla differenza
nella progettazione, mancanza di usabilitá, ed errori da
parte dell'utente finale invece di attacchi tecnici fondamentali
ai software o matematici. Skycoin deve affrontare entrambe le
minaccie matematiche e i pericoli sulla sicurezza che l'esperienza
utente incompleta e scarsamente pensata di Bitcoin ha creato per
l'utente di tutti i giorni. La povera usabilitá e il design hanno
forzato gli utenti a comprometterne la sicurezza, con milioni di
dollari che fanno affidamento continuamento su wallet web insicuri.
Malgrado i frequenti e massicci furti riportati dai media ogni giorno,
ad oggi molti Bitcoin sono andati perduti a causa dei problemi
di usabilitá e di tutti gli sforzi dei criminali di rubare
Bitcoin.

Circa la metá di tutti i Bitcoin esistenti non
é mai stata spostata dai loro indirizzi iniziali
e mai lo sará perché sono stati i files irrecuperabili
del wallet, sono stati persi i wallets, o l'incomprensione
di cosa andava conservato nel file del wallet.

Mt. Gox ha recentemente riportato di aver trovato
200,000 bitcoin in un wallet del quale loro erano
all'oscuro contenesse Bitcoin. Il wallet é stato
precedentemente ignorato e sarabbe potuto essere stato
facilmente cancellato per sbaglio.
I wallet sono frquentemente scambiati vuoti per sbaglio
perché il software del computer era incapace di caricare
il wallet creato da un software risultato troppo vecchio.
Pertanto la maggior parte dei problemi concernenti il
Bitcoin si verificano a livello di usabilitá, utenti finali
e sicurezza degli exchanges.

La restante parte di questa sezione copre alcune
delle nuove tecniche che abbiamo creato in
cooperazione con i nostri partner per affrontare
i problemi a livello di rete e rendere la
blockchain di Skycoin piú sicura della rete
precedente.

Abbiamo provato matematicamente che il nostro
sistema realizza il consenso, ha le proprietá di
sicurezza che vogliamo e opera bene sotto condizioni
di rete normali. Abbiamo alcune nuove eccitanti strutture dati che non
sono mai state viste in alcuna moneta o pezi di  software
prima d'ora. Al momento stiamo prototipando il sistema per la
successiva messa in funzione. Il processo di sviluppo
di Skycoin é iterativo. Ci saranno cambiamenti,
miglioramenti e perfezionamenti dal nostro lavoro
sui dettagli, l'affrontare problemi e ricevere feedback.

# Trasparenza e Sicurezza: Obelisk e Canali Di Trasmissione Pubblici

Per affrontare i problemi di impegno associati
al sistema Bitcoin, la tecnologia alla base di
Skycoin implementa la blockchain nella forma di
canale pubblico di trasmissione. Chiunque puó leggere
la chain, ma solamente il proprietario puó coniare blocchi
per la stessa. Per essere valida una chain personale, ogni
blocco deve essere firmato dal proprietario della chaive privata.
Ogni nodo in questo algoritmo di consenso (Obelisk) ha una
blockchain personale ed é il core primitibo nel sistema
Obelisk.

Il canale pubblico di trasmissione migliora parecchi
limiti:

### * Una Volta Che Un Blocco Viene Pubblicato, Non é Piú Possibile Annullare La Pubblicazione

I blocchi vengono replicati peer to peer
a tutti i subscribers. Una volta che un
blocco é stato pubblicato, si diffonde
a tutti i subscribers. Devi distruggere
tutti i peers che hanno ricevuto il blocco
per eliminarlo da internet.

### * Un Nodo Non Puó Pubblicare Una Versione Differente Di Un Blocco Precedente Senza Averlo

I blocchi sono numerati e sarebero
rilevati se il nodo firma due
blocchi differenti con lo stesso
numero sequenziale.

### * Un Nodo Non Puó Retrodatare Il Timestamp Alla Ricevuta Di Un Blocco, Senza ritardare La Pubblicazione Di Un Blocco

I timestamps possono solo andare su,
i timestamps aumentano monotonamente
con il conteggio della sequenza di blocco.

### * Un Blocco Nel Mezzo Della Chain Non Puó Essere Cambiato Senza Invalidare Ogni Blocco Che Viene Dopo Di Esso

In una chain di hash, ogni intestazione del blocco
contiene un hash del blocco precedente.

# Obelisk

Ogni nodo Obelisk (Skycoin Consensus Node)
ha una chiave pubblica (una identitá) e una blockchain
personale (un canale di trasmissione pubblico).
Le decisioni di consenso e comunicazione avvengono
tra le blockchain personali di ogni nodo Obelisk.
Questa é una registrazione pubblica di tutto quello
che fa un nodo. Ció permette alla community di
identificare i nodi che stanno parteciapando in
attacchi alla rete e rende pubblico come le decisioni
all'interno della rete sono prese e quali nodi
influenzano tali decisioni.

Ogni nodo ha una lista di altri nodi alla quale si é
iscritto. I nodi con piú iscritti sono piú fidati e
raccolgono piú influenza sulla rete. Se la community
non si fida dei nodi che lo rappresentano o sentono
che il potere nella rete é troppo concentrato ( o
non concentrato abbastanza) la community é capace
di spostare collettivamente l'equilibrio di potere
nella rete cambiando collettivamente le loro relazioni
di fiducia nella rete.

L'inscrizione a un nodo puó essere formata a casaccio
oppure attraverso una rete di fiducia (iscriversi ai nodi
di persone che conosci e persone della comunitá di cui ti fidi).

quando un nodo riceve un nuovo blocco da una chain alla
quale é iscritto pubblica l'hash del blocco. Ció é un
riconoscimento pubblico della ricezione del blocco.
Ogni blocco e "timestamped" (timbrato temporalmente) e ha contro riferimenti con i
blocchi delle altre chains. Ció crea una densa interconnessa
catena di blocchi riconosciuta. Questa chains stabilisce
relazioni casuali e puó agire come sistema distribuito di
timestamping come descritto nella prossima sezione.

Ció permette alla rete di provare che i dati non esistono
o non sono stati pubblicati nella rete o stabilire che dei
precisi nodi erano attivi o offline durante un preciso
intervallo di tempo.

L'algoritmo di consenso Obelisk é basato sull'algoritmo
casuale di consenso Ben-Or's.

Un attacco Sybil, in grafico casuale (peggior caso)
permette ai nodi Sybil di controllare il consenso,
ma i nodi non sono capaci di invertire le transazioni,
rimuovendo l'unico incentivo di attaccare la rete.
In un grafico del mondo reale la resistanza della
rete all'attacco Sybil é molto alta e gestire un
nodo é moderatamente costoso in termini di bandwidth,
rendendo le grandi botnets proibitive.

Le relazioni di fiducia sono scarse e possono essere
rescisse. Nel caso di un attacco, la rete reagisce
interrompendo le connessioni ai nodi meno fidati
contraendole a un core piú piccolo di nodi fidati.
I registri pubblici lasciati dalla blockchain
personale di ogni nodo rendono facile l'identificazione
dei nodi che hanno partecipato in un attacco. Siccome
i nodi attaccanti vengono identificati, gli individui
recidono i loro rapporti con questi nodi, riducendo
la loro influenza. Di conseguenza, i maggiori benefici
della rete Skycoin sono:

- Il consenso in Skycoin é democratico e i nodi sono gestiti dalla community
- Il consenso del nodo Skycoin é pubblico
- Ogni nodo é tenuto a rispondere alla community e all'ispezione di terze parti
- L'influenza nel sistema di consenso di Skycoin é democratica e trasparente (ma ineguale)

# Algoritmo Di Consenso Binario Semplice: Scegliendo Tra Due Blocchi

Ogni decisione di voto é una coppia hash (A,B). A é
l'hash del genitore del blocco e B é l'hash del blocco.
Ogni nodo vota sul blocco successivo che crede sia il
blocco di consenso. se il 40% dei nodi a cui é iscritto
hanno lo stesso candidato per il consenso, il nodo cambia
il suo consenso a quel blocco. Il nodo si sposta casualmente
fra i candidati fino a che il consenso non viene raggiunto.

# Consenso Su Piú Scelte Parallele Simultanee

Un sistema piú avanzato pubblica (A,B,P),
dove P é un valore da 0 a 1. I valori di P
su tutti i successori del blocco sarebbero
uguali a 1. Ció permette decisioni di
consenso simultaneo su chain multiple.

Se la maggioranza dei nodi nella rete sono
onesti, convergeranno tutti verso lo stesso consenso.

Skycoin inoltre ha una forma limitata di Proof of stake.
Pregiudiamo il voto a favore di blocchi con una maggiore
commissione per la transazione.

Se ci sono solo due possibili scelte di consenso per un
determinato genitore ed entrambi i blocchi eseguono la tua
transazione, allora la transazione é effettivamente eseguita
indipendentemente da quale blocco viene scelto dalla rete.
La probabilitá di revisione su una decisione di consenso presa
da poco diminuisce esponenzialmente con la grandezza del blocco.

