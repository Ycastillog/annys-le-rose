'use strict';

// Keep first paint and no-JavaScript copy aligned with the actual English render.
// Run without arguments for both pages, or use --home / --studio for one page.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const dist = path.resolve(__dirname, '..', 'dist');
const requestedPages = process.argv.slice(2);
if (requestedPages.some(argument => !['--home', '--studio'].includes(argument))) throw new Error('Use --home, --studio, or no arguments.');
const pages = requestedPages.length ? requestedPages.map(argument => argument === '--studio' ? 'brand.html' : 'index.html') : ['index.html', 'brand.html'];
const context = {
  window:{},
  document:{documentElement:{}, querySelector:() => null, querySelectorAll:() => []},
  localStorage:{getItem:() => 'en', setItem() {}}
};
vm.runInNewContext(fs.readFileSync(path.join(dist, 'i18n.js'), 'utf8'), context);
const translate = key => {
  const value = context.window.ALRi18n.t(key, {}, 'en');
  if (value === key) throw new Error(`Missing English copy: ${key}`);
  return value;
};
const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));

function setAttribute(tag, attribute, value) {
  const pattern = new RegExp(`(?<![\\w-])${attribute}="[^"]*"`);
  const replacement = `${attribute}="${escape(value)}"`;
  return pattern.test(tag) ? tag.replace(pattern, replacement) : tag.replace(/>$/, ` ${replacement}>`);
}

function replaceContent(html, attribute, translateKey, trustedMarkup = false) {
  // These developer-owned templates do not nest the same element tag inside a
  // translated field. Avoid using this helper for arbitrary third-party HTML.
  const pattern = new RegExp(`<([a-z][\\w:-]*)\\b([^>]*\\b${attribute}="([^"]+)"[^>]*)>[\\s\\S]*?</\\1>`, 'g');
  return html.replace(pattern, (_, tag, attributes, key) => `<${tag}${attributes}>${trustedMarkup ? translateKey(key) : escape(translateKey(key))}</${tag}>`);
}

function synchronizeGlobal(html) {
  html = replaceContent(html, 'data-i18n', translate);
  html = replaceContent(html, 'data-i18n-html', translate, true);
  return html.replace(/<[a-z][^>]*\bdata-i18n-(?:aria-label|placeholder|alt|title|content)="[^"]+"[^>]*>/g, tag => {
    for (const [, attribute, key] of tag.matchAll(/\bdata-i18n-(aria-label|placeholder|alt|title|content)="([^"]+)"/g)) tag = setAttribute(tag, attribute, translate(key));
    return tag;
  });
}

function captureStudioEnglish(html) {
  const translations = new Map();
  const fields = ['i18n', 'html', 'alt', 'aria'];
  const nodes = Object.fromEntries(fields.map(field => [field, [...html.matchAll(new RegExp(`\\bdata-brand-${field}="([^"]+)"`, 'g'))].map(([, key]) => {
    const datasetKey = `brand${field[0].toUpperCase()}${field.slice(1)}`;
    return {
      dataset:{[datasetKey]:key},
      set textContent(value) { translations.set(key, value); },
      set innerHTML(value) { translations.set(key, value); },
      setAttribute(attribute, value) { translations.set(key, value); }
    };
  })]));
  const metadata = key => ({setAttribute(attribute, value) { if (attribute === 'content') translations.set(key, value); }});
  const document = {
    set title(value) { translations.set('metaTitle', value); },
    querySelectorAll(selector) {
      return nodes[fields.find(field => selector === `[data-brand-${field}]`)] || [];
    },
    querySelector(selector) {
      if (selector === 'meta[name="description"]' || selector === 'meta[property="og:description"]') return metadata('metaDescription');
      if (selector === 'meta[property="og:title"]') return metadata('metaTitle');
      return null;
    }
  };
  // Capture the real render rather than duplicating or parsing the copy object.
  vm.runInNewContext(fs.readFileSync(path.join(dist, 'brand.js'), 'utf8'), {window:{ALRi18n:{language:'en', subscribe() {}}}, document}, {filename:'brand.js'});
  return key => {
    const value = translations.get(key);
    if (!value || value === key) throw new Error(`Missing English studio copy: ${key}`);
    return value;
  };
}

function synchronizeStudio(html) {
  const studio = captureStudioEnglish(html);
  html = replaceContent(html, 'data-brand-i18n', studio);
  html = replaceContent(html, 'data-brand-html', studio, true);
  html = html.replace(/<[a-z][^>]*\bdata-brand-(?:alt|aria)="[^"]+"[^>]*>/g, tag => {
    for (const [, field, key] of tag.matchAll(/\bdata-brand-(alt|aria)="([^"]+)"/g)) tag = setAttribute(tag, field === 'aria' ? 'aria-label' : 'alt', studio(key));
    return tag;
  });
  html = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/, `<title>${escape(studio('metaTitle'))}</title>`);
  html = html.replace(/<meta\b[^>]*>/g, tag => {
    if (/\bname="description"|\bproperty="og:description"/.test(tag)) return setAttribute(tag, 'content', studio('metaDescription'));
    if (/\bproperty="og:title"/.test(tag)) return setAttribute(tag, 'content', studio('metaTitle'));
    return tag;
  });
  return html;
}

for (const page of new Set(pages)) {
  const file = path.join(dist, page);
  let html = fs.readFileSync(file, 'utf8');
  html = synchronizeGlobal(html);
  if (page === 'brand.html') html = synchronizeStudio(html);
  html = html.replace(/<html\b[^>]*>/, tag => setAttribute(tag, 'lang', 'en'));
  fs.writeFileSync(file, html);
  console.log(`Synchronized ${page} with its English runtime copy.`);
}
