import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { basePages, regions, pageUrl, organizationId, websiteId } from '../src/seo.mjs';

const pages = [...basePages, ...regions.map((region) => region.file)];

const projects = JSON.parse(readFileSync('src/data/projects.json', 'utf8'));
pages.push(...projects.map((project) => `project-${project.slug}.html`));

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const titles = new Set();
const descriptions = new Set();
const indexablePages = [];
const localLinks = new Map();
const allowedSchemaTypes = new Set(['Organization', 'WebSite', 'WebPage', 'AboutPage', 'ContactPage', 'CollectionPage', 'ImageObject', 'BreadcrumbList', 'ListItem', 'ItemList', 'Place', 'ContactPoint']);

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
  assert(html.includes('js/meta-pixel.js'), page + ': Meta Pixel loader missing');
  assert(html.includes('data-site-header'), page + ': shared header mount missing');
  assert(html.includes('data-site-footer'), page + ': shared footer mount missing');
  assert((html.match(/<header\b/gi) || []).length === 1, page + ': static header missing or duplicated');
  assert((html.match(/<footer\b/gi) || []).length === 1, page + ': static footer missing or duplicated');
  assert(html.includes('href="new-cairo.html"') && html.includes('href="basyoun.html"'), page + ': crawlable regional navigation missing');
  assert((html.match(/\bdata-lead-modal(?:="")?\s+aria-hidden=/g) || []).length === 1, page + ': lead modal missing or duplicated');
  assert(!/odd-panda|cdn\.tailwindcss\.com/i.test(html), page + ': legacy/CDN dependency found');
  if (page !== '404.html') {
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
    const description = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)?.[1];
    assert(!titles.has(title), page + ': duplicate title'); titles.add(title);
    assert(!descriptions.has(description), page + ': duplicate description'); descriptions.add(description);
    const canonicals = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/gi)];
    assert(canonicals.length === 1 && canonicals[0][1] === pageUrl(page), page + ': canonical must match the published page');
    if (!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html)) indexablePages.push(page);
    const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    assert(schemas.length === 1, page + ': expected one unified structured data graph');
    try {
      const schema = JSON.parse(schemas[0]?.[1] || 'null');
      assert(schema?.['@context'] === 'https://schema.org' && Array.isArray(schema?.['@graph']), page + ': invalid schema graph');
      const graph = schema?.['@graph'] || [];
      const ids = new Set(graph.map((entity) => entity['@id']));
      assert(ids.has(organizationId) && ids.has(websiteId), page + ': organization or website identity missing');
      const inspect = (entity) => {
        if (Array.isArray(entity)) { entity.forEach(inspect); return; }
        if (!entity || typeof entity !== 'object') return;
        if (entity['@type']) assert(allowedSchemaTypes.has(entity['@type']), page + ': unsupported schema type -> ' + entity['@type']);
        if (entity['@id'] && Object.keys(entity).length === 1) assert(ids.has(entity['@id']), page + ': unresolved schema entity -> ' + entity['@id']);
        for (const forbidden of ['geo', 'openingHours', 'openingHoursSpecification', 'aggregateRating', 'offers', 'hasOfferCatalog']) assert(!(forbidden in entity), page + ': unverified structured claim -> ' + forbidden);
        Object.values(entity).forEach(inspect);
      };
      inspect(graph);
    } catch (error) { failures.push(page + ': invalid structured data -> ' + error.message); }
    assert(/<meta[^>]+name="description"[^>]+content="[^"]+"/i.test(html), page + ': meta description missing');
    assert(/<link[^>]+rel="canonical"[^>]+href="https:\/\/engazdevelopments\.com\//i.test(html), page + ': canonical URL missing');
    assert(/<meta[^>]+property="og:title"[^>]+content="[^"]+"/i.test(html), page + ': Open Graph title missing');
    assert(/<meta[^>]+property="og:image"[^>]+content="https:\/\//i.test(html), page + ': Open Graph image missing');
  }

  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    assert(/\balt="[^"]*"/i.test(tag), page + ': image without alt attribute');
  }

  const urls = [...html.matchAll(/(?:href|src)="([^"]+)"/gi)].map((match) => match[1]);
  localLinks.set(page, urls.filter((url) => !/^(?:https?:|tel:|mailto:|#|data:|\/\/)/i.test(url)).map((url) => url.split(/[?#]/)[0].replace(/^\//, '') || 'index.html'));
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

const metaPixel = readFileSync('js/meta-pixel.js', 'utf8');
assert(metaPixel.includes("fbq('init', datasetId)"), 'Meta Pixel init missing');
assert(metaPixel.includes('1825147448913242'), 'Meta Pixel dataset ID mismatch');

try {
  JSON.parse(readFileSync('schema.json', 'utf8'));
} catch (error) {
  failures.push('schema.json: invalid JSON -> ' + error.message);
}

const sitemap = readFileSync('sitemap.xml', 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert(new Set(sitemapUrls).size === sitemapUrls.length, 'sitemap.xml: duplicated URLs');
assert(sitemapUrls.length === indexablePages.length, 'sitemap.xml: unexpected URL count');
indexablePages.forEach((page) => assert(sitemapUrls.includes(pageUrl(page)), 'sitemap.xml: missing indexable page -> ' + page));
pages.filter((page) => !indexablePages.includes(page)).forEach((page) => assert(!sitemapUrls.includes(pageUrl(page)), 'sitemap.xml: noindex page included -> ' + page));
const reached = new Set(['index.html']);
const pending = ['index.html'];
while (pending.length) for (const link of localLinks.get(pending.shift()) || []) {
  if (pages.includes(link) && !reached.has(link)) { reached.add(link); pending.push(link); }
}
indexablePages.forEach((page) => assert(reached.has(page), 'orphan page not reachable from static homepage links -> ' + page));
const robots = readFileSync('robots.txt', 'utf8');
assert(/User-agent: OAI-SearchBot\s+Allow: \//.test(robots), 'robots.txt: search crawler rule missing');
assert(robots.includes('Sitemap: https://engazdevelopments.com/sitemap.xml'), 'robots.txt: sitemap missing');
const llms = readFileSync('llms-full.txt', 'utf8');
projects.forEach((project) => {
  const block = llms.split(`### ${project.name}\n`)[1]?.split('\n### ')[0] || '';
  assert(block.includes(project.stageLabel) && block.includes(project.use) && block.includes(pageUrl(`project-${project.slug}.html`)), 'AI reference inconsistent with project -> ' + project.slug);
});

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

console.log('Site validation passed: ' + pages.length + ' pages, ' + indexablePages.length + ' indexable URLs; static navigation, unique metadata, schema consistency, sitemap, assets and CRM values checked.');
