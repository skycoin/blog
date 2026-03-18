+++
title = "El Significado de Aether"
tags = [
    "Decentralization",
    "CXO",
]
bounty = 5
date = "2017-09-25"
aliases = [
	"/es/statement/the-meaning-of-aether/"
]
+++

*Esta es una publicación archivada del hilo bitcointalks del 05 de mayo de 2014*

*El diseño original de Aether se ha convertido en lo que ahora se llama CXO*

*Cita de: ** Tobo ** el 4 de mayo de 2014, 02:11:12 PM*
>Noté que anteriormente usaron el nombre ether (éter, en español), el cual
fue usado por Ethereum. Ahora lo cambiaron por aether (en español conocido
también como éter), el cual ha sido utilizado por algunas otras personas
en este foro. ¿Por qué les gustaron tanto estos dos nombres?

El éter impregna el espacio. Luego descubrimos que el ether es el alcohol
que la gente aspira para drogarse y el aether es la sustancia mística que
impregna el espacio.

Se llama Aether porque los datos no existen en un servidor. Existe
colectivamente en toda la Internet (o al menos los suscriptores). Una vez
publicado, no puede ser destruido. No hay un punto central, no hay un
servidor que pueda ser incautado. El editor no puede ser localizado o
rastreado porque una vez que se publican los datos, son solo un elemento más.

Es un sistema perfecto. Hay un tipo de dirección de Skycoin y es un punto
final para un almacén de datos o un sistema pubsub. Hay otro tipo de
dirección de Skycoin y contiene monedas. Hay otro tipo de dirección de
Skycoin y es un nodo con el que puedes comunicarte y enviarle mensajes.

Generas una llave pública, que es una ID y cuyo hash es una dirección. La
dirección reemplaza las direcciones IP para identificar un dispositivo o
computadora, si se usa para comunicación. Le da nombre a un almacén de datos
(al igual que un enlace magnet es un hash de un archivo torrent y le da nombre
al torrent) si se utiliza para un almacén de datos. Si el almacén de datos
contiene una lista de archivos y una lista de hash para los fragmentos en los
archivos, entonces es simplemente un torrent que las personas pueden
actualizar. Le da nombre a un nodo Skywire si se utiliza para comunicación,
así como una dirección IP le da nombre a una computadora.

Entonces, si quieres crear un Twitter distribuido con Aether, creas una
llave pública. Publicas actualizaciones en tu almacén llave-valor y las
firmas con tu llave privada. Cada llave en el almacén llave-valor es un
número incrementado por cada tweet y el cuerpo es el json para el tweet.

Les das a algunas personas el hash de tu llave pública (una dirección) y
ahora pueden descargar y replicar tu feed (lista de publicaciones). Pueden
obtener los feeds de todos los que están siguiendo. Pueden ejecutar
localmente sus propios algoritmos de filtrado para clasificar las cosas en
los feeds a los que están suscritos y elegir su interfaz de usuario. Es un
sitio web, pero es un sitio web que se ejecuta en tu computadora y que se
ejecuta a partir de datos de los que tienes una copia.

No estás descargando desde un servidor los feeds a los que estás subscrito,
los estás descargando de otras personas que están suscritas a ellos. Está
completamente descentralizado. Es un pubsub, es un canal de comunicación, es
un almacén llave-valor, es una fuente RSS, es una base de datos orientada a
documentos (si estás almacenando JSON), es un torrent actualizable si estás
almacenando listas de archivos y listas de fragmentos.

Esta innovación, esta estructura de datos es tan poderosa como la cadena de
bloques. Es tan poderosa como DHT. Es un componente central para la próxima
generación de sistemas descentralizados.

El Aether es un elemento místico que impregna todo el espacio y creo que es
apropiado.

En Tor, puedes identificar la ruta a un servicio a través del análisis de
tráfico al observar la variación en la latencia del tráfico y relacionándola
con la latencia de otro tráfico que pasa a través de los nodos. Solicitar
páginas es lento porque tienes que pasar por múltiples saltos. Aquí la
replicación es peer-to-peer (de igual a igual). No hay un "centro", no hay un
"servidor". Las páginas web son instantáneas, porque no estás solicitando los
datos, sino que tienes una copia local completa de los datos. Estás generando
la página web desde la base de datos.

En el Internet de las cosas, tienes una bombilla LED. Deseas hacer que la
bombilla encienda en color rojo. La bombilla tiene una dirección IP y está
conectada de forma inalámbrica a tu casa. Mueves la bombilla y ahora tiene
una nueva dirección IP, por lo que no puedes encontrarla ni enviarle mensajes.
Las direcciones IP no son identificadores para dispositivos, cambian a medida
que el objeto se mueve y accede a la red a través de diferentes puntos de
conexión. Skycoin le da a los dispositivos o aplicaciones "nombres" que son
independientes de la red. Esta es la función de DNS, tomar un nombre y obtener
el servidor o IP correspondiente.

La bombilla tiene una dirección Skycoin y puedes enviar mensajes a la
dirección. Puedes decir "activar rojo" o cargar un nuevo programa a la
bombilla LED programable. Skywire averigua automáticamente cómo encontrar una
ruta al dispositivo.

Además, cuando ejecutas un nodo Skywire Mesh, el nodo puede estar conectado a
cuatro redes inalámbricas y un enrutador. El nodo wifi tiene cinco direcciones
IP diferentes. Una dirección IP ya no identifica de manera única el nodo. Una
dirección IP es simplemente una ruta al nodo. Las direcciones IP en el
enrutador a menudo ni siquiera son direcciones públicas debido a NAT.

El conjunto de computadoras que controlas, tu pc de escritorio, tu tableta,
tus dos computadoras portátiles. Ellas forman una nube personal. Cada
dispositivo tiene un daemon Skywire y una dirección de nodo a la que puede
recibir comunicación. Tienes servidores de aplicaciones ejecutándose en tu
nube. Por ejemplo, puedes tener varios servidores de aplicaciones de
almacenamiento (que exponen un volumen de una unidad como un sistema de
archivos de red, como Dropbox). Es posible que tenga servidores de
aplicaciones, como servidores web o servidores de correo electrónico.

Entonces, la idea del "Aether" mitológico refleja la visión de lo que
estamos tratando de lograr.
