const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. ROBUST REMOVAL OF THE MUSIC STICKER OVER PHOTO
const stickerStart = '/* Música Overlay Editável */';
const startIndex = content.indexOf(stickerStart);
if (startIndex !== -1) {
    // Find the end of the block. It ends with the closing brace and ScoreRing usually.
    const blockEnd = ')}';
    const endIndex = content.indexOf(blockEnd, startIndex) + blockEnd.length;
    // We need to be careful not to delete too much.
    // Actually, I'll just replace the entire content of that conditional block with null.
    content = content.replace(/\{result\?\.musicas\?\.\[0\] && \([\s\S]*?\}\s+\)\}/, "");
    console.log("Sticker block removed!");
}

// 2. IMPROVE AI PROMPT TO AVOID "Legenda!" PLACEHOLDER
content = content.replace(
    'A legenda deve ser curta e impactante no estilo: Legenda! #viral #brasil.',
    'Crie uma legenda VIRAL, CRIATIVA e ÚNICA baseada no que você vê na imagem. NÃO use o texto "Legenda!" como placeholder. Escreva uma legenda real e envolvente com ganchos (hooks) poderosos e hashtags como #viral #brasil.'
);

// 3. FIX THE FALLBACK IN startCreate
content = content.replace(
    'const p = pj(raw) || { hook: "Viral!", caption: "Legenda!",',
    'const p = pj(raw) || { hook: "🔥 Uau!", caption: "Confira esse conteúdo incrível que preparamos para você!",'
);

fs.writeFileSync(path, content, 'utf8');
console.log("Fixes applied: Sticker removed and prompts improved.");
