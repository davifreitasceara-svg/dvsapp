const fs = require('fs');
const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// ─── 1. Fix startCreate: no topic required, photo-first, vision-only prompt ───
const oldStart = `  const startCreate = async () => {
    if (!file && !topic.trim()) { toast("Envie uma mídia ou escreva um tema!", "warn"); return; }`;
const newStart = `  const startCreate = async () => {
    if (!file) { toast("Envie uma foto ou vídeo primeiro! 📸", "warn"); return; }`;

if (content.includes(oldStart)) {
  content = content.replace(oldStart, newStart);
  console.log('✅ startCreate guard fixed');
} else {
  console.log('❌ startCreate guard not found');
}

// ─── 2. Fix button disabled condition ───
content = content.replace(
  'disabled={!file && !topic.trim()}',
  'disabled={!file}'
);
console.log('✅ Button disabled condition fixed');

// ─── 3. Remove the "Tema / contexto" block ───
// Find and remove the tema block
const temaBlock = `      {/* tema */}
      <div className="fu d2">
        <div className="sec-label">Tema / contexto</div>
        <input className="inp" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Ex: produto fitness, motivação, lançamento, humor…" />
      </div>`;

if (content.includes(temaBlock.replace(/\r\n/g, '\n'))) {
  content = content.replace(temaBlock.replace(/\r\n/g, '\n'), '');
  console.log('✅ Tema block removed (LF)');
} else if (content.includes(temaBlock.replace(/\n/g, '\r\n'))) {
  content = content.replace(temaBlock.replace(/\n/g, '\r\n'), '');
  console.log('✅ Tema block removed (CRLF)');
} else {
  // Try to find it with regex
  const temaRegex = /\s*\{\/\* tema \*\/\}\s*<div className="fu d2">[\s\S]*?<\/div>\s*<\/div>/;
  if (temaRegex.test(content)) {
    content = content.replace(temaRegex, '');
    console.log('✅ Tema block removed (regex)');
  } else {
    console.log('❌ Tema block not found, trying line-based...');
    const lines = content.split('\n');
    const startLine = lines.findIndex(l => l.includes('{/* tema */}'));
    if (startLine !== -1) {
      // Find the closing </div> after the input
      let depth = 0, endLine = startLine;
      for (let i = startLine; i < Math.min(startLine + 15, lines.length); i++) {
        if (lines[i].includes('<div')) depth++;
        if (lines[i].includes('</div>')) {
          depth--;
          if (depth <= 0) { endLine = i; break; }
        }
      }
      lines.splice(startLine, endLine - startLine + 1);
      content = lines.join('\n');
      console.log(`✅ Tema block removed lines ${startLine}-${endLine} (line-based)`);
    }
  }
}

// ─── 4. Update hero subtitle ───
content = content.replace(
  'Envie uma mídia — a IA cria legenda, score viral, músicas e muito mais',
  'Envie uma foto ou vídeo — a IA analisa, cria a legenda e escolhe a música ideal 🤖'
);
console.log('✅ Hero subtitle updated');

// ─── 5. Update upload zone text ───
content = content.replace(
  'Toque para selecionar',
  'Envie sua foto ou vídeo'
);
content = content.replace(
  '⚡ Processamento automático por IA',
  '🤖 IA analisa o conteúdo visual automaticamente'
);
console.log('✅ Upload zone text updated');

// ─── 6. Update the vision prompt to be truly autonomous (no topic dependency) ───
// Find and update the vision prompt in callAIVision
const oldVisionCall = `Tema adicional do usuário: "\${topic || 'nenhum'}"
Estilo desejado: "\${estilo}"

IMPORTANTE: A legenda e músicas devem ser 100% baseadas no que você VÊ nesta imagem.`;
const newVisionCall = `Estilo desejado: \${estilo}

IMPORTANTE: A legenda e músicas devem ser 100% baseadas EXCLUSIVAMENTE no que você VÊ nesta imagem. NÃO use temas genéricos.`;

if (content.includes(oldVisionCall)) {
  content = content.replace(oldVisionCall, newVisionCall);
  console.log('✅ Vision prompt updated to be fully autonomous');
} else {
  console.log('❌ Vision prompt section not found exactly, checking...');
}

// ─── 7. Update the fallback prompt (no image case) ───
const oldFallback = `Tipo de mídia: \${isImg ? "foto" : "vídeo"}
Tema/contexto do criador: "\${topic || "conteúdo geral"}"`;
const newFallback = `Tipo de mídia: \${isImg ? "foto" : "vídeo"}`;

content = content.replace(oldFallback, newFallback);
console.log('✅ Fallback prompt updated');

fs.writeFileSync(path, content, 'utf8');
console.log('\n✅ All changes applied successfully!');
