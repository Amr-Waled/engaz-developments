import { load } from 'cheerio';
import { createHash } from 'node:crypto';

const digest = (value) => createHash('sha256').update(value).digest('hex').slice(0, 16);
export const plainText = ($, node) => { const copy = $(node).clone(); copy.find('br').replaceWith('\n'); return copy.text().trim(); };
const labels = { h1: 'العنوان الرئيسي', h2: 'عنوان قسم', h3: 'عنوان فرعي', p: 'نص', a: 'نص رابط', button: 'نص زر', summary: 'سؤال', dd: 'تفصيل', dt: 'تسمية', figcaption: 'تعليق صورة', span: 'نص', li: 'بند' };

export function annotatePage(html, page, projects) {
  const $ = load(html);
  $('[data-cms-key]').removeAttr('data-cms-key');
  $('[data-cms-image]').removeAttr('data-cms-image');
  const fields = [];
  const add = (field) => { if (!fields.some((f) => f.key === field.key)) fields.push(field); };
  const project = projects.find((p) => page === `project-${p.slug}.html`);
  let number = 0;
  $('body h1,body h2,body h3,body p,body a,body button,body summary,body dd,body dt,body figcaption,body li,.discovery-image > span').each((_, node) => {
    const el = $(node);
    if (el.closest('form,[data-lead-modal],[data-mobile-menu],noscript').length || el.find('a,button,input,select,textarea,svg,img,i,summary,p,h1,h2,h3').length) return;
    const value = plainText($, node);
    if (!value || value.length > 5000 || value === '←') return;
    const area = el.closest('[data-site-header]').length ? 'header' : el.closest('[data-site-footer]').length ? 'footer' : page;
    let key = `${area}:text:${el.attr('id') || ++number}`;
    if (['header','footer'].includes(area)) key = `${area}:text:${digest(value + (el.attr('href') || ''))}`;
    const cardSlug = el.closest('[data-project-card]').attr('aria-labelledby')?.replace('card-', '');
    const current = projects.find((p) => p.slug === cardSlug) || (el.closest('main').length ? project || projects.find((p) => [p.name,p.description].includes(value)) : null);
    if (current) for (const property of ['name','address','description','use','stageLabel']) if (value === current[property]) key = `project:${current.slug}:${property}`;
    if (current && value === current.image.caption) key = `project:${current.slug}:caption`;
    el.attr('data-cms-key', key);
    add({ key, type: 'text', label: `${labels[node.name] || 'نص'} · ${value.slice(0, 65)}`, default: value, maxLength: node.name === 'h1' ? 200 : 5000, required: /^h[1-3]$/.test(node.name), shared: !key.startsWith(page + ':') });
  });
  $('body img').each((_, node) => {
    const el = $(node); const src = el.attr('src');
    if (!src || el.closest('[data-lead-modal]').length) return;
    const key = `media:${digest(src)}`; el.attr('data-cms-image', key);
    add({ key, type: 'image', label: el.attr('alt') || 'شعار إنجاز', default: { src, alt: el.attr('alt') || '', hidden: false, width: Number(el.attr('width')) || null, height: Number(el.attr('height')) || null }, shared: true });
  });
  add({ key: `${page}:meta:title`, type: 'text', label: 'عنوان الصفحة في Google', default: $('title').text(), maxLength: 180, required: true });
  add({ key: `${page}:meta:description`, type: 'text', label: 'وصف الصفحة في Google', default: $('meta[name="description"]').attr('content') || '', maxLength: 500, required: true });
  return { html: $.html(), fields };
}

export function renderContent(html, page, content, catalog) {
  const $ = load(html); const values = content?.values || {}; const fields = new Map(catalog.fields.map((f) => [f.key, f]));
  const valueFor = (key) => Object.hasOwn(values, key) && fields.has(key) ? values[key] : undefined;
  $('[data-cms-key]').each((_, node) => { const value = valueFor($(node).attr('data-cms-key')); if (typeof value === 'string') $(node).text(value).css('white-space', 'pre-line'); });
  $('[data-cms-image]').each((_, node) => {
    const value = valueFor($(node).attr('data-cms-image')); if (!value || typeof value !== 'object') return;
    if (value.hidden) { const wrapper = $(node).closest('picture'); (wrapper.length ? wrapper : $(node)).remove(); return; }
    $(node).attr({ src: value.src, alt: value.alt || '' }).removeAttr('srcset');
    if (value.width && value.height) $(node).attr({width:value.width,height:value.height});
    $(node).closest('picture').find('source').remove();
  });
  let defaultTitle = $('title').text(), defaultDescription = $('meta[name="description"]').attr('content') || '';
  for (const field of catalog.fields.filter((f) => /^project:[^:]+:(name|address|description)$/.test(f.key))) {
    const value = valueFor(field.key);
    if (typeof value === 'string') { defaultTitle = defaultTitle.replaceAll(field.default,value); defaultDescription = defaultDescription.replaceAll(field.default,value); }
    if (field.key.endsWith(':name') && value !== undefined) {
      const slug = field.key.split(':')[1];
      if ($('body').attr('data-current-project') === slug) $('body').attr('data-project-name', value);
      $(`option[data-slug="${slug}"]`).each((_,node)=>$(node).text($(node).text().replace(field.default,value)));
    }
  }
  const title = valueFor(`${page}:meta:title`) ?? defaultTitle;
  const description = valueFor(`${page}:meta:description`) ?? defaultDescription;
  $('title').text(title); $('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').attr('content', description);
  $('meta[property="og:title"],meta[name="twitter:title"]').attr('content', title);
  const firstImage = $('main img').first().attr('src');
  const absoluteImage = firstImage ? new URL(firstImage, 'https://engazdevelopments.com/').href : null;
  if (absoluteImage) $('meta[property="og:image"],meta[name="twitter:image"]').attr('content', absoluteImage);
  $('script[type="application/ld+json"]').each((_, node) => {
    try {
      const graph = JSON.parse($(node).text());
      for (const entity of graph['@graph'] || []) {
        if (entity['@id']?.endsWith('#webpage')) { entity.name = title; entity.description = description; }
        if (entity['@type'] === 'ImageObject' && absoluteImage) { entity.url = absoluteImage; entity.contentUrl = absoluteImage; entity.caption = $('main img').first().attr('alt') || ''; }
        const slug = page.match(/^project-(.+)\.html$/)?.[1];
        if (entity['@type'] === 'Place' && slug) {
          for (const name of ['name','description']) { const v = valueFor(`project:${slug}:${name}`); if (v !== undefined) entity[name] = v; }
          const address = valueFor(`project:${slug}:address`); if (address !== undefined) entity.address = address;
        }
        if (entity['@type'] === 'ItemList') for (const item of entity.itemListElement || []) { const s = item.url?.match(/project-(.+)\.html/)?.[1]; if (s && valueFor(`project:${s}:name`) !== undefined) item.name = valueFor(`project:${s}:name`); }
        if (entity['@type'] === 'BreadcrumbList') for (const item of entity.itemListElement || []) { const s = item.item?.match(/project-(.+)\.html/)?.[1]; if (s && valueFor(`project:${s}:name`) !== undefined) item.name = valueFor(`project:${s}:name`); }
      }
      $(node).text(JSON.stringify(graph).replace(/</g, '\\u003c'));
    } catch { /* Preserve the validated baseline if a non-site script is encountered. */ }
  });
  return $.html();
}
