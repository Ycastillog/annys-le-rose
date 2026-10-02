# Annys Le´ Rose

Tienda conceptual de lencería, ropa íntima, perfumes y brillo de labios con identidad en rojo cereza, interfaz en español e inglés, diseño adaptable a móvil y escritorio, catálogo, búsqueda, favoritos, selección de variantes y bolsa. ALR Édition 05 propone un ritual exclusivo de perfume y brillo que se abre una vez al año durante cinco días.

## Ejecutar localmente

Requiere Node.js. Desde la carpeta del proyecto:

```sh
node preview.cjs
```

Abrir http://127.0.0.1:4173. No se requiere instalar dependencias.

## Archivos

- `dist/index.html`: estructura de la tienda.
- `dist/styles.css`: diseño y estilos adaptables.
- `dist/catalog.js`: 16 conceptos de producto, precios de muestra, colores, tallas, contenidos y presentaciones.
- `dist/catalog-query.js`: búsqueda bilingüe y filtros combinados del catálogo.
- `dist/edition.js`: configuración y ventana anual de cinco días para ALR Édition 05.
- `dist/app.js`: búsqueda, filtros y demás interacciones de la tienda.
- `dist/i18n.js`: traducciones de español e inglés y preferencia de idioma.
- `dist/assets/`: fotografías conceptuales generadas con IA.
- `scripts/verify-site.cjs`: comprobación de estructura, catálogo, traducciones, filtros y calendario anual.
- `scripts/verify-shopping.cjs`: regresiones de bolsa y herramientas WebMCP con reloj controlado.
- `PROCESO.md`: proceso de lanzamiento comercial y futura aplicación.

## Estado

La marca todavía no tiene un catálogo real. El catálogo reúne 16 conceptos: nueve prendas, dos perfumes de la colección regular, dos brillos de labios regulares y tres propuestas de ALR Édition 05 (perfume, brillo y coffret de ambos). Precios en USD, medidas, fórmulas y fotografías son ejemplos. Los filtros permiten explorar por colección, talla de ropa, color y precio de muestra. La bolsa, los favoritos y el interés en la edición anual usan almacenamiento local del navegador; no existen pagos, pedidos, cuentas o inventario reales. Guardar interés no envía correos ni notificaciones.

Los productos se editan en `dist/catalog.js`; sus nombres y descripciones se mantienen en `dist/i18n.js` para conservar ambos idiomas. Cada producto tiene un ID estable, categoría, precio, imagen, colores y variantes en `sizes`. Las prendas usan tallas; los perfumes y brillos usan `variantKind: 'volume'` con una única presentación de 50 ml o 6 ml; el coffret usa `variantKind: 'set'`. Los filtros por talla se aplican a ropa y muestran opciones propuestas, no disponibilidad de stock. Los tonos cosméticos, direcciones olfativas, fórmulas, concentraciones e ingredientes se deben validar con el proveedor, al igual que precios, tallaje y fotografías, antes de habilitar ventas.

## ALR Édition 05

La línea anual está formada por `edition-perfume`, `edition-gloss` y `edition-coffret`, marcados con `exclusive: true`. El coffret reúne el perfume de 50 ml y el brillo de 6 ml; no incluye prendas. Se puede explorar todo el año, pero la selección de muestras en bolsa debe quedar cerrada fuera de su ventana anual de cinco días. Las fechas están **por anunciar**; no se inventa una apertura ni se muestra una cuenta regresiva ficticia. Este prototipo no representa un lanzamiento comercial ni reserva existencias. Al activar ventas, el servidor deberá validar las fechas, la disponibilidad, los precios y las restricciones de la edición.

La fecha de apertura se configura en `dist/edition.js` con `startMonthDay` (`MM-DD`), actualmente `null`; `durationDays` es 5 y la zona horaria es `America/Santo_Domingo`. La ventana se repite en la misma fecha cada año durante cinco días de calendario, con inicio incluido y cierre excluido. Permite cruzar el fin de año; no admite el 29 de febrero como fecha anual. `window.ALRedition.getWindow()` devuelve el estado `pending`, `upcoming`, `open` o `closed`; `canSelect(product)` controla las selecciones exclusivas de la interfaz y de la herramienta WebMCP. La API sigue siendo una regla del prototipo en el navegador, no una validación comercial de servidor.

## Alojamiento independiente

El sitio público está contenido en `dist/` y puede alojarse en cualquier servicio que sirva archivos estáticos. No necesita ChatGPT para funcionar. Las tipografías se cargan desde Google Fonts con alternativas locales.

Sitio publicado: https://ycastillog.github.io/annys-le-rose/

El idioma se puede cambiar desde la cabecera, conserva la selección de compra y se recuerda en este navegador. Los importes siguen en USD; cambiar idioma no implica conversión de moneda. Las imágenes JPEG de la interfaz están optimizadas; las versiones PNG originales permanecen disponibles en la carpeta de activos.

Antes de habilitar ventas se deben conectar catálogo e inventario reales, pago validado en servidor, impuestos, envíos, administración de pedidos y políticas comerciales.

## Comprobación

```sh
node --check dist/app.js
node --check dist/catalog.js
node --check dist/i18n.js
node scripts/verify-site.cjs
node scripts/verify-shopping.cjs
```

Para actualizar GitHub Pages después de un commit y push de `main`, publicar el contenido de `dist` en la rama `gh-pages`:

```sh
git subtree split --prefix=dist main
git push origin <commit-devuelto>:gh-pages
```

GitHub Pages sirve la raíz de `gh-pages`. No publicar la raíz de `main`, que contiene documentación y utilidades de desarrollo.

La expansión de belleza está verificada en navegador a 320, 390, 768 y 1440 px, sin desbordamiento horizontal. Se revisaron español e inglés, fotografías con proporciones corregidas, búsqueda de `50 ml` y limpieza del filtro de talla al pasar de ropa a perfumes. Los productos de belleza seleccionan automáticamente su contenido único; no presentan la guía de tallas de ropa.

La selección de perfume de $64 más brillo de $18 produjo un subtotal de muestra de $82 y una revisión traducida al cambiar de idioma. Se verificaron favoritos, interés local guardado y el bloqueo de la edición anual y su coffret mientras las fechas están pendientes. Guardar interés no envía correos ni notificaciones.

`verify-site.cjs` valida los 16 conceptos, activos, consultas del catálogo y 140 claves estáticas en ambos idiomas, además del calendario anual, límites de apertura y cierre, cambio de horario estacional y cruce de fin de año. `verify-shopping.cjs` ejecuta 10 regresiones con la aplicación y herramientas WebMCP reales en una VM, DOM mínimo y reloj controlado: formatos en ml y set, tallas inválidas, edición pendiente, persistencia, cierre exacto, purga antes del subtotal, cantidades con índices desplazados, revisión e idioma. El diseño, foco nativo y renderizado se comprueban en navegador.

CSS y JavaScript llevan una versión de caché en el HTML; al modificarlos se debe renovar su parámetro `v`.
