'use strict';

const i18n = window.ALRi18n;
const t = (key, variables) => i18n.t(key, variables);
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
const text = (key, variables) => escapeHTML(t(key, variables));
const money = amount => new Intl.NumberFormat(i18n.language === 'en' ? 'en-US' : 'es-US', {style:'currency', currency:'USD'}).format(amount);

// IDs, category keys and legacy color names stay independent of the display language.
const colors = {
  cherry: {id:'cherry', name:'Rojo cereza', hex:'#bc1534'},
  black: {id:'black', name:'Negro', hex:'#292327'},
  blush: {id:'blush', name:'Rosa suave', hex:'#d69aa6'}
};
const products = [
  {id:'rose', category:'lingerie', price:58, image:'assets/editorial.jpg', position:'78% center', colors:[colors.cherry]},
  {id:'noir', category:'lingerie', price:62, image:'assets/noir.jpg', position:'center', colors:[colors.black]},
  {id:'lune', category:'lounge', price:72, image:'assets/lune.jpg', position:'center', colors:[colors.blush]},
  {id:'rose-bra', category:'essentials', price:38, image:'assets/editorial.jpg', position:'80% 35%', colors:[colors.cherry]},
  {id:'noir-brief', category:'essentials', price:24, image:'assets/noir.jpg', position:'center bottom', colors:[colors.black]},
  {id:'lune-top', category:'lounge', price:44, image:'assets/lune.jpg', position:'center top', colors:[colors.blush]}
].map(product => ({...product, sizes:['XS','S','M','L','XL','XXL']}));
const productById = new Map(products.map(product => [product.id, product]));
const productText = (product, field) => t(`products.${product.id}.${field}`);
const colorName = color => t(`color.${color.id}`);
const categoryAliases = {Todo:'all', 'Lencería':'lingerie', Esenciales:'essentials', Descanso:'lounge', Favoritos:'favorites'};
const normalizeCategory = value => categoryAliases[value] || value;
const normalizeSearch = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase(i18n.language).trim();

function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

const savedFavorites = readStorage('alr-favorites', []);
const favorites = new Set(Array.isArray(savedFavorites) ? savedFavorites.filter(id => productById.has(id)) : []);
const savedCart = readStorage('alr-cart', []);
let cart = Array.isArray(savedCart) ? savedCart.filter(line => {
  const product = line && productById.get(line.id);
  return product && product.sizes.includes(line.size) && product.colors.some(color => color.name === line.color) && Number.isInteger(line.quantity) && line.quantity > 0 && line.quantity <= 10;
}).map(({id, size, color, quantity}) => ({id, size, color, quantity})) : [];
let category = 'all';
let query = '';
let sort = 'featured';
let activeProduct = null;
let selectedSize = '';
let selectedColor = '';
let infoType = 'sizes';
let infoReturn = null;
const rememberedChoices = new Map();
const dialogTriggers = new WeakMap();
const suppressedClosures = new WeakMap();
let toastTimer;
let currentToastKey = null;

function persist() {
  try {
    localStorage.setItem('alr-favorites', JSON.stringify([...favorites]));
    localStorage.setItem('alr-cart', JSON.stringify(cart));
  } catch { toast('toast.localOnly'); }
  updateCounts();
}

function updateCounts() {
  const count = cart.reduce((total, line) => total + line.quantity, 0);
  $('#cart-count').textContent = count;
  $('#cart-count').hidden = count === 0;
  $('#favorite-count').textContent = favorites.size;
  $('#favorite-count').hidden = favorites.size === 0;
}

function toast(key) {
  currentToastKey = key;
  refreshFeedback();
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { currentToastKey = null; refreshFeedback(); }, 3500);
}

function refreshFeedback() {
  const dialog = $('dialog[open]');
  const region = dialog?.querySelector('.dialog-feedback') || $('#toast');
  [...$$('.dialog-feedback'), $('#toast')].forEach(element => {
    element.hidden = true;
    element.textContent = '';
  });
  if (!currentToastKey) return;
  // Native modal dialogs make the rest of the document inert. Announce feedback
  // inside their top layer, then use the global status when a dialog closes.
  if (dialog && region === $('#toast')) return;
  const key = currentToastKey;
  region.setAttribute('role', key.startsWith('errors.') ? 'alert' : 'status');
  region.setAttribute('aria-live', key.startsWith('errors.') ? 'assertive' : 'polite');
  region.hidden = false;
  // A fresh mutation also announces a repeated error with identical text.
  setTimeout(() => {
    if (region.isConnected && currentToastKey === key && !region.hidden) region.textContent = t(key);
  }, 0);
}

function focusReference(element = document.activeElement) {
  if (!(element instanceof HTMLElement)) return null;
  let selector = element.id ? `#${CSS.escape(element.id)}` : null;
  if (!selector) {
    for (const attribute of ['data-favorite', 'data-product', 'data-size', 'data-color', 'data-guide', 'data-info', 'data-quantity', 'data-remove']) {
      if (!element.hasAttribute(attribute)) continue;
      selector = `[${attribute}="${CSS.escape(element.getAttribute(attribute))}"]`;
      if (attribute === 'data-quantity') selector += `[data-delta="${CSS.escape(element.dataset.delta)}"]`;
      break;
    }
  }
  return {element, selector};
}

function restoreFocus(reference, fallback = '#cart-toggle') {
  const element = reference?.element?.isConnected ? reference.element : reference?.selector ? $(reference.selector) : null;
  (element || $(fallback))?.focus({preventScroll:true});
}

function renderProducts() {
  const focus = $('#product-grid').contains(document.activeElement) ? focusReference() : null;
  const search = normalizeSearch(query);
  let list = products.filter(product => {
    const categoryMatches = category === 'all' || (category === 'favorites' ? favorites.has(product.id) : product.category === category);
    // Search both languages so the same query still finds a piece after a switch.
    const searchText = ['es','en'].map(locale => [
      i18n.t(`products.${product.id}.name`, {}, locale),
      i18n.t(`category.${product.category}`, {}, locale),
      i18n.t(`products.${product.id}.description`, {}, locale),
      ...product.colors.map(color => i18n.t(`color.${color.id}`, {}, locale))
    ].join(' ')).join(' ');
    return categoryMatches && normalizeSearch(searchText).includes(search);
  });
  if (sort === 'low') list.sort((a, b) => a.price - b.price);
  if (sort === 'high') list.sort((a, b) => b.price - a.price);
  const resultCount = t(list.length === 1 ? 'catalog.piece' : 'catalog.pieces', {count:list.length});
  $('#results-count').textContent = resultCount;
  if ($('#search-results-status')) $('#search-results-status').textContent = resultCount;
  $('#catalog-empty').hidden = list.length > 0;
  $('#empty-text').textContent = t(category === 'favorites' ? 'catalog.emptyFavorites' : 'catalog.emptySearch');
  $('#product-grid').innerHTML = list.map(product => {
    const name = productText(product, 'name');
    const favorite = favorites.has(product.id);
    return `<article class="product-card">
      <div class="product-image" data-product-id="${product.id}">
        <button class="product-open" data-product="${product.id}" aria-label="${text('product.view', {name})}"><img src="${product.image}" style="object-position:${product.position}" alt="${text('product.image', {name})}" loading="lazy" decoding="async" width="1024" height="1280"></button>
        <span class="product-badge">${escapeHTML(productText(product, 'badge'))}</span>
        <button class="favorite-button" data-favorite="${product.id}" aria-label="${text(favorite ? 'product.removeFavorite' : 'product.addFavorite', {name})}" aria-pressed="${favorite}"><span aria-hidden="true">${favorite ? '♥' : '♡'}</span></button>
        <button class="quick-view" data-product="${product.id}">${text('product.chooseSize')}</button>
      </div>
      <div class="product-title-row"><h3><button class="product-title-button" data-product="${product.id}">${escapeHTML(name)}</button></h3><span>${money(product.price)}</span></div>
      <p class="product-description">${text(`category.${product.category}`)} · ${product.sizes[0]}–${product.sizes.at(-1)}</p>
      <div class="swatches">${product.colors.map(color => `<span class="swatch" style="--swatch:${color.hex}" aria-hidden="true"></span>`).join('')}<span>${escapeHTML(colorName(product.colors[0]))}</span></div>
    </article>`;
  }).join('');
  $$('[data-filter]').forEach(button => {
    const active = normalizeCategory(button.dataset.filter) === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (focus) restoreFocus(focus, '#reset-filter');
}

function closeNavigation() {
  $('#navigation').classList.remove('open');
  $('#menu-toggle').setAttribute('aria-expanded', 'false');
  $('#menu-toggle').setAttribute('aria-label', t('menu.open'));
}

function setCategory(value) {
  const next = normalizeCategory(value);
  if (!['all', 'lingerie', 'essentials', 'lounge', 'favorites'].includes(next)) return;
  category = next;
  renderProducts();
  closeNavigation();
}

function openDialog(dialog, trigger = document.activeElement) {
  if (dialog.open) return;
  $$('dialog[open]').forEach(other => {
    suppressedClosures.set(other, (suppressedClosures.get(other) || 0) + 1);
    other.close();
  });
  dialogTriggers.set(dialog, trigger?.element ? trigger : focusReference(trigger));
  document.body.classList.add('modal-open');
  dialog.showModal();
  refreshFeedback();
}

function renderProductDetail() {
  if (!activeProduct) return;
  const product = activeProduct;
  const name = productText(product, 'name');
  $('#product-detail').innerHTML = `<div class="detail-layout" data-product-id="${product.id}">
    <img class="detail-photo" src="${product.image}" style="object-position:${product.position}" alt="${text('product.image', {name})}" width="1024" height="1280">
    <div class="detail-copy"><p class="eyebrow">${text(`category.${product.category}`)}</p><h2 id="product-title">${escapeHTML(name)}</h2><div class="price">${money(product.price)}</div><p>${escapeHTML(productText(product, 'description'))}</p>
      <fieldset class="detail-field"><legend class="detail-label">${text('product.color')}</legend><div class="choices color-choices">${product.colors.map(color => `<button class="${selectedColor === color.name ? 'selected' : ''}" data-color="${color.name}" aria-pressed="${selectedColor === color.name}"><span class="swatch" style="--swatch:${color.hex}" aria-hidden="true"></span>${escapeHTML(colorName(color))}</button>`).join('')}</div></fieldset>
      <fieldset class="detail-field"><legend class="detail-label">${text('product.size')} <span id="size-selection" class="selection-hint" aria-live="polite">· ${selectedSize || text('product.sizePrompt')}</span></legend><div class="choices">${product.sizes.map(size => `<button class="${selectedSize === size ? 'selected' : ''}" data-size="${size}" aria-pressed="${selectedSize === size}">${size}</button>`).join('')}</div></fieldset>
      <button class="underlined" data-guide>${text('product.sizeGuide')}</button>
      <div class="detail-purchase-actions"><button class="button" id="add-cart" ${selectedSize ? '' : 'disabled'}>${text(selectedSize ? 'product.addBag' : 'product.sizePrompt')}</button><p id="product-feedback" class="small-note dialog-feedback" role="alert" aria-live="assertive" hidden></p><p class="small-note">${text('product.sample')}</p></div>
      <details><summary>${text('product.careTitle')}</summary><p>${escapeHTML(productText(product, 'fabric'))}</p><p>${text('product.care')}</p></details>
    </div></div>`;
  refreshFeedback();
}

function openProduct(id, trigger) {
  const product = productById.get(id);
  if (!product) return;
  activeProduct = product;
  const previous = rememberedChoices.get(id);
  selectedSize = previous?.size || '';
  selectedColor = previous?.color || product.colors[0].name;
  renderProductDetail();
  openDialog($('#product-dialog'), trigger);
}

function selectionError(key) {
  const error = new Error(t(key));
  error.translationKey = key;
  return error;
}

function addToCart(id, size, colorValue, quantity = 1) {
  const product = productById.get(id);
  const color = product?.colors.find(candidate => candidate.name === colorValue || candidate.id === colorValue || colorName(candidate) === colorValue);
  if (!product || !product.sizes.includes(size) || !color || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw selectionError('errors.selection');
  const existing = cart.find(line => line.id === id && line.size === size && line.color === color.name);
  if (existing && existing.quantity + quantity > 10) throw selectionError('errors.quantity');
  if (existing) existing.quantity += quantity;
  else cart.push({id, size, color:color.name, quantity});
  rememberedChoices.set(id, {size, color:color.name});
  persist();
  renderCart();
  return {items:cart.reduce((total, line) => total + line.quantity, 0), subtotal:cartSubtotal()};
}

function cartSubtotal() {
  return cart.reduce((total, line) => total + productById.get(line.id).price * line.quantity, 0);
}

function lineColor(product, line) {
  return colorName(product.colors.find(color => color.name === line.color));
}

function renderCart() {
  if (!cart.length) {
    $('#cart-items').innerHTML = `<p id="cart-feedback" class="small-note dialog-feedback" role="status" aria-live="polite" hidden></p><div class="cart-empty"><h3>${text('bag.emptyTitle')}</h3><p>${text('bag.emptyCopy')}</p><button class="button" data-continue>${text('bag.explore')}</button></div>`;
    $('#cart-summary').innerHTML = '';
    refreshFeedback();
    return;
  }
  $('#cart-items').innerHTML = cart.map((line, index) => {
    const product = productById.get(line.id);
    const name = productText(product, 'name');
    return `<article class="cart-line"><img src="${product.image}" style="object-position:${product.position}" alt="${escapeHTML(name)}" width="85" height="110"><div>
      <h3>${escapeHTML(name)}</h3><p>${escapeHTML(lineColor(product, line))} · ${text('bag.size', {size:line.size})}</p>
      <p class="bag-unit-price">${text('bag.unitPrice', {price:money(product.price)})}</p><strong class="cart-line-price" aria-label="${text('bag.linePrice')}">${money(product.price * line.quantity)}</strong>
      <div class="line-controls"><button data-quantity="${index}" data-delta="-1" aria-label="${text('bag.decrease', {name})}">−</button><span aria-label="${text('bag.quantity', {count:line.quantity})}">${line.quantity}</span><button data-quantity="${index}" data-delta="1" ${line.quantity >= 10 ? 'disabled' : ''} aria-label="${text('bag.increase', {name})}">+</button><button class="remove" data-remove="${index}" aria-label="${text('bag.removeLabel', {name})}">${text('bag.remove')}</button></div>
      </div></article>`;
  }).join('') + '<p id="cart-feedback" class="small-note dialog-feedback" role="status" aria-live="polite" hidden></p>';
  $('#cart-summary').innerHTML = `<div class="cart-total"><span>${text('bag.subtotal')}</span><strong>${money(cartSubtotal())}</strong></div><p>${text('bag.samplePrices')}</p><button class="button" id="review-order">${text('bag.review')}</button><p>${text('bag.paymentsDisabled')}</p>`;
  refreshFeedback();
}

function openCart(trigger) {
  renderCart();
  openDialog($('#cart-dialog'), trigger);
}

function renderInfo() {
  const sizes = [['XS','78–83','60–65','84–89'], ['S','84–89','66–71','90–95'], ['M','90–95','72–77','96–101'], ['L','96–103','78–85','102–109'], ['XL','104–111','86–93','110–117'], ['XXL','112–119','94–101','118–125']];
  const content = {
    sizes: () => `<p class="eyebrow">${text('sizes.eyebrow')}</p><h2 id="info-title">${t('sizes.title')}</h2><p>${text('sizes.intro')}</p><div class="table-scroll"><table aria-label="${text('sizes.table')}"><thead><tr>${['size','bust','waist','hips'].map(field => `<th scope="col">${text(`sizes.${field}`)}</th>`).join('')}</tr></thead><tbody>${sizes.map(row => `<tr><th scope="row">${row[0]}</th>${row.slice(1).map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>${text('sizes.measure')}</p>${infoReturn === 'product' ? `<div class="info-actions"><button class="button secondary" id="back-to-product">${text('sizes.back')}</button></div>` : ''}`,
    shipping: () => `<h2 id="info-title">${text('shipping.title')}</h2><p>${text('shipping.intro')}</p><p>${text('shipping.copy')}</p>`,
    privacy: () => `<h2 id="info-title">${text('privacy.title')}</h2><p>${text('privacy.intro')}</p><p>${text('privacy.copy')}</p><button class="button secondary" id="clear-data">${text('privacy.clear')}</button>`,
    review: () => `<p class="eyebrow">${text('review.eyebrow')}</p><h2 id="info-title">${t('review.title')}</h2><div>${cart.map(line => { const product = productById.get(line.id); return `<p>${escapeHTML(productText(product, 'name'))}<br>${escapeHTML(lineColor(product, line))} · ${text('bag.size', {size:line.size})} · ${text(line.quantity === 1 ? 'review.unit' : 'review.units', {count:line.quantity})}</p>`; }).join('')}</div><div class="cart-total"><span>${text('review.subtotal')}</span><strong>${money(cartSubtotal())}</strong></div><p>${text('review.notice')}</p><button class="button" id="back-to-bag">${text('review.back')}</button>`
  };
  $('#info-content').innerHTML = (content[infoType] || content.sizes)() + '<p class="small-note dialog-feedback" role="status" aria-live="polite" hidden></p>';
  refreshFeedback();
}

function showInfo(type, returnTo = null, trigger) {
  infoType = type;
  infoReturn = returnTo;
  renderInfo();
  openDialog($('#info-dialog'), trigger);
}

function updateSize() {
  $$('[data-size]').forEach(button => {
    const selected = button.dataset.size === selectedSize;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  $('#size-selection').textContent = `· ${selectedSize}`;
  $('#add-cart').disabled = false;
  $('#add-cart').textContent = t('product.addBag');
  rememberedChoices.set(activeProduct.id, {size:selectedSize, color:selectedColor});
}

document.addEventListener('click', event => {
  const button = event.target.closest('button,a');
  if (!button) return;
  if (button.dataset.product) { openProduct(button.dataset.product, button); return; }
  if (button.dataset.favorite) {
    const id = button.dataset.favorite;
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    persist();
    renderProducts();
    return;
  }
  if (button.dataset.filter) { setCategory(button.dataset.filter); return; }
  if (button.dataset.category) { setCategory(button.dataset.category); return; }
  if (button.classList.contains('close-dialog')) { button.closest('dialog').close(); return; }
  if (button.dataset.info) { showInfo(button.dataset.info, null, button); return; }
  if (button.hasAttribute('data-guide')) { showInfo('sizes', 'product', button); return; }
  if (button.dataset.size && activeProduct) { selectedSize = button.dataset.size; updateSize(); return; }
  if (button.dataset.color && activeProduct) {
    selectedColor = button.dataset.color;
    $$('[data-color]').forEach(choice => {
      const selected = choice.dataset.color === selectedColor;
      choice.classList.toggle('selected', selected);
      choice.setAttribute('aria-pressed', String(selected));
    });
    rememberedChoices.set(activeProduct.id, {size:selectedSize, color:selectedColor});
    return;
  }
  if (button.id === 'add-cart') {
    try { addToCart(activeProduct.id, selectedSize, selectedColor); $('#product-dialog').close(); toast('toast.added'); }
    catch (error) { toast(error.translationKey || 'errors.selection'); }
    return;
  }
  if (button.dataset.quantity !== undefined || button.dataset.remove !== undefined) {
    const reference = focusReference(button);
    const index = Number(button.dataset.quantity ?? button.dataset.remove);
    const line = cart[index];
    if (!line) return;
    const remove = button.dataset.remove !== undefined || (button.dataset.delta === '-1' && line.quantity === 1);
    if (remove) { cart.splice(index, 1); toast('toast.removed'); }
    else line.quantity = Math.max(1, Math.min(10, line.quantity + Number(button.dataset.delta)));
    persist();
    renderCart();
    restoreFocus(reference, cart.length ? '#review-order' : '[data-continue]');
    return;
  }
  if (button.hasAttribute('data-continue')) {
    $('#cart-dialog').close();
    setCategory('all');
    $('#coleccion').scrollIntoView({behavior:'smooth'});
    return;
  }
  if (button.id === 'review-order') { showInfo('review', 'cart', button); return; }
  if (button.id === 'back-to-bag' || button.id === 'back-to-product') { $('#info-dialog').close(); return; }
  if (button.id === 'clear-data') {
    cart = [];
    favorites.clear();
    persist();
    renderProducts();
    $('#info-dialog').close();
    toast('toast.cleared');
  }
});

$('#cart-toggle').addEventListener('click', event => openCart(event.currentTarget));
$('#favorites-toggle').addEventListener('click', () => { setCategory('favorites'); $('#coleccion').scrollIntoView({behavior:'smooth'}); });
$('#sort').addEventListener('change', event => { sort = event.target.value; renderProducts(); });
$('#search-toggle').addEventListener('click', () => {
  const hidden = !$('#search-bar').hidden;
  $('#search-bar').hidden = hidden;
  $('#search-toggle').setAttribute('aria-expanded', String(!hidden));
  if (!hidden) $('#search').focus({preventScroll:true});
});
$('#search-close').addEventListener('click', () => {
  $('#search-bar').hidden = true;
  $('#search-toggle').setAttribute('aria-expanded', 'false');
  $('#search-toggle').focus({preventScroll:true});
});
$('#search').addEventListener('input', event => { query = event.target.value; renderProducts(); });
$('#search').addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.preventDefault(); $('#search-close').click(); }
  if (event.key === 'Enter') { event.preventDefault(); $('#coleccion').scrollIntoView({behavior:'smooth'}); }
});
$('#reset-filter').addEventListener('click', () => { query = ''; $('#search').value = ''; setCategory('all'); });
$('#menu-toggle').addEventListener('click', () => {
  const open = $('#navigation').classList.toggle('open');
  $('#menu-toggle').setAttribute('aria-expanded', String(open));
  $('#menu-toggle').setAttribute('aria-label', t(open ? 'menu.close' : 'menu.open'));
});
$('#navigation').addEventListener('click', event => { if (event.target.closest('a')) closeNavigation(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && $('#navigation').classList.contains('open')) { closeNavigation(); $('#menu-toggle').focus({preventScroll:true}); }
});
['#size-guide','#size-guide-bottom'].forEach(selector => $(selector).addEventListener('click', event => showInfo('sizes', null, event.currentTarget)));

$$('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    const suppressed = suppressedClosures.get(dialog) || 0;
    if (suppressed) { suppressedClosures.set(dialog, suppressed - 1); return; }
    if (dialog.id === 'info-dialog' && infoReturn) {
      const target = infoReturn;
      infoReturn = null;
      if (target === 'product' && activeProduct) {
        renderProductDetail();
        // Keep the original catalog trigger for the product dialog's eventual close.
        const originalTrigger = dialogTriggers.get($('#product-dialog'));
        openDialog($('#product-dialog'), originalTrigger);
        $('[data-guide]')?.focus({preventScroll:true});
      } else if (target === 'cart') {
        const originalTrigger = dialogTriggers.get($('#cart-dialog'));
        openCart(originalTrigger);
        $('#review-order')?.focus({preventScroll:true});
      }
      return;
    }
    if (!$('dialog[open]')) document.body.classList.remove('modal-open');
    refreshFeedback();
    restoreFocus(dialogTriggers.get(dialog));
  });
});

i18n.subscribe(() => {
  const reference = focusReference();
  renderProducts();
  renderCart();
  if (activeProduct) renderProductDetail();
  if ($('#info-dialog').open) renderInfo();
  refreshFeedback();
  $('#menu-toggle').setAttribute('aria-label', t($('#navigation').classList.contains('open') ? 'menu.close' : 'menu.open'));
  restoreFocus(reference, '#language-select');
});

$('#year').textContent = new Date().getFullYear();
renderProducts();
updateCounts();

if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  const tools = [
    {name:'read_sample_catalog', description:'Read the Annys Le Rose sample catalog. Prices and images are conceptual; sales are not enabled.', inputSchema:{type:'object', properties:{}, additionalProperties:false}, annotations:{readOnlyHint:true, untrustedContentHint:false}, execute:() => products.map(product => ({id:product.id, name:productText(product, 'name'), price:product.price, sizes:product.sizes, colors:product.colors.map(colorName)}))},
    {name:'stage_sample_bag', description:'Add a valid sample product, size and color to the visible local bag. This does not place or pay for an order.', inputSchema:{type:'object', properties:{id:{type:'string'}, size:{type:'string'}, color:{type:'string'}, quantity:{type:'integer', minimum:1, maximum:10}}, required:['id','size','color'], additionalProperties:false}, annotations:{readOnlyHint:false, untrustedContentHint:false}, execute:input => {
      if (!input || typeof input !== 'object' || Object.keys(input).some(key => !['id','size','color','quantity'].includes(key))) throw selectionError('errors.input');
      const result = addToCart(input.id, input.size, input.color, input.quantity ?? 1);
      openCart($('#cart-toggle'));
      return result;
    }}
  ];
  for (const tool of tools) {
    try { Promise.resolve(document.modelContext.registerTool(tool, {signal:lifecycle.signal})).catch(() => {}); } catch {}
  }
  window.addEventListener('pagehide', () => lifecycle.abort(), {once:true});
}
