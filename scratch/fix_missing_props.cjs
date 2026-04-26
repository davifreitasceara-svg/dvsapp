const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update SmartSoundPlayer definition with ALL needed props
const smPlayerDefOld = 'const SmartSoundPlayer = ({ musicas = [], toast, plan }) => {';
const smPlayerDefNew = 'const SmartSoundPlayer = ({ musicas = [], toast, plan, songsChanged, setSongsChanged, onSelect }) => {';

if (content.includes(smPlayerDefOld)) {
    content = content.replace(smPlayerDefOld, smPlayerDefNew);
} else {
    // Fallback if the string is slightly different
    content = content.replace(/const SmartSoundPlayer = \({ musicas = \[\], toast, plan }\) => {/, 
                              'const SmartSoundPlayer = ({ musicas = [], toast, plan, songsChanged, setSongsChanged, onSelect }) => {');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('SmartSoundPlayer props fixed!');
