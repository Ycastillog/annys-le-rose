'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..', 'dist');
const context = vm.createContext({
  window:{addEventListener() {}},
  document:{documentElement:{}, body:{dataset:{}}, querySelector:() => null, querySelectorAll:() => []},
  localStorage:{getItem:() => null}, setTimeout, Intl
});
for (const file of ['catalog.js','i18n.js','product-view.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
const {ALRcatalog:{products}, ALRi18n:{t}, ALRproductView:view} = context.window;
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
console.log(`Verified ${titles.size} static product pages: unique metadata, readable concept content, image enlargement, English/Spanish copy and annual selection gate.`);
