'use strict';
(() => {
  const copy = {
    skip:['Skip to content','Ir al contenido'], navigation:['Main navigation','Navegación principal'],
    brandStudio:['Our identity','Nuestra identidad'], catalog:['All concepts','Todos los conceptos'],
    eyebrow:['THE FIRST CAPSULE · A CREATIVE PROPOSAL','LA PRIMERA CÁPSULA · UNA PROPUESTA CREATIVA'],
    title:['A moment<br>of <em>your own.</em>','Un momento<br><em>para ti.</em>'],
    intro:['The layer you reach for. A scent that feels personal. A little cherry on your lips. Six starting points for making an everyday moment yours.','Esa prenda que eliges. Un perfume que sientes tuyo. Un toque cereza en tus labios. Seis puntos de partida para hacer tuyo un momento cotidiano.'],
    explore:['Meet the six concepts','Conoce los seis conceptos'],
    status:['Working title and proposed selection. Materials, formulas and fit are still to be developed and validated with physical samples. Not available for purchase.','Nombre de trabajo y selección propuesta. Materiales, fórmulas y ajuste aún deben desarrollarse y validarse con muestras físicas. No disponibles para comprar.'],
    heroAlt:['Cherry red lace bodysuit, a concept image','Body de encaje rojo cereza, imagen conceptual'],
    imageNote:['Concept imagery · A direction taking shape','Imágenes conceptuales · Una dirección que toma forma'],
    direction:['Capsule direction','Dirección de la cápsula'],
    principle:['Intimate clothing at the heart.\nScent and gloss as personal finishing touches.','La ropa íntima en el centro.\nPerfume y brillo como toques personales.'],
    palette:['Cherry · Ivory · Blush','Cereza · Marfil · Rosa suave'],
    clothingEyebrow:['01—04 · THE INTIMATE LAYERS','01—04 · LAS CAPAS ÍNTIMAS'],
    clothingTitle:['Four ways<br>to <em>feel like you.</em>','Cuatro formas<br>de <em>sentirte tú.</em>'],
    clothingCopy:['A bold signature, a quiet foundation and two ideas for winding down. Four clothing concepts anchor this proposed capsule.','Una firma con carácter, una base serena y dos ideas para descansar. Cuatro conceptos de ropa dan forma a esta propuesta de cápsula.'],
    cherryAlt:['Cherry red lace bodysuit concept','Concepto de body de encaje rojo cereza'],
    cherryRole:['THE SIGNATURE','LA FIRMA'],
    cherryIntent:['The cherry red starting point: an expressive silhouette to give the capsule its character.','El punto de partida rojo cereza: una silueta expresiva para darle carácter a la cápsula.'],
    ivoryAlt:['Ivory bralette concept','Concepto de bralette marfil'],
    ivoryRole:['THE EVERYDAY FOUNDATION','LA BASE COTIDIANA'],
    ivoryIntent:['A quieter counterpoint to Cherry, bringing warm ivory and simple lines into the same story.','Un contrapunto sereno a Cherry, que suma marfil cálido y líneas sencillas a la misma historia.'],
    luneAlt:['Blush pink Lune camisole concept','Concepto de camisola Lune en rosa suave'],
    luneRole:['THE MOMENT TO UNWIND','EL MOMENTO DE DESCANSAR'],
    luneIntent:['An idea for slowing down, with blush and a satin direction that connect intimate wear and lounge.','Una idea para bajar el ritmo, con rosa suave y una dirección de satén que conecta la ropa íntima con el descanso.'],
    robeAlt:['Blush pink satin robe concept with a tie belt','Concepto de bata de satén rosa suave con cinturón'],
    robeRole:['THE LAST LAYER','LA ÚLTIMA CAPA'],
    robeIntent:['A wrapping silhouette imagined alongside Lune, completing the clothing story in the same blush mood.','Una silueta envolvente pensada junto a Lune, para completar la propuesta de ropa en la misma gama rosa.'],
    view:['Explore the concept','Explorar el concepto'],
    beautyEyebrow:['05—06 · THE FINISHING TOUCHES','05—06 · LOS TOQUES PERSONALES'],
    beautyTitle:['A scent.<br><em>A little cherry.</em>','Un perfume.<br><em>Un toque cereza.</em>'],
    beautyCopy:['Two beauty directions accompany the clothing. Personal gestures to explore, with formulas and final finishes still to be confirmed.','Dos direcciones de belleza acompañan la ropa. Gestos personales para explorar, con fórmulas y acabados finales aún por confirmar.'],
    perfumeAlt:['Rose Veil fragrance concept in a pink bottle with an ivory cap','Concepto de perfume Rose Veil en frasco rosa con tapa marfil'],
    perfumeRole:['THE SCENT DIRECTION','LA DIRECCIÓN OLFATIVA'],
    perfumeIntent:['A proposed floral direction that translates the capsule’s intimate mood into scent.','Una dirección floral propuesta para traducir el carácter íntimo de la cápsula en un perfume.'],
    glossAlt:['Cherry Kiss lip gloss concept','Concepto de brillo de labios Cherry Kiss'],
    glossRole:['THE COLOR ECHO','EL ECO DEL COLOR'],
    glossIntent:['A translucent cherry color proposal, echoing the capsule’s signature red in one small gesture.','Una propuesta de cereza translúcido que retoma el rojo de la cápsula en un pequeño gesto.'],
    editionAlt:['Conceptual red ALR Édition 05 coffret containing fragrance and lip gloss','Cofre conceptual rojo ALR Édition 05 con perfume y brillo de labios'],
    editionCaption:['A proposed annual chapter · Separate from the first capsule','Una propuesta de capítulo anual · Independiente de la primera cápsula'],
    annualTitle:['The cherry<br><em>ritual.</em>','El ritual<br><em>cereza.</em>'],
    annualCopy:['The proposed theme for our annual edition: cherry red, a deeper scent direction and a touch of gloss, brought together in a dedicated coffret.','El tema propuesto para nuestra edición anual: rojo cereza, una dirección olfativa más profunda y un toque de brillo, reunidos en un cofre propio.'],
    annualFrequencyLabel:['The rhythm','El ritmo'], annualFrequency:['Five calendar days, once a year','Cinco días de calendario, una vez al año'],
    annualDateLabel:['The opening','La apertura'], annualDate:['Dates to be announced','Fechas por anunciar'],
    annualNote:['A creative proposal awaiting samples and validation. The preview is available year-round; sales and reservations are not open.','Una propuesta creativa pendiente de muestras y validación. La vista previa está disponible todo el año; las ventas y reservas aún no están abiertas.'],
    annualExplore:['Explore the coffret concept','Explorar el concepto de cofre'],
    nextEyebrow:['FROM AN IDEA TO SOMETHING REAL','DE UNA IDEA A ALGO REAL'],
    nextTitle:['First, listen.<br><em>Then, make.</em>','Primero, escuchar.<br><em>Después, crear.</em>'],
    nextCopy:['This selection is a starting point for conversations and physical samples. What belongs together, how each piece feels and which details matter will shape the capsule as it develops.','Esta selección es un punto de partida para conversaciones y muestras físicas. Qué piezas conectan entre sí, cómo se sienten y qué detalles importan darán forma a la cápsula durante su desarrollo.'],
    allConcepts:['Explore all 16 concepts','Explorar los 16 conceptos'], identityLink:['Discover our identity','Descubrir nuestra identidad'],
    footer:['Your own kind of feminine.','Tu propia forma de ser femenina.'], footerNote:['Brand in development · Concept imagery · No products available for purchase','Marca en desarrollo · Imágenes conceptuales · Sin productos disponibles para comprar'],
    return:['Return to Annys Le´ Rose','Volver a Annys Le´ Rose'],
    metaTitle:['The first capsule — Annys Le´ Rose','La primera cápsula — Annys Le´ Rose'],
    metaDescription:['A moment of your own: six proposed concepts bringing intimate clothing, scent and gloss into the first Annys Le´ Rose capsule.','Un momento para ti: seis conceptos propuestos que reúnen ropa íntima, perfume y brillo en la primera cápsula de Annys Le´ Rose.']
  };
  const i18n = window.ALRi18n;
  function render() {
    const localeIndex = i18n.language === 'es' ? 1 : 0;
    const translated = key => copy[key]?.[localeIndex] ?? key;
    document.querySelectorAll('[data-capsule-i18n]').forEach(element => { element.textContent = translated(element.dataset.capsuleI18n); });
    // Only this local, developer-owned dictionary supplies translated markup.
    document.querySelectorAll('[data-capsule-html]').forEach(element => { element.innerHTML = translated(element.dataset.capsuleHtml); });
    for (const [selector, attribute, datasetKey] of [['[data-capsule-alt]', 'alt', 'capsuleAlt'], ['[data-capsule-aria]', 'aria-label', 'capsuleAria']]) {
      document.querySelectorAll(selector).forEach(element => { element.setAttribute(attribute, translated(element.dataset[datasetKey])); });
    }
    document.title = translated('metaTitle');
    document.querySelector('meta[name="description"]').setAttribute('content', translated('metaDescription'));
    document.querySelector('meta[property="og:title"]').setAttribute('content', translated('metaTitle'));
    document.querySelector('meta[property="og:description"]').setAttribute('content', translated('metaDescription'));
  }
  i18n.subscribe(render);
  render();
})();
