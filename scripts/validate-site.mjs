import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const pages = [
  'index.html',
  'projects.html',
  'portfolio.html',
  'about.html',
  'testimonials.html',
  'contact.html',
  'privacy.html',
  '404.html',
];

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

for (const page of pages) {
  assert(existsSync(page), page + ': missing');
  if (!existsSync(page)) continue;

  const html = readFileSync(page, 'utf8');
  assert(/<html[^>]+lang="ar"[^>]+dir="rtl"/i.test(html), page + ': Arabic RTL declaration missing');
  assert(/<meta[^>]+name="viewport"/i.test(html), page + ': viewport meta missing');
  assert(/<title>[^<]+<\/title>/i.test(html), page + ': title missing');
  assert((html.match(/<h1\b/gi) || []).length === 1, page + ': expected exactly one h1');
  assert(html.includes('css/app.css'), page + ': production CSS missing');
  assert(html.includes('js/app.js'), page + ': bundled JS missing');
  assert(html.includes('data-site-header'), page + ': shared header mount missing');
  assert(html.includes('data-site-footer'), page + ': shared footer mount missing');
  assert(!/odd-panda|cdn\.tailwindcss\.com/i.test(html), page + ': legacy/CDN dependency found');

  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    assert(/\balt="[^"]*"/i.test(tag), page + ': image without alt attribute');
  }

  const urls = [...html.matchAll(/(?:href|src)="([^"]+)"/gi)].map((match) => match[1]);
  for (const url of urls) {
    if (/^(?:https?:|tel:|mailto:|#|data:|\/\/)/i.test(url)) continue;
    const clean = decodeURIComponent(url.split(/[?#]/)[0]);
    if (!clean) continue;
    const target = clean.startsWith('/')
      ? resolve(process.cwd(), clean.slice(1))
      : resolve(dirname(resolve(page)), clean);
    assert(existsSync(target), page + ': broken local reference -> ' + url);
  }
}

const allContent = [
  ...pages.filter(existsSync).map((page) => readFileSync(page, 'utf8')),
  readFileSync('src/site.js', 'utf8'),
  readFileSync('llms.txt', 'utf8'),
  readFileSync('llms-full.txt', 'utf8'),
].join('\n');

for (const forbidden of ['odd-panda-23.loca.lt', '+201070207080', 'مقدم 40%', 'أكثر من 12 عاماً']) {
  assert(!allContent.includes(forbidden), 'forbidden stale claim/reference: ' + forbidden);
}

const allowedUnitTypes = new Set(['', 'apartment', 'villa', 'office', 'shop', 'clinic']);
for (const page of ['index.html', 'contact.html']) {
  const html = readFileSync(page, 'utf8');
  const select = html.match(/<select[^>]+name="unit_type"[^>]*>([\s\S]*?)<\/select>/i)?.[1] || '';
  const values = [...select.matchAll(/<option\s+value="([^"]*)"/gi)].map((match) => match[1]);
  values.forEach((value) => assert(allowedUnitTypes.has(value), page + ': invalid CRM unit_type "' + value + '"'));
}

if (failures.length) {
  console.error('Site validation failed (' + failures.length + '):\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log('Site validation passed: ' + pages.length + ' pages, local assets, links, and CRM form values checked.');
