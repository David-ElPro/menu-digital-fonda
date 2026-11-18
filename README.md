# Menú digital para fonda

Aplicación web en español para mostrar el menú del día de una fonda en una pantalla o televisor. Incluye un panel de administración para activar o retirar guisados, elegir sus variantes y seleccionar las sopas, aguas y postres disponibles.

El objetivo es mantener visible la oferta de comida corrida y retirar rápidamente los platillos que se terminan durante el servicio.

## Componentes

| Archivo o carpeta | Función |
| --- | --- |
| `index.html` | Pantalla pública con carrusel de guisados, precios, acompañamientos, entradas, aguas y postres. |
| `admin.html` | Panel de control con diseño adaptable a celular para administrar la disponibilidad del menú. |
| `img/` | Fotografías de alimentos utilizadas o disponibles para el catálogo. |
| `firebase.json` | Configuración para publicar los archivos estáticos con Firebase Hosting. |
| `.firebaserc` | Asociación del proyecto local con Firebase. |

La lógica JavaScript y los estilos propios están dentro de los archivos HTML. No hay un proceso de compilación, un servidor de aplicación ni un archivo `package.json`.

## Pantalla del menú

- Muestra un guisado activo a la vez y cambia automáticamente cada **7 segundos**.
- Mantiene el plato a la izquierda y agrupa el título, las entradas y las aguas a la derecha en pantallas horizontales.
- Presenta precio para comer en el local y precio para llevar.
- Muestra la variante seleccionada, los acompañamientos y las opciones activas de sopa y agua.
- Mantiene una barra inferior de postres y extras con sus precios.
- Incluye fondos animados, transiciones y un efecto visual de vapor.
- Intenta utilizar una ilustración SVG de respaldo cuando una fotografía no carga.
- Si existe un menú guardado pero no hay guisados activos, muestra un mensaje de espera.

El diseño de exhibición está orientado a una pantalla horizontal y utiliza todo el espacio del navegador.

## Panel de control

- Activar y desactivar guisados.
- Retirar guisados desde una lista rápida de los que están en pantalla.
- Buscar por nombre y filtrar por categoría.
- Elegir variantes de los guisados que las tienen configuradas.
- Seleccionar hasta **3 sopas** y hasta **2 aguas** activas. El código permite dejar ambas listas sin opciones activas.
- Activar y desactivar postres y extras.
- Abrir la pantalla de exhibición mediante el botón **Ver TV**.

El panel no ofrece formularios para crear platillos, subir fotografías o editar precios. Esos cambios se realizan en el código.

## Catálogo inicial

El catálogo se define en `DEFAULT_STATE`, dentro de `admin.html`:

- **8 guisados:** puerco en salsa verde, morita, cacahuate, adobo, jitomate y árbol; filete de pescado empanizado; arrachera asada.
- **4 entradas:** sopa de pasta, arroz rojo, sopa de habas y lentejas.
- **5 aguas:** jamaica, naranja, guayaba, tamarindo y limón.
- **4 postres y extras:** plátanos fritos con lechera, gelatina, flan de leche y papas a la francesa.

Inicialmente están activos los primeros cuatro guisados, sopa de pasta, arroz rojo, jamaica, naranja y los cuatro postres o extras. El puerco en salsa verde inicia con la variante **Con Nopales**.

Los guisados de puerco tienen precios iniciales de **$95 para comer aquí** y **$100 para llevar**; el pescado, **$100** en ambas modalidades; la arrachera, **$150** en ambas. La moneda no se identifica explícitamente en el código.

El filtro también incluye Res, Pollo, Antojitos y Caldos, aunque el catálogo inicial no contiene guisados en esas categorías. La carpeta de imágenes incluye fotografías adicionales que todavía no están incorporadas al catálogo.

## Cómo ejecutarlo localmente

Se necesita un navegador moderno con JavaScript y almacenamiento local habilitados. Para cargar las dependencias externas se requiere conexión a internet.

1. Abre una terminal en la carpeta del proyecto.
2. Si tienes Python instalado, inicia un servidor estático:

   ```powershell
   python -m http.server 8000
   ```

3. Abre el panel en `http://localhost:8000/admin.html`.
4. Haz un cambio, por ejemplo desactiva y vuelve a activar un postre. Esto guarda el estado inicial.
5. Pulsa **Ver TV** para abrir `http://localhost:8000/index.html` en otra pestaña del mismo navegador y perfil.
6. Coloca esa pestaña en la pantalla de exhibición y activa la pantalla completa del navegador si lo deseas.

Puedes utilizar otro servidor de archivos estáticos. Mantén ambas páginas en el mismo origen: protocolo, host y puerto.

**Detalle de la primera ejecución:** el panel carga el catálogo predeterminado en memoria, pero solo lo escribe en el almacenamiento al hacer un cambio. Si se abre primero `index.html` sin datos guardados, el área central queda sin contenido de guisados.

## Persistencia y sincronización

El menú se guarda como JSON en `localStorage` con la clave:

```text
fonda_menu_state_v1
```

El estado contiene cuatro listas: `dishes`, `soups`, `waters` y `desserts`. Cada elemento tiene una propiedad `active`; los guisados también incluyen categoría, precios, acompañamientos, imagen y variantes.

Cuando se modifica el panel, `saveState()` escribe el estado completo. La pantalla escucha el evento `storage` y vuelve a dibujar el menú al recibir cambios desde otra pestaña.

**La sincronización actual funciona entre pestañas del mismo origen, navegador y perfil.** Abrir el panel en un celular y el menú en un televisor u otra computadora no sincroniza sus datos, aunque ambos visiten el mismo sitio. El texto del panel que indica sincronización no implica una conexión entre dispositivos.

Firebase se utiliza como alojamiento estático; el código no integra Firestore, Realtime Database ni autenticación. Borrar los datos del sitio elimina el menú guardado. Un cambio de dominio o puerto utiliza otro almacenamiento.

## Personalizar el menú

Edita `DEFAULT_STATE` en `admin.html` para cambiar el catálogo inicial:

- `name`: nombre visible.
- `active`: disponibilidad inicial.
- `price` y `takeoutPrice`: precios del guisado para comer aquí y para llevar.
- `sides`: descripción de acompañamientos.
- `img`: ruta de la fotografía.
- `variants` y `selectedVariant`: variantes disponibles y opción seleccionada.
- `color` o `sauceColor`: color de identificación o de la ilustración de respaldo.

Los cambios en `DEFAULT_STATE` no reemplazan un menú que ya esté guardado en ese navegador. Para volver al catálogo predeterminado, elimina la clave `fonda_menu_state_v1` desde las herramientas de desarrollo del navegador, recarga el panel y realiza un cambio para guardarlo. Esta operación descarta la selección local existente.

## Tecnologías y publicación

- HTML5, CSS y JavaScript sin framework de aplicación.
- Tailwind CSS mediante CDN.
- Font Awesome 6.5.1 mediante CDN.
- Google Fonts: Bebas Neue para títulos, Montserrat para precios y Poppins para textos generales.
- `localStorage` para persistencia local.
- Firebase Hosting para alojamiento estático.

`firebase.json` publica la carpeta raíz y excluye la propia configuración, los archivos ocultos y `node_modules`. Incluye una regla que dirige las rutas sin archivo coincidente a `index.html`. Conviene revisar qué archivos contiene la raíz antes de publicar, porque los archivos no excluidos también pueden quedar accesibles.

## Limitaciones y detalles pendientes

- No hay sincronización entre dispositivos, acceso con contraseña ni administración remota compartida.
- No se implementan pedidos, pagos, inventario por cantidades ni historial de ventas.
- Las dependencias visuales externas impiden considerar esta versión completamente autónoma sin conexión.
- Las variantes de puerco en salsa verde apuntan a archivos `.jpg`, pero las fotografías correspondientes en `img/` tienen extensión `.png`.
- Las fotografías `img/filetepescado.jpg` e `img/arrachera.jpg`, referenciadas en el catálogo, no están en el proyecto.
- La lectura del estado no maneja JSON dañado ni valida su estructura.
- El panel no escucha cambios de otras pestañas de administración; trabajar con varios paneles abiertos puede sobrescribir selecciones.

Este repositorio corresponde a un exhibidor de menú con control local de disponibilidad. Para operar desde un celular independiente de la pantalla se necesita añadir persistencia y sincronización compartidas.
