const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Change v1beta to v1 (stable)
content = content.replace(/\/v1beta\//g, "/v1/");

fs.writeFileSync(path, content, 'utf8');
console.log("API Version switched to v1!");
