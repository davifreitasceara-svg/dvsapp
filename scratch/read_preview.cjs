const fs = require('fs');
const t = fs.readFileSync('src/App.jsx', 'utf8');
const idx = t.indexOf("preview-to-export");
console.log(t.substring(idx - 100, idx + 1000));
