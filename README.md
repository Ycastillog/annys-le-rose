# Annys Le´ Rose

Universo de marca en desarrollo para Annys Le´ Rose: lencería, descanso, perfumes y brillo de labios reunidos alrededor de rituales íntimos y una feminidad elegida por cada mujer. La prioridad de esta etapa es afinar la identidad antes de incorporar productos reales. La web usa inglés como idioma principal, ofrece español completo y respeta la preferencia guardada del navegador.

## Dirección de marca

La expresión editorial de trabajo es **“Your own kind of feminine.”** / **“Tu propia forma de ser femenina.”**. La voz es íntima, segura, cálida y concreta. Un rojo cereza vivo sobre marfil, serif editorial, tipografía funcional y un gesto ALR consistente conectan la web, la futura aplicación y las piezas físicas. Se busca una experiencia premium accesible; el precio y las cualidades del producto se validarán con muestras y costes reales.

Los 16 conceptos actuales sirven para explorar esa dirección. La inclusión se trabaja desde lenguaje, representación y experiencia, sin prometer un rango de tallas, ajuste o fórmulas todavía no desarrollados. ALR Édition 05 propone una ceremonia anual de perfume y brillo durante cinco días; sus fechas siguen por anunciar.

`PROCESO.md` documenta territorio, voz, sistema visual, lectura de fuentes oficiales, briefs futuros y decisiones abiertas. El proceso avanza de diseño de identidad y líneas a muestras, validación, comercio y aplicación, con entregables y puntos de control concretos. La disponibilidad comercial del nombre, el símbolo y los nombres de producto todavía debe revisarse.

El estudio de identidad está en `dist/brand.html`, con estilos en `brand.css` y contenido bilingüe en `brand.js`. Comparte la preferencia de idioma con la página principal. Presenta símbolos, firmas, paleta, tipografías y una vista conceptual de aplicación; no existe una aplicación publicada ni funciones reales de app. Incluye referencias de las fuentes y sus licencias.

## Ejecutar localmente

Requiere Node.js. Desde la carpeta del proyecto:

```sh
node preview.cjs
```

Abrir http://127.0.0.1:4173 y http://127.0.0.1:4173/brand.html para el estudio. No se requiere instalar dependencias.

## Archivos

- `dist/index.html`: estructura de la tienda.
- `dist/styles.css`: diseño y estilos adaptables.
- `dist/brand.html`, `dist/brand.css`, `dist/brand.js`: estudio de identidad EN/ES con idioma compartido.
- `dist/catalog.js`: 16 conceptos de producto, precios de muestra, colores, tallas, contenidos y presentaciones.
- `dist/catalog-query.js`: búsqueda bilingüe y filtros combinados del catálogo.
- `dist/edition.js`: configuración y ventana anual de cinco días para ALR Édition 05.
- `dist/app.js`: búsqueda, filtros y demás interacciones de la tienda.
- `dist/i18n.js`: traducciones de español e inglés y preferencia de idioma.
- `dist/assets/`: fotografías conceptuales generadas con IA.
- `dist/assets/brand/`: siete SVG de identidad y `tokens.json`, referencia de paleta, tipografías y firma para web y futura app.
- `scripts/sync-english.cjs`: sincronización del contenido HTML inicial de la portada con el diccionario inglés.
- `scripts/verify-site.cjs`: comprobación de estructura, catálogo, traducciones, filtros y calendario anual.
- `scripts/verify-shopping.cjs`: regresiones de bolsa y herramientas WebMCP con reloj controlado.
- `PROCESO.md`: identidad, voz, sistema web/app, briefs de líneas, decisiones abiertas y proceso desde diseño a operación comercial.

El kit SVG contiene `symbol.svg` en rojo, `symbol-light.svg` en marfil, `symbol-mono.svg` en negro, `favicon.svg`, `app-icon.svg` conceptual y dos firmas delineadas: `wordmark-light.svg` roja para fondo claro y `wordmark-dark.svg` marfil para fondo rojo. Las letras de las firmas son contornos vectoriales derivados de Cormorant Garamond; las referencias de la fuente y su licencia figuran en el estudio. `tokens.json` es una referencia común que debe mantenerse coherente con los estilos; no constituye una aplicación implementada.

## Estado

La marca todavía no tiene un catálogo real. El catálogo reúne 16 conceptos: nueve prendas, dos perfumes de la colección regular, dos brillos de labios regulares y tres propuestas de ALR Édition 05 (perfume, brillo y coffret de ambos). Precios en USD, medidas, fórmulas y fotografías son ejemplos. Los filtros permiten explorar por colección, talla de ropa, color y precio de muestra. La bolsa, los favoritos y el interés en la edición anual usan almacenamiento local del navegador; no existen pagos, pedidos, cuentas o inventario reales. Guardar interés no envía correos ni notificaciones.

Los productos se editan en `dist/catalog.js`; sus nombres y descripciones se mantienen en `dist/i18n.js` para conservar ambos idiomas. Cada producto tiene un ID estable, categoría, precio, imagen, colores y variantes en `sizes`. Las prendas usan tallas; los perfumes y brillos usan `variantKind: 'volume'` con una única presentación de 50 ml o 6 ml; el coffret usa `variantKind: 'set'`. Los filtros por talla se aplican a ropa y muestran opciones propuestas, no disponibilidad de stock. Los tonos cosméticos, direcciones olfativas, fórmulas, concentraciones e ingredientes se deben validar con el proveedor, al igual que precios, tallaje y fotografías, antes de habilitar ventas.

## ALR Édition 05

La línea anual está formada por `edition-perfume`, `edition-gloss` y `edition-coffret`, marcados con `exclusive: true`. El coffret reúne el perfume de 50 ml y el brillo de 6 ml; no incluye prendas. Se puede explorar todo el año, pero la selección de muestras en bolsa debe quedar cerrada fuera de su ventana anual de cinco días. Las fechas están **por anunciar**; no se inventa una apertura ni se muestra una cuenta regresiva ficticia. Este prototipo no representa un lanzamiento comercial ni reserva existencias. Al activar ventas, el servidor deberá validar las fechas, la disponibilidad, los precios y las restricciones de la edición.

La fecha de apertura se configura en `dist/edition.js` con `startMonthDay` (`MM-DD`), actualmente `null`; `durationDays` es 5 y la zona horaria es `America/Santo_Domingo`. La ventana se repite en la misma fecha cada año durante cinco días de calendario, con inicio incluido y cierre excluido. Permite cruzar el fin de año; no admite el 29 de febrero como fecha anual. `window.ALRedition.getWindow()` devuelve el estado `pending`, `upcoming`, `open` o `closed`; `canSelect(product)` controla las selecciones exclusivas de la interfaz y de la herramienta WebMCP. La API sigue siendo una regla del prototipo en el navegador, no una validación comercial de servidor.

## Alojamiento independiente

El sitio público está contenido en `dist/` y puede alojarse en cualquier servicio que sirva archivos estáticos. No necesita ChatGPT para funcionar. Las tipografías se cargan desde Google Fonts con alternativas locales.

Sitio publicado: https://ycastillog.github.io/annys-le-rose/

La primera visita usa inglés. El idioma se puede cambiar desde la cabecera; conserva la selección de muestra y se recuerda en este navegador. Los importes siguen en USD; cambiar idioma no implica conversión de moneda. Las imágenes JPEG de la interfaz están optimizadas; las versiones PNG originales permanecen disponibles en la carpeta de activos.

Antes de habilitar ventas se deben conectar catálogo e inventario reales, pago validado en servidor, impuestos, envíos, administración de pedidos y políticas comerciales.

## Comprobación

Si cambia el texto de portada en `dist/i18n.js`, sincronizar el HTML inglés:

```sh
node scripts/sync-english.cjs
```

Ejecutar ese paso **antes** de calcular los hashes finales y actualizar los parámetros de caché `v` de los recursos modificados. Con los archivos finales, comprobar:

```sh
node --check dist/app.js
node --check dist/catalog.js
node --check dist/i18n.js
node --check dist/brand.js
node scripts/verify-site.cjs
node scripts/verify-shopping.cjs
```

Para actualizar GitHub Pages después de un commit y push de `main`, publicar el contenido de `dist` en la rama `gh-pages`:

```sh
git subtree split --prefix=dist main
git push origin <commit-devuelto>:gh-pages
```

GitHub Pages sirve la raíz de `gh-pages`. No publicar la raíz de `main`, que contiene documentación y utilidades de desarrollo.

La página principal y el estudio de identidad quedaron verificados a 320, 390, 768 y 1440 píxeles CSS, sin desbordamiento horizontal. Se conservó el zoom del navegador y se confirmaron las medidas reales de cada vista. En una primera visita a `localhost`, sin idioma guardado y con navegador en español, se abrió inglés; la preferencia española guardada en `127.0.0.1` se respetó. La elección ES/EN persistió al ir y volver entre estudio y portada.

La expansión de belleza también verificó fotografías con proporciones corregidas, búsqueda de `50 ml`, limpieza del filtro de talla al pasar a perfumes y selección automática del contenido único. La bolsa mantuvo el formato de 50 ml al traducirse, sin perder la selección. Perfume de $64 más brillo de $18 produjo un subtotal de muestra de $82 y una revisión traducida. Se verificaron favoritos, interés local y bloqueo de la edición anual y su coffret mientras las fechas están pendientes. Guardar interés no envía correos ni notificaciones.

`verify-site.cjs` valida estructura y activos de portada y estudio, los 16 conceptos, consultas del catálogo y 152 claves de traducción de la portada. La revisión del estudio cubrió 73 elementos localizados. También se comprueba el calendario anual, límites de apertura y cierre, cambio de horario estacional y cruce de fin de año. `verify-shopping.cjs` pasa 10 regresiones con la aplicación y herramientas WebMCP reales en una VM, DOM mínimo y reloj controlado: formatos en ml y set, tallas inválidas, edición pendiente, persistencia, cierre exacto, purga antes del subtotal, cantidades con índices desplazados, revisión e idioma. Diseño, foco nativo y renderizado se revisan en navegador.

CSS y JavaScript llevan una versión de caché en el HTML; al modificarlos se debe renovar su parámetro `v`.
