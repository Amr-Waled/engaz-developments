import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { headerTemplate, footerTemplate, socialLinksTemplate, projectOptionsTemplate } from '../src/shell.mjs';
import { origin, organization, organizationId, websiteId, regions, basePages, pageUrl, regionForProject, escapeHtml as escape, serializeSchema } from '../src/seo.mjs';
import { projectCard } from '../src/project-card.mjs';

const projects = JSON.parse(readFileSync('src/data/projects.json', 'utf8'));
const version = '20261003-4';
const pages = [...basePages, ...regions.map((region) => region.file), ...projects.map((project) => `project-${project.slug}.html`)];

function renderMount(html, attribute, marker, content) {
  const marked = new RegExp(`<div\\b([^>]*\\b${attribute}\\b[^>]*)>[\\s\\S]*?<!-- ${marker}:end -->`);
  const empty = new RegExp(`<div\\b([^>]*\\b${attribute}\\b[^>]*)>\\s*</div>`);
  const pattern = html.includes(`<!-- ${marker}:end -->`) ? marked : empty;
  if (!pattern.test(html)) throw new Error(`${attribute}: missing or malformed mount`);
  return html.replace(pattern, (_, attributes) => `<div${attributes}>${content}</div><!-- ${marker}:end -->`);
}

for (const region of regions) {
  writeFileSync(region.file, `<!doctype html>
<html lang="ar" dir="rtl"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escape(region.title)}</title><meta name="description" content="${escape(region.description)}">
<link rel="canonical" href="${pageUrl(region.file)}"><link rel="icon" href="images/logo_engaz.png"><meta name="theme-color" content="#ffffff">
<meta property="og:type" content="website"><meta property="og:locale" content="ar_EG"><meta property="og:title" content="${escape(region.title)}"><meta property="og:description" content="${escape(region.description)}"><meta property="og:url" content="${pageUrl(region.file)}"><meta property="og:image" content="${origin}/${projects.find((project) => project.location === region.slug).image.src}">
<link rel="stylesheet" href="css/app.css?v=${version}"><script src="js/meta-pixel.js" defer></script><script src="js/app.js?v=${version}" defer></script>
</head><body class="${region.slug}-region"><a href="#main-content" class="skip-link">انتقل إلى المحتوى</a><div data-site-header></div>
<main id="main-content">
<section class="region-intro site-container"><nav class="breadcrumb" aria-label="مسار الصفحة"><a href="index.html">الرئيسية</a><span aria-hidden="true">/</span><a href="projects.html">المشروعات</a><span aria-hidden="true">/</span><span aria-current="page">${region.name}</span></nav><p class="section-kicker">مشروعات إنجاز · ${region.name}</p><h1>${region.heading}</h1><p class="region-copy">${region.intro}</p><div class="region-actions"><a href="#region-projects" class="btn btn-primary">استعرض المشروعات</a><a href="${regions.find((other) => other.slug !== region.slug).file}" class="text-link">${region.slug === 'basyoun' ? 'السكني في القاهرة الجديدة' : 'التجاري والإداري في بسيون'} ←</a></div></section>
<div id="region-projects" class="site-container region-projects">${region.groups.map((group) => `<section class="region-group" aria-labelledby="region-${group.slugs[0]}"><div class="region-group-heading"><h2 id="region-${group.slugs[0]}">${group.title}</h2><p>${group.text}</p></div><div class="discovery-grid">${group.slugs.map((slug, index) => projectCard(projects.find((project) => project.slug === slug), index)).join('\n')}</div></section>`).join('\n')}</div>
<section class="section-space region-questions"><div class="site-container"><h2 class="section-title">قبل ما تختار</h2><div class="questions-list">${region.questions.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}</div></div></section>
<section class="section-space"><div class="site-container contact-invitation"><div><h2 class="section-title">اسأل عن المشروع المناسب لك</h2><p>حدد المشروع ونوع الوحدة، وراجع التفاصيل الحالية مع فريق إنجاز.</p></div><div class="invitation-actions"><a href="contact.html#consultation" class="btn btn-primary" data-lead-modal-open>سجّل اهتمامك</a><a href="https://wa.me/201030405054?text=${encodeURIComponent(`مرحباً إنجاز، أريد الاستفسار عن مشروعات ${region.name}`)}" class="btn btn-secondary" target="_blank" rel="noopener" data-channel="whatsapp">استفسر على واتساب</a></div></div></section>
</main><div data-site-footer></div></body></html>\n`);
}

// These are real landing pages, rather than indexable copies of each filter combination.
let home = readFileSync('index.html', 'utf8');
home = home.replace('href="projects.html?location=new-cairo&type=residential"', 'href="new-cairo.html"').replace('href="projects.html?location=basyoun&type=commercial"', 'href="basyoun.html"');
writeFileSync('index.html', home);
let listing = readFileSync('projects.html', 'utf8');
if (!listing.includes('data-region-guides')) listing = listing.replace('<div data-project-filters', '<nav class="region-guide-links site-container" data-region-guides aria-label="مشروعات حسب المنطقة"><a href="new-cairo.html">السكني في القاهرة الجديدة ←</a><a href="basyoun.html">التجاري والإداري والطبي في بسيون ←</a></nav>\n    <div data-project-filters');
// The filter container may be a section, depending on the source layout.
if (!listing.includes('data-region-guides')) listing = listing.replace('<section class="listing-section"', '<nav class="region-guide-links site-container" data-region-guides aria-label="مشروعات حسب المنطقة"><a href="new-cairo.html">السكني في القاهرة الجديدة ←</a><a href="basyoun.html">التجاري والإداري والطبي في بسيون ←</a></nav>\n    <section class="listing-section"');
if (!listing.includes('data-region-guides')) throw new Error('projects.html: region guide insertion point missing');
writeFileSync('projects.html', listing);

const indexed = [];
const revisionPath = 'src/data/page-revisions.json';
const revisions = existsSync(revisionPath) ? JSON.parse(readFileSync(revisionPath, 'utf8')) : {};
const today = new Date().toISOString().slice(0, 10);
const website = { '@type': 'WebSite', '@id': websiteId, url: `${origin}/`, name: 'إنجاز للتطوير العقاري', alternateName: 'Engaz Developments', inLanguage: 'ar-EG', publisher: { '@id': organizationId } };

for (const page of pages) {
  let html = readFileSync(page, 'utf8');
  const project = projects.find((project) => page === `project-${project.slug}.html`);
  const region = regions.find((region) => page === region.file);
  html = renderMount(html, 'data-site-header', 'site-header', headerTemplate(page));
  html = renderMount(html, 'data-site-footer', 'site-footer', footerTemplate(project?.name, projects));
  // Use explicit boundary markers on later builds; nested markup must never be truncated.
  html = html.replace(/<div\b([^>]*\bdata-social-links="([^"]*)"[^>]*)><\/div>/g, (_, attributes, variant) => `<div${attributes}>${socialLinksTemplate(variant === 'all')}</div>`);
  html = html.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/g, '');
  html = html.replace(/<meta[^>]*name="twitter:[^"]*"[^>]*>\s*/g, '');
  html = html.replace(/<button\b([^>]*\bdata-lead-modal-open\b[^>]*)>([\s\S]*?)<\/button>/g, (_, attributes, label) => `<a href="contact.html${project ? `?project=${project.slug}` : ''}#consultation"${attributes.replace(/\s+type="button"/, '')}>${label}</a>`);
  html = html.replace(/(<select\b[^>]*name="project_interest"[^>]*>)[\s\S]*?<\/select>/g, (_, tag) => `${tag}<option value="">لم أحدد مشروعًا</option>${projectOptionsTemplate(projects)}</select>`);
  html = html.replace(/(css\/app\.css|js\/app\.js)\?v=[^"\s]+/g, `$1?v=${version}`);
  const isIndexable = page !== '404.html' && !/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html);
  if (page !== '404.html') {
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
    const description = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)?.[1];
    const image = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i)?.[1];
    const url = pageUrl(page);
    const type = page === 'about.html' || page === 'board.html' ? 'AboutPage' : page === 'contact.html' ? 'ContactPage' : page === 'projects.html' || region || page === 'portfolio.html' ? 'CollectionPage' : 'WebPage';
    const webpage = { '@type': type, '@id': `${url}#webpage`, url, name: title, description, inLanguage: 'ar-EG', isPartOf: { '@id': websiteId }, about: { '@id': organizationId }, publisher: { '@id': organizationId }, primaryImageOfPage: { '@id': `${url}#image` } };
    const graph = [organization, website, webpage, { '@type': 'ImageObject', '@id': `${url}#image`, contentUrl: image, url: image }];
    if (page !== 'index.html') {
      const trail = [{ name: 'الرئيسية', url: `${origin}/` }];
      if (region || project) trail.push({ name: 'المشروعات', url: pageUrl('projects.html') });
      if (project) { const parent = regionForProject(project); trail.push({ name: parent.name, url: pageUrl(parent.file) }); }
      trail.push({ name: project?.name || region?.name || title.split(' | ')[0], url });
      graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: trail.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })) });
      webpage.breadcrumb = { '@id': `${url}#breadcrumb` };
    }
    const listedProjects = page === 'projects.html' ? projects : region ? projects.filter((project) => project.location === region.slug) : null;
    if (listedProjects) {
      graph.push({ '@type': 'ItemList', '@id': `${url}#projects`, numberOfItems: listedProjects.length, itemListElement: listedProjects.map((project, index) => ({ '@type': 'ListItem', position: index + 1, name: project.name, url: pageUrl(`project-${project.slug}.html`) })) });
      webpage.mainEntity = { '@id': `${url}#projects` };
    }
    if (project) {
      graph.push({ '@type': 'Place', '@id': `${url}#project`, name: project.name, url, address: project.address, description: `${project.description} الاستخدام: ${project.use}. مرحلة التنفيذ المعروضة: ${project.stageLabel}.`, image: { '@id': `${url}#image` } });
      webpage.mainEntity = { '@id': `${url}#project` };
      const imageNode = graph.find((entity) => entity['@id'] === `${url}#image`);
      Object.assign(imageNode, { caption: project.image.caption, width: project.image.width, height: project.image.height });
    }
    html = html.replace('</head>', `<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${image}">\n<script type="application/ld+json">${serializeSchema({ '@context': 'https://schema.org', '@graph': graph })}</script>\n</head>`);
    // Keep this useful for image previews without overriding existing noindex pages.
    html = html.replace(/<meta[^>]*name="robots"[^>]*>/i, (tag) => isIndexable ? '<meta name="robots" content="index,follow,max-image-preview:large">' : tag);
    if (!/<meta[^>]*name="robots"/i.test(html)) html = html.replace('</head>', '<meta name="robots" content="index,follow,max-image-preview:large">\n</head>');
    if (isIndexable) {
      indexed.push(page);
      const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] || '';
      const hash = createHash('sha256').update([main, title, description].join('\n')).digest('hex');
      revisions[page] = { hash, lastmod: revisions[page]?.hash === hash ? revisions[page].lastmod : today };
    }
  }
  writeFileSync(page, html.replace(/[ \t]+$/gm, ''));
}

writeFileSync(revisionPath, `${JSON.stringify(Object.fromEntries(indexed.map((page) => [page, revisions[page]])), null, 2)}\n`);
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexed.map((page) => `  <url><loc>${pageUrl(page)}</loc><lastmod>${revisions[page].lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('schema.json', `${JSON.stringify({ '@context': 'https://schema.org', '@graph': [organization, website] }, null, 2)}\n`);

const identity = `إنجاز للتطوير العقاري والمقاولات (Engaz Developments)، شركة تعمل منذ 2012. المشروعات المعروضة في القاهرة الجديدة وبسيون بمحافظة الغربية. التواصل في مصر: +201030405054. التواصل في السعودية: +966503040505.\n\nالمصدر الأساسي هو صفحات الموقع وروابط المشروعات. اكتمال المبنى أو التسليم لا يعني وجود وحدات متاحة للبيع. الأسعار والمساحات وخطط السداد والتوافر الحالي يؤكدها فريق المبيعات وقت الاستفسار. صور التنفيذ قد توثق مراحل سابقة، والتصور المعماري لا يمثل الحالة الحالية. لا توجد مراجعات عملاء منشورة ومعتمدة حاليًا.\n`;
writeFileSync('llms.txt', `# إنجاز للتطوير العقاري والمقاولات | Engaz Developments\n\n> ${identity}\n## صفحات أساسية\n${indexed.map((page) => `- [${readFileSync(page, 'utf8').match(/<title>([^<]+)<\/title>/)?.[1]}](${pageUrl(page)})`).join('\n')}\n\n## مرجع تفصيلي\n- [المعلومات المنشورة عن الشركة والمشروعات](${origin}/llms-full.txt)\n\n## القنوات الرسمية\n${organization.sameAs.map((url) => `- ${url}`).join('\n')}\n`);
writeFileSync('llms-full.txt', `# المعلومات المنشورة عن إنجاز للتطوير العقاري\n\n${identity}\n## أماكن التواصل\n- طنطا، محافظة الغربية.\n- بسيون: شارع 23 يوليو، بجوار نقابة المعلمين، بسيون – الغربية.\n- الرياض: حي الياسمين، طريق الملك عبدالعزيز.\nيُفضّل تأكيد الفرع وموعد الزيارة هاتفيًا. لا توجد ساعات عمل أو إحداثيات منشورة ومؤكدة هنا.\n\n## المشروعات\n${projects.map((project) => `### ${project.name}\n- الصفحة: ${pageUrl(`project-${project.slug}.html`)}\n- دليل المنطقة: ${pageUrl(regionForProject(project).file)}\n- الموقع: ${project.address}\n- الاستخدام: ${project.use}\n- الوصف: ${project.description}\n- المرحلة المعروضة: ${project.stageLabel}\n- الصورة: ${project.image.caption}\n- تاريخ التحقق من الحالة الحالية: ${project.lastVerified || 'غير متاح؛ يُرجع للفريق قبل الاعتماد على الحالة الحالية.'}\n`).join('\n')}\n## مصادر إضافية\n- الشركة: ${pageUrl('about.html')}\n- سابقة الأعمال والصور: ${pageUrl('portfolio.html')}\n- التواصل: ${pageUrl('contact.html')}\n- القنوات الرسمية:\n${organization.sameAs.map((url) => `  - ${url}`).join('\n')}\n`);
console.log(`SEO prepared: ${pages.length} static pages, ${indexed.length} sitemap URLs, unified entities and factual references.`);
