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
function createHarness({now = '2026-10-03T12:00:00Z', announced = false, savedCart = [], language = 'es'} = {}) {
  const documentListeners = new Map();
  const registeredTools = new Map();
  const elements = new Map();
  const storage = new Map([['alr-cart', JSON.stringify(savedCart)], ['alr-language', language]]);
  let clock = new Date(now);
  const schedule = {startMonthDay:announced ? '10-01' : null, durationDays:5, timeZone:'America/Santo_Domingo'};

  class Element {
    constructor(id = '') {
      this.id = id;
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
    scrollIntoView() {}
    showModal() { this.open = true; }
    close() {
      this.open = false;
      for (const callback of this.listeners.get('close') || []) callback({target:this});
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
  const context = vm.createContext({
    window:{addEventListener() {}},
    document,
    navigator:{language:'es', languages:['es']},
    localStorage:{getItem:key => storage.get(key) ?? null, setItem:(key, value) => storage.set(key, String(value))},
    HTMLElement:Element,
    CSS:{escape:value => String(value)},
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
    cart:() => JSON.parse(run('JSON.stringify(cart)')),
    storedCart:() => JSON.parse(storage.get('alr-cart')),
    click({id = '', dataset = {}}) {
      const button = new Element(id);
      button.dataset = dataset;
      const event = {target:{closest:() => button}};
      for (const callback of documentListeners.get('click') || []) callback(event);
    }
  };
}

let passed = 0;
function test(name, callback) {
  callback();
  passed += 1;
  console.log(`PASS ${name}`);
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

console.log(`Verified ${passed} shopping regressions with the actual app handlers and WebMCP tools.`);
