const fs = require('fs');
const t = fs.readFileSync('src/App.jsx', 'utf8');
const idx = t.indexOf('id="preview-to-export"');
console.log(t.substring(idx - 150, idx + 2000));
