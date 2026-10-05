'use strict';

// One presentation for static concept pages and the interactive quick view.
// No storage or purchasing logic belongs here; app.js owns those behaviors.
window.ALRproductView = Object.freeze({
  path(product) { return `product-${typeof product === 'string' ? product : product.id}.html`; },
  render(product, {t, language = 'en', page = false, interactive = true, selectedSize = '', selectedColor = product.colors[0].name, favorite = false, allowed = !product.exclusive, unavailableKey = 'edition.pending'} = {}) {
    const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
    const copy = (key, variables) => escape(t(key, variables));
    const name = t(`products.${product.id}.name`);
    const kind = product.variantKind || 'size';
    const clothing = kind === 'size';
    const variant = value => kind === 'set' && value === 'Set' ? t('product.setValue') : value;
    const prompt = clothing ? 'product.sizePrompt' : 'product.formatPrompt';
    const category = kind === 'set' ? 'product.coffretCategory' : `category.${product.category}`;
    const action = !allowed ? unavailableKey : selectedSize ? 'product.addBag' : prompt;
    const disabled = interactive ? '' : ' disabled';
    const image = `<img class="detail-photo" src="${escape(product.image)}" style="object-position:${escape(product.position)}" alt="${copy('product.image', {name})}" width="1024" height="1280"${page ? ' fetchpriority="high"' : ''}>`;
    const photo = page ? `<figure class="concept-visual"><a class="concept-zoom" href="${escape(product.image)}" data-zoom aria-label="${copy('productPage.enlarge', {name})}">${image}<span>${copy('productPage.enlargeShort')} <span aria-hidden="true">↗</span></span></a><figcaption>${copy('productPage.imageNote')}</figcaption></figure>` : image;
    return `<div class="detail-layout${page ? ' concept-layout' : ''}" data-product-id="${product.id}">
      ${photo}
      <div class="detail-copy"><p class="eyebrow">${copy(category)}</p><${page ? 'h1' : 'h2'} id="product-title">${escape(name)}</${page ? 'h1' : 'h2'}>
        <div class="price"><span class="${page ? 'concept-price-label' : 'sr-only'}">${copy('catalog.priceLabel')}: </span>${new Intl.NumberFormat(language === 'en' ? 'en-US' : 'es-US', {style:'currency', currency:'USD'}).format(product.price)}</div>
        <p>${copy(`products.${product.id}.description`)}</p>
        ${page ? `<p class="detail-sample-notice">${copy('productPage.development')}</p>` : ''}
        ${product.exclusive ? `<p class="detail-exclusive-notice">${copy(allowed ? 'edition.windowOpen' : 'edition.unavailable')}</p>` : ''}
        <fieldset class="detail-field"><legend class="detail-label">${copy(product.category === 'fragrance' || kind === 'set' ? 'product.packaging' : clothing ? 'product.color' : 'product.tone')}</legend><div class="choices color-choices">${product.colors.map(color => `<button type="button" class="${selectedColor === color.name ? 'selected' : ''}" data-color="${escape(color.name)}" aria-pressed="${selectedColor === color.name}"${disabled}><span class="swatch" style="--swatch:${color.hex}" aria-hidden="true"></span>${copy(`color.${color.id}`)}</button>`).join('')}</div></fieldset>
        <fieldset class="detail-field"><legend class="detail-label">${copy(clothing ? 'product.size' : kind === 'volume' ? 'product.volume' : 'product.format')} <span id="size-selection" class="selection-hint" aria-live="polite">· ${escape(selectedSize ? variant(selectedSize) : t(prompt))}</span></legend><div class="choices">${product.sizes.map(size => `<button type="button" class="${selectedSize === size ? 'selected' : ''}" data-size="${escape(size)}" aria-pressed="${selectedSize === size}"${disabled}>${escape(variant(size))}</button>`).join('')}</div></fieldset>
        ${clothing ? `<button type="button" class="underlined" data-guide${disabled}>${copy('product.sizeGuide')}</button>` : ''}
        <div class="detail-purchase-actions"><button type="button" class="button" id="add-cart" ${interactive && selectedSize && allowed ? '' : 'disabled'}>${copy(action)}</button><p id="product-feedback" class="small-note dialog-feedback" role="alert" aria-live="assertive" hidden></p><p class="small-note">${copy('product.sample')}</p></div>
        ${page ? `<div class="concept-actions"><button type="button" class="underlined" data-favorite="${product.id}" aria-label="${copy(favorite ? 'product.removeFavorite' : 'product.addFavorite', {name})}" aria-pressed="${favorite}"${disabled}>${copy(favorite ? 'productPage.saved' : 'productPage.save')}</button><button type="button" class="underlined" data-share-product="${product.id}"${disabled}>${copy('productPage.share')}</button></div>` : `<a class="underlined concept-full-link" href="${this.path(product)}">${copy('productPage.viewFull')}</a>`}
        <details${page ? ' open' : ''}><summary>${copy(clothing ? 'product.careTitle' : 'product.formulaTitle')}</summary><p>${copy(`products.${product.id}.fabric`)}</p><p>${copy(clothing ? 'product.care' : 'product.beautyCare')}</p></details>
        ${page && product.exclusive ? `<a class="underlined concept-edition-link" href="index.html#edicion">${copy('productPage.editionLink')}</a>` : ''}
      </div></div>`;
  }
});
