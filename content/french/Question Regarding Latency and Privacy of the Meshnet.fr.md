+++
title = "Question à propos de la Latence et la confidentialité du Meshnet "
tags = [
    "Ask the Developers",
    "Skywire",
    "Privacy",
]
date = "2017-09-15"
aliases = [
	"/fr/ask-the-developers/question-regarding-latency-and-privacy-of-the-meshnet/"
]
+++

*Cette publication fait référence à Skywire à ses débuts, avant qu'il ne soit nommé Skywire.Elle est tirée d'une publication parue sur
Bitcointalk le 19 Aout 2014.*


Citation de : CraigM le 9 aout 2014, 7:20:24 AM

>Le Meshnet est prévu pour être un outil de confidentialité avec des avantages comparables à TOR, mais avec une latence plus faible.
C'est correct?

>Le Meshnet est prévu pour permettre le financement des nœuds à travers des micro-paiements en Skycoin afin de couvrir les couts de la
bande passante, correct? Ceci ne force t'il pas tous les opérateurs de nœuds à garder des registres publiés et détaillés (sur leurs
chaînes de bloc personnelles) en décrivant toutes les transactions  qui appartiennent à toutes les personnes qui envoient des données à
travers leur nœuds? Il me semble que cela permettrait à n'importe quelle tierce partie de réaliser des 'attaques de corrélation de
trafic' exactement comme celles qui peuvent se faire sur TOR. La différence serait que l'assaillant n’aurait même pas besoin d’accéder
aux connections.  Et même si finalement ces données ne sont pas accessible au public, l’enregistrement de toutes celles-ci pourrait
devenir un vrai problème (elles pourront être saisies par les autorités et occuperont également beaucoup d’espace).

>La version initiale va commencer avec des serveurs de routage centralisés? Ce qui veut dire que si l’on veut se connecter à quelqu'un
alors on doit le dire à une tierce partie ? Cela ne ressemble pas à un service de confidentialité tel que Tor tant que ceci ne sera pas
réglé. Y a-t-il une raison de croire que vous pourrez résoudre ceci bientôt (ou même pouvoir le résoudre tout court car c’est quelque
chose de difficile).

>Comment trouvez-vous une route vers cette tierce partie de confiance qui va ensuite faire le routage pour vous ? Je suppose que vous
allez en faire une situation spécifique (n’utilisez pas le routage provenant de l’envoyeur), cependant je suis curieux de voir si vous
avez une autre conception.

## Réponse :
Oui c’est en fait plus rapide que le TCP/IP. Les fournisseurs de service internet utilise le routage en mode ‘patate chaude’.  La
Latence ne devrait pas être plus mauvaise que celle de TCP/IP et en théorie pourrait  au contraire être meilleure.
**Les garanties de confidentialité sont : **
- Chaque Nœud connait uniquement le saut précédent et le saut suivant
- La transmission entre les nœuds est encryptée
- La transmission est encryptée de bout à bout
- Vos transmissions sont protégées contre les attaques dites de ‘l’homme du milieu’
- Toutes les encryptions sont éphémères et confidentielles
- Le protocole est conçu pour empêcher les inspections approfondies de paquets qui permettent d’identifier les utilisateurs du
protocole (pas de ports fixes, pas de texte en clair en format télégraphique, connectivité fixe entre les nœuds pour le réseau de base,
etc..)
C’est donc comme un TOR avec une latence très faible et des micro-paiements pour la bande passante.
- Il est plus sûr et a une meilleure confidentialité que HTTPS
- Il est plus rapide que TOR et peut être mis à l’échelle mais il y a toujours des attaques possibles contre lui
- Le code est plus simple que celui de TOR, donc il y a moins de place pour des portes dérobées ou des vulnérabilités cachées. Il
y a seulement une dépendance externe dans l’ensemble de l’implémentation.
- Si vous avez besoin d’une sécurité absolue contre   les attaques temporelles, vous
devriez utiliser un service de mélange ou utiliser Bitmessage par-dessus le Darknet.
- Tous les réseaux avec une faible latence sont sujets à des attaques temporelles.

## Serveurs de routage
Oui les Serveurs de routage sont un point faible. Pour une confidentialité maximum vous devriez utiliser votre propre serveur de routage
interne.
Cependant, si vous utilisez un serveur de routage public, vous êtes connecté après avoir fait  plusieurs bonds donc il ne peux pas vous
identifier.  Cela reste tout de même plus sûr d’utiliser son propre serveur de routage.

## Gestion des Micro-Paiements pour la bande passante
La gestion des micros paiements  se fait à travers une tierce partie. Le nœud se connecte à ‘une passerelle’, fait un dépôt d’un jeton à
la passerelle afin d’avoir un crédit. Le nœud peut maintenant générer  des pseudo adresses  de 64 bit avec la passerelle. La
passerelle ne connait pas l’identité du nœud connecté, elle connait uniquement le bon précédent par lequel la connexion est venue.
Donc si vous établissez douze connections avec la passerelle, elles apparaissent comme douze utilisateurs différents pour celle-ci. A
terme la communication avec la passerelle se fera à travers un canal de message asynchrone.
Le nœud qui transmet la bande passante, se connecte également à la passerelle. Les deux nœuds peuvent maintenant se payer à travers la
passerelle, sans que la passerelle ne connaisse l’identité ni de l’un ni de l’autre. Quand un nœud a suffisamment de jetons (un jeton
entier), il peut générer une nouvelle adresse Skycoin et effectuer un retrait de ce jeton à cette adresse.  Les passerelles ne gèrent
qu’un petit nombre de jetons.
N’importe quel serveur qui détient des jetons ou des soldes de comptes au nom de tierces parties peut être une passerelle dans le
protocole Skycoin . Les passerelles sont des institutions de dépôt et elles ont leur propre protocole et API.

**A terme,**
- Il y aura de multiples passerelles et de multiples transferts de jetons entre les passerelles. Ces transactions se font en toute
confidentialité et n’apparaissent pas sur la chaine de bloc tant que vous ne faites pas un retrait des jetons de la passerelle.
- La communication avec les passerelles se feront à travers un canal de communication asynchrone (chaque flux de message aura une
nouvelle pseudo identité)
- Une partie du protocole du Gateway est une  implémentation en transformation opérationnelle (OT implémentation), qui permet de
prouver si une certaine passerelle vole des jetons. Vous signez chaque appel API ver la passerelle, puis la passerelle exécute et signe
la sortie. Cela crée donc une chaine de signatures et de transactions reliées. De plus les passerelles ne peuvent pas faire disparaitre les jetons à moins de  falsifier votre signature. Si vous faites un dépôt de jetons quelque part et que vos jetons disparaissent, vous
pouvez publier le registre de votre transaction et alors le propriétaire du nœud accusé doit produire  un registre montrant que vous
avez autorisé le transfert des coins quelque part. S’il ne peut pas montrer un appel API signé alors cela prouve qu’il ment ou est
malhonnête.
- A terme, les marchés vont opérer sous le protocole des passerelles.

Notre proposition d’avoir une chaine de bloc publique pour les soldes internes dans la passerelle est intéressante.  Je pense que mettre
les transactions internes sur une chaine de bloc personnel publique, pourra garder les échanges honnêtes tout en maintenant l’intimité
des utilisateurs.

