# Annys Le´ Rose

Tienda conceptual de lencería y ropa íntima con identidad en rojo cereza, interfaz en español e inglés, diseño adaptable a móvil y escritorio, catálogo, búsqueda, favoritos, selección de talla y bolsa.

## Ejecutar localmente

Requiere Node.js. Desde la carpeta del proyecto:

```sh
node preview.cjs
```

Abrir http://127.0.0.1:4173. No se requiere instalar dependencias.

## Archivos

- `dist/index.html`: estructura de la tienda.
- `dist/styles.css`: diseño y estilos adaptables.
- `dist/catalog.js`: nueve conceptos de producto, precios de muestra, colores y tallas.
- `dist/catalog-query.js`: búsqueda bilingüe y filtros combinados del catálogo.
- `dist/app.js`: búsqueda, filtros y demás interacciones de la tienda.
- `dist/i18n.js`: traducciones de español e inglés y preferencia de idioma.
- `dist/assets/`: fotografías conceptuales generadas con IA.
- `PROCESO.md`: proceso de lanzamiento comercial y futura aplicación.

## Estado

La marca todavía no tiene un catálogo real. El catálogo de muestra reúne nueve conceptos: dos conjuntos de encaje, un set de satén, un body rojo, un bralette marfil, una bata rosa y tres piezas individuales de los conjuntos. Precios en USD, medidas y fotografías son ejemplos. Los filtros permiten explorar por colección, talla, color y precio de muestra. La bolsa y los favoritos usan almacenamiento local del navegador; no existen pagos, pedidos, cuentas o inventario reales.

Los productos se editan en `dist/catalog.js`; sus nombres y descripciones se mantienen en `dist/i18n.js` para conservar ambos idiomas. Cada producto tiene un ID estable, una categoría, precio, imagen, colores y tallas. Los filtros por talla muestran las opciones propuestas para el concepto, no disponibilidad de stock. Al incorporar productos reales se deben confirmar precios, tallaje, composición e imágenes antes de habilitar ventas.

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
```

Para actualizar GitHub Pages después de un commit y push de `main`, publicar el contenido de `dist` en la rama `gh-pages`:

```sh
git subtree split --prefix=dist main
git push origin <commit-devuelto>:gh-pages
```

GitHub Pages sirve la raíz de `gh-pages`. No publicar la raíz de `main`, que contiene documentación y utilidades de desarrollo.

La revisión del catálogo incluyó 320, 390, 768 y 1440 px, filtros combinados de talla/color/precio, búsqueda con varias palabras y acentos en ambos idiomas, orden por precio, reinicio, imágenes cargadas y selección de la bata con talla M en la bolsa. Al cambiar el idioma se mantienen filtros y bolsa. Se verificaron favoritos sin resultados y el foco de teclado al quitar una pieza. La versión anterior también validó el regreso desde la guía y el límite de 10 unidades. `verify-site.cjs` comprueba datos, fotos, traducciones y consultas del catálogo. CSS y JavaScript llevan una versión de caché en el HTML; al modificarlos se debe renovar su parámetro `v`.
