# Annys Le´ Rose — proceso de la tienda y aplicación

## Estado actual

La marca está en creación y todavía no tiene catálogo real. Versión actual: tienda editorial en español e inglés, moneda USD, rojo cereza #BC1534, rojo oscuro #8D1028, marfil #FFFCF7 y rosa suave #F4E5E4. Catálogo conceptual de seis piezas, búsqueda, colecciones, orden por precio, detalles de producto, selección de talla, favoritos, bolsa con cantidades y revisión de selección. Bolsa, favoritos y preferencia de idioma se conservan en este dispositivo. No hay pedidos, pagos, cuentas, inventario ni administración comercial reales.

Las fotografías se generaron con image_gen integrado para ilustrar conceptos. No representan mercancía disponible. Tres imágenes: conjunto rojo de encaje sobre satén (editorial), conjunto negro de encaje (Noir), camisola y shorts rosa (Lune). Las piezas individuales reutilizan la imagen del conjunto al que pertenecen; sustituir por fotos individuales al cargar el catálogo. Los precios y la guía de tallas son ejemplos que deben reemplazarse. El nombre se mantiene como Annys Le´ Rose; confirmar la grafía comercial definitiva antes de registrar dominio o preparar etiquetas.

## 1. Marca y colección

Definir público y países de venta iniciales, rango de precios y primera colección. Seleccionar prendas y proveedor. Documentar cada producto: SKU, nombre, descripción, composición, cuidados, colores, tallas, medidas, costo, precio, stock y fotos reales frontal, posterior y de detalle. Los sujetadores necesitan contorno y copa cuando corresponda. Validar el monograma ALR para tamaños pequeños, vectorizarlo y preparar versiones para bordado, impresión y pantalla. La propuesta visual no constituye una verificación de disponibilidad de marca.

Resultado: catálogo y sistema visual aprobados, con fotografías consistentes y tallas verificadas.

## 2. Tienda operativa

Elegir plataforma comercial y conectar una fuente central para productos, variantes e inventario. Mantener el diseño del escaparate y sustituir los datos de muestra. Añadir páginas de producto con URL propia, disponibilidad por variante, contenido indexable, navegación y búsqueda del catálogo real. Incorporar administración de productos y pedidos mediante la plataforma comercial.

Implementar el recorrido: catálogo → producto → variante disponible → bolsa → dirección → opciones de entrega → impuestos y total definitivo → pago → confirmación de pedido. Validar precio y stock en servidor; nunca confiar en importes del navegador. El servidor debe crear la sesión de pago y verificar las notificaciones del proveedor, con protección frente a duplicados. Solo mostrar un pedido confirmado después de verificar el pago o la modalidad de pago acordada. No almacenar tarjetas en esta web.

Resultado: prueba completa de compra en entorno de pruebas, incluidos pago rechazado, stock agotado, cancelación y notificación duplicada.

## 3. Operación y lanzamiento

Configurar cuenta comercial de pagos, origen de envío, países, tarifas, transportistas y procedimientos de preparación de pedidos. Definir políticas reales de envíos, cambios, devoluciones de prendas íntimas, privacidad y términos de venta. Preparar soporte y mensajes transaccionales. Conectar dominio, verificar experiencia móvil, accesibilidad, carga, seguridad y metadatos. Mantener acceso privado hasta que el lanzamiento y su audiencia estén definidos.

Resultado: compra de prueba de extremo a extremo, pedido visible para operación, correo de confirmación, actualización de inventario, gestión de envío y proceso de reembolso verificados.

## 4. Mejora continua

Medir búsqueda, selección de talla, abandono de bolsa y conversión con una configuración de privacidad adecuada. Mejorar con datos reales: claridad del tallaje, fotografías, velocidad y pasos de pago. La comparación con otras tiendas es una aspiración de calidad; no se ha realizado un estudio comparativo ni se afirma superioridad comercial.

## 5. Aplicación, después de la web

Reutilizar el catálogo, inventario y sistema de pedidos de la web. Decidir iOS y Android según el público. Desarrollar cuenta, favoritos sincronizados, bolsa, pago, historial y seguimiento; incorporar notificaciones solo con consentimiento. Crear icono ALR legible, navegación móvil y pruebas en dispositivos. Preparar cuentas de publicación, fichas, privacidad y revisión de tiendas. Evitar mantener una segunda fuente de inventario. La aplicación todavía no se ha desarrollado.

## Desarrollo local

Desde esta carpeta ejecutar `node preview.cjs` y abrir `http://127.0.0.1:4173`. Los archivos públicos están en `dist`. El código se publica en GitHub y el contenido de `dist` se sirve desde la rama `gh-pages`. Esta versión es HTML/CSS/JavaScript estático, sin dependencias de compilación. Para el comercio real, integrar servicios de servidor y una plataforma de ventas; no simular pagos o pedidos con almacenamiento local.

## Verificación de la primera versión

Comprobar JavaScript con `node --check dist/app.js`, referencias de activos locales, respuesta HTTP, visualización de escritorio y móvil, selección obligatoria de talla, bolsa y subtotal, rechazo de variante inválida, favoritos, filtros, búsqueda y persistencia local. Las herramientas WebMCP exponen lectura del catálogo y preparación de bolsa de muestra; no completan transacciones.
