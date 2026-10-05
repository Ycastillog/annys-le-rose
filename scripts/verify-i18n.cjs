'use strict';

// Isolated locale lifecycle regressions. Browser restoration is represented by
// changing a control after an event, before its deferred reconciliation runs.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'i18n.js'), 'utf8');

function createHarness({saved = null, page = 'home', denyRead = false, denyWrite = false} = {}) {
  const storage = new Map(saved === null ? [] : [['alr-language', saved]]);
  const writes = [];
  const timers = [];
  const events = new Map();
  const permissions = {denyRead, denyWrite};
  let writeAttempts = 0;

  function element(dataset = {}, attributes = {}) {
    return {
      dataset, attributes, value:'', textContent:'', innerHTML:'', listeners:new Map(),
      getAttribute(name) { return this.attributes[name]; },
      setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(name, callback) { this.listeners.set(name, callback); }
    };
  }

  const select = element({}, {'data-i18n-aria-label':'language.label'});
  const label = element({i18n:'language.label'});
  const heading = element({i18nHtml:'hero.title'});
  const description = element();
  const ogTitle = element();
  const ogDescription = element();
  const nodes = new Map([
    ['#language-select', select],
    ['meta[name="description"]', description],
    ['meta[property="og:title"]', ogTitle],
    ['meta[property="og:description"]', ogDescription]
  ]);
  const document = {
    documentElement:{}, body:{dataset:{page}}, title:'',
    querySelector:selector => nodes.get(selector) || null,
    querySelectorAll(selector) {
      if (selector === '[data-i18n]') return [label];
      if (selector === '[data-i18n-html]') return [heading];
      if (selector === '[data-i18n-aria-label]') return [select];
      return [];
    }
  };
  const window = {
    addEventListener(name, callback) {
      if (!events.has(name)) events.set(name, []);
      events.get(name).push(callback);
    }
  };
  const context = {
    window, document, navigator:{language:'es-DO', languages:['es-DO']},
    localStorage:{
      getItem(key) {
        if (permissions.denyRead) throw new Error('Read denied');
        return storage.get(key) ?? null;
      },
      setItem(key, value) {
        writeAttempts++;
        if (permissions.denyWrite) throw new Error('Write denied');
        writes.push([key, value]);
        storage.set(key, value);
      }
    },
    setTimeout(callback, delay) {
      assert.equal(delay, 0, 'Reconcile after the restoration task');
      timers.push(callback);
      return timers.length;
    }
  };
  vm.runInNewContext(source, context, {filename:'i18n.js'});
  return {
    i18n:window.ALRi18n, document, select, label, heading, description, ogTitle, ogDescription,
    storage, writes, permissions, writeAttempts:() => writeAttempts, pending:() => timers.length,
    emit(name, event = {}) { for (const callback of events.get(name) || []) callback(event); },
    flush() { while (timers.length) timers.shift()(); },
    choose(language) {
      select.value = language;
      select.listeners.get('change')({target:select});
    }
  };
}

function assertAligned(harness, locale) {
  const {i18n, document, select, label, heading, description, ogTitle, ogDescription} = harness;
  assert.equal(i18n.language, locale, 'Effective language');
  assert.equal(document.documentElement.lang, locale, 'Document language');
  assert.equal(select.value, locale, 'Language control');
  assert.equal(select.attributes['aria-label'], i18n.t('language.label', {}, locale), 'Accessible control label');
  assert.equal(label.textContent, i18n.t('language.label', {}, locale), 'Static label');
  assert.equal(heading.innerHTML, i18n.t('hero.title', {}, locale), 'Trusted heading markup');
  const catalog = document.body.dataset.page === 'catalog';
  const title = i18n.t(catalog ? 'catalog.metaTitle' : 'meta.title', {}, locale);
  const copy = i18n.t(catalog ? 'catalog.metaDescription' : 'meta.description', {}, locale);
  assert.equal(document.title, title, 'Page title');
  assert.equal(description.attributes.content, copy, 'Page description');
  assert.equal(ogTitle.attributes.content, title, 'Social title');
  assert.equal(ogDescription.attributes.content, copy, 'Social description');
}

let passed = 0;
function test(name, callback) {
  callback();
  passed++;
  console.log(`PASS ${name}`);
}

test('English first visit despite Spanish browser; no preference written', () => {
  const harness = createHarness();
  assertAligned(harness, 'en');
  assert.equal(harness.writes.length, 0);
  assert.equal(harness.storage.has('alr-language'), false);
});

test('Saved Spanish renders the complete interface', () => {
  const harness = createHarness({saved:'es'});
  assertAligned(harness, 'es');
  assert.equal(harness.writes.length, 0);
});

test('Invalid saved and requested locales preserve the effective language', () => {
  const harness = createHarness({saved:'invalid'});
  assertAligned(harness, 'en');
  harness.i18n.setLanguage('invalid');
  assertAligned(harness, 'en');
  assert.equal(harness.writes.length, 0);
  assert.equal(harness.i18n.t('language.label', {}, 'invalid'), 'Language');
});

test('pageshow repairs a control restored after the event without saving it', () => {
  const harness = createHarness();
  let notifications = 0;
  harness.i18n.subscribe(() => notifications++);
  harness.emit('pageshow', {persisted:false});
  assert.equal(harness.pending(), 1);
  harness.select.value = 'es';
  assert.equal(harness.i18n.language, 'en');
  assert.equal(harness.select.value, 'es', 'Restoration precedes the deferred callback');
  harness.flush();
  assertAligned(harness, 'en');
  assert.equal(harness.writes.length, 0);
  assert.equal(notifications, 0, 'Unchanged locale does not rebuild page-specific content');
});

test('popstate repairs silent restoration while preserving a saved Spanish choice', () => {
  const harness = createHarness({saved:'es'});
  harness.emit('popstate');
  harness.select.value = 'en';
  harness.flush();
  assertAligned(harness, 'es');
  assert.equal(harness.storage.get('alr-language'), 'es');
  assert.equal(harness.writes.length, 0);
});

test('Back from another page adopts its newer persisted choice exactly once', () => {
  const harness = createHarness({saved:'en'});
  const notifications = [];
  harness.i18n.subscribe(locale => notifications.push(locale));
  harness.storage.set('alr-language', 'es'); // An explicit choice in another page.
  harness.emit('pageshow', {persisted:true});
  harness.emit('popstate');
  harness.select.value = 'en'; // The old history entry restores a stale control.
  assertAligned(harness, 'en');
  harness.flush();
  assertAligned(harness, 'es');
  assert.deepEqual(notifications, ['es']);
  assert.equal(harness.writes.length, 0, 'Reconciliation only reads the saved choice');
});

test('An explicit choice made before deferred reconciliation remains authoritative', () => {
  const harness = createHarness({saved:'en'});
  harness.storage.set('alr-language', 'es');
  harness.emit('pageshow', {persisted:true});
  harness.choose('en');
  harness.flush();
  assertAligned(harness, 'en');
  assert.equal(harness.storage.get('alr-language'), 'en');
  assert.deepEqual(harness.writes, [['alr-language', 'en']]);
});

test('Blocked storage allows an in-memory choice and restoration repair', () => {
  const harness = createHarness({denyRead:true, denyWrite:true});
  assertAligned(harness, 'en');
  harness.choose('es');
  assertAligned(harness, 'es');
  harness.emit('pageshow', {persisted:true});
  harness.emit('popstate');
  harness.select.value = 'en';
  harness.flush();
  assertAligned(harness, 'es');
  assert.equal(harness.writeAttempts(), 1, 'Only the explicit choice attempts storage');
  assert.equal(harness.writes.length, 0);
});

test('A failed save is not undone by an unchanged older stored preference', () => {
  const harness = createHarness({saved:'en', denyWrite:true});
  harness.choose('es');
  harness.emit('pageshow', {persisted:true});
  harness.select.value = 'en';
  harness.flush();
  assertAligned(harness, 'es');
  assert.equal(harness.storage.get('alr-language'), 'en');
  assert.equal(harness.writeAttempts(), 1);
});

test('Same-language explicit choice repairs only the control and is persisted', () => {
  const harness = createHarness();
  let notifications = 0;
  harness.i18n.subscribe(() => notifications++);
  harness.document.title = 'Page-specific title';
  harness.select.value = 'es';
  harness.i18n.setLanguage('en');
  assert.equal(harness.select.value, 'en');
  assert.equal(harness.document.documentElement.lang, 'en');
  assert.equal(harness.document.title, 'Page-specific title', 'Avoid clobbering studio metadata');
  assert.equal(notifications, 0);
  assert.deepEqual(harness.writes, [['alr-language', 'en']]);
});

test('Cleared or invalid storage does not derive a new preference from a restored control', () => {
  const harness = createHarness({saved:'es'});
  harness.storage.delete('alr-language');
  harness.select.value = 'en';
  harness.emit('popstate');
  harness.flush();
  assertAligned(harness, 'es');
  assert.equal(harness.storage.has('alr-language'), false);
  harness.storage.set('alr-language', 'invalid');
  harness.emit('pageshow');
  harness.flush();
  assertAligned(harness, 'es');
  assert.equal(harness.writes.length, 0);
});

test('Catalog metadata renders in either language and follows a restored preference', () => {
  const harness = createHarness({page:'catalog'});
  assertAligned(harness, 'en');
  harness.storage.set('alr-language', 'es');
  harness.emit('pageshow', {persisted:true});
  harness.flush();
  assertAligned(harness, 'es');
  assert.equal(harness.writes.length, 0);
});

test('New home and category copy resolves in both languages; campaign and motto remain distinct', () => {
  const harness = createHarness();
  const keys = [
    'featured.eyebrow', 'featured.title', 'featured.copy', 'featured.cta',
    'catalog.backHome', 'catalog.metaTitle', 'catalog.metaDescription', 'nav.catalog',
    'catalog.clothingCategories', 'catalog.colorTone', 'catalog.colorPackaging',
    'identity.title', 'identity.copy', 'site.noScript'
  ];
  for (let value = 1; value <= 3; value++) keys.push(`identity.value${value}Title`, `identity.value${value}Copy`);
  const totals = {all:16, intimates:9, lingerie:3, essentials:2, lounge:3, fragrance:3, beauty:4, exclusive:3, favorites:1};
  for (const category of Object.keys(totals)) {
    keys.push(`catalogPage.title.${category}`, `catalogPage.copy.${category}`);
  }
  for (const locale of ['en', 'es']) {
    for (const key of keys) assert.notEqual(harness.i18n.t(key, {}, locale), key, `${locale}/${key}`);
    for (const [category, count] of Object.entries(totals)) {
      const title = harness.i18n.t(`catalogPage.title.${category}`, {}, locale);
      const copy = harness.i18n.t(`catalogPage.copy.${category}`, {count}, locale);
      assert.equal(/<[^>]+>/.test(title), false, 'Category headings use plain text');
      assert.equal(copy.includes('{count}'), false, 'Family total is interpolated');
      assert.ok(copy.includes(String(count)), `${locale}/${category} includes its unfiltered family total`);
    }
  }
  assert.equal(harness.i18n.t('hero.title', {}, 'en'), 'Softness.<br><em>With character.</em>');
  assert.equal(harness.i18n.t('identity.signature', {}, 'en'), 'Your own kind of feminine.');
  assert.equal(harness.i18n.t('identity.signature', {}, 'es'), 'Tu propia forma de ser femenina.');
});

test('Another tab updates language and metadata without writing back', () => {
  const harness = createHarness({page:'catalog'});
  let notifications = 0;
  harness.i18n.subscribe(() => notifications++);
  harness.storage.set('alr-language', 'es');
  harness.emit('storage', {key:'alr-cart'});
  assertAligned(harness, 'en');
  harness.emit('storage', {key:'alr-language'});
  assertAligned(harness, 'es');
  harness.emit('storage', {key:'alr-language'});
  assert.equal(notifications, 1);
  assert.equal(harness.writes.length, 0);
});

test('Tab focus adopts a missed locale change and keeps memory if reads fail', () => {
  const harness = createHarness({saved:'en'});
  harness.storage.set('alr-language', 'es');
  harness.emit('focus');
  assertAligned(harness, 'es');
  harness.permissions.denyRead = true;
  harness.select.value = 'en';
  harness.emit('focus');
  assertAligned(harness, 'es');
  assert.equal(harness.writes.length, 0);
});

console.log(`${passed} locale lifecycle regressions passed.`);
