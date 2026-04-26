const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'PC GAMER', 'Desktop', 'vai que ne', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const headerEndIdx = content.indexOf('const Criador =');
const header = content.substring(0, headerEndIdx);

const sections = [
    { name: 'Criador', marker: 'const Criador =' },
    { name: 'Estudante', marker: 'const Estudante =' },
    { name: 'Planos', marker: 'const Planos =' },
    { name: 'SmartSound', marker: 'const SmartSoundPlayer =' },
    { name: 'Perfil', marker: 'const Perfil = ' }, // Added Perfil
    { name: 'AppWrapper', marker: 'export default function AppWrapper()' },
    { name: 'App', marker: 'function App()' }
];

let cleanContent = header;
let currentPos = headerEndIdx;

for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    const nextS = sections[i+1];
    
    const startIdx = content.indexOf(s.marker, currentPos);
    if (startIdx === -1) {
        console.log(`Missing section: ${s.name}`);
        // Try searching from the beginning for missing sections
        const startIdxAnywhere = content.indexOf(s.marker);
        if (startIdxAnywhere !== -1) {
             console.log(`Found ${s.name} elsewhere, continuing from there.`);
             // We don't update currentPos here yet, let the loop handle it
        } else {
             continue;
        }
    }
    
    // Find where this section ends (start of next section or end of file)
    let endIdx;
    if (nextS) {
        endIdx = content.indexOf(nextS.marker, startIdx);
        if (endIdx === -1) {
             // Try finding next section from anywhere if not found after current
             endIdx = content.indexOf(nextS.marker);
        }
        
        if (endIdx !== -1) {
            // Look for the last separator comment before the next section
            const lastSep = content.lastIndexOf('/* ══════════════', endIdx);
            if (lastSep > startIdx) endIdx = lastSep;
        } else {
            endIdx = content.length; // Will be refined in next iterations
        }
    } else {
        endIdx = content.length;
    }
    
    cleanContent += content.substring(startIdx, endIdx);
    currentPos = endIdx;
}

fs.writeFileSync(filePath, cleanContent, 'utf8');
console.log('CLEAN SUCCESS');
