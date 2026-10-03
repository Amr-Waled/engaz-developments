import { escapeHtml as escape } from './seo.mjs';
const pageName = (project) => `project-${project.slug}.html`;
export function projectCard(project, index = 1) {
  const { image } = project;
  return `<article class="discovery-card" data-project-card data-location="${project.location}" data-category="${project.categories.join(' ')}" data-stage="${project.stage}" aria-labelledby="card-${project.slug}">
    <a class="discovery-image" href="${pageName(project)}" tabindex="-1"><img src="${image.src}" width="${image.width}" height="${image.height}" loading="${index === 0 ? 'eager' : 'lazy'}" alt="${escape(image.alt)}"><span>${escape(image.caption)}</span></a>
    <div class="discovery-body"><p class="project-location">${escape(project.address)}</p><h3 id="card-${project.slug}"><a href="${pageName(project)}"><bdi>${escape(project.name)}</bdi></a></h3>
    <dl class="discovery-facts"><div><dt>الاستخدام</dt><dd>${escape(project.use)}</dd></div><div><dt>مرحلة التنفيذ</dt><dd>${escape(project.stageLabel)}</dd></div></dl>
    <a class="discovery-link" href="${pageName(project)}" aria-label="تفاصيل مشروع ${escape(project.name)}">تفاصيل المشروع <span aria-hidden="true">←</span></a></div>
  </article>`;
}
