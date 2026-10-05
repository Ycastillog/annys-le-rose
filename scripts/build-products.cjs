'use strict';

// Product pages share the current catalog shell and one detail renderer. Run
// after sync-english.cjs whenever the shell, catalog, copy or renderer changes.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..', 'dist');
const context = vm.createContext({
  window:{addEventListener() {}},
  document:{documentElement:{}, body:{dataset:{}}, querySelector:() => null, querySelectorAll:() => []},
  localStorage:{getItem:() => null}, setTimeout, Intl
});
for (const file of ['catalog.js', 'i18n.js', 'product-view.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, {filename:file});
const {ALRcatalog:{products}, ALRi18n:{t}, ALRproductView:view} = context.window;
const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
const copy = (key, variables) => escape(t(key, variables));
let template = fs.readFileSync(path.join(root, 'catalog.html'), 'utf8');
if (!template.includes('product-view.js')) template = template.replace(/(<script src="app\.js[^>]+>)/, '<script src="product-view.js" defer></script>\n  $1');
template = template.replace('</head>', '  <link rel="stylesheet" href="product.css">\n</head>');
for (const product of products) {
  const name = t(`products.${product.id}.name`);
  const title = t('productPage.metaTitle', {name});
  const description = `${t(`products.${product.id}.description`)} ${t('productPage.development')}`;
  const url = `https://ycastillog.github.io/annys-le-rose/${view.path(product)}`;
  let html = template
    .replace('<body data-page="catalog">', `<body data-page="product" data-product-id="${product.id}">`)
    .replace(/<title[^>]*>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(description)}">`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escape(title)}">`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escape(description)}">`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}">`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}">`)
    .replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="https://ycastillog.github.io/annys-le-rose/${product.image}">`)
    .replace(/<meta property="og:image:alt"[^>]*>/, `<meta property="og:image:alt" data-i18n-content="products.${product.id}.name" content="${escape(name)}">`)
    .replace(/\s*<meta property="og:image:(?:width|height)"[^>]*>/g, '')
    .replace(/<main\b[^>]*>[\s\S]*?<\/main>/, `<main id="main-content" tabindex="-1">
    <noscript><p class="small-note section">${copy('productPage.noScript')}</p></noscript>
    <section class="concept-page section" aria-labelledby="product-title">
      <a class="concept-back underlined" href="catalog.html?category=${product.exclusive ? 'exclusive' : product.category}#coleccion" data-i18n="productPage.back">${copy('productPage.back')}</a>
      <div id="product-page-detail">${view.render(product, {t, page:true, interactive:false})}</div>
    </section>
  </main>`)
    .replace('  <dialog id="cart-dialog"', `  <dialog id="concept-image-dialog" class="concept-image-dialog" aria-label="${copy('productPage.enlarge', {name})}" aria-describedby="concept-image-caption"><button type="button" class="close-dialog icon-button" aria-label="${copy('productPage.closeImage')}" data-i18n-aria-label="productPage.closeImage">×</button><img src="${product.image}" alt="${escape(name)}" data-i18n-alt="products.${product.id}.name" width="1024" height="1280" loading="lazy"><p id="concept-image-caption" data-i18n="productPage.imageNote">${copy('productPage.imageNote')}</p></dialog>\n  <dialog id="cart-dialog"`);
  // Pin every shared file to its current contents; safe to regenerate repeatedly.
  html = html.replace(/((?:src|href)=")([^"?]+\.(?:js|css))(?:\?[^"\s]*)?("[^>]*>)/g, (match, before, file, after) => {
    const local = path.join(root, file);
    if (!fs.existsSync(local)) throw new Error(`Missing shared asset: ${file}`);
    const hash = crypto.createHash('sha256').update(fs.readFileSync(local)).digest('hex').slice(0, 10);
    return `${before}${file}?v=${hash}${after}`;
  });
  fs.writeFileSync(path.join(root, view.path(product)), html);
}
console.log(`Built ${products.length} static concept pages with individual English metadata, readable descriptions and the shared detail renderer.`);
