const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Find result block boundaries
let resultStart = -1, resultEnd = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('if (stage === "result" && result)')) resultStart = i;
  if (resultStart > 0 && i > resultStart + 5 && lines[i].trim() === '}' && resultEnd === -1) {
    resultEnd = i;
    break;
  }
}

console.log(`Result block: lines ${resultStart+1} to ${resultEnd+1}`);

const block = lines.slice(resultStart, resultEnd + 1).join('\n');

// Count curly braces balance (simple, not parsing strings)
let depth = 0;
let inStr = false, strChar = '';
for (let i = 0; i < block.length; i++) {
  const c = block[i];
  if (inStr) {
    if (c === strChar && block[i-1] !== '\\') inStr = false;
    continue;
  }
  if (c === '"' || c === "'" || c === '`') { inStr = true; strChar = c; continue; }
  if (c === '{') depth++;
  if (c === '}') depth--;
}

console.log(`Curly brace depth at end: ${depth} (should be 0)`);

// Count angle bracket balance for JSX
let ltCount = 0, gtCount = 0;
for (const c of block) { if (c === '<') ltCount++; if (c === '>') gtCount++; }
console.log(`< count: ${ltCount}, > count: ${gtCount}`);

// Show lines with lone } or { that might cause issues
const resultLines = lines.slice(resultStart, resultEnd + 1);
resultLines.forEach((line, i) => {
  const lineNo = resultStart + i + 1;
  const trimmed = line.trim();
  if (trimmed === '}' || trimmed === '};') {
    console.log(`Line ${lineNo}: lone closing brace: "${line}"`);
  }
});
