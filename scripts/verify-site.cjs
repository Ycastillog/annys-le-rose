const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..', 'dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const catalogHTML = fs.readFileSync(path.join(root, 'catalog.html'), 'utf8');
const pages = fs.readdirSync(root).filter(filename => filename.endsWith('.html'));
for (const filename of pages) {
  const markup = fs.readFileSync(path.join(root, filename), 'utf8');
  const ids = [...markup.matchAll(/(?<![\w-])id="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `Duplicate HTML IDs in ${filename}`);
  assert.equal((markup.match(/<h1\b/g) || []).length, 1, `One main heading in ${filename}`);
  for (const match of markup.matchAll(/\b(?:src|href)="([^"#]+)"/g)) {
    if (/^(?:https?:|data:)/.test(match[1])) continue;
    const assetPath = path.resolve(root, match[1].split(/[?#]/)[0]);
    assert.ok(assetPath.startsWith(root + path.sep), 'Asset must stay inside dist');
    assert.ok(fs.existsSync(assetPath), `Missing local asset in ${filename}: ${match[1]}`);
  }
  for (const [, href] of markup.matchAll(/\bhref="([^\"]+)"/g)) {
    if (/^(?:https?:|data:)/.test(href)) continue;
    const [destination, fragment] = href.split('#');
    if (!fragment) continue;
    const targetFile = destination.split('?')[0] || filename;
    if (!targetFile.endsWith('.html')) continue;
    const targetMarkup = fs.readFileSync(path.join(root, targetFile), 'utf8');
    assert.ok(targetMarkup.includes(`id="${fragment}"`), `Broken section link in ${filename}: ${href}`);
  }
}
for (const script of fs.readdirSync(root).filter(filename => filename.endsWith('.js'))) new vm.Script(fs.readFileSync(path.join(root, script), 'utf8'), {filename: script});
// A published stylesheet must not point to a font omitted from the static release.
for (const match of fs.readFileSync(path.join(root, 'fonts.css'), 'utf8').matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
  const fontPath = path.resolve(root, match[1]);
  assert.ok(fontPath.startsWith(root + path.sep), 'Font must stay inside dist');
  const fontBytes = fs.readFileSync(fontPath);
  assert.equal(fontBytes.subarray(0, 4).toString(), 'wOF2', `Invalid font: ${match[1]}`);
}

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
assert.equal(context.window.ALRi18n.language, 'en', 'English primary language');
const languageSource = fs.readFileSync(path.join(root, 'i18n.js'), 'utf8');
function bootLanguage(storedLanguage, browserLanguage = 'es-DO') {
  let stored = storedLanguage;
  const localeContext = {
    window:{},
    document:{documentElement:{}, querySelector:() => null, querySelectorAll:() => []},
    navigator:{language:browserLanguage, languages:[browserLanguage]},
    localStorage:{getItem:() => stored, setItem:(_, value) => { stored = value; }}
  };
  vm.runInNewContext(languageSource, localeContext);
  return {i18n:localeContext.window.ALRi18n, document:localeContext.document, saved:() => stored};
}
const firstVisit = bootLanguage(null);
assert.equal(firstVisit.i18n.language, 'en', 'First visit is English even with a Spanish browser');
assert.equal(firstVisit.document.documentElement.lang, 'en', 'First-visit document language');
firstVisit.i18n.setLanguage('es');
assert.equal(bootLanguage(firstVisit.saved()).i18n.language, 'es', 'Chosen Spanish survives reload or another page');
firstVisit.i18n.setLanguage('en');
assert.equal(bootLanguage(firstVisit.saved()).i18n.language, 'en', 'Chosen English survives reload');
assert.equal(bootLanguage('invalid').i18n.language, 'en', 'Invalid stored language falls back to English');
assert.equal(firstVisit.i18n.t('language.label', {}, 'invalid'), 'Language', 'Unknown translation locale falls back to English');
assert.ok(html.includes('<html lang="en">'), 'HTML fallback is English');
const allMarkup = pages.map(page => fs.readFileSync(path.join(root, page), 'utf8')).join('\n');
const keys = [...allMarkup.matchAll(/\bdata-i18n(?:-html|-aria-label|-placeholder|-alt|-title|-content)?="([^"]+)"/g)].map(match => match[1]);
assert.ok(keys.length > 25, 'Static interface must be localized');
assert.ok(html.indexOf('src="i18n.js') >= 0 && html.indexOf('src="i18n.js') < html.indexOf('src="app.js'), 'Localization must load before the application');
assert.ok(html.indexOf('src="catalog.js') >= 0 && html.indexOf('src="catalog.js') < html.indexOf('src="app.js'), 'Catalog must load before the application');
assert.ok(html.indexOf('src="catalog-query.js') >= 0 && html.indexOf('src="catalog-query.js') < html.indexOf('src="app.js'), 'Filter logic must load before the application');
assert.ok(html.indexOf('src="edition.js') >= 0 && html.indexOf('src="edition.js') < html.indexOf('src="app.js'), 'Annual window must load before the application');
const {products} = context.window.ALRcatalog;
assert.equal(products.length, 16, 'Sixteen sample concepts');
assert.equal(new Set(products.map(product => product.id)).size, products.length, 'Unique product IDs');
assert.equal(new Set(products.map(product => product.image)).size, products.length, 'Each concept has a distinct product photograph');
assert.ok(html.includes('data-page="home"') && catalogHTML.includes('data-page="catalog"'), 'Separate home and catalog modes');
assert.ok(!html.includes('id="catalog-search"') && catalogHTML.includes('id="catalog-search"'), 'Full search and filters belong to the catalog');
assert.ok(html.includes('id="edicion"') && !catalogHTML.includes('id="edicion"'), 'Annual story belongs to home');
assert.ok(!html.includes('id="rituales"') && !html.includes('id="esencia"'), 'Home keeps a single identity story');
assert.ok(catalogHTML.includes('data-clothing-filters'), 'Clothing subcategories have their own group');
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
assert.equal(context.window.ALRi18n.t('catalog.pieces', {count: 6}), '6 concepts', 'English count interpolation');
context.window.ALRi18n.setLanguage('es');
assert.equal(context.window.ALRi18n.t('catalog.pieces', {count: 6}), '6 conceptos', 'Spanish count interpolation');
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
assert.equal(select({category:'intimates'}).length, 9, 'Intimates groups lingerie, essentials and lounge');
assert.ok(select({category:'intimates'}).every(product => ['lingerie','essentials','lounge'].includes(product.category)), 'Intimates excludes beauty and fragrance');
assert.equal(select({category:'intimates', size:'XS'}).length, 8, 'Intimates supports clothing size filters');
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
console.log(`Verified ${pages.length} public pages, local assets/anchors, English-first persistence, 16 distinct concept photos, ES/EN, five-day boundaries and ${new Set(keys).size} storefront localization keys.`);
