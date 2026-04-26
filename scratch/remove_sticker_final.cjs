const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// Find the start line
let start = -1;
let end = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('/* Música Overlay Editável */')) {
        start = i;
    }
    if (start !== -1 && lines[i].includes(')}')) {
        // We need to make sure it's the correct closing brace for the music block.
        // The next line after the block usually has ScoreRing.
        if (lines[i+2] && lines[i+2].includes('ScoreRing')) {
            end = i;
            break;
        }
    }
}

if (start !== -1 && end !== -1) {
    console.log(`Removing lines from ${start + 1} to ${end + 1}`);
    lines.splice(start, (end - start) + 1);
    fs.writeFileSync(path, lines.join('\n'), 'utf8');
    console.log("Music sticker GONE for real now.");
} else {
    console.log("Could not find the exact block to remove.", start, end);
}
