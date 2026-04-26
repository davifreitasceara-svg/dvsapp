const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'PC GAMER', 'Desktop', 'vai que ne', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const markers = [
    'const Criador =',
    'const Estudante =',
    'const Planos =',
    'const SmartSoundPlayer =',
    'const Perfil = ',
    'export default function AppWrapper()',
    'function App()'
];

const indices = markers.map(m => {
    const idx = content.indexOf(m);
    console.log(`Marker "${m}" found at: ${idx}`);
    return idx;
});

// If any marker is not found, we have a problem.
if (indices.includes(-1)) {
    console.log('Some markers not found!');
    process.exit(1);
}

let clean = content.substring(0, indices[0]);
for (let i = 0; i < markers.length; i++) {
    const start = indices[i];
    const end = (i < markers.length - 1) ? indices[i+1] : content.length;
    clean += content.substring(start, end);
}

fs.writeFileSync(filePath, clean, 'utf8');
console.log('Total length of clean content:', clean.length);
console.log('Total length of original content:', content.length);
