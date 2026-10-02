# Annys Le´ Rose — proceso de la tienda y aplicación

## Estado actual

La prioridad de esta etapa es construir la identidad de Annys Le´ Rose antes de definir mercancía real. La web presenta el universo de marca y un catálogo conceptual de 16 productos para explorar direcciones de lencería, descanso, perfumes y brillo de labios. El inglés es el idioma principal para una primera visita; español sigue disponible y la elección guardada del navegador se respeta. Los importes del prototipo son USD. Búsqueda, filtros, detalles, favoritos, bolsa y revisión permiten probar el recorrido. Bolsa, favoritos, interés en Édition 05 y preferencia de idioma se conservan en este dispositivo. No hay pedidos, pagos, cuentas, inventario ni administración comercial reales.

Las fotografías se generaron con image_gen integrado para ilustrar conceptos. No representan mercancía disponible. La colección de ropa mantiene seis imágenes: conjunto rojo de encaje sobre satén (Rose), conjunto negro de encaje (Noir), camisola y shorts rosa (Lune), body rojo cereza (Cherry), bralette marfil (Ivory) y bata rosa (Blush). Las tres prendas individuales reutilizan la imagen del conjunto al que pertenecen; sustituir por fotos individuales al cargar el catálogo real. La expansión añade conceptos visuales para Rose Veil, Ambre Doux, Cherry Kiss, Pearl Glow, el perfume y brillo de Édition 05 y su coffret, además de una imagen editorial de belleza. Los 16 productos se mantienen en `dist/catalog.js`; nombres y descripciones en ambos idiomas, en `dist/i18n.js`. Los precios y la guía de tallas son ejemplos que deben reemplazarse. Las tallas representan propuestas del concepto y no stock; el body y el bralette abarcan XS–XXL, mientras que la bata abarca S–XXL. Los perfumes proponen 50 ml y los brillos 6 ml, sin implicar fórmulas aprobadas, pruebas ni producción confirmadas. El nombre se mantiene como Annys Le´ Rose; confirmar la grafía comercial definitiva antes de registrar dominio o preparar etiquetas.

La portada incorpora `dist/assets/campaign-hero.jpg`, una imagen original generada con image_gen integrado, de 1536 × 1024 píxeles y 174413 bytes. Muestra dos mujeres adultas de distintas complexiones con pijamas rojo cereza y marfil. Su función es expresar una campaña conceptual; las fotos de venta deberán corresponder a prendas reales.

## Dirección de identidad

Annys Le´ Rose se construye como una casa de rituales íntimos: la capa que eliges, el aroma que te acompaña y el brillo con el que expresas tu momento. El territorio emocional es la feminidad autodeterminada. Una mujer puede sentirse suave, segura, sensual, serena o audaz sin que la marca le imponga una apariencia o un papel. La cercanía cotidiana y una edición visual cuidada conectan ropa y belleza en el mismo universo.

La posición deseada es **premium accesible**, con calidez, precisión y una experiencia fácil de entender. Es una intención de diseño y precio que deberá contrastarse con costes, muestras y público; los precios del prototipo no prueban ese posicionamiento. La inclusión se expresa desde la voz, la navegación, la representación y las pruebas con personas diversas. El rango real de tallas, ajustes, tonos y fórmulas se definirá mediante desarrollo y validación, no mediante promesas del escaparate.

La diferenciación propuesta reúne cuatro decisiones: curaduría coherente entre prendas, perfume y brillo; rituales cotidianos como hilo narrativo; rojo cálido y un gesto ALR reconocible en todos los soportes; y una ceremonia anual de cinco días con fechas transparentes. Esta combinación es una dirección propia de trabajo. No constituye una afirmación de exclusividad del concepto, superioridad comercial ni disponibilidad del nombre o símbolo.

### Lectura breve de referentes oficiales

La lectura se limita a cómo estas empresas describen su propuesta; no es una auditoría de sus productos, conversiones, precios o calidad.

| Referente | Lo que presenta su fuente oficial | Decisión para Annys Le´ Rose |
| --- | --- | --- |
| Victoria’s Secret | Une prendas íntimas, fragancias y cuidado corporal con glamour y lujo accesible. En su comunicación de mayo de 2026 también presenta la sensualidad como una experiencia personal, definida por cada mujer. | La autonomía femenina forma parte de nuestro territorio, pero la identidad deberá sostenerse además en un lenguaje, símbolo, curaduría y experiencia propios. |
| Fashion Nova | Se describe desde tendencias, novedades frecuentes, rapidez, expresión audaz e influencia cultural. | Diseñar una familia de rituales reconocible, con conceptos seleccionados y una jerarquía editorial clara. |
| Temu | Se presenta como una plataforma que conecta consumidores con una amplia red de socios comerciales, fabricantes y marcas. | Construir una experiencia de marca unificada en la que cada categoría tenga un papel concreto dentro del mismo universo. |

Las observaciones sobre Victoria’s Secret proceden de [su descripción corporativa](https://www.victoriassecretandco.com/our-company/about-us) y [su comunicación del 21 de mayo de 2026](https://www.victoriassecretandco.com/news-releases/news-release-details/vsxy-standing-fully-who-we-are). Fashion Nova describe su enfoque en [About Us](https://www.fashionnova.com/pages/about-us). Temu presenta su red comercial en [Who We Are](https://www.temu.com/about_temu/home.html). Las decisiones de la última columna son inferencias de diseño para ALR, no características que esas fuentes atribuyan a nuestra marca. No reutilizar sus logos, campañas, composición gráfica o frases.

### Lectura de portadas para esta actualización

Las portadas oficiales actuales aportaron referencias para la jerarquía de la primera pantalla. Son observaciones cualitativas de contenido y presentación, no un ranking ni una medición de conversión.

| Referente | Observación de su portada oficial | Aplicación propia en ALR |
| --- | --- | --- |
| [SKIMS](https://skims.com/en-do) | Fotografía de campaña protagonista, mensaje breve y llamada a la acción; después aparecen productos y accesos de categoría. | Abrir con una campaña comprensible y ofrecer rutas claras hacia los universos. |
| [Agent Provocateur](https://www.agentprovocateur.com/int_en/) | Fotografía editorial protagonista, campaña y llamadas breves; las rutas posteriores llevan a novedades y familias de prendas. | Usar una imagen original con carácter y reducir el texto previo a la exploración. |
| [Rhode](https://www.rhodeskin.com/) | Titular sensorial corto y una acción concreta hacia la campaña de producto. | Conectar tacto, aroma y brillo mediante un titular memorable y texto breve. |

Estas decisiones son inferencias para Annys Le´ Rose. La fotografía, el titular y la composición de nuestra portada se desarrollaron para la marca; no se reutilizan elementos de las campañas observadas.

### Voz y contenido

El inglés es la voz principal y el español mantiene el mismo sentido emocional y la misma claridad funcional. La voz es íntima, segura, cálida y concreta. Se dirige a una persona, invita a elegir y deja espacio a distintas maneras de vivir la feminidad. Usa frases breves en titulares y explicaciones directas en el catálogo, la bolsa y las condiciones.

El lema de identidad es **“Your own kind of feminine.”**, con la adaptación **“Tu propia forma de ser femenina.”**. La campaña de portada usa **“Softness. With character.”** / **“Suavidad. Con carácter.”**, sin sustituir ese lema. Su texto conecta encaje, perfume y un toque de brillo; «Find your ritual» / «Encuentra tu ritual» invita a explorar los tres universos y una segunda acción lleva a los conceptos.

La primera pantalla expresa el territorio emocional con pocas palabras. El catálogo y los estados de muestra explican que los productos son conceptos en desarrollo y lo que efectivamente sucede al seleccionarlos. Las llamadas a la acción invitan a explorar o guardar una idea. Los textos no atribuyen a una prenda la capacidad de corregir un cuerpo ni a un cosmético resultados, seguridad clínica o duración sin pruebas. Los nombres de trabajo y las frases están sujetos a revisión antes de su uso comercial.

### Sistema visual para web, aplicación y piezas físicas

La base visual combina rojo cereza, marfil cálido y rosa suave, con rojo oscuro para profundidad y texto. El prototipo usa `#BC1534`, `#C8193C`, `#94112C`, `#FFFCF7` y `#F5E5E3`; documentar cualquier ajuste como parte del mismo sistema. Cormorant Garamond aporta la voz editorial y Manrope la lectura funcional. La tipografía de controles, precios y estados debe conservar su legibilidad en pantallas pequeñas.

Refinar el nombre completo y el monograma ALR como dos escalas de una identidad. Preparar firma horizontal y vertical, símbolo independiente, versiones de un color, claro y oscuro, área de reserva y mínimos de reproducción. Una curva o gesto vinculado a ALR puede conectar delicadeza y seguridad sin acumular adornos. El símbolo se comprobará como favicon, icono con máscara, etiqueta, bordado y sello; esa comprobación visual no acredita disponibilidad de marca.

La web presenta primero la campaña, luego tres universos —ropa íntima, perfumes y brillo de labios— y después el catálogo conceptual; el relato de identidad aparece tras el catálogo. En escritorio, el texto de campaña queda a la izquierda de la fotografía; en móvil, la fotografía aparece arriba. La aplicación futura usará los mismos colores, tipos, iconos, fotografía y estados, adaptados a su navegación. Mantener una biblioteca común de decisiones visuales y de contenido, junto con componentes para categoría, producto, variante, bolsa, edición anual y ayuda. Las imágenes editoriales pueden sugerir tacto y atmósfera; las fotografías de venta deberán mostrar el producto real con proporción, color y detalles comprensibles.

### Entregables de identidad disponibles

El estudio `dist/brand.html`, `dist/brand.css` y `dist/brand.js` presenta la identidad en inglés y español y comparte la preferencia de idioma de `ALRi18n` con la portada. Contiene el territorio emocional, símbolos y firmas, paleta, tipografías y aplicaciones visuales. La vista de aplicación es un concepto de identidad, sin funciones reales de app; no hay una aplicación publicada.

El kit de `dist/assets/brand/` reúne siete SVG:

| Archivo | Uso |
| --- | --- |
| `symbol.svg` | Símbolo ALR en rojo sobre fondo claro. |
| `symbol-light.svg` | Símbolo ALR en marfil sobre fondo oscuro o rojo. |
| `symbol-mono.svg` | Símbolo ALR negro de un color. |
| `favicon.svg` | Adaptación para el icono de la web. |
| `app-icon.svg` | Icono conceptual para la aplicación futura. |
| `wordmark-light.svg` | Firma roja delineada para fondo claro. |
| `wordmark-dark.svg` | Firma marfil delineada para fondo rojo. |

Las firmas tienen letras convertidas a contornos vectoriales a partir de Cormorant Garamond. El estudio incluye referencias a la fuente y su licencia, junto con la referencia de Manrope. `dist/assets/brand/tokens.json` conserva la paleta, familias tipográficas, firma EN/ES y decisiones de identidad como referencia para web y app. Mantenerlo alineado con CSS cuando se revise el sistema; los tokens y el icono no implican que la aplicación ya esté construida. El kit visual sigue sujeto a las decisiones comerciales abiertas de nombre, registro y reproducción física.

## Briefs para las líneas futuras

Los siguientes briefs orientan el desarrollo. Los nombres Rose, Noir, Lune, Rose Veil, Ambre Doux, Cherry Kiss, Pearl Glow y Édition 05 son nombres de trabajo, no lanzamientos confirmados.

| Línea | Papel dentro de la marca | Entregable de diseño | Validación antes de venta |
| --- | --- | --- | --- |
| Lingerie & Lounge | Capas íntimas para distintos ritmos: expresión, uso cotidiano y descanso. | Fichas de una cápsula inicial con silueta, materiales propuestos, construcción, color y familia de tallaje; coherencia entre prendas y empaquetado. | Muestras físicas, ajuste en personas del público, medidas por variante, composición, cuidado, fotos reales y coste. Los sujetadores requieren un criterio específico de contorno y copa cuando aplique. |
| Fragrance | Una firma olfativa íntima que conecte con el universo rojo y cálido. | Brief olfativo, referencias descriptivas propias, forma del frasco, etiqueta y presentación; Rose Veil y Ambre Doux son exploraciones. | Propuestas y documentación del fabricante, fórmula y concentración definidas, ingredientes, evaluación de las muestras, envase y etiquetado, fotos y coste. Las notas actuales son direcciones propuestas. |
| Lip Gloss | Un gesto pequeño de expresión personal dentro del mismo ritual. | Exploraciones de tonos, acabado deseado, aplicador, tubo y presentación; Cherry Kiss y Pearl Glow son exploraciones. | Muestras, tono y acabado observables, fórmula e ingredientes documentados, compatibilidad de presentación, instrucciones definidas por el fabricante, fotos y coste. |
| ALR Édition 05 | Una ceremonia anual de perfume y brillo durante cinco días. | Un tema propio de edición, perfume y brillo por separado y un coffret de ambos; mismos códigos ALR con un acento de edición. | Productos y empaquetado reales, cantidades disponibles, precio, fechas y zona horaria definidas, operación de la ventana y reglas verificadas en servidor. Las fechas siguen por anunciar. |

## Decisiones abiertas

Definir la grafía comercial definitiva y la relación visual entre nombre y ALR; revisar su disponibilidad antes de registro. Precisar el público adulto inicial, país o países de venta y rango de precio objetivo. Seleccionar qué familia liderará la primera cápsula y qué conceptos se mantienen como exploración. Determinar proveedores, tallaje real, fórmulas, contenidos, materiales, costes, cantidades y presentación. La fecha anual, el tema de la primera Édition 05, las condiciones de compra y el dominio propio siguen abiertos. La aplicación se planificará después de estabilizar la web y la operación comercial.

## ALR Édition 05 — edición anual

La línea exclusiva reúne perfume, brillo de labios y un coffret de los dos; el coffret no incluye ropa. Se concibe para abrir una vez al año durante cinco días. **Fechas por anunciar**, según la decisión de la marca: la versión actual permite ver la colección y guardar interés local, pero mantiene cerrada la selección de estas muestras en bolsa. No se recopilan correos ni se envían notificaciones. La vista previa permanece disponible todo el año.

Antes de fijar la primera ventana, aprobar los productos y la identidad de la edición, el proveedor, el stock real, los precios, el empaquetado y las fechas con su zona horaria. Configurar una apertura anual de exactamente cinco días y un cierre exclusivo en el instante final; probar antes, durante y después de la ventana, incluido el cierre mientras una bolsa está abierta. En una tienda operativa, validar esta condición en el servidor tanto al añadir a bolsa como al crear y confirmar la compra. La restricción del prototipo está en el navegador y no puede sustituir el control comercial en servidor.

`dist/edition.js` mantiene `startMonthDay: null` mientras no exista fecha aprobada, `durationDays: 5` y zona horaria `America/Santo_Domingo`. La configuración anual acepta mes y día, con repetición cada año; no admite el 29 de febrero. Incluye cinco días de calendario desde la apertura y excluye el instante de cierre, incluso si la ventana cruza el fin de año. La API `window.ALRedition` informa el estado pendiente, futuro, abierto o cerrado y comprueba si un producto exclusivo se puede seleccionar. La bolsa y las herramientas WebMCP deben respetar la misma regla.

## 1. Diseño de identidad y líneas

Convertir la dirección de esta etapa en un manual breve: propósito, público inicial, voz EN/ES, nombre y ALR, paleta, tipos, iconos, fotografía y ejemplos de uso. Preparar la firma horizontal y vertical, monograma, versiones de un color y pruebas de favicon y máscara de icono. Unificar la web, etiqueta, caja, bolsa, frasco, tubo y coffret como aplicaciones del mismo sistema. Resolver el brief de una cápsula inicial por familia antes de ampliar el surtido.

Punto de control: una versión identificada del manual y de los archivos de identidad; lectura del símbolo a 16, 32 y 180 px; nombre y estados legibles en móvil; una ficha de diseño por concepto que avance, con intención, materiales o acabado propuestos, presentación y preguntas para el proveedor. Separar en esas fichas decisiones resueltas y propuestas pendientes. La aprobación visual no verifica disponibilidad de marca ni acredita un producto real.

## 2. Muestras y desarrollo

Solicitar muestras a proveedores capaces de realizar la dirección seleccionada. Para prendas, documentar construcción, ajuste, medidas por variante, composición y cuidado; los sujetadores necesitan contorno y copa cuando corresponda. Para perfume y brillo, desarrollar con el fabricante la fórmula y presentación, registrar ingredientes, concentración cuando aplique, tono, acabado, instrucciones y documentación. Evaluar el envase junto al contenido y el coste junto al precio objetivo. Mantener versión y fecha de cada muestra y anotar cambios.

Punto de control: expediente por muestra con fotografías propias, observaciones, especificación del proveedor, coste y decisión de continuar o corregir. Un concepto no pasa a ficha comercial por tener una imagen atractiva: necesita datos y muestra reales. El rango de tallas, las fórmulas y las afirmaciones publicadas deben corresponder a lo efectivamente validado.

## 3. Validación de experiencia y producto

Probar la identidad y el recorrido con al menos cinco personas adultas del público inicial, buscando distintas prioridades, cuerpos y tonos de piel. Registrar qué entienden de la marca, qué expresiones conectan con ellas y qué distinguen entre concepto, muestra y producto disponible. Pedirles que identifiquen una familia, exploren un producto, elijan su variante, cambien el idioma y revisen la bolsa. Documentar la comprensión del ritual anual y de sus fechas pendientes. Las pruebas de ajuste y de las muestras cosméticas se realizarán según el desarrollo y documentación del proveedor; una entrevista de marca no demuestra eficacia ni seguridad de una fórmula.

Punto de control: informe de tareas y hallazgos, incidencias concretas corregidas, fichas de producto con datos verificables y fotografías reales, y decisión documentada de qué cápsula se producirá. Repetir las tareas que hayan fallado después del cambio correspondiente. Comprobar contraste, teclado, mensajes, carga y pantallas de 320, 390, 768 y 1440 px con contenido final. El resultado debe mostrar una experiencia comprensible en ambos idiomas, sin confundir una vista previa con una compra.

## 4. Comercio y operación

Elegir plataforma comercial y conectar una fuente central para productos, variantes e inventario. Sustituir los conceptos por el catálogo real con SKU, precio, stock, medidas o contenido y fotografías. Añadir páginas de producto con URL propia, disponibilidad por variante, contenido indexable y administración de productos y pedidos. Mantener la identidad y la claridad del prototipo mientras se incorporan estos servicios.

Implementar el recorrido: catálogo → producto → variante disponible → bolsa → dirección → entrega → impuestos y total definitivo → pago → confirmación. Validar precio, stock y ventana de Édition 05 en servidor. El servidor crea la sesión de pago y verifica las notificaciones del proveedor, con protección frente a duplicados. Mostrar un pedido confirmado después de verificar el pago o la modalidad acordada. No almacenar tarjetas en esta web.

Configurar pagos, origen y zonas de envío, tarifas, transportistas, preparación de pedidos, soporte y mensajes transaccionales. Definir políticas reales de envío, cambios, devoluciones, privacidad y términos de venta. Preparar dominio propio y entorno de pruebas. Anunciar las fechas de Édition 05 cuando sus productos, existencias y operación estén resueltos; verificar su cierre en bolsa y compra antes de lanzar la ventana.

Punto de control: compra de prueba completa con pedido visible para operación, confirmación, movimiento de inventario, envío y reembolso comprobados. Incluir pago rechazado, stock agotado, cancelación, notificación duplicada y cierre anual mientras hay una bolsa abierta. Después del lanzamiento, medir búsqueda, selección, abandono y conversión con la configuración de privacidad correspondiente y mejorar las tareas que los datos señalen. La aspiración de calidad frente a otras tiendas no implica una superioridad comercial demostrada.

## 5. Aplicación, después de la web

La construcción de la aplicación sigue a una web y operación comercial estables. Decidir iOS y Android según el público y reutilizar catálogo, inventario, pedidos y la biblioteca de identidad de la web. Diseñar navegación móvil, icono ALR, exploración, producto, cuenta, favoritos sincronizados, bolsa, pago, historial y seguimiento. Incorporar notificaciones con consentimiento y conectar el interés en una edición a un servicio real antes de prometer avisos. Mantener una sola fuente de inventario.

Punto de control: diseños y estados principales EN/ES consistentes con la web, pruebas en dispositivos, compra y seguimiento de prueba con los mismos servicios, y ventana anual protegida en servidor. Preparar cuentas de publicación, fichas, privacidad y revisión de tiendas cuando la aplicación esté verificada. La aplicación todavía no se ha desarrollado.

## Desarrollo local

Desde esta carpeta ejecutar `node preview.cjs` y abrir `http://127.0.0.1:4173`; el estudio está en `http://127.0.0.1:4173/brand.html`. Los archivos públicos están en `dist`. El código se publica en GitHub y el contenido de `dist` se sirve desde la rama `gh-pages`. Esta versión es HTML/CSS/JavaScript estático, sin dependencias de compilación. Para el comercio real, integrar servicios de servidor y una plataforma de ventas; no simular pagos o pedidos con almacenamiento local.

Si cambia el contenido de portada en `dist/i18n.js` o del estudio en `dist/brand.js`, ejecutar `node scripts/sync-english.cjs` para sincronizar ambos HTML iniciales en inglés con su render real. Admite `--home` y `--studio` para trabajar en una sola página. Este paso mantiene la primera presentación y el contenido sin JavaScript en el idioma principal. Ejecutarlo antes de calcular los hashes finales y renovar los parámetros de caché `v` de los recursos modificados; después realizar las comprobaciones del sitio y la bolsa.

La cabecera concentra seis accesos: Intimates, Fragrance, Lip gloss, Édition 05, Our world y Brand studio, con sus traducciones al seleccionar español. La categoría agregada `intimates` reúne nueve conceptos de ropa, conservando los IDs y categorías originales de cada prenda. Los accesos con `data-discover` limpian búsqueda y filtros para iniciar la exploración de un universo; las pestañas del catálogo preservan los filtros elegidos. La exploración puede compartirse por URL con categoría, búsqueda, talla, color, rango de precio y orden; bolsa, favoritos e idioma permanecen fuera del enlace. El historial recupera las vistas y el detalle propone una talla filtrada válida o la variante previa de la bolsa. Las acciones describen explícitamente una bolsa de prueba.

Las fuentes WOFF2 se sirven desde `dist/assets/fonts/`, con licencias OFL y procedencia incluidas. `fonts.css` es común a portada y estudio; mantiene las familias de la identidad, evita la importación remota de tipografías y permite mostrar texto con alternativas del sistema mientras se cargan.

## Verificación de identidad, catálogo y portada

La nueva portada se verificó a 320 × 780 y 768 × 1024 en español, y a 390 × 844 y 1440 × 1000 en inglés. No presentó desbordamiento horizontal; imagen, titular y llamadas a la acción resultaron legibles. La acción principal llevó a los tres universos. Intimates mostró los nueve conceptos de ropa y conservó la categoría al recargar la URL.

Desde `intimates?q=ivory&sort=high`, con un concepto visible, el acceso Fragrance del menú móvil limpió búsqueda y orden y mostró tres conceptos. Atrás restauró exactamente la búsqueda `ivory`, el orden de precio descendente y el único resultado anterior. Al descubrir una familia, el foco pasó al contador de resultados.

Las revisiones anteriores de portada y estudio cubrieron 320, 390, 768 y 1440 píxeles CSS, sin desbordamiento horizontal, inglés en primera visita y preferencia ES/EN compartida. También verificaron búsqueda por `50 ml`, contenido único de belleza seleccionado automáticamente, conservación de 50 ml al traducir la bolsa, subtotal de muestra de $82 para perfume y brillo, talla filtrada propuesta en el detalle, compartir deshabilitado en favoritos y bloqueo del coffret con fechas pendientes. No se enviaron correos ni notificaciones y no se habilitaron pedidos o cobros.

Las comprobaciones reproducibles se ejecutan sin dependencias:

```sh
node scripts/verify-site.cjs
node scripts/verify-shopping.cjs
```

`verify-site.cjs` valida estructura y referencias de activos de portada y estudio, fuentes WOFF2, los 16 conceptos, filtros, consultas y 153 claves estáticas de la portada en español e inglés. La revisión del estudio cubrió 76 campos localizados. Las pruebas del calendario anual cubren apertura y cierre, fechas inválidas, cambio de horario estacional y ventanas que cruzan el fin de año.

`verify-shopping.cjs` pasa 32 regresiones con la aplicación completa y sus herramientas WebMCP en una VM, usando un DOM mínimo y reloj controlado. Cubre formatos, variantes, bolsa y calendario anual, URL válidas e inválidas, recarga EN/ES, historial sin entradas por tecla, cierre de diálogo y foco al volver, copia y alternativa sin permiso, favoritos locales, recuperación de talla, búsqueda indexada bilingüe, composición de texto, teclado, movimiento reducido y recorridos de descubrimiento. Diseño, foco nativo y renderizado se revisan en navegador. Las herramientas WebMCP leen el catálogo y preparan una bolsa de muestra; no completan transacciones.
