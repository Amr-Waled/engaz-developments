const fs = require('fs');
const path = require('path');

const htmlFiles = ['index.html', 'about.html', 'contact.html', 'portfolio.html', 'projects.html'];

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf-8');
  let imgIndex = 0;
  
  content = content.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    imgIndex++;
    if (imgIndex === 1) {
      if (!attrs.includes('loading=')) {
        return `<img ${attrs.trim()} loading="eager">`;
      }
      return match;
    }
    
    let newAttrs = attrs;
    if (!newAttrs.includes('loading=')) {
      newAttrs += ' loading="lazy"';
    }
    if (!newAttrs.includes('decoding=')) {
      newAttrs += ' decoding="async"';
    }
    return `<img ${newAttrs.trim()}>`;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Applied lazy loading to ${file} (${imgIndex} images processed)`);
});
