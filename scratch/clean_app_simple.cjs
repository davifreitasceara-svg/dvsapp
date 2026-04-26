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

// Find indices of FIRST occurrences
const indices = markers.map(m => content.indexOf(m));

// Construct the clean file
let clean = content.substring(0, indices[0]); // Header

for (let i = 0; i < markers.length; i++) {
    const start = indices[i];
    const end = (i < markers.length - 1) ? indices[i+1] : content.length;
    
    // We want to capture the section from the FIRST occurrence of marker i 
    // to the FIRST occurrence of marker i+1 (but adjusted for separators).
    
    let section = content.substring(start, end);
    
    // Adjust end to include trailing comments/newlines if they exist before the next marker
    // But since we are using FIRST occurrences, indices[i+1] is already the start of the next section.
    
    clean += section;
}

fs.writeFileSync(filePath, clean, 'utf8');
console.log('SIMPLE CLEAN SUCCESS');
