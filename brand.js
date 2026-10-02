'use strict';
(() => {
  const copy = {
    skip:['Skip to content','Ir al contenido'], back:['Our world','Nuestro universo'],
    eyebrow:['ANNYS LE´ ROSE · BRAND STUDIO','ANNYS LE´ ROSE · ESTUDIO DE MARCA'],
    title:['Your own kind<br>of <em>feminine.</em>','Tu propia forma<br>de <em>ser femenina.</em>'],
    intro:['Lace, scent and gloss. A house of intimate rituals, shaped around the freedom to be yourself.','Encaje, aroma y brillo. Una casa de rituales íntimos, creada alrededor de la libertad de ser tú.'],
    status:['Identity direction · In development','Dirección de identidad · En desarrollo'],
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
    appIconLabel:['The future app icon','El futuro icono de la app'], appIconUse:['A visual concept for the next chapter.','Un concepto visual para la próxima etapa.'], downloadIcon:['Download icon · SVG','Descargar icono · SVG'],
    symbolCare:['Keep the symbol in one color, give it breathing room and preserve its proportions.','Mantén el símbolo en un solo color, dale espacio y conserva sus proporciones.'],
    proofTitle:['The same gesture, at different sizes.','El mismo gesto, en distintos tamaños.'], proofAlt:['App icon concept at 180 pixels','Concepto de icono de app a 180 píxeles'], downloadMono:['Download monochrome symbol · SVG','Descargar símbolo monocromático · SVG'],
    paletteEyebrow:['02 · OUR COLOR STORY','02 · NUESTRA HISTORIA DE COLOR'],
    paletteTitle:['Cherry with character.<br><em>Ivory with ease.</em>','Cereza con carácter.<br><em>Marfil con calma.</em>'],
    paletteCopy:['Cherry leads. Ivory makes space. Blush, rose and champagne bring warmth, while deep ink keeps every word clear.','El cereza protagoniza. El marfil crea espacio. Rosa pálido, rosa suave y champán aportan calidez; la tinta profunda mantiene cada palabra clara.'],
    cherry:['Cherry','Cereza'], ivory:['Warm ivory','Marfil cálido'], blush:['Blush','Rosa pálido'], rose:['Dusty rose','Rosa suave'], champagne:['Champagne','Champán'], ink:['Deep ink','Tinta profunda'],
    serifUse:['Editorial headlines and the signature. Expressive, graceful, with room to breathe.','Titulares editoriales y la firma. Expresiva, elegante y con espacio para respirar.'],
    sansUse:['Navigation, product information and everyday reading. Clear at every size.','Navegación, información de productos y lectura cotidiana. Clara en cada tamaño.'],
    fontReference:['Typeface references and licenses:','Referencias tipográficas y licencias:'],
    downloadReference:['Download identity reference · JSON','Descargar referencia de identidad · JSON'],
    voiceEyebrow:['03 · THE WAY WE SPEAK','03 · NUESTRA FORMA DE HABLAR'],
    voiceTitle:['Warm. Assured.<br><em>Always personal.</em>','Cálida. Segura.<br><em>Siempre personal.</em>'],
    voiceCopy:['We invite her to choose. We speak with care, without telling her how a woman should look or feel.','La invitamos a elegir. Hablamos con cuidado, sin decirle cómo debe verse o sentirse una mujer.'],
    voiceOne:["Invite, don't impose.",'Invitar, sin imponer.'], voiceOneCopy:['“Find your own ritual.” Choice comes before perfection.','“Encuentra tu propio ritual.” La elección va antes que la perfección.'],
    voiceTwo:['Make the details clear.','Aclarar los detalles.'], voiceTwoCopy:['Describe the fit, the shade and the feeling in simple words.','Describe el ajuste, el tono y la sensación con palabras sencillas.'],
    voiceThree:['Leave room for her.','Dejar espacio para ella.'], voiceThreeCopy:['One woman, many moods. Our world makes space for them.','Una mujer, muchos estados de ánimo. Nuestro universo les da espacio.'],
    brandLine:['Your own kind of feminine.','Tu propia forma de ser femenina.'],
    appEyebrow:['04 · THE NEXT CHAPTER','04 · LA PRÓXIMA ETAPA'],
    appTitle:['The same essence.<br><em>A more personal space.</em>','La misma esencia.<br><em>Un espacio más personal.</em>'],
    appCopy:['A visual direction for a future Annys Le´ Rose app: the signature, intimate rituals and Édition 05 brought into one quiet space.','Una dirección visual para una futura app de Annys Le´ Rose: la firma, los rituales íntimos y Édition 05 reunidos en un espacio sereno.'],
    appNotice:['Concept preview. The app is not available; this is a visual exploration, without app functions.','Vista conceptual. La app aún no está disponible; esta es una exploración visual, sin funciones de aplicación.'],
    backConcepts:['Explore the sample collection','Explorar el catálogo de muestras'],
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
  }
  i18n.subscribe(render);
  render();
})();
