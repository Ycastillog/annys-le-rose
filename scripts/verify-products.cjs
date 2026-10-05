'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..', 'dist');
const context = vm.createContext({
  window:{addEventListener() {}},
  document:{documentElement:{}, body:{dataset:{}}, querySelector:() => null, querySelectorAll:() => []},
  localStorage:{getItem:() => null}, setTimeout, Intl, URLSearchParams
});
for (const file of ['catalog.js','catalog-query.js','i18n.js','product-view.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
const {ALRcatalog:{products}, ALRi18n:{t}, ALRproductView:view, ALRcatalogQuery:query} = context.window;
const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
const titles = new Set();
for (const product of products) {
  const file = view.path(product);
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const name = t(`products.${product.id}.name`);
  assert.ok(html.includes(`data-page="product" data-product-id="${product.id}"`), file);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: exactly one page heading`);
  assert.ok(html.includes(`<h1 id="product-title">${name}</h1>`), `${file}: readable product name without JavaScript`);
  assert.ok(html.includes(t(`products.${product.id}.description`)), `${file}: readable description without JavaScript`);
  assert.ok(html.includes(t(`products.${product.id}.fabric`)), `${file}: material/formula uncertainty is visible`);
  assert.ok(html.includes('Concept in development.'), `${file}: explicit concept state`);
  assert.ok(html.includes(`href="https://ycastillog.github.io/annys-le-rose/${file}"`), `${file}: canonical URL`);
  assert.ok(html.includes(`content="https://ycastillog.github.io/annys-le-rose/${product.image}"`), `${file}: own social photo`);
  assert.ok(html.includes('id="add-cart" disabled'), `${file}: no active bag controls before JavaScript`);
  assert.ok(html.includes('aria-describedby="concept-image-caption"'), `${file}: enlarged image has its concept caption`);
  assert.ok(html.includes(`href="${product.image}" data-zoom`), `${file}: native image link fallback`);
  assert.ok(!/application\/ld\+json|schema.org\/(?:Offer|Product)/.test(html), `${file}: no sale structured data`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(title && title.includes(name), `${file}: product metadata`);
  assert.ok(!titles.has(title), `${file}: unique metadata`);
  titles.add(title);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: no duplicate IDs`);
  for (const locale of ['en','es']) {
    const translated = (key, variables) => t(key, variables, locale);
    const markup = view.render(product, {t:translated, language:locale, page:true});
    assert.ok(markup.includes(translated('productPage.development')), `${file}: ${locale} concept notice`);
    assert.ok(!/\b(?:productPage|products\.[a-z-]+)\.[A-Za-z]+/.test(markup), `${file}: ${locale} resolved copy`);
    assert.ok(markup.includes(escape(translated(product.variantKind === 'size' || !product.variantKind ? 'product.careTitle' : 'product.formulaTitle'))));
    if (product.exclusive) assert.ok(markup.includes('id="add-cart" disabled'), `${file}: annual gate`);
  }
}
assert.equal(titles.size, 16);

// Exercise the URL contract used by cards, quick view and the visible return
// link. A copied concept still has its clean permanent URL via view.path().
const garment = products.find(product => product.id === 'ivory-bralette');
const state = {category:'intimates', query:'ivory lace', size:'M', color:'ivory', price:'under40', sort:'high'};
const returnURL = query.catalogURL(state, products);
assert.equal(returnURL, 'catalog.html?category=intimates&q=ivory+lace&size=M&color=ivory&price=under40&sort=high#coleccion');
const selectedColor = garment.colors[0].name;
const fullURL = query.productURL(garment, {returnURL, selectedSize:'M', selectedColor}, products);
const restored = query.readProductContext(fullURL.slice(fullURL.indexOf('?')), garment, products);
assert.equal(restored.backURL, returnURL, 'full detail retains the exact search and refinements');
assert.equal(restored.selectedSize, 'M', 'valid proposed clothing size survives navigation');
assert.equal(restored.selectedColor, selectedColor, 'valid internal color survives navigation');
assert.equal(view.path(garment), 'product-ivory-bralette.html', 'canonical and share destination stays clean');
assert.equal(query.productURL(garment, {}, products), view.path(garment), 'direct links need no browsing context');
assert.ok(view.render(garment, {t, fullURL}).includes(`href="${escape(fullURL)}" data-product-link="full:${garment.id}"`), 'quick view passes context through an escaped stable link');

const favoritesURL = query.catalogURL({...state, category:'favorites', favorites:new Set(['rose','noir'])}, products);
assert.ok(favoritesURL.endsWith('#favorites'));
assert.ok(!favoritesURL.includes('rose') && !favoritesURL.includes('noir'), 'favorite product IDs never leave local storage');
assert.equal(query.catalogReturnURL(favoritesURL, products), favoritesURL, 'local favorites view retains its refinements');

for (const unsafe of ['https://example.com/catalog.html', '//example.com/catalog.html', '/catalog.html', '../catalog.html', 'catalog.html/other', 'catalog.html#other', 'javascript:alert(1)', 'catalog.html?next=x\n#coleccion']) {
  assert.equal(query.catalogReturnURL(unsafe, products), '', `reject unsafe or ambiguous return destination: ${unsafe}`);
}
assert.equal(query.catalogReturnURL('catalog.html?category=unknown&size=99&color=bad&price=free&sort=random&redirect=https%3A%2F%2Fexample.com#coleccion', products), 'catalog.html#coleccion', 'unknown keys and invalid filters cannot become navigation state');
const invalid = query.readProductContext('?return=https%3A%2F%2Fexample.com&variant_size=99&variant_color=Unknown', garment, products);
assert.equal(invalid.backURL, '');
assert.equal(invalid.selectedSize, '');
assert.equal(invalid.selectedColor, '');
const fragrance = products.find(product => product.id === 'perfume-rose');
const fragranceURL = query.productURL(fragrance, {returnURL:'catalog.html?category=fragrance', selectedSize:'50 ml', selectedColor:fragrance.colors[0].name}, products);
assert.equal(query.readProductContext(fragranceURL.slice(fragranceURL.indexOf('?')), fragrance, products).selectedSize, '50 ml', 'beauty formats use the same validated navigation contract');
console.log(`Verified ${titles.size} static product pages: unique metadata, readable concept content, image enlargement, English/Spanish copy and annual selection gate.`);
console.log('Verified product navigation context: filtered return views, local favorites, clothing and beauty variants, stable clean URLs and rejected unsafe destinations.');
