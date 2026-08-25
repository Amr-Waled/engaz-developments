const fs = require('fs');
// read from the copy that has everything
const content = fs.readFileSync('contact.html', 'utf8') + fs.readFileSync('index.html', 'utf8'); // Or I can just read the blocks that I already saved.
// Wait, contact.html has the modals.
