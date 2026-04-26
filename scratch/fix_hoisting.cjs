const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find SmartSoundPlayer code
const startMarker = 'const SmartSoundPlayer = ({ musicas = [], toast, plan, songsChanged, setSongsChanged, onSelect }) => {';
// I'll find the end of the component. It ends around line 1800 based on my previous views.
// But I'll search for the next component definition or the closing brace followed by whitespace.
// SmartSoundPlayer ends where "const GENEROS =" or similar ends? No, it's inside.
// It ends with a return and then "};"

// I'll just look for "/* ✨✨ Input component ✨✨ */" which was after it in a previous view.
const endMarker = '\n\n/* ✨✨ Input component ✨✨ */';
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const smPlayerCode = content.substring(startIndex, endIndex);
    // Remove it from original place
    content = content.substring(0, startIndex) + content.substring(endIndex);
    
    // Insert before Criador
    const criadorMarker = 'const Criador = ({ toast, session, plan }) => {';
    content = content.replace(criadorMarker, smPlayerCode + '\n\n' + criadorMarker);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('SmartSoundPlayer moved above Criador to fix hoisting/ReferenceError!');
} else {
    console.log('Could not find SmartSoundPlayer or marker to move.');
}
