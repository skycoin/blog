+++
title = "Visión general de Skycoin"
tags = [
    "Skycoin",
    "Statement",
]
bounty = 15
date = "2017-08-26"
aliases = [
	"/es/overview/skycoin-overview/"
]
+++

<!-- MarkdownTOC autolink="true" bracket="round" depth="1" -->

- [Introducción a Skycoin](#introducción-a-skycoin)
- [Innovaciones e imperfecciones de Bitcoin y los protocolos actuales de cadena de bloques](#innovaciones-e-imperfecciones-de-bitcoin-y-los-protocolos-actuales-de-cadena-de-bloques)
- [Innovaciones producidas por Bitcoin](#innovaciones-producidas-por-bitcoin)
- [Defectos importantes de Bitcoin](#defectos-importantes-de-bitcoin)
- [Cualidades convenientes para los sistemas de consenso distribuido para los registros financieros](#cualidades-convenientes-para-los-sistemas-de-consenso-distribuido-para-los-registros-financieros)
- [Filosofía de seguridad de Skycoin](#filosofía-de-seguridad-de-skycoin)
- [Seguridad y transparencia: Obelisk y canales de transmisión pública](#seguridad-y-transparencia-obelisk-y-canales-de-transmisión-pública)
- [Obelisk](#obelisk)
- [Algoritmo de consenso binario simple: Elección entre dos bloques](#algoritmo-de-consenso-binario-simple-elección-entre-dos-bloques)
- [Consenso sobre múltiples opciones de ramas concurrentes](#consenso-sobre-múltiples-opciones-de-ramas-concurrentes)

<!-- /MarkdownTOC -->

# Introducción a Skycoin

Skycoin se basa en una tecnología que presenta
un nuevo fundamento criptográfico conocido como
canal de transmisión pública. También presenta
una nueva implementación de algoritmo de consenso,
llamado Obelisk, que minimiza los problemas de
compromiso que surgen de la prueba de trabajo y
de los procesos de minería subyacentes a Bitcoin,
abordando así una serie de asuntos de seguridad
asociados con este último. Obelisk no es un simple algoritmo,
sino una implementación que emplea múltiples
técnicas para entregar garantías de seguridad específicas.

# Innovaciones e imperfecciones de Bitcoin y los protocolos actuales de cadena de bloques

En Bitcoin, las nuevas transacciones se colocan
en un bloque, el cual se agrega a la cadena de
bloques. Cualquier persona en la red de Bitcoin
puede crear nuevos bloques. Por lo tanto, cada
bloque tiene un único progenitor pero uno o más
sucesores válidos (hijos). Las cadenas forman
un árbol y el problema principal que Bitcoin
resuelve es lograr que cada nodo de la red esté
de acuerdo en cuál de las cadenas prospectivas
en el árbol de cadena es la cadena de bloques
de consenso.

Bitcoin usa una técnica llamada Prueba de Trabajo
(PoW en inglés) para determinar una cadena de bloques única.
Un bloque válido requiere un valor hash, el cual está
por debajo de un valor objetivo. Los nodos agregan
transacciones a un nuevo bloque y aleatoriamente
prueban "nonces" hasta que se encuentre un hash
válido para un bloque.

Una función es usada para crear un orden total de
cadenas en el árbol de bloques. La cadena que tiene
la mayor dificultad y requirió la mayor cantidad de
operaciones hash para producirse es "la cadena más larga"
y forma la cadena de consenso. La noción de
"profundidad de bloque" y "dificultad" crea un
orden total sobre todas las cadenas lineales en el
árbol de bloques y solo la cadena que requiere más
recursos es aceptada para producir la cadena de consenso.

Los nodos de Bitcoin se conectan entre sí al azar y cada
nodo retransmite la cadena de bloques más difícil que
conoce a sus pares. Si un nodo tiene una cadena más difícil
de producir que otro nodo conectado, el otro nodo recibirá
los bloques secuencialmente. El nodo evaluará la función y
decidirá si la cadena recibida es más difícil de producir y,
por lo tanto, puede cambiar su consenso a la cadena recibida y
luego anunciará su nueva cadena a sus pares. De esta forma,
el consenso se propaga a través de la red y todos los nodos
obtienen el mismo consenso.

Bitcoin no asume que los nodos tengan identidades
y no asume que los nodos son honestos. Los nodos pueden
enviar cualquier dato a otros nodos y no podrían afectar las decisiones
consensuadas porque la dificultad es algo que puede verificarse
independientemente por sus propios méritos.

# Innovaciones producidas por Bitcoin

### * La cadena de bloques

Una única estructura de datos que todos pueden poseer.

### * Registro público de las transacciones

Almacenamiento de transacciones financieras en la cadena de bloques.

### * Uso de PoW y del reajuste de dificultad para mantener una tasa constante de producción de bloques

### * Uso de hashes de llave pública como direcciones

Las llaves públicas no son reveladas hasta que se usan.

### * Uso de "outputs" (salidas) para los saldos

Se ignora tratar de crear efectivo digital divisible:
para pagar $20 a partir de una salida de $25, se envían $20 a
la persona y $5 a usted mismo.

### * Funcion de dificultad de PoW y profundidad de bloque

Primer uso de una función que define el orden total en
árboles de bloques. El registro contable público elude
el problema del doble gasto del efectivo digital tradicional.

# Defectos importantes de Bitcoin

Estos son los problemas que deben abordarse en el
desarrollo de nuevas criptomonedas. Bitcoin debe
considerarse como una criptomoneda embrionaria sobre
la cual los desarrollos futuros deben mejorar. La
tecnología en la que se basa Skycoin responde a las
principales deficiencias de Bitcoin rediseñando todo
el sistema de consenso distribuido.

### * Las decisiones de consenso en Bitcoin no son definitivas y pueden revertirse

Una persona u organización que tenga la
posibilidad de alquilar o comprar
suficiente potencia hash puede revertir las transacciones.

### * Bitcoin logra el consenso de red pero los nodos individuales de Bitcoin son altamente vulnerables a los adversarios que controlan los routers a través de los cuales pasan los paquetes

Un adversario que controle los routers tiene
dominio absoluto sobre la opinión de un nodo y puede
influir arbitrariamente en las decisiones de consenso del nodo.

### * Las casas de cambio de Bitcoin se han vuelto altamente vulnerables a los ataques

Los atacantes hábiles pueden emplear ataques del
51%  y la compra y venta de monedas alternativas en
una casa de cambio para conducir a esta a la insolvencia.

### * Los bancos y los sitios de apuestas se han vuelto vulnerables a los ataques del 51%

### * A medida que Bitcoin madura, la compra de opciones contra Bitcoin y los ataques contra las redes se vuelven más rentables

En el futuro, los ataques exitosos contra
Bitcoin podrían generar varios cientos de
millones de dólares en ganancias por el
comercio de opciones.

### * Los estados con fuertes controles de capital, al igual que las empresas competidoras, pueden atacar directamente a la red de Bitcoin para proteger sus intereses financieros

Tales entidades pueden absorber fácilmente
los costos de atacar la red y acabar con la seguridad de Bitcoin.

### * Los servicios que permiten "Hashing en la nube" y el alquiler de Hash Power de terceros son cada vez más exitosos

Muchos ahora tienen la capacidad de alquilar
el poder de hash para un ataque mayoritario.

### * Los hackers pueden utilizar numerosos agujeros de seguridad en routers y equipos de redes para robar monedas de bancos y casas de cambio

Un atacante puede controlar a los pares
conectados a un nodo de Bitcoin y garantizar
conexiones a los nodos que son controlados
por el atacante. Por ejemplo, un atacante
puede introducir una transacción de depósito
en la cadena lateral de un banco y lograr que
el banco emita una transacción de retiro que
luego se retransmite a la red principal.

### * Bitcoin no puede ofrecer seguridad a un bajo costo

La red de Bitcoin usa cantidades inmensas
de electricidad que crecen de manera exponencial.
La seguridad de Bitcoin se basa
deliberadamente en la creación de la mayor
cantidad posible de desechos eléctricos. Como
la seguridad está relacionada con el costo de
lograr la tasa de hash mayoritaria, el costo
de funcionamiento de la red de Bitcoin aumenta
constantemente. En un sistema bien diseñado, $1
en seguridad costaría $1000 para eludir. Pero en
Bitcoin, la proporción es de $1 a $1. Además,
esto es ambientalmente irresponsable.

### * Bitcoin no puede disminuir los tiempos de transacción sin comprometer la seguridad

Las transacciones de Bitcoin tardan
en promedio 10 minutos en incluirse en
un bloque, y se necesita aún más tiempo para
obtener más seguridad.

# Cualidades convenientes para los sistemas de consenso distribuido para los registros financieros

Los parámetros sobre los cuales se puede mejorar Bitcoin son:

### * Eliminar el gasto doble

Una vez que se ha ejecutado una transacción,
debería ser imposible revertir el consenso.
Este debe ser lo más irreversible posible.

### * Eficiencia

El costo de llevar un registro contable
perfectamente seguro debería ser extremadamente bajo.

### * Velocidad

El sistema debería posibilitar que las transacciones
se confirmen en segundos.

### * Transparencia

Debería ser fácil auditar e identificar nodos maliciosos.

### * Seguridad para ataques de router

Los nodos deberían ser capaces de
detectar si su consenso difiere de la red.

Algunas propiedades de seguridad deberían permanecer
intactas, incluso si la gran mayoría de los nodos en la red son maliciosos.

A nivel fundamental, muchos de los defectos de seguridad
asociados con el sistema de Bitcoin surgen del problema
de compromiso inherente en la prueba de trabajo y en los
procesos de minería. Sus defectos de seguridad representan
un problema de los generales bizantinos en el mundo real.
Existen incentivos para que los participantes manipulen
los procesos de verificación, a través del soborno y el
hackeo, por ejemplo. Los atacantes manipularán los relojes
del sistema, comprometerán los routers, usarán colisiones
hash, inundarán la red con cientos de miles de bots y
explotarán la maleabilidad de la firma.

Un sistema seguro no solo debe ser capaz de protegerse
contra cada ataque conocido, sino que debe ser lo
suficientemente robusto como para evolucionar y adaptarse
a futuros ataques. Algunos problemas en Bitcoin pueden
corregirse, como la maleabilidad de la firma. Otros
problemas son fundamentales y no pueden abordarse sin
definir una estructura completamente nueva, como la
dependencia en la Prueba de Trabajo y los mineros.

# Filosofía de seguridad de Skycoin

La seguridad es un proceso de identificación y
fortificación continua contra las amenazas. Un buen
sistema logra una "defensa profunda", tiene múltiples
sistemas redundantes y sobrevivirá a la falla completa
de cualquier medida individual. La buena seguridad
requiere la diferenciación entre las amenazas que son
existenciales y las que son simples molestias.

A pesar de que es obvio que ningún sistema puede
eliminar todas las amenazas de seguridad y alcanzar
simultáneamente todos los objetivos enumerados
anteriormente, Skycoin representa el siguiente paso
en la tecnología de criptomoneda porque adopta un
enfoque modular en capas para la seguridad y utiliza
diferentes sistemas para aplicar garantías
particulares. La seguridad de Skycoin se centra
en abordar las amenazas existenciales que enfrenta
Bitcoin y proteger a los usuarios de las amenazas
cotidianas, intentando brindar el más alto grado
de protección contra la clase de ataques que causarían
las mayores pérdidas a sus usuarios, inversionistas e
instituciones. Esto requiere un rediseño completo de
Bitcoin en ambos extremos, desde la generación de
cartera hasta el consenso de la cadena de bloques, y
la innovación fundamental en muchas otras áreas.

La mayoría de las pérdidas en Bitcoin derivan de
deficiencias en el diseño, la falta de usabilidad
y los errores del usuario final en lugar de ataques
técnicos al software o matemáticas.
Skycoin debe abordar tanto las inminentes amenazas
matemáticas existenciales como los peligros de
seguridad que la experiencia de usuario incompleta
y poco pensada que Bitcoin ha creado para los usuarios
cotidianos. La mala usabilidad y el diseño han
forzado a los usuarios a comprometer la seguridad,
con millones de dólares confiando rutinariamente en
carteras web inseguras. A pesar de los robos frecuentes
y masivos reportados por los medios a diario, hasta la
fecha se han perdido más Bitcoin debido a problemas de
usabilidad que de todos los esfuerzos de los delincuentes
para robar Bitcoin.

Alrededor de la mitad de todos los Bitcoins
existentes nunca se han movido de sus direcciones
iniciales y nunca lo harán porque están perdidos
como archivos de cartera irrecuperables, carteras
extraviadas, o malentendidos de lo que en realidad se
estaba respaldando en un archivo de cartera. Mt. Gox
informó recientemente haber "encontrado" 200.000 Bitcoin
en una cartera que no sabían que contenía bitcoins. La
cartera había sido ignorada previamente y pudo haber sido
borrada fácilmente por error. Las carteras a menudo se
confunden como vacías porque el software de la computadora
no puede cargar una cartera creada por un
software "demasiado viejo". Por lo tanto, la mayoría
de los problemas de seguridad relacionados con Bitcoin
ocurren a nivel de funcionalidad, usuarios finales y
seguridad de las casas de cambio.

El resto de esta sección cubre algunas de las nuevas
técnicas que hemos creado en cooperación con nuestros
socios para abordar los problemas de seguridad a nivel
de red y hacer que la cadena de bloques de Skycoin sea
más segura que las redes anteriores.

Hemos demostrado matemáticamente que nuestro
sistema logra consenso, tiene las propiedades
de seguridad que queremos y funciona bien en
condiciones de red normales. Tenemos algunas
nuevas estructuras de datos emocionantes que
no se han visto antes en ninguna moneda o pieza
de software. Por el momento, estamos creando un
prototipo del sistema para su implementación.
El proceso de desarrollo de Skycoin es iterativo.
Habrá cambios, mejoras y refinamientos a medida que
trabajamos a través de los detalles, abordamos
fallas conocidas, probamos el sistema y obtenemos retroalimentación.

# Seguridad y transparencia: Obelisk y canales de transmisión pública

Para resolver los problemas de compromiso asociados
con el sistema de Bitcoin, la tecnología subyacente a
Skycoin implementa la cadena de bloques en la forma de
un canal de transmisión pública. Todos pueden leer la
cadena, pero solo el propietario puede publicar bloques.
Para ser válido para una cadena personal, cada bloque
debe estar firmado con la llave privada de los
propietarios. Cada nodo en este sistema de algoritmo
de consenso (Obelisk) tiene una cadena de bloques
personal, este es el núcleo principal del sistema Obelisk.

El canal de transmisión pública impone varias limitaciones:

### * Una vez un bloque es publicado, este no puede ser removido

Los bloques se replican de igual a igual
a todos los suscriptores. Una vez que se
ha publicado un bloque, este se propaga a todos
los suscriptores. Debes destruir a todos
los pares que han recibido el bloque para
lograr borrarlo de internet.

### * Un nodo no puede publicar una versión diferente de un bloque previo y pasar desapercibido

Los bloques están numerados y se
detectaría si el nodo firmara
dos bloques diferentes con el mismo
número de secuencia.

### * Un nodo no puede retroceder la marca de tiempo en la recepción de un bloque, sin retrasar la publicación de un bloque

Las marcas de tiempo solo aumentan,
las marcas de tiempo aumentan
monótonamente con el conteo de secuencias de bloques.

### * Un bloque en el medio de la cadena no se puede cambiar sin invalidar cada bloque que viene después

En una cadena hash,
cada encabezado de bloque contiene un hash del bloque anterior.

# Obelisk

Cada nodo de Obelisk (nodo de consenso de Skycoin)
tiene una llave pública (una identidad) y una cadena de
bloques personal (un canal de transmisión pública). Las
decisiones de consenso y la comunicación suceden dentro
de las cadenas de bloques personales de cada nodo Obelisk.
Este es un registro público de todo lo que hace un nodo.
Esto permite a la comunidad auditar nodos por trampa y
conspiración. Le da a la comunidad una forma de identificar
a los nodos que participan en los ataques a la red y hace
público cómo se están tomando las decisiones en la red y
qué nodos están influyendo en esas decisiones.

Cada nodo tiene una lista de otros nodos a los que se suscribe.
Los nodos con más suscriptores son más "confiables" y producen
más influencia en la red. Si la comunidad no confía en los nodos
que la representa o siente que el poder dentro de la red está
demasiado concentrado (o no lo suficientemente concentrado) la
comunidad puede cambiar colectivamente el equilibrio de poder
en la red al cambiar colectivamente sus relaciones de confianza.

Las relaciones de suscripción de nodo pueden ser aleatorias y/o
pueden formarse a través de la red de confianza (suscribirse a
nodos de personas que conoce y personas de la comunidad en las que confía).

Cuando un nodo recibe un nuevo bloque de una cadena
a la que está suscrito, este revela el hash del bloque
que publica. Esto es un reconocimiento público de la
recepción del bloque. Cada bloque cuenta con marcas de
tiempo y se referencia con bloques de otras cadenas.
Esto crea una cadena interconectada de reconocimientos
de bloque. Estas cadenas establecen relaciones causales
y pueden actuar como un sistema distribuido de sellado
de tiempo como se describe en la siguiente sección. Esto
permite que la red demuestre que los datos no existían o
no se publicaron en la red o establece qué nodos particulares
estuvieron activos o desconectados durante un intervalo de
tiempo determinado.

El algoritmo de consenso Obelisk actual se
basa en el algoritmo de consenso aleatorizado de Ben-Or.

Un ataque Sybil en un esquema aleatorio (el peor caso)
permite a los nodos Sybil controlar el consenso, pero
los nodos no pueden revertir las transacciones,
eliminando así el único incentivo económico para
atacar a la red. En los esquemas del mundo real, la
resistencia Sybil de la red es realmente muy alta y
ejecutar un nodo es moderadamente costoso en términos
de ancho de banda, lo que hace que las botnets grandes
sean inasequibles.

Las relaciones de confianza son escasas y pueden ser
canceladas. En el caso de un ataque, la red reacciona
cortando las conexiones a nodos poco confiables y
contrayéndose a un núcleo más pequeño de nodos de
confianza. El registro público dejado por la cadena
de bloques personal de cada nodo hace que sea muy
fácil identificar a los nodos que participan en un
ataque. A medida que se identifican los nodos atacantes,
los individuos cortan las relaciones con esos nodos,
reduciendo su influencia. Por lo tanto, los principales
beneficios de la red Skycoin son:

- El consenso de Skycoin es democrático y los nodos son administrados por la comunidad
- El consenso de nodos de Skycoin es público
- Cada nodo es responsable ante la comunidad y auditorías de terceros
- La influencia dentro del sistema de consenso de skycoin es democrática y transparente (pero desigual)

# Algoritmo de consenso binario simple: Elección entre dos bloques

Cada decisión de voto es un par hash (A, B). A es
el hash del progenitor del bloque y B es el hash del bloque.
Cada nodo vota por el siguiente bloque que él crea
que debería ser el bloque de consenso. Si el 40% de
los nodos a los que está suscrito tienen el mismo candidato
para el consenso, el nodo cambia su consenso a ese
bloque. El nodo se cambia aleatoriamente entre los candidatos
hasta que se llegue a un consenso.

# Consenso sobre múltiples opciones de ramas concurrentes

Un sistema más avanzado publica (A, B, P), donde P
es un valor de 0 a 1. Los valores P de todos los
sucesores a ser bloque sumarían a 1. Esto permite
decisiones de consenso simultáneas en ramas de
múltiples cadenas.

Si la mayoría de los nodos en la red son honestos,
también van a coincidir al mismo consenso.

Skycoin también tiene una forma limitada de Prueba de
Participación. Nos inclinamos a votar a favor de bloques
con una tarifa de transacción más grande.

Si solo hay dos posibles elecciones de consenso para un
progenitor determinado y ambos bloques ejecutan la transacción,
entonces la transacción se ejecuta de manera efectiva
independientemente de cuál de los dos bloques termine
elegido por la red. La probabilidad de reversión de
una decisión de consenso temprana disminuye
exponencialmente con la profundidad de bloque.
