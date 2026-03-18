+++
title = "Skycoin vs Skywire"
tags = [
    "Skywire",
]
bounty = 4
date = "2017-08-30"
aliases = [
	"/es/statement/skycoin-vs-skywire/"
]
+++

Skycoin y Skywire son dos componentes separados del Proyecto Skycoin.
Skycoin es la cadena de bloques. Skywire es la [red en malla](https://en.wikipedia.org/wiki/Mesh_networking).

Skycoin fue construido primero. Puede mantenerse por sí mismo.
Fue creado para resolver los problemas que tiene Bitcoin.
El mayor problema que tiene Bitcoin es la minería, lo que lleva a
la centralización de Bitcoin. Los otros problemas que ha tenido Bitcoin
se relacionaban principalmente con criptografía o errores de *software*,
lo que generó defectos como la [maleabilidad de transacciones](https://en.bitcoin.it/wiki/Transaction_Malleability).

Skycoin desarrolló un nuevo algoritmo de consenso llamado [Obelisk](https://www.skycoin.com/whitepapers)
que elimina la minería (u otras alternativas como la
[Prueba-de-Participación](https://en.wikipedia.org/wiki/Proof-of-stake)).
De esto se tratan los [informes técnicos](https://www.skycoin.com/whitepapers).
El algoritmo de consenso utiliza un mecanismo de red de confianza para proteger
la red. Cada nodo de la red tiene una pequeña lista de pares de confianza.
Se comparten bloques el uno con el otro. Si hay bloques defectuosos, como un
bloque que contiene un [doble gasto](https://en.wikipedia.org/wiki/Double-spending),
lo rechazas y también lo hacen tus compañeros de confianza.
Puede haber muchos nodos maliciosos en la red, pero no tendrán ningún
impacto si no hay confianza en ellos.

Skywire fue desarrollado para solucionar problemas de Internet. Hay muchos
[puntos de ataque](https://en.wikipedia.org/wiki/BGP_hijacking) especialmente
para los gobiernos, ya que tienen un gran control sobre la infraestructura.
Pero también los grandes ISP son bastante malos con sus clientes. Todos
estos problemas se deben a la centralización de la Internet.

Skywire puede operar sin Skycoin. No sería el primer *software* en malla que hay.
Ha habido varios intentos de construir redes en malla, pero ninguno ha crecido
demasiado, porque ha sido un esfuerzo voluntario. Al integrar Skycoin con Skywire,
las personas pueden ganar dinero por mantener la Internet,
en lugar de los grandes ISP. Este es el único camino sostenible para
democratizar la infraestructura de internet. Además, la red skywire tiene mucha
más seguridad y privacidad que la internet actual.

Cualquier tipo de aplicación que funcione a través de Internet, también
puede funcionar en Skywire. Videos, almacenamiento de archivos, VPN, todo.
El uso de Skywire será gratuito, pero los usuarios pueden pagar nodos en la
red para reenviar tráfico, para recibir un mejor ancho de banda y un servicio
prioritario. Esto proporciona una demanda a largo plazo de Skycoins. Inicialmente,
el Proyecto Skycoin usará algunas de las monedas no distribuidas para subsidiar
operadores de nodos en la red Skywire, para que funcione. Con el tiempo, el subsidio
será reemplazado por usuarios atraídos a la red por las aplicaciones que se
ejecutan en Skywire.

La cadena de bloques de Skycoin y la red Skywire pueden mantenerse por
sí mismas sin la otra, pero se benefician mutuamente. Skywire proporciona
un propósito de utilidad para las Skycoins, y Skycoin proporciona un incentivo
financiero para expandir la red Skywire.

*Leer más:*

* *[Publicaciones sobre Skywire](/tags/skywire/)*
* *[Visión general de Skycoin](/overview/skycoin-overview/)*
* *[Skywire - El Proyecto de red en malla de Skycoin](/overview/skywire-skycoin-meshnet-project/)*
