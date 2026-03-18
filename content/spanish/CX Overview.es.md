+++
title = "Visión general de CX"
tags = [
    "CX",
]
bounty = 20
date = "2017-09-06"
aliases = [
	"/es/overview/cx-overview/"
]
+++

<!-- MarkdownTOC autolink="true" bracket="round" depth="2" -->

- [Introducción a CX](#introducción-a-cx)
- [Repositorio del Proyecto](#repositorio-del-proyecto)
- [Sintaxis](#sintaxis)
- ['Affordances'](#affordances)
    - [Restricciones de Aridad](#restricciones-de-aridad)
    - [Restricciones de Tipo](#restricciones-de-tipo)
    - [Restricciones Existenciales](#restricciones-existenciales)
    - [Restricciones de Identificador](#restricciones-de-identificador)
    - [Restricciones de Límites](#restricciones-de-límites)
    - [Restricciones Definidas por el Usuario](#restricciones-definidas-por-el-usuario)
- [Sistema de Tipado Estricto](#sistema-de-tipado-estricto)
- [Compilado e Interpretado](#compilado-e-interpretado)
    - ['Loop' de Read-Eval-Print](#loop-de-read-eval-print)
    - [Comandos de Meta-Programación](#comandos-de-meta-programación)
    - ['Stepping'](#stepping)
    - ['Debugging' Interactivo](#debugging-interactivo)
- [Algoritmo Evolutivo Integrado](#algoritmo-evolutivo-integrado)
- [Serialización](#serialización)

<!-- /MarkdownTOC -->

# Introducción a CX

CX es tanto una especificación como un lenguaje de programación diseñado para
adoptar un nuevo paradigma de programación basado en el concepto de 'affordances'. 'Affordances' permiten que un programa sepa qué acciones pueden y no pueden ser hechas por este. Por ejemplo, podemos preguntarle al programa qué argumentos se pueden enviar a una función, y el programa devolverá una lista de posibles acciones. Después de haber decidido qué acción de la lista es apropiada, podemos elegir una de las opciones y el programa
aplicará la acción elegida. Como consecuencia del sistema 'Affordances' de CX, un algoritmo de programación genética se construye y se proporciona como una función nativa, la cual se puede utilizar para optimizar la estructura del programa durante el tiempo de ejecución.

La especificación CX declara que tanto un compilador como un intérprete
deben ser accesibles para el programador. Se puede acceder al intérprete
a través de un 'loop' de read-eval-print, en el cual el programador puede agregar y eliminar interactivamente elementos a un programa. Una vez que el programa ha sido
terminado, se puede compilar para aumentar su rendimiento.

El sistema de tipado en CX es muy estricto. El único "'casting' implícito"
ocurre cuando el analizador determina qué es un 'integer', un 'float', un
'boolean', un 'string' o un 'array'. Si una función requiere un integer de 64-bit, por ejemplo, uno tiene que usar una función de 'cast' para convertirlo explícitamente al tipo requerido.

Por último, un programa CX puede serializarse por completo en 'arrays' de bytes,
manteniendo su estado de ejecución y estructura. Esta versión serializada
de un programa puede deserializarse más adelante y continuar su ejecución
en cualquier dispositivo que tenga un intérprete/compilador de CX.

En las siguientes secciones, las características de CX discutidas en los párrafos anteriores se describen más a detalle.

# Repositorio del proyecto

El código fuente del proyecto se puede descargar desde su repositorio de Github: [https://github.com/skycoin/cx](https://github.com/skycoin/cx). El repositorio incluye el archivo de especificación, documentación, ejemplos, y el código fuente en sí.

# Sintaxis

Como se mencionó en la introducción, CX es una especificación y un
lenguaje de programación. La especificación CX no impone una sintaxis, sino más bien las estructuras y procesos que un dialecto CX debe
implementar para ser considerado un CX. Como consecuencia, uno podría
implementar dos dialectos CX, uno con una sintaxis parecida a 'Lisp' y otro
uno con una sintaxis parecida a 'C'. Este lenguaje subyacente se llama Base CX,
o "el lenguaje base". En este documento, se utiliza una implementación para
mostrar las capacidades de la especificación, aunque su propósito
no es solo servir como una herramienta académica, sino convertirse en un completo y
robusto lenguaje que se puede utilizar para fines generales.

El CX utilizado en este documento tiene el objetivo de tener una sintaxis tan similar
como sea posible a la sintaxis de 'Go'.

# Affordances

Un programador necesita tomar una plétora de decisiones mientras construye
un programa, por ejemplo, cuántos parámetros debe recibir una función, cuántos
parámetros deberá devolver, qué 'statements' son necesarias para obtener la funcionalidad deseada, y qué argumentos deben enviarse como
parámetros a las funciones de 'statement', entre otros. El sistema 'affordance' en CX se puede consultar para obtener una lista de las posibles acciones
que pueden ser aplicadas a un elemento. En este contexto, ejemplos de elementos son
funciones, 'structs', módulos y expresiones.

Sin tener un conjunto de reglas y hechos que dicten lo que debe ser la
lógica y propósito detrás de un programa, uno puede determinar algunas
restricciones básicas, que al menos garantizan que un programa será
semánticamente correcto. El sistema 'affordance' proporciona tales restricciones como la primera capa de filtrado, y se explican a continuación.

### Restricciones de Aridad

Las expresiones en CX pueden devolver múltiples valores. Esto crea un desafío
para el sistema 'affordance', dado que el número de variables que reciben
los argumentos de salida de una expresión deben coincidir con el número de
salidas definidas por el operador de la expresión.

```
out1, out2, ..., outN := op(inp1, inp2, ..., inpM)
```

Si el ejemplo anterior es correcto, entonces *op* necesita generar *N*
argumentos. Este problema puede ser aún más desafiante si
consideramos que la definición de *op* puede ser cambiada por el sistema 'affordance' en sí o por el usuario en el futuro: tan pronto como la definición de *op* cambie, nuevas 'affordances' pueden ser aplicadas a cualquier expresión
que use *op* como su operador, porque la cantidad de variables que
reciben los argumentos del 'output' de *op* ahora están en desajuste.

La lógica anterior también insinúa que si el número de variables de recepción coincide con el número de parámetros de salida del operador de la expresión, la acción de agregar nuevas variables de recepción ya no puede ser realizada.

Las restricciones de aridad también se aplican a los argumentos de entrada en expresiones, es decir, si una llamada a función ya tiene definidos todos sus argumentos de entrada,
entonces el sistema 'affordance' no debería enlistar agregar otro argumento
como una posible acción. Del mismo modo, si una expresión está tratando de llamar a un
operador con menos argumentos de los requeridos, el sistema 'affordance', al ser consultado, deberá decirle al programador que agregar un nuevo argumento a la llamada de función es posible.

**Ejemplo:**

*Nota: la concatenación de 'strings' no ha sido implementada aún. También, las funciones de 'print' siempre agregan una nueva línea al final del 'string' impreso. Una versión futura de la implementación de CX presentada en este documento abordará estos problemas.*

```
var edad i32 = 18
var pasos i32 = 23

func avanzar (dirección str, númeroPasos i32) () {
    printStr("Avanzando:")
    printStr(dirección)
    printStr("Número de Pasos:")
    printI32(númeroPasos)
}

func main () () {
    avanzar("Norte")
}
```

En el ejemplo anterior, la llamada a *avanzar* en la función *main*
carece de un argumento. Si uno consulta el sistema 'affordance', el sistema
deberia enlistar, entre otras cosas, una acción similar a:

```
...
(k)       AddArgument avanzar edad
(k+1)     AddArgument avanzar pasos
...
```

donde 'k' representa un índice arbitrario. Como se puede ver, el sistema 'affordance' le está diciendo al programador que dos de las posibles acciones que se pueden son agregar otro argumento a la función de avance, y que las definiciones globales *edad* y *pasos* se encuentran entre las opciones para actuar como argumentos.

Vale la pena mencionar que los 'affordances' siempre deben ser enumerados, y su orden debe ser constante en varias llamadas a el sistema 'affordance'. La razón detrás de esto es que el programador debería ser capaz de indicarle al sistema qué 'affordance' se debe aplicar
después de examinar el resultado de la consulta.

### Restricciones de Tipo

El comportamiento común en los lenguajes de programación es tener un sistema de tipado
que restrinja al programador de enviar argumentos de tipos inesperados para llamar a las funciones. Incluso en lenguajes de programación débilmente tipados,
una operación como `true /" hello world "` debería generar un error
(a menos que sea el caso de algún [lenguaje esotérico](https://en.wikipedia.org/wiki/Esoteric_programming_language), claro está). CX sigue un [sistema de tipado estricto](#sistema-de-tipado-estricto), y argumentos que no son exactamente del tipo esperado no deben ser considerados como candidatos para acciones de 'affordances' (aunque una solución alternativa es envolver estos argumentos en funciones de 'cast' antes de mostrarse como 'affordances').

Las restricciones de tipo también deben tenerse en cuenta al asignar un nuevo valor
a una variable ya existente. En CX, una variable declarada de
cierto tipo debe permanecer de ese tipo durante toda su vida (a menos que se elimine usando comandos/funciones de metaprogramación y sea creada de nuevo). Por lo tanto, una variable declarada para contener un 'integer' de 32 bits no debería ser considerada como candidato para recibir un argumento de salida 'float' de 64 bits, por así decirlo.

### Restricciones Existenciales

Este tipo de restricción puede parecer trivial a primera vista: si
un elemento no existe, un 'affordance' que lo involucra no debería
existir tampoco. Sin embargo, esta restricción se convierte en un desafío una vez que consideramos una situación en la cual se cambió el nombre de una función, y ya se ha utilizado como operador en expresiones a lo largo de un
programa. Si el programa está en su forma de código fuente, este problema es
reducido a un simple proceso de "búsqueda y reemplazo", pero si es durante
tiempo de ejecución, el sistema 'affordance' se vuelve bastante útil: un 'affordance'
para cambiar el identificador vinculado a este operador.

Incluso si un elemento no ha sido renombrado, determinar si un elemento
existe o no, no es trivial. Los elementos a ser utilizados en 'affordances'
deben buscarse en el ámbito actual de la pila de llamadas, en el
ámbito global, y en los ámbitos globales de otros módulos.

### Restricciones de Identificador

El agregar nuevos elementos con nombre son comúnmente acciones candidatas para 'affordances'. Una restricción que surge al tratar de aplicar ese tipo de 'affordance',
es asegurar un identificador único para el nuevo elemento para evitar
redefiniciones. El sistema 'affordance' puede generar un identificador único en el ámbito del elemento, o puede pedirle al programador que proporcionar un identificador adecuado.

### Restricciones de Límites

CX proporciona funciones nativas para acceder y modificar elementos de
'arrays'. Ejemplos de un lector de 'array' y un escritor de 'array' son:

```
readI32([]i32{0, 10, 20, 30}, 3)
writeF32([]f32{0.0, 10.10, 20.20}, 1, 5.5)
```

En la primera expresión, se accede a un 'array' de cuatro 'integers' de 32 bits
en el índice 3, lo que devuelve el último elemento del 'array'. En la segunda
expresión, el segundo elemento de un 'array' de tres 'floats' de 32 bits es
cambiado a 5.5. Si se accede a cualquiera de estos 'arrays' utilizando un
índice negativo o un índice que excede la longitud del 'array', se genera un error "fuera de límites".

Al obedecer solo las restricciones de tipo, el sistema 'affordance' dirá
al programador que cualquier argumento 'integer' de 32 bits se puede utilizar como un
índice para acceder a cualquier 'array'. Aunque estos programas compilarían, errores "fuera de límites" serían muy probables si el programador no prestar atención extra a lo que se está eligiendo para ser aplicado.

El sistema 'affordance' necesita filtrar los 'affordances' de acuerdo con el siguiente criterio: descartar cualquier 'integer' negativo de 32 bits y descartar
cualquier 'integer' de 32 bits que exceda la longitud del 'array' que se envía a
el lector o escritor de 'array'.

### Restricciones Definidas por el Usuario
*Nota: El sistema de restricciones definido por elusuario aún se encuentra en sus etapas experimentales.*

Las restricciones básicas descritas anteriormente deberían al menos garantizar que
el programa no encuentre ningún error al tiempo de ejecución. Estas restricciones
deberían ser suficientes para construir algunos sistemas interesantes, como el [algoritmo evolutivo] (#algoritmo-evolutivo-integrado) nativo de CX. Sin embargo,
en algunas situaciones se requiere un sistema más robusto. Para este propósito,
cláusulas, consultas y objetos se utilizan para describir el ambiente de un módulo. Estos elementos se definen mediante el uso de un intérprete de Prolog integrado y las funciones nativas de CX *setClauses*, *setQuery*, y *addObject*.

La descripción más general de este sistema de restricciones es que el programador define una serie de cláusulas de Prolog (hechos y reglas), que será consultadas usando la consulta de Prolog definida, para cada uno de los objetos agregados. Esto difícilmente tendrá sentido para cualquiera que lea esto por primera vez. Un ejemplo aclararía un poco mejor los conceptos y proceso:

```
setClauses("mover(robot, norte, X, R) :- X = paredNorte, R = false.")

setQuery("mover(robot, %s, %s, R).")
```

En este ejemplo, solo se define una regla. La regla puede ser aproximadamente
interpretada como "si el robot quiere moverse hacia el norte, pregunta qué es X. Si X
es paredNorte, entonces no se puede mover". La consulta es solo un 'string' de formato
que servirá como una consulta para la acción *mover*, y para el elemento *robot* que recibirá dos argumentos más: una dirección y un objeto.

Los objetos se pueden definir utilizando la función *addObject*:

```
addObject("paredSur")
addObject("paredNorte")
```

El sistema de restricción consultará el sistema por cada uno de los objetos
presentes en el módulo. En este ejemplo, el sistema primero realizará
la consulta "mover(robot, norte, paredSur)" y el sistema responderá
"nil", lo que significa que no tiene ninguna regla definida para manejar
tal situación, y la acción predeterminada es no descartar el
'affordance'. La segunda consulta será "mover(robot, norte, paredNorte)"
y el sistema responderá "false". En este caso, el affordance no pasó la prueba y es descartado.

El ejemplo anterior ilustra cómo estas reglas pueden negar un
'affordance' usando una condición. Pero las reglas también se pueden usar para aceptar
'affordances', incluso después de ser negados por reglas anteriores.

```
setClauses("mover(robot, norte, X, R) :- X = paredNorte, R = false.
    mover(robot, norte, X, R) :- X = agujeroNorte, R = true.")

setQuery("mover(robot, %s, %s, R).")
```

La regla agregada en el código anterior le dice al sistema que acepte el movimiento del robot hacia el norte si hay un agujero. Si el 'array' de objetos se deja como se definió anteriormente, el 'affordance' de movimiento aún será descartado, pero si se evalúa `addObject ("agujeroNorte")`, el "agujeroNorte" sera agregado y el robot podrá pasar
a través de la pared usando el agujero.

# Sistema de Tipado Estricto

Como se mencionó en la introducción, no hay un 'casting' implícito en
CX. Debido a esto, múltiples versiones para cada uno de los tipos primitivos
se definen en el módulo central. Por ejemplo, existen cuatro funciones nativas para
sumar: addI32, addI64, addF32 y addF64.

El analizador adjunta un tipo predeterminado a los datos que encuentra
en el código fuente: si se lee un 'integer', su tipo predeterminado es *i32*
o 'integer' de 32 bits; y si se lee un 'float', su tipo predeterminado es *f32* o 'float' de 32
bits. No hay ambigüedad con otros datos leídos por el analizador:
*true* y *false* son siempre 'booleans'; una serie de caracteres
entre comillas dobles siempre son 'strings'; un 'array' necesita
indicar su tipo antes de la lista de sus elementos, por ejemplo, `[]i64{1, 2,
3}`.

Para los casos en los que el programador necesita cambiar explícitamente un valor de un tipo a otro, el módulo central proporciona una cantidad de funciones de 'cast' para trabajar con tipos primitivos. Por ejemplo, `byteAToStr` convierte un 'array' de bytes a un 'string', y `i32ToF32` convierte un 'onteger' de 32 bits
a un 'float' de 32 bits.

# Compilado e Interpretado

La especificación CX exige un dialecto CX para proporcionar al desarrollador
con un intérprete y un compilador. Un programa interpretado es mucho más lento que su homólogo compilado, como es de esperarse, pero permitirá un programa más flexible. Esta flexibilidad proviene de funciones de meta-programación y 'affordances', que pueden modificar la estructura de un programa durante el tiempo de ejecución.

Un programa compilado necesita una estructura más rígida que un programa interpretado, ya que muchas de las optimizaciones balancean esta rigidez. Como consecuencia, el sistema de 'affordance' y cualquier función que opera sobre la estructura del programa tendrá una funcionalidad limitada en un programa compilado.

El compilador debe usarse cuando el rendimiento es la mayor preocupación,
mientras que un programa debe seguir siendo interpretado cuando el programador
requiere toda la flexibilidad provista por las características de CX. En las siguientes subsecciones, se presentan algunas de estas características, sin el objetivo de servir como un tutorial, sino más bien como una mera introducción.

### 'Loop' de Read-Eval-Print

El 'loop' read-eval-print (REPL) es una herramienta interactiva en la que el programador puede ingresar nuevos elementos del programa y evaluarlos. Comenzar una nueva sesión REPL imprimirá los siguientes mensajes en la consola:

```
CX REPL
More information about CX is available at https://github.com/skycoin/cx

*
```

El "*" le dice al programador que el REPL está listo para recibir una nueva
línea de código. El REPL continuará leyendo las entradas del usuario hasta que un punto y coma, y un caractér de nueva línea sean encontrados.

Si no se cargó ningún programa inicialmente en el REPL, CX comenzará con
un programa vacío. Esto se puede ver si el comando de meta-programación `:dProgram true;`
se da como entrada:

```
* :dProgram true;
Program

*
```

El REPL solo imprime la palabra "Program" seguida de una línea vacía. Como primer paso, se pueden declarar un nuevo módulo y función:

Como primeros pasos, un nuevo módulo *main* y una nueva función *main*
deben declararse:

```
* package main;
Program
0.- Module: main

* func main () () {};
Program
0.- Module: main
	Functions
		0.- Function: main () ()

*
```

Como se puede ver, la estructura del programa se está imprimiendo cada vez que
nuevo elemento se agrega al programa.

### Comandos de Meta-Programación

`:dProgram` se usó en la subsección anterior. Cualquier declaración que
comienza con dos puntos (:) es parte de una categoría de instrucciones conocida como
"Comandos de meta-programación".

La declaración de elementos en REPL indica a CX que los agregue a la estructura del programa. Pero, como en muchos otros lenguajes de programación, estas declaraciones están limitadas a solo ser agregadas, y como máximo a ser redefinidas.

Pero, como en muchos otros lenguajes de programación que proporcionan un REPL, el
programador está limitado a agregar elementos a un programa y, a lo mucho, redefinir elementos. Los comandos de meta-programación permiten al programador tener más control sobre como la estructura del programa esta siendo modificada.

`:dProgram`,`:dState`, y `:dStack` solo se usan con fines de 'debugging', al imprimir la estructura del programa, el estado actual de la llamada y la pila de llamadas completa al usuario, respectivamente. `:step` ordena al intérprete que avance o
retroceda en su ejecución. `:package`,`:func`, y `:struct`, conocidos como *selectors*, se usan para cambiar el ámbito del programa. `:rem` da acceso al programador a *removers*, que pueden usarse de forma selectiva para remover elementos de la estructura de un programa. `:aff` se usa para acceder al sistema 'affordance' de CX; este comando de meta-programación se usa para consultar y aplicar 'affordances' para los diferentes elementos de un programa. Por último, `:cláuses` se utiliza para establecer las cláusulas de un módulo para ser utilizado por el [sistema de restricciones definidas por el usuario](#restricciones-definidas-por-el-usuario); `:object` y `:objects` se utilizan para agregar e imprimir objetos, respectivamente; y los dos últimos comandos de meta-programación: `:query`, que se utiliza para establecer la consulta del módulo, y `:dQuery` que es un ayudante para depurar las restricciones definidas por el usuario.

### 'Stepping'

Un programa iniciado en modo REPL se puede inicializar con una estructura de programa
definida en un archivo de origen. Por ejemplo:
directorio actual

```
$ ./cx --load examples/looping.cx

```

carga `looping.cx` desde el directorio de ejemplos (la lista completa de
ejemplos se puede encontrar en el [repositorio del proyecto](https://github.com/skycoin/cx)). Aunque un programa ha sido cargado, aún no ha sido ejecutado. En el REPL, para ejecutar un programa uno tiene que usar el comando de meta-programación `:step`. Para ejecutar un programa hasta el final, `:step 0;` debe ser utilizado. Pero `:step` es interesante porque puede tomar otros 'integers' como su
argumento (incluso 'integers' negativos). Por ejemplo:

```
CX REPL
More information about CX is available at https://github.com/skycoin/cx

* :dStack false;

* :step 5;
0

* :step 5;
1

* :step 5;
2

*
```

El programa *examples/looping.cx* se ejecuta 5 pasos a la vez. Nosotros
puede ver que se requieren 5 pasos para que el programa reevalúe la condición *while*, imprima el contador, y agregue 1 al contador.

Del mismo modo, deberiamos "retroceder en el tiempo" si se indica al REPL que dé
`:step -5`.

```
...

* :step 5;
2

* :step -5;

* :step 5;
2

*
```

Después de indicar a CX que avance 5 pasos nuevamente, el 2 se imprime nuevamente
a la consola. Debe notarse que al contador no solo le es asignado un valor diferente. Lo que está sucediendo es que la pila de llamadas esta siendo revertida a un estado anterior.

### 'Debugging' Interactivo

Un programa CX ingresará al modo REPL una vez que se haya encontrado un error. Este comportamiento le da al programador la oportunidad de depurar el programa antes de intentar reanudar su ejecución.

En el siguiente ejemplo, se genera un error de división por 0, el REPL alerta al programador sobre el error, la última llamada en la pila de llamadas es arrojada, y el REPL continúa su ejecución.

```
CX REPL
More information about CX is available at https://github.com/skycoin/cx

* package main;

* func main () () {};

* :func main;
main
:func main {...
	* foo := divI32(5, 3);
main
:func main {...
	* bar := divI32(10, 0);
main
:func main {...
	* :step 0;
fn:main ln:0, 	locals:
>> 1
fn:main ln:1, 	locals: foo: 1

Call's State:
foo:		1

divI32() Arguments:
0: 10
1: 0

0: divI32: Division by 0
main
:func main {...
	*
```

Del mismo modo, si un programa se da como entrada al intérprete CX,
sin llamar al REPL, pero se genera un error, el REPL será llamado para el programador o administrador del sistema para depurar el programa:

```
$ ./cx examples/program-halt.cx
1

Call's State:
nonAssign_0:		1
nonAssign_1:		1

divI32() Arguments:
0: 5
1: 0

5: divI32: Division by 0
CX REPL
More information about CX is available at https://github.com/skycoin/cx

*
```

# Algoritmo Evolutivo Integrado

El sistema 'affordance' y las funciones de meta-programación en CX permiten la flexibilidad de cambiar la estructura del programa de una manera supervisada. Sin embargo, las 'affordances' pueden ser automatizadas teniendo una función que selecciona el índice del 'affordance' por aplicarse.

`evolve` es una función nativa que construye funciones definidas por el usuario
mediante el uso de 'affordances' al azar. Un proceso iterativo se usa para probar.

`evolve` sigue los principios de la computación evolutiva. En
en particular, 'evolve' realiza una técnica llamada programación genética. La programación genética trata de encontrar una combinación de operadores y argumentos que resolverán un problema. Por ejemplo podrías instruir a `evolve` encontrar una combinación de operadores que, cuando se les envíe 10 como argumento, devuelvan 20. Esto puede sonar trivial, pero
la programación genética y otros algoritmos evolutivos pueden resolver problemas muy complicados.

En el directorio *examples* del repositorio, uno puede encontrar un
ejemplo (*examples/evolving-a-function.cx*) que describe el proceso para
evolucionar una funcion [curve-fitting](https://en.wikipedia.org/wiki/Curve_fitting).

# Serialización

Un programa en CX se puede serializar parcial o totalmente a un 'array' de bytes. Esta capacidad de serialización le permite a un programa crear una imagen del programa (similar a
[imágenes del sistema](#https: //en.wikipedia.org/wiki/System_image)), en la que se mantiene el estado exacto en el que se serializó el programa. Esto significa que un programa serializado puede ser deserializado, y reanudar su ejecución más adelante. La serialización también se puede usar para crear copias de seguridad.

Un programa CX puede aprovechar sus características integradas para crear algunos escenarios interesantes. Por ejemplo, un programa puede ser serializado para crear una copia de seguridad de sí mismo, y comenzar un [algoritmo evolutivo](#algoritmo-evolutivo-integrado) en una de sus funciones. Si el algoritmo evolutivo encuentra una función que tiene un mejor rendimiento que la definición anterior, uno puede quedarse con esta nueva versión del programa. Sin embargo, si el algoritmo evolutivo
funcionó mal, el programa se puede restaurar a la copia de seguridad guardada. Todas estas tareas pueden ser automatizadas.
