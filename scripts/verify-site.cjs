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
for (const script of ['app.js', 'i18n.js']) new vm.Script(fs.readFileSync(path.join(root, script), 'utf8'), {filename: script});

// Exercise localization without a browser; storage denial must not prevent rendering.
const context = {
  window: {},
  document: {documentElement: {}, querySelector: () => null, querySelectorAll: () => []},
  navigator: {language: 'en-US'},
  localStorage: {getItem() { throw new Error('Storage unavailable'); }, setItem() { throw new Error('Storage unavailable'); }}
};
vm.runInNewContext(fs.readFileSync(path.join(root, 'i18n.js'), 'utf8'), context);
assert.equal(context.window.ALRi18n.language, 'en', 'English browser default');
const keys = [...html.matchAll(/\bdata-i18n(?:-html|-aria-label|-placeholder|-alt|-title)?="([^"]+)"/g)].map(match => match[1]);
assert.ok(keys.length > 25, 'Static interface must be localized');
assert.ok(html.indexOf('src="i18n.js') >= 0 && html.indexOf('src="i18n.js') < html.indexOf('src="app.js'), 'Localization must load before the application');
for (const language of ['es', 'en']) {
  context.window.ALRi18n.setLanguage(language);
  assert.equal(context.document.documentElement.lang, language, 'Document language');
  for (const key of keys) assert.notEqual(context.window.ALRi18n.t(key), key, `Missing translation: ${language}/${key}`);
}
assert.equal(context.window.ALRi18n.t('catalog.pieces', {count: 6}), '6 pieces', 'English count interpolation');
context.window.ALRi18n.setLanguage('es');
assert.equal(context.window.ALRi18n.t('catalog.pieces', {count: 6}), '6 piezas', 'Spanish count interpolation');
context.window.ALRi18n.setLanguage('invalid');
assert.equal(context.window.ALRi18n.language, 'es', 'Invalid language must preserve selection');
console.log(`Verified assets, syntax, unique IDs and ${new Set(keys).size} static localization keys in ES/EN.`);
