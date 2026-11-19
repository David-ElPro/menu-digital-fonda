# Menú digital para fonda

Aplicación web en español para mostrar el menú del día de una fonda en una pantalla o televisor. Incluye un panel de administración para activar o retirar guisados, elegir sus variantes y seleccionar las sopas, aguas y postres disponibles.

El objetivo es mantener visible la oferta de comida corrida y retirar rápidamente los platillos que se terminan durante el servicio.

## Componentes

| Archivo o carpeta | Función |
| --- | --- |
| `index.html` | Pantalla pública con carrusel de guisados, precios, acompañamientos, entradas, aguas y postres. |
| `admin.html` | Panel de control con diseño adaptable a celular para administrar la disponibilidad del menú. |
| `firebase-sync.js` | Inicio de sesión y sincronización del menú con Firestore. |
| `firestore.rules` | Lectura pública del menú y escritura limitada a los UID autorizados. |
| `menu-state.js` | Catálogo inicial y lectura/escritura compartida del estado local. |
| `img/` | Fotografías de alimentos utilizadas o disponibles para el catálogo. |
| `firebase.json` | Configuración para publicar los archivos estáticos con Firebase Hosting. |
| `.firebaserc` | Asociación del proyecto local con Firebase. |

La lógica JavaScript y los estilos propios están dentro de los archivos HTML. No hay un proceso de compilación, un servidor de aplicación ni un archivo `package.json`.

## Pantalla del menú

- Muestra un guisado activo a la vez y cambia automáticamente cada **7 segundos**.
- Mantiene el plato a la izquierda y agrupa el título, las entradas y las aguas a la derecha en pantallas horizontales.
- Presenta precio para comer en el local y precio para llevar.
- Muestra la variante seleccionada, los acompañamientos y las opciones activas de sopa y agua.
- Añade al carrusel una diapositiva con los postres activos (plátanos fritos con lechera, gelatina y flan), con ilustraciones SVG, precios y un degradado rosa, lila y crema. Los extras salados permanecen en una barra aparte durante los guisados.
- Alterna degradados dorados y naranja/rojo entre guisados. Incluye fondos animados, transiciones y vapor delimitado al borde superior del plato para evitar los precios. Respeta la preferencia de movimiento reducido.
- Intenta utilizar una ilustración SVG de respaldo cuando una fotografía no carga.
- Si existe un menú guardado pero no hay guisados activos, muestra un mensaje de espera.

El diseño de exhibición está orientado a una pantalla horizontal y utiliza todo el espacio del navegador.

## Panel de control

- Activar y desactivar guisados.
- Retirar guisados desde una lista rápida de los que están en pantalla.
- Buscar por nombre sin distinguir acentos ni mayúsculas, filtrar activos/inactivos y navegar por categorías con secciones separadas.
- Elegir variantes de los guisados que las tienen configuradas.
- Seleccionar hasta **3 sopas** y hasta **2 aguas** activas. El código permite dejar ambas listas sin opciones activas.
- Activar y desactivar postres y extras.
- Abrir la pantalla de exhibición mediante el botón **Ver TV**.

El panel permite editar precios para comer aquí y para llevar, y precios de postres. Los cambios se preparan como borrador: el modal muestra un resumen y solo se publican al confirmar **Guardar y aplicar**. También puedes seguir editando o descartar. Crear platillos y subir fotografías se realiza en el código.

## Catálogo y paquetes

El catálogo de `menu-state.js` incluye 54 platillos de Puerco, Res, Pollo, Antojitos, Caldos, Especiales y Paquetes, además de 4 entradas, 5 aguas y 4 postres o extras. Los nuevos platillos inician desactivados; al actualizar se conservan las activaciones y variantes válidas guardadas por el usuario. Las fotografías y datos del catálogo se actualizan automáticamente sin borrar el almacenamiento. Desde la versión 3 se conservan también los precios editados; al migrar versiones anteriores se toman los precios del catálogo, incluidos ambos paquetes de pozole a $110.

Los guisados regulares cuestan $95 para comer aquí y $100 para llevar; el filete empanizado, $100 en ambas modalidades; arrachera y cecina, $150 para comer aquí. La arrachera conserva su precio anterior de $150 para llevar; la cecina no muestra precio para llevar porque no se especificó.

**Pozole de pollo y de puerco:** activar cualquiera muestra su paquete de $110 con fotografía del pozole, orden de tacos dorados y 1L de agua. La tarjeta de tacos sustituye las entradas de sopa únicamente en esa diapositiva. No se indica precio para llevar del paquete porque no está definido.

Las sopas y aguas usan las fotos disponibles en `img/`. Naranja y los alimentos sin fotografía utilizan una representación de respaldo. Los tres postres dulces se reúnen en una diapositiva independiente al final del ciclo; solo aparecen los que están activos y utilizan los precios guardados en el admin. La pancita está en Caldos con su fotografía e inicia desactivada. Tiene los precios iniciales de los otros caldos ($95 aquí y $100 para llevar), editables en el panel. La mojarra sigue pendiente de definir precio y acompañamientos.

## Cómo ejecutarlo localmente

Se necesita un navegador moderno con JavaScript y almacenamiento local habilitados. Para cargar las dependencias externas se requiere conexión a internet.

1. Abre una terminal en la carpeta del proyecto.
2. Si tienes Python instalado, inicia un servidor estático:

   ```powershell
   python -m http.server 8000
   ```

3. Abre el panel en `http://localhost:8000/admin.html`.
4. El catálogo inicial se carga y guarda automáticamente si no existe un menú local válido.
5. Para probar la sincronización entre dispositivos, publica primero Hosting y las reglas siguiendo la sección de Firebase. Después pulsa **Ver TV** para abrir `http://localhost:8000/index.html` en otra pestaña del mismo navegador y perfil.
6. Coloca esa pestaña en la pantalla de exhibición y activa la pantalla completa del navegador si lo deseas.

Puedes utilizar otro servidor de archivos estáticos. Mantén ambas páginas en el mismo origen: protocolo, host y puerto.

**Primera ejecución:** tanto la pantalla como el panel cargan el catálogo inicial automáticamente. Si el almacenamiento está bloqueado, pueden utilizar ese catálogo en memoria; las selecciones no persistirán.

## Persistencia y sincronización

La fuente compartida es el documento **`menus/principal`** de Cloud Firestore en el proyecto `cocina-guerrero`. `firebase-sync.js` escucha los cambios del documento y actualiza la pantalla sin recargar. Los dispositivos necesitan internet para recibir las actualizaciones.

`localStorage`, con la clave `fonda_menu_state_v1`, conserva la última copia disponible para mostrar el menú durante una interrupción. La pantalla señala cuándo está reconectando. Si aún no se ha publicado un menú compartido, muestra el catálogo local y avisa que espera la publicación.

El panel requiere inicio de sesión con correo y contraseña de Firebase Authentication. Solo pueden publicar estos UID:

- Cuenta de pruebas: `cI41h5DZGURJgjNAkhBK5SEfLL33`.
- Cuenta del papá: `tNm9qnzrcicgyc4Oj6rmcdlAIE83`.
- Cuenta adicional: `uII1zdgYFjVldt9z6CmgOr6V8El2`.

Las tres cuentas tienen los mismos permisos. No se guardan contraseñas en el repositorio. La configuración web de Firebase y los UID no son secretos: las restricciones de escritura se aplican en `firestore.rules` en el servidor.

Los cambios del panel son borradores hasta confirmar **Guardar y aplicar**. Una transacción lee el menú compartido más reciente y aplica los campos editados, conservando los demás cambios. Si dos administradores editan el mismo campo, prevalece la última confirmación. Las actualizaciones recibidas mientras se edita no descartan el borrador. No se anuncia éxito hasta que Firebase confirma el guardado; sin conexión o permisos, los cambios permanecen pendientes.

La primera publicación crea el documento con el menú del panel que confirma el guardado. Las siguientes usan el documento compartido. La TV solo lee; nunca publica su catálogo local por iniciativa propia.

## Activar Firebase y publicar

1. Crear Firestore Standard, base `(default)`, en el proyecto `cocina-guerrero`.
2. Habilitar **Authentication → Método de acceso → Correo electrónico/contraseña** y crear las dos cuentas cuyos UID figuran arriba.
3. Publicar el sitio **y las reglas**, desde la carpeta del proyecto con Firebase CLI autenticado:

   ```powershell
   firebase deploy --only hosting,firestore:rules
   ```

4. Recargar `admin.html` e `index.html` en todos los dispositivos para cargar el nuevo código.
5. Entrar al panel con cualquiera de las dos cuentas. Revisar la selección y pulsar **Guardar cambios → Guardar y aplicar**. Si el documento está vacío, el botón permite publicar el menú inicial aunque no haya ediciones.
6. Comprobar que el panel indique **Conectado**. Abrir la pantalla en otro dispositivo, retirar un guisado y guardar: debe desaparecer sin recargar la TV.

No hace falta crear colecciones o documentos a mano. Si aparece un error de permisos, comprobar que se publicaron las reglas y que el UID de la cuenta coincide exactamente. Publicar solo Hosting no actualiza las reglas. Las reglas permiten leer únicamente el documento del menú y rechazan escritura anónima, cuentas distintas, listados y borrados.

Referencias: [escuchas en tiempo real](https://firebase.google.com/docs/firestore/query-data/listen), [transacciones](https://firebase.google.com/docs/firestore/manage-data/transactions), [inicio de sesión por contraseña](https://firebase.google.com/docs/auth/web/password-auth).

## Personalizar el menú

Edita `DEFAULT_STATE` en `menu-state.js` para cambiar el catálogo inicial:

- `name`: nombre visible.
- `active`: disponibilidad inicial.
- `price` y `takeoutPrice`: precios del guisado para comer aquí y para llevar.
- `sides`: descripción de acompañamientos.
- `img`: ruta de la fotografía.
- `variants` y `selectedVariant`: variantes disponibles y opción seleccionada.
- `color` o `sauceColor`: color de identificación o de la ilustración de respaldo.

Los datos del catálogo en `DEFAULT_STATE` se combinan con el menú guardado, conservando disponibilidad y variantes válidas. Los artículos nuevos se incorporan automáticamente. Para volver al catálogo predeterminado, elimina la clave `fonda_menu_state_v1` desde las herramientas de desarrollo del navegador, recarga el panel y realiza un cambio para guardarlo. Esta operación descarta la selección local existente.

## Tecnologías y publicación

- HTML5, CSS y JavaScript sin framework de aplicación.
- Tailwind CSS mediante CDN.
- Font Awesome 6.5.1 mediante CDN.
- Google Fonts: Bebas Neue para títulos, Montserrat para precios y Poppins para textos generales.
- Cloud Firestore para persistencia compartida, con `localStorage` como copia local.
- Firebase Authentication para las cuentas del panel.
- Firebase Hosting para alojamiento estático.

`firebase.json` publica la carpeta raíz y excluye la propia configuración, los archivos ocultos y `node_modules`. Incluye una regla que dirige las rutas sin archivo coincidente a `index.html`. Conviene revisar qué archivos contiene la raíz antes de publicar, porque los archivos no excluidos también pueden quedar accesibles.

## Limitaciones y detalles pendientes

- La sincronización entre dispositivos requiere Firestore, Authentication y las reglas publicados; Hosting por sí solo no la habilita.
- No se implementan pedidos, pagos, inventario por cantidades ni historial de ventas.
- Las dependencias visuales externas impiden considerar esta versión completamente autónoma sin conexión.
- La lectura recupera el catálogo inicial si el JSON está dañado o faltan las listas principales; la validación no comprueba cada campo del catálogo.
- Pantalla y panel escuchan cambios de almacenamiento entre pestañas del mismo origen; no hay sincronización entre dispositivos.

Este repositorio incluye el exhibidor de menú, el panel con confirmación de cambios y la conexión compartida para operar desde un celular y una pantalla independientes.

## Verificación del panel

Ejecuta `node tests/menu.test.cjs` y `node tests/cloud.test.cjs` para comprobar confirmación y descarte, persistencia de precios, actualización de la pantalla por eventos de almacenamiento, filtros, errores de guardado y combinación de cambios entre pestañas. Las pruebas del servicio simulan Firestore y dos cuentas autorizadas con almacenamiento separado, recepción en una pantalla sin sesión, bloqueo de cuentas distintas, falta de red y errores de permisos. No reemplazan una prueba contra Firebase real ni verifican el aspecto visual. Las reglas necesitan validarse al desplegarlas; no se ejecutó el emulador de reglas en este entorno.

Los scripts compartidos se cargan con una versión basada en su contenido para evitar mezclar archivos anteriores tras publicar. Cuando se modifique `menu-state.js` o `firebase-sync.js`, hay que actualizar su parámetro `?v=` en ambos HTML; `node tests/menu.test.cjs` comprueba que coincida con los primeros 12 caracteres del SHA-256 del archivo.

Prueba adicional: `node tests/display.test.cjs` comprueba la rotación de los fondos, la diapositiva de tres postres, disponibilidad, precios editados y el estado vacío. Se revisó la geometría del vapor y del precio en navegador a 1920×1080 y 3840×2160: sin intersección ni desbordamiento horizontal.

La presentación de guisados utiliza tarjetas crema, títulos con palabras de color según la salsa y entrada escalonada, fotografías grandes para entradas y aguas, ondas orgánicas de fondo y destellos animados. El precio tiene un pulso suave. Las animaciones respetan `prefers-reduced-motion`; no alteran los precios ni las selecciones guardadas.

Para agregar administradores, actualizar el UID tanto en `firebase-sync.js` como en `firestore.rules`, renovar la versión del script en ambos HTML y desplegar Hosting y reglas. `node tests/cloud.test.cjs` comprueba que las dos listas coincidan.

## Compatibilidad con televisores

Las pulgadas indican la diagonal física, no el tamaño del navegador en píxeles. Entre las medidas comerciales habituales hay 24, 27, 32, 40, 42, 43, 48, 49, 50, 55, 58, 60, 65, 70, 75, 77, 83, 85, 86, 98, 100 y 115 pulgadas; no es una lista universal de todos los fabricantes. El mismo tamaño puede ofrecer distintas resoluciones, y el navegador puede usar una resolución lógica menor que la del panel.

La pantalla `index.html` incluye su distribución esencial localmente y no carga el compilador Tailwind por CDN. Incluye tamaños alternativos para navegadores sin `clamp()`, `min()`, `aspect-ratio`, `inset`, altura `dvh` o separación `gap` de Flexbox. Fuentes e iconos todavía son recursos externos; el texto tiene fuente de respaldo. El admin mantiene su propia dependencia de Tailwind.

| Formato probado en navegador | Resoluciones del área de contenido |
| --- | --- |
| Horizontal pequeño | 640×360, 800×450, 960×480, 1024×576 |
| HD / área reducida por barras | 1280×720, 1366×640, 1366×768 |
| Full HD / panorámico | 1920×1080, 1920×540 |
| 4K | 3840×2160 |
| 4:3 | 1024×768 |
| Celular | 390×844, con desplazamiento vertical |

Las medidas de los elementos se revisaron en navegador: no hubo desbordamiento horizontal en esos tamaños. El intento de probar 7680×4320 quedó limitado por la herramienta a 4096×4096; por ello no se declara 8K como verificado. Las pruebas de tamaño no emulan el motor antiguo de cada marca ni sustituyen revisar la TV física.

Después de publicar, recargar la página en la TV. Si el navegador conserva una versión anterior, cerrar la pestaña y volver a abrirla. La distribución se adapta al área disponible, incluidas las barras del navegador. El modo de pantalla completa permite aprovechar más superficie, cuando el navegador lo ofrece.

Fuentes: [resolución de aplicaciones Samsung](https://developer.samsung.com/smarttv/develop/guides/fundamentals/managing-screen-resolution.html), [compatibilidad del navegador de TV Samsung](https://help.dsp.samsungads.com/website-rendering-on-samsung-tvs), [tamaños y familias de TV LG](https://www.lg.com/uk/buying-guides/tv-lineup-guide/lgsubscribe-buy/).

## Sincronización de televisores antiguos

`tv-sync.js` añade a la pantalla pública una lectura REST de `menus/principal` cada 10 segundos, independiente del SDK moderno de Firebase. Usa XMLHttpRequest y sintaxis ES5. No tiene funciones de escritura ni credenciales de administrador. Sigue sujeta a las reglas de lectura de Firestore.

Solo actualiza la pantalla si cambió el contenido y descarta una respuesta que quedó atrasada respecto de una actualización del SDK. Los errores conservan el último menú y espacian los reintentos hasta 60 segundos. Volver a la pestaña o recuperar internet dispara una consulta. El tiempo normal de actualización por esta vía es de unos 10 segundos más la respuesta de red; no es una conexión instantánea. No requiere recargar toda la página para cada cambio.

Se verificó que la lectura pública del documento publicado responde HTTP 200. `node tests/tv-sync.test.cjs` prueba el funcionamiento sin SDK, respuestas repetidas, errores de red, permisos, recuperación y respuestas atrasadas. Falta verificar esta vía en el televisor físico tras publicar Hosting y recargar su pestaña. Cada pantalla abierta realiza lecturas periódicas de Firestore.
