const fs = require('fs');

function cleanFile(filename, badStart, badEnd) {
    let html = fs.readFileSync(filename, 'utf8');
    const bStart = html.indexOf(badStart);
    if(bStart !== -1) {
        const bEnd = html.indexOf(badEnd, bStart);
        if(bEnd !== -1) {
            html = html.substring(0, bStart) + html.substring(bEnd);
            fs.writeFileSync(filename, html);
            console.log(filename + ' cleaned!');
        }
    }
}

cleanFile('contact.html', '<div class="modal-overlay" id="projectDetailsModal">', '</main>');
