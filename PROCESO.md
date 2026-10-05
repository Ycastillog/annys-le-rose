# Annys Le´ Rose — proceso de la tienda y aplicación

## Estado actual

La prioridad de esta etapa es construir la identidad de Annys Le´ Rose antes de definir mercancía real. La portada presenta el universo de marca y seis conceptos destacados; `dist/catalog.html` reúne el catálogo conceptual completo de 16 productos para explorar direcciones de lencería, descanso, perfumes y brillo de labios. El inglés es el idioma principal para una primera visita; español sigue disponible y la elección guardada del navegador se respeta entre portada, catálogo y estudio. Los importes del prototipo son USD. Búsqueda, filtros, detalles, favoritos, bolsa y revisión permiten probar el recorrido. Bolsa, favoritos, interés en Édition 05 y preferencia de idioma se conservan en este dispositivo. No hay pedidos, pagos, cuentas, inventario ni administración comercial reales. Guardar interés sigue siendo una acción local: no existe un formulario de suscripción ni se envían correos o notificaciones.

Las fotografías se generaron con image_gen integrado para ilustrar conceptos. No representan mercancía disponible. El catálogo tiene 16 imágenes distintas: nueve de ropa, cuatro de belleza regular y tres de Édition 05. La ropa incluye los conjuntos Rose, Noir y Lune, body Cherry, bralette Ivory, bata Blush y tres prendas individuales. Estas últimas disponen de `rose-bra-single.jpg`, `noir-brief-single.jpg` y `lune-top-single.jpg`: imágenes de 1122 × 1402 píxeles que sustituyen la repetición de los conjuntos; sus tamaños y procedencia se documentan en `README.md`. La familia de belleza añade Rose Veil, Ambre Doux, Cherry Kiss, Pearl Glow y el perfume, brillo y coffret de Édition 05. La imagen editorial de belleza y la campaña de portada son activos adicionales. Las fotografías de venta deberán reemplazarlas con imágenes del producto real.

Los 16 productos se mantienen en `dist/catalog.js`; nombres y descripciones en ambos idiomas, en `dist/i18n.js`. Los precios y la guía de tallas son ejemplos que deben reemplazarse. Las tallas representan propuestas del concepto y no stock; el body y el bralette abarcan XS–XXL, mientras que la bata abarca S–XXL. Los perfumes proponen 50 ml y los brillos 6 ml, sin implicar fórmulas aprobadas, pruebas ni producción confirmadas. El nombre se mantiene como Annys Le´ Rose; confirmar la grafía comercial definitiva antes de registrar dominio o preparar etiquetas.

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

La portada presenta primero la campaña, luego tres universos —ropa íntima, perfumes y brillo de labios—, seis conceptos destacados, Édition 05 y una historia de marca concentrada. El relato reúne identidad, rituales y esencia en un solo bloque para dar espacio a las decisiones principales. El catálogo completo se explora en una página independiente; sus títulos, descripciones y subcategorías se adaptan a la familia seleccionada. En escritorio, el texto de campaña queda a la izquierda de la fotografía; en móvil, la fotografía aparece arriba. La aplicación futura usará los mismos colores, tipos, iconos, fotografía y estados, adaptados a su navegación. Mantener una biblioteca común de decisiones visuales y de contenido, junto con componentes para categoría, producto, variante, bolsa, edición anual y ayuda. Las imágenes editoriales pueden sugerir tacto y atmósfera; las fotografías de venta deberán mostrar el producto real con proporción, color y detalles comprensibles.

### Entregables de identidad disponibles

El estudio `dist/brand.html`, `dist/brand.css` y `dist/brand.js` presenta la identidad en inglés y español y comparte la preferencia de idioma de `ALRi18n` con portada y catálogo. Su acceso permanece en el pie de página; la cabecera prioriza la exploración de conceptos. Contiene el territorio emocional, símbolos y firmas, paleta, tipografías y aplicaciones visuales. La vista de aplicación es un concepto de identidad, sin funciones reales de app; no hay una aplicación publicada.

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

La identidad v1 de trabajo se concreta en el estudio y su guía descargable. La primera cápsula propuesta, “A moment of your own”, reúne Cherry Body, Ivory Bralette, Lune Camisole, Blush Robe, Rose Veil y Cherry Kiss. La selección da protagonismo a cuatro prendas y conecta perfume y brillo como gestos complementarios. Sus seis fichas de desarrollo están en `docs/CAPSULA-V1.md`; la presentación pública está en `dist/capsule.html`. La propuesta no confirma producción ni sustituye las cinco entrevistas o muestras físicas pendientes.

Cada concepto del catálogo cuenta con una ficha pública `product-<id>.html` para compartirlo y recuperarlo directamente. Esas fichas permiten ampliar su imagen conceptual, explorar información y guardar selecciones locales. “The cherry ritual” es la dirección creativa propuesta para Édition 05; su calendario sigue por anunciar. Las aplicaciones de caja, etiqueta y frasco del manual son estudios de diseño, sujetos a reproducción y desarrollo reales.

Convertir la dirección de esta etapa en un manual breve: propósito, público inicial, voz EN/ES, nombre y ALR, paleta, tipos, iconos, fotografía y ejemplos de uso. Preparar la firma horizontal y vertical, monograma, versiones de un color y pruebas de favicon y máscara de icono. Unificar la web, etiqueta, caja, bolsa, frasco, tubo y coffret como aplicaciones del mismo sistema. Resolver el brief de una cápsula inicial por familia antes de ampliar el surtido.

Punto de control: una versión identificada del manual y de los archivos de identidad; lectura del símbolo a 16, 32 y 180 px; nombre y estados legibles en móvil; una ficha de diseño por concepto que avance, con intención, materiales o acabado propuestos, presentación y preguntas para el proveedor. Separar en esas fichas decisiones resueltas y propuestas pendientes. La aprobación visual no verifica disponibilidad de marca ni acredita un producto real.

## 2. Muestras y desarrollo

Solicitar muestras a proveedores capaces de realizar la dirección seleccionada. Para prendas, documentar construcción, ajuste, medidas por variante, composición y cuidado; los sujetadores necesitan contorno y copa cuando corresponda. Para perfume y brillo, desarrollar con el fabricante la fórmula y presentación, registrar ingredientes, concentración cuando aplique, tono, acabado, instrucciones y documentación. Evaluar el envase junto al contenido y el coste junto al precio objetivo. Mantener versión y fecha de cada muestra y anotar cambios.

Punto de control: expediente por muestra con fotografías propias, observaciones, especificación del proveedor, coste y decisión de continuar o corregir. Un concepto no pasa a ficha comercial por tener una imagen atractiva: necesita datos y muestra reales. El rango de tallas, las fórmulas y las afirmaciones publicadas deben corresponder a lo efectivamente validado.

## 3. Validación de experiencia y producto

Realizar cinco entrevistas de 15–20 minutos con personas adultas del público inicial, buscando distintas prioridades, cuerpos y tonos de piel. Esta es una actividad pendiente: no hay participantes, respuestas ni resultados registrados en este documento. Antes de cada sesión, guardar la versión del sitio, fecha, dispositivo e idioma inicial y asignar un identificador anónimo. Presentar la sesión como una evaluación de la experiencia; escuchar y observar antes de explicar las decisiones de diseño.

### Guion para cada sesión

1. **Entender la marca.** Mostrar la portada durante unos segundos y preguntar: «¿Qué crees que ofrece esta marca? ¿Para quién la imaginas? ¿Qué tres palabras te transmite?». Registrar sus palabras, sin corregirlas ni sugerir adjetivos.
2. **Distinguir el concepto.** Pedir que mire un destacado: «Si te interesara esta pieza, ¿qué podrías hacer hoy? ¿La imagen y el precio representan un producto disponible?». Anotar dónde buscó esa información y si reconoce el estado conceptual por sí misma.
3. **Elegir un universo y un producto.** «Encuentra la familia que más te interese y un concepto que explorarías». Observar el paso de portada a catálogo, los títulos y los filtros; pedir que abra el detalle y elija una variante de muestra. Si desea continuar, revisar la bolsa de prueba. Registrar dudas, acciones y ayuda necesaria.
4. **Cambiar idioma.** Pedir que cambie EN/ES, abra otra página y vuelva con Atrás. «¿La información sigue siendo clara? ¿Conserva el idioma que elegiste?». Observar titulares, controles, detalle y bolsa, además de cualquier mezcla de idiomas.
5. **Interpretar los cinco días.** Pedir que abra Édition 05: «¿Cómo crees que funciona esta edición? ¿Cuándo abre y cuánto dura? ¿Qué esperas que ocurra si guardas tu interés?». Registrar si entiende una apertura anual de cinco días, fechas pendientes y guardado sólo en este navegador.
6. **Registrar una preferencia y su motivo.** «¿Qué concepto o universo te gustaría que desarrolláramos primero? ¿Por qué? ¿Qué información te falta para decidir?». Conservar una elección principal y una explicación literal; no equiparar curiosidad con intención de compra.

Al cerrar, explicar cualquier confusión sobre conceptos, fechas o bolsa de muestra. No solicitar una compra, atribuir avisos al guardado local ni crear registros de una lista de espera inexistente.

### Registro y criterios de revisión

Para cada tarea, anotar si se completó sin ayuda, con ayuda o no se completó; qué hizo la persona, dónde dudó, sus palabras y el resultado esperado. Distinguir la observación («buscó la fecha en el anuncio») de la hipótesis del equipo («quizá el estado pendiente necesita más énfasis»). Cerrar cada sesión con la preferencia y su motivo, y reunir los cinco registros reales antes de escribir hallazgos. No completar sesiones pendientes con respuestas supuestas.

Corregir antes de continuar cualquier confusión que haga creer que se puede comprar un concepto o que guardar interés envía avisos. Si dos o más personas se detienen en la misma tarea, convertirlo en una incidencia prioritaria con pantalla, acción, resultado esperado y cambio propuesto. Los casos aislados también se registran y se valoran por su impacto. Cinco entrevistas orientan decisiones de diseño; no demuestran tasas de conversión ni representan a todo el mercado.

Punto de control de esta fase: cinco registros, hallazgos trazables, una preferencia y un motivo por sesión, cambios priorizados y repetición de las tareas que hayan fallado después de corregirlas. Comprobar además contraste, teclado, mensajes, carga y pantallas de 320, 390, 768 y 1440 px con contenido final. El recorrido debe ser comprensible en ambos idiomas, sin confundir la vista previa con una compra. Las fichas comerciales y la decisión de producir una cápsula se aprobarán cuando existan datos, muestras y fotografías reales. Las pruebas de ajuste y de las muestras cosméticas se realizarán según su desarrollo y documentación del proveedor; estas entrevistas no validan fórmulas ni ajuste físico.

## 4. Comercio y operación

Elegir plataforma comercial y conectar una fuente central para productos, variantes e inventario. Sustituir los conceptos por el catálogo real con SKU, precio, stock, medidas o contenido y fotografías. Añadir páginas de producto con URL propia, disponibilidad por variante, contenido indexable y administración de productos y pedidos. Mantener la identidad y la claridad del prototipo mientras se incorporan estos servicios.

Implementar el recorrido: catálogo → producto → variante disponible → bolsa → dirección → entrega → impuestos y total definitivo → pago → confirmación. Validar precio, stock y ventana de Édition 05 en servidor. El servidor crea la sesión de pago y verifica las notificaciones del proveedor, con protección frente a duplicados. Mostrar un pedido confirmado después de verificar el pago o la modalidad acordada. No almacenar tarjetas en esta web.

Configurar pagos, origen y zonas de envío, tarifas, transportistas, preparación de pedidos, soporte y mensajes transaccionales. Definir políticas reales de envío, cambios, devoluciones, privacidad y términos de venta. Preparar dominio propio y entorno de pruebas. Anunciar las fechas de Édition 05 cuando sus productos, existencias y operación estén resueltos; verificar su cierre en bolsa y compra antes de lanzar la ventana.

Punto de control: compra de prueba completa con pedido visible para operación, confirmación, movimiento de inventario, envío y reembolso comprobados. Incluir pago rechazado, stock agotado, cancelación, notificación duplicada y cierre anual mientras hay una bolsa abierta. Después del lanzamiento, medir búsqueda, selección, abandono y conversión con la configuración de privacidad correspondiente y mejorar las tareas que los datos señalen. La aspiración de calidad frente a otras tiendas no implica una superioridad comercial demostrada.

## 5. Aplicación, después de la web

La construcción de la aplicación sigue a una web y operación comercial estables. Decidir iOS y Android según el público y reutilizar catálogo, inventario, pedidos y la biblioteca de identidad de la web. Diseñar navegación móvil, icono ALR, exploración, producto, cuenta, favoritos sincronizados, bolsa, pago, historial y seguimiento. Incorporar notificaciones con consentimiento y conectar el interés en una edición a un servicio real antes de prometer avisos. Mantener una sola fuente de inventario.

Punto de control: diseños y estados principales EN/ES consistentes con la web, pruebas en dispositivos, compra y seguimiento de prueba con los mismos servicios, y ventana anual protegida en servidor. Preparar cuentas de publicación, fichas, privacidad y revisión de tiendas cuando la aplicación esté verificada. La aplicación todavía no se ha desarrollado.

## Desarrollo local

Desde esta carpeta ejecutar `node preview.cjs` y abrir `http://127.0.0.1:4173`; el catálogo completo está en `http://127.0.0.1:4173/catalog.html` y el estudio en `http://127.0.0.1:4173/brand.html`. Los archivos públicos están en `dist`. El código se publica en GitHub y el contenido de `dist` se sirve desde la rama `gh-pages`. Esta versión es HTML/CSS/JavaScript estático, sin dependencias de compilación. Para el comercio real, integrar servicios de servidor y una plataforma de ventas; no simular pagos o pedidos con almacenamiento local.

Antes de publicar, ejecutar `node scripts/prepare-site.cjs`: sincroniza los cuatro HTML editoriales en inglés, regenera las 16 fichas y renueva los parámetros de caché de CSS/JavaScript en las 20 páginas. `sync-english.cjs` admite `--home`, `--catalog`, `--studio` y `--capsule` para limitar una sincronización de texto. Las fichas se generan con `build-products.cjs` desde catálogo, traducciones y renderizador compartido; no se editan sus HTML manualmente. Después se ejecutan las comprobaciones de idioma, sitio, fichas y bolsa.

La cabecera concentra seis accesos: Intimates, Fragrance, Lip gloss, Édition 05, Our world y The concepts, con sus traducciones al seleccionar español. El estudio se abre desde el pie de página. La categoría agregada `intimates` reúne nueve conceptos de ropa, conservando los IDs y categorías originales de cada prenda. El catálogo adapta título y descripción al grupo elegido y muestra las subcategorías de ropa sólo cuando corresponden. Los accesos con `data-discover` llevan al catálogo y limpian búsqueda y filtros para iniciar la exploración de un universo; las pestañas dentro del catálogo preservan los filtros elegidos. La exploración puede compartirse mediante `catalog.html` con categoría, búsqueda, talla, color, rango de precio y orden; bolsa, favoritos e idioma permanecen fuera del enlace. El historial recupera las vistas y el detalle propone una talla filtrada válida o la variante previa de la bolsa. Las acciones describen explícitamente una bolsa de prueba.

Portada, catálogo y estudio deben reconciliar su contenido con la preferencia EN/ES vigente cuando el navegador restaure una página. Verificar la secuencia cambiar idioma → abrir otra página → Atrás/Adelante; registrar lo observado sin atribuir una causa del navegador antes de comprobarla.

Las fuentes WOFF2 se sirven desde `dist/assets/fonts/`, con licencias OFL y procedencia incluidas. `fonts.css` es común a portada, catálogo y estudio; mantiene las familias de la identidad, evita la importación remota de tipografías y permite mostrar texto con alternativas del sistema mientras se cargan.

## Verificación de identidad, catálogo y portada

Las revisiones de la campaña anterior cubrieron portada y estudio a 320, 390, 768 y 1440 píxeles CSS, exploración por familia, formatos de belleza, bolsa de muestra y bloqueo de Édition 05 con fechas pendientes. El registro siguiente corresponde a la arquitectura con catálogo separado.

Las comprobaciones reproducibles se ejecutan sin dependencias:

```sh
node scripts/verify-i18n.cjs
node scripts/verify-site.cjs
node scripts/verify-shopping.cjs
```

Las comprobaciones pasan: `verify-shopping.cjs` completa 46 regresiones de la aplicación y las herramientas WebMCP en una VM, con DOM mínimo y reloj controlado; `verify-i18n.cjs` completa 13 regresiones de traducciones y reconciliación de idioma. `verify-site.cjs` valida las tres páginas, las 16 fotografías diferentes de producto y 137 claves de traducción de la tienda, además de estructura, activos, fuentes, filtros, consultas y calendario anual. Las herramientas WebMCP preparan una bolsa de muestra y no completan transacciones.

En navegador, el catálogo en inglés se comprobó a 320, 390, 768 y 1440 píxeles CSS de ancho sin desbordamiento horizontal. Se revisaron títulos y subcategorías de ropa contextuales. La combinación `ivory`, XL, precio inferior a $40 y orden de precio descendente produjo un resultado. El acceso Fragrance del pie limpió los filtros y mostró tres conceptos; Atrás restauró los filtros anteriores. Se comprobaron los seis destacados de portada y el recorrido al estudio y regreso tras elegir español, con idioma sincronizado.

La revisión final comprobó también la portada en español a 320, 390, 768 y 1440 píxeles CSS, sin desbordamiento y con seis tarjetas e imágenes cargadas. Se inspeccionaron los destacados y Édition 05 en móvil pequeño. Buscar `50 ml` desde portada abrió cuatro resultados; los enlaces anteriores con categoría, talla y precio migraron al catálogo conservando la vista. Se comprobó añadir una muestra y un favorito en catálogo, volver a portada, eliminarlos y avanzar de nuevo: ambos estados permanecieron actualizados. El detalle Rose usó su fotografía individual y propuso XL desde el filtro; Escape devolvió el foco al producto. El coffret siguió bloqueado con fechas por anunciar. No se observaron errores ni advertencias en la consola durante esos recorridos.

Este registro corresponde a los recorridos y tamaños descritos. Las cinco entrevistas del guion siguen pendientes y se registrarán por separado. No hay ventas, pedidos, cobros, correos ni notificaciones operativos en este prototipo.

### Entrega de identidad v1 y primera cápsula — 4 de octubre de 2026

Se añadieron el manual aplicado de identidad v1, la cápsula propuesta de seis conceptos y 16 fichas con enlaces propios. Cada ficha comparte la lógica de selección del catálogo y dispone de contenido inicial en inglés, metadatos particulares, ampliación de su única foto conceptual y cambio completo a español. No se generaron imágenes nuevas para esta entrega ni se inventaron muestras, resultados de entrevistas o información de producción.

Verificación final: 61 regresiones de catálogo y bolsa, 15 de idioma, comprobación estructural de 20 páginas y verificación específica de 16 fichas. La revisión visual cubrió cápsula y estudio ES y ficha de ropa EN entre 320 y 1440 píxeles, además de la corrección de desbordamiento en 320 ES. Se probaron enlaces, búsqueda, variantes, vista rápida, ampliación, guía y retorno de foco, formato de perfume y restricciones anuales. La prueba real entre dos pestañas confirmó bolsa, favoritos, eliminaciones e idioma compartidos. `README.md` conserva el detalle de los recorridos. La validación con personas y muestras físicas sigue pendiente.
