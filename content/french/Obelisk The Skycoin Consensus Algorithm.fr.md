+++
title = "Obelisk: L'algorithme de consensus de Skycoin"
tags = [
    "Statement",
]
date = "2017-09-08"
image = "img/obelisk-the-skycoin-consensus-algorithm.png"
aliases = [
	"/fr/statement/obelisk-the-skycoin-consensus-algorithm/"
]
+++

La chaîne de blocs (ou blockchain) de Skycoin utilise un nouvel algorithme de consensus appelé « Obelisk »  qui remplace à la fois la Preuve de Travail (Proof of Work ou PoW) et la Preuve de Participation (Proof of Stake ou PoS).

L'objectif des développeurs de Skycoin était de corriger les principaux défauts de sécurité et les tendances centralisées associés aux réseaux blockchain dans lesquels le consensus est basé sur des algorithmes PoW ou PoS et la création de pièces est liée à un processus de minage. Skycoin essaie donc de créer une crypto-monnaie qui répond mieux à la vision originale de Satoshi d'un système de monnaie numérique entièrement décentralisé.

Pour ce faire, la technologie Skycoin crée un réseau de chaînes de blocs sans exigence de minage, un approvisionnement fixe de crypto-jetons, un temps de transaction de 10 secondes et plus de sécurité. Dans un système dans lequel la connexion entre la création de pièces et le contrôle sur le réseau est coupée, les crypto-jetons perdent leur fonction politique et commencent à agir plus comme une forme de propriété numérique dans le sens direct du terme.

## Preuve de Travail et le système du Bitcoin

C'était une erreur de jugement fondamentale dans la conception de Bitcoin que le processus de minage puisse promouvoir la décentralisation à travers son incitation économique. En réalité, le lien entre le consensus et la puissance de hachage incite l'achat d'une capacité de traitement toujours plus grande pour prendre le controle du réseau.

Le réseau Bitcoin, par exemple, est contrôlé par trois grands groupes de mineur qui tirent profit de la concentration d'une grande partie de la puissance de hachage du réseau sur leurs propres serveurs. Ces groupes ont commencé à agir comme un cartel, en divisant par accord la puissance de hachage entre eux. Le lien entre le minage et le controle du réseau était déjà identifié par Satoshi comme la plus grande menace à la stabilité du réseau Bitcoin. Cela permet aux acteurs qui accumulent suffisamment de puissance de traitement et qui atteignent un taux de hachage majoritaire de falsifier ou rétablir les transactions sur le réseau via une attaque de 51%.
Certains prétendent que cette vulnérabilité est devenue moins critique dans un environnement où le pouvoir de hachage est fortement centralisé avec des acteurs qui ont investi de grosses sommes dans le Bitcoin et dépendent de la grande valeur du Bitcoin pour leur survie. Pourtant le pouvoir d'influencer le réseau est encore très concentré, allant à l'encontre de l'objectif d'avoir une crypto-monnaie distribuée.

Ainsi l'algorithme PoW du réseau Bitcoin introduit les problèmes de sécurité et de monopole en accordant plus d'importance à la puissance de hachage qu'au réseau en lui même, n'importe quelle personne ayant les ressources économiques suffisantes pouvant le controler à travers le processus de minage.

Cela implique également que l'exploitation du réseau est inefficace à la fois économiquement et sur le plan environnemental.
L'apport continu en puissance de traitement requis par le processus de minage utilise de grandes quantités d'électricité, entraînant des couts mensuels
en dizaines de millions d'euros. Ces coûts ne peuvent être compensés qu'avec un afflux exponentiel de nouveaux capitaux apportés par les nouveaux utilisateurs. Seulement un très petit nombre de crypto-monnaies bien établies, comme Bitcoin et Ethereum, seront
capable d'attirer suffisamment d'utilisateurs pour obtenir un tel flux continu. Dans le cas de la plupart des autres crypto-monnaies PoW / PoS, le coût
du minage PoW / PoS est payé via une évaluation de marché plus faible vu que l'argent est drainé en dehors d'une crypto-monnaie à travers son cout de minage jusqu'à ce que cette dernière soit abandonnée.

>À l'heure actuelle, l'économie du Bitcoin se résume à de nouveaux utilisateurs investissant leur argent, argent qui sera ensuite utiliser à payer les couts d'électricité des mineurs. Si l'utilisateur moyen devait payer directement les frais d'électricité des mineurs comme frais de transaction, au lieu d'être volé à travers l'inflation par la création de nouvelles pièces, chaque transaction de Bitcoin couterait plus de 50$. Le bitcoin serait alors plus couteux qu'un virement bancaire international classique.


## La tendance centralisante de la Preuve de Participation

Bien que les algorithmes de Preuve de Participation (PoS) s'attaquent au problème de sécurité des attaques de 51%,
ils sont sans doute encore plus vulnérables à la centralisation que les réseaux de Preuve de Travail(PoW). Avec la Preuve de Participation, la taille des participations en crypto-monnaie que possèdent les utilisateurs du réseau détermine leur autorité et leur pouvoir de vote dans la mise en place de changement technique dans le réseau. Les participants peuvent miner une portion équivalente de leur participation indépendamment du pouvoir de traitement.

Ce principe augmente considérablement les obstacles économiques au lancement d'une attaque de 51% parce que le coût financier de l'acquisition de la majorité des jetons du réseau sur le marché est très susceptible de dépasser le gain potentiel. Si un attaquant finit comme le possesseur de la majorité des participations du réseau, il souffrira plus de l'impact de l'attaque sur la stabilité du réseau que de la valeur externe de la crypto-monnaie.

Pourtant, tout en augmentant les obstacles aux attaques dirigées par l'homme sur le réseau, la Preuve de Participation crée une impulsion centralisatrice qui est aussi forte, voir plus forte, que dans le cas de la Preuve de Travail. Comme Joseph Young le résume dans sa comparaison des deux
systèmes sur [coinfox.info](http://www.coinfox.info/), "Un système où la partie prenante majoritaire bénéficie d'un contrôle et d'une autorité approfondie sur les plans techniques et les aspects économiques du réseau, crée un problème de monopole majeur."
Alors que dans un système par Preuve de Travail, le vote sur la mise en œuvre des modifications techniques au réseau "est divisé parmi les mineurs, les développeurs et d'autres membres cruciaux de la communauté," dans un système par Preuve de Participation, "les parties prenantes majoritaires ont une capacité technique à apporter tous les changements qu'ils veulent sans devoir considérer la volonté de la communauté, des entreprises, des mineurs et des développeurs. Cette centralisation du pouvoir de vote et surtout le controle du réseau, va à l'encontre du but recherché d'une crypto-monnaie distribuée car cela contredit son principe de distribuer tous les éléments à l'intérieur de son réseau pour éviter la présence d'une autorité centrale ".


## Obelisk: L'algorithme de consensus distribuée de Skycoin

Pour résoudre ce problème de centralisation, Skycoin se place au-delà du PoW / PoS.
Il utilise un algorithme de consensus distribué, appelé Obelisk, qui
distribue l'influence sur le réseau selon un «réseau de confiance». En résumé, chaque noeud a une liste d'autres nœuds auxquels il s'inscrit et la densité du réseau d'abonnés d'un noeud détermine son influence sur le
réseau. Chaque noeud reçoit une chaîne de blocs personnel qui agit comme un "canal de diffusion public" sur lequel toutes les actions d'un noeud sont visibles et enregistrés publiquement. Comme toutes les décisions de consensus et les communications se produisent à travers
les chaînes de blocs personnelles de chaque noeud, la communauté peut très facilement auditer les nœuds pour triche ou collusion. Comment les décisions du réseau sont faites et quels nœuds influencent ces décisions est complètement transparent.

L'enregistrement public laissé par la chaine de blocks personnel de chaque noeud permet au réseau de réagir aux défections en coupant les connexions avec les noeuds moins dignes de confiance ou malveillants, en réduisant le réseau à un noyau plus petit et plus dense de nœuds de confiance. Par conséquent, en principe, si la communauté ne fait pas confiance aux noeuds qui les représentent ou estime que le pouvoir au sein du réseau est trop concentré (ou pas suffisamment concentré), la communauté peut déplacer collectivement l'équilibre du pouvoir du réseau en changeant collectivement ses relations de confiance dans le réseau. La responsabilisation des noeuds dans la communauté et les audits des tiers ainsi que la transparence du consensus renforcent la prise de décision collective et introduit ainsi un élément hautement démocratique et décentralisant du réseau.

Ce système fournit un système de monnaie numérique avec des temps de transaction considérablement réduits, aucune exigence de minage et une sécurité accrue.


*Lire la suite:*

* *[Livres blancs de l'alogirthme de consensus de Skycoin](https://www.skycoin.com/whitepapers)*
* *[Obelisk l'Algorithme de Consensus de Skycoin | Pages d'information](/overview/obelisk-skycoin-consensus-algorithm-information-pages/)*
