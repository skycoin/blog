+++
title = "¿Puede Skycoin ser atacado al 51%?"
tags = [
    "Statement",
    "Obelisk",
    "Consensus",
]
bounty = 8
date = "2017-10-07"
aliases = [
	"/es/statement/can-skycoin-be-51-attacked/"
]
+++

*Esta es una publicación archivada del hilo de bitcointalks el 16 de Febrero del 2015*

> Cita de: iamback Febrero 16, 2015, 09:28:38 AM

> Un consenso sin PoW no tendrá vida. Ya que no hay suficiente tiempo
para identificar sus problemas y confiar en él antes de que la economía global
comience a colapsar en 2016. Por ejemplo, el ataque de minado no había sido
descubierto (o digamos ampliamente probado y reconocido) hasta años después
de que Satoshi publicara el PoW. Por lo tanto, un mercado serio no va a confiar
en un consenso nuevo. En cambio, yo diseñe un sistema PoW, el cual
soluciona muchos de los problemas que tiene Bitcoin, incluyendo la
rentabilidad de ASIC. Mi publicación anterior tiene algunas indicaciones.

> Además, tengo la intuición matemática de que evitar el ataque del 51%
siempre descompensará la seguridad en otro aspecto.

En Skycoin el ataque del 51% no importa. La red podría ser atacada
al 51% veinte veces al día y a casi nadie le importaría.

Skycoin tiene diferentes propiedades matemáticas que las de Bitcoin y es más
estricto. Si cinco personas están intercambiando monedas entre si
en una red cerrada el ataque del 51% no los afectaría. Se necesita la llave
privada de alguien en la cadena de transacción para hacer algún daño en un
ataque del 51%. Skycoin no tiene maleabilidad de transacción. Casi todos tendrán
exactamente los mismos datos de salida, los mismos balances y los mismos
historiales de transacción tanto en la cadena original como en el fork, excepto el
agresor y sus cómplices. Si ocurre un fork en la cadena, solo se copian
las transacciones desde las otras cadenas.

El ataque del 51% solo afectará a aquellos que negocian con personas sospechosas
y sitios de apuestas. No afectará mucho a las transacciones de comercio.
Si una casa de cambio tiene buenos métodos de seguridad y mantiene segregadas
las carteras de sus usuarios, el peor ataque le es muy leve.

Bitcoin maneja un volumen de transacción de 100 millones al día. El volumen total
de transacciones en Bitcoin es alrededor de 200,000 bitcoin. Este tiene
maleabilidad de transacción, lo que significa que si alguien hace un ataque del 51% y
retrocede las transacciones hechas en la última hora, se estropearían 4 millones de dólares
y 10,000 bitcoin en balances de transacción. Un ataque que vaya 24 horas atrás podría
causar daños de hasta 100 millones y 200,000 Bitcoins. Un agresor puede revertir
cualquier transacción de Bitcoin.

En Skycoin, los agresores no pueden afectar o modificar una cadena de transacción
sin saber la llave privada de una dirección usada en esa cadena
de transacciones. Entonces, por ejemplo, si cinco bancos están intercambiando
entre sí y todos tienen una buena seguridad en la cartera, el ataque
del 51% pasaría inadvertido. Sus balances
son los mismos. Eso asumiendo que el ataque del 51% sea siquiera
matemáticamente posible, que alguien se moleste en agotar los recursos
para intentarlo, y que tenga éxito.

Si alguien logra atacar a Skycoin al 51% (lo cual puede ser posible, pero es matemáticamente improbable)
los comerciantes van a celebrar con regocijo puesto que las perdidas
serán mucho menores que las de un reembolso de Visa. Muchos comerciantes
venden laptops y generan menos del 5% de margen por
cada una. Alguien reclama que no recibió el producto y el comerciante
pierde $1000, no recibe de vuelta el producto y tiene que pagarle a Visa una
cuota de $80. Luego la compañía tiene que vender 25 laptops para compensar
el costo de una pérdida provocada por una sola estafa. Si alguien roba una
tarjeta de crédito y compra algo con ella, Visa no asume la perdida, se la apremia al comerciante.

El algoritmo de consenso de Skycoin y su libro de contabilidad
están separados. El sistema de consenso es modular y puede ser
cambiado. Si de aquí a cinco años hay un mejor algoritmo, podemos
simplemente cambiarlo por el nuevo. El libro de contabilidad y los
balances de monedas permanecerán completamente intactos.

Skycoin:

- Solventa los problemas de Bitcoin.
- Es a prueba de futuro.
- Elimina las condiciones de muerte en las que se ha diseñado Bitcoin.

Es 100% cierto que hay descompensaciones severas. Por ejemplo, plazos más
rápidos para los consensos relacionales tipo Skycoin
conllevan a que se necesite un número menor de nodos para hacer DDoS
a la red. Sin embargo, las personas pueden reaccionar y remover los nodos
de sus listas de confianza.

Habrán problemas y se tendrán que resolver.

## Estructura de transacción de Skycoin

https://github.com/skycoin/skycoin/blob/master/src/coin/transactions.go

Una transacción de Skycoin es:

1) Una lista de hashes de salida, siendo emitida
2) Una lista de firmas autorizando a las salidas para ser emitidas
(firma de hash en la parte interna de la transacción)
3) Una lista de salidas que será generada

No se pueden crear o destruir monedas. El número de monedas
entrante tiene que ser igual al número de monedas
salientes. La cuota de transacción está denominada en "coinhours".

## Skycoin es compatible con Coinjoin de forma nativa

No hay diferencia entre las transacciones normales y las de coinjoin.

- Dos personas eligen los datos de salida a crear y emplear y los envían al servidor remoto.
- El servidor crea una transacción y mezcla las solicitudes. Luego las envía a cada persona.
- Cada persona envía la firma de su respectiva salida al servidor.
- El servidor coinjoin inyecta la transacción en la red.

- El servidor coinjoin no puede quedarse con las monedas.
- Solo el servidor coinjoin sabe cuántas personas están involucradas (1, 2, 4?)
- Solo el servidor sabe que le pertenece a cada quien.
- No hay ninguna diferencia entre una transacción común y una de coinjoin.

La firma en la ranura `i`th es para la dirección propietaria de la salida `i`th.
El hash interno de la transacción es encriptado con el hash de la salida emitida, luego
esto se firma con la llave privada de la salida.

Es muy simple comparado con otros sistemas coinjoin.
