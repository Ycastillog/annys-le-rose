'use strict';
(() => {
  const copy = {
    skip:['Skip to content','Ir al contenido'], back:['Our world','Nuestro universo'],
    eyebrow:['ANNYS LE´ ROSE · BRAND STUDIO','ANNYS LE´ ROSE · ESTUDIO DE MARCA'],
    title:['Your own kind<br>of <em>feminine.</em>','Tu propia forma<br>de <em>ser femenina.</em>'],
    intro:['Lace, scent and gloss. An intimate world taking shape around the freedom to feel feminine your own way.','Encaje, perfume y brillo. Un universo íntimo que toma forma alrededor de la libertad de sentir la feminidad a tu manera.'],
    status:['Identity v1 · Working direction','Identidad v1 · Dirección de trabajo'],
    navPurpose:['The purpose','El propósito'], navApplications:['In everyday details','En cada detalle'],
    purposeEyebrow:['01 · OUR STARTING POINT','01 · NUESTRO PUNTO DE PARTIDA'],
    purposeTitle:['A little more space<br><em>to be yourself.</em>','Un poco más de espacio<br><em>para ser tú.</em>'],
    purposeCopy:['A quiet morning. Getting ready for yourself. A detail you choose to keep close. We are building Annys Le´ Rose around those moments: femininity as personal expression, without a part to play.','Una mañana tranquila. Arreglarte para ti. Un detalle que eliges llevar cerca. Estamos construyendo Annys Le´ Rose alrededor de esos momentos: la feminidad como expresión propia, sin un papel que interpretar.'],
    purposeFocus:['The heart of the collection','El corazón de la colección'],
    purposeFocusCopy:['Intimates lead. Fragrance and lip gloss extend the same personal ritual, in a closely considered selection.','La ropa íntima es el centro. El perfume y el brillo labial acompañan ese mismo ritual personal, en una selección cuidada.'],
    purposeAudience:['An initial audience to learn from','Un público inicial del que aprender'],
    purposeAudienceCopy:['Adult women in the United States who enjoy feminine details on their own terms. This is a starting hypothesis to explore through conversations, not a fixed definition of who belongs.','Mujeres adultas en Estados Unidos que disfrutan los detalles femeninos a su manera. Es una hipótesis inicial que exploraremos conversando, no una definición cerrada de quién pertenece.'],
    purposePosition:['The ambition','La aspiración'],
    purposePositionCopy:['A considered, premium feel at an accessible price. We will test that balance with real samples, costs and customer feedback.','Una experiencia cuidada y premium a un precio accesible. Validaremos ese equilibrio con muestras reales, costos y opiniones de las clientas.'],
    directionLabel:['Working direction · Identity v1','Dirección de trabajo · Identidad v1'],
    directionCopy:['A shared reference for the next stage. Products, fit, materials and packaging still need physical validation; this identity has not been finalized.','Una referencia común para la siguiente etapa. Los productos, el ajuste, los materiales y el empaque aún requieren validación física; esta identidad todavía no es definitiva.'],
    capsuleLink:['Explore the proposed capsule','Explorar la cápsula propuesta'],
    symbolAlt:['ALR symbol with a curved petal form','Símbolo ALR con forma de pétalo curvo'],
    signature:['One gesture. Three initials. Our signature.','Un gesto. Tres iniciales. Nuestra firma.'],
    nav:['Brand studio sections','Secciones del estudio de marca'],
    navSignature:['The signature','La firma'], navPalette:['The palette','La paleta'], navVoice:['The voice','La voz'], navApp:['The app concept','Concepto de app'],
    signatureEyebrow:['02 · A SIGNATURE OF OUR OWN','02 · UNA FIRMA PROPIA'],
    signatureTitle:['A petal, an initial,<br><em>a quiet presence.</em>','Un pétalo, una inicial,<br><em>una presencia sutil.</em>'],
    signatureCopy:['A curved A opens like a petal. The L and R share a stem. A simple gesture, designed to carry the same identity from a label to a screen.','Una A curva se abre como un pétalo. La L y la R comparten un eje. Un gesto sencillo, pensado para llevar la misma identidad de una etiqueta a una pantalla.'],
    onIvory:['On ivory','Sobre marfil'], onCherry:['On cherry','Sobre cereza'],
    wordmarkRedAlt:['Annys Le Rose signature in cherry red','Firma Annys Le Rose en rojo cereza'], wordmarkIvoryAlt:['Annys Le Rose signature in ivory','Firma Annys Le Rose en marfil'],
    downloadSignature:['Download signature · SVG','Descargar firma · SVG'],
    symbolLabel:['The ALR symbol','El símbolo ALR'], symbolUse:['For labels, packaging and personal details.','Para etiquetas, empaques y detalles personales.'], downloadSymbol:['Download symbol · SVG','Descargar símbolo · SVG'],
    faviconLabel:['A small signature','Una firma pequeña'], faviconUse:['The same gesture at browser size.','El mismo gesto al tamaño del navegador.'], downloadFavicon:['Download favicon · SVG','Descargar favicon · SVG'],
    appIconLabel:['An app icon concept','Un concepto de icono de app'], appIconUse:['A visual direction for the planned app.','Una dirección visual para la app prevista.'], downloadIcon:['Download icon · SVG','Descargar icono · SVG'],
    symbolCare:['Keep the symbol in one color, give it breathing room and preserve its proportions.','Mantén el símbolo en un solo color, dale espacio y conserva sus proporciones.'],
    clearspaceCaption:['An open margin on every side.','Un margen libre en cada lado.'],
    logoRules:['A practical starting rule','Una regla práctica para comenzar'],
    logoSpace:['Leave clear space of at least one quarter of the symbol’s height around the symbol or full signature. Keep type, trim and other artwork outside this area.','Deja un espacio libre de al menos una cuarta parte de la altura del símbolo alrededor del símbolo o la firma completa. Mantén los textos, los bordes de corte y otros elementos fuera de esa área.'],
    logoSize:['For screens, start at 32 px for the standalone symbol and 180 px wide for the full signature. Use the favicon asset at 16–32 px. These are working guides; test each actual size before release.','En pantallas, parte de 32 px para el símbolo independiente y de 180 px de ancho para la firma completa. Usa el favicon entre 16 y 32 px. Son pautas de trabajo; comprueba cada tamaño real antes de publicar.'],
    logoPrint:['For print and embroidery, request a physical proof. Fine strokes may need a dedicated production version.','Para impresión y bordado, solicita una prueba física. Los trazos finos pueden requerir una versión específica para producción.'],
    proofTitle:['The same gesture, at different sizes.','El mismo gesto, en distintos tamaños.'], proofAlt:['App icon concept at 180 pixels','Concepto de icono de app a 180 píxeles'], downloadMono:['Download monochrome symbol · SVG','Descargar símbolo monocromático · SVG'],
    paletteEyebrow:['03 · OUR COLOR STORY','03 · NUESTRA HISTORIA DE COLOR'],
    paletteTitle:['Cherry with character.<br><em>Ivory with ease.</em>','Cereza con carácter.<br><em>Marfil con calma.</em>'],
    paletteCopy:['Cherry leads. Ivory makes space. Blush, rose and champagne bring warmth, while deep ink keeps every word clear.','El cereza protagoniza. El marfil crea espacio. Rosa pálido, rosa suave y champán aportan calidez; la tinta profunda mantiene cada palabra clara.'],
    cherry:['Cherry','Cereza'], ivory:['Warm ivory','Marfil cálido'], blush:['Blush','Rosa pálido'], rose:['Dusty rose','Rosa suave'], champagne:['Champagne','Champán'], ink:['Deep ink','Tinta profunda'],
    colorMain:['Ivory is the everyday canvas. Cherry marks the signature, key actions and occasional statement panels.','El marfil es la base cotidiana. El cereza distingue la firma, las acciones principales y algunos bloques protagonistas.'],
    colorSupport:['Blush, rose and champagne support backgrounds and accents. Use deep ink for reading; keep pale tones out of small text.','El rosa pálido, el rosa suave y el champán acompañan los fondos y los acentos. Usa tinta profunda para la lectura; reserva los tonos claros para otros elementos.'],
    typeHierarchy:['One expressive headline, then clear information. Use serif for titles, Manrope for body copy and controls, and spaced capitals only for short labels. Keep essential details out of images.','Un titular expresivo, seguido de información clara. Usa la tipografía con remates en títulos, Manrope en textos y controles, y mayúsculas espaciadas solo en etiquetas breves. Mantén los detalles esenciales fuera de las imágenes.'],
    serifUse:['Editorial headlines and the signature. Expressive, graceful, with room to breathe.','Titulares editoriales y la firma. Expresiva, elegante y con espacio para respirar.'],
    sansUse:['Navigation, product details and everyday reading. A clear companion to the expressive serif.','Navegación, detalles de productos y lectura cotidiana. Un complemento claro para la tipografía expresiva con remates.'],
    fontReference:['Typeface references and licenses:','Referencias tipográficas y licencias:'],
    downloadReference:['Download identity reference · JSON','Descargar referencia de identidad · JSON'],
    voiceEyebrow:['04 · THE WAY WE SPEAK','04 · NUESTRA FORMA DE HABLAR'],
    voiceTitle:['Warm. Assured.<br><em>Always personal.</em>','Cálida. Segura.<br><em>Siempre personal.</em>'],
    voiceCopy:['We speak to you with warmth and clarity. Your choices, your comfort and your way of being feminine lead the conversation.','Te hablamos con calidez y claridad. Tus elecciones, tu comodidad y tu forma de ser femenina guían la conversación.'],
    voiceOne:['Invite choice.','Invitar a elegir.'], voiceOneCopy:['“Find your own ritual.” A clear invitation to make it personal.','“Encuentra tu propio ritual.” Una invitación a hacerlo tuyo.'],
    voiceTwo:['Make the details clear.','Aclarar los detalles.'], voiceTwoCopy:['Use simple words for fit, shade and format. Be clear about what is a concept and what is confirmed.','Usar palabras sencillas para el ajuste, el tono y la presentación. Distinguir con claridad los conceptos de los detalles confirmados.'],
    voiceThree:['Leave room for you.','Dejar espacio para ti.'], voiceThreeCopy:['Soft, bold, quiet or expressive. There is room for every side of you.','Suave, atrevida, serena o expresiva. Hay espacio para cada versión de ti.'],
    brandLine:['Your own kind of feminine.','Tu propia forma de ser femenina.'],
    examplesTitle:['The same intention, in two languages.','La misma intención, en dos idiomas.'],
    examplesIntro:['English leads; Spanish carries the same warmth and clarity. Translate the meaning, then check every action and product detail.','El inglés es el idioma principal; el español conserva la misma calidez y claridad. Traduce el sentido y revisa cada acción y detalle de producto.'],
    exampleInvitation:['An invitation','Una invitación'], exampleProduct:['A product concept','Un concepto de producto'],
    voiceBoundary:['Speak about choice and expression. Avoid body-correction language, pressure to be desirable and promises about comfort or performance that have not been tested.','Habla de elección y expresión. Evita el lenguaje que propone corregir el cuerpo, la presión de resultar deseable y las promesas de comodidad o desempeño que no se hayan comprobado.'],
    applicationsEyebrow:['05 · THE IDENTITY, IN YOUR HANDS','05 · LA IDENTIDAD, EN TUS MANOS'],
    applicationsTitle:['One world.<br><em>In the little details.</em>','Un mismo universo.<br><em>En cada detalle.</em>'],
    applicationsCopy:['A quiet label, a cherry box, a small signature on glass. These design studies show how the same identity could move between intimates and beauty.','Una etiqueta discreta, una caja cereza, una pequeña firma sobre vidrio. Estos estudios de diseño muestran cómo una misma identidad puede unir la ropa íntima y la belleza.'],
    labelTitle:['Close to you','Cerca de ti'],
    labelCopy:['Label study · Ivory ground, cherry signature. Keep care and size information on a separate, readable label.','Estudio de etiqueta · Fondo marfil, firma cereza. Mantén la información de cuidado y talla en una etiqueta aparte y legible.'],
    boxTitle:['A moment to open','Un momento al abrir'],
    boxCopy:['Box study · Cherry outside, an ivory signature and space around it. Final materials and finish remain to be sampled.','Estudio de caja · Exterior cereza, firma marfil y espacio alrededor. Los materiales y el acabado finales aún necesitan muestras.'],
    bottleTitle:['The finishing detail','El detalle final'],
    bottleCopy:['Bottle study · An uncluttered front with the ALR symbol. A design direction, not a confirmed formula or container.','Estudio de frasco · Un frente despejado con el símbolo ALR. Una dirección de diseño, no una fórmula ni un envase confirmados.'],
    applicationNotice:['Concept illustrations only. These are not production files or photographs of manufactured goods.','Solo ilustraciones conceptuales. No son archivos de producción ni fotografías de artículos fabricados.'],
    photographyAlt:['Concept image of a cherry lace bra against warm ivory','Imagen conceptual de un sujetador de encaje cereza sobre marfil cálido'],
    photographyCaption:['AI-generated concept image · Visual direction','Imagen conceptual generada con IA · Dirección visual'],
    photographyEyebrow:['A CONSISTENT VISUAL LANGUAGE','UN LENGUAJE VISUAL COHERENTE'],
    photographyTitle:['Show the feeling. Respect the detail.','Mostrar la emoción. Respetar el detalle.'],
    photographyCopy:['Warm daylight, generous ivory space and a single cherry accent. Show the whole item clearly before moving closer to texture. Editorial images should feel unhurried and personal.','Luz natural cálida, espacio marfil generoso y un acento cereza. Muestra la pieza completa con claridad antes de acercarte a la textura. Las imágenes editoriales deben sentirse tranquilas y personales.'],
    photographyReal:['Current catalog images are concepts. Before selling, photograph the actual samples, their construction and colors. On-person photography should represent adult women across body types, without reshaping their bodies.','Las imágenes actuales del catálogo son conceptos. Antes de vender, fotografía las muestras reales, su confección y sus colores. La fotografía con modelos debe representar a mujeres adultas de distintos cuerpos, sin alterar sus formas.'],
    downloadManual:['Download working identity v1 · JSON','Descargar identidad v1 de trabajo · JSON'],
    appEyebrow:['06 · THE NEXT CHAPTER','06 · LA PRÓXIMA ETAPA'],
    appTitle:['The same essence.<br><em>A more personal space.</em>','La misma esencia.<br><em>Un espacio más personal.</em>'],
    appCopy:['An early visual direction for the planned Annys Le´ Rose app. The signature, personal rituals and Édition 05 share one intimate space.','Una primera dirección visual para la app prevista de Annys Le´ Rose. La firma, los rituales personales y Édition 05 comparten un espacio íntimo.'],
    appNotice:['Visual concept only. The app and its features are still to be developed.','Solo un concepto visual. La app y sus funciones aún están por desarrollar.'],
    backConcepts:['Explore the concepts','Explorar los conceptos'],
    phoneEyebrow:['YOUR PERSONAL RITUAL','TU RITUAL PERSONAL'], phoneTitle:['A moment,<br><em>just yours.</em>','Un momento,<br><em>solo tuyo.</em>'],
    phonePhotoAlt:['Fragrance and cherry gloss on ivory satin','Perfume y brillo cereza sobre satén marfil'], phoneEdition:['Édition 05 · Annual ritual','Édition 05 · Ritual anual'], phoneDates:['Dates to be announced','Fechas por anunciar'], phoneExplore:['Explore','Explorar'], phoneRituals:['My rituals','Mis rituales'],
    phoneCaption:['App screen direction · Concept preview','Dirección de pantalla de app · Vista conceptual'],
    footer:['A brand in creation. A world of our own.','Una marca en creación. Un universo propio.'], return:['Return to Annys Le´ Rose','Volver a Annys Le´ Rose'],
    metaTitle:['Identity v1 · Brand studio — Annys Le´ Rose','Identidad v1 · Estudio de marca — Annys Le´ Rose'], metaDescription:['Explore the working identity of Annys Le´ Rose: our purpose, signature, color, voice and packaging studies for intimates and beauty.','Explora la identidad de trabajo de Annys Le´ Rose: propósito, firma, color, voz y estudios de empaque para ropa íntima y belleza.']
  };
  const i18n = window.ALRi18n;
  function render() {
    const localeIndex = i18n.language === 'es' ? 1 : 0;
    const translated = key => copy[key]?.[localeIndex] ?? key;
    document.querySelectorAll('[data-brand-i18n]').forEach(element => { element.textContent = translated(element.dataset.brandI18n); });
    // Markup comes only from the local, developer-owned copy above.
    document.querySelectorAll('[data-brand-html]').forEach(element => { element.innerHTML = translated(element.dataset.brandHtml); });
    for (const [selector, attribute, datasetKey] of [['[data-brand-alt]','alt','brandAlt'], ['[data-brand-aria]','aria-label','brandAria']]) {
      document.querySelectorAll(selector).forEach(element => element.setAttribute(attribute, translated(element.dataset[datasetKey])));
    }
    document.title = translated('metaTitle');
    document.querySelector('meta[name="description"]').setAttribute('content', translated('metaDescription'));
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', translated('metaTitle'));
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', translated('metaDescription'));
  }
  i18n.subscribe(render);
  render();
})();
