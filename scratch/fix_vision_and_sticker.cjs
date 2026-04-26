const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. FIX THE MODEL NAME (Gemini 2.5 does not exist, use 1.5 Flash)
content = content.replace(/gemini-2\.5-flash/g, "gemini-1.5-flash");

// 2. REMOVE THE MUSIC STICKER FROM THE PREVIEW
const stickerStart = '{/* Música Overlay PREMIUM */}\n              {result?.musicas?.[0] && (';
const stickerEnd = '              )}';

const startIndex = content.indexOf(stickerStart);
if (startIndex !== -1) {
    const endIndex = content.indexOf(stickerEnd, startIndex) + stickerEnd.length;
    content = content.substring(0, startIndex) + content.substring(endIndex);
    console.log("Music sticker removed from preview!");
}

// 3. IMPROVE THE VISION PROMPT
content = content.replace(
    'A legenda e o hook DEVEM ser sobre o que está NA IMAGEM.',
    'Sua principal tarefa é descrever o que está na foto e criar uma legenda curta (estilo Legenda! #viral #brasil) totalmente baseada no conteúdo visual da imagem.'
);

fs.writeFileSync(path, content, 'utf8');
console.log("AI Vision Fixed and Sticker Removed!");
