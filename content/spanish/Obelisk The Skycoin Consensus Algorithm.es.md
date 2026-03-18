+++
title = "Obelisk: El Algoritmo de Consenso de Skycoin"
tags = [
    "Statement",
    "Obelisk",
    "Consensus",
]
bounty = 8
date = "2017-09-08"
image = "img/obelisk-the-skycoin-consensus-algorithm.png"
aliases = [
	"/es/statement/obelisk-the-skycoin-consensus-algorithm/"
]
+++

La cadena de bloques (blockchain) de Skycoin hace uso de un nuevo tipo de
algoritmo de consenso llamado "Obelisk" que reemplaza tanto a la prueba de
trabajo ("PoW") como la prueba de participación ("PoS").

El objetivo de los desarrolladores de Skycoin era corregir los principales
fallos de seguridad y las "tendencias centralizadoras" asociadas con las
redes de cadenas de bloques en las que el consenso se basa en algoritmos
PoW o PoS y la creación de monedas está ligada a un proceso de minería. Por
lo tanto, Skycoin está tratando de crear una criptomoneda que cumpla mejor
con la visión original de Satoshi de un sistema de moneda digital
completamente descentralizado.

Al hacer esto, la tecnología de Skycoin crea una red blockchain sin
requisitos de minería, con suministros fijos de crypto-tokens, tiempos de
transacción de 10 segundos y mayor seguridad. En un sistema en el que la
conexión entre la creación de la moneda y el control de la red está cortada,
los crypto-tokens pierden su función política y comienzan a funcionar más como
una forma de propiedad digital, en estricto sentido.

## Prueba de trabajo y el sistema de Bitcoin

Pensar que el proceso de minería generaría una estructura de incentivos
económicos que promovería la descentralización de la red fue un error de
cálculo fundamental en la programación inicial de Bitcoin. De hecho, el
vínculo entre el consenso y el poder de cómputo (hashing power) incentiva la
compra de una capacidad de cómputo cada vez mayor, para controlar la red de
consenso.

La red de Bitcoin, por ejemplo, está controlada de facto por tres grupos de
minería con fines de lucro que han podido concentrar una gran parte de la
potencia de cómputo de la red en sus servidores. Estos grupos han comenzado a
actuar como un cártel, estableciendo acuerdos para dividir el poder de cómputo
entre ellos mismos. La relación entre la minería y el control de la red ya
había sido identificada por Satoshi como la principal amenaza no criptográfica
para la estabilidad de la red. Dicha relación permite, a los actores que
acumulen suficiente poder de cómputo y logren una tasa de hash (hash rate)
mayoritaria, falsificar o revertir las transacciones en la red mediante un
ataque del 51%. Algunos argumentan que esta vulnerabilidad se ha vuelto menos
apremiante en un ambiente donde el poder de cómputo está altamente centralizado
en actores que han invertido grandes sumas de dinero en la red de Bitcoin y
dependen, para supervivencia, de que la moneda mantenga un valor alto. Sin
embargo, el poder de influir en la red todavía está muy concentrado, lo que
va totalmente en contra del objetivo de una criptomoneda distribuida basada en
un libro mayor (ledger).

Así, el algoritmo PoW de la red Bitcoin introduce problemas de seguridad y
monopolio al darle poder sobre la red a un actor capaz de movilizar
suficientes recursos económicos como para controlar el proceso de minería.

Esto también implica que el funcionamiento de la red es económica y
ambientalmente ineficiente. La entrada continua de potencia de cómputo
requerida por el proceso de minería consume grandes cantidades de electricidad,
incurriendo en costos mensuales en el rango de las decenas de millones. Estos
costos solo pueden compensarse con un crecimiento exponencial en la entrada de
nuevo capital y de nuevos usuarios. Solo un número muy pequeño de monedas bien
establecidas, como Bitcoin y Ethereum, podrán atraer suficientes usuarios para
lograr un flujo continuo de ese tipo. En el caso de la mayoría de las otras
monedas basadas en PoW / PoS, el costo de la minería PoW / PoS se paga mediante
una valoración de mercado menor, dado que el dinero va siendo extraído de la
moneda por los costos de minería, hasta que se abandona la moneda.

>En este momento, la economía de Bitcoin consiste en nuevos usuarios que
invierten su dinero y luego el dinero se arroja en un pozo y se quema, en un
ritual de sacrificio a los costos de electricidad de la minería. Si el usuario
promedio tuviera que pagar directamente el costo de electricidad de los
mineros, en forma de comisiones por las transacciones, en lugar de ser robados
por ellos a través de la inflación generada por la creación de nuevas monedas,
entonces cada transacción de Bitcoin costaría más de $50. Sería más costoso que
una transferencia bancaria internacional.

## La tendencia centralizadora de las pruebas de participación (PoS)

Aunque los algoritmos de prueba de participación abordan el problema de
seguridad de los ataques del 51%, son posiblemente aún más vulnerables a la
centralización que las redes PoW. En las redes PoS, la cantidad de
criptomonedas en posesión de los participantes es la que determina su autoridad
y poder de votación para implementar cambios técnicos en la red. Los
participantes pueden minar una porción equivalente a la cantidad de monedas que
poseen, independientemente del poder de cómputo.

Este principio aumenta significativamente las barreras económicas para lanzar
un ataque del 51%, porque es muy probable que el costo financiero de adquirir
la mayoría de los tokens de la red, a través del mercado abierto, exceda la
ganancia potencial. Si un atacante termina teniendo la participación
mayoritaria en la red, será quien más sufra por el impacto del ataque hacia la
estabilidad de la red o el valor externo de la criptomoneda.

Sin embargo, aunque aumenta las barreras contra los ataques dirigidos por
humanos en la red, los sistemas PoS crean un impulso centralizador que es tan
fuerte como, si no más fuerte que, en el caso de los sistemas PoW. Tal como
resume Joseph Young en su comparación de los dos sistemas en
[coinfox.info](http://www.coinfox.info/), “Un sistema en el que la persona
con mayor participación en monedas goza de un amplio control y autoridad sobre
los aspectos técnicos y económicos de la red crea un gran problema de
monopolio”. Mientras que en un sistema PoW la votación sobre la implementación
de cambios técnicos en la red “está dividida entre mineros, desarrolladores y
otros miembros cruciales de la comunidad”, en un sistema PoS “los usuarios con
mayor participación en monedas tienen la capacidad técnica de hacer cualquier
cambio que deseen sin tener en cuenta la voluntad de la comunidad, las empresas,
los mineros y los desarrolladores. Esta centralización del poder de voto y,
esencialmente, del control de la red, derrumba el propósito de una criptomoneda
distribuida basada en el libro mayor, ya que contradice todo su principio de
distribuir todos los elementos dentro de la red para evitar la presencia de
una autoridad central”.

## Obelisk: el algoritmo de consenso distribuido de Skycoin

Para abordar este problema de centralización, Skycoin va más allá de
PoW/PoS. Utiliza un algoritmo de consenso distribuido, llamado Obelisk, que
distribuye la influencia sobre la red de acuerdo con una "red de confianza".
En esencia, cada nodo tiene una lista de otros nodos a los que se ha
subscrito, y la densidad de la red de suscriptores de un nodo determina su
influencia en la red. A cada nodo se le asigna una cadena de bloques personal
que actúa como un "canal de transmisión pública" en el que todas las acciones
de un nodo son registradas de manera visible y pública. Como todas las
decisiones y comunicaciones de consenso se producen a través de las cadenas
de bloques personales de cada nodo, la comunidad puede auditar muy fácilmente
los nodos, en busca de fraudes o ilícitos. Cómo se toman las decisiones en
la red y qué nodos influyen en esas decisiones es completamente transparente.

El registro público dejado por el blockchain personal de cada nodo permite
que la red reaccione a las deserciones cortando conexiones con los nodos poco
confiables o maliciosos, contrayendo la red a un núcleo más pequeño y denso
de nodos de confianza. Por lo tanto, en principio, si la comunidad no confía
en los nodos que la representa o siente que el poder dentro de la red está
demasiado concentrado (o no lo suficientemente concentrado) la comunidad puede
cambiar colectivamente el equilibrio de poder de la red al cambiar
colectivamente sus relaciones confianza en la red. La rendición de cuentas de
los nodos a la comunidad y las auditorías de terceros, así como la
transparencia del consenso, fortalecen la toma de decisiones colectiva y, por
lo tanto, introducen un elemento altamente democrático y descentralizador en
la red.

Este sistema proporciona una moneda digital con tiempos de transacción
significativamente reducidos, sin requisitos de minería y con mayor seguridad.

*Leer más:*

* *[Skycoin Consensus Algorithm Whitepapers](https://www.skycoin.com/whitepapers)*
* *[Obelisk: El Algoritmo de Consenso de Skycoin | Páginas de Información](/overview/obelisk-skycoin-consensus-algorithm-information-pages/)*
