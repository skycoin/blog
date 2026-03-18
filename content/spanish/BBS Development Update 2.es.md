+++
title = "Actualización de Desarrollo de Skycoin BBS #2"
tags = [
    "Development",
    "BBS",
    "CXO",
]
bounty = 4
date = "2017-08-31"
aliases = [
	"/es/bbs/bbs-development-update-2/"
]
+++

¡Ha pasado poco más de un mes desde el lanzamiento de la versión 0.1, y la 0.2 pronto estará lista!

Los cambios son los siguientes:

- Utiliza la última versión de CXO (base de datos auto replicante de igual a igual).
- Reimplementación de los objetos y árbol de CXO (en preparación para nuevas funciones).
- Introducción a un módulo de `views` para una fácil implementación de diferentes formas de "ver" contenido.
- Implementación inicial de seguimiento/evitación de usuarios.
- Interfaz completamente renovada.

## Cambios de CXO

CXO ha sido seriamente refactorizado para ser más rápido y estable.
La API se ha diseñado para funcionar mejor con matrices hash - con acceso
de tiempo constante, replicación más rápida y la capacidad de acceder a un
elemento directamente con un hash determinado.

Estos cambios han llevado a BBS a cambiar la mayoría de su código base.

[Examina el repositorio de CXO aquí.](https://github.com/skycoin/cxo)

## Cambios en la estructura de datos de CXO

Los cambios en la estructura de datos son para solucionar los siguientes problemas:

1. Implementar una estructura para que los datos del usuario se puedan migrar a sus propias raíces separadas en el futuro.
2. Determinar fácilmente "diffs" entre las secuencias de raíz (cambios). Esto será útil para compilar views y proporcionar actualizaciones en tiempo real al usuario final.
3. Determinar fácilmente el tipo de objeto raíz para diferentes tipos de raíz.

![Estructura de datos CXO de Skycoin BBS v0.2](/img/bbs_cxo_datastructure_v0.2.png)

El objeto  `RootPage` determina el tipo de raíz. Por el momento,
todos los datos se acumulan en un árbol raíz por tablero. En el futuro,
los hilos y los usuarios tendrán sus propias raíces individuales.

En el futuro, `BoardPage` tendrá una lista de llaves públicas en lugar
de hrefs para los hilos, ya que los hilos tendrán sus propias raíces.
Esto hace que los hilos sean fáciles de migrar entre tableros.

`DiffPage` se usa para determinar los cambios entre las secuencias
de raíz para la raíz de `BoardPage`. Esto es esencialmente un conjunto de matrices
en constante aumento, donde un aumento de longitud se interpreta como cambios.

`UsersPage` se convertirá en una lista de llaves públicas
(estas serán como "participantes" dentro de un tablero). Cada usuario tendrá su propia raíz.

## Implementación del módulo de Views

Un view es esencialmente solo una interfaz:

```go
type View interface {

	// Init initiates the view.
	Init(pack *skyobject.Pack, headers *pack.Headers, mux *sync.Mutex) error

	// Update updates the view.
	Update(pack *skyobject.Pack, headers *pack.Headers, mux *sync.Mutex) error

	// Get obtains information from the view.
	Get(id string, a ...interface{}) (interface{}, error)
}
```

Actualmente, todas las views compiladas se almacenan en la memoria.
Pero esto será poco práctico cuando nuestra base de usuarios aumente.
En versiones futuras las views se guardarán en un almacén de llave-valor en el disco.

Para la versión 0.2, hay dos implementaciones de `View`;
una para contenido (Tableros/hilos/mensajes/votos) y otra para compilar una lista de seguir/ignorar por usuario.

## Una nueva experiencia de usuario

En el momento de esta publicación, esto está cerca de ser completado. Aquí hay un video de youtube de este trabajo en progreso:

[![Skycoin BBS Showcase 4](/img/bbs-4.jpg)](https://youtu.be/Oue3WVkmGh4)

Manténgase al día con el desarrollo de Skycoin BBS, vigilando esta sección y uniéndose a nuestra [Comunidad de Skycoin BBS ](https://t.me/skycoinbbs) en Telegram.
