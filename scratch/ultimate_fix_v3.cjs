const fs = require('fs');
const path = 'c:/Users/PC GAMER/Desktop/vai que ne/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. FIX THE AI MODEL AND VERSION (Use v1beta for gemini-1.5-flash-latest)
content = content.replace(/\/v1\/models\/gemini-1\.5-flash/g, "/v1beta/models/gemini-1.5-flash-latest");
content = content.replace(/\/v1beta\/models\/gemini-2\.5-flash/g, "/v1beta/models/gemini-1.5-flash-latest");

// 2. IMPROVE VISION PROMPTS (Brazilian Style + Visual Description)
const newVisionPrompt = `Sua tarefa é analisar esta mídia e criar conteúdo VIRAL para Instagram/TikTok Brasil.
DESCREVA o que você vê (objetos, pessoas, cores, clima) e baseie a legenda NISSO.
O tema do usuário é: "\${topic}" e o estilo é: "\${estilo}".
A legenda deve ser curta, impactante e usar hashtags de alta performance.
Formato: Legenda! #viral #brasil (ou similar, mas sempre curto).
Indique 3 músicas REAIS (nome e artista de verdade) que combinem com a vibe.
Retorne APENAS JSON (sem markdown):
\${jsonTpl}`;

content = content.replace(/Analise DETALHADAMENTE esta imagem[\s\S]*?jsonTpl}\`/, newVisionPrompt + '`');

// 3. REMOVE THE MUSIC STICKER FROM THE PREVIEW (Line 1029-1051 approx)
const stickerBlock = `{/* Música Overlay Editável */}\n                {result.musicas?.[0] && ([\\s\\S]*?)}\\s*\\)}/`;
// Wait, I'll use a more precise replacement for the sticker block to avoid mistakes.
const stickerTarget = `{/* Música Overlay Editável */}\n                {result.musicas?.[0] && (
                  <div style={{
                    position: "absolute",
                    bottom: "20%",
                    left: "10%",
                    background: "rgba(255,255,255,0.92)",
                    padding: "8px 12px",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                    maxWidth: "80%",
                    zIndex: 10
                  }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(45deg, #f09433, #bc1888)', display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 }}>🎵</div>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: "#000", whiteSpace: "nowrap" }}>{result.musicas[0].titulo}</div>
                      <div style={{ fontSize: 9, color: "#666" }}>{result.musicas[0].artista}</div>
                    </div>
                  </div>
                )}`;

content = content.replace(stickerTarget, "");

// 4. FIX STABILITY (ADD OPTIONAL CHAINING TO ALL result ACCESSES IN Criador)
content = content.replace(/result\.score/g, "result?.score");
content = content.replace(/result\.musicas/g, "result?.musicas");
content = content.replace(/result\.scoreMotivo/g, "result?.scoreMotivo");
content = content.replace(/result\.melhorias/g, "result?.melhorias");
content = content.replace(/result\.horario/g, "result?.horario");

// 5. UPDATE TURBINAR PROMPT (Brazilian Style)
const turbinarPrompt = 'const prompt = `Melhore esta legenda para torná-la viral no Instagram/TikTok Brasil. Seja curto, use ganchos poderosos e hashtags como #viral #brasil. Legenda: ${caption}`;';
content = content.replace(/const prompt = \`Melhore esta legenda para torn\u00e2-la viral no Instagram\/TikTok\.[\s\S]*?\${caption}\`;/, turbinarPrompt);

fs.writeFileSync(path, content, 'utf8');
console.log("CRITICAL FIXES DEPLOYED: AI Vision updated, Sticker removed, and Stability fixes applied.");
