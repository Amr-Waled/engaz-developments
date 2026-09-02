import { cp, mkdir, rm } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';

const projectRoot = resolve('.');
const outputDirectory = resolve('public');

if (dirname(outputDirectory) !== projectRoot || basename(outputDirectory) !== 'public') {
  throw new Error('Refusing to replace an unexpected output directory: ' + outputDirectory);
}

const files = [
  '404.html',
  'about.html',
  'BingSiteAuth.xml',
  'contact.html',
  'engazdevelopments2026indexnow.txt',
  'googleb4a4e9895834d7b3.html',
  'index.html',
  'llms-full.txt',
  'llms.txt',
  'portfolio.html',
  'privacy.html',
  'projects.html',
  'robots.txt',
  'schema.json',
  'sitemap.xml',
  'testimonials.html',
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of files) {
  await cp(file, resolve(outputDirectory, file));
}

await Promise.all([
  cp('css', resolve(outputDirectory, 'css'), { recursive: true }),
  cp('fonts', resolve(outputDirectory, 'fonts'), { recursive: true }),
  cp('images/site', resolve(outputDirectory, 'images/site'), { recursive: true }),
  cp('images/logo_engaz.png', resolve(outputDirectory, 'images/logo_engaz.png')),
  cp('js', resolve(outputDirectory, 'js'), { recursive: true }),
]);

console.log('Prepared production output in public/.');
