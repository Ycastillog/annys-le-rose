'use strict';
(() => {
  const copy = {
    skip:['Skip to content','Ir al contenido'], back:['Our world','Nuestro universo'],
    eyebrow:['ANNYS LE´ ROSE · BRAND STUDIO','ANNYS LE´ ROSE · ESTUDIO DE MARCA'],
    title:['Your own kind<br>of <em>feminine.</em>','Tu propia forma<br>de <em>ser femenina.</em>'],
    intro:['Lace, scent and gloss. An intimate world taking shape around the freedom to feel feminine your own way.','Encaje, perfume y brillo. Un universo íntimo que toma forma alrededor de la libertad de sentir la feminidad a tu manera.'],
    status:['Brand identity · In development','Identidad de marca · En desarrollo'],
    symbolAlt:['ALR symbol with a curved petal form','Símbolo ALR con forma de pétalo curvo'],
    signature:['One gesture. Three initials. Our signature.','Un gesto. Tres iniciales. Nuestra firma.'],
    nav:['Brand studio sections','Secciones del estudio de marca'],
    navSignature:['The signature','La firma'], navPalette:['The palette','La paleta'], navVoice:['The voice','La voz'], navApp:['The app concept','Concepto de app'],
    signatureEyebrow:['01 · A SIGNATURE OF OUR OWN','01 · UNA FIRMA PROPIA'],
    signatureTitle:['A petal, an initial,<br><em>a quiet presence.</em>','Un pétalo, una inicial,<br><em>una presencia sutil.</em>'],
    signatureCopy:['A curved A opens like a petal. The L and R share a stem. A simple gesture, designed to carry the same identity from a label to a screen.','Una A curva se abre como un pétalo. La L y la R comparten un eje. Un gesto sencillo, pensado para llevar la misma identidad de una etiqueta a una pantalla.'],
    onIvory:['On ivory','Sobre marfil'], onCherry:['On cherry','Sobre cereza'],
    wordmarkRedAlt:['Annys Le Rose signature in cherry red','Firma Annys Le Rose en rojo cereza'], wordmarkIvoryAlt:['Annys Le Rose signature in ivory','Firma Annys Le Rose en marfil'],
    downloadSignature:['Download signature · SVG','Descargar firma · SVG'],
    symbolLabel:['The ALR symbol','El símbolo ALR'], symbolUse:['For labels, packaging and personal details.','Para etiquetas, empaques y detalles personales.'], downloadSymbol:['Download symbol · SVG','Descargar símbolo · SVG'],
    faviconLabel:['A small signature','Una firma pequeña'], faviconUse:['The same gesture at browser size.','El mismo gesto al tamaño del navegador.'], downloadFavicon:['Download favicon · SVG','Descargar favicon · SVG'],
    appIconLabel:['An app icon concept','Un concepto de icono de app'], appIconUse:['A visual direction for the planned app.','Una dirección visual para la app prevista.'], downloadIcon:['Download icon · SVG','Descargar icono · SVG'],
    symbolCare:['Keep the symbol in one color, give it breathing room and preserve its proportions.','Mantén el símbolo en un solo color, dale espacio y conserva sus proporciones.'],
    proofTitle:['The same gesture, at different sizes.','El mismo gesto, en distintos tamaños.'], proofAlt:['App icon concept at 180 pixels','Concepto de icono de app a 180 píxeles'], downloadMono:['Download monochrome symbol · SVG','Descargar símbolo monocromático · SVG'],
    paletteEyebrow:['02 · OUR COLOR STORY','02 · NUESTRA HISTORIA DE COLOR'],
    paletteTitle:['Cherry with character.<br><em>Ivory with ease.</em>','Cereza con carácter.<br><em>Marfil con calma.</em>'],
    paletteCopy:['Cherry leads. Ivory makes space. Blush, rose and champagne bring warmth, while deep ink keeps every word clear.','El cereza protagoniza. El marfil crea espacio. Rosa pálido, rosa suave y champán aportan calidez; la tinta profunda mantiene cada palabra clara.'],
    cherry:['Cherry','Cereza'], ivory:['Warm ivory','Marfil cálido'], blush:['Blush','Rosa pálido'], rose:['Dusty rose','Rosa suave'], champagne:['Champagne','Champán'], ink:['Deep ink','Tinta profunda'],
    serifUse:['Editorial headlines and the signature. Expressive, graceful, with room to breathe.','Titulares editoriales y la firma. Expresiva, elegante y con espacio para respirar.'],
    sansUse:['Navigation, product details and everyday reading. A clear companion to the expressive serif.','Navegación, detalles de productos y lectura cotidiana. Un complemento claro para la tipografía expresiva con remates.'],
    fontReference:['Typeface references and licenses:','Referencias tipográficas y licencias:'],
    downloadReference:['Download identity reference · JSON','Descargar referencia de identidad · JSON'],
    voiceEyebrow:['03 · THE WAY WE SPEAK','03 · NUESTRA FORMA DE HABLAR'],
    voiceTitle:['Warm. Assured.<br><em>Always personal.</em>','Cálida. Segura.<br><em>Siempre personal.</em>'],
    voiceCopy:['We speak to you with warmth and clarity. Your choices, your comfort and your way of being feminine lead the conversation.','Te hablamos con calidez y claridad. Tus elecciones, tu comodidad y tu forma de ser femenina guían la conversación.'],
    voiceOne:['Invite choice.','Invitar a elegir.'], voiceOneCopy:['“Find your own ritual.” A clear invitation to make it personal.','“Encuentra tu propio ritual.” Una invitación a hacerlo tuyo.'],
    voiceTwo:['Make the details clear.','Aclarar los detalles.'], voiceTwoCopy:['Use simple words for fit, shade and format. Be clear about what is a concept and what is confirmed.','Usar palabras sencillas para el ajuste, el tono y la presentación. Distinguir con claridad los conceptos de los detalles confirmados.'],
    voiceThree:['Leave room for you.','Dejar espacio para ti.'], voiceThreeCopy:['Soft, bold, quiet or expressive. There is room for every side of you.','Suave, atrevida, serena o expresiva. Hay espacio para cada versión de ti.'],
    brandLine:['Your own kind of feminine.','Tu propia forma de ser femenina.'],
    appEyebrow:['04 · THE NEXT CHAPTER','04 · LA PRÓXIMA ETAPA'],
    appTitle:['The same essence.<br><em>A more personal space.</em>','La misma esencia.<br><em>Un espacio más personal.</em>'],
    appCopy:['An early visual direction for the planned Annys Le´ Rose app. The signature, personal rituals and Édition 05 share one intimate space.','Una primera dirección visual para la app prevista de Annys Le´ Rose. La firma, los rituales personales y Édition 05 comparten un espacio íntimo.'],
    appNotice:['Visual concept only. The app and its features are still to be developed.','Solo un concepto visual. La app y sus funciones aún están por desarrollar.'],
    backConcepts:['Explore the concepts','Explorar los conceptos'],
    phoneEyebrow:['YOUR PERSONAL RITUAL','TU RITUAL PERSONAL'], phoneTitle:['A moment,<br><em>just yours.</em>','Un momento,<br><em>solo tuyo.</em>'],
    phonePhotoAlt:['Fragrance and cherry gloss on ivory satin','Perfume y brillo cereza sobre satén marfil'], phoneEdition:['Édition 05 · Annual ritual','Édition 05 · Ritual anual'], phoneDates:['Dates to be announced','Fechas por anunciar'], phoneExplore:['Explore','Explorar'], phoneRituals:['My rituals','Mis rituales'],
    phoneCaption:['App screen direction · Concept preview','Dirección de pantalla de app · Vista conceptual'],
    footer:['A brand in creation. A world of our own.','Una marca en creación. Un universo propio.'], return:['Return to Annys Le´ Rose','Volver a Annys Le´ Rose'],
    metaTitle:['Brand studio — Annys Le´ Rose','Estudio de marca — Annys Le´ Rose'], metaDescription:['Explore the visual direction of Annys Le´ Rose: a signature, a color story, a voice and a future app concept.','Explora la dirección visual de Annys Le´ Rose: una firma, una historia de color, una voz y un concepto de futura app.']
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
