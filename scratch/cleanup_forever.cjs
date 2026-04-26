const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Find and remove the broken realPublicar function
const brokenPart = /const realPublicar = async \(\) => {[\s\S]*?\/\/ 1\. Copiar a legenda automaticamente para o usuário só precisar "Colar"\s+/;
content = content.replace(brokenPart, "");

fs.writeFileSync(path, content, 'utf8');
console.log("Broken function removed for good!");
