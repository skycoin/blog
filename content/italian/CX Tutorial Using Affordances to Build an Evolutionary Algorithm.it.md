+++
title = "CX Tutorial: Using Affordances to Build a Small Text-based Adventure"
tags = [
    "CX",
]
bounty = 5
date = "2017-09-20"
aliases = [
	"/it/cx/cx-tutorial-using-affordances-to-build-an-evolutionary-algorithm/"
]
+++

<!-- MarkdownTOC autolink="true" bracket="round" depth="2" -->

- [Introduzione](#introduzione)
- [Architettura reattiva](#architettura-reattiva)
- [Sistema di convenienza](#sistema-di-convenienza)
- [Oggetti](#oggetti)
- [Conclusione](#conclusione)

<!-- /MarkdownTOC -->

# Introduzione

Questo tutorial presenta un "gioco" basato sul testo (l'utente non interagisce
con il programma, e non può influenzare le decisioni del personaggio) che utilizza una
[Architettura reattiva](#architettura-reattiva) a
determinare quali sono le possibili azioni che il personaggio del gioco può fare.
Il codice sorgente completo può essere trovato in
[CX's repository](https://github.com/skycoin/cx), nel file *examples/text-based-adventure.cx*.

Il gioco descrive l'avventura di un viaggiatore che fugge da un
mostro (Halloween arriverà il prossimo mese, dopotutto). Se il viaggiatore
sopravvive un certo numero di ore (beh, queste sono solo iterazioni in un loop *for*),
il mostro la smetterà di inseguire il viaggiatore. Un esempio di
una sessione di gioco è qui descritta:


```
Il viaggiatore continua a seguire il percorso, assicurandosi di ignorare qualsiasi dolore.
Ululando e ringhiando, il mostro sta arrivando.
Il coraggio entra in scena, nella speranza di vivere per un'altra notte.
Ingenuo, e anche stupido, ma l'atto del viaggiatore lascia intorpidito il mostro.
Nord Est Ovest Sud. Ogni direzione è buona,
finché non si trova alcun mostro.
Ululando e ringhiando, il mostro sta arrivando.
Il viaggiatore scappa via e la codardia lo lascia vivere per un altro giorno.

Sopravvivi.
```

Se il viaggiatore decide di combattere il mostro e il suo eroico tentativo
fallisce, il gioco finisce. Un esempio di fine del gioco è:

```
Nord, Est, Ovest, Sud. Ogni direzione è buona,
finché non si trova alcun mostro.
Ululando e ringhiando, il mostro sta arrivando.
Il coraggio entra in scena, nella speranza di vivere per un'altra notte.
Ma il fallimento descrive questa parvenza e, improvvisamente, quest'avventura finisce.

Muori.

Call's State:
flag:			true
nonAssign_32:		""

halt() Arguments:
0: "Muori."

65: call to halt
```

Come puoi vedere, viene generato un errore se muori (questo è appropriato,
è una situazione spaventosa per un programmatore).

# Archittettura reattiva

In questa architettura, viene posta una domanda e diversi agenti (in
questo caso, funzioni) devono rispondere a questa domanda. Una semplice domanda
quello che può essere chiesto è "Chi deve essere eseguito in questo momento?" e coloro
le cui funzioni che possono essere eseguite lo faranno.

I seguenti prototipi di funzioni rappresentano le possibili azioni che
possono accadere durante l'avventura del viaggiatore.

```
func walk (flag bool) () {}
func noise (flag bool) () {}
func consider (flag bool) () {}
func chance (flag bool) () {}
func fightResult (flag bool) () {}
func theEnd (flag bool) () {}
```

# Sistema di convenienza

Un'altra funzione deve coordinare le chiamate delle funzioni. In questo caso,
Il sistema di convenienza di CX viene utilizzato per determinare se ad un'azione è consentita
l'esecuzione o no.

```
yes := true
no := false

remArg("walk")
affExpr("walk", "yes|no", 0)
:tag walk;
walk(false)
```


Nel codice sopra, * remArg () * cerca un'espressione con l'etichetta "walk"
e rimuove il suo argomento. Questo è fatto al fine di elencare al
sistema di convenineza gli argomenti che possono essere inviati
all'operatore di espressione. Successivamente, * affExpr () * sta dicendo a CX "tra tutti gli
argomenti che possono essere inviati a *walk*, dimmi se *yes* or no *no* possa
essere usato come argomento, e applicare l'opzione *0th* dall'elenco di convenienza
vhe viene restituito."

La procedura precedente viene applicata a tutte le azioni che possono accadere
durante l'avventura del viaggiatore. Per ciascuna di queste azioni,
vengono richieste le seguenti regole per determinare se l'azione dovrebbe essere
permessa o no:

```
setClauses("
          aff(walk, yes, X, R) :- X = monster, R = false.
          aff(noise, yes, X, R) :- X = monster, R = false.

          aff(consider, yes, X, R) :- R = false.
          aff(chance, yes, X, R) :- R = false.
          aff(fightResult, yes, X, R) :- R = false.
          aff(theEnd, yes, X, R) :- R = false.

          aff(consider, yes, X, R) :- X = monster, R = true.
          aff(chance, yes, X, R) :- X = fight, R = true.
          aff(fightResult, yes, X, R) :- X = fight, R = true.
          aff(theEnd, yes, X, R) :- X = died, R = true.
        ")
```

La prima regola può essere letta come "Sarò interrogato se stai considerando
di inviare l'argomento *yes* all'azione *walk*. Se l'oggetto
*monster* è presente, quindi questo argomento *non* è un'opzione."

Le regole nel secondo blocco (le 4 regole dopo la prima riga vuota)
dicono al sistema di convenienza di accettare "mai" un argomento *si*. Noi facciamo
questo perché vogliamo che questo sia il comportamento predefinito, ma possiamo farlo
successivamente dichiarare regole che prevalgono su questo comportamento. Questo processo *override*
avviene con le ultime 4 regole. Fondamentalmente, questo blocco di regole
sta dicendo a CX di accettare *sì* come argomenti se un particolare oggetto è
presente nella pila degli oggetti.

# Oggetti

Alcune azioni aggiungono o rimuovono oggetti dalla pila di oggetti. Per
esempio, ogniqualvolta l'azione *noise* decida di far apparire il mostro
*addObject ("monster")* viene eseguito. Se il viaggiatore decide di farlo
scappare dal combattimento, l'oggetto "mostro" viene rimosso dalla pila.

Nel caso dell'azione *chance*, il mostro può decidere di risparmiare
il viaggiatore ancora qualche secondo per vedere cosa deciderà di fare.
Per fare ciò, l'oggetto "fight" viene rimosso (come il mostro
non voglio ancora iniziare un combattimento), ma l'oggetto "mostro" rimane.

# Conclusione

Il sistema di convenienza di CX utilizza oggetti e regole per prendere complesse
decisioni su come verranno filtrate le convenienze.

Usando gli oggetti, possiamo decidere quali azioni saranno attivate o
disattivate. Per questo esempio, una piccola quantità di azioni sono considerate
per questo processo di attivazione ma il vantaggio di utilizzare questa
architettura potrebbe sembrare inutile a prima vista. Tuttavia, regole
più complesse potrebbero essere definite che coinvolgono più oggetti e una singola
regola potrebbe essere responsabile dell'attivazione di diversi nodi in una grande rete
di azioni. Inoltre, in questo esempio ci sono solo due possibili argomenti
considerati: *sì* e *no*; potremmo avere più argomenti e azioni
che accettani diversi tipi di argomenti diversi dai booleani.
