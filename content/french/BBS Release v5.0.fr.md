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
	"/fr/bbs/bbs-release-v5.0/"
]
+++

La version 5.0 de Skycoin BBS a enfin été publiée avec plusieurs changements apportés!

## Client léger

Le changement le plus apparent est l'introduction du client léger. Vous avez maintenant accès au Skycoin BBS sans avoir à mettre en place un noeud! Vous n'avez qu'à visiter [bbs.skycoin.com](http://bbs.skycoin.com).

Dans les versions précédentes, on peut seulement (et devrait seulement) accéder / soumettre du contenu via une interface utilisateur web qui était servi localement. Comme cette interface web (et l'API qui l'appel) a un contrôle direct sur le noeud lui-même et peut signer du contenu avec les clés privées qui sont enregistrées dans le noeud (ou du côté serveur), ce n'est pas approprié de l'exposer au public.

Par conséquent, l'introduction d'un client léger requiert que la gestion des utilisateurs ainsi que le processus de signature du contenu pour les soumissions soient gérés du côté client. Cela nécessite de complètement remanier le (ou les) points d'accès à l'API pour la soumission de contenu et d'importants changements au niveau de la partie frontale.

Des détails sur le nouveau processus de soumission de contenu peut être trouvé dans le wiki BBS: [github.com/skycoin/bbs/wiki/Content-Submission-Process](https://github.com/skycoin/bbs/wiki/Content-Submission-Process).

Présentement, le frontal charge extrêmement lentement. Ceci est causé par l'utilisation de [GopherJS](https://github.com/gopherjs) pour gérer la génération de graines et de clés publiques/privées, ainsi que la signature et la vérification des données. Dans les sorties futures, nous allons utiliser des librairies JavaScript natives pour améliorer la performance.

## Interface de ligne de commande

Après l'introduction de client léger visible publiquement, nous avons enlevé les points d'accès de l'API qui géraient le contrôle administratif et avons introduit une interface de ligne de commande pour gérer de telles interactions.

De plus amples renseignement peuvent être trouvé ici : [github.com/skycoin/bbs/tree/master/cmd/bbscli](https://github.com/skycoin/bbs/tree/master/cmd/bbscli).

## Autres améliorations

* Améliorations à l'Import/Export (malheuresement, ceci n'est pas compatible avec l'import/export du BBS v4.x)
* Simplifications au code et améliorations de la performance pour les soumissions à distance et intéraction avec Skycoin Messenger. Mise à jour pour utiliser la dernière version de Messenger.
* Améliorations de la performance de la gestion de fichiers
* Meilleure gestion de racine CXO invalides
* Meilleure gestion des déconnections

## Téléchargements

Pour télécharger BBS, navigué au [github.com/skycoin/bbs/releases](https://github.com/skycoin/bbs/releases) (le code source y est également disponible).

À noter que vous pouvez également avoir accès au BBS via [bbs.skycoin.com](http://bbs.skycoin.com).

## Documentation

Nous avons commencé une page wiki ici: [github.com/skycoin/bbs/wiki](https://github.com/skycoin/bbs/wiki).

À noter: ceci est un travail en cours.

## Communauté

Nous avons un canal Telegram: [@skycoinbbs](https://t.me/skycoinbbs).
