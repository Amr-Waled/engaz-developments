import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const outputDirectory = 'images/site';
const images = [
  ['images/projects_real/beit_alwatan/img-3.webp', 'hero.webp', 1280, 78],
  ['images/project_sources/h165-2026.webp', 'project-h165-v2.webp', 1000, 78],
  ['images/beit-al-watan-project-engaz-developments.webp', 'project-a100.webp', 900, 76],
  ['images/project_sources/h79-design-2026.webp', 'project-h79-v2.webp', 1000, 78],
  ['images/project_sources/f216-design.webp', 'project-f216-v2.webp', 1000, 78],
  ['images/project_sources/f218-design.webp', 'project-f218-v2.webp', 1000, 78],
  ['images/project_sources/f129-design.webp', 'project-f129-v2.webp', 1000, 78],
  ['images/project_sources/c87-design.webp', 'project-c87-v2.webp', 1000, 78],
  ['images/project_sources/h151-site.webp', 'project-h151-v2.webp', 1000, 78],
  ['images/project_sources/sednawy-2026.webp', 'project-sednawy-v2.webp', 1000, 78],
  ['images/project_sources/teachers-2025.webp', 'project-teachers-v3.webp', 900, 78],
  ['images/projects_real/town_mall/img-3.webp', 'portfolio-tanta.webp', 1100, 76],
  ['images/projects_real/fayrouz_tower/img-3.webp', 'portfolio-fayrouz.webp', 1000, 76],
  ['images/projects_real/mansoura_villas/img-4.webp', 'portfolio-mansoura-built.webp', 960, 76],
  ['images/projects_real/mansoura_villas/img-8.webp', 'portfolio-mansoura-front.webp', 960, 76],
  ['images/projects_real/mansoura_villas/img-6.webp', 'portfolio-mansoura-street.webp', 960, 76],
  ['images/ras-el-bar-hd.webp', 'portfolio-ras-elbar.webp', 1100, 76],
];

await mkdir(outputDirectory, { recursive: true });

for (const [input, filename, width, quality] of images) {
  await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 5, smartSubsample: true })
    .toFile(outputDirectory + '/' + filename);
}

await sharp('images/projects_real/beit_alwatan/img-3.webp')
  .rotate()
  .resize({ width: 1280, withoutEnlargement: true })
  .avif({ quality: 55, effort: 5 })
  .toFile(outputDirectory + '/hero.avif');

console.log('Optimized ' + images.length + ' WebP images and the AVIF hero in ' + outputDirectory + '.');
