const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Update the viral instruction for better captions
content = content.replace(
    'Use ganchos (hooks) poderosos, emojis estratégicos e hashtags de alta performance.',
    'Mantenha a legenda no estilo: "Legenda! #viral #brasil". Seja curto, impactante e use hashtags de alta performance.'
);

// Update the fallback result to match user style
content = content.replace(
    'const p = pj(raw) || { hook: "Viral!", caption: "Legenda!", hashtags: ["viral","brasil"]',
    'const p = pj(raw) || { hook: "Legenda!", caption: "", hashtags: ["viral","brasil"]'
);

// Update the main AI prompt to emphasize Brazilian music and short captions
content = content.replace(
    'A legenda e o hook DEVEM ser sobre o que está NA IMAGEM.',
    'A legenda deve ser curta e impactante no estilo: Legenda! #viral #brasil.'
);

fs.writeFileSync(path, content, 'utf8');
console.log("AI Instructions Updated to User Style!");
