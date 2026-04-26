const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the jsonTpl template - find by exact content pattern
const oldJsonTpl = `    const jsonTpl = \`{
  "hook": "frase de impacto m\\u00e1x 10 palavras com emoji BASEADA no conte\\u00fado visual",
  "caption": "legenda completa e relevante ao que aparece na imagem/v\\u00eddeo",
  "hashtags": ["8 hashtags relacionados ao conte\\u00fado"],
  "filtro": "Clarendon",
  "musicas": [
    {"tipo":"Em Alta","nome":"Nome Real da Musica","artista":"Nome do Artista","vibe":"vibe da musica"},
    {"tipo":"Viral","nome":"Outra Musica Real","artista":"Artista 2","vibe":"outra vibe"},
    {"tipo":"Recomendada","nome":"Terceira Musica","artista":"Artista 3","vibe":"vibe 3"}
  ],
  "score": 90,
  "scoreMotivo": "motivo baseado no conte\\u00fado",
  "melhorias": ["dica espec\\u00edfica para este conte\\u00fado"],
  "plataforma": "Insta",
  "horario": "19h",
  "cta": "chamada para a\\u00e7\\u00e3o"
}\`;`;

const newJsonTpl = `    const jsonTpl = \`{
  "analiseVisual": "descrição detalhada do que aparece: pessoas, objetos, cenário, cores, clima, expressões",
  "vibeImagem": "sentimento transmitido (alegria, paz, agitação, romance, adrenalina, elegância, etc.)",
  "hook": "frase de impacto máx 10 palavras com emoji BASEADA EXATAMENTE no que está na foto/vídeo",
  "caption": "legenda de 2-3 frases que descreve e valoriza ESPECIFICAMENTE o conteúdo visual, em português brasileiro natural e estilo \${estilo}",
  "hashtags": ["10 hashtags específicos: mix de nicho e trending relacionados ao visual"],
  "filtro": "filtro que melhor combina com as cores da foto (Clarendon, Gingham, Moon, Lark, Juno, Reyes, Valencia, Hudson, Nashville, HDR ou Vívido)",
  "musicas": [
    {"tipo":"Combina perfeitamente","nome":"Música REAL famosa cuja vibe combina com o clima visual da foto","artista":"Artista real","vibe":"por que combina com este visual específico"},
    {"tipo":"Em Alta no TikTok","nome":"Música viral atual que combina com o sentimento desta imagem","artista":"Artista real","vibe":"relação com o visual e clima da foto"},
    {"tipo":"Alternativa","nome":"Terceira opção real adequada para o tema visual","artista":"Artista real","vibe":"por que esta também serve para este conteúdo"}
  ],
  "score": 85,
  "scoreMotivo": "análise do potencial viral baseada nas características visuais DESTA foto específica",
  "melhorias": ["dica concreta de melhoria baseada no que aparece nesta foto", "sugestão específica de edição ou composição"],
  "plataforma": "rede social mais adequada para este conteúdo visual",
  "horario": "melhor horário para este tipo de conteúdo",
  "cta": "chamada para ação específica para o tema desta foto"
}\`;`;

if (content.includes('const jsonTpl = `{')) {
  // Use regex to replace the jsonTpl block
  content = content.replace(
    /const jsonTpl = `\{[\s\S]*?"cta": "chamada para a\\u00e7\\u00e3o"\s*\}`;/,
    newJsonTpl.replace('const jsonTpl = `{', 'const jsonTpl = `{')
  );
  console.log('Attempting regex replacement...');
}

// Now fix the vision prompt to be more detailed
const oldVisionPrompt = `raw = await callAIVision(b64, mt,
          \`Sua tarefa é analisar esta mídia e criar conteúdo VIRAL para Instagram/TikTok Brasil.
DESCREVA o que você vê (objetos, pessoas, cores, clima) e baseie a legenda NISSO.
O tema do usuário é: "\${topic}" e o estilo é: "\${estilo}".
A legenda deve ser curta, impactante e usar hashtags de alta performance.
Formato: Legenda! #viral #brasil (ou similar, mas sempre curto).
Indique 3 músicas REAIS (nome e artista de verdade) que combinem com a vibe.
Retorne APENAS JSON (sem markdown):
\${jsonTpl}\`,
          "Retorne APENAS JSON v\\u00e1lido. Zero texto fora do JSON."`;

const newVisionPrompt = `raw = await callAIVision(b64, mt,
          \`Você é um especialista em marketing viral brasileiro. ANALISE ESTA IMAGEM COM ATENÇÃO.

PASSO 1 — ANALISE A IMAGEM:
- O que aparece na foto? (pessoas, objetos, local, natureza, comida, produto, etc.)
- Qual é a paleta de cores dominante? (cores quentes, frias, neutras, vibrantes)
- Qual é o clima/sentimento? (alegre, romântico, agitado, sereno, elegante, divertido, etc.)
- Qual é o contexto? (ao ar livre, interior, praia, cidade, academia, restaurante, etc.)

PASSO 2 — BASEADO APENAS NO QUE VIU NA IMAGEM:
- Escreva a legenda descrevendo ESTE conteúdo específico
- Escolha músicas que COMBINAM com a vibe visual desta foto (não genéricas)
- Sugira hashtags específicas para o que aparece na imagem

Tema adicional do usuário: "\${topic || 'nenhum'}"
Estilo desejado: "\${estilo}"

IMPORTANTE: A legenda e músicas devem ser 100% baseadas no que você VÊ nesta imagem.
Se for uma praia → música de verão/reggae. Se for academia → música de treino/rap. Se for comida → música animada/brasileira. Etc.

Retorne APENAS este JSON sem markdown:
\${jsonTpl}\`,
          "IMPORTANTE: Analise a imagem profundamente. Retorne APENAS JSON válido. Zero texto fora do JSON."`;

const oldFallback = `raw = await callAI(
        \`Crie conte\\u00fado viral para redes sociais brasileiras.\\nTipo: \${isImg ? "imagem" : "v\\u00eddeo"} | Tema: "\${topic || "conte\\u00fado geral"}" | Estilo: \${estilo}\\nObrigat\\u00f3rio: indique 3 m\\u00fasicas REAIS (nome e artista de verdade, conhecidos no TikTok/Reels Brasil) que combinem com o tema.\\nRetorne APENAS este JSON (sem markdown):\\n\${jsonTpl}\`,
        "APENAS JSON."`;

const newFallback = `raw = await callAI(
        \`Você é especialista em marketing viral brasileiro. Crie conteúdo de alto impacto para Instagram/TikTok.

Tipo de mídia: \${isImg ? "foto" : "vídeo"}
Tema/contexto do criador: "\${topic || "conteúdo geral"}"
Estilo desejado: \${estilo}

INSTRUÇÕES PARA AS MÚSICAS:
- Escolha músicas REAIS e CONHECIDAS no Brasil (não invente)
- As músicas devem combinar com o TEMA e ESTILO do conteúdo
- Ex: tema fitness → rap/funk agitado. Tema viagem → música animada. Tema romântico → música suave.
- Prefira músicas que estão em alta no TikTok/Reels Brasil em 2024-2025

INSTRUÇÕES PARA A LEGENDA:
- Escreva como um criador de conteúdo brasileiro autêntico
- Primeira linha: hook impactante com emoji
- Corpo: descreva o conteúdo de forma cativante
- Final: hashtags específicas para o nicho

Retorne APENAS este JSON sem markdown:
\${jsonTpl}\`,
        "APENAS JSON válido. Zero markdown."`;

// Apply replacements using regex
let changed = 0;

// Replace jsonTpl
const jsonTplRegex = /const jsonTpl = `\{[\s\S]*?cta.*?\n\}`;/;
if (jsonTplRegex.test(content)) {
  content = content.replace(jsonTplRegex, newJsonTpl);
  changed++;
  console.log('✅ jsonTpl replaced');
} else {
  console.log('❌ jsonTpl pattern not found');
}

// Replace vision prompt
const visionRegex = /raw = await callAIVision\(b64, mt,\s*`[\s\S]*?"Retorne APENAS JSON v.*?"\s*\);/;
if (visionRegex.test(content)) {
  content = content.replace(visionRegex, newVisionPrompt + '\n        );');
  changed++;
  console.log('✅ Vision prompt replaced');
} else {
  console.log('❌ Vision prompt pattern not found, trying simpler approach...');
  // Try simpler: just replace what's between callAIVision( and the closing );
  const idx = content.indexOf('raw = await callAIVision(b64, mt,');
  if (idx !== -1) {
    // Find the closing of this call
    const endStr = '"Retorne APENAS JSON v\\u00e1lido. Zero texto fora do JSON."\n        );';
    const endIdx = content.indexOf('Zero texto fora do JSON."', idx);
    if (endIdx !== -1) {
      const fullEnd = content.indexOf('\n        );', endIdx) + '\n        );'.length;
      const before = content.substring(0, idx);
      const after = content.substring(fullEnd);
      content = before + newVisionPrompt + '\n        );' + after;
      changed++;
      console.log('✅ Vision prompt replaced (simpler method)');
    }
  }
}

// Replace fallback callAI
const fallbackRegex = /raw = await callAI\(\s*`Crie conte[\s\S]*?"APENAS JSON\."\s*\);/;
if (fallbackRegex.test(content)) {
  content = content.replace(fallbackRegex, newFallback + '\n      );');
  changed++;
  console.log('✅ Fallback prompt replaced');
} else {
  console.log('❌ Fallback pattern not found');
}

fs.writeFileSync(path, content, 'utf8');
console.log(`\nDone! ${changed} replacements applied.`);
