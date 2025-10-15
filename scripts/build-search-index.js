#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function findHtmlFiles(root) {
  return fs.readdirSync(root)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(root, f));
}

function extract(file) {
  const html = fs.readFileSync(file, 'utf8');
  const title = (html.match(/<title>([^<]+)<\/title>/i) || [,''])[1].trim();
  const desc = (html.match(/<meta\s+name=\"description\"\s+content=\"([^\"]*)\"/i) || [,''])[1].trim();
  return { url: path.basename(file), title: title || path.basename(file), description: desc };
}

function main() {
  const root = process.cwd();
  const files = findHtmlFiles(root);
  const items = files.map(extract);
  const outPath = path.join(root, 'assets', 'search', 'index.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2));
  console.log(`Wrote ${items.length} entries to ${path.relative(root, outPath)}`);
}

main();

