const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Fix FPRESET.original -> FPRESET.Original
content = content.replace(/FPRESET\.original/g, 'FPRESET.Original');

// Fix filters access with optional chaining
content = content.replace(/filters\[k\]\?\?100/g, 'filters?.[k]??100');

fs.writeFileSync(path, content, 'utf8');
console.log("Fixes applied for 'brilho' crash!");
