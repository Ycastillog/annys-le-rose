# Annys Le´ Rose

Universo de marca en desarrollo para Annys Le´ Rose: lencería, descanso, perfumes y brillo de labios reunidos alrededor de rituales íntimos y una feminidad elegida por cada mujer. La prioridad de esta etapa es afinar la identidad antes de incorporar productos reales. La web usa inglés como idioma principal, ofrece español completo y respeta la preferencia guardada del navegador.

## Dirección de marca

El lema de identidad es **“Your own kind of feminine.”** / **“Tu propia forma de ser femenina.”**. La voz es íntima, segura, cálida y concreta. Un rojo cereza vivo sobre marfil, serif editorial, tipografía funcional y un gesto ALR consistente conectan la web, la futura aplicación y las piezas físicas. Se busca una experiencia premium accesible; el precio y las cualidades del producto se validarán con muestras y costes reales.

Los 16 conceptos actuales sirven para explorar esa dirección. La inclusión se trabaja desde lenguaje, representación y experiencia, sin prometer un rango de tallas, ajuste o fórmulas todavía no desarrollados. ALR Édition 05 propone una ceremonia anual de perfume y brillo durante cinco días; sus fechas siguen por anunciar.

`PROCESO.md` documenta territorio, voz, sistema visual, lectura de fuentes oficiales, briefs futuros y decisiones abiertas. El proceso avanza de diseño de identidad y líneas a muestras, validación, comercio y aplicación, con entregables y puntos de control concretos. La disponibilidad comercial del nombre, el símbolo y los nombres de producto todavía debe revisarse.

El estudio de identidad está en `dist/brand.html`, con estilos en `brand.css` y contenido bilingüe en `brand.js`. Comparte la preferencia de idioma con la página principal. Presenta símbolos, firmas, paleta, tipografías y una vista conceptual de aplicación; no existe una aplicación publicada ni funciones reales de app. Incluye referencias de las fuentes y sus licencias.

## Portada y navegación

La campaña de portada presenta **“Softness. With character.”** / **“Suavidad. Con carácter.”**. Es un titular de campaña distinto del lema de identidad, que se conserva. El texto breve conecta encaje, perfume y brillo; «Find your ritual» / «Encuentra tu ritual» lleva a los tres universos, y «Explore the concepts» / «Explora los conceptos» abre el catálogo conceptual.

`dist/assets/campaign-hero.jpg` es una imagen original generada con image_gen integrado: 1536 × 1024 píxeles y 174413 bytes. Representa dos mujeres adultas de distintas complexiones con pijamas rojo cereza y marfil. Ilustra una campaña conceptual; no es una fotografía de mercancía disponible. En escritorio acompaña el texto desde la derecha; en móvil se presenta arriba.

Tres universos —Intimates, Fragrance y Lip gloss— preceden al catálogo; el relato de identidad aparece después. La cabecera ofrece seis accesos: Intimates, Fragrance, Lip gloss, Édition 05, Our world y Brand studio, traducidos al elegir español. La categoría agregada `intimates` reúne los nueve conceptos de ropa y conserva las categorías e IDs de cada prenda. Los accesos de descubrimiento con `data-discover` limpian búsqueda y filtros para explorar una familia desde el inicio; las pestañas del catálogo conservan los filtros elegidos.

La dirección de portada toma observaciones cualitativas de fuentes oficiales: fotografía protagonista, mensaje breve, llamada a la acción y acceso posterior a categorías en [SKIMS](https://skims.com/en-do) y [Agent Provocateur](https://www.agentprovocateur.com/int_en/); titulares sensoriales breves en [Rhode](https://www.rhodeskin.com/). Son referencias de jerarquía y lenguaje, no un ranking ni una evaluación de conversión. La composición, fotografía y textos de ALR son propios.

## Ejecutar localmente

Requiere Node.js. Desde la carpeta del proyecto:

```sh
node preview.cjs
```

Abrir http://127.0.0.1:4173 y http://127.0.0.1:4173/brand.html para el estudio. No se requiere instalar dependencias.

## Archivos

- `dist/index.html`: estructura de la tienda.
- `dist/styles.css`: diseño y estilos adaptables.
- `dist/fonts.css`, `dist/assets/fonts/`: fuentes WOFF2 locales, procedencia y licencias OFL.
- `dist/brand.html`, `dist/brand.css`, `dist/brand.js`: estudio de identidad EN/ES con idioma compartido.
- `dist/catalog.js`: 16 conceptos de producto, precios de muestra, colores, tallas, contenidos y presentaciones.
- `dist/catalog-query.js`: búsqueda bilingüe indexada, filtros combinados y vistas de catálogo en URL.
- `dist/edition.js`: configuración y ventana anual de cinco días para ALR Édition 05.
- `dist/app.js`: búsqueda, filtros y demás interacciones de la tienda.
- `dist/i18n.js`: traducciones de español e inglés y preferencia de idioma.
- `dist/assets/`: fotografías conceptuales generadas con IA.
- `dist/assets/campaign-hero.jpg`: fotografía original de campaña para la portada.
- `dist/assets/brand/`: siete SVG de identidad y `tokens.json`, referencia de paleta, tipografías y firma para web y futura app.
- `scripts/sync-english.cjs`: sincronización del HTML inicial de portada y estudio con su contenido inglés.
- `scripts/verify-site.cjs`: comprobación de estructura, catálogo, traducciones, filtros y calendario anual.
- `scripts/verify-shopping.cjs`: regresiones de bolsa y herramientas WebMCP con reloj controlado.
- `PROCESO.md`: identidad, voz, sistema web/app, briefs de líneas, decisiones abiertas y proceso desde diseño a operación comercial.

El kit SVG contiene `symbol.svg` en rojo, `symbol-light.svg` en marfil, `symbol-mono.svg` en negro, `favicon.svg`, `app-icon.svg` conceptual y dos firmas delineadas: `wordmark-light.svg` roja para fondo claro y `wordmark-dark.svg` marfil para fondo rojo. Las letras de las firmas son contornos vectoriales derivados de Cormorant Garamond; las referencias de la fuente y su licencia figuran en el estudio. `tokens.json` es una referencia común que debe mantenerse coherente con los estilos; no constituye una aplicación implementada.

## Estado

La marca todavía no tiene un catálogo real. El catálogo reúne 16 conceptos: nueve prendas, dos perfumes de la colección regular, dos brillos de labios regulares y tres propuestas de ALR Édition 05 (perfume, brillo y coffret de ambos). Precios en USD, medidas, fórmulas y fotografías son ejemplos. Los filtros permiten explorar por colección, talla de ropa, color y precio de muestra. La bolsa, los favoritos y el interés en la edición anual usan almacenamiento local del navegador; no existen pagos, pedidos, cuentas o inventario reales. Guardar interés no envía correos ni notificaciones.

Los productos se editan en `dist/catalog.js`; sus nombres y descripciones se mantienen en `dist/i18n.js` para conservar ambos idiomas. Cada producto tiene un ID estable, categoría, precio, imagen, colores y variantes en `sizes`. Las prendas usan tallas; los perfumes y brillos usan `variantKind: 'volume'` con una única presentación de 50 ml o 6 ml; el coffret usa `variantKind: 'set'`. Los filtros por talla se aplican a ropa y muestran opciones propuestas, no disponibilidad de stock. Los tonos cosméticos, direcciones olfativas, fórmulas, concentraciones e ingredientes se deben validar con el proveedor, al igual que precios, tallaje y fotografías, antes de habilitar ventas.

Las vistas del catálogo conservan categoría, búsqueda, talla, color, rango de precio y orden en la URL. «Copy view link» / «Copiar enlace de vista» copia esa exploración y permite abrirla en otro navegador. Recargar y usar Atrás/Adelante recupera los controles. Solo los cambios de categoría añaden una entrada al historial; escribir, filtrar y ordenar actualiza la vista actual. El enlace excluye bolsa, favoritos e idioma. Los favoritos permanecen locales y su vista no se comparte. Si el navegador impide copiar, la interfaz indica que se puede copiar el enlace desde la barra de direcciones.

La búsqueda utiliza un índice de texto en ambos idiomas. Enter lleva al resultado y cierra la búsqueda de cabecera; Escape limpia la búsqueda del catálogo. Elegir una talla en los filtros la propone en el detalle si es válida para esa prenda; una variante previamente elegida en la bolsa tiene prioridad. La edición anual conserva sus restricciones.

## ALR Édition 05

La línea anual está formada por `edition-perfume`, `edition-gloss` y `edition-coffret`, marcados con `exclusive: true`. El coffret reúne el perfume de 50 ml y el brillo de 6 ml; no incluye prendas. Se puede explorar todo el año, pero la selección de muestras en bolsa debe quedar cerrada fuera de su ventana anual de cinco días. Las fechas están **por anunciar**; no se inventa una apertura ni se muestra una cuenta regresiva ficticia. Este prototipo no representa un lanzamiento comercial ni reserva existencias. Al activar ventas, el servidor deberá validar las fechas, la disponibilidad, los precios y las restricciones de la edición.

La fecha de apertura se configura en `dist/edition.js` con `startMonthDay` (`MM-DD`), actualmente `null`; `durationDays` es 5 y la zona horaria es `America/Santo_Domingo`. La ventana se repite en la misma fecha cada año durante cinco días de calendario, con inicio incluido y cierre excluido. Permite cruzar el fin de año; no admite el 29 de febrero como fecha anual. `window.ALRedition.getWindow()` devuelve el estado `pending`, `upcoming`, `open` o `closed`; `canSelect(product)` controla las selecciones exclusivas de la interfaz y de la herramienta WebMCP. La API sigue siendo una regla del prototipo en el navegador, no una validación comercial de servidor.

## Alojamiento independiente

El sitio público está contenido en `dist/` y puede alojarse en cualquier servicio que sirva archivos estáticos. No necesita ChatGPT para funcionar. Las tipografías se sirven desde este repositorio: tres archivos WOFF2 de aproximadamente 102 KB en total, con alternativas del sistema, `font-display: swap` y precarga de las fuentes principales. Se eliminó la importación remota de Google Fonts. La procedencia y las licencias se incluyen en `dist/assets/fonts/`. La estrategia sigue las referencias de [MDN sobre fuentes y rendimiento](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/Best_practices).

Sitio publicado: https://ycastillog.github.io/annys-le-rose/

La primera visita usa inglés. El idioma se puede cambiar desde la cabecera; conserva la selección de muestra y se recuerda en este navegador. Los importes siguen en USD; cambiar idioma no implica conversión de moneda. Las imágenes JPEG de la interfaz están optimizadas; las versiones PNG originales permanecen disponibles en la carpeta de activos.

Antes de habilitar ventas se deben conectar catálogo e inventario reales, pago validado en servidor, impuestos, envíos, administración de pedidos y políticas comerciales.

## Comprobación

Si cambia el texto en `dist/i18n.js` o `dist/brand.js`, sincronizar ambos HTML en inglés:

```sh
node scripts/sync-english.cjs
```

Se puede limitar la sincronización con `--home` o `--studio`. Los textos, atributos accesibles y metadatos iniciales quedan alineados con el contenido que renderiza JavaScript.

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

`verify-site.cjs` valida estructura y activos de portada y estudio, fuentes WOFF2, los 16 conceptos, consultas del catálogo y 153 claves de traducción de la portada. La revisión del estudio cubrió 76 campos localizados. También se comprueba el calendario anual, límites de apertura y cierre, cambio de horario estacional y cruce de fin de año. `verify-shopping.cjs` pasa 32 regresiones con la aplicación y herramientas WebMCP reales en una VM, DOM mínimo y reloj controlado. Incluye bolsa y ventana anual, URL válidas e inválidas, recarga, historial, copia y su alternativa, favoritos locales, selección recuperada, búsqueda bilingüe, composición de texto, teclado, movimiento reducido y recorridos de descubrimiento. Diseño, foco nativo y renderizado se revisan en navegador.

La nueva portada se comprobó en navegador a 320 × 780 y 768 × 1024 en español, y a 390 × 844 y 1440 × 1000 en inglés: sin desbordamiento horizontal, con imagen, titular y llamadas a la acción legibles. La acción principal llegó a los tres universos. Intimates mostró nueve conceptos y mantuvo la categoría al recargar la URL. Desde `intimates?q=ivory&sort=high`, con un resultado, Fragrance en el menú móvil limpió búsqueda y orden y mostró tres conceptos; Atrás restauró `ivory`, el orden descendente y el único resultado. El descubrimiento devolvió el foco al contador de resultados.

Las revisiones anteriores de portada y estudio cubrieron 320, 390, 768 y 1440 píxeles CSS, idioma inicial inglés y preferencia ES/EN compartida. También verificaron formatos de belleza conservados al traducir, subtotal de muestra de $82 para perfume y brillo, talla filtrada propuesta en el detalle, compartir deshabilitado en favoritos y bloqueo del coffret anual con fechas pendientes. No se habilitaron cobros ni avisos por correo.

CSS y JavaScript llevan una versión de caché en el HTML; al modificarlos se debe renovar su parámetro `v`.
