const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the sparkle icon in processing screen
const procOld = '<div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>✨</div>';
const procNew = `<div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: 'hidden', padding: 30 }}>
               <img src="/src/assets/logo.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Logo" />
            </div>`;

if (content.includes(procOld)) {
    content = content.replace(procOld, procNew);
    console.log('Processing logo fixed!');
} else {
    console.log('Could not find processing logo exactly.');
}

fs.writeFileSync(filePath, content, 'utf8');
