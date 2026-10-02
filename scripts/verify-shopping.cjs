'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sources = Object.fromEntries(['catalog.js', 'catalog-query.js', 'edition.js', 'i18n.js', 'app.js']
  .map(file => [file, fs.readFileSync(path.join(root, 'dist', file), 'utf8')]));

// A small DOM surface lets the real application register and run its handlers.
// Templates are kept as strings; layout, native focus and rendering belong to browser QA.
function createHarness({now = '2026-10-03T12:00:00Z', announced = false, savedCart = [], language = 'es', href = 'https://example.test/annys-le-rose/', clipboard = true, reduceMotion = false, deferredClose = false} = {}) {
  const documentListeners = new Map();
  const windowListeners = new Map();
  const registeredTools = new Map();
  const elements = new Map();
  const storage = new Map([['alr-cart', JSON.stringify(savedCart)], ['alr-language', language]]);
  let clock = new Date(now);
  const copiedLinks = [];
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
    contains(element) { return element === this; }
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
  const dialogs = ['product-dialog', 'cart-dialog', 'info-dialog'].map(element);
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
      return element(selector.startsWith('#') ? selector.slice(1) : selector);
    },
    querySelectorAll(selector) {
      if (selector === 'dialog') return dialogs;
      if (selector === 'dialog[open]') return dialogs.filter(dialog => dialog.open);
      if (selector === '.dialog-feedback') return dialogs.map(dialog => dialog.querySelector('.dialog-feedback'));
      return [];
    },
    modelContext:{registerTool(tool) { registeredTools.set(tool.name, tool); }}
  };
  const history = {
    get length() { return historyEntries.length; },
    get state() { return historyEntries[historyIndex].state; },
    pushState(state, unused, url) {
      historyEntries.splice(historyIndex + 1);
      historyEntries.push({state, url:new URL(url, context.window.location.href).href});
      historyIndex += 1;
      context.window.location = new URL(historyEntries[historyIndex].url);
    },
    replaceState(state, unused, url) {
      historyEntries[historyIndex] = {state, url:new URL(url, context.window.location.href).href};
      context.window.location = new URL(historyEntries[historyIndex].url);
    },
    go(delta) {
      const index = historyIndex + delta;
      if (index < 0 || index >= historyEntries.length) return;
      historyIndex = index;
      context.window.location = new URL(historyEntries[historyIndex].url);
      for (const callback of windowListeners.get('popstate') || []) callback({state:this.state});
    }
  };
  const context = vm.createContext({
    window:{
      location:new URL(href), history,
      matchMedia:() => ({matches:reduceMotion}),
      addEventListener(type, callback) {
        if (!windowListeners.has(type)) windowListeners.set(type, []);
        windowListeners.get(type).push(callback);
      }
    },
    document,
    navigator:{language:'es', languages:['es'], clipboard:clipboard ? {writeText:async value => { copiedLinks.push(value); }} : undefined},
    localStorage:{getItem:key => storage.get(key) ?? null, setItem:(key, value) => storage.set(key, String(value))},
    HTMLElement:Element,
    CSS:{escape:value => String(value)},
    URL, URLSearchParams,
    AbortController,
    setInterval:() => 0,
    setTimeout:() => 0,
    clearTimeout() {}
  });
  for (const file of ['catalog.js', 'catalog-query.js', 'edition.js', 'i18n.js']) {
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
  assert.deepEqual(shop.copiedLinks, ['https://example.test/annys-le-rose/?category=fragrance&q=50+ml#coleccion']);
  assert.equal(shop.url(), shop.copiedLinks[0]);
  assert.equal(shop.run('currentToastKey'), 'toast.linkCopied');
});

test('Unavailable clipboard leaves a clean current link and useful feedback', async () => {
  const shop = createHarness({href:'https://example.test/annys-le-rose/?category=beauty&email=private%40example.test', clipboard:false});
  await shop.run('shareCatalogView()');
  assert.equal(shop.url(), 'https://example.test/annys-le-rose/?category=beauty#coleccion');
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
  assert.equal(shop.element('search-toggle').getAttribute('aria-expanded'), 'false');
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
  assert.deepEqual(shop.copiedLinks, ['https://example.test/annys-le-rose/?category=intimates&size=M&color=cherry&sort=low#coleccion']);
  const restored = createHarness({href:shop.copiedLinks[0], language:'en'});
  assert.deepEqual(restored.view(), shop.view());
  const ids = markup => [...markup.matchAll(/data-product-id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(ids(restored.element('product-grid').innerHTML), ids(shop.element('product-grid').innerHTML));
  assert.equal(ids(restored.element('product-grid').innerHTML).length, 3);
});

test('Editorial discovery clears previous filters and preserves that view for Back', () => {
  const href = 'https://example.test/annys-le-rose/?category=lingerie&q=rose&size=M&color=cherry&price=from40to65&sort=high#coleccion';
  for (const category of ['all','intimates','fragrance','beauty']) {
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
  for (const invalid of ['exclusive','favorites','https://example.test/other','intimates&cart=secret','']) {
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

(async () => {
  let passed = 0;
  for (const {name, callback} of tests) {
    await callback();
    passed += 1;
    console.log(`PASS ${name}`);
  }
  console.log(`Verified ${passed} catalog and shopping regressions with the actual app handlers and WebMCP tools.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
