+++
title = "Motivaciones del diseño del algoritmo de consenso Obelisk"
tags = [
    "Obelisk",
    "Consensus",
    "Skywire",
]
date = "2017-10-26"
bounty = 20
aliases = [
	"/es/statement/obelisk-consensus-algorithm-design-motivations/"
]
+++

*Esta es una publicación archivada del foro BitcoinTalks el 19 de Junio del 2014*

>Cita de: yxxyun en Junio 19, 2014, 02:52:38 AM

>>Cita de: skycoin en Junio 19, 2014, 02:31:59 AM

>>>Cita de: FrictionlessCoin en Junio 18, 2014, 09:15:07 PM

>>>>Cita de: skycoin en Junio 18, 2014, 09:08:56 PM

>>>>Actualización del desarrollo:

>>>>Hemos descubierto una forma de prevenir un ataque Sybil usando un sistema Proof of Stake híbrido.

>>>>Para crear un nodo, debes probar que tienes monedas. Digamos 10 monedas. Mandas 10 monedas a dirección 'A'. Después, mandas las 10 monedas de dirección 'A' a dirección 'B'. Después, agregas una firma usando la llave pública en dirección 'A' para firmar un mensaje en tu blockchain de Obelisk.

>>>>Alternativamente, podrías publicar la llave pública para dirección 'A' y después solo firmar un mensaje con esa llave pública. El nodo tendría que publicar una firma cada periodo de tiempo, o cada cierto número de bloques de las monedas de reserva que están siendo movidas, para mantener relaciones de confianza validas con otros compañeros.

>>>>Alternativamente, Proof of Burn (Prueba de Quemado) podría ser requerido, cuando monedas son enviadas de dirección 'A' a dirección 'B' que no tiene una llave privada. Proof of Burn entra en conflicto con el requerimiento de que nadie necesitaría descargar todo el blockchain desde el principio para operar un nodo entero, así que es poco probable.

>>>>Este sistema fija un límite superior al número de nodos en Obelisk y restringe a los titulares de monedas la habilidad de correr nodos en este. El límite superior en el número de nodos y los requerimientos de moneda, agregan una capa más de protección contra ataques Sybil.

>>>No me queda claro como es que esto previene un ataque Sybil. ¿Simplemente estas agregando un costo por la adición de nodos a la red, y por lo tanto un ataque Sybil requeriría un costo financiero?

>>Es solo una idea en esta etapa. Encontramos una mejora. Cada nodo en Obelisk tiene una llave pública. Hacemos hash la llave pública en una dirección y luego esta almacena 10 monedas en una salida que es propiedad de tal dirección.

>>No agrega un costo, solo prueba que tú eres el dueño de 10 monedas. Prueba que tú conoces la llave privada, para una llave pública, cuya dirección tiene 10 monedas en esta. Todavía puedes gastar las monedas.

>>La idea es que fija un límite superior al número de nodos. Si 10 monedas deben ser retenidas y hay 100 millones de monedas, entonces fija un límite superior a la red de 10 millones de nodos. El límite superior no parece ser matemáticamente útil, por ahora, pero es algo que deberíamos tener en cuenta.

>>Cuando se corre un nuevo nodo de Obelisk, va a "confiar" en algunos compañeros al azar. El Usuario también puede agregar unos cuantos nodos manualmente en los que el confíe (intercambios o miembros de la comunidad confiables). Un nodo es identificado por el hash de su llave pública y encontrado por DHT. No es como Bitcoin, en el que los nodos son pares de IP:puerto. Puedes mover tu computadora de un lado a otro y la identidad del nodo no depende de su dirección IP.

>>Queremos que la red sea segura con nodos elegidos al azar. No queremos una situación como Ripple, en la que los nodos de los tres desarrolladores controlan la red. Sin embargo, queremos prevenir una situación en la que alguien corre 200,000 nodos y trata de reunir las relaciones de confianza de usuarios nuevos. Estos nodos de ataque Sybil, generalmente hablando, no pueden lanzar un ataque del 51%, pero cualquier cosa que incremente el costo del ataque sigue siendo útil.

>>Quizá, lo restringiremos para que los usuarios nuevos solo confíen en nodos al azar que tengan un balance de monedas. Las relaciones de confianza no serán cortadas si el nodo no tiene un balance de monedas, pero tampoco obtendrán nuevos usuarios al azar.

>>El gráfico de conectividad para relaciones de confianza, se supone que es un gráfico aleatorio completamente conectado. Unos cuantos nodos (miembros de la comunidad confiables, casas de cambio, sitios web, organizaciones) tendrán más relaciones de confianza y eso ayuda un poco al tiempo de convergencia para el consenso de bloques. Reduce un poco el diámetro de la red. Algunos nodos serán utilizados para verificar consenso (tu escoges un montón de casas de cambio o diferentes llaves públicas), esos nodos no afectan decisiones de consenso, pero son "oráculos de consenso" para chequear si tu nodo ha convergido con la red.

>>Si dos casas de cambio grandes tienen diferentes consensos para un bloque en particular, es un problema. Esto podría indicar una división de red (netsplit) o un ataque a la red. Las casa de cambio deberían suspender el trueque hasta que se resuelva el problema.

>¿Obelisk es el nodo para consenso de distribución? Yo pensaba que skycoin era el nodo...

Si.

Skycoin tiene un blockchain. El blockchain está en https://github.com/skycoin/skycoin/tree/develop/src/coin. Esto analiza los bloques y trata con salidas y transacciones que no han sido gastadas.

Skywire es el daemon y tiene una "arquitectura de servicio". Es capaz de correr servicios tales como sincronizado del blockchain y otras cosas. La red de malla está siendo implementada actualmente como un servicio encima de skywire (aunque esto quizá tenga que cambiar).

El mecanismo de consenso esta fuera del blockchain. Los nodos de Obelisk (los cuales probablemente sean implementados como un servicio de skywire) tienen un blockchain. Cada nodo tiene una llave pública, la cual lo identifica. Cada nodo tiene su propio blockchain (no hay monedas en este blockchain). El nodo crea un bloque nuevo y lo firma con su llave privada. los blockchains de Obelisk son utilizados para negociar consenso (determinando el bloque cabeza en el blockchain de Skycoin). Obelisk utiliza Ben-Or para consenso aleatorio. Cada nodo de Obelisk tiene una lista de otros nodos a los que se suscribe. Tales nodos influyen en las decisiones de consenso y votación del nodo local. Para topologías de red no-patológicas, el consenso local probablemente converge en un consenso global.

Cada nodo vota en el siguiente bloque en la cadena. Un nodo propone el siguiente bloque y los nodos votan por el sucesor. Los votos son publicados en los bloques del blockchain de Obelisk por cada nodo. Los votos de tu nodo cambian al azar de vez en cuando entre las alternativas. Cuando un 40% de tus compañeros (los nodos a los que estas suscrito) han llegado a un consenso, te cambias a ese candidato. La red puede votar en varios 'forks' a la vez, no se alenta mientras espera por un consenso. Los 'forks' son reducidos a una sola cadena a lo largo del tiempo, Divisiones de dos o tres bloques son normales, pero después de unas cuantas confirmaciones, la probabilidad de que el bloque se revierta disminuye exponencialmente a cero. Si una transacción ha sido ejecutada en todas las cadenas candidatos, entonces esencialmente es ejecutada, incluso si la cadena de consenso en particular no ha sido decidida aun.

Eso es binario Ben-Or, y Skycoin usará algo un poco más avanzado. que es más rápido cuando hay múltiples bloques sucesores de donde escoger en el conjunto de consenso. La aleatorización es importante para prevenir que sub-gráficos de la red se atoren. El proceso de votación es una forma de "recocido" en donde cada nodo llegara al consenso global independientemente, por nada mas que su propia información local.

El proceso de consenso ocurre en público. Un nodo publica bloques, los firma con su llave privada, y los bloques son replicados peer-to-peer entre suscriptores de la cadena. Además, hay "oracles de consenso", los cuales son nodos que son usados para verificar el consenso pero sin influir en este. Así que, podrías escoger las llaves públicas de algunas casas de cambio y miembros de la comunidad confiables y tu nodo las usara para detectar si algo está mal. Esto se utiliza para detectar netsplits, y también protege contra un ataque en el que un hacker controla to router y toma control de los compañeros a los que te puedes conectar.

Si un nodo aparece en la red e intenta que esta acepte una cadena diferente (ataque del 51%, revertir transacciones), usualmente es ignorado. La mayoría de los ataques del 51% requieren comportamiento maligno por parte de un nodo, el cual es automáticamente detectado y resulta en un nodo suscrito removiéndolo de su lista de confianza. La estrategia más fácil de ataque del 51% es fácil de detectar y probar con certeza matemática que fue un intento deliberado por revertir transacciones, porque requiere retroactividad en las decisiones de consenso de bloques. Requiere publicar dos bloques firmados con el mismo número de secuencia, así que hicimos que para un nodo esto fuera una ofensa automáticamente merecedora de un 'ban'.

Estamos tratando de eliminar la última posibilidad de un ataque del 51%, que es cuando una subred de nodos se desconecta (ataque de netsplit) y luego regresa a la red con un consenso de blockchain diferente y trata de forzarlo en la red para revertir transacciones. La mayoría de estos ataques van a fallar porque la subred no tendrá suficiente influencia.

Este tipo de ataque aún es muy difícil de realizar. En caso de haber un ataque del 51% exitoso, una solución es congelar la red y dejar que cada nodo/usuario elija individualmente que cadena es la válida y dejar que la gente le aplique un 'ban' a los nodos atacantes manualmente. El 'oracle' de consenso permite saber a cada nodo, con alta probabilidad, si el estado esta sincronizado, si un consenso global ha sido alcanzado, y si son parte de un subgrafo de netsplit. Pensamos que es posible para cada nodo el saber, con una alta probabilidad de corrección y de tan solo información local, si un nodo no estuvo en línea durante una decisión de consenso, y también el ignorar nodos que no estuvieron en línea y de repente regresan tratando de forzar un 'fork' de cadena en la red.

En Bitcoin, si tienes la mayoría del poder de hashing, puedes revertir transacciones cuando quieras.

En Skycoin, para revertir transacciones:

- Debes controlar un gran número de nodos
- Los nodos que controlas deben ser "influyentes" y confiables dentro de la topología de red
- Tus nodos necesitan exhibir un comportamiento patológico de ataque extremadamente evidente, sin este siendo detectado, porque la detección resulta en la perdida de relaciones de confianza necesarias para atacar la red.
- Tus nodos necesitan estar en una topología de ataque patológico, sin ser detectado (la mayoría de los nodos 'bot' serán confiados por muy pocos humanos y serán muy obvios)
- Necesitas lograr que los nodos bajo tu control confabulen de una manera que resulte en un ataque exitoso (esto no es muy sencillo)
- Si el ataque tiene éxito, debes evitar que la red revierta el ataque manualmente (bastante difícil si la gente perdió monedas o dinero por el ataque)

Para probar que es a prueba de ataques del 51%, tienes que escribir las suposiciones que haces y crear un simple modelo matemático para después probar las condiciones bajo las cuales un ataque es posible, tratas de eliminarlas, y si no puedes, las haces tan difíciles como sea posible. Incrementas el costo de un ataque y reduces las probabilidades de que alguno en especifico tenga éxito. Entonces reduces la recompensa e incentivos por el ataque.

El proceso de consenso es simple y fácil de modelar, pero poco intuitivo sin verlo. Con el tiempo habrá un sitio en javascript que tendrá una animación de un proceso de consenso con el cual podrás jugar.
