import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const outputDirectory = 'images/site';
const images = [
  ['images/projects_real/beit_alwatan/img-3.webp', 'hero.webp', 1280, 78],
  ['images/h165.webp', 'project-h165.webp', 900, 74],
  ['images/beit-al-watan-project-engaz-developments.webp', 'project-a100.webp', 900, 76],
  ['images/projects_real/beit_alwatan/img-2.webp', 'project-h79.webp', 900, 74],
  ['images/projects_real/beit_alwatan/img-4.webp', 'project-f216.webp', 900, 74],
  ['images/projects_real/beit_alwatan/img-5.webp', 'project-f218.webp', 900, 74],
  ['images/watan-real.webp', 'project-f129.webp', 900, 74],
  ['images/beit_alwatan.webp', 'project-c87.webp', 900, 74],
  ['images/h151-real-hd.webp', 'project-h151.webp', 1000, 76],
  ['images/sednawy-mall-hd.webp', 'project-sednawy.webp', 900, 74],
  ['images/projects_real/teachers_syndicate/img-2.webp', 'project-teachers-real.webp', 900, 76],
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
