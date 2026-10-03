# Annys Le´ Rose

Universo de marca en desarrollo para Annys Le´ Rose: lencería, descanso, perfumes y brillo de labios reunidos alrededor de rituales íntimos y una feminidad elegida por cada mujer. La prioridad de esta etapa es afinar la identidad antes de incorporar productos reales. La web usa inglés como idioma principal, ofrece español completo y respeta la preferencia guardada del navegador.

## Dirección de marca

El lema de identidad es **“Your own kind of feminine.”** / **“Tu propia forma de ser femenina.”**. La voz es íntima, segura, cálida y concreta. Un rojo cereza vivo sobre marfil, serif editorial, tipografía funcional y un gesto ALR consistente conectan la web, la futura aplicación y las piezas físicas. Se busca una experiencia premium accesible; el precio y las cualidades del producto se validarán con muestras y costes reales.

Los 16 conceptos actuales sirven para explorar esa dirección. La inclusión se trabaja desde lenguaje, representación y experiencia, sin prometer un rango de tallas, ajuste o fórmulas todavía no desarrollados. ALR Édition 05 propone una ceremonia anual de perfume y brillo durante cinco días; sus fechas siguen por anunciar.

`PROCESO.md` documenta territorio, voz, sistema visual, lectura de fuentes oficiales, briefs futuros y decisiones abiertas. El proceso avanza de diseño de identidad y líneas a muestras, validación, comercio y aplicación, con entregables y puntos de control concretos. La disponibilidad comercial del nombre, el símbolo y los nombres de producto todavía debe revisarse.

El estudio de identidad está en `dist/brand.html`, con estilos en `brand.css` y contenido bilingüe en `brand.js`. Comparte la preferencia de idioma con la portada y el catálogo y se puede abrir desde sus pies de página. Presenta símbolos, firmas, paleta, tipografías y una vista conceptual de aplicación; no existe una aplicación publicada ni funciones reales de app. Incluye referencias de las fuentes y sus licencias.

## Portada y navegación

La campaña de portada presenta **“Softness. With character.”** / **“Suavidad. Con carácter.”**. Es un titular de campaña distinto del lema de identidad, que se conserva. El texto breve conecta encaje, perfume y brillo; «Find your ritual» / «Encuentra tu ritual» lleva a los tres universos, y «Explore the concepts» / «Explora los conceptos» abre el catálogo conceptual.

`dist/assets/campaign-hero.jpg` es una imagen original generada con image_gen integrado: 1536 × 1024 píxeles y 174413 bytes. Representa dos mujeres adultas de distintas complexiones con pijamas rojo cereza y marfil. Ilustra una campaña conceptual; no es una fotografía de mercancía disponible. En escritorio acompaña el texto desde la derecha; en móvil se presenta arriba.

La portada `dist/index.html` presenta la campaña, los tres universos —Intimates, Fragrance y Lip gloss—, seis conceptos destacados, Édition 05 y una única historia de marca. Los destacados introducen las familias sin desplegar los 16 conceptos en la página principal. El relato reúne identidad, rituales y esencia; el estudio sigue accesible desde el pie de página.

El catálogo completo está en `dist/catalog.html`. Presenta los 16 conceptos con búsqueda, filtros, títulos y descripciones correspondientes a la categoría elegida. Las subcategorías Lingerie, Essentials y Sleep & lounge aparecen en el contexto de ropa; perfumes y brillos mantienen sus propios criterios. La categoría agregada `intimates` reúne los nueve conceptos de ropa y conserva las categorías e IDs de cada prenda.

La cabecera ofrece seis accesos: Intimates, Fragrance, Lip gloss, Édition 05, Our world y The concepts, traducidos al elegir español. Los accesos de descubrimiento con `data-discover` llevan al catálogo y limpian búsqueda y filtros para explorar una familia desde el inicio; las pestañas dentro del catálogo conservan los filtros elegidos. Portada, catálogo y estudio comparten la preferencia EN/ES; al restaurar una página con Atrás/Adelante, su contenido debe reconciliarse con la elección vigente.

Cada concepto de producto tiene ahora una fotografía distinta. Las tres prendas individuales usan imágenes originales generadas con image_gen integrado, en lugar de repetir la fotografía del conjunto. Son ilustraciones conceptuales, no fotos de mercancía disponible:

| Archivo en `dist/assets/` | Concepto | Dimensiones | Tamaño |
| --- | --- | --- | --- |
| `rose-bra-single.jpg` | Sujetador Rose | 1122 × 1402 px | 228839 bytes |
| `noir-brief-single.jpg` | Braga Noir | 1122 × 1402 px | 244162 bytes |
| `lune-top-single.jpg` | Camisola Lune | 1122 × 1402 px | 159190 bytes |

La dirección de portada toma observaciones cualitativas de fuentes oficiales: fotografía protagonista, mensaje breve, llamada a la acción y acceso posterior a categorías en [SKIMS](https://skims.com/en-do) y [Agent Provocateur](https://www.agentprovocateur.com/int_en/); titulares sensoriales breves en [Rhode](https://www.rhodeskin.com/). Son referencias de jerarquía y lenguaje, no un ranking ni una evaluación de conversión. La composición, fotografía y textos de ALR son propios.

## Ejecutar localmente

Requiere Node.js. Desde la carpeta del proyecto:

```sh
node preview.cjs
```

Abrir http://127.0.0.1:4173 para la portada, http://127.0.0.1:4173/catalog.html para el catálogo completo y http://127.0.0.1:4173/brand.html para el estudio. No se requiere instalar dependencias.

## Archivos

- `dist/index.html`: portada con campaña, tres universos, seis destacados, edición anual y una historia de marca.
- `dist/catalog.html`: catálogo completo de 16 conceptos y controles de exploración contextual.
- `dist/styles.css`: diseño y estilos adaptables.
- `dist/fonts.css`, `dist/assets/fonts/`: fuentes WOFF2 locales, procedencia y licencias OFL.
- `dist/brand.html`, `dist/brand.css`, `dist/brand.js`: estudio de identidad EN/ES con idioma compartido.
- `dist/catalog.js`: 16 conceptos de producto, precios de muestra, colores, tallas, contenidos y presentaciones.
- `dist/catalog-query.js`: búsqueda bilingüe indexada, filtros combinados y vistas de catálogo en URL.
- `dist/edition.js`: configuración y ventana anual de cinco días para ALR Édition 05.
- `dist/app.js`: destacados de portada, catálogo, detalles, bolsa y demás interacciones compartidas.
- `dist/i18n.js`: traducciones de español e inglés y preferencia de idioma.
- `dist/assets/`: fotografías conceptuales generadas con IA.
- `dist/assets/campaign-hero.jpg`: fotografía original de campaña para la portada.
- `dist/assets/rose-bra-single.jpg`, `noir-brief-single.jpg`, `lune-top-single.jpg`: imágenes conceptuales individuales; completan las 16 fotografías distintas del catálogo.
- `dist/assets/brand/`: siete SVG de identidad y `tokens.json`, referencia de paleta, tipografías y firma para web y futura app.
- `scripts/sync-english.cjs`: sincronización del HTML inicial de portada, catálogo y estudio con su contenido inglés.
- `scripts/verify-i18n.cjs`: comprobación de traducciones y reconciliación de idioma al restaurar páginas.
- `scripts/verify-site.cjs`: comprobación de estructura, catálogo, traducciones, filtros y calendario anual.
- `scripts/verify-shopping.cjs`: regresiones de bolsa y herramientas WebMCP con reloj controlado.
- `PROCESO.md`: identidad, voz, sistema web/app, briefs de líneas, decisiones abiertas y proceso desde diseño a operación comercial.

El kit SVG contiene `symbol.svg` en rojo, `symbol-light.svg` en marfil, `symbol-mono.svg` en negro, `favicon.svg`, `app-icon.svg` conceptual y dos firmas delineadas: `wordmark-light.svg` roja para fondo claro y `wordmark-dark.svg` marfil para fondo rojo. Las letras de las firmas son contornos vectoriales derivados de Cormorant Garamond; las referencias de la fuente y su licencia figuran en el estudio. `tokens.json` es una referencia común que debe mantenerse coherente con los estilos; no constituye una aplicación implementada.

## Estado

La marca todavía no tiene un catálogo real. El catálogo completo reúne 16 conceptos: nueve prendas, dos perfumes de la colección regular, dos brillos de labios regulares y tres propuestas de ALR Édition 05 (perfume, brillo y coffret de ambos); la portada muestra seis destacados. Precios en USD, medidas, fórmulas y fotografías son ejemplos. Los filtros permiten explorar por colección, talla de ropa, color y precio de muestra. La bolsa, los favoritos y el interés en la edición anual usan almacenamiento local del navegador; no existen pagos, pedidos, cuentas o inventario reales. Guardar interés no envía correos ni notificaciones. No hay formulario de suscripción ni lista de espera operativa.

Los productos se editan en `dist/catalog.js`; sus nombres y descripciones se mantienen en `dist/i18n.js` para conservar ambos idiomas. Cada producto tiene un ID estable, categoría, precio, imagen, colores y variantes en `sizes`. Las prendas usan tallas; los perfumes y brillos usan `variantKind: 'volume'` con una única presentación de 50 ml o 6 ml; el coffret usa `variantKind: 'set'`. Los filtros por talla se aplican a ropa y muestran opciones propuestas, no disponibilidad de stock. Los tonos cosméticos, direcciones olfativas, fórmulas, concentraciones e ingredientes se deben validar con el proveedor, al igual que precios, tallaje y fotografías, antes de habilitar ventas.

Las vistas de `catalog.html` conservan categoría, búsqueda, talla, color, rango de precio y orden en la URL; por ejemplo, `catalog.html?category=fragrance#coleccion`. «Copy view link» / «Copiar enlace de vista» copia esa exploración y permite abrirla en otro navegador. Recargar y usar Atrás/Adelante recupera los controles. Solo los cambios de categoría añaden una entrada al historial; escribir, filtrar y ordenar actualiza la vista actual. El enlace excluye bolsa, favoritos e idioma. Los favoritos permanecen locales y su vista no se comparte. Si el navegador impide copiar, la interfaz indica que se puede copiar el enlace desde la barra de direcciones.

La búsqueda utiliza un índice de texto en ambos idiomas. Enter lleva al resultado y cierra la búsqueda de cabecera; Escape limpia la búsqueda del catálogo. Elegir una talla en los filtros la propone en el detalle si es válida para esa prenda; una variante previamente elegida en la bolsa tiene prioridad. La edición anual conserva sus restricciones.

## ALR Édition 05

La línea anual está formada por `edition-perfume`, `edition-gloss` y `edition-coffret`, marcados con `exclusive: true`. El coffret reúne el perfume de 50 ml y el brillo de 6 ml; no incluye prendas. Se puede explorar todo el año, pero la selección de muestras en bolsa debe quedar cerrada fuera de su ventana anual de cinco días. Las fechas están **por anunciar**; no se inventa una apertura ni se muestra una cuenta regresiva ficticia. Este prototipo no representa un lanzamiento comercial ni reserva existencias. Al activar ventas, el servidor deberá validar las fechas, la disponibilidad, los precios y las restricciones de la edición.

La fecha de apertura se configura en `dist/edition.js` con `startMonthDay` (`MM-DD`), actualmente `null`; `durationDays` es 5 y la zona horaria es `America/Santo_Domingo`. La ventana se repite en la misma fecha cada año durante cinco días de calendario, con inicio incluido y cierre excluido. Permite cruzar el fin de año; no admite el 29 de febrero como fecha anual. `window.ALRedition.getWindow()` devuelve el estado `pending`, `upcoming`, `open` o `closed`; `canSelect(product)` controla las selecciones exclusivas de la interfaz y de la herramienta WebMCP. La API sigue siendo una regla del prototipo en el navegador, no una validación comercial de servidor.

## Alojamiento independiente

El sitio público está contenido en `dist/` y puede alojarse en cualquier servicio que sirva archivos estáticos. No necesita ChatGPT para funcionar. Las tipografías se sirven desde este repositorio: tres archivos WOFF2 de aproximadamente 102 KB en total, con alternativas del sistema, `font-display: swap` y precarga de las fuentes principales. Se eliminó la importación remota de Google Fonts. La procedencia y las licencias se incluyen en `dist/assets/fonts/`. La estrategia sigue las referencias de [MDN sobre fuentes y rendimiento](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/Best_practices).

Sitio publicado: https://ycastillog.github.io/annys-le-rose/

La primera visita usa inglés. El idioma se puede cambiar desde la cabecera; conserva la selección de muestra y se recuerda en este navegador. Los importes siguen en USD; cambiar idioma no implica conversión de moneda. Las imágenes JPEG de la interfaz están optimizadas para la web.

Antes de habilitar ventas se deben conectar catálogo e inventario reales, pago validado en servidor, impuestos, envíos, administración de pedidos y políticas comerciales.

## Comprobación

Si cambia el texto en `dist/i18n.js` o `dist/brand.js`, sincronizar los tres HTML en inglés:

```sh
node scripts/sync-english.cjs
```

Se puede limitar la sincronización con `--home`, `--catalog` o `--studio`. Por ejemplo, `node scripts/sync-english.cjs --catalog` actualiza sólo el catálogo. Los textos, atributos accesibles y metadatos iniciales quedan alineados con el contenido que renderiza JavaScript.

Ejecutar ese paso **antes** de calcular los hashes finales y actualizar los parámetros de caché `v` de los recursos modificados. Con los archivos finales, comprobar:

```sh
node --check dist/app.js
node --check dist/catalog.js
node --check dist/i18n.js
node --check dist/brand.js
node scripts/verify-i18n.cjs
node scripts/verify-site.cjs
node scripts/verify-shopping.cjs
```

Para actualizar GitHub Pages después de un commit y push de `main`, publicar el contenido de `dist` en la rama `gh-pages`:

```sh
git subtree split --prefix=dist main
git push origin <commit-devuelto>:gh-pages
```

GitHub Pages sirve la raíz de `gh-pages`. No publicar la raíz de `main`, que contiene documentación y utilidades de desarrollo.

Las comprobaciones de esta arquitectura pasan: `verify-shopping.cjs` completa 46 regresiones y `verify-i18n.cjs`, 13. `verify-site.cjs` valida las tres páginas, 16 fotografías distintas de producto y 137 claves de traducción de la tienda, además de estructura, activos, fuentes, consultas y calendario anual. Las regresiones de bolsa usan la aplicación y las herramientas WebMCP en una VM con DOM mínimo y reloj controlado; las de idioma comprueban EN/ES y reconciliación al restaurar páginas.

Las revisiones de la campaña anterior cubrieron portada y estudio a 320, 390, 768 y 1440 píxeles CSS, formatos de belleza, bolsa de muestra y bloqueo de la edición con fechas pendientes. Ese registro no sustituye la validación de la arquitectura nueva con catálogo separado.

En navegador, el catálogo en inglés se comprobó a 320, 390, 768 y 1440 píxeles CSS de ancho sin desbordamiento horizontal. Se revisaron títulos y subcategorías contextuales. La búsqueda `ivory`, talla XL, precio inferior a $40 y orden descendente mostraron un resultado; Fragrance en el pie limpió los filtros y mostró tres conceptos, y Atrás restauró la selección anterior. La portada mostró seis destacados. El recorrido portada–estudio y regreso tras elegir español mantuvo el idioma sincronizado.

La revisión final también comprobó la portada en español a 320, 390, 768 y 1440 píxeles CSS sin desbordamiento, con seis tarjetas y sin imágenes rotas. Se revisaron visualmente los destacados y Édition 05 en móvil pequeño. La búsqueda `50 ml` desde portada abrió cuatro resultados en el catálogo; un enlace anterior de portada con categoría, talla y precio migró al catálogo conservando la vista. Añadir una muestra y un favorito, volver a portada, eliminarlos y avanzar de nuevo mantuvo ambos estados actualizados. El detalle individual Rose mostró su foto propia y la talla XL propuesta por el filtro; Escape cerró el diálogo y devolvió el foco al producto. El coffret mantuvo deshabilitada la selección con fechas por anunciar. No se observaron errores ni advertencias en la consola durante estos recorridos.

Las cinco entrevistas de `PROCESO.md` siguen pendientes. No existen ventas, pedidos, cobros ni avisos por correo operativos.

CSS y JavaScript llevan una versión de caché en el HTML; al modificarlos se debe renovar su parámetro `v`.
