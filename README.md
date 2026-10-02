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
- `dist/app.js`: catálogo de muestra e interacciones.
- `dist/i18n.js`: traducciones de español e inglés y preferencia de idioma.
- `dist/assets/`: fotografías conceptuales generadas con IA.
- `PROCESO.md`: proceso de lanzamiento comercial y futura aplicación.

## Estado

La marca todavía no tiene un catálogo real. Precios, medidas y fotografías son ejemplos. La bolsa y los favoritos usan almacenamiento local del navegador; no existen pagos, pedidos, cuentas o inventario reales.

## Alojamiento independiente

El sitio público está contenido en `dist/` y puede alojarse en cualquier servicio que sirva archivos estáticos. No necesita ChatGPT para funcionar. Las tipografías se cargan desde Google Fonts con alternativas locales.

Sitio publicado: https://ycastillog.github.io/annys-le-rose/

El idioma se puede cambiar desde la cabecera, conserva la selección de compra y se recuerda en este navegador. Los importes siguen en USD; cambiar idioma no implica conversión de moneda. Las imágenes JPEG de la interfaz están optimizadas; las versiones PNG originales permanecen disponibles en la carpeta de activos.

Antes de habilitar ventas se deben conectar catálogo e inventario reales, pago validado en servidor, impuestos, envíos, administración de pedidos y políticas comerciales.

## Comprobación

```sh
node --check dist/app.js
node --check dist/i18n.js
node scripts/verify-site.cjs
```

Para actualizar GitHub Pages después de un commit y push de `main`, publicar el contenido de `dist` en la rama `gh-pages`:

```sh
git subtree split --prefix=dist main
git push origin <commit-devuelto>:gh-pages
```

GitHub Pages sirve la raíz de `gh-pages`. No publicar la raíz de `main`, que contiene documentación y utilidades de desarrollo.

La revisión de esta versión incluyó 320, 390, 768 y 1440 px, catálogo y mensajes en ES/EN, búsqueda con acentos y términos de ambos idiomas, conservación de talla al regresar de la guía, bolsa conservada al cambiar idioma, favoritos, estados vacíos y límite de 10 unidades con error visible dentro del diálogo. CSS y JavaScript llevan una versión de caché en el HTML para que los cambios lleguen juntos. Al modificar esos archivos se debe renovar su parámetro `v`.
