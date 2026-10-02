const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..', 'dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'Duplicate HTML IDs');
for (const match of html.matchAll(/\b(?:src|href)="([^"#]+)"/g)) {
  if (/^(?:https?:|data:)/.test(match[1])) continue;
  const assetPath = path.resolve(root, match[1].split('?')[0]);
  assert.ok(assetPath.startsWith(root + path.sep), 'Asset must stay inside dist');
  assert.ok(fs.existsSync(assetPath), `Missing local asset: ${match[1]}`);
}
for (const script of ['app.js', 'i18n.js', 'catalog.js', 'catalog-query.js', 'edition.js']) new vm.Script(fs.readFileSync(path.join(root, script), 'utf8'), {filename: script});

// Exercise localization without a browser; storage denial must not prevent rendering.
const context = {
  window: {},
  document: {documentElement: {}, querySelector: () => null, querySelectorAll: () => []},
  navigator: {language: 'en-US'},
  localStorage: {getItem() { throw new Error('Storage unavailable'); }, setItem() { throw new Error('Storage unavailable'); }}
};
vm.runInNewContext(fs.readFileSync(path.join(root, 'i18n.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(root, 'catalog.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(root, 'catalog-query.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(root, 'edition.js'), 'utf8'), context);
assert.equal(context.window.ALRi18n.language, 'en', 'English browser default');
const keys = [...html.matchAll(/\bdata-i18n(?:-html|-aria-label|-placeholder|-alt|-title)?="([^"]+)"/g)].map(match => match[1]);
assert.ok(keys.length > 25, 'Static interface must be localized');
assert.ok(html.indexOf('src="i18n.js') >= 0 && html.indexOf('src="i18n.js') < html.indexOf('src="app.js'), 'Localization must load before the application');
assert.ok(html.indexOf('src="catalog.js') >= 0 && html.indexOf('src="catalog.js') < html.indexOf('src="app.js'), 'Catalog must load before the application');
assert.ok(html.indexOf('src="catalog-query.js') >= 0 && html.indexOf('src="catalog-query.js') < html.indexOf('src="app.js'), 'Filter logic must load before the application');
assert.ok(html.indexOf('src="edition.js') >= 0 && html.indexOf('src="edition.js') < html.indexOf('src="app.js'), 'Annual window must load before the application');
const {products} = context.window.ALRcatalog;
assert.equal(products.length, 16, 'Sixteen sample concepts');
assert.equal(new Set(products.map(product => product.id)).size, products.length, 'Unique product IDs');
for (const product of products) {
  assert.ok(fs.existsSync(path.join(root, product.image)), `Missing product photo: ${product.image}`);
  assert.ok(Number.isFinite(product.price) && product.price > 0, 'Valid sample price');
  assert.ok(product.sizes.length && product.colors.length, 'Selectable variants');
}
for (const language of ['es', 'en']) {
  context.window.ALRi18n.setLanguage(language);
  assert.equal(context.document.documentElement.lang, language, 'Document language');
  for (const key of keys) assert.notEqual(context.window.ALRi18n.t(key), key, `Missing translation: ${language}/${key}`);
  for (const product of products) {
    for (const field of ['name', 'description', 'badge', 'fabric']) {
      const key = `products.${product.id}.${field}`;
      assert.notEqual(context.window.ALRi18n.t(key), key, `Missing product translation: ${language}/${key}`);
    }
    for (const color of product.colors) assert.notEqual(context.window.ALRi18n.t(`color.${color.id}`), `color.${color.id}`, 'Translated color');
  }
}
assert.equal(context.window.ALRi18n.t('catalog.pieces', {count: 6}), '6 products', 'English count interpolation');
context.window.ALRi18n.setLanguage('es');
assert.equal(context.window.ALRi18n.t('catalog.pieces', {count: 6}), '6 productos', 'Spanish count interpolation');
context.window.ALRi18n.setLanguage('invalid');
assert.equal(context.window.ALRi18n.language, 'es', 'Invalid language must preserve selection');

// Exercise combinations that affect discovery, including multilingual search.
const searchText = product => ['es', 'en'].map(locale => [
  context.window.ALRi18n.t(`products.${product.id}.name`, {}, locale),
  context.window.ALRi18n.t(`products.${product.id}.description`, {}, locale),
  ...product.colors.map(color => context.window.ALRi18n.t(`color.${color.id}`, {}, locale))
].join(' ')).join(' ');
const select = overrides => context.window.ALRcatalogQuery.select(products, {category:'all', query:'', favorites:new Set(), ...overrides}, searchText);
assert.equal(select({}).length, 16);
assert.equal(select({color:'ivory', price:'under40', size:'XS'})[0].id, 'ivory-bralette', 'Combined color/price/size');
assert.equal(select({color:'ivory', price:'over65'}).length, 0, 'No matching combination');
assert.equal(select({size:'XS'}).length, 8, 'Size filter excludes the robe');
assert.equal(select({query:'satén'}).length, select({query:'saten'}).length, 'Accent-insensitive search');
assert.equal(select({query:'bralette ivory'})[0].id, 'ivory-bralette', 'Multiword English search in Spanish');
assert.equal(select({category:'favorites', favorites:new Set(['cherry-body'])})[0].id, 'cherry-body', 'Favorite discovery');
for (const [price, count] of [['under40',6], ['from40to65',4], ['over65',6]]) assert.equal(select({price}).length, count, `Sample price range: ${price}`);
assert.equal(select({category:'fragrance'}).length, 3, 'Perfume discovery');
assert.equal(select({category:'beauty'}).length, 4, 'Gloss and coffret discovery');
assert.equal(select({category:'exclusive'}).length, 3, 'Exclusive capsule preview');
assert.ok(select({category:'exclusive'}).every(product => product.exclusive), 'Only annual products');
assert.equal(select({category:'beauty', price:'under40', color:'blush'})[0].id, 'gloss-pearl', 'Beauty filter combination');
assert.equal(products.find(product => product.id === 'perfume-rose').sizes[0], '50 ml', 'Perfume format');
assert.equal(products.find(product => product.id === 'gloss-cherry').sizes[0], '6 ml', 'Gloss format');
const sorted = select({sort:'low'}).map(product => product.price);
assert.ok(sorted.every((price, index) => index === 0 || price >= sorted[index - 1]), 'Ascending prices');
const descending = select({sort:'high'}).map(product => product.price);
assert.ok(descending.every((price, index) => index === 0 || price <= descending[index - 1]), 'Descending prices');
const edition = context.window.ALRedition;
const schedule = {startMonthDay:'10-01', durationDays:5, timeZone:'America/Santo_Domingo'};
const exclusive = products.find(product => product.id === 'edition-perfume');
assert.equal(edition.getWindow().status, 'pending', 'Unannounced dates');
assert.equal(edition.canSelect(exclusive), false, 'No exclusive selection before dates are announced');
assert.equal(edition.canSelect(products.find(product => product.id === 'perfume-rose')), true, 'Regular samples remain selectable');
assert.equal(edition.getWindow(new Date('2026-10-01T03:59:59.999Z'), schedule).isOpen, false, 'Before local midnight');
assert.equal(edition.canSelect(exclusive, new Date('2026-10-01T04:00:00Z'), schedule), true, 'Opening boundary');
assert.equal(edition.getWindow(new Date('2026-10-06T03:59:59.999Z'), schedule).isOpen, true, 'Fifth day still open');
assert.equal(edition.canSelect(exclusive, new Date('2026-10-06T04:00:00Z'), schedule), false, 'Sixth day is closed');
assert.equal(edition.getWindow(new Date('2027-10-01T04:00:00Z'), schedule).isOpen, true, 'Annual recurrence');
const newYearSchedule = {...schedule, startMonthDay:'12-30'};
assert.equal(edition.getWindow(new Date('2027-01-03T16:00:00Z'), newYearSchedule).isOpen, true, 'Five days spanning New Year');
assert.equal(edition.getWindow(new Date('2027-01-04T04:00:00Z'), newYearSchedule).isOpen, false, 'New Year closing boundary');
const dstSchedule = {...schedule, startMonthDay:'03-07', timeZone:'America/New_York'};
assert.equal(edition.getWindow(new Date('2026-03-12T03:59:59.999Z'), dstSchedule).isOpen, true, 'Calendar days across daylight saving');
assert.equal(edition.getWindow(new Date('2026-03-12T04:00:00Z'), dstSchedule).isOpen, false, 'Daylight saving closing boundary');
assert.equal(edition.getWindow(new Date(), {...schedule,startMonthDay:'02-29'}).status, 'pending', 'Reject nonannual leap-day schedule');
for (const language of ['es','en']) {
  for (const key of ['edition.pending','edition.unavailable','edition.previewOnly','errors.editionClosed','product.tone','product.volume','product.setValue']) assert.notEqual(context.window.ALRi18n.t(key, {}, language), key, `Dynamic translation: ${key}`);
}
console.log(`Verified 16 concepts, photos, ES/EN, beauty filters, five-day annual boundaries and ${new Set(keys).size} static localization keys.`);
