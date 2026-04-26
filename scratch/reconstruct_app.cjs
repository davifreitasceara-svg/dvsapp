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

function findLast(str) {
    return content.lastIndexOf(str);
}

function findFirst(str) {
    return content.indexOf(str);
}

const firstCriador = findFirst('const Criador =');
const lastIndices = markers.map(m => findLast(m));

let clean = content.substring(0, firstCriador);

for (let i = 0; i < markers.length; i++) {
    const start = lastIndices[i];
    const nextMarker = markers[i+1];
    let end;
    
    if (nextMarker) {
        end = findLast(nextMarker);
        // Adjust end to include comments before the next marker
        const sep = '/* ══════════════';
        const lastSep = content.lastIndexOf(sep, end);
        if (lastSep > start) end = lastSep;
    } else {
        end = content.length;
    }
    
    clean += content.substring(start, end);
}

fs.writeFileSync(filePath, clean, 'utf8');
console.log('RECONSTRUCT SUCCESS');
console.log('New length:', clean.length);
