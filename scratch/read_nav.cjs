const fs = require('fs');
const t = fs.readFileSync('src/App.jsx', 'utf8');

const m = t.match(/function App\(\) {[\s\S]*?(?=return \()/);
if (m) console.log(m[0]);

const r = t.match(/return \([\s\S]*?className="nav-bar"[\s\S]*?\);/);
if (r) console.log(r[0].substring(0, 1000));
