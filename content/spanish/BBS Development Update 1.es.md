+++
title = "Actualización de desarrollo de Skycoin BBS #1"
tags = [
    "Development",
    "BBS",
    "CXO",
]
bounty = 3
date = "2017-08-05"
description = "La primera actualización de desarrollo de Skycoin BBS."
aliases = [
	"/es/bbs/bbs-development-update-1/"
]
+++

## Introducción

BBS significa Bulletin Board System (Sistema de Tablón de Anuncios).
Aunque los sistemas BBS tradicionales ya no se utilizan ampliamente,
BBS en la era moderna es un icono para los servicios sociales.

Skycoin BBS es una de las primeras aplicaciones web que se implantará utilizando el ecosistema de Skycoin.
Skycoin intenta revolucionar la Internet; descentralizarla y encriptar protocolos por defecto.

Subyacente a Skycoin BBS se encuentra una base de datos autorreplicante de igual a igual
llamada CXO (parte del ecosistema Skycoin). Presenta estructuras de árbol inmutables
de objetos de Golang. Todos los objetos se referencian a través de sus valores hash
junto con los esquemas definidos. Cada árbol tiene un objeto raíz y está firmado
contra un par de llaves pública/privada. Para actualizar el árbol, las raíces tienen
versiones progresivas llamadas "secuencias". Este diseño permite una replicación de
datos rápida y eficiente.

## Estructura de datos

La estructura de datos de Skycoin BBS (versión 0.2 - en desarrollo) contiene tableros,
hilos y publicaciones. Puede haber votaciones en los tableros y los hilos. Así es
como se ve todo en un árbol de CXO:

![](/img/cxo_bbs_datastructure_v0.2.png)

Este es un diagrama simplificado.

Todos los objetos enviados (hilos, publicaciones y votos)
se verificarán a través de la firma proporcionada y la llave pública del usuario remitente.

Cada raíz contiene datos que se utilizan para representar/almacenar un solo tablero.
BoardPage contiene el "contenido"; el tablero en sí, hilos y publicaciones. Los hilos
se referencian mediante el hash del objeto "Thread", mientras que las publicaciones se
referencian mediante el hash de "Post". Por lo tanto, las publicaciones y los hilos no
se pueden modificar una vez enviados.

ThreadVotesPages, PostVotesPages almacenan los votos para el contenido.
El campo "ref" de VotePage contiene el hash del contenido en cuestión.
El campo "Votes" almacena los votos para el contenido especificado.
Las páginas de votos deben ser "compiladas" por el nodo BBS en una estructura
de almacenamiento que pueda obtener rápidamente una "vista de votos" para el front-end.

Los votos se almacenan por separado para reducir el número de nodos de
árbol que se deben cambiar con cada voto. También permite una manipulación
más fácil de los datos de votación por parte del compilador de votos.

## Lanzamientos

Actualmente, solo se ha lanzado una versión estable de Skycoin BBS.
Las características son básicas, pero la estructura de datos CXO es
más complicada que la especificada anteriormente. La adición de contenido
y la votación dieron como resultado que la secuencia raíz se incrementara
varias veces por acción.

La versión 0.2 de BBS (actualmente en desarrollo), no solo aumenta el
rendimiento y la claridad del código, sino que también pondrá en marcha
las siguientes características nuevas:

* Carga de contenido mejorada - haremos uso de la(s) conexión(es)
de WebSocket entre el cliente y el servidor para permitir actualizaciones
al instante y una carga de contenido más eficiente.
* Mejoras en la votación/visualización del contenido - tanto en el
rendimiento real como en la fluidez desde la perspectiva del usuario.
También se introducirán reportes de spam.
* Permisos - los tableros podrán establecer permisos sobre quién puede
realizar qué acciones (por ejemplo, enviar contenido/votar). La capacidad de bloquear usuarios también estará disponible.

## Participa

Manténgase al día con el desarrollo de Skycoin BBS uniéndose a nuestro [Grupo de Telegram](https://t.me/skycoinbbs).

Skycoin BBS es de código abierto. El repositorio de git se encuentra
[aquí](https://github.com/skycoin/bbs). Tenga en cuenta que el desarrollo para la versión 0.2 está en la rama "v0.2".

