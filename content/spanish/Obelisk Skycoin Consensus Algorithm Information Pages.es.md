+++
title = "Obelisk: El Algoritmo de Consenso de Skycoin | Páginas de Información"
tags = [
    "Consensus",
    "Obelisk",
]
bounty = 10
date = "2017-09-09"
author = "johnstuartmill"
image = "img/obelisk-the-skycoin-consensus-algorithm.png"
aliases = [
	"/es/overview/obelisk-skycoin-consensus-algorithm-information-pages/"
]
+++

- [Puntos destacados acerca del consenso](#puntos-destacados-acerca-del-consenso)
    - [Por qué el consenso](#por-qué-el-consenso)
    - [Alta escalabilidad y bajo consumo de energía](#alta-escalabilidad-y-bajo-consumo-de-energía)
    - [Robusto ante ataques coordinados](#robusto-ante-ataques-coordinados)
    - [El ataque del 51 por ciento](#el-ataque-del-51-por-ciento)
    - [Direcciones IP ocultas](#direcciones-ip-ocultas)
    - [Independencia de la sincronización de reloj](#independencia-de-la-sincronización-de-reloj)
    - [Dos tipos de nodos: de Consenso y de Creación de Bloques](#dos-tipos-de-nodos-de-consenso-y-de-creación-de-bloques)
- [Cómo funciona el Algoritmo de Consenso de Skycoin](#cómo-funciona-el-algoritmo-de-consenso-de-skycoin)
- [Referencias](#referencias)


## Puntos destacados acerca del consenso

### Por qué el consenso

El Algoritmo de Consenso de Skycoin ("Obelisk") sincroniza el estado de la 'blockchain'
(cadena de bloques) de Skycoin en todos los nodos de la red. Esto tiene como resultado
una contabilidad consistente, es decir, cuando se calcula el balance de monedas
de una llave pública específica (o dirección) se obtiene el mismo valor en cada
uno de los nodos que realizó el cálculo.

### Alta escalabilidad y bajo consumo de energía

Por su diseño, el algoritmo es una alternativa escalable y computacionalmente
económica comparada con los sistemas del tipo 'proof of work' (prueba de trabajo), por ello tanto el
algoritmo de consenso como la creación de bloques pueden ejecutarse en un hardware
modesto de bajo costo y bajo consumo de energía, lo que hace que la red de
criptomonedas sea más robusta ante posibles intentos de centralización (es decir,
a través de que el nodo sea asequible económicamente para el público en general).

### Robusto ante ataques coordinados

Nuestro Algoritmo de Consenso (i) converge rápido, (ii) requiere un mínimo tráfico
de red y (iii) puede resistir un ataque coordinado a gran escala llevado a cabo por
una red bien organizada de nodos maliciosos. El algoritmo es no-iterativo, rápido,
puede ser ejecutado en una red dispersa teniendo solo conectividad con el vecino
más cercano (por ejemplo: en Red en Malla) y funciona bien en presencia de ciclos
en el gráfico de conectividad (es decir, *no* se requiere conectividad de tipo DAG).

### El ataque del 51 por ciento

En un sentido limitado, la versión base del Algoritmo puede estar sujeta a este
ataque. Específicamente, cuando nodos modificados o maliciosos que son mayoría
emiten un bloque candidato que cumple con el protocolo y con el UTXO, dicho bloque
gana el consenso. Sin embargo, un bloque con cualquier tipo de incumplimiento es
desechado por el Algoritmo (no modificado) antes de que el bloque tenga la
oportunidad de participar en una prueba de consenso.

Los nodos de consenso pueden utilizar de manera opcional un concepto de
Red-de-Confianza de una manera tal que los mensajes relacionados con el consenso
que provengan de nodos desconocidos (es decir, firmados por llaves públicas que
no son de confianza) sean ignorados.

Cuando el modo Red-de-Confianza es habilitado, activar un número muy grande de
nodos de consenso maliciosos con el fin de (a) provocar un fork en la 'blockchain'
o (b) interrumpir el proceso de consenso tendría poco efecto, a menos que la
gran mayoría de los miembros de la Red-de-Confianza involuntariamente incluyera
a esos nodos maliciosos en sus listas locales de nodos de confianza.

### Direcciones IP ocultas

Los nodos son dirigidos a través de su llave pública criptográfica. La dirección
IP del nodo es conocida solo por los nodos a los que está conectado de manera
directa.

### Independencia de la sincronización de reloj

El algoritmo no usa “wall clock” (es decir, la fecha/hora calendario). En
cambio, los números de secuencia de bloques que son extraídos de los mensajes
relacionados con consenso validado y la 'blockchain' son los que se
utilizan para calcular el tiempo interno del nodo. Esto se puede llamar de
manera informal "reloj de bloque".

### Dos tipos de nodos: de Consenso y de Creación de Bloques

Un nodo de consenso recibe datos de entrada de uno o más nodos de creación
de bloques. Los algoritmos para el consenso y la creación de bloques están
separados, pero ambos operan con las mismas estructuras de datos.
Mencionamos “creación de bloques” donde ayude a entender el Algoritmo de
Consenso y cómo se integra con el resto del sistema.

Ambos tipos de nodos realizan siempre verificación de autoría y detección
de fraudes de fecha de entrada. Los mensajes fraudulentos o inválidos son
detectados, desechados y nunca se propagan; los nodos pares que participan
en actividades sospechosas son desconectados y sus llaves públicas son
colocadas en una lista negra.

## Cómo funciona el Algoritmo de Consenso de Skycoin

Solo para propósitos de exposición, la siguiente descripción asume que (i)
cada nodo es tanto creador de bloques como participante en el consenso, y
(ii) se aceptan los mensajes de consenso generados por nodos en los que no
se confía, es decir, no se realiza filtrado basado en red-de-confianza. Una
implementación completa (es decir, sin dichas suposiciones simplificadoras)
estará disponible en el repositorio de Skycoin en GitHub. Para acceder a
resultados de simulación y a un ejemplo diagramado y detallado de una prueba
de consenso, vea [\[1\]](#referencias). Una simulación de una red con una
relación de confianza, aunque utilizando un algoritmo diferente al de
Skycoin, se puede encontrar en [\[2\]](#referencias). A continuación, la
descripción del Algoritmo del Consenso de Skycoin.

1.  *Creación de bloques*. Cada nodo de creación de bloques recolecta nuevas transacciones, las verifica contra el UTXO del número de secuencia deseado, empaqueta las transacciones compatibles en un nuevo bloque, y transmite el bloque a la red.

2.  *Recolección de bloques*. Cada nodo de consenso recolecta los bloques generados por los nodos de creación de bloques y los coloca en un contenedor (separado de la 'blockchain') codificado por el número de secuencia del bloque.

3.  *Selección del bloque ganador*. Cada nodo de consenso, al recibir un número suficientemente grande [^1] de bloques candidatos o al cumplir otros criterios, encuentra el bloque que fue creado por la mayor cantidad de nodos de creación de bloques. Los lazos son resueltos de manera determinista. Dicho bloque es etiquetado como "ganador local" [^2] y se agrega a la 'blockchain' local. El par llave-valor correspondiente al número de secuencia de bloque del ganador local es eliminado, recuperando así almacenamiento. El código Hash del ganador local se transmite/anuncia.

4.  *Paso de verificación*. Cada nodo mantiene estadísticas acerca de los ganadores locales reportados por otros nodos. Cuando todos o la mayoría de los nodos [^3] han reportado ganadores locales, el nodo determina el ganador global para el número de secuencia específico. Si el ganador global es el ganador local, entonces el nodo sigue funcionando como se indicó anteriormente. En caso contrario, el nodo decide, basándose en datos externos y registros locales, entre (a) volverse a sincronizar con la red o (b) dejar de participar en el consenso y/o la creación de bloques o (c) mantener su 'blockchain' y solicitar ser detenido de emergencia.

[^1]: Este es un parámetro configurable del Algoritmo.
[^2]: Bajo ciertas condiciones ideales, los ganadores locales (para un determinado número de secuencia de bloque) son todos iguales, es decir, incluyen un conjunto idéntico de transacciones. La diferencia surge debido a la latencia de la red, la alta frecuencia de las transacciones, la entrega de mensajes fuera de secuencia, la pérdida de mensajes, los errores de funcionamiento o los nodos maliciosos, etc.
[^3]: Este número puede ser determinado, por ejemplo, pidiendo a los nodos de confianza que informen las llaves públicas de sus nodos de confianza, de manera recursiva.

## Referencias

\[1\] johnstuartmill et al. A Distributed Consensus Algorithm for
Cryptocurrency Networks.
<https://github.com/skycoin/whitepapers/blob/master/whitepaper_skycoin_consensus_v01_jsm.pdf>
2016

\[2\] Houwu Chen y Jiwu Shu. Sky: an Opinion Dynamics Framework and Model
for Consensus over P2P Network.
<https://github.com/skycoin/whitepapers/blob/master/Sky-%20Opinion%20Dynamics%20Based%20Consensus%20for%20P2P%20Network%20with%20Trust%20Relationships.pdf>
201?

*Leer más:*

* *[Documentación Técnica del Algoritmo de Consenso de Skycoin](https://www.skycoin.com/whitepapers)*
* *[Obelisk El Algoritmo de Consenso de Skycoin](/statement/obelisk-the-skycoin-consensus-algorithm/)*
