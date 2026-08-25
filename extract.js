const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
const res = [];
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('<section') || lines[i].includes('id="') || lines[i].includes('class="hero') || lines[i].includes('modal')) {
    if (lines[i].trim().startsWith('<')) {
        res.push(i + ': ' + lines[i].trim().substring(0, 100));
    }
  }
}
fs.writeFileSync('sections.txt', res.join('\n'));
