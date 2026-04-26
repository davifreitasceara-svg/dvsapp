const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'PC GAMER', 'Desktop', 'vai que ne', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The broken pattern is specifically the one following the "Transcrição por Voz" header
// and occurring inside the JSX block.

const lines = content.split(/\r?\n/);
let newLines = [];
let inBrokenBlock = false;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if we are entering the broken block
    if (line.includes('Transcrição por Voz 🎤') && lines[i+1]?.trim() === '' && lines[i+2]?.includes('const rend = () => {')) {
        console.log(`Found broken block starting at line ${i+2}`);
        inBrokenBlock = true;
        braceCount = 0;
        newLines.push(line);
        i += 1; // Skip the empty line
        continue;
    }
    
    if (inBrokenBlock) {
        // Track braces to find the end of the function
        const opens = (line.match(/\{/g) || []).length;
        const closes = (line.match(/\}/g) || []).length;
        braceCount += opens - closes;
        
        if (braceCount <= 0 && line.includes('};')) {
            console.log(`Found end of broken block at line ${i}`);
            inBrokenBlock = false;
            continue;
        }
        continue; // Skip lines inside the broken block
    }
    
    newLines.push(line);
}

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
console.log('SURGICAL CLEANUP SUCCESS');
