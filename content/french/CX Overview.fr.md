+++
title = "Vue d'ensemble de CX"
tags = [
    "CX",
]
date = "2017-09-06"
aliases = [
	"/fr/overview/cx-overview/"
]
+++

<!-- MarkdownTOC autolink="true" bracket="round" depth="1" -->

- [Introduction du CX](#cx-introduction)
- [Dépot du projet](#projects-repository)
- [Syntaxe](#syntax)
- [Attributions](#affordances)
  - [Restrictions d'arité](#arity-restrictions)
  - [Restrictions de type](#type-restrictions)
  - [Restrictions existentielles](#existential-restrictions)
  - [Restrictions d'identifiant](#identifier-restrictions)
  - [Restrictions de limite](#boundaries-restrictions)
  - [Restrictions définies par l'utilisateur](#user-defined-restrictions)
- [Système de typage strict](#strict-typing-system)
- [Compilé et interprété](#compiled-and-interpreted)
  - [Boucle Lecture-Evaluation-Affichage](#read-eval-print-loop)
  - [Commandes de méta-programmation](#meta-programming-commands)
  - [Stepping](#stepping)
  - [Débogage interactif](#interactive-debugging)
- [Algorithme évolutif intégré](#integrated-evolutionary-algorithm)
- [Serialisation](#serialization)

<!-- /MarkdownTOC -->

# Introduction de CX

CX est une spécification et un language de programmation conçu pour embracer un nouveau paradigme de language basé sur le concept d'attribution.
Les attributions permettent à un programme de savoir quelles actions ils peuvent faire ou non en leur sein.
Par exemple, on peut demander à un programme quels arguments peuvent être envoyer à une fonction et le programme retournera une liste d'actions possibles.
Après avoir décidé quelle action de la liste est appropriée, nous pouvons choisir l'une des options et le programme appliquera l'action choisie.
En raison du système d'attribution de CX, un algorithme de programmation génétique est construit et fourni en tant que fonction native, laquelle peut  etre utilisé pour optimiser la structure du programme pendant son exécution.

La spécification du CX établit que le compilateur et l'interprétateur doivent être accessible au programmeur. L'interpréteur peu être accédé à travers une boucle de lecture-evaluation-affichage, dans laquelle le programmeur peu interagir en ajoutant ou enlevant des éléments au programme. Une fois que le programme s'est terminé, il peut être compilé dans le but d'augmenter sa performance.

Le sytème de typage dans le CX est très strict. La seule conversion de type "implicite" apparait quand le parseur détermine ce qui est un nombre entier, un nombre flottant, un booléen, une chaine de caractère ou un tableau. Par exemple, si une fonction requiert un nombre entier 64 bits, il est nécessaire d'utiliser une fonction de conversion de type (cast) pour le convertir explicitement dans le type requis.

Enfin, un programme CX peut être complètement sérialisé en un tableau d'octets tout en maintenant sa structure et son statut d'exécution. Cette version sérialisée d'un programme peut être désérialisée plus tard et continuer son exécution sur n'importe quelle appareil qui a un compilateur/interpréteur de CX.

Dans les prochaines sections, les fonctionnalités du CX discutés dans le paragraphe du dessus seront décrites de manière plus détaillées.



# Dépot du Projet

Le code source du projet peut être téléchargé depuis son dépot Github :
[https://github.com/skycoin/cx](https://github.com/skycoin/cx). Le dépot inclu le fichier de spécification, la documentation, des exemples et le code source.

# Syntaxe

Comme mentionné dans l'introduction, CX est à la fois une spécification et un
langage de programmation. La spécification de CX n'impose pas de syntaxe,
mais plutôt les structures et les processus qu'un dialecte CX doit
mettre en œuvre pour être considéré comme un CX. En conséquence, on pourrait
mettre en œuvre deux dialectes CX, l'un avec une syntaxe Lisp-like et un autre avec une syntaxe C-like. Cette sous-langue est appelée CX Base,
ou "la langue de base". Dans ce document, une implémentation est utilisée pour
mettre en évidence les capacités de la spécification, bien que son but
n'est pas seulement de servir comme un outil académique, mais de devenir un langage robuste à usage général.

Le CX utilisé dans ce document a comme objectif d'utiliser une syntaxe la plus proche possible de la syntaxe Go.


# Attributions

Un programmeur doit prendre une multitude de décisions lors de la construction
d'un programme. Par exemple, combien de paramètres une fonction doit recevoir, combien
de paramètres il doit retourner, quelles déclarations sont nécessaires pour obtenir
la fonctionnalité souhaitée, quels arguments doivent être envoyés en tant que paramètres aux fonctions de déclarations... Le système d'attribution de CX peut être interrogé pour obtenir une liste d'actions qu'il est possible d'appliquer à un élement. Dans ce contexte, des exemples d'éléments sont des fonctions, structures, modules et expressions.

Sans avoir un ensemble de règles et de faits qui dictent ce que doit être la logique et le but d'un programme, on peut tout de même déterminer certains éléments de base qui garantissent au moins qu'un programme sera sémantiquement correct. Le système d'attribution fournit des restrictions, en tant que première couche de filtrage, qui sont expliquées ci-dessous.



### Restriction des arités

Les expression dans CX peuvent retourner de multiple valeurs. Cela crée une difficulté pour le système d'attribution vu que le nombre de variables qui recoivent les arguments de sortie d'une expression a besoin de correspondre au nombre de sorties défini par l'opérateur d'expression.

```
out1, out2, ..., outN := op(inp1, inp2, ..., inpM)
```

Si l'exemple ci-dessus est correct, alors *op* doit générer *N* arguments. Ce problème peut devenir encore plus difficile si nous
considérons qu'à l'avenir, la définition de *op* peut être modifiée directement par le système d'attribution ou par l'utilisateur :
dès que la définition de *op* change, de nouvelles attributions peuvent être appliqué à n'importe quelle expression qui utilise *op* comme son opérateur, étant donné le nombre de variables de l'expression recevant les arguments de sortie de *op* peut également avoir changé.

La logique implique également que si le nombre de variables de réception correspond bien au nombre de paramètres de sortie de l'expression de l'opérateur, l'action d'ajouter de nouvelles variables de réception ne peut plus être exécuté.

Les restrictions d'arités s'appliquent également aux arguments d'entrée dans les expressions. En effet, si un appel de fonction a déjà ses arguments d'entrée définis, alors le système d'attribution ne devrait pas la mobiliser en ajoutant un autre argument comme action possible. De même, si une expression tente d'appeler un opérateur avec moins d'arguments que le nombre requis, le système d'attribution, lorsqu'il est interrogé, devrait indiquer au programmeur que l'ajout d'un nouvel argument à l'appel de fonction est possible.


**Exemple:**

*Remarque: la concaténation de chaîne n'a pas encore été implémenté. De même, les fonctions d'affichage ajoutent toujours une nouvelle ligne à la fin de la chaîne affichée. Une future version de l'implémentation CX présentée dans ce document traitera de ces problèmes.*

```
var age i32 = 18
var steps i32 = 23

func advance (direction str, numberSteps i32) () {
    printStr("Advancing:")
    printStr(direction)
    printStr("Number of steps:")
    printI32(numberSteps)
}

func main () () {
    advance("North")
}
```

Dans l'exemple ci-dessus, l'appel à *advance* dans la fonction *main* manque un argument. Si l'on appel le système d'attribution, le système devrait enrôler, entre autres, une action similaire à:

```
...
(k)       AddArgument advance age
(k+1)     AddArgument advance steps
...
```

où k représente un index arbitraire. Comme on peut le voir, le système d'attribution indique au programmeur que deux des actions possibles sont d'ajouter un autre argument à la fonction d'avance. Les définitions globales *age* et *steps* sont parmi les options pour agir comme arguments.

Il est à noter que les attributions doivent toujours être énumérés, et leur ordre doivent être le même sur plusieurs appels du système d'attribution. La raison derrière cela est que le programmeur devrait être en mesure d'indiquer au système quelle est l'attribution qui doit être appliqué après avoir examiné le résultat de la requête.


### Restrictions de Type

Le comportement classique dans les langages de programmation est d'avoir un système de typage qui empêche le programmeur d'envoyer des arguments de type inattendu aux appels de fonctions. Même dans les langages de programmation faiblement typés, une opération telle que `true / "hello world"` devrait générer une erreur (sauf bien sûr dans le cas d'un [langage de programmation exotique](https://fr.wikipedia.org/wiki/Langage_de_programmation_exotique)). CX suit un [système de typage très strict] (#strict-typing-system) et les arguments qui ne sont pas exactement du type attendu ne doivent pas être considérés comme des candidats aux actions d'attribution (même si une solution de contournement consiste à envelopper ces arguments dans des fonctions de conversion de type avant d'être affiché sous forme d'attribution).


Les restrictions de type doivent également être prises en compte lors de l'attribution d'une nouvelle valeur à une variable déjà existante. Dans CX, une variable déclarée d'un certain type doit rester de ce type pendant toute sa durée de vie (sauf si elle est supprimée à l'aide de commandes/fonctions de méta-programmation et créée à nouveau). Ainsi, par exemple, une variable déclarée détenant un nombre entier de 32 bits ne doit pas être considérée comme une candidate pour recevoir un argument de sortie de nombre flottant de 64 bits.


### Restrictions existentielles

Ce type de restriction peut sembler trivial à première vue: si un élément n'existe pas, il ne devrait pas y avoir d'attribution qui l'implique. Néanmoins, cette restriction devient un défi une fois que nous considérons une situation où une fonction a été renommée et déjà été utilisée comme opérateur dans des expressions tout au long d'un programme. Si le programme est sous forme de code source, ce problème est réduit à un simple processus de «rechercher et remplacer», mais s'il est en cours d'exécution, le système d'attribution devient très utile: un moyen de modifier l'identifiant lié à cet opérateur.

Même si un élément n'a pas été renommé, déterminer si un élément existe ou non n'est pas trivial. Les éléments à utiliser dans les attributions doivent être recherchés dans la portée actuelle de la pile d'appels, dans la portée globale et dans les portées globales d'autres modules.


### Restrictions d'identificateur

L'ajout de nouveaux éléments nommés est généralement une action candidate pour les attributions. Une restriction qui se pose lorsque vous tentez d'appliquer ce type d'attribution est d'assurer un identifiant unique pour le nouvel élément afin d'éviter les redéfinitions. Le système d'attribution peut soit générer un identifiant unique dans la portée de l'élément, soit demander au programmeur de fournir un identifiant approprié.


### Restrictions de limites

CX fournit des fonctions natives pour accéder et modifier des éléments à partir de tableaux. Voici des exemples de lecture/écriture de tableau :


```
readI32([]i32{0, 10, 20, 30}, 3)
writeF32([]f32{0.0, 10.10, 20.20}, 1, 5.5)
```

Dans la première expression, un tableau de quatre entiers 32 bits est accessible à l'index 3, qui renvoie le dernier élément du tableau. Dans la deuxième expression, le deuxième élément d'un tableau de trois nombres flottants de 32 bits est changé en 5.5. Si l'un de ces tableaux a été consulté en utilisant soit un indice négatif, soit un indice qui dépasse la longueur du tableau, une erreur "out of boundaries" est générée.

En obéissant uniquement aux restrictions de type, le système d'attribution indique au programmeur que tout argument entier de 32 bits peut être utilisé comme index pour accéder à n'importe quel tableau. Bien que ces programmes compilent, des erreurs de limite sont très susceptibles de se produire si le programmeur ne prête pas une attention particulière à ce qui est choisi d'être appliqué.

Le système d'attribution doit filtrer les propriétés selon les critères suivants: rejeter tout entier négatif de 32 bits et rejeter tout entier de 32 bits qui dépasse la longueur du tableau envoyé au tableau de lecture ou d'écriture.



### Restrictions définies par l'utilisateur
*Note: Le système de restrictions définies par l'utilisateur est encore à un stade expérimental *

Les restrictions de base décrites ci-dessus devraient au moins garantir que le programme ne rencontre pas d'erreurs d'exécution. Ces restrictions devraient être suffisantes pour construire des systèmes intéressants, tel que l'[algorithme évolutif](#integrated-evolutionary-algorithm) natif de CX. Néanmoins, dans certaines situations, un système plus robuste est nécessaire. À cette fin, les clauses, les requêtes et les objets sont utilisés pour décrire l'environnement d'un module. Ces éléments sont définis en utilisant un interpréteur Prolog intégré ainsi que les fonctions natives de CX *setClauses*, *setQuery* et *addObject*.

La description la plus générale de ce système de restriction est que le programmeur définit une série de clauses Prolog (faits et règles), qui seront interrogés à l'aide de la requête Prolog définie, pour chacun des objets ajoutés. Cela sera difficile à comprendre sans un exemple pour clarifier un peu plus les concepts et le processus:

```
setClauses("move(robot, north, X, R) :- X = northWall, R = false.")

setQuery("move(robot, %s, %s, R).")
```

Dans cet exemple, une seule règle est définie. La règle peut être interprétée comme "si le robot veut se déplacer vers le nord, demandez ce qu'est X. Si X est NorthWall, alors il ne peut pas se déplacer". La requête est juste une chaîne de format qui servira de requête pour l'action *move* et pour l'élément *robot* qui recevra deux autres arguments: une direction et un objet.

Les objets peuvent être définie en utilisant la fonction *addObject* :

```
addObject("southWall")
addObject("northWall")
```

Le système de restriction interroge le système pour chacun des objets présents dans le module. Dans cet exemple, le système effectuera d'abord la requête "move(robot, north, southWall)" et le système répondra "nil", ce qui signifie qu'il n'a aucune règle définie pour gérer cette situation et l'action par défaut est de ne pas rejeter l'attribution. La deuxième requête sera "move(robot, north, northWall)", et le système répondra "false". Dans ce cas, l'attribution n'a pas réussi à passer le test et est rejetée.


L'exemple ci-dessus illustre comment ces règles peuvent rejeter une attribution en utilisant une condition. Mais les règles peuvent également être utilisées pour accepter des attributions, même après avoir été annulés par des règles précédentes.


```
setClauses("move(robot, north, X, R) :- X = northWall, R = false.
    move(robot, north, X, R) :- X = northWormhole, R = true.")

setQuery("move(robot, %s, %s, R).")
```

La règle ajoutée dans le code ci-dessus indique au système d'accepter le mouvement du robot vers le nord si un trou de ver (wormhole) est présent. Si le tableau d'objet est laissé tel qu'il a été défini précédemment, l'attribution du mouvement sera encore rejetée, mais si `addObject("NorthWormhole")` est évalué, le "northWormhole" sera ajouté et le robot pourra passer à travers le mur à l'aide du trou de ver.

# Système de typage strict

Comme mentionné dans l'introduction, il n'y a pas de conversion de type implicite dans CX. De ce fait, plusieurs versions pour chacun des types primitifs sont définies dans le module de base. Par exemple, quatre fonctions natives pour l'addition existent: addI32, addI64, addF32 et addF64.

Le parseur attache un type par défaut aux données qu'il trouve dans le code source: si un nombre entier est lu, son type par défaut est *i32* ou un nombre entier 32 bits; et si un nombre flottant est lu, son type par défaut est *f32* ou un nombre flottant 32 bits. Il n'y a pas d'ambiguïté avec d'autres données lues par le parseur: *true* et *false* sont toujours booléens; une série de caractères entre deux guillemets sont toujours des chaînes; et le tableau doit indiquer son type avant la liste de ses éléments, par exemple, `[]i64{1, 2, 3}`.

Pour les cas où le programmeur doit déléguer explicitement une valeur d'un type à l'autre, le module de base fournit un certain nombre de fonctions de conversion de type pour fonctionner avec des types primitifs. Par exemple, `byteAToStr` converti un ensemble d'octets en chaîne, et` i32ToF32` converti un nombre entier de 32 bits en un nombre flottant de 32 bits.


# Compilation et Interprétation

La spécification de CX impose un dialecte CX pour fournir au développeur à la fois un interpréteur et un compilateur. Un programme interprété est beaucoup plus lent que son équivalent compilé mais permettra un programme plus flexible. Cette flexibilité provient de fonctions de méta-programmation et d'attribution qui peuvent modifier la structure d'un programme pendant son exécution.

Un programme compilé nécessite une structure plus rigide qu'un programme interprété car bon nombre des optimisations tirent parti de cette rigidité. En conséquence, le système d'attribution et toute fonction qui opère dans la structure du programme seront limités en fonctionnalité dans un programme compilé.

Le compilateur doit être utilisé lorsque la performance est la plus grande préoccupation, alors qu'un programme doit être interprété lorsque le programmeur exige toute la flexibilité offerte par les fonctionnalités de CX. Dans les sous-sections suivantes, certaines de ces fonctionnalités sont présentées sans l'objectif de servir de tutoriel, mais plutôt comme une simple introduction.


### Boucle Lecture-Evaluation-Affichage

La boucle Lecture-Evaluation-Affichage (REPL) est un outil interactif avec lequel un programmeur peut insérer de nouveaux éléments du programme et les faire évaluer. Le démarrage d'une nouvelle session REPL affichera les messages suivants dans la console :


```
CX REPL
More information about CX is available at https://github.com/skycoin/cx

*
```

Le "*" indique au programmeur que REPL est prêt à recevoir une nouvelle ligne de code. La REPL continuera à lire les commentaires de l'utilisateur jusqu'à ce qu'un point-virgule et un nouveau caractère de ligne soient rencontrés.

Si aucun programme n'a été initialement chargé dans la REPL, CX démarrera avec un programme vide. Cela peut être vu si la commande de méta-programmation `: dProgram true;` est donnée en entrée:


```
* :dProgram true;
Program

*
```

La REPL n'affiche que le mot "Program" suivi d'une ligne vide. Dans un premier temps, un nouveau module et une nouvelle fonction peuvent être déclarés:

En premières étapes, un nouveau module *principal* et une nouvelle fonction *principale* doivent être déclarés:


```
* package main;
Program
0.- Module: main

* func main () () {};
Program
0.- Module: main
	Functions
		0.- Function: main () ()

*
```

Comme on peut le voir, la structure du programme est affichée chaque fois qu'un nouvel élément est ajouté au programme.

### Commandes de Méta-programmation

`:dProgram` a été utilisé dans la sous-section ci-dessus. Toute déclaration qui commence par deux points (:) fait partie d'une catégorie d'instructions connues sous le nom de "commandes de méta-programmation".

Déclarer des éléments dans la REPL demande à CX de les ajouter à la structure du programme. Mais, comme dans de nombreuses autres langages de programmation, ces déclarations sont limitées à seulement être ajoutées, voir au plus à être redéfinies.

Ainsi, comme dans de nombreuses autres langages de programmation qui fournissent un REPL, le programmeur est limité à ajouter de nouveaux éléments à un programme voir au plus à redéfinir des éléments. Les commandes de méta-programmation permettent au programmeur d'avoir plus de contrôle sur la modification de la structure du programme.

`: dProgram`,`: dState` et `: dStack` sont utilisés à des fins de débogage uniquement, en affichant respectivement la structure du programme, l'état de l'appel actuel et la pile d'appel complète pour l'utilisateur. `: step` indique à l'interprèteur d'aller en avant ou en arrière dans son exécution. `: package`,`: func` et `: struct`, appelés *sélecteurs*, sont utilisés pour modifier la portée du programme. `: rem` donne l'accès du programmeur à *removers*, qui peut être utilisé pour supprimer sélectivement des éléments de la structure d'un programme. `: aff` est utilisé pour accéder au système d'attribution de CX; Cette commande de méta-programmation sert à interroger et à appliquer des options pour les différents éléments d'un programme. Enfin, `: clauses` est utilisé pour définir les clauses d'un module à utiliser par le [système de restrictions défini par l'utilisateur] (#user-defined-restrictions); `: object` et`: objects` sont utilisés pour ajouter et afficher des objets, `: query` est utilisé pour définir la requête du module, et enfin `: dQuery` est un assistant pour le débogage des restrictions définies par l'utilisateur.


### Stepping

Un programme démarré en mode REPL peut être initialisé avec une structure de programme définie dans un fichier source. Par exemple:
répertoire actuel


```
$ ./cx --load examples/looping.cx

```

charge `looping.cx` dans le répertoire des exemples (la liste complète des exemples peut être trouvée dans [le dépôt du projet](https://github.com/skycoin/cx)). Même si un programme a été chargé, il n'a pas encore été exécuté. Dans la REPL, pour exécuter un programme il faut utiliser la commande de méta-programmation `: step`. Pour exécuter un programme jusqu'à la fin il faut utiliser `: step 0;`. Mais `: step` est intéressant car il peut prendre d'autres entiers comme argument (même des entiers négatifs). Par exemple:


```
CX REPL
More information about CX is available at https://github.com/skycoin/cx

* :dStack false;

* :step 5;
0

* :step 5;
1

* :step 5;
2

*
```

Le programme *examples/looping.cx* se déroule en 5 étapes à la fois. Nous pouvons voir que 5 étapes sont nécessaires pour que le programme réévalue la condition *while*, affiche le compteur et ajoute 1 au compteur.

`:step -5`.

```
...

* :step 5;
2

* :step -5;

* :step 5;
2

*
```

Après avoir demandé au CX d'avancer à nouveau de 5 étapes, le 2 est à nouveau affiché sur la console. Il faut noter que le compteur n'est pas simplement assigné avec une valeur différente. La pile d'appel est retournée à un état précédent.


### Débogage Interactif

Un programme CX entrera en mode REPL une fois qu'une erreur aura été trouvée. Ce comportement donne au programmeur la possibilité de déboguer le programme avant de tenter de reprendre son exécution.

Dans l'exemple ci-dessous, une erreur de division par 0 est générée : la REPL avertit le programmeur de l'erreur, le dernier appel dans la pile d'appel est déversé et la REPL continue son exécution.


```
CX REPL
More information about CX is available at https://github.com/skycoin/cx

* package main;

* func main () () {};

* :func main;
main
:func main {...
	* foo := divI32(5, 3);
main
:func main {...
	* bar := divI32(10, 0);
main
:func main {...
	* :step 0;
fn:main ln:0, 	locals:
>> 1
fn:main ln:1, 	locals: foo: 1

Call's State:
foo:		1

divI32() Arguments:
0: 10
1: 0

0: divI32: Division by 0
main
:func main {...
	*
```

De même, si un programme est donné en tant qu'entrée à l'interpréteur CX sans appeler la REPL, mais qu'une erreur est soulevée, la REPL sera appelé pour que le programmeur ou l'administrateur système débogue le programme:


```
$ ./cx examples/program-halt.cx
1

Call's State:
nonAssign_0:		1
nonAssign_1:		1

divI32() Arguments:
0: 5
1: 0

5: divI32: Division by 0
CX REPL
More information about CX is available at https://github.com/skycoin/cx

*
```

# Algorithme évolutif intégré

Le système d'attribution et les fonctions de méta-programmation dans CX apportent une flexibilité permettant de changer la structure du programme de manière supervisée. Cependant les attributions peuvent encore être automatisées en ayant une fonction qui sélectionne l'indice de l'attribution à appliquer.

`evolve` est une fonction native qui construit des fonctions définies par l'utilisateur en utilisant des fonctionnalités aléatoires.

`evolve` suit les principes du calcul évolutif. En particulier, `evolve` effectue une technique appelée programmation génétique. La programmation génétique tente de trouver une combinaison d'opérateurs et d'arguments qui résoudront un problème. Par exemple, vous pouvez chargé `evolve` de trouver une combinaison d'opérateurs qui, lorsque vous envoyez 10 comme argument, renvoie 20. Cela pourrait sembler banal, mais la programmation génétique et d'autres algorithmes évolutifs peuvent résoudre des problèmes très complexes.

Dans le répertoire *examples* du dépot github, on peut trouver un exemple (*examples/evolving-a-function.cx*) qui décrit le processus pour faire évoluer  une fonction [d'ajustement de courbe](https://fr.wikipedia.org/wiki/Ajustement_de_courbe).


# Sérialisation

Un programme CX peut être partiellement ou entièrement sérialisé sur un tableau d'octets. Cette capacité de sérialisation permet à un programme de créer une image de programme (similaire aux [images système](https://fr.wikipedia.org/wiki/Image_syst%C3%A8me)), où l'état exact de la sérialisation du programme est maintenu. Cela signifie qu'un programme sérialisé peut être désérialisé et reprendre son exécution plus tard. La sérialisation peut également être utilisée pour créer des sauvegardes.

Un programme CX peut tirer parti de ses fonctionnalités intégrées pour créer des scénarios intéressants. Par exemple, un programme peut être sérialisé pour créer une sauvegarde de lui-même et démarrer un [algorithme évolutif](#integrated-evolutionary-algorithm) sur l'une de ses fonctions. Si l'algorithme évolutif trouve une fonction qui fonctionne mieux que la définition précédente, on peut conserver cette nouvelle version du programme. Cependant, si l'algorithme évolutif a bien fonctionné, le programme peut être restauré dans la sauvegarde enregistrée. Toutes ces tâches peuvent être automatisées.

