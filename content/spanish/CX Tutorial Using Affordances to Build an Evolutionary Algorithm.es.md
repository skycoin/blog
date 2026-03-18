+++
title = "Tutorial de CX: Uso de Affordances para construir una pequeña aventura basada en texto"
tags = [
    "CX",
]
bounty = 5
date = "2017-09-20"
aliases = [
	"/es/cx/cx-tutorial-using-affordances-to-build-an-evolutionary-algorithm/"
]
+++

<!-- MarkdownTOC autolink="true" bracket="round" depth="2" -->

- [Introducción](#introducción)
- [Arquitectura desafio-respuesta](#arquitectura-desafio-respuesta)
- [Sistema de Affordance](#sistema-de-affordance)
- [Objetos](#objetos)
- [Conclusión](#conclusión)

<!-- /MarkdownTOC -->

# Introducción

Este tutorial presenta un "juego" basado en texto
(el usuario no interactúa con el programa y no puede
influir en las decisiones del personaje) que usa una
[Arquitectura desafio-respuesta](#arquitectura-desafio-respuesta) para determinar cuáles
son las posibles acciones que puede hacer el personaje
del juego. El código fuente completo se puede encontrar
en el [repositorio de CX](https://github.com/skycoin/cx), en el archivo *examples/text-based-adventure.cx*.

El juego describe la aventura de un viajero que está
escapando de un monstruo (después de todo, Halloween viene el mes siguiente).
Si el viajero sobrevive cierto número de horas
(bueno, estas son solo repeticiones en un bucle *for*),
el monstruo dejará de perseguir al viajero. A continuación,
un ejemplo de una sesión:

```
El viajero sigue el camino, asegurándose de ignorar dolor alguno.
Aullando y gruñendo, el monstruo viene.
La valentía aparece a la vista, con la esperanza de vivir otra noche.
Ingenuo e incluso tonto, pero el acto del viajero deja al monstruo entumecido.
Norte, este, oeste, sur. Cualquier dirección es buena,
siempre y cuando no se encuentre ningún monstruo.
Aullando y gruñendo, el monstruo viene.
El viajero huye, y la cobardía lo deja vivir otro día.

Sobreviviste.
```

Si el viajero decide luchar contra el monstruo y su intento heroico
falla, el juego termina. Un ejemplo de finalización de juego es:

```
Norte, este, oeste, sur. Cualquier dirección es buena,
siempre y cuando no se encuentre ningún monstruo.
Aullando y gruñendo, el monstruo viene.
La valentía aparece a la vista, con la esperanza de vivir otra noche.
Pero el fracaso describe esta lucha y, de repente, esta aventura llega a su fin.

Has muerto.

Call's State:
flag:			true
nonAssign_32:		""

halt() Arguments:
0: "Has muerto."

65: call to halt
```

Como puede ver, se genera un error si muere (esto es adecuado,
es una situación aterradora para un programador).

# Arquitectura desafio-respuesta

En esta arquitectura, surge una pregunta y diferentes agentes (en
este caso, funciones) deben responder esta pregunta. Una simple pregunta
que se puede preguntar es "¿Quién puede ser ejecutado en este momento?" y aquellas
funciones que se puedan ejecutar lo harán.

Los siguientes prototipos de funciones representan las posibles acciones que
puede ocurrir durante la aventura del viajero.

```
func walk (flag bool) () {}
func noise (flag bool) () {}
func consider (flag bool) () {}
func chance (flag bool) () {}
func fightResult (flag bool) () {}
func theEnd (flag bool) () {}
```

# Sistema de Affordance

Otra función debe coordinar las llamadas de función. En este caso,
El sistema de Affordance de CX se usa para determinar si una acción
puede ser ejecutada o no.

```
yes := true
no := false

remArg("walk")
affExpr("walk", "yes|no", 0)
:tag walk;
walk(false)
```

En el código anterior, *remArg()* busca una expresión con la etiqueta "walk"
y elimina su argumento. Esto se hace para lograr que
el sistema de affordance registre los argumentos que se pueden enviar al
operador de expresión. A continuación, *affExpr()* le dice a CX "entre todos los
argumentos que se pueden enviar a *walk*, dime si *yes* o no *no* puede
ser utilizado como argumentos, y aplica la opción *0th* de la lista de affordance
que devuelvas".

El procedimiento anterior se aplica a todas las acciones que pueden suceder
durante la aventura del viajero. Para cada una de estas acciones, se consultan
las siguientes reglas para determinar si la acción debería ser
permitida o no:

```
setClauses("
          aff(walk, yes, X, R) :- X = monster, R = false.
          aff(noise, yes, X, R) :- X = monster, R = false.

          aff(consider, yes, X, R) :- R = false.
          aff(chance, yes, X, R) :- R = false.
          aff(fightResult, yes, X, R) :- R = false.
          aff(theEnd, yes, X, R) :- R = false.

          aff(consider, yes, X, R) :- X = monster, R = true.
          aff(chance, yes, X, R) :- X = fight, R = true.
          aff(fightResult, yes, X, R) :- X = fight, R = true.
          aff(theEnd, yes, X, R) :- X = died, R = true.
        ")
```

La primera regla se puede leer como: "Se me preguntará si se está considerando
enviar el argumento *yes* a la acción *walk*. Pero si el objeto
*monster* está presente, entonces este argumento es *no* automáticamente.

Las reglas en el segundo bloque (las 4 reglas después de la primera línea vacía)
le dicen al sistema de affordance que "nunca" acepte un argumento *yes*. Hacemos
esto porque queremos que este sea el comportamiento predeterminado, pero podemos
más tarde declarar reglas que anulen este comportamiento. Este proceso de anulación
ocurre con las últimas 4 reglas. Básicamente, este bloque de reglas
le está diciendo a CX que acepte *yes* como argumentos si un objeto en particular está
presente en la pila de objetos.

# Objetos

Algunas de las acciones agregan o eliminan objetos de la pila de objetos. Por
ejemplo, siempre que la acción *noise* decida hacer que el monstruo
aparezca, *addObject("monster")* se ejecuta. Si el viajero decide
huir de la lucha, el objeto "monster" se elimina de la pila de objetos.

En el caso de la acción *chance*, el monstruo puede decidir
perdonar al viajero unos segundos más para ver lo que decide hacer.
Para hacer esto, el objeto "fight" se elimina (ya que el monstruo no quiere comenzar una pelea),
pero el objeto "monster" permanece.

# Conclusión

El sistema de affordance de CX utiliza objetos y
reglas para tomar decisiones complejas sobre cómo se filtrarán las affordances.

Al usar objetos, podemos decidir qué acciones se activarán o desactivarán.
Para este ejemplo, se está considerando una pequeña cantidad de acciones
para este proceso de activación, y el beneficio de usar esta arquitectura
podría parecer inútil a primera vista. Sin embargo, se podrían definir
reglas más complejas que involucren más objetos, y una sola regla podría
estar a cargo de activar varios nodos en una gran red de acciones. Además,
en este ejemplo solo se consideran dos argumentos posibles: *yes* y *no*; podríamos
tener más argumentos y acciones que acepten diferentes tipos de argumentos
distintos de booleans.
