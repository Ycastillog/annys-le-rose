# Annys Le´ Rose

Tienda conceptual de lencería y ropa íntima con identidad en rojo cereza, diseño adaptable a móvil y escritorio, catálogo, búsqueda, favoritos, selección de talla y bolsa.

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
- `dist/assets/`: fotografías conceptuales generadas con IA.
- `PROCESO.md`: proceso de lanzamiento comercial y futura aplicación.

## Estado

La marca todavía no tiene un catálogo real. Precios, medidas y fotografías son ejemplos. La bolsa y los favoritos usan almacenamiento local del navegador; no existen pagos, pedidos, cuentas o inventario reales.

## Alojamiento independiente

El sitio público está contenido en `dist/` y puede alojarse en cualquier servicio que sirva archivos estáticos. No necesita ChatGPT para funcionar. Las tipografías se cargan desde Google Fonts con alternativas locales.

Antes de habilitar ventas se deben conectar catálogo e inventario reales, pago validado en servidor, impuestos, envíos, administración de pedidos y políticas comerciales.

## Comprobación

```sh
node --check dist/app.js
```

Se verificaron la selección de talla, favoritos, bolsa, subtotal, persistencia local, búsqueda y visualización móvil de la primera versión.
