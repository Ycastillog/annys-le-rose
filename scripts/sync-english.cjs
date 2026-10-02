'use strict';

// Keep the document's first paint and no-JavaScript copy in the brand's primary language.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const dist = path.resolve(__dirname, '..', 'dist');
const file = path.join(dist, 'index.html');
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
let html = fs.readFileSync(file, 'utf8');
// These controlled templates use plain text or trusted dictionary markup inside
// elements that do not nest another element with the same tag name.
for (const mode of ['', '-html']) {
  const pattern = new RegExp(`<([a-z][\\w:-]*)\\b([^>]*\\bdata-i18n${mode}="([^"]+)"[^>]*)>[\\s\\S]*?</\\1>`, 'g');
  html = html.replace(pattern, (_, tag, attributes, key) => `<${tag}${attributes}>${mode ? translate(key) : escape(translate(key))}</${tag}>`);
}
html = html.replace(/<[a-z][^>]*\bdata-i18n-(?:aria-label|placeholder|alt|title|content)="[^"]+"[^>]*>/g, tag => {
  for (const [, attribute, key] of [...tag.matchAll(/\bdata-i18n-(aria-label|placeholder|alt|title|content)="([^"]+)"/g)]) {
    const pattern = new RegExp(`(?<![\\w-])${attribute}="[^"]*"`);
    const value = `${attribute}="${escape(translate(key))}"`;
    tag = pattern.test(tag) ? tag.replace(pattern, value) : tag.replace(/>$/, ` ${value}>`);
  }
  return tag;
});
html = html.replace(/<html lang="[^"]+">/, '<html lang="en">');
fs.writeFileSync(file, html);
console.log('Synchronized the homepage HTML with English brand copy.');
