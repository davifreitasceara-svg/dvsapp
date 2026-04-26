const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'PC GAMER', 'Desktop', 'vai que ne', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Identify the 'rend' function block
const rendStartIdx = content.indexOf('const rend = () => {');
if (rendStartIdx === -1) {
    console.log('rend not found');
    process.exit(1);
}

// rend ends before the next 'return (' which is the main component return
// Actually, let's find the 'return (' that follows 'rend'
const returnIdx = content.indexOf('return (', rendStartIdx);
// The return of Estudante starts at some point.

// Wait, I can see the structure in the previous view.
// rend ends at line 1540 (based on my previous turn's check, but let's be careful)

const lines = content.split(/\r?\n/);
let rendStartLine = -1;
let rendEndLine = -1;
let componentReturnLine = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const rend = () => {')) rendStartLine = i;
    if (rendStartLine !== -1 && lines[i].trim() === '};' && lines[i+1]?.trim() === '' && lines[i+2]?.includes('return (')) {
        rendEndLine = i;
        componentReturnLine = i + 2;
        break;
    }
}

console.log(`rendStartLine: ${rendStartLine}, rendEndLine: ${rendEndLine}, componentReturnLine: ${componentReturnLine}`);

if (rendStartLine !== -1 && rendEndLine !== -1) {
    const rendLines = lines.slice(rendStartLine, rendEndLine + 1);
    const otherLines = [...lines];
    otherLines.splice(rendStartLine, rendEndLine - rendStartLine + 1);
    
    // Find where Estudante component starts to place rend there
    let estudanteStartLine = -1;
    for (let i = 0; i < otherLines.length; i++) {
        if (otherLines[i].includes('const Estudante =')) {
            estudanteStartLine = i;
            break;
        }
    }
    
    // Place rend after the state definitions in Estudante
    let insertLine = -1;
    for (let i = estudanteStartLine; i < otherLines.length; i++) {
        if (otherLines[i].includes('const TABS =')) {
            insertLine = i;
            break;
        }
    }
    
    if (insertLine !== -1) {
        otherLines.splice(insertLine, 0, ...rendLines, '');
        fs.writeFileSync(filePath, otherLines.join('\n'), 'utf8');
        console.log('REPOSITION SUCCESS');
    } else {
        console.log('Could not find insert line');
    }
} else {
    console.log('Could not find rend block boundaries');
}
