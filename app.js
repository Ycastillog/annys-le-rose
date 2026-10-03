'use strict';

const i18n = window.ALRi18n;
const t = (key, variables) => i18n.t(key, variables);
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
const text = (key, variables) => escapeHTML(t(key, variables));
const money = amount => new Intl.NumberFormat(i18n.language === 'en' ? 'en-US' : 'es-US', {style:'currency', currency:'USD'}).format(amount);
const isCatalogPage = document.body.dataset?.page !== 'home';
const featuredIds = ['cherry-body', 'lune-top', 'perfume-rose', 'perfume-ambre', 'gloss-cherry', 'gloss-pearl'];

const {products} = window.ALRcatalog;
const catalogQuery = window.ALRcatalogQuery;
const edition = window.ALRedition;
const productById = new Map(products.map(product => [product.id, product]));
const productText = (product, field) => t(`products.${product.id}.${field}`);
const colorName = color => t(`color.${color.id}`);
const categoryAliases = {Todo:'all', 'Íntimos':'intimates', Intimates:'intimates', 'Lencería':'lingerie', Esenciales:'essentials', Descanso:'lounge', Perfumes:'fragrance', Brillos:'beauty', Exclusiva:'exclusive', Favoritos:'favorites'};
const normalizeCategory = value => categoryAliases[value] || value;
const variantKind = product => product.variantKind || 'size';
const productCategoryKey = product => variantKind(product) === 'set' ? 'product.coffretCategory' : `category.${product.category}`;
const variantText = (product, value) => variantKind(product) === 'set' && value === 'Set' ? t('product.setValue') : value;
const variantLabel = product => t(variantKind(product) === 'size' ? 'product.size' : variantKind(product) === 'volume' ? 'product.volume' : 'product.format');
const variantPrompt = product => t(variantKind(product) === 'size' ? 'product.sizePrompt' : 'product.formatPrompt');
const lineVariant = (product, value) => t(`bag.${variantKind(product) === 'size' ? 'size' : variantKind(product) === 'volume' ? 'volume' : 'format'}`, {size:variantText(product, value), value:variantText(product, value)});
const unavailableAction = () => edition.getWindow().status === 'pending' ? 'edition.pending' : 'edition.previewOnly';
const searchIndex = catalogQuery.createIndex(products, product => ['es','en'].map(locale => [
  i18n.t(`products.${product.id}.name`, {}, locale),
  i18n.t(`category.${product.category}`, {}, locale),
  catalogQuery.isIntimate(product) ? i18n.t('category.intimates', {}, locale) : '',
  i18n.t(productCategoryKey(product), {}, locale),
  i18n.t(`products.${product.id}.description`, {}, locale),
  ...product.sizes.map(size => variantKind(product) === 'set' ? i18n.t('product.setValue', {}, locale) : size),
  ...product.colors.map(color => i18n.t(`color.${color.id}`, {}, locale))
].join(' ')).join(' '));

function readStoredValue(key) {
  try {
    const value = localStorage.getItem(key);
    return {ok:true, value:value === null ? null : JSON.parse(value)};
  } catch { return {ok:false}; }
}

function readStorage(key, fallback) {
  const stored = readStoredValue(key);
  return stored.ok ? stored.value ?? fallback : fallback;
}

function validCartLines(lines) {
  return Array.isArray(lines) ? lines.filter(line => {
    const product = line && productById.get(line.id);
    return product && edition.canSelect(product) && product.sizes.includes(line.size) && product.colors.some(color => color.name === line.color) && Number.isInteger(line.quantity) && line.quantity > 0 && line.quantity <= 10;
  }).map(({id, size, color, quantity}) => ({id, size, color, quantity})) : [];
}

const savedFavorites = readStorage('alr-favorites', []);
const favorites = new Set(Array.isArray(savedFavorites) ? savedFavorites.filter(id => productById.has(id)) : []);
const savedCart = readStorage('alr-cart', []);
let cart = validCartLines(savedCart);
const initialView = catalogQuery.readView(window.location?.search || '', products);
let category = isCatalogPage && window.location?.hash === '#favorites' ? 'favorites' : initialView.category;
let query = initialView.query;
let sort = initialView.sort;
const filters = {size:initialView.size, color:initialView.color, price:initialView.price};
let activeProduct = null;
let selectedSize = '';
let selectedColor = '';
let infoType = 'sizes';
let infoReturn = null;
const rememberedChoices = new Map(cart.map(({id, size, color}) => [id, {size, color}]));
const dialogTriggers = new WeakMap();
const suppressedClosures = new WeakMap();
let toastTimer;
let currentToastKey = null;
let editionInterest = readStorage('alr-edition-interest', false) === true;
let lastEditionStatus = edition.getWindow().status;

function persist() {
  try {
    localStorage.setItem('alr-favorites', JSON.stringify([...favorites]));
    localStorage.setItem('alr-cart', JSON.stringify(cart));
    localStorage.setItem('alr-edition-interest', JSON.stringify(editionInterest));
  } catch { toast('toast.localOnly'); }
  updateCounts();
}

function reconcileStoredSelections() {
  const focus = focusReference();
  const savedBag = readStoredValue('alr-cart');
  const savedLikes = readStoredValue('alr-favorites');
  const savedInterest = readStoredValue('alr-edition-interest');
  // A restored document keeps its previous JavaScript heap. Read confirmed
  // changes from the other page, but keep memory when storage is unavailable.
  cart = validCartLines(savedBag.ok ? savedBag.value : cart);
  if (savedLikes.ok) {
    favorites.clear();
    if (Array.isArray(savedLikes.value)) savedLikes.value.filter(id => productById.has(id)).forEach(id => favorites.add(id));
  }
  if (savedInterest.ok) editionInterest = savedInterest.value === true;
  for (const {id, size, color} of cart) rememberedChoices.set(id, {size, color});
  if (savedBag.ok && Array.isArray(savedBag.value) && cart.length !== savedBag.value.length) {
    try { localStorage.setItem('alr-cart', JSON.stringify(cart)); } catch { toast('toast.localOnly'); }
  }
  updateCounts();
  renderProducts();
  renderCart();
  renderEdition();
  if (activeProduct) renderProductDetail();
  if ($('#info-dialog').open) renderInfo();
  refreshFeedback();
  restoreFocus(focus);
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
  // The bilingual index stays valid when the display language changes.
  const results = catalogQuery.select(products, {category, query, sort, favorites, ...filters}, searchIndex);
  const list = isCatalogPage ? results : featuredIds.map(id => productById.get(id));
  if (isCatalogPage) {
    renderFilters();
    if ($('#collection-title')) $('#collection-title').textContent = t(`catalogPage.title.${category}`);
    const total = catalogQuery.select(products, {category, favorites}, searchIndex).length;
    if ($('#collection-copy')) $('#collection-copy').textContent = t(`catalogPage.copy.${category}`, {count:total});
  }
  const resultCount = t(results.length === 1 ? 'catalog.piece' : 'catalog.pieces', {count:results.length});
  if ($('#results-count')) $('#results-count').textContent = resultCount;
  if ($('#search-results-status')) $('#search-results-status').textContent = resultCount;
  if ($('#catalog-empty')) $('#catalog-empty').hidden = list.length > 0;
  if ($('#empty-text')) $('#empty-text').textContent = t(category === 'favorites' && favorites.size === 0 ? 'catalog.emptyFavorites' : 'catalog.emptySearch');
  $('#product-grid').innerHTML = list.map(product => {
    const name = productText(product, 'name');
    const favorite = favorites.has(product.id);
    return `<article class="product-card">
      <div class="product-image" data-product-id="${product.id}">
        <button class="product-open" data-product="${product.id}" aria-label="${text('product.view', {name})}"><img src="${product.image}" style="object-position:${product.position}" alt="${text('product.image', {name})}" loading="lazy" decoding="async" width="1024" height="1280"></button>
        <span class="product-badge">${escapeHTML(productText(product, 'badge'))}</span>
        <button class="favorite-button" data-favorite="${product.id}" aria-label="${text(favorite ? 'product.removeFavorite' : 'product.addFavorite', {name})}" aria-pressed="${favorite}"><span aria-hidden="true">${favorite ? '♥' : '♡'}</span></button>
        <button class="quick-view" data-product="${product.id}">${text(product.exclusive ? 'product.previewEdition' : variantKind(product) === 'size' ? 'product.chooseSize' : 'product.discoverBeauty')}</button>
      </div>
      <div class="product-title-row"><h3><button class="product-title-button" data-product="${product.id}">${escapeHTML(name)}</button></h3><span><span class="sr-only">${text('catalog.priceLabel')}: </span>${money(product.price)}</span></div>
      <p class="product-description">${text(productCategoryKey(product))} · ${escapeHTML(product.sizes.length === 1 ? variantText(product, product.sizes[0]) : `${product.sizes[0]}–${product.sizes.at(-1)}`)}</p>
      <div class="swatches">${product.colors.map(color => `<span class="swatch" style="--swatch:${color.hex}" aria-hidden="true"></span>`).join('')}<span>${escapeHTML(colorName(product.colors[0]))}</span></div>
      <p class="product-sample-label">${text('catalog.sampleBadge')}</p>
      ${product.exclusive ? `<p class="product-exclusive-status">${text(edition.canSelect(product) ? 'edition.windowOpen' : 'edition.previewBadge')}</p>` : ''}
    </article>`;
  }).join('');
  $$('[data-filter]').forEach(button => {
    const filter = normalizeCategory(button.dataset.filter);
    const active = filter === category || (filter === 'intimates' && catalogQuery.isClothingCategory(category));
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (focus) restoreFocus(focus, list.length ? '#product-grid .product-open' : '#reset-filter');
}

function syncCatalogControls() {
  for (const [selector, value] of [['#search', query], ['#catalog-search', query], ['#sort', sort]]) {
    const control = $(selector);
    if (control) control.value = value;
  }
}

function renderFilters() {
  if (!isCatalogPage) return;
  const chips = [];
  if (category !== 'all') chips.push({key:'category', label:t(category === 'favorites' ? 'filter.favorites' : category === 'exclusive' ? 'filter.exclusive' : `category.${category}`)});
  if (query.trim()) chips.push({key:'query', label:t('catalog.searchChip', {query:query.trim()})});
  if (filters.size) chips.push({key:'size', label:`${t('catalog.size')}: ${filters.size}`});
  if (filters.color) chips.push({key:'color', label:t(`color.${filters.color}`)});
  if (filters.price) chips.push({key:'price', label:t(`catalog.${filters.price}`)});
  const count = Object.values(filters).filter(Boolean).length;
  if ($('#filter-count')) {
    $('#filter-count').hidden = count === 0;
    $('#filter-count').textContent = t(count === 1 ? 'catalog.filterCountOne' : 'catalog.filterCount', {count});
  }
  for (const key of Object.keys(filters)) {
    const control = $(`#filter-${key}`);
    if (control) control.value = filters[key];
  }
  if ($('#filter-size')) $('#filter-size').disabled = ['fragrance', 'beauty', 'exclusive'].includes(category);
  const sizeField = $('label[for="filter-size"]');
  if (sizeField) sizeField.hidden = ['fragrance', 'beauty', 'exclusive'].includes(category);
  if ($('#filter-color-label')) $('#filter-color-label').textContent = t(category === 'fragrance' ? 'catalog.colorPackaging' : category === 'beauty' ? 'catalog.colorTone' : 'catalog.color');
  if ($('#active-filters')) {
    $('#active-filters').hidden = chips.length === 0;
    $('#active-filters').innerHTML = chips.map(({key,label}) => `<button type="button" class="filter-chip" data-clear-filter="${key}" aria-label="${text('catalog.removeFilter', {label})}">${escapeHTML(label)}<span aria-hidden="true">×</span></button>`).join('');
  }
  if ($('#catalog-search-clear')) $('#catalog-search-clear').hidden = query.length === 0;
  $$('[data-clothing-filters]').forEach(group => { group.hidden = !catalogQuery.isClothingCategory(category); });
  const share = $('#catalog-share');
  if (share) {
    share.disabled = category === 'favorites';
    share.setAttribute('title', t(category === 'favorites' ? 'catalog.shareFavorites' : 'catalog.share'));
  }
}

function catalogPageURL(view, hash = 'coleccion') {
  if (!window.location) return null;
  const url = new URL('catalog.html', window.location.href);
  url.search = catalogQuery.encodeView(view, products);
  url.hash = hash;
  return url;
}

function catalogViewURL() {
  return catalogPageURL(category === 'favorites' ? {} : {category, query, sort, ...filters}, category === 'favorites' ? 'favorites' : 'coleccion');
}

function syncCatalogURL(mode = 'replace') {
  if (!isCatalogPage) return;
  const url = catalogViewURL();
  if (!url || url.href === window.location.href || !window.history?.[`${mode}State`]) return;
  try { window.history[`${mode}State`]({alrCatalog:true}, '', url.href); } catch {}
}

function restoreCatalogView() {
  if (!isCatalogPage) return;
  const view = catalogQuery.readView(window.location?.search || '', products);
  const hadDialog = !!$('dialog[open]');
  infoReturn = null;
  $$('dialog[open]').forEach(dialog => {
    suppressedClosures.set(dialog, (suppressedClosures.get(dialog) || 0) + 1);
    dialog.close();
  });
  document.body.classList.remove('modal-open');
  category = window.location?.hash === '#favorites' ? 'favorites' : view.category;
  query = view.query;
  sort = view.sort;
  Object.assign(filters, {size:view.size, color:view.color, price:view.price});
  syncCatalogControls();
  renderProducts();
  closeNavigation();
  refreshFeedback();
  if (hadDialog) $('#catalog-search')?.focus({preventScroll:true});
}

async function shareCatalogView() {
  if (!isCatalogPage || category === 'favorites') return;
  const url = catalogViewURL();
  syncCatalogURL();
  try {
    if (!url || !navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(url.href);
    toast('toast.linkCopied');
  } catch { toast('toast.linkCopyUnavailable'); }
}

function setQuery(value) {
  // Keep a trailing space while typing so multiword queries remain easy to enter.
  query = String(value).replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 120);
  syncCatalogControls();
  renderProducts();
  syncCatalogURL();
}

function scrollToCatalog() {
  if (!isCatalogPage) {
    window.location.assign(catalogPageURL({}).href);
    return;
  }
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  $('#coleccion')?.scrollIntoView({behavior:reduceMotion ? 'auto' : 'smooth'});
}

function finishSearch() {
  $('#search-bar').hidden = true;
  $('#search-toggle').setAttribute('aria-expanded', 'false');
  if (!isCatalogPage) {
    window.location.assign(catalogPageURL({query}).href);
    return;
  }
  $('#results-count')?.setAttribute('tabindex', '-1');
  $('#results-count')?.focus({preventScroll:true});
  scrollToCatalog();
}

function resetCatalog() {
  category = 'all';
  sort = 'featured';
  Object.keys(filters).forEach(key => { filters[key] = ''; });
  setQuery('');
}

function renderEdition() {
  if (!$('#edition-status')) return;
  const window = edition.getWindow();
  const key = {pending:'edition.pending', upcoming:'edition.upcoming', open:'edition.windowOpen', closed:'edition.windowClosed'}[window.status];
  $('#edition-status').textContent = t(key);
  if ($('#edition-window-dates')) $('#edition-window-dates').hidden = !window.start;
  if (window.start && $('#edition-window-dates')) {
    const format = new Intl.DateTimeFormat(i18n.language === 'en' ? 'en-US' : 'es-US', {dateStyle:'long', timeZone:'UTC'});
    $('#edition-window-dates').textContent = t('edition.windowDates', {start:format.format(new Date(`${window.start}T12:00:00Z`)), end:format.format(new Date(`${window.end}T12:00:00Z`)), zone:window.timeZone});
  }
  if ($('#edition-interest')) {
    $('#edition-interest').textContent = t(editionInterest ? 'edition.interestSaved' : 'edition.saveInterest');
    $('#edition-interest').setAttribute('aria-pressed', String(editionInterest));
  }
  if ($('#edition-interest-note')) $('#edition-interest-note').textContent = t(editionInterest ? 'edition.interestSavedNote' : 'edition.interestNote');
}

function refreshEditionWindow() {
  const status = edition.getWindow().status;
  const before = cart.length;
  cart = cart.filter(line => edition.canSelect(productById.get(line.id)));
  const changed = status !== lastEditionStatus || cart.length !== before;
  if (cart.length !== before) { persist(); toast('edition.removedFromBag'); }
  if (changed) {
    const focus = focusReference();
    renderProducts();
    renderCart();
    if (activeProduct) renderProductDetail();
    if ($('#info-dialog').open && infoType === 'review') renderInfo();
    restoreFocus(focus);
  }
  lastEditionStatus = status;
  renderEdition();
}

function closeNavigation() {
  $('#navigation').classList.remove('open');
  $('#menu-toggle').setAttribute('aria-expanded', 'false');
  $('#menu-toggle').setAttribute('aria-label', t('menu.open'));
}

function setCategory(value) {
  const next = normalizeCategory(value);
  if (!['all', 'intimates', 'lingerie', 'essentials', 'lounge', 'fragrance', 'beauty', 'exclusive', 'favorites'].includes(next)) return;
  if (!isCatalogPage) {
    window.location.assign(catalogPageURL(next === 'favorites' ? {} : {category:next}, next === 'favorites' ? 'favorites' : 'coleccion').href);
    return;
  }
  category = next;
  if (['fragrance', 'beauty', 'exclusive'].includes(next)) filters.size = '';
  renderProducts();
  closeNavigation();
  syncCatalogURL('push');
}

function discoverCategory(value) {
  if (!['all', 'intimates', 'lingerie', 'essentials', 'lounge', 'fragrance', 'beauty', 'exclusive'].includes(value)) return false;
  if (!isCatalogPage) {
    window.location.assign(catalogPageURL({category:value}).href);
    return true;
  }
  // Editorial entrances start a fresh view; the previous filtered view stays
  // in history so Back returns to it. Catalog tabs keep their existing filters.
  query = '';
  sort = 'featured';
  Object.keys(filters).forEach(key => { filters[key] = ''; });
  syncCatalogControls();
  setCategory(value);
  finishSearch();
  return true;
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
  const clothing = variantKind(product) === 'size';
  const allowed = edition.canSelect(product);
  const actionKey = !allowed ? unavailableAction() : selectedSize ? 'product.addBag' : clothing ? 'product.sizePrompt' : 'product.formatPrompt';
  $('#product-detail').innerHTML = `<div class="detail-layout" data-product-id="${product.id}">
    <img class="detail-photo" src="${product.image}" style="object-position:${product.position}" alt="${text('product.image', {name})}" width="1024" height="1280">
    <div class="detail-copy"><p class="eyebrow">${text(productCategoryKey(product))}</p><h2 id="product-title">${escapeHTML(name)}</h2><div class="price"><span class="sr-only">${text('catalog.priceLabel')}: </span>${money(product.price)}</div><p>${escapeHTML(productText(product, 'description'))}</p>
      ${product.exclusive ? `<p class="detail-exclusive-notice">${text(allowed ? 'edition.windowOpen' : 'edition.unavailable')}</p>` : ''}
      <fieldset class="detail-field"><legend class="detail-label">${text(product.category === 'fragrance' || variantKind(product) === 'set' ? 'product.packaging' : clothing ? 'product.color' : 'product.tone')}</legend><div class="choices color-choices">${product.colors.map(color => `<button class="${selectedColor === color.name ? 'selected' : ''}" data-color="${color.name}" aria-pressed="${selectedColor === color.name}"><span class="swatch" style="--swatch:${color.hex}" aria-hidden="true"></span>${escapeHTML(colorName(color))}</button>`).join('')}</div></fieldset>
      <fieldset class="detail-field"><legend class="detail-label">${escapeHTML(variantLabel(product))} <span id="size-selection" class="selection-hint" aria-live="polite">· ${escapeHTML(selectedSize ? variantText(product, selectedSize) : variantPrompt(product))}</span></legend><div class="choices">${product.sizes.map(size => `<button class="${selectedSize === size ? 'selected' : ''}" data-size="${size}" aria-pressed="${selectedSize === size}">${escapeHTML(variantText(product, size))}</button>`).join('')}</div></fieldset>
      ${clothing ? `<button class="underlined" data-guide>${text('product.sizeGuide')}</button>` : ''}
      <div class="detail-purchase-actions"><button class="button" id="add-cart" ${selectedSize && allowed ? '' : 'disabled'}>${text(actionKey)}</button><p id="product-feedback" class="small-note dialog-feedback" role="alert" aria-live="assertive" hidden></p><p class="small-note">${text('product.sample')}</p></div>
      <details><summary>${text(clothing ? 'product.careTitle' : 'product.formulaTitle')}</summary><p>${escapeHTML(productText(product, 'fabric'))}</p><p>${text(clothing ? 'product.care' : 'product.beautyCare')}</p></details>
    </div></div>`;
  refreshFeedback();
}

function openProduct(id, trigger) {
  const product = productById.get(id);
  if (!product) return;
  activeProduct = product;
  const previous = rememberedChoices.get(id);
  selectedSize = previous?.size || (variantKind(product) === 'size' && product.sizes.includes(filters.size) ? filters.size : variantKind(product) !== 'size' && product.sizes.length === 1 ? product.sizes[0] : '');
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
  refreshEditionWindow();
  if (!edition.canSelect(product)) throw selectionError('errors.editionClosed');
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
      <h3>${escapeHTML(name)}</h3><p>${escapeHTML(lineColor(product, line))} · ${escapeHTML(lineVariant(product, line.size))}</p>
      <p class="bag-unit-price">${text('bag.unitPrice', {price:money(product.price)})}</p><strong class="cart-line-price" aria-label="${text('bag.linePrice')}">${money(product.price * line.quantity)}</strong>
      <div class="line-controls"><button data-quantity="${index}" data-delta="-1" aria-label="${text('bag.decrease', {name})}">−</button><span aria-label="${text('bag.quantity', {count:line.quantity})}">${line.quantity}</span><button data-quantity="${index}" data-delta="1" ${line.quantity >= 10 ? 'disabled' : ''} aria-label="${text('bag.increase', {name})}">+</button><button class="remove" data-remove="${index}" aria-label="${text('bag.removeLabel', {name})}">${text('bag.remove')}</button></div>
      </div></article>`;
  }).join('') + '<p id="cart-feedback" class="small-note dialog-feedback" role="status" aria-live="polite" hidden></p>';
  $('#cart-summary').innerHTML = `<div class="cart-total"><span>${text('bag.subtotal')}</span><strong>${money(cartSubtotal())}</strong></div><p>${text('bag.samplePrices')}</p><button class="button" id="review-order">${text('bag.review')}</button><p>${text('bag.paymentsDisabled')}</p>`;
  refreshFeedback();
}

function openCart(trigger) {
  refreshEditionWindow();
  renderCart();
  openDialog($('#cart-dialog'), trigger);
}

function renderInfo() {
  const sizes = [['XS','78–83','60–65','84–89'], ['S','84–89','66–71','90–95'], ['M','90–95','72–77','96–101'], ['L','96–103','78–85','102–109'], ['XL','104–111','86–93','110–117'], ['XXL','112–119','94–101','118–125']];
  const content = {
    sizes: () => `<p class="eyebrow">${text('sizes.eyebrow')}</p><h2 id="info-title">${t('sizes.title')}</h2><p>${text('sizes.intro')}</p><div class="table-scroll"><table aria-label="${text('sizes.table')}"><thead><tr>${['size','bust','waist','hips'].map(field => `<th scope="col">${text(`sizes.${field}`)}</th>`).join('')}</tr></thead><tbody>${sizes.map(row => `<tr><th scope="row">${row[0]}</th>${row.slice(1).map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>${text('sizes.measure')}</p>${infoReturn === 'product' ? `<div class="info-actions"><button class="button secondary" id="back-to-product">${text('sizes.back')}</button></div>` : ''}`,
    shipping: () => `<h2 id="info-title">${text('shipping.title')}</h2><p>${text('shipping.intro')}</p><p>${text('shipping.copy')}</p>`,
    privacy: () => `<h2 id="info-title">${text('privacy.title')}</h2><p>${text('privacy.intro')}</p><p>${text('privacy.copy')}</p><button class="button secondary" id="clear-data">${text('privacy.clear')}</button>`,
    review: () => `<p class="eyebrow">${text('review.eyebrow')}</p><h2 id="info-title">${t('review.title')}</h2><div>${cart.map(line => { const product = productById.get(line.id); return `<p>${escapeHTML(productText(product, 'name'))}<br>${escapeHTML(lineColor(product, line))} · ${escapeHTML(lineVariant(product, line.size))} · ${text(line.quantity === 1 ? 'review.unit' : 'review.units', {count:line.quantity})}</p>`; }).join('')}</div><div class="cart-total"><span>${text('review.subtotal')}</span><strong>${money(cartSubtotal())}</strong></div><p>${text('review.notice')}</p><button class="button" id="back-to-bag">${text('review.back')}</button>`
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
  $('#size-selection').textContent = `· ${variantText(activeProduct, selectedSize)}`;
  $('#add-cart').disabled = !edition.canSelect(activeProduct);
  $('#add-cart').textContent = t(edition.canSelect(activeProduct) ? 'product.addBag' : unavailableAction());
  rememberedChoices.set(activeProduct.id, {size:selectedSize, color:selectedColor});
}

document.addEventListener('click', event => {
  const button = event.target.closest('button,a');
  if (!button) return;
  if (button.dataset.discover !== undefined) {
    if (!isCatalogPage) return;
    if (button.tagName === 'A' && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (event.button !== undefined && event.button !== 0))) return;
    event.preventDefault();
    discoverCategory(button.dataset.discover);
    return;
  }
  if (button.dataset.clearFilter) {
    const key = button.dataset.clearFilter;
    if (key === 'query') setQuery('');
    else if (key === 'category') setCategory('all');
    else if (Object.hasOwn(filters, key)) { filters[key] = ''; renderProducts(); syncCatalogURL(); }
    $('#catalog-search')?.focus({preventScroll:true});
    return;
  }
  if (button.dataset.product) { openProduct(button.dataset.product, button); return; }
  if (button.dataset.favorite) {
    const id = button.dataset.favorite;
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    persist();
    renderProducts();
    toast(favorites.has(id) ? 'toast.favoriteAdded' : 'toast.favoriteRemoved');
    return;
  }
  if (button.dataset.filter) { setCategory(button.dataset.filter); return; }
  if (button.dataset.category) { if (isCatalogPage || button.tagName !== 'A') setCategory(button.dataset.category); return; }
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
    refreshEditionWindow();
    // The window may have closed since this drawer was rendered. Keep the
    // clicked line's identity so removing earlier lines cannot shift the target.
    const currentIndex = cart.indexOf(line);
    if (currentIndex === -1) return;
    const remove = button.dataset.remove !== undefined || (button.dataset.delta === '-1' && line.quantity === 1);
    if (remove) { cart.splice(currentIndex, 1); toast('toast.removed'); }
    else line.quantity = Math.max(1, Math.min(10, line.quantity + Number(button.dataset.delta)));
    persist();
    renderCart();
    restoreFocus(reference, cart.length ? '#review-order' : '[data-continue]');
    return;
  }
  if (button.hasAttribute('data-continue')) {
    $('#cart-dialog').close();
    if (!isCatalogPage) { window.location.assign(catalogPageURL({}).href); return; }
    setCategory('all');
    scrollToCatalog();
    return;
  }
  if (button.id === 'review-order') {
    refreshEditionWindow();
    if (cart.length) showInfo('review', 'cart', button);
    else $('[data-continue]')?.focus({preventScroll:true});
    return;
  }
  if (button.id === 'back-to-bag' || button.id === 'back-to-product') { $('#info-dialog').close(); return; }
  if (button.id === 'clear-data') {
    cart = [];
    favorites.clear();
    editionInterest = false;
    persist();
    renderProducts();
    renderEdition();
    $('#info-dialog').close();
    toast('toast.cleared');
  }
});

$('#cart-toggle').addEventListener('click', event => openCart(event.currentTarget));
$('#catalog-share')?.addEventListener('click', shareCatalogView);
$('#edition-interest')?.addEventListener('click', () => { editionInterest = !editionInterest; persist(); renderEdition(); });
$('#favorites-toggle').addEventListener('click', () => {
  if (!isCatalogPage) { window.location.assign(catalogPageURL({}, 'favorites').href); return; }
  query = '';
  sort = 'featured';
  Object.keys(filters).forEach(key => { filters[key] = ''; });
  syncCatalogControls();
  setCategory('favorites');
  finishSearch();
});
$('#sort')?.addEventListener('change', event => { sort = event.target.value; renderProducts(); syncCatalogURL(); });
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
$('#search').addEventListener('input', event => { if (!event.isComposing) setQuery(event.target.value); });
$('#search').addEventListener('compositionend', event => setQuery(event.target.value));
$('#search').addEventListener('keydown', event => {
  if (event.isComposing) return;
  if (event.key === 'Escape') { event.preventDefault(); $('#search-close').click(); }
  if (event.key === 'Enter') { event.preventDefault(); finishSearch(); }
});
$('#catalog-search')?.addEventListener('input', event => { if (!event.isComposing) setQuery(event.target.value); });
$('#catalog-search')?.addEventListener('compositionend', event => setQuery(event.target.value));
$('#catalog-search')?.addEventListener('keydown', event => {
  if (event.isComposing) return;
  if (event.key === 'Enter') { event.preventDefault(); finishSearch(); }
  if (event.key === 'Escape' && query) { event.preventDefault(); setQuery(''); }
});
$('#catalog-search-clear')?.addEventListener('click', () => { setQuery(''); $('#catalog-search')?.focus({preventScroll:true}); });
for (const key of Object.keys(filters)) {
  $(`#filter-${key}`)?.addEventListener('change', event => { filters[key] = event.target.value; renderProducts(); syncCatalogURL(); });
}
$('#clear-filters')?.addEventListener('click', resetCatalog);
$('#reset-filter')?.addEventListener('click', () => { resetCatalog(); $('#catalog-search')?.focus({preventScroll:true}); });
$('#menu-toggle').addEventListener('click', () => {
  const open = $('#navigation').classList.toggle('open');
  $('#menu-toggle').setAttribute('aria-expanded', String(open));
  $('#menu-toggle').setAttribute('aria-label', t(open ? 'menu.close' : 'menu.open'));
});
$('#navigation').addEventListener('click', event => { if (event.target.closest('a')) closeNavigation(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && $('#navigation').classList.contains('open')) { closeNavigation(); $('#menu-toggle').focus({preventScroll:true}); }
});
['#size-guide','#size-guide-bottom'].forEach(selector => $(selector)?.addEventListener('click', event => showInfo('sizes', null, event.currentTarget)));

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
  renderEdition();
  renderCart();
  if (activeProduct) renderProductDetail();
  if ($('#info-dialog').open) renderInfo();
  refreshFeedback();
  $('#menu-toggle').setAttribute('aria-label', t($('#navigation').classList.contains('open') ? 'menu.close' : 'menu.open'));
  restoreFocus(reference, '#language-select');
});

$('#year').textContent = new Date().getFullYear();
syncCatalogControls();
if (!isCatalogPage && window.location) {
  const params = new URLSearchParams(window.location.search);
  if (['category','q','size','color','price','sort'].some(key => params.has(key))) {
    window.location.replace(catalogPageURL(initialView).href);
  } else if (window.location.hash === '#favorites') {
    window.location.replace(catalogPageURL({}, 'favorites').href);
  }
}
renderProducts();
renderEdition();
updateCounts();
if (Array.isArray(savedCart) && savedCart.length !== cart.length) persist();
setInterval(() => { if (!document.hidden) refreshEditionWindow(); }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshEditionWindow(); });
window.addEventListener('popstate', restoreCatalogView);
window.addEventListener('pageshow', event => { if (event.persisted) reconcileStoredSelections(); });

if (document.modelContext?.registerTool) {
  let lifecycle;
  const tools = [
    {name:'read_sample_catalog', description:'Read the Annys Le Rose sample catalog. Prices, images and formulas are conceptual; sales are not enabled. Annual edition selection is subject to its five-day window.', inputSchema:{type:'object', properties:{}, additionalProperties:false}, annotations:{readOnlyHint:true, untrustedContentHint:false}, execute:() => products.map(product => ({id:product.id, name:productText(product, 'name'), category:product.category, price:product.price, variantKind:variantKind(product), sizes:product.sizes, colors:product.colors.map(colorName), exclusive:!!product.exclusive, canSelect:edition.canSelect(product)}))},
    {name:'stage_sample_bag', description:'Add a valid sample product and color to the local bag. The size field is a clothing size or a beauty format such as 50 ml or 6 ml. Annual edition products are blocked outside the announced five-day window. This does not place or pay for an order.', inputSchema:{type:'object', properties:{id:{type:'string'}, size:{type:'string'}, color:{type:'string'}, quantity:{type:'integer', minimum:1, maximum:10}}, required:['id','size','color'], additionalProperties:false}, annotations:{readOnlyHint:false, untrustedContentHint:false}, execute:input => {
      if (!input || typeof input !== 'object' || Object.keys(input).some(key => !['id','size','color','quantity'].includes(key))) throw selectionError('errors.input');
      const result = addToCart(input.id, input.size, input.color, input.quantity ?? 1);
      openCart($('#cart-toggle'));
      return result;
    }}
  ];
  function registerShoppingTools() {
    lifecycle = new AbortController();
    for (const tool of tools) {
      try { Promise.resolve(document.modelContext.registerTool(tool, {signal:lifecycle.signal})).catch(() => {}); } catch {}
    }
  }
  registerShoppingTools();
  window.addEventListener('pagehide', () => lifecycle.abort());
  window.addEventListener('pageshow', event => { if (event.persisted) registerShoppingTools(); });
}
