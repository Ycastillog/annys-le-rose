'use strict';

// Rebuild English fallbacks and product URLs before versioning browser assets.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

for (const script of ['sync-english.cjs', 'build-products.cjs']) {
  const result = spawnSync(process.execPath, [path.join(__dirname, script)], {cwd:root, stdio:'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

const pages = fs.readdirSync(dist).filter(file => file.endsWith('.html'));
for (const page of pages) {
  const file = path.join(dist, page);
  const html = fs.readFileSync(file, 'utf8').replace(/((?:src|href)=")([^"?:]+\.(?:css|js))(?:\?v=[^"&]+)?(")/g, (_, start, asset, end) => {
    const source = fs.readFileSync(path.join(dist, asset), 'utf8').replace(/\r\n/g, '\n');
    const version = crypto.createHash('sha256').update(source).digest('hex').slice(0, 10);
    return `${start}${asset}?v=${version}${end}`;
  });
  fs.writeFileSync(file, html);
}
console.log(`Versioned local CSS and JavaScript in ${pages.length} public pages.`);
