const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');
const endMarker = `      <Toasts items={toasts} del={del} />\n    </>\n  )\n  );\n\n}\n`;
const replacement = `      <Toasts items={toasts} del={del} />\n    </>\n  );\n}\n`;

c = c.replace(endMarker, replacement);
// Also a broader replace just in case of different line endings
c = c.replace(/<Toasts items=\{toasts\} del=\{del\} \/>\r?\n\s*<\/>\r?\n\s*\)\r?\n\s*\);\r?\n\r?\n\}\r?\n?/g, '<Toasts items={toasts} del={del} />\n    </>\n  );\n}\n');

fs.writeFileSync('src/App.jsx', c);
console.log('Fixed end of file.');
