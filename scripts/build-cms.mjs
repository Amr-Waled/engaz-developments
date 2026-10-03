import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { annotatePage } from '../src/cms.mjs';
import { basePages, regions } from '../src/seo.mjs';
const projects = JSON.parse(readFileSync('src/data/projects.json','utf8'));
const pages = [...basePages, ...regions.map((r) => r.file), ...projects.map((p) => `project-${p.slug}.html`)];
const allFields = new Map(); const catalogPages = []; const templates = {};
mkdirSync('src/generated',{recursive:true});
for (const page of pages) {
  const result = annotatePage(readFileSync(page,'utf8'), page, projects);
  writeFileSync(page, result.html);
  templates[page] = result.html;
  for (const field of result.fields) if (!allFields.has(field.key)) allFields.set(field.key, field);
  catalogPages.push({ id: page, label: result.fields.find((f) => f.key === `${page}:meta:title`).default, fields: result.fields.map((f) => f.key) });
}
writeFileSync('src/generated/cms-catalog.json',JSON.stringify({version:1,pages:catalogPages,fields:[...allFields.values()]},null,2));
writeFileSync('src/generated/cms-pages.json', JSON.stringify(templates));
console.log(`CMS catalog: ${pages.length} pages, ${allFields.size} editable text/image fields.`);
