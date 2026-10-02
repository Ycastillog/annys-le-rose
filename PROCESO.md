# Annys Le´ Rose — proceso de la tienda y aplicación

## Estado actual

La marca está en creación y todavía no tiene catálogo real. Versión actual: tienda editorial en español e inglés, moneda USD, rojo cereza #BC1534, rojo oscuro #8D1028, marfil #FFFCF7 y rosa suave #F4E5E4. Catálogo conceptual de 16 productos de lencería, descanso, perfumes y brillo de labios, búsqueda, colecciones, filtros por talla de ropa, color y precio de muestra, orden por precio, detalles de producto, selección de variantes, favoritos, bolsa con cantidades y revisión de selección. Bolsa, favoritos, interés en Édition 05 y preferencia de idioma se conservan en este dispositivo. No hay pedidos, pagos, cuentas, inventario ni administración comercial reales.

Las fotografías se generaron con image_gen integrado para ilustrar conceptos. No representan mercancía disponible. La colección de ropa mantiene seis imágenes: conjunto rojo de encaje sobre satén (Rose), conjunto negro de encaje (Noir), camisola y shorts rosa (Lune), body rojo cereza (Cherry), bralette marfil (Ivory) y bata rosa (Blush). Las tres prendas individuales reutilizan la imagen del conjunto al que pertenecen; sustituir por fotos individuales al cargar el catálogo real. La expansión añade conceptos visuales para Rose Veil, Ambre Doux, Cherry Kiss, Pearl Glow, el perfume y brillo de Édition 05 y su coffret, además de una imagen editorial de belleza. Los 16 productos se mantienen en `dist/catalog.js`; nombres y descripciones en ambos idiomas, en `dist/i18n.js`. Los precios y la guía de tallas son ejemplos que deben reemplazarse. Las tallas representan propuestas del concepto y no stock; el body y el bralette abarcan XS–XXL, mientras que la bata abarca S–XXL. Los perfumes proponen 50 ml y los brillos 6 ml, sin implicar fórmulas aprobadas, pruebas ni producción confirmadas. El nombre se mantiene como Annys Le´ Rose; confirmar la grafía comercial definitiva antes de registrar dominio o preparar etiquetas.

## ALR Édition 05 — edición anual

La línea exclusiva reúne perfume, brillo de labios y un coffret de los dos; el coffret no incluye ropa. Se concibe para abrir una vez al año durante cinco días. **Fechas por anunciar**, según la decisión de la marca: la versión actual permite ver la colección y guardar interés local, pero mantiene cerrada la selección de estas muestras en bolsa. No se recopilan correos ni se envían notificaciones. La vista previa permanece disponible todo el año.

Antes de fijar la primera ventana, aprobar los productos y la identidad de la edición, el proveedor, el stock real, los precios, el empaquetado y las fechas con su zona horaria. Configurar una apertura anual de exactamente cinco días y un cierre exclusivo en el instante final; probar antes, durante y después de la ventana, incluido el cierre mientras una bolsa está abierta. En una tienda operativa, validar esta condición en el servidor tanto al añadir a bolsa como al crear y confirmar la compra. La restricción del prototipo está en el navegador y no puede sustituir el control comercial en servidor.

`dist/edition.js` mantiene `startMonthDay: null` mientras no exista fecha aprobada, `durationDays: 5` y zona horaria `America/Santo_Domingo`. La configuración anual acepta mes y día, con repetición cada año; no admite el 29 de febrero. Incluye cinco días de calendario desde la apertura y excluye el instante de cierre, incluso si la ventana cruza el fin de año. La API `window.ALRedition` informa el estado pendiente, futuro, abierto o cerrado y comprueba si un producto exclusivo se puede seleccionar. La bolsa y las herramientas WebMCP deben respetar la misma regla.

## 1. Marca y colección

Definir público y países de venta iniciales, rango de precios y primera colección. Seleccionar prendas y proveedores, además del fabricante de perfumes y cosméticos. Documentar cada producto: SKU, nombre, descripción, composición o ingredientes, cuidados o uso, colores, tallas o contenido, medidas, costo, precio, stock y fotos reales frontal, posterior y de detalle. Los sujetadores necesitan contorno y copa cuando corresponda. En perfumes y brillos, validar fórmula, concentración si aplica, ingredientes, tono, acabado, presentación, etiquetado y documentación del fabricante antes de publicar información comercial. Las direcciones olfativas y los acabados actuales son propuestas. Validar el monograma ALR para tamaños pequeños, vectorizarlo y preparar versiones para bordado, impresión y pantalla. La propuesta visual no constituye una verificación de disponibilidad de marca.

Resultado: catálogo y sistema visual aprobados, con fotografías consistentes y tallas verificadas.

## 2. Tienda operativa

Elegir plataforma comercial y conectar una fuente central para productos, variantes e inventario. Mantener el diseño del escaparate y sustituir los datos de muestra. Añadir páginas de producto con URL propia, disponibilidad por variante, contenido indexable, navegación y búsqueda del catálogo real. Incorporar administración de productos y pedidos mediante la plataforma comercial.

Implementar el recorrido: catálogo → producto → variante disponible → bolsa → dirección → opciones de entrega → impuestos y total definitivo → pago → confirmación de pedido. Validar precio y stock en servidor; nunca confiar en importes del navegador. El servidor debe crear la sesión de pago y verificar las notificaciones del proveedor, con protección frente a duplicados. Solo mostrar un pedido confirmado después de verificar el pago o la modalidad de pago acordada. No almacenar tarjetas en esta web.

Resultado: prueba completa de compra en entorno de pruebas, incluidos pago rechazado, stock agotado, cancelación y notificación duplicada.

## 3. Operación y lanzamiento

Configurar cuenta comercial de pagos, origen de envío, países, tarifas, transportistas y procedimientos de preparación de pedidos. Definir políticas reales de envíos, cambios, devoluciones de prendas íntimas, privacidad y términos de venta. Preparar soporte y mensajes transaccionales. Conectar dominio, verificar experiencia móvil, accesibilidad, carga, seguridad y metadatos. Mantener acceso privado hasta que el lanzamiento y su audiencia estén definidos.

Resultado: compra de prueba de extremo a extremo, pedido visible para operación, correo de confirmación, actualización de inventario, gestión de envío y proceso de reembolso verificados.

## 4. Mejora continua

Medir búsqueda, selección de variante, abandono de bolsa y conversión con una configuración de privacidad adecuada. Mejorar con datos reales: claridad del tallaje y de las presentaciones de belleza, fotografías, velocidad y pasos de pago. Revisar la preparación y cierre de cada edición anual antes de anunciar la siguiente. La comparación con otras tiendas es una aspiración de calidad; no se ha realizado un estudio comparativo ni se afirma superioridad comercial.

## 5. Aplicación, después de la web

Reutilizar el catálogo, inventario y sistema de pedidos de la web. Decidir iOS y Android según el público. Desarrollar cuenta, favoritos sincronizados, bolsa, pago, historial y seguimiento; incorporar notificaciones solo con consentimiento. Crear icono ALR legible, navegación móvil y pruebas en dispositivos. Preparar cuentas de publicación, fichas, privacidad y revisión de tiendas. Evitar mantener una segunda fuente de inventario. La aplicación todavía no se ha desarrollado.

## Desarrollo local

Desde esta carpeta ejecutar `node preview.cjs` y abrir `http://127.0.0.1:4173`. Los archivos públicos están en `dist`. El código se publica en GitHub y el contenido de `dist` se sirve desde la rama `gh-pages`. Esta versión es HTML/CSS/JavaScript estático, sin dependencias de compilación. Para el comercio real, integrar servicios de servidor y una plataforma de ventas; no simular pagos o pedidos con almacenamiento local.

## Verificación de la versión actual

La expansión a 16 conceptos quedó verificada en navegador a 320, 390, 768 y 1440 px, sin desbordamiento horizontal. Se revisaron español e inglés, proporciones corregidas de las fotografías, búsqueda por `50 ml`, limpieza del filtro de talla al cambiar de ropa a perfumes y selección automática del contenido único de los productos de belleza. Las prendas conservan su selección de talla; los productos de belleza no muestran la guía de tallas de ropa.

La bolsa de muestra se comprobó con un perfume de $64 y un brillo de $18: subtotal de $82 y revisión traducida al cambiar de idioma. También se verificaron favoritos, interés local guardado y bloqueo de los productos de Édition 05, incluido su coffret, mientras las fechas siguen pendientes. No se enviaron correos ni notificaciones y no se habilitaron pedidos o cobros.

Las comprobaciones reproducibles se ejecutan sin dependencias:

```sh
node scripts/verify-site.cjs
node scripts/verify-shopping.cjs
```

`verify-site.cjs` valida estructura, referencias de activos, los 16 conceptos, filtros y consultas, y 140 claves estáticas en español e inglés. Sus pruebas del calendario anual cubren apertura y cierre, fechas inválidas, cambio de horario estacional y ventanas que cruzan el fin de año.

`verify-shopping.cjs` comprueba 10 regresiones con la aplicación completa y sus herramientas WebMCP en una VM, usando un DOM mínimo y reloj controlado. Cubre formatos únicos en ml y set, talla inválida, edición pendiente, recuperación de bolsa persistida, instante exacto de cierre, purga de exclusivas antes de devolver el subtotal, cambios de cantidad cuando se desplazan los índices, revisión vacía o mixta y conservación de variantes y colores al cambiar el idioma. La revisión de diseño, foco nativo y renderizado se realiza en navegador. Las herramientas WebMCP leen el catálogo y preparan una bolsa de muestra; no completan transacciones.
