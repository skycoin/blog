+++
title = "Skywire y Viscript"
tags = [
    "Development",
    "Skywire",
]
bounty = 3
date = "2017-08-15"
image = "img/old-messenger.png"
aliases = [
	"/es/skywire/skywire-and-viscript/"
]
+++
## Introducción

### Viscript

[Viscript](https://github.com/skycoin/viscript) es una interfaz de
línea de comandos multiplataforma, y un iniciador de aplicaciones
y eventualmente será un administrador de clúster. Está basado en la biblioteca
"signal" como un servidor "signal", por lo que puede gestionar
los clientes de "signal", como el nodo y los componentes en Skywire.
Se puede ejecutar con interfaz grafica o sin ella.

#### Captura de pantalla de la interfaz gráfica de Viscript:

![screenshot](/img/viscript.jpg)

Podemos agregar configuraciones de aplicaciones en el archivo config.yaml, como el meshnet-socks-server:

```
  meshnet-socks-server:
    daemon: true
    desc: DESCRIPTION GOES HERE
    path: bin/meshnet/meshnet-run-socks-server
    default_args: []
    help: |
        [1] Text name of app, must be unique
        [2] Node address which app will be talked with. ex 101.202.34.56:9000
        [3] Port which socks server will use for connecting with target host. ex 8000

        Full Example Command:
            start meshnet-socks-server sockssrv0 101.202.34.56:9000 8001
```

Después de reiniciar Viscript, podemos verificar las aplicaciones que pueden ser iniciadas por Viscript, con el comando apps.

Como se puede ver en la captura de pantalla, podemos iniciar la aplicación usando el comando `s` (`s apptracker 127.0.0.1:20000`).

Luego, Viscript lo inicia con un id único de secuencia,
podemos hacer ping(`ping`), verificar el uso de recursos(`ru`)
y apagarlo(`sd`) a través de este id.

### Skywire

[Skywire](https://github.com/skycoin/skywire) es una red
alternativa de pares que toma el control de los ISP y se
lo devuelve a los usuarios. Hay varios componentes dentro
de él. El administrador de nodos, el nodo y las aplicaciones
se ejecutan en la red en malla, como el cliente vpn, el
servidor vpn, el cliente de socks, el servidor de socks, etc.

Todos los componentes dentro de Skywire se basan en la
biblioteca de "signal" como un cliente de "signal". Entonces,
pueden ser ejecutados, administrados y apagados por medio de Viscript.

## Arquitectura

#### Diagrama de Arquitectura:

------

```
                                   +-----------+-------------+
           +---------------^-----+ |     vpn   |    socks    |
           |  managed by   |       +-----------+-------------+
           |               <-----+ |          node           |
           v               |       +-------------------------+
                           <-----+ |       node manager      |
+-------------------+      |       +-------------------------+
|      viscript     |      +-----+ |        messenger        |
+-------------------+--------------+-------------------------+
|                        signal                              |
+------------------------------------------------------------+
|                         net                                |
+------------------------------------------------------------+
```

------

Hay aplicaciones del lado del cliente y del servidor para cada servicio, como cliente de vpn y servidor de vpn. Se ejecutan en la red en malla de Skywire. Como ya sabemos, Skycoin es la moneda de Skywire, cuando el usuario reenvía tráfico o proporciona recursos de red, recibe Skycoin. Del mismo modo, cuando el usuario consume recursos de red o medios, gasta Skycoin. Una vez se implante la medición, Skywire generará monedas por operar la red.

El nodo, El administrador de nodos y el Messenger son los componentes clave de la red en malla Skywire. El nodo es un nodo de malla de igual a igual. Las aplicaciones de servicio se registrarán en el nodo y su tráfico será reenviado por el mismo. El administrador de nodo gestiona las rutas entre los nodos en la red. El Messenger permite a los usuarios mirar clústers por llave pública. Estos son los pilares de Skywire.

## Resumen

Viscript y Skywire todavía están bajo intenso desarrollo. Pero hemos logrado muchos cosas emocionantes en todo el ecosistema de Skycoin. ¡Lo estamos disfrutando y vamos a desbloquear todo el potencial de una Internet libre en el futuro!
