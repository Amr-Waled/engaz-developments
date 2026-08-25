const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
const BACKUP_DIR = path.join(__dirname, 'images_backup');

// Duplicate images to skip (keep only the SEO-friendly named versions)
const DUPLICATES = [
  'ras_elbar.jpg',           // duplicate of ras-el-bar-project-engaz-developments.jpg
  'fayrouz_tala.jpg',        // duplicate of el-fayrouz-tower-before-engaz-developments.jpg  
  'teachers_syndicate.jpg',  // duplicate of teachers-syndicate-before-engaz-developments.jpg
];

// Images to skip compression
const SKIP_COMPRESS = ['logo.png'];

async function compressImages() {
  console.log('Starting image optimization...\n');
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const files = fs.readdirSync(IMAGES_DIR);
  let totalBefore = 0;
  let totalAfter = 0;
  let processed = 0;
  let deleted = 0;

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) continue;
    
    const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
    totalBefore += stat.size;

    if (DUPLICATES.includes(file)) {
      console.log(`Deleting duplicate: ${file} (${sizeMB}MB)`);
      fs.copyFileSync(filePath, path.join(BACKUP_DIR, file));
      fs.unlinkSync(filePath);
      deleted++;
      continue;
    }

    if (SKIP_COMPRESS.includes(file) || stat.size < 150 * 1024) {
      console.log(`Skipping (small): ${file} (${sizeMB}MB)`);
      totalAfter += stat.size;
      continue;
    }

    try {
      fs.copyFileSync(filePath, path.join(BACKUP_DIR, file));

      const ext = path.extname(file).toLowerCase();
      const nameWithoutExt = path.basename(file, ext);
      const metadata = await sharp(filePath).metadata();
      
      let targetWidth = metadata.width;
      if (metadata.width > 1920) targetWidth = 1920;

      const outputPath = path.join(IMAGES_DIR, nameWithoutExt + '.jpg');
      
      await sharp(filePath)
        .resize(targetWidth, null, { withoutEnlargement: true, fit: 'inside' })
        .jpeg({ quality: 82, progressive: true, mozjpeg: true })
        .toFile(outputPath + '.tmp');

      if (ext === '.png' && file !== 'logo.png') {
        fs.unlinkSync(filePath);
        fs.renameSync(outputPath + '.tmp', outputPath);
        console.log(`Converted PNG to JPG: ${file}`);
      } else {
        fs.unlinkSync(filePath);
        fs.renameSync(outputPath + '.tmp', outputPath);
      }

      const newStat = fs.statSync(outputPath);
      const newSizeMB = (newStat.size / 1024 / 1024).toFixed(2);
      const savings = ((1 - newStat.size / stat.size) * 100).toFixed(0);
      
      totalAfter += newStat.size;
      processed++;
      
      console.log(`OK ${file}: ${sizeMB}MB -> ${newSizeMB}MB (${savings}% smaller)`);
      
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
      totalAfter += stat.size;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Results:`);
  console.log(`   Processed: ${processed} images`);
  console.log(`   Deleted duplicates: ${deleted} images`);
  console.log(`   Before: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   After: ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Total savings: ${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%`);
  console.log(`   Backups saved to: ${BACKUP_DIR}`);
}

compressImages().catch(console.error);
