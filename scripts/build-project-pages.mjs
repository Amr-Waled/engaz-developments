import { projectCard as card } from '../src/project-card.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const projects = JSON.parse(readFileSync('src/data/projects.json', 'utf8'));
const version = '20261003-4';
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const pageName = (project) => `project-${project.slug}.html`;

function replaceBlock(file, key, content) {
  const html = readFileSync(file, 'utf8');
  const start = `<!-- ${key}:start -->`;
  const end = `<!-- ${key}:end -->`;
  if (!html.includes(start) || !html.includes(end)) throw new Error(`${file}: missing ${key} markers`);
  const before = html.slice(0, html.indexOf(start) + start.length);
  const after = html.slice(html.indexOf(end));
  writeFileSync(file, `${before}\n${content}\n${after}`);
}

replaceBlock('projects.html', 'project-cards', projects.map(card).join('\n'));
replaceBlock('index.html', 'featured-projects', ['h165', 'sednawy', 'h79'].map((slug) => card(projects.find((project) => project.slug === slug))).join('\n'));

for (const project of projects) {
  const { image } = project;
  const title = `${project.name} | ${project.address} | إنجاز`;
  const canonical = `https://engazdevelopments.com/${pageName(project)}`;
  const whatsapp = `https://wa.me/201030405054?text=${encodeURIComponent(`مرحباً إنجاز، أريد معلومات عن مشروع ${project.name} في ${project.address}`)}`;
  const isDelivered = project.stage === 'delivered';
  const related = projects.filter((other) => other.location === project.location && other.slug !== project.slug).slice(0, 2);
  const schema = {
    '@context': 'https://schema.org', '@type': 'WebPage', name: title, url: canonical,
    description: project.description,
    breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://engazdevelopments.com/' },
      { '@type': 'ListItem', position: 2, name: 'المشروعات', item: 'https://engazdevelopments.com/projects.html' },
      { '@type': 'ListItem', position: 3, name: project.name, item: canonical },
    ] },
  };
  writeFileSync(pageName(project), `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${escape(title)}</title><meta name="description" content="${escape(`${project.name}: ${project.description} الموقع: ${project.address}. تعرّف على الاستخدام ومرحلة التنفيذ وتواصل مع إنجاز.`)}">
  <meta name="theme-color" content="#ffffff"><link rel="canonical" href="${canonical}"><link rel="icon" href="images/logo_engaz.png">
  <meta property="og:type" content="website"><meta property="og:locale" content="ar_EG"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(project.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://engazdevelopments.com/${image.src}">
  <link rel="stylesheet" href="css/app.css?v=${version}"><script src="js/meta-pixel.js" defer></script><script src="js/app.js?v=${version}" defer></script>
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
</head>
<body data-current-project="${project.slug}" data-project-name="${escape(project.name)}">
  <a href="#main-content" class="skip-link">انتقل إلى المحتوى</a><div data-site-header></div>
  <main id="main-content">
    <section class="project-detail-head site-container">
      <nav class="breadcrumb" aria-label="مسار الصفحة"><a href="index.html">الرئيسية</a><span aria-hidden="true">/</span><a href="projects.html">المشروعات</a><span aria-hidden="true">/</span><a href="${project.location}.html">${project.location === 'basyoun' ? 'بسيون' : 'القاهرة الجديدة'}</a><span aria-hidden="true">/</span><span aria-current="page"><bdi>${escape(project.name)}</bdi></span></nav>
      <div class="detail-heading"><div><p class="section-kicker">${escape(project.address)}</p><h1><bdi>${escape(project.name)}</bdi></h1><p>${escape(project.description)}</p></div><a href="projects.html?location=${project.location}" class="text-link">كل مشروعات المنطقة</a></div>
    </section>
    <div class="site-container detail-layout">
      <div>
        <figure id="project-image" class="detail-image"><a href="${image.src}" target="_blank" rel="noopener" aria-label="افتح صورة مشروع ${escape(project.name)} بالحجم الكامل في نافذة جديدة"><img src="${image.src}" width="${image.width}" height="${image.height}" fetchpriority="high" alt="${escape(image.alt)}"></a><figcaption><span>${escape(image.caption)}</span><a href="${image.src}" target="_blank" rel="noopener">عرض الصورة كاملة</a></figcaption></figure>
        <section class="detail-facts" aria-labelledby="project-facts-title"><h2 id="project-facts-title">عن المشروع</h2><dl><div><dt>الموقع</dt><dd>${escape(project.address)}</dd></div><div><dt>الاستخدام</dt><dd>${escape(project.use)}</dd></div><div><dt>مرحلة التنفيذ</dt><dd>${escape(project.stageLabel)}</dd></div></dl>${image.kind === 'render' ? '<p class="image-note">الصورة تصور معماري للمشروع، ولا تمثل حالته الحالية أثناء التنفيذ.</p>' : '<p class="image-note">الصورة توثّق إحدى مراحل التنفيذ؛ تفاصيل الحالة الحالية لدى فريق إنجاز.</p>'}</section>
      </div>
      <aside class="project-enquiry" aria-labelledby="project-enquiry-title"><p class="section-kicker">تواصل بخصوص <bdi>${escape(project.name)}</bdi></p><h2 id="project-enquiry-title">${isDelivered ? 'معلومات عن المشروع' : 'تفاصيل الوحدات'}</h2><p>${isDelivered ? 'تم تسليم هذا المشروع للملاك. يمكنك الاستفسار عنه أو الاطلاع على مشروعات أخرى في المنطقة.' : 'اسأل فريق المبيعات عن المساحات والأسعار وخطط السداد والتوافر الحالي.'}</p><button type="button" class="btn btn-primary" data-lead-modal-open data-project-interest="${project.slug}">سجّل اهتمامك</button><a href="${whatsapp}" target="_blank" rel="noopener" class="btn btn-secondary" data-channel="whatsapp">استفسر على واتساب</a><a href="tel:+201030405054" dir="ltr" class="enquiry-phone" data-channel="phone-egypt">+20 10 3040 5054</a><p class="enquiry-note">${isDelivered ? 'تسجيل الاهتمام لا يعني وجود وحدات معروضة للبيع في هذا المشروع.' : 'الأسعار وتوافر الوحدات يؤكدهما فريق المبيعات وقت الاستفسار.'}</p></aside>
    </div>
    <section class="section-space related-projects"><div class="site-container"><div class="section-heading-row"><h2 class="section-title">مشروعات أخرى في المنطقة</h2><a href="projects.html?location=${project.location}" class="text-link">استعرض الكل</a></div><div class="discovery-grid related-grid">${related.map(card).join('\n')}</div></div></section>
  </main><div data-site-footer></div>
</body></html>\n`);
}

console.log(`Prepared ${projects.length} project pages and discovery cards from approved content.`);
