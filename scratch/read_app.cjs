const fs = require('fs');
const t = fs.readFileSync('src/App.jsx', 'utf8');

const appStart = t.indexOf('export default function App()');
console.log("App Component Start:", appStart);
console.log(t.substring(appStart, appStart + 2000));
