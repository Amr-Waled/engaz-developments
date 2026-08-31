const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');

async function processFile(filePath) {
  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // Only process JPG, JPEG, PNG
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return { before: stat.size, after: stat.size };
  
  // Skip favicon/small icons
  const fileName = path.basename(filePath);
  if (['favicon.ico', 'favicon.png'].includes(fileName) || stat.size < 50 * 1024) {
    return { before: stat.size, after: stat.size };
  }

  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, ext);
  const webpPath = path.join(dir, `${baseName}.webp`);
  const jpgFallbackPath = path.join(dir, `${baseName}.jpg`);

  try {
    const metadata = await sharp(filePath).metadata();
    let targetWidth = metadata.width;
    if (targetWidth > 1920) targetWidth = 1920;

    // 1. Generate WebP
    await sharp(filePath)
      .resize(targetWidth, null, { withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 80, effort: 4 })
      .toFile(webpPath + '.tmp');
    
    if (fs.existsSync(webpPath)) fs.unlinkSync(webpPath);
    fs.renameSync(webpPath + '.tmp', webpPath);

    // 2. Optimize JPG Fallback
    await sharp(filePath)
      .resize(targetWidth, null, { withoutEnlargement: true, fit: 'inside' })
      .jpeg({ quality: 80, progressive: true, mozjpeg: true })
      .toFile(jpgFallbackPath + '.tmp');

    if (ext === '.png' && fileName !== 'logo.png') {
      // If it was a huge PNG, replace original with optimized JPG
      if (fs.existsSync(filePath) && filePath !== jpgFallbackPath) {
        fs.unlinkSync(filePath);
      }
      fs.renameSync(jpgFallbackPath + '.tmp', jpgFallbackPath);
    } else {
      if (fs.existsSync(filePath) && ext === '.png' && fileName === 'logo.png') {
        // keep logo.png optimized as png
        await sharp(filePath).png({ quality: 85, compressionLevel: 9 }).toFile(filePath + '.tmp');
        fs.unlinkSync(filePath);
        fs.renameSync(filePath + '.tmp', filePath);
        if (fs.existsSync(jpgFallbackPath + '.tmp')) fs.unlinkSync(jpgFallbackPath + '.tmp');
      } else {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        fs.renameSync(jpgFallbackPath + '.tmp', jpgFallbackPath);
      }
    }

    const newSize = (fs.existsSync(jpgFallbackPath) ? fs.statSync(jpgFallbackPath).size : 0) + (fs.existsSync(webpPath) ? fs.statSync(webpPath).size : 0);
    console.log(`✅ Optimized: ${path.relative(IMAGES_DIR, filePath)} -> (${(stat.size / 1024 / 1024).toFixed(2)} MB -> ${(fs.statSync(webpPath).size / 1024).toFixed(0)} KB WebP)`);
    return { before: stat.size, after: newSize };
  } catch (err) {
    console.error(`❌ Error on ${fileName}:`, err.message);
    return { before: stat.size, after: stat.size };
  }
}

async function walkDir(dir) {
  let totalBefore = 0;
  let totalAfter = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'images_backup') continue;
      const sub = await walkDir(fullPath);
      totalBefore += sub.totalBefore;
      totalAfter += sub.totalAfter;
    } else {
      const res = await processFile(fullPath);
      totalBefore += res.before;
      totalAfter += res.after;
    }
  }
  return { totalBefore, totalAfter };
}

async function run() {
  console.log('🚀 Starting Full Recursive WebP & High-Performance Optimization on images/...\n');
  const result = await walkDir(IMAGES_DIR);
  console.log('\n===============================================================');
  console.log(`🎉 Optimization Complete!`);
  console.log(`   Size Before: ${(result.totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Savings: ${((1 - result.totalAfter / result.totalBefore) * 100).toFixed(0)}%`);
  console.log('===============================================================');
}

run().catch(console.error);
