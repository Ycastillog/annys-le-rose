'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sources = Object.fromEntries(['catalog.js', 'catalog-query.js', 'edition.js', 'i18n.js', 'product-view.js', 'app.js']
  .map(file => [file, fs.readFileSync(path.join(root, 'dist', file), 'utf8')]));

// A small DOM surface lets the real application register and run its handlers.
// Templates are kept as strings; layout, native focus and rendering belong to browser QA.
function createHarness({now = '2026-10-03T12:00:00Z', announced = false, savedCart = [], savedFavorites = [], language = 'es', href = 'https://example.test/annys-le-rose/catalog.html', clipboard = true, reduceMotion = false, deferredClose = false, page, productId = 'rose-bra', sharedStorage, missingIds = []} = {}) {
  const documentListeners = new Map();
  const windowListeners = new Map();
  const registeredTools = new Map();
  const elements = new Map();
  const storage = sharedStorage || new Map([['alr-cart', JSON.stringify(savedCart)], ['alr-favorites', JSON.stringify(savedFavorites)], ['alr-language', language]]);
  const absent = new Set(missingIds);
  let storageBlocked = false;
  if (page === 'home' || page === 'product') ['catalog-search','catalog-search-clear','sort','results-count','catalog-empty','empty-text','reset-filter','filter-count','filter-size','filter-color','filter-price','active-filters','catalog-share','clear-filters','collection-title','collection-copy'].forEach(id => absent.add(id));
  if (page === 'product') absent.add('product-grid');
  if (page === 'catalog' || page === 'product') ['edition-status','edition-window-dates','edition-interest','edition-interest-note'].forEach(id => absent.add(id));
  let clock = new Date(now);
  const copiedLinks = [];
  const storageWrites = [];
  const navigations = [];
  const closeEvents = [];
  const historyEntries = [{url:new URL(href).href, state:null}];
  let historyIndex = 0;
  const schedule = {startMonthDay:announced ? '10-01' : null, durationDays:5, timeZone:'America/Santo_Domingo'};

  class Element {
    constructor(id = '', tagName = 'DIV') {
      this.id = id;
      this.tagName = tagName;
      this.dataset = {};
      this.open = false;
      this.hidden = false;
      this.isConnected = true;
      this.innerHTML = '';
      this.textContent = '';
      this.value = '';
      this.attributes = new Map();
      this.listeners = new Map();
      const classes = new Set();
      this.classList = {
        add(...names) { names.forEach(name => classes.add(name)); },
        remove(...names) { names.forEach(name => classes.delete(name)); },
        contains(name) { return classes.has(name); },
        toggle(name, forced) {
          const enabled = forced === undefined ? !classes.has(name) : forced;
          enabled ? classes.add(name) : classes.delete(name);
          return enabled;
        }
      };
    }
    addEventListener(type, callback) {
      if (!this.listeners.has(type)) this.listeners.set(type, []);
      this.listeners.get(type).push(callback);
    }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    getAttribute(name) {
      if (name.startsWith('data-')) return this.dataset[name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] ?? null;
      return this.attributes.get(name) ?? null;
    }
    hasAttribute(name) { return this.getAttribute(name) !== null; }
    contains(element) { return element === this || element?.parentElement === this; }
    focus() { document.activeElement = this; }
    scrollIntoView(options) { this.lastScrollOptions = options; }
    dispatch(type, extra = {}) {
      const event = {target:this, currentTarget:this, preventDefault() { this.defaultPrevented = true; }, ...extra};
      for (const callback of this.listeners.get(type) || []) callback(event);
      return event;
    }
    click() { this.dispatch('click'); }
    showModal() { this.open = true; }
    close() {
      this.open = false;
      const notify = () => { for (const callback of this.listeners.get('close') || []) callback({target:this}); };
      deferredClose ? closeEvents.push(notify) : notify();
    }
    querySelector(selector) { return selector === '.dialog-feedback' ? element(`${this.id}-feedback`) : null; }
    getBoundingClientRect() { return {left:0, top:0, right:100, bottom:100}; }
  }

  function element(id) {
    if (!elements.has(id)) elements.set(id, new Element(id));
    return elements.get(id);
  }
  const filterButtons = ['Todo','intimates','Lencería','Esenciales','Descanso','fragrance','beauty','exclusive','Favoritos'].map(filter => {
    const button = new Element(`filter-${filter}`, 'BUTTON');
    button.dataset.filter = filter;
    return button;
  });
  const dialogs = ['product-dialog', 'cart-dialog', 'info-dialog', ...(page === 'product' ? ['concept-image-dialog'] : [])].map(element);
  const document = {
    activeElement:null,
    hidden:false,
    documentElement:{},
    body:new Element('body'),
    addEventListener(type, callback) {
      if (!documentListeners.has(type)) documentListeners.set(type, []);
      documentListeners.get(type).push(callback);
    },
    querySelector(selector) {
      if (selector === 'dialog[open]') return dialogs.find(dialog => dialog.open) || null;
      const id = selector.startsWith('#') ? selector.slice(1) : selector;
      if (absent.has(id) || (page === 'home' && selector === 'label[for="filter-size"]')) return null;
      return element(id);
    },
    querySelectorAll(selector) {
      if (selector === 'dialog') return dialogs;
      if (selector === 'dialog[open]') return dialogs.filter(dialog => dialog.open);
      if (selector === '.dialog-feedback') return dialogs.map(dialog => dialog.querySelector('.dialog-feedback'));
      if (selector === '[data-filter]') return page === 'home' ? [] : filterButtons;
      if (selector === '[data-clothing-filters]') return page === 'home' ? [] : [element('clothing-filters')];
      return [];
    },
    modelContext:{registerTool(tool, options) {
      registeredTools.set(tool.name, tool);
      options?.signal.addEventListener('abort', () => { if (registeredTools.get(tool.name) === tool) registeredTools.delete(tool.name); }, {once:true});
    }}
  };
  if (page) document.body.dataset.page = page;
  if (page === 'product') document.body.dataset.productId = productId;
  function makeLocation(href) {
    const location = new URL(href);
    for (const method of ['assign','replace']) location[method] = url => { navigations.push({method, url:new URL(url, location.href).href}); };
    return location;
  }
  const history = {
    get length() { return historyEntries.length; },
    get state() { return historyEntries[historyIndex].state; },
    pushState(state, unused, url) {
      historyEntries.splice(historyIndex + 1);
      historyEntries.push({state, url:new URL(url, context.window.location.href).href});
      historyIndex += 1;
      context.window.location = makeLocation(historyEntries[historyIndex].url);
    },
    replaceState(state, unused, url) {
      historyEntries[historyIndex] = {state, url:new URL(url, context.window.location.href).href};
      context.window.location = makeLocation(historyEntries[historyIndex].url);
    },
    go(delta) {
      const index = historyIndex + delta;
      if (index < 0 || index >= historyEntries.length) return;
      historyIndex = index;
      context.window.location = makeLocation(historyEntries[historyIndex].url);
      for (const callback of windowListeners.get('popstate') || []) callback({state:this.state});
    }
  };
  const context = vm.createContext({
    window:{
      location:makeLocation(href), history,
      matchMedia:() => ({matches:reduceMotion}),
      addEventListener(type, callback) {
        if (!windowListeners.has(type)) windowListeners.set(type, []);
        windowListeners.get(type).push(callback);
      }
    },
    document,
    navigator:{language:'es', languages:['es'], clipboard:clipboard ? {writeText:async value => { copiedLinks.push(value); }} : undefined},
    localStorage:{
      getItem:key => { if (storageBlocked) throw new Error('Storage unavailable'); return storage.get(key) ?? null; },
      setItem:(key, value) => { if (storageBlocked) throw new Error('Storage unavailable'); storageWrites.push({key, value:String(value)}); storage.set(key, String(value)); }
    },
    HTMLElement:Element,
    CSS:{escape:value => String(value)},
    URL, URLSearchParams,
    AbortController,
    setInterval:() => 0,
    setTimeout:() => 0,
    clearTimeout() {}
  });
  for (const file of ['catalog.js', 'catalog-query.js', 'edition.js', 'i18n.js', 'product-view.js']) {
    vm.runInContext(sources[file], context, {filename:file});
  }
  // Use the actual calendar logic with a controlled clock and an optional announced date.
  const annualEdition = context.window.ALRedition;
  context.window.ALRedition = {
    config:annualEdition.config,
    getWindow:() => annualEdition.getWindow(clock, schedule),
    canSelect:product => annualEdition.canSelect(product, clock, schedule)
  };
  vm.runInContext(sources['app.js'], context, {filename:'app.js'});

  const run = expression => vm.runInContext(expression, context);
  return {
    run,
    element,
    clock:instant => { clock = new Date(instant); },
    stage:input => registeredTools.get('stage_sample_bag').execute(input),
    readCatalog:() => registeredTools.get('read_sample_catalog').execute(),
    view:() => JSON.parse(run('JSON.stringify({category,query,sort,...filters})')),
    url:() => context.window.location.href,
    history,
    storage,
    storageWrites,
    navigations,
    blockStorage:blocked => { storageBlocked = blocked; },
    emitWindow:(type, extra = {}) => { for (const callback of windowListeners.get(type) || []) callback(extra); },
    emitDocument:(type, extra = {}) => { for (const callback of documentListeners.get(type) || []) callback(extra); },
    toolNames:() => [...registeredTools.keys()],
    filterButton:filter => filterButtons.find(button => button.dataset.filter === filter),
    copiedLinks,
    flushCloseEvents:() => { while (closeEvents.length) closeEvents.shift()(); },
    focused:() => document.activeElement?.id,
    emit:(id, type, extra) => element(id).dispatch(type, extra),
    cart:() => JSON.parse(run('JSON.stringify(cart)')),
    storedCart:() => JSON.parse(storage.get('alr-cart')),
    click({id = '', dataset = {}, tagName = dataset.discover !== undefined ? 'A' : 'BUTTON', eventProperties = {}}) {
      const button = new Element(id, tagName);
      button.dataset = dataset;
      const event = {target:{closest:() => button}, preventDefault() { this.defaultPrevented = true; }, ...eventProperties};
      for (const callback of documentListeners.get('click') || []) callback(event);
      return event;
    }
  };
}

const tests = [];
function test(name, callback) {
  tests.push({name, callback});
}
const exclusiveSelection = {id:'edition-perfume', size:'50 ml', color:'cherry'};
const regularSelection = {id:'perfume-rose', size:'50 ml', color:'ivory'};
const expectError = (callback, key) => assert.throws(callback, error => error.translationKey === key);

test('Beauty has a single selected format and does not require a clothing size', () => {
  const shop = createHarness();
  shop.run("openProduct('perfume-rose')");
  assert.equal(shop.run('selectedSize'), '50 ml');
  assert.ok(shop.element('product-detail').innerHTML.includes('Contenido'));
  assert.ok(!shop.element('product-detail').innerHTML.includes('data-guide'));
  const result = shop.run("addToCart(activeProduct.id, selectedSize, selectedColor)");
  assert.equal(result.items, 1);
  assert.equal(result.subtotal, 64);
  shop.run("openProduct('gloss-cherry')");
  assert.equal(shop.run('selectedSize'), '6 ml');
  assert.equal(shop.run("addToCart(activeProduct.id, selectedSize, selectedColor).subtotal"), 82);
  expectError(() => shop.stage({...regularSelection, size:'M'}), 'errors.selection');
  expectError(() => shop.stage({id:'rose', size:'50 ml', color:'cherry'}), 'errors.selection');
});

test('An unannounced annual edition is blocked through the actual shopping tool', () => {
  const shop = createHarness();
  for (const product of shop.readCatalog().filter(product => product.exclusive)) {
    assert.equal(product.canSelect, false);
    expectError(() => shop.stage({id:product.id, size:product.sizes[0], color:product.colors[0]}), 'errors.editionClosed');
  }
  assert.equal(shop.cart().length, 0);
});

test('The annual coffret uses a translated set format rather than a clothing size', () => {
  const shop = createHarness({announced:true});
  shop.run("openProduct('edition-coffret')");
  assert.equal(shop.run('selectedSize'), 'Set');
  assert.ok(shop.element('product-detail').innerHTML.includes('Dúo perfume + brillo'));
  assert.ok(!shop.element('product-detail').innerHTML.includes('data-guide'));
  assert.equal(shop.run("addToCart(activeProduct.id, selectedSize, selectedColor).subtotal"), 138);
  shop.run("i18n.setLanguage('en')");
  assert.ok(shop.element('cart-items').innerHTML.includes('Format: Perfume + gloss duo'));
  assert.equal(shop.cart()[0].size, 'Set');
});

test('Persisted exclusive selections are removed outside the annual window', () => {
  const shop = createHarness({savedCart:[
    {id:'edition-perfume', size:'50 ml', color:'Rojo cereza', quantity:1},
    {id:'perfume-rose', size:'50 ml', color:'Marfil', quantity:1}
  ]});
  assert.deepEqual(shop.cart(), [{id:'perfume-rose', size:'50 ml', color:'Marfil', quantity:1}]);
  assert.deepEqual(shop.storedCart(), shop.cart());
});

test('The final open instant allows selection and the exact close blocks it', () => {
  const shop = createHarness({announced:true, now:'2026-10-06T03:59:59.999Z'});
  assert.equal(shop.stage(exclusiveSelection).subtotal, 112);
  shop.clock('2026-10-06T04:00:00.000Z');
  expectError(() => shop.stage(exclusiveSelection), 'errors.editionClosed');
  assert.equal(shop.cart().length, 0);
});

test('Adding a regular product after close purges exclusives before returning totals', () => {
  const shop = createHarness({announced:true});
  assert.equal(shop.stage(exclusiveSelection).subtotal, 112);
  shop.clock('2026-10-06T04:00:00Z');
  const result = shop.stage(regularSelection);
  assert.equal(result.items, 1);
  assert.equal(result.subtotal, 64);
  assert.equal(shop.cart()[0].id, 'perfume-rose');
  assert.deepEqual(shop.storedCart(), shop.cart());
});

test('An expired quantity target cannot accidentally change the following product', () => {
  const shop = createHarness({announced:true});
  shop.stage(exclusiveSelection);
  shop.stage(regularSelection);
  shop.clock('2026-10-06T04:00:00Z');
  shop.click({dataset:{quantity:'0', delta:'1'}});
  assert.deepEqual(shop.cart(), [{id:'perfume-rose', size:'50 ml', color:'Marfil', quantity:1}]);
});

test('A regular quantity target stays correct when purging moves its index', () => {
  const shop = createHarness({announced:true});
  shop.stage(exclusiveSelection);
  shop.stage(regularSelection);
  shop.clock('2026-10-06T04:00:00Z');
  shop.click({dataset:{quantity:'1', delta:'1'}});
  assert.deepEqual(shop.cart(), [{id:'perfume-rose', size:'50 ml', color:'Marfil', quantity:2}]);
  assert.equal(shop.run('cartSubtotal()'), 128);
});

test('Review avoids an empty expired bag and reviews only eligible items in a mixed bag', () => {
  const empty = createHarness({announced:true});
  empty.stage(exclusiveSelection);
  empty.clock('2026-10-06T04:00:00Z');
  empty.click({id:'review-order'});
  assert.equal(empty.cart().length, 0);
  assert.equal(empty.element('info-dialog').open, false);

  const mixed = createHarness({announced:true});
  mixed.stage(exclusiveSelection);
  mixed.stage(regularSelection);
  mixed.clock('2026-10-06T04:00:00Z');
  mixed.click({id:'review-order'});
  assert.equal(mixed.element('info-dialog').open, true);
  assert.equal(mixed.cart().length, 1);
  assert.equal(mixed.run('cartSubtotal()'), 64);
  assert.ok(mixed.element('info-content').innerHTML.includes('Rose Veil'));
  assert.ok(!mixed.element('info-content').innerHTML.includes('Édition 05 · Perfume'));
});

test('Changing language preserves volume selections and stable saved colors', () => {
  const shop = createHarness();
  shop.stage(regularSelection);
  const before = shop.cart();
  shop.run("i18n.setLanguage('en')");
  assert.deepEqual(shop.cart(), before);
  assert.ok(shop.element('cart-items').innerHTML.includes('Volume: 50 ml'));
  assert.ok(shop.element('cart-items').innerHTML.includes('Ivory'));
  assert.deepEqual(shop.storedCart(), before);
});

test('Malformed view enums and personal fields cannot become catalog URL state', () => {
  const shop = createHarness({href:'https://example.test/annys-le-rose/?category=favorites&size=50+ml&color=magenta&price=free&sort=random&cart=rose&language=es&email=private%40example.test'});
  assert.deepEqual(shop.view(), {category:'all', query:'', sort:'featured', size:'', color:'', price:''});
  assert.equal(shop.run('catalogViewURL().search'), '');
  assert.equal(shop.cart().length, 0);
});

test('View encoding is stable, bounded and includes only recognized filters', () => {
  const shop = createHarness();
  const encoded = shop.run("catalogQuery.encodeView({category:'lingerie',query:'  ROSE\\u0000  ',size:'M',color:'cherry',price:'from40to65',sort:'low',cart:'secret',language:'es'},products)");
  assert.equal(encoded, 'category=lingerie&q=ROSE&size=M&color=cherry&price=from40to65&sort=low');
  assert.equal(shop.run(`catalogQuery.encodeView(catalogQuery.readView(${JSON.stringify(encoded)},products),products)`), encoded);
  assert.equal(shop.run("catalogQuery.readView('?q='+ 'x'.repeat(200),products).query.length"), 120);
  assert.equal(shop.run("catalogQuery.readView('?category=lingerie&category=beauty&q=%00rose%7F',products).query"), 'rose');
});

test('A linked view restores controls and results on reload in either language', () => {
  const href = 'https://example.test/annys-le-rose/?category=fragrance&q=50+ml&color=ivory&price=from40to65&sort=low#coleccion';
  const expected = {category:'fragrance', query:'50 ml', sort:'low', size:'', color:'ivory', price:'from40to65'};
  for (const language of ['en', 'es']) {
    const shop = createHarness({href, language});
    assert.deepEqual(shop.view(), expected);
    assert.equal(shop.element('search').value, '50 ml');
    assert.equal(shop.element('catalog-search').value, '50 ml');
    assert.equal(shop.element('filter-color').value, 'ivory');
    assert.equal(shop.element('sort').value, 'low');
    assert.ok(shop.element('product-grid').innerHTML.includes('data-product="perfume-rose"'));
    assert.ok(!shop.element('product-grid').innerHTML.includes('data-product="perfume-ambre"'));
  }
});

test('Category navigation has Back and Forward while typing and filters replace one view', () => {
  const shop = createHarness();
  shop.click({dataset:{category:'lingerie'}});
  assert.equal(shop.history.length, 2);
  shop.element('catalog-search').value = 'rose';
  shop.emit('catalog-search', 'input');
  shop.element('filter-size').value = 'M';
  shop.emit('filter-size', 'change');
  shop.element('sort').value = 'high';
  shop.emit('sort', 'change');
  assert.equal(shop.history.length, 2);
  shop.click({dataset:{category:'fragrance'}});
  assert.equal(shop.history.length, 3);
  assert.equal(shop.view().size, '');
  shop.history.go(-1);
  assert.deepEqual(shop.view(), {category:'lingerie', query:'rose', sort:'high', size:'M', color:'', price:''});
  assert.equal(shop.element('filter-size').value, 'M');
  assert.equal(shop.element('filter-size').disabled, false);
  shop.history.go(1);
  assert.equal(shop.view().category, 'fragrance');
  assert.equal(shop.element('filter-size').disabled, true);
  assert.equal(shop.element('filter-size').value, '');
});

test('Back closes a nested guide without delayed close events reopening its product', () => {
  const shop = createHarness({deferredClose:true});
  shop.click({dataset:{category:'lingerie'}});
  shop.run("openProduct('rose', $('#cart-toggle')); showInfo('sizes','product',$('#size-guide'))");
  assert.equal(shop.element('info-dialog').open, true);
  shop.history.go(-1);
  assert.equal(shop.element('info-dialog').open, false);
  assert.equal(shop.focused(), 'catalog-search');
  shop.flushCloseEvents();
  assert.equal(shop.element('product-dialog').open, false);
  assert.equal(shop.element('info-dialog').open, false);
  assert.equal(shop.focused(), 'catalog-search');
  assert.equal(shop.run("document.body.classList.contains('modal-open')"), false);
});

test('Copying a view shares an allowlisted link without bag or language data', async () => {
  const shop = createHarness({href:'https://example.test/annys-le-rose/?category=fragrance&q=50+ml&token=private&cart=rose&language=es#old'});
  await shop.run('shareCatalogView()');
  assert.deepEqual(shop.copiedLinks, ['https://example.test/annys-le-rose/catalog.html?category=fragrance&q=50+ml#coleccion']);
  assert.equal(shop.url(), shop.copiedLinks[0]);
  assert.equal(shop.run('currentToastKey'), 'toast.linkCopied');
});

test('Unavailable clipboard leaves a clean current link and useful feedback', async () => {
  const shop = createHarness({href:'https://example.test/annys-le-rose/?category=beauty&email=private%40example.test', clipboard:false});
  await shop.run('shareCatalogView()');
  assert.equal(shop.url(), 'https://example.test/annys-le-rose/catalog.html?category=beauty#coleccion');
  assert.equal(shop.run('currentToastKey'), 'toast.linkCopyUnavailable');
});

test('Favorites remain local and their view cannot be copied as a public collection', async () => {
  const shop = createHarness();
  shop.click({dataset:{favorite:'rose'}});
  assert.equal(shop.run('currentToastKey'), 'toast.favoriteAdded');
  shop.click({dataset:{category:'favorites'}});
  assert.equal(shop.element('catalog-share').disabled, true);
  assert.equal(new URL(shop.url()).searchParams.has('favorites'), false);
  await shop.run('shareCatalogView()');
  assert.equal(shop.copiedLinks.length, 0);
  shop.click({dataset:{favorite:'rose'}});
  assert.equal(shop.run('currentToastKey'), 'toast.favoriteRemoved');
});

test('A valid clothing size filter defaults a new selection and remembers a chosen alternative', () => {
  const shop = createHarness({href:'https://example.test/annys-le-rose/?category=lingerie&size=M'});
  shop.run("openProduct('rose')");
  assert.equal(shop.run('selectedSize'), 'M');
  shop.click({dataset:{size:'L'}});
  shop.run("openProduct('noir'); openProduct('rose')");
  assert.equal(shop.run('selectedSize'), 'L');
});

test('Saved bag variants survive reload and take priority over a new size filter', () => {
  const shop = createHarness({href:'https://example.test/annys-le-rose/?size=M', savedCart:[{id:'rose', size:'XL', color:'Rojo cereza', quantity:1}]});
  shop.run("openProduct('rose')");
  assert.equal(shop.run('selectedSize'), 'XL');
  assert.equal(shop.run('selectedColor'), 'Rojo cereza');
  assert.deepEqual(shop.storedCart(), shop.cart());
});

test('Invalid and beauty-incompatible linked sizes cannot select a clothing format', () => {
  const invalid = createHarness({href:'https://example.test/annys-le-rose/?size=50+ml'});
  invalid.run("openProduct('rose')");
  assert.equal(invalid.view().size, '');
  assert.equal(invalid.run('selectedSize'), '');
  const beauty = createHarness({href:'https://example.test/annys-le-rose/?category=beauty&size=M'});
  assert.equal(beauty.view().size, '');
  assert.equal(beauty.element('filter-size').disabled, true);
  beauty.run("openProduct('gloss-pearl')");
  assert.equal(beauty.run('selectedSize'), '6 ml');
});

test('Bilingual accent-insensitive search survives a display-language switch', () => {
  const shop = createHarness({language:'en'});
  shop.element('catalog-search').value = 'ambar';
  shop.emit('catalog-search', 'input');
  assert.ok(shop.element('product-grid').innerHTML.includes('data-product="perfume-ambre"'));
  assert.ok(!shop.element('product-grid').innerHTML.includes('data-product="perfume-rose"'));
  shop.run("i18n.setLanguage('es')");
  assert.equal(shop.view().query, 'ambar');
  assert.ok(shop.element('product-grid').innerHTML.includes('data-product="perfume-ambre"'));
  shop.element('catalog-search').value = 'perfume 50 ml';
  shop.emit('catalog-search', 'input');
  assert.ok(shop.element('product-grid').innerHTML.includes('data-product="perfume-rose"'));
  assert.ok(!shop.element('product-grid').innerHTML.includes('data-product="gloss-pearl"'));
});

test('Repeated filter searches reuse the bilingual index instead of re-translating every product', () => {
  const shop = createHarness();
  const results = shop.run(`(() => {
    let indexed = 0;
    const index = catalogQuery.createIndex(products, product => { indexed += 1; return product.id; });
    const matches = ['rose','perfume','gloss'].map(query => catalogQuery.select(products,{query},index).length);
    return JSON.stringify({indexed,total:products.length,matches});
  })()`);
  const observed = JSON.parse(results);
  assert.equal(observed.indexed, observed.total);
  assert.ok(observed.matches.every(count => count > 0));
});

test('Multiword typing keeps its space and IME composition commits only on completion', () => {
  const shop = createHarness();
  shop.element('catalog-search').value = '50 ';
  shop.emit('catalog-search', 'input');
  assert.equal(shop.element('catalog-search').value, '50 ');
  shop.element('catalog-search').value = '50 ml';
  shop.emit('catalog-search', 'input', {isComposing:true});
  assert.equal(shop.view().query, '50 ');
  const composingEnter = shop.emit('catalog-search', 'keydown', {key:'Enter', isComposing:true});
  assert.notEqual(composingEnter.defaultPrevented, true);
  shop.emit('catalog-search', 'compositionend');
  assert.equal(shop.view().query, '50 ml');
  assert.equal(shop.element('search').value, '50 ml');
  assert.equal(new URL(shop.url()).searchParams.get('q'), '50 ml');
});

test('Enter moves focus to results, closes header search and honors reduced motion', () => {
  const shop = createHarness({reduceMotion:true});
  shop.element('search-bar').hidden = false;
  shop.element('search').value = '50 ml';
  shop.emit('search', 'input');
  const enter = shop.emit('search', 'keydown', {key:'Enter'});
  assert.equal(enter.defaultPrevented, true);
  assert.equal(shop.focused(), 'results-count');
  assert.equal(shop.element('results-count').getAttribute('tabindex'), '-1');
  assert.equal(shop.element('search-bar').hidden, true);
  assert.equal(shop.element('search-toggle').getAttribute('aria-expanded'), null);
  assert.equal(shop.element('coleccion').lastScrollOptions.behavior, 'auto');
});

test('Search is bounded and Escape clears both inputs and the linked query without history spam', () => {
  const shop = createHarness();
  shop.element('catalog-search').value = 'x'.repeat(200);
  shop.emit('catalog-search', 'input');
  assert.equal(shop.view().query.length, 120);
  assert.equal(shop.element('search').value.length, 120);
  const escape = shop.emit('catalog-search', 'keydown', {key:'Escape'});
  assert.equal(escape.defaultPrevented, true);
  assert.equal(shop.view().query, '');
  assert.equal(shop.element('search').value, '');
  assert.equal(shop.element('catalog-search').value, '');
  assert.equal(new URL(shop.url()).searchParams.has('q'), false);
  assert.equal(shop.history.length, 1);
});

test('Intimates groups all nine clothing concepts while retaining their original categories', () => {
  const shop = createHarness({href:'https://example.test/annys-le-rose/?category=intimates'});
  const ids = [...shop.element('product-grid').innerHTML.matchAll(/data-product-id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(ids, ['cherry-body','ivory-bralette','blush-robe','rose','noir','lune','rose-bra','noir-brief','lune-top']);
  assert.equal(shop.view().category, 'intimates');
  assert.equal(shop.element('filter-size').disabled, false);
  assert.deepEqual([...new Set(shop.readCatalog().filter(product => ids.includes(product.id)).map(product => product.category))], ['lingerie','essentials','lounge']);
  shop.element('filter-size').value = 'XS';
  shop.emit('filter-size', 'change');
  assert.ok(!shop.element('product-grid').innerHTML.includes('data-product="blush-robe"'));
  assert.equal([...shop.element('product-grid').innerHTML.matchAll(/data-product-id=/g)].length, 8);
});

test('An intimates link shares and restores the same filtered clothing view', async () => {
  const shop = createHarness({href:'https://example.test/annys-le-rose/?category=intimates&size=M&color=cherry&sort=low#coleccion'});
  await shop.run('shareCatalogView()');
  assert.deepEqual(shop.copiedLinks, ['https://example.test/annys-le-rose/catalog.html?category=intimates&size=M&color=cherry&sort=low#coleccion']);
  const restored = createHarness({href:shop.copiedLinks[0], language:'en'});
  assert.deepEqual(restored.view(), shop.view());
  const ids = markup => [...markup.matchAll(/data-product-id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(ids(restored.element('product-grid').innerHTML), ids(shop.element('product-grid').innerHTML));
  assert.equal(ids(restored.element('product-grid').innerHTML).length, 3);
});

test('Editorial discovery clears previous filters and preserves that view for Back', () => {
  const href = 'https://example.test/annys-le-rose/?category=lingerie&q=rose&size=M&color=cherry&price=from40to65&sort=high#coleccion';
  for (const category of ['all','intimates','lingerie','essentials','lounge','fragrance','beauty','exclusive']) {
    const shop = createHarness({href, reduceMotion:true});
    const before = shop.view();
    shop.element('navigation').classList.add('open');
    shop.element('search-bar').hidden = false;
    const click = shop.click({dataset:{discover:category}});
    assert.equal(click.defaultPrevented, true);
    assert.deepEqual(shop.view(), {category, query:'', sort:'featured', size:'', color:'', price:''});
    assert.equal(shop.element('search').value, '');
    assert.equal(shop.element('catalog-search').value, '');
    assert.equal(shop.element('sort').value, 'featured');
    assert.equal(shop.element('search-bar').hidden, true);
    assert.equal(shop.element('navigation').classList.contains('open'), false);
    assert.equal(shop.focused(), 'results-count');
    assert.equal(shop.element('coleccion').lastScrollOptions.behavior, 'auto');
    assert.equal(shop.history.length, 2);
    shop.history.go(-1);
    assert.deepEqual(shop.view(), before);
    assert.equal(shop.element('catalog-search').value, 'rose');
    shop.history.go(1);
    assert.equal(shop.view().category, category);
    assert.equal(shop.view().query, '');
  }
});

test('Catalog tabs preserve filters while supporting the aggregate intimates category', () => {
  const shop = createHarness({href:'https://example.test/annys-le-rose/?category=lingerie&q=rose&size=M&color=cherry&price=from40to65&sort=high#coleccion'});
  const before = shop.view();
  shop.click({dataset:{filter:'intimates'}});
  assert.deepEqual(shop.view(), {...before, category:'intimates'});
  assert.ok(shop.element('product-grid').innerHTML.includes('data-product="rose"'));
  shop.click({dataset:{filter:'fragrance'}});
  assert.deepEqual(shop.view(), {...before, category:'fragrance', size:''});
});

test('Editorial entrances reject arbitrary destinations and category aliases produce stable URLs', () => {
  const shop = createHarness({href:'https://example.test/annys-le-rose/?category=lingerie&q=rose&size=M#coleccion'});
  const before = shop.view();
  for (const invalid of ['favorites','https://example.test/other','intimates&cart=secret','']) {
    const click = shop.click({dataset:{discover:invalid}});
    assert.equal(click.defaultPrevented, true);
    assert.deepEqual(shop.view(), before);
    assert.equal(shop.history.length, 1);
  }
  shop.click({dataset:{filter:'Íntimos'}});
  assert.equal(shop.view().category, 'intimates');
  assert.equal(new URL(shop.url()).searchParams.get('category'), 'intimates');
  shop.click({dataset:{filter:'Intimates'}});
  assert.equal(shop.history.length, 2);
  assert.equal(new URL(shop.url()).searchParams.get('category'), 'intimates');
  expectError(() => shop.stage(exclusiveSelection), 'errors.editionClosed');
});

test('Modified discovery link clicks preserve native navigation and the current catalog view', () => {
  const shop = createHarness({href:'https://example.test/annys-le-rose/?category=lingerie&q=rose&size=M&sort=high#coleccion'});
  const before = shop.view();
  const href = shop.url();
  for (const eventProperties of [{ctrlKey:true},{metaKey:true},{shiftKey:true},{altKey:true},{button:1},{button:2}]) {
    const click = shop.click({dataset:{discover:'fragrance'}, tagName:'A', eventProperties});
    assert.notEqual(click.defaultPrevented, true);
    assert.deepEqual(shop.view(), before);
    assert.equal(shop.url(), href);
    assert.equal(shop.history.length, 1);
    assert.equal(shop.element('coleccion').lastScrollOptions, undefined);
  }
  const normalClick = shop.click({dataset:{discover:'fragrance'}, tagName:'A', eventProperties:{button:0}});
  assert.equal(normalClick.defaultPrevented, true);
  assert.deepEqual(shop.view(), {category:'fragrance', query:'', sort:'featured', size:'', color:'', price:''});
});

test('Home boots without catalog controls and keeps six fixed highlights while searching', () => {
  const home = createHarness({page:'home', href:'https://example.test/annys-le-rose/index.html'});
  const ids = () => [...home.element('product-grid').innerHTML.matchAll(/data-product-id="([^"]+)"/g)].map(match => match[1]);
  const expected = ['cherry-body','ivory-bralette','lune-top','blush-robe','perfume-rose','gloss-cherry'];
  assert.deepEqual(ids(), expected);
  home.element('search').value = '50 ml';
  home.emit('search', 'input');
  assert.deepEqual(ids(), expected);
  assert.ok(home.element('search-results-status').textContent.startsWith('4 '));
  assert.equal(home.url(), 'https://example.test/annys-le-rose/index.html');
  assert.equal(home.navigations.length, 0);
  home.click({dataset:{favorite:'gloss-pearl'}});
  assert.deepEqual(ids(), expected);
  assert.equal(home.element('favorite-count').textContent, 1);
});

test('Home universe links preserve native page navigation for ordinary and modified clicks', () => {
  const home = createHarness({page:'home', href:'https://example.test/annys-le-rose/'});
  for (const discover of ['all','intimates','lingerie','essentials','lounge','fragrance','beauty','exclusive']) {
    for (const eventProperties of [{button:0},{ctrlKey:true},{metaKey:true}]) {
      const event = home.click({dataset:{discover}, tagName:'A', eventProperties});
      assert.notEqual(event.defaultPrevented, true);
      assert.equal(home.view().category, 'all');
      assert.equal(home.navigations.length, 0);
      assert.equal(home.history.length, 1);
    }
  }
});

test('Home search Enter navigates to the full catalog with the bounded bilingual query', () => {
  const home = createHarness({page:'home', href:'https://example.test/annys-le-rose/index.html'});
  home.element('search').value = '50 ml';
  home.emit('search', 'input');
  const event = home.emit('search', 'keydown', {key:'Enter'});
  assert.equal(event.defaultPrevented, true);
  assert.deepEqual(home.navigations, [{method:'assign', url:'https://example.test/annys-le-rose/catalog.html?q=50+ml#coleccion'}]);
  const catalog = createHarness({page:'catalog', href:home.navigations[0].url, sharedStorage:home.storage});
  assert.equal(catalog.view().query, '50 ml');
  assert.equal([...catalog.element('product-grid').innerHTML.matchAll(/data-product-id=/g)].length, 4);
  assert.equal(catalog.element('catalog-search').value, '50 ml');
});

test('Home favorites open the local catalog view without placing saved product IDs in its URL', async () => {
  const home = createHarness({page:'home', href:'https://example.test/annys-le-rose/index.html', language:'en'});
  home.click({dataset:{favorite:'gloss-pearl'}});
  home.emit('favorites-toggle', 'click');
  assert.deepEqual(home.navigations, [{method:'assign', url:'https://example.test/annys-le-rose/catalog.html#favorites'}]);
  const catalog = createHarness({page:'catalog', href:home.navigations[0].url, sharedStorage:home.storage});
  assert.equal(catalog.view().category, 'favorites');
  assert.equal(catalog.element('collection-title').textContent, 'My favorites');
  assert.equal(catalog.element('catalog-share').disabled, true);
  assert.ok(catalog.element('product-grid').innerHTML.includes('data-product="gloss-pearl"'));
  assert.equal([...catalog.element('product-grid').innerHTML.matchAll(/data-product-id=/g)].length, 1);
  await catalog.run('shareCatalogView()');
  assert.equal(catalog.copiedLinks.length, 0);
});

test('Bag variants and chosen language remain shared between home and catalog', () => {
  const home = createHarness({page:'home', href:'https://example.test/annys-le-rose/index.html', language:'en'});
  home.run("openProduct('perfume-rose')");
  home.click({id:'add-cart'});
  home.run("openProduct('gloss-cherry')");
  home.click({id:'add-cart'});
  home.run("i18n.setLanguage('es')");
  const before = home.cart();
  assert.equal(home.run('cartSubtotal()'), 82);
  const catalog = createHarness({page:'catalog', sharedStorage:home.storage});
  assert.equal(catalog.run('i18n.language'), 'es');
  assert.deepEqual(catalog.cart(), before);
  catalog.run("openProduct('perfume-rose')");
  assert.equal(catalog.run('selectedSize'), '50 ml');
  catalog.run("i18n.setLanguage('en'); openCart($('#cart-toggle'))");
  assert.ok(catalog.element('cart-items').innerHTML.includes('Volume: 50 ml'));
  const returnedHome = createHarness({page:'home', href:'https://example.test/annys-le-rose/index.html', sharedStorage:catalog.storage});
  assert.equal(returnedHome.run('i18n.language'), 'en');
  assert.deepEqual(returnedHome.cart(), before);
});

test('Annual protection works on home and a catalog without an edition section', () => {
  const line = {id:'edition-perfume', size:'50 ml', color:'Rojo cereza', quantity:1};
  for (const page of ['home','catalog']) {
    const shop = createHarness({page, href:`https://example.test/annys-le-rose/${page === 'home' ? 'index' : 'catalog'}.html`, savedCart:[line]});
    assert.equal(shop.cart().length, 0);
    expectError(() => shop.stage(exclusiveSelection), 'errors.editionClosed');
    const allowed = createHarness({page, href:`https://example.test/annys-le-rose/${page === 'home' ? 'index' : 'catalog'}.html`, announced:true});
    allowed.stage(exclusiveSelection);
    allowed.clock('2026-10-06T04:00:00Z');
    assert.equal(allowed.stage(regularSelection).subtotal, 64);
    assert.equal(allowed.cart().length, 1);
  }
});

test('Legacy home catalog queries migrate by replacement to the allowlisted catalog URL', () => {
  for (const entry of ['index.html','']) {
    const home = createHarness({page:'home', href:`https://example.test/annys-le-rose/${entry}?category=intimates&q=rose&size=M&color=cherry&price=from40to65&sort=high&cart=private&language=es`});
    assert.deepEqual(home.navigations, [{method:'replace', url:'https://example.test/annys-le-rose/catalog.html?category=intimates&q=rose&size=M&color=cherry&price=from40to65&sort=high#coleccion'}]);
    assert.equal(home.history.length, 1);
    const restored = createHarness({page:'catalog', href:home.navigations[0].url});
    assert.deepEqual(restored.view(), {category:'intimates', query:'rose', sort:'high', size:'M', color:'cherry', price:'from40to65'});
  }
  const ordinaryHome = createHarness({page:'home', href:'https://example.test/annys-le-rose/index.html?utm_source=example#universos'});
  assert.equal(ordinaryHome.navigations.length, 0);
});

test('Catalog category titles, clothing subfilters and color labels update after translation', () => {
  const catalog = createHarness({page:'catalog', href:'https://example.test/annys-le-rose/catalog.html?category=lounge', language:'en'});
  assert.equal(catalog.element('collection-title').textContent, 'Sleep & lounge');
  assert.equal(catalog.element('clothing-filters').hidden, false);
  assert.equal(catalog.filterButton('intimates').getAttribute('aria-pressed'), 'true');
  assert.equal(catalog.filterButton('Descanso').getAttribute('aria-pressed'), 'true');
  catalog.run("i18n.setLanguage('es')");
  assert.equal(catalog.element('collection-title').textContent, 'Descanso');
  catalog.click({dataset:{discover:'fragrance'}});
  assert.equal(catalog.element('collection-title').textContent, 'Perfumes');
  assert.equal(catalog.element('filter-color-label').textContent, 'Color del frasco');
  assert.equal(catalog.element('clothing-filters').hidden, true);
  assert.equal(catalog.element('label[for="filter-size"]').hidden, true);
  assert.equal(catalog.element('filter-size').disabled, true);
  catalog.run("i18n.setLanguage('en')");
  assert.equal(catalog.element('filter-color-label').textContent, 'Bottle color');
  catalog.click({dataset:{discover:'beauty'}});
  assert.equal(catalog.element('filter-color-label').textContent, 'Shade');
  assert.equal(catalog.element('collection-title').textContent, 'Lip gloss');
  catalog.click({dataset:{discover:'intimates'}});
  assert.equal(catalog.element('filter-color-label').textContent, 'Color');
  assert.equal(catalog.element('label[for="filter-size"]').hidden, false);
});

test('Favorites reload and Back restore local views while retaining the previous filtered collection', () => {
  const href = 'https://example.test/annys-le-rose/catalog.html?category=intimates&q=ivory&sort=high#coleccion';
  const catalog = createHarness({page:'catalog', href, savedFavorites:['rose','gloss-pearl']});
  const before = catalog.view();
  catalog.emit('favorites-toggle', 'click');
  assert.equal(catalog.url(), 'https://example.test/annys-le-rose/catalog.html#favorites');
  assert.equal([...catalog.element('product-grid').innerHTML.matchAll(/data-product-id=/g)].length, 2);
  assert.deepEqual(catalog.view(), {category:'favorites', query:'', sort:'featured', size:'', color:'', price:''});
  const reload = createHarness({page:'catalog', href:catalog.url(), sharedStorage:catalog.storage});
  assert.equal(reload.view().category, 'favorites');
  assert.equal(reload.element('catalog-share').disabled, true);
  catalog.history.go(-1);
  assert.deepEqual(catalog.view(), before);
  catalog.history.go(1);
  assert.equal(catalog.view().category, 'favorites');
});

test('Home continue browsing goes to the catalog and a fresh catalog renders all sixteen concepts', () => {
  const home = createHarness({page:'home', href:'https://example.test/annys-le-rose/index.html'});
  home.emit('cart-toggle', 'click');
  home.click({dataset:{continue:''}});
  assert.equal(home.element('cart-dialog').open, false);
  assert.deepEqual(home.navigations, [{method:'assign', url:'https://example.test/annys-le-rose/catalog.html#coleccion'}]);
  const catalog = createHarness({page:'catalog', href:home.navigations[0].url});
  assert.equal([...catalog.element('product-grid').innerHTML.matchAll(/data-product-id=/g)].length, 16);
  assert.equal(catalog.element('clothing-filters').hidden, true);
  assert.equal(catalog.element('collection-title').textContent, 'Todos los conceptos');
});

test('A cached home reconciles catalog additions before saving another favorite', () => {
  const home = createHarness({page:'home', href:'https://example.test/annys-le-rose/index.html'});
  home.element('search').value = 'lace';
  home.emit('search', 'input');
  home.element('search').focus();
  const catalog = createHarness({page:'catalog', sharedStorage:home.storage});
  catalog.stage(regularSelection);
  catalog.click({dataset:{favorite:'gloss-pearl'}});
  home.storage.set('alr-edition-interest', 'true');
  home.emitWindow('pageshow', {persisted:true});
  assert.deepEqual(home.cart(), catalog.cart());
  assert.equal(home.element('cart-count').textContent, 1);
  assert.equal(home.element('favorite-count').textContent, 1);
  assert.equal(home.run('editionInterest'), true);
  assert.equal(home.view().query, 'lace');
  assert.equal(home.focused(), 'search');
  home.click({dataset:{favorite:'lune-top'}});
  assert.deepEqual(home.storedCart(), catalog.cart());
  assert.deepEqual(JSON.parse(home.storage.get('alr-favorites')), ['gloss-pearl','lune-top']);
});

test('A cached catalog reconciles removals without resurrecting the previous bag or favorites', () => {
  const savedCart = [{id:'perfume-rose', size:'50 ml', color:'Marfil', quantity:1}];
  const catalog = createHarness({page:'catalog', href:'https://example.test/annys-le-rose/catalog.html?category=intimates&q=ivory&sort=high#coleccion', savedCart, savedFavorites:['rose','gloss-pearl']});
  const view = catalog.view();
  catalog.element('catalog-search').focus();
  const home = createHarness({page:'home', href:'https://example.test/annys-le-rose/index.html', sharedStorage:catalog.storage});
  home.click({dataset:{remove:'0'}});
  home.click({dataset:{favorite:'rose'}});
  catalog.emitWindow('pageshow', {persisted:true});
  assert.equal(catalog.cart().length, 0);
  assert.equal(catalog.element('cart-count').hidden, true);
  assert.equal(catalog.element('favorite-count').textContent, 1);
  assert.deepEqual(catalog.view(), view);
  assert.equal(catalog.focused(), 'catalog-search');
  catalog.click({dataset:{favorite:'noir'}});
  assert.deepEqual(catalog.storedCart(), []);
  assert.deepEqual(JSON.parse(catalog.storage.get('alr-favorites')), ['gloss-pearl','noir']);
});

test('Blocked storage on cached restoration retains valid in-memory selections and focus', () => {
  const catalog = createHarness({page:'catalog', href:'https://example.test/annys-le-rose/catalog.html?category=intimates&q=rose#coleccion'});
  catalog.stage(regularSelection);
  catalog.click({dataset:{favorite:'rose'}});
  catalog.run("$('#cart-dialog').close()");
  catalog.element('catalog-search').focus();
  const cart = catalog.cart();
  const view = catalog.view();
  catalog.storage.set('alr-cart', '[]');
  catalog.storage.set('alr-favorites', '[]');
  catalog.blockStorage(true);
  catalog.emitWindow('pageshow', {persisted:true});
  assert.deepEqual(catalog.cart(), cart);
  assert.deepEqual(catalog.view(), view);
  assert.equal(catalog.element('favorite-count').textContent, 1);
  assert.equal(catalog.focused(), 'catalog-search');
  catalog.click({dataset:{favorite:'gloss-cherry'}});
  assert.deepEqual(catalog.cart(), cart);
  assert.equal(catalog.element('favorite-count').textContent, 2);
  assert.deepEqual(catalog.storedCart(), []);
  assert.equal(catalog.run('currentToastKey'), 'toast.favoriteAdded');
});

test('WebMCP tools are released on departure and registered again after cached restoration', () => {
  const shop = createHarness({page:'home', href:'https://example.test/annys-le-rose/index.html'});
  assert.deepEqual(shop.toolNames(), ['read_sample_catalog','stage_sample_bag']);
  shop.emitWindow('pagehide', {persisted:true});
  assert.deepEqual(shop.toolNames(), []);
  shop.emitWindow('pageshow', {persisted:true});
  assert.deepEqual(shop.toolNames(), ['read_sample_catalog','stage_sample_bag']);
  assert.equal(shop.readCatalog().length, 16);
  expectError(() => shop.stage(exclusiveSelection), 'errors.editionClosed');
});

test('Category color choices use only their family and retain an explicit incompatible linked filter', () => {
  const catalog = createHarness({page:'catalog', language:'en', href:'https://example.test/annys-le-rose/catalog.html?category=beauty&color=amber'});
  const colors = () => catalog.element('filter-color').innerHTML;
  assert.ok(colors().includes('value="cherry"'));
  assert.ok(colors().includes('value="blush"'));
  assert.ok(!colors().includes('value="black"'));
  assert.ok(!colors().includes('value="ivory"'));
  assert.ok(colors().includes('Amber (selected filter)'));
  assert.equal(catalog.element('filter-color').value, 'amber');
  assert.ok(catalog.element('active-filters').innerHTML.includes('data-clear-filter="color"'));
  assert.equal(catalog.element('catalog-empty').hidden, false);
  catalog.click({dataset:{clearFilter:'color'}});
  assert.equal(catalog.view().color, '');
  assert.ok(!colors().includes('value="amber"'));
  assert.equal(catalog.element('catalog-empty').hidden, true);
});

test('Changing category clears an incompatible color but retains compatible colors and supports Back', () => {
  const catalog = createHarness({page:'catalog', href:'https://example.test/annys-le-rose/catalog.html?category=fragrance&color=amber'});
  catalog.run("setCategory('beauty')");
  assert.equal(catalog.view().color, '');
  assert.ok(!catalog.url().includes('color='));
  catalog.history.go(-1);
  assert.equal(catalog.view().color, 'amber');
  catalog.run("setCategory('all')");
  assert.equal(catalog.view().color, 'amber');
  catalog.run("setCategory('lingerie')");
  assert.equal(catalog.view().color, '');
  assert.ok(!catalog.element('filter-color').innerHTML.includes('value="amber"'));
});

test('Product pages use the shared selection logic and preserve variants across language changes', () => {
  const page = createHarness({page:'product', productId:'rose-bra', language:'en', href:'https://example.test/annys-le-rose/product-rose-bra.html'});
  assert.ok(page.element('product-page-detail').innerHTML.includes('<h1 id="product-title">Rose · Lace bra</h1>'));
  assert.equal(page.element('product-dialog').open, false);
  assert.equal(page.run('selectedSize'), '');
  page.click({dataset:{size:'M'}});
  page.click({id:'add-cart'});
  assert.deepEqual(page.cart(), [{id:'rose-bra', size:'M', color:'Rojo cereza', quantity:1}]);
  assert.equal(page.element('product-dialog').open, false);
  page.run("i18n.setLanguage('es')");
  assert.equal(page.run('selectedSize'), 'M');
  assert.ok(page.element('product-page-detail').innerHTML.includes('Sujetador de encaje'));
  assert.ok(page.run('document.title').includes('Sujetador de encaje'));
  assert.ok(page.run('document.title').includes('Concepto'));
  assert.ok(page.element('concept-image-dialog').getAttribute('aria-label').includes('Ampliar'));
});

test('Product-page beauty formats and annual edition gates match the quick view and shopping tool', () => {
  const fragrance = createHarness({page:'product', productId:'perfume-rose'});
  assert.equal(fragrance.run('selectedSize'), '50 ml');
  fragrance.click({id:'add-cart'});
  assert.equal(fragrance.cart()[0].size, '50 ml');
  const exclusive = createHarness({page:'product', productId:'edition-coffret'});
  assert.ok(exclusive.element('product-page-detail').innerHTML.includes('id="add-cart" disabled'));
  assert.equal(exclusive.run('selectedSize'), 'Set');
  exclusive.click({id:'add-cart'});
  assert.equal(exclusive.cart().length, 0);
  assert.equal(exclusive.run('currentToastKey'), 'errors.editionClosed');
});

test('Full concept navigation preserves context while copied URLs contain only the product path', async () => {
  const catalog = createHarness({page:'catalog'});
  assert.ok(catalog.element('product-grid').innerHTML.includes('class="product-open" href="product-cherry-body.html?return=catalog.html%23coleccion"'));
  assert.ok(catalog.element('product-grid').innerHTML.includes('class="product-title-button" href="product-cherry-body.html?return=catalog.html%23coleccion"'));
  catalog.run("openProduct('rose-bra')");
  assert.ok(catalog.element('product-detail').innerHTML.includes('href="product-rose-bra.html?return=catalog.html%23coleccion&amp;variant_color=Rojo+cereza"'));
  const page = createHarness({page:'product', productId:'rose-bra', href:'https://example.test/annys-le-rose/product-rose-bra.html?utm_source=friend#image'});
  await page.run("shareProduct('rose-bra')");
  assert.deepEqual(page.copiedLinks, ['https://example.test/annys-le-rose/product-rose-bra.html']);
  assert.equal(page.navigations.length, 0);
  const blocked = createHarness({page:'product', clipboard:false});
  await blocked.run("shareProduct('rose-bra')");
  assert.equal(blocked.run('currentToastKey'), 'toast.linkCopyUnavailable');
});

test('Product-page size guidance returns to the page without opening a quick-view dialog', () => {
  const page = createHarness({page:'product', productId:'rose-bra'});
  page.click({dataset:{guide:''}});
  assert.equal(page.element('info-dialog').open, true);
  assert.equal(page.element('product-dialog').open, false);
  page.click({id:'back-to-product'});
  assert.equal(page.element('info-dialog').open, false);
  assert.equal(page.element('product-dialog').open, false);
  assert.equal(page.run("document.body.classList.contains('modal-open')"), false);
  assert.equal(page.focused(), '[data-guide]');
});

test('Image enlargement uses an accessible dialog and preserves modified native image links', () => {
  const page = createHarness({page:'product'});
  const modified = page.click({dataset:{zoom:''}, tagName:'A', eventProperties:{ctrlKey:true}});
  assert.notEqual(modified.defaultPrevented, true);
  assert.equal(page.element('concept-image-dialog').open, false);
  const normal = page.click({dataset:{zoom:''}, tagName:'A', eventProperties:{button:0}});
  assert.equal(normal.defaultPrevented, true);
  assert.equal(page.element('concept-image-dialog').open, true);
  page.element('concept-image-dialog').close();
  assert.equal(page.run("document.body.classList.contains('modal-open')"), false);
});

test('Cached product pages reconcile favorites and bag changes made on another page', () => {
  const page = createHarness({page:'product', productId:'rose-bra', language:'en'});
  page.click({dataset:{favorite:'rose-bra'}});
  assert.ok(page.element('product-page-detail').innerHTML.includes('Saved to favorites'));
  page.click({dataset:{size:'M'}});
  page.click({id:'add-cart'});
  const catalog = createHarness({page:'catalog', sharedStorage:page.storage});
  catalog.click({dataset:{favorite:'rose-bra'}});
  catalog.click({dataset:{remove:'0'}});
  page.emitWindow('pageshow', {persisted:true});
  assert.equal(page.cart().length, 0);
  assert.equal(page.element('favorite-count').textContent, 0);
  assert.ok(page.element('product-page-detail').innerHTML.includes('Save to favorites'));
  page.click({dataset:{favorite:'rose-bra'}});
  assert.deepEqual(page.storedCart(), []);
});

test('Product global search and favorites navigate to canonical catalog routes', () => {
  const page = createHarness({page:'product', href:'https://example.test/annys-le-rose/product-rose-bra.html'});
  page.element('search').value = '50 ml';
  page.emit('search', 'input');
  assert.ok(page.element('search-results-status').textContent.startsWith('4 '));
  page.emit('search', 'keydown', {key:'Enter'});
  assert.equal(page.navigations[0].url, 'https://example.test/annys-le-rose/catalog.html?q=50+ml#coleccion');
  page.emit('favorites-toggle', 'click');
  assert.equal(page.navigations[1].url, 'https://example.test/annys-le-rose/catalog.html#favorites');
});

test('An already-open catalog favorite cannot erase a bag or interest saved in another tab', () => {
  const catalog = createHarness({page:'catalog', language:'en'});
  const product = createHarness({page:'product', productId:'perfume-rose', sharedStorage:catalog.storage});
  product.stage({id:'perfume-rose', size:'50 ml', color:'ivory'});
  const home = createHarness({page:'home', sharedStorage:catalog.storage});
  home.emit('edition-interest', 'click');
  // No pageshow, focus or storage event has reached the older catalog yet.
  catalog.click({dataset:{favorite:'rose-bra'}});
  assert.deepEqual(catalog.storedCart(), product.cart());
  assert.equal(catalog.storage.get('alr-edition-interest'), 'true');
  assert.deepEqual(catalog.storageWrites.map(write => write.key), ['alr-favorites']);
  assert.equal(catalog.element('cart-count').textContent, 1);
  assert.equal(catalog.element('favorite-count').textContent, 1);
});

test('Mutations merge with the latest same-field data and preserve the visible favorite intention', () => {
  const first = createHarness({page:'catalog'});
  const second = createHarness({page:'product', productId:'perfume-rose', sharedStorage:first.storage});
  second.stage({id:'perfume-rose', size:'50 ml', color:'ivory'});
  first.stage({id:'gloss-cherry', size:'6 ml', color:'cherry'});
  assert.deepEqual(first.cart().map(line => line.id), ['perfume-rose','gloss-cherry']);
  second.click({dataset:{favorite:'rose-bra'}});
  first.click({dataset:{favorite:'rose-bra'}});
  // Both users clicked an unsaved heart: the second action should stay saved.
  assert.deepEqual(JSON.parse(first.storage.get('alr-favorites')), ['rose-bra']);
  second.click({dataset:{favorite:'noir'}});
  first.click({dataset:{favorite:'lune-top'}});
  assert.deepEqual(JSON.parse(first.storage.get('alr-favorites')), ['rose-bra','noir','lune-top']);
  assert.equal(first.storedCart().length, 2);
});

test('Storage events update product selection UI without losing focus, chosen size or URL filters', () => {
  const page = createHarness({page:'product', productId:'rose-bra', language:'en'});
  page.click({dataset:{size:'M'}});
  page.element('search').value = 'lace';
  page.emit('search', 'input');
  page.element('search').focus();
  const before = page.view();
  const other = createHarness({page:'catalog', sharedStorage:page.storage});
  other.stage({id:'perfume-rose', size:'50 ml', color:'ivory'});
  other.click({dataset:{favorite:'rose-bra'}});
  page.emitWindow('storage', {key:'alr-cart'});
  assert.deepEqual(page.cart(), other.cart());
  assert.equal(page.element('favorite-count').textContent, 1);
  assert.ok(page.element('product-page-detail').innerHTML.includes('Saved to favorites'));
  assert.equal(page.run('selectedSize'), 'M');
  assert.equal(page.focused(), 'search');
  assert.deepEqual(page.view(), before);
  other.click({dataset:{favorite:'rose-bra'}});
  page.emitWindow('storage', {key:'alr-favorites'});
  assert.ok(page.element('product-page-detail').innerHTML.includes('Save to favorites'));
});

test('Returning to a product tab adopts removals and cannot resurrect them on another action', () => {
  const page = createHarness({page:'product', productId:'rose-bra', savedCart:[{id:'perfume-rose', size:'50 ml', color:'Marfil', quantity:1}], savedFavorites:['rose-bra']});
  const other = createHarness({page:'catalog', sharedStorage:page.storage});
  other.click({dataset:{remove:'0'}});
  other.click({dataset:{favorite:'rose-bra'}});
  page.emitWindow('focus');
  assert.deepEqual(page.cart(), []);
  assert.equal(page.element('favorite-count').textContent, 0);
  page.click({dataset:{size:'M'}});
  page.click({id:'add-cart'});
  assert.deepEqual(page.storedCart().map(line => line.id), ['rose-bra']);
  other.emitDocument('visibilitychange');
  assert.deepEqual(other.cart(), page.cart());
  assert.equal(other.element('cart-count').textContent, 1);
  assert.deepEqual(JSON.parse(other.storage.get('alr-favorites')), []);
});

test('A stale quantity click follows its variant and never modifies a different remaining line', () => {
  const savedCart = [{id:'perfume-rose', size:'50 ml', color:'Marfil', quantity:1}, {id:'gloss-cherry', size:'6 ml', color:'Rojo cereza', quantity:1}];
  const removedTarget = createHarness({savedCart});
  const shiftedTarget = createHarness({sharedStorage:removedTarget.storage});
  const other = createHarness({sharedStorage:removedTarget.storage});
  other.click({dataset:{remove:'0'}});
  removedTarget.click({dataset:{quantity:'0', delta:'1'}});
  assert.deepEqual(removedTarget.storedCart(), [{id:'gloss-cherry', size:'6 ml', color:'Rojo cereza', quantity:1}]);
  shiftedTarget.click({dataset:{quantity:'1', delta:'1'}});
  assert.deepEqual(shiftedTarget.storedCart(), [{id:'gloss-cherry', size:'6 ml', color:'Rojo cereza', quantity:2}]);
});

test('Blocked storage during tab synchronization retains memory and focus; a remote clear is adopted when readable', () => {
  const page = createHarness({page:'product', productId:'rose-bra'});
  page.click({dataset:{size:'M'}});
  page.click({id:'add-cart'});
  page.click({dataset:{favorite:'rose-bra'}});
  page.element('search').focus();
  const before = page.cart();
  page.storage.clear();
  page.blockStorage(true);
  page.emitWindow('storage', {key:null});
  page.emitWindow('focus');
  page.emitDocument('visibilitychange');
  assert.deepEqual(page.cart(), before);
  assert.equal(page.element('favorite-count').textContent, 1);
  assert.equal(page.focused(), 'search');
  page.blockStorage(false);
  page.emitWindow('storage', {key:null});
  assert.deepEqual(page.cart(), []);
  assert.equal(page.element('favorite-count').textContent, 0);
  assert.equal(page.focused(), 'search');
});

test('Clear filters keeps the current collection and search while resetting refinements and sorting', () => {
  const shop = createHarness({page:'catalog', href:'https://example.test/annys-le-rose/catalog.html?category=fragrance&q=50+ml&color=ivory&price=from40to65&sort=high'});
  shop.emit('clear-filters', 'click');
  assert.deepEqual(shop.view(), {category:'fragrance', query:'50 ml', sort:'featured', size:'', color:'', price:''});
  assert.equal(shop.element('catalog-search').value, '50 ml');
  assert.equal(shop.element('sort').value, 'featured');
  assert.equal([...shop.element('product-grid').innerHTML.matchAll(/data-product-id=/g)].length, 3);
  assert.equal(shop.url(), 'https://example.test/annys-le-rose/catalog.html?category=fragrance&q=50+ml#coleccion');
});

test('Clear filters keeps favorites scoped, while View all explicitly resets the entire catalog', () => {
  const shop = createHarness({page:'catalog', href:'https://example.test/annys-le-rose/catalog.html?q=rose&size=M&sort=low#favorites', savedFavorites:['rose','noir']});
  shop.emit('clear-filters', 'click');
  assert.deepEqual(shop.view(), {category:'favorites', query:'rose', sort:'featured', size:'', color:'', price:''});
  assert.ok(shop.element('product-grid').innerHTML.includes('data-product-id="rose"'));
  assert.ok(!shop.element('product-grid').innerHTML.includes('data-product-id="noir"'));
  shop.emit('reset-filter', 'click');
  assert.deepEqual(shop.view(), {category:'all', query:'', sort:'featured', size:'', color:'', price:''});
  assert.equal([...shop.element('product-grid').innerHTML.matchAll(/data-product-id=/g)].length, 16);
});

test('Nondefault sorting remains visible and removable without clearing other active filters', () => {
  const shop = createHarness({page:'catalog', language:'en', href:'https://example.test/annys-le-rose/catalog.html?category=intimates&q=rose&size=M&sort=high'});
  assert.ok(shop.element('active-filters').innerHTML.includes('data-clear-filter="sort"'));
  assert.ok(shop.element('active-filters').innerHTML.includes('Sort: Price: high to low'));
  assert.equal(shop.element('filter-count').hidden, false);
  assert.equal(shop.element('filter-count').textContent, '2');
  assert.equal(shop.element('filter-count').getAttribute('aria-label'), '2 active');
  shop.run("i18n.setLanguage('es')");
  assert.ok(shop.element('active-filters').innerHTML.includes('Orden: Precio: mayor a menor'));
  shop.click({dataset:{clearFilter:'sort'}});
  assert.deepEqual(shop.view(), {category:'intimates', query:'rose', sort:'featured', size:'M', color:'', price:''});
  assert.equal(shop.element('sort').value, 'featured');
  assert.ok(!shop.element('active-filters').innerHTML.includes('data-clear-filter="sort"'));
  assert.ok(!shop.url().includes('sort='));
});

test('View results closes the filter panel and moves focus and scroll to the results', () => {
  for (const reduceMotion of [true, false]) {
    const shop = createHarness({page:'catalog', reduceMotion, href:'https://example.test/annys-le-rose/catalog.html?category=beauty&price=under40'});
    const before = shop.view();
    shop.element('.catalog-filters').open = true;
    shop.emit('apply-filters', 'click');
    assert.equal(shop.element('.catalog-filters').open, false);
    assert.equal(shop.focused(), 'results-count');
    assert.equal(shop.element('results-count').getAttribute('tabindex'), '-1');
    assert.equal(shop.element('results-count').lastScrollOptions.behavior, reduceMotion ? 'auto' : 'smooth');
    assert.equal(shop.element('results-count').lastScrollOptions.block, 'start');
    assert.deepEqual(shop.view(), before);
  }
});

test('Catalog search shortcut focuses the existing search without opening a duplicate field', () => {
  const shop = createHarness({page:'catalog', reduceMotion:true, href:'https://example.test/annys-le-rose/catalog.html?category=intimates&q=rose&size=M'});
  const before = shop.view();
  shop.element('navigation').classList.add('open');
  shop.emit('search-toggle', 'click');
  assert.equal(shop.focused(), 'catalog-search');
  assert.equal(shop.element('search-bar').hidden, true);
  assert.equal(shop.element('navigation').classList.contains('open'), false);
  assert.equal(shop.element('catalog-search').lastScrollOptions.behavior, 'auto');
  assert.equal(shop.element('catalog-search').lastScrollOptions.block, 'center');
  assert.equal(shop.element('search-toggle').getAttribute('aria-expanded'), null);
  assert.deepEqual(shop.view(), before);
});

test('Home and product pages retain their expandable header search', () => {
  for (const page of ['home','product']) {
    const shop = createHarness({page});
    shop.element('search-bar').hidden = true;
    shop.emit('search-toggle', 'click');
    assert.equal(shop.element('search-bar').hidden, false);
    assert.equal(shop.element('search-toggle').getAttribute('aria-expanded'), 'true');
    assert.equal(shop.focused(), 'search');
    shop.emit('search-close', 'click');
    assert.equal(shop.element('search-bar').hidden, true);
    assert.equal(shop.element('search-toggle').getAttribute('aria-expanded'), 'false');
    assert.equal(shop.focused(), 'search-toggle');
  }
});

test('A filtered catalog product link restores its exact view and a valid selected variant', async () => {
  const catalog = createHarness({page:'catalog', href:'https://example.test/annys-le-rose/catalog.html?category=intimates&q=rose&size=M&color=cherry&price=under40&sort=high&token=private'});
  const html = catalog.element('product-grid').innerHTML;
  const link = html.match(/href="([^"]+)" data-product-link="image:rose-bra"/)[1].replaceAll('&amp;', '&');
  const title = html.match(/href="([^"]+)" data-product-link="title:rose-bra"/)[1].replaceAll('&amp;', '&');
  assert.equal(title, link);
  assert.ok(!link.includes('private'));
  const page = createHarness({page:'product', productId:'rose-bra', href:new URL(link, 'https://example.test/annys-le-rose/').href, sharedStorage:catalog.storage});
  assert.equal(page.run('selectedSize'), 'M');
  assert.equal(page.run('selectedColor'), 'Rojo cereza');
  const returned = createHarness({page:'catalog', href:new URL(page.element('.concept-back').getAttribute('href'), 'https://example.test/annys-le-rose/').href, sharedStorage:page.storage});
  assert.deepEqual(returned.view(), catalog.view());
  await page.run("shareProduct('rose-bra')");
  assert.deepEqual(page.copiedLinks, ['https://example.test/annys-le-rose/product-rose-bra.html']);
});

test('Changing size in quick view updates the full-page link and preserves that explicit choice over an older bag variant', () => {
  const catalog = createHarness({page:'catalog', href:'https://example.test/annys-le-rose/catalog.html?category=essentials&size=M', savedCart:[{id:'rose-bra', size:'XS', color:'Rojo cereza', quantity:1}]});
  catalog.run("openProduct('rose-bra')");
  assert.equal(catalog.run('selectedSize'), 'XS');
  catalog.click({dataset:{size:'L'}});
  const link = catalog.element('[data-product-link="full:rose-bra"]').getAttribute('href');
  assert.equal(new URL(link, 'https://example.test/').searchParams.get('variant_size'), 'L');
  const page = createHarness({page:'product', productId:'rose-bra', href:new URL(link, 'https://example.test/annys-le-rose/').href, sharedStorage:catalog.storage});
  assert.equal(page.run('selectedSize'), 'L');
  assert.equal(page.cart()[0].size, 'XS');
  page.run("i18n.setLanguage('en')");
  assert.equal(page.run('selectedSize'), 'L');
  assert.ok(page.element('product-page-detail').innerHTML.includes('data-size="L" aria-pressed="true"'));
});

test('A concept opened from filtered favorites returns to those local favorites without encoding saved IDs', () => {
  const catalog = createHarness({page:'catalog', href:'https://example.test/annys-le-rose/catalog.html?q=rose&size=M&sort=low#favorites', savedFavorites:['rose-bra','noir']});
  const link = catalog.element('product-grid').innerHTML.match(/href="([^"]+)" data-product-link="image:rose-bra"/)[1].replaceAll('&amp;', '&');
  const page = createHarness({page:'product', productId:'rose-bra', href:new URL(link, 'https://example.test/annys-le-rose/').href, sharedStorage:catalog.storage});
  assert.equal(page.element('.concept-back').getAttribute('href'), 'catalog.html?q=rose&size=M&sort=low#favorites');
  const returned = createHarness({page:'catalog', href:new URL(page.element('.concept-back').getAttribute('href'), 'https://example.test/annys-le-rose/').href, sharedStorage:page.storage});
  assert.deepEqual(returned.view(), catalog.view());
  assert.ok(!page.element('.concept-back').getAttribute('href').includes('noir'));
  assert.equal([...returned.element('product-grid').innerHTML.matchAll(/data-product-id=/g)].length, 1);
  returned.element('sort').value = 'high';
  returned.emit('sort', 'change');
  assert.equal(returned.url(), 'https://example.test/annys-le-rose/catalog.html?q=rose&size=M&sort=high#favorites');
  assert.equal(returned.element('catalog-share').disabled, true);
  const refreshed = createHarness({page:'catalog', href:returned.url(), sharedStorage:returned.storage});
  assert.deepEqual(refreshed.view(), returned.view());
});

test('Malformed product navigation context cannot redirect the back link or select an invalid variant', () => {
  const page = createHarness({page:'product', productId:'rose-bra', href:'https://example.test/annys-le-rose/product-rose-bra.html?return=https%3A%2F%2Fexample.com&variant_size=999&variant_color=unknown'});
  assert.equal(page.element('.concept-back').getAttribute('href'), null);
  assert.equal(page.run('selectedSize'), '');
  assert.equal(page.run('selectedColor'), 'Rojo cereza');
  assert.equal(page.navigations.length, 0);
});

test('Catalog link focus survives grid replacement on a language change', () => {
  const catalog = createHarness({page:'catalog', language:'en'});
  const anchor = catalog.element('focused-card-image');
  anchor.id = '';
  anchor.tagName = 'A';
  anchor.dataset.productLink = 'image:rose-bra';
  anchor.parentElement = catalog.element('product-grid');
  anchor.focus();
  // The old anchor becomes detached when the browser replaces the grid HTML.
  anchor.isConnected = false;
  catalog.run("i18n.setLanguage('es')");
  assert.equal(catalog.focused(), '[data-product-link="image:rose-bra"]');
});

(async () => {
  let passed = 0;
  for (const {name, callback} of tests) {
    await callback();
    passed += 1;
    console.log(`PASS ${name}`);
  }
  console.log(`Verified ${passed} catalog and shopping regressions with the actual app handlers and WebMCP tools.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
