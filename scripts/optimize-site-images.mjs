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
  ['images/teachers-syndicate-night.webp', 'project-teachers.webp', 900, 76],
  ['images/tanta-town-mall-hd.webp', 'portfolio-tanta.webp', 1100, 76],
  ['images/before_after/mansoura-before.webp', 'portfolio-mansoura-design.webp', 1100, 76],
  ['images/before_after/mansoura-after.webp', 'portfolio-mansoura-built.webp', 900, 76],
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

console.log('Optimized ' + images.length + ' website images in ' + outputDirectory + '.');
